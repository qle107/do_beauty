'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, type ContactInput } from '@/lib/validations'
import toast from 'react-hot-toast'
import Input, { Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import TurnstileWidget from '@/components/booking/TurnstileWidget'
import MapEmbed from '@/components/sections/MapEmbed'
import { site } from '@/lib/site'

export default function ContactPageClient() {
  const [submitted, setSubmitted] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) })

  const handleTurnstileVerify = useCallback((token: string) => setTurnstileToken(token), [])
  const handleTurnstileExpire = useCallback(() => setTurnstileToken(null), [])

  const onSubmit = async (data: ContactInput) => {
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken) {
      toast.error('Veuillez compléter la vérification de sécurité.')
      return
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, turnstileToken: turnstileToken ?? '__dev__' }),
      })
      if (!res.ok) throw new Error('Erreur réseau')
      toast.success('Message envoyé ! Nous vous répondrons rapidement.')
      setSubmitted(true)
      setTurnstileToken(null)
      reset()
    } catch {
      toast.error('Une erreur est survenue. Veuillez réessayer.')
    }
  }

  return (
    <div className="min-h-screen bg-cream pt-28 pb-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* En-tête */}
        <div className="mb-16">
          <p className="font-script text-coral text-3xl mb-2">Bonjour !</p>
          <h1 className="font-serif text-5xl md:text-6xl font-light text-dark">Nous contacter</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          {/* Colonne gauche - Informations */}
          <div>
            <div className="mb-10">
              <h3 className="text-xs tracking-[0.3em] uppercase text-charcoal-500 font-sans mb-5">Adresse</h3>
              <address className="not-italic font-sans text-sm text-charcoal-500 leading-relaxed flex flex-col gap-1">
                <span className="font-medium text-dark">{site.name}</span>
                <span>{site.address.street}</span>
                <span>{site.address.city}</span>
                <span className="text-charcoal-500 text-xs mt-1">{site.address.transit}</span>
              </address>
            </div>

            <div className="mb-10">
              <h3 className="text-xs tracking-[0.3em] uppercase text-charcoal-500 font-sans mb-5">Horaires</h3>
              <div className="font-sans text-sm text-charcoal-500 flex flex-col gap-1.5">
                <div className="flex justify-between max-w-xs">
                  <span>{site.hours.label}</span>
                  <span className="font-medium text-dark">{site.hours.display}</span>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-xs tracking-[0.3em] uppercase text-charcoal-500 font-sans mb-5">Contact</h3>
              <div className="flex flex-col gap-2 font-sans text-sm">
                <a href={`tel:${site.phone.tel}`} className="text-charcoal-500 hover:text-coral transition-colors">
                  {site.phone.display}
                </a>
                <a href={`mailto:${site.email}`} className="text-charcoal-500 hover:text-coral transition-colors">
                  {site.email}
                </a>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-xs tracking-[0.3em] uppercase text-charcoal-500 font-sans mb-5">Paiement</h3>
              <p className="font-sans text-sm text-charcoal-500">
                💵 <strong className="text-dark">Carte bancaire et espèces</strong><br/>
                <span className="text-xs text-charcoal-500">Nous n&apos;acceptons pas les cartes bancaires.</span>
              </p>
            </div>

            <div className="mb-10">
              <h3 className="text-xs tracking-[0.3em] uppercase text-charcoal-500 font-sans mb-5">Nous suivre</h3>
              <div className="flex flex-col gap-3">
                <a
                  href="/booking"
                  className="text-sm font-sans text-charcoal-500 hover:text-coral transition-colors"
                >
                  📅 Prendre rendez-vous en ligne
                </a>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-sans text-charcoal-500 hover:text-coral transition-colors"
                >
                  📸 Instagram
                </a>
                <a
                  href={site.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-sans text-charcoal-500 hover:text-coral transition-colors"
                >
                  📘 Facebook
                </a>
              </div>
            </div>

            {/* Carte Google Maps */}
            <div>
              <h3 className="text-xs tracking-[0.3em] uppercase text-charcoal-500 font-sans mb-4">Nous trouver</h3>
              {/* Click-to-load facade: no Google Maps tracker fires before the
                  visitor asks for the map (same pattern as the homepage). */}
              <div className="relative w-full h-48 bg-blush overflow-hidden">
                <MapEmbed />
              </div>
            </div>
          </div>

          {/* Colonne droite - Formulaire */}
          <div>
            {submitted ? (
              <div className="flex flex-col items-start gap-6 py-12">
                <span className="text-coral text-5xl">✳</span>
                <h2 className="font-serif text-4xl font-light text-dark">Message envoyé !</h2>
                <p className="font-sans text-sm text-charcoal-500">
                  Merci de nous avoir contacté. Nous vous répondons généralement dans les 24h.
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  Envoyer un autre message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
                <Input
                  label="Nom complet"
                  id="name"
                  placeholder="Marie Dupont"
                  error={errors.name?.message}
                  {...register('name')}
                />
                <Input
                  label="Email"
                  id="email"
                  type="email"
                  placeholder="marie@exemple.fr"
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Input
                  label="Objet"
                  id="subject"
                  placeholder="Question sur les prestations"
                  error={errors.subject?.message}
                  {...register('subject')}
                />
                <Textarea
                  label="Message"
                  id="message"
                  placeholder="Comment pouvons-nous vous aider ?"
                  error={errors.message?.message}
                  {...register('message')}
                />
                <TurnstileWidget onVerify={handleTurnstileVerify} onExpire={handleTurnstileExpire} />
                <Button
                  type="submit"
                  size="lg"
                  isLoading={isSubmitting}
                  disabled={!!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken}
                >
                  Envoyer
                </Button>
                <p className="text-xs font-sans text-dark/40 leading-relaxed">
                  En envoyant ce message, vous acceptez que vos informations soient utilisées pour
                  traiter votre demande. Consultez notre{' '}
                  <a href="/privacy" className="underline hover:text-coral transition-colors">
                    politique de confidentialité
                  </a>
                  .
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
