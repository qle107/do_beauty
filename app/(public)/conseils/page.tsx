import type { Metadata } from 'next'
import BlogIndex from '@/components/blog/BlogIndex'
import { blogPostsByDate } from '@/lib/blog/posts'

export const metadata: Metadata = {
  title: 'Conseils ongles & semi-permanent à Gentilly · Do Beauty',
  description:
    'Entretien du semi-permanent, gel ou semi-permanent, durée de tenue : les conseils de l’équipe Do Beauty, prothésistes ongulaires à Gentilly, pour de beaux ongles.',
  alternates: { canonical: '/conseils' },
  openGraph: {
    title: 'Conseils ongles & semi-permanent · Do Beauty',
    description:
      'Les conseils de l’équipe Do Beauty, prothésistes ongulaires à Gentilly : entretien, techniques et tendances.',
    url: '/conseils',
    type: 'website',
  },
}

export default function Page() {
  return <BlogIndex posts={blogPostsByDate} />
}
