'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import type { GalleryCategory, GalleryImagePublic } from '@/lib/types'

const CATEGORY_LABEL: Record<GalleryCategory, string> = {
  nails: 'Ongles',
  eyes: 'Cils & regard',
  pedicure: 'Pédicure',
  studio: 'Institut',
  other: 'Autre',
}

const FILTERS: { key: 'all' | GalleryCategory; label: string }[] = [
  { key: 'all', label: 'Tout' },
  { key: 'nails', label: 'Ongles' },
  { key: 'eyes', label: 'Cils & regard' },
  { key: 'pedicure', label: 'Pédicure' },
]

type SortKey = 'newest' | 'oldest'

// Parse the shareable ?tag= value: a comma list (a,b,c), trimmed + de-duped.
function parseTags(raw?: string): string[] {
  if (!raw) return []
  const out: string[] = []
  for (const part of raw.split(',')) {
    const t = part.trim()
    if (t && !out.some((x) => x.toLowerCase() === t.toLowerCase())) out.push(t)
  }
  return out
}

const INITIAL = 16
const STEP = 16

interface Props {
  images: GalleryImagePublic[]
  defaultCategory?: 'all' | GalleryCategory
  defaultTag?: string
}

export default function GalleryBrowser({ images, defaultCategory = 'all', defaultTag }: Props) {
  const [category, setCategory] = useState<'all' | GalleryCategory>(defaultCategory)
  // Multi-tag AND filter: an image must carry EVERY selected tag.
  const [tags, setTags] = useState<string[]>(() => parseTags(defaultTag))
  const [sort, setSort] = useState<SortKey>('newest')
  const [visible, setVisible] = useState(INITIAL)

  // Tags available across the whole published set (data-driven — no hardcoding).
  const allTags = useMemo(() => {
    const set = new Set<string>()
    for (const img of images) for (const t of img.tags) set.add(t)
    return Array.from(set).sort()
  }, [images])

  const filtered = useMemo(() => {
    const wanted = tags.map((t) => t.toLowerCase())
    const base = images.filter(
      (img) =>
        (category === 'all' || img.category === category) &&
        wanted.every((w) => img.tags.some((t) => t.toLowerCase() === w)),
    )
    // Sort by uploadedAt (ISO strings compare chronologically).
    return base.sort((a, b) => {
      const cmp = a.uploadedAt.localeCompare(b.uploadedAt)
      return sort === 'newest' ? -cmp : cmp
    })
  }, [images, category, tags, sort])

  const toggleTag = (t: string) =>
    setTags((prev) =>
      prev.some((x) => x.toLowerCase() === t.toLowerCase())
        ? prev.filter((x) => x.toLowerCase() !== t.toLowerCase())
        : [...prev, t],
    )

  // Keep the URL shareable (?category=&tag=) without a full navigation.
  // Multiple tags travel as a comma list (?tag=a,b) — robust to re-parse.
  useEffect(() => {
    const params = new URLSearchParams()
    if (category !== 'all') params.set('category', category)
    if (tags.length) params.set('tag', tags.join(','))
    const qs = params.toString()
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname)
  }, [category, tags])

  useEffect(() => setVisible(INITIAL), [category, tags])

  const shown = filtered.slice(0, visible)
  const remaining = filtered.length - visible

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3" role="group" aria-label="Filtrer par catégorie">
        {FILTERS.map((f) => {
          const active = category === f.key
          return (
            <button
              key={f.key}
              type="button"
              aria-pressed={active}
              onClick={() => setCategory(f.key)}
              className={[
                'px-5 py-2 text-[11px] uppercase tracking-[0.22em] transition-colors duration-200 border',
                active
                  ? 'bg-[color:var(--db-ink)] text-[color:var(--db-ivory)] border-[color:var(--db-ink)]'
                  : 'bg-transparent text-[color:var(--db-ink-soft)] border-[color:var(--db-line)] hover:border-[color:var(--db-champagne)]',
              ].join(' ')}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {/* Tag filter — multi-select, AND logic */}
      {allTags.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Filtrer par tag">
          {tags.length > 0 && (
            <button
              type="button"
              onClick={() => setTags([])}
              className="px-3 py-1 text-[11px] tracking-wide text-[color:var(--db-champagne)] underline underline-offset-4"
            >
              ✕ Réinitialiser
            </button>
          )}
          {allTags.map((t) => {
            const active = tags.some((x) => x.toLowerCase() === t.toLowerCase())
            return (
              <button
                key={t}
                type="button"
                aria-pressed={active}
                onClick={() => toggleTag(t)}
                className={[
                  'px-3 py-1 text-[11px] tracking-wide rounded-full border transition-colors duration-200',
                  active
                    ? 'border-[color:var(--db-champagne)] text-[color:var(--db-champagne)] bg-[rgba(200,166,106,0.08)]'
                    : 'border-[color:var(--db-line)] text-[color:var(--db-taupe)] hover:border-[color:var(--db-champagne)] hover:text-[color:var(--db-ink-soft)]',
                ].join(' ')}
              >
                {t}
              </button>
            )
          })}
        </div>
      )}

      {/* Sort toggle */}
      <div
        className="mt-6 flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.2em]"
        role="group"
        aria-label="Trier les réalisations"
      >
        <span className="text-[color:var(--db-taupe)]">Trier</span>
        {([
          { key: 'newest', label: 'Plus récent' },
          { key: 'oldest', label: 'Plus ancien' },
        ] as const).map((s) => {
          const active = sort === s.key
          return (
            <button
              key={s.key}
              type="button"
              aria-pressed={active}
              onClick={() => setSort(s.key)}
              className={[
                'transition-colors duration-200',
                active
                  ? 'text-[color:var(--db-ink)] underline underline-offset-4 decoration-[color:var(--db-champagne)]'
                  : 'text-[color:var(--db-taupe)] hover:text-[color:var(--db-ink-soft)]',
              ].join(' ')}
            >
              {s.label}
            </button>
          )
        })}
      </div>

      {/* Grid */}
      {shown.length === 0 ? (
        <p className="mt-16 text-center text-sm text-[color:var(--db-taupe)]">
          Aucune réalisation dans cette sélection pour le moment.
        </p>
      ) : (
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {shown.map((img) => (
            <li
              key={img.id}
              className="group relative aspect-[4/5] overflow-hidden bg-[color:var(--db-stone)]"
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading="lazy"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              {/* Hover overlay — subtle, editorial */}
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/55 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="p-3 md:p-4">
                  {img.title && (
                    <p className="db-serif text-[15px] leading-tight text-white">{img.title}</p>
                  )}
                  <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/80">
                    {CATEGORY_LABEL[img.category]}
                    {img.tags[0] ? ` · ${img.tags[0]}` : ''}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {remaining > 0 && (
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + STEP)}
            className="db-btn db-btn--ghost"
          >
            Voir plus ({remaining})
          </button>
        </div>
      )}
    </div>
  )
}
