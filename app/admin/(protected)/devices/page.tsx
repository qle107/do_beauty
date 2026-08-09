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
      toast.error('Impossible de charger la liste')
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
    if (!confirm('Débloquer cet appareil et réinitialiser ses absences ?')) return
    setUnlocking(deviceId)
    try {
      const res = await fetch(`/api/devices?deviceId=${encodeURIComponent(deviceId)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Appareil débloqué')
      await refresh()
    } catch {
      toast.error('Impossible de débloquer cet appareil')
    } finally {
      setUnlocking(null)
    }
  }

  const block = async (deviceId: string) => {
    if (!confirm('Bloquer cet appareil maintenant ?')) return
    setUnlocking(deviceId)
    try {
      const res = await fetch('/api/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId }),
      })
      if (!res.ok) throw new Error()
      toast.success('Appareil bloqué')
      await refresh()
    } catch {
      toast.error('Impossible de bloquer cet appareil')
    } finally {
      setUnlocking(null)
    }
  }

  const remove = async (deviceId: string) => {
    if (!confirm('Supprimer définitivement cet appareil ? Cette action est irréversible.')) return
    setUnlocking(deviceId)
    try {
      const res = await fetch(`/api/devices?deviceId=${encodeURIComponent(deviceId)}&action=remove`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Appareil supprimé')
      await refresh()
    } catch {
      toast.error('Suppression impossible')
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
      toast.success('Appareil modifié')
      setEditEntry(null)
      await refresh()
    } catch {
      toast.error('Modification impossible')
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
          <h1 className="font-serif text-4xl font-light text-dark">Appareils</h1>
          <p className="font-sans text-sm text-dark/40 mt-1">
            Appareils bloqués après 2 absences · Repère un client qui réserve sous plusieurs numéros
            depuis le même navigateur.
          </p>
        </div>
        <button onClick={() => setBlockOpen(true)} className="shrink-0 bg-dark text-cream text-sm px-6 py-3 font-sans tracking-wider hover:bg-coral-dark transition-colors">
          + Bloquer un appareil
        </button>
      </div>

      {/* ── Bloqués ────────────────────────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="font-sans text-xs tracking-[0.2em] uppercase text-dark/40 mb-4">
          Appareils bloqués ({blockedEntries.length})
        </h2>
        <div className="bg-cream border border-dark/10 p-6">
          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2].map((i) => <div key={i} className="h-12 bg-dark/5 animate-pulse" />)}
            </div>
          ) : blockedEntries.length === 0 ? (
            <p className="text-sm font-sans text-dark/30 italic">Aucun appareil bloqué.</p>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm font-sans">
              <thead>
                <tr className="border-b border-dark/10">
                  {['Appareil', 'Nom', 'Téléphones', 'Absences', 'Bloqué le', 'Action'].map((h) => (
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
                      {entry.blockedAt ? new Date(entry.blockedAt).toLocaleDateString('fr-FR') : '-'}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2 flex-wrap">
                        <button
                          onClick={() => void unblock(entry.deviceId)}
                          disabled={unlocking === entry.deviceId}
                          className="text-xs text-emerald-600 hover:text-emerald-800 border border-emerald-200 hover:border-emerald-400 px-3 py-1.5 transition-colors disabled:opacity-40"
                        >
                          Débloquer
                        </button>
                        <button
                          onClick={() => setEditEntry(entry)}
                          className="text-xs text-charcoal-500 hover:text-dark border border-dark/20 hover:border-dark px-3 py-1.5 transition-colors"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => void remove(entry.deviceId)}
                          disabled={unlocking === entry.deviceId}
                          className="text-xs text-red-600 hover:text-red-800 border border-red-200 hover:border-red-400 px-3 py-1.5 transition-colors disabled:opacity-40"
                        >
                          Supprimer
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
          Sous surveillance ({trackedEntries.length})
        </h2>
        <div className="bg-cream border border-dark/10 p-6">
          {loading ? (
            <div className="h-10 bg-dark/5 animate-pulse" />
          ) : trackedEntries.length === 0 ? (
            <p className="text-sm font-sans text-dark/30 italic">Aucun appareil sous surveillance.</p>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm font-sans">
              <thead>
                <tr className="border-b border-dark/10">
                  {['Appareil', 'Nom', 'Téléphones', 'Absences', 'Dernière mise à jour', 'Action'].map((h) => (
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
                      {new Date(entry.updatedAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2 flex-wrap">
                        <button
                          onClick={() => void block(entry.deviceId)}
                          disabled={unlocking === entry.deviceId}
                          className="text-xs text-orange-700 hover:text-orange-900 border border-orange-200 hover:border-orange-400 px-3 py-1.5 transition-colors disabled:opacity-40"
                        >
                          Bloquer
                        </button>
                        <button
                          onClick={() => void unblock(entry.deviceId)}
                          disabled={unlocking === entry.deviceId}
                          className="text-xs text-dark/40 hover:text-dark border border-dark/20 hover:border-dark px-3 py-1.5 transition-colors disabled:opacity-40"
                        >
                          Réinitialiser
                        </button>
                        <button
                          onClick={() => setEditEntry(entry)}
                          className="text-xs text-charcoal-500 hover:text-dark border border-dark/20 hover:border-dark px-3 py-1.5 transition-colors"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => void remove(entry.deviceId)}
                          disabled={unlocking === entry.deviceId}
                          className="text-xs text-red-600 hover:text-red-800 border border-red-200 hover:border-red-400 px-3 py-1.5 transition-colors disabled:opacity-40"
                        >
                          Supprimer
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
        title="Modifier l'appareil"
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
        title="Bloquer un appareil"
        description="Bloque immédiatement un appareil par son identifiant (visible dans l'e-mail d'alerte de réservation).">
        <BlockDeviceForm onSuccess={() => { setBlockOpen(false); void refresh() }} onCancel={() => setBlockOpen(false)} />
      </Modal>
    </div>
  )
}
