import zlib from 'node:zlib'
import { ARTISTS } from '@/lib/staff'
import { busyIntervalsFromFree, type Interval } from './busy'

/**
 * Planity PUBLIC availability - the officially-served, tokenless data source.
 * --------------------------------------------------------------------------
 * Planity's consumer booking site (planity.com) reads each salon's availability
 * from a public Firebase Realtime Database, anonymously. We read the exact same
 * data via the RTDB REST API - no auth, no token, no scraping of the pro backend.
 *
 *   https://<db-host>/<businessId>.json                (shallow: the record keys)
 *   https://<db-host>/<businessId>/<key>.json          (one gzip-compressed record)
 *
 * Each record is one prestation's availability, gzip-compressed and stored as a
 * string: { "YYYY-MM-DD": { "HH:MM": { "<practitionerCalendarId>": [...] } } }.
 * Merging every record gives, per date + 15-min slot, the set of practitioners
 * FREE at that instant. That set (restricted to our staff) is the live capacity
 * signal the booking engine consumes. Updated in real time whenever a pro edits
 * their agenda (Planity fires /cacheBusiness).
 */

const DB_HOST =
  process.env.PLANITY_AVAIL_DB_HOST ||
  'planity-production-availabilities-4.europe-west1.firebasedatabase.app'

// Track every pickable agenda (practitioners + cabines) so the picker knows which
// artists are free; the capacity math still counts practitioners only (see capacity.ts).
const ARTIST_IDS = new Set(ARTISTS.map((a) => a.planityCalendarId))
const TTL_MS = 180_000 // 3 min - one fetch (~0.3 MB) covers all ~30 published days

export interface PlanityAvailability {
  ok: boolean // did the last fetch succeed?
  freeByDate: Map<string, Map<string, Set<string>>> // date -> "HH:MM" -> Set(calendarId free)
  knownDates: Set<string> // every date Planity published (even fully-booked/closed)
  maxDate: string // furthest published date ("" if none)
}

let cache: { data: PlanityAvailability; expires: number } | null = null

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, { signal: AbortSignal.timeout(6000) })
  if (!res.ok) throw new Error(`planity-public ${res.status}`)
  return res.json()
}

async function fetchAll(businessId: string): Promise<PlanityAvailability> {
  const base = `https://${DB_HOST}/${encodeURIComponent(businessId)}`
  const keysObj = (await fetchJson(`${base}.json?shallow=true`)) as Record<string, boolean> | null
  const keys = keysObj ? Object.keys(keysObj) : []

  const freeByDate = new Map<string, Map<string, Set<string>>>()
  const knownDates = new Set<string>()

  const addRecord = (data: Record<string, Record<string, Record<string, unknown>>>) => {
    for (const [date, slots] of Object.entries(data)) {
      knownDates.add(date)
      for (const [time, byStaff] of Object.entries(slots)) {
        for (const cal of Object.keys(byStaff)) {
          if (!ARTIST_IDS.has(cal)) continue
          let d = freeByDate.get(date)
          if (!d) { d = new Map(); freeByDate.set(date, d) }
          let s = d.get(time)
          if (!s) { s = new Set(); d.set(time, s) }
          s.add(cal)
        }
      }
    }
  }

  // Fetch records in small concurrent batches (gentle on the endpoint).
  for (let i = 0; i < keys.length; i += 12) {
    const batch = keys.slice(i, i + 12)
    await Promise.all(
      batch.map(async (key) => {
        try {
          const str = (await fetchJson(`${base}/${encodeURIComponent(key)}.json`)) as string
          if (typeof str !== 'string') return
          const json = zlib.gunzipSync(Buffer.from(str, 'latin1')).toString('utf8')
          addRecord(JSON.parse(json))
        } catch {
          /* skip a bad/oversized record; others still count */
        }
      })
    )
  }

  const dates = [...knownDates].sort()
  return { ok: true, freeByDate, knownDates, maxDate: dates[dates.length - 1] ?? '' }
}

export async function getPlanityAvailability(): Promise<PlanityAvailability> {
  if (cache && cache.expires > Date.now()) return cache.data
  const businessId = process.env.PLANITY_BUSINESS_ID
  const empty: PlanityAvailability = { ok: false, freeByDate: new Map(), knownDates: new Set(), maxDate: '' }
  if (!businessId) return empty
  try {
    const data = await fetchAll(businessId)
    cache = { data, expires: Date.now() + TTL_MS }
    return data
  } catch (e) {
    console.error('[planity-public] fetch failed:', e)
    return cache?.data ?? empty // serve stale on transient error; else fail-open sentinel
  }
}

/**
 * Free practitioners per 15-min slot for a date, or `null` when we have no
 * authoritative Planity data for that date (fetch failed, or the date is beyond
 * Planity's published horizon). `null` tells the caller to FAIL OPEN - never
 * hide real availability because the external read is unavailable.
 * A returned (possibly empty) map means Planity IS authoritative for that day
 * (empty ⇒ closed / fully booked).
 */
export async function getPlanityDayFree(date: string): Promise<Map<string, Set<string>> | null> {
  const a = await getPlanityAvailability()
  if (!a.ok) return null // no data at all → fail open
  if (a.knownDates.has(date)) return a.freeByDate.get(date) ?? new Map()
  if (!a.maxDate || date > a.maxDate) return null // beyond published horizon → fail open
  return new Map() // inside the published range but absent ⇒ closed
}

/**
 * Per-EMPLOYEE busy intervals for a date, keyed by our artist id (for the admin
 * calendar). `null` ⇒ no authoritative Planity data for the day (fetch failed or
 * beyond the published horizon) → caller fails open (shows an "indisponible" note,
 * no blocks). A non-null map with an empty array for an employee ⇒ free all day.
 */
export async function getPlanityBusyByEmployee(
  date: string,
  openMin: number,
  closeMin: number,
): Promise<Record<string, Interval[]> | null> {
  const free = await getPlanityDayFree(date)
  if (free === null) return null
  const byCal = busyIntervalsFromFree(free, ARTISTS.map((a) => a.planityCalendarId), openMin, closeMin)
  const out: Record<string, Interval[]> = {}
  for (const a of ARTISTS) out[a.id] = byCal[a.planityCalendarId] ?? []
  return out
}
