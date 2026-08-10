import { google } from 'googleapis'
import type { Appointment, AppointmentStatus, Service } from '@/lib/types'
import { site } from '@/lib/site'

// ─── Auth (service account) ────────────────────────────────────────────────

function getCalendarClient() {
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  if (!keyJson) throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY is not set')

  // Hostinger's env injection inserts stray backslashes into this JSON value,
  // creating invalid escape sequences (a leading "\{", and a bad escape near the
  // end of the key) that break JSON.parse. Remove any backslash that isn't part
  // of a valid JSON escape, then normalize the private key's newlines, before use.
  const cleaned = keyJson.trim().replace(/\\(?!["\\/bfnrtu])/g, '')
  const credentials = JSON.parse(cleaned) as Record<string, unknown>
  if (typeof credentials.private_key === 'string') {
    credentials.private_key = credentials.private_key.replace(/\\n/g, '\n')
  }

  const auth = new google.auth.GoogleAuth({
    credentials: credentials as object,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  })

  // timeout applies to every request made through this client (gaxios aborts the
  // socket), so a hung Calendar API call fails fast instead of stalling the route.
  return google.calendar({ version: 'v3', auth, timeout: 10_000 })
}

const CALENDAR_ID = () => {
  const id = process.env.GOOGLE_CALENDAR_ID
  if (!id) throw new Error('GOOGLE_CALENDAR_ID is not set')
  return id
}

// Every booking event we create on Calendar A carries this private extended
// property so we can filter only our booking events (ignoring personal entries).
const SOURCE_KEY = 'source'
const SOURCE_VALUE = 'dobeauty'

// ─── Types ────────────────────────────────────────────────────────────────

export interface CalendarServiceItem {
  id: string
  name: string
  price: number
  duration: number
}

export interface CalendarEventData {
  clientName: string
  clientPhone: string
  services: CalendarServiceItem[]   // one or many prestations
  date: string                      // "YYYY-MM-DD"
  timeSlot: string                  // "HH:MM"
  status: AppointmentStatus
  notes?: string
  clientIp?: string                 // captured at booking time, for ghost tracking
  deviceId?: string                 // persistent browser id, for no-show tracking
  fingerprint?: string              // browser fingerprint, fallback no-show identifier
  employeeName?: string             // optional preferred staff (client's choice, a hint)
  pool?: string                     // resource-pool key (poolKey) - for same-pool capacity math
}

// ─── Helpers ──────────────────────────────────────────────────────────────

/**
 * Returns the UTC offset for Europe/Paris on a given date as "+HH:MM".
 * Handles CET (+01:00 in winter) and CEST (+02:00 in summer) automatically.
 *
 * @param date - "YYYY-MM-DD"  (defaults to today if omitted)
 */
export function getParisOffset(date?: string): string {
  // Use noon UTC on the target date so DST is read for the right day
  const ref = date ? new Date(`${date}T12:00:00Z`) : new Date()
  // Ask Intl what hour it is in Paris at that UTC moment
  const parisHour = Number(
    new Intl.DateTimeFormat('en', {
      timeZone: 'Europe/Paris',
      hour:     'numeric',
      hour12:   false,
    }).format(ref)
  )
  // offset = paris hour − UTC hour (12)
  const h = parisHour - 12
  const sign = h >= 0 ? '+' : '-'
  return `${sign}${String(Math.abs(h)).padStart(2, '0')}:00`
}

/**
 * Returns "YYYY-MM-DDT00:00:00+HH:MM" / "…T23:59:59+HH:MM" for a given date
 * in the Europe/Paris timezone (DST-aware).
 */
export function parisDayBounds(date: string): { dayStart: string; dayEnd: string } {
  const offset = getParisOffset(date)
  return {
    dayStart: `${date}T00:00:00${offset}`,
    dayEnd:   `${date}T23:59:59${offset}`,
  }
}

function toDateTimeString(date: string, timeSlot: string): string {
  // "2024-06-15" + "10:30" → "2024-06-15T10:30:00"
  return `${date}T${timeSlot}:00`
}

function addMinutes(dateTimeStr: string, minutes: number): string {
  // Pure string arithmetic - avoids UTC offset when converting back via toISOString()
  const [date, time] = dateTimeStr.split('T')
  const [h, m, s] = time.split(':').map(Number)
  const total = h * 60 + m + minutes
  const newH = Math.floor(total / 60)
  const newM = total % 60
  return `${date}T${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}:${String(s ?? 0).padStart(2, '0')}`
}

function eventToAppointment(
  event: {
    id?: string | null
    extendedProperties?: { private?: Record<string, string> | null } | null
    start?: { dateTime?: string | null } | null
    created?: string | null
    updated?: string | null
  },
  serviceMap: Map<string, Service>
): Appointment | null {
  const p = event.extendedProperties?.private
  if (!p || p[SOURCE_KEY] !== SOURCE_VALUE) return null

  // serviceIds stored as CSV in the extended property
  const serviceIdsCsv = p['serviceIds'] ?? p['serviceId'] ?? ''
  const serviceIds = serviceIdsCsv.split(',').map((s) => s.trim()).filter(Boolean)

  // Resolve services from the catalog for full detail, but fall back to the
  // service names stored on the event when an id can't be resolved (a service
  // was deleted/renamed, or data/services.json was reset on redeploy). The
  // appointment must still appear in admin either way - dropping it silently
  // hid real, calendar-blocking bookings and could empty the whole list.
  const storedNames = (p['serviceNames'] ?? '').split(' + ').map((s) => s.trim())
  const services: Service[] = serviceIds.map((id, i) =>
    serviceMap.get(id) ?? {
      id,
      name:        storedNames[i] || 'Prestation',
      description: '',
      price:       0,
      duration:    0,
      category:    'MAINS',
      isActive:    false,
    } as Service
  )

  const totalDuration = p['totalDuration']
    ? Number(p['totalDuration'])
    : services.reduce((sum, s) => sum + s.duration, 0)

  const totalPrice = p['totalPrice']
    ? Number(p['totalPrice'])
    : services.reduce((sum, s) => sum + s.price, 0)

  const startIso = event.start?.dateTime ?? ''
  const timeSlot = startIso.slice(11, 16) // "HH:MM"

  return {
    id: event.id ?? '',
    clientName: p['clientName'] ?? '',
    clientPhone: p['clientPhone'] ?? '',
    serviceIds,
    services,
    totalDuration,
    totalPrice,
    date: startIso,
    timeSlot,
    status: (p['status'] as AppointmentStatus) ?? 'PENDING',
    notes: p['notes'] || undefined,
    employeeName: p['employee'] || undefined,
    createdAt: event.created ?? startIso,
    updatedAt: event.updated ?? startIso,
  }
}

// ─── Status → calendar colour ─────────────────────────────────────────────
// Google Calendar colour IDs: 1 Lavender, 2 Sage, 3 Grape, 4 Flamingo,
// 5 Banana, 6 Tangerine, 7 Peacock, 8 Graphite, 9 Blueberry, 10 Basil, 11 Tomato

const STATUS_COLOR: Record<AppointmentStatus, string> = {
  PENDING:   '5',  // Banana (yellow)
  CONFIRMED: '2',  // Sage (green)
  CANCELLED: '8',  // Graphite (grey)
  COMPLETED: '7',  // Peacock (teal)
  NO_SHOW:   '6',  // Tangerine (orange)
}

// ─── Public API ───────────────────────────────────────────────────────────

/**
 * Create a booking event on Google Calendar.
 * Returns the created event ID.
 */
export async function createCalendarEvent(data: CalendarEventData): Promise<string> {
  const calendar = getCalendarClient()
  const startDT = toDateTimeString(data.date, data.timeSlot)

  const totalDuration = data.services.reduce((sum, s) => sum + s.duration, 0)
  const totalPrice    = data.services.reduce((sum, s) => sum + s.price, 0)
  const endDT         = addMinutes(startDT, totalDuration)

  const serviceNames = data.services.map((s) => s.name).join(' + ')
  const serviceIds   = data.services.map((s) => s.id).join(',')

  // ── Format duration as "X h Y min" or "X min" ────────────────────────
  const fmtDuration = (min: number) => {
    if (min < 60) return `${min} min`
    const h = Math.floor(min / 60)
    const m = min % 60
    return m > 0 ? `${h} h ${m} min` : `${h} h`
  }

  // ── Format booking date as "DD.MM.YYYY" ───────────────────────────────
  const [y, mo, d] = data.date.split('-')
  const fmtDate = `${d}.${mo}.${y}`

  // ── End time as "HH:MM" ───────────────────────────────────────────────
  const endTime = addMinutes(toDateTimeString(data.date, data.timeSlot), totalDuration).slice(11, 16)

  // ── Service lines ─────────────────────────────────────────────────────
  const serviceLines = data.services
    .map((s) => `  - ${s.name} · ${fmtDuration(s.duration)}`)
    .join('\n')

  // ── Booked-at timestamp ───────────────────────────────────────────────
  const now = new Date()
  const bookedAt = now.toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Europe/Paris',
  })

  // ── Full description ──────────────────────────────────────────────────
  const sep = '─────────────────────────'
  const description = [
    `👤 ${data.clientName}`,
    `📞 ${data.clientPhone}`,
    data.employeeName ? `👩‍🎨 Praticienne demandée : ${data.employeeName}` : '',
    '',
    sep,
    `📅 Date         : ${fmtDate}, ${data.timeSlot} → ${endTime}`,
    `⏱ Durée        : ${fmtDuration(totalDuration)}`,
    sep,
    '',
    `💅 Prestation${data.services.length > 1 ? 's' : ''} :`,
    serviceLines,
    '',
    sep,
    `💵 Total        : ${totalPrice} €`,
    `💳 Paiement     : Carte ou espèces`,
    `🌐 Provenance   : dobeauty.fr`,
    sep,
    '',
    data.notes ? `📝 Notes : ${data.notes}` : '',
    '',
    `🕐 Réservé le   : ${bookedAt}`,
  ]
    .filter((line) => line !== undefined && line !== null)
    .join('\n')

  const res = await calendar.events.insert({
    calendarId: CALENDAR_ID(),
    requestBody: {
      summary: `Do Beauty · ${data.clientName} · ${serviceNames}${data.employeeName ? ` · ${data.employeeName}` : ''}`,
      description,
      location: `${site.address.street}, ${site.address.city}, France`,
      start: {
        dateTime: startDT,
        timeZone: 'Europe/Paris',
      },
      end: {
        dateTime: endDT,
        timeZone: 'Europe/Paris',
      },
      colorId:      STATUS_COLOR['PENDING'],
      transparency: 'opaque',
      extendedProperties: {
        private: {
          [SOURCE_KEY]:   SOURCE_VALUE,
          clientName:     data.clientName,
          clientPhone:    data.clientPhone,
          clientIp:       data.clientIp ?? '',
          serviceIds,
          serviceNames,
          status:         'PENDING',
          totalDuration:  String(totalDuration),
          totalPrice:     String(totalPrice),
          notes:          data.notes ?? '',
          deviceId:       data.deviceId ?? '',
          fingerprint:    data.fingerprint ?? '',
          employee:       data.employeeName ?? '',
          pool:           data.pool ?? '',
        },
      },
    },
  })

  return res.data.id ?? ''
}

/**
 * List all Do Beauty booking events, optionally filtered by date range.
 */
export async function listCalendarEvents(params: {
  timeMin?: string
  timeMax?: string
  serviceMap: Map<string, Service>
}): Promise<Appointment[]> {
  const calendar = getCalendarClient()

  const res = await calendar.events.list({
    calendarId: CALENDAR_ID(),
    privateExtendedProperty: [`${SOURCE_KEY}=${SOURCE_VALUE}`],
    timeMin: params.timeMin,
    timeMax: params.timeMax,
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 500,
  })

  const events = res.data.items ?? []
  const appointments: Appointment[] = []

  for (const event of events) {
    const appt = eventToAppointment(event, params.serviceMap)
    if (appt) appointments.push(appt)
  }

  return appointments
}

/**
 * Update the status of a booking event.
 *
 * Transparency rules:
 *  - CANCELLED / NO_SHOW → 'transparent'  (event stays visible but frees the slot)
 *  - Everything else     → 'opaque'       (blocks the slot as usual)
 */
export async function updateCalendarEventStatus(
  eventId: string,
  status: AppointmentStatus
): Promise<void> {
  const calendar = getCalendarClient()

  const freesSlot = status === 'CANCELLED' || status === 'NO_SHOW'

  await calendar.events.patch({
    calendarId: CALENDAR_ID(),
    eventId,
    requestBody: {
      colorId:      STATUS_COLOR[status],
      transparency: freesSlot ? 'transparent' : 'opaque',
      extendedProperties: {
        private: { status },
      },
    },
  })
}

/**
 * Delete a booking event from Google Calendar.
 */
export async function deleteCalendarEvent(eventId: string): Promise<void> {
  const calendar = getCalendarClient()
  await calendar.events.delete({
    calendarId: CALENDAR_ID(),
    eventId,
  })
}

// Minimal structural shape of a Calendar event (avoids importing calendar_v3).
type CalEvent = {
  start?: { dateTime?: string | null } | null
  end?: { dateTime?: string | null } | null
  status?: string | null
  transparency?: string | null
  extendedProperties?: { private?: Record<string, string> | null } | null
}

/**
 * Website bookings + personal events on Calendar A, as busy intervals (Paris
 * minutes-of-day). Each consumes one unit of salon capacity. These are OUR
 * bookings, not yet reflected in Planity's public availability, so the capacity
 * engine subtracts them on top of Planity's free-practitioner count. Reads
 * individual events (not merged freebusy) so simultaneous bookings are counted.
 * Fails soft to [] on missing creds or any error.
 */
export async function getDayABusy(date: string): Promise<{ start: number; end: number; pool: string }[]> {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY || !process.env.GOOGLE_CALENDAR_ID) return []
  try {
    const calendar = getCalendarClient()
    const { dayStart, dayEnd } = parisDayBounds(date)
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', hour12: false,
    })
    const toMin = (iso?: string | null): number => {
      if (!iso) return 0
      const p = fmt.formatToParts(new Date(iso))
      return Number(p.find((x) => x.type === 'hour')?.value ?? 0) * 60 +
             Number(p.find((x) => x.type === 'minute')?.value ?? 0)
    }
    const res = await calendar.events.list({
      calendarId: CALENDAR_ID(), timeMin: dayStart, timeMax: dayEnd,
      singleEvents: true, orderBy: 'startTime', maxResults: 500,
    })
    return (res.data.items ?? [])
      .filter((e: CalEvent) =>
        !!e.start?.dateTime && !!e.end?.dateTime && e.status !== 'cancelled' && e.transparency !== 'transparent')
      .map((e: CalEvent) => ({
        start: toMin(e.start?.dateTime),
        end: toMin(e.end?.dateTime),
        pool: e.extendedProperties?.private?.pool ?? '',
      }))
  } catch (err) {
    console.error('[google-calendar] getDayABusy failed - returning []:', err)
    return []
  }
}

