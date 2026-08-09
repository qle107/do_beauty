/**
 * Do Beauty team — the selectable "artists" and the salon capacity pool.
 *
 * Each artist maps to their Planity per-agenda `calendarId` — the same ids Planity
 * uses in its public availability data. These ids are not secrets, so keeping the
 * name↔id map here is safe and lets the engine tell *which* artist Planity lists as
 * free at a given slot.
 *
 * Two roles:
 *  · ARTISTS (9) — every agenda a client can pick in the booking flow: the 6
 *    practitioners + the 3 cabines (lash / esthetics stations).
 *  · STAFF (6)   — the practitioners only. This is the CAPACITY pool for the
 *    "Sans préférence" option: a client always needs a person, and a cabine is a
 *    room a person works in (not extra concurrent capacity), so counting cabines
 *    toward capacity would double-count one client. Planity's data ties the two
 *    together, so a free cabine always implies a free practitioner.
 *
 * ⚠️ Cabine display names below ("Cils 1", "Cils 2", "Esthétique") are placeholders
 *    from Planity's agenda labels — rename them here to the real artist names if
 *    those stations are run by named artists.
 */

export interface Artist {
  /** stable slug used in booking payloads */
  id: string
  /** client-facing display name (shown in the artist picker) */
  name: string
  /** Planity agenda id — as it appears in Planity's public availability data */
  planityCalendarId: string
  /** 'staff' = a practitioner (counts toward capacity); 'cabine' = a station (pickable only) */
  kind: 'staff' | 'cabine'
  order: number
}

export const ARTISTS: Artist[] = [
  { id: 'lyly',       name: 'Lyly',       planityCalendarId: '-OTWF6PPgyz0flw7OQTF', kind: 'staff',  order: 1 },
  { id: 'dodo',       name: 'Dodo',       planityCalendarId: '-OTWF4f168sQ7QdrPUJ4', kind: 'staff',  order: 2 },
  { id: 'audi',       name: 'Audi',       planityCalendarId: '-OTWu2CR4rQ6VBx9WC8K', kind: 'staff',  order: 3 },
  { id: 'anna',       name: 'Anna',       planityCalendarId: '-OTWuG_EnBMqzdDG3tdR', kind: 'staff',  order: 4 },
  { id: 'julie',      name: 'Julie',      planityCalendarId: '-OTWuPwuxxHsB9NFpNBb', kind: 'staff',  order: 5 },
  { id: 'elysia',     name: 'Elysia',     planityCalendarId: '-OtTYSvwh9T4hiv0fa1e', kind: 'staff',  order: 6 },
  { id: 'cils-1',     name: 'Cils 1',     planityCalendarId: '-OTWucAYZ-axUK4emCcH', kind: 'cabine', order: 7 },
  { id: 'cils-2',     name: 'Cils 2',     planityCalendarId: '-OTWuqQyCVhveHImMNjG', kind: 'cabine', order: 8 },
  { id: 'esthetique', name: 'Esthétique', planityCalendarId: '-OTWuzeS4q2W7X-7mH7n', kind: 'cabine', order: 9 },
]

/** Practitioners only — the capacity pool for "Sans préférence". */
export const STAFF: Artist[] = ARTISTS.filter((a) => a.kind === 'staff')

const BY_ID = new Map(ARTISTS.map((a) => [a.id, a]))
export const artistById = (id: string): Artist | undefined => BY_ID.get(id)

/** Backwards-compatible alias (a StaffMember is any pickable artist). */
export type StaffMember = Artist
