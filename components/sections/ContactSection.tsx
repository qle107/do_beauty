import Reveal from '@/components/ui/Reveal'
import { site } from '@/lib/site'

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="bg-[color:var(--db-ivory)]"
      style={{ paddingTop: 'clamp(88px,12vh,160px)', paddingBottom: 'clamp(88px,12vh,160px)' }}
    >
      <div className="db-shell">
        <div
          className="grid items-center lg:grid-cols-2"
          style={{ gap: 'clamp(32px,5vw,72px)' }}
        >
          {/* LEFT - identity + address */}
          <Reveal>
            <div>
              <p
                className="db-serif text-[color:var(--db-ink)] leading-none"
                style={{ fontSize: 'clamp(48px,8vw,96px)', letterSpacing: '.1em' }}
              >
                DO BEAUTY
              </p>

              <p className="db-eyebrow db-eyebrow--muted mt-6">
                Institut de beauté · Gentilly
              </p>

              <address className="mt-8 not-italic">
                <p className="db-serif text-[color:var(--db-ink)]" style={{ fontSize: 'clamp(20px,2.4vw,26px)', lineHeight: 1.35 }}>
                  12 Avenue Jean Jaurès
                  <br />
                  94250 Gentilly
                </p>

                <a
                  href={`tel:${site.phone.tel}`}
                  className="mt-3 block text-[color:var(--db-taupe)] transition-colors hover:text-[color:var(--db-champagne)]"
                >
                  {site.phone.display}
                </a>

                <p className="mt-1 text-[color:var(--db-taupe)]">Ouvert du lundi au samedi</p>
              </address>

              <a
                href={site.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="db-linkline mt-8 inline-block"
              >
                Voir l&apos;itinéraire →
              </a>
            </div>
          </Reveal>

          {/* RIGHT - stylized map */}
          <Reveal delay={90}>
            <figure className="overflow-hidden rounded-tl-[80px] border border-[color:var(--db-champ-line)] bg-[color:var(--db-stone)]">
              <iframe
                src={site.mapsEmbed}
                title="Carte - Do Beauty, Gentilly"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-[360px] md:h-[460px] border-0"
              />
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
