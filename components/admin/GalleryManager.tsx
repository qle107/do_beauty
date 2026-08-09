'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import imageCompression from 'browser-image-compression'
import type { GalleryCategory, GalleryImage } from '@/lib/types'

type AdminImage = GalleryImage & { url: string }

const CATEGORIES: { value: GalleryCategory; label: string }[] = [
  { value: 'nails', label: 'Ongles' },
  { value: 'eyes', label: 'Cils & regard' },
  { value: 'pedicure', label: 'Pédicure' },
  { value: 'studio', label: 'Institut' },
  { value: 'other', label: 'Autre' },
]

// Filter tabs: "Tout" + every category.
const TABS: { value: 'all' | GalleryCategory; label: string }[] = [
  { value: 'all', label: 'Tout' },
  ...CATEGORIES,
]

// Suggested tags per category (quick-add). Free typing is still allowed, so the
// tag system stays fully data-driven.
const SUGGESTED: Record<GalleryCategory, string[]> = {
  nails: ['manucure', 'semi-permanent', 'gel', 'nail-art', 'french', 'nude', 'chrome', 'pédicure'],
  eyes: ['cils', 'extension', 'volume-russe', 'cil-à-cil', 'rehaussement', 'teinture', 'sourcils'],
  pedicure: ['pédicure', 'spa', 'vernis', 'gel', 'soin-pieds', 'callosités'],
  studio: ['institut', 'intérieur', 'ambiance'],
  other: ['institut', 'ambiance', 'équipe'],
}

const empty = {
  title: '',
  alt: '',
  category: 'nails' as GalleryCategory,
  tags: [] as string[],
  published: true,
  featured: false,
}

type Tri = '' | 'yes' | 'no'
type BulkState = { category: '' | GalleryCategory; addTag: string; published: Tri; featured: Tri }

