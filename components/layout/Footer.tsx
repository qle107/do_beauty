import Link from 'next/link'
import { site } from '@/lib/site'
import { servicePageLinks, cityPageLinks } from '@/lib/navigation'
import ManageCookiesButton from '@/components/layout/ManageCookiesButton'

const socialLinks = [
  { label: 'Instagram', href: site.social.instagram },
  { label: 'Google', href: site.social.googleBusiness },
  { label: 'Itinéraire', href: site.directionsUrl },
  { label: 'Réserver', href: '/booking' },
]

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#171615] text-[#E4DCCF]">
      <div className="db-shell py-20 md:py-28">
        {/* Wordmark */}
        <div className="flex flex-col items-center text-center">
          <p className="db-serif text-[clamp(52px,11vw,120px)] font-normal uppercase leading-none tracking-[0.14em] text-[#FAF8F4]">
            Do Beauty
          </p>
          <p className="db-eyebrow mt-6 text-[color:var(--db-champagne)]">
            Institut de beauté · Gentilly
          </p>
        </div>

        {/* Links */}
        <nav
          aria-label="Liens Do Beauty"
          className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
        >
          {socialLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] uppercase tracking-[0.2em] text-[#DED6CA]/70 transition-colors hover:text-[color:var(--db-champagne)]"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Address + phone */}
        <address className="mt-12 flex flex-col items-center gap-2 not-italic text-center text-sm text-[#DED6CA]/60">
          <p>
            {site.address.street} · {site.address.city}
          </p>
          <p>{site.hours.display}</p>
          <a
            href={`tel:${site.phone.tel}`}
            className="tracking-[0.08em] transition-colors hover:text-[color:var(--db-champagne)]"
          >
            {site.phone.display}
          </a>
        </address>

        {/* SEO internal links — quiet, for discoverability */}
        <div className="mt-14 grid grid-cols-1 gap-8 border-t border-white/10 pt-10 sm:grid-cols-2">
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.24em] text-[color:var(--db-champagne)]/80">
              Prestations à Gentilly
            </h3>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {servicePageLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[12px] text-[#DED6CA]/55 transition-colors hover:text-[color:var(--db-champagne)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.24em] text-[color:var(--db-champagne)]/80">
              À proximité
            </h3>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {cityPageLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[12px] text-[#DED6CA]/55 transition-colors hover:text-[color:var(--db-champagne)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal row */}
        <div className="mt-16 flex flex-col items-center gap-4 border-t border-white/10 pt-8 text-[11px] tracking-[0.14em] text-[#DED6CA]/40 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} DO BEAUTY — Tous droits réservés.</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/terms" className="transition-colors hover:text-[color:var(--db-champagne)]">
              Mentions légales
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-[color:var(--db-champagne)]">
              Confidentialité
            </Link>
            <ManageCookiesButton className="transition-colors hover:text-[color:var(--db-champagne)]" />
          </div>
        </div>
      </div>
    </footer>
  )
}
