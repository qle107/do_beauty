import type { LandingPage } from "@/lib/seo/types"

/**
 * Service landing page - Manucure à Gentilly.
 * Hand-written, locally grounded copy. Prices are indicative only.
 */

export const page: LandingPage = {
  slug: "manucure-gentilly",
  meta: {
    title: "Manucure à Gentilly (94) · Do Beauty - institut du lundi au samedi",
    description:
      "Manucure à Gentilly (94250) chez Do Beauty : manucure classique, française, russe, baby-boomer et semi-permanent, par une équipe d'expertes. Ouvert du lundi au samedi, 4,6★ sur 99 avis Google. Réservation en ligne.",
  },
  breadcrumbLabel: "Manucure Gentilly",
  h1: "Manucure à Gentilly",
  lead:
    "Au 12 Avenue Jean Jaurès, Do Beauty prend soin de vos mains du lundi au samedi : mise en forme des ongles, soin des cuticules et finition au choix, du plus naturel au plus travaillé. Une petite équipe qui ne bâcle rien.",
  ctaCategory: "MAINS",
  service: {
    name: "Manucure",
    serviceType: "Soin et mise en beauté des mains",
    description:
      "Manucure à Gentilly : soin des ongles et des cuticules, mise en forme et finition - classique, française, russe, baby-boomer ou semi-permanent - dans un institut ouvert du lundi au samedi.",
    fromPrice: 15,
  },
  sections: [
    {
      h2: "Les types de manucure proposés",
      blocks: [
        {
          kind: "paragraph",
          text:
            "Le mot manucure regroupe en réalité plusieurs prestations, qui vont du simple soin des mains à une finition plus construite. Toutes partent du même principe : préparer l'ongle et la peau autour, puis choisir la finition qui vous convient. À Gentilly, l'équipe de Do Beauty vous conseille selon l'état de vos ongles, votre mode de vie et le rendu recherché, discret pour le quotidien ou plus marqué pour une occasion.",
        },
        {
          kind: "list",
          items: [
            "Manucure classique : mise en forme des ongles, soin des cuticules, pose d'un vernis traditionnel ou finition naturelle",
            "Manucure française : base rosée ou nude et liseré blanc au bout de l'ongle, un rendu net et intemporel",
            "Manucure russe : travail précis des cuticules à la fraise pour dégager la lunule, base de pose très propre et durable",
            "Manucure baby-boomer : dégradé doux du nude vers le blanc, une french modernisée et fondue",
            "Manucure semi-permanent : couleur longue tenue posée sur l'ongle naturel, qui garde son éclat environ trois semaines",
          ],
        },
      ],
    },
    {
      h2: "Comment se déroule une manucure chez Do Beauty",
      blocks: [
        {
          kind: "paragraph",
          text:
            "On commence par un échange rapide sur ce que vous cherchez et par un coup d'œil à l'état de vos ongles. L'experte lime ensuite pour donner la forme voulue - carré, arrondi, amande - puis s'occupe des cuticules, repoussées et nettoyées avec douceur pour dégager la surface de l'ongle. Vient le temps du soin de la peau des mains, avant la finition choisie : vernis classique, french ou pose de semi-permanent fixée sous lampe LED.",
        },
        {
          kind: "paragraph",
          text:
            "Comptez environ trente minutes pour une manucure simple et autour de quarante-cinq minutes lorsqu'on ajoute un vernis semi-permanent. Rien n'est expédié : le but est un résultat net, avec des ongles bien dessinés et des contours propres. La réservation en ligne vous laisse choisir la prestation et le créneau, y compris en soirée et le week-end.",
        },
      ],
    },
    {
      h2: "Manucure ou vernis semi-permanent : quelle différence ?",
      blocks: [
        {
          kind: "paragraph",
          text:
            "C'est la question qui revient le plus souvent. Une manucure, au sens strict, c'est le soin qui prépare et embellit la main : forme de l'ongle, cuticules, hydratation. Le vernis semi-permanent, lui, est une finition longue tenue que l'on pose au terme de cette préparation. Les deux ne s'opposent donc pas : le semi-permanent est l'une des manières de terminer une manucure, quand on veut une couleur qui dure.",
        },
        {
          kind: "list",
          items: [
            "Manucure avec vernis classique : couleur qui tient quelques jours, se retire facilement à la maison, idéale pour changer souvent de teinte",
            "Manucure avec semi-permanent : couleur qui tient environ trois semaines sans s'écailler, brillance conservée, dépose à réaliser en institut",
            "La manucure russe et la manucure classique désignent la préparation ; la finition, elle, peut être un vernis simple ou un semi-permanent",
            "En cas d'hésitation, l'équipe vous oriente selon la tenue souhaitée et l'occasion",
          ],
        },
      ],
    },
    {
      h2: "Entretenir sa manucure au quotidien",
      blocks: [
        {
          kind: "paragraph",
          text:
            "Une belle manucure se prolonge avec quelques gestes simples. L'ennemi principal reste le dessèchement : des cuticules et une peau nourries gardent des ongles souples, qui cassent et se dédoublent moins. Pour un semi-permanent, mieux vaut éviter de tirer ou de gratter la couleur, et prévoir une dépose en douceur en institut plutôt qu'un arrachage qui fragilise l'ongle naturel.",
        },
        {
          kind: "list",
          items: [
            "Appliquez une huile ou un baume sur les cuticules régulièrement pour nourrir la peau",
            "Portez des gants pour la vaisselle et le ménage : l'eau chaude et les produits usent le vernis",
            "Ne vous servez pas de vos ongles comme d'un outil, pour éviter les chocs et les décollements",
            "Pour un semi-permanent, prévoyez une dépose en institut plutôt que de le retirer vous-même",
            "Un renouvellement toutes les trois semaines environ garde des mains toujours nettes",
          ],
        },
      ],
    },
    {
      h2: "Tarifs indicatifs de la manucure",
      blocks: [
        {
          kind: "pricing",
          rows: [
            { label: "Manucure (mise en beauté des mains)", price: "à partir de 15 €" },
            { label: "Manucure + vernis semi-permanent", price: "à partir de 33 €" },
            { label: "French / baby-boomer", price: "à partir de 25 €" },
            { label: "Nail art (par ongle)", price: "à partir de 5 €" },
            { label: "Beauté des pieds", price: "à partir de 25 €" },
          ],
        },
        {
          kind: "paragraph",
          text:
            "Tarifs indicatifs, confirmés lors de la réservation. Le prix final dépend de la finition, de la couleur et du décor souhaités. Précisez votre projet au moment de réserver pour une estimation juste.",
        },
      ],
    },
    {
      h2: "Une manucure à Gentilly, aux portes de Paris",
      blocks: [
        {
          kind: "paragraph",
          text:
            "Gentilly touche Paris : l'institut se trouve à quelques minutes de la Porte de Gentilly et de la Porte d'Italie, tout près des 13e et 14e arrondissements. On y accède par la gare RER B « Gentilly », par le tramway T3a le long des maréchaux, ou en voiture depuis Le Kremlin-Bicêtre, Arcueil et Montrouge. Une vraie manucure de quartier, soignée et sans précipitation, à faire aux portes de la capitale sans le temps de trajet ni les tarifs du centre.",
        },
        {
          kind: "list",
          items: [
            "Aux portes de Paris (13e et 14e), près de la Porte de Gentilly et de la Porte d'Italie",
            "Accessible en RER B (gare « Gentilly ») et en tramway T3a",
            "Facile depuis Le Kremlin-Bicêtre, Arcueil, Cachan, Montrouge, Villejuif et Ivry-sur-Seine",
            "Ouvert du lundi au samedi, créneaux en soirée, réservation en ligne",
            "Une note de 4,6★ sur près de 99 avis Google",
          ],
        },
      ],
    },
  ],
  faqs: [
    {
      question: "Quelle est la différence entre une manucure et un semi-permanent ?",
      answer:
        "La manucure est le soin qui prépare et embellit la main : mise en forme de l'ongle, soin des cuticules, hydratation. Le vernis semi-permanent est une finition longue tenue que l'on pose à la fin de cette préparation et qui garde son éclat environ trois semaines. Le semi-permanent est donc l'une des façons de terminer une manucure.",
    },
    {
      question: "Combien de temps dure une manucure chez Do Beauty ?",
      answer:
        "Comptez environ trente minutes pour une manucure simple et autour de quarante-cinq minutes avec un vernis semi-permanent. La durée varie selon la finition choisie et le nail art éventuel. Vous choisissez la prestation au moment de réserver en ligne.",
    },
    {
      question: "Qu'est-ce que la manucure russe ?",
      answer:
        "La manucure russe désigne un travail précis des cuticules réalisé à la fraise pour dégager la lunule et nettoyer parfaitement le contour de l'ongle. Cette préparation très soignée donne une base de pose nette et durable. L'équipe de Do Beauty adapte le geste à la sensibilité et à l'état de vos ongles.",
    },
    {
      question: "Faut-il prendre rendez-vous pour une manucure ?",
      answer:
        "Nous vous conseillons de réserver en ligne pour être certaine d'avoir un créneau, surtout le week-end et en soirée. La réservation se fait en quelques instants depuis votre mobile, du lundi au samedi. Le passage sans rendez-vous reste possible selon les disponibilités du moment.",
    },
    {
      question: "Combien de temps tient une manucure ?",
      answer:
        "Une manucure avec vernis classique tient quelques jours et se retire facilement à la maison. Avec un vernis semi-permanent, la couleur garde son éclat environ trois semaines sans s'écailler. Quelques gestes simples, comme nourrir les cuticules et porter des gants pour le ménage, prolongent le résultat.",
    },
    {
      question: "Proposez-vous la manucure française et la baby-boomer ?",
      answer:
        "Oui. La manucure française associe une base rosée ou nude à un liseré blanc au bout de l'ongle, pour un rendu net et intemporel. La baby-boomer en est une version fondue, avec un dégradé doux du nude vers le blanc. Les deux se réalisent en vernis classique ou en semi-permanent, selon la tenue souhaitée.",
    },
    {
      question: "Où se situe l'institut et comment y accéder ?",
      answer:
        "Do Beauty se trouve au 12 Avenue Jean Jaurès, 94250 Gentilly, aux portes de Paris. On y vient par la gare RER B « Gentilly », par le tramway T3a, ou en voiture depuis Le Kremlin-Bicêtre, Arcueil et Montrouge, à quelques minutes seulement.",
    },
  ],
  related: [
    { label: "Onglerie & bar à ongles à Gentilly", href: "/onglerie-gentilly" },
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
