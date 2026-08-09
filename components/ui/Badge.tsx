import { cn } from '@/lib/utils'
import { type AppointmentStatus, statusConfig } from '@/lib/utils'

interface BadgeProps {
  status: AppointmentStatus
  className?: string
}

export default function Badge({ status, className }: BadgeProps) {
  const config = statusConfig[status]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-sans tracking-wide',
        config.bg,
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  )
}
