import type { Metadata } from 'next'
import CityLandingPage from '@/components/seo/CityLandingPage'
import { getCityBySlug } from '@/lib/seo/cities'

const city = getCityBySlug('villejuif')!
const title = `Onglerie & manucure à ${city.name} · Do Beauty Gentilly`
const description = `Onglerie à ${city.driveMinutes} min de ${city.name}, à Gentilly : manucure, semi-permanent, gel, nail art & beauté du regard. Ouvert du lundi au samedi, 4,6★ sur Google.`

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `/onglerie-${city.slug}` },
  openGraph: {
    title,
    description,
    url: `/onglerie-${city.slug}`,
    type: 'website',
    images: ['/images/entrance.png'],
  },
}

export default function Page() {
  return <CityLandingPage city={city} />
}
