import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllServices } from '@/lib/services-store'
import { formatCurrency, CATEGORY_ORDER, categoryConfig, type ServiceCategory } from '@/lib/utils'
import type { Service } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Nos prestations & tarifs · Do Beauty à Gentilly',
  description:
    'Toutes nos prestations et tarifs : manucure, nail art, pose d’ongles, extensions de cils, soins du visage, massages et épilation à Gentilly (94). Ouvert 7j/7, 10h–19h30.',
  alternates: { canonical: '/menus' },
  openGraph: {
    title: 'Nos prestations & tarifs · Do Beauty à Gentilly',
    description: 'Manucure, nail art, pose d’ongles, cils & regard, soins et épilation à Gentilly.',
    url: '/menus',
    type: 'website',
    images: ['/images/dob/svc-manucure.jpg'],
  },
}

// Rendered per request so the menu always reflects the live database and never
// touches the DB at build time (env/DB may be unavailable during the build).
export const dynamic = 'force-dynamic'

export default async function MenusPage() {
  const services: Service[] = await getAllServices()

  const grouped = CATEGORY_ORDER.reduce<Record<ServiceCategory, Service[]>>(
    (acc, cat) => {
      acc[cat] = services.filter((s) => s.category === cat)
      return acc
    },
    {
      FORFAIT: [], MAINS: [], PIEDS: [], CAPSULE: [], NAIL_ART: [],
      CILS: [], VISAGE: [], CORPS: [], EPILATION: [],
    }
  )

  return (
    <div className="min-h-screen bg-cream pt-28 pb-24">
      {/* En-tête */}
      <div className="mx-auto max-w-4xl px-6 text-center mb-20">
        <p className="font-script text-coral text-3xl mb-3">Nos</p>
        <h1 className="font-serif text-5xl md:text-6xl font-light text-dark">Prestations & Tarifs</h1>
        <div className="h-px bg-coral/40 w-24 mx-auto mt-8" />
        <p className="font-sans text-sm text-charcoal-500 mt-6 tracking-wide leading-relaxed">
          Manucure, semi-permanent, nail art, beauté des pieds, cils &amp; regard, soins et
          massages — notre institut à Gentilly. Paiement en espèces ou par virement.
        </p>
      </div>

      {/* Catégories */}
      <div className="mx-auto max-w-4xl px-6 flex flex-col gap-20">
        {CATEGORY_ORDER.map((cat) => {
          const catServices = grouped[cat]
          if (catServices.length === 0) return null
          const cfg = categoryConfig[cat]

          return (
            <section key={cat}>
              <div className="flex items-center gap-3 mb-8">
                <span className="text-2xl">{cfg.emoji}</span>
                <h2 className="font-serif text-3xl font-light text-dark tracking-wide">{cfg.label}</h2>
              </div>
              <div className="flex flex-col divide-y divide-dark/10">
                {catServices.map((service) => (
                  <div key={service.id} className="py-5 flex justify-between items-start gap-6">
                    <div className="flex-1">
                      <h3 className="font-sans text-base font-medium text-dark mb-1">{service.name}</h3>
                      <p className="font-sans text-sm text-charcoal-500 leading-relaxed">{service.description}</p>
                      <p className="font-sans text-xs text-charcoal-500 mt-2 tracking-wide uppercase">{service.duration} min</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-serif text-2xl text-coral lining-nums tabular-nums">{formatCurrency(service.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {/* Note de bas de page */}
      <div className="mx-auto max-w-4xl px-6 mt-16 pt-10 border-t border-dark/10 text-center">
        <p className="font-sans text-xs text-charcoal-500 mb-6">
          Les tarifs affichés sont à titre indicatif. Les prestations &quot;à partir de&quot; peuvent varier selon la complexité.
          Paiement en espèces ou par virement.
        </p>
        <Link
          href="/booking"
          className="inline-block border border-dark text-dark text-sm px-12 py-4 tracking-widest font-sans hover:bg-dark hover:text-cream transition-all duration-200"
        >
          Prendre rendez-vous
        </Link>
      </div>
    </div>
  )
}