/**
 * Count today's appointments (for the admin stats widget).
 */
export async function countTodayEvents(): Promise<number> {
  // Use Paris local date so the count is correct regardless of server timezone
  const date = new Date().toLocaleDateString('fr-CA', { timeZone: 'Europe/Paris' }) // "YYYY-MM-DD"
  const { dayStart, dayEnd } = parisDayBounds(date)

  const calendar = getCalendarClient()

  const res = await calendar.events.list({
    calendarId: CALENDAR_ID(),
    privateExtendedProperty: [`${SOURCE_KEY}=${SOURCE_VALUE}`],
    timeMin: dayStart,
    timeMax: dayEnd,
    singleEvents: true,
    maxResults: 50,
  })

  return (res.data.items ?? []).length
}

/**
 * Get the private extended properties of a single calendar event.
 * Used by the PATCH handler to retrieve clientPhone when marking NO_SHOW.
 */
export async function getCalendarEventProps(
  eventId: string
): Promise<Record<string, string> | null> {
  try {
    const calendar = getCalendarClient()
    const res = await calendar.events.get({
      calendarId: CALENDAR_ID(),
      eventId,
    })
    return (res.data.extendedProperties?.private ?? null) as Record<string, string> | null
  } catch {
    return null
  }
}

export interface ActiveAppointmentInfo {
  id: string
  date: string       // ISO string (event start)
  timeSlot: string   // "HH:MM"
  serviceNames: string
  status: string
}

