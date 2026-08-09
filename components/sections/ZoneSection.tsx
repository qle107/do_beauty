import Link from 'next/link'
import { cities } from '@/lib/seo/cities'
import { site } from '@/lib/site'

export default function ZoneSection() {
  return (
    <section className="bg-cream border-t border-nude-300/60 py-24 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-charcoal-500 mb-4">
          Villes desservies
        </p>
        <h2 className="font-serif text-4xl md:text-5xl font-light text-dark leading-tight">
          Un institut de beauté pour Gentilly et ses environs
        </h2>
        <div className="h-px w-16 bg-coral/40 mt-8 mb-8" />
        <p className="font-sans text-base text-charcoal-700 leading-relaxed mb-6">
          Notre unique institut se trouve au {site.address.street}, à Gentilly.
          Il accueille aussi, sur rendez-vous, les clientes des communes voisines :
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cities.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/bar-a-ongles-${c.slug}`}
                className="flex items-center justify-between border border-dark/10 hover:border-coral/40 hover:bg-blush/50 transition-colors px-5 py-4 group"
              >
                <span className="font-sans text-sm text-dark group-hover:text-coral transition-colors">
                  Onglerie &amp; manucure près de {c.name}
                </span>
                <span className="font-sans text-xs text-charcoal-500">{c.driveMinutes} min</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
