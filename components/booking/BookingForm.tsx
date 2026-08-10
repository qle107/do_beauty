'use client'

import { useEffect, useRef } from 'react'
import type { ServiceCategory } from '@/lib/utils'
import type { Service } from '@/lib/types'
import { useBookingPersistence } from '@/hooks/useBookingPersistence'
import { track } from '@/lib/analytics'
import ServicePicker from './ServicePicker'
import DateTimePicker from './DateTimePicker'
import ClientDetails from './ClientDetails'

export interface SelectedService {
  id: string
  name: string
  price: number
  duration: number
  category: string
}

export interface BookingState {
  services: SelectedService[]  // panier multi-services
  date: string
  timeSlot: string
  // Optional preferred artist chosen on the Date & Heure step ('' = sans préférence).
  employeeId?: string
  employeeName?: string
}

const STEPS = ['Choisir les prestations', 'Date & Heure', 'Vos coordonnées']

const EMPTY: BookingState = { services: [], date: '', timeSlot: '' }

export default function BookingForm({
  initialCategory,
  initialServices,
}: {
  initialCategory?: ServiceCategory
  initialServices?: Service[]
}) {
  // Hook owns step + booking state; sessionStorage restore + auto-save are internal.
  const { step, setStep, booking, setBooking, clear } = useBookingPersistence(1, EMPTY)

  const goNext = () => setStep((s) => Math.min(s + 1, 3))
  const goBack = () => setStep((s) => Math.max(s - 1, 1))

  // Funnel entry - fires once when the booking widget mounts (consent-gated).
  useEffect(() => {
    track('booking_view')
  }, [])

  // Scroll to the top of the widget whenever the step changes, so the new step
  // (e.g. the calendar) is visible without manual scrolling. Skips first mount.
  const topRef = useRef<HTMLDivElement>(null)
  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    // Move keyboard focus to the top of the widget so it follows the step change
    // instead of falling back to <body> (screen-reader + keyboard users).
    topRef.current?.focus()
  }, [step])

  return (
    <div
      ref={topRef}
      tabIndex={-1}
      aria-label={`Réservation - étape ${step} sur ${STEPS.length} : ${STEPS[step - 1]}`}
      className="max-w-3xl mx-auto scroll-mt-24 outline-none"
    >
      {/* Barre de progression */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((label, i) => {
            const stepNum = i + 1
            const isActive = stepNum === step
            const isDone = stepNum < step
            return (
              <div key={label} className="flex items-center gap-2 flex-1" aria-current={isActive ? 'step' : undefined}>
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-sans font-medium transition-colors ${
                    isDone ? 'bg-coral-dark text-cream' : isActive ? 'border-2 border-coral text-coral' : 'border border-dark/20 text-dark/30'
                  }`}>
                    {isDone ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : stepNum}
                  </div>
                  <span className={`text-xs tracking-wide font-sans hidden sm:block ${isActive ? 'text-dark' : 'text-dark/30'}`}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-4 transition-colors ${isDone ? 'bg-coral' : 'bg-dark/10'}`} />
                )}
              </div>
            )
          })}
        </div>
        <p aria-live="polite" className="text-xs text-dark/30 font-sans text-right">
          Étape {step} / {STEPS.length} : {STEPS[step - 1]}
        </p>
      </div>

      {/* Contenu de l'étape */}
      <div>
        {step === 1 && (
          <ServicePicker
            selected={booking.services}
            initialCategory={initialCategory}
            initialServices={initialServices}
            onConfirm={(services) => {
              track('booking_select_services', {
                service_count: services.length,
                value: services.reduce((sum, s) => sum + s.price, 0),
                currency: 'EUR',
              })
              setBooking((b) => ({ ...b, services, date: '', timeSlot: '' }))
              goNext()
            }}
          />
        )}
        {step === 2 && booking.services.length > 0 && (
          <DateTimePicker
            services={booking.services}
            selectedDate={booking.date}
            selectedSlot={booking.timeSlot}
            selectedEmployeeId={booking.employeeId ?? ''}
            onEmployeeChange={(id, name) => setBooking((b) => ({ ...b, employeeId: id, employeeName: name }))}
            onDateChange={(date) => setBooking((b) => ({ ...b, date, timeSlot: '' }))}
            onSlotChange={(slot) => setBooking((b) => ({ ...b, timeSlot: slot }))}
            onBack={goBack}
            onNext={() => {
              track('booking_select_slot', {
                service_count: booking.services.length,
                value: booking.services.reduce((sum, s) => sum + s.price, 0),
                currency: 'EUR',
              })
              goNext()
            }}
          />
        )}
        {step === 3 && booking.services.length > 0 && booking.date && booking.timeSlot && (
          <ClientDetails
            booking={booking}
            onBack={goBack}
            onConfirmed={clear}
          />
        )}
      </div>
    </div>
  )
}
