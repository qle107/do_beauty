'use client'

import { useEffect, useRef, useState } from 'react'
import type { ServiceCategory } from '@/lib/utils'
import {
  SECTIONS,
  sectionIdOf,
  formatServicePrice,
  formatServiceDuration,
  type CatalogueSection,
} from '@/lib/catalogue'
import { descriptionFor } from '@/lib/service-descriptions'
import CilsStylesGuide from '@/components/sections/CilsStylesGuide'
import type { SelectedService } from './BookingForm'

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  category: ServiceCategory
  section?: string
  subgroup?: string
  priceType?: 'fixed' | 'from' | 'quote' | 'free' | 'range'
  priceLabel?: string
  note?: string
}

interface ServicePickerProps {
  selected: SelectedService[]
  initialCategory?: ServiceCategory
  /** Services pre-loaded server-side - skips the /api/services round trip. */
  initialServices?: Service[]
  onConfirm: (services: SelectedService[]) => void
}

// ─── One selectable prestation row ─────────────────────────────────────────

function ServiceRow({
  service,
  active,
  onToggle,
  idx,
  open,
}: {
  service: Service
  active: boolean
  onToggle: (s: Service) => void
  idx: number
  open: boolean
}) {
  const quote = service.priceType === 'quote'
  const description = descriptionFor(service)
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={active}
      onClick={() => onToggle(service)}
      style={{ transitionDelay: open ? `${idx * 25}ms` : '0ms' }}
      className={`w-full flex items-start justify-between gap-4 px-6 py-4 text-left transition-all duration-200 ${
        active ? 'bg-coral/5' : 'bg-cream hover:bg-blush/60'
      }`}
    >
      {/* Checkbox + texte */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <span
          className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
            active ? 'bg-coral border-coral scale-110' : 'border-dark/25 hover:border-coral/60'
          }`}
        >
          {active && (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>

        <div className="min-w-0">
          <p className={`font-sans text-sm leading-snug ${active ? 'text-coral font-medium' : 'text-dark'}`}>
            {service.name}
          </p>
          {service.note && (
            <p className="font-sans text-xs text-dark/35 italic mt-0.5">{service.note}</p>
          )}
          <span className="inline-block mt-1.5 font-sans text-xs text-dark/30 tracking-wider uppercase bg-dark/4 px-2 py-0.5 rounded-sm">
            {formatServiceDuration(service.duration)}
          </span>
          {description && (
            <p className="font-sans text-xs text-dark/45 leading-relaxed mt-1.5">{description}</p>
          )}
        </div>
      </div>

      {/* Prix */}
      <p
        className={`shrink-0 pt-0.5 transition-colors ${
          quote
            ? 'font-serif text-base italic text-dark/45'
            : `font-serif text-xl ${active ? 'text-coral' : 'text-dark/80'}`
        }`}
      >
        {formatServicePrice(service)}
      </p>
    </button>
  )
}

// ─── Accordion panel (one display section) ─────────────────────────────────

function SectionPanel({
  section,
  services,
  cart,
  onToggle,
  defaultOpen = false,
  panelRef,
}: {
  section: CatalogueSection
  services: Service[]
  cart: SelectedService[]
  onToggle: (service: Service) => void
  defaultOpen?: boolean
  panelRef?: React.Ref<HTMLDivElement>
}) {
  const [open, setOpen] = useState(defaultOpen)
  const inCart = (id: string) => cart.some((s) => s.id === id)
  const selectedInSection = services.filter((s) => inCart(s.id)).length

  return (
    <div
      ref={panelRef}
      className={`border transition-all duration-300 overflow-hidden ${
        open ? 'border-coral/40 shadow-sm' : 'border-dark/10 hover:border-dark/25'
      }`}
    >
      {/* ── Header ── */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`svcpanel-${section.id}`}
        className="w-full flex items-center justify-between px-6 py-5 text-left group"
      >
        <div className="flex items-center gap-4">
          <span
            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors duration-300 ${
              open ? 'bg-coral/10' : 'bg-dark/5 group-hover:bg-dark/8'
            }`}
          >
            {section.emoji}
          </span>
          <div>
            <p className={`font-sans text-sm font-medium transition-colors ${open ? 'text-coral' : 'text-dark'}`}>
              {section.title}
            </p>
            <p className="font-sans text-xs text-dark/40 mt-0.5">
              {services.length} prestation{services.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {selectedInSection > 0 && (
            <span className="bg-coral-dark text-cream text-xs font-sans px-2.5 py-0.5 rounded-full font-medium">
              {selectedInSection} choisie{selectedInSection > 1 ? 's' : ''}
            </span>
          )}
          <span className={`transition-transform duration-300 text-dark/30 ${open ? 'rotate-180' : ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </button>

      {/* ── Corps dépliable ── */}
      <div
        id={`svcpanel-${section.id}`}
        aria-hidden={!open}
        inert={!open}
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          opacity: open ? 1 : 0,
          transition: 'grid-template-rows 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease',
        }}
      >
        <div style={{ overflow: 'hidden', minHeight: 0 }}>
          <div className="border-t border-dark/8">
            {section.description && (
              <p className="px-6 pt-4 font-sans text-xs text-dark/45 leading-relaxed">{section.description}</p>
            )}

            {section.id === 'extension-cils' && <CilsStylesGuide variant="compact" />}

            {section.subgroups ? (
              // Sub-grouped section (Extension de cils): Poses / Remplissages / Déposes.
              section.subgroups.map((sub) => {
                const subList = services.filter((s) => s.subgroup === sub)
                if (subList.length === 0) return null
                return (
                  <div key={sub}>
                    <p className="px-6 pt-4 pb-1 font-sans text-[11px] font-semibold uppercase tracking-widest text-coral/70">
                      {sub}
                    </p>
                    <div className="divide-y divide-dark/5">
                      {subList.map((s, i) => (
                        <ServiceRow key={s.id} service={s} active={inCart(s.id)} onToggle={onToggle} idx={i} open={open} />
                      ))}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="divide-y divide-dark/5">
                {services.map((s, i) => (
                  <ServiceRow key={s.id} service={s} active={inCart(s.id)} onToggle={onToggle} idx={i} open={open} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── ServicePicker principal ───────────────────────────────────────────────

export default function ServicePicker({
  selected,
  initialCategory,
  initialServices,
  onConfirm,
}: ServicePickerProps) {
  const [services, setServices] = useState<Service[]>(initialServices ?? [])
  const [cart, setCart] = useState<SelectedService[]>(selected)
  const [loading, setLoading] = useState(!initialServices?.length)
  const [error, setError] = useState<string | null>(null)
  const initialPanelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (initialServices?.length) return
    void fetch('/api/services')
      .then((r) => {
        if (!r.ok) throw new Error('Impossible de charger les prestations')
        return r.json()
      })
      .then((data: Service[]) => { setServices(data); setLoading(false) })
      .catch((err: Error) => { setError(err.message); setLoading(false) })
  }, [initialServices])

  // Deep-linked category (?category=MAINS) → open the first section of that pool.
  const initialSectionId = initialCategory
    ? SECTIONS.find((sec) => sec.category === initialCategory)?.id
    : undefined

  useEffect(() => {
    if (!loading && initialSectionId && initialPanelRef.current) {
      const id = window.setTimeout(() => {
        initialPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 120)
      return () => window.clearTimeout(id)
    }
  }, [loading, initialSectionId])

  const toggle = (service: Service) => {
    setCart((prev) =>
      prev.some((s) => s.id === service.id)
        ? prev.filter((s) => s.id !== service.id)
        : [...prev, service]
    )
  }

  const totalDuration = cart.reduce((sum, s) => sum + s.duration, 0)
  const totalPrice    = cart.reduce((sum, s) => sum + s.price, 0)

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-[72px] bg-dark/5 animate-pulse rounded" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-sm font-sans text-red-500">{error}</p>
      </div>
    )
  }

  // Group services by display section, then render sections in their fixed order.
  const bySection = new Map<string, Service[]>()
  for (const s of services) {
    const id = sectionIdOf(s)
    const list = bySection.get(id) ?? []
    list.push(s)
    bySection.set(id, list)
  }
  const visibleSections = SECTIONS.filter((sec) => (bySection.get(sec.id)?.length ?? 0) > 0)

  return (
    <div className="pb-36 md:pb-0">
      <h2 className="font-serif text-3xl font-light text-dark mb-1">Choisir vos prestations</h2>
      <p className="font-sans text-sm text-dark/40 mb-8">
        Ouvrez une catégorie, sélectionnez une ou plusieurs options.
      </p>

      {/* ── Accordéon ── */}
      <div className="flex flex-col gap-2">
        {visibleSections.map((section) => {
          const isInitial = section.id === initialSectionId
          return (
            <SectionPanel
              key={section.id}
              section={section}
              services={bySection.get(section.id) ?? []}
              cart={cart}
              onToggle={toggle}
              defaultOpen={isInitial}
              panelRef={isInitial ? initialPanelRef : undefined}
            />
          )
        })}
      </div>

      {/* ── Barre de résumé sticky (mobile) / fixe bas de page (desktop) ── */}
      <div
        className={`
          fixed bottom-0 left-0 right-0 z-50
          md:static md:mt-8
          transition-all duration-300
          ${cart.length > 0 ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
          ${cart.length > 0 ? 'pointer-events-auto' : 'pointer-events-none'}
          md:pointer-events-auto
        `}
      >
        <div
          className={`
            bg-cream border-t border-dark/10 md:border md:border-dark/10
            shadow-[0_-4px_24px_rgba(0,0,0,0.07)] md:shadow-none
            px-5 py-4 md:px-6 md:py-5
            transition-opacity duration-300
            ${cart.length === 0 ? 'md:opacity-50' : 'opacity-100'}
          `}
        >
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            {/* Résumé du panier */}
            <div className="flex-1 min-w-0">
              {cart.length === 0 ? (
                <p className="font-sans text-sm text-dark/35 italic">
                  Aucune prestation sélectionnée
                </p>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-sans text-xs text-dark/40">
                      {cart.length} prestation{cart.length > 1 ? 's' : ''}
                    </span>
                    <span className="text-dark/20">·</span>
                    <span className="font-sans text-xs text-dark/40">{formatServiceDuration(totalDuration)}</span>
                  </div>
                  <p className="font-sans text-sm text-dark font-medium truncate">
                    {cart.map((s) => s.name).join(' + ')}
                  </p>
                </>
              )}
            </div>

            {/* Total + CTA */}
            <div className="flex items-center gap-4 shrink-0">
              {cart.length > 0 && (
                <p className="font-serif text-2xl text-coral">{totalPrice} €</p>
              )}
              <button
                type="button"
                onClick={() => cart.length > 0 && onConfirm(cart)}
                disabled={cart.length === 0}
                className={`
                  font-sans text-xs tracking-widest px-7 py-3.5 transition-all duration-200
                  ${cart.length > 0
                    ? 'bg-dark text-cream hover:bg-coral-dark cursor-pointer'
                    : 'bg-dark/20 text-dark/30 cursor-not-allowed'
                  }
                `}
              >
                Continuer →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
