'use client'

import { useEffect, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { fr } from 'date-fns/locale'
import { format, isBefore, startOfDay } from 'date-fns'
import { cn, formatDuration } from '@/lib/utils'
import Button from '@/components/ui/Button'
import { artistsForCategories } from '@/lib/staff'
import type { ServiceCategory } from '@/lib/types'
import type { SelectedService } from './BookingForm'

interface AvailabilityResponse {
  available: string[]
  booked: string[]
  totalDuration: number
  staffBySlot?: Record<string, { id: string; name: string }[]>
  error?: string
}

interface DateTimePickerProps {
  services: SelectedService[]
  selectedDate: string
  selectedSlot: string
  selectedEmployeeId: string                         // '' = sans préférence
  onEmployeeChange: (id: string, name: string) => void
  onDateChange: (date: string) => void
  onSlotChange: (slot: string) => void
  onBack: () => void
  onNext: () => void
}

export default function DateTimePicker({
  services, selectedDate, selectedSlot, selectedEmployeeId,
  onEmployeeChange, onDateChange, onSlotChange, onBack, onNext,
}: DateTimePickerProps) {
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [slotsError, setSlotsError] = useState<string | null>(null)

  const totalDuration = services.reduce((sum, s) => sum + s.duration, 0)
  const totalPrice    = services.reduce((sum, s) => sum + s.price, 0)

  // Which artists can perform this cart (practitioners for nail services, the
  // matching cabine for cils/esthetics) — drives the picker + the availability query.
  const cartCats = [...new Set(services.map((s) => s.category))] as ServiceCategory[]
  const poolArtists = artistsForCategories(cartCats)

  const selectedDayObj = selectedDate ? new Date(selectedDate + 'T00:00:00') : undefined

  useEffect(() => {
    if (!selectedDate) return
    // Reset + fetch when the date/duration changes; the synchronous resets clear
    // stale slots immediately (intended effect behavior, not a derived-state bug).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadingSlots(true)
    setAvailability(null)
    setSlotsError(null)

    void fetch(`/api/availability?date=${selectedDate}&duration=${totalDuration}&cats=${cartCats.join(',')}`)
      .then(async (r) => {
        const data = await r.json() as AvailabilityResponse
        if (!r.ok || data.error) {
          setSlotsError(data.error ?? 'Impossible de charger les créneaux.')
          setLoadingSlots(false)
          return
        }
        // Ensure arrays exist even if API response is malformed
        setAvailability({
          available:     Array.isArray(data.available) ? data.available : [],
          booked:        Array.isArray(data.booked)    ? data.booked    : [],
          totalDuration: data.totalDuration ?? totalDuration,
          staffBySlot:   data.staffBySlot ?? {},
        })
        setLoadingSlots(false)
      })
      .catch(() => {
        setSlotsError('Impossible de vérifier les disponibilités. Réessayez.')
        setLoadingSlots(false)
      })
  }, [selectedDate, totalDuration])

  const handleDaySelect = (day: Date | undefined) => {
    if (!day) return
    onDateChange(format(day, 'yyyy-MM-dd'))
  }

  // ── Artist filter ──────────────────────────────────────────────────────
  const staffBySlot = availability?.staffBySlot ?? {}
  const slotHasArtist = (slot: string, id: string) => (staffBySlot[slot] ?? []).some((a) => a.id === id)
  // Slots bookable given the chosen artist ('' = any practitioner).
  const availForArtist = (availability?.available ?? []).filter(
    (slot) => selectedEmployeeId === '' || slotHasArtist(slot, selectedEmployeeId)
  )
  // Which artists have at least one free slot on the selected day (for greying out).
  const artistsWithSlots = new Set<string>()
  for (const slot of availability?.available ?? [])
    for (const a of staffBySlot[slot] ?? []) artistsWithSlots.add(a.id)

  const pickArtist = (id: string, name: string) => {
    onEmployeeChange(id, name)
    // Drop the chosen time if that artist isn't free there anymore.
    if (selectedSlot && id !== '' && !slotHasArtist(selectedSlot, id)) onSlotChange('')
  }

  return (
    <div>
      <h2 className="font-serif text-3xl font-light text-dark mb-2">Choisir une date &amp; une heure</h2>

      {/* Récap des prestations choisies */}
      <div className="bg-blush border border-dark/10 p-4 mb-8 flex flex-col gap-2">
        <p className="font-sans text-xs tracking-[0.2em] uppercase text-dark/40 mb-1">Votre sélection</p>
        {services.map((s) => (
          <div key={s.id} className="flex justify-between text-sm font-sans">
            <span className="text-charcoal-500">{s.name}</span>
            <span className="text-charcoal-500 text-xs self-center">{s.duration} min</span>
          </div>
        ))}
        <div className="border-t border-dark/10 pt-2 mt-1 flex justify-between text-sm font-sans font-medium">
          <span className="text-dark">Durée totale : {formatDuration(totalDuration)}</span>
          <span className="text-coral font-serif text-base">{totalPrice} €</span>
        </div>
      </div>

      {/* Praticienne (optionnel) — filtre les créneaux ci-dessous */}
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] uppercase text-dark/40 font-sans mb-1">Praticienne</p>
        <p className="font-sans text-xs text-dark/40 mb-3">
          Optionnel — « Sans préférence » vous attribue une praticienne disponible.
        </p>
        <div className="flex flex-wrap gap-2">
          {[{ id: '', name: 'Sans préférence' }, ...poolArtists.map((a) => ({ id: a.id, name: a.name }))].map((a) => {
            const active = selectedEmployeeId === a.id
            const disabled = a.id !== '' && !!availability && !artistsWithSlots.has(a.id)
            return (
              <button
                key={a.id || 'none'}
                type="button"
                disabled={disabled}
                onClick={() => pickArtist(a.id, a.name)}
                className={cn(
                  'font-sans text-xs tracking-wider px-4 py-2.5 border transition-colors',
                  active ? 'bg-coral-dark text-cream border-coral'
                    : disabled ? 'border-dark/10 text-dark/25 cursor-not-allowed line-through'
                    : 'border-dark/20 text-charcoal-500 hover:border-coral hover:text-coral'
                )}
              >
                {a.name}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Calendrier */}
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-dark/40 font-sans mb-4">Choisir une date</p>
          <DayPicker
            mode="single"
            selected={selectedDayObj}
            onSelect={handleDaySelect}
            locale={fr}
            disabled={(day) => isBefore(day, startOfDay(new Date()))}
            classNames={{
              root: 'font-sans text-sm',
              months: 'flex flex-col',
              month: 'space-y-4',
              caption: 'flex justify-between items-center mb-4',
              caption_label: 'font-serif text-base font-light text-dark capitalize',
              nav: 'flex items-center gap-2',
              nav_button: 'p-1 text-dark/40 hover:text-dark transition-colors',
              table: 'w-full border-collapse',
              head_row: 'flex',
              head_cell: 'flex-1 text-center text-xs text-dark/30 tracking-widest py-2 capitalize',
              row: 'flex w-full',
              cell: 'flex-1 text-center',
              day: 'w-full py-2 text-sm text-dark hover:bg-blush transition-colors',
              day_selected: 'bg-coral-dark text-cream hover:bg-coral-dark',
              day_today: 'text-coral font-medium',
              day_disabled: 'text-dark/20 pointer-events-none',
              day_outside: 'text-dark/20',
            }}
          />
        </div>

        {/* Créneaux horaires */}
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-dark/40 font-sans mb-4">Choisir un créneau</p>

          {!selectedDate && (
            <p className="text-sm font-sans text-dark/30 italic">Veuillez d&apos;abord sélectionner une date.</p>
          )}

          {loadingSlots && (
            <div className="grid grid-cols-3 gap-2">
              {[...Array(12)].map((_, i) => <div key={i} className="h-10 bg-dark/5 animate-pulse rounded" />)}
            </div>
          )}

          {slotsError && !loadingSlots && (
            <p className="text-sm font-sans text-red-500 italic">{slotsError}</p>
          )}

          {availability && !loadingSlots && (
            <>
              {availForArtist.length === 0 ? (
                <p className="text-sm font-sans text-dark/40 italic">
                  {selectedEmployeeId
                    ? 'Aucun créneau pour cette praticienne ce jour-là. Choisissez une autre date ou « Sans préférence ».'
                    : 'Aucun créneau disponible ce jour-là. Veuillez choisir une autre date.'}
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {[...availability.available, ...availability.booked].sort().map((slot) => {
                    const isAvailable = availForArtist.includes(slot)
                    const isSelected = selectedSlot === slot
                    return (
                      <button
                        key={slot}
                        disabled={!isAvailable}
                        onClick={() => isAvailable && onSlotChange(slot)}
                        title={isAvailable ? 'Disponible' : 'Indisponible'}
                        className={cn(
                          'py-2.5 text-xs font-sans tracking-wider border transition-all',
                          isSelected ? 'bg-coral-dark text-cream border-coral'
                            : isAvailable ? 'border-dark/20 text-dark hover:border-coral hover:text-coral'
                            : 'border-dark/10 text-dark/20 cursor-not-allowed line-through'
                        )}
                      >
                        {slot}
                      </button>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-12">
        <Button variant="outline" onClick={onBack}>Retour</Button>
        <Button onClick={onNext} disabled={!selectedDate || !selectedSlot}>Continuer</Button>
      </div>
    </div>
  )
}
