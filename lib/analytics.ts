// ─── Consent-safe analytics ────────────────────────────────────────────────
// Pushes events onto the GTM dataLayer, but ONLY when:
//   1. we're in the browser,
//   2. the visitor has explicitly accepted trackers (CNIL prior consent), and
//   3. the dataLayer already exists — i.e. GTM has been injected by
//      CookieConsent, which only happens post-consent.
// It never pushes PII (name / phone / notes). On the server, before consent, or
// before GTM has loaded, track() is a silent no-op.

import { hasConsent } from '@/lib/consent'

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

type EventParams = Record<string, string | number | boolean>

export function track(event: string, params: EventParams = {}): void {
  if (typeof window === 'undefined') return
  if (!hasConsent()) return
  const dl = window.dataLayer
  if (!Array.isArray(dl)) return
  dl.push({ event, ...params })
}
