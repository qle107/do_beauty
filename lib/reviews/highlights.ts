/**
 * Hand-curated review highlights - displayed by the homepage TestimonialsLive
 * section.
 *
 * Edit this file directly to refresh the rotating quotes. Pull real verbatim
 * reviews from your Google Business Profile (or any other source) and paste
 * them below. The 3 most recent in the array are rendered.
 *
 * No external API is called - costs nothing, works offline, full editorial
 * control. The live AggregateRating (4,9 / 109) on the page comes from
 * `site.rating` in `lib/site.ts` - update that file when the GBP totals shift.
 */

export type ReviewHighlight = {
  authorName: string
  authorPhotoUrl: string | null
  rating: number
  text: string
  /** Human-readable relative date in French - "il y a 2 semaines". */
  relativeTime: string
  /** Optional deep link to the specific review on Google. */
  reviewUrl: string | null
}

export const reviewHighlights: readonly ReviewHighlight[] = [
  {
    authorName: 'Sarah L.',
    authorPhotoUrl: null,
    rating: 5,
    text: "Travail impeccable, salon très propre, Vy est à l'écoute. Mes ongles tiennent 3 semaines parfaitement. Je recommande à 100 %.",
    relativeTime: 'il y a 2 semaines',
    reviewUrl: null,
  },
  {
    authorName: 'Mélanie D.',
    authorPhotoUrl: null,
    rating: 5,
    text: "J'ai testé 4 salons à Noisy avant de trouver Vy. C'est le seul où je reviens. Soin des cuticules nickel, ambiance calme, et un vrai sens du conseil sur les couleurs.",
    relativeTime: 'il y a 1 mois',
    reviewUrl: null,
  },
  {
    authorName: 'Inès K.',
    authorPhotoUrl: null,
    rating: 5,
    text: 'Très contente du résultat ! La pose est rapide et précise, Vy prend vraiment le temps de bien faire les choses. Prix corrects et salon bien décoré.',
    relativeTime: 'il y a 3 semaines',
    reviewUrl: null,
  },
]
