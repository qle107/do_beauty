import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Manrope } from 'next/font/google'
import { site } from '@/lib/site'
import { localBusinessSchema, websiteSchema } from '@/lib/seo/schema'
import JsonLd from '@/components/seo/JsonLd'
import CookieConsent from '@/components/layout/CookieConsent'
import './globals.css'

// Editorial display serif + quiet geometric sans - the DO BEAUTY type system.
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-manrope',
  display: 'swap',
})

// Cap CDN cache of prerendered HTML so post-deploy chunk 404s self-heal quickly.
export const revalidate = 60

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#F5F1EA',
}

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: 'Do Beauty - Institut de beauté à Gentilly',
  description:
    'Institut de beauté et onglerie à Gentilly (94250) : manucure, vernis semi-permanent, pose gel, nail art et beauté du regard. Ouvert du lundi au samedi, 4,6★ sur 99 avis Google. Réservation en ligne.',
  keywords: [
    'institut de beauté Gentilly',
    'manucure Gentilly',
    'nail art',
    'onglerie Gentilly',
    'beauté du regard',
    'extensions de cils',
    'Do Beauty',
    'Val-de-Marne',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Do Beauty - Institut de beauté à Gentilly',
    description:
      'Institut de beauté et onglerie à Gentilly. Manucure, semi-permanent, gel, nail art et beauté du regard. Ouvert du lundi au samedi, réservation en ligne.',
    url: site.url,
    siteName: site.name,
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/images/institut-accueil.png',
        width: 1200,
        height: 630,
        alt: "Intérieur de l'institut de beauté Do Beauty à Gentilly",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Do Beauty - Institut de beauté à Gentilly',
    description: 'Manucure, nail art, beauté du regard et soins à Gentilly.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${manrope.variable}`}>
      <body>
        {children}
        <CookieConsent />
        <JsonLd data={[localBusinessSchema(), websiteSchema()]} />
      </body>
    </html>
  )
}
