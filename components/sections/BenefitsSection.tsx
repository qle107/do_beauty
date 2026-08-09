const AVANTAGES = [
  {
    title: 'Réservation en ligne',
    body: 'Un créneau en moins d\'une minute, 7 jours sur 7, directement depuis votre mobile.',
  },
  {
    title: 'Tenue longue durée',
    body: 'Semi-permanent et gel qui gardent leur éclat trois à quatre semaines.',
  },
  {
    title: 'Accueil chaleureux',
    body: 'Un moment rien que pour vous, café offert, dans un cadre intime et soigné.',
  },
  {
    title: 'Résultat soigné',
    body: 'Une finition impeccable à chaque visite, pensée sur mesure pour vos mains.',
  },
] as const

export default function BenefitsSection() {
  return (
    <section className="bg-cream border-t border-nude-300/60 py-24 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-2xl mb-16 md:mb-20">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-charcoal-500 mb-4">
            Pourquoi Do Beauty
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-dark leading-[1.1]">
            Le souci du détail,<br className="hidden sm:block" /> à chaque visite.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-14 gap-y-12">
          {AVANTAGES.map((a) => (
            <div key={a.title}>
              <span aria-hidden="true" className="block h-px w-8 bg-coral/50 mb-5" />
              <h3 className="font-serif text-xl md:text-2xl font-light text-dark mb-2.5">
                {a.title}
              </h3>
              <p className="font-sans text-sm text-charcoal-700 leading-relaxed max-w-sm">
                {a.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
