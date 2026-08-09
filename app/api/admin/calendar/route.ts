import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { listCalendarEvents, parisDayBounds } from '@/lib/google-calendar'
import { getPlanityBusyByEmployee } from '@/lib/planity/public-availability'
import { ARTISTS } from '@/lib/staff'
import { getAllServicesAdmin } from '@/lib/services-store'
import { site } from '@/lib/site'
import { timeToMinutes } from '@/lib/utils'
import type { Service } from '@/lib/types'

// GET /api/admin/calendar?date=YYYY-MM-DD  — admin only. Assembles one day:
// website bookings (Calendar A, full detail) + Planity anonymous busy blocks.
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const date = new URL(request.url).searchParams.get('date') ?? ''
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 422 })
    }

    const openMinutes = site.hours.openMinutes
    const closeMinutes = site.hours.closeMinutes

    const allServices = await getAllServicesAdmin()
    const serviceMap = new Map<string, Service>(allServices.map((s) => [s.id, s]))
    const { dayStart, dayEnd } = parisDayBounds(date)

    const [events, planityBusy] = await Promise.all([
      listCalendarEvents({ timeMin: dayStart, timeMax: dayEnd, serviceMap }),
      getPlanityBusyByEmployee(date, openMinutes, closeMinutes),
    ])

    // Match a booking's chosen praticienne name → artist id, to place it in a column.
    const idByName = new Map(ARTISTS.map((a) => [a.name.toLowerCase(), a.id]))

    const website = events.map((e) => {
      const startMin = timeToMinutes(e.timeSlot)
      const employeeId = e.employeeName ? idByName.get(e.employeeName.toLowerCase()) ?? null : null
      return {
        id: e.id,
        employeeId,
        clientName: e.clientName,
        phone: e.clientPhone,
        services: e.services.map((s) => s.name).join(' + '),
        startMin,
        endMin: startMin + e.totalDuration,
      }
    })

    return NextResponse.json({
      date,
      openMinutes,
      closeMinutes,
      employees: ARTISTS.map((a) => ({ id: a.id, name: a.name, kind: a.kind })),
      website,
      planityBusy: planityBusy ?? {},
      planityKnown: planityBusy !== null,
    })
  } catch (error) {
    console.error('[GET /api/admin/calendar]', error)
    return NextResponse.json({ error: 'Failed to load calendar' }, { status: 500 })
  }
}
