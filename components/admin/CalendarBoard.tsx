'use client'

import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface Employee { id: string; name: string; kind: 'staff' | 'cabine' }
interface WebBooking {
  id: string; employeeId: string | null; clientName: string
  phone: string; services: string; startMin: number; endMin: number
}
interface Interval { startMin: number; endMin: number }
interface CalendarData {
  date: string; openMinutes: number; closeMinutes: number
  employees: Employee[]; website: WebBooking[]
  planityBusy: Record<string, Interval[]>; planityKnown: boolean
}

const PX_PER_MIN = 1.3
const COL_W = 150

const fmt = (min: number): string =>
  `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`

// Pure UTC date-string arithmetic (no local-tz drift).
function addDays(iso: string, n: number): string {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  dt.setUTCDate(dt.getUTCDate() + n)
  return dt.toISOString().slice(0, 10)
}

const prettyDate = (iso: string): string =>
  new Date(iso + 'T12:00:00').toLocaleDateString('vi-VN', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

const CopyIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
)

export default function CalendarBoard({ initialDate }: { initialDate: string }) {
  const [date, setDate] = useState(initialDate)
  const [data, setData] = useState<CalendarData | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async (d: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/calendar?date=${d}`)
      if (!res.ok) throw new Error(String(res.status))
      setData(await res.json())
    } catch {
      toast.error('Không tải được lịch làm việc.')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load(date) }, [date, load])

  const gridHeight = data ? (data.closeMinutes - data.openMinutes) * PX_PER_MIN : 0
  const hourLines: number[] = []
  if (data) {
    const firstHour = Math.ceil(data.openMinutes / 60) * 60
    for (let t = firstHour; t <= data.closeMinutes; t += 60) hourLines.push(t)
  }

  // Website bookings grouped by column key ('web' for unassigned, else employee id).
  const webByCol: Record<string, WebBooking[]> = {}
  for (const b of data?.website ?? []) {
    const key = b.employeeId ?? 'web'
    ;(webByCol[key] ??= []).push(b)
  }

  const top = (startMin: number) => (startMin - data!.openMinutes) * PX_PER_MIN
  const height = (s: number, e: number) => Math.max(18, (e - s) * PX_PER_MIN)

  // Copy a website booking as a ready-to-read block for entering it into Planity.
  // Labels are in Vietnamese for the salon owner; the values are the raw details.
  async function copyForPlanity(b: WebBooking, employeeLabel: string) {
    const block = [
      `Tên: ${b.clientName}`,
      `SĐT: ${b.phone || '—'}`,
      `Dịch vụ: ${b.services}`,
      `Ngày: ${data!.date}`,
      `Giờ: ${fmt(b.startMin)}–${fmt(b.endMin)}`,
      `Nhân viên: ${employeeLabel}`,
    ].join('\n')
    try {
      await navigator.clipboard.writeText(block)
      toast.success('Đã sao chép ✓ — dán vào Planity')
    } catch {
      toast.error('Không sao chép được. Hãy thử lại.')
    }
  }

  const columns: { key: string; label: string; kind: 'web' | 'staff' | 'cabine' }[] = [
    { key: 'web', label: 'Web (không chọn NV)', kind: 'web' },
    ...(data?.employees ?? []).map((e) => ({ key: e.id, label: e.name, kind: e.kind })),
  ]

  return (
    <div>
      <header className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="font-serif text-2xl text-dark">Lịch làm việc</h1>
        <div className="flex items-center gap-2 font-sans text-sm">
          <button onClick={() => setDate((d) => addDays(d, -1))}
            className="px-3 py-1.5 bg-white hover:bg-blush border border-dark/10">‹</button>
          <button onClick={() => setDate(initialDate)}
            className="px-3 py-1.5 bg-white hover:bg-blush border border-dark/10">Hôm nay</button>
          <button onClick={() => setDate((d) => addDays(d, 1))}
            className="px-3 py-1.5 bg-white hover:bg-blush border border-dark/10">›</button>
          <span className="ml-2 capitalize text-dark/70">{prettyDate(date)}</span>
        </div>
      </header>

      {data && !data.planityKnown && (
        <p className="mb-3 text-xs text-dark/50 font-sans">
          Planity không khả dụng cho ngày này — chỉ hiển thị các lịch hẹn từ website.
        </p>
      )}

      {loading && <p className="text-dark/40 font-sans text-sm">Đang tải…</p>}

      {data && !loading && (
        <div className="overflow-x-auto border border-dark/10 bg-white">
          <div className="flex min-w-max">
            {/* time gutter */}
            <div className="w-14 shrink-0 border-r border-dark/10">
              <div className="h-10 border-b border-dark/10" />
              <div className="relative" style={{ height: gridHeight }}>
                {hourLines.map((t) => (
                  <div key={t} className="absolute left-0 right-0 text-[10px] text-dark/40 px-1"
                    style={{ top: top(t) - 6 }}>{fmt(t)}</div>
                ))}
              </div>
            </div>

            {/* columns */}
            {columns.map((col) => (
              <div key={col.key} className="shrink-0 border-r border-dark/10" style={{ width: COL_W }}>
                <div className="h-10 flex items-center justify-center text-xs font-sans font-medium
                  text-dark/70 border-b border-dark/10 px-1 text-center truncate">
                  {col.label}
                </div>
                <div className="relative" style={{ height: gridHeight }}>
                  {hourLines.map((t) => (
                    <div key={t} className="absolute left-0 right-0 border-t border-dark/5"
                      style={{ top: top(t) }} />
                  ))}
                  {/* Planity busy blocks (not for the web lane) */}
                  {col.kind !== 'web' && (data.planityBusy[col.key] ?? []).map((iv, i) => (
                    <div key={`p${i}`} className="absolute left-0.5 right-0.5 bg-dark/10 rounded-sm"
                      style={{ top: top(iv.startMin), height: height(iv.startMin, iv.endMin) }}
                      title="Bận (Planity)" />
                  ))}
                  {/* Website bookings */}
                  {(webByCol[col.key] ?? []).map((b) => (
                    <div key={b.id}
                      className="absolute left-0.5 right-0.5 bg-coral text-cream rounded-sm p-1 overflow-hidden"
                      style={{ top: top(b.startMin), height: height(b.startMin, b.endMin) }}
                      title={`${b.clientName} — ${b.phone} — ${b.services}`}>
                      <button
                        onClick={(e) => { e.stopPropagation(); void copyForPlanity(b, col.label) }}
                        title="Sao chép cho Planity"
                        aria-label="Sao chép cho Planity"
                        className="absolute top-0 right-0 px-1 py-0.5 bg-dark/25 hover:bg-dark/50 rounded-bl-sm leading-none"
                      >
                        <CopyIcon />
                      </button>
                      <div className="text-[10px] font-medium leading-tight pr-4">
                        {fmt(b.startMin)} {b.clientName}
                      </div>
                      <div className="text-[9px] leading-tight opacity-90 truncate">{b.services}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data && !loading && data.website.length === 0 && (
        <p className="mt-4 text-dark/40 font-sans text-sm">Không có lịch hẹn từ website hôm nay.</p>
      )}
    </div>
  )
}
