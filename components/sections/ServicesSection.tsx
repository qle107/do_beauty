import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import { getAllServices } from '@/lib/services-store'
import { formatCurrency } from '@/lib/utils'
import type { ServiceCategory } from '@/lib/types'

// The salon's real offering (owner's list). Description-forward — several of these
// have no photos, so this is a clean editorial grid rather than photo cards. Prices
// are pulled from the catalog per category when present, else "sur devis".
const SERVICES: { n: string; name: string; desc: string; cat: ServiceCategory }[] = [
  {
    n: '01', name: 'Manucure', cat: 'MAINS',
    desc: 'Beauté des mains et des ongles : soin, mise en forme et vernis classique ou semi-permanent longue tenue.',
  },
  {
    n: '02', name: 'Pédicure', cat: 'PIEDS',
    desc: 'Soin complet des pieds : gommage, mise en beauté et pose de vernis pour des pieds nets et soignés.',
  },
  {
    n: '03', name: 'Massage Thaï', cat: 'CORPS',
    desc: "Massage traditionnel thaïlandais : pressions et étirements pour relâcher les tensions et retrouver de l'énergie.",
  },
  {
    n: '04', name: 'Soin du visage', cat: 'VISAGE',
    desc: 'Nettoyage, hydratation et éclat : un soin sur mesure pour une peau nette, reposée et lumineuse.',
  },
  {
    n: '05', name: 'Épilation au fil ou à la cire', cat: 'EPILATION',
    desc: 'Épilation précise du visage et du corps, au fil (méthode douce) ou à la cire, pour un résultat net et durable.',
  },
  {
    n: '06', name: 'Extension de cils en soie', cat: 'CILS',
    desc: 'Pose de cils en soie, cil à cil, pour un regard intense et naturel. Sur rendez-vous uniquement.',
  },
]

export default async function ServicesSection() {
  const services = await getAllServices()
  // Lowest active price per category → "dès X€" (shown only when the catalog has it).
  const priceByCat = new Map<string, number>()
  for (const s of services) {
    if (s.price <= 0) continue // skip free add-ons / deposits / removals so "dès X €" is meaningful
    const cur = priceByCat.get(s.category)
    if (cur === undefined || s.price < cur) priceByCat.set(s.category, s.price)
  }

  return (
    <section
      id="prestations"
      className="bg-[color:var(--db-bg)]"
      style={{ paddingBlock: 'clamp(88px,12vh,168px)' }}
    >
      <div className="db-shell">
        <Reveal>
          <header className="max-w-2xl">
            <p className="db-eyebrow">Nos prestations</p>
            <h2 className="db-serif mt-4 text-[color:var(--db-ink)] text-[clamp(30px,5vw,56px)] leading-[1.05]">
              La beauté, pensée dans les moindres détails.
            </h2>
            <p className="mt-6 max-w-[60ch] text-[15px] leading-relaxed text-[color:var(--db-ink-soft)]">
              Manucure, pédicure, massage thaï, soin du visage, épilation et extensions de cils :
              tout le savoir-faire Do Beauty, à Gentilly.
            </p>
          </header>
        </Reveal>

        <Reveal delay={90}>
          {/* Hairline-divided editorial grid — description-forward. */}
          <div className="mt-12 grid gap-px overflow-hidden rounded-[2px] bg-[color:var(--db-line)] sm:grid-cols-2 lg:grid-cols-3 md:mt-16">
            {SERVICES.map((s) => {
              const from = priceByCat.get(s.cat)
              return (
                <div key={s.n} className="flex flex-col bg-[color:var(--db-bg)] p-8 lg:p-9">
                  <span className="db-serif text-sm tracking-wide text-[color:var(--db-champagne)]">{s.n}</span>
                  <h3 className="db-serif mt-3 text-[clamp(22px,2.4vw,28px)] leading-[1.1] text-[color:var(--db-ink)]">
                    {s.name}
                  </h3>
                  <p className="mt-3 flex-1 text-[14px] leading-relaxed text-[color:var(--db-ink-soft)]">
                    {s.desc}
                  </p>
                  <div className="mt-6 flex items-center justify-between gap-4">
                    {from !== undefined ? (
                      <span className="db-serif text-[color:var(--db-champagne)]">dès {formatCurrency(from)}</span>
                    ) : (
                      <span className="text-[12px] uppercase tracking-[0.18em] text-[color:var(--db-ink-soft)]">
                        Sur devis
                      </span>
                    )}
                    <Link
                      href={`/booking?category=${s.cat}`}
                      data-cursor="reserver"
                      className="db-linkline whitespace-nowrap"
                    >
                      Réserver →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
