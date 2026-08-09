import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { appointmentSchema } from '@/lib/validations'
import { createCalendarEvent, listCalendarEvents, findActiveAppointmentForPhone, deleteCalendarEvent, parisDayBounds, getDayABusy } from '@/lib/google-calendar'
import { freeInPool, freeCount } from '@/lib/booking/capacity'
import { getPlanityDayFree } from '@/lib/planity/public-availability'
import { artistById, artistsForCategories } from '@/lib/staff'
import { createPlanityBooking } from '@/lib/planity/booking'
import { getAllServicesAdmin } from '@/lib/services-store'
import { sendBookingAlert } from '@/lib/mail'
import { sendWhatsAppAlert } from '@/lib/whatsapp'
import { syncBookingToSheet } from '@/lib/booking-sheet'
import { decodeImages, saveImages, deleteImages, listImages, existingImageDirs } from '@/lib/appointment-images'
import { formatDate, timeToMinutes } from '@/lib/utils'
import { isBlocked } from '@/lib/blocklist'
import { isDeviceBlocked, recordDeviceBooking } from '@/lib/devices'
import { isRateLimited, getClientIp } from '@/lib/rate-limit'
import { verifyTurnstile } from '@/lib/turnstile'
import type { Service } from '@/lib/types'

// Reject a promise that doesn't settle within `ms`. Used to guard the external
// Google Calendar call so a hung request fails fast with a clean JSON error
// instead of stalling until the gateway returns an unparseable HTML 502.
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`timeout after ${ms}ms`)), ms)
    ),
  ])
}

// ─── GET /api/appointments - admin only ───────────────────────────────────

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const dateFrom = searchParams.get('dateFrom')
    const dateTo   = searchParams.get('dateTo')

    // Build a map of all services for quick lookup
    const allServices = await getAllServicesAdmin()
    const serviceMap  = new Map<string, Service>(allServices.map((s) => [s.id, s]))

    const appointments = await listCalendarEvents({
      timeMin: dateFrom ? parisDayBounds(dateFrom).dayStart : undefined,
      timeMax: dateTo   ? parisDayBounds(dateTo).dayEnd     : undefined,
      serviceMap,
    })

    // Newest first
    appointments.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    // Attach any stored reference photos. Probe the images root once, then only
    // read folders for appointments that actually have one.
    const idsWithImages = await existingImageDirs()
    const withImages = await Promise.all(
      appointments.map(async (a) =>
        idsWithImages.has(a.id) ? { ...a, images: await listImages(a.id) } : a
      )
    )

    return NextResponse.json(withImages)
  } catch (error) {
    console.error('[GET /api/appointments]', error)
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 })
  }
}

