import type { LandingPage } from "@/lib/seo/types"

/**
 * Service landing page — Ongles en gel à Gentilly.
 * Hand-written, locally grounded copy. Prices are indicative only.
 */

export const page: LandingPage = {
  slug: "ongles-gel-gentilly",
  meta: {
    title: "Ongles en gel à Gentilly (94) · Do Beauty — pose & remplissage",
    description:
      "Pose d'ongles en gel à Gentilly (94250) chez Do Beauty : renforcement, rallongement, choix de la forme, remplissage toutes les 3 à 4 semaines et dépose en douceur. Ouvert du lundi au samedi, 4,6★ sur 99 avis Google. Réservation en ligne.",
  },
  breadcrumbLabel: "Ongles en gel Gentilly",
  h1: "Pose d'ongles en gel à Gentilly",
  lead:
    "Au 12 Avenue Jean Jaurès, l'équipe de Do Beauty pose, renforce et rallonge vos ongles en gel selon la forme et la longueur qui vous vont : un résultat solide qui tient dans le temps, à quelques minutes des portes de Paris.",
  ctaCategory: "CAPSULE",
  service: {
    name: "Ongles en gel",
    serviceType: "Pose et renforcement d'ongles en gel",
    description:
      "Pose d'ongles en gel à Gentilly : renforcement de l'ongle naturel, rallongement sur capsule ou chablon, remplissage régulier et dépose maîtrisée, dans un institut ouvert du lundi au samedi.",
    fromPrice: 35,
  },
  sections: [
    {
      h2: "Le gel, une matière qui s'adapte à vos ongles",
      blocks: [
        {
          kind: "paragraph",
          text:
            "Le gel est une matière constructrice que l'on applique sur l'ongle et que l'on durcit sous lampe LED. Contrairement au vernis semi-permanent, qui ne fait qu'habiller l'ongle naturel, le gel a de la matière : il peut épaissir un ongle fin, rattraper une casse, ajouter de la longueur ou simplement donner une belle surface bien lisse. C'est la solution que l'on choisit chez Do Beauty quand on veut de la tenue et de la solidité, pas seulement de la couleur.",
        },
        {
          kind: "paragraph",
          text:
            "Avant toute pose, l'experte regarde l'état de vos ongles et vous demande votre mode de vie : un travail manuel, des ongles qui se dédoublent, une pousse capricieuse ou l'envie d'une longueur pour une occasion ne mènent pas à la même pose. Le gel s'ajuste à chaque main, c'est tout son intérêt.",
        },
      ],
    },
    {
      h2: "Pose, renforcement ou rallongement : trois façons de travailler le gel",
      blocks: [
        {
          kind: "paragraph",
          text:
            "On parle souvent de « pose gel » comme d'une seule chose, alors qu'il y en a plusieurs. Selon vos ongles et ce que vous cherchez, l'équipe vous oriente vers l'une de ces trois approches.",
        },
        {
          kind: "list",
          items: [
            "Renforcement sur ongle naturel : une fine couche de gel appliquée directement sur votre ongle, sans longueur ajoutée, pour le solidifier et l'accompagner pendant sa pousse — idéal pour les ongles mous ou cassants.",
            "Rallongement sur capsule ou chablon : on ajoute de la longueur avec une capsule collée puis sculptée, ou à main levée sur un chablon, pour gagner quelques millimètres tout en gardant un rendu naturel.",
            "Pose complète avec couleur ou french : une construction de gel bien lisse, prête à recevoir une teinte, une french ou un nail art, avec une tenue d'environ quatre semaines.",
          ],
        },
      ],
    },
    {
      h2: "Choisir la forme de ses ongles",
      blocks: [
        {
          kind: "paragraph",
          text:
            "La forme change tout : le rendu, mais aussi le confort au quotidien. Une forme courte et arrondie casse moins et se vit facilement au travail ou avec des enfants ; l'amande et le carré arrondi allongent visuellement les doigts sans être fragiles ; les formes plus marquées, comme la ballerine, demandent un peu de longueur et laissent de la place au décor. En cas d'hésitation, l'experte vous montre ce qui tiendra le mieux selon la solidité de vos ongles et vos habitudes.",
        },
        {
          kind: "list",
          items: [
            "Ronde et courte : discrète, solide, parfaite pour une première pose",
            "Ovale : douce et féminine, elle affine la main sans excès de longueur",
            "Amande : élancée et élégante, très demandée, elle allonge le doigt",
            "Carré et carré arrondi : moderne et net, pratique au quotidien",
            "Ballerine (dite « cercueil ») : longue et graphique, idéale pour le nail art",
          ],
        },
      ],
    },
    {
      h2: "Gel ou résine : quelle matière pour vous ?",
      blocks: [
        {
          kind: "paragraph",
          text:
            "Gel et résine (acrylique) mènent toutes deux à des ongles renforcés ou rallongés, mais leur toucher et leur entretien diffèrent. Le gel offre un rendu brillant et naturel, une pose sans odeur forte et un confort très souple ; c'est ce que la plupart des clientes préfèrent. La résine, plus rigide, encaisse bien les longueurs importantes et les ongles très sollicités. L'équipe vous conseille selon la solidité recherchée, l'état de vos ongles et le résultat que vous imaginez — il n'y a pas de « meilleure » matière dans l'absolu, seulement celle qui convient à votre main.",
        },
        {
          kind: "list",
          items: [
            "Gel : brillance naturelle, pose souple et sans odeur marquée, entretien facile",
            "Résine : plus rigide, adaptée aux longueurs importantes et aux ongles très sollicités",
            "Dans les deux cas : préparation soignée de l'ongle et dépose maîtrisée",
          ],
        },
      ],
    },
    {
      h2: "Remplissage toutes les 3 à 4 semaines et dépose en douceur",
      blocks: [
        {
          kind: "paragraph",
          text:
            "Vos ongles poussent, et un espace apparaît petit à petit à la base de la pose. Au bout de trois à quatre semaines, on procède à un remplissage : on comble cette repousse et on rééquilibre la structure sans tout retirer. C'est plus rapide et plus économique qu'une nouvelle pose complète, et cela préserve la longueur déjà installée. Nous vous indiquons le bon rythme selon votre pousse pour garder des ongles nets sans les laisser trop se dégarnir.",
        },
        {
          kind: "paragraph",
          text:
            "Quand vous souhaitez arrêter, la dépose se fait à l'institut, en douceur. On lime la couche de surface puis on retire la matière sans arrachage, pour ne pas fragiliser l'ongle naturel. Décoller une pose gel soi-même à la maison est le meilleur moyen d'abîmer la surface : mieux vaut prévoir un rendez-vous de dépose, avec si besoin un petit soin nourrissant pour laisser l'ongle repartir sur de bonnes bases.",
        },
      ],
    },
    {
      h2: "Tarifs indicatifs des ongles en gel",
      blocks: [
        {
          kind: "pricing",
          rows: [
            { label: "Pose d'ongles en gel (couleur ou naturel)", price: "à partir de 35 €" },
            { label: "Rallongement / renforcement en gel", price: "à partir de 35 €" },
            { label: "Remplissage gel", price: "à partir de 25 €" },
            { label: "Dépose (avec repose)", price: "à partir de 10 €" },
            { label: "Nail art (par ongle)", price: "à partir de 5 €" },
          ],
        },
        {
          kind: "paragraph",
          text:
            "Tarifs indicatifs, confirmés lors de la réservation. Le prix final dépend de la longueur, de la forme, de la finition et du décor souhaités. Précisez votre projet au moment de réserver pour une estimation juste.",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "Combien de temps tient une pose d'ongles en gel ?",
      answer:
        "Une pose en gel tient en moyenne quatre semaines. Au-delà, la repousse devient visible à la base : c'est le moment idéal pour un remplissage, qui prolonge la pose sans tout refaire. La tenue dépend aussi de votre pousse et de vos activités manuelles.",
    },
    {
      question: "La pose en gel abîme-t-elle l'ongle naturel ?",
      answer:
        "Réalisée avec soin et déposée correctement, une pose en gel n'abîme pas l'ongle. Chez Do Beauty, nous préparons la surface sans excès et privilégions une dépose en douceur, sans arrachage. Si vos ongles sont fragiles, l'équipe vous oriente vers un renforcement respectueux plutôt que vers une grande longueur.",
    },
    {
      question: "Quelle différence entre un remplissage et une nouvelle pose ?",
      answer:
        "Le remplissage comble la repousse et rééquilibre la structure existante toutes les trois à quatre semaines : c'est plus rapide et plus économique. Une nouvelle pose consiste à tout retirer puis à repartir de zéro, par exemple pour changer de forme ou de longueur.",
    },
    {
      question: "Gel ou vernis semi-permanent, que choisir ?",
      answer:
        "Le semi-permanent est une couleur longue tenue posée sur l'ongle naturel, sans matière ajoutée (tenue d'environ trois semaines). Le gel est une matière constructrice qui renforce ou rallonge l'ongle (tenue d'environ quatre semaines avec remplissage). Si vous cherchez surtout de la couleur, le semi-permanent suffit ; si vous voulez de la solidité ou de la longueur, on part sur le gel.",
    },
    {
      question: "Peut-on faire du nail art sur des ongles en gel ?",
      answer:
        "Oui, et le gel s'y prête très bien : french, effet chrome, dégradé, décor peint à la main ou strass s'appliquent sur la pose. Les formes un peu longues comme l'amande ou la ballerine laissent davantage de place au décor. Dites-nous votre idée au moment de réserver pour confirmer ce qui est réalisable et le tarif.",
    },
    {
      question: "Faut-il enlever le gel soi-même à la maison ?",
      answer:
        "Non, mieux vaut l'éviter. Décoller une pose gel à la maison arrache une partie de l'ongle naturel et le fragilise. La dépose se fait à l'institut, en limant la surface puis en retirant la matière sans forcer, avec au besoin un soin nourrissant. Prévoyez simplement un rendez-vous de dépose.",
    },
    {
      question: "Où faire poser ses ongles en gel à Gentilly ?",
      answer:
        "Do Beauty vous accueille au 12 Avenue Jean Jaurès, 94250 Gentilly, aux portes de Paris (13e et 14e). On y vient par la gare RER B « Gentilly », par le tramway T3a près de la Porte de Gentilly, ou en voiture depuis Le Kremlin-Bicêtre, Arcueil et Montrouge. Réservation en ligne, ouvert du lundi au samedi.",
    },
  ],
  related: [
    { label: "Onglerie à Gentilly", href: "/onglerie-gentilly" },
    { label: "Vernis semi-permanent", href: "/semi-permanent-gentilly" },
    { label: "Manucure à Gentilly", href: "/manucure-gentilly" },
    { label: "Nail art", href: "/nail-art-gentilly" },
    { label: "Beauté des pieds", href: "/beaute-des-pieds-gentilly" },
    { label: "Institut de beauté à Gentilly", href: "/institut-de-beaute-gentilly" },
    { label: "Onglerie à Arcueil", href: "/onglerie-arcueil" },
    { label: "Nos menus & tarifs", href: "/menus" },
    { label: "Galerie de réalisations", href: "/galerie" },
  ],
}
