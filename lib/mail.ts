import nodemailer from 'nodemailer'
import { site } from '@/lib/site'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Bound the SMTP conversation so a stalled mail server can't hang the request.
  connectionTimeout: 10_000,  // establishing the TCP connection
  greetingTimeout:   10_000,  // waiting for the server greeting
  socketTimeout:     15_000,  // inactivity once connected
})

interface BookingServiceItem {
  name: string
  price: number
  duration: number
}

interface BookingAlertData {
  clientName: string
  clientPhone: string
  services: BookingServiceItem[]
  totalPrice: number
  totalDuration: number
  date: string
  timeSlot: string
  notes?: string
  clientIp?: string
  deviceId?: string
  fingerprint?: string
  priorNoShows?: number
  photoCount?: number
  employee?: string   // preferred practitioner requested by the client (optional)
}

interface MailAttachment {
  filename: string
  content: Buffer
  contentType: string
}

interface ContactData {
  senderName: string
  senderEmail: string
  subject: string
  message: string
}

// ─── HTML escaping (defense-in-depth for user-supplied values) ────────────

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// ─── Template de base ─────────────────────────────────────────────────────

function baseTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Do Beauty</title>
</head>
<body style="margin:0;padding:0;background-color:#F5F1EA;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F1EA;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- En-tête -->
          <tr>
            <td style="background-color:#171614;padding:32px 40px;text-align:center;">
              <h1 style="color:#FAF8F4;font-size:28px;font-weight:400;margin:0;letter-spacing:4px;">Do Beauty</h1>
              <p style="color:#C8A66A;margin:6px 0 0;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Institut de beauté · Gentilly</p>
            </td>
          </tr>
          <!-- Contenu -->
          <tr>
            <td style="background-color:#FAF8F4;padding:40px;">
              ${content}
            </td>
          </tr>
          <!-- Pied de page -->
          <tr>
            <td style="background-color:#171614;padding:24px 40px;text-align:center;">
              <p style="color:#A89882;font-size:12px;margin:0;">© ${new Date().getFullYear()} ${site.name} - ${site.address.street}, ${site.address.city}</p>
              <p style="color:#A89882;font-size:12px;margin:8px 0 0;">📞 ${site.phone.display} &nbsp;|&nbsp; <a href="mailto:${site.email}" style="color:#C8A66A;text-decoration:none;">${site.email}</a></p>
              <p style="color:#666;font-size:11px;margin:8px 0 0;font-style:italic;">Paiement par carte ou en espèces</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ─── 1. Alerte nouveau RDV → Admin (email client supprimé) ───────────────

function bookingAlertHtml(data: BookingAlertData): string {
  const serviceRows = data.services
    .map(
      (s) =>
        `<tr>
          <td style="padding:6px 0;border-bottom:1px solid #FCE7F3;color:#831843;font-size:14px;">${s.name}</td>
          <td style="padding:6px 0;border-bottom:1px solid #FCE7F3;text-align:center;color:#A8B0B8;font-size:13px;">${s.duration} min</td>
          <td style="padding:6px 0;border-bottom:1px solid #FCE7F3;text-align:right;color:#EC4899;font-size:14px;">${s.price} €</td>
        </tr>`
    )
    .join('')

  return baseTemplate(`
    <h2 style="color:#831843;font-size:26px;font-weight:400;margin:0 0 24px;">
      Nouveau rendez-vous reçu
    </h2>

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FDF2F8;border-radius:6px;margin-bottom:20px;">
      <tr>
        <td style="padding:24px 28px;">
          <h3 style="color:#831843;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px;">Coordonnées client</h3>
          <p style="margin:0 0 6px;color:#831843;font-size:14px;"><strong>Nom :</strong> ${escapeHtml(data.clientName)}</p>
          <p style="margin:0;color:#831843;font-size:14px;"><strong>Téléphone :</strong> ${escapeHtml(data.clientPhone)}</p>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FDF2F8;border-radius:6px;margin-bottom:20px;">
      <tr>
        <td style="padding:24px 28px;">
          <h3 style="color:#831843;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px;">Prestations réservées</h3>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${serviceRows}
            <tr>
              <td colspan="2" style="padding:10px 0 0;color:#831843;font-size:14px;font-weight:600;">Total</td>
              <td style="padding:10px 0 0;text-align:right;color:#EC4899;font-size:18px;font-weight:600;">${data.totalPrice} €</td>
            </tr>
          </table>
          <p style="margin:8px 0 0;color:#A8B0B8;font-size:13px;">Durée totale : ${data.totalDuration} min</p>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FDF2F8;border-radius:6px;">
      <tr>
        <td style="padding:24px 28px;">
          <h3 style="color:#831843;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px;">Date & Heure</h3>
          <p style="margin:0 0 6px;color:#831843;font-size:14px;"><strong>Date :</strong> ${data.date}</p>
          <p style="margin:0;color:#831843;font-size:14px;"><strong>Heure :</strong> ${data.timeSlot}</p>
          ${data.employee ? `<p style="margin:6px 0 0;color:#831843;font-size:14px;"><strong>Praticienne demandée :</strong> ${escapeHtml(data.employee)}</p>` : ''}
          ${data.notes ? `<p style="margin:6px 0 0;color:#831843;font-size:14px;"><strong>Remarques :</strong> ${escapeHtml(data.notes)}</p>` : ''}
          ${(data.photoCount ?? 0) > 0 ? `<p style="margin:6px 0 0;color:#831843;font-size:14px;"><strong>📎 ${data.photoCount} photo(s) de référence</strong> jointe(s) à cet email.</p>` : ''}
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FDF2F8;border-radius:6px;margin-top:20px;">
      <tr>
        <td style="padding:24px 28px;">
          <h3 style="color:#831843;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px;">Suivi anti-absence (interne)</h3>
          ${(data.priorNoShows ?? 0) > 0 ? `<p style="margin:0 0 14px;padding:10px 14px;background-color:#FEE2E2;border-radius:4px;color:#B91C1C;font-size:13px;font-weight:600;">⚠️ Cet appareil a déjà ${data.priorNoShows} absence(s) non justifiée(s) enregistrée(s).</p>` : ''}
          <p style="margin:0 0 6px;color:#831843;font-size:14px;"><strong>Adresse IP :</strong> ${escapeHtml(data.clientIp ?? 'inconnue')}</p>
          <p style="margin:0 0 6px;color:#831843;font-size:14px;"><strong>Appareil :</strong> ${escapeHtml(data.deviceId || 'inconnu')}</p>
          <p style="margin:0;color:#831843;font-size:14px;"><strong>Empreinte :</strong> ${escapeHtml(data.fingerprint || 'indisponible')}</p>
        </td>
      </tr>
    </table>
  `)
}

