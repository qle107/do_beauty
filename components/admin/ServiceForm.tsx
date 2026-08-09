'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { serviceSchema, type ServiceInput } from '@/lib/validations'
import Input, { Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'
import type { Service } from '@/lib/types'

interface ServiceFormProps {
  service?: Service
  onSuccess: () => void
  onCancel: () => void
}

const CATEGORY_OPTIONS = [
  { value: 'FORFAIT',   label: 'Forfaits spa' },
  { value: 'MAINS',     label: 'Mains & manucure' },
  { value: 'PIEDS',     label: 'Beauté des pieds' },
  { value: 'CAPSULE',   label: 'Pose & extensions' },
  { value: 'NAIL_ART',  label: 'Nail art & finitions' },
  { value: 'CILS',      label: 'Cils & regard' },
  { value: 'VISAGE',    label: 'Soins du visage' },
  { value: 'CORPS',     label: 'Massages & corps' },
  { value: 'EPILATION', label: 'Épilation' },
]

export default function ServiceForm({ service, onSuccess, onCancel }: ServiceFormProps) {
  const isEditing = !!service

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service
      ? {
          name: service.name,
          description: service.description,
          price: service.price,
          duration: service.duration,
          category: service.category as ServiceInput['category'],
          isActive: service.isActive,
        }
      : { category: 'MAINS', isActive: true },
  })

  const onSubmit = async (data: ServiceInput) => {
    try {
      const url = isEditing ? `/api/services/${service.id}` : '/api/services'
      const method = isEditing ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      toast.success(isEditing ? 'Prestation mise à jour' : 'Prestation créée')
      onSuccess()
    } catch {
      toast.error('Impossible d\'enregistrer la prestation')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Input label="Nom de la prestation" id="name" placeholder="Pose de vernis semi-permanent" error={errors.name?.message} {...register('name')} />

      <Textarea label="Description" id="description" placeholder="Description de la prestation…" error={errors.description?.message} {...register('description')} />

      <div className="grid grid-cols-2 gap-4">
        <Input label="Prix (€)" id="price" type="number" step="0.01" min="0" placeholder="17" error={errors.price?.message} {...register('price', { valueAsNumber: true })} />
        <Input label="Durée (min)" id="duration" type="number" min="0" placeholder="30" error={errors.duration?.message} {...register('duration', { valueAsNumber: true })} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs tracking-[0.2em] uppercase text-charcoal-500 font-sans">Catégorie</label>
        <select className="w-full border-b border-dark/30 bg-transparent py-2.5 text-sm font-sans text-dark focus:border-coral focus:outline-none" {...register('category')}>
          {CATEGORY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
      </div>

      <div className="flex items-center gap-3">
        <input type="checkbox" id="isActive" className="accent-coral" {...register('isActive')} />
        <label htmlFor="isActive" className="text-sm font-sans text-charcoal-500">Actif (visible sur le site)</label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="outline" type="button" onClick={onCancel}>Annuler</Button>
        <Button type="submit" isLoading={isSubmitting}>{isEditing ? 'Enregistrer' : 'Créer la prestation'}</Button>
      </div>
    </form>
  )
}
