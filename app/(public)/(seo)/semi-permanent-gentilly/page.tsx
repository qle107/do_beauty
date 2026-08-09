import type { Metadata } from 'next'
import SeoLandingPage from '@/components/seo/SeoLandingPage'
import { landingPages } from '@/lib/seo/landing-pages'

const data = landingPages['semi-permanent-gentilly']!

export const metadata: Metadata = {
  title: data.meta.title,
  description: data.meta.description,
  alternates: { canonical: `/${data.slug}` },
  openGraph: {
    title: data.meta.title,
    description: data.meta.description,
    url: `/${data.slug}`,
    type: 'website',
    images: ['/images/entrance.png'],
  },
}

export default function Page() {
  return <SeoLandingPage data={data} />
}
