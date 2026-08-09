# Admin Calendrier (Phase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new `/admin/calendar` ("Planning") section showing a day view with the 9 agendas as columns — website bookings in full detail plus Planity anonymous busy blocks.

**Architecture:** A pure inversion helper turns Planity's "free per 15-min slot" feed into per-employee busy intervals. An auth-gated API route (`/api/admin/calendar`) merges those with Google Calendar A website bookings into one day payload. A client `CalendarBoard` renders the column grid. No writes, no reverse-engineering — Phase 1 only.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript (strict), Tailwind v3, `node:test` (built-in) for the one pure unit, `npm run build` + live check for routes/UI (repo has no test framework).

## Global Constraints

- All time math in **Europe/Paris**; salon hours from `site.hours` (`openMinutes` 600, `closeMinutes` 1170). Never hardcode 10:00/19:30.
- Fail-open: when Planity data is unavailable, `planityKnown:false` and **no** blocks — never fabricate or block the page.
- Reuse existing modules: `lib/staff.ts` `ARTISTS`, `listCalendarEvents`, `getAllServicesAdmin`, `parisDayBounds`, `timeToMinutes`. Do not duplicate them.
- Match admin theme: blush/dark/coral, Manrope/Cormorant. Follow existing admin component patterns.
- Commit after each task. Verify each task's deliverable before committing.

---

### Task 1: Pure Planity busy-interval inversion helper

**Files:**
- Create: `lib/planity/busy.ts`
- Test: `lib/planity/busy.test.ts`
- Modify: `tsconfig.json:38-41` (exclude test files from the Next typecheck)

**Interfaces:**
- Produces: `export interface Interval { startMin: number; endMin: number }` and
  `export function busyIntervalsFromFree(free: Map<string, Set<string>>, calIds: string[], openMin: number, closeMin: number, stepMin?: number): Record<string, Interval[]>`

- [ ] **Step 1: Write the failing test**

Create `lib/planity/busy.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { busyIntervalsFromFree } from './busy.ts'

const OPEN = 600, CLOSE = 1170, STEP = 15
const hhmm = (min: number): string =>
  `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`

// A free map where `cal` is free at every 15-min tick EXCEPT ticks inside any [s,e) busy range.
function freeMapFor(cal: string, busyRanges: [number, number][] = []): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>()
  for (let t = OPEN; t < CLOSE; t += STEP) {
    const inBusy = busyRanges.some(([s, e]) => t >= s && t < e)
    map.set(hhmm(t), new Set<string>(inBusy ? [] : [cal]))
  }
  return map
}

test('free all day → no busy intervals', () => {
  const out = busyIntervalsFromFree(freeMapFor('A'), ['A'], OPEN, CLOSE)
  assert.deepEqual(out['A'], [])
})

test('busy 13:00–14:00 merges four ticks into one interval', () => {
  const out = busyIntervalsFromFree(freeMapFor('A', [[780, 840]]), ['A'], OPEN, CLOSE)
  assert.deepEqual(out['A'], [{ startMin: 780, endMin: 840 }])
})

test('busy until close clamps to closeMin', () => {
  const out = busyIntervalsFromFree(freeMapFor('A', [[1140, CLOSE]]), ['A'], OPEN, CLOSE)
  assert.deepEqual(out['A'], [{ startMin: 1140, endMin: 1170 }])
})

test('calId never listed free → busy all day', () => {
  const out = busyIntervalsFromFree(freeMapFor('A'), ['B'], OPEN, CLOSE)
  assert.deepEqual(out['B'], [{ startMin: 600, endMin: 1170 }])
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test "lib/planity/busy.test.ts"`
Expected: FAIL — `Cannot find module './busy.ts'` (helper not created yet).

- [ ] **Step 3: Write minimal implementation**

Create `lib/planity/busy.ts`:

```ts
/**
 * Pure inversion of Planity's "free practitioners per 15-min slot" feed into
 * per-employee BUSY intervals. No app imports (kept alias-free so node:test can
 * run it directly). An employee is BUSY at a tick when they are NOT listed free
 * there (booked, off-shift, or closed); consecutive busy ticks merge.
 */
export interface Interval {
  startMin: number
  endMin: number
}

const hhmm = (min: number): string =>
  `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`

export function busyIntervalsFromFree(
  free: Map<string, Set<string>>,
  calIds: string[],
  openMin: number,
  closeMin: number,
  stepMin = 15,
): Record<string, Interval[]> {
  const out: Record<string, Interval[]> = {}
  for (const cal of calIds) {
    const intervals: Interval[] = []
    let runStart: number | null = null
    for (let t = openMin; t < closeMin; t += stepMin) {
      const freeSet = free.get(hhmm(t))
      const isFree = !!freeSet && freeSet.has(cal)
      if (!isFree) {
        if (runStart === null) runStart = t
      } else if (runStart !== null) {
        intervals.push({ startMin: runStart, endMin: t })
        runStart = null
      }
    }
    if (runStart !== null) intervals.push({ startMin: runStart, endMin: closeMin })
    out[cal] = intervals
  }
  return out
}
```

