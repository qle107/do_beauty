# VyNails93 - Security Review

**Application:** `cure-boutique` (Next.js 16 App Router, React 19, TypeScript)
**Reviewer role:** Senior Application Security Engineer
**Date:** 2026-06-25
**Scope:** Full source review of the repository (infra config, auth, API routes, data layer, frontend, compliance). No live pentest performed.
**Stack facts that shape the risk profile:** No SQL/NoSQL database - data lives in flat JSON files (`data/services.json`, `data/blocklist.json`) and **Google Calendar** (appointments). Admin is a **single Google account** (email allowlist). Notifications go out via **SMTP (nodemailer)** and **CallMeBot (WhatsApp)**. Anti-abuse uses an **in-memory IP limiter** + **Cloudflare Turnstile**.

---

## 1. Security Score: 62 / 100 - *Moderate*

Solid fundamentals for a small business site: every input is Zod-validated, the admin panel is gated server-side, OAuth uses a strict single-email allowlist, secrets are environment-based and git-ignored, there's a CAPTCHA + rate limiter on booking, and React's auto-escaping keeps browser-side XSS low. **No critical (RCE / auth-bypass / exposed-secret / SQLi) issues were found.**

Points are lost for defense-in-depth gaps that are individually low-to-medium but compounding: no Content-Security-Policy, a **fail-open** CAPTCHA, an **unthrottled contact form** (email-bomb vector), **HTML injection into the owner's notification emails**, **client PII shipped to a third party (CallMeBot) without a DPA**, **appointment info disclosure by phone number**, and abuse-protection primitives (IP from a spoofable header, in-memory state) that are weak on the intended Hostinger deployment.

| Band | Meaning |
|------|---------|
| 90–100 | Hardened, production-grade |
| 75–89 | Good; minor gaps |
| **60–74** | **Moderate; real gaps to close before/just after launch** ← you are here |
| 40–59 | Weak; several exploitable issues |
| 0–39 | Insecure |

---

## 2. Critical Vulnerabilities

**None identified.** The most dangerous classes are absent or mitigated:

- No SQL/NoSQL database → no SQL/NoSQL injection surface (`lib/services-store.ts`, `lib/blocklist.ts` use fixed file paths; IDs are never concatenated into paths).
- Admin pages are gated server-side in `app/admin/(protected)/layout.tsx` (`await auth()` + `session.user.email !== ADMIN_EMAIL → redirect`).
- Login is fail-closed: `signIn()` in `lib/auth.ts` blocks **all** logins if `ADMIN_EMAIL` is unset, and otherwise only the exact admin email.
- All secrets are server-only `process.env.*` (no `NEXT_PUBLIC_` leakage) and `.env*` is git-ignored.

> Caveat: "no critical" assumes production env is configured correctly (`AUTH_SECRET`, `ADMIN_EMAIL`, `TURNSTILE_SECRET_KEY` all set). A misconfigured deploy can downgrade several items below to critical - see §10.

---

## 3. High-Risk Vulnerabilities

### H-1 - Contact form has no rate limit and no CAPTCHA (email-bomb / abuse)
`app/api/contact/route.ts` validates with Zod then calls `sendContactNotification()` with **no `isRateLimited()` and no Turnstile check** (compare with `app/api/appointments/route.ts`, which has both). An attacker can script unlimited POSTs, flooding the owner's inbox, burning SMTP quota, and risking the sending domain's reputation/blacklisting.
**Fix:** apply the rate limiter + Turnstile to `/api/contact` (see §9).

### H-2 - Cloudflare Turnstile verification fails open + is config-dependent
In `app/api/appointments/route.ts`, `verifyTurnstile()`:
- returns `true` if `TURNSTILE_SECRET` is unset (so a prod misconfig disables the CAPTCHA silently),
- returns `true` for the literal token `'__dev__'`,
- **`catch { return true }`** - any error verifying the token is treated as success.

