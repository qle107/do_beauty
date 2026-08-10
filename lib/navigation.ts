/** Shared navigation links for Navbar and Footer. */

export const publicNavLinks = [
  { href: '/menus', label: 'Nos Prestations' },
  { href: '/galerie', label: 'Galerie' },
  { href: '/about', label: 'À propos' },
  { href: '/contact', label: 'Nous contacter' },
] as const

/** DO BEAUTY homepage - in-page anchor navigation (header + mobile menu). */
export const homeNavLinks = [
  { href: '/#prestations', label: 'Prestations' },
  { href: '/#realisations', label: 'Réalisations' },
  { href: '/contact', label: 'Contact' },
] as const

// SEO service landing pages (Gentilly). Surfaced in the footer so the homepage
// passes internal link equity to them instead of leaving them orphaned.
export const servicePageLinks = [
  { href: '/institut-de-beaute-gentilly', label: 'Institut de beauté' },
  { href: '/onglerie-gentilly', label: 'Onglerie' },
  { href: '/manucure-gentilly', label: 'Manucure' },
  { href: '/nail-art-gentilly', label: 'Nail art' },
  { href: '/semi-permanent-gentilly', label: 'Semi-permanent' },
  { href: '/ongles-gel-gentilly', label: 'Ongles en gel' },
  { href: '/beaute-du-regard-gentilly', label: 'Beauté du regard' },
  { href: '/beaute-des-pieds-gentilly', label: 'Beauté des pieds' },
] as const

// SEO city landing pages - Gentilly's neighbouring towns (Val-de-Marne / Paris).
export const cityPageLinks = [
  { href: '/onglerie-le-kremlin-bicetre', label: 'Le Kremlin-Bicêtre' },
  { href: '/onglerie-arcueil', label: 'Arcueil' },
  { href: '/onglerie-cachan', label: 'Cachan' },
  { href: '/onglerie-montrouge', label: 'Montrouge' },
  { href: '/onglerie-villejuif', label: 'Villejuif' },
  { href: '/onglerie-ivry-sur-seine', label: 'Ivry-sur-Seine' },
  { href: '/onglerie-paris-13', label: 'Paris 13e' },
  { href: '/onglerie-paris-14', label: 'Paris 14e' },
] as const
