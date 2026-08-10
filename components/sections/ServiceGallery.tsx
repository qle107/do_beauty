'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

// ── Data shapes (computed server-side from the gallery catalog) ──────────────
export interface GalleryShot {
  id: string
  url: string
  alt: string
  title?: string
}
export interface ServiceCategoryData {
  n: string
  key: string
  title: string
  desc: string
  /** Booking deep-link category (existing booking flow). */
  bookingCat: string
  /** Cover image URL (newest tagged shot, or a curated fallback), or null. */
  featured: string | null
  featuredAlt: string
  /** All published gallery shots for this category, newest first. */
  images: GalleryShot[]
  /** A few representative prestations (name + price in €). */
  services: { name: string; price: number }[]
}

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

// ── One editorial card ───────────────────────────────────────────────────────
function ServiceCard({
  cat,
  onOpen,
  className = '',
  variant,
}: {
  cat: ServiceCategoryData
  onOpen: () => void
  className?: string
  variant: 'tall' | 'small' | 'wide'
}) {
  const count = cat.images.length
  const titleSize =
    variant === 'tall'
      ? 'text-[clamp(28px,3vw,44px)]'
      : variant === 'wide'
        ? 'text-[clamp(26px,3vw,40px)]'
        : 'text-[clamp(22px,2.4vw,30px)]'

  return (
    <button
      type="button"
      onClick={onOpen}
      data-cursor="image"
      aria-label={`Découvrir la galerie ${cat.title}${count ? `, ${count} réalisation${count > 1 ? 's' : ''}` : ''}`}
      className={`group relative block w-full overflow-hidden bg-[color:var(--db-stone)] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--db-champagne)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--db-bg)] ${className}`}
    >
      {cat.featured ? (
        <Image
          src={cat.featured}
          alt={cat.featuredAlt}
          fill
          sizes={variant === 'tall' ? '(max-width:768px) 92vw, 55vw' : variant === 'wide' ? '100vw' : '(max-width:768px) 92vw, 30vw'}
          loading="lazy"
          className="object-cover transition-[transform,filter] duration-[900ms] ease-out will-change-transform group-hover:scale-[1.045] group-hover:brightness-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          style={{ transitionTimingFunction: EASE }}
        />
      ) : (
        // Refined placeholder until the owner publishes photos for this category.
        <div className="absolute inset-0 grid place-items-center bg-[color:var(--db-ivory)]">
          <span className="db-serif text-[color:var(--db-champagne)] text-2xl">Do Beauty</span>
        </div>
      )}

      {/* Legibility scrim - heavier at the base where the text sits */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/62 via-black/12 to-transparent opacity-90"
      />

      {/* Number, top-left */}
      <span
        aria-hidden="true"
        className="absolute left-5 top-4 db-serif text-sm tracking-wide text-white/85"
      >
        {cat.n}
      </span>

      {/* Content, bottom */}
      <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-5 md:p-6">
        <span
          className={`db-serif leading-[1.05] text-white transition-transform duration-500 ease-out group-hover:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 ${titleSize}`}
          style={{ transitionTimingFunction: EASE }}
        >
          {cat.title}
        </span>
        <span className="max-w-[42ch] text-[13px] leading-relaxed text-white/75">{cat.desc}</span>
        <span className="mt-2 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/85">
          Découvrir
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1.5 motion-reduce:transition-none"
            style={{ transitionTimingFunction: EASE }}
          >
            →
          </span>
        </span>
      </span>
    </button>
  )
}

// ── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({
  cat,
  onClose,
}: {
  cat: ServiceCategoryData
  onClose: () => void
}) {
  const [index, setIndex] = useState(0)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const touchX = useRef<number | null>(null)
  const labelId = useId()

  // Prefer real gallery shots; fall back to the cover so the panel is never blank.
  const shots: GalleryShot[] =
    cat.images.length > 0
      ? cat.images
      : cat.featured
        ? [{ id: 'cover', url: cat.featured, alt: cat.featuredAlt }]
        : []
  const total = shots.length
  const current = shots[index]

  const next = useCallback(() => setIndex((i) => (total ? (i + 1) % total : 0)), [total])
  const prev = useCallback(() => setIndex((i) => (total ? (i - 1 + total) % total : 0)), [total])

  // Keyboard: Esc closes, arrows navigate. Focus trap within the dialog.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'Tab') {
        const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, a[href], [tabindex]:not([tabindex="-1"])',
        )
        if (!nodes || nodes.length === 0) return
        const list = Array.from(nodes)
        const first = list[0]
        const last = list[list.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      opener?.focus?.()
    }
  }, [next, prev, onClose])

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal,80)] flex items-stretch justify-center bg-[rgba(20,18,16,0.82)] p-0 backdrop-blur-sm md:items-center md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelId}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        className="relative flex w-full max-w-6xl flex-col overflow-y-auto bg-[color:var(--db-bg)] md:h-auto md:max-h-[90vh] md:flex-row"
      >
        {/* Close */}
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Fermer la galerie"
          className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>

        {/* Image stage */}
        <div
          className="relative flex min-h-[46vh] flex-1 items-center justify-center bg-[color:var(--db-ink)] md:min-h-0"
          onTouchStart={(e) => { touchX.current = e.touches[0]?.clientX ?? null }}
          onTouchEnd={(e) => {
            if (touchX.current == null || total <= 1) return
            const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX.current
            if (Math.abs(dx) > 44) (dx < 0 ? next : prev)()
            touchX.current = null
          }}
        >
          {current ? (
            <Image
              key={current.id}
              src={current.url}
              alt={current.alt}
              fill
              sizes="(max-width:768px) 100vw, 60vw"
              className="object-contain motion-safe:animate-[dbfade_360ms_ease-out]"
              priority
            />
          ) : (
            <p className="p-10 text-center text-sm text-white/70">
              De nouvelles réalisations arrivent bientôt.
            </p>
          )}

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Réalisation précédente"
                className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Réalisation suivante"
                className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/35 px-3 py-1 text-[11px] tracking-[0.18em] text-white/90 backdrop-blur-sm"
                aria-live="polite"
              >
                {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </div>
            </>
          )}
        </div>

        {/* Info rail */}
        <aside className="flex w-full shrink-0 flex-col gap-5 p-6 md:w-[340px] md:p-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-[color:var(--db-champagne)]">
              {cat.n} · Do Beauty
            </p>
            <h3 id={labelId} className="db-serif mt-2 text-3xl leading-tight text-[color:var(--db-ink)]">
              {cat.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--db-ink-soft)]">{cat.desc}</p>
          </div>

          {cat.services.length > 0 && (
            <ul className="flex flex-col divide-y divide-[color:var(--db-line)] border-y border-[color:var(--db-line)]">
              {cat.services.map((s) => (
                <li key={s.name} className="flex items-baseline justify-between gap-4 py-2.5">
                  <span className="text-sm text-[color:var(--db-ink)]">{s.name}</span>
                  <span className="db-serif shrink-0 text-[color:var(--db-champagne)]">
                    dès {formatCurrency(s.price)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <Link
            href={`/booking?category=${cat.bookingCat}`}
            data-cursor="reserver"
            className="db-btn db-btn--solid mt-auto w-full justify-center text-center"
          >
            Réserver →
          </Link>
        </aside>
      </div>
    </div>
  )
}

// ── Section shell (editorial grid) ───────────────────────────────────────────
export default function ServiceGallery({ data }: { data: ServiceCategoryData[] }) {
  const [openKey, setOpenKey] = useState<string | null>(null)
  const active = data.find((c) => c.key === openKey) ?? null

  // Handle mobile swipe on the whole open lightbox
  const [manucure, nailart, regard, pieds] = data

  return (
    <div>
      {/* Editorial asymmetric grid: large cover + two stacked + one wide */}
      <div className="grid grid-cols-1 gap-3 md:h-[520px] md:grid-cols-3 md:grid-rows-2 md:gap-4 lg:h-[660px]">
        {manucure && (
          <ServiceCard
            cat={manucure}
            onOpen={() => setOpenKey(manucure.key)}
            variant="tall"
            className="aspect-[4/5] md:col-span-2 md:row-span-2 md:aspect-auto md:h-full"
          />
        )}
        {nailart && (
          <ServiceCard
            cat={nailart}
            onOpen={() => setOpenKey(nailart.key)}
            variant="small"
            className="aspect-[4/5] md:col-start-3 md:row-start-1 md:aspect-auto md:h-full"
          />
        )}
        {regard && (
          <ServiceCard
            cat={regard}
            onOpen={() => setOpenKey(regard.key)}
            variant="small"
            className="aspect-[4/5] md:col-start-3 md:row-start-2 md:aspect-auto md:h-full"
          />
        )}
      </div>

      {pieds && (
        <ServiceCard
          cat={pieds}
          onOpen={() => setOpenKey(pieds.key)}
          variant="wide"
          className="mt-3 aspect-[4/5] sm:aspect-[16/7] md:mt-4 lg:aspect-[24/7]"
        />
      )}

      {active && <Lightbox cat={active} onClose={() => setOpenKey(null)} />}
    </div>
  )
}
