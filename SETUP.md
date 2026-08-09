# Cure Boutique - Setup Guide

## ⚠️ One-Time Cleanup
Delete the `app/(admin)/` folder - it was superseded by the correct `app/admin/(protected)/` structure. The `app/(admin)/` pages would create orphaned routes at `/dashboard`, `/appointments`, etc. You can safely delete that folder.

---

## Prerequisites
- Node.js 18+
- PostgreSQL database (Supabase free tier recommended)
- Gmail account with App Password (for email)

---

## 1. Install Dependencies

```bash
cd cure-boutique
npm install
```

---

## 2. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random 32-byte string (`openssl rand -base64 32`) |
| `AUTH_SECRET` | Same or different random string |
| `SMTP_HOST` | SMTP server (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | Usually `587` |
| `SMTP_USER` | Your email address |
| `SMTP_PASS` | Gmail App Password (not your regular password) |
| `SMTP_FROM` | Formatted sender name |
| `ADMIN_EMAIL` | Where booking/contact alerts go |

### Gmail App Password setup:
1. Enable 2FA on your Google account
2. Go to Google Account → Security → App Passwords
3. Create an app password for "Mail"
4. Use that 16-character password as `SMTP_PASS`

---

## 3. Set Up the Database

```bash
# Push the schema to your database
npm run db:push

# Seed with sample data + admin user
npx prisma db seed
```

**Default admin credentials:**
- Email: `admin@curenails.co`
- Password: `admin123!`
- ⚠️ Change these in production!

---

## 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 5. Project URLs

| URL | Description |
|---|---|
| `/` | Homepage |
| `/menus` | Services & pricing |
| `/booking` | Book an appointment |
| `/about` | About & careers |
| `/contact` | Contact form |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Admin overview |
| `/admin/appointments` | Manage bookings |
| `/admin/services` | Manage services |
| `/admin/messages` | View contact submissions |

---

## 6. Deploy to Vercel

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add all env variables in Vercel dashboard
4. Set `DATABASE_URL` to your production Supabase URL
5. Deploy!

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** NextAuth.js v5
- **Animations:** GSAP + Framer Motion
- **UI:** Radix UI primitives + Tailwind CSS
- **Forms:** React Hook Form + Zod
- **Email:** Nodemailer
