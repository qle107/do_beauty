import Link from 'next/link'

const POINTS = [
  'Beauté des pieds complète : ponçage, cuticules et modelage',
  'Vernis classique ou semi-permanent longue tenue sur les orteils',
  'Formule mains + pieds réalisée en une seule visite',
] as const

export default function BeautePiedsSection() {
  return (
    <section className="bg-blush/40 border-t border-nude-300/60 py-24 md:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-charcoal-500 mb-4">
          Mains &amp; pieds
        </p>
        <h2 className="font-serif text-4xl md:text-5xl font-light text-dark leading-tight">
          Beauté des pieds &amp; pédicure à Gentilly
        </h2>
        <div className="h-px w-16 bg-coral/40 mx-auto mt-8 mb-8" />
        <p className="font-sans text-base text-charcoal-700 leading-relaxed max-w-xl mx-auto mb-10">
          Vos pieds méritent le même soin que vos mains. Soin complet, cuticules et pose de
          vernis semi-permanent longue tenue sur les orteils, pour des pieds impeccables
          toute l&apos;année, sandales comprises.
        </p>
        <ul className="flex flex-col gap-3 max-w-md mx-auto text-left mb-10">
          {POINTS.map((p) => (
            <li key={p} className="flex items-start gap-3 font-sans text-sm text-charcoal-700 leading-relaxed">
              <span aria-hidden="true" className="text-coral mt-0.5">✓</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/booking?category=PIEDS"
            className="rounded-md bg-dark text-cream text-sm px-8 py-4 tracking-[0.18em] font-sans text-center transition-colors duration-300 hover:bg-coral-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-blush"
          >
            Réserver une beauté des pieds
          </Link>
          <Link
            href="/beaute-des-pieds-noisy-le-grand"
            className="rounded-md border border-dark/25 text-dark text-sm px-8 py-4 tracking-[0.18em] font-sans text-center transition-colors duration-300 hover:border-dark hover:bg-blush/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-blush"
          >
            En savoir plus
          </Link>
        </div>
      </div>
    </section>
  )
}
