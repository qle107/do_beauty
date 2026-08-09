# Do Beauty — Booking & Availability

How online booking works, and how the website stays consistent with Planity.

**Two data sources, one direction each:**
- **Planity availability (read)** — the website reads Planity's **public** availability
  (the same data customers see on planity.com), so it never offers a slot Planity has
  already booked. Tokenless, live, read-only.
- **Website bookings (write)** — bookings taken on the Do Beauty site are written to
  **Google Calendar A** (the owner's agenda) and the staff are notified to enter them in
  Planity. There is no automatic write into Planity (Planity has no public write API).

There is **no** Planity iCal feed, no Google "Calendar B", and no sync job — those were the
old architecture and have been removed.

---

## 1. Architecture

```
  Planity (salon's real book)
        │  publishes public availability (Firebase RTDB, anonymous)
        ▼
  lib/planity/public-availability.ts  ──► getPlanityDayFree(date)
        │   free practitioners per 15-min slot        │
        │                                             ▼
  Website booking ──► POST /api/appointments ──► Google Calendar A (owner agenda)
        │                                             │  getDayABusy(date)
        ▼                                             ▼
  GET /api/availability  ◄── capacity = (Planity free staff) − (Calendar-A bookings)
        │
        ▼  bookable slots + which practitioners are free (optional picker)
```

A slot is offered while **at least one practitioner is free** for the whole service window
(per Planity) **and** that free count still exceeds the website bookings already overlapping it.

---

## 2. Files

| File | Role |
|---|---|
| `lib/planity/public-availability.ts` | **The Planity read.** Fetches the public Firebase availability DB, gunzips the records, and exposes `getPlanityDayFree(date)` → free practitioners per 15-min slot (or `null` = no data → fail open). Cached in-process (180 s). |
| `lib/staff.ts` | `ARTISTS` (6 practitioners + 3 cabines) ↔ Planity agenda ids, each scoped to the service **categories** they perform; `artistsForCategories(cart)` returns the pool that can serve a cart. |
| `lib/booking/capacity.ts` | Pure capacity math: `freeStaffForWindow(dayFree, s, e)` and `freeCount(freeStaff, aBusy, s, e)`. |
| `lib/google-calendar.ts` | Google Calendar A I/O: `createCalendarEvent` (write a booking) and `getDayABusy(date)` (read the day's website bookings as busy intervals). Service-account auth. |
| `app/api/availability/route.ts` | `GET` — builds bookable slots + `staffBySlot` from Planity free staff − Calendar-A bookings. |
| `app/api/appointments/route.ts` | `POST` — creates a booking on Calendar A, server-side capacity re-check, staff notification; `GET` (admin) lists bookings. |
| `lib/planity/booking.ts` | Isolated write **seam** — returns `unsupported` today (Planity has no write API); ready for an official API without touching the UI. |
| `components/booking/*` | The booking wizard (services → date → time → optional practitioner → details → confirmation). |

---

## 3. Google Cloud setup (once) — service account, Calendar A only

The app authenticates to Google Calendar with **one service-account key**
(`GOOGLE_SERVICE_ACCOUNT_KEY`). No OAuth, no refresh token, no second calendar.

1. **Project + API**: at <https://console.cloud.google.com>, create/pick a project and enable
   the **Google Calendar API**.
2. **Service account + JSON key**: IAM & Admin → Service Accounts → create one (no roles) →
   Keys → *Add key* → **JSON**. The whole file becomes `GOOGLE_SERVICE_ACCOUNT_KEY` (one line).
3. **Calendar A**: in Google Calendar (as the salon's Google account) create **"Do Beauty -
   Agenda"**. Share it with the service-account email (`…iam.gserviceaccount.com`) with **"Make
   changes to events"**. Copy its **Calendar ID** → `GOOGLE_CALENDAR_ID`.

(For Do Beauty this is already set up — the project, service account, key and
Calendar A exist; the values live in the deployment's environment variables.)

## 4. Planity setup — none

Nothing to configure in Planity. The website reads the **public** availability that Planity
already publishes for the consumer booking page. You only need the salon's Planity **businessId**
(`PLANITY_BUSINESS_ID`), which is stable. Bookings taken on the site are entered into Planity by
the staff (they receive an email + WhatsApp alert); once entered, they appear in Planity's public
availability and the website stops offering that slot automatically.

---

## 5. Environment variables (all server-side)

| Variable | Required? | Notes |
|---|---|---|
| `GOOGLE_SERVICE_ACCOUNT_KEY` | **yes** | Service-account JSON (one line); Calendar A is shared with its email |
| `GOOGLE_CALENDAR_ID` | **yes** | Calendar A id — website bookings are written here |
| `PLANITY_BUSINESS_ID` | **yes** | salon's Planity businessId — powers the public availability read |
| `PLANITY_AVAIL_DB_HOST` | no | override the public Firebase availability host (a sensible default is built in) |
| `SMTP_HOST/PORT/SECURE/USER/PASS/FROM` | no | booking-alert email to staff |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | no | anti-spam on the booking form |
| `PLANITY_WRITE_ENABLED`, `PLANITY_API_TOKEN`, `PLANITY_API_URL` | no | **future only** — off by default; enable `lib/planity/booking.ts` if Planity ever grants an official write API |

Only `NEXT_PUBLIC_TURNSTILE_SITE_KEY` reaches the browser. There are **no** Planity secrets
(the availability read is public/tokenless) and **no** Calendar-B / iCal / sync variables.

---

## 6. How availability is computed

`GET /api/availability?date=YYYY-MM-DD&duration=<min>`:

1. Candidate start times from `site.hours` (**10:00–19:30**, 30-min step), Europe/Paris.
2. `getPlanityDayFree(date)` → for each 15-min instant, the set of practitioners Planity lists
   as free. `getDayABusy(date)` → the day's website bookings on Calendar A.
3. For each candidate slot `[t, t+duration)`:
   - `freeStaff` = practitioners free at **every** 15-min instant in the window (conservative —
     never offers a slot a practitioner can't fully honour).
   - `freeCount = freeStaff.length − (Calendar-A bookings overlapping the window)`.
   - Offer the slot while `freeCount > 0` **and** `t + duration ≤ closing`.
4. Today only: drop slots starting within the next **15 min**.
5. Availability is **catalog-specific**. Each artist serves certain service categories
   (`lib/staff.ts`): the 6 practitioners do nail services; **Cils 1 / Cils 2** do only eyelash
   services (CILS); **Esthétique** only face/body/waxing (VISAGE / CORPS / EPILATION). The cart's
   categories pick the **pool** (`artistsForCategories`): a manicure cart is offered/counted
   against practitioners, a cils cart against the cils cabines, an esthetics cart against
   Esthétique. `staffBySlot` lists the free artists **from that pool**, powering the up-front
   **"Praticienne"** selector on the Date & Heure step (default *Sans préférence*); picking one
   filters the times to that artist's free slots. So a customer booking a manicure only sees
   employees; booking cils only sees the cils cabines. The choice rides along to the Google event
   + staff alert; staff finalise the assignment in Planity. See `lib/staff.ts` and
   `lib/booking/capacity.ts`.

**Fail-safe (important):** if Planity's public data can't be read (network error) **or** the date
is beyond Planity's published horizon (~30 days), `getPlanityDayFree` returns `null` and the engine
**fails open** — it treats all staff as free (still minus Calendar-A bookings) rather than hiding
availability. A Planity outage therefore never blocks all future bookings, and far-future dates are
not treated as unavailable just because Planity hasn't published them yet.

---

## 7. Double-booking prevention

- **Availability** offers a slot only while Planity shows free capacity for it, minus our own
  Calendar-A bookings.
- **Server-side re-check on submit** (`POST /api/appointments`): the client view can go stale, so
  before creating the event the server recomputes capacity (Planity free + Calendar A) and returns
  `409` if the salon is now full — or, when a specific practitioner was chosen, if she is no longer
  free. Fails open only if Planity data is unavailable.
- **Real service data**: price/duration are read from the catalog server-side, never trusted from
  the request body.
- **One active RDV per phone**: a second booking on the same phone returns `409` and the UI offers
  to replace the earlier one.
- Plus anti-spam: Turnstile, IP rate-limit, phone/IP blocklist, per-device block.

Residual window: a Planity appointment entered in the last few minutes may not yet be in the public
availability snapshot; the same-phone rule and the staff booking-alert cover it.

---

## 8. Local testing

```bash
npm run dev
#  → http://localhost:3000/booking

# Availability reflects Planity's real book:
curl "http://localhost:3000/api/availability?date=<near-future>&duration=60"
#   available/booked slots + staffBySlot (free practitioners per slot)

# Fail-open check — a far-future date returns full availability (not blocked):
curl "http://localhost:3000/api/availability?date=<+60 days>&duration=60"

npm run build   # build + type-check
```

---

## 9. Security & limitations

- ✅ No secrets in the browser (only the public Turnstile site key).
- ✅ Google Calendar calls are server-side (service account).
- ✅ Planity read is **public and tokenless** — no login, no scraping of the pro/private backend.
- ✅ Price/duration come from the server catalog, never the request.
- ✅ Fails open on Planity outage / beyond-horizon dates — never blocks all availability.
- ⚠️ The Planity availability read is a **public but undocumented** consumer data source. If Planity
  restructures it, the read may need updating; it degrades safely (fail-open) meanwhile.
- ⚠️ Bookings are not pushed into Planity automatically (no public write API); staff enter them,
  prompted by the email/WhatsApp alert. Until entered, the slot is held only on Calendar A.
