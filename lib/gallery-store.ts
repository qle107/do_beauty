import { getPool, ensureSchema, dbConfigured } from '@/lib/db'
import { readJson, writeJson } from '@/lib/json-store'
import { getGalleryStorage } from '@/lib/gallery-storage'
import type { GalleryImage, GalleryImagePublic, GalleryCategory, CatalogStatus } from '@/lib/types'
import type { GalleryBulkInput } from '@/lib/validations'
import type { RowDataPacket, ResultSetHeader } from 'mysql2'

const JSON_FILE = 'gallery.json'

// ─── Row mapping ───────────────────────────────────────────────────────────

interface GalleryRow extends RowDataPacket {
  id: string
  title: string
  alt: string
  category: string
  tags: string | null
  published: number
  featured: number | null
  storage: string
  src: string | null
  file_name: string | null
  drive_file_id: string | null
  width: number | null
  height: number | null
  catalog_status: string | null
  suggested_category: string | null
  suggested_tags: string | null
  uploaded_at: string
  created_at: string
  updated_at: string
}

function parseTags(raw: string | null): string[] {
  if (!raw) return []
  try {
    const v = JSON.parse(raw)
    return Array.isArray(v) ? v.filter((t): t is string => typeof t === 'string') : []
  } catch {
    return []
  }
}

