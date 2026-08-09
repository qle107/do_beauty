import { STAFF, ARTISTS, type Artist } from '@/lib/staff'

/**
 * Capacity math for the multi-employee model, sourced from Planity's live public
 * availability (see lib/planity/public-availability). Unit: Paris minutes-of-day.
 *
 * An agenda is free for a service window [s,e) only if Planity lists it free at
 * every 15-min instant in that window (conservative — never offers a slot it can't
 * fully honour). `dayFree === null` means we have no authoritative Planity data →
 * FAIL OPEN (treat everything free) so an outage never hides real availability.
 *
 *  · freeStaffForWindow   — free PRACTITIONERS. The capacity pool for "Sans
 *    préférence": a client always needs a person; cabines don't add concurrent
 *    capacity (a free cabine already implies a free practitioner in Planity).
 *  · freeArtistsForWindow — free PRACTITIONERS + cabines. Powers the picker
 *    (`staffBySlot`) and the specific-artist gate, since a client may request a
 *    particular station.
 */

export interface Interval { start: number; end: number } // minutes-of-day

const hhmm = (m: number): string =>
  `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

function freeIn(
  list: Artist[],
  dayFree: Map<string, Set<string>> | null,
  s: number,
  e: number,
): Artist[] {
  if (!dayFree) return list.slice()
  return list.filter((a) => {
    for (let m = s; m < e; m += 15) {
      if (!dayFree.get(hhmm(m))?.has(a.planityCalendarId)) return false
    }
    return true
  })
}

/** Free practitioners for [s,e) — the capacity pool. */
export const freeStaffForWindow = (dayFree: Map<string, Set<string>> | null, s: number, e: number): Artist[] =>
  freeIn(STAFF, dayFree, s, e)

/** Free pickable artists (practitioners + cabines) for [s,e) — for the picker. */
export const freeArtistsForWindow = (dayFree: Map<string, Set<string>> | null, s: number, e: number): Artist[] =>
  freeIn(ARTISTS, dayFree, s, e)

/** Remaining capacity in [s,e): free practitioners minus website bookings overlapping. */
export function freeCount(freeStaff: Artist[], aBusy: Interval[], s: number, e: number): number {
  const aOverlap = aBusy.filter((b) => s < b.end && e > b.start).length
  return freeStaff.length - aOverlap
}
