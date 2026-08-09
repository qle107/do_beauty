'use client'

import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import AppointmentTable from '@/components/admin/AppointmentTable'
import type { AppointmentStatus } from '@/lib/utils'

interface ServiceRef {
  id: string
  name: string
  price: number
  duration: number
}

interface Appointment {
  id: string
  clientName: string
  clientPhone: string
  services: ServiceRef[]
  totalDuration: number
  totalPrice: number
  date: string
  timeSlot: string
  status: AppointmentStatus
  notes?: string
  images?: { name: string }[]
}

const STATUS_FILTERS = [
  { label: 'Tout', value: '' },
  { label: 'En attente', value: 'PENDING' },
  { label: 'Confirmé', value: 'CONFIRMED' },
  { label: 'Terminé', value: 'COMPLETED' },
  { label: 'Annulé', value: 'CANCELLED' },
  { label: 'Absent', value: 'NO_SHOW' },
]

export default function AppointmentsPage() {
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([])

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/appointments')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json() as Appointment[]
      setAllAppointments(data)
    } catch {
      toast.error('Impossible de charger les rendez-vous. Réessayez ou rechargez la page.')
    } finally {
      setLoading(false)
    }
  }, [])

  const refresh = useCallback(async () => {
    setLoading(true)
    await load()
  }, [load])

  // Fetch on mount; this data-loading effect sets state after the fetch resolves.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load() }, [load])

  // Derived client-side status filter (Google Calendar API returns all events)
  const appointments = statusFilter
    ? allAppointments.filter((a) => a.status === statusFilter)
    : allAppointments

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-light text-dark">Rendez-vous</h1>
        <p className="font-sans text-sm text-dark/40 mt-1">Gérez toutes les réservations clients.</p>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        {STATUS_FILTERS.map((f) => (
          <button key={f.value} onClick={() => setStatusFilter(f.value)}
            className={`px-4 py-2 text-xs font-sans tracking-wide border transition-all ${
              statusFilter === f.value ? 'bg-dark text-cream border-dark' : 'border-dark/20 text-charcoal-500 hover:border-dark/40 hover:text-dark'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-cream border border-dark/10 p-8">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1,2,3,4,5].map(i => <div key={i} className="h-14 bg-dark/5 animate-pulse" />)}
          </div>
        ) : (
          <AppointmentTable appointments={appointments} onRefresh={() => void refresh()} />
        )}
      </div>
    </div>
  )
}
