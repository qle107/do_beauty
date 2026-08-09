import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { serviceSchema } from '@/lib/validations'
import { getAllServices, getAllServicesAdmin, createService } from '@/lib/services-store'
import type { ServiceCategory } from '@/lib/types'

const VALID_CATEGORIES: string[] = [
  'FORFAIT', 'MAINS', 'PIEDS', 'CAPSULE', 'NAIL_ART',
  'CILS', 'VISAGE', 'CORPS', 'EPILATION',
]

// ─── GET /api/services - public, optional ?category= ─────────────────────
// NOTE: auth() is NOT called here for public requests to avoid hanging
// when NEXTAUTH_SECRET is not yet configured.

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const categoryParam = searchParams.get('category')
    const adminParam    = searchParams.get('admin') === 'true'

    // Admin-only: return full list including inactive services
    if (adminParam) {
      const session = await auth()
      if (!session?.user) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
      }
      return NextResponse.json(await getAllServicesAdmin())
    }

    // Public: active services only, optional category + featured filters
    const category =
      categoryParam && VALID_CATEGORIES.includes(categoryParam)
        ? (categoryParam as ServiceCategory)
        : undefined

    const featuredOnly = searchParams.get('featured') === 'true'

    let services = await getAllServices(category)
    if (featuredOnly) services = services.filter((s) => s.featured === true)

    return NextResponse.json(services)
  } catch (error) {
    console.error('[GET /api/services]', error)
    return NextResponse.json(
      { error: 'Erreur lors du chargement des prestations' },
      { status: 500 }
    )
  }
}

// ─── POST /api/services - admin only ─────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body: unknown = await request.json()
    const parsed = serviceSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation échouée', issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      )
    }

    const service = await createService(parsed.data)
    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('[POST /api/services]', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la prestation' },
      { status: 500 }
    )
  }
}
