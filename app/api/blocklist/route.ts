import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getAllEntries, unblockPhone, blockPhone, recordNoShow, updateEntry, deleteEntry } from '@/lib/blocklist'

// ─── GET /api/blocklist - admin only ──────────────────────────────────────

export async function GET(): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  return NextResponse.json(await getAllEntries())
}

// ─── POST /api/blocklist - manually block a phone immediately (admin only) ─

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json() as { phone?: string; clientName?: string; reason?: string; ip?: string }
  const { phone, clientName, reason, ip } = body

  if (!phone) return NextResponse.json({ error: 'phone is required' }, { status: 422 })

  const entry = await blockPhone(phone, clientName ?? 'Inconnu', reason, ip)
  return NextResponse.json(entry, { status: 201 })
}

// ─── PATCH /api/blocklist - report a ghost/no-show occurrence (admin only) ─
// Unlike POST (immediate force-block), this increments the no-show count and
// only auto-blocks once the threshold is reached - for logging a ghost that
// happened outside the online booking flow (phone call, walk-in, etc).

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json() as { phone?: string; clientName?: string; ip?: string }
  const { phone, clientName, ip } = body

  if (!phone) return NextResponse.json({ error: 'phone is required' }, { status: 422 })

  const entry = await recordNoShow(phone, clientName ?? 'Inconnu', ip)
  return NextResponse.json(entry, { status: 200 })
}

// ─── PUT /api/blocklist - edit an entry's name/reason (admin only) ────────

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json() as { phone?: string; clientName?: string; reason?: string }
  if (!body.phone) return NextResponse.json({ error: 'phone is required' }, { status: 422 })

  const ok = await updateEntry(body.phone, { clientName: body.clientName, reason: body.reason })
  if (!ok) return NextResponse.json({ error: 'Phone not found in blocklist' }, { status: 404 })

  return new NextResponse(null, { status: 204 })
}

// ─── DELETE /api/blocklist - unblock a phone, or ?action=remove to delete the
//     record entirely (admin only) ────────────────────────────────────────

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const phone = searchParams.get('phone')
  const action = searchParams.get('action')

  if (!phone) return NextResponse.json({ error: 'phone query param is required' }, { status: 422 })

  const ok = action === 'remove' ? await deleteEntry(phone) : await unblockPhone(phone)
  if (!ok) return NextResponse.json({ error: 'Phone not found in blocklist' }, { status: 404 })

  return new NextResponse(null, { status: 204 })
}
