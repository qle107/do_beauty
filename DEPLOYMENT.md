# Deploying VyNails93 to Hostinger (Managed Node.js)

Step-by-step guide to publish this app (Next.js 16, App Router) on **Hostinger Node.js Web Apps Hosting** (Business or Cloud plan) via GitHub.

Repo: `https://github.com/qle107/vy-nails` · Local path: `E:\WebProject\VyNail\cure-boutique`

---

## ⚠️ Read first - two things that WILL break the deploy

1. **The app refuses to start in production without Turnstile keys.**
   `instrumentation.ts` throws on boot if `AUTH_SECRET`, `ADMIN_EMAIL`, **or `TURNSTILE_SECRET_KEY`** is missing. `TURNSTILE_SECRET_KEY` and `NEXT_PUBLIC_TURNSTILE_SITE_KEY` are **not** in your current `.env.local`. → Do **Part 1** before deploying.

2. **Persistence works, but depends on two settings — verify them.**
   Runtime data (blocklist, devices, contact inbox, consent log, services) uses **MySQL when configured**, otherwise **JSON files written to `~/vynails-data`** — *outside* the git-deployed app folder, so a redeploy no longer wipes them. Two caveats to check: (a) MySQL is the intended store but is currently **failing auth** ("Access denied") — fix `MYSQL_USER`/`MYSQL_PASSWORD` in hPanel so the DB (not the fragile JSON fallback) is the source of truth; (b) set **`DATA_DIR`** to an explicit absolute path rather than relying on the home-dir heuristic. Appointments are always safe (Google Calendar). → See **Part 2**.

You can still deploy and go live now - the public site and booking work. Just treat Part 2 as required before staff rely on the admin dashboard.

---

## Prerequisites

- A Hostinger **Business** or **Cloud** plan (Startup/Professional/Enterprise). Node.js apps are **not** available on the basic Premium/Single shared plan - upgrade if needed.
- The repo pushed to GitHub (done).
- A domain (you can use the free Hostinger domain or your own).
- A Google Cloud project (you already have OAuth + a service account).
- A Cloudflare account (free) for Turnstile - Part 1.

---

## Part 1 - Get Cloudflare Turnstile keys (required)

1. Go to <https://dash.cloudflare.com> → **Turnstile** → **Add site**.
2. Name it `vynails`, add your production hostname (e.g. `vynails93.fr` and `www.vynails93.fr`). Widget type: **Managed**.
3. Cloudflare gives you two values:
   - **Site Key** → this is `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   - **Secret Key** → this is `TURNSTILE_SECRET_KEY`
4. Keep them for Part 6. Without the secret key the app will not boot in production.

---

## Part 2 - Make persistence durable (MySQL creds + DATA_DIR)

The DB code already exists (`lib/db.ts` + the stores auto-create their tables and fall back to JSON). Two things to get right:

1. **Fix the MySQL credentials (highest-leverage action).** The `MYSQL_*` vars are set but auth is failing ("Access denied for user …"), so the app runs on the JSON fallback *and* pays a failed-connection round-trip on every booking/service request. In hPanel → **Databases → MySQL**, confirm the database, user, and password, then set them in **Environment Variables** (`MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_PORT`) — or a single `DATABASE_URL`. Once the DB connects, it becomes the source of truth and the JSON-fallback risks disappear.

2. **Set `DATA_DIR` explicitly.** When MySQL is unavailable the stores write JSON to `~/vynails-data` (outside the git folder, so redeploys don't wipe it). Rather than rely on the home-dir heuristic, set `DATA_DIR` to an absolute persistent path in hPanel so runtime data (blocklist, devices, contact inbox, consent log) is guaranteed to survive.

**Note:** `data/services.json` is committed as the read-only seed; the DB seeds itself from it on first boot. Admin edits to services persist in MySQL (or `DATA_DIR`) once the above is set.

---

## Part 3 - Verify the build locally (catches errors before Hostinger)

In `E:\WebProject\VyNail\cure-boutique`:

```bat
npm install
npm run build
```

If `npm run build` fails, fix it locally first - Hostinger runs the same command and the deploy will fail otherwise. (Next.js 16 needs Node **20+**; use 20, 22, or 24.)

---

## Part 4 - Create the Node.js app in hPanel

1. Log in to **hPanel** → **Websites** (left sidebar) → **Add Website**.
2. Choose **Node.js Apps**.
3. Select **Import Git Repository**.
4. Click **Authorize** on the GitHub redirect to grant Hostinger access.
5. Select the **`qle107/vy-nails`** repository (branch `master`).

> Note: one hosting plan connects to one GitHub account. If `vy-nails` is private, make sure the Hostinger GitHub App has access to it.

---

## Part 5 - Configure build settings

Hostinger auto-detects **Next.js**. Confirm/enter:

- **Framework:** Next.js (auto-detected)
- **Node version:** `22.x` (or 20.x / 24.x - anything 20+)
- **Install command:** `npm install`
- **Build command:** `npm run build`
- **Output directory:** `.next`
- **Start:** handled automatically for Next.js (`next start`) - no entry file needed.

If the panel shows **"Other"** instead of Next.js, set **Output directory** to `.next` manually and leave Entry file blank.

⚠️ **Do not click Deploy yet** - set the environment variables first (Part 6), otherwise the first boot crashes on the missing Turnstile secret.

---

## Part 6 - Set environment variables

In the Node.js app dashboard → **Environment Variables**, add every row below. **Never** upload `.env.local`; type the values into the panel. Use `.env.example` (in the repo) as your checklist.

| Variable | Production value / note |
|----------|--------------------------|
| `NEXTAUTH_URL` | `https://YOUR-DOMAIN` (e.g. `https://vynails93.fr`) - **not** localhost |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` (new value for prod) |
| `AUTH_SECRET` | same as `NEXTAUTH_SECRET` (**required at boot**) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Site Key from Part 1 |
| `TURNSTILE_SECRET_KEY` | Secret Key from Part 1 (**required at boot**) |
| `GOOGLE_CLIENT_ID` | from Google Cloud |
| `GOOGLE_CLIENT_SECRET` | from Google Cloud |
| `ADMIN_EMAIL` | the Gmail allowed to log in as admin (**required at boot**) |
| `GOOGLE_CALENDAR_ID` | booking calendar ID |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | the full service-account JSON **on one line** |
| `CALLMEBOT_PHONE` | WhatsApp number, no `+` |
| `CALLMEBOT_APIKEY` | CallMeBot key |
| `SMTP_HOST` | `smtp.gmail.com` (or your provider) |
| `SMTP_PORT` | `587` |
| `SMTP_SECURE` | `false` |
| `SMTP_USER` | mailbox user |
| `SMTP_PASS` | app password (16 chars for Gmail) |
| `SMTP_FROM` | `VyNails93 <no-reply@your-domain>` |
| `MAIL_FROM` | same as `SMTP_FROM` |
| `NEXT_PUBLIC_BUSINESS_NAME` | `VyNails93` |
| `NEXT_PUBLIC_BUSINESS_ADDRESS` | salon address |
| `NEXT_PUBLIC_BUSINESS_PHONE` | salon phone |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED` | maps URL |

(Plus the database variables from Part 2 once you migrate.)

You do **not** need to set `NODE_ENV` - Hostinger sets it to `production` automatically (which is what triggers the boot validation).

---

## Part 7 - Update Google Cloud for the production domain

Your OAuth login and Calendar were set up for localhost. Update them:

1. **OAuth redirect URI** - Google Cloud Console → **APIs & Services → Credentials** → your OAuth client → **Authorized redirect URIs**, add:
   `https://YOUR-DOMAIN/api/auth/callback/google`
   and under **Authorized JavaScript origins** add `https://YOUR-DOMAIN`.
