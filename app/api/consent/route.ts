import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { logConsent } from '@/lib/consent-log'
import { isRateLimited, getClientIp } from '@/lib/rate-limit'

const bodySchema = z.object({ choice: z.enum(['granted', 'denied']) })

// POST /api/consent - record the visitor's cookie-banner choice as proof of
// consent (RGPD art. 7-1). Fire-and-forget from the client; failures are silent
// so a logging hiccup never blocks the banner.
export async function POST(request: NextRequest): Promise<NextResponse> {
  const clientIp = getClientIp(request)

  // Light cap: a visitor toggling a few times is fine, a spray is not.
  if (isRateLimited(`consent:${clientIp}`, 20, 60 * 60 * 1000)) {
    return new NextResponse(null, { status: 429 })
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return new NextResponse(null, { status: 422 })

  try {
    await logConsent({
      choice: parsed.data.choice,
      ip: clientIp,
      userAgent: request.headers.get('user-agent') ?? '',
    })
  } catch (err) {
    console.error('[POST /api/consent]', err)
  }

  return new NextResponse(null, { status: 204 })
}
