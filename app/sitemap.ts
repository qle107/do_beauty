import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'
import { landingPageSlugs } from '@/lib/seo/landing-pages'
import { blogPosts, blogPostSlugs } from '@/lib/blog/posts'
import { cities } from '@/lib/seo/cities'

export default function sitemap(): MetadataRoute.Sitemap {
  const core: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }> = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/menus', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/booking', priority: 0.95, changeFrequency: 'daily' },
    { path: '/galerie', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/conseils', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/terms', priority: 0.2, changeFrequency: 'yearly' },
    { path: '/privacy', priority: 0.2, changeFrequency: 'yearly' },
  ]

  // keyword SEO landing pages
  const landings = landingPageSlugs.map((slug) => ({
    path: `/${slug}`,
    priority: 0.85,
    changeFrequency: 'monthly' as const,
  }))

  // surrounding-city landing pages (Gentilly's neighbours)
  const cityPages = cities.map((c) => ({
    path: `/onglerie-${c.slug}`,
    priority: 0.75,
    changeFrequency: 'monthly' as const,
  }))

  // Conseils blog articles - carry each post's real updated date as lastModified
  const blogPages = blogPostSlugs.map((slug) => ({
    path: `/conseils/${slug}`,
    priority: 0.65,
    changeFrequency: 'monthly' as const,
    lastModified: blogPosts[slug].dateModified,
  }))

  // Only blog posts carry a meaningful lastmod; omit it elsewhere rather than
  // emit a fake uniform timestamp Google may distrust.
  const staticPages: MetadataRoute.Sitemap = [...core, ...landings, ...cityPages].map((entry) => ({
    url: `${site.url}${entry.path === '/' ? '' : entry.path}`,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }))

  const articlePages: MetadataRoute.Sitemap = blogPages.map((entry) => ({
    url: `${site.url}${entry.path}`,
    lastModified: entry.lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }))

  return [...staticPages, ...articlePages]
}
