import Image from 'next/image'
import Link from 'next/link'
import { servicePageLinks } from '@/lib/navigation'

type ServiceCard = {
  category: 'MAINS' | 'NAIL_ART' | 'CAPSULE' | 'CILS'
  title: string
  tagline: string
  image: string
  alt: string
  duration: string
  fromPrice: number
  supplement?: boolean
  benefits: readonly string[]
  // In-content SEO link: `landingLabel` matches a servicePageLinks entry (single
  // source of hrefs); `landingAnchor` is the keyword-rich, descriptive anchor text.
  landingLabel: string
  landingAnchor: string
}

// Resolve a landing-page href from the shared nav list, keyed by its label.
const landingHref = (label: string) =>
  servicePageLinks.find((l) => l.label === label)?.href ?? '/menus'

const CARDS: readonly ServiceCard[] = [
  {
    category: 'MAINS',
    title: 'Semi-permanent',
    tagline: 'Brillance miroir, tenue 3 semaines.',
    image: '/images/dob/svc-manucure.jpg',
    alt: 'Manucure semi-permanent nude réalisée chez Do Beauty à Gentilly',
    duration: '25 – 35 min',
    fromPrice: 25,
    benefits: ['Couleurs illimitées', 'Séchage LED', 'Finition French possible'],
    landingLabel: 'Semi-permanent',
    landingAnchor: 'Semi-permanent à Gentilly',
  },
  {
    category: 'NAIL_ART',
    title: 'Nail Art',
    tagline: 'Des motifs dessinés à la main, selon vos envies.',
    image: '/images/dob/svc-nailart.jpg',
    alt: 'Nail art créatif chromé réalisé chez Do Beauty à Gentilly',
    duration: '+ 5 min',
    fromPrice: 5,
    supplement: true,
    benefits: ['Design sur mesure', 'Cat eyes · Chrome miroir', 'Inspiration Instagram'],
    landingLabel: 'Nail art',
    landingAnchor: 'Nail art à Gentilly',
  },
  {
    category: 'CAPSULE',
    title: 'Pose de capsules',
    tagline: 'Gel ou résine, la longueur que vous voulez.',
    image: '/images/dob/g7.jpg',
    alt: 'Pose de capsules en gel avec Baby Boomer chez Do Beauty à Gentilly',
    duration: '50 min – 1h20',
    fromPrice: 45,
    benefits: ['Résine ou gel', 'Baby Boomer & French', 'Remplissage possible'],
    landingLabel: 'Ongles en gel',
    landingAnchor: 'Ongles en gel à Gentilly',
  },
  {
    category: 'CILS',
    title: 'Extensions de cils',
    tagline: 'Regard intense, effet naturel ou volume.',
    image: '/images/dob/svc-regard.jpg',
    alt: 'Extensions de cils volume russe chez Do Beauty à Gentilly',
    duration: '1h20',
    fromPrice: 55,
    benefits: ['Cil-à-cil ou volume russe', 'Effet naturel à intense', 'Remplissage 2 à 4 sem.'],
    landingLabel: 'Extensions de cils',
    landingAnchor: 'Extensions de cils à Gentilly',
  },
] as const

export default function ServicesGrid() {
  return (
    <section className="bg-cream border-t border-nude-300/60 py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16 md:mb-20">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-charcoal-500 mb-4">
            Nos soins
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-dark leading-tight">
            Vos ongles,<br className="md:hidden" /> notre expertise.
          </h2>
          <div className="h-px w-16 bg-coral/40 mx-auto mt-8" />
          <p className="font-sans text-sm text-dark/55 max-w-xl mx-auto mt-6 leading-relaxed">
            Nos quatre soins les plus demandés : semi-permanent, nail art, pose
            de capsules et extensions de cils. À Gentilly, du lundi au samedi
            de 10h à 19h30. Extensions de cils sur rendez-vous uniquement.
          </p>
        </div>

        <div
          tabIndex={0}
          aria-label="Nos soins - faites défiler"
          className="flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-6 px-6 scroll-px-6 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:mx-0 sm:px-0 sm:scroll-px-0"
        >
          {CARDS.map((card) => (
            <article
              key={card.title}
              className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-nude-300/60 shadow-luxe-sm hover:border-coral/30 hover:shadow-luxe-md transition-all duration-300 snap-start shrink-0 basis-[82%] sm:basis-auto sm:shrink"
            >
              <div className="photo-tint relative aspect-[4/5] overflow-hidden bg-blush">
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  loading="lazy"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-col flex-1 p-6">
                <h3 className="font-serif text-2xl font-light text-dark mb-1">
                  {card.title}
                </h3>
                <p className="font-sans text-sm text-dark/55 mb-5 leading-relaxed">
                  {card.tagline}
                </p>

                <ul className="flex flex-col gap-1.5 mb-6">
                  {card.benefits.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2 font-sans text-xs text-charcoal-500"
                    >
                      <span aria-hidden="true" className="text-coral mt-0.5">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-baseline justify-between mb-5 pt-4 border-t border-nude-300/60">
                  <span className="font-sans text-[11px] tracking-wider uppercase text-charcoal-500">
                    {card.duration}
                  </span>
                  <span className="font-sans text-[11px] text-charcoal-500">
                    {card.supplement ? 'Supplément ' : 'Dès '}
                    <strong className="font-serif text-lg text-coral font-light lining-nums tabular-nums">
                      {card.supplement ? '+' : ''}{card.fromPrice} €
                    </strong>
                  </span>
                </div>

                <div className="mt-auto flex flex-col gap-2.5">
                  <Link
                    href={`/booking?category=${card.category}`}
                    className="block rounded-md text-center bg-dark text-cream text-xs px-6 py-3.5 tracking-[0.18em] font-sans hover:bg-coral-dark transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    aria-label={`Réserver ${card.title}`}
                  >
                    Réserver ce soin →
                  </Link>
                  <Link
                    href={landingHref(card.landingLabel)}
                    className="block text-center font-sans text-xs text-charcoal-500 underline underline-offset-4 decoration-nude-300 hover:text-coral hover:decoration-coral transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                  >
                    {card.landingAnchor} →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="text-center mt-12 font-sans text-sm text-dark/55">
          <Link
            href="/menus"
            className="underline underline-offset-4 hover:text-coral transition-colors"
          >
            Voir l&apos;intégralité de nos prestations et tarifs →
          </Link>
        </p>
      </div>
    </section>
  )
}
