// Regenerate the (seo) route folders for Gentilly.
//  - creates 12 service pages (*-gentilly) + 5 town pages (onglerie-<town>)
//  - deletes the 18 old Noisy/Marne folders
//   node scripts/generate-seo-routes.mjs
import fs from 'node:fs'
import path from 'node:path'

const SEO = path.join(process.cwd(), 'app', '(public)', '(seo)')

const OG = (slug) =>
  /nail-art/.test(slug) ? '/images/dob/svc-nailart.jpg'
  : /(cils|regard)/.test(slug) ? '/images/dob/svc-regard.jpg'
  : /(pieds)/.test(slug) ? '/images/dob/g9.jpg'
  : '/images/dob/svc-manucure.jpg'

const SERVICE_SLUGS = [
  'prothesiste-ongulaire-gentilly','manucure-gentilly','semi-permanent-gentilly','ongles-gel-gentilly',
  'extension-cils-gentilly','ongles-sans-hema-gentilly','nail-art-gentilly','salon-ongles-ouvert-le-dimanche-gentilly',
  'beaute-des-pieds-gentilly','rehaussement-cils-gentilly','bar-a-ongles-gentilly','institut-de-beaute-gentilly',
]

const TOWN_SLUGS = ['le-kremlin-bicetre','arcueil','cachan','montrouge','paris-13']

const OLD_FOLDERS = [
  'prothesiste-ongulaire-noisy-le-grand','manucure-noisy-le-grand','semi-permanent-noisy-le-grand',
  'ongles-gel-noisy-le-grand','extension-cils-noisy-le-grand','ongles-sans-hema-noisy-le-grand',
  'nail-art-noisy-le-grand','salon-ongles-ouvert-le-dimanche-noisy-le-grand','beaute-des-pieds-noisy-le-grand',
  'onglerie-les-arcades-noisy-le-grand','rehaussement-cils-noisy-le-grand','bar-a-ongles-noisy-le-grand',
  'institut-de-beaute-noisy-le-grand',
  'bar-a-ongles-champs-sur-marne','bar-a-ongles-gournay-sur-marne','bar-a-ongles-villiers-sur-marne',
  'bar-a-ongles-bry-sur-marne','bar-a-ongles-neuilly-sur-marne',
]

const servicePage = (slug) => `import type { Metadata } from 'next'
import SeoLandingPage from '@/components/seo/SeoLandingPage'
import { landingPages } from '@/lib/seo/landing-pages'

const data = landingPages['${slug}']!

export const metadata: Metadata = {
  title: data.meta.title,
  description: data.meta.description,
  alternates: { canonical: \`/\${data.slug}\` },
  openGraph: {
    title: data.meta.title,
    description: data.meta.description,
    url: \`/\${data.slug}\`,
    type: 'website',
    images: ['${OG(slug)}'],
  },
}

export default function Page() {
  return <SeoLandingPage data={data} />
}
`

const townPage = (slug) => `import type { Metadata } from 'next'
import CityLandingPage from '@/components/seo/CityLandingPage'
import { getCityBySlug } from '@/lib/seo/cities'

const city = getCityBySlug('${slug}')!
const title = \`Onglerie & manucure à \${city.name} · Do Beauty\`
const description = \`Institut de beauté à \${city.driveMinutes} min de \${city.name}, à Gentilly : manucure, semi-permanent, gel, nail art & extensions de cils. Ouvert 7j/7, 4,6★ sur Google.\`

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: \`/onglerie-\${city.slug}\` },
  openGraph: {
    title,
    description,
    url: \`/onglerie-\${city.slug}\`,
    type: 'website',
    images: ['/images/dob/svc-manucure.jpg'],
  },
}

export default function Page() {
  return <CityLandingPage city={city} />
}
`

// Delete old folders first
for (const f of OLD_FOLDERS) {
  const dir = path.join(SEO, f)
  if (fs.existsSync(dir)) { fs.rmSync(dir, { recursive: true, force: true }); }
}

// Create new service pages
for (const slug of SERVICE_SLUGS) {
  const dir = path.join(SEO, slug)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'page.tsx'), servicePage(slug), 'utf-8')
}

// Create new town pages (onglerie-<town>)
for (const slug of TOWN_SLUGS) {
  const dir = path.join(SEO, `onglerie-${slug}`)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'page.tsx'), townPage(slug), 'utf-8')
}

console.log(`Deleted ${OLD_FOLDERS.length} old folders; created ${SERVICE_SLUGS.length} service + ${TOWN_SLUGS.length} town pages.`)
