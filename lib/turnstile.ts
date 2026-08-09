// ─── Cloudflare Turnstile verification ────────────────────────────────────
// Shared by the booking (/api/appointments) and contact (/api/contact) routes.

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY ?? ''
const TURNSTILE_VERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const IS_PROD = process.env.NODE_ENV === 'production'

export async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  // Dev convenience (NON-production only): accept the '__dev__' bypass token and
  // skip entirely when no secret is configured, so local dev needs no Turnstile.
  if (!IS_PROD && (token === '__dev__' || !TURNSTILE_SECRET)) return true

  // Production: fail CLOSED. A missing secret or missing token must reject -
  // never bypass - so a misconfigured deploy can't silently disable the CAPTCHA.
  if (!TURNSTILE_SECRET || !token) return false

  try {
    const res = await fetch(TURNSTILE_VERIFY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: TURNSTILE_SECRET, response: token, remoteip: ip }),
      // Abort a hung verify so the route fails closed in seconds instead of stalling.
      signal: AbortSignal.timeout(5_000),
    })
    const data = await res.json() as { success: boolean }
    return data.success === true
  } catch {
    // Fail closed: any verification error rejects the request.
    return false
  }
}
