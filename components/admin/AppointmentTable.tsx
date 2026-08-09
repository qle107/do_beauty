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
  PENDING:   [{ label: 'Xác nhận', next: 'CONFIRMED' }, { label: 'Hủy', next: 'CANCELLED' }, { label: 'Vắng mặt', next: 'NO_SHOW' }],
  CONFIRMED: [{ label: 'Hoàn thành',  next: 'COMPLETED' }, { label: 'Hủy', next: 'CANCELLED' }, { label: 'Vắng mặt', next: 'NO_SHOW' }],
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
        `Đánh dấu lịch hẹn này là "Vắng mặt"?\n\nHệ thống sẽ ghi nhận ${appt?.clientName ?? 'khách này'} vắng mặt (không đến). Sau 2 lần vắng mặt, số điện thoại sẽ tự động bị chặn.`
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
        status === 'CONFIRMED' ? 'Đã xác nhận lịch hẹn'
          : status === 'CANCELLED' ? 'Đã hủy lịch hẹn'
          : status === 'NO_SHOW'  ? 'Đã ghi nhận vắng mặt'
          : 'Đã hoàn thành lịch hẹn'
      )
      onRefresh?.()
    } catch {
      toast.error('Không thể cập nhật lịch hẹn')
    } finally {
      setLoading(null)
    }
  }

  const deleteAppointment = async (id: string) => {
    if (!confirm('Xóa lịch hẹn này? Hành động này không thể hoàn tác.')) return
    setLoading(id)
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setAppointments((prev) => prev.filter((a) => a.id !== id))
      toast.success('Đã xóa lịch hẹn')
      onRefresh?.()
    } catch {
      toast.error('Không thể xóa lịch hẹn')
    } finally {
      setLoading(null)
    }
  }

  if (appointments.length === 0) {
    return <p className="text-sm font-sans text-dark/30 italic py-6">Không có lịch hẹn nào.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-sans">
        <thead>
          <tr className="border-b border-dark/10">
            {['Khách hàng', 'SĐT', 'Dịch vụ', 'Ngày & Giờ', !compact && 'Tổng', 'Trạng thái', 'Thao tác']
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
                          <a key={img.name} href={url} target="_blank" rel="noopener noreferrer" title="Ảnh tham khảo">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt="Tham khảo" className="w-9 h-9 object-cover rounded border border-dark/10 hover:border-coral transition-colors" />
                          </a>
                        )
                      })}
                    </div>
                  )}
                </td>
                <td className="py-4 px-4 text-charcoal-500 text-xs">{appt.clientPhone}</td>
                <td className="py-4 px-4 text-charcoal-500 max-w-[200px]">
                  <p className="truncate" title={serviceLabel}>{serviceLabel}</p>
                  <p className="text-xs text-dark/30 mt-0.5">{appt.totalDuration} phút</p>
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
                        Xóa
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
