'use client'

import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import Modal from '@/components/ui/Modal'
import ReportGhostForm from '@/components/admin/ReportGhostForm'
import BlockPhoneForm from '@/components/admin/BlockPhoneForm'
import EditEntryForm from '@/components/admin/EditEntryForm'

interface BlocklistEntry {
  phone: string
  clientName: string
  noShowCount: number
  blocked: boolean
  blockedAt?: string
  reason?: string
  updatedAt: string
  ips: string[]
}

export default function BlocklistPage() {
  const [entries, setEntries]   = useState<BlocklistEntry[]>([])
  const [loading, setLoading]   = useState(true)
  const [unlocking, setUnlocking] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [blockOpen, setBlockOpen] = useState(false)
  const [editEntry, setEditEntry] = useState<BlocklistEntry | null>(null)

  const load = useCallback(async () => {
    try {
      const res  = await fetch('/api/blocklist')
      const data = await res.json() as BlocklistEntry[]
      setEntries(data)
    } catch {
      toast.error('Không thể tải danh sách')
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

  const unblock = async (phone: string) => {
    if (!confirm(`Bỏ chặn số ${phone} và đặt lại số lần vắng mặt?`)) return
    setUnlocking(phone)
    try {
      const res = await fetch(`/api/blocklist?phone=${encodeURIComponent(phone)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Đã bỏ chặn số')
      await refresh()
    } catch {
      toast.error('Không thể bỏ chặn số này')
    } finally {
      setUnlocking(null)
    }
  }

  const remove = async (phone: string) => {
    if (!confirm(`Xóa vĩnh viễn mục ${phone}? Hành động này không thể hoàn tác.`)) return
    setUnlocking(phone)
    try {
      const res = await fetch(`/api/blocklist?phone=${encodeURIComponent(phone)}&action=remove`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Đã xóa mục')
      await refresh()
    } catch {
      toast.error('Không thể xóa')
    } finally {
      setUnlocking(null)
    }
  }

  const saveEdit = async (fields: { clientName: string; reason: string }) => {
    if (!editEntry) return
    try {
      const res = await fetch('/api/blocklist', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: editEntry.phone, clientName: fields.clientName, reason: fields.reason }),
      })
      if (!res.ok) throw new Error()
      toast.success('Đã sửa mục')
      setEditEntry(null)
      await refresh()
    } catch {
      toast.error('Không thể sửa')
    }
  }

  const blockedEntries  = entries.filter((e) => e.blocked)
  const trackedEntries  = entries.filter((e) => !e.blocked && e.noShowCount > 0)

  const handleReportSuccess = () => { setFormOpen(false); void refresh() }
  const handleBlockSuccess  = () => { setBlockOpen(false); void refresh() }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-10">
        <div>
          <h1 className="font-serif text-4xl font-light text-dark">Danh sách chặn</h1>
          <p className="font-sans text-sm text-dark/40 mt-1">
            Số bị chặn sau 2 lần vắng mặt · Bỏ chặn thủ công nếu cần.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <button onClick={() => setBlockOpen(true)} className="bg-dark text-cream text-sm px-6 py-3 font-sans tracking-wider hover:bg-coral-dark transition-colors">
            + Chặn một số
          </button>
          <button onClick={() => setFormOpen(true)} className="border border-dark/30 text-dark text-sm px-6 py-3 font-sans tracking-wider hover:border-dark transition-colors">
            + Báo vắng mặt (không đến)
          </button>
        </div>
      </div>

      {/* ── Bloqués ────────────────────────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="font-sans text-xs tracking-[0.2em] uppercase text-dark/40 mb-4">
          Số bị chặn ({blockedEntries.length})
        </h2>
        <div className="bg-cream border border-dark/10 p-6">
          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2].map((i) => <div key={i} className="h-12 bg-dark/5 animate-pulse" />)}
            </div>
          ) : blockedEntries.length === 0 ? (
            <p className="text-sm font-sans text-dark/30 italic">Không có số nào bị chặn.</p>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm font-sans">
              <thead>
                <tr className="border-b border-dark/10">
                  {['Số điện thoại', 'Tên', 'IP', 'Vắng mặt', 'Lý do', 'Ngày chặn', 'Thao tác'].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-xs tracking-[0.2em] uppercase text-dark/30 font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dark/5">
                {blockedEntries.map((entry) => (
                  <tr key={entry.phone} className="hover:bg-blush/50 transition-colors">
                    <td className="py-4 px-4 font-mono text-dark">{entry.phone}</td>
                    <td className="py-4 px-4 text-charcoal-500">{entry.clientName}</td>
                    <td className="py-4 px-4 font-mono text-charcoal-500 text-xs">{entry.ips.join(', ') || '-'}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs bg-orange-50 border-orange-200 text-orange-700">
                        {entry.noShowCount}×
                      </span>
                    </td>
                    <td className="py-4 px-4 text-charcoal-500 text-xs">{entry.reason ?? '-'}</td>
                    <td className="py-4 px-4 text-dark/40 text-xs">
                      {entry.blockedAt ? new Date(entry.blockedAt).toLocaleDateString('vi-VN') : '-'}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2 flex-wrap">
                        <button
                          onClick={() => void unblock(entry.phone)}
                          disabled={unlocking === entry.phone}
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
                          onClick={() => void remove(entry.phone)}
                          disabled={unlocking === entry.phone}
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
            <p className="text-sm font-sans text-dark/30 italic">Không có số nào đang theo dõi.</p>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm font-sans">
              <thead>
                <tr className="border-b border-dark/10">
                  {['Số điện thoại', 'Tên', 'IP', 'Vắng mặt', 'Cập nhật gần nhất', 'Thao tác'].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-xs tracking-[0.2em] uppercase text-dark/30 font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dark/5">
                {trackedEntries.map((entry) => (
                  <tr key={entry.phone} className="hover:bg-blush/50 transition-colors">
                    <td className="py-4 px-4 font-mono text-dark">{entry.phone}</td>
                    <td className="py-4 px-4 text-charcoal-500">{entry.clientName}</td>
                    <td className="py-4 px-4 font-mono text-charcoal-500 text-xs">{entry.ips.join(', ') || '-'}</td>
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
                          onClick={() => void unblock(entry.phone)}
                          disabled={unlocking === entry.phone}
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
                          onClick={() => void remove(entry.phone)}
                          disabled={unlocking === entry.phone}
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

      <Modal open={formOpen} onOpenChange={setFormOpen}
        title="Báo vắng mặt (không đến)"
        description="Ghi nhận một lần vắng mặt cho khách này. Sau 2 lần vắng mặt (cùng số hoặc cùng IP), số sẽ tự động bị chặn.">
        <ReportGhostForm onSuccess={handleReportSuccess} onCancel={() => setFormOpen(false)} />
      </Modal>

      <Modal open={blockOpen} onOpenChange={setBlockOpen}
        title="Chặn một số"
        description="Chặn ngay số này khỏi việc đặt lịch online.">
        <BlockPhoneForm onSuccess={handleBlockSuccess} onCancel={() => setBlockOpen(false)} />
      </Modal>

      <Modal open={editEntry !== null} onOpenChange={(o) => { if (!o) setEditEntry(null) }}
        title="Sửa mục"
        description={editEntry?.phone}>
        {editEntry && (
          <EditEntryForm
            initialName={editEntry.clientName}
            initialReason={editEntry.reason}
            onSubmit={saveEdit}
            onCancel={() => setEditEntry(null)}
          />
        )}
      </Modal>
    </div>
  )
}
