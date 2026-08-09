import type { AppointmentStatus, ServiceCategory } from '@/lib/types'

export const statusConfig: Record<
  AppointmentStatus,
  { label: string; color: string; bg: string }
> = {
  PENDING:   { label: 'En attente',  color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200' },
  CONFIRMED: { label: 'Confirmé',    color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  CANCELLED: { label: 'Annulé',      color: 'text-red-700',     bg: 'bg-red-50 border-red-200' },
  COMPLETED: { label: 'Terminé',     color: 'text-slate-700',   bg: 'bg-slate-50 border-slate-200' },
  NO_SHOW:   { label: 'Absent',      color: 'text-orange-700',  bg: 'bg-orange-50 border-orange-200' },
}

export const categoryConfig: Record<ServiceCategory, { label: string; emoji: string }> = {
  FORFAIT:   { label: 'Forfaits spa',        emoji: '✨' },
  MAINS:     { label: 'Mains & manucure',    emoji: '💅' },
  PIEDS:     { label: 'Beauté des pieds',    emoji: '🦶' },
  CAPSULE:   { label: 'Pose & extensions',   emoji: '💎' },
  NAIL_ART:  { label: 'Nail art & finitions', emoji: '🎨' },
  CILS:      { label: 'Cils & regard',       emoji: '👁️' },
  VISAGE:    { label: 'Soins du visage',     emoji: '🌸' },
  CORPS:     { label: 'Massages & corps',    emoji: '💆' },
  EPILATION: { label: 'Épilation',           emoji: '🪶' },
}

export const CATEGORY_ORDER: ServiceCategory[] = [
  'FORFAIT',
  'MAINS',
  'PIEDS',
  'CAPSULE',
  'NAIL_ART',
  'CILS',
  'VISAGE',
  'CORPS',
  'EPILATION',
]
