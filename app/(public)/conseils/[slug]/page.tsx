import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogArticle from '@/components/blog/BlogArticle'
import { blogPosts, getPostBySlug } from '@/lib/blog/posts'

type Params = Promise<{ slug: string }>

export function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.meta.title,
    description: post.meta.description,
    alternates: { canonical: `/conseils/${post.slug}` },
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      url: `/conseils/${post.slug}`,
      type: 'article',
      images: ['/images/dob/g1.jpg'],
    },
  }
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()
  return <BlogArticle post={post} />
}
