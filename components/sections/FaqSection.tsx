'use client'

import { useState } from 'react'
import Reveal from '@/components/ui/Reveal'
import { faqPageSchema, jsonLd } from '@/lib/seo/schema'

const list = [
  {
    q: 'Comment prendre rendez-vous ?',
    a: 'En ligne en quelques clics, ou en nous contactant directement.',
  },
  {
    q: 'Quels soins proposez-vous ?',
    a: 'Manucure, nail art, beauté du regard et soins des mains et des pieds.',
  },
  {
    q: 'Où êtes-vous situés ?',
    a: '16 Avenue Jean Jaurès, 94250 Gentilly.',
  },
  {
    q: 'Quels sont vos horaires ?',
    a: 'Ouvert 7 jours sur 7, à partir de 11h.',
  },
  {
    q: 'Peut-on choisir son experte ?',
    a: 'Oui, ou nous vous confions à la première disponibilité.',
  },
  {
    q: 'Quels moyens de paiement acceptez-vous ?',
    a: 'Espèces et virement.',
  },
] as const

const schema = jsonLd(
  faqPageSchema(list.map((f) => ({ question: f.q, answer: f.a })))
)

export default function FaqSection() {
  const [open, setOpen] = useState<number>(0)

  return (
    <section className="db-section bg-[color:var(--db-ivory)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schema }}
      />

      <div className="db-shell">
        <Reveal>
          <div className="mx-auto max-w-2xl">
            <p className="db-eyebrow">FAQ</p>
            <h2 className="db-title mt-3">Questions fréquentes.</h2>

            <div className="mt-8">
              {list.map((item, i) => {
                const isOpen = open === i
                const panelId = `faq-panel-${i}`
                const btnId = `faq-btn-${i}`
                return (
                  <div key={item.q}>
                    <h3>
                      <button
                        id={btnId}
                        type="button"
                        onClick={() => setOpen(isOpen ? -1 : i)}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        className="flex min-h-[56px] w-full items-center justify-between gap-5 border-t border-[color:var(--db-line)] py-5 text-left"
                      >
                        <span className="text-[16px] leading-snug text-[color:var(--db-ink)]">
                          {item.q}
                        </span>
                        <span
                          aria-hidden="true"
                          className="grid h-6 w-6 shrink-0 place-items-center text-xl leading-none text-[color:var(--db-champagne)] transition-transform duration-300 ease-out motion-reduce:transition-none"
                          style={{
                            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                          }}
                        >
                          +
                        </span>
                      </button>
                    </h3>

                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={btnId}
                      className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
                      style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                    >
                      <div className="overflow-hidden">
                        <p className="pb-5 pr-8 text-[15px] leading-relaxed text-[color:var(--db-taupe)]">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
