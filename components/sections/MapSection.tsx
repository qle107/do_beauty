import { site } from '@/lib/site'
import MapEmbed from './MapEmbed'

export default function MapSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 min-h-[380px]">
      {/* Carte interactive (chargée au clic pour alléger le chargement initial) */}
      <div className="relative overflow-hidden min-h-[300px] md:min-h-[380px]">
        <MapEmbed />
      </div>

      {/* Informations */}
      <div className="bg-cream flex items-center px-12 md:px-16 py-16">
        <div>
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-dark/40 mb-4">Nous trouver</p>

          <h2 className="font-serif text-2xl md:text-3xl font-light text-dark leading-tight mb-6">
            Votre institut de beauté à Gentilly
          </h2>

          <address className="not-italic mb-8">
            <p className="font-serif text-lg font-light text-dark mb-1">{site.name}</p>
            <p className="font-sans text-sm text-charcoal-500 leading-relaxed">
              {site.address.street}<br />
              {site.address.city}
            </p>
            <p className="font-sans text-xs text-dark/40 mt-2">🚇 {site.address.transit}</p>
          </address>

          <p className="font-sans text-sm text-charcoal-500 leading-relaxed mb-8">
            À Gentilly, aux portes de Paris (13e &amp; 14e), facilement accessible en
            transports. Stationnement à proximité.
          </p>

          <div className="flex flex-col gap-1.5 mb-8">
            <p className="font-sans text-xs tracking-[0.25em] uppercase text-dark/40 mb-2">Horaires</p>
            <p className="font-sans text-sm text-charcoal-500">Lundi – Dimanche &nbsp; <span className="text-dark font-medium">{site.hours.open} – {site.hours.close}</span></p>
          </div>

          <a
            href={site.social.googleBusiness}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-dark text-dark text-xs px-7 py-3 tracking-widest font-sans hover:bg-dark hover:text-cream transition-all duration-200"
          >
            Itinéraire ↗
          </a>
        </div>
      </div>
    </section>
  )
}
