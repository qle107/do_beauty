import type { ServiceCategory } from '@/lib/types'

/**
 * Do Beauty team — the selectable "artists", each scoped to the service categories
 * they perform. This is what makes cabines catalog-specific:
 *
 *  · The 6 practitioners do the general nail/beauty services (mains, pieds, capsule,
 *    nail art, forfaits). For those, the customer picks a **practitioner**.
 *  · Cils 1 / Cils 2 (cabines) perform ONLY eyelash services (CILS).
 *  · Esthétique (cabine) performs ONLY face/body/waxing (VISAGE / CORPS / EPILATION).
 *
 * `artistsForCategories()` returns the artists that can perform a whole cart, so:
 *  - a manicure cart → only practitioners are offered / counted,
 *  - a cils cart     → only the Cils cabines,
 *  - an esthetics cart → only Esthétique.
 *
 * ⚠️ Confirm/adjust the category→artist mapping below with the owner (esp. whether
 *    practitioners also do cils/esthetics, and where EPILATION belongs). Cabine
 *    display names are placeholders — rename to real artist names if applicable.
 */

/** Service categories the general practitioners handle. */
const GENERAL: ServiceCategory[] = ['FORFAIT', 'MAINS', 'PIEDS', 'CAPSULE', 'NAIL_ART']

export interface Artist {
  /** stable slug used in booking payloads */
  id: string
  /** client-facing display name (shown in the artist picker) */
  name: string
  /** Planity agenda id — as it appears in Planity's public availability data */
  planityCalendarId: string
  /** 'staff' = a practitioner; 'cabine' = a station (cils / esthetics) */
  kind: 'staff' | 'cabine'
  /** the service categories this artist can perform */
  categories: ServiceCategory[]
  order: number
}

export const ARTISTS: Artist[] = [
  { id: 'lyly',       name: 'Lyly',       planityCalendarId: '-OTWF6PPgyz0flw7OQTF', kind: 'staff',  categories: GENERAL,                       order: 1 },
  { id: 'dodo',       name: 'Dodo',       planityCalendarId: '-OTWF4f168sQ7QdrPUJ4', kind: 'staff',  categories: GENERAL,                       order: 2 },
  { id: 'audi',       name: 'Audi',       planityCalendarId: '-OTWu2CR4rQ6VBx9WC8K', kind: 'staff',  categories: GENERAL,                       order: 3 },
  { id: 'anna',       name: 'Anna',       planityCalendarId: '-OTWuG_EnBMqzdDG3tdR', kind: 'staff',  categories: GENERAL,                       order: 4 },
  { id: 'julie',      name: 'Julie',      planityCalendarId: '-OTWuPwuxxHsB9NFpNBb', kind: 'staff',  categories: GENERAL,                       order: 5 },
  { id: 'elysia',     name: 'Elysia',     planityCalendarId: '-OtTYSvwh9T4hiv0fa1e', kind: 'staff',  categories: GENERAL,                       order: 6 },
  { id: 'cils-1',     name: 'Cils 1',     planityCalendarId: '-OTWucAYZ-axUK4emCcH', kind: 'cabine', categories: ['CILS'],                      order: 7 },
  { id: 'cils-2',     name: 'Cils 2',     planityCalendarId: '-OTWuqQyCVhveHImMNjG', kind: 'cabine', categories: ['CILS'],                      order: 8 },
  { id: 'esthetique', name: 'Esthétique', planityCalendarId: '-OTWuzeS4q2W7X-7mH7n', kind: 'cabine', categories: ['VISAGE', 'CORPS', 'EPILATION'], order: 9 },
]

/** Practitioners only — the default pool when a cart has no categories. */
export const STAFF: Artist[] = ARTISTS.filter((a) => a.kind === 'staff')

const BY_ID = new Map(ARTISTS.map((a) => [a.id, a]))
export const artistById = (id: string): Artist | undefined => BY_ID.get(id)

/**
 * Artists that can perform a whole cart: every one of the cart's categories must be
 * in the artist's `categories`. So mixed carts stay on a single resource type
 * (e.g. all-nail → practitioners; all-cils → cils cabines). Empty categories → the
 * practitioners (safe default).
 */
export function artistsForCategories(cats: ServiceCategory[]): Artist[] {
  if (!cats.length) return STAFF
  return ARTISTS.filter((a) => cats.every((c) => a.categories.includes(c)))
}
