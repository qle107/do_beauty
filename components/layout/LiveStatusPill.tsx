'use client'

import { cn } from '@/lib/utils'
import { useLiveStatus } from '@/hooks/useLiveStatus'

export default function LiveStatusPill({ className }: { className?: string }) {
  const { isOpen, label } = useLiveStatus()

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 text-[11px] tracking-[0.2em] uppercase font-sans',
        'border',
        isOpen
          ? 'bg-white/70 border-emerald-600/30 text-emerald-800'
          : 'bg-white/70 border-amber-700/30 text-amber-800',
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'inline-block h-1.5 w-1.5 rounded-full',
          isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
        )}
      />
      <span>{label}</span>
    </div>
  )
}