- [ ] **Step 4: Exclude test files from the Next typecheck**

In `tsconfig.json`, change the `exclude` array (lines 38-41) from:

```json
  "exclude": [
    "node_modules",
    "prisma"
  ]
```

to:

```json
  "exclude": [
    "node_modules",
    "prisma",
    "**/*.test.ts"
  ]
```

(The test imports `./busy.ts` with an explicit extension, which `next build`'s typecheck rejects unless test files are excluded. `node --test` runs them regardless.)

- [ ] **Step 5: Run test to verify it passes**

Run: `node --test "lib/planity/busy.test.ts"`
Expected: PASS — `pass 4  fail 0`.

- [ ] **Step 6: Commit**

```bash
git add lib/planity/busy.ts lib/planity/busy.test.ts tsconfig.json
git commit -m "feat(calendar): pure Planity busy-interval inversion + tests"
```

---

### Task 2: Surface the chosen praticienne on Appointment

**Files:**
- Modify: `lib/types.ts:90-104` (add `employeeName?`)
- Modify: `lib/google-calendar.ts:163-177` (return `p['employee']`)

**Interfaces:**
- Produces: `Appointment.employeeName?: string` — populated from `extendedProperties.private.employee`.
- Consumes: nothing new.

- [ ] **Step 1: Add the field to the type**

In `lib/types.ts`, inside `export interface Appointment` (after `notes?: string` on line 101), add:

```ts
  employeeName?: string   // chosen praticienne (from event extendedProperties.private.employee)
```

- [ ] **Step 2: Populate it in the mapper**

In `lib/google-calendar.ts`, in the object returned by `eventToAppointment` (the `return { … }` at lines 163-177), add after `notes: p['notes'] || undefined,`:

```ts
    employeeName: p['employee'] || undefined,
```

- [ ] **Step 3: Verify the build typechecks**

Run: `npm run build`
Expected: `✓ Compiled successfully`, exit 0. (The new optional field breaks nothing; `/admin/appointments` ignores it.)

- [ ] **Step 4: Commit**

```bash
git add lib/types.ts lib/google-calendar.ts
git commit -m "feat(calendar): surface chosen praticienne on Appointment"
```

---

### Task 3: `getPlanityBusyByEmployee` wrapper

**Files:**
- Modify: `lib/planity/public-availability.ts` (add export at end; import from `./busy`)

**Interfaces:**
- Consumes: `getPlanityDayFree` (same file), `ARTISTS` (already imported), `busyIntervalsFromFree`, `Interval` (Task 1).
- Produces: `export async function getPlanityBusyByEmployee(date: string, openMin: number, closeMin: number): Promise<Record<string, Interval[]> | null>` — keyed by **artist id** (not calId); `null` ⇒ no authoritative data (fail-open).

- [ ] **Step 1: Add the import**

At the top of `lib/planity/public-availability.ts`, after the existing `import { ARTISTS } from '@/lib/staff'` (line 2), add:

```ts
import { busyIntervalsFromFree, type Interval } from './busy'
```

- [ ] **Step 2: Add the wrapper at the end of the file**

Append to `lib/planity/public-availability.ts`:

```ts
/**
 * Per-EMPLOYEE busy intervals for a date, keyed by our artist id (for the admin
 * calendar). `null` ⇒ no authoritative Planity data for the day (fetch failed or
 * beyond the published horizon) → caller fails open (shows an "indisponible" note,
 * no blocks). A non-null map with an empty array for an employee ⇒ free all day.
 */
export async function getPlanityBusyByEmployee(
  date: string,
  openMin: number,
  closeMin: number,
): Promise<Record<string, Interval[]> | null> {
  const free = await getPlanityDayFree(date)
  if (free === null) return null
  const byCal = busyIntervalsFromFree(free, ARTISTS.map((a) => a.planityCalendarId), openMin, closeMin)
  const out: Record<string, Interval[]> = {}
  for (const a of ARTISTS) out[a.id] = byCal[a.planityCalendarId] ?? []
  return out
}
```

- [ ] **Step 3: Verify the build typechecks**

Run: `npm run build`
Expected: `✓ Compiled successfully`, exit 0.

- [ ] **Step 4: Commit**

```bash
git add lib/planity/public-availability.ts
git commit -m "feat(calendar): per-employee Planity busy intervals"
```

---

### Task 4: `GET /api/admin/calendar` route

**Files:**
- Create: `app/api/admin/calendar/route.ts`

**Interfaces:**
- Consumes: `auth`, `listCalendarEvents`, `parisDayBounds`, `getPlanityBusyByEmployee` (Task 3), `ARTISTS`, `getAllServicesAdmin`, `site.hours`, `timeToMinutes`, `Appointment.employeeName` (Task 2).
- Produces: JSON matching the spec §4 contract — `{ date, openMinutes, closeMinutes, employees[], website[], planityBusy, planityKnown }`.

- [ ] **Step 1: Create the route**

Create `app/api/admin/calendar/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { listCalendarEvents, parisDayBounds } from '@/lib/google-calendar'
import { getPlanityBusyByEmployee } from '@/lib/planity/public-availability'
import { ARTISTS } from '@/lib/staff'
import { getAllServicesAdmin } from '@/lib/services-store'
import { site } from '@/lib/site'
import { timeToMinutes } from '@/lib/utils'
import type { Service } from '@/lib/types'

// GET /api/admin/calendar?date=YYYY-MM-DD  — admin only. Assembles one day:
// website bookings (Calendar A, full detail) + Planity anonymous busy blocks.
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const date = new URL(request.url).searchParams.get('date') ?? ''
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 422 })
    }

    const openMinutes = site.hours.openMinutes
    const closeMinutes = site.hours.closeMinutes

    const allServices = await getAllServicesAdmin()
    const serviceMap = new Map<string, Service>(allServices.map((s) => [s.id, s]))
    const { dayStart, dayEnd } = parisDayBounds(date)

    const [events, planityBusy] = await Promise.all([
      listCalendarEvents({ timeMin: dayStart, timeMax: dayEnd, serviceMap }),
      getPlanityBusyByEmployee(date, openMinutes, closeMinutes),
    ])

    // Match a booking's chosen praticienne name → artist id, to place it in a column.
    const idByName = new Map(ARTISTS.map((a) => [a.name.toLowerCase(), a.id]))

    const website = events.map((e) => {
      const startMin = timeToMinutes(e.timeSlot)
      const employeeId = e.employeeName ? idByName.get(e.employeeName.toLowerCase()) ?? null : null
      return {
        id: e.id,
        employeeId,
        clientName: e.clientName,
        services: e.services.map((s) => s.name).join(' + '),
        startMin,
        endMin: startMin + e.totalDuration,
      }
    })

    return NextResponse.json({
      date,
      openMinutes,
      closeMinutes,
      employees: ARTISTS.map((a) => ({ id: a.id, name: a.name, kind: a.kind })),
      website,
      planityBusy: planityBusy ?? {},
      planityKnown: planityBusy !== null,
    })
  } catch (error) {
    console.error('[GET /api/admin/calendar]', error)
    return NextResponse.json({ error: 'Failed to load calendar' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Verify the build typechecks**

Run: `npm run build`
Expected: `✓ Compiled successfully`, exit 0, and `/api/admin/calendar` appears in the route list.

- [ ] **Step 3: Commit**

```bash
git add app/api/admin/calendar/route.ts
git commit -m "feat(calendar): GET /api/admin/calendar day payload"
```

---

### Task 5: `CalendarBoard` component + page

**Files:**
- Create: `components/admin/CalendarBoard.tsx`
- Create: `app/admin/(protected)/calendar/page.tsx`

**Interfaces:**
- Consumes: `GET /api/admin/calendar` (Task 4).
- Produces: default-exported `CalendarBoard({ initialDate }: { initialDate: string })`; a server page passing today's Paris date.

- [ ] **Step 1: Create the client board**

Create `components/admin/CalendarBoard.tsx`:

```tsx
'use client'

import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface Employee { id: string; name: string; kind: 'staff' | 'cabine' }
interface WebBooking {
  id: string; employeeId: string | null; clientName: string
  services: string; startMin: number; endMin: number
}
interface Interval { startMin: number; endMin: number }
interface CalendarData {
  date: string; openMinutes: number; closeMinutes: number
  employees: Employee[]; website: WebBooking[]
  planityBusy: Record<string, Interval[]>; planityKnown: boolean
}

const PX_PER_MIN = 1.3
const COL_W = 150

const fmt = (min: number): string =>
  `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`

// Pure UTC date-string arithmetic (no local-tz drift).
function addDays(iso: string, n: number): string {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  dt.setUTCDate(dt.getUTCDate() + n)
  return dt.toISOString().slice(0, 10)
}

const prettyDate = (iso: string): string =>
  new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

export default function CalendarBoard({ initialDate }: { initialDate: string }) {
  const [date, setDate] = useState(initialDate)
  const [data, setData] = useState<CalendarData | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async (d: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/calendar?date=${d}`)
      if (!res.ok) throw new Error(String(res.status))
      setData(await res.json())
    } catch {
      toast.error('Impossible de charger le planning.')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load(date) }, [date, load])

  const gridHeight = data ? (data.closeMinutes - data.openMinutes) * PX_PER_MIN : 0
  const hourLines: number[] = []
  if (data) {
    const firstHour = Math.ceil(data.openMinutes / 60) * 60
    for (let t = firstHour; t <= data.closeMinutes; t += 60) hourLines.push(t)
  }

  // Website bookings grouped by column key ('web' for unassigned, else employee id).
  const webByCol: Record<string, WebBooking[]> = {}
  for (const b of data?.website ?? []) {
    const key = b.employeeId ?? 'web'
    ;(webByCol[key] ??= []).push(b)
  }

  const top = (startMin: number) => (startMin - (data!.openMinutes)) * PX_PER_MIN
  const height = (s: number, e: number) => Math.max(18, (e - s) * PX_PER_MIN)

  const columns: { key: string; label: string; kind: 'web' | 'staff' | 'cabine' }[] = [
    { key: 'web', label: 'Web (sans préf.)', kind: 'web' },
    ...(data?.employees ?? []).map((e) => ({ key: e.id, label: e.name, kind: e.kind })),
  ]

  return (
    <div>
      <header className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="font-serif text-2xl text-dark">Planning</h1>
        <div className="flex items-center gap-2 font-sans text-sm">
          <button onClick={() => setDate((d) => addDays(d, -1))}
            className="px-3 py-1.5 bg-white hover:bg-blush border border-dark/10">‹</button>
          <button onClick={() => setDate(initialDate)}
            className="px-3 py-1.5 bg-white hover:bg-blush border border-dark/10">Aujourd’hui</button>
          <button onClick={() => setDate((d) => addDays(d, 1))}
            className="px-3 py-1.5 bg-white hover:bg-blush border border-dark/10">›</button>
          <span className="ml-2 capitalize text-dark/70">{prettyDate(date)}</span>
        </div>
      </header>

      {data && !data.planityKnown && (
        <p className="mb-3 text-xs text-dark/50 font-sans">
          Planity indisponible pour cette date — seuls les rendez-vous du site sont affichés.
        </p>
      )}

      {loading && <p className="text-dark/40 font-sans text-sm">Chargement…</p>}

      {data && !loading && (
        <div className="overflow-x-auto border border-dark/10 bg-white">
          <div className="flex min-w-max">
            {/* time gutter */}
            <div className="w-14 shrink-0 border-r border-dark/10">
              <div className="h-10 border-b border-dark/10" />
              <div className="relative" style={{ height: gridHeight }}>
                {hourLines.map((t) => (
                  <div key={t} className="absolute left-0 right-0 text-[10px] text-dark/40 px-1"
                    style={{ top: top(t) - 6 }}>{fmt(t)}</div>
                ))}
              </div>
            </div>

            {/* columns */}
            {columns.map((col) => (
              <div key={col.key} className="shrink-0 border-r border-dark/10" style={{ width: COL_W }}>
                <div className="h-10 flex items-center justify-center text-xs font-sans font-medium
                  text-dark/70 border-b border-dark/10 px-1 text-center truncate">
                  {col.label}
                </div>
                <div className="relative" style={{ height: gridHeight }}>
                  {hourLines.map((t) => (
                    <div key={t} className="absolute left-0 right-0 border-t border-dark/5"
                      style={{ top: top(t) }} />
                  ))}
                  {/* Planity busy blocks (not for the web lane) */}
                  {col.kind !== 'web' && (data.planityBusy[col.key] ?? []).map((iv, i) => (
                    <div key={`p${i}`} className="absolute left-0.5 right-0.5 bg-dark/10 rounded-sm"
                      style={{ top: top(iv.startMin), height: height(iv.startMin, iv.endMin) }}
                      title="Indisponible (Planity)" />
                  ))}
                  {/* Website bookings */}
                  {(webByCol[col.key] ?? []).map((b) => (
                    <div key={b.id}
                      className="absolute left-0.5 right-0.5 bg-coral text-cream rounded-sm p-1 overflow-hidden"
                      style={{ top: top(b.startMin), height: height(b.startMin, b.endMin) }}
                      title={`${b.clientName} — ${b.services}`}>
                      <div className="text-[10px] font-medium leading-tight">
                        {fmt(b.startMin)} {b.clientName}
                      </div>
                      <div className="text-[9px] leading-tight opacity-90 truncate">{b.services}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data && !loading && data.website.length === 0 && (
        <p className="mt-4 text-dark/40 font-sans text-sm">Aucun rendez-vous du site ce jour.</p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create the page**

Create `app/admin/(protected)/calendar/page.tsx`:

```tsx
import CalendarBoard from '@/components/admin/CalendarBoard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Planning' }

export default function CalendarPage() {
  // Initial date = today in Europe/Paris (fr-CA gives YYYY-MM-DD).
  const today = new Date().toLocaleDateString('fr-CA', { timeZone: 'Europe/Paris' })
  return <CalendarBoard initialDate={today} />
}
```

- [ ] **Step 3: Verify the build typechecks**

Run: `npm run build`
Expected: `✓ Compiled successfully`, exit 0, and `/admin/calendar` appears in the route list.

- [ ] **Step 4: Commit**

```bash
git add components/admin/CalendarBoard.tsx "app/admin/(protected)/calendar/page.tsx"
git commit -m "feat(calendar): CalendarBoard day grid + page"
```

---

### Task 6: Sidebar nav item + live verification

**Files:**
- Modify: `components/admin/Sidebar.tsx` (add icon + nav item)

**Interfaces:**
- Consumes: `/admin/calendar` page (Task 5).
- Produces: a "Planning" entry in the admin sidebar.

- [ ] **Step 1: Add a columns icon**

In `components/admin/Sidebar.tsx`, after the `CalendarIcon` definition (around line 15), add:

```tsx
const ColumnsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="1" /><path d="M9 3v18M15 3v18" />
  </svg>
)
```

- [ ] **Step 2: Add the nav item**

In the `NAV_ITEMS` array, insert after the `Rendez-vous` entry:

```tsx
  { href: '/admin/calendar',     label: 'Planning',        icon: <ColumnsIcon /> },
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: `✓ Compiled successfully`, exit 0.

- [ ] **Step 4: Live check (dev server)**

Run: `npm run dev`, log in at `/admin/login`, open `/admin/calendar`.
Expected: 10 columns (Web + 9 agendas); today's website bookings appear as coral cards in the chosen praticienne's column (or the Web lane if "sans préférence"); Planity shows grey "Indisponible" blocks that line up with real gaps in the pro agenda; ‹ / Aujourd'hui / › change the day. On a date beyond Planity's horizon, the grey blocks disappear and the "Planity indisponible" note shows (bookings still render).

- [ ] **Step 5: Commit**

```bash
git add components/admin/Sidebar.tsx
git commit -m "feat(calendar): add Planning to admin sidebar"
```

---

## Self-Review

**Spec coverage:**
- §3 new files — Tasks 4 (route), 5 (board+page); changed files — Task 3 (helper), Task 6 (sidebar). ✓
- §4 data contract — Task 4 returns the exact shape (incl. `planityKnown`). ✓
- §5 inversion algorithm — Task 1 (pure) + Task 3 (wrapper, calId→artist id). ✓
- §6 UI (columns, Web lane, coral cards, grey blocks, date nav, horizontal scroll, empty/loading/error, Planity-note) — Task 5. ✓
- §4 implementation dependency (surface chosen praticienne) — Task 2. ✓
- §8 testing — Task 1 `node:test`; Tasks 2-6 `npm run build`; Task 6 live check. ✓

**Placeholder scan:** No TBD/TODO; every code step shows complete code and exact commands. ✓

**Type consistency:** `Interval { startMin, endMin }` defined in Task 1, reused in Tasks 3-5. `busyIntervalsFromFree` signature identical in Tasks 1 and 3. `getPlanityBusyByEmployee(date, openMin, closeMin)` defined in Task 3, called with the same args in Task 4. `employeeName?` added in Task 2, read in Task 4. Response fields in Task 4 match `CalendarData` in Task 5. ✓

**Out of scope (correctly deferred):** week view, real Planity appointment detail (Phase 2), write-back (Phase 3).
