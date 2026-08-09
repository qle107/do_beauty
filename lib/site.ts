/** Centralized business info — single source of truth for public pages.
 *  Brand: DO BEAUTY · Institut de beauté à Gentilly (94).
 *
 *  ⚠️ PLACEHOLDERS to confirm with the owner before go-live:
 *   - url (final domain)   - email        - social.planity (exact Planity URL)
 *   - geo (approx.)        - legal.*       (SIREN/SIRET/director — required for
 *                                           mentions légales)
 *  Phone is the number Google lists (+84 … looks like a data error on the GBP;
 *  confirm the correct French number).
 */

export const site = {
  name: 'DO BEAUTY',
  legalName: 'DODO & BEAUTE',
  tagline: 'Institut de beauté · Gentilly',
  description:
    'Institut de beauté à Gentilly — manucure, nail art, beauté du regard et soins, dans un écrin discret.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dobeauty.fr',
  address: {
    street: '12 Avenue Jean Jaurès',
    city: '94250 Gentilly',
    cityName: 'Gentilly',
    postalCode: '94250',
    region: 'Île-de-France',
    country: 'FR',
    transit: 'Val-de-Marne · Grand Paris',
  },
  geo: {
    // ⚠️ approximate (Gentilly, near 12 Av. Jean Jaurès) — geocode precisely later
    latitude: 48.8149,
    longitude: 2.343,
  },
  hours: {
    // Do Beauty is open 7 days a week, ~10:00–19:30. openMinutes/closeMinutes are
    // the single source of truth for the booking engine (availability + closing
    // gate). `display` is the public label (kept vague per the owner's choice).
    label: 'Ouvert 7j/7',
    open: '10h00',
    close: '19h30',
    display: 'Ouvert 7 jours sur 7',
    openMinutes: 10 * 60, // 10:00 → 600
    closeMinutes: 19 * 60 + 30, // 19:30 → 1170
  },
  phone: {
    display: '07 56 94 88 88', // from the Do Beauty & Nails Planity listing
    tel: '+33756948888',
  },
  email: 'dobeauty94@gmail.com',
  legal: {
    // Legal identity (INSEE/RNE, updated 07/08/2026). SAS « DODO & BEAUTE ».
    editorName: 'DODO & BEAUTE',
    entrepreneur: 'Huu NGUYEN',
    legalForm: 'Société par actions simplifiée (SAS)',
    siren: '948 622 360',
    siret: '948 622 360 00048',
    ape: '9602B — Soins de beauté',
    registration: 'RCS Créteil 948 622 360',
    vat: 'FR00948622360',
    publicationDirector: 'Huu NGUYEN',
    host: {
      name: 'Hostinger International Ltd',
      address: '61 Lordou Vironos Street, 6023 Larnaca, Chypre',
      phone: '+33 1 76 60 41 43',
    },
  },
  paymentAccepted: ['Cash', 'Bank transfer'],
  rating: {
    // From the Google Business Profile provided by the owner.
    value: 4.6,
    count: 99,
    best: 5,
    worst: 1,
  },
  areaServed: [
    'Gentilly',
    'Le Kremlin-Bicêtre',
    'Arcueil',
    'Cachan',
    'Montrouge',
    'Paris',
  ],
  social: {
    instagram: 'https://www.instagram.com/do.beauty.nails_94/',
    tiktok: 'https://www.tiktok.com/@do.beautynails94',
    planity: 'https://www.planity.com/do-beauty-nails-94250-gentilly',
    facebook: '',
    googleBusiness:
      'https://www.google.com/maps/search/?api=1&query=Do%20Beauty%2016%20Avenue%20Jean%20Jaur%C3%A8s%2094250%20Gentilly',
  },
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=16%20Avenue%20Jean%20Jaur%C3%A8s%2C%2094250%20Gentilly',
  reviewUrl:
    'https://www.google.com/maps/search/?api=1&query=Do%20Beauty%2016%20Avenue%20Jean%20Jaur%C3%A8s%2094250%20Gentilly',
  mapsEmbed:
    'https://www.google.com/maps?q=16%20Avenue%20Jean%20Jaur%C3%A8s%2C%2094250%20Gentilly&output=embed',
} as const
