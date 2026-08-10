'use client'

import { useEffect, useState } from 'react'
import { site } from '@/lib/site'

export type LiveStatus = {
  isOpen: boolean
  /** Display label, e.g. "Ouvert · ferme à 19h30" or "Ouvre demain à 10h" */
  label: string
}

/**
 * Compute the current Paris-time minute, returning open state + a human label.
 * Pure function so it can run server- or client-side.
 */
export function computeLiveStatus(now: Date): LiveStatus {
  // Convert "now" to Europe/Paris wall-clock minutes since midnight.
  const parts = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now)

  const hh = Number(parts.find((p) => p.type === 'hour')?.value ?? '0')
  const mm = Number(parts.find((p) => p.type === 'minute')?.value ?? '0')
  const minutes = hh * 60 + mm

  const { openMinutes, closeMinutes } = site.hours
  const isOpen = minutes >= openMinutes && minutes < closeMinutes

  if (isOpen) {
    return { isOpen: true, label: `Ouvert · ferme à ${site.hours.close}` }
  }
  if (minutes < openMinutes) {
    return { isOpen: false, label: `Ouvre à ${site.hours.open}` }
  }
  return { isOpen: false, label: `Ouvre demain à ${site.hours.open}` }
}

export function useLiveStatus(): LiveStatus {
  // Seed with a deterministic "closed" placeholder so the server-rendered HTML
  // matches the client's first render. The real value is computed after mount,
  // avoiding a hydration mismatch that can abort hydration for the whole route.
  const [status, setStatus] = useState<LiveStatus>({
    isOpen: false,
    label: `Ouvre à ${site.hours.open}`,
  })

  useEffect(() => {
    const tick = () => setStatus(computeLiveStatus(new Date()))
    tick()
    // Re-check every minute so the pill flips when the salon closes/opens.
    const id = window.setInterval(tick, 60_000)
    return () => window.clearInterval(id)
  }, [])

  return status
}
