import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getContact, setContactStatus, deleteContact, type ContactStatus } from '@/lib/contacts'

type Ctx = { params: Promise<{ id: string }> }

// GET /api/contact/[id] - admin only. Marks an unread message as read.
export async function GET(_request: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const msg = await getContact(id)
  if (!msg) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (msg.status === 'unread') {
    await setContactStatus(id, 'read')
    msg.status = 'read'
  }
  return NextResponse.json(msg)
}

// PATCH /api/contact/[id] - admin only. Body: { status: 'read' | 'unread' }
export async function PATCH(request: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = (await request.json()) as { status?: string }
  const status = body.status
  if (status !== 'read' && status !== 'unread') {
    return NextResponse.json({ error: 'status must be read or unread' }, { status: 422 })
  }
  const ok = await setContactStatus(id, status as ContactStatus)
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return new NextResponse(null, { status: 204 })
}

// DELETE /api/contact/[id] - admin only.
export async function DELETE(_request: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const ok = await deleteContact(id)
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return new NextResponse(null, { status: 204 })
}
