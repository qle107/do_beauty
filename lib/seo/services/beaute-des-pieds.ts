import type { LandingPage } from "@/lib/seo/types"

/**
 * Service landing page — Beauté des pieds à Gentilly.
 * Hand-written, locally grounded copy. Prices are indicative only.
 */

export const page: LandingPage = {
  slug: "beaute-des-pieds-gentilly",
  meta: {
    title: "Beauté des pieds à Gentilly (94) · Do Beauty — soin & vernis 7j/7",
    description:
      "Beauté des pieds à Gentilly (94250) chez Do Beauty : soin complet des pieds, vernis classique ou semi-permanent sur les orteils. Institut ouvert 7 jours sur 7, 4,6★ sur 99 avis Google. Réservation en ligne.",
  },
  breadcrumbLabel: "Beauté des pieds Gentilly",
  h1: "Beauté des pieds à Gentilly",
  lead:
    "Au 12 Avenue Jean Jaurès, Do Beauty prend soin de vos pieds de la plante aux ongles : soin complet, ongles remis en forme et vernis classique ou semi-permanent sur les orteils, réalisés par une petite équipe d'expertes, du lundi au dimanche.",
  ctaCategory: "PIEDS",
  service: {
    name: "Beauté des pieds",
    serviceType: "Soin des pieds et pose de vernis",
    description:
      "Beauté des pieds à Gentilly : soin complet des pieds, mise en forme des ongles, adoucissement des talons et pose de vernis classique ou semi-permanent, dans un institut ouvert 7 jours sur 7.",
    fromPrice: 25,
  },
  sections: [
    {
      h2: "Ce que comprend une beauté des pieds",
      blocks: [
        {
          kind: "paragraph",
          text:
            "Une beauté des pieds, ce n'est pas qu'une couche de vernis. À Gentilly, le soin commence par un bain qui détend et assouplit la peau, puis l'experte remet les ongles en forme, nettoie le contour et repousse les cuticules avec douceur. Vient ensuite le travail sur les zones rugueuses — talons, coussinets — pour lisser les callosités, avant un gommage qui affine le grain de peau et une crème qui nourrit et hydrate. On termine, si vous le souhaitez, par la pose d'un vernis. Le résultat, ce sont des pieds nets, souples et agréables à porter dans une sandale comme dans une chaussure fermée.",
        },
        {
          kind: "list",
          items: [
            "Bain relaxant pour assouplir la peau et détendre les pieds",
            "Coupe et mise en forme des ongles, nettoyage du contour",
            "Repousse des cuticules en douceur",
            "Adoucissement des talons et des zones rugueuses",
            "Gommage exfoliant puis massage à la crème hydratante",
            "Pose de vernis classique ou semi-permanent en option",
          ],
        },
      ],
    },
    {
      h2: "Vernis classique ou semi-permanent sur les orteils",
      blocks: [
        {
          kind: "paragraph",
          text:
            "Une fois les pieds soignés, la couleur se choisit selon l'occasion et la tenue recherchée. Le vernis classique convient très bien à une envie ponctuelle : il sèche vite et se retire facilement. Le semi-permanent, lui, est passé sous lampe LED et tient plusieurs semaines sans s'écailler — un vrai atout pour la saison des sandales ou avant un départ en vacances, quand on veut des orteils impeccables sans avoir à y penser. Sur les pieds, sa tenue est souvent plus longue que sur les mains, car les ongles des orteils poussent lentement et sont moins sollicités.",
        },
        {
          kind: "list",
          items: [
            "Vernis classique : couleur immédiate, idéale pour une occasion",
            "Vernis semi-permanent : tenue de plusieurs semaines sans écaillage",
            "Large choix de teintes, du nude discret au rouge franc",
            "Finition brillante ou plus mate selon vos goûts",
            "Petit décor possible sur le gros orteil pour l'été",
          ],
        },
      ],
    },
    {
      h2: "Prendre soin de ses pieds au fil des saisons",
      blocks: [
        {
          kind: "paragraph",
          text:
            "Les pieds ne demandent pas la même attention toute l'année. Aux beaux jours, quand on passe aux sandales et aux nu-pieds, on cherche des talons lisses et des orteils bien mis en couleur : c'est la période où la beauté des pieds et le semi-permanent sont les plus demandés. En hiver, les pieds restent enfermés dans des chaussures fermées et des collants, la peau s'assèche et les talons ont tendance à se corner ; un soin régulier les garde souples et évite d'attaquer le printemps avec des callosités installées. L'idéal est un rendez-vous à chaque changement de saison, avec un entretien plus rapproché l'été.",
        },
        {
          kind: "list",
          items: [
            "Au printemps : préparer les pieds avant la saison des sandales",
            "En été : talons lisses, orteils en couleur, tenue longue durée",
            "En automne : réparer après l'été et les pieds nus",
            "En hiver : nourrir une peau qui s'assèche sous les chaussures fermées",
          ],
        },
      ],
    },
    {
      h2: "Une hygiène soignée à chaque rendez-vous",
      blocks: [
        {
          kind: "paragraph",
          text:
            "Le soin des pieds demande une propreté irréprochable, et c'est un point sur lequel l'équipe ne transige pas. Les instruments réutilisables sont nettoyés et désinfectés entre deux clientes, les limes, râpes et accessoires à usage unique sont renouvelés à chaque rendez-vous, et le bassin comme le poste de travail sont assainis avant chaque soin. Nous utilisons des produits professionnels et vous indiquons clairement ce qui est appliqué. Si vous présentez une mycose, une plaie ou une affection de la peau, dites-le-nous : certains soins seront alors reportés ou orientés vers un professionnel de santé.",
        },
        {
          kind: "list",
          items: [
            "Désinfection des instruments réutilisables entre chaque cliente",
            "Limes, râpes et accessoires jetables changés à chaque soin",
            "Bassin et plan de travail nettoyés avant chaque rendez-vous",
            "Produits professionnels, avec des conseils d'entretien à la maison",
          ],
        },
      ],
    },
    {
      h2: "Tarifs indicatifs de la beauté des pieds",
      blocks: [
        {
          kind: "pricing",
          rows: [
            { label: "Beauté des pieds (soin complet)", price: "à partir de 25 €" },
            { label: "Vernis semi-permanent sur les orteils", price: "à partir de 20 €" },
            { label: "Beauté des pieds + semi-permanent", price: "à partir de 40 €" },
            { label: "Nail art (par ongle)", price: "à partir de 5 €" },
          ],
        },
        {
          kind: "paragraph",
          text:
            "Tarifs indicatifs, confirmés lors de la réservation. Le prix final dépend de l'état des pieds, du soin choisi et de la finition souhaitée. Précisez-nous votre demande au moment de réserver pour une estimation juste.",
        },
      ],
    },
    {
      h2: "La beauté des pieds à Gentilly, aux portes de Paris",
      blocks: [
        {
          kind: "paragraph",
          text:
            "Gentilly touche Paris : l'institut se trouve à quelques minutes de la Porte de Gentilly et de la Porte d'Italie, tout près des 13e et 14e arrondissements. On y accède par la gare RER B « Gentilly », par le tramway T3a le long des maréchaux, ou en voiture depuis Le Kremlin-Bicêtre, Arcueil et Montrouge. Vous profitez ainsi d'un vrai soin des pieds aux portes de la capitale, sans le temps de trajet ni les tarifs des salons du centre, et avec des créneaux en soirée et le week-end.",
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
      question: "Combien de temps dure une beauté des pieds ?",
      answer:
        "Comptez environ trois quarts d'heure pour un soin complet des pieds, un peu plus si vous ajoutez la pose d'un vernis semi-permanent. La durée varie selon l'état des talons et le travail nécessaire. La réservation en ligne vous laisse choisir le créneau, y compris en soirée et le week-end.",
    },
    {
      question: "Le vernis semi-permanent tient-il bien sur les orteils ?",
      answer:
        "Oui, et souvent mieux que sur les mains : les ongles des orteils poussent lentement et sont moins sollicités. Posé sous lampe LED, le semi-permanent garde son éclat plusieurs semaines sans s'écailler, ce qui en fait un choix idéal pour l'été ou avant un départ en vacances.",
    },
    {
      question: "Quelle est la différence entre une beauté des pieds et une pédicure médicale ?",
      answer:
        "La beauté des pieds est un soin esthétique : mise en forme des ongles, adoucissement des talons, gommage, hydratation et pose de vernis. Elle n'inclut pas les actes de soin réservés au pédicure-podologue, comme le traitement d'un ongle incarné ou d'une pathologie. En cas de souci de santé, nous vous orientons vers un professionnel de santé.",
    },
    {
      question: "À quelle fréquence faire une beauté des pieds ?",
      answer:
        "Un rendez-vous à chaque changement de saison suffit pour garder des pieds soignés, avec un entretien plus rapproché l'été quand on porte des sandales. Si vous choisissez le semi-permanent, comptez une nouvelle pose toutes les quatre à six semaines environ, selon la pousse.",
    },
    {
      question: "Que faire si j'ai les talons très secs ou fendillés ?",
      answer:
        "Le soin comprend justement l'adoucissement des talons et des zones rugueuses, suivi d'un gommage et d'une crème nourrissante. Sur des talons très secs, quelques rendez-vous réguliers donnent un meilleur résultat qu'une seule séance, et nous vous conseillons une routine simple à poursuivre à la maison.",
    },
    {
      question: "Est-ce hygiénique ? Comment le matériel est-il nettoyé ?",
      answer:
        "L'hygiène est une priorité. Les instruments réutilisables sont désinfectés entre chaque cliente, les limes, râpes et accessoires jetables sont changés à chaque soin, et le bassin comme le poste de travail sont assainis avant votre rendez-vous. En cas de mycose ou de plaie, prévenez-nous afin d'adapter le soin.",
    },
    {
      question: "Où se situe l'institut et comment y accéder ?",
      answer:
        "Do Beauty se trouve au 12 Avenue Jean Jaurès, 94250 Gentilly, aux portes de Paris. On y vient par la gare RER B « Gentilly », par le tramway T3a, ou en voiture depuis Le Kremlin-Bicêtre, Arcueil et Montrouge, à quelques minutes seulement.",
    },
  ],
  related: [
    { label: "Manucure à Gentilly", href: "/manucure-gentilly" },
    { label: "Vernis semi-permanent", href: "/semi-permanent-gentilly" },
    { label: "Pose d'ongles en gel", href: "/ongles-gel-gentilly" },
    { label: "Nail art", href: "/nail-art-gentilly" },
    { label: "Onglerie à Gentilly", href: "/onglerie-gentilly" },
    { label: "Institut de beauté à Gentilly", href: "/institut-de-beaute-gentilly" },
    { label: "Onglerie à Villejuif", href: "/onglerie-villejuif" },
    { label: "Nos menus & tarifs", href: "/menus" },
    { label: "Galerie de réalisations", href: "/galerie" },
  ],
}