/**
 * Check whether a phone number already has an active (PENDING or CONFIRMED)
 * upcoming appointment. Returns the appointment info if found, null otherwise.
 */
export async function findActiveAppointmentForPhone(
  phone: string
): Promise<ActiveAppointmentInfo | null> {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY || !process.env.GOOGLE_CALENDAR_ID) return null

  try {
    const calendar = getCalendarClient()
    const now = new Date().toISOString()

    const res = await calendar.events.list({
      calendarId: CALENDAR_ID(),
      privateExtendedProperty: [`${SOURCE_KEY}=${SOURCE_VALUE}`],
      timeMin: now,
      singleEvents: true,
      maxResults: 100,
    })

    const events = res.data.items ?? []
    const normPhone = phone.replace(/[\s\-().]/g, '')

    for (const event of events) {
      const p = event.extendedProperties?.private
      if (!p) continue
      const status = p['status'] as string
      if (status !== 'PENDING' && status !== 'CONFIRMED') continue
      const eventPhone = (p['clientPhone'] ?? '').replace(/[\s\-().]/g, '')
      if (eventPhone !== normPhone) continue

      const startIso = event.start?.dateTime ?? ''
      return {
        id:           event.id ?? '',
        date:         startIso,
        timeSlot:     startIso.slice(11, 16),
        serviceNames: p['serviceNames'] ?? '',
        status,
      }
    }

    return null
  } catch {
    return null
  }
}

/**
 * Count pending appointments across the whole calendar.
 */
export async function countPendingEvents(): Promise<number> {
  const calendar = getCalendarClient()

  const res = await calendar.events.list({
    calendarId: CALENDAR_ID(),
    privateExtendedProperty: [`${SOURCE_KEY}=${SOURCE_VALUE}`],
    timeMin: new Date().toISOString(),
    singleEvents: true,
    maxResults: 500,
  })

  const events = res.data.items ?? []
  return events.filter(
    (e) => e.extendedProperties?.private?.['status'] === 'PENDING'
  ).length
}
