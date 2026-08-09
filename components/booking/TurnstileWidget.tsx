'use client'

import { useEffect, useRef, useCallback } from 'react'

interface TurnstileWidgetProps {
  onVerify: (token: string) => void
  onExpire?: () => void
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string
          callback: (token: string) => void
          'expired-callback'?: () => void
          theme?: 'light' | 'dark' | 'auto'
          language?: string
        }
      ) => string
      reset: (widgetId: string) => void
    }
    onTurnstileLoad?: () => void
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''

export default function TurnstileWidget({ onVerify, onExpire }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef  = useRef<string | null>(null)

  const renderWidget = useCallback(() => {
    if (!containerRef.current || !window.turnstile || widgetIdRef.current) return
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey:           SITE_KEY,
      callback:          onVerify,
      'expired-callback': onExpire,
      theme:             'light',
      language:          'fr',
    })
  }, [onVerify, onExpire])

  useEffect(() => {
    // If Turnstile is already initialised (e.g. user navigated back to this step)
    if (window.turnstile) {
      renderWidget()
      return
    }

    // If the script tag is already in the DOM (strict-mode double mount, HMR, etc.)
    // just wait for the onload callback - don't inject a second tag.
    const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    const alreadyInjected = !!document.querySelector(`script[src^="${SCRIPT_SRC}"]`)

    window.onTurnstileLoad = renderWidget

    if (!alreadyInjected) {
      const script = document.createElement('script')
      script.src = `${SCRIPT_SRC}?onload=onTurnstileLoad`
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }

    return () => {
      window.onTurnstileLoad = undefined
    }
  }, [renderWidget])

  if (!SITE_KEY) {
    // No site key configured - skip the widget silently.
    // The booking API accepts '__dev__' as a bypass token in this case.
    if (process.env.NODE_ENV === 'development') {
      console.info('[Turnstile] NEXT_PUBLIC_TURNSTILE_SITE_KEY not set - widget disabled in dev mode.')
    }
    return null
  }

  return <div ref={containerRef} className="mt-2 min-h-[65px]" />
}
