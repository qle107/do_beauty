'use client'

import { useEffect, useState } from 'react'
import type { BookingState } from '@/components/booking/BookingForm'

const KEY = 'dobeauty:booking-draft:v1'
const TTL_MS = 60 * 60 * 1000 // 1 hour - beyond that the slot might be taken

type StoredDraft = {
  state: BookingState
  step: number
  savedAt: number
}

/**
 * Owns the booking form's draft state and mirrors it to sessionStorage so a
 * reload or navigation-away doesn't reset the funnel. Client details (name /
 * phone / notes) are intentionally NOT persisted - they live only in the
 * in-memory form.
 *
 * The hook is the single source of truth for `step` and `booking`. Restoring
 * from storage on mount actually updates the same state the consumer reads,
 * so the saved draft is honored.
 */
export function useBookingPersistence(initialStep: number, initialState: BookingState) {
  const [step, setStep] = useState(initialStep)
  const [booking, setBooking] = useState(initialState)

  // One-shot rehydration on mount (sessionStorage isn't available at SSR).
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as StoredDraft
      if (!parsed?.savedAt || Date.now() - parsed.savedAt > TTL_MS) {
        window.sessionStorage.removeItem(KEY)
        return
      }
      // Only restore if the user had advanced past step 1 (otherwise no benefit).
      // Restored post-mount (not via lazy init) to avoid an SSR hydration mismatch.
      if (parsed.step > 1 || (parsed.state.services?.length ?? 0) > 0) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setBooking(parsed.state)
        setStep(parsed.step)
      }
    } catch {
      // Corrupted JSON - wipe.
      try {
        window.sessionStorage.removeItem(KEY)
      } catch {
        /* noop */
      }
    }
  }, [])

  // Auto-save whenever the consumer updates step or booking - skip the empty
  // initial draft so we don't pollute storage on first mount.
  useEffect(() => {
    const isEmpty = booking.services.length === 0 && !booking.date && !booking.timeSlot && step === 1
    if (isEmpty) return
    try {
      const draft: StoredDraft = { state: booking, step, savedAt: Date.now() }
      window.sessionStorage.setItem(KEY, JSON.stringify(draft))
    } catch {
      /* quota or private mode - silently ignore */
    }
  }, [booking, step])

  const clear = () => {
    if (typeof window === 'undefined') return
    try {
      window.sessionStorage.removeItem(KEY)
    } catch {
      /* noop */
    }
  }

  return { step, setStep, booking, setBooking, clear }
}
