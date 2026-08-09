# Branded email setup - `contact@vynails.fr`

Goal: a real mailbox `contact@vynails.fr` that **sends** your booking/contact notifications (and can receive). Your DNS now lives at **Cloudflare**, so you add the mail records there by hand.

> Why this is needed: `vynails93.fr` doesn't exist (NXDOMAIN), and `vynails.fr` currently has **no MX record**, so no mailbox works yet. We're standing one up on your real domain.

The app code already reads SMTP from env (`lib/mail.ts`), and I've set `.env.local` to:
```
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=contact@vynails.fr
SMTP_PASS=            ← paste the mailbox password (step 2)
SMTP_FROM=VyNails93 <contact@vynails.fr>
MAIL_FROM=VyNails93 <contact@vynails.fr>
```

---

## Step 1 - Create the mailbox in hPanel

1. hPanel → **Emails** → select **vynails.fr** (if email isn't set up for it yet, choose **Hostinger Email** / the free plan included with your hosting and start setup).
2. **Create email account** → `contact` @ `vynails.fr` → set a strong password. **Save that password** - it's your `SMTP_PASS`.

## Step 2 - Put the password in your config

Paste it into `SMTP_PASS=` in `.env.local`, and later into the **same variable in Hostinger's Environment Variables** panel.

## Step 3 - Get the exact DNS records from hPanel

Because your DNS is external (Cloudflare), Hostinger shows you the records to add:

- hPanel → **Emails** → **Manage** next to vynails.fr → **Domain settings / Connect domain**.
- You'll see **MX**, **SPF**, and **DKIM** records. Copy them exactly - **DKIM especially is account-specific**, so use the values Hostinger shows, not generic ones.

For reference, Hostinger Email typically uses:

| Type | Name/Host | Value | Priority |
|------|-----------|-------|----------|
| MX | `@` (vynails.fr) | `mx1.hostinger.com` | 5 |
| MX | `@` | `mx2.hostinger.com` | 10 |
| TXT (SPF) | `@` | `v=spf1 include:_spf.mail.hostinger.com ~all` | - |
| CNAME (DKIM) | `hostingermail-a._domainkey` (exact name from hPanel) | `hostingermail-a.dkim.mail.hostinger.com` | - |

(There may be 2–3 DKIM CNAMEs - add each one hPanel lists.)

## Step 4 - Add the records in Cloudflare

Cloudflare → your domain → **DNS → Records → Add record**, for each record above:

1. **MX** ×2: Type MX, Name `@`, Mail server `mx1.hostinger.com` (priority 5) and `mx2.hostinger.com` (priority 10).
2. **SPF**: Type TXT, Name `@`, Content = the SPF string. (Only **one** SPF/TXT-spf record total - if one exists, merge, don't add a second.)
3. **DKIM** ×(however many): Type CNAME, Name = the selector from hPanel, Target = the value from hPanel. **Set Proxy status to "DNS only" (grey cloud)** - this is required; a proxied DKIM/MX breaks mail.
4. **DMARC** (recommended): Type TXT, Name `_dmarc`, Content `v=DMARC1; p=none; rua=mailto:contact@vynails.fr` (start with `p=none`, tighten to `quarantine` later).

Notes:
- MX and TXT records are never proxied (no orange cloud) - that's normal.
- **Don't enable Cloudflare Email Routing** - it would add its own MX and conflict with Hostinger.
- vynails.fr has no existing MX, so there's nothing to delete first.

## Step 5 - Wait, then verify

- DNS propagation: usually 15 min, up to 24 h.
- In hPanel's email/domain page the records flip to **verified/green** when detected.
- Test: trigger a booking on the site (or use webmail at hPanel → Emails → open `contact@vynails.fr`) and confirm the notification email arrives in your `ADMIN_EMAIL` inbox and isn't flagged as spam.
- Optional deliverability check: send to <https://www.mail-tester.com> and aim for 10/10 (confirms SPF + DKIM + DMARC pass).

---

## What I changed in the project for this

Switched every reference off the dead `vynails93.fr` domain to `vynails.fr`:

- `lib/site.ts` - business `email`
- `lib/mail.ts` - notification email footer
- `lib/seo/faqs.ts` - **public FAQ** (was telling customers to email a dead address)
- `app/admin/(protected)/messages/page.tsx` - admin info text
- `.env.local` + `.env.example` - SMTP block → Hostinger + `contact@vynails.fr`

No other code needed changing: `lib/mail.ts` reads SMTP from env, and `lib/site.ts` already defaults the site URL to `https://vynails.fr` (so SEO/canonical URLs are correct). The brand name "VyNails93" is intentional and left as-is.

> Heads-up (unrelated): `lib/site.ts` `social.instagram` is still the placeholder `https://instagram.com` - set it to your real profile when you have it.
