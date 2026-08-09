import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { businessEmailSchema } from '@/lib/validations'
import { sendBusinessEmail } from '@/lib/mail'

// POST /api/email - admin only: send a branded email from the business to any
// recipient. Not stored (fire-and-forget outgoing message).
export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body: unknown = await request.json()
  const parsed = businessEmailSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    )
  }

  const { to, subject, body: message, greetingName } = parsed.data
  try {
    await sendBusinessEmail({ to, subject, body: message, greetingName })
  } catch (err) {
    console.error('[POST /api/email] send failed', err)
    return NextResponse.json({ error: "L'envoi de l'email a échoué." }, { status: 500 })
  }

  return new NextResponse(null, { status: 201 })
}
