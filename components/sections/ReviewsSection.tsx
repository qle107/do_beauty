import Reveal from '@/components/ui/Reveal'
import { site } from '@/lib/site'

const REVIEWS = [
  'Un accueil délicat et un résultat impeccable. Je recommande.',
  'Très à l’écoute, travail précis et soigné. Le rendez-vous est toujours un vrai moment.',
  'Des ongles sublimes à chaque visite. On ressort ravie.',
]

function ReviewCard({ quote }: { quote: string }) {
  return (
    <figure className="bg-[color:var(--db-white)] border border-[color:var(--db-line)] p-6 rounded-[2px]">
      <span
        aria-hidden="true"
        className="db-serif text-[color:var(--db-champagne)] text-3xl leading-none"
      >
        ”
      </span>
      <blockquote className="db-serif italic text-[16px] text-[color:var(--db-ink-soft)] leading-relaxed mt-2">
        {quote}
      </blockquote>
      <figcaption className="text-[11px] uppercase tracking-[.2em] text-[color:var(--db-taupe)] mt-5">
        Avis Google
      </figcaption>
    </figure>
  )
}

export default function ReviewsSection() {
  const { value, count } = site.rating

  return (
    <section id="avis" className="db-section bg-[color:var(--db-bg)]">
      <div className="db-shell">
        <Reveal>
          <p className="db-eyebrow">Avis</p>

          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mt-3">
            <span className="db-serif text-[clamp(38px,7vw,52px)] text-[color:var(--db-ink)] leading-none">
              {value}
            </span>
            <span
              aria-hidden="true"
              className="text-[color:var(--db-champagne)] tracking-[.15em]"
            >
              ★★★★★
            </span>
            <span className="text-[color:var(--db-taupe)] text-sm">
              {count} avis Google
            </span>
          </div>

          <a
            href={site.social.googleBusiness}
            target="_blank"
            rel="noopener noreferrer"
            className="db-linkline mt-6 inline-block"
          >
            Voir sur Google →
          </a>

          {/* Mobile: swipe carousel */}
          <div className="db-hscroll no-scrollbar -mx-[var(--db-gutter)] px-[var(--db-gutter)] mt-8 md:hidden">
            {REVIEWS.map((quote) => (
              <div key={quote} className="db-snap w-[80vw] max-w-[340px]">
                <ReviewCard quote={quote} />
              </div>
            ))}
          </div>

          {/* Desktop: grid */}
          <div className="hidden md:grid grid-cols-3 gap-4 mt-10">
            {REVIEWS.map((quote) => (
              <ReviewCard key={quote} quote={quote} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
