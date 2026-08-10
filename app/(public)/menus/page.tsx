import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllServices } from '@/lib/services-store'
import {
  SECTIONS,
  sectionIdOf,
  formatServicePrice,
  formatServiceDuration,
} from '@/lib/catalogue'
import type { Service } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Nos prestations & tarifs · Do Beauty à Gentilly',
  description:
    'Toutes nos prestations et tarifs : manucure, nail art, pose d’ongles, extensions de cils, soins du visage, massages et épilation à Gentilly (94). Ouvert du lundi au samedi, 10h–19h30.',
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

// One prestation row: name (+ optional grey subtitle) left, duration · price right.
function ServiceRow({ service }: { service: Service }) {
  const quote = service.priceType === 'quote'
  return (
    <div className="py-5 flex justify-between items-start gap-6">
      <div className="flex-1">
        <h3 className="font-sans text-base font-medium text-dark mb-1">{service.name}</h3>
        {service.note && (
          <p className="font-sans text-xs text-charcoal-500 italic mb-1">{service.note}</p>
        )}
        <p className="font-sans text-xs text-charcoal-500 mt-2 tracking-wide uppercase">
          {formatServiceDuration(service.duration)}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p
          className={
            quote
              ? 'font-serif text-lg italic text-charcoal-500 lining-nums tabular-nums'
              : 'font-serif text-2xl text-coral lining-nums tabular-nums'
          }
        >
          {formatServicePrice(service)}
        </p>
      </div>
    </div>
  )
}

export default async function MenusPage() {
  const services: Service[] = await getAllServices()

  // Group by display section (not the coarse pool category).
  const bySection = new Map<string, Service[]>()
  for (const s of services) {
    const id = sectionIdOf(s)
    const list = bySection.get(id) ?? []
    list.push(s)
    bySection.set(id, list)
  }

  return (
    <div className="min-h-screen bg-cream pt-28 pb-24">
      {/* En-tête */}
      <div className="mx-auto max-w-4xl px-6 text-center mb-20">
        <p className="font-script text-coral text-3xl mb-3">Nos</p>
        <h1 className="font-serif text-5xl md:text-6xl font-light text-dark">Prestations & Tarifs</h1>
        <div className="h-px bg-coral/40 w-24 mx-auto mt-8" />
        <p className="font-sans text-sm text-charcoal-500 mt-6 tracking-wide leading-relaxed">
          Manucure, semi-permanent, nail art, beauté des pieds, cils &amp; regard, soins et
          massages - notre institut à Gentilly. Paiement par carte ou en espèces.
        </p>
      </div>

      {/* Sections */}
      <div className="mx-auto max-w-4xl px-6 flex flex-col gap-20">
        {SECTIONS.map((section) => {
          const list = bySection.get(section.id) ?? []
          if (list.length === 0) return null

          return (
            <section key={section.id}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{section.emoji}</span>
                <h2 className="font-serif text-3xl font-light text-dark tracking-wide">{section.title}</h2>
              </div>
              {section.description && (
                <p className="font-sans text-sm text-charcoal-500 leading-relaxed max-w-2xl mb-6">
                  {section.description}
                </p>
              )}

              {section.subgroups ? (
                // Sub-grouped section (Extension de cils): Poses / Remplissages / Déposes.
                <div className="mt-6 flex flex-col gap-8">
                  {section.subgroups.map((sub) => {
                    const subList = list.filter((s) => s.subgroup === sub)
                    if (subList.length === 0) return null
                    return (
                      <div key={sub}>
                        <p className="font-sans text-xs font-semibold uppercase tracking-widest text-coral/80 mb-2">
                          {sub}
                        </p>
                        <div className="flex flex-col divide-y divide-dark/10">
                          {subList.map((s) => (
                            <ServiceRow key={s.id} service={s} />
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="mt-6 flex flex-col divide-y divide-dark/10">
                  {list.map((s) => (
                    <ServiceRow key={s.id} service={s} />
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </div>

      {/* Note de bas de page */}
      <div className="mx-auto max-w-4xl px-6 mt-16 pt-10 border-t border-dark/10 text-center">
        <p className="font-sans text-xs text-charcoal-500 mb-6">
          Les tarifs affichés sont à titre indicatif. Les prestations &quot;à partir de&quot; ou &quot;sur devis&quot; peuvent varier selon la complexité.
          Paiement par carte ou en espèces.
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
