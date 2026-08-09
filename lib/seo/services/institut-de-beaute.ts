import type { LandingPage } from "@/lib/seo/types"

/**
 * Pillar service page — "Institut de beauté à Gentilly".
 * Presents the whole Do Beauty institute (onglerie, nail art, beauté du regard,
 * soins des mains & des pieds) with local access, booking and practical FAQs.
 * Transit and landmarks are factual (RER B Gentilly, tram T3a Porte de Gentilly,
 * Maison Doisneau, église Saint-Saturnin, Parc du Coteau de la Bièvre).
 */
export const page: LandingPage = {
  slug: "institut-de-beaute-gentilly",
  meta: {
    title: "Institut de beauté à Gentilly (94) · Do Beauty",
    description:
      "Do Beauty, institut de beauté à Gentilly : onglerie, nail art, beauté du regard et soins des mains et des pieds. Ouvert 7j/7, 12 Avenue Jean Jaurès. Réservation en ligne.",
  },
  breadcrumbLabel: "Institut de beauté Gentilly",
  h1: "Institut de beauté à Gentilly",
  lead:
    "Au 12 Avenue Jean Jaurès, Do Beauty réunit sous un même toit l'onglerie, le nail art, la beauté du regard et les soins des mains et des pieds. Une équipe d'expertes, un accueil posé et la réservation en ligne, ouvert 7 jours sur 7 à Gentilly.",
  ctaCategory: "FORFAIT",
  service: {
    name: "Institut de beauté Do Beauty",
    serviceType: "Institut de beauté et onglerie",
    description:
      "Institut de beauté à Gentilly (94250) : onglerie, vernis semi-permanent, pose gel, nail art, beauté du regard, beauté des mains et des pieds. Ouvert 7j/7, réservation en ligne.",
    fromPrice: 15,
  },
  sections: [
    {
      h2: "Do Beauty, l'institut de beauté de Gentilly",
      blocks: [
        {
          kind: "paragraph",
          text:
            "Do Beauty est un institut de beauté installé au 12 Avenue Jean Jaurès, à Gentilly (94250), juste au sud de Paris. On y vient pour prendre soin de ses ongles, de son regard et de ses mains dans un cadre calme, où l'on ne vous presse pas. L'institut est ouvert 7 jours sur 7 et affiche une note de 4,6 sur 5 sur près de 99 avis Google.",
        },
        {
          kind: "paragraph",
          text:
            "Derrière le comptoir, une petite équipe se partage les spécialités : la pose d'ongles et le vernis semi-permanent, le nail art dessiné à la main, les extensions et le rehaussement de cils, la beauté des mains et des pieds. Chacune prend le temps d'écouter ce que vous cherchez avant de commencer, et reste stricte sur l'hygiène comme sur le choix des produits.",
        },
      ],
    },
    {
      h2: "Tous vos soins beauté au même endroit",
      blocks: [
        {
          kind: "paragraph",
          text:
            "Plutôt que de courir d'une adresse à l'autre, vous trouvez chez Do Beauty l'essentiel de la beauté des ongles et du regard, du plus naturel au plus travaillé :",
        },
        {
          kind: "list",
          items: [
            "Onglerie : manucure, vernis semi-permanent longue tenue, pose et remplissage en gel, dépose en douceur.",
            "Nail art : french, babyboomer, dégradés, motifs graphiques et décorations dessinés à la main.",
            "Beauté du regard : rehaussement de cils, extensions cil à cil, mise en beauté des sourcils.",
            "Beauté des mains et des pieds : soins, gommage et vernis pour des mains soignées et des pieds nets avant l'été.",
            "Forfaits mains + pieds pour combiner deux prestations sur un même rendez-vous.",
          ],
        },
      ],
    },
    {
      h2: "Nos tarifs indicatifs",
      blocks: [
        {
          kind: "pricing",
          rows: [
            { label: "Manucure", price: "à partir de 15 €" },
            { label: "Vernis semi-permanent", price: "à partir de 25 €" },
            { label: "Pose en gel", price: "à partir de 35 €" },
            { label: "Nail art (par ongle)", price: "à partir de 5 €" },
            { label: "Rehaussement de cils", price: "à partir de 45 €" },
            { label: "Extensions de cils", price: "à partir de 55 €" },
            { label: "Beauté des pieds", price: "à partir de 25 €" },
          ],
        },
        {
          kind: "paragraph",
          text:
            "Tarifs indicatifs, confirmés lors de la réservation. Le prix final dépend de la longueur souhaitée, de l'état de vos ongles et de la complexité du nail art. Notre équipe vous l'annonce clairement avant de commencer, sans surprise.",
        },
      ],
    },
    {
      h2: "Venir chez Do Beauty à Gentilly",
      blocks: [
        {
          kind: "paragraph",
          text:
            "L'institut se rejoint facilement sans voiture. La gare RER B « Gentilly » est à quelques minutes à pied, et le tramway T3a s'arrête à la Porte de Gentilly, sur le pourtour de Paris. Depuis Paris 13e ou Paris 14e, l'avenue Jean Jaurès est à deux pas de la Porte d'Italie et de la Porte de Gentilly ; les communes voisines comme Le Kremlin-Bicêtre et Arcueil ne sont qu'à quelques minutes.",
        },
        {
          kind: "paragraph",
          text:
            "En voiture, comptez quelques minutes depuis le périphérique. Repères utiles pour situer le quartier : la Maison de la Photographie Robert Doisneau, l'église Saint-Saturnin et le Parc du Coteau de la Bièvre, autant de lieux du centre de Gentilly proches de l'institut.",
        },
      ],
    },
    {
      h2: "Réserver en ligne, en quelques instants",
      blocks: [
        {
          kind: "paragraph",
          text:
            "La réservation en ligne est ouverte 24h/24 : choisissez la prestation, le jour et l'heure qui vous conviennent, y compris en soirée ou le week-end. Vous recevez la confirmation de votre créneau, et l'équipe vous attend à l'heure dite. C'est le moyen le plus simple d'être certaine d'avoir votre place, surtout le samedi et le dimanche.",
        },
        {
          kind: "paragraph",
          text:
            "Vous hésitez entre un semi-permanent et une pose gel, ou vous préparez un événement ? Réservez la prestation qui s'en approche le plus : sur place, votre experte ajuste avec vous la technique, la forme et les finitions pour un résultat qui vous ressemble.",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "Comment prendre rendez-vous chez Do Beauty ?",
      answer:
        "Le plus simple est de réserver en ligne sur notre site, 24h/24, depuis votre mobile ou votre ordinateur : vous choisissez la prestation, le jour et l'heure, et vous recevez la confirmation de votre créneau. Vous pouvez aussi nous contacter pendant les heures d'ouverture.",
    },
    {
      question: "Quels sont les horaires de l'institut ?",
      answer:
        "Do Beauty est ouvert 7 jours sur 7, week-end compris, généralement de 10h à 19h30. Les créneaux de fin de journée et du week-end partent vite : réserver en ligne à l'avance reste le plus sûr.",
    },
    {
      question: "Comment venir à l'institut à Gentilly ?",
      answer:
        "L'institut se trouve au 12 Avenue Jean Jaurès, à Gentilly (94250). La gare RER B « Gentilly » est à quelques minutes à pied et le tramway T3a dessert la Porte de Gentilly. Depuis Paris 13e ou 14e, vous êtes tout près par la Porte d'Italie ou la Porte de Gentilly.",
    },
    {
      question: "Quels moyens de paiement acceptez-vous ?",
      answer:
        "Le règlement se fait en espèces ou par virement. Le montant vous est indiqué clairement avant de commencer la prestation, en fonction de ce que vous choisissez.",
    },
    {
      question: "Faut-il réserver ou puis-je venir sans rendez-vous ?",
      answer:
        "Nous vous conseillons de réserver pour être certaine d'avoir votre créneau, surtout le week-end et en soirée. Si un passage sans rendez-vous est possible selon les disponibilités du moment, la réservation en ligne évite l'attente.",
    },
    {
      question: "Combien de temps faut-il prévoir pour un rendez-vous ?",
      answer:
        "Cela dépend de la prestation : comptez environ 30 à 45 minutes pour un vernis semi-permanent, un peu plus pour une pose en gel avec nail art ou une pose d'extensions de cils. Votre experte vous donne une estimation au moment de la réservation.",
    },
    {
      question: "Puis-je préparer un mariage ou un événement chez Do Beauty ?",
      answer:
        "Oui. Pour un mariage, une fête ou une occasion particulière, réservez à l'avance la prestation la plus proche de ce que vous imaginez (ongles, mains, regard). Sur place, l'équipe adapte la forme, les couleurs et les finitions pour un rendu à la hauteur du jour J.",
    },
  ],
  related: [
    { label: "Onglerie à Gentilly", href: "/onglerie-gentilly" },
    { label: "Manucure à Gentilly", href: "/manucure-gentilly" },
    { label: "Vernis semi-permanent à Gentilly", href: "/semi-permanent-gentilly" },
    { label: "Pose gel à Gentilly", href: "/ongles-gel-gentilly" },
    { label: "Nail art à Gentilly", href: "/nail-art-gentilly" },
    { label: "Beauté du regard à Gentilly", href: "/beaute-du-regard-gentilly" },
    { label: "Beauté des pieds à Gentilly", href: "/beaute-des-pieds-gentilly" },
    { label: "Nos menus & tarifs", href: "/menus" },
    { label: "Notre galerie", href: "/galerie" },
  ],
}
