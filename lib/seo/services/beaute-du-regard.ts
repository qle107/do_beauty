import type { LandingPage } from "@/lib/seo/types"

/**
 * Service landing page — Beauté du regard à Gentilly.
 * Rehaussement de cils, teinture, extensions (cil à cil et volume russe).
 * Hand-written, locally grounded copy. Prices are indicative only.
 */

export const page: LandingPage = {
  slug: "beaute-du-regard-gentilly",
  meta: {
    title: "Beauté du regard à Gentilly (94) · Do Beauty — cils & sourcils",
    description:
      "Do Beauty, beauté du regard à Gentilly (94250) : rehaussement de cils, teinture, extensions cil à cil et volume russe. Ouvert 7j/7, 4,6★ sur 99 avis Google. Réservation en ligne.",
  },
  breadcrumbLabel: "Beauté du regard Gentilly",
  h1: "Beauté du regard à Gentilly",
  lead:
    "Rehaussement de cils, teinture et extensions cil à cil ou volume russe : au 16 avenue Jean Jaurès, l'équipe de Do Beauty ouvre et intensifie votre regard, du plus naturel au plus marqué, du lundi au dimanche.",
  ctaCategory: "CILS",
  service: {
    name: "Beauté du regard",
    serviceType: "Rehaussement et extensions de cils",
    description:
      "Beauté du regard à Gentilly (94250) : rehaussement de cils, teinture, extensions de cils cil à cil et volume russe, du rendu naturel au plus intense. Institut ouvert 7 jours sur 7, réservation en ligne.",
    fromPrice: 45,
  },
  sections: [
    {
      h2: "Le regard, ce qui se voit en premier",
      blocks: [
        {
          kind: "paragraph",
          text:
            "Avant même le teint ou le sourire, c'est le regard qui donne le ton d'un visage. À Gentilly, Do Beauty en a fait une spécialité à part entière : rehaussement de cils, teinture et extensions, avec l'idée d'ouvrir l'œil et de le structurer sans jamais l'alourdir. Selon vos cils de départ, votre mode de vie et l'effet recherché, l'équipe vous oriente vers la technique qui vous ira, plutôt que vers celle qui rapporte le plus.",
        },
        {
          kind: "paragraph",
          text:
            "Chaque prestation commence par un temps d'échange, cils au repos, pour regarder leur longueur, leur densité et leur implantation. On définit ensemble un rendu — discret pour le quotidien, plus dessiné pour une occasion — avant d'installer les patchs sous l'œil et de commencer. La pose se fait allongée, les yeux fermés, dans le calme, avec des produits professionnels et une hygiène suivie de près.",
        },
      ],
    },
    {
      h2: "Le rehaussement de cils, l'alternative sans pose",
      blocks: [
        {
          kind: "paragraph",
          text:
            "Le rehaussement travaille vos cils naturels, sans rien ajouter. On les recourbe durablement à la racine sur un petit bouclier en silicone, ce qui les redresse et les fait paraître plus longs : l'œil s'ouvre, le regard semble reposé. On l'associe souvent à une teinture, qui fonce la pointe des cils pour un effet mascara permanent, très pratique si vos cils sont clairs. C'est le choix idéal quand on veut un joli regard au réveil sans passer par la pose d'extensions ni l'entretien qui va avec.",
        },
        {
          kind: "list",
          items: [
            "Recourbement des cils naturels, sans ajout de fibres",
            "Teinture possible en complément pour foncer les cils clairs",
            "Effet naturel qui met en valeur la forme de l'œil",
            "Tenue moyenne de six à huit semaines, le temps de la pousse",
            "Aucun démaquillant particulier au quotidien",
          ],
        },
      ],
    },
    {
      h2: "Les extensions de cils, du cil à cil au volume russe",
      blocks: [
        {
          kind: "paragraph",
          text:
            "Les extensions consistent à poser une fibre souple sur chacun de vos cils, un à un. C'est la longueur, la courbure et l'épaisseur choisies qui décident du rendu final. La méthode cil à cil pose une extension par cil naturel, pour un résultat léger et très proche du vrai cil. Le volume russe assemble plusieurs fibres ultra-fines en éventail sur un même cil, pour une frange plus fournie et dessinée. Entre les deux, un volume mixte permet de densifier sans aller jusqu'à l'effet intense.",
        },
        {
          kind: "list",
          items: [
            "Cil à cil : une extension par cil, rendu fin et naturel",
            "Volume mixte : densité intermédiaire, ni trop discret ni trop marqué",
            "Volume russe : éventails légers pour une frange fournie et graphique",
            "Courbures et longueurs adaptées à la forme de votre œil",
            "Du regard « bonne mine » à l'effet plus habillé pour un événement",
          ],
        },
      ],
    },
    {
      h2: "Tenue et entretien au quotidien",
      blocks: [
        {
          kind: "paragraph",
          text:
            "Les extensions suivent la vie de vos cils : comme chacun tombe et repousse naturellement, la frange se clairseme au fil des semaines. On conseille un remplissage toutes les deux à trois semaines pour garder un rendu net, plutôt que d'attendre la dépose complète. Quelques habitudes simples prolongent la tenue, sans contrainte au quotidien.",
        },
        {
          kind: "list",
          items: [
            "Les 24 à 48 premières heures : éviter l'eau, la vapeur et le sauna, le temps que la colle sèche",
            "Nettoyer les cils avec un savon adapté et une brossette, plutôt que de les frotter",
            "Éviter les démaquillants gras et le mascara waterproof sur les extensions",
            "Ne pas tirer ni frotter les yeux, dormir de préférence sur le dos ou le côté",
            "Prévoir un remplissage toutes les deux à trois semaines pour l'entretien",
          ],
        },
      ],
    },
    {
      h2: "Contre-indications et précautions",
      blocks: [
        {
          kind: "paragraph",
          text:
            "La beauté du regard demande un œil en bonne santé et un peu de vigilance. En cas de doute, mieux vaut nous le signaler à la réservation ou reporter le rendez-vous : le confort et la sécurité de vos yeux passent avant tout. Si vous êtes sujette aux allergies, un test de tolérance peut être proposé avant une première pose.",
        },
        {
          kind: "list",
          items: [
            "Conjonctivite, orgelet ou irritation en cours : on attend la guérison",
            "Allergie connue à la colle ou aux cosmétiques : à signaler avant toute pose",
            "Chimiothérapie, traitement ophtalmologique ou opération récente de l'œil : demandez l'avis de votre médecin",
            "Port de lentilles : à retirer avant le rendez-vous pour plus de confort",
            "Grossesse : par précaution, on en parle ensemble avant de commencer",
          ],
        },
      ],
    },
    {
      h2: "Tarifs indicatifs de la beauté du regard",
      blocks: [
        {
          kind: "pricing",
          rows: [
            { label: "Teinture des cils", price: "à partir de 15 €" },
            { label: "Rehaussement de cils", price: "à partir de 45 €" },
            { label: "Rehaussement + teinture", price: "à partir de 55 €" },
            { label: "Extensions de cils (cil à cil)", price: "à partir de 55 €" },
            { label: "Extensions volume russe", price: "à partir de 65 €" },
            { label: "Remplissage d'extensions", price: "à partir de 35 €" },
          ],
        },
        {
          kind: "paragraph",
          text:
            "Tarifs indicatifs, confirmés lors de la réservation. Le prix final dépend de la technique, du volume souhaité et de l'état de vos cils. Précisez-nous l'effet visé au moment de réserver pour une estimation juste.",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "Rehaussement ou extensions de cils, que choisir ?",
      answer:
        "Le rehaussement recourbe vos cils naturels sans rien ajouter : un rendu discret, sans entretien particulier, qui met en valeur des cils déjà présents. Les extensions ajoutent de la longueur et de la densité, du naturel cil à cil au volume russe plus marqué, en échange d'un remplissage régulier. À Gentilly, l'équipe regarde vos cils et vous conseille selon l'effet que vous recherchez.",
    },
    {
      question: "Combien de temps tient un rehaussement de cils ?",
      answer:
        "Un rehaussement tient en moyenne six à huit semaines, le temps que vos cils se renouvellent naturellement. Il n'y a pas de remplissage à prévoir : on refait simplement la prestation quand la courbure s'estompe.",
    },
    {
      question: "Combien de temps tiennent les extensions et faut-il un remplissage ?",
      answer:
        "Comme chaque cil naturel tombe et repousse, la frange se dégarnit progressivement. Pour garder un rendu net, on conseille un remplissage toutes les deux à trois semaines, plutôt que d'attendre une dépose complète. Bien entretenues, les extensions gardent un bel aspect entre deux rendez-vous.",
    },
    {
      question: "Les extensions abîment-elles les cils naturels ?",
      answer:
        "Posées cil à cil avec une extension adaptée au poids que le cil naturel peut porter, et déposées correctement, les extensions n'abîment pas vos cils. Le point clé est de ne pas les tirer ni les arracher : en cas de gêne, mieux vaut revenir pour une dépose propre à l'institut.",
    },
    {
      question: "Peut-on se maquiller avec des extensions ou un rehaussement ?",
      answer:
        "Avec un rehaussement, le maquillage reste libre. Avec des extensions, on évite le mascara et surtout le waterproof, ainsi que les démaquillants gras qui décollent les fibres. Un trait d'eye-liner reste possible ; on vous explique les gestes à privilégier après la pose.",
    },
    {
      question: "Y a-t-il des contre-indications à la pose de cils ?",
      answer:
        "Oui : une infection ou irritation de l'œil en cours, une allergie connue à la colle, certains traitements ophtalmologiques ou une opération récente de l'œil. En cas de doute, signalez-le à la réservation. Un test de tolérance peut être proposé avant une première pose si vous êtes sujette aux allergies.",
    },
    {
      question: "Où faire sa beauté du regard et comment venir ?",
      answer:
        "L'institut se trouve au 16 avenue Jean Jaurès, 94250 Gentilly, aux portes de Paris. On y vient par la gare RER B « Gentilly », par le tramway T3a à la Porte de Gentilly, ou en voiture depuis Le Kremlin-Bicêtre, Arcueil et Montrouge, à quelques minutes seulement. Ouvert 7 jours sur 7, réservation en ligne.",
    },
  ],
  related: [
    { label: "Institut de beauté à Gentilly", href: "/institut-de-beaute-gentilly" },
    { label: "Onglerie à Gentilly", href: "/onglerie-gentilly" },
    { label: "Manucure à Gentilly", href: "/manucure-gentilly" },
    { label: "Nail art à Gentilly", href: "/nail-art-gentilly" },
    { label: "Vernis semi-permanent à Gentilly", href: "/semi-permanent-gentilly" },
    { label: "Beauté des pieds à Gentilly", href: "/beaute-des-pieds-gentilly" },
    { label: "Nos menus & tarifs", href: "/menus" },
    { label: "Galerie de réalisations", href: "/galerie" },
  ],
}