export default function GalleryManager() {
  const [images, setImages] = useState<AdminImage[]>([])
  const [loading, setLoading] = useState(true)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null) // data URL (new) or existing url
  const [imageData, setImageData] = useState<string | null>(null) // data URL to upload (new only)
  const [form, setForm] = useState({ ...empty })
  const [tagInput, setTagInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  // Browse / filter
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState<'all' | GalleryCategory>('all')

  // Bulk selection
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulk, setBulk] = useState<BulkState>({ category: '', addTag: '', published: '', featured: '' })
  const [bulkSubmitting, setBulkSubmitting] = useState(false)

  const fileRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/gallery?admin=true')
      if (!res.ok) throw new Error()
      setImages(await res.json())
    } catch {
      toast.error('Impossible de charger la galerie.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  function resetForm() {
    setEditingId(null)
    setPreview(null)
    setImageData(null)
    setForm({ ...empty })
    setTagInput('')
    setDragOver(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  // Shared compress → set-preview flow used by the file input and the dropzone.
  async function processFile(file: File) {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      toast.error('Format non supporté (JPEG, PNG ou WebP).')
      return
    }
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/webp',
      })
      const dataUrl = await imageCompression.getDataUrlFromFile(compressed)
      setImageData(dataUrl)
      setPreview(dataUrl)
    } catch {
      toast.error('Échec du traitement de l’image.')
    }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) await processFile(file)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) void processFile(file)
  }

  function addTag(raw: string) {
    const t = raw.trim().toLowerCase()
    if (!t) return
    setForm((f) => (f.tags.includes(t) ? f : { ...f, tags: [...f.tags, t] }))
    setTagInput('')
  }
  function removeTag(t: string) {
    setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }))
  }

  function startEdit(img: AdminImage) {
    setEditingId(img.id)
    setPreview(img.url)
    setImageData(null)
    setForm({
      title: img.title,
      alt: img.alt,
      category: img.category,
      tags: img.tags,
      published: img.published,
      featured: img.featured ?? false,
    })
    setTagInput('')
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.alt.trim()) {
      toast.error('Le texte alternatif est requis.')
      return
    }
    if (!editingId && !imageData) {
      toast.error('Choisissez une image à téléverser.')
      return
    }
    setSubmitting(true)
    try {
      if (editingId) {
        const res = await fetch(`/api/gallery/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: form.title,
            alt: form.alt,
            category: form.category,
            tags: form.tags,
            published: form.published,
            featured: form.featured,
          }),
        })
        if (!res.ok) throw new Error()
        toast.success('Réalisation mise à jour.')
      } else {
        const res = await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, image: imageData }),
        })
        if (!res.ok) throw new Error()
        toast.success('Image ajoutée à la galerie Do Beauty.')
      }
      resetForm()
      await load()
    } catch {
      toast.error('Une erreur est survenue.')
    } finally {
      setSubmitting(false)
    }
  }

  async function togglePublish(img: AdminImage) {
    try {
      const res = await fetch(`/api/gallery/${img.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !img.published }),
      })
      if (!res.ok) throw new Error()
      setImages((list) => list.map((i) => (i.id === img.id ? { ...i, published: !i.published } : i)))
    } catch {
      toast.error('Impossible de modifier la visibilité.')
    }
  }

  async function toggleFeatured(img: AdminImage) {
    try {
      const res = await fetch(`/api/gallery/${img.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !img.featured }),
      })
      if (!res.ok) throw new Error()
      setImages((list) => list.map((i) => (i.id === img.id ? { ...i, featured: !i.featured } : i)))
    } catch {
      toast.error('Impossible de modifier la vitrine.')
    }
  }

  // AI-catalog review — the owner stays in control; suggestions never auto-apply.
  async function approveSuggestion(img: AdminImage) {
    const mergedTags = Array.from(new Set([...img.tags, ...(img.suggestedTags ?? [])]))
    const category = img.suggestedCategory ?? img.category
    try {
      const res = await fetch(`/api/gallery/${img.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, tags: mergedTags, catalogStatus: 'approved' }),
      })
      if (!res.ok) throw new Error()
      setImages((list) =>
        list.map((i) => (i.id === img.id ? { ...i, category, tags: mergedTags, catalogStatus: 'approved' } : i)),
      )
      toast.success('Suggestion appliquée.')
    } catch {
      toast.error('Impossible d’appliquer la suggestion.')
    }
  }

  async function ignoreSuggestion(img: AdminImage) {
    try {
      const res = await fetch(`/api/gallery/${img.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ catalogStatus: 'approved' }),
      })
      if (!res.ok) throw new Error()
      setImages((list) => list.map((i) => (i.id === img.id ? { ...i, catalogStatus: 'approved' } : i)))
    } catch {
      toast.error('Action impossible.')
    }
  }

  async function doDelete(id: string) {
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' })
      if (!res.ok && res.status !== 204) throw new Error()
      setImages((list) => list.filter((i) => i.id !== id))
      setSelected((prev) => {
        if (!prev.has(id)) return prev
        const next = new Set(prev)
        next.delete(id)
        return next
      })
      if (editingId === id) resetForm()
      toast.success('Réalisation supprimée.')
    } catch {
      toast.error('Échec de la suppression.')
    } finally {
      setConfirmId(null)
    }
  }

  // ── Filtering (client-side) ──
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return images.filter((img) => {
      if (activeCat !== 'all' && img.category !== activeCat) return false
      if (!q) return true
      return (
        img.title.toLowerCase().includes(q) ||
        img.alt.toLowerCase().includes(q) ||
        (img.fileName?.toLowerCase().includes(q) ?? false) ||
        img.tags.some((t) => t.toLowerCase().includes(q))
      )
    })
  }, [images, search, activeCat])

  // ── Bulk selection helpers ──
  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  function selectAllVisible() {
    setSelected(new Set(filtered.map((i) => i.id)))
  }
  function clearSelection() {
    setSelected(new Set())
  }

  async function applyBulk() {
    const ids = [...selected]
    if (ids.length === 0) return
    const body: {
      ids: string[]
      category?: GalleryCategory
      addTags?: string[]
      published?: boolean
      featured?: boolean
    } = { ids }
    if (bulk.category) body.category = bulk.category
    const addTags = bulk.addTag
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
    if (addTags.length) body.addTags = addTags
    if (bulk.published) body.published = bulk.published === 'yes'
    if (bulk.featured) body.featured = bulk.featured === 'yes'

    if (
      body.category === undefined &&
      body.addTags === undefined &&
      body.published === undefined &&
      body.featured === undefined
    ) {
      toast.error('Choisissez au moins une action à appliquer.')
      return
    }

    setBulkSubmitting(true)
    try {
      const res = await fetch('/api/gallery/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error()
      const { updated } = (await res.json()) as { updated: number }
      toast.success(`${updated} image(s) mise(s) à jour.`)
      setBulk({ category: '', addTag: '', published: '', featured: '' })
      clearSelection()
      await load()
    } catch {
      toast.error('Échec de l’action groupée.')
    } finally {
      setBulkSubmitting(false)
    }
  }

  const inputCls =
    'w-full border border-[color:var(--db-line)] bg-white px-3 py-2 text-sm text-[color:var(--db-ink)] focus:border-[color:var(--db-champagne)] focus:outline-none'
  const labelCls = 'block text-[11px] uppercase tracking-[0.16em] text-[color:var(--db-taupe)] mb-1'
  const bulkInputCls =
    'border border-[color:var(--db-line)] bg-white px-2.5 py-1.5 text-xs text-[color:var(--db-ink)] focus:border-[color:var(--db-champagne)] focus:outline-none cursor-pointer'

  const publishedCount = images.filter((i) => i.published).length

  return (
    <div className="space-y-10">
      {/* ── Add / edit form ── */}
      <div ref={formRef} className="rounded-sm border border-[color:var(--db-line)] bg-[color:var(--db-ivory)] p-5 md:p-6">
        <h2 className="db-serif text-2xl text-[color:var(--db-ink)]">
          {editingId ? 'Modifier la réalisation' : 'Ajouter à la galerie'}
        </h2>

        <form onSubmit={submit} className="mt-5 grid gap-5 md:grid-cols-[220px_1fr]">
          {/* Preview / upload */}
          <div>
            {editingId ? (
              <div className="relative aspect-[4/5] w-full overflow-hidden border border-[color:var(--db-line)] bg-[color:var(--db-stone)]">
                {preview ? (
                  <Image src={preview} alt="Aperçu" fill sizes="220px" className="object-cover" unoptimized />
                ) : (
                  <div className="flex h-full items-center justify-center px-4 text-center text-xs text-[color:var(--db-taupe)]">
                    Aperçu de l’image
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOver(true)
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                aria-label="Téléverser une image (cliquez ou glissez-déposez)"
                className={`relative block aspect-[4/5] w-full cursor-pointer overflow-hidden border bg-[color:var(--db-stone)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--db-champagne)] ${
                  dragOver ? 'border-dashed border-[color:var(--db-champagne)]' : 'border-[color:var(--db-line)]'
                }`}
              >
                {preview ? (
                  <Image src={preview} alt="Aperçu" fill sizes="220px" className="object-cover" unoptimized />
                ) : (
                  <span className="flex h-full items-center justify-center px-4 text-center text-xs text-[color:var(--db-taupe)]">
                    Glissez une image ici ou cliquez pour téléverser
                  </span>
                )}
                {dragOver && (
                  <span className="absolute inset-0 flex items-center justify-center bg-[color:var(--db-ivory)]/80 text-xs uppercase tracking-[0.16em] text-[color:var(--db-champagne)]">
                    Déposez l’image
                  </span>
                )}
              </button>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onFile}
              className="sr-only"
            />

            {!editingId && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="db-btn db-btn--ghost mt-3 w-full cursor-pointer text-center"
              >
                {preview ? 'Changer l’image' : 'Téléverser une image'}
              </button>
            )}
            {editingId && (
              <p className="mt-2 text-[11px] text-[color:var(--db-taupe)]">
                L’image ne peut pas être remplacée&nbsp;; modifiez le classement ci-contre.
              </p>
            )}
          </div>

          {/* Fields */}
          <div className="space-y-4">
            <div>
              <label className={labelCls} htmlFor="g-title">Titre</label>
              <input
                id="g-title"
                className={inputCls}
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Manucure nude"
              />
            </div>

            <div>
              <label className={labelCls} htmlFor="g-cat">Catégorie</label>
              <select
                id="g-cat"
                className={`${inputCls} cursor-pointer`}
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as GalleryCategory }))}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>Tags</label>
              <div className="mb-2 flex flex-wrap gap-1.5">
                {form.tags.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => removeTag(t)}
                    className="cursor-pointer rounded-full border border-[color:var(--db-champagne)] px-2.5 py-0.5 text-[11px] text-[color:var(--db-ink-soft)]"
                    title="Retirer"
                  >
                    {t} ✕
                  </button>
                ))}
              </div>
              <input
                className={inputCls}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault()
                    addTag(tagInput)
                  }
                }}
                placeholder="Tapez un tag puis Entrée"
                aria-label="Ajouter un tag"
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {SUGGESTED[form.category]
                  .filter((t) => !form.tags.includes(t))
                  .map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => addTag(t)}
                      className="cursor-pointer rounded-full border border-[color:var(--db-line)] px-2.5 py-0.5 text-[11px] text-[color:var(--db-taupe)] hover:border-[color:var(--db-champagne)]"
                    >
                      + {t}
                    </button>
                  ))}
              </div>
            </div>

            <div>
              <label className={labelCls} htmlFor="g-alt">Texte alternatif (accessibilité / SEO)</label>
              <input
                id="g-alt"
                className={inputCls}
                value={form.alt}
                onChange={(e) => setForm((f) => ({ ...f, alt: e.target.value }))}
                placeholder="Manucure nude réalisée chez Do Beauty"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-[color:var(--db-ink)]">
                <input
                  type="checkbox"
                  className="cursor-pointer accent-[color:var(--db-champagne)]"
                  checked={form.published}
                  onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                />
                Publier dans la galerie publique
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-[color:var(--db-ink)]">
                <input
                  type="checkbox"
                  className="cursor-pointer accent-[color:var(--db-champagne)]"
                  checked={form.featured}
                  onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                />
                Mettre en vitrine (page d’accueil)
              </label>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <button type="submit" disabled={submitting} className="db-btn db-btn--solid cursor-pointer disabled:opacity-60">
                {submitting ? 'Enregistrement…' : editingId ? 'Enregistrer' : 'Publier'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="db-btn db-btn--ghost cursor-pointer">
                  Annuler
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* ── Existing images ── */}
      <div>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="db-serif text-2xl text-[color:var(--db-ink)]">Réalisations</h2>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--db-taupe)]">
            {images.length} images · {publishedCount} publiées
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-[color:var(--db-taupe)]">Chargement…</p>
        ) : images.length === 0 ? (
          <p className="text-sm text-[color:var(--db-taupe)]">Aucune image pour le moment.</p>
        ) : (
          <>
            {/* Search + category tabs */}
            <div className="mb-4 space-y-3">
              <div>
                <label htmlFor="g-search" className="sr-only">Rechercher une réalisation</label>
                <input
                  id="g-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher (titre, alt, tag, fichier)…"
                  className={inputCls}
                />
              </div>
              <div role="group" aria-label="Filtrer par catégorie" className="flex flex-wrap gap-1.5">
                {TABS.map((t) => {
                  const on = activeCat === t.value
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setActiveCat(t.value)}
                      aria-pressed={on}
                      className={`cursor-pointer rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.12em] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--db-champagne)] ${
                        on
                          ? 'border-[color:var(--db-champagne)] bg-[color:var(--db-champagne)] text-white'
                          : 'border-[color:var(--db-line)] text-[color:var(--db-taupe)] hover:border-[color:var(--db-champagne)]'
                      }`}
                    >
                      {t.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {filtered.length === 0 ? (
              <p className="text-sm text-[color:var(--db-taupe)]">Aucune image ne correspond à votre recherche.</p>
            ) : (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {filtered.map((img) => {
                  const isSelected = selected.has(img.id)
                  const suggested = img.catalogStatus === 'suggested'
                  return (
                    <li
                      key={img.id}
                      className={`group overflow-hidden rounded-sm border bg-white ${
                        isSelected ? 'border-[color:var(--db-champagne)] ring-1 ring-[color:var(--db-champagne)]' : 'border-[color:var(--db-line)]'
                      }`}
                    >
                      <div className="relative aspect-[4/5] bg-[color:var(--db-stone)]">
                        <Image src={img.url} alt={img.alt} fill sizes="(max-width:640px) 50vw, 25vw" className="object-cover" />

                        {/* Bulk-select checkbox */}
                        <label className="absolute left-2 top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm bg-white/85 backdrop-blur">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(img.id)}
                            className="h-4 w-4 cursor-pointer accent-[color:var(--db-champagne)]"
                            aria-label={`Sélectionner ${img.title || img.alt}`}
                          />
                        </label>

                        {/* Featured star toggle */}
                        <button
                          type="button"
                          onClick={() => toggleFeatured(img)}
                          aria-pressed={!!img.featured}
                          aria-label={img.featured ? 'Retirer de la vitrine' : 'Mettre en vitrine'}
                          title={img.featured ? 'En vitrine' : 'Mettre en vitrine'}
                          className="absolute right-2 top-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/85 text-base leading-none backdrop-blur focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--db-champagne)]"
                        >
                          <span className={img.featured ? 'text-[color:var(--db-champagne)]' : 'text-[color:var(--db-taupe)]'}>
                            {img.featured ? '★' : '☆'}
                          </span>
                        </button>

                        {!img.published && (
                          <span className="absolute bottom-2 left-2 bg-[color:var(--db-ink)] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[color:var(--db-ivory)]">
                            Brouillon
                          </span>
                        )}
                      </div>

                      <div className="p-2.5">
                        <p className="truncate text-xs text-[color:var(--db-ink)]" title={img.title || img.alt}>
                          {img.title || img.alt}
                        </p>
                        <p className="mt-0.5 text-[10px] uppercase tracking-wide text-[color:var(--db-taupe)]">
                          {CATEGORIES.find((c) => c.value === img.category)?.label}
                        </p>

                        {/* AI suggestion review */}
                        {suggested && (
                          <div className="mt-2 rounded-sm border border-[color:var(--db-champagne)] bg-[color:var(--db-ivory)] p-2">
                            <p className="text-[10px] uppercase tracking-[0.14em] text-[color:var(--db-champagne)]">Suggestion</p>
                            {img.suggestedCategory && (
                              <p className="mt-1 text-[11px] text-[color:var(--db-ink-soft)]">
                                Catégorie&nbsp;: {CATEGORIES.find((c) => c.value === img.suggestedCategory)?.label ?? img.suggestedCategory}
                              </p>
                            )}
                            {img.suggestedTags && img.suggestedTags.length > 0 && (
                              <p className="mt-0.5 text-[11px] text-[color:var(--db-ink-soft)]">
                                Tags&nbsp;: {img.suggestedTags.join(', ')}
                              </p>
                            )}
                            <div className="mt-1.5 flex gap-3 text-[11px]">
                              <button
                                type="button"
                                onClick={() => approveSuggestion(img)}
                                className="cursor-pointer font-medium text-[color:var(--db-champagne)] underline underline-offset-2"
                              >
                                Approuver
                              </button>
                              <button
                                type="button"
                                onClick={() => ignoreSuggestion(img)}
                                className="cursor-pointer text-[color:var(--db-taupe)] underline underline-offset-2"
                              >
                                Ignorer
                              </button>
                            </div>
                          </div>
                        )}

                        {confirmId === img.id ? (
                          <div className="mt-2 text-[11px]">
                            <span className="text-[color:var(--db-ink-soft)]">Supprimer&nbsp;?</span>
                            <div className="mt-1 flex gap-2">
                              <button onClick={() => doDelete(img.id)} className="cursor-pointer text-red-600 underline">Oui</button>
                              <button onClick={() => setConfirmId(null)} className="cursor-pointer text-[color:var(--db-taupe)] underline">Non</button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
                            <button onClick={() => startEdit(img)} className="cursor-pointer text-[color:var(--db-ink-soft)] underline underline-offset-2 hover:text-[color:var(--db-champagne)]">
                              Modifier
                            </button>
                            <button onClick={() => togglePublish(img)} className="cursor-pointer text-[color:var(--db-ink-soft)] underline underline-offset-2 hover:text-[color:var(--db-champagne)]">
                              {img.published ? 'Masquer' : 'Publier'}
                            </button>
                            <button onClick={() => setConfirmId(img.id)} className="cursor-pointer text-red-600/80 underline underline-offset-2 hover:text-red-600">
                              Supprimer
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}

            {/* ── Sticky bulk action bar ── */}
            {selected.size > 0 && (
              <div className="sticky bottom-4 z-20 mt-4 rounded-sm border border-[color:var(--db-champagne)] bg-[color:var(--db-ink)] p-3 text-[color:var(--db-ivory)] shadow-lg">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs uppercase tracking-[0.16em] text-[color:var(--db-ivory)]">
                    Sélection&nbsp;: {selected.size}
                  </span>

                  <div className="mx-1 flex gap-2 text-[11px]">
                    <button type="button" onClick={selectAllVisible} className="cursor-pointer underline underline-offset-2 hover:text-[color:var(--db-champagne)]">
                      Tout sélectionner
                    </button>
                    <button type="button" onClick={clearSelection} className="cursor-pointer underline underline-offset-2 hover:text-[color:var(--db-champagne)]">
                      Effacer
                    </button>
                  </div>

                  <span className="mx-1 hidden h-4 w-px bg-white/20 sm:inline-block" aria-hidden />

                  <label className="sr-only" htmlFor="bulk-cat">Catégorie groupée</label>
                  <select
                    id="bulk-cat"
                    value={bulk.category}
                    onChange={(e) => setBulk((b) => ({ ...b, category: e.target.value as '' | GalleryCategory }))}
                    className={bulkInputCls}
                  >
                    <option value="">Catégorie —</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>

                  <label className="sr-only" htmlFor="bulk-tags">Tags à ajouter</label>
                  <input
                    id="bulk-tags"
                    value={bulk.addTag}
                    onChange={(e) => setBulk((b) => ({ ...b, addTag: e.target.value }))}
                    placeholder="Ajouter des tags (séparés par ,)"
                    className={`${bulkInputCls} min-w-[12rem] flex-1`}
                  />

                  <label className="sr-only" htmlFor="bulk-pub">Visibilité groupée</label>
                  <select
                    id="bulk-pub"
                    value={bulk.published}
                    onChange={(e) => setBulk((b) => ({ ...b, published: e.target.value as Tri }))}
                    className={bulkInputCls}
                  >
                    <option value="">Visibilité —</option>
                    <option value="yes">Publier</option>
                    <option value="no">Masquer</option>
                  </select>

                  <label className="sr-only" htmlFor="bulk-feat">Vitrine groupée</label>
                  <select
                    id="bulk-feat"
                    value={bulk.featured}
                    onChange={(e) => setBulk((b) => ({ ...b, featured: e.target.value as Tri }))}
                    className={bulkInputCls}
                  >
                    <option value="">Vitrine —</option>
                    <option value="yes">Mettre en avant</option>
                    <option value="no">Retirer</option>
                  </select>

                  <button
                    type="button"
                    onClick={applyBulk}
                    disabled={bulkSubmitting}
                    className="cursor-pointer border border-[color:var(--db-champagne)] bg-[color:var(--db-champagne)] px-4 py-1.5 text-xs uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {bulkSubmitting ? 'Application…' : 'Appliquer'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
