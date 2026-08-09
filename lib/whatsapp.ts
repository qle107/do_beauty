import { formatDuration } from '@/lib/utils'

/**
 * WhatsApp notifications via CallMeBot (free, no subscription needed).
 *
 * Setup (one-time, 2 minutes):
 *  1. Save the number +34 644 65 21 91 in your WhatsApp contacts as "CallMeBot"
 *  2. Send the message:  I allow callmebot to send me messages
 *  3. You'll receive your API key by WhatsApp within seconds
 *  4. Add to .env.local:
 *       CALLMEBOT_PHONE=33612345678   ← your number, no + prefix, no spaces
 *       CALLMEBOT_APIKEY=123456       ← the key you received
 */

interface WhatsAppAlertData {
  services: { name: string; price: number; duration: number }[]
  totalPrice: number
  totalDuration: number
  date: string      // human-readable, e.g. "lundi 26 mai 2026"
  timeSlot: string  // "HH:MM"
  employee?: string // preferred practitioner (staff name, not client PII)
}

export async function sendWhatsAppAlert(data: WhatsAppAlertData): Promise<void> {
  const phone  = process.env.CALLMEBOT_PHONE
  const apiKey = process.env.CALLMEBOT_APIKEY

  if (!phone || !apiKey) {
    console.warn('[whatsapp] CALLMEBOT_PHONE or CALLMEBOT_APIKEY not set - skipping WhatsApp alert')
    return
  }

  const serviceLines = data.services
    .map((s) => `  - ${s.name} (${formatDuration(s.duration, 'compact')}) ${s.price}€`)
    .join('\n')

  // GDPR: no client PII (name / phone / notes) is sent to CallMeBot - only
  // non-identifying booking logistics. Full client details are in the admin
  // email + Google Calendar.
  // TODO: CallMeBot is an unvetted third party with no DPA and requires the
  // apikey in the URL. Migrate to a DPA-backed provider (e.g. WhatsApp Business API).
  const lines = [
    '📅 *Nouveau RDV Do Beauty*',
    `🗓 ${data.date} à ${data.timeSlot}`,
    '',
    '*Prestations :*',
    serviceLines,
    '',
    `💰 Total : ${data.totalPrice}€ - ${formatDuration(data.totalDuration, 'compact')}`,
    ...(data.employee ? ['', `👩‍🎨 Praticienne demandée : ${data.employee}`] : []),
    '',
    'Détails client (nom, téléphone) : voir email / agenda.',
  ]

  const text = encodeURIComponent(lines.join('\n'))
  const url  = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${text}&apikey=${apiKey}`

  // Abort a hung CallMeBot request so this fire-and-forget call can't pile up.
  const response = await fetch(url, { signal: AbortSignal.timeout(8_000) })
  if (!response.ok) {
    // Log status only — never the raw third-party response body (may echo account
    // or diagnostic details into our logs).
    console.error(`[whatsapp] CallMeBot error ${response.status}`)
  }
}
