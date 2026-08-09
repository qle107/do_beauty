import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { serviceUpdateSchema } from '@/lib/validations'
import { getServiceById, updateService, deleteService } from '@/lib/services-store'

type RouteContext = { params: Promise<{ id: string }> }

// ─── GET /api/services/[id] - public ─────────────────────────────────────

export async function GET(_request: NextRequest, { params }: RouteContext): Promise<NextResponse> {
  try {
    const { id } = await params
    const service = await getServiceById(id)
    if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    return NextResponse.json(service)
  } catch (error) {
    console.error('[GET /api/services/[id]]', error)
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 })
  }
}

// ─── PATCH /api/services/[id] - admin only ───────────────────────────────

export async function PATCH(request: NextRequest, { params }: RouteContext): Promise<NextResponse> {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body: unknown = await request.json()
    const parsed = serviceUpdateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      )
    }

    const updated = await updateService(id, parsed.data)
    if (!updated) return NextResponse.json({ error: 'Service not found' }, { status: 404 })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[PATCH /api/services/[id]]', error)
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 })
  }
}

// ─── DELETE /api/services/[id] - admin only ──────────────────────────────

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const ok = await deleteService(id)
    if (!ok) return NextResponse.json({ error: 'Service not found' }, { status: 404 })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('[DELETE /api/services/[id]]', error)
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 })
  }
}
