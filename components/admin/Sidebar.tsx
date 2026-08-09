'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface NavItem { href: string; label: string; icon: React.ReactNode }

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
)
const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
)
const ScissorsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
    <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12" />
  </svg>
)
const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)
const LogOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)
const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)
const DeviceIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12" y2="18" />
  </svg>
)
const ImageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
  </svg>
)
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)
const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const NAV_ITEMS: NavItem[] = [
  { href: '/admin/dashboard',    label: 'Tableau de bord', icon: <GridIcon /> },
  { href: '/admin/appointments', label: 'Rendez-vous',     icon: <CalendarIcon /> },
  { href: '/admin/services',     label: 'Prestations',     icon: <ScissorsIcon /> },
  { href: '/admin/gallery',      label: 'Galerie',         icon: <ImageIcon /> },
  { href: '/admin/messages',     label: 'Messages',        icon: <MailIcon /> },
  { href: '/admin/blocklist',    label: 'Liste noire',     icon: <ShieldIcon /> },
  { href: '/admin/devices',      label: 'Appareils',       icon: <DeviceIcon /> },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  // Close the mobile drawer whenever the route changes (after tapping a link).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setOpen(false) }, [pathname])

  // Track the mobile breakpoint so the off-canvas drawer is only made inert when
  // it's actually the hidden drawer (on desktop the same <aside> is a visible rail).
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Esc closes the open mobile drawer and returns focus to the hamburger.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); hamburgerRef.current?.focus() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      {/* Mobile top bar (hidden on desktop). The hamburger opens the drawer. */}
      <header className="md:hidden fixed top-0 inset-x-0 h-16 bg-dark flex items-center justify-between px-5 z-30">
        <Link href="/" className="font-serif text-lg tracking-[0.2em] text-cream">
          Do Beauty<span className="text-coral ml-1">94</span>
        </Link>
        <button
          ref={hamburgerRef}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          aria-controls="admin-sidebar"
          className="text-cream p-1"
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </header>

      {/* Backdrop shown only while the mobile drawer is open. Tap to close.
          Its presence over the top bar means the hamburger only ever opens;
          closing happens via this backdrop or by tapping a nav link. */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          aria-hidden="true"
        />
      )}

      {/* Sidebar: a fixed rail on desktop, an off-canvas drawer on mobile. When
          it's the hidden mobile drawer, `inert` keeps keyboard focus out of it. */}
      <aside
        id="admin-sidebar"
        inert={isMobile && !open}
        className={cn(
          'fixed left-0 top-0 h-screen w-64 bg-dark flex flex-col z-50 transition-transform duration-300 ease-out md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="px-8 py-8 border-b border-white/10">
          <Link href="/" className="font-serif text-xl tracking-[0.2em] text-cream">
            Do Beauty<span className="text-coral ml-1">94</span>
          </Link>
          <p className="text-xs text-cream/30 font-sans mt-1 tracking-wider">Espace admin</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 text-sm font-sans tracking-wide transition-colors',
                  isActive ? 'bg-coral-dark text-cream' : 'text-cream/50 hover:text-cream hover:bg-white/5'
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Déconnexion */}
        <div className="px-4 py-6 border-t border-white/10">
          <button
            onClick={() => void signOut({ callbackUrl: '/admin/login' })}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-sans text-cream/40 hover:text-cream transition-colors"
          >
            <LogOutIcon />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  )
}
