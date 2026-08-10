'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { getConsent, setConsent, CONSENT_EVENT, type ConsentValue } from '@/lib/consent'

const GTM_ID = 'GTM-WF6G3H69'

// Loads Google Tag Manager ONLY after the visitor accepts. Rendering nothing
// until consent means no analytics tracker is deposited beforehand.
export default function CookieConsent() {
  // null = not yet read (SSR + first paint): render nothing to avoid a flash
  // and a hydration mismatch. After mount we know the stored choice.
  const [decided, setDecided] = useState<boolean | null>(null)
  const [granted, setGranted] = useState(false)

  useEffect(() => {
    const sync = (e: Event) => {
      // openConsentBanner() sends detail 'open' to force the banner back up.
      if ((e as CustomEvent).detail === 'open') {
        setDecided(false)
        return
      }
      const c = getConsent()
      setGranted(c === 'granted')
      setDecided(c !== null)
    }
    // Initial read of the stored choice - a deliberate one-time, client-only sync.
    // localStorage is unavailable during SSR, so the banner state can only be known
    // after mount; this is not the cascading-render pattern the rule targets.
    const c = getConsent()
    /* eslint-disable react-hooks/set-state-in-effect */
    setGranted(c === 'granted')
    setDecided(c !== null)
    /* eslint-enable react-hooks/set-state-in-effect */

    window.addEventListener(CONSENT_EVENT, sync)
    return () => window.removeEventListener(CONSENT_EVENT, sync)
  }, [])

  function choose(value: ConsentValue) {
    setConsent(value)
    setGranted(value === 'granted')
    setDecided(true)
    // Record the choice server-side as proof of consent (RGPD art. 7-1).
    // Fire-and-forget: never block or fail the banner on a logging hiccup.
    void fetch('/api/consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ choice: value }),
    }).catch(() => {})
  }

  return (
    <>
      {granted && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      )}

      {decided === false && (
        <div
          role="dialog"
          aria-label="Gestion des cookies"
          className="fixed inset-x-0 bottom-0 z-[100] border-t border-[color:var(--db-champ-line)] bg-[#171615] text-[#E4DCCF]"
        >
          <div className="mx-auto flex max-w-4xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <p className="text-[13px] leading-relaxed text-[#E4DCCF]/75">
              Nous utilisons des cookies de mesure d&apos;audience et une empreinte technique
              pour améliorer votre expérience et prévenir les abus de réservation. Ces traceurs
              ne sont déposés qu&apos;avec votre accord.{' '}
              <Link href="/privacy" className="underline underline-offset-2 text-[color:var(--db-champagne)] transition-colors hover:text-[#FBF8F2]">
                En savoir plus
              </Link>
              .
            </p>
            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                onClick={() => choose('denied')}
                className="min-h-[44px] border border-[#E4DCCF]/30 px-5 text-[12px] uppercase tracking-[0.12em] text-[#E4DCCF]/85 transition-colors hover:bg-white/10"
              >
                Refuser
              </button>
              <button
                type="button"
                onClick={() => choose('granted')}
                className="min-h-[44px] bg-[color:var(--db-champagne)] px-6 text-[12px] uppercase tracking-[0.12em] text-[#171615] transition-colors hover:bg-[#FBF8F2]"
              >
                Accepter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
