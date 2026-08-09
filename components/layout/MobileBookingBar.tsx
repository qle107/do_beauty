'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { site } from '@/lib/site'
import { track } from '@/lib/analytics'

const HIDDEN_ON = ['/booking', '/admin']

export default function MobileBookingBar() {
  const pathname = usePathname()
  const shouldHide = HIDDEN_ON.some((prefix) => pathname.startsWith(prefix))
  if (shouldHide) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 md:hidden bg-dark text-cream shadow-[0_-8px_24px_rgba(131,24,67,0.18)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch gap-2 px-3 py-3">
        <Link
          href="/booking"
          className="flex-1 inline-flex items-center justify-center bg-coral-dark text-cream text-xs tracking-[0.18em] font-sans uppercase py-3.5 hover:opacity-90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
          aria-label="Prendre rendez-vous"
        >
          Prendre rendez-vous →
        </Link>
        <a
          href={`tel:${site.phone.tel}`}
          onClick={() => track('tel_click', { location: 'mobile_bar' })}
          className="inline-flex items-center justify-center px-4 border border-cream/30 text-cream hover:bg-cream/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream"
          aria-label={`Appeler ${site.phone.display}`}
        >
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.34 1.9.65 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.31 1.85.53 2.81.65A2 2 0 0 1 22 16.92z" />
          </svg>
        </a>
      </div>
    </div>
  )
}
