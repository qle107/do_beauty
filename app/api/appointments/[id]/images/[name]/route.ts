import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { readImage } from '@/lib/appointment-images'

type RouteContext = { params: Promise<{ id: string; name: string }> }

// ─── GET /api/appointments/[id]/images/[name] - admin only ────────────────
// Serves a customer reference photo. Photos are private, so this is gated by the
// admin session; readImage validates the filename against path traversal.

export async function GET(_request: NextRequest, { params }: RouteContext): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, name } = await params
  const img = await readImage(id, name)
  if (!img) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return new NextResponse(new Uint8Array(img.buffer), {
    status: 200,
    headers: {
      'Content-Type':        img.mime,
      'Cache-Control':       'private, max-age=3600',
      'Content-Disposition': 'inline',
    },
  })
}