2. **OAuth consent screen** - add your production domain to authorized domains; if the app is in "Testing", add `ADMIN_EMAIL` as a test user (or publish the app).
3. **Service account / Calendar** - confirm the service account email is still shared on the booking calendar with "Make changes to events". Best practice (from `SECURITY-REVIEW.md`): rotate the service-account key and the OAuth secret before go-live.

---

## Part 8 - Connect your domain + SSL

1. In the Node.js app dashboard, open the **Domains**/website settings and attach your domain.
   - If the domain is **already added** to your plan as a normal website, Hostinger requires you to **remove that website first** (download a backup), then attach the domain to the Node.js app.
2. If the domain is registered elsewhere, point its nameservers/DNS to Hostinger.
3. Enable the **free SSL** certificate (Hostinger auto-provisions Let's Encrypt). Wait until it shows active.
4. After the domain is live, make sure `NEXTAUTH_URL` and the Google redirect URI both use the **final** `https://` domain, then redeploy.

---

## Part 9 - Deploy & verify

1. Click **Deploy**. Watch the deployment log; a green/preview screenshot means the build + boot succeeded.
2. If it fails immediately on start with `[env] Missing required production environment variable(s)…` → a required var (Part 6) is missing/misspelled.
3. Smoke-test on the live domain:
   - [ ] Home page and images load over HTTPS.
   - [ ] Services display.
   - [ ] **Booking flow**: the Turnstile widget appears, a test booking submits, and the appointment shows up in Google Calendar.
   - [ ] You receive the admin notification email (and WhatsApp ping if used).
   - [ ] **Admin login** (`/admin/login`) works with `ADMIN_EMAIL`; a non-admin Google account is rejected.
   - [ ] Contact form sends.

---

## Part 10 - Day-2: redeploys & restart

- **Auto-deploy:** pushing to `master` on GitHub triggers a new build automatically.
- **Restart** (no rebuild): dashboard → click **Running → Restart** for the Next.js server.
- **Logs:** dashboard → Deployments → view log for build/runtime errors.
- **Vulnerabilities:** Security → Vulnerabilities scans your npm deps and can open auto-fix PRs.

> Remember: only the committed **seed** `data/*.json` is replaced on redeploy. Runtime data lives in MySQL or `DATA_DIR` (`~/vynails-data`) and survives — provided Part 2 is done. If MySQL is down *and* `DATA_DIR` isn't writable, writes silently fall back to the in-repo `data/` and would be lost on redeploy.

---

## Part 11 - Recommended hardening (from your SECURITY-REVIEW.md)

Not required to go live, but your own security review marks these **P0 before public launch**:

- Put **Cloudflare in front** of Hostinger (orange-cloud proxy, SSL Full(strict), WAF + Bot Fight Mode, edge rate-limit on `/api/appointments`, `/api/contact`, `/admin/login`). This also fixes the spoofable-IP rate-limit issue (read `CF-Connecting-IP`).
- Make Turnstile **fail closed** and throttle the **contact form** (currently no rate limit / CAPTCHA).
- HTML-escape user input in notification emails.
- Add **SPF / DKIM / DMARC** for the sending domain.

See `SECURITY-REVIEW.md` §10 and §12 for the full prioritized list.

---

### Quick status

- ✅ `.gitignore` protects secrets; `.env.local` was never committed.
- ✅ `.env.example` updated with the required Turnstile keys.
- ⬜ Part 1: create Turnstile keys.
- ⬜ Part 2: choose a database (tell me which → I'll migrate the code).
- ⬜ Parts 4–9: deploy.
