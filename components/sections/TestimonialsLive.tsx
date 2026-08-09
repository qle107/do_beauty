import Link from 'next/link'
import { reviewHighlights, type ReviewHighlight } from '@/lib/reviews/highlights'
import { site } from '@/lib/site'

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Note ${rating} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          aria-hidden="true"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < Math.round(rating) ? '#EC4899' : '#FBCFE8'}
        >
          <path d="M12 17.27 18.18 21 16.54 13.97 22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: ReviewHighlight }) {
  const initials = review.authorName
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase())
    .filter(Boolean)
    .slice(0, 2)
    .join('')

  return (
    <article className="bg-white rounded-2xl border border-nude-300/60 shadow-luxe-sm p-6 md:p-7 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <div
          aria-hidden="true"
          className="w-10 h-10 rounded-full bg-blush flex items-center justify-center text-coral font-serif text-sm font-medium"
        >
          {initials || 'G'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-sans text-sm text-dark font-medium truncate">{review.authorName}</p>
          <p className="font-sans text-xs text-dark/40">{review.relativeTime}</p>
        </div>
        <Stars rating={review.rating} />
      </div>
      <p className="font-sans text-sm text-charcoal-500 leading-relaxed flex-1">
        &ldquo;{review.text}&rdquo;
      </p>
      {review.reviewUrl && (
        <a
          href={review.reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-xs text-dark/40 hover:text-coral transition-colors mt-4 self-start"
        >
          Voir sur Google →
        </a>
      )}
    </article>
  )
}

export default function TestimonialsLive() {
  const reviews = reviewHighlights.slice(0, 3)
  if (reviews.length === 0) return null

  return (
    <section className="bg-blush/40 border-t border-nude-300/60 py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-3 mb-5">
            <span
              aria-hidden="true"
              className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white shadow-sm text-xs font-bold"
              style={{ color: '#4285F4' }}
            >
              G
            </span>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-dark/55">
              Avis Google · {site.rating.value.toLocaleString('fr-FR')}/5 · {site.rating.count} avis
            </p>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-dark leading-tight">
            Ce qu&apos;elles disent de nous
          </h2>
          <div className="h-px w-16 bg-coral/40 mx-auto mt-8" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <ReviewCard key={`${r.authorName}-${i}`} review={r} />
          ))}
        </div>

        <div className="text-center mt-12 flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center">
          <Link
            href={site.social.googleBusiness}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-sans text-sm text-dark hover:text-coral transition-colors underline underline-offset-4"
          >
            Lire les {site.rating.count} avis sur Google →
          </Link>
          <Link
            href="/avis"
            className="inline-block rounded-md bg-dark text-cream text-xs px-6 py-3 tracking-[0.18em] font-sans hover:bg-coral-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            ⭐ Laisser un avis →
          </Link>
        </div>
      </div>
    </section>
  )
}
