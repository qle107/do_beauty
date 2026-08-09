import Link from 'next/link'
import { site } from '@/lib/site'

interface LegalPageProps {
  title: string
  children: React.ReactNode
}

export default function LegalPage({ title, children }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-cream pt-28 pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <Link href="/" className="font-sans text-xs text-dark/40 hover:text-coral transition-colors">
          ← Retour à l&apos;accueil
        </Link>
        <h1 className="font-serif text-4xl md:text-5xl font-light text-dark mt-8 mb-10">{title}</h1>
        <div className="font-sans text-sm text-charcoal-500 leading-relaxed flex flex-col gap-6">
          {children}
        </div>
        <p className="font-sans text-xs text-dark/40 mt-12">
          {site.name} - {site.address.street}, {site.address.city} - {site.email}
        </p>
      </div>
    </div>
  )
}