// ─── POST /api/appointments - public (booking form) ───────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // ── Cheap guards BEFORE buffering/parsing the body (headers only) ─────
    const clientIp = getClientIp(request)

    // Reject oversized payloads before request.json() allocates them. The booking
    // form legitimately sends up to ~22 MB (3 base64 reference photos); cap above.
    if (Number(request.headers.get('content-length') ?? 0) > 25 * 1024 * 1024) {
      return NextResponse.json({ error: 'Payload too large.' }, { status: 413 })
    }

    // ── Anti-spam check 0: IP rate limit (max 3 bookings / IP / 24 h) ────
    // Runs before request.json() so a sprayer is throttled without the body ever
    // being buffered into memory.
    if (isRateLimited(`booking:${clientIp}`)) {
      return NextResponse.json(
        { error: 'Trop de tentatives depuis votre adresse. Veuillez réessayer dans 24 heures ou nous contacter directement.' },
        { status: 429 }
      )
    }

    const body: unknown = await request.json()
    const parsed = appointmentSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      )
    }

    const { clientName, clientPhone, serviceIds, date, timeSlot, notes, deviceId, fingerprint, turnstileToken, confirmReplace, images, preferredEmployeeId } = parsed.data

    // ── Anti-spam check 0b: Cloudflare Turnstile token ────────────────────
    const turnstileOk = await verifyTurnstile(turnstileToken ?? '', clientIp)
    if (!turnstileOk) {
      return NextResponse.json(
        { error: 'Échec de la vérification de sécurité. Veuillez recharger la page et réessayer.' },
        { status: 403 }
      )
    }

    // ── Anti-spam check 1: blocked phone or IP ────────────────────────────
    if (await isBlocked(clientPhone, clientIp)) {
      return NextResponse.json(
        { error: 'Votre numéro de téléphone ne peut plus effectuer de réservations en ligne. Veuillez nous contacter directement.' },
        { status: 403 }
      )
    }

    // ── Anti-spam check 1b: blocked device ────────────────────────────────
    // Catches a blocked customer who rebooks under a new phone number from the
    // same browser, keyed on the strong deviceId. The fingerprint is detect-only
    // (surfaced to the admin, see priorNoShows), never an auto-block on its own.
    // Same escape hatch as the phone block: call us directly.
    if (await isDeviceBlocked(deviceId ?? '')) {
      return NextResponse.json(
        { error: 'Les réservations en ligne ne sont plus disponibles depuis cet appareil. Veuillez nous contacter directement.' },
        { status: 403 }
      )
    }

    // ── Anti-spam check 2: already has an active upcoming appointment ─────
    const existing = await findActiveAppointmentForPhone(clientPhone)
    if (existing && !confirmReplace) {
      // Signal the conflict without leaking the existing appointment's id or details
      // to an unauthenticated caller who only knows the phone number.
      return NextResponse.json({ error: 'existing_appointment' }, { status: 409 })
    }
    // When confirmReplace is set, DEFER deleting `existing` until the new event is
    // safely created (below) — so a failed create can never leave the customer with
    // no booking at all. Authorisation here is phone-only (a phone number is not a
    // secret), so the replaced RDV is surfaced in the owner alert: a malicious
    // replace is never silent and can always be restored from the calendar.

    // Verify every service exists and is active. Fetch the catalogue ONCE (a single
    // backend read) and look up by id, rather than one store call per cart item —
    // so a slow/failing store can't be retried N× on the booking's critical path.
    const catalogue = await getAllServicesAdmin()
    const serviceById = new Map(catalogue.map((s) => [s.id, s]))
    const services: Service[] = []
    for (const id of serviceIds) {
      const svc = serviceById.get(id)
      if (!svc || !svc.isActive) {
        return NextResponse.json(
          { error: `Prestation introuvable : ${id}` },
          { status: 404 }
        )
      }
      services.push(svc)
    }

    // Resolve the optional preferred artist (practitioner or cabine). Unknown id ignored.
    const employee = preferredEmployeeId ? artistById(preferredEmployeeId) : undefined

    // ── Server-side slot re-check: client-side availability can go stale between
    //    fetch and submit. Skip only when replacing the caller's own booking in
    //    the identical slot (the just-deleted event may still show for a moment).
    const replacingSameSlot =
      !!existing && existing.date.slice(0, 10) === date && existing.timeSlot === timeSlot
    if (!replacingSameSlot) {
      const totalDuration = services.reduce((sum, s) => sum + s.duration, 0)
      const slotStart = timeToMinutes(timeSlot)
      const slotEnd = slotStart + totalDuration
      // Capacity re-check: the client-side view can go stale between fetch and
      // submit. Reject if the salon is now full for that window (per Planity's
      // live availability + our Calendar-A bookings), or the chosen practitioner
      // is no longer free. Fails open if Planity data is unavailable (dayFree null).
      const [dayFree, aBusy] = await Promise.all([getPlanityDayFree(date), getDayABusy(date)])
      // Pool = artists that can perform this cart (practitioners for nail services,
      // the matching cabine for cils/esthetics).
      const pool = artistsForCategories([...new Set(services.map((s) => s.category))])
      const freePool = freeInPool(pool, dayFree, slotStart, slotEnd)
      if (freeCount(freePool, aBusy, slotStart, slotEnd) <= 0) {
        return NextResponse.json(
          { error: 'Ce créneau vient d\'être réservé. Merci d\'en choisir un autre.' },
          { status: 409 }
        )
      }
      if (employee && !freePool.some((a) => a.id === employee.id)) {
        return NextResponse.json(
          { error: `${employee.name} n'est plus disponible sur ce créneau. Choisissez une autre praticienne ou « sans préférence ».` },
          { status: 409 }
        )
      }
    }

    // Create a single Google Calendar event grouping all services.
    // Guarded by a timeout so a hung/unreachable Google Calendar API returns a
    // clean JSON error the client can read, instead of letting the request stall
    // until the gateway serves an HTML 502 ("Unexpected token '<'" on the client).
    let eventId: string
    try {
      eventId = await withTimeout(
        createCalendarEvent({
          clientName,
          clientPhone,
          services: services.map((s) => ({
            id:       s.id,
            name:     s.name,
            price:    s.price,
            duration: s.duration,
          })),
          date,
          timeSlot,
          status: 'PENDING',
          notes,
          clientIp,
          deviceId,
          fingerprint,
          employeeName: employee?.name,
        }),
        10_000
      )
    } catch (calErr) {
      console.error('[POST /api/appointments] createCalendarEvent failed:', calErr)
      return NextResponse.json(
        { error: 'La prise de rendez-vous est momentanément indisponible. Merci de réessayer dans quelques minutes ou de nous appeler.' },
        { status: 503 }
      )
    }

    // New event is safely in the calendar — only NOW remove the replaced booking
    // (deferred from the confirmReplace check above so a failed create can never
    // destroy the customer's existing RDV and leave them with nothing).
    if (existing && confirmReplace) {
      await deleteCalendarEvent(existing.id).catch((e) =>
        console.error('[POST /api/appointments] failed to delete replaced event:', e))
      void deleteImages(existing.id)
    }

    // Link this device to the phone it booked with, so no-shows can be tracked
    // per-device (see PATCH .../[id]). Returns the record (with any prior
    // no-shows), or null when neither deviceId nor fingerprint is available.
    const deviceEntry = await recordDeviceBooking(deviceId ?? '', clientPhone, clientName, fingerprint)

    // Decode any reference photos once: attach the in-memory buffers to the
    // alert email (the durable copy) and persist a server copy in the background
    // so the booking response isn't held up by disk I/O.
    const decodedImages = decodeImages(images)
    if (decodedImages.length > 0) {
      void saveImages(eventId, decodedImages)
    }
    const attachments = decodedImages.map((img, i) => ({
      filename:    `photo-reference-${i + 1}.${img.ext}`,
      content:     img.buffer,
      contentType: img.mime,
    }))

    // Send alert to admin (non-blocking) - no client email
    const totalPrice    = services.reduce((sum, s) => sum + s.price, 0)
    const totalDuration = services.reduce((sum, s) => sum + s.duration, 0)

    // Isolated Planity write seam — 'unsupported' today (Planity has no official
    // write API); the staff email + WhatsApp below are the path into Planity.
    void createPlanityBooking({
      clientName,
      clientPhone,
      date,
      timeSlot,
      durationMinutes: totalDuration,
      serviceNames: services.map((s) => s.name),
      planityServiceIds: services.map((s) => s.planityId).filter((x): x is string => !!x),
      googleEventId: eventId,
    }).then((r) => {
      if (r.status !== 'created') console.log('[planity] write seam:', r.status)
    })

    const alertData = {
      clientName,
      clientPhone,
      services: services.map((s) => ({ name: s.name, price: s.price, duration: s.duration })),
      totalPrice,
      totalDuration,
      date: formatDate(date),
      timeSlot,
      notes: existing && confirmReplace
        ? `⚠️ Remplace le RDV existant du ${formatDate(existing.date.slice(0, 10))} à ${existing.timeSlot} (même numéro de téléphone).${notes ? '\n' + notes : ''}`
        : notes,
      employee: employee?.name ?? '',
      clientIp,
      deviceId: deviceId ?? '',
      fingerprint: fingerprint ?? '',
      priorNoShows: deviceEntry?.noShowCount ?? 0,
      photoCount: decodedImages.length,
    }

    void sendBookingAlert(alertData, attachments).catch((err) => console.error('Failed to send email alert:', err))
    void sendWhatsAppAlert(alertData).catch((err) => console.error('Failed to send WhatsApp alert:', err))

    // Mirror the booking into the management sheet (Rendez-vous + Clients). Fire-
    // and-forget: a Sheets error must never fail the booking.
    void syncBookingToSheet({
      id: eventId,
      date,
      timeSlot,
      clientName,
      clientPhone,
      serviceNames: services.map((s) => s.name),
      totalDuration,
      totalPrice,
      notes,
      clientIp,
      deviceId,
    }).catch((err) => console.error('Failed to sync booking to sheet:', (err as Error)?.message ?? 'unknown error'))

    return NextResponse.json(
      { id: eventId, message: 'Rendez-vous créé avec succès.' },
      { status: 201 }
    )
  } catch (error) {
    console.error('[POST /api/appointments]', error)
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 502 })
  }
}
