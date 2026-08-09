import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { contactSchema } from '@/lib/validations'
import { sendContactNotification } from '@/lib/mail'
import { addContact, listContacts } from '@/lib/contacts'
import { isRateLimited, getClientIp } from '@/lib/rate-limit'
import { verifyTurnstile } from '@/lib/turnstile'

// POST /api/contact - emails the owner AND stores the message (name, email,
// subject, message, client IP) for the admin inbox
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: unknown = await request.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      )
    }

    const { name, email, subject, message, turnstileToken } = parsed.data
    const clientIp = getClientIp(request)

    // ── Anti-abuse check 0: IP rate limit (max 5 messages / IP / hour) ────
    if (isRateLimited(`contact:${clientIp}`, 5, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Trop de messages. Veuillez réessayer plus tard.' },
        { status: 429 }
      )
    }

    // ── Anti-abuse check 0b: Cloudflare Turnstile token ───────────────────
    const turnstileOk = await verifyTurnstile(turnstileToken ?? '', clientIp)
    if (!turnstileOk) {
      return NextResponse.json(
        { error: 'Échec de la vérification de sécurité. Veuillez recharger la page et réessayer.' },
        { status: 403 }
      )
    }

    await sendContactNotification({ senderName: name, senderEmail: email, subject, message })

    // Store for the admin inbox. A storage hiccup must not fail the customer's
    // submission — the email already went out — so log and continue.
    try {
      await addContact({ name, email, subject, message, clientIp })
    } catch (err) {
      console.error('[POST /api/contact] store failed', err)
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/contact]', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}

// GET /api/contact - admin only: list stored contact messages
export async function GET(): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(await listContacts())
}
