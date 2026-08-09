import { site } from '@/lib/site'

const BUSINESS_ID = `${site.url}/#business`
const PERSON_ID = `${site.url}/#owner`

/**
 * Combined LocalBusiness + BeautySalon JSON-LD for DO BEAUTY.
 * Embed once on the homepage; reference by @id elsewhere.
 */
export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'BeautySalon', 'NailSalon'],
    '@id': BUSINESS_ID,
    name: site.name,
    alternateName: ['Do Beauty', 'Do Beauty Nails', 'Do Beauty & Nails'],
    legalName: site.legalName,
    description: site.description,
    url: site.url,
    telephone: site.phone.tel,
    email: site.email,
    image: [
      `${site.url}/images/entrance.png`,
      `${site.url}/images/dob/g1.jpg`,
      `${site.url}/images/dob/g5.jpg`,
      `${site.url}/images/dob/g2.jpg`,
    ],
    logo: `${site.url}/icon.svg`,
    priceRange: '€€',
    currenciesAccepted: 'EUR',
    paymentAccepted: site.paymentAccepted.join(', '),
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.cityName,
      postalCode: site.address.postalCode,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    areaServed: site.areaServed.map((name) => ({ '@type': 'City', name })),
    // openingHoursSpecification intentionally omitted: only "opens 11 AM, 7 days"
    // is confirmed — closing time is unknown, so we don't assert full hours.
    sameAs: [site.social.instagram, site.social.tiktok, site.social.planity].filter(Boolean),
    hasMap: site.social.googleBusiness,
    // aggregateRating intentionally omitted (self-serving review markup is
    // ineligible for star rich results; stars surface via the Google profile).
  }
}

/** WebSite node; publisher references the LocalBusiness by @id. */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    name: site.name,
    url: site.url,
    publisher: { '@id': BUSINESS_ID },
    inLanguage: 'fr-FR',
  }
}

/** Owner Person for E-E-A-T (rendered on /about). */
export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Do Beauty',
    jobTitle: 'Institut de beauté',
    worksFor: { '@id': BUSINESS_ID },
    sameAs: [site.social.instagram],
  }
}

type FaqEntry = { question: string; answer: string }

export function faqPageSchema(entries: readonly FaqEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((e) => ({
      '@type': 'Question',
      name: e.question,
      acceptedAnswer: { '@type': 'Answer', text: e.answer },
    })),
  }
}

type Crumb = { name: string; url: string }

export function breadcrumbSchema(crumbs: readonly Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url.startsWith('http') ? c.url : `${site.url}${c.url}`,
    })),
  }
}

type ServiceSchemaInput = {
  name: string
  description: string
  serviceType: string
  price: number
  slug: string
  city?: string
}

export function serviceSchema(s: ServiceSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: s.serviceType,
    name: s.name,
    description: s.description,
    provider: { '@id': BUSINESS_ID },
    areaServed: { '@type': 'City', name: s.city ?? site.address.cityName },
    offers: {
      '@type': 'Offer',
      price: s.price.toString(),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: `${site.url}/booking?service=${s.slug}`,
    },
  }
}

type ArticleSchemaInput = {
  headline: string
  description: string
  slug: string
  datePublished: string
  dateModified: string
}

export function articleSchema(a: ArticleSchemaInput) {
  const url = `${site.url}/conseils/${a.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: a.headline,
    description: a.description,
    datePublished: a.datePublished,
    dateModified: a.dateModified,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    author: { '@type': 'Organization', '@id': BUSINESS_ID, name: site.name },
    publisher: {
      '@type': 'Organization',
      name: site.name,
      logo: { '@type': 'ImageObject', url: `${site.url}/icon.svg` },
    },
    image: [`${site.url}/images/dob/g1.jpg`],
  }
}

/**
 * Serialize JSON-LD for embedding in a <script> tag.
 * Escapes `<` and `&` so any field can't break out of the tag → XSS.
 */
export function jsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c').replace(/&/g, '\\u0026')
}
