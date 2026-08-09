// ─── Cookie / tracker consent ──────────────────────────────────────────────
// A single opt-in flag governing every NON-essential tracker: Google Tag
// Manager (audience measurement) and the browser fingerprint used for abuse
// detection. Nothing tracking-related fires until the visitor accepts, as
// required by the CNIL (prior consent before depositing/reading trackers).
//
// Strictly-necessary items are NOT gated by this: the admin session cookie,
// the Turnstile anti-spam challenge, and the first-party device UUID used only
// to curb booking abuse (security/fraud-prevention purpose).

export const CONSENT_KEY = 'dobeauty_consent'
// Dispatched on window to re-open the banner (withdrawal must be as easy as
// consent), and again whenever the choice changes so listeners can react.
export const CONSENT_EVENT = 'dobeauty:consent'

export type ConsentValue = 'granted' | 'denied'

// CNIL recommends re-asking for consent periodically. We expire the stored
// choice after ~6 months so the banner reappears — matching the "6 mois"
// duration stated in the privacy policy.
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 182

/** The stored choice, or null when absent, malformed, or older than 6 months. */
export function getConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY)
    if (!raw) return null
    // Current format: {"v":"granted","t":<epoch ms>}. Expire past 6 months.
    if (raw[0] === '{') {
      const { v, t } = JSON.parse(raw) as { v?: string; t?: number }
      if ((v === 'granted' || v === 'denied') && typeof t === 'number') {
        return Date.now() - t > MAX_AGE_MS ? null : v
      }
      return null
    }
    // Legacy plain-string value (no timestamp): still honoured.
    return raw === 'granted' || raw === 'denied' ? raw : null
  } catch {
    return null
  }
}

/** True only when the visitor has explicitly accepted trackers. */
export function hasConsent(): boolean {
  return getConsent() === 'granted'
}

/** Persist the choice and notify listeners (banner, GTM loader). */
export function setConsent(value: ConsentValue): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify({ v: value, t: Date.now() }))
  } catch {
    // localStorage unavailable (private mode): the choice simply isn't
    // remembered, so the banner reappears next visit. Acceptable.
  }
  window.dispatchEvent(new Event(CONSENT_EVENT))
}

/** Re-open the consent banner so the visitor can change or withdraw consent. */
export function openConsentBanner(): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: 'open' }))
}
