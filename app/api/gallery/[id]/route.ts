import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { galleryUpdateSchema } from '@/lib/validations'
import { getImageById, updateImage, deleteImage } from '@/lib/gallery-store'
import { getGalleryStorage } from '@/lib/gallery-storage'

type RouteContext = { params: Promise<{ id: string }> }

// ─── GET /api/gallery/[id] - public ──────────────────────────────────────

export async function GET(_request: NextRequest, { params }: RouteContext): Promise<NextResponse> {
  try {
    const { id } = await params
    const img = await getImageById(id)
    if (!img) return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    return NextResponse.json({ ...img, url: getGalleryStorage().publicUrl(img) })
  } catch (error) {
    console.error('[GET /api/gallery/[id]]', error)
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 })
  }
}

// ─── PATCH /api/gallery/[id] - admin only (metadata) ─────────────────────

export async function PATCH(request: NextRequest, { params }: RouteContext): Promise<NextResponse> {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body: unknown = await request.json()
    const parsed = galleryUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
        { status: 422 },
      )
    }

    const updated = await updateImage(id, parsed.data)
    if (!updated) return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    return NextResponse.json({ ...updated, url: getGalleryStorage().publicUrl(updated) })
  } catch (error) {
    console.error('[PATCH /api/gallery/[id]]', error)
    return NextResponse.json({ error: 'Failed to update image' }, { status: 500 })
  }
}

// ─── DELETE /api/gallery/[id] - admin only (metadata + bytes) ────────────

export async function DELETE(_request: NextRequest, { params }: RouteContext): Promise<NextResponse> {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const deleted = await deleteImage(id)
    if (!deleted) return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('[DELETE /api/gallery/[id]]', error)
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
  }
}
