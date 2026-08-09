import { jsonLd } from '@/lib/seo/schema'

/**
 * Inline JSON-LD script. Render as a server component so it lands in initial HTML.
 * Multiple schema objects can be passed; each renders to its own <script>.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data]
  return (
    <>
      {items.map((item, i) => (
        <script
          // Multiple JSON-LD blocks are allowed and indexed independently by Google.
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(item) }}
        />
      ))}
    </>
  )
}
