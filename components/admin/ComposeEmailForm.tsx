'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import Input, { Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { businessEmailSchema, type BusinessEmailInput } from '@/lib/validations'

interface ComposeEmailFormProps {
  contactEmails: string[]   // known recipients, offered as datalist suggestions
  onSuccess: () => void
  onCancel: () => void
}

export default function ComposeEmailForm({ contactEmails, onSuccess, onCancel }: ComposeEmailFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusinessEmailInput>({ resolver: zodResolver(businessEmailSchema) })

  const onSubmit = async (data: BusinessEmailInput) => {
    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      toast.success('Email envoyé')
      onSuccess()
    } catch {
      toast.error("L'envoi a échoué")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Input
        label="Destinataire"
        id="to"
        type="email"
        list="contact-emails"
        placeholder="client@exemple.fr"
        error={errors.to?.message}
        {...register('to')}
      />
      <datalist id="contact-emails">
        {contactEmails.map((e) => <option key={e} value={e} />)}
      </datalist>

      <Input label="Objet" id="subject" placeholder="Objet du message" error={errors.subject?.message} {...register('subject')} />

      <Textarea label="Message" id="body" rows={6} placeholder="Votre message…" error={errors.body?.message} {...register('body')} />

      <div className="flex gap-3 pt-2">
        <Button variant="outline" type="button" onClick={onCancel}>Annuler</Button>
        <Button type="submit" isLoading={isSubmitting}>Envoyer</Button>
      </div>
    </form>
  )
}
