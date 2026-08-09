// Boot-time environment validation - runs once at server startup via Next.js.
// Fails fast in production when security-critical secrets are missing, so a
// misconfigured deploy can't silently disable auth or the Turnstile CAPTCHA.

export function register() {
  // Only validate in the Node.js server runtime, in production.
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  if (process.env.NODE_ENV !== 'production') return

  const required = ['AUTH_SECRET', 'ADMIN_EMAIL', 'TURNSTILE_SECRET_KEY']
  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    throw new Error(
      `[env] Missing required production environment variable(s): ${missing.join(', ')}. ` +
        'Set them before starting the server.'
    )
  }
}
