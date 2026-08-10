import { getPool, ensureSchema, dbConfigured } from '@/lib/db'
import { readJson, writeJson } from '@/lib/json-store'
import { sheetsConfigured, SheetTable } from '@/lib/sheets'
import { normalisePhone } from './blocklist'
import type { RowDataPacket, ResultSetHeader } from 'mysql2'

const JSON_FILE = 'devices.json'

// ─── Device tracking store ─────────────────────────────────────────────────
// Keyed on the browser's persistent device id. Its job is to catch a no-show
// who rebooks under a NEW phone: no-shows accumulate per-device, so switching
// numbers doesn't reset the counter. Two no-shows from one device auto-block it.

const AUTO_BLOCK_THRESHOLD = 2

// ─── Types ────────────────────────────────────────────────────────────────

export interface DeviceEntry {
  deviceId: string
  phones: string[]        // every normalised phone seen booking from this device
  fingerprints: string[]  // every browser fingerprint seen from this device
  clientName: string      // last name seen, for display
  bookingCount: number
  noShowCount: number
  blocked: boolean
  blockedAt?: string      // ISO string, set when auto-blocked
  reason?: string
  firstSeen: string       // ISO string
  updatedAt: string       // ISO string
}

function isRealFp(fp: string | undefined): fp is string {
  return !!fp
}

/** Match by deviceId OR by a shared fingerprint (the fallback identifier). */
function findEntry(entries: DeviceEntry[], deviceId: string, fingerprint?: string): DeviceEntry | undefined {
  return entries.find(
    (e) => (!!deviceId && e.deviceId === deviceId) ||
           (isRealFp(fingerprint) && e.fingerprints.includes(fingerprint))
  )
}

// Primary key for a brand-new record: the deviceId when present, else the
// fingerprint (so a visitor with localStorage disabled is still tracked), else
// null when neither is available (booking proceeds untracked, as before).
function effectiveKey(deviceId: string, fingerprint?: string): string | null {
  if (deviceId) return deviceId
  if (isRealFp(fingerprint)) return `fp:${fingerprint}`
  return null
}

// Google Sheets backend (Appareils tab). Active when SHEETS_SPREADSHEET_ID is set.
const sheet = new SheetTable<DeviceEntry>('Appareils', [
  { header: 'Device ID', key: 'deviceId' },
  { header: 'Téléphones', key: 'phones', kind: 'json' },
  { header: 'Fingerprints', key: 'fingerprints', kind: 'json' },
  { header: 'Nom', key: 'clientName' },
  { header: 'Réservations', key: 'bookingCount', kind: 'number' },
  { header: 'Absences', key: 'noShowCount', kind: 'number' },
  { header: 'Bloqué', key: 'blocked', kind: 'boolean' },
  { header: 'Bloqué le', key: 'blockedAt' },
  { header: 'Raison', key: 'reason' },
  { header: 'Première visite', key: 'firstSeen' },
  { header: 'Modifié le', key: 'updatedAt' },
])

// ─── Row mapping / persistence ─────────────────────────────────────────────

interface DeviceRow extends RowDataPacket {
  device_id: string
  phones: string | null
  fingerprints: string | null
  client_name: string
  booking_count: number
  no_show_count: number
  blocked: number
  blocked_at: string | null
  reason: string | null
  first_seen: string
  updated_at: string
}

function rowToEntry(r: DeviceRow): DeviceEntry {
  return {
    deviceId:     r.device_id,
    phones:       r.phones ? (JSON.parse(r.phones) as string[]) : [],
    fingerprints: r.fingerprints ? (JSON.parse(r.fingerprints) as string[]) : [],
    clientName:   r.client_name,
    bookingCount: r.booking_count,
    noShowCount:  r.no_show_count,
    blocked:      !!r.blocked,
    blockedAt:    r.blocked_at ?? undefined,
    reason:       r.reason ?? undefined,
    firstSeen:    r.first_seen,
    updatedAt:    r.updated_at,
  }
}

async function readAll(): Promise<DeviceEntry[]> {
  if (sheetsConfigured()) {
    try { return (await sheet.readAll()).map((e) => ({ ...e, phones: e.phones ?? [], fingerprints: e.fingerprints ?? [] })) }
    catch (err) { console.error('[devices] Sheets read failed, using next store:', (err as Error)?.message) }
  }
  if (dbConfigured()) {
    try {
      await ensureSchema()
      const [rows] = await getPool().query<DeviceRow[]>('SELECT * FROM devices')
      return rows.map(rowToEntry)
    } catch (err) {
      console.error('[devices] DB read failed, using JSON fallback:',
        (err as NodeJS.ErrnoException)?.code ?? (err as Error)?.message)
    }
  }
  // Older entries recorded before fingerprint tracking lack `fingerprints`.
  return readJson<DeviceEntry[]>(JSON_FILE, []).map((e) => ({ ...e, fingerprints: e.fingerprints ?? [] }))
}

