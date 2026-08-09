import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getContact, addContactReply } from '@/lib/contacts'
import { sendContactReply } from '@/lib/mail'

type Ctx = { params: Promise<{ id: string }> }

// POST /api/contact/[id]/reply - admin only. Body: { body: string }
export async function POST(request: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const payload = (await request.json()) as { body?: string }
  const body = (payload.body ?? '').trim()
  if (body.length < 1 || body.length > 2000) {
    return NextResponse.json({ error: 'Le message doit comporter entre 1 et 2000 caractères.' }, { status: 422 })
  }

  const msg = await getContact(id)
  if (!msg) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Send first; only record the reply if the email actually went out.
  try {
    await sendContactReply({ to: msg.email, customerName: msg.name, subject: msg.subject, body })
  } catch (err) {
    console.error('[POST /api/contact/[id]/reply] send failed', err)
    return NextResponse.json({ error: "L'envoi de l'email a échoué." }, { status: 500 })
  }

  await addContactReply(id, body)
  return new NextResponse(null, { status: 201 })
}
