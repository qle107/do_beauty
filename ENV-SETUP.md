# How to get the leftover `.env` values (VyNails93)

Work top to bottom. **Required** = the app won't work without it. **Optional** = safe to leave blank for now.

Quick status of your current `.env.local`:

| Already real ✅ | Placeholder - must replace ❌ | Missing - must add ➕ |
|---|---|---|
| `GOOGLE_SERVICE_ACCOUNT_KEY`, business `NEXT_PUBLIC_*`, `SMTP_HOST/PORT/SECURE` | `NEXTAUTH_SECRET`, `AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SMTP_PASS`, `CALLMEBOT_PHONE`, `CALLMEBOT_APIKEY` | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` |

---

## A. `NEXTAUTH_SECRET` + `AUTH_SECRET` - required (1 min)

These sign your login sessions. Generate a random value:

```bat
:: If you have Git Bash / OpenSSL:
openssl rand -base64 32

:: Or with Node (works anywhere Node is installed):
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Run it and copy the output. Set **both** variables - they can share the same value:

```
NEXTAUTH_SECRET=<paste generated value>
AUTH_SECRET=<same value>
```

> `AUTH_SECRET` is one of the 3 vars that the app checks at boot - if it's empty, the server won't start.

---

## B. Turnstile keys - required (2 min)

`TURNSTILE_SECRET_KEY` is also checked at boot; without it the app crashes.

1. <https://dash.cloudflare.com> → **Turnstile** → **Add widget**.
2. Name: `vynails`. Hostname: `vynails.fr` (add `www.vynails.fr` too). Widget mode: **Managed**.
3. Create. Copy the two values:
   - **Site Key** → `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   - **Secret Key** → `TURNSTILE_SECRET_KEY`

---

## C. Google OAuth (admin login) - required (~10 min)

This is what powers the "Sign in with Google" on `/admin/login`. Currently `GOOGLE_CLIENT_ID`/`SECRET` are dummy text.

1. <https://console.cloud.google.com> → top bar → select the **same project** your service account lives in (`vynail`).
2. **APIs & Services → OAuth consent screen** (newer UI: *Google Auth Platform → Branding*):
   - User type **External** → fill App name, your support email, developer email → Save.
   - If the app stays in **Testing**, open **Audience → Test users** and add the exact Gmail you'll log in with.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - Application type: **Web application**.
   - Name: `vynails-web`.
   - **Authorized redirect URIs → Add URI:**
     `https://vynails.fr/api/auth/callback/google`
     (add `http://localhost:3000/api/auth/callback/google` too if you still develop locally).
   - Create → a dialog shows **Client ID** and **Client secret** → copy them:
     ```
     GOOGLE_CLIENT_ID=<client id>.apps.googleusercontent.com
     GOOGLE_CLIENT_SECRET=<client secret>
     ```
4. **`ADMIN_EMAIL`** must be the **exact** Google account you sign in with above (only that email gets admin access). Confirm `admin@vynails93.fr` is a real Google/Workspace account you can log into - if not, set `ADMIN_EMAIL` to the Gmail you'll actually use.

> Redirect URIs must be HTTPS (localhost is the only HTTP exception). A mismatch gives a `redirect_uri_mismatch` error at login.

---

## D. SMTP password (booking emails) - recommended (~5 min)

First, **where is `contact@vynails93.fr` actually hosted?**

**If it's a Gmail / Google Workspace mailbox** (your current `SMTP_HOST=smtp.gmail.com` assumes this):
1. Turn on **2-Step Verification**: <https://myaccount.google.com/security> → "How you sign in to Google" → 2-Step Verification → enable.
2. Create an app password: <https://myaccount.google.com/apppasswords> → "Select app" → **Other (Custom name)** → type `vynails` → **Generate**.
3. Copy the **16-character** password, remove the spaces, and set:
   ```
   SMTP_PASS=<16-char app password>
   ```
   Keep `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_SECURE=false`.

   (Google killed normal-password SMTP in May 2025 - an app password or OAuth is now mandatory. Workspace admins must allow 2-Step Verification for the account.)

**If `vynails93.fr` email is hosted at Hostinger (or elsewhere)** - don't use Gmail's server. Use that provider's SMTP instead, e.g. Hostinger:
```
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=contact@vynails93.fr
SMTP_PASS=<that mailbox's password>
```
Check the exact host/port in hPanel → Emails → the mailbox's "Connect devices / configuration".

Also confirm `SMTP_USER`, `SMTP_FROM`, `MAIL_FROM` use the real sending address.

---

## E. CallMeBot WhatsApp ping - optional (2 min)

This sends you a WhatsApp message on each booking. **It's optional** - leave both blank and you'll still get the email. ⚠️ Your `SECURITY-REVIEW.md` (H-5) flags a GDPR concern because client name/phone are sent to CallMeBot with the key in the URL, so consider skipping it for a real salon.

If you still want it:
1. In WhatsApp, add the contact **+34 684 72 39 62** (this number changed - your old `.env` comment lists a dead one).
2. Send it: `I allow callmebot to send me messages`.
3. You'll receive `API Activated… Your APIKEY is XXXXXX`. (No reply in 2 min? Wait 24h and retry, or send `Recover APIKey`.)
4. Set:
   ```
   CALLMEBOT_PHONE=<your number, no +, e.g. 33612345678>
   CALLMEBOT_APIKEY=<the apikey from the message>
   ```

---

## F. Production URLs - required

```
NEXTAUTH_URL=https://vynails.fr
AUTH_URL=https://vynails.fr
```

---

## G. Confirm the Calendar link still works

`GOOGLE_CALENDAR_ID` is the calendar bookings are written to. Open Google Calendar → that calendar's **Settings → Share with specific people** and confirm your service account
`dangthilua@vynail.iam.gserviceaccount.com` is listed with **"Make changes to events"**. If not, add it.

---

## Final paste order (into Hostinger → Environment Variables)

Required to boot & function: `NEXTAUTH_URL`, `AUTH_URL`, `NEXTAUTH_SECRET`, `AUTH_SECRET`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `ADMIN_EMAIL`, `GOOGLE_CALENDAR_ID`, `GOOGLE_SERVICE_ACCOUNT_KEY`.

Recommended: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `MAIL_FROM`, and the `NEXT_PUBLIC_BUSINESS_*` set.

Optional: `CALLMEBOT_PHONE`, `CALLMEBOT_APIKEY`.
