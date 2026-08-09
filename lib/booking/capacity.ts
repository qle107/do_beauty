import type { Artist } from '@/lib/staff'
import { GENERAL_POOL_KEY } from '@/lib/staff'

/**
 * Capacity math for the multi-employee model, sourced from Planity's live public
 * availability (see lib/planity/public-availability). Unit: Paris minutes-of-day.
 *
 * The caller passes the `pool` of artists that can perform the cart (see
 * `artistsForCategories` in lib/staff) — practitioners for nail services, the
 * relevant cabine for cils/esthetics. An artist is free for a service window [s,e)
 * only if Planity lists it free at every 15-min instant in that window
 * (conservative). `dayFree === null` → FAIL OPEN (treat the pool as fully free) so
 * an outage never hides real availability.
 */

export interface Interval { start: number; end: number } // minutes-of-day
/** A Calendar-A booking tagged with the resource pool it belongs to. */
export interface BusyEvent { start: number; end: number; pool: string }

const hhmm = (m: number): string =>
  `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

/** Artists from `pool` that Planity lists free for the whole window [s,e). */
export function freeInPool(
  pool: Artist[],
  dayFree: Map<string, Set<string>> | null,
  s: number,
  e: number,
): Artist[] {
  if (!dayFree) return pool.slice()
  return pool.filter((a) => {
    for (let m = s; m < e; m += 15) {
      if (!dayFree.get(hhmm(m))?.has(a.planityCalendarId)) return false
    }
    return true
  })
}

/**
 * Remaining capacity in [s,e): free pool artists minus SAME-POOL bookings.
 * A booking only decrements the pool it belongs to (`poolKey`), so a nail booking
 * never eats a cabine slot and an owner block on one pool never blocks another.
 * Untagged legacy bookings (pool '') default to the practitioner pool. Clamped ≥0.
 */
export function freeCount(
  freePool: Artist[],
  aBusy: BusyEvent[],
  s: number,
  e: number,
  poolKey: string,
): number {
  const aOverlap = aBusy.filter(
    (b) => s < b.end && e > b.start && (b.pool || GENERAL_POOL_KEY) === poolKey,
  ).length
  return Math.max(0, freePool.length - aOverlap)
}
