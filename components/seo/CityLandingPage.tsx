import Link from 'next/link'
import type { City } from '@/lib/seo/cities'
import { site } from '@/lib/site'
import { breadcrumbSchema, faqPageSchema, serviceSchema } from '@/lib/seo/schema'
import JsonLd from '@/components/seo/JsonLd'
import TelLink from '@/components/analytics/TelLink'

const SERVICES = [
  { label: 'Manucure', href: '/manucure-gentilly', from: '15 €' },
  { label: 'Vernis semi-permanent', href: '/semi-permanent-gentilly', from: '20 €' },
  { label: 'Ongles en gel', href: '/ongles-gel-gentilly', from: '35 €' },
  { label: 'Nail art', href: '/nail-art-gentilly', from: '5 €' },
  { label: 'Beauté du regard', href: '/beaute-du-regard-gentilly', from: '45 €' },
] as const

export default function CityLandingPage({ city }: { city: City }) {
  const slug = `onglerie-${city.slug}`

  // Shared logistics FAQs + the town's own unique entries. Interleaving the
  // local FAQ keeps each page's FAQ set (and its FAQPage JSON-LD) distinct.
  const faqs = [
    {
      question: `Combien de temps de trajet depuis ${city.name} jusqu'au salon ?`,
      answer: `Environ ${city.driveMinutes} minutes en voiture, soit ${city.distanceKm} km. ${city.drivingHint}`,
    },
    {
      question: `Comment venir depuis ${city.name} en transport en commun ?`,
      answer: `${city.publicTransport}. L'institut Do Beauty se trouve ensuite au 16 Avenue Jean Jaurès, à Gentilly, à quelques minutes.`,
    },
    ...city.localFaqs,
    {
      question: `Comment réserver depuis ${city.name} ?`,
      answer: `Le plus simple : réservation en ligne sur notre site, 24h/24, avec les créneaux affichés en temps réel. Vous pouvez aussi appeler au ${site.phone.display} pendant nos heures d'ouverture.`,
    },
  ]

  const breadcrumbs = breadcrumbSchema([
    { name: 'Accueil', url: '/' },
    { name: `Onglerie ${city.name}`, url: `/${slug}` },
  ])
  const faqLd = faqPageSchema(faqs)
  const serviceLd = serviceSchema({
    name: `Onglerie & manucure à ${city.name}`,
    serviceType: 'Onglerie',
    description: `Manucure, vernis semi-permanent, ongles en gel, nail art et beauté du regard pour les habitantes de ${city.name}, à ${city.driveMinutes} min de notre institut Do Beauty à Gentilly.`,
    price: 15,
    slug: 'manucure-gentilly',
    city: city.name,
  })

  return (
    <article className="bg-cream">
      {/* Hero */}
      <header className="bg-blush py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <nav aria-label="Fil d'Ariane" className="font-sans text-xs text-dark/45 mb-6 tracking-wider">
            <Link href="/" className="hover:text-coral transition-colors">Accueil</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span>Onglerie {city.name}</span>
          </nav>
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-dark/45 mb-4">
            À {city.driveMinutes} min de {city.name}
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-light text-dark leading-tight mb-6">
            Onglerie & manucure près de {city.name}
          </h1>
          <div className="h-px w-16 bg-coral/50 mb-6" />
          <p className="font-serif text-lg md:text-xl text-charcoal-500 font-light leading-relaxed">
            {city.lead}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-10">
            <Link
              href="/booking"
              className="bg-dark text-cream text-sm px-9 py-4 tracking-widest font-sans hover:bg-coral-dark transition-colors text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-blush"
            >
              Réserver mon créneau →
            </Link>
            <TelLink
              location="city_hero"
              className="border border-dark/30 text-dark text-sm px-9 py-4 tracking-widest font-sans hover:border-dark transition-colors text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-blush"
            >
              {site.phone.display}
            </TelLink>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        {/* Unique, town-specific local content */}
        {city.localBlocks.map((block, i) => (
          <section key={block.h2} className={i === 0 ? '' : 'mt-14 pt-14 border-t border-dark/8'}>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-dark mb-8">
              {block.h2}
            </h2>
            {block.paragraphs.map((p, idx) => (
              <p key={idx} className="font-sans text-base text-charcoal-500 leading-relaxed mb-4">
                {p}
              </p>
            ))}
          </section>
        ))}

        {/* Services */}
        <section className="mt-14 pt-14 border-t border-dark/8">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-dark mb-8">
            Nos prestations
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SERVICES.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="flex items-center justify-between border border-dark/10 hover:border-coral/40 hover:bg-blush/50 transition-colors px-5 py-4 group"
                >
                  <span className="font-sans text-sm text-dark group-hover:text-coral transition-colors">{s.label}</span>
                  <span className="font-serif text-coral text-base">dès {s.from}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Town-specific reasons */}
        <section className="mt-14 pt-14 border-t border-dark/8">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-dark mb-8">
            Pourquoi venir de {city.name} chez Do Beauty
          </h2>
          <ul className="flex flex-col gap-3">
            {city.reasons.map((r) => (
              <li key={r} className="flex items-start gap-3 font-sans text-base text-charcoal-500 leading-relaxed">
                <span aria-hidden="true" className="text-coral font-serif mt-1 shrink-0">-</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Neighbourhoods */}
        <section className="mt-14 pt-14 border-t border-dark/8">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-dark mb-8">
            Quartiers de {city.name} desservis
          </h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-sans text-sm text-charcoal-500">
            {city.neighborhoods.map((h) => (
              <li key={h} className="border border-dark/10 px-3 py-2 bg-white">
                {h}
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="mt-16 pt-16 border-t border-dark/8" id="faq">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-dark mb-10 leading-tight">
            Questions fréquentes
          </h2>
          <div className="divide-y divide-dark/10 border-y border-dark/10">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex items-start justify-between gap-6 cursor-pointer list-none font-sans text-base text-dark hover:text-coral transition-colors">
                  <span className="flex-1">{faq.question}</span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 mt-1 text-dark/40 group-open:rotate-45 transition-transform duration-200"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <p className="font-sans text-sm text-charcoal-500 leading-relaxed mt-3 pr-10">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <div className="mt-16 pt-16 border-t border-dark/8 text-center">
          <p className="font-script text-coral text-3xl mb-4">À très bientôt</p>
          <h3 className="font-serif text-3xl font-light text-dark mb-8">
            Votre prochain rendez-vous, à {city.driveMinutes} minutes de {city.name}
          </h3>
          <Link
            href="/booking"
            className="inline-block bg-dark text-cream text-sm px-12 py-4 tracking-widest font-sans hover:bg-coral-dark transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          >
            Réserver maintenant →
          </Link>
        </div>
      </div>

      <JsonLd data={[breadcrumbs, faqLd, serviceLd]} />
    </article>
  )
}
