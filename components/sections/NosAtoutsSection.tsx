'use client'

import { useEffect, useRef, useState } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { cn, formatCurrency } from '@/lib/utils'
import { prefersReducedMotion } from '@/lib/motion'
import { servicePageLinks } from '@/lib/navigation'
import Link from 'next/link'

// Resolve a landing-page href from the shared nav list, keyed by its label.
const landingHref = (label: string) =>
  servicePageLinks.find((l) => l.label === label)?.href ?? '/menus'

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  category: string
}

type ServiceMap = Record<string, Service[]>

type TabDef = {
  value: string
  label: string
  learnMore?: { navLabel: string; anchor: string }
}

const TABS: TabDef[] = [
  { value: 'MAINS', label: 'Mains',           learnMore: { navLabel: 'Manucure', anchor: 'La manucure à Gentilly' } },
  { value: 'PIEDS', label: 'Beauté des pieds', learnMore: { navLabel: 'Beauté des pieds', anchor: 'La beauté des pieds à Gentilly' } },
  { value: 'CILS',  label: 'Cils & regard',    learnMore: { navLabel: 'Extensions de cils', anchor: 'Les extensions de cils à Gentilly' } },
]

const TAB_DESCRIPTIONS: Record<string, string> = {
  MAINS: 'Manucure, pose de vernis classique et semi-permanent réalisés avec précision et délicatesse.',
  PIEDS: 'Beauté des pieds complète : cuticules, soin et pose de vernis longue tenue pour des orteils impeccables.',
  CILS: 'Extensions cil à cil, volume russe et rehaussement pour un regard intense, du plus naturel au plus intense.',
}

function ServiceList({ services, loading }: { services: Service[]; loading: boolean }) {
  if (loading) return (
    <div className="flex flex-col divide-y divide-dark/8" aria-hidden="true">
      {[0, 1, 2].map((i) => <div key={i} className="py-4 h-10 bg-dark/5 animate-pulse rounded" />)}
    </div>
  )
  if (services.length === 0) return (
    <p className="text-dark/40 font-sans text-sm italic">Aucune prestation disponible pour le moment.</p>
  )
  return (
    <ul className="flex flex-col divide-y divide-dark/8">
      {services.map((s) => (
        <li key={s.id} className="py-4 flex justify-between items-baseline gap-4">
          <div>
            <p className="font-sans text-sm text-dark">{s.name}</p>
            <p className="font-sans text-xs text-charcoal-500 mt-0.5">{s.duration} min</p>
          </div>
          <span className="font-serif text-lg text-coral shrink-0 lining-nums tabular-nums">{formatCurrency(s.price)}</span>
        </li>
      ))}
    </ul>
  )
}

export default function NosAtoutsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [serviceMap, setServiceMap] = useState<ServiceMap>({})
  const [loaded, setLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState('MAINS')

  // Pre-fetch featured services per category - homepage shows only highlights
  useEffect(() => {
    const cats = TABS.map((t) => t.value)
    void Promise.all(
      cats.map((cat) =>
        fetch(`/api/services?category=${cat}&featured=true`)
          .then((r) => (r.ok ? (r.json() as Promise<unknown>) : []))
          .then((data) => (Array.isArray(data) ? (data as Service[]) : []))
          .catch(() => [] as Service[])
      )
    ).then((results) => {
      const map: ServiceMap = {}
      cats.forEach((cat, i) => { map[cat] = results[i] })
      setServiceMap(map)
      setLoaded(true)
    })
  }, [])

  useEffect(() => {
    if (prefersReducedMotion()) return
    let cleanup: (() => void) | undefined
    const load = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      const section = sectionRef.current
      if (!section) return
      gsap.fromTo(
        section.querySelectorAll('[data-reveal]'),
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 70%' },
        }
      )
      cleanup = () => ScrollTrigger.getAll().forEach((t) => t.kill())
    }
    void load()
    return () => cleanup?.()
  }, [])

  return (
    <section ref={sectionRef} className="bg-cream border-t border-nude-300/60">
      {/* ── Prestations phares (tabs) ──────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14">
          <p data-reveal className="font-sans text-xs tracking-[0.3em] uppercase text-dark/40 mb-3">
            Nos services
          </p>
          <h2 data-reveal className="font-serif text-4xl md:text-5xl font-light text-dark">
            Prestations phares
          </h2>
        </div>

        <Tabs.Root
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <Tabs.List className="flex border-b border-dark/12 mb-12 gap-10 overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  'pb-4 text-xs tracking-[0.2em] font-sans uppercase whitespace-nowrap transition-colors relative shrink-0',
                  'data-[state=inactive]:text-dark/35 data-[state=active]:text-dark',
                  'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px',
                  'after:bg-coral after:scale-x-0 data-[state=active]:after:scale-x-100',
                  'after:transition-transform after:duration-300 after:origin-left'
                )}
              >
                {tab.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {TABS.map((tab) => (
            <Tabs.Content
              key={tab.value}
              value={tab.value}
              className="min-h-[320px] tab-fade"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                <ServiceList services={serviceMap[tab.value] ?? []} loading={!loaded} />
                <div>
                  <p className="text-charcoal-500 font-sans text-sm leading-relaxed mb-10">
                    {TAB_DESCRIPTIONS[tab.value]}
                  </p>
                  <Link
                    href="/menus"
                    className="inline-block border border-dark text-dark text-xs px-8 py-3.5 tracking-widest font-sans hover:bg-dark hover:text-cream transition-all duration-200"
                  >
                    Voir toutes les prestations
                  </Link>
                  {tab.learnMore && (
                    <p className="mt-6">
                      <Link
                        href={landingHref(tab.learnMore.navLabel)}
                        className="font-sans text-sm text-charcoal-500 underline underline-offset-4 decoration-nude-300 hover:text-coral hover:decoration-coral transition-colors"
                      >
                        {tab.learnMore.anchor} →
                      </Link>
                    </p>
                  )}
                </div>
              </div>
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </div>
    </section>
  )
}
