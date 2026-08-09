import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { countTodayEvents, countPendingEvents } from '@/lib/google-calendar'
import { countActiveServices } from '@/lib/services-store'

// GET /api/admin/stats - admin only
export async function GET(): Promise<NextResponse> {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const [appointmentsToday, pendingCount, totalServices] = await Promise.all([
      countTodayEvents(),
      countPendingEvents(),
      countActiveServices(),
    ])

    return NextResponse.json({
      appointmentsToday,
      pendingCount,
      totalServices,
      // Messages are now email-only - no unread count
      unreadMessages: 0,
    })
  } catch (error) {
    console.error('[GET /api/admin/stats]', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
