# Admin “Calendrier” — unified booking calendar (design)

- **Date:** 2026-08-09
- **Status:** Approved (Phase 1). Phases 2–3 are roadmap.
- **Author:** qdat107 + Claude

## 1. Context & goal

Do Beauty takes bookings in two places:

1. **The website** → written to **Google Calendar A** (`/api/appointments`), with full detail
   (client, services, time, optional chosen praticienne).
2. **Planity** (the salon’s real system) → the front desk books walk-ins/phone directly there.

The owner wants **one admin screen** that shows *both*, with all employees side by side, so
they can see the whole salon’s day at a glance. Longer term they also want to **manage/write**
bookings into Planity from the site.

**Key finding (see [[planity-integration-reality]]):** Planity exposes **no official API**
(confirmed again 2026-08-09 by walking the entire pro Admin menu — no API/Développeurs/
Intégrations section). The pro app authenticates with **Firebase Auth** (1-hour ID token +
long-lived refresh token) and streams appointments from a **Firebase Realtime Database** over
WebSocket. So real Planity read/write is only possible by reusing the pro session’s internal
endpoints — powerful but fragile, and write-back touches the **live** agenda.

Because of that risk, the work is **phased**:

| Phase | What | Risk |
|---|---|---|
| **1 (this spec)** | Calendar UI: website bookings in full detail + Planity **anonymous busy blocks** | none |
| 2 | Reverse-engineer pro-session **read** → real Planity appointments in the same view | low |
| 3 | Auto **write-back** website bookings into Planity, with guardrails | real, gated |

## 2. Phase 1 scope

### In scope
- New admin section **“Planning”** at `/admin/calendar`.
- **Day view**: columns = the 9 agendas (6 practitioners + 3 cabines from `lib/staff.ts`),
  rows = time 10:00–19:30 on a 15-min grid (from `site.hours`).
- **Website bookings** (Google Calendar A) rendered as full-detail cards, placed in the chosen
  praticienne’s column; “Sans préférence” bookings go in a dedicated left **“Web”** lane.
- **Planity** rendered as anonymous grey **“Indisponible”** blocks per employee, derived from the
  public availability feed.
- Date navigation: ‹ Prev · Aujourd’hui · Next ›.

### Out of scope (Phase 1 — YAGNI)
- Week/month view (Phase 1 is day only).
- Any Planity read of real client/service detail (Phase 2).
- Any write to Planity or editing of bookings from this screen (Phase 3).
- Drag-to-reschedule, click-to-create.

## 3. Architecture

**New files**
- `app/admin/(protected)/calendar/page.tsx` — server component: auth gate (reuses the layout’s
  admin-email check), resolves the initial Paris date, renders `<CalendarBoard>`.
- `components/admin/CalendarBoard.tsx` — client component: date state, fetches
  `/api/admin/calendar?date=…`, renders the grid.
- `app/api/admin/calendar/route.ts` — `GET`, **auth-gated** (same `auth()` guard as
  `/api/appointments` GET). Assembles the day’s payload. **This is the single seam** Phases 2–3
  extend.

**Changed files**
- `lib/planity/public-availability.ts` — add `getPlanityBusyByEmployee(date)` (pure inversion,
  below). No change to existing exports/caching.
- `components/admin/Sidebar.tsx` — add nav item `{ href: '/admin/calendar', label: 'Planning' }`
  with a distinct (columns) icon.

**Reused as-is**
- `lib/staff.ts` `ARTISTS` (the 9 columns, order + kind + name).
- `lib/google-calendar.ts` `listCalendarEvents` (website bookings; already used by
  `/admin/appointments`).
- `lib/services-store` for the service map (names), same as the appointments route.

## 4. Data contract — `GET /api/admin/calendar?date=YYYY-MM-DD`

Auth required (401 otherwise). Response:

```ts
{
  date: string                       // echoed "YYYY-MM-DD" (Europe/Paris)
  openMinutes: number                // 600  (10:00)
  closeMinutes: number               // 1170 (19:30)
  employees: { id: string; name: string; kind: 'staff' | 'cabine' }[]  // 9, in ARTISTS order
  website: {
    id: string
    employeeId: string | null        // matched from event.employeeName via staff.ts; null = "Web" lane
    clientName: string
    services: string                 // "Manucure + Vernis" (joined)
    startMin: number                 // minutes from midnight, Paris
    endMin: number
  }[]
  planityBusy: Record<string, { startMin: number; endMin: number }[]>  // key = employeeId
  planityKnown: boolean              // false ⇒ no authoritative Planity data for the day (fail-open)
}
```

