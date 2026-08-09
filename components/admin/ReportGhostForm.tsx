'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'

const ghostReportSchema = z.object({
  clientName: z.string().min(2, 'Le nom doit comporter au moins 2 caractères'),
  phone: z.string().min(1, 'Le numéro de téléphone est requis'),
  ip: z.string().optional(),
})

type GhostReportInput = z.infer<typeof ghostReportSchema>

interface ReportGhostFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export default function ReportGhostForm({ onSuccess, onCancel }: ReportGhostFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GhostReportInput>({ resolver: zodResolver(ghostReportSchema) })

  const onSubmit = async (data: GhostReportInput) => {
    try {
      const res = await fetch('/api/blocklist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      toast.success('Absence enregistrée')
      onSuccess()
    } catch {
      toast.error('Impossible d\'enregistrer cette absence')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Input label="Nom du client" id="clientName" placeholder="Nom" error={errors.clientName?.message} {...register('clientName')} />

      <Input label="Téléphone" id="phone" placeholder="06 12 34 56 78" error={errors.phone?.message} {...register('phone')} />

      <Input label="Adresse IP (optionnel)" id="ip" placeholder="Depuis l'e-mail d'alerte de réservation" error={errors.ip?.message} {...register('ip')} />

      <div className="flex gap-3 pt-2">
        <Button variant="outline" type="button" onClick={onCancel}>Annuler</Button>
        <Button type="submit" isLoading={isSubmitting}>Enregistrer l&apos;absence</Button>
      </div>
    </form>
  )
}
