import type { Metadata } from 'next'
import ContactPageClient from '@/components/contact/ContactPageClient'

export const metadata: Metadata = {
  title: 'Contact & accès · Do Beauty à Gentilly',
  description:
    'Contactez Do Beauty à Gentilly : adresse, horaires 7j/7, téléphone et formulaire. Institut de beauté & nail salon aux portes de Paris (94).',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact & accès · Do Beauty à Gentilly',
    description: 'Adresse, horaires et formulaire de contact de l’institut Do Beauty à Gentilly.',
    url: '/contact',
    type: 'website',
    images: ['/images/dob/g1.jpg'],
  },
}

export default function ContactPage() {
  return <ContactPageClient />
}
