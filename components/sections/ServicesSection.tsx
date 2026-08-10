import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import { getAllServices } from '@/lib/services-store'
import { formatServicePrice, formatServiceDuration } from '@/lib/catalogue'

// A "mini menu" of the salon's best-in-slot prestations. Names, durations and
// prices are pulled live from the catalogue (metadata) by id, so they always
// match the real menu. Reads as a clean stacked menu on mobile, two columns on
// wider screens. Full list lives on /menus.
const HIGHLIGHTS: { id: string; tag: string }[] = [
  { id: 'svc_off_03', tag: 'Forfait signature' },
  { id: 'svc_mains_03', tag: 'Mains' },
  { id: 'svc_cils_01', tag: 'Regard' },
  { id: 'svc_pieds_03', tag: 'Pieds' },
  { id: 'svc_vis_02', tag: 'Visage' },
  { id: 'svc_corps_02', tag: 'Détente' },
]

export default async function ServicesSection() {
  const services = await getAllServices()
  const byId = new Map(services.map((s) => [s.id, s]))
  const picks = HIGHLIGHTS.map((h) => ({ ...h, svc: byId.get(h.id) })).filter(
    (p): p is { id: string; tag: string; svc: NonNullable<typeof p.svc> } => Boolean(p.svc)
  )

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
              Quelques-uns de nos soins les plus demandés. La carte complète,
              onglerie, cils, visage, corps et épilation, se trouve sur la page Prestations.
            </p>
          </header>
        </Reveal>

        <Reveal delay={90}>
          {/* Mini-menu: one column on mobile, two on wider screens. */}
          <ul className="mt-12 grid gap-x-14 sm:grid-cols-2 md:mt-16">
            {picks.map(({ id, tag, svc }) => (
              <li key={id} className="border-t border-[color:var(--db-line)] last:border-b sm:[&:nth-last-child(2)]:border-b">
                <Link
                  href={`/booking?category=${svc.category}`}
                  data-cursor="reserver"
                  className="group flex items-baseline justify-between gap-5 py-5"
                >
                  <span className="min-w-0">
                    <span className="block text-[11px] uppercase tracking-[0.16em] text-[color:var(--db-champagne)]">
                      {tag}
                    </span>
                    <span className="db-serif mt-1.5 block text-[clamp(18px,2.1vw,23px)] leading-snug text-[color:var(--db-ink)] transition-opacity group-hover:opacity-70">
                      {svc.name}
                    </span>
                    <span className="mt-1 block text-[12px] uppercase tracking-[0.12em] text-[color:var(--db-ink-soft)]">
                      {formatServiceDuration(svc.duration)}
                    </span>
                  </span>
                  <span className="db-serif shrink-0 whitespace-nowrap text-[color:var(--db-champagne)] text-[clamp(16px,2vw,21px)]">
                    {formatServicePrice(svc)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <Link href="/menus" className="db-linkline" data-cursor="reserver">
              Voir toute la carte →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
