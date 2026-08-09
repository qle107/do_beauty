// Assemble lib/seo/cities.ts from the gentilly-cities workflow output.
//   node scripts/assemble-cities.mjs <workflow-output.json>
import fs from 'node:fs'
import path from 'node:path'

const outFile = process.argv[2]
const raw = fs.readFileSync(outFile, 'utf-8')
const parsed = JSON.parse(raw)
const arr = Array.isArray(parsed) ? parsed : parsed.result
if (!Array.isArray(arr)) throw new Error('no result array in ' + outFile)

const ORDER = ['le-kremlin-bicetre', 'arcueil', 'cachan', 'montrouge', 'paris-13']
const cities = arr
  .map((c) => (typeof c === 'string' ? JSON.parse(c) : c))
  .filter((c) => c && c.slug)
  .sort((a, b) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug))

if (cities.length !== 5) console.warn(`WARN: expected 5 cities, got ${cities.length}`)

const header = `/**
 * Surrounding cities targeted by city-specific landing pages.
 * Gentilly itself is covered by the homepage, so only neighbours are here.
 *
 * Each city carries hand-written, locally-grounded content (lead, localBlocks,
 * reasons, localFaqs) so its landing page reads as genuinely unique. Drive times,
 * distances and transit are typical figures; landmarks are factual references.
 */

export type CityFaq = { question: string; answer: string }
export type CityBlock = { h2: string; paragraphs: readonly string[] }

export type City = {
  name: string
  slug: string
  postalCode: string
  driveMinutes: number
  distanceKm: number
  publicTransport: string
  drivingHint: string
  lead: string
  neighborhoods: readonly string[]
  localBlocks: readonly CityBlock[]
  reasons: readonly string[]
  localFaqs: readonly CityFaq[]
}

export const cities: readonly City[] = ${JSON.stringify(cities, null, 2)} as const

export const citySlugs = cities.map((c) => c.slug)

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug)
}
`

const dest = path.join(process.cwd(), 'lib', 'seo', 'cities.ts')
fs.writeFileSync(dest, header, 'utf-8')
console.log(`Wrote ${cities.length} cities → lib/seo/cities.ts (${cities.map((c) => c.slug).join(', ')})`)