`turnstileToken` is also `.optional()` in `lib/validations.ts`. Combined, the booking CAPTCHA is only as strong as the environment being perfectly configured, and any verification hiccup bypasses it.
**Fix:** fail **closed** (`return false` on error / missing secret in production), make the token required in prod, and alert if `TURNSTILE_SECRET` is missing at boot.

### H-3 - Rate limiting keys on a client-controllable IP and is in-memory
`lib/rate-limit.ts` derives the client IP from `x-forwarded-for` (first value). On **Hostinger** (your intended host, per our earlier discussion) that header is **attacker-supplied** unless a trusted proxy overwrites it - so an attacker rotates `X-Forwarded-For` to defeat the 3/IP/24h booking cap and Turnstile's `remoteip`. State is also a process-local `Map` (resets on restart, not shared across workers).
**Fix:** put **Cloudflare in front** and read `CF-Connecting-IP` (trusted), or only trust XFF from known proxy IPs; move limiter state to a shared store (Upstash Redis / `@upstash/ratelimit`) if you scale beyond one instance.

### H-4 - HTML injection into owner notification emails (stored-XSS-in-email / phishing)
`lib/mail.ts` interpolates **unescaped** user input directly into HTML email bodies - `clientName`, `clientPhone`, `notes` (booking) and `senderName`, `senderEmail`, `subject`, `message` (contact), e.g. `...<strong>Nom :</strong> ${data.clientName}...` and `...white-space:pre-wrap;">${data.message}</p>`. A visitor can inject markup (fake links, spoofed content, tracking pixels) that renders in the owner's mail client - a phishing/social-engineering vector against the business owner. (Email clients strip `<script>`, so this is HTML/content injection, not browser JS execution; nodemailer mitigates header-injection on the `subject`.)
**Fix:** HTML-escape every interpolated value before templating (a 5-line `escapeHtml()` helper), or send `text:` parts.

### H-5 - Client PII sent to CallMeBot (third party) without a DPA, with the API key in the URL
`lib/whatsapp.ts` builds `https://api.callmebot.com/whatsapp.php?phone=...&text=...&apikey=...` containing the **client's name, phone, services and notes**, and the secret `apikey` **in the query string**. This is (a) a **GDPR** problem - personal data disclosed to an unvetted external processor with no Data Processing Agreement and likely non-EU transfer, and (b) a secret-in-URL problem (query strings get logged by proxies/CDNs/server logs).
**Fix:** drop CallMeBot for PII, or replace with WhatsApp Business API / an EU provider under a DPA; never put PII or secrets in a GET URL. At minimum, send only a "new booking" ping with no client identifiers and document the processor in the privacy policy.

---

## 4. Medium-Risk Vulnerabilities

### M-1 - Appointment information disclosure by phone number (IDOR-style privacy leak)
`POST /api/appointments` calls `findActiveAppointmentForPhone(clientPhone)` and, on a match, returns the existing appointment's `date`, `timeSlot`, `serviceNames`, `status` (HTTP 409). An attacker who submits **someone else's** phone number learns whether that person has an upcoming appointment and its details. This endpoint is public and (per H-3) weakly throttled, enabling enumeration.
**Fix:** don't return another person's details to an unauthenticated caller - return a generic "you may already have a booking, call us" and require a stronger match, or gate the lookup behind the CAPTCHA result.

### M-2 - API routes check authentication but not authorization (defense-in-depth)
Every admin API (`appointments`, `services`, `services/[id]`, `blocklist`, `admin/stats`, `appointments/[id]`) checks only `if (!session?.user)` - not that the user **is the admin**. This is currently safe **only because** `signIn()` allowlists a single email, so any session implies admin. If that allowlist ever loosens (e.g., adding a second provider/role), these routes silently become under-protected.
**Fix:** check `session.user.email === process.env.ADMIN_EMAIL` (or the `isAdmin` flag already on the token) in a small `requireAdmin()` helper used by every protected route.

