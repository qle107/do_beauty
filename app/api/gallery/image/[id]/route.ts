import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getImageById } from '@/lib/gallery-store'
import { getGalleryStorage } from '@/lib/gallery-storage'

type RouteContext = { params: Promise<{ id: string }> }

// ─── GET /api/gallery/image/[id] ─────────────────────────────────────────
// Same-origin byte proxy for gallery images that don't live under /public
// (admin uploads in DATA_DIR today, Google Drive later). Keeps storage
// credentials server-side and means next/image needs no remotePatterns.
// 'static' images resolve to their /public path via publicUrl() and never reach
// this route.

export async function GET(_request: NextRequest, { params }: RouteContext): Promise<NextResponse> {
  try {
    const { id } = await params
    const img = await getImageById(id)
    if (!img) return new NextResponse(null, { status: 404 })
    // Unpublished/draft images are visible only to the authenticated admin.
    if (!img.published && !(await requireAdmin())) return new NextResponse(null, { status: 404 })

    const bytes = await getGalleryStorage().read(img)
    if (!bytes) return new NextResponse(null, { status: 404 })

    return new NextResponse(new Uint8Array(bytes.buffer), {
      status: 200,
      headers: {
        'Content-Type': bytes.mime,
        // Bytes are immutable per id → cache hard; a new image gets a new id.
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Disposition': 'inline',
      },
    })
  } catch (error) {
    console.error('[GET /api/gallery/image/[id]]', error)
    return new NextResponse(null, { status: 500 })
  }
}
