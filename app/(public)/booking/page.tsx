import type { Metadata } from 'next'
import BookingForm from '@/components/booking/BookingForm'
import { CATEGORY_ORDER, type ServiceCategory } from '@/lib/utils'
import { getAllServices } from '@/lib/services-store'

export const metadata: Metadata = {
  title: 'Prendre rendez-vous · Do Beauty',
  description: 'Réservez votre rendez-vous chez Do Beauty, institut de beauté à Gentilly. Manucure, nail art, beauté du regard et soins.',
  alternates: { canonical: '/booking' },
}

type SearchParams = Promise<{ category?: string }>

function normalizeCategory(raw?: string): ServiceCategory | undefined {
  if (!raw) return undefined
  const upper = raw.toUpperCase()
  return CATEGORY_ORDER.includes(upper as ServiceCategory)
    ? (upper as ServiceCategory)
    : undefined
}

export default async function BookingPage({ searchParams }: { searchParams: SearchParams }) {
  const { category } = await searchParams
  const initialCategory = normalizeCategory(category)

  // Server-side read from the database - eliminates the client /api/services
  // fetch on first paint. Mobile users on slow networks saw a 500ms-2s blank.
  const services = await getAllServices()

  return (
    <div className="min-h-screen bg-cream pt-28 pb-24">
      <div className="mx-auto max-w-4xl px-6">
        {/* En-tête */}
        <div className="text-center mb-16">
          <p className="font-script text-coral text-3xl mb-2">Réservez votre moment</p>
          <h1 className="font-serif text-5xl font-light text-dark">Prendre rendez-vous</h1>
          <div className="h-px bg-coral/40 w-16 mx-auto mt-8" />
          <p className="font-sans text-sm text-dark/40 mt-4">
            Ouvert du lundi au samedi de 10h à 19h30 · avec ou sans rendez-vous · Paiement par carte ou en espèces
          </p>
        </div>

        <BookingForm initialCategory={initialCategory} initialServices={services} />
      </div>
    </div>
  )
}