### M-3 - `authorized` callback is dead code; no `middleware.ts`
`lib/auth.ts` defines an `authorized()` callback meant to gate `/admin/*`, but it only runs when NextAuth is wired as **middleware**, and there is **no `middleware.ts`** in the repo. So the intended edge-level guard never executes; protection relies entirely on the per-page/per-route checks. It works today, but it's a missing layer and misleading code.
**Fix:** add `middleware.ts` exporting the NextAuth middleware with a `matcher` for `/admin/:path*` and `/api/(appointments|services|blocklist|admin)/:path*`, so unauthenticated requests are rejected before hitting route code.

### M-4 - No CSP / Permissions-Policy (frontend hardening)
`next.config.js` sets HSTS, `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, and `Referrer-Policy` (good - clickjacking is covered), but there is **no Content-Security-Policy and no Permissions-Policy**. There's a `dangerouslySetInnerHTML` sink in `components/seo/JsonLd.tsx` and a Turnstile third-party script; a CSP is the standard backstop that limits the blast radius of any future injection.
**Fix:** add a strict CSP + `Permissions-Policy` (see §7–§8).

### M-5 - JSON-LD serializer doesn't escape `<` (latent XSS sink)
`lib/seo/schema.ts` → `jsonLd()` is `return JSON.stringify(data)`, injected via `dangerouslySetInnerHTML` in `JsonLd.tsx`. **Today this is low-risk** because every input is static, developer-controlled data, and the dynamic `[ville]` route is allowlisted via `generateStaticParams()` + `getCityBySlug()` + `notFound()` (raw URL input never reaches the schema). But it's a sink one refactor away from a `</script>` breakout.
**Fix:** escape `<`, `>`, `&`, and U+2028/U+2029 in `jsonLd()`.

### M-6 - No audit logging / monitoring of sensitive actions
Admin mutations (status changes, block/unblock, service CRUD, deletes) and auth events are only `console.error`'d on failure. There's no audit trail of **who did what when**, no alerting on auth failures or 4xx/5xx spikes, and no uptime/error monitoring.
**Fix:** structured logging (pino) for admin actions + auth events; ship to a log sink; add error monitoring (Sentry) and uptime checks.

### M-7 - Availability endpoint is public and unthrottled (quota/abuse)
`GET /api/availability` is unauthenticated and not rate-limited; each call triggers a Google Calendar `freebusy` query. Scripted hammering can exhaust Google API quota (DoS of the booking flow) and run up cost.
**Fix:** light rate limit + short-TTL cache of busy blocks per day.

### M-8 - File-store race conditions & unguarded read
`lib/services-store.ts` uses non-atomic `readFileSync`/`writeFileSync`; concurrent writes can interleave and corrupt the JSON (integrity/availability). `readServices()` has **no try/catch** (a missing/corrupt file throws → 500), unlike `blocklist.ts` which degrades gracefully.
**Fix:** wrap reads defensively; serialize writes (atomic write to temp + rename, or a mutex), or move to SQLite/a managed DB if data grows.

### M-9 - Supply-chain & dependency hygiene
`next-auth@5.0.0-beta.31` is a **pre-release** auth library (acceptable but pin exactly and watch advisories). `package-lock.json` is being deleted during installs (per our earlier fix) - for reproducible, auditable builds the lockfile should be **committed**. No `npm audit` / Dependabot / CI gate is evident.
**Fix:** commit the lockfile, run `npm audit` in CI, enable Dependabot, pin the auth lib.

---

## 5. Recommended npm Packages

| Need | Package | Why |
|------|---------|-----|
| Distributed rate limiting | `@upstash/ratelimit` + `@upstash/redis` | Shared, persistent limits (replaces in-memory `Map`); free tier fits a salon |
| Security headers / CSP w/ nonce | `@next-safe/middleware` *or* hand-rolled in `next.config.js`/middleware | Robust CSP incl. nonce for the Turnstile script |
| Structured logging | `pino` | Fast JSON logs for audit trail + shipping |
| Error monitoring | `@sentry/nextjs` | Captures server/client errors, alerting |
| HTML escaping (emails/JSON-LD) | `escape-html` (or a 5-line helper) | Fix H-4 / M-5 without a heavy dep |
| Env validation at boot | `@t3-oss/env-nextjs` + `zod` | Fail fast if `AUTH_SECRET`/`ADMIN_EMAIL`/`TURNSTILE_SECRET_KEY` missing (prevents H-2 fail-open) |
| Dependency/secret scanning (CI) | `npm audit`, `osv-scanner`, `gitleaks` | Supply-chain + committed-secret detection |

Keep the footprint small - you don't need a WAF library; Cloudflare provides that at the edge (see §10).

---

## 6. Recommended Next.js Configuration

`next.config.js` - current headers are good; add CSP, `Permissions-Policy`, and tighten HSTS. Replace the `headers()` block with the version in §7. Additional config:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['googleapis'],
  poweredByHeader: false,            // remove X-Powered-By: Next.js (fingerprinting)
  reactStrictMode: true,
  images: { /* unchanged */ },
  async headers() { /* see §7 */ },
}
module.exports = nextConfig
```

