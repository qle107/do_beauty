import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

export type { AppointmentStatus, ServiceCategory } from '@/lib/types'
export { statusConfig, categoryConfig, CATEGORY_ORDER } from '@/lib/constants'

// ─── cn() - fusion de classes Tailwind ────────────────────────────────────

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// ─── Durée (minutes → texte lisible) ──────────────────────────────────────

export function formatDuration(minutes: number, style: 'long' | 'compact' = 'long'): string {
  if (minutes < 60) {
    return style === 'compact' ? `${minutes}min` : `${minutes} min`
  }
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (style === 'compact') {
    return m > 0 ? `${h}h${m}` : `${h}h`
  }
  return m > 0 ? `${h} h ${m}` : `${h} h`
}

// ─── Formatage de dates (français) ────────────────────────────────────────

export function formatDate(date: Date | string, pattern = 'd MMMM yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, pattern, { locale: fr })
}

export function formatDateShort(date: Date | string): string {
  return formatDate(date, 'd MMM yyyy')
}

export function formatDateTime(date: Date | string): string {
  return formatDate(date, "d MMMM yyyy 'à' HH'h'mm")
}

// ─── Génération des créneaux horaires ─────────────────────────────────────

/**
 * Génère des créneaux de départ entre startMinutes et endMinutes (exclusif),
 * espacés de `step` minutes. Minutes depuis minuit → "HH:MM".
 * Do Beauty : 10h00 (600) → 19h30 (1170) donne des départs 10:00 … 19:00.
 */
export function generateTimeSlots(startMinutes = 600, endMinutes = 1170, step = 30): string[] {
  const slots: string[] = []
  for (let m = startMinutes; m < endMinutes; m += step) {
    slots.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`)
  }
  return slots
}

/**
 * Convertit "HH:MM" en minutes depuis minuit
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return (hours ?? 0) * 60 + (minutes ?? 0)
}

// ─── Devise (€) ───────────────────────────────────────────────────────────

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

