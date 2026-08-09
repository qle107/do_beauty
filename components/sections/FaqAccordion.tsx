'use client'

import { useState } from 'react'
import { homepageFaqs } from '@/lib/seo/faqs'

// Show a short set by default; the rest stay in the DOM (accessible + crawlable,
// and the FAQPage JSON-LD carries all of them) but are hidden until expanded.
const VISIBLE_COUNT = 5

export default function FaqAccordion() {
  const [expanded, setExpanded] = useState(false)
  const hiddenCount = homepageFaqs.length - VISIBLE_COUNT

  return (
    <section id="faq" className="bg-cream border-t border-nude-300/60 py-24 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center mb-14">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-dark/45 mb-4">
            Questions fréquentes
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-dark leading-tight">
            Tout ce que vous voulez savoir
          </h2>
          <div className="h-px w-16 bg-coral/40 mx-auto mt-8" />
        </div>

        <div className="divide-y divide-dark/10 border-y border-dark/10">
          {homepageFaqs.map((faq, i) => (
            <details
              key={faq.question}
              hidden={!expanded && i >= VISIBLE_COUNT}
              className="group py-5"
            >
              <summary className="flex items-start justify-between gap-6 cursor-pointer list-none font-sans text-base text-dark hover:text-coral transition-colors">
                <span className="flex-1">{faq.question}</span>
                <span
                  aria-hidden="true"
                  className="shrink-0 mt-1 text-dark/40 group-open:rotate-45 transition-transform duration-200"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>
              <p className="font-sans text-sm text-charcoal-500 leading-relaxed mt-3 pr-10">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

        {hiddenCount > 0 && (
          <div className="text-center mt-10">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="inline-flex items-center gap-2 rounded-md border border-dark/25 text-dark text-sm px-8 py-3.5 tracking-[0.15em] font-sans hover:border-dark hover:bg-blush/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              {expanded ? 'Voir moins' : `Voir plus de questions (${hiddenCount})`}
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"
                className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
        )}

        <p className="text-center mt-12 font-sans text-sm text-dark/55">
          Une autre question ?{' '}
          <a
            href="/contact"
            className="text-coral underline underline-offset-4 hover:text-coral-dark transition-colors"
          >
            Contactez-nous
          </a>
        </p>
      </div>
    </section>
  )
}
