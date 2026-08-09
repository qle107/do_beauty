/**
 * Index of city landing pages — Gentilly's neighbouring towns.
 * Each town's content lives in its own module under lib/seo/cities/.
 */
import type { City } from '@/lib/seo/types'
import { cityData as leKremlinBicetre } from '@/lib/seo/cities/le-kremlin-bicetre'
import { cityData as arcueil } from '@/lib/seo/cities/arcueil'
import { cityData as cachan } from '@/lib/seo/cities/cachan'
import { cityData as montrouge } from '@/lib/seo/cities/montrouge'
import { cityData as villejuif } from '@/lib/seo/cities/villejuif'
import { cityData as ivrySurSeine } from '@/lib/seo/cities/ivry-sur-seine'
import { cityData as paris13 } from '@/lib/seo/cities/paris-13'
import { cityData as paris14 } from '@/lib/seo/cities/paris-14'

export type { City, CityFaq, CityBlock } from '@/lib/seo/types'

export const cities: readonly City[] = [
  leKremlinBicetre,
  arcueil,
  cachan,
  montrouge,
  villejuif,
  ivrySurSeine,
  paris13,
  paris14,
]

export const citySlugs = cities.map((c) => c.slug)

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug)
}
