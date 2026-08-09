import type { Metadata } from 'next'
import Link from 'next/link'
import GalleryBrowser from '@/components/galerie/GalleryBrowser'
import { getPublishedImages, toPublicImage } from '@/lib/gallery-store'
import { site } from '@/lib/site'
import JsonLd from '@/components/seo/JsonLd'
import type { GalleryCategory } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: `Nos réalisations à Gentilly · ${site.name}`,
  description:
    'Découvrez les réalisations Do Beauty : manucure, nail art, French, babyboomer, extensions de cils et beauté du regard, à Gentilly (94).',
  alternates: { canonical: '/galerie' },
}

const VALID: GalleryCategory[] = ['nails', 'eyes', 'pedicure', 'studio', 'other']

export default async function GaleriePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string }>
}) {
  const { category: rawCategory, tag } = await searchParams
  const images = (await getPublishedImages()).map(toPublicImage)

  const defaultCategory =
    rawCategory && (VALID as string[]).includes(rawCategory)
      ? (rawCategory as GalleryCategory)
      : 'all'

  const gallerySchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: `Galerie ${site.name}`,
    url: `${site.url}/galerie`,
    image: images.slice(0, 30).map((img) => ({
      '@type': 'ImageObject',
      contentUrl: `${site.url}${img.url}`,
      caption: img.alt,
    })),
  }

  return (
    <div className="min-h-screen bg-[color:var(--db-bg)] pt-28 pb-24">
      <JsonLd data={gallerySchema} />

      {/* Header */}
      <header className="db-shell text-center">
        <p className="db-eyebrow">Galerie</p>
        <h1 className="db-serif mt-4 text-4xl font-light text-[color:var(--db-ink)] md:text-6xl">
          Nos réalisations
        </h1>
        <span className="mx-auto mt-8 block h-px w-24 bg-[color:var(--db-champagne)]" />
        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-[color:var(--db-ink-soft)]">
          Un aperçu du travail réalisé chez Do Beauty à Gentilly&nbsp;: manucure, French, babyboomer,
          nail art et beauté du regard.
        </p>
      </header>

      {/* Browser */}
      <section className="db-shell mt-12 md:mt-16">
        {images.length === 0 ? (
          <p className="text-center text-sm text-[color:var(--db-taupe)]">
            La galerie sera bientôt enrichie de nos dernières réalisations.
          </p>
        ) : (
          <GalleryBrowser images={images} defaultCategory={defaultCategory} defaultTag={tag} />
        )}
      </section>

      {/* CTA */}
      <div className="db-shell mt-20 border-t border-[color:var(--db-line)] pt-12 text-center">
        <p className="db-serif mb-6 text-2xl font-light italic text-[color:var(--db-ink)]">
          Envie du même résultat&nbsp;?
        </p>
        <Link href="/booking" className="db-btn db-btn--solid" data-cursor="reserver">
          Réserver un rendez-vous
        </Link>
      </div>
    </div>
  )
}
