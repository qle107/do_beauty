import { site } from '@/lib/site'

const METRICS = [
  { value: `${site.rating.value.toLocaleString('fr-FR')}/5`, label: 'Note Google', sub: 'Sur 5 étoiles' },
  { value: site.rating.count.toString(), label: 'Avis vérifiés', sub: 'Clientes Google' },
  { value: '+1 200', label: 'Clientes', sub: 'Depuis 2016' },
  { value: '9 ans', label: 'D\'expertise', sub: 'À Gentilly' },
  { value: '7j/7', label: 'Ouverture', sub: '10h – 20h' },
] as const

function Metric({ m }: { m: (typeof METRICS)[number] }) {
  return (
    <>
      <p className="font-serif text-3xl md:text-4xl font-light text-cream tracking-tight lining-nums tabular-nums">
        {m.value}
      </p>
      <p className="font-sans text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-coral-light mt-2">
        {m.label}
      </p>
      <p className="font-sans text-xs text-cream/70 mt-1">{m.sub}</p>
    </>
  )
}

export default function SocialProofBar() {
  return (
    <section
      aria-label="Indicateurs de confiance"
      className="bg-dark text-cream py-10 md:py-14"
    >
      {/* Tablet / desktop: static grid */}
      <ul className="hidden sm:grid mx-auto max-w-7xl px-6 grid-cols-3 md:grid-cols-5 gap-x-4 divide-x divide-cream/10">
        {METRICS.map((m) => (
          <li key={m.label} className="text-center px-3">
            <Metric m={m} />
          </li>
        ))}
      </ul>

      {/* Mobile: continuous horizontal marquee (duplicated for seamless loop).
          Under prefers-reduced-motion it becomes a scrollable row (see globals). */}
      <div className="sm:hidden stat-marquee-viewport">
        <ul className="stat-marquee-track flex w-max">
          {[...METRICS, ...METRICS].map((m, i) => (
            <li
              key={i}
              aria-hidden={i >= METRICS.length}
              className="w-40 shrink-0 text-center px-3"
            >
              <Metric m={m} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
