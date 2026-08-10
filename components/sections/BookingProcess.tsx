import Link from 'next/link'

const STEPS = [
  {
    n: '01',
    title: 'Choisir',
    body: 'Sélectionnez votre prestation parmi nos soins manucure, gel, nail art ou cils.',
  },
  {
    n: '02',
    title: 'Réserver',
    body: 'Choisissez votre date et l\'horaire qui vous convient, du lundi au samedi, en moins d\'une minute.',
  },
  {
    n: '03',
    title: 'Visite',
    body: 'Présentez-vous à l’institut à Gentilly. Café offert pendant la prestation.',
  },
  {
    n: '04',
    title: 'Profitez',
    body: 'Des ongles nets, une finition qui tient. On peaufine ensemble avant que vous repartiez.',
  },
] as const

export default function BookingProcess() {
  return (
    <section className="bg-blush border-t border-nude-300/60 py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16 md:mb-20">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-charcoal-500 mb-4">
            Comment ça marche
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-dark leading-tight">
            Votre rendez-vous en 4 étapes
          </h2>
          <div className="h-px w-16 bg-coral/40 mx-auto mt-8" />
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 relative">
          {STEPS.map((s, i) => (
            <li key={s.n} className="relative text-center sm:text-left">
              {/* connector line (decorative, desktop only) */}
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="hidden lg:block absolute top-5 left-14 right-[-3rem] h-px bg-coral/25"
                />
              )}
              <p className="font-serif text-4xl text-coral/80 font-light mb-3">{s.n}</p>
              <h3 className="font-serif text-2xl text-dark font-light mb-2">{s.title}</h3>
              <p className="font-sans text-sm text-dark/55 leading-relaxed">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-16 text-center">
          <Link
            href="/booking"
            className="inline-block bg-dark text-cream text-sm px-10 py-4 tracking-widest font-sans hover:bg-coral-dark transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-blush"
          >
            Prendre rendez-vous →
          </Link>
        </div>
      </div>
    </section>
  )
}
