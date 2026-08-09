import { NextRequest, NextResponse } from 'next/server'
import { availabilityQuerySchema } from '@/lib/validations'
import { getDayABusy } from '@/lib/google-calendar'
import { freeStaffForWindow, freeArtistsForWindow, freeCount } from '@/lib/booking/capacity'
import { getPlanityDayFree } from '@/lib/planity/public-availability'
import { generateTimeSlots, timeToMinutes } from '@/lib/utils'
import { isRateLimited, getClientIp } from '@/lib/rate-limit'
import { site } from '@/lib/site'

// Short in-memory cache so repeated availability lookups for the same day don't
// hit Google Calendar every time (and to blunt scripted quota-exhaustion). Keyed
// by date+duration; 30s TTL. Per-process (fine at this scale).
const CACHE_TTL_MS = 30_000
const cache = new Map<string, { body: unknown; expires: number }>()

// GET /api/availability?date=YYYY-MM-DD&duration=<totalMinutes>
// Horaires : 10h00 – 19h30, ouvert 7j/7 (source : site.hours)
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Light per-IP rate limit: this endpoint is public and hits Google on a miss.
    if (isRateLimited(`availability:${getClientIp(request)}`, 60, 60_000)) {
      return NextResponse.json({ error: 'Trop de requêtes. Veuillez patienter.' }, { status: 429 })
    }

    const { searchParams } = new URL(request.url)
    const parsed = availabilityQuerySchema.safeParse({
      date:     searchParams.get('date'),
      duration: searchParams.get('duration'),
    })

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Paramètres invalides', issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      )
    }

    const { date, duration } = parsed.data

    const cacheKey = `${date}:${duration}`
    const cached = cache.get(cacheKey)
    if (cached && cached.expires > Date.now()) {
      return NextResponse.json(cached.body)
    }

    // ── Current time gate (Europe/Paris, 15-minute buffer) ────────────────
    // Slots that have already started (or start within 15 min) are excluded
    // entirely - they appear neither as available nor as booked.
    const todayParis = new Date().toLocaleDateString('fr-CA', { timeZone: 'Europe/Paris' }) // "YYYY-MM-DD"
    let minSlotMinutes = 0 // no gate for future dates
    if (date === todayParis) {
      const nowStr = new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Europe/Paris',
        hour:   '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(new Date()) // "HH:MM"
      minSlotMinutes = timeToMinutes(nowStr) + 15
    }

    // Live capacity source: Planity public availability (free staff per 15-min slot)
    // + our own Calendar-A bookings (not yet in Planity). dayFree === null ⇒ fail open.
    const [dayFree, aBusy] = await Promise.all([getPlanityDayFree(date), getDayABusy(date)])

    // Start slots across the opening window (config-driven, Europe/Paris)
    const allSlots   = generateTimeSlots(site.hours.openMinutes, site.hours.closeMinutes)
    const CLOSE_MINUTES = site.hours.closeMinutes  // 19:30 → a 30-min service can start at 19:00

    // Exclude slots that are in the past or too close to now
    const futureSlots = allSlots.filter((slot) => timeToMinutes(slot) >= minSlotMinutes)

    const available: string[] = []
    const booked: string[] = []
    // For each available slot, the practitioners free at that time (for the
    // optional end-of-flow picker). { "14:00": [{id,name}, …] }
    const staffBySlot: Record<string, { id: string; name: string }[]> = {}

    for (const slot of futureSlots) {
      const slotStart = timeToMinutes(slot)
      const slotEnd   = slotStart + duration
      // Don't offer slots whose full service window runs past closing.
      if (slotEnd > CLOSE_MINUTES) continue

      const freeStaff = freeStaffForWindow(dayFree, slotStart, slotEnd)
      if (freeCount(freeStaff, aBusy, slotStart, slotEnd) > 0) {
        available.push(slot)
        // Picker options = every free artist (practitioners + cabines) at this slot.
        staffBySlot[slot] = freeArtistsForWindow(dayFree, slotStart, slotEnd).map((a) => ({ id: a.id, name: a.name }))
      } else {
        booked.push(slot)
      }
    }

    const body = { date, totalDuration: duration, available, booked, staffBySlot }
    cache.set(cacheKey, { body, expires: Date.now() + CACHE_TTL_MS })
    return NextResponse.json(body)
  } catch (error) {
    console.error('[GET /api/availability]', error)
    return NextResponse.json(
      { error: 'Erreur lors de la vérification des disponibilités' },
      { status: 500 }
    )
  }
}
