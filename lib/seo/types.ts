import type { FaqEntry } from '@/lib/seo/faqs'
import type { ServiceCategory } from '@/lib/utils'

/* ─── City landing pages ─────────────────────────────────────────────────── */

export type CityFaq = { question: string; answer: string }
export type CityBlock = { h2: string; paragraphs: readonly string[] }

export type City = {
  /** Display name with diacritics. */
  name: string
  /** URL slug (no diacritics). */
  slug: string
  /** Postal code. */
  postalCode: string
  /** Minutes by car (typical, not rush hour). */
  driveMinutes: number
  /** Distance in km (approximate). */
  distanceKm: number
  /** Public-transport description. */
  publicTransport: string
  /** One-line driving overview, reused in the logistics FAQ. */
  drivingHint: string
  /** Unique hero paragraph for this town. */
  lead: string
  /** Real neighbourhoods / landmarks, rendered as location chips. */
  neighborhoods: readonly string[]
  /** Unique local-content sections. */
  localBlocks: readonly CityBlock[]
  /** Town-specific reasons to choose the institute. */
  reasons: readonly string[]
  /** Town-specific FAQ entries. */
  localFaqs: readonly CityFaq[]
}

/* ─── Service landing pages ──────────────────────────────────────────────── */

export type ContentBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: readonly string[] }
  | { kind: 'pricing'; rows: readonly { label: string; price: string }[] }

export type LandingSection = {
  h2: string
  blocks: readonly ContentBlock[]
}

export type RelatedLink = { label: string; href: string }

export type LandingPage = {
  slug: string
  meta: { title: string; description: string }
  breadcrumbLabel: string
  h1: string
  /** One-sentence lead paragraph rendered under H1. */
  lead: string
  /** Booking category to deep-link from the CTA. */
  ctaCategory: ServiceCategory
  /** Optional Service schema input. */
  service?: {
    name: string
    serviceType: string
    description: string
    fromPrice: number
  }
  sections: readonly LandingSection[]
  faqs: readonly FaqEntry[]
  related: readonly RelatedLink[]
}
