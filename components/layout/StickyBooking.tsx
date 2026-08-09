'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

/**
 * Mobile-only sticky "Réserver" bar. Appears after the visitor scrolls past the
 * hero and hides near the bottom so it never covers the footer / final CTA.
 */
export default function StickyBooking() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const nearBottom = window.innerHeight + y > document.body.scrollHeight - 340
      setShow(y > 520 && !nearBottom)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 p-3 lg:hidden transition-transform duration-500 ${
        show ? 'translate-y-0' : 'translate-y-[140%]'
      }`}
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
    >
      <Link
        href="/booking"
        data-cursor="reserver"
        className="db-btn db-btn--solid w-full shadow-[0_10px_34px_-12px_rgba(23,22,21,0.55)]"
      >
        Réserver un rendez-vous
      </Link>
    </div>
  )
}
