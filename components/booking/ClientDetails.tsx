'use client'

import { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import imageCompression from 'browser-image-compression'
import toast from 'react-hot-toast'
import Input, { Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import TurnstileWidget from './TurnstileWidget'
import { formatDate, formatCurrency, formatDuration } from '@/lib/utils'
import { clientDetailsSchema, type ClientDetailsInput } from '@/lib/validations'
import { getDeviceId } from '@/lib/device-id'
import { getFingerprint } from '@/lib/fingerprint'
import { track } from '@/lib/analytics'
import { site } from '@/lib/site'
import {
  buildGoogleCalendarUrl,
  buildIcsDataUrl,
  buildOutlookCalendarUrl,
  type BookingForCalendar,
} from '@/lib/booking/calendar-links'
import type { BookingState } from './BookingForm'

interface ClientDetailsProps {
  booking: BookingState
  onBack: () => void
  /** Called once the booking is confirmed - used to clear sessionStorage draft. */
  onConfirmed?: () => void
}

const MAX_PHOTOS = 3

export default function ClientDetails({ booking, onBack, onConfirmed }: ClientDetailsProps) {
  const [confirmed, setConfirmed]               = useState(false)
  const [turnstileToken, setTurnstileToken]     = useState<string | null>(null)
  const [hasConflict, setHasConflict]           = useState(false)
  const [pendingData, setPendingData]           = useState<ClientDetailsInput | null>(null)
  const [photos, setPhotos]                     = useState<string[]>([])   // compressed data URLs
  const [compressing, setCompressing]           = useState(false)

  // Funnel: user reached the final details step (consent-gated, no PII pushed).
  useEffect(() => {
    track('booking_begin_details')
  }, [])

  // Compress each picked image in the browser (resize + re-encode to JPEG) so the
  // upload stays small but detailed, then keep it as a data URL for the POST body.
  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''   // let the same file be re-picked after a remove
    if (files.length === 0) return
    const room = MAX_PHOTOS - photos.length
    if (room <= 0) {
      toast.error(`Maximum ${MAX_PHOTOS} photos.`)
      return
    }
    setCompressing(true)
    try {
      const next: string[] = []
      for (const file of files.slice(0, room)) {
        if (!file.type.startsWith('image/')) continue
        const compressed = await imageCompression(file, {
          maxWidthOrHeight: 1600,
          maxSizeMB: 0.4,
          initialQuality: 0.82,
          fileType: 'image/jpeg',
          useWebWorker: true,
        })
        next.push(await imageCompression.getDataUrlFromFile(compressed))
      }
      if (next.length > 0) setPhotos((p) => [...p, ...next])
      if (files.length > 0 && next.length === 0) {
        toast.error('Format non supporté ou image illisible (essayez JPEG ou PNG).')
      }
    } catch {
      toast.error('Impossible de traiter cette image. Essayez une photo JPEG ou PNG.')
    } finally {
      setCompressing(false)
    }
  }

  const removePhoto = (index: number) =>
    setPhotos((p) => p.filter((_, i) => i !== index))

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token)
  }, [])

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken(null)
  }, [])

  const totalDuration = booking.services.reduce((sum, s) => sum + s.duration, 0)
  const totalPrice    = booking.services.reduce((sum, s) => sum + s.price, 0)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientDetailsInput>({ resolver: zodResolver(clientDetailsSchema) })

  const submitBooking = async (data: ClientDetailsInput, confirmReplace?: boolean) => {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientName:       data.clientName,
        clientPhone:      data.clientPhone,
        notes:            data.notes,
        serviceIds:       booking.services.map((s) => s.id),
        date:             booking.date,
        timeSlot:         booking.timeSlot,
        preferredEmployeeId: booking.employeeId || undefined,
        deviceId:         getDeviceId(),
        fingerprint:      getFingerprint(),
        turnstileToken:   turnstileToken ?? '__dev__',
        confirmReplace,
        images:           photos,
      }),
    })

    // Parse the body defensively: on a server/gateway error the response can be
    // an HTML error page, not JSON. Calling res.json() on HTML throws the cryptic
    // "Unexpected token '<'" error, which hid the real HTTP status from the user.
    const payload = (await res.json().catch(() => null)) as { error?: string } | null

    if (res.status === 409) {
      if (payload?.error === 'existing_appointment') {
        // Ask the user whether they want to reschedule
        setHasConflict(true)
        setPendingData(data)
        return
      }
      throw new Error('Vous avez déjà un rendez-vous actif.')
    }

    if (!res.ok) {
      throw new Error(
        payload?.error ||
          `Le serveur a rencontré une erreur (code ${res.status}). Merci de réessayer dans un instant ou de nous appeler.`
      )
    }

    setHasConflict(false)
    setPendingData(null)
    setConfirmed(true)
    onConfirmed?.()
    toast.success('Rendez-vous enregistré !')
    // Conversion - fires once here (the 409 conflict path returns earlier, so it
    // never fires on the reschedule prompt). Value only, never PII.
    track('booking_confirmed', {
      value: totalPrice,
      currency: 'EUR',
      service_count: booking.services.length,
    })
  }

  const onSubmit = async (data: ClientDetailsInput) => {
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken) {
      toast.error('Veuillez compléter la vérification de sécurité.')
      return
    }
    try {
      await submitBooking(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  const onConfirmReschedule = async () => {
    if (!pendingData) return
    try {
      await submitBooking(pendingData, true)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  if (confirmed) {
    return (
      <ConfirmedView
        booking={booking}
        totalDuration={totalDuration}
        totalPrice={totalPrice}
      />
    )
  }

  return (
    <div>
      <h2 className="font-serif text-3xl font-light text-dark mb-2">Vos coordonnées</h2>
      <p className="font-sans text-sm text-dark/40 mb-10">Plus qu&apos;une étape !</p>

      {/* Récapitulatif en haut */}
      <div className="bg-blush p-6 mb-10">
        <p className="font-sans text-xs tracking-[0.2em] uppercase text-dark/40 mb-3">Votre panier</p>
        <div className="flex flex-col gap-1.5 mb-3">
          {booking.services.map((s) => (
            <div key={s.id} className="flex justify-between text-sm font-sans">
              <span className="text-charcoal-500">{s.name}</span>
              <span className="text-charcoal-500">{formatCurrency(s.price)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-dark/10 pt-3 flex justify-between items-baseline">
          <div>
            <p className="font-sans text-xs text-charcoal-500">{formatDate(booking.date)} à {booking.timeSlot}</p>
            <p className="font-sans text-xs text-dark/40">Durée : {formatDuration(totalDuration)}</p>
            <p className="font-sans text-xs text-dark/40">Praticienne : {booking.employeeName || 'Sans préférence'}</p>
          </div>
          <p className="font-serif text-xl text-coral">{formatCurrency(totalPrice)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <Input
          label="Nom complet"
          id="clientName"
          placeholder="Marie Dupont"
          error={errors.clientName?.message}
          {...register('clientName')}
        />
        <Input
          label="Téléphone"
          id="clientPhone"
          type="tel"
          placeholder="06 12 34 56 78"
          error={errors.clientPhone?.message}
          {...register('clientPhone')}
        />
        <Textarea
          label="Remarques (optionnel)"
          id="notes"
          placeholder="Allergies, préférences particulières…"
          error={errors.notes?.message}
          {...register('notes')}
        />

        {/* ── Photos de référence (optionnel) ─────────────────────── */}
        <div className="flex flex-col gap-3">
          <label className="text-xs tracking-[0.2em] uppercase text-charcoal-500 font-sans">
            Photos d&apos;inspiration (optionnel)
          </label>
          <p className="text-xs font-sans text-dark/40 -mt-1">
            Ajoutez jusqu&apos;à {MAX_PHOTOS} photos du modèle souhaité. Elles sont compressées
            automatiquement et transmises à votre prothésiste.
          </p>

          {photos.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {photos.map((src, i) => (
                <div key={i} className="relative w-20 h-20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Photo ${i + 1}`} className="w-20 h-20 object-cover border border-dark/10" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    aria-label={`Retirer la photo ${i + 1}`}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-dark text-cream text-xs flex items-center justify-center hover:bg-coral-dark transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {photos.length < MAX_PHOTOS && (
            <label className={`inline-flex items-center gap-2 self-start text-xs font-sans border border-dark/20 px-4 py-2.5 transition-colors ${
              compressing ? 'opacity-50 cursor-wait' : 'cursor-pointer hover:border-coral text-charcoal-500 hover:text-dark'
            }`}>
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={compressing}
                onChange={(e) => void handleFiles(e)}
                className="sr-only"
              />
              {compressing ? 'Traitement…' : '＋ Ajouter une photo'}
            </label>
          )}
        </div>

        <p className="text-xs font-sans text-dark/40 italic">
          Paiement par carte ou en espèces lors de votre visite.
        </p>

        {/* ── Existing appointment conflict ───────────────────────── */}
        {hasConflict && (
          <div className="border border-amber-200 bg-amber-50 p-5 flex flex-col gap-4">
            <div>
              <p className="font-sans text-sm font-medium text-amber-800 mb-1">
                Vous avez déjà un rendez-vous en cours
              </p>
              <p className="font-sans text-xs text-amber-700 mt-2">
                Voulez-vous annuler votre rendez-vous existant et le remplacer par le nouveau ?
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => void onConfirmReschedule()}
                className="text-xs font-sans bg-coral-dark text-cream px-4 py-2 hover:bg-coral/80 transition-colors"
              >
                Oui, remplacer
              </button>
              <button
                type="button"
                onClick={() => { setHasConflict(false); setPendingData(null) }}
                className="text-xs font-sans border border-dark/20 text-charcoal-500 px-4 py-2 hover:border-dark/40 transition-colors"
              >
                Non, garder l&apos;ancien
              </button>
            </div>
          </div>
        )}

        {/* Politique de garantie - acceptée en confirmant le rendez-vous (pas de case à cocher) */}
        <div className="bg-blush border border-dark/10 p-5">
          <div className="flex items-baseline justify-between gap-3 mb-3">
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-dark/40">Politique de garantie</p>
            <a
              href="/politique-garantie.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs text-coral hover:underline shrink-0"
            >
              Lire en entier (PDF)
            </a>
          </div>
          <ul className="font-sans text-xs text-charcoal-500 leading-relaxed space-y-1.5 list-disc pl-4">
            <li>
              <strong>Un défaut ? Envoyez-nous la photo tout de suite</strong>, le jour même (pas
              2 jours après). Sans photo immédiate, la retouche gratuite ne s&apos;applique pas.
            </li>
            <li>
              Défaut couvert = <strong>retouche gratuite</strong> au salon, aucun remboursement :
              semi-permanent, gel &amp; extensions, cils.
            </li>
            <li><strong>Vernis Normal / Vernis Classique : non garanti.</strong></li>
            <li>Autres prestations : vérifiez le résultat avant de partir.</li>
          </ul>
        </div>

        {/* Cloudflare Turnstile anti-spam widget */}
        <TurnstileWidget onVerify={handleTurnstileVerify} onExpire={handleTurnstileExpire} />

        <div className="flex gap-4">
          <Button variant="outline" type="button" onClick={onBack}>Retour</Button>
          <Button
            type="submit"
            size="lg"
            isLoading={isSubmitting}
            disabled={!!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken}
          >
            Confirmer le rendez-vous
          </Button>
        </div>

        <p className="text-xs font-sans text-dark/40 leading-relaxed">
          En confirmant votre rendez-vous, vous acceptez la{' '}
          <a href="/politique-garantie.pdf" target="_blank" rel="noopener noreferrer" className="underline hover:text-coral transition-colors">
            politique de garantie
          </a>{' '}
          et notre{' '}
          <a href="/privacy" className="underline hover:text-coral transition-colors">
            politique de confidentialité
          </a>
          .
        </p>
      </form>
    </div>
  )
}

// ─── Confirmed view (post-submit) ─────────────────────────────────────────

function ConfirmedView({
  booking,
  totalDuration,
  totalPrice,
}: {
  booking: BookingState
  totalDuration: number
  totalPrice: number
}) {
  const [icsUrl, setIcsUrl] = useState<string | null>(null)

  const forCal: BookingForCalendar = {
    date: booking.date,
    timeSlot: booking.timeSlot,
    durationMinutes: totalDuration,
    serviceNames: booking.services.map((s) => s.name).join(' + '),
    totalPrice,
  }

  // Generate the .ics data URL on mount: buildIcsDataUrl returns different output
  // on client vs server (base64 vs encoded), so deferring to mount avoids a
  // hydration mismatch.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIcsUrl(buildIcsDataUrl(forCal))
    // forCal recomputed every render but values are stable post-confirmation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const googleUrl = buildGoogleCalendarUrl(forCal)
  const outlookUrl = buildOutlookCalendarUrl(forCal)
  const icsFilename = `dobeauty-${booking.date}-${booking.timeSlot.replace(':', '')}.ics`

  return (
    <div className="text-center py-12 flex flex-col items-center gap-6">
      <div className="w-16 h-16 rounded-full bg-coral/10 flex items-center justify-center">
        <span className="text-coral text-3xl">✳</span>
      </div>
      <h2 className="font-serif text-4xl font-light text-dark">C&apos;est confirmé !</h2>
      <p className="font-sans text-sm text-charcoal-500 max-w-sm">
        Votre rendez-vous est enregistré. Nous vous attendons le{' '}
        <strong>{formatDate(booking.date)}</strong> à <strong>{booking.timeSlot}</strong>.
        <br /><br />
        Pour toute modification, appelez-nous : <strong>{site.phone.display}</strong>.
        <br /><br />
        <strong>Paiement par carte ou en espèces</strong> lors de votre venue.
      </p>

      {/* Récapitulatif */}
      <div className="bg-blush border border-dark/10 w-full max-w-sm text-left p-6 mt-2">
        <h3 className="text-xs tracking-[0.3em] uppercase text-dark/40 font-sans mb-4">Récapitulatif</h3>
        <div className="flex flex-col gap-2 text-sm font-sans">
          {booking.services.map((s) => (
            <div key={s.id} className="flex justify-between">
              <span className="text-charcoal-500">{s.name}</span>
              <span className="text-charcoal-500 text-xs self-center">{s.duration} min</span>
            </div>
          ))}
          <div className="flex justify-between pt-3 border-t border-dark/10 mt-1">
            <span className="text-charcoal-500">Date</span>
            <span className="text-dark">{formatDate(booking.date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-charcoal-500">Heure</span>
            <span className="text-dark">{booking.timeSlot}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-charcoal-500">Durée totale</span>
            <span className="text-dark">{formatDuration(totalDuration)}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-dark/10">
            <span className="text-charcoal-500">Total</span>
            <span className="font-serif text-coral text-lg">{formatCurrency(totalPrice)}</span>
          </div>
        </div>
      </div>

      {/* Add to calendar */}
      <div className="w-full max-w-sm mt-2">
        <p className="text-xs tracking-[0.3em] uppercase text-dark/40 font-sans mb-4 text-center">
          Ajouter à mon agenda
        </p>
        <div className="grid grid-cols-3 gap-2">
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 px-3 py-3 border border-dark/15 hover:border-coral/50 transition-colors text-xs font-sans text-charcoal-500"
          >
            <CalendarIcon />
            Google
          </a>
          <a
            href={outlookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 px-3 py-3 border border-dark/15 hover:border-coral/50 transition-colors text-xs font-sans text-charcoal-500"
          >
            <CalendarIcon />
            Outlook
          </a>
          <a
            href={icsUrl ?? '#'}
            download={icsFilename}
            aria-disabled={!icsUrl}
            onClick={(e) => { if (!icsUrl) e.preventDefault() }}
            className="flex flex-col items-center gap-1.5 px-3 py-3 border border-dark/15 hover:border-coral/50 transition-colors text-xs font-sans text-charcoal-500"
          >
            <CalendarIcon />
            Apple / .ics
          </a>
        </div>
        <p className="font-sans text-[11px] text-dark/35 mt-3 text-center">
          Un rappel automatique se déclenchera la veille à la même heure.
        </p>
      </div>

      <Button variant="outline" onClick={() => window.location.reload()}>Nouveau rendez-vous</Button>
    </div>
  )
}

function CalendarIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}
