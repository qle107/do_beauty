'use client'

import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import Modal from '@/components/ui/Modal'
import EditEntryForm from '@/components/admin/EditEntryForm'
import BlockDeviceForm from '@/components/admin/BlockDeviceForm'

interface DeviceEntry {
  deviceId: string
  phones: string[]
  clientName: string
  bookingCount: number
  noShowCount: number
  blocked: boolean
  blockedAt?: string
  reason?: string
  firstSeen: string
  updatedAt: string
}

// Short, readable form of the UUID for the table; full id shown on hover.
const shortId = (id: string) => id.slice(0, 8)

export default function DevicesPage() {
  const [entries, setEntries]     = useState<DeviceEntry[]>([])
  const [loading, setLoading]     = useState(true)
  const [unlocking, setUnlocking] = useState<string | null>(null)
  const [editEntry, setEditEntry] = useState<DeviceEntry | null>(null)
  const [blockOpen, setBlockOpen] = useState(false)

  const load = useCallback(async () => {
    try {
      const res  = await fetch('/api/devices')
      const data = await res.json() as DeviceEntry[]
      setEntries(data)
    } catch {
      toast.error('Không tải được danh sách')
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

  const unblock = async (deviceId: string) => {
    if (!confirm('Bỏ chặn thiết bị này và đặt lại số lần vắng mặt?')) return
    setUnlocking(deviceId)
    try {
      const res = await fetch(`/api/devices?deviceId=${encodeURIComponent(deviceId)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Đã bỏ chặn thiết bị')
      await refresh()
    } catch {
      toast.error('Không bỏ chặn được thiết bị này')
    } finally {
      setUnlocking(null)
    }
  }

  const block = async (deviceId: string) => {
    if (!confirm('Chặn thiết bị này ngay?')) return
    setUnlocking(deviceId)
    try {
      const res = await fetch('/api/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId }),
      })
      if (!res.ok) throw new Error()
      toast.success('Đã chặn thiết bị')
      await refresh()
    } catch {
      toast.error('Không chặn được thiết bị này')
    } finally {
      setUnlocking(null)
    }
  }

  const remove = async (deviceId: string) => {
    if (!confirm('Xóa vĩnh viễn thiết bị này? Hành động này không thể hoàn tác.')) return
    setUnlocking(deviceId)
    try {
      const res = await fetch(`/api/devices?deviceId=${encodeURIComponent(deviceId)}&action=remove`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Đã xóa thiết bị')
      await refresh()
    } catch {
      toast.error('Không xóa được')
    } finally {
      setUnlocking(null)
    }
  }

  const saveEdit = async (fields: { clientName: string; reason: string }) => {
    if (!editEntry) return
    try {
      const res = await fetch('/api/devices', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId: editEntry.deviceId, clientName: fields.clientName, reason: fields.reason }),
      })
      if (!res.ok) throw new Error()
      toast.success('Đã sửa thiết bị')
      setEditEntry(null)
      await refresh()
    } catch {
      toast.error('Không sửa được')
    }
  }

  const blockedEntries = entries.filter((e) => e.blocked)
  const trackedEntries = entries.filter((e) => !e.blocked && e.noShowCount > 0)

  // Render the phone list, highlighting when a single device has booked under
  // several numbers — the signal that someone is dodging the phone blocklist.
  const renderPhones = (phones: string[]) => (
    <div className="flex flex-col gap-0.5">
      {phones.length === 0 ? (
        <span className="text-dark/30">-</span>
      ) : (
        phones.map((p) => <span key={p} className="font-mono text-charcoal-500">{p}</span>)
      )}
    </div>
  )

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-10">
        <div>
          <h1 className="font-serif text-4xl font-light text-dark">Thiết bị</h1>
          <p className="font-sans text-sm text-dark/40 mt-1">
            Thiết bị bị chặn sau 2 lần vắng mặt · Phát hiện khách đặt lịch bằng nhiều số điện thoại
            từ cùng một trình duyệt.
          </p>
        </div>
        <button onClick={() => setBlockOpen(true)} className="shrink-0 bg-dark text-cream text-sm px-6 py-3 font-sans tracking-wider hover:bg-coral-dark transition-colors">
          + Chặn thiết bị
        </button>
      </div>

      {/* ── Bloqués ────────────────────────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="font-sans text-xs tracking-[0.2em] uppercase text-dark/40 mb-4">
          Thiết bị bị chặn ({blockedEntries.length})
        </h2>
        <div className="bg-cream border border-dark/10 p-6">
          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2].map((i) => <div key={i} className="h-12 bg-dark/5 animate-pulse" />)}
            </div>
          ) : blockedEntries.length === 0 ? (
            <p className="text-sm font-sans text-dark/30 italic">Không có thiết bị bị chặn.</p>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm font-sans">
              <thead>
                <tr className="border-b border-dark/10">
                  {['Thiết bị', 'Tên', 'SĐT', 'Vắng mặt', 'Ngày chặn', 'Thao tác'].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-xs tracking-[0.2em] uppercase text-dark/30 font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dark/5">
                {blockedEntries.map((entry) => (
                  <tr key={entry.deviceId} className="hover:bg-blush/50 transition-colors align-top">
                    <td className="py-4 px-4 font-mono text-charcoal-500 text-xs" title={entry.deviceId}>{shortId(entry.deviceId)}</td>
                    <td className="py-4 px-4 text-charcoal-500">{entry.clientName}</td>
                    <td className="py-4 px-4 text-xs">{renderPhones(entry.phones)}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs bg-orange-50 border-orange-200 text-orange-700">
                        {entry.noShowCount}×
                      </span>
                    </td>
                    <td className="py-4 px-4 text-dark/40 text-xs">
                      {entry.blockedAt ? new Date(entry.blockedAt).toLocaleDateString('vi-VN') : '-'}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2 flex-wrap">
                        <button
                          onClick={() => void unblock(entry.deviceId)}
                          disabled={unlocking === entry.deviceId}
                          className="text-xs text-emerald-600 hover:text-emerald-800 border border-emerald-200 hover:border-emerald-400 px-3 py-1.5 transition-colors disabled:opacity-40"
                        >
                          Bỏ chặn
                        </button>
                        <button
                          onClick={() => setEditEntry(entry)}
                          className="text-xs text-charcoal-500 hover:text-dark border border-dark/20 hover:border-dark px-3 py-1.5 transition-colors"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => void remove(entry.deviceId)}
                          disabled={unlocking === entry.deviceId}
                          className="text-xs text-red-600 hover:text-red-800 border border-red-200 hover:border-red-400 px-3 py-1.5 transition-colors disabled:opacity-40"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </section>

      {/* ── Surveillés (absences < seuil) ──────────────────────────────── */}
      <section>
        <h2 className="font-sans text-xs tracking-[0.2em] uppercase text-dark/40 mb-4">
          Đang theo dõi ({trackedEntries.length})
        </h2>
        <div className="bg-cream border border-dark/10 p-6">
          {loading ? (
            <div className="h-10 bg-dark/5 animate-pulse" />
          ) : trackedEntries.length === 0 ? (
            <p className="text-sm font-sans text-dark/30 italic">Không có thiết bị nào đang theo dõi.</p>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm font-sans">
              <thead>
                <tr className="border-b border-dark/10">
                  {['Thiết bị', 'Tên', 'SĐT', 'Vắng mặt', 'Cập nhật lần cuối', 'Thao tác'].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-xs tracking-[0.2em] uppercase text-dark/30 font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dark/5">
                {trackedEntries.map((entry) => (
                  <tr key={entry.deviceId} className="hover:bg-blush/50 transition-colors align-top">
                    <td className="py-4 px-4 font-mono text-charcoal-500 text-xs" title={entry.deviceId}>{shortId(entry.deviceId)}</td>
                    <td className="py-4 px-4 text-charcoal-500">{entry.clientName}</td>
                    <td className="py-4 px-4 text-xs">{renderPhones(entry.phones)}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs bg-amber-50 border-amber-200 text-amber-700">
                        {entry.noShowCount}×
                      </span>
                    </td>
                    <td className="py-4 px-4 text-dark/40 text-xs">
                      {new Date(entry.updatedAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2 flex-wrap">
                        <button
                          onClick={() => void block(entry.deviceId)}
                          disabled={unlocking === entry.deviceId}
                          className="text-xs text-orange-700 hover:text-orange-900 border border-orange-200 hover:border-orange-400 px-3 py-1.5 transition-colors disabled:opacity-40"
                        >
                          Chặn
                        </button>
                        <button
                          onClick={() => void unblock(entry.deviceId)}
                          disabled={unlocking === entry.deviceId}
                          className="text-xs text-dark/40 hover:text-dark border border-dark/20 hover:border-dark px-3 py-1.5 transition-colors disabled:opacity-40"
                        >
                          Đặt lại
                        </button>
                        <button
                          onClick={() => setEditEntry(entry)}
                          className="text-xs text-charcoal-500 hover:text-dark border border-dark/20 hover:border-dark px-3 py-1.5 transition-colors"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => void remove(entry.deviceId)}
                          disabled={unlocking === entry.deviceId}
                          className="text-xs text-red-600 hover:text-red-800 border border-red-200 hover:border-red-400 px-3 py-1.5 transition-colors disabled:opacity-40"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </section>

      <Modal open={editEntry !== null} onOpenChange={(o) => { if (!o) setEditEntry(null) }}
        title="Sửa thiết bị"
        description={editEntry?.deviceId}>
        {editEntry && (
          <EditEntryForm
            initialName={editEntry.clientName}
            initialReason={editEntry.reason}
            onSubmit={saveEdit}
            onCancel={() => setEditEntry(null)}
          />
        )}
      </Modal>

      <Modal open={blockOpen} onOpenChange={setBlockOpen}
        title="Chặn thiết bị"
        description="Chặn ngay một thiết bị bằng mã định danh (hiển thị trong email cảnh báo đặt lịch).">
        <BlockDeviceForm onSuccess={() => { setBlockOpen(false); void refresh() }} onCancel={() => setBlockOpen(false)} />
      </Modal>
    </div>
  )
}
