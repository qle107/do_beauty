import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'

// Curated set — the composition below is intentional (a large lead image, two
// stacked beside it, then a calmer three-up row), not a mechanical grid.
const IMAGES: { src: string; alt: string }[] = [
  { src: '/images/dob/g1.jpg', alt: 'Nail art floral réalisé chez Do Beauty' },
  { src: '/images/dob/g5.jpg', alt: 'French manucure jaune, détail graphique' },
  { src: '/images/dob/g6.jpg', alt: 'Manucure semi-permanente élégante' },
  { src: '/images/dob/g2.jpg', alt: 'Manucure nude nacrée aux finitions soignées' },
  { src: '/images/dob/g4.jpg', alt: 'Création nail art personnalisée' },
  { src: '/images/dob/g7.jpg', alt: 'Nail art bridal blanc et détails dorés' },
]

const FIG = 'group relative overflow-hidden rounded-[2px] bg-[color:var(--db-stone)]'
const IMG =
  'object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.035] motion-reduce:transition-none motion-reduce:group-hover:scale-100'

export default function GallerySection() {
  const [lead, topRight, bottomRight, ...rest] = IMAGES

  return (
    <section id="realisations" className="db-section bg-[color:var(--db-bg)]">
      <div className="db-shell">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="db-eyebrow">Réalisations</p>
              <h2 className="db-title mt-2">Le travail, en détail.</h2>
            </div>
            <Link href="/galerie" className="db-linkline self-start md:self-auto">
              Voir toutes les réalisations →
            </Link>
          </div>

          {/* Mobile: swipe carousel */}
          <div className="db-hscroll no-scrollbar -mx-[var(--db-gutter)] px-[var(--db-gutter)] mt-8 md:hidden">
            {IMAGES.map(({ src, alt }) => (
              <figure key={src} className="db-snap w-[72vw] max-w-[300px]">
                <Image
                  src={src}
                  alt={alt}
                  width={600}
                  height={800}
                  sizes="72vw"
                  data-cursor="image"
                  className="aspect-[3/4] w-full h-auto object-cover rounded-[2px] bg-[color:var(--db-stone)]"
                />
              </figure>
            ))}
          </div>

          {/* Desktop: editorial asymmetric — large lead + two stacked */}
          <div className="mt-12 hidden grid-cols-3 grid-rows-2 gap-3 md:grid md:h-[540px] lg:h-[620px]">
            <figure data-cursor="image" className={`${FIG} col-span-2 row-span-2`}>
              <Image src={lead.src} alt={lead.alt} fill sizes="55vw" className={IMG} />
            </figure>
            <figure data-cursor="image" className={`${FIG} col-start-3 row-start-1`}>
              <Image src={topRight.src} alt={topRight.alt} fill sizes="30vw" loading="lazy" className={IMG} />
            </figure>
            <figure data-cursor="image" className={`${FIG} col-start-3 row-start-2`}>
              <Image src={bottomRight.src} alt={bottomRight.alt} fill sizes="30vw" loading="lazy" className={IMG} />
            </figure>
          </div>

          {/* Desktop: calmer three-up row */}
          <div className="mt-3 hidden grid-cols-3 gap-3 md:grid">
            {rest.map(({ src, alt }) => (
              <figure key={src} data-cursor="image" className={`${FIG} aspect-[3/4]`}>
                <Image src={src} alt={alt} fill sizes="30vw" loading="lazy" className={IMG} />
              </figure>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