function rowToImage(r: GalleryRow): GalleryImage {
  return {
    id: r.id,
    title: r.title,
    alt: r.alt,
    category: r.category as GalleryCategory,
    tags: parseTags(r.tags),
    published: !!r.published,
    featured: !!r.featured,
    storage: r.storage as GalleryImage['storage'],
    src: r.src ?? undefined,
    fileName: r.file_name ?? undefined,
    driveFileId: r.drive_file_id ?? undefined,
    width: r.width ?? undefined,
    height: r.height ?? undefined,
    catalogStatus: (r.catalog_status as CatalogStatus | null) ?? undefined,
    suggestedCategory: (r.suggested_category as GalleryCategory | null) ?? undefined,
    suggestedTags: r.suggested_tags ? parseTags(r.suggested_tags) : undefined,
    uploadedAt: r.uploaded_at,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

async function selectRows(sql: string, params?: unknown[]): Promise<GalleryRow[]> {
  await ensureSchema()
  const [rows] = await getPool().query<GalleryRow[]>(sql, params)
  return rows
}

// ─── Read (MySQL when reachable, else committed data/gallery.json) ──────────
// Always sorted newest-uploaded first — the spec's default ordering — regardless
// of backend. Falls back to JSON on a *failed* query, never taking the public
// gallery offline over a DB hiccup.

async function readAll(): Promise<GalleryImage[]> {
  if (dbConfigured()) {
    try {
      const rows = await selectRows('SELECT * FROM gallery')
      return rows.map(rowToImage).sort(byNewest)
    } catch (err) {
      console.error('[gallery-store] DB read failed, using JSON fallback:',
        (err as NodeJS.ErrnoException)?.code ?? (err as Error)?.message)
    }
  }
  return readJson<GalleryImage[]>(JSON_FILE, []).slice().sort(byNewest)
}

function byNewest(a: GalleryImage, b: GalleryImage): number {
  return b.uploadedAt.localeCompare(a.uploadedAt)
}

// ─── Public API ─────────────────────────────────────────────────────────────

export async function getPublishedImages(category?: GalleryCategory): Promise<GalleryImage[]> {
  const all = await readAll()
  return all.filter((g) => g.published && (!category || g.category === category))
}

export async function getAllImagesAdmin(): Promise<GalleryImage[]> {
  return readAll()
}

export async function getImageById(id: string): Promise<GalleryImage | undefined> {
  return (await readAll()).find((g) => g.id === id)
}

export async function createImage(img: GalleryImage): Promise<GalleryImage> {
  if (!dbConfigured()) {
    const all = readJson<GalleryImage[]>(JSON_FILE, [])
    all.push(img)
    await writeJson(JSON_FILE, all)
    return img
  }
  await ensureSchema()
  await getPool().query(
    `INSERT INTO gallery
       (id, title, alt, category, tags, published, featured, storage, src, file_name,
        drive_file_id, width, height, catalog_status, suggested_category, suggested_tags,
        uploaded_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [img.id, img.title, img.alt, img.category, JSON.stringify(img.tags),
     img.published ? 1 : 0, img.featured ? 1 : 0, img.storage, img.src ?? null, img.fileName ?? null,
     img.driveFileId ?? null, img.width ?? null, img.height ?? null,
     img.catalogStatus ?? null, img.suggestedCategory ?? null,
     img.suggestedTags ? JSON.stringify(img.suggestedTags) : null,
     img.uploadedAt, img.createdAt, img.updatedAt],
  )
  return img
}

export async function updateImage(
  id: string,
  data: Partial<Pick<GalleryImage, 'title' | 'alt' | 'category' | 'tags' | 'published' | 'featured' | 'catalogStatus'>>,
): Promise<GalleryImage | null> {
  const existing = await getImageById(id)
  if (!existing) return null
  const updated: GalleryImage = { ...existing, ...data, updatedAt: new Date().toISOString() }
  // Approving clears the pending AI suggestion (the owner's choice is now final).
  if (data.catalogStatus === 'approved') {
    updated.suggestedCategory = undefined
    updated.suggestedTags = undefined
  }
  if (!dbConfigured()) {
    const all = readJson<GalleryImage[]>(JSON_FILE, [])
    const idx = all.findIndex((g) => g.id === id)
    if (idx === -1) return null
    all[idx] = updated
    await writeJson(JSON_FILE, all)
    return updated
  }
  await getPool().query(
    `UPDATE gallery
        SET title = ?, alt = ?, category = ?, tags = ?, published = ?, featured = ?,
            catalog_status = ?, suggested_category = ?, suggested_tags = ?, updated_at = ?
      WHERE id = ?`,
    [updated.title, updated.alt, updated.category, JSON.stringify(updated.tags),
     updated.published ? 1 : 0, updated.featured ? 1 : 0,
     updated.catalogStatus ?? null, updated.suggestedCategory ?? null,
     updated.suggestedTags ? JSON.stringify(updated.suggestedTags) : null,
     updated.updatedAt, id],
  )
  return updated
}

// ─── Bulk classify (admin) ────────────────────────────────────────────────
// Applies a category and/or add/remove tags and/or published/featured flags to
// many images at once. Tags are merged (added) or pruned (removed), never wiped.
export async function bulkUpdateImages(input: GalleryBulkInput): Promise<number> {
  const all = await getAllImagesAdmin()
  const ids = new Set(input.ids)
  const add = (input.addTags ?? []).map((t) => t.trim()).filter(Boolean)
  const remove = new Set((input.removeTags ?? []).map((t) => t.toLowerCase()))
  let n = 0
  for (const img of all) {
    if (!ids.has(img.id)) continue
    let tags = img.tags
    if (add.length) tags = Array.from(new Set([...tags, ...add]))
    if (remove.size) tags = tags.filter((t) => !remove.has(t.toLowerCase()))
    await updateImage(img.id, {
      category: input.category ?? img.category,
      tags,
      published: input.published ?? img.published,
      featured: input.featured ?? img.featured,
    })
    n++
  }
  return n
}

// ─── AI-catalog suggestion (never auto-applied) ───────────────────────────
// A classification agent records a suggestion; the owner reviews and approves
// (which promotes it into category/tags) or ignores it. Category/tags are left
// untouched here — this only stages the proposal.
export async function setSuggestion(
  id: string,
  suggestion: { category?: GalleryCategory; tags?: string[] },
): Promise<GalleryImage | null> {
  const existing = await getImageById(id)
  if (!existing) return null
  const updated: GalleryImage = {
    ...existing,
    catalogStatus: 'suggested',
    suggestedCategory: suggestion.category ?? existing.suggestedCategory,
    suggestedTags: suggestion.tags ?? existing.suggestedTags,
    updatedAt: new Date().toISOString(),
  }
  if (!dbConfigured()) {
    const list = readJson<GalleryImage[]>(JSON_FILE, [])
    const idx = list.findIndex((g) => g.id === id)
    if (idx === -1) return null
    list[idx] = updated
    await writeJson(JSON_FILE, list)
    return updated
  }
  await getPool().query(
    `UPDATE gallery SET catalog_status = ?, suggested_category = ?, suggested_tags = ?, updated_at = ? WHERE id = ?`,
    ['suggested', updated.suggestedCategory ?? null,
     updated.suggestedTags ? JSON.stringify(updated.suggestedTags) : null, updated.updatedAt, id],
  )
  return updated
}

// Deletes metadata AND the stored bytes (via the storage backend). Returns the
// deleted record so the caller can report it, or null if it didn't exist.
export async function deleteImage(id: string): Promise<GalleryImage | null> {
  const existing = await getImageById(id)
  if (!existing) return null

  // Best-effort byte removal first; metadata removal is authoritative.
  try {
    await getGalleryStorage().remove(existing)
  } catch (err) {
    console.error('[gallery-store] storage remove failed:',
      (err as NodeJS.ErrnoException)?.code ?? (err as Error)?.message)
  }

  if (!dbConfigured()) {
    const all = readJson<GalleryImage[]>(JSON_FILE, [])
    const filtered = all.filter((g) => g.id !== id)
    await writeJson(JSON_FILE, filtered)
    return existing
  }
  await ensureSchema()
  await getPool().query<ResultSetHeader>('DELETE FROM gallery WHERE id = ?', [id])
  return existing
}

// ─── View mapping ─────────────────────────────────────────────────────────
// Resolve the browser-facing shape (public URL + display fields). Used by both
// the public page and the admin list.

export function toPublicImage(img: GalleryImage): GalleryImagePublic {
  return {
    id: img.id,
    url: getGalleryStorage().publicUrl(img),
    alt: img.alt,
    title: img.title,
    category: img.category,
    tags: img.tags,
    uploadedAt: img.uploadedAt,
    featured: img.featured,
    width: img.width,
    height: img.height,
  }
}