- `website` comes from `listCalendarEvents({ timeMin: dayStart, timeMax: dayEnd, serviceMap })`,
  mapped to minutes. `employeeId` is resolved by matching the stored praticienne name against
  `ARTISTS` (exact name); unmatched or absent → `null` (“Web” lane).
  - **Implementation dependency:** the chosen praticienne is persisted on the event as
    `extendedProperties.private.employee` (google-calendar.ts:295) but is **not** currently returned
    by the `listCalendarEvents` mapper. The plan must surface it (e.g. `Appointment.employeeName`)
    so this resolution works; without it every website booking would fall to the “Web” lane.
- `planityBusy` from `getPlanityBusyByEmployee(date)`.
- `planityKnown = false` when `getPlanityDayFree(date)` returns `null` (fetch failed or beyond
  horizon). UI then shows a subtle “Planity indisponible” note instead of blocks — never fabricates.

## 5. Planity busy inversion (`getPlanityBusyByEmployee`)

```
input: date
free = await getPlanityDayFree(date)          // Map<"HH:MM", Set<calId>> | null
if free === null: return null                  // no authoritative data → caller sets planityKnown=false

grid = every 15-min tick in [openMinutes, closeMinutes)
for each employee E (calId c):
  busyTicks = [ t in grid : NOT (free.has(hhmm(t)) && free.get(hhmm(t)).has(c)) ]
  merge consecutive busyTicks (step 15) → intervals [{startMin,endMin}]
return { [E.id]: intervals }
```

**Honest limitation (documented in-code):** a tick is “busy” whenever the employee cannot *start*
a service then — this includes real appointments **and** off-shift/closed time. Phase 1 therefore
shows anonymous *unavailability*, not appointments. Phase 2 replaces this with real appointments.

## 6. UI / UX

- Grid: sticky header row (employee names) + sticky time gutter. Horizontal scroll on narrow
  screens (9 columns won’t fit a phone) — the board scrolls inside its own `overflow-x-auto`
  container; the admin page never scrolls sideways.
- **Website card** (brand coral, `bg-coral/‑dark`, cream text): `HH:MM–HH:MM`, client name,
  services. Positioned by `startMin`/`endMin` (absolute within the column).
- **Planity block** (grey `bg-black/10`, hatched): label “Indisponible”. No client info.
- **Web lane** (left-most, before the 9): unassigned website bookings so nothing is hidden.
- **Empty state**: “Aucun rendez-vous ce jour.” when both sources are empty.
- **Loading / error**: skeleton while fetching; a toast + inline retry on fetch error.
- Colors/fonts reuse the admin theme (blush/dark/coral, Manrope/Cormorant).

## 7. Error handling & edge cases

- Unauthenticated → 401 (route) → client redirects to `/admin/login` (layout already guards).
- Google Calendar down → `website: []` with a non-fatal warning banner; Planity blocks still show.
- Planity down / beyond horizon → `planityKnown:false`, no blocks, subtle note. Never blocks the page.
- Overlapping website bookings in one column (shouldn’t happen given capacity checks, but):
  render side-by-side within the column (split width) so none is hidden.
- Bookings that span outside 10:00–19:30 are clamped to the visible window.
- All time math in **Europe/Paris**, DST-safe (reuse existing `parisDayBounds` / Intl helpers).

## 8. Testing / verification

- **Unit**: `getPlanityBusyByEmployee` — (a) `null` in → `null` out; (b) a known free map inverts
  to the correct per-employee intervals incl. merge of consecutive ticks and boundary at close.
- **API**: `GET /api/admin/calendar` returns 401 unauthenticated; authenticated returns the
  contract shape; Planity-null day sets `planityKnown:false`.
- **Manual**: against the live day already verified (Aug-10: 13:00 full, 10:00 = Julie only) the
  board’s grey blocks should match Planity’s real agenda gaps; a website test booking appears in
  the chosen praticienne’s column.
- **Build**: `npm run build` exit 0 (per [[verify-before-push-workflow]]).

## 9. Roadmap — Phases 2 & 3 (not built now)

- **Phase 2 (read):** capture the pro **refresh token** once (stored in env, never git — the
  harness redacts tokens from browser output, so the owner helps capture via clipboard). Mint ID
  tokens via `securetoken.googleapis.com` (public Firebase key `AIzaSy…GRC5Q`), read appointments
  from the RTDB. `/api/admin/calendar` swaps `planityBusy` → real appointments; UI unchanged.
- **Phase 3 (write):** push website bookings into Planity via the internal create path, gated by
  `PLANITY_WRITE_ENABLED`, with dry-run, one test slot first, idempotency, and a kill-switch.
  Plugs into the existing `lib/planity/booking.ts` seam.

## 10. Risks & limitations

- Phase 1 Planity blocks are anonymous unavailability, not appointments (see §5). Acceptable and
  documented; resolved in Phase 2.
- Phases 2–3 depend on reverse-engineered internal endpoints: **fragile** (Planity can change the
  schema anytime), possible **ToS** friction, and Phase 3 writes to the **live** agenda. These are
  deliberately deferred behind Phase 1’s zero-risk value.
