'use client'

import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface EditEntryFormProps {
  initialName: string
  initialReason?: string
  onSubmit: (fields: { clientName: string; reason: string }) => Promise<void>
  onCancel: () => void
}

// Shared editor for a blocklist entry or a device: name + reason. The parent
// wires the PUT request (endpoint differs per page) and closes the modal.
export default function EditEntryForm({ initialName, initialReason, onSubmit, onCancel }: EditEntryFormProps) {
  const [clientName, setClientName] = useState(initialName)
  const [reason, setReason] = useState(initialReason ?? '')
  const [saving, setSaving] = useState(false)

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSubmit({ clientName, reason })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handle} className="flex flex-col gap-6">
      <Input label="Tên khách hàng" id="editName" value={clientName} onChange={(e) => setClientName(e.target.value)} />
      <Input label="Lý do" id="editReason" placeholder="Để trống để xóa" value={reason} onChange={(e) => setReason(e.target.value)} />
      <div className="flex gap-3 pt-2">
        <Button variant="outline" type="button" onClick={onCancel}>Hủy</Button>
        <Button type="submit" isLoading={saving} disabled={clientName.trim().length < 2}>Lưu</Button>
      </div>
    </form>
  )
}
