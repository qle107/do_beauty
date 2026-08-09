import type { LandingPage } from "@/lib/seo/types"

/**
 * Service landing page — Onglerie / bar à ongles à Gentilly.
 * Hand-written, locally grounded copy. Prices are indicative only.
 */

export const page: LandingPage = {
  slug: "onglerie-gentilly",
  meta: {
    title: "Onglerie à Gentilly (94) · Do Beauty — bar à ongles 7j/7",
    description:
      "Do Beauty, votre onglerie et bar à ongles à Gentilly (94250) : manucure, vernis semi-permanent, pose gel et nail art. Ouvert 7 jours sur 7, 4,6★ sur 99 avis Google. Réservation en ligne.",
  },
  breadcrumbLabel: "Onglerie Gentilly",
  h1: "Onglerie & bar à ongles à Gentilly",
  lead:
    "Au 12 Avenue Jean Jaurès, Do Beauty s'occupe de tout ce qui touche aux ongles : manucure, vernis semi-permanent, pose en gel et nail art, réalisés à la main par une petite équipe, du lundi au dimanche.",
  ctaCategory: "MAINS",
  service: {
    name: "Onglerie",
    serviceType: "Soin et pose des ongles",
    description:
      "Onglerie complète à Gentilly : manucure, vernis semi-permanent, pose d'ongles en gel, nail art et réparation, dans un institut ouvert 7 jours sur 7.",
    fromPrice: 15,
  },
  sections: [
    {
      h2: "Toutes les prestations ongles, au même endroit",
      blocks: [
        {
          kind: "paragraph",
          text:
            "Un bar à ongles, c'est un lieu où l'on trouve tout ce qui concerne les mains et les ongles, du geste le plus simple au plus travaillé. À Gentilly, Do Beauty couvre l'ensemble de la carte : la manucure pour des ongles nets et une peau soignée, le vernis semi-permanent pour une couleur qui tient environ trois semaines, la pose en gel quand on souhaite de la longueur ou de la solidité, et le nail art pour personnaliser le résultat. Chaque cliente n'a pas les mêmes ongles ni les mêmes envies, alors l'équipe conseille la technique la plus adaptée avant de commencer.",
        },
        {
          kind: "list",
          items: [
            "Manucure : mise en forme, soin des cuticules, pose de vernis classique",
            "Vernis semi-permanent : couleur longue tenue sur ongle naturel, toutes teintes",
            "Pose d'ongles en gel : rallongement, renforcement ou effet naturel",
            "Remplissage de gel toutes les trois à quatre semaines pour suivre la pousse",
            "Nail art : french, effet chrome, dégradé, décor à la main, strass",
            "Réparation d'un ongle cassé et dépose en douceur",
          ],
        },
      ],
    },
    {
      h2: "Comment se passe une visite chez Do Beauty",
      blocks: [
        {
          kind: "paragraph",
          text:
            "On commence par regarder l'état de vos ongles et par échanger sur ce que vous cherchez : une couleur discrète pour le quotidien, une pose qui tienne un voyage, un décor pour une occasion. L'experte prépare ensuite l'ongle — mise en forme, repousse des cuticules, ponçage léger si nécessaire — puis applique la technique choisie. Le semi-permanent et le gel passent sous lampe LED entre chaque couche pour fixer la matière.",
        },
        {
          kind: "paragraph",
          text:
            "Comptez environ quarante-cinq minutes pour une pose de semi-permanent et un peu plus d'une heure pour une pose complète en gel avec finitions. Rien n'est bâclé : le but est un rendu net qui dure, pas un rendez-vous expédié. La réservation en ligne vous laisse choisir la prestation et le créneau, y compris en soirée et le week-end.",
        },
      ],
    },
    {
      h2: "Une hygiène rigoureuse à chaque rendez-vous",
      blocks: [
        {
          kind: "paragraph",
          text:
            "Le soin des ongles demande de la propreté à chaque étape, et c'est un point sur lequel l'équipe ne transige pas. Les instruments réutilisables sont nettoyés et désinfectés entre deux clientes, les limes et accessoires à usage unique sont renouvelés, et le plan de travail est assaini avant chaque pose. Nous utilisons des produits professionnels, avec un affichage clair de ce qui est appliqué.",
        },
        {
          kind: "list",
          items: [
            "Désinfection des instruments réutilisables entre chaque cliente",
            "Limes et accessoires jetables changés à chaque rendez-vous",
            "Poste de travail nettoyé et aéré, lampes LED entretenues",
            "Dépose maîtrisée pour préserver l'ongle naturel",
          ],
        },
      ],
    },
    {
      h2: "Bien choisir sa forme et sa couleur",
      blocks: [
        {
          kind: "paragraph",
          text:
            "La forme se choisit selon vos mains, votre mode de vie et vos goûts. Les formes courtes et arrondies restent pratiques au quotidien et cassent moins ; l'amande et le carré arrondi allongent visuellement les doigts ; les formes plus longues laissent davantage de place au nail art. Côté teintes, un nude ou un rosé se marie avec tout, un rouge classique habille une tenue, et les couleurs plus franches conviennent bien aux occasions. En cas d'hésitation, l'équipe vous montre des exemples et vous oriente vers ce qui tiendra le mieux.",
        },
        {
          kind: "list",
          items: [
            "Formes courtes et arrondies : discrètes, solides, faciles à vivre",
            "Amande et carré arrondi : effet élancé, très demandé",
            "Nudes et rosés : passe-partout, idéals au travail",
            "Couleurs vives et nail art : pour un événement ou une envie de changement",
          ],
        },
      ],
    },
    {
      h2: "Tarifs indicatifs de l'onglerie",
      blocks: [
        {
          kind: "pricing",
          rows: [
            { label: "Manucure (mise en beauté des mains)", price: "à partir de 15 €" },
            { label: "Vernis semi-permanent", price: "à partir de 25 €" },
            { label: "Pose d'ongles en gel", price: "à partir de 35 €" },
            { label: "Nail art (par ongle)", price: "à partir de 5 €" },
            { label: "Beauté des pieds", price: "à partir de 25 €" },
          ],
        },
        {
          kind: "paragraph",
          text:
            "Tarifs indicatifs, confirmés lors de la réservation. Le prix final dépend de la longueur, de la finition et du décor souhaités. Précisez-nous votre projet au moment de réserver pour une estimation juste.",
        },
      ],
    },
    {
      h2: "Faire ses ongles à Gentilly plutôt qu'à Paris",
      blocks: [
        {
          kind: "paragraph",
          text:
            "Gentilly touche Paris : l'institut se trouve à quelques minutes de la Porte de Gentilly et de la Porte d'Italie, tout près des 13e et 14e arrondissements. On y accède par la gare RER B « Gentilly », par le tramway T3a le long des maréchaux, ou en voiture depuis Le Kremlin-Bicêtre, Arcueil et Montrouge. Autrement dit, vous profitez d'un vrai bar à ongles aux portes de la capitale, sans le temps de trajet ni les tarifs des salons du centre.",
        },
        {
          kind: "list",
          items: [
            "Aux portes de Paris (13e et 14e), près de la Porte de Gentilly et de la Porte d'Italie",
            "Accessible en RER B (gare « Gentilly ») et en tramway T3a",
            "Facile depuis Le Kremlin-Bicêtre, Arcueil, Montrouge, Villejuif et Ivry-sur-Seine",
            "Ouvert 7 jours sur 7, créneaux en soirée, réservation en ligne",
            "Une note de 4,6★ sur près de 99 avis Google",
          ],
        },
      ],
    },
  ],
  faqs: [
    {
      question: "Quelle est la différence entre une onglerie et un bar à ongles ?",
      answer:
        "Les deux désignent le même type de lieu : un endroit dédié au soin et à la mise en beauté des ongles. Chez Do Beauty à Gentilly, vous trouvez toute la carte — manucure, vernis semi-permanent, pose en gel et nail art — réalisée à la main par notre équipe.",
    },
    {
      question: "Faut-il prendre rendez-vous ou puis-je venir sans réserver ?",
      answer:
        "Nous vous conseillons de réserver en ligne pour être certaine d'avoir un créneau, surtout le week-end et en soirée. La réservation se fait en quelques instants depuis votre mobile, 7 jours sur 7. Le passage sans rendez-vous dépend des disponibilités du moment.",
    },
    {
      question: "Combien de temps dure une pose d'ongles ?",
      answer:
        "Comptez environ quarante-cinq minutes pour un vernis semi-permanent et un peu plus d'une heure pour une pose complète en gel avec finitions. La durée varie selon la longueur souhaitée et le nail art éventuel.",
    },
    {
      question: "La pose en gel abîme-t-elle les ongles ?",
      answer:
        "Réalisée avec soin et déposée correctement, une pose en gel n'abîme pas l'ongle naturel. Nous préparons la surface sans excès et privilégions une dépose en douceur plutôt qu'un arrachage. Si vos ongles sont fragiles, l'équipe vous oriente vers la solution la plus respectueuse.",
    },
    {
      question: "Quelles techniques de nail art proposez-vous ?",
      answer:
        "French, effet chrome, dégradé, décor peint à la main, pose de strass : le nail art s'adapte à vos envies, du plus sobre au plus travaillé. Dites-nous votre idée au moment de réserver et nous vous confirmerons ce qui est réalisable et le tarif correspondant.",
    },
    {
      question: "Où se situe l'onglerie et comment y accéder ?",
      answer:
        "L'institut se trouve au 12 Avenue Jean Jaurès, 94250 Gentilly, aux portes de Paris. On y vient par la gare RER B « Gentilly », par le tramway T3a, ou en voiture depuis Le Kremlin-Bicêtre, Arcueil et Montrouge, à quelques minutes seulement.",
    },
    {
      question: "Vos tarifs affichés sont-ils définitifs ?",
      answer:
        "Les prix indiqués sont donnés à titre indicatif, à partir d'un montant de base. Le tarif final dépend de la longueur, de la finition et du décor choisis, et vous est confirmé lors de la réservation.",
    },
  ],
  related: [
    { label: "Manucure à Gentilly", href: "/manucure-gentilly" },
    { label: "Vernis semi-permanent", href: "/semi-permanent-gentilly" },
    { label: "Pose d'ongles en gel", href: "/ongles-gel-gentilly" },
    { label: "Nail art", href: "/nail-art-gentilly" },
    { label: "Beauté des pieds", href: "/beaute-des-pieds-gentilly" },
    { label: "Institut de beauté à Gentilly", href: "/institut-de-beaute-gentilly" },
    { label: "Onglerie au Kremlin-Bicêtre", href: "/onglerie-le-kremlin-bicetre" },
    { label: "Nos menus & tarifs", href: "/menus" },
    { label: "Galerie de réalisations", href: "/galerie" },
  ],
}
