import type { LandingPage } from "@/lib/seo/types"

/**
 * Service landing page — Nail art à Gentilly.
 * Hand-written, locally grounded copy. Prices are indicative only.
 */

export const page: LandingPage = {
  slug: "nail-art-gentilly",
  meta: {
    title: "Nail art à Gentilly (94) · Do Beauty — décors ongles 7j/7",
    description:
      "Nail art à Gentilly chez Do Beauty (94250) : effet chrome, cat eye velours, reliefs 3D, strass, french colorée et dégradé aura, sur semi-permanent ou sur gel. Ouvert 7j/7, 4,6★ sur 99 avis Google. Réservation en ligne.",
  },
  breadcrumbLabel: "Nail art Gentilly",
  h1: "Nail art à Gentilly",
  lead:
    "Au 12 Avenue Jean Jaurès, l'équipe de Do Beauty dessine à la main le décor de vos ongles : un détail discret sur un seul doigt ou des dix ongles entièrement travaillés, posés sur vernis semi-permanent ou sur gel, sept jours sur sept.",
  ctaCategory: "NAIL_ART",
  service: {
    name: "Nail art",
    serviceType: "Décoration et finition des ongles",
    description:
      "Nail art réalisé à la main à Gentilly : effet chrome, cat eye velours, reliefs 3D, strass, french colorée et dégradé aura, sur semi-permanent ou sur gel.",
    fromPrice: 5,
  },
  sections: [
    {
      h2: "Le nail art, du détail discret au décor complet",
      blocks: [
        {
          kind: "paragraph",
          text:
            "Le nail art, c'est tout ce qui vient habiller l'ongle une fois la couleur posée : un liseré, un motif peint, une matière qui accroche la lumière, une pierre. On peut le vouloir minimaliste — un point doré, un trait fin sur l'annulaire — ou aller jusqu'au décor complet sur les dix ongles pour un mariage ou une soirée. Chez Do Beauty, tout se fait à la main, ongle par ongle, en partant de ce que vous aimez plutôt que d'un catalogue figé. On regarde ensemble votre longueur, la teinte de base et l'occasion, puis on ajuste le décor pour qu'il tienne aussi bien qu'il vous ressemble.",
        },
      ],
    },
    {
      h2: "Les tendances du moment",
      blocks: [
        {
          kind: "paragraph",
          text:
            "Certaines finitions reviennent saison après saison, d'autres sont plus éphémères. Voici celles que les clientes demandent le plus en ce moment, réalisables selon vos ongles et le rendu recherché :",
        },
        {
          kind: "list",
          items: [
            "Effet chrome : un fini miroir ou nacré, du chrome argenté et doré jusqu'aux reflets « sirène » multicolores",
            "Cat eye / effet velours : un pigment magnétique qui trace une ligne de lumière mouvante dans l'ongle",
            "Reliefs 3D : fleurs, cœurs ou perles en gel modelées en volume pour un décor qui se touche du bout du doigt",
            "Strass et pierres : posés un à un, du petit éclat unique à la ligne de cuticule entièrement pavée",
            "French colorée : la french revisitée en couleurs vives, en pastel ou en version fine et graphique",
            "Aura / dégradé ombré : un halo de couleur diffus au centre de l'ongle, tout en transparence et en douceur",
          ],
        },
      ],
    },
    {
      h2: "Sur semi-permanent ou sur gel : quelle base choisir",
      blocks: [
        {
          kind: "paragraph",
          text:
            "Le nail art se pose toujours sur une base, et le choix de cette base change à la fois la tenue et les possibilités. Le vernis semi-permanent convient parfaitement à un décor sur vos ongles naturels : couleur longue tenue d'environ trois semaines, fini brillant, idéal pour les motifs peints, l'effet chrome ou le cat eye. Le gel, lui, apporte de la longueur et de la solidité — c'est la base à privilégier quand vous voulez des reliefs 3D, un pavé de strass ou un décor plus chargé qui a besoin d'une surface plus résistante pour durer.",
        },
        {
          kind: "list",
          items: [
            "Sur semi-permanent : décor sur ongle naturel, tenue ~3 semaines, parfait pour motifs, chrome, cat eye, aura",
            "Sur gel : longueur et solidité en plus, recommandé pour les reliefs 3D et les décors chargés en strass",
            "Dans les deux cas, chaque couche passe sous lampe LED pour fixer la matière et protéger le décor",
            "En cas d'hésitation, l'équipe vous oriente selon vos ongles, votre quotidien et le motif souhaité",
          ],
        },
      ],
    },
    {
      h2: "Comment se passe un rendez-vous nail art",
      blocks: [
        {
          kind: "paragraph",
          text:
            "On commence par échanger sur votre idée : une photo, une couleur, une envie précise ou juste une ambiance. L'experte prépare l'ongle — mise en forme, soin des cuticules, base semi-permanent ou pose de gel — puis réalise le décor à la main, souvent au pinceau fin, avant de sceller le tout sous une finition qui protège le motif. Pour un détail sur un ou deux ongles, comptez quelques minutes de plus sur votre rendez-vous habituel ; pour un décor complet et travaillé, prévoyez un créneau un peu plus long. Rien n'est expédié : un nail art propre demande de la patience, et c'est ce qui le fait durer aussi longtemps que la couleur.",
        },
      ],
    },
    {
      h2: "Un décor pensé pour vous",
      blocks: [
        {
          kind: "paragraph",
          text:
            "Le nail art n'a de sens que s'il vous va. Une manucure de bureau supporte mal les longueurs et les strass qui accrochent, alors on part souvent sur un détail sobre et une couleur passe-partout ; à l'inverse, un événement autorise le décor complet et les matières qui brillent. On peut aussi rappeler une tenue, une couleur de saison, ou coordonner mains et pieds. Apportez une photo si vous en avez une : c'est le point de départ le plus simple pour qu'on tombe d'accord sur le rendu avant de commencer.",
        },
        {
          kind: "list",
          items: [
            "Quotidien et travail : un accent discret, un liseré ou un seul ongle décoré",
            "Occasions et mariages : décor complet, reliefs, strass, coordination mains et pieds",
            "Saisons et tenues : teintes et motifs choisis pour s'accorder à une couleur ou un événement",
            "Idées à partager : une photo suffit pour caler le motif, la taille et le tarif à l'avance",
          ],
        },
      ],
    },
    {
      h2: "Tarifs indicatifs du nail art",
      blocks: [
        {
          kind: "pricing",
          rows: [
            { label: "Nail art simple (par ongle)", price: "à partir de 5 €" },
            { label: "Effet chrome ou cat eye (par ongle)", price: "à partir de 5 €" },
            { label: "Pose de strass (par ongle)", price: "à partir de 5 €" },
            { label: "Vernis semi-permanent (base)", price: "à partir de 20 €" },
            { label: "Pose d'ongles en gel (base)", price: "à partir de 35 €" },
          ],
        },
        {
          kind: "paragraph",
          text:
            "Tarifs indicatifs, confirmés lors de la réservation. Le nail art s'ajoute au prix de la base (semi-permanent ou gel) et se facture le plus souvent à l'ongle ou selon le décor. Le tarif final dépend de la complexité du motif et du nombre d'ongles concernés — précisez votre projet au moment de réserver pour une estimation juste.",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "Le nail art se pose-t-il sur semi-permanent ou sur gel ?",
      answer:
        "Les deux sont possibles. Le semi-permanent convient très bien à un décor sur ongle naturel (motifs peints, chrome, cat eye, aura) et tient environ trois semaines. Le gel apporte longueur et solidité : on le privilégie pour les reliefs 3D et les décors chargés en strass. L'équipe vous conseille la base la plus adaptée à vos ongles.",
    },
    {
      question: "Combien de temps tient un nail art ?",
      answer:
        "Un nail art dure aussi longtemps que sa base : environ trois semaines sur semi-permanent et jusqu'à quatre semaines sur gel avec entretien. La finition posée par-dessus protège le motif au quotidien. Éviter les chocs et hydrater les cuticules aide le décor à rester net plus longtemps.",
    },
    {
      question: "Puis-je venir avec une photo de modèle ?",
      answer:
        "Oui, et c'est même le plus simple. Une photo nous aide à cerner la couleur, le motif et le niveau de détail que vous recherchez. On vous dit alors ce qui est réalisable sur vos ongles, on adapte si besoin, et on vous confirme le tarif correspondant avant de commencer.",
    },
    {
      question: "Faut-il des ongles longs pour faire du nail art ?",
      answer:
        "Non. Un décor discret, un effet chrome ou un liseré rendent très bien sur ongles courts et restent pratiques au quotidien. Les longueurs plus importantes laissent simplement plus de place aux motifs travaillés et aux reliefs. Si vous voulez de la longueur pour un décor précis, la pose en gel est là pour ça.",
    },
    {
      question: "Le nail art abîme-t-il les ongles ?",
      answer:
        "Réalisé avec soin et déposé correctement, le nail art n'abîme pas l'ongle naturel. Nous préparons la surface sans excès, utilisons des produits professionnels et privilégions une dépose en douceur plutôt qu'un arrachage. Si vos ongles sont fragiles, l'équipe adapte le décor et la technique.",
    },
    {
      question: "Combien coûte un nail art à Gentilly ?",
      answer:
        "Le nail art se facture le plus souvent à l'ongle, à partir d'environ 5 € par ongle, en supplément de la base (semi-permanent dès 20 €, pose gel dès 35 €). Le prix final dépend de la complexité du motif et du nombre d'ongles décorés. Ces tarifs sont indicatifs et confirmés lors de la réservation.",
    },
    {
      question: "Où se situe l'institut et comment y accéder ?",
      answer:
        "Do Beauty se trouve au 12 Avenue Jean Jaurès, 94250 Gentilly, aux portes de Paris. On y vient par la gare RER B « Gentilly », par le tramway T3a le long des maréchaux, ou en voiture depuis Le Kremlin-Bicêtre, Arcueil et Montrouge, à quelques minutes seulement.",
    },
  ],
  related: [
    { label: "Vernis semi-permanent", href: "/semi-permanent-gentilly" },
    { label: "Pose d'ongles en gel", href: "/ongles-gel-gentilly" },
    { label: "Manucure à Gentilly", href: "/manucure-gentilly" },
    { label: "Onglerie à Gentilly", href: "/onglerie-gentilly" },
    { label: "Institut de beauté à Gentilly", href: "/institut-de-beaute-gentilly" },
    { label: "Beauté des pieds", href: "/beaute-des-pieds-gentilly" },
    { label: "Nail art au Kremlin-Bicêtre", href: "/onglerie-le-kremlin-bicetre" },
    { label: "Nos menus & tarifs", href: "/menus" },
    { label: "Galerie de réalisations", href: "/galerie" },
  ],
}
