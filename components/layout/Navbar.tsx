'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { homeNavLinks } from '@/lib/navigation'

/**
 * DO BEAUTY header - one <header>, rendered once by the public layout.
 * Ivory, hairline border, no shadow. Compacts on scroll. Mobile → full-screen
 * editorial menu.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-[color:var(--db-line)] bg-[color:var(--db-ivory)] transition-[background-color,border-color,box-shadow] duration-500 ${
        scrolled ? 'shadow-[0_10px_34px_-24px_rgba(23,22,20,0.4)]' : ''
      }`}
    >
      <div
        className={`db-shell flex items-center justify-between gap-3 transition-all duration-500 ${
          scrolled ? 'h-[56px] lg:h-[64px]' : 'h-[64px] lg:h-[76px]'
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Do Beauty, accueil">
          <span className="db-serif whitespace-nowrap pl-[0.2em] text-[15px] font-medium uppercase tracking-[0.2em] text-[color:var(--db-ink)] sm:pl-[0.28em] sm:text-[18px] sm:tracking-[0.28em] lg:pl-[0.34em] lg:text-[22px] lg:tracking-[0.34em]">
            Do Beauty
          </span>
          <span className="hidden border border-[color:var(--db-champ-line)] px-[6px] py-[3px] text-[10px] leading-none text-[color:var(--db-champagne)] sm:inline-block">
            94
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-9 lg:flex" aria-label="Navigation principale">
          {homeNavLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--db-ink-soft)] transition-colors hover:text-[color:var(--db-ink)]"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <Link
          href="/booking"
          data-cursor="reserver"
          className="db-btn db-btn--solid hidden h-11 px-7 lg:inline-flex"
        >
          Réserver
        </Link>

        {/* Mobile controls */}
        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <Link href="/booking" className="db-btn db-btn--solid h-10 min-h-0 px-4 text-[10px]">
            Réserver
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Ouvrir le menu"
            aria-expanded={open}
            className="flex flex-col gap-[6px] p-1.5"
          >
            <span className="h-px w-6 bg-[color:var(--db-ink)]" />
            <span className="h-px w-6 bg-[color:var(--db-ink)]" />
          </button>
        </div>
      </div>

      {/* Mobile full-screen editorial menu */}
      <div
        className={`fixed inset-0 z-[60] bg-[color:var(--db-bg)] transition-opacity duration-500 lg:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="db-shell flex h-[84px] items-center justify-between">
          <span className="db-serif pl-[0.34em] text-[19px] uppercase tracking-[0.34em] text-[color:var(--db-ink)]">
            Do Beauty
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
            className="text-2xl text-[color:var(--db-ink)]"
          >
            ✕
          </button>
        </div>
        <nav className="db-shell mt-8 flex flex-col gap-5" aria-label="Menu mobile">
          {homeNavLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="db-serif text-[clamp(36px,11vw,54px)] leading-[1.05] text-[color:var(--db-ink)]"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/booking"
            onClick={() => setOpen(false)}
            className="db-btn db-btn--solid mt-8 self-start"
          >
            Réserver un rendez-vous
          </Link>
        </nav>
      </div>
    </header>
  )
}
