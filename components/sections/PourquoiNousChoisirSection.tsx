'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { prefersReducedMotion } from '@/lib/motion'
import { servicePageLinks } from '@/lib/navigation'

// Resolve a landing-page href from the shared nav list, keyed by its label.
const linkFor = (label: string) =>
  servicePageLinks.find((l) => l.label === label)?.href ?? '/menus'

type Point = { text: string; href?: string }

const POINTS: Point[] = [
  { text: 'Produits professionnels Diamond & OPI' },
  { text: 'Prothésistes ongulaires expérimentées', href: linkFor('Prothésiste ongulaire') },
  { text: 'Formules douces, ongles sans HEMA sur demande', href: linkFor('Ongles sans HEMA') },
  { text: 'À proximité du RER B (Gentilly)' },
  { text: 'Ouvert 7j/7, dimanche compris, de 10h à 20h', href: linkFor('Ouvert le dimanche') },
]

export default function PourquoiNousChoisirSection() {
  const sectionRef = useRef<HTMLElement>(null)

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
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 70%' },
        }
      )
      cleanup = () => ScrollTrigger.getAll().forEach((t) => t.kill())
    }
    void load()
    return () => cleanup?.()
  }, [])

  return (
    <section ref={sectionRef} className="grid grid-cols-1 md:grid-cols-2 md:min-h-[600px]">
      {/* Image pleine hauteur — Vy au travail (full-bleed, pour varier du hero) */}
      <div className="photo-tint relative order-1 md:order-2 min-h-[360px] md:min-h-0 overflow-hidden">
        <Image
          src="/images/dob/g9.jpg"
          alt="Prothésiste ongulaire chez Do Beauty à Gentilly, réalisant une pose semi-permanent"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          loading="lazy"
          className="object-cover object-center"
        />
        <span className="absolute bottom-6 right-7 z-20 font-script text-cream/85 text-4xl drop-shadow-lg">Do Beauty</span>
      </div>

      {/* Texte */}
      <div className="order-2 md:order-1 bg-blush/70 flex items-center px-8 sm:px-12 md:px-16 lg:px-20 py-20">
        <div className="max-w-md">
          <p data-reveal className="font-sans text-xs tracking-[0.3em] uppercase text-charcoal-500 mb-5">
            Votre experte
          </p>
          <h2 data-reveal className="font-serif text-4xl md:text-5xl font-light text-dark leading-tight">
            Do Beauty
          </h2>
          <span data-reveal className="font-script text-coral text-3xl md:text-4xl block mt-1 mb-12 pb-1">
            Chez vous, pour vous.
          </span>

          <ul data-reveal className="border-t border-dark/10">
            {POINTS.map((point) => (
              <li
                key={point.text}
                className="flex items-baseline gap-4 border-b border-dark/10 py-4 font-sans text-sm text-charcoal-700 leading-relaxed"
              >
                <span aria-hidden="true" className="shrink-0 text-coral">✳</span>
                {point.href ? (
                  <Link
                    href={point.href}
                    className="underline-offset-4 hover:text-coral hover:underline transition-colors"
                  >
                    {point.text}
                  </Link>
                ) : (
                  <span>{point.text}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
