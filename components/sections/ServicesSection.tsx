import Reveal from '@/components/ui/Reveal'
import ServiceGallery, { type ServiceCategoryData } from '@/components/sections/ServiceGallery'
import { getPublishedImages, toPublicImage } from '@/lib/gallery-store'
import { getAllServices } from '@/lib/services-store'
import { serviceImages } from '@/lib/media'
import type { GalleryImagePublic } from '@/lib/types'

// The four editorial "expertises" are a presentation layer over the gallery
// catalog: each maps to a filter (category/tag) so that when the owner uploads
// and tags a new photo, it appears here automatically — newest first. No image
// filenames are hard-coded in the component; only the filter + a curated cover
// fallback (used until a category has published photos of its own).
const CATEGORIES: {
  n: string
  key: string
  title: string
  desc: string
  bookingCat: string
  fallback: string | null
  match: (img: GalleryImagePublic) => boolean
}[] = [
  {
    n: '01',
    key: 'manucure',
    title: 'Manucure',
    desc: 'Beauté des mains, vernis classique et semi-permanent longue tenue.',
    bookingCat: 'MAINS',
    fallback: serviceImages.manucure,
    match: (img) =>
      img.category === 'nails' && !img.tags.map((t) => t.toLowerCase()).includes('nail-art'),
  },
  {
    n: '02',
    key: 'nail-art',
    title: 'Nail Art',
    desc: 'Créations sur mesure, détails graphiques et finitions précises.',
    bookingCat: 'NAIL_ART',
    fallback: serviceImages.nailart,
    match: (img) => img.tags.map((t) => t.toLowerCase()).includes('nail-art'),
  },
  {
    n: '03',
    key: 'regard',
    title: 'Beauté du regard',
    desc: 'Extensions de cils, rehaussement et teinture, pour un regard intense.',
    bookingCat: 'CILS',
    fallback: serviceImages.regard,
    match: (img) => img.category === 'eyes',
  },
  {
    n: '04',
    key: 'pieds',
    title: 'Beauté des pieds',
    desc: 'Soin complet et mise en beauté des pieds, du soin au vernis.',
    bookingCat: 'PIEDS',
    fallback: null,
    match: (img) =>
      img.category === 'pedicure' ||
      img.tags.map((t) => t.toLowerCase()).some((t) => ['pédicure', 'pedicure', 'pieds'].includes(t)),
  },
]

const byNewest = (a: GalleryImagePublic, b: GalleryImagePublic) =>
  b.uploadedAt.localeCompare(a.uploadedAt)

export default async function ServicesSection() {
  const [images, services] = await Promise.all([
    getPublishedImages().then((all) => all.map(toPublicImage)),
    getAllServices(),
  ])

  const data: ServiceCategoryData[] = CATEGORIES.map((c) => {
    const shots = images.filter(c.match).slice().sort(byNewest)
    const cover = shots[0]
    const svc = services
      .filter((s) => s.category === c.bookingCat)
      .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a.price - b.price)
      .slice(0, 4)
      .map((s) => ({ name: s.name, price: s.price }))

    return {
      n: c.n,
      key: c.key,
      title: c.title,
      desc: c.desc,
      bookingCat: c.bookingCat,
      featured: cover?.url ?? c.fallback ?? null,
      featuredAlt: cover?.alt ?? `Do Beauty, ${c.title.toLowerCase()} à Gentilly`,
      images: shots.map((s) => ({ id: s.id, url: s.url, alt: s.alt, title: s.title })),
      services: svc,
    }
  })

  return (
    <section
      id="prestations"
      className="bg-[color:var(--db-bg)]"
      style={{ paddingBlock: 'clamp(88px,12vh,168px)' }}
    >
      <div className="db-shell">
        <Reveal>
          <header className="max-w-2xl">
            <p className="db-eyebrow">Nos expertises</p>
            <h2 className="db-serif mt-4 text-[color:var(--db-ink)] text-[clamp(30px,5vw,56px)] leading-[1.05]">
              La beauté, pensée dans les moindres détails.
            </h2>
            <p className="mt-6 max-w-[60ch] text-[15px] leading-relaxed text-[color:var(--db-ink-soft)]">
              Manucure, nail art, regard et beauté des pieds : découvrez l’univers Do Beauty.
            </p>
          </header>
        </Reveal>

        <div className="mt-12 md:mt-16">
          <ServiceGallery data={data} />
        </div>
      </div>
    </section>
  )
}
