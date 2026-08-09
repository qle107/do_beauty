import { getPool, ensureSchema, dbConfigured } from '@/lib/db'
import { readJson, writeJson } from '@/lib/json-store'
import { sheetsConfigured, SheetTable } from '@/lib/sheets'
import type { RowDataPacket, ResultSetHeader } from 'mysql2'

const JSON_FILE = 'blocklist.json'

// Number of no-shows before a phone is automatically blocked
const AUTO_BLOCK_THRESHOLD = 2

// ─── Types ────────────────────────────────────────────────────────────────

export interface BlocklistEntry {
  phone: string          // normalised (digits + leading +)
  clientName: string     // last name seen, for display
  noShowCount: number
  blocked: boolean
  blockedAt?: string     // ISO string, set when auto-blocked
  reason?: string        // human-readable reason
  updatedAt: string      // ISO string
  ips: string[]          // every IP seen for this phone at a ghost event
}

// ─── Phone normalisation ──────────────────────────────────────────────────

/** Strip spaces, dashes, parentheses; keep leading + */
export function normalisePhone(phone: string): string {
  return phone.replace(/[\s\-().]/g, '')
}

// getClientIp() falls back to this sentinel when no IP header is present -
// never treat it as a real address to match/store, or unrelated clients
// sharing "unknown" would be flagged as the same person.
const UNKNOWN_IP = 'unknown'

function isRealIp(ip: string | undefined): ip is string {
  return !!ip && ip !== UNKNOWN_IP
}

// Google Sheets backend (Blocklist tab). Active when SHEETS_SPREADSHEET_ID is set.
const sheet = new SheetTable<BlocklistEntry>('Blocklist', [
  { header: 'Téléphone', key: 'phone' },
  { header: 'Nom', key: 'clientName' },
  { header: 'Absences', key: 'noShowCount', kind: 'number' },
  { header: 'Bloqué', key: 'blocked', kind: 'boolean' },
  { header: 'Bloqué le', key: 'blockedAt' },
  { header: 'Raison', key: 'reason' },
  { header: 'Modifié le', key: 'updatedAt' },
  { header: 'IPs', key: 'ips', kind: 'json' },
])

// ─── Row mapping / persistence ─────────────────────────────────────────────

interface BlockRow extends RowDataPacket {
  phone: string
  client_name: string
  no_show_count: number
  blocked: number
  blocked_at: string | null
  reason: string | null
  ips: string | null
  updated_at: string
}

function rowToEntry(r: BlockRow): BlocklistEntry {
  return {
    phone:       r.phone,
    clientName:  r.client_name,
    noShowCount: r.no_show_count,
    blocked:     !!r.blocked,
    blockedAt:   r.blocked_at ?? undefined,
    reason:      r.reason ?? undefined,
    updatedAt:   r.updated_at,
    ips:         r.ips ? (JSON.parse(r.ips) as string[]) : [],
  }
}

// The table is tiny (blocked / ghosting clients), so loading every row to reuse
// the exact phone-OR-ip matching logic in JS is cheaper than clever SQL.
async function readEntries(): Promise<BlocklistEntry[]> {
  if (sheetsConfigured()) {
    try { return (await sheet.readAll()).map((e) => ({ ...e, ips: e.ips ?? [] })) }
    catch (err) { console.error('[blocklist] Sheets read failed, using next store:', (err as Error)?.message) }
  }
  if (dbConfigured()) {
    try {
      await ensureSchema()
      const [rows] = await getPool().query<BlockRow[]>('SELECT * FROM blocklist')
      return rows.map(rowToEntry)
    } catch (err) {
      console.error('[blocklist] DB read failed, using JSON fallback:',
        (err as NodeJS.ErrnoException)?.code ?? (err as Error)?.message)
    }
  }
  // Older entries recorded before IP tracking was added lack `ips`.
  return readJson<BlocklistEntry[]>(JSON_FILE, []).map((e) => ({ ...e, ips: e.ips ?? [] }))
}

async function upsert(entry: BlocklistEntry): Promise<void> {
  if (sheetsConfigured()) {
    try {
      const all = await sheet.readAll()
      const norm = normalisePhone(entry.phone)
      const idx = all.findIndex((e) => normalisePhone(e.phone) === norm)
      if (idx === -1) all.push(entry); else all[idx] = entry
      await sheet.writeAll(all); return
    } catch (err) { console.error('[blocklist] Sheets write failed, using next store:', (err as Error)?.message) }
  }
  if (dbConfigured()) {
    try {
      await getPool().query(
        `INSERT INTO blocklist
           (phone, client_name, no_show_count, blocked, blocked_at, reason, ips, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           client_name   = VALUES(client_name),
           no_show_count = VALUES(no_show_count),
           blocked       = VALUES(blocked),
           blocked_at    = VALUES(blocked_at),
           reason        = VALUES(reason),
           ips           = VALUES(ips),
           updated_at    = VALUES(updated_at)`,
        [entry.phone, entry.clientName, entry.noShowCount, entry.blocked ? 1 : 0,
         entry.blockedAt ?? null, entry.reason ?? null, JSON.stringify(entry.ips), entry.updatedAt]
      )
      return
    } catch (err) {
      console.error('[blocklist] DB write failed, using JSON fallback:',
        (err as NodeJS.ErrnoException)?.code ?? (err as Error)?.message)
    }
  }
  const all = readJson<BlocklistEntry[]>(JSON_FILE, [])
  const norm = normalisePhone(entry.phone)
  const idx = all.findIndex((e) => normalisePhone(e.phone) === norm)
  if (idx === -1) all.push(entry)
  else all[idx] = entry
  await writeJson(JSON_FILE, all)
}

