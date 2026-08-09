import Reveal from '@/components/ui/Reveal'
import { site } from '@/lib/site'

export default function RatingSection() {
  const { value, count } = site.rating
  const ratingLabel = String(value).replace('.', ',')

  return (
    <section
      className="bg-[color:var(--db-bg)]"
      style={{ paddingTop: 'clamp(96px,13vh,170px)', paddingBottom: 'clamp(96px,13vh,170px)' }}
    >
      <div className="db-shell">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <span className="db-rule w-12" aria-hidden="true" />

            <p
              className="db-serif text-[color:var(--db-ink)] mt-8"
              style={{ fontSize: 'clamp(72px,12vw,140px)', lineHeight: 1 }}
            >
              {value}
            </p>

            <p
              className="mt-4 text-xl"
              style={{ color: 'var(--db-champagne)', letterSpacing: '.2em' }}
              aria-label={`Note ${ratingLabel} sur 5`}
            >
              ★★★★★
            </p>

            <p
              className="mt-5 text-xs uppercase text-[color:var(--db-taupe)]"
              style={{ letterSpacing: '.22em' }}
            >
              {count} avis Google
            </p>

            <a
              href={site.social.googleBusiness}
              target="_blank"
              rel="noopener noreferrer"
              className="db-linkline mt-6"
            >
              Voir les avis →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
