// ─── Guide des styles d'extensions de cils ──────────────────────────────────
//
// New customers see the menu rows ("Pose Cil À Cil", "Mixte Naturel", "Volume
// russe"...) without knowing what each one looks like or who it suits. This is
// the single source of truth for the short, plain-French explainer shown on the
// menu (rich cards) and in the booking picker (compact list).
//
// `image` is an optional real-photo slot: left undefined until the salon sends
// its own photos - we never fill it with a stock or generated image. Until then
// the card shows a tasteful "Photo à venir" placeholder.

export interface CilsStyle {
  key: string          // slug, also the photo filename stem: /images/dob/cils-<key>.jpg
  name: string         // as customers should read it
  priceLabel: string   // indicative, matches the menu
  effect: string       // one-line summary of the look
  intensity: number    // 1 (le plus naturel) .. 5 (le plus intense)
  description: string   // 2-3 sentences: what it is, the effect, for whom
  image?: string        // set once the salon provides a real photo
}

// Ordered from the most natural to the most intense - the order a hesitating
// customer reads to place herself on the scale.
export const CILS_STYLES: CilsStyle[] = [
  {
    key: 'cil-a-cil',
    name: 'Cil à cil (1:1)',
    priceLabel: 'dès 55 €',
    effect: 'Naturel, allongé',
    intensity: 1,
    description:
      "Une extension posée sur chacun de vos cils, un par un. C'est la technique la plus proche du cil naturel : elle allonge et réveille le regard sans le charger, comme un mascara qui ne s'efface pas. Idéale pour une première pose ou pour un rendu discret au quotidien.",
  },
  {
    key: 'mixte-naturel',
    name: 'Mixte naturel',
    priceLabel: '60 €',
    effect: 'Naturel densifié',
    intensity: 2,
    description:
      "La base cil à cil, avec quelques petits éventails glissés là où les cils se clairsèment. On garde le naturel, mais le regard paraît un peu plus fourni et reposé. Le bon choix quand le cil à cil semble trop léger.",
  },
  {
    key: 'mixte-intense',
    name: 'Mixte intense',
    priceLabel: '68 €',
    effect: 'Densité marquée',
    intensity: 3,
    description:
      "Un mélange de cils à cils et d'éventails plus présents, pour une frange nettement plus dense et dessinée. Le regard reste portable tous les jours, mais il se voit. Pour celles qui aiment un effet maquillé sans excès.",
  },
  {
    key: 'volume-russe-leger',
    name: 'Volume russe léger',
    priceLabel: '68 €',
    effect: 'Volume aérien',
    intensity: 4,
    description:
      "Des éventails faits main de plusieurs fibres ultra-fines, posés cil par cil. En version légère, le rendu est vaporeux et duveteux : plein, mais tout en douceur. Un volume glamour qui reste léger à porter.",
  },
  {
    key: 'volume-russe-intense',
    name: 'Volume russe intense',
    priceLabel: '79 €',
    effect: 'Volume glamour',
    intensity: 5,
    description:
      "Des éventails plus fournis pour une frange dense et spectaculaire, façon regard de poupée. C'est notre pose la plus intense en volume, parfaite pour un événement ou pour celles qui assument un maximum d'effet.",
  },
  {
    key: 'whispy-kim-k',
    name: 'Whispy / Kim K / Hybride',
    priceLabel: '85 €',
    effect: 'Texturé, tendance',
    intensity: 4,
    description:
      "Un jeu de longueurs qui crée des pointes et un effet « mouillé » très tendance, façon Kim K. Le mélange cil à cil et volume donne une frange texturée et aérée qui ouvre l'œil. Pour un regard mode, ni tout à fait naturel ni tout à fait dramatique.",
  },
]
