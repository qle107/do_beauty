import type { Metadata } from 'next'
import GalleryManager from '@/components/admin/GalleryManager'

export const metadata: Metadata = { title: 'Galerie' }

export default function AdminGalleryPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8">
        <h1 className="db-serif text-3xl text-[color:var(--db-ink)]">Galerie</h1>
        <p className="mt-1 text-sm text-[color:var(--db-ink-soft)]">
          Téléversez, classez et publiez les réalisations affichées sur le site public.
        </p>
      </header>
      <GalleryManager />
    </div>
  )
}
