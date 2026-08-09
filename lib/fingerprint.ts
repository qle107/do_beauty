// ─── Browser fingerprint (fallback identifier) ─────────────────────────────
// A hash of stable, low-privacy browser attributes. Unlike the localStorage
// device id (lib/device-id.ts), it survives the visitor clearing site data or
// switching browser profile / private mode, so a flagged device that wipes its
// device id is still recognised by its fingerprint.
//
// It is NOT unique — different visitors on the same phone model + browser can
// collide — so it is only ever a SECONDARY signal, checked behind the phone and
// device-id blocks, never on its own. A rare false match is covered by the same
// "contactez-nous directement" escape hatch as the other blocks.

import { hasConsent } from './consent'

// djb2 → unsigned 32-bit as 8 hex chars.
function hash(str: string): string {
  let h = 5381
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) | 0
  }
  return (h >>> 0).toString(16).padStart(8, '0')
}

// Canvas render signature: the same drawing code produces subtly different
// pixels across GPU / driver / font-rendering stacks. Empty string if blocked.
function canvasSignature(): string {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''
    ctx.textBaseline = 'top'
    ctx.font = "14px 'Arial'"
    ctx.fillStyle = '#f60'
    ctx.fillRect(125, 1, 62, 20)
    ctx.fillStyle = '#069'
    ctx.fillText('VyNails93 \u{1F485}', 2, 15)
    return canvas.toDataURL()
  } catch {
    return ''
  }
}

/**
 * Return a compact (16 hex char) fingerprint for this browser, or '' when it
 * can't be computed (SSR, or a hardened browser that blocks the APIs used).
 * Bounded well under the schema's 64-char cap.
 */
export function getFingerprint(): string {
  if (typeof window === 'undefined') return ''
  // Fingerprinting is a tracker under CNIL rules: no consent, no computation.
  // The booking still proceeds (validations accept an empty fingerprint); abuse
  // detection just falls back to the phone blocklist + device UUID.
  if (!hasConsent()) return ''
  try {
    const n = window.navigator
    const s = window.screen
    const parts = [
      n.userAgent,
      n.language,
      (n.languages ?? []).join(','),
      String(n.hardwareConcurrency ?? ''),
      String((n as unknown as { deviceMemory?: number }).deviceMemory ?? ''),
      `${s.width}x${s.height}x${s.colorDepth}`,
      String(window.devicePixelRatio ?? ''),
      Intl.DateTimeFormat().resolvedOptions().timeZone ?? '',
      canvasSignature(),
    ]
    const joined = parts.join('|')
    // Two hashes (forwards + reversed) → 16 hex chars, far fewer collisions
    // than a single 32-bit hash.
    return hash(joined) + hash(joined.split('').reverse().join(''))
  } catch {
    return ''
  }
}
