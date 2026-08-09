/** Curated media for the DO BEAUTY homepage.
 *  Real salon photos were triaged and copied to clean filenames under
 *  /public/images/dob/. No interior or feet ("pieds") photos exist in the set,
 *  so those roles fall back to the generated interior or a designed placeholder.
 */

export type Orientation = 'portrait' | 'landscape' | 'square'

export const heroImage = '/images/institut-accueil.png' // Image #6: branded reception + arch, headline poster on the left wall

export const galleryImages: {
  src: string
  orientation: Orientation
  alt: string
}[] = [
  { src: '/images/dob/g1.jpg', orientation: 'portrait',  alt: 'Nail art floral réalisé chez Do Beauty' },
  { src: '/images/dob/g5.jpg', orientation: 'landscape', alt: 'French manucure jaune et détail graphique' },
  { src: '/images/dob/g2.jpg', orientation: 'portrait',  alt: 'Manucure nude nacrée aux finitions soignées' },
  { src: '/images/dob/g4.jpg', orientation: 'square',    alt: 'Création nail art personnalisée en gros plan' },
  { src: '/images/dob/g6.jpg', orientation: 'portrait',  alt: 'Manucure semi-permanente élégante' },
  { src: '/images/dob/g3.jpg', orientation: 'portrait',  alt: 'Beauté du regard — cils rehaussés' },
  { src: '/images/dob/g7.jpg', orientation: 'portrait',  alt: 'Nail art bridal blanc et détails dorés' },
  { src: '/images/dob/g8.jpg', orientation: 'portrait',  alt: 'Manucure chrome perlée, teinte neutre' },
  { src: '/images/dob/g9.jpg', orientation: 'portrait',  alt: 'Pose de vernis soignée, mains manucurées' },
]

export const serviceImages: Record<'manucure' | 'nailart' | 'regard' | 'pieds', string | null> = {
  manucure: '/images/dob/svc-manucure.jpg',
  nailart: '/images/dob/svc-nailart.jpg',
  regard: '/images/dob/svc-regard.jpg',
  pieds: null, // no feet photo in the set → the row uses a designed placeholder
}

export const testimonialImage = '/images/dob/testimonial.jpg'
