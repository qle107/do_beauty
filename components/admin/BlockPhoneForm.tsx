'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'

const blockPhoneSchema = z.object({
  clientName: z.string().min(2, 'Le nom doit comporter au moins 2 caractères'),
  phone: z.string().min(1, 'Le numéro de téléphone est requis'),
  reason: z.string().optional(),
})

type BlockPhoneInput = z.infer<typeof blockPhoneSchema>

interface BlockPhoneFormProps {
  onSuccess: () => void
  onCancel: () => void
}

// Immediately blocks a phone number (admin action) via POST /api/blocklist.
// Unlike ReportGhostForm (which logs a no-show and only auto-blocks at the
// threshold), this blocks straight away.
export default function BlockPhoneForm({ onSuccess, onCancel }: BlockPhoneFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BlockPhoneInput>({ resolver: zodResolver(blockPhoneSchema) })

  const onSubmit = async (data: BlockPhoneInput) => {
    try {
      const res = await fetch('/api/blocklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      toast.success('Numéro bloqué')
      onSuccess()
    } catch {
      toast.error('Impossible de bloquer ce numéro')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Input label="Nom du client" id="clientName" placeholder="Nom" error={errors.clientName?.message} {...register('clientName')} />

      <Input label="Téléphone" id="phone" placeholder="06 12 34 56 78" error={errors.phone?.message} {...register('phone')} />

      <Input label="Motif (optionnel)" id="reason" placeholder="Ex : comportement abusif" error={errors.reason?.message} {...register('reason')} />

      <div className="flex gap-3 pt-2">
        <Button variant="outline" type="button" onClick={onCancel}>Annuler</Button>
        <Button type="submit" isLoading={isSubmitting}>Bloquer le numéro</Button>
      </div>
    </form>
  )
}
