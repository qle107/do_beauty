import { site } from '@/lib/site'

/**
 * Builders for "add to calendar" links and an RFC 5545 ICS file that
 * Apple Calendar, Outlook and Google all accept.
 *
 * Times are expressed as TZID=Europe/Paris floating wall-clock - both Google
 * URL params and the ICS file consume this consistently, no DST math required.
 */

export type BookingForCalendar = {
  /** Date in ISO YYYY-MM-DD (Paris wall-clock). */
  date: string
  /** "HH:MM" 24h (Paris wall-clock). */
  timeSlot: string
  /** Total duration in minutes. */
  durationMinutes: number
  /** Service titles concatenated, used in the event title. */
  serviceNames: string
  /** Total in euros. */
  totalPrice: number
}

// ─── Time math (Paris wall-clock, no UTC conversion) ──────────────────────

/**
 * Returns a Date that, when its UTC components are read, looks like the Paris
 * wall-clock time. We never display this Date through `toLocaleString`; we only
 * use its UTC getters to format ICS / URL strings.
 */
function parseWallClock(date: string, timeSlot: string): Date {
  // "2026-06-21" + "14:00" → Date with UTC components 2026-06-21 14:00
  // We append Z so the ISO parser treats the components as UTC, which lets us
  // recover them later via getUTCXxx methods.
  return new Date(`${date}T${timeSlot}:00Z`)
}

function addMinutes(d: Date, minutes: number): Date {
  return new Date(d.getTime() + minutes * 60_000)
}

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

/** Format as "20260621T140000" (no Z) - local wall-clock for TZID=Europe/Paris. */
function formatLocal(d: Date): string {
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds())
  )
}

// ─── ICS file ─────────────────────────────────────────────────────────────

function escapeIcsText(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

function eventSummary(b: BookingForCalendar): string {
  return `${site.name} - ${b.serviceNames}`
}

function eventDescription(b: BookingForCalendar): string {
  return [
    `Rendez-vous chez ${site.name}.`,
    `Prestation(s) : ${b.serviceNames}.`,
    `Durée : ${b.durationMinutes} min.`,
    `Total : ${b.totalPrice} €.`,
    `Paiement par carte ou en espèces.`,
    `Adresse : ${site.address.street}, ${site.address.city}.`,
    `Téléphone : ${site.phone.display}.`,
  ].join('\\n')
}

const ICS_LOCATION = `${site.address.street}, ${site.address.city}`

export function buildIcsString(b: BookingForCalendar): string {
  const start = parseWallClock(b.date, b.timeSlot)
  const end = addMinutes(start, b.durationMinutes)
  const dtStart = formatLocal(start)
  const dtEnd = formatLocal(end)
  // dtstamp must be UTC - use generation time
  const dtStamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '').replace(/Z$/, 'Z')
  const uid = `dobeauty-${b.date}-${b.timeSlot.replace(':', '')}@dobeauty.fr`

  // Lines must be CRLF and max 75 octets, but for short fields no folding needed.
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Do Beauty//Booking//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART;TZID=Europe/Paris:${dtStart}`,
    `DTEND;TZID=Europe/Paris:${dtEnd}`,
    `SUMMARY:${escapeIcsText(eventSummary(b))}`,
    `DESCRIPTION:${eventDescription(b)}`,
    `LOCATION:${escapeIcsText(ICS_LOCATION)}`,
    `URL:${site.url}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeIcsText('Rappel : rendez-vous demain chez ' + site.name)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function buildIcsDataUrl(b: BookingForCalendar): string {
  const ics = buildIcsString(b)
  // Use base64 encoding so iOS Safari doesn't trip on the % sign in date stamps.
  if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    return `data:text/calendar;charset=utf-8;base64,${window.btoa(unescape(encodeURIComponent(ics)))}`
  }
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`
}

// ─── Google Calendar URL ──────────────────────────────────────────────────

export function buildGoogleCalendarUrl(b: BookingForCalendar): string {
  const start = parseWallClock(b.date, b.timeSlot)
  const end = addMinutes(start, b.durationMinutes)
  const dates = `${formatLocal(start)}/${formatLocal(end)}`
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventSummary(b),
    dates,
    ctz: 'Europe/Paris',
    details: eventDescription(b).replace(/\\n/g, '\n'),
    location: ICS_LOCATION,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

// ─── Outlook (web) URL ────────────────────────────────────────────────────

export function buildOutlookCalendarUrl(b: BookingForCalendar): string {
  // Outlook web expects ISO timestamps. Send local Paris wall-clock - the user
  // is in France, Outlook will treat the time as local on import.
  const start = parseWallClock(b.date, b.timeSlot)
  const end = addMinutes(start, b.durationMinutes)
  const startStr =
    `${start.getUTCFullYear()}-${pad(start.getUTCMonth() + 1)}-${pad(start.getUTCDate())}T${pad(start.getUTCHours())}:${pad(start.getUTCMinutes())}:00`
  const endStr =
    `${end.getUTCFullYear()}-${pad(end.getUTCMonth() + 1)}-${pad(end.getUTCDate())}T${pad(end.getUTCHours())}:${pad(end.getUTCMinutes())}:00`
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    startdt: startStr,
    enddt: endStr,
    subject: eventSummary(b),
    body: eventDescription(b).replace(/\\n/g, '\n'),
    location: ICS_LOCATION,
  })
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
}
