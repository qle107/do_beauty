import { site } from '@/lib/site'

const GOOGLE_COLORS = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#4285F4'] as const

function Star({ filled, color }: { filled: number; color: string }) {
  // filled is 0..1 indicating proportion
  return (
    <span aria-hidden="true" className="relative inline-block w-3.5 h-3.5">
      <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full text-dark/15" fill="currentColor">
        <path d="M12 17.27 18.18 21 16.54 13.97 22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
      <span style={{ width: `${filled * 100}%` }} className="absolute inset-y-0 left-0 overflow-hidden">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill={color}>
          <path d="M12 17.27 18.18 21 16.54 13.97 22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      </span>
    </span>
  )
}

export default function GoogleRatingBadge({ className = '' }: { className?: string }) {
  const value = site.rating.value
  const full = Math.floor(value)
  const partial = value - full

  return (
    <a
      href={site.social.googleBusiness}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Note ${site.rating.value.toLocaleString('fr-FR')} sur 5 - voir les ${site.rating.count} avis Google`}
      className={`inline-flex items-center gap-2 group ${className}`}
    >
      <span
        aria-hidden="true"
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white shadow-sm text-[10px] font-bold"
        style={{ color: '#4285F4' }}
      >
        G
      </span>
      <span className="inline-flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const f = i < full ? 1 : i === full ? partial : 0
          return <Star key={i} filled={f} color={GOOGLE_COLORS[i % GOOGLE_COLORS.length]} />
        })}
      </span>
      <span className="font-sans text-xs tracking-wide text-dark/75 group-hover:text-coral transition-colors">
        <strong className="font-semibold text-dark">{site.rating.value.toLocaleString('fr-FR')}/5</strong>
        <span className="text-dark/45"> · {site.rating.count} avis Google</span>
      </span>
    </a>
  )
}
