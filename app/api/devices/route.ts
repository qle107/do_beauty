import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getAllDevices, unblockDevice, blockDevice, updateDevice, deleteDevice } from '@/lib/devices'

// ─── GET /api/devices - admin only ────────────────────────────────────────

export async function GET(): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  return NextResponse.json(await getAllDevices())
}

// ─── POST /api/devices - manually block a device (admin only) ─────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json() as { deviceId?: string; reason?: string }
  if (!body.deviceId) return NextResponse.json({ error: 'deviceId is required' }, { status: 422 })

  const ok = await blockDevice(body.deviceId, body.reason)
  if (!ok) return NextResponse.json({ error: 'Device not found' }, { status: 404 })

  return new NextResponse(null, { status: 204 })
}

// ─── PUT /api/devices - edit a device's name/reason (admin only) ──────────

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json() as { deviceId?: string; clientName?: string; reason?: string }
  if (!body.deviceId) return NextResponse.json({ error: 'deviceId is required' }, { status: 422 })

  const ok = await updateDevice(body.deviceId, { clientName: body.clientName, reason: body.reason })
  if (!ok) return NextResponse.json({ error: 'Device not found' }, { status: 404 })

  return new NextResponse(null, { status: 204 })
}

// ─── DELETE /api/devices - unblock a device, or ?action=remove to delete the
//     record entirely (admin only) ────────────────────────────────────────

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const deviceId = searchParams.get('deviceId')
  const action = searchParams.get('action')

  if (!deviceId) return NextResponse.json({ error: 'deviceId query param is required' }, { status: 422 })

  const ok = action === 'remove' ? await deleteDevice(deviceId) : await unblockDevice(deviceId)
  if (!ok) return NextResponse.json({ error: 'Device not found' }, { status: 404 })

  return new NextResponse(null, { status: 204 })
}
