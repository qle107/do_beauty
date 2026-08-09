import type { Metadata } from 'next'
import Link from 'next/link'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Laisser un avis · Do Beauty',
  description:
    'Votre avis nous aide énormément. Partagez votre expérience chez Do Beauty à Gentilly en quelques secondes sur Google.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/avis' },
}

export default function AvisPage() {
  return (
    <section className="bg-cream min-h-[70vh] flex items-center">
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="font-script text-coral text-4xl mb-4">Merci de votre visite</p>
        <h1 className="font-serif text-4xl md:text-5xl font-light text-dark leading-tight mb-6">
          Votre avis compte pour nous
        </h1>
        <div className="h-px w-16 bg-coral/40 mx-auto mb-8" />
        <p className="font-sans text-base text-charcoal-700 leading-relaxed mb-4">
          Vous avez aimé votre moment chez Do Beauty ? Un petit avis Google nous aide
          énormément et guide d&apos;autres clientes vers le salon. Cela ne prend que
          quelques secondes 💕
        </p>
        <p className="font-sans text-sm text-dark/50 mb-10">
          Vous serez redirigée vers notre fiche Google. Cliquez sur « Écrire un avis »,
          choisissez vos étoiles et laissez un mot.
        </p>
        <a
          href={site.reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-md bg-dark text-cream text-sm px-10 py-4 tracking-[0.18em] font-sans hover:bg-coral-dark transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        >
          ⭐ Laisser un avis sur Google →
        </a>
        <p className="font-sans text-xs text-dark/40 mt-10">
          Un souci lors de votre venue ? Écrivez-nous plutôt à{' '}
          <Link href="/contact" className="underline hover:text-coral transition-colors">
            contact
          </Link>. On préfère régler ça directement.
        </p>
      </div>
    </section>
  )
}
