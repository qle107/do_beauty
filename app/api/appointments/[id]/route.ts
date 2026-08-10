import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { appointmentStatusSchema } from '@/lib/validations'
import { updateCalendarEventStatus, deleteCalendarEvent, getCalendarEventProps } from '@/lib/google-calendar'
import { recordNoShow } from '@/lib/blocklist'
import { recordDeviceNoShow } from '@/lib/devices'
import { deleteImages } from '@/lib/appointment-images'

type RouteContext = { params: Promise<{ id: string }> }

// ─── PATCH /api/appointments/[id] - admin only (update status) ────────────

export async function PATCH(request: NextRequest, { params }: RouteContext): Promise<NextResponse> {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body: unknown = await request.json()
    const parsed = appointmentStatusSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      )
    }

    await updateCalendarEventStatus(id, parsed.data.status)

    // ── When marked NO_SHOW: record it and potentially auto-block ──────────
    if (parsed.data.status === 'NO_SHOW') {
      // The IP and deviceId used at booking time only ever live on the calendar
      // event, so fetch the props once to read them, and reuse them as the
      // fallback for phone/name when the admin UI's body omits them.
      const props = await getCalendarEventProps(id)

      const phone = parsed.data.clientPhone ?? props?.['clientPhone'] ?? null
      const name  = parsed.data.clientName  ?? props?.['clientName']  ?? ''
      const ip    = props?.['clientIp'] || undefined

      if (phone) {
        await recordNoShow(phone, name, ip)
      }

      // Count the no-show against the browser too, so a rebook under a new
      // phone from the same device is still caught. The fingerprint is a
      // fallback identifier for when the deviceId has since been cleared.
      const deviceId    = props?.['deviceId'] ?? ''
      const fingerprint = props?.['fingerprint'] || undefined
      if (deviceId || fingerprint) {
        await recordDeviceNoShow(deviceId, name, fingerprint)
      }
    }

    // Once the appointment is done (completed, cancelled or no-show), the
    // reference photos are no longer needed - drop the server copy. The owner
    // still has them in the alert email.
    if (['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(parsed.data.status)) {
      void deleteImages(id)
    }

    return NextResponse.json({ id, status: parsed.data.status })
  } catch (error) {
    console.error('[PATCH /api/appointments/[id]]', error)
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 })
  }
}

// ─── DELETE /api/appointments/[id] - admin only ───────────────────────────

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await deleteCalendarEvent(id)
    void deleteImages(id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('[DELETE /api/appointments/[id]]', error)
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 })
  }
}