Also:
- Add `middleware.ts` (M-3) with a `matcher` covering `/admin/:path*` and the mutating API routes.
- Add boot-time env validation so a missing `AUTH_SECRET` / `ADMIN_EMAIL` / `TURNSTILE_SECRET_KEY` **fails the build/start** instead of silently disabling protections.
- Keep `data/*.json` **outside** the web root and confirm it's not served statically (it isn't today - it's read via `fs`, not `public/`).

---

## 7. Security Headers Configuration

Drop-in `headers()` for `next.config.js` (or set in `middleware.ts` if you adopt a per-request CSP nonce):

```js
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' }, // add ;preload only after you submit to hstspreload.org and ALL subdomains are HTTPS
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },                 // site is not embedded anywhere → DENY > SAMEORIGIN
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Content-Security-Policy', value: CSP }, // see §8
]

async headers() {
  return [
    { source: '/images/:all*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    { source: '/:path*', headers: securityHeaders },
  ]
}
```

Notes: switched `X-Frame-Options` to `DENY` (nothing embeds this site); HSTS `preload` removed until you've verified subdomains and submitted to the preload list (preload is hard to undo).

---

## 8. CSP Configuration

The app loads Google Fonts (`next/font` self-hosts at build → no external font origin needed), Next/Image, and **Cloudflare Turnstile**. A workable starting policy (report-only first!):

```
default-src 'self';
script-src 'self' https://challenges.cloudflare.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self';
frame-src https://challenges.cloudflare.com;
connect-src 'self' https://challenges.cloudflare.com;
form-action 'self';
frame-ancestors 'none';
base-uri 'self';
object-src 'none';
upgrade-insecure-requests
```

Rollout:
1. Ship as **`Content-Security-Policy-Report-Only`** first; watch violations for a week.
2. `style-src 'unsafe-inline'` is needed because the app uses inline `style={{...}}` (e.g. `MobileBookingBar`, email-like inline styles) and Tailwind's injected styles. To remove it later, migrate inline styles to classes and adopt a **nonce-based** `script-src` via `middleware.ts` (the JSON-LD `<script>` and Turnstile would carry the nonce).
3. Once clean, switch the header name to enforcing `Content-Security-Policy`.

---

## 9. Rate Limiting Implementation

Two fixes: (a) apply limiting to **contact** + **availability**, (b) stop trusting raw `X-Forwarded-For`. Minimal hardening of the existing in-memory limiter, plus the recommended distributed version.

**a) Trust the right IP (behind Cloudflare):**
```ts
// lib/rate-limit.ts - getClientIp()
export function getClientIp(req: Request): string {
  // Cloudflare sets this and overwrites client-supplied values → trustworthy
  const cf = req.headers.get('cf-connecting-ip')
  if (cf) return cf.trim()
  // Only trust XFF if NOT directly internet-facing; otherwise it's spoofable
  const xff = req.headers.get('x-forwarded-for')
  return (xff?.split(',')[0]?.trim()) || 'unknown'
}
```

