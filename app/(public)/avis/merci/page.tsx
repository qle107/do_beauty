import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Merci pour votre avis · Do Beauty',
  description: 'Merci d\'avoir partagé votre expérience chez Do Beauty à Gentilly.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/avis/merci' },
}

export default function AvisMerciPage() {
  return (
    <section className="bg-cream min-h-[70vh] flex items-center">
      <div className="mx-auto max-w-xl px-6 py-24 text-center flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-coral/10 flex items-center justify-center">
          <span className="text-coral text-3xl">♥</span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-light text-dark leading-tight">
          Merci du fond du cœur
        </h1>
        <p className="font-sans text-base text-charcoal-700 leading-relaxed max-w-md">
          Votre avis compte énormément pour un salon indépendant comme le nôtre. Merci
          d&apos;avoir pris le temps - à très vite chez Do Beauty !
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link
            href="/booking"
            className="rounded-md bg-dark text-cream text-sm px-8 py-4 tracking-[0.18em] font-sans hover:bg-coral-dark transition-colors text-center"
          >
            Reprendre rendez-vous →
          </Link>
          <Link
            href="/"
            className="rounded-md border border-dark/25 text-dark text-sm px-8 py-4 tracking-[0.18em] font-sans hover:border-dark hover:bg-blush/40 transition-colors text-center"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </section>
  )
}