// ─── 3. Notification contact → Admin ──────────────────────────────────────

function contactNotificationHtml(data: ContactData): string {
  return baseTemplate(`
    <h2 style="color:#831843;font-size:26px;font-weight:400;margin:0 0 24px;">
      Nouveau message via le formulaire de contact Do Beauty
    </h2>

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FDF2F8;border-radius:6px;margin-bottom:20px;">
      <tr>
        <td style="padding:24px 28px;">
          <p style="margin:0 0 6px;color:#831843;font-size:14px;"><strong>Expéditeur :</strong> ${escapeHtml(data.senderName)}</p>
          <p style="margin:0 0 6px;color:#831843;font-size:14px;"><strong>Email :</strong> <a href="mailto:${escapeHtml(data.senderEmail)}" style="color:#EC4899;">${escapeHtml(data.senderEmail)}</a></p>
          <p style="margin:0;color:#831843;font-size:14px;"><strong>Objet :</strong> ${escapeHtml(data.subject)}</p>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FDF2F8;border-radius:6px;">
      <tr>
        <td style="padding:24px 28px;">
          <h3 style="color:#831843;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 14px;">Message</h3>
          <p style="color:#831843;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
        </td>
      </tr>
    </table>
  `)
}

// ─── Fonctions publiques d'envoi ──────────────────────────────────────────

// sendBookingConfirmation supprimée - plus d'email client.

export async function sendBookingAlert(
  data: BookingAlertData,
  attachments?: MailAttachment[]
): Promise<void> {
  const serviceNames = data.services.map((s) => s.name).join(' + ')
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: [process.env.ADMIN_EMAIL, process.env.BOOKING_NOTIFY_EMAIL].filter(Boolean) as string[],
    subject: `Nouveau RDV : ${data.clientName} - ${serviceNames} le ${data.date}`,
    html: bookingAlertHtml(data),
    attachments,
  })
}

export async function sendContactNotification(data: ContactData): Promise<void> {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.ADMIN_EMAIL,
    replyTo: data.senderEmail,
    subject: `Message de contact Do Beauty : ${data.subject}`,
    html: contactNotificationHtml(data),
  })
}

// ─── 4. Réponse admin → client ────────────────────────────────────────────

interface ContactReplyData {
  to: string
  customerName: string
  subject: string   // original subject (without the "Re:" prefix)
  body: string
}

function contactReplyHtml(data: ContactReplyData): string {
  return baseTemplate(`
    <h2 style="color:#831843;font-size:26px;font-weight:400;margin:0 0 24px;">
      Bonjour ${escapeHtml(data.customerName)},
    </h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FDF2F8;border-radius:6px;">
      <tr>
        <td style="padding:24px 28px;">
          <p style="color:#831843;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap;">${escapeHtml(data.body)}</p>
        </td>
      </tr>
    </table>
    <p style="color:#A8B0B8;font-size:13px;margin:24px 0 0;">
      Ceci est une réponse à votre message « ${escapeHtml(data.subject)} ».
    </p>
  `)
}

export async function sendContactReply(data: ContactReplyData): Promise<void> {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: data.to,
    subject: `Re: ${data.subject}`,
    html: contactReplyHtml(data),
  })
}

// ─── 5. Email générique depuis l'entreprise ───────────────────────────────
// Reusable branded sender: any recipient, any subject, plain-text body wrapped
// in the Do Beauty template. Unlike sendContactReply it adds no "Re:" prefix
// and no reply footer, so it's the general-purpose "send an email" function.

interface BusinessEmailData {
  to: string
  subject: string
  body: string
  greetingName?: string   // optional "Bonjour {name}," heading
}

function businessEmailHtml(data: BusinessEmailData): string {
  const greeting = data.greetingName
    ? `<h2 style="color:#831843;font-size:26px;font-weight:400;margin:0 0 24px;">Bonjour ${escapeHtml(data.greetingName)},</h2>`
    : ''
  return baseTemplate(`
    ${greeting}
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FDF2F8;border-radius:6px;">
      <tr>
        <td style="padding:24px 28px;">
          <p style="color:#831843;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap;">${escapeHtml(data.body)}</p>
        </td>
      </tr>
    </table>
  `)
}

export async function sendBusinessEmail(data: BusinessEmailData): Promise<void> {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: data.to,
    subject: data.subject,
    html: businessEmailHtml(data),
  })
}