**b) Apply to the contact route (fixes H-1):**
```ts
// app/api/contact/route.ts
import { isRateLimited, getClientIp } from '@/lib/rate-limit'
// ...inside POST, before sending:
const ip = getClientIp(request)
if (isRateLimited(ip, 5, 60 * 60 * 1000)) {       // 5 / hour
  return NextResponse.json({ error: 'Trop de messages. Réessayez plus tard.' }, { status: 429 })
}
// + verify a Turnstile token here too (reuse verifyTurnstile, failing CLOSED)
```
(Parameterize `isRateLimited(ip, max, windowMs)` so booking stays 3/24h and contact is 5/h.)

**c) Production-grade distributed limiter (recommended):**
```ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const booking = new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.fixedWindow(3, '24 h'), prefix: 'rl:booking' })
const contact = new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(5, '1 h'), prefix: 'rl:contact' })

const { success } = await booking.limit(getClientIp(request))
if (!success) return NextResponse.json({ error: '...' }, { status: 429 })
```
Also enable Cloudflare's edge rate limiting as a first line (see §10) so abusive traffic never reaches Node.

---

## 10. Deployment Hardening Checklist

**Cloudflare (put it in front of Hostinger - strongly recommended):**
- [ ] Proxy the domain through Cloudflare (orange cloud); set SSL/TLS mode to **Full (strict)**.
- [ ] **Always Use HTTPS** + **Min TLS 1.2** (1.3 preferred); enable HSTS at the edge to match the app header.
- [ ] **WAF** managed rules ON; **Bot Fight Mode** ON; a **Rate Limiting rule** on `/api/appointments`, `/api/contact`, `/admin/login`.
- [ ] Enable **DNSSEC**; lock the registrar; CAA record pinning your CA (e.g. Let's Encrypt).
- [ ] Read `CF-Connecting-IP` server-side (H-3) and, if possible, allow only Cloudflare IP ranges to reach the origin.

**TLS / DNS:**
- [ ] Valid cert, auto-renew, no mixed content; redirect `http`→`https` and `www`↔apex consistently.
- [ ] Email deliverability + anti-spoofing: **SPF**, **DKIM**, **DMARC** for the sending domain (also protects against the H-4 phishing angle).

**Hostinger / app:**
- [ ] Node **20+** runtime; deploy the app as a managed Node app (not static).
- [ ] Set all secrets in the host's env panel (never in the repo): `AUTH_SECRET`, `ADMIN_EMAIL`, `GOOGLE_CLIENT_ID/SECRET`, `GOOGLE_SERVICE_ACCOUNT_KEY`, `GOOGLE_CALENDAR_ID`, `SMTP_*`, `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, (CallMeBot - see H-5).
- [ ] **Boot-time env validation** so missing secrets fail fast (prevents H-2 fail-open).
- [ ] Confirm `data/*.json` is writable, backed up, and not in `public/` (it isn't).
- [ ] `poweredByHeader: false`; remove server version banners.
- [ ] **Verify `.env.local` was never committed**: `git log --all --full-history -- .env.local` and `git ls-files | grep -i env` should be empty. If it ever was, **rotate every secret**.
- [ ] Restrict the Google **service account** to only the booking calendar; rotate keys; least-privilege scope (already `calendar` - consider `calendar.events`).
- [ ] Rotate `AUTH_SECRET` and OAuth client secret before go-live; set the OAuth **authorized redirect URI** to the production domain only.
- [ ] CI: `npm ci` (committed lockfile), `npm audit --omit=dev`, `gitleaks`, typecheck/lint gate.

---

## 11. OWASP Top 10 (2021) Mapping

| OWASP | Status | Evidence / Findings |
|-------|--------|---------------------|
| **A01 Broken Access Control** | ⚠️ Partial | Admin pages gated (`(protected)/layout.tsx`) ✅; API routes check authn not authz (M-2); `authorized` callback dead / no middleware (M-3); appointment disclosure by phone (M-1) |
| **A02 Cryptographic Failures** | ✅ Mostly OK | Secrets in env + git-ignored; HSTS set; JWT sessions. Risks: secret/PII in CallMeBot URL (H-5); ensure `AUTH_SECRET` strong & rotated |
| **A03 Injection** | ✅ Low | No SQL/NoSQL DB; Zod on all inputs (`lib/validations.ts`). HTML injection into emails (H-4); JSON-LD sink latent (M-5). No `eval`/`child_process` |
| **A04 Insecure Design** | ⚠️ Partial | CAPTCHA fails open (H-2); contact unthrottled (H-1); IP spoofable (H-3); single-admin model is reasonable for scope |
| **A05 Security Misconfiguration** | ⚠️ Partial | No CSP/Permissions-Policy (M-4); `X-Powered-By` present; HSTS `preload` aggressive; good baseline headers otherwise |
| **A06 Vulnerable/Outdated Components** | ⚠️ Watch | `next-auth@5 beta`; lockfile not committed; no `npm audit`/Dependabot (M-9) |
| **A07 Identification & Auth Failures** | ✅ Good | Google OAuth + strict email allowlist; fail-closed; JWT. Add `middleware.ts` + per-route `requireAdmin` (M-2/M-3); brute-force N/A (no password) |
| **A08 Software & Data Integrity** | ⚠️ Partial | No SRI/CSP on third-party Turnstile script (M-4); commit lockfile; verify build pipeline integrity |
| **A09 Logging & Monitoring Failures** | ❌ Gap | Only `console.error`; no audit trail, alerting, or error monitoring (M-6) |
| **A10 SSRF** | ✅ Low | Outbound calls are to fixed, trusted hosts (Google, Cloudflare, CallMeBot, SMTP). No user-controlled URL fetch |

---

## 12. Prioritized Action Plan

**P0 - before public launch (this week)**
1. Throttle + CAPTCHA the **contact form** (H-1) - §9.
2. Make Turnstile **fail closed** + require token in prod + boot-time env validation (H-2).
3. Read **`CF-Connecting-IP`** behind Cloudflare; stop trusting raw XFF (H-3).
4. **Escape HTML** in `lib/mail.ts` (H-4).
5. Decide CallMeBot: remove PII / replace with DPA-backed provider, move secret out of URL (H-5).
6. Verify `.env.local` was never committed; rotate secrets if it was (§10).

**P1 - within ~2 weeks**
7. Add **CSP (report-only → enforce)** + `Permissions-Policy`, `poweredByHeader:false`, `X-Frame-Options: DENY` (M-4) - §7–§8.
8. Add `middleware.ts` + `requireAdmin()` checking the admin email/`isAdmin` on every protected route (M-2, M-3).
9. Stop leaking appointment details to unauthenticated callers (M-1).
10. Commit the lockfile; add `npm audit` + Dependabot + `gitleaks` to CI (M-9).
11. Put **Cloudflare** in front: WAF, Bot Fight, edge rate limits, DNSSEC, Full(strict) TLS (§10).
12. Add **SPF/DKIM/DMARC** for the mail domain.

**P2 - hardening / hygiene**
13. Structured audit logging (pino) + Sentry + uptime checks (M-6).
14. Escape `<` in `jsonLd()` (M-5).
15. Throttle/cache `/api/availability` (M-7).
16. Make JSON writes atomic + guard reads, or migrate to SQLite (M-8).
17. Move the limiter to Upstash Redis if you ever run >1 instance (§9c).

---

*Severities reflect a small-business booking site with no payment processing and a single admin. Re-review after the P0/P1 changes and after any move to a real database or multi-admin model.*
