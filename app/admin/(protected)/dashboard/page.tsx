import StatsCard from '@/components/admin/StatsCard'
import AppointmentTable from '@/components/admin/AppointmentTable'
import { listCalendarEvents } from '@/lib/google-calendar'
import { countActiveServices, getAllServicesAdmin } from '@/lib/services-store'
import { countTodayEvents, countPendingEvents } from '@/lib/google-calendar'
import type { Metadata } from 'next'
import type { Service, Appointment } from '@/lib/types'

export const metadata: Metadata = { title: 'Bảng điều khiển' }
export const dynamic = 'force-dynamic'

async function getStats() {
  const [appointmentsToday, pendingCount, totalServices] = await Promise.all([
    countTodayEvents(),
    countPendingEvents(),
    countActiveServices(),
  ])
  return { appointmentsToday, pendingCount, totalServices, unreadMessages: 0 }
}

async function getRecentAppointments(): Promise<Appointment[]> {
  const allServices = await getAllServicesAdmin()
  const serviceMap  = new Map<string, Service>(allServices.map((s) => [s.id, s]))

  // Fetch upcoming events (next 30 days) for the "recent" panel
  const now     = new Date()
  const in30    = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  const appointments = await listCalendarEvents({
    timeMin: now.toISOString(),
    timeMax: in30.toISOString(),
    serviceMap,
  })

  // Most recent first, limit to 10
  return appointments
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)
}

export default async function DashboardPage() {
  const [stats, recentAppointments] = await Promise.all([
    getStats(),
    getRecentAppointments(),
  ])

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-light text-dark">Bảng điều khiển</h1>
        <p className="font-sans text-sm text-dark/40 mt-1">Chào mừng, Do Beauty.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <StatsCard
          label="Lịch hẹn hôm nay"
          value={stats.appointmentsToday}
          description="Lịch đặt trong ngày"
          highlight={stats.appointmentsToday > 0}
        />
        <StatsCard
          label="Chờ xác nhận"
          value={stats.pendingCount}
          description="Cần xác nhận"
          highlight={stats.pendingCount > 0}
        />
        <StatsCard
          label="Dịch vụ đang hoạt động"
          value={stats.totalServices}
          description="Dịch vụ đã đăng"
        />
        <StatsCard
          label="Tin nhắn"
          value="Gmail"
          description="Nhận trong hộp thư của bạn"
        />
      </div>

      <div className="bg-cream border border-dark/10 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-xl font-light text-dark">Lịch hẹn sắp tới</h2>
          <a
            href="/admin/appointments"
            className="text-xs font-sans text-coral underline underline-offset-4"
          >
            Xem tất cả
          </a>
        </div>
        <AppointmentTable
          appointments={recentAppointments.map((a) => ({
            ...a,
            notes: a.notes ?? undefined,
          }))}
          compact
        />
      </div>
    </div>
  )
}
