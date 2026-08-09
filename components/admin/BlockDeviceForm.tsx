'use client'

import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'

interface BlockDeviceFormProps {
  onSuccess: () => void
  onCancel: () => void
}

// Blocks a device by its id (POST /api/devices). The id can be copied from a
// booking alert; the store creates a record if the device isn't known yet.
export default function BlockDeviceForm({ onSuccess, onCancel }: BlockDeviceFormProps) {
  const [deviceId, setDeviceId] = useState('')
  const [reason, setReason] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId: deviceId.trim(), reason }),
      })
      if (!res.ok) throw new Error()
      toast.success('Appareil bloqué')
      onSuccess()
    } catch {
      toast.error('Impossible de bloquer cet appareil')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <Input
        label="Identifiant de l'appareil"
        id="deviceId"
        placeholder="ex : 3f2a…"
        value={deviceId}
        onChange={(e) => setDeviceId(e.target.value)}
      />
      <Input
        label="Motif (optionnel)"
        id="deviceReason"
        placeholder="Ex : comportement abusif"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
      <div className="flex gap-3 pt-2">
        <Button variant="outline" type="button" onClick={onCancel}>Annuler</Button>
        <Button type="submit" isLoading={saving} disabled={deviceId.trim().length < 4}>Bloquer l&apos;appareil</Button>
      </div>
    </form>
  )
}
