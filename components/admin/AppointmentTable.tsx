'use client'

import { useState } from 'react'
import Badge from '@/components/ui/Badge'
import { formatDateShort, formatCurrency, type AppointmentStatus } from '@/lib/utils'
import toast from 'react-hot-toast'

interface ServiceRef { id: string; name: string; price: number; duration: number }

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

interface AppointmentTableProps {
  appointments: Appointment[]
  onRefresh?: () => void
  compact?: boolean
}

const STATUS_ACTIONS: Record<AppointmentStatus, { label: string; next: AppointmentStatus }[]> = {
  PENDING:   [{ label: 'Confirmer', next: 'CONFIRMED' }, { label: 'Annuler', next: 'CANCELLED' }, { label: 'Absent', next: 'NO_SHOW' }],
  CONFIRMED: [{ label: 'Terminer',  next: 'COMPLETED' }, { label: 'Annuler', next: 'CANCELLED' }, { label: 'Absent', next: 'NO_SHOW' }],
  CANCELLED: [],
  COMPLETED: [],
  NO_SHOW:   [],
}

export default function AppointmentTable({
  appointments: initialAppts, onRefresh, compact = false,
}: AppointmentTableProps) {
  const [appointments, setAppointments] = useState(initialAppts)
  const [loading, setLoading] = useState<string | null>(null)

  const updateStatus = async (id: string, status: AppointmentStatus, appt?: Appointment) => {
    if (status === 'NO_SHOW') {
      const confirm = window.confirm(
        `Marquer ce rendez-vous comme "Absent" ?\n\nCela enregistrera ${appt?.clientName ?? 'ce client'} comme no-show. Après 2 absences, leur numéro sera automatiquement bloqué.`
      )
      if (!confirm) return
    }

    setLoading(id)
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          // Send phone + name so the API can record the no-show without an extra Calendar fetch
          ...(status === 'NO_SHOW' && appt
            ? { clientPhone: appt.clientPhone, clientName: appt.clientName }
            : {}),
        }),
      })
      if (!res.ok) throw new Error()
      setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status } : a))
      toast.success(
        status === 'CONFIRMED' ? 'Rendez-vous confirmé'
          : status === 'CANCELLED' ? 'Rendez-vous annulé'
          : status === 'NO_SHOW'  ? 'Absence enregistrée'
          : 'Rendez-vous terminé'
      )
      onRefresh?.()
    } catch {
      toast.error('Impossible de mettre à jour le rendez-vous')
    } finally {
      setLoading(null)
    }
  }

  const deleteAppointment = async (id: string) => {
    if (!confirm('Supprimer ce rendez-vous ? Cette action est irréversible.')) return
    setLoading(id)
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setAppointments((prev) => prev.filter((a) => a.id !== id))
      toast.success('Rendez-vous supprimé')
      onRefresh?.()
    } catch {
      toast.error('Impossible de supprimer le rendez-vous')
    } finally {
      setLoading(null)
    }
  }

  if (appointments.length === 0) {
    return <p className="text-sm font-sans text-dark/30 italic py-6">Aucun rendez-vous trouvé.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-sans">
        <thead>
          <tr className="border-b border-dark/10">
            {['Client', 'Téléphone', 'Prestations', 'Date & Heure', !compact && 'Total', 'Statut', 'Actions']
              .filter(Boolean)
              .map((h) => (
                <th key={String(h)} className="text-left py-3 px-4 text-xs tracking-[0.2em] uppercase text-dark/30 font-normal">
                  {h}
                </th>
              ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-dark/5">
          {appointments.map((appt) => {
            const actions   = STATUS_ACTIONS[appt.status]
            const isLoading = loading === appt.id
            const serviceLabel = appt.services.map((s) => s.name).join(' + ')
            return (
              <tr key={appt.id} className="hover:bg-blush/50 transition-colors">
                <td className="py-4 px-4">
                  <p className="font-medium text-dark">{appt.clientName}</p>
                  {appt.images && appt.images.length > 0 && (
                    <div className="flex gap-1 mt-1.5">
                      {appt.images.map((img) => {
                        const url = `/api/appointments/${appt.id}/images/${img.name}`
                        return (
                          <a key={img.name} href={url} target="_blank" rel="noopener noreferrer" title="Photo de référence">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt="Réf." className="w-9 h-9 object-cover rounded border border-dark/10 hover:border-coral transition-colors" />
                          </a>
                        )
                      })}
                    </div>
                  )}
                </td>
                <td className="py-4 px-4 text-charcoal-500 text-xs">{appt.clientPhone}</td>
                <td className="py-4 px-4 text-charcoal-500 max-w-[200px]">
                  <p className="truncate" title={serviceLabel}>{serviceLabel}</p>
                  <p className="text-xs text-dark/30 mt-0.5">{appt.totalDuration} min</p>
                </td>
                <td className="py-4 px-4 text-charcoal-500">
                  {formatDateShort(appt.date)} · {appt.timeSlot}
                </td>
                {!compact && (
                  <td className="py-4 px-4 font-serif text-coral">{formatCurrency(appt.totalPrice)}</td>
                )}
                <td className="py-4 px-4"><Badge status={appt.status} /></td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {actions.map((action) => (
                      <button
                        key={action.next}
                        onClick={() => void updateStatus(appt.id, action.next, appt)}
                        disabled={isLoading}
                        className={`text-xs border px-3 py-1.5 transition-colors disabled:opacity-40 ${
                          action.next === 'NO_SHOW'
                            ? 'text-orange-700 hover:text-orange-900 border-orange-200 hover:border-orange-400'
                            : 'text-charcoal-500 hover:text-dark border-dark/20 hover:border-dark'
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                    {!compact && (
                      <button
                        onClick={() => void deleteAppointment(appt.id)}
                        disabled={isLoading}
                        className="text-xs text-red-600 hover:text-red-800 px-2 py-1.5 transition-colors disabled:opacity-40"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
