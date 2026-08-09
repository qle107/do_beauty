'use client'

import { site } from '@/lib/site'
import { track } from '@/lib/analytics'

// Click-to-call anchor that fires a consent-safe `tel_click` event. Exists so
// server components (landing/city pages) can attach analytics to their phone
// links without becoming client components themselves.
export default function TelLink({
  location,
  className,
  children,
  ariaLabel,
}: {
  location: string
  className?: string
  children: React.ReactNode
  ariaLabel?: string
}) {
  return (
    <a
      href={`tel:${site.phone.tel}`}
      aria-label={ariaLabel}
      className={className}
      onClick={() => track('tel_click', { location })}
    >
      {children}
    </a>
  )
}
