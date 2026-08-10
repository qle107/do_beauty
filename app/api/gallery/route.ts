import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { galleryCreateSchema } from '@/lib/validations'
import {
  getPublishedImages,
  getAllImagesAdmin,
  createImage,
  toPublicImage,
} from '@/lib/gallery-store'
import { getGalleryStorage } from '@/lib/gallery-storage'
import { decodeDataUrl } from '@/lib/appointment-images'
import type { GalleryCategory, GalleryImage } from '@/lib/types'

const VALID_CATEGORIES: string[] = ['nails', 'eyes', 'pedicure', 'studio', 'other']

// Admin view = full metadata + the resolved public URL (so the manager can show
// a preview without knowing the storage backend).
function adminView(img: GalleryImage) {
  return { ...img, url: getGalleryStorage().publicUrl(img) }
}

// ─── GET /api/gallery ────────────────────────────────────────────────────
// Public: published images only, optional ?category= and ?tag=. auth() is NOT
// called on the public path (matches /api/services - avoids hanging without a
// configured secret). ?admin=true returns the full list incl. unpublished.

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)

    if (searchParams.get('admin') === 'true') {
      const session = await auth()
      if (!session?.user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
      return NextResponse.json((await getAllImagesAdmin()).map(adminView))
    }

    const categoryParam = searchParams.get('category')
    const category =
      categoryParam && VALID_CATEGORIES.includes(categoryParam)
        ? (categoryParam as GalleryCategory)
        : undefined
    const tag = searchParams.get('tag')?.trim().toLowerCase()

    let images = await getPublishedImages(category)
    if (tag) images = images.filter((g) => g.tags.some((t) => t.toLowerCase() === tag))

    return NextResponse.json(images.map(toPublicImage))
  } catch (error) {
    console.error('[GET /api/gallery]', error)
    return NextResponse.json({ error: 'Erreur lors du chargement de la galerie' }, { status: 500 })
  }
}

// ─── POST /api/gallery - admin only (upload + metadata) ──────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const body: unknown = await request.json()
    const parsed = galleryCreateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation échouée', issues: parsed.error.flatten().fieldErrors },
        { status: 422 },
      )
    }

    const { image, ...meta } = parsed.data
    const decoded = decodeDataUrl(image)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Image invalide ou trop volumineuse (JPEG, PNG ou WebP, 5 Mo max).' },
        { status: 422 },
      )
    }

    const id = `img_${crypto.randomUUID()}`
    const upload = await getGalleryStorage().upload({ id, buffer: decoded.buffer, mime: decoded.mime })

    const now = new Date().toISOString()
    const img: GalleryImage = {
      id,
      title: meta.title,
      alt: meta.alt,
      category: meta.category,
      tags: meta.tags,
      published: meta.published,
      featured: meta.featured,
      storage: upload.storage,
      src: upload.src,
      fileName: upload.fileName,
      driveFileId: upload.driveFileId,
      uploadedAt: now,
      createdAt: now,
      updatedAt: now,
    }
    await createImage(img)
    return NextResponse.json(adminView(img), { status: 201 })
  } catch (error) {
    console.error('[POST /api/gallery]', error)
    return NextResponse.json({ error: 'Erreur lors de l’ajout à la galerie' }, { status: 500 })
  }
}
