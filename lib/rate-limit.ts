// ─── In-memory IP rate limiter ────────────────────────────────────────────
// Limits booking attempts per IP to MAX_ATTEMPTS within WINDOW_MS.
// State resets when the server restarts (acceptable for a small salon app).

import { setInterval } from 'node:timers'  // Node's typing returns a Timeout (has unref); the global is DOM-typed here

const MAX_ATTEMPTS = 3
const WINDOW_MS    = 24 * 60 * 60 * 1_000  // 24 hours

interface Record {
  count:     number
  windowStart: number  // timestamp of first attempt in current window
  windowMs:    number  // window length, so the sweep can evict expired entries
}

// Global map shared across requests in the same server process
const store = new Map<string, Record>()

/**
 * Returns true when the key has exceeded maxAttempts within windowMs.
 * Callers should namespace the key per route (e.g. `contact:${ip}`) so
 * different limits don't share a counter. Defaults: 3 attempts / 24 h.
 * Automatically resets the window after windowMs.
 */
export function isRateLimited(key: string, maxAttempts = MAX_ATTEMPTS, windowMs = WINDOW_MS): boolean {
  const now = Date.now()
  const rec = store.get(key)

  if (!rec || now - rec.windowStart > windowMs) {
    // First request or window expired - start fresh (also evicts the stale record)
    store.set(key, { count: 1, windowStart: now, windowMs })
    return false
  }

  if (rec.count >= maxAttempts) return true

  rec.count++
  return false
}

// Periodically evict expired entries so the Map can't grow unbounded under bot
// traffic: a spray from many unique IPs would otherwise leave a record per IP
// forever (records are only reset on a *repeat* hit from the same key). unref()
// keeps this timer from holding the process open.
const SWEEP_INTERVAL_MS = 60 * 60 * 1_000  // hourly
setInterval(() => {
  const now = Date.now()
  for (const [key, rec] of store) {
    if (now - rec.windowStart > rec.windowMs) store.delete(key)
  }
}, SWEEP_INTERVAL_MS).unref()

/**
 * Extract the real client IP from request headers.
 * Prefer CF-Connecting-IP: Cloudflare sets it and overwrites any client-supplied
 * value, so it's trustworthy. x-forwarded-for is only trustworthy behind a trusted
 * proxy - when the origin is directly internet-facing, XFF is attacker-controllable.
 */
export function getClientIp(request: Request): string {
  const cf = request.headers.get('cf-connecting-ip')
  if (cf) return cf.trim()

  const xff = request.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]!.trim()

  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp.trim()

  return 'unknown'
}
