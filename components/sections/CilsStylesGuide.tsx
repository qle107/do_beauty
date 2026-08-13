import Link from 'next/link'
import { CILS_STYLES, type CilsStyle } from '@/lib/catalogue-cils'

// Small 5-step gauge: naturel (1) -> intense (5).
function Intensity({ level }: { level: number }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`Intensité ${level} sur 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`h-1.5 w-4 rounded-full ${i <= level ? 'bg-coral' : 'bg-dark/10'}`}
        />
      ))}
    </span>
  )
}

// Real-photo slot. Until the salon sends its own photo, show a calm placeholder
// rather than any stock or generated image.
function Photo({ style }: { style: CilsStyle }) {
  if (style.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={style.image}
        alt={`Extension de cils ${style.name} chez Do Beauty à Gentilly`}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    )
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-coral/10 to-blush text-center">
      <span className="text-2xl opacity-60">👁️</span>
      <span className="mt-1 font-sans text-[10px] uppercase tracking-widest text-charcoal-500">
        Photo à venir
      </span>
    </div>
  )
}

// ─── Rich variant: menu (/menus) ────────────────────────────────────────────
function FullGuide() {
  return (
    <div className="mb-10">
      <p className="font-sans text-sm text-charcoal-500 leading-relaxed max-w-2xl mb-6">
        Vous hésitez entre les styles ? Voici ce qui distingue chaque pose, du plus naturel au plus
        intense, pour choisir en toute confiance.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        {CILS_STYLES.map((style) => (
          <div key={style.key} className="flex gap-4 border border-dark/10 bg-white/40 p-4">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-sm">
              <Photo style={style} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-serif text-lg text-dark">{style.name}</h3>
                <span className="shrink-0 font-serif text-base text-coral">{style.priceLabel}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-3">
                <span className="font-sans text-[11px] uppercase tracking-widest text-charcoal-500">
                  {style.effect}
                </span>
                <Intensity level={style.intensity} />
              </div>
              <p className="mt-2 font-sans text-xs leading-relaxed text-charcoal-500">
                {style.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 font-sans text-xs text-charcoal-500">
        Toutes nos poses se gardent avec un remplissage toutes les 2 à 4 semaines.{' '}
        <Link href="/beaute-du-regard-gentilly" className="text-coral underline underline-offset-2">
          En savoir plus sur la beauté du regard
        </Link>
        .
      </p>
    </div>
  )
}

// ─── Compact variant: booking picker (collapsed by default) ─────────────────
function CompactGuide() {
  return (
    <details className="mx-6 mt-4 border border-dark/10 bg-white/50">
      <summary className="cursor-pointer list-none px-4 py-3 font-sans text-xs font-semibold uppercase tracking-widest text-coral/80">
        Comprendre les styles d&apos;extensions
      </summary>
      <div className="flex flex-col gap-3 px-4 pb-4">
        {CILS_STYLES.map((style) => (
          <div key={style.key}>
            <div className="flex items-center justify-between gap-3">
              <span className="font-sans text-sm text-dark">{style.name}</span>
              <Intensity level={style.intensity} />
            </div>
            <p className="mt-1 font-sans text-xs leading-relaxed text-dark/50">{style.description}</p>
          </div>
        ))}
      </div>
    </details>
  )
}

export default function CilsStylesGuide({ variant = 'full' }: { variant?: 'full' | 'compact' }) {
  return variant === 'compact' ? <CompactGuide /> : <FullGuide />
}
