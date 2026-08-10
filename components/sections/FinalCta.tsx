import Link from 'next/link'
import { site } from '@/lib/site'

export default function FinalCta() {
  return (
    <section className="bg-dark text-cream py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="font-script text-coral-light text-3xl md:text-4xl mb-5 pb-1">
          Votre prochain rendez-vous
        </p>
        <h2 className="font-serif text-4xl md:text-6xl font-light leading-tight mb-8">
          est dans 3 clics.
        </h2>
        <div className="h-px w-16 bg-coral-light/60 mx-auto mb-10" />

        <p className="font-sans text-sm md:text-base text-cream/70 mb-12 leading-relaxed max-w-xl mx-auto">
          Réservez en moins d&apos;une minute, du lundi au samedi, directement depuis votre mobile.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-center">
          <Link
            href="/booking"
            className="rounded-md bg-cream text-dark text-sm px-10 py-4 tracking-[0.18em] font-sans transition-colors duration-300 hover:bg-blush focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
          >
            Prendre rendez-vous
          </Link>
          <a
            href={`tel:${site.phone.tel}`}
            className="rounded-md border border-cream/30 text-cream text-sm px-10 py-4 tracking-[0.18em] font-sans transition-colors duration-300 hover:border-cream hover:bg-cream/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
          >
            {site.phone.display}
          </a>
        </div>

        <p className="font-sans text-xs text-cream/75 tracking-wide mt-9">
          Réservation en 1 minute · Sans acompte · Paiement sur place
        </p>
        <p className="font-sans text-xs text-cream/60 tracking-wider mt-3">
          Ouvert du lundi au samedi · 10h–19h30 · {site.address.cityName}
        </p>
      </div>
    </section>
  )
}
