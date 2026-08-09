import CalendarBoard from '@/components/admin/CalendarBoard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Planning' }

export default function CalendarPage() {
  // Initial date = today in Europe/Paris (fr-CA gives YYYY-MM-DD).
  const today = new Date().toLocaleDateString('fr-CA', { timeZone: 'Europe/Paris' })
  return <CalendarBoard initialDate={today} />
}
