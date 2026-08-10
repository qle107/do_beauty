import type { Metadata } from 'next'
import Image from 'next/image'
import JsonLd from '@/components/seo/JsonLd'
import { personSchema } from '@/lib/seo/schema'

// Inline lucide-style icons (stroke = currentColor, so text-coral tints them terracotta).
function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.49 4.04 3 5.5l7 7Z" />
    </svg>
  )
}
function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
function TrainIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="16" height="16" x="4" y="3" rx="2" />
      <path d="M4 11h16" />
      <path d="M12 3v8" />
      <path d="m8 19-2 3" />
      <path d="m18 22-2-3" />
      <path d="M8 15h.01" />
      <path d="M16 15h.01" />
    </svg>
  )
}

export const metadata: Metadata = {
  title: 'À propos · Do Beauty à Gentilly',
  description: 'Do Beauty, institut de beauté et onglerie à Gentilly (94) : manucure, vernis semi-permanent, pose de cils et épilation, sur rendez-vous.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream pt-28">
      <JsonLd data={personSchema()} />
      {/* Section principale - Vy */}
      <section className="mx-auto max-w-7xl px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-script text-coral text-2xl mb-4">Notre histoire</p>
            <h1 className="font-serif text-5xl md:text-6xl font-light text-dark leading-tight mb-8">
              La beauté comme rituel, pas comme routine.
            </h1>
            <div className="h-px bg-coral/40 w-20 mb-8" />
            <p className="font-sans text-base text-charcoal-500 leading-relaxed mb-6">
              Do Beauty, c&apos;est un petit institut de beauté à Gentilly. On y prend le temps :
              chaque cliente est reçue dans un espace calme, sans la précipitation des grands salons.
            </p>
            <p className="font-sans text-base text-charcoal-500 leading-relaxed">
              Manucure, vernis semi-permanent, pose de cils, épilation : chaque prestation est faite
              à la main, avec des produits pros — Diamond &amp; OPI — pour un résultat net et qui tient.
            </p>
          </div>

          <div className="photo-tint relative h-[500px] overflow-hidden">
            <Image
              src="/images/entrance.png"
              alt="L'espace beauté Do Beauty à Gentilly"
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Profil Vy */}
      <section className="bg-blush py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="font-serif text-4xl font-light text-dark text-center mb-16">Votre experte</h2>
          <div className="flex flex-col md:flex-row gap-16 items-center max-w-3xl mx-auto">
            <div className="photo-tint relative w-64 h-80 shrink-0 overflow-hidden">
              <Image
                src="/images/dob/testimonial.jpg"
                alt="L'équipe Do Beauty à Gentilly"
                fill
                sizes="(max-width: 768px) 256px, 256px"
                loading="lazy"
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-serif text-3xl font-light text-dark mb-1">Notre équipe</h3>
              <p className="font-sans text-sm text-coral tracking-wider mb-6">Fondatrice &amp; Experte Beauté</p>
              <p className="font-sans text-base text-charcoal-500 leading-relaxed">
                Derrière Do Beauty, une petite équipe qui fait ce métier tous les jours : manucure, nail art,
                cils, épilation. On prend le temps de vous conseiller selon vos ongles et vos envies,
                sans jamais pousser à la prestation.
              </p>
              <ul className="mt-6 flex flex-col gap-2 text-sm font-sans text-charcoal-500">
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 shrink-0 text-coral" />
                  <span>Spécialiste manucure &amp; nail art</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 shrink-0 text-coral" />
                  <span>Extensions de cils certifiées</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 shrink-0 text-coral" />
                  <span>Épilation à la cire professionnelle</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 shrink-0 text-coral" />
                  <span>Produits Diamond &amp; OPI</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Nos valeurs */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <h2 className="font-serif text-3xl md:text-4xl font-light text-dark text-center mb-10 md:mb-16">Ce qui nous anime</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {[
            { icon: HeartIcon, title: 'Soin', body: 'On travaille en douceur, sans jamais vous presser. Si une étape vous gêne, on adapte.' },
            { icon: StarIcon, title: 'Excellence', body: 'Nous utilisons uniquement des produits professionnels - Diamond & OPI - pour des résultats qui durent.' },
            { icon: HomeIcon, title: 'Proximité', body: 'On vous reçoit sur rendez-vous, une cliente à la fois. Ici, vous n\'êtes pas un numéro.' },
          ].map((v) => (
            <div key={v.title} className="text-center">
              <span className="mb-4 inline-flex text-coral">
                <v.icon className="h-8 w-8" />
              </span>
              <h3 className="font-serif text-2xl font-light text-dark mb-3">{v.title}</h3>
              <p className="font-sans text-sm text-charcoal-500 leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Informations pratiques */}
      <section className="bg-blush py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-serif text-3xl font-light text-dark mb-8">Informations pratiques</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm font-sans">
            <div>
              <p className="text-dark/40 tracking-wider uppercase text-xs mb-2">Horaires</p>
              <p className="text-dark font-medium">Lun – Sam</p>
              <p className="text-charcoal-500">10h00 – 19h30</p>
            </div>
            <div>
              <p className="text-dark/40 tracking-wider uppercase text-xs mb-2">Adresse</p>
              <p className="text-dark font-medium">12 Avenue Jean Jaurès</p>
              <p className="text-charcoal-500">94250 Gentilly</p>
              <p className="text-dark/40 text-xs mt-1 flex items-center justify-center gap-1.5">
                <TrainIcon className="h-3.5 w-3.5 shrink-0" />
                RER B — Gentilly
              </p>
            </div>
            <div>
              <p className="text-dark/40 tracking-wider uppercase text-xs mb-2">Paiement</p>
              <p className="text-dark font-medium">Carte bancaire et espèces</p>
              <p className="text-charcoal-500 text-xs mt-1">Nous n&apos;acceptons pas les cartes bancaires</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