async function findById(deviceId: string): Promise<DeviceEntry | null> {
  return (await readAll()).find((d) => d.deviceId === deviceId) ?? null
}

async function upsert(entry: DeviceEntry): Promise<void> {
  if (sheetsConfigured()) {
    try {
      const all = await sheet.readAll()
      const idx = all.findIndex((d) => d.deviceId === entry.deviceId)
      if (idx === -1) all.push(entry); else all[idx] = entry
      await sheet.writeAll(all); return
    } catch (err) { console.error('[devices] Sheets write failed, using next store:', (err as Error)?.message) }
  }
  if (dbConfigured()) {
    try {
      await getPool().query(
        `INSERT INTO devices
           (device_id, phones, fingerprints, client_name, booking_count, no_show_count, blocked, blocked_at, reason, first_seen, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           phones        = VALUES(phones),
           fingerprints  = VALUES(fingerprints),
           client_name   = VALUES(client_name),
           booking_count = VALUES(booking_count),
           no_show_count = VALUES(no_show_count),
           blocked       = VALUES(blocked),
           blocked_at    = VALUES(blocked_at),
           reason        = VALUES(reason),
           updated_at    = VALUES(updated_at)`,
        [entry.deviceId, JSON.stringify(entry.phones), JSON.stringify(entry.fingerprints),
         entry.clientName, entry.bookingCount, entry.noShowCount, entry.blocked ? 1 : 0,
         entry.blockedAt ?? null, entry.reason ?? null, entry.firstSeen, entry.updatedAt]
      )
      return
    } catch (err) {
      console.error('[devices] DB write failed, using JSON fallback:',
        (err as NodeJS.ErrnoException)?.code ?? (err as Error)?.message)
    }
  }
  const all = readJson<DeviceEntry[]>(JSON_FILE, [])
  const idx = all.findIndex((d) => d.deviceId === entry.deviceId)
  if (idx === -1) all.push(entry)
  else all[idx] = entry
  await writeJson(JSON_FILE, all)
}

// ─── Public API ───────────────────────────────────────────────────────────

/**
 * Returns true if this device id is blocked. Always false for an empty id
 * (visitor with localStorage disabled) so those bookings still go through.
 *
 * Blocking keys ONLY off the strong, unguessable deviceId. The fingerprint is a
 * detect-only signal (low-entropy, shared across identical devices, client-
 * asserted): it is recorded and surfaced to the admin, but never refuses a
 * booking on its own, so a shared/guessed fingerprint can't block a stranger.
 */
export async function isDeviceBlocked(deviceId: string): Promise<boolean> {
  if (!deviceId) return false
  const entry = findEntry(await readAll(), deviceId)
  return entry?.blocked === true
}

/**
 * Record a successful booking from a device: upsert the entry, remembering the
 * phone and fingerprint used. Matches an existing record by deviceId OR
 * fingerprint so a rebook after clearing the deviceId lands on the same record.
 * Returns the entry (with prior counts), or null when neither id nor fingerprint
 * is available.
 */
export async function recordDeviceBooking(
  deviceId: string, phone: string, clientName: string, fingerprint?: string
): Promise<DeviceEntry | null> {
  const key = effectiveKey(deviceId, fingerprint)
  if (!key) return null
  const now = new Date().toISOString()
  const normPhone = normalisePhone(phone)

  const entries = await readAll()
  const entry: DeviceEntry = findEntry(entries, deviceId, fingerprint) ?? {
    deviceId: key,
    phones: [],
    fingerprints: [],
    clientName,
    bookingCount: 0,
    noShowCount: 0,
    blocked: false,
    firstSeen: now,
    updatedAt: now,
  }

  if (!entry.phones.includes(normPhone)) entry.phones.push(normPhone)
  if (isRealFp(fingerprint) && !entry.fingerprints.includes(fingerprint)) entry.fingerprints.push(fingerprint)
  entry.clientName = clientName
  entry.bookingCount += 1
  entry.updatedAt = now

  await upsert(entry)
  return entry
}

/**
 * Record a no-show for a device. Matches by deviceId OR fingerprint, then
 * auto-blocks once the count reaches the threshold. Returns the updated entry,
 * or null when neither id nor fingerprint is available.
 */
