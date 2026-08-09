// Assemble lib/seo/landing-pages.ts from the gentilly-landing-pages workflow output.
//   node scripts/assemble-landing.mjs <workflow-output.json>
import fs from 'node:fs'
import path from 'node:path'

const outFile = process.argv[2]
const parsed = JSON.parse(fs.readFileSync(outFile, 'utf-8'))
const arr = (Array.isArray(parsed) ? parsed : parsed.result)
  .map((p) => (typeof p === 'string' ? JSON.parse(p) : p))
  .filter((p) => p && p.slug)

const ORDER = ['prothesiste-ongulaire-gentilly','manucure-gentilly','semi-permanent-gentilly','ongles-gel-gentilly','extension-cils-gentilly','ongles-sans-hema-gentilly','nail-art-gentilly','salon-ongles-ouvert-le-dimanche-gentilly','beaute-des-pieds-gentilly','rehaussement-cils-gentilly','bar-a-ongles-gentilly','institut-de-beaute-gentilly']
arr.sort((a, b) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug))
if (arr.length !== 12) console.warn(`WARN: expected 12 pages, got ${arr.length}: ${arr.map((p) => p.slug).join(', ')}`)

// Defensive fixup of internal links: old service slug → new, old town slugs → new,
// drop the removed "Les Arcades" page. Applied to related[].href.
const townMap = { 'champs-sur-marne': 'le-kremlin-bicetre', 'gournay-sur-marne': 'arcueil', 'villiers-sur-marne': 'cachan', 'bry-sur-marne': 'montrouge', 'neuilly-sur-marne': 'paris-13' }
const valid = new Set(ORDER)
function fixHref(href) {
  let h = href.replace('-noisy-le-grand', '-gentilly')
  for (const [o, n] of Object.entries(townMap)) h = h.replace(`bar-a-ongles-${o}`, `bar-a-ongles-${n}`)
  return h
}
for (const p of arr) {
  p.related = (p.related || [])
    .map((r) => ({ ...r, href: fixHref(r.href) }))
    .filter((r) => !r.href.includes('les-arcades'))
    // keep only links to real service pages or town pages
    .filter((r) => valid.has(r.href.replace(/^\//, '')) || r.href.includes('bar-a-ongles-'))
}

const map = {}
for (const p of arr) map[p.slug] = p

const header = `import type { FaqEntry } from '@/lib/seo/faqs'
import type { ServiceCategory } from '@/lib/utils'

/**
 * Content block - either a paragraph, a bullet list, or a pricing table.
 * The landing page shell renders these in order under each section H2.
 */
export type ContentBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: readonly string[] }
  | { kind: 'pricing'; rows: readonly { label: string; price: string }[] }

export type LandingSection = { h2: string; blocks: readonly ContentBlock[] }
export type RelatedLink = { label: string; href: string }

export type LandingPage = {
  slug: string
  meta: { title: string; description: string }
  breadcrumbLabel: string
  h1: string
  lead: string
  ctaCategory: ServiceCategory
  service?: { name: string; serviceType: string; description: string; fromPrice: number }
  sections: readonly LandingSection[]
  faqs: readonly FaqEntry[]
  related: readonly RelatedLink[]
}

export const landingPages: Record<string, LandingPage> = ${JSON.stringify(map, null, 2)}

export const landingPageSlugs = Object.keys(landingPages)
`

fs.writeFileSync(path.join(process.cwd(), 'lib', 'seo', 'landing-pages.ts'), header, 'utf-8')
console.log(`Wrote ${arr.length} landing pages → lib/seo/landing-pages.ts`)
