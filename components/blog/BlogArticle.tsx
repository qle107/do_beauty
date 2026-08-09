import Link from 'next/link'
import type { ContentBlock } from '@/lib/seo/landing-pages'
import type { BlogPost } from '@/lib/blog/posts'
import { articleSchema, breadcrumbSchema, faqPageSchema } from '@/lib/seo/schema'
import JsonLd from '@/components/seo/JsonLd'

function Block({ block }: { block: ContentBlock }) {
  if (block.kind === 'paragraph') {
    return (
      <p className="font-sans text-base text-charcoal-500 leading-relaxed mb-4">
        {block.text}
      </p>
    )
  }
  if (block.kind === 'list') {
    return (
      <ul className="flex flex-col gap-2 mb-6">
        {block.items.map((item) => (
          <li key={item} className="flex items-start gap-3 font-sans text-base text-charcoal-500 leading-relaxed">
            <span aria-hidden="true" className="text-coral font-serif mt-1 shrink-0">-</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )
  }
  return (
    <div className="mb-6 border border-dark/10">
      <table className="w-full text-sm font-sans">
        <tbody>
          {block.rows.map((row) => (
            <tr key={row.label} className="border-b border-dark/8 last:border-b-0">
              <td className="px-4 py-3 text-dark/75">{row.label}</td>
              <td className="px-4 py-3 text-right font-serif text-lg text-coral">{row.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

export default function BlogArticle({ post }: { post: BlogPost }) {
  const breadcrumbs = breadcrumbSchema([
    { name: 'Accueil', url: '/' },
    { name: 'Conseils', url: '/conseils' },
    { name: post.title, url: `/conseils/${post.slug}` },
  ])

  const schemas: object[] = [
    breadcrumbs,
    articleSchema({
      headline: post.title,
      description: post.meta.description,
      slug: post.slug,
      datePublished: post.datePublished,
      dateModified: post.dateModified,
    }),
  ]
  if (post.faqs?.length) {
    schemas.push(faqPageSchema(post.faqs))
  }

  return (
    <article className="bg-cream">
      {/* Hero */}
      <header className="bg-blush py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <nav aria-label="Fil d'Ariane" className="font-sans text-xs text-dark/45 mb-6 tracking-wider">
            <Link href="/" className="hover:text-coral transition-colors">Accueil</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <Link href="/conseils" className="hover:text-coral transition-colors">Conseils</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span>{post.title}</span>
          </nav>
          <p className="font-sans text-xs text-dark/45 tracking-wider mb-4">
            <time dateTime={post.datePublished}>{dateFormatter.format(new Date(post.datePublished))}</time>
            <span className="mx-2" aria-hidden="true">·</span>
            {post.readingMinutes} min de lecture
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-dark leading-tight mb-6">
            {post.title}
          </h1>
          <div className="h-px w-16 bg-coral/50 mb-6" />
          <p className="font-serif text-lg md:text-xl text-charcoal-500 font-light leading-relaxed">
            {post.excerpt}
          </p>
        </div>
      </header>

      {/* Content sections */}
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        {post.sections.map((section, i) => (
          <section key={section.h2} className={i === 0 ? '' : 'mt-14 pt-14 border-t border-dark/8'}>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-dark mb-8 leading-tight">
              {section.h2}
            </h2>
            <div>
              {section.blocks.map((block, idx) => (
                <Block key={idx} block={block} />
              ))}
            </div>
          </section>
        ))}

        {/* FAQ */}
        {post.faqs?.length ? (
          <section className="mt-16 pt-16 border-t border-dark/8" id="faq">
            <h2 className="font-serif text-3xl md:text-4xl font-light text-dark mb-10 leading-tight">
              Questions fréquentes
            </h2>
            <div className="divide-y divide-dark/10 border-y border-dark/10">
              {post.faqs.map((faq) => (
                <details key={faq.question} className="group py-5">
                  <summary className="flex items-start justify-between gap-6 cursor-pointer list-none font-sans text-base text-dark hover:text-coral transition-colors">
                    <span className="flex-1">{faq.question}</span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 mt-1 text-dark/40 group-open:rotate-45 transition-transform duration-200"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </summary>
                  <p className="font-sans text-sm text-charcoal-500 leading-relaxed mt-3 pr-10">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        {/* Related */}
        <section className="mt-16 pt-16 border-t border-dark/8">
          <h2 className="font-serif text-2xl md:text-3xl font-light text-dark mb-8">
            Pour aller plus loin
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {post.related.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="block border border-dark/10 hover:border-coral/40 hover:bg-blush/50 transition-colors px-5 py-4 font-sans text-sm text-dark group"
                >
                  <span className="group-hover:text-coral transition-colors">{r.label}</span>
                  <span className="text-coral ml-1" aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Final CTA */}
        <div className="mt-16 pt-16 border-t border-dark/8 text-center">
          <p className="font-script text-coral text-3xl mb-4">Prête à franchir le pas ?</p>
          <h3 className="font-serif text-3xl font-light text-dark mb-8">
            Réservez votre prochain rendez-vous
          </h3>
          <Link
            href="/booking"
            className="inline-block bg-dark text-cream text-sm px-12 py-4 tracking-widest font-sans hover:bg-coral-dark transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          >
            Réserver maintenant →
          </Link>
        </div>
      </div>

      <JsonLd data={schemas} />
    </article>
  )
}
