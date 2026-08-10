// ─── Carte des soins — 15 display sections (mirrors the live Planity menu) ──
//
// The public menu and the booking picker both render these 15 sections, in
// this exact order, with these exact titles (kept verbatim from the salon's
// live Planity menu — including its typos, reported to the owner separately).
//
// `category` on a Service stays the coarse *pool* key that drives availability
// (see lib/staff.ts): several sections share one pool category, e.g. both
// "Offres spéciales" and "Spa vipp" map to FORFAIT. `section` is the finer
// display grouping used here. Nothing in booking/availability reads `section`.

import type { ServiceCategory } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import type { Service } from '@/lib/types'

export interface CatalogueSection {
  id: string
  n: string                 // "01".."15" — display index
  title: string             // verbatim menu wording
  emoji: string
  category: ServiceCategory  // pool key every service in this section carries
  description?: string       // section intro shown on the menu (rare)
  subgroups?: string[]       // ordered sub-headings inside the section (cils only)
}

// Sub-headings inside "Extension de cils en soie" (its 22 rows split 3 ways).
export const CILS_SUBGROUPS = ['Poses', 'Remplissages', 'Déposes & suppléments'] as const

export const SECTIONS: CatalogueSection[] = [
  { id: 'offres-speciales',  n: '01', title: 'Offres spéciales',            emoji: '✨', category: 'FORFAIT' },
  { id: 'soin-mains',        n: '02', title: 'Soin des mains',              emoji: '💅', category: 'MAINS' },
  { id: 'soin-pieds',        n: '03', title: 'Soin des pieds',              emoji: '🦶', category: 'PIEDS' },
  { id: 'pose-capsule',      n: '04', title: 'Pose de capsule',             emoji: '💎', category: 'CAPSULE' },
  { id: 'gainage',           n: '05', title: 'Gainage & renforcement',      emoji: '🛡️', category: 'CAPSULE' },
  { id: 'spa-vipp',          n: '06', title: 'Spa vipp américain + + +',    emoji: '🫧', category: 'FORFAIT' },
  { id: 'nail-art',          n: '07', title: 'Nail art - suppelements',     emoji: '🎨', category: 'NAIL_ART' },
  { id: 'nails-hommes',      n: '08', title: 'Nails pour hommes',           emoji: '🤵', category: 'MAINS' },
  { id: 'depose-reparation', n: '09', title: 'Dépose - réparation',         emoji: '🧴', category: 'CAPSULE' },
  {
    id: 'extension-cils', n: '10', title: 'Extension de cils en soie', emoji: '👁️',
    category: 'CILS', subgroups: [...CILS_SUBGROUPS],
  },
  {
    id: 'rehaussement', n: '11', title: 'Rehaussement de cils', emoji: '🌿', category: 'CILS',
    description:
      "Le rehaussement de cils est une technique qui consiste à recourber les cils vers le haut en promettant longueur et intensité. Associé à une teinture de cil le rehaussement de cils donne l'impression d'un regard naturellement maquillé.",
  },
  { id: 'soins-visage', n: '12', title: 'Soins du visage',      emoji: '🌸', category: 'VISAGE' },
  { id: 'soins-corps',  n: '13', title: 'Soins du corps',       emoji: '💆', category: 'CORPS' },
  { id: 'epilation',    n: '14', title: 'Épilation à la cire',  emoji: '🪶', category: 'EPILATION' },
  { id: 'browlift',     n: '15', title: 'Browlift sourcils',    emoji: '💫', category: 'CILS' },
]

export const SECTION_BY_ID: Record<string, CatalogueSection> = Object.fromEntries(
  SECTIONS.map((s) => [s.id, s])
)

// Fallback for a service that has no `section` (e.g. one created later via the
// admin form, which only sets a pool category) — put it in the first section
// of its pool so it still shows up somewhere sensible on the menu.
const DEFAULT_SECTION_FOR_CATEGORY: Record<ServiceCategory, string> = {
  FORFAIT: 'offres-speciales',
  MAINS: 'soin-mains',
  PIEDS: 'soin-pieds',
  CAPSULE: 'pose-capsule',
  NAIL_ART: 'nail-art',
  CILS: 'extension-cils',
  VISAGE: 'soins-visage',
  CORPS: 'soins-corps',
  EPILATION: 'epilation',
}

export function sectionIdOf(service: Pick<Service, 'section' | 'category'>): string {
  return service.section ?? DEFAULT_SECTION_FOR_CATEGORY[service.category]
}

/** Price as shown on the menu: the verbatim label when present, else a plain amount. */
export function formatServicePrice(service: Pick<Service, 'price' | 'priceLabel'>): string {
  return service.priceLabel ?? formatCurrency(service.price)
}

/** Duration in the salon's menu style: "1h 20min", "1h", "45min", "1min". */
export function formatServiceDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h && m) return `${h}h ${m}min`
  if (h) return `${h}h`
  return `${m}min`
}
