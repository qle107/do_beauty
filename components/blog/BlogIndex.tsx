import Link from 'next/link'
import type { BlogPost } from '@/lib/blog/posts'

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

export default function BlogIndex({ posts }: { posts: readonly BlogPost[] }) {
  return (
    <div className="min-h-screen bg-cream pt-28 pb-24">
      {/* En-tête */}
      <div className="mx-auto max-w-4xl px-6 text-center mb-20">
        <p className="font-script text-coral text-3xl mb-3">Nos</p>
        <h1 className="font-serif text-5xl md:text-6xl font-light text-dark">Conseils</h1>
        <div className="h-px bg-coral/40 w-24 mx-auto mt-8" />
        <p className="font-sans text-sm text-charcoal-500 mt-6 tracking-wide">
          Entretien, techniques, tendances : les conseils de Vy pour de beaux ongles
        </p>
      </div>

      {/* Liste des articles */}
      <div className="mx-auto max-w-3xl px-6">
        <ul className="divide-y divide-dark/10 border-y border-dark/10">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/conseils/${post.slug}`}
                className="block py-8 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
              >
                <p className="font-sans text-xs text-dark/45 tracking-wider mb-3">
                  <time dateTime={post.datePublished}>{dateFormatter.format(new Date(post.datePublished))}</time>
                  <span className="mx-2" aria-hidden="true">·</span>
                  {post.readingMinutes} min de lecture
                </p>
                <h2 className="font-serif text-2xl md:text-3xl font-light text-dark group-hover:text-coral transition-colors leading-tight mb-3">
                  {post.title}
                </h2>
                <p className="font-sans text-sm text-charcoal-500 leading-relaxed">
                  {post.excerpt}
                </p>
                <span className="inline-block mt-4 font-sans text-sm text-coral">
                  Lire l&apos;article <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
