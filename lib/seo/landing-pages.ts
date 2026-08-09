/**
 * Index of service landing pages (Gentilly / Do Beauty).
 * Each page's content lives in its own module under lib/seo/services/.
 */
import type { LandingPage } from '@/lib/seo/types'
import { page as institutDeBeaute } from '@/lib/seo/services/institut-de-beaute'
import { page as onglerie } from '@/lib/seo/services/onglerie'
import { page as manucure } from '@/lib/seo/services/manucure'
import { page as nailArt } from '@/lib/seo/services/nail-art'
import { page as semiPermanent } from '@/lib/seo/services/semi-permanent'
import { page as onglesGel } from '@/lib/seo/services/ongles-gel'
import { page as beauteDuRegard } from '@/lib/seo/services/beaute-du-regard'
import { page as beauteDesPieds } from '@/lib/seo/services/beaute-des-pieds'

export type { LandingPage, ContentBlock, LandingSection, RelatedLink } from '@/lib/seo/types'

const all: readonly LandingPage[] = [
  institutDeBeaute,
  onglerie,
  manucure,
  nailArt,
  semiPermanent,
  onglesGel,
  beauteDuRegard,
  beauteDesPieds,
]

export const landingPages: Record<string, LandingPage> = Object.fromEntries(
  all.map((p) => [p.slug, p]),
)

export const landingPageSlugs: string[] = all.map((p) => p.slug)
