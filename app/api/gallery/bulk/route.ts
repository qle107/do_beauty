import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { galleryBulkSchema } from '@/lib/validations'
import { bulkUpdateImages } from '@/lib/gallery-store'

// ─── POST /api/gallery/bulk - admin only ─────────────────────────────────
// Classify many images at once: set a category and/or add/remove tags and/or
// publish/feature flags. Tags are merged/pruned, never wiped.

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const body: unknown = await request.json()
    const parsed = galleryBulkSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation échouée', issues: parsed.error.flatten().fieldErrors },
        { status: 422 },
      )
    }

    const updated = await bulkUpdateImages(parsed.data)
    return NextResponse.json({ updated })
  } catch (error) {
    console.error('[POST /api/gallery/bulk]', error)
    return NextResponse.json({ error: 'Erreur lors de la mise à jour groupée' }, { status: 500 })
  }
}