export async function recordDeviceNoShow(
  deviceId: string, clientName: string, fingerprint?: string
): Promise<DeviceEntry | null> {
  const key = effectiveKey(deviceId, fingerprint)
  if (!key) return null
  const now = new Date().toISOString()

  const entries = await readAll()
  const entry: DeviceEntry = findEntry(entries, deviceId, fingerprint) ?? {
    deviceId: key,
    phones: [],
    fingerprints: [],
    clientName,
    bookingCount: 0,
    noShowCount: 0,
    blocked: false,
    firstSeen: now,
    updatedAt: now,
  }

  entry.noShowCount += 1
  if (isRealFp(fingerprint) && !entry.fingerprints.includes(fingerprint)) entry.fingerprints.push(fingerprint)
  entry.clientName = clientName
  entry.updatedAt = now

  // Only a record anchored by a real deviceId auto-blocks. A fingerprint-only
  // record (fp: key, no deviceId) accrues the count so the admin sees the
  // history, but never auto-blocks - matching isDeviceBlocked, which reads by
  // deviceId only.
  const anchoredByDeviceId = !entry.deviceId.startsWith('fp:')
  if (anchoredByDeviceId && entry.noShowCount >= AUTO_BLOCK_THRESHOLD && !entry.blocked) {
    entry.blocked = true
    entry.blockedAt = now
    entry.reason = `${entry.noShowCount} absences non justifiées (appareil)`
  }

  await upsert(entry)
  return entry
}

/**
 * Unblock a device (admin action). Resets its no-show counter too.
 * Returns false when the device id isn't found.
 */
export async function unblockDevice(deviceId: string): Promise<boolean> {
  const entry = await findById(deviceId)
  if (!entry) return false

  entry.blocked = false
  entry.noShowCount = 0
  entry.blockedAt = undefined
  entry.reason = undefined
  entry.updatedAt = new Date().toISOString()

  await upsert(entry)
  return true
}

/**
 * Manually block a device (admin action) - promoting a surveilled device before
 * it hits the auto-block threshold, or blocking a device by id (e.g. copied from
 * a booking alert). Creates the record if the device isn't known yet.
 */
export async function blockDevice(deviceId: string, reason?: string): Promise<boolean> {
  if (!deviceId) return false
  const now = new Date().toISOString()
  const entries = await readAll()
  const entry: DeviceEntry = entries.find((d) => d.deviceId === deviceId) ?? {
    deviceId,
    phones: [],
    fingerprints: [],
    clientName: 'Bloqué manuellement',
    bookingCount: 0,
    noShowCount: 0,
    blocked: false,
    firstSeen: now,
    updatedAt: now,
  }

  entry.blocked = true
  entry.blockedAt = now
  entry.reason = reason ?? entry.reason ?? 'Bloqué manuellement'
  entry.updatedAt = now

  await upsert(entry)
  return true
}

/**
 * Edit a device's display name and/or reason (admin action). Passing an empty
 * reason clears it. Returns false when the device isn't found.
 */
export async function updateDevice(
  deviceId: string, fields: { clientName?: string; reason?: string }
): Promise<boolean> {
  const entry = await findById(deviceId)
  if (!entry) return false

  if (fields.clientName !== undefined) entry.clientName = fields.clientName
  if (fields.reason !== undefined) entry.reason = fields.reason || undefined
  entry.updatedAt = new Date().toISOString()

  await upsert(entry)
  return true
}

/**
 * Permanently remove a device record (admin action) - unlike unblockDevice,
 * which keeps the record. Returns false when the device isn't found.
 */
export async function deleteDevice(deviceId: string): Promise<boolean> {
  if (sheetsConfigured()) {
    try {
      const all = await sheet.readAll()
      const filtered = all.filter((d) => d.deviceId !== deviceId)
      if (filtered.length === all.length) return false
      await sheet.writeAll(filtered); return true
    } catch (err) { console.error('[devices] Sheets delete failed, using next store:', (err as Error)?.message) }
  }
  if (dbConfigured()) {
    try {
      await ensureSchema()
      const [res] = await getPool().query<ResultSetHeader>('DELETE FROM devices WHERE device_id = ?', [deviceId])
      return res.affectedRows > 0
    } catch (err) {
      console.error('[devices] DB delete failed, using JSON fallback:',
        (err as NodeJS.ErrnoException)?.code ?? (err as Error)?.message)
    }
  }
  const all = readJson<DeviceEntry[]>(JSON_FILE, [])
  const filtered = all.filter((d) => d.deviceId !== deviceId)
  if (filtered.length === all.length) return false
  await writeJson(JSON_FILE, filtered)
  return true
}

/**
 * Return all device entries (for admin display), most recently updated first.
 */
export async function getAllDevices(): Promise<DeviceEntry[]> {
  const entries = await readAll()
  return entries.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}