/** Find an entry matching this phone, or (if provided) this IP. */
function findEntry(entries: BlocklistEntry[], phone: string, ip?: string): BlocklistEntry | undefined {
  const norm = normalisePhone(phone)
  return entries.find(
    (e) => normalisePhone(e.phone) === norm || (isRealIp(ip) && e.ips.includes(ip))
  )
}

// ─── Public API ───────────────────────────────────────────────────────────

/**
 * Returns true if this phone number - or, if provided, this IP address -
 * is blocked (after ≥2 no-shows). Checking the IP too catches a ghoster
 * rebooking under a different phone number from the same device.
 */
export async function isBlocked(phone: string, ip?: string): Promise<boolean> {
  const entry = findEntry(await readEntries(), phone, ip)
  return entry?.blocked === true
}

/**
 * Record a no-show for the given phone (and, if known, IP). Matches an
 * existing entry by phone OR by IP so phone-hopping from the same device
 * still accumulates on one record. Auto-blocks after AUTO_BLOCK_THRESHOLD.
 */
export async function recordNoShow(phone: string, clientName: string, ip?: string): Promise<BlocklistEntry> {
  const norm = normalisePhone(phone)
  const now = new Date().toISOString()
  const entries = await readEntries()

  let entry = findEntry(entries, phone, ip)
  if (!entry) {
    entry = {
      phone: norm,
      clientName,
      noShowCount: 1,
      blocked: false,
      updatedAt: now,
      ips: isRealIp(ip) ? [ip] : [],
    }
  } else {
    entry.noShowCount += 1
    entry.clientName = clientName  // keep most recent name
    entry.updatedAt = now
    if (isRealIp(ip) && !entry.ips.includes(ip)) entry.ips.push(ip)
  }

  // Auto-block after threshold
  if (entry.noShowCount >= AUTO_BLOCK_THRESHOLD && !entry.blocked) {
    entry.blocked = true
    entry.blockedAt = now
    entry.reason = `${entry.noShowCount} absences non justifiées`
  }

  await upsert(entry)
  return entry
}

/**
 * Manually block a phone (admin action).
 */
export async function blockPhone(phone: string, clientName: string, reason?: string, ip?: string): Promise<BlocklistEntry> {
  const norm = normalisePhone(phone)
  const now = new Date().toISOString()
  const entries = await readEntries()

  let entry = findEntry(entries, phone, ip)
  if (!entry) {
    entry = {
      phone: norm,
      clientName,
      noShowCount: 0,
      blocked: true,
      blockedAt: now,
      reason: reason ?? 'Bloqué manuellement',
      updatedAt: now,
      ips: isRealIp(ip) ? [ip] : [],
    }
  } else {
    entry.blocked = true
    entry.blockedAt = now
    entry.reason = reason ?? entry.reason ?? 'Bloqué manuellement'
    entry.updatedAt = now
    if (isRealIp(ip) && !entry.ips.includes(ip)) entry.ips.push(ip)
  }

  await upsert(entry)
  return entry
}

/**
 * Unblock a phone (admin action). Resets the no-show counter and known IPs too.
 */
export async function unblockPhone(phone: string): Promise<boolean> {
  const norm = normalisePhone(phone)
  const entries = await readEntries()
  const entry = entries.find((e) => normalisePhone(e.phone) === norm)
  if (!entry) return false

  entry.blocked = false
  entry.noShowCount = 0
  entry.blockedAt = undefined
  entry.reason = undefined
  entry.ips = []
  entry.updatedAt = new Date().toISOString()

  await upsert(entry)
  return true
}

/**
 * Edit an entry's display name and/or reason (admin action). Passing an empty
 * reason clears it. Returns false when the phone isn't found.
 */
export async function updateEntry(
  phone: string, fields: { clientName?: string; reason?: string }
): Promise<boolean> {
  const norm = normalisePhone(phone)
  const entries = await readEntries()
  const entry = entries.find((e) => normalisePhone(e.phone) === norm)
  if (!entry) return false

  if (fields.clientName !== undefined) entry.clientName = fields.clientName
  if (fields.reason !== undefined) entry.reason = fields.reason || undefined
  entry.updatedAt = new Date().toISOString()

  await upsert(entry)
  return true
}

/**
 * Permanently remove an entry (admin action) - unlike unblockPhone, which keeps
 * the record. Returns false when the phone isn't found.
 */
export async function deleteEntry(phone: string): Promise<boolean> {
  const norm = normalisePhone(phone)
  if (sheetsConfigured()) {
    try {
      const all = await sheet.readAll()
      const filtered = all.filter((e) => normalisePhone(e.phone) !== norm)
      if (filtered.length === all.length) return false
      await sheet.writeAll(filtered); return true
    } catch (err) { console.error('[blocklist] Sheets delete failed, using next store:', (err as Error)?.message) }
  }
  if (dbConfigured()) {
    try {
      await ensureSchema()
      const [res] = await getPool().query<ResultSetHeader>('DELETE FROM blocklist WHERE phone = ?', [norm])
      return res.affectedRows > 0
    } catch (err) {
      console.error('[blocklist] DB delete failed, using JSON fallback:',
        (err as NodeJS.ErrnoException)?.code ?? (err as Error)?.message)
    }
  }
  const all = readJson<BlocklistEntry[]>(JSON_FILE, [])
  const filtered = all.filter((e) => normalisePhone(e.phone) !== norm)
  if (filtered.length === all.length) return false
  await writeJson(JSON_FILE, filtered)
  return true
}

/**
 * Return all entries (for admin display).
 */
export async function getAllEntries(): Promise<BlocklistEntry[]> {
  const entries = await readEntries()
  return entries.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}
