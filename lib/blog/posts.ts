import type { FaqEntry } from '@/lib/seo/faqs'
import type { ContentBlock, RelatedLink } from '@/lib/seo/landing-pages'

/**
 * Blog post ("Conseils") - mirrors the SEO landing-page model and reuses the
 * same ContentBlock renderer. Each post is one typed object in the registry,
 * rendered by components/blog/BlogArticle.tsx via app/(public)/conseils/[slug].
 */

export type BlogSection = {
  h2: string
  blocks: readonly ContentBlock[]
}

export type BlogPost = {
  slug: string
  meta: { title: string; description: string }
  /** H1 + index card heading. */
  title: string
  /** One-sentence summary for the index and the article lead. */
  excerpt: string
  /** ISO date (yyyy-mm-dd) used for the Article schema and display. */
  datePublished: string
  dateModified: string
  /** Estimated reading time in minutes (shown on the card). */
  readingMinutes: number
  sections: readonly BlogSection[]
  faqs?: readonly FaqEntry[]
  related: readonly RelatedLink[]
}

// ─── 1. Faire durer son vernis semi-permanent ─────────────────────────────

const faireDurerSemiPermanent: BlogPost = {
  slug: 'comment-faire-durer-son-vernis-semi-permanent',
  meta: {
    title: 'Comment faire durer son vernis semi-permanent · Conseils VyNails93',
    description:
      'Huile à cuticules, gestes à éviter, soin maison : nos conseils de prothésiste pour faire tenir votre semi-permanent 3 semaines sans écaillage.',
  },
  title: 'Comment faire durer son vernis semi-permanent',
  excerpt:
    'Un semi-permanent bien posé tient trois semaines - à condition de l\'entretenir. Voici les gestes simples qui font la différence entre une pose qui décolle au bout de 5 jours et une pose impeccable jusqu\'au prochain rendez-vous.',
  datePublished: '2026-02-10',
  dateModified: '2026-02-10',
  readingMinutes: 4,
  sections: [
    {
      h2: 'La tenue se joue d\'abord à la pose',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Avant même de parler entretien, sachez que 70 % de la tenue dépend de la préparation de l\'ongle : déshydratation, ponçage léger, application en couches fines et polymérisation complète sous LED. Une pose bâclée ne tiendra jamais, même avec le meilleur entretien. C\'est pour ça qu\'une pose réalisée par une professionnelle fait toute la différence.',
        },
        {
          kind: 'paragraph',
          text:
            'Une fois la pose réussie, votre rôle commence : l\'entretien quotidien fait gagner facilement une semaine de tenue.',
        },
      ],
    },
    {
      h2: 'L\'huile à cuticules, votre meilleure alliée',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'C\'est le geste numéro un, et le plus négligé. Une cuticule hydratée reste souple et n\'arrache pas la base du vernis. Appliquez une goutte d\'huile à cuticules matin et soir, en massant le contour de chaque ongle. Contrairement à une idée reçue, l\'huile ne décolle pas le semi-permanent : elle protège la zone la plus fragile, là où le décollement commence.',
        },
        {
          kind: 'list',
          items: [
            'Matin et soir, une goutte d\'huile sur chaque contour d\'ongle',
            'Massez jusqu\'à pénétration complète',
            'Gardez un petit flacon dans votre sac pour les retouches de la journée',
          ],
        },
      ],
    },
    {
      h2: 'Les gestes qui abîment (et comment les éviter)',
      blocks: [
        {
          kind: 'list',
          items: [
            'Faire la vaisselle ou le ménage sans gants - les détergents et l\'eau chaude attaquent les bords',
            'Utiliser ses ongles comme outils (décoller une étiquette, ouvrir une canette)',
            'Limer ou « rectifier » la pose soi-même à la maison',
            'Tremper longuement les mains (bains très chauds, vaisselle prolongée)',
            'Gratter ou tirer sur un coin qui commence à se soulever',
          ],
        },
        {
          kind: 'paragraph',
          text:
            'Le réflexe à bannir absolument : arracher une pose qui se décolle. Vous emporteriez les couches superficielles de l\'ongle naturel. Si un coin se soulève, prenez rendez-vous pour une dépose propre.',
        },
      ],
    },
    {
      h2: 'Le soin maison entre deux rendez-vous',
      blocks: [
        {
          kind: 'list',
          items: [
            'Portez des gants pour la vaisselle et le ménage',
            'Hydratez vos mains avec une crème riche après chaque lavage',
            'Appliquez l\'huile à cuticules quotidiennement',
            'Ne sautez pas la dépose : faites-la en salon, jamais à l\'arrachage',
            'Respectez le rythme de 3 semaines pour éviter une repousse trop visible',
          ],
        },
        {
          kind: 'paragraph',
          text:
            'Avec ces habitudes, votre semi-permanent garde sa brillance miroir jusqu\'au dernier jour - et vos ongles naturels restent en pleine santé.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'L\'huile à cuticules fait-elle décoller le semi-permanent ?',
      answer:
        'Non, c\'est une idée reçue. L\'huile à cuticules hydrate le contour de l\'ongle et garde la peau souple, ce qui limite le décollement à la base. Elle ne s\'infiltre pas sous une pose correctement scellée.',
    },
    {
      question: 'Combien de temps doit tenir un semi-permanent ?',
      answer:
        'En moyenne 3 semaines, jusqu\'à 4 chez certaines personnes. Une tenue inférieure à une semaine indique généralement un problème de préparation à la pose ou un entretien à revoir.',
    },
    {
      question: 'Que faire si un coin se décolle ?',
      answer:
        'Ne tirez surtout pas dessus : vous arracheriez la surface de l\'ongle. Prenez rendez-vous pour une dépose propre en salon, ou pour une nouvelle pose si la tenue est trop avancée.',
    },
  ],
  related: [
    { label: 'Pose de semi-permanent à Noisy-le-Grand', href: '/semi-permanent-noisy-le-grand' },
    { label: 'Combien de temps dure un semi-permanent ?', href: '/conseils/combien-de-temps-dure-un-semi-permanent' },
    { label: 'Réserver une pose', href: '/booking' },
  ],
}

// ─── 2. Gel ou semi-permanent ─────────────────────────────────────────────

const gelOuSemiPermanent: BlogPost = {
  slug: 'gel-ou-semi-permanent-difference',
  meta: {
    title: 'Gel ou semi-permanent : quelle différence ? · Conseils VyNails93',
    description:
      'Gel et semi-permanent ne servent pas à la même chose. Tenue, longueur, prix, dépose : on compare les deux techniques pour vous aider à choisir.',
  },
  title: 'Gel ou semi-permanent : quelle différence ?',
  excerpt:
    'On confond souvent les deux, mais le gel et le semi-permanent ne répondent pas au même besoin. L\'un colore, l\'autre construit. Voici comment choisir selon vos ongles et votre mode de vie.',
  datePublished: '2026-03-05',
  dateModified: '2026-03-05',
  readingMinutes: 5,
  sections: [
    {
      h2: 'Deux techniques, deux objectifs',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Le vernis semi-permanent est un vernis longue tenue appliqué directement sur l\'ongle naturel. Il colore et protège, mais ne change ni la longueur ni la forme. Le gel, lui, est une matière constructrice : on s\'en sert pour rallonger l\'ongle ou le renforcer s\'il est fragile. C\'est la distinction de base : le semi-permanent pour la couleur, le gel pour la structure.',
        },
      ],
    },
    {
      h2: 'Tenue, longueur, dépose : le comparatif',
      blocks: [
        {
          kind: 'list',
          items: [
            'Tenue : ~3 semaines pour le semi-permanent, ~4 semaines pour le gel avec remplissage',
            'Longueur : le semi-permanent ne rallonge pas, le gel permet d\'ajouter de la longueur',
            'Épaisseur : le semi-permanent reste fin et naturel, le gel apporte de la matière',
            'Dépose : acétone pour le semi-permanent, ponçage + acétone pour le gel',
            'Entretien : retouche simple pour le semi, remplissage à la racine pour le gel',
          ],
        },
      ],
    },
    {
      h2: 'Lequel choisir selon vos ongles ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Si vos ongles poussent bien et que vous voulez surtout une jolie couleur qui tient, le semi-permanent suffit largement. Si vos ongles sont mous, se dédoublent, cassent souvent, ou si vous rêvez de longueur, le gel est fait pour vous : il apporte la solidité qui manque.',
        },
        {
          kind: 'paragraph',
          text:
            'En cas de doute, le mieux reste d\'en parler en rendez-vous : Vy évalue l\'état de vos ongles naturels et vous oriente vers la technique la plus adaptée, sans vous vendre plus que nécessaire.',
        },
      ],
    },
    {
      h2: 'Et le prix dans tout ça ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Le semi-permanent est plus économique : la pose démarre à 17 €. Le gel, plus technique et plus long à poser, démarre à 35 € pour une pose complète, avec un remplissage à 25 € toutes les 3-4 semaines. Le surcoût du gel se justifie par la longueur et la solidité qu\'il apporte.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'Le gel tient-il plus longtemps que le semi-permanent ?',
      answer:
        'Légèrement : environ 4 semaines avec remplissage pour le gel, contre 3 semaines pour le semi-permanent. La vraie différence n\'est pas la tenue mais l\'usage - le gel construit et rallonge, le semi-permanent colore l\'ongle naturel.',
    },
    {
      question: 'Le gel abîme-t-il plus les ongles que le semi-permanent ?',
      answer:
        'Ni l\'un ni l\'autre n\'abîme l\'ongle si la pose et surtout la dépose sont faites correctement, en douceur. Le risque vient des déposes à l\'arrachage et des produits bas de gamme, pas de la technique elle-même.',
    },
    {
      question: 'Peut-on passer du gel au semi-permanent (et inversement) ?',
      answer:
        'Oui, sans problème. Il suffit de déposer proprement la pose en cours avant d\'en réaliser une nouvelle. Vy vous conseille la transition la plus douce pour vos ongles.',
    },
  ],
  related: [
    { label: 'Ongles en gel à Noisy-le-Grand', href: '/ongles-gel-noisy-le-grand' },
    { label: 'Vernis semi-permanent à Noisy-le-Grand', href: '/semi-permanent-noisy-le-grand' },
    { label: 'Réserver un rendez-vous', href: '/booking' },
  ],
}

// ─── 3. Combien de temps dure un semi-permanent ───────────────────────────

const dureeSemiPermanent: BlogPost = {
  slug: 'combien-de-temps-dure-un-semi-permanent',
  meta: {
    title: 'Combien de temps dure un semi-permanent ? · Conseils VyNails93',
    description:
      'Un semi-permanent tient en moyenne 3 semaines. On vous explique les facteurs qui jouent sur la tenue et comment prolonger votre pose au maximum.',
  },
  title: 'Combien de temps dure un semi-permanent (et comment le prolonger)',
  excerpt:
    'Trois semaines, c\'est la moyenne - mais certaines tiennent quatre semaines pleines pendant que d\'autres décollent au bout de cinq jours. D\'où vient l\'écart, et comment se ranger du bon côté ?',
  datePublished: '2026-04-12',
  dateModified: '2026-04-12',
  readingMinutes: 4,
  sections: [
    {
      h2: 'La réponse courte : environ 3 semaines',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Un vernis semi-permanent posé dans les règles de l\'art tient en moyenne 3 semaines, jusqu\'à 4 chez certaines personnes. Au-delà, ce n\'est pas la couleur qui pose problème mais la repousse de l\'ongle, de plus en plus visible à la base : c\'est le bon moment pour renouveler la pose.',
        },
      ],
    },
    {
      h2: 'Les 3 facteurs qui déterminent la tenue',
      blocks: [
        {
          kind: 'list',
          items: [
            'La qualité de la pose - préparation, couches fines, séchage LED complet. C\'est 70 % du résultat.',
            'Votre activité manuelle - vaisselle sans gants, jardinage, ménage usent les bords prématurément.',
            'L\'état initial de l\'ongle - des ongles très fins, mous ou dédoublés retiennent moins bien la pose.',
          ],
        },
        {
          kind: 'paragraph',
          text:
            'Une tenue inférieure à une semaine n\'est pas normale : elle signale presque toujours une préparation insuffisante au moment de la pose.',
        },
      ],
    },
    {
      h2: 'Comment prolonger votre pose',
      blocks: [
        {
          kind: 'list',
          items: [
            'Appliquez de l\'huile à cuticules matin et soir',
            'Portez des gants pour la vaisselle et le ménage',
            'Évitez d\'utiliser vos ongles comme outils',
            'Ne grattez jamais un coin qui se soulève',
            'Faites la dépose en salon, jamais à l\'arrachage',
          ],
        },
        {
          kind: 'paragraph',
          text:
            'Ces gestes simples font régulièrement gagner une semaine de tenue. Pour aller plus loin, retrouvez notre guide complet d\'entretien du semi-permanent.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'Pourquoi mon semi-permanent ne tient qu\'une semaine ?',
      answer:
        'Une tenue très courte vient presque toujours d\'une préparation insuffisante de l\'ongle (mauvaise déshydratation, couches trop épaisses, séchage incomplet). Une pose réalisée par une professionnelle, dans les règles, est la première condition d\'une bonne tenue.',
    },
    {
      question: 'Peut-on garder un semi-permanent plus de 4 semaines ?',
      answer:
        'La couleur peut tenir au-delà, mais la repousse devient visible et la pose perd son équilibre, ce qui augmente le risque de décollement. Au-delà de 3-4 semaines, mieux vaut déposer et reposer pour préserver l\'ongle.',
    },
    {
      question: 'Faut-il faire une pause entre deux poses ?',
      answer:
        'Ce n\'est pas indispensable si les déposes sont faites en douceur. Après plusieurs mois consécutifs, une courte pause peut aider à laisser l\'ongle respirer. Vy vous conseille selon l\'état de vos ongles.',
    },
  ],
  related: [
    { label: 'Vernis semi-permanent à Noisy-le-Grand', href: '/semi-permanent-noisy-le-grand' },
    { label: 'Comment faire durer son vernis semi-permanent', href: '/conseils/comment-faire-durer-son-vernis-semi-permanent' },
    { label: 'Réserver une pose', href: '/booking' },
  ],
}

// ─── 4. Questions fréquentes sur les ongles (People Also Ask) ─────────────

const questionsFrequentesOngles: BlogPost = {
  slug: 'questions-frequentes-ongles',
  meta: {
    title: 'Formes d\'ongles, gel & semi-permanent : questions fréquentes · VyNails93',
    description:
      'Forme la plus élégante, tenue, prix du semi-permanent, gel qui abîme ou non les ongles : les réponses de Vy, prothésiste ongulaire à Noisy-le-Grand.',
  },
  title: 'Formes d\'ongles, gel & semi-permanent : vos questions fréquentes',
  excerpt:
    'Forme la plus élégante, pose qui tient le plus longtemps, prix du semi-permanent, gel qui abîme (ou non) les ongles... Des réponses claires aux questions que l\'on nous pose le plus souvent en salon.',
  datePublished: '2026-07-24',
  dateModified: '2026-07-24',
  readingMinutes: 5,
  sections: [
    {
      h2: 'Quelle est la forme d\'ongle la plus élégante ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'La forme amande est souvent considérée comme la plus élégante : effilée et féminine, elle allonge visuellement la main. L\'ovale et le « squoval » (carré aux angles arrondis) sont d\'autres valeurs sûres, plus discrètes et faciles à porter au quotidien.',
        },
        {
          kind: 'paragraph',
          text:
            'Le plus flatteur dépend surtout de votre morphologie : sur des doigts courts, une forme allongée étire la main ; sur des ongles fragiles, une forme arrondie casse moins. En rendez-vous, Vy adapte la forme à vos mains et à votre mode de vie.',
        },
      ],
    },
    {
      h2: 'Quelle manucure peut affiner les doigts ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Pour affiner visuellement les doigts, misez sur une forme allongée, amande ou ovale, et des teintes nude, rosées ou une French discrète, qui étirent le regard vers le bout de l\'ongle. À l\'inverse, les ongles très courts et carrés avec des couleurs foncées tassent la main.',
        },
        {
          kind: 'paragraph',
          text:
            'Une base soignée et des contours nets renforcent l\'effet allongé. C\'est tout l\'intérêt d\'une manucure française ou d\'une pose babyboomer, flatteuses aussi bien sur les mains fines que sur les mains plus rondes.',
        },
      ],
    },
    {
      h2: 'Quelle pose d\'ongle tient le plus longtemps ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Les ongles en gel tiennent le plus longtemps : environ 3 à 4 semaines, avec un remplissage pour suivre la repousse. Le vernis semi-permanent tient en moyenne 3 semaines, et le vernis classique seulement quelques jours.',
        },
        {
          kind: 'paragraph',
          text:
            'La tenue réelle dépend beaucoup de la qualité de la pose et de l\'entretien : huile à cuticules quotidienne, gants pour la vaisselle, et surtout aucune dépose à l\'arrachage. Une pose soignée gagne facilement une semaine.',
        },
      ],
    },
    {
      h2: 'Quel est le prix d\'une pose de vernis semi-permanent en institut ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'En institut, une pose de vernis semi-permanent coûte généralement entre 20 et 35 €. Chez VyNails93 à Noisy-le-Grand, elle démarre à 17 € sur les mains, retrait de l\'ancienne pose inclus. Le prix varie selon l\'état des ongles et les finitions choisies.',
        },
        {
          kind: 'paragraph',
          text:
            'Comptez un supplément pour un nail art élaboré, une French ou une dépose complexe. Tous nos tarifs détaillés sont affichés sur la page Prestations & Tarifs.',
        },
      ],
    },
    {
      h2: 'Est-ce bon de faire ses ongles en gel ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Oui, faire ses ongles en gel n\'a rien de nocif tant que la pose et surtout la dépose sont réalisées correctement, sans arrachage. Le gel protège même l\'ongle naturel et le renforce s\'il est fin ou cassant.',
        },
        {
          kind: 'paragraph',
          text:
            'Deux précautions suffisent : privilégier des produits professionnels (idéalement sans HEMA si vous êtes sensible) et confier la dépose à une professionnelle. Une courte pause de temps en temps aide l\'ongle à se ré-hydrater.',
        },
      ],
    },
    {
      h2: 'Est-ce que la pose de gel abîme les ongles ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Non, la pose de gel en elle-même n\'abîme pas les ongles. Ce sont les mauvaises déposes, gel arraché ou limé trop agressivement, qui fragilisent l\'ongle. Posé et retiré en douceur par une professionnelle, le gel respecte votre ongle naturel.',
        },
        {
          kind: 'paragraph',
          text:
            'Le signe d\'une bonne dépose : aucun arrachage, et une surface d\'ongle lisse, ni blanchie ni striée à la fin. C\'est exactement le soin que nous appliquons en salon.',
        },
      ],
    },
    {
      h2: 'Qu\'est-ce qui abîme le plus les ongles ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Ce qui abîme le plus les ongles, c\'est l\'arrachage d\'une pose (semi-permanent ou gel) et le fait de les ronger ou de s\'en servir comme outils. Le manque d\'hydratation et les déposes agressives fragilisent aussi la kératine.',
        },
        {
          kind: 'list',
          items: [
            'Ne jamais tirer sur une pose qui se décolle : faites la dépose en salon',
            'Hydratez cuticules et ongles chaque jour (huile, crème)',
            'Portez des gants pour la vaisselle et le ménage',
            'Évitez les dissolvants à l\'acétone trop fréquents sur l\'ongle nu',
            'Espacez les poses par une courte pause si vos ongles fatiguent',
          ],
        },
      ],
    },
  ],
  related: [
    { label: 'Manucure à Noisy-le-Grand', href: '/manucure-noisy-le-grand' },
    { label: 'Vernis semi-permanent à Noisy-le-Grand', href: '/semi-permanent-noisy-le-grand' },
    { label: 'Ongles en gel à Noisy-le-Grand', href: '/ongles-gel-noisy-le-grand' },
    { label: 'Réserver un rendez-vous', href: '/booking' },
  ],
}

// ─── 5. HEMA, allergies et vernis sans HEMA ───────────────────────────────

const vernisSansHema: BlogPost = {
  slug: 'vernis-sans-hema-allergies',
  meta: {
    title: 'HEMA & vernis sans HEMA : allergies au semi-permanent · VyNails93',
    description:
      'Rougeurs ou démangeaisons après un semi-permanent ? Le coupable est souvent le HEMA. Symptômes, prévention et solution sans HEMA à Noisy-le-Grand.',
  },
  title: 'HEMA, allergies et vernis sans HEMA : ce qu\'il faut savoir',
  excerpt:
    'De plus en plus de clientes réagissent au semi-permanent : rougeurs, démangeaisons, décollement. Le coupable est presque toujours le HEMA, voici comment le reconnaître et l\'éviter.',
  datePublished: '2026-08-02',
  dateModified: '2026-08-02',
  readingMinutes: 4,
  sections: [
    {
      h2: 'Le HEMA, c\'est quoi ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Le HEMA (hydroxyéthylméthacrylate) est un monomère présent dans la plupart des vernis semi-permanents et gels du marché. Il aide le produit à adhérer et à durcir sous la lampe LED. Le problème : c\'est aussi un allergène de contact puissant. À force d\'expositions, ou lors d\'une pose mal maîtrisée où le produit touche la peau, le corps peut se sensibiliser.',
        },
      ],
    },
    {
      h2: 'Reconnaître une allergie au HEMA',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Les signes apparaissent autour des ongles ou sur les paupières (quand on se touche le visage) : démangeaisons, rougeurs, petites cloques, peau qui pèle, voire décollement de l\'ongle. Une fois installée, l\'allergie est souvent définitive : on ne peut plus utiliser de produit contenant du HEMA.',
        },
      ],
    },
    {
      h2: 'La solution : le semi-permanent sans HEMA',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Il existe des gammes sans HEMA, formulées pour les personnes sensibles ou déjà réactives. Le rendu et la tenue sont comparables à un semi-permanent classique. Chez VyNails93, à Noisy-le-Grand, nous proposons cette option : signalez-nous toute sensibilité connue avant votre rendez-vous, et nous adaptons les produits.',
        },
        {
          kind: 'list',
          items: [
            'Évitez les poses où le produit déborde sur la peau',
            'Exigez une lampe de qualité et un temps de catalyse respecté',
            'Une pose propre limite fortement le risque de sensibilisation',
          ],
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'Le sans-HEMA tient-il aussi bien ?',
      answer: 'Oui, la tenue (2 à 3 semaines) et la brillance sont équivalentes à un semi-permanent classique.',
    },
    {
      question: 'J\'ai déjà fait une réaction, puis-je encore faire du semi-permanent ?',
      answer:
        'Oui, avec une gamme sans HEMA et en signalant votre antécédent. En cas de doute médical, demandez l\'avis de votre médecin.',
    },
  ],
  related: [
    { label: 'Ongles sans HEMA à Noisy-le-Grand', href: '/ongles-sans-hema-noisy-le-grand' },
    { label: 'Vernis semi-permanent', href: '/semi-permanent-noisy-le-grand' },
  ],
}

// ─── 6. Cil à cil, volume ou réhaussement : comment choisir ────────────────

const cilsChoisir: BlogPost = {
  slug: 'cil-a-cil-volume-rehaussement-choisir',
  meta: {
    title: 'Cil à cil, volume ou réhaussement : comment choisir · VyNails93',
    description:
      'Réhaussement, extensions cil à cil ou volume russe : différences, tenue et entretien pour choisir la bonne technique pour votre regard, à Noisy-le-Grand.',
  },
  title: 'Cil à cil, volume ou réhaussement : comment choisir',
  excerpt:
    'Vous rêvez d\'un beau regard sans mascara mais vous hésitez entre réhaussement et extensions ? Voici comment y voir clair et choisir la technique faite pour vous.',
  datePublished: '2026-07-28',
  dateModified: '2026-07-28',
  readingMinutes: 4,
  sections: [
    {
      h2: 'Le réhaussement de cils : partir de vos cils naturels',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Le réhaussement (ou « lash lift ») courbe vos cils naturels à la base, sans rien ajouter. Résultat : un regard ouvert, des cils qui remontent, un effet « recourbe-cils permanent » qui dure 4 à 6 semaines. Idéal si vous avez déjà de beaux cils et cherchez un rendu naturel et sans entretien.',
        },
      ],
    },
    {
      h2: 'Les extensions cil à cil : longueur et densité',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'On pose un cil synthétique sur chaque cil naturel. L\'effet est plus marqué qu\'un réhaussement : plus de longueur, un regard défini, tout en restant élégant. Il faut prévoir un remplissage toutes les 2 à 3 semaines pour compenser la chute naturelle des cils. Le volume russe, lui, pose plusieurs cils très fins en éventail par cil naturel, pour un effet dense, mais plus exigeant en entretien.',
        },
        {
          kind: 'paragraph',
          text:
            'Chez VyNails93, nous réalisons les extensions cil à cil et le réhaussement, les deux options les plus naturelles et les plus faciles à vivre au quotidien.',
        },
      ],
    },
    {
      h2: 'Comment choisir ?',
      blocks: [
        {
          kind: 'list',
          items: [
            'Vous voulez du naturel, zéro entretien → réhaussement',
            'Vous voulez plus de longueur / densité et acceptez les remplissages → extensions cil à cil',
            'Un doute ? On regarde vos cils ensemble et on choisit',
          ],
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'Le réhaussement abîme-t-il les cils ?',
      answer: 'Non, réalisé dans les règles avec des produits professionnels, il respecte vos cils.',
    },
    {
      question: 'Combien de temps ça tient ?',
      answer: 'Réhaussement : 4 à 6 semaines. Extensions cil à cil : 3 à 5 semaines avec remplissage.',
    },
  ],
  related: [
    { label: 'Réhaussement de cils', href: '/rehaussement-cils-noisy-le-grand' },
    { label: 'Extensions de cils', href: '/extension-cils-noisy-le-grand' },
  ],
}

// ─── 7. Manucure russe : c'est quoi, prix, précautions ─────────────────────

const manucureRusse: BlogPost = {
  slug: 'manucure-russe-c-est-quoi',
  meta: {
    title: 'Manucure russe : c\'est quoi, prix et précautions · VyNails93',
    description:
      'La manucure russe, définition, avantages, prix et précautions. La technique de préparation des cuticules à la fraise expliquée par une prothésiste à Noisy-le-Grand.',
  },
  title: 'Manucure russe : c\'est quoi, prix, avantages et précautions',
  excerpt:
    'La « manucure russe » est partout sur les réseaux. Qu\'est-ce que c\'est vraiment, pour qui, à quel prix, et quelles précautions prendre ? On vous explique.',
  datePublished: '2026-07-21',
  dateModified: '2026-07-21',
  readingMinutes: 4,
  sections: [
    {
      h2: 'La manucure russe, définition',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Il s\'agit d\'une technique de préparation des cuticules à la fraise (une lime électrique munie d\'embouts fins) plutôt qu\'au coupe-cuticules classique. La praticienne dégage précisément le contour de l\'ongle, ce qui permet d\'appliquer le vernis au plus près de la cuticule. Résultat : une pose ultra-nette et une tenue qui semble durer plus longtemps, car la repousse se voit moins vite.',
        },
      ],
    },
    {
      h2: 'Avantages et précautions',
      blocks: [
        {
          kind: 'list',
          items: [
            'Un rendu très net et élégant, parfait pour les ongles courts',
            'Une couleur qui « colle » à la cuticule, effet soigné',
            'Une tenue visuellement prolongée',
          ],
        },
        {
          kind: 'paragraph',
          text:
            'La fraise, mal maniée, peut blesser la cuticule ou fragiliser l\'ongle. La manucure russe exige donc une praticienne formée et rigoureuse, avec des embouts désinfectés et stérilisés. C\'est une technique de précision, pas un gadget.',
        },
      ],
    },
    {
      h2: 'Combien ça coûte ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Le prix dépend du salon et de la prestation associée (souvent couplée à un gainage ou un semi-permanent), généralement plus élevé qu\'une manucure classique en raison du temps et de la technicité. À Noisy-le-Grand, VyNails93 mise sur une préparation soignée des cuticules et une hygiène irréprochable pour un rendu net et durable.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'La manucure russe abîme-t-elle les ongles ?',
      answer: 'Non si elle est réalisée par une professionnelle formée, avec du matériel stérilisé.',
    },
    {
      question: 'Quelle différence avec une manucure classique ?',
      answer:
        'La préparation des cuticules à la fraise, pour une pose plus nette et une tenue visuellement plus longue.',
    },
  ],
  related: [
    { label: 'Prothésiste ongulaire', href: '/prothesiste-ongulaire-noisy-le-grand' },
    { label: 'Vernis semi-permanent', href: '/semi-permanent-noisy-le-grand' },
  ],
}

// ─── 8. Faux ongles : capsule, gel ou résine ───────────────────────────────

const fauxOnglesDifference: BlogPost = {
  slug: 'faux-ongles-capsule-gel-resine',
  meta: {
    title: 'Faux ongles : capsule, gel ou résine, quelle différence · VyNails93',
    description:
      'Capsule, gel, résine : le guide clair pour choisir votre pose de faux ongles selon l\'état de vos ongles et votre mode de vie. Onglerie à Noisy-le-Grand.',
  },
  title: 'Faux ongles : capsule, gel ou résine, quelle différence ?',
  excerpt:
    'Capsule, gel, résine… on s\'y perd vite. Voici le guide clair pour comprendre chaque technique et choisir la pose faite pour vous.',
  datePublished: '2026-07-14',
  dateModified: '2026-07-14',
  readingMinutes: 3,
  sections: [
    {
      h2: 'La capsule : le support, pas la matière',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'La capsule est un faux ongle en plastique que l\'on colle sur l\'ongle naturel pour donner de la longueur. Ce n\'est pas une « matière » de pose : on la recouvre ensuite de gel ou de résine pour la solidifier et la sculpter. On parle de « pose sur capsule ».',
        },
      ],
    },
    {
      h2: 'Gel ou résine ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Le gel durcit sous lampe LED : rendu souple, brillant et très naturel, agréable à porter, idéal au quotidien. Il demande un remplissage toutes les 3 à 4 semaines. La résine (poudre + liquide) est plus rigide et résistante : elle tient très bien sur ongles courts, rongés ou sollicités, avec un rendu un peu moins naturel mais une solidité imbattable.',
        },
      ],
    },
    {
      h2: 'Alors, lequel choisir ?',
      blocks: [
        {
          kind: 'list',
          items: [
            'Du naturel et de la brillance → gel',
            'De la solidité, ongles rongés → résine',
            'De la longueur → capsule + gel ou résine',
          ],
        },
        {
          kind: 'paragraph',
          text:
            'À Noisy-le-Grand, Vy évalue l\'état de vos ongles et vous oriente vers la bonne technique. Pose gel ou résine, capsules, remplissage : tout est possible.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'Peut-on poser sur ongles rongés ?',
      answer: 'Oui, capsule + résine ou gel reconstruisent une longueur nette dès la première pose.',
    },
    {
      question: 'Les faux ongles abîment-ils les ongles ?',
      answer: 'Non si la dépose est douce, sans arrachage.',
    },
  ],
  related: [
    { label: 'Ongles en gel', href: '/ongles-gel-noisy-le-grand' },
    { label: 'Prothésiste ongulaire', href: '/prothesiste-ongulaire-noisy-le-grand' },
  ],
}

// ─── 9. Gainage / BIAB : renforcer les ongles ──────────────────────────────

const gainageBiab: BlogPost = {
  slug: 'gainage-biab-renforcer-ongles',
  meta: {
    title: 'Gainage / BIAB : renforcer les ongles cassants · VyNails93',
    description:
      'Ongles mous, cassants ou qui se dédoublent ? Le gainage (BIAB) renforce l\'ongle naturel sans faux ongles. Explications d\'une prothésiste à Noisy-le-Grand.',
  },
  title: 'Gainage / BIAB : renforcer les ongles cassants ou mous',
  excerpt:
    'Vos ongles poussent puis cassent ? Ils sont fins, mous, ils se dédoublent ? Le gainage est peut-être votre solution, sans passer par les faux ongles.',
  datePublished: '2026-07-07',
  dateModified: '2026-07-07',
  readingMinutes: 3,
  sections: [
    {
      h2: 'Le gainage, c\'est quoi ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Le gainage consiste à appliquer une fine couche de gel structurant directement sur l\'ongle naturel, sans capsule ni longueur ajoutée. Cette « gaine » rigidifie l\'ongle, l\'empêche de casser et l\'accompagne pendant sa pousse. On l\'appelle aussi BIAB (« builder in a bottle »).',
        },
      ],
    },
    {
      h2: 'Pour qui, et quelle différence avec le semi-permanent ?',
      blocks: [
        {
          kind: 'list',
          items: [
            'Ongles qui cassent dès qu\'ils dépassent',
            'Ongles mous, fins ou qui se dédoublent',
            'Après une dépose de faux ongles, pour aider la repousse',
          ],
        },
        {
          kind: 'paragraph',
          text:
            'Le semi-permanent est surtout une couleur (tenue 2 à 3 semaines), il protège peu. Le gainage/BIAB renforce réellement l\'ongle ; on peut poser une couleur par-dessus. Les faux ongles, eux, ajoutent de la longueur, un autre objectif.',
        },
      ],
    },
    {
      h2: 'Le résultat',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Des ongles naturels plus forts, plus longs et plus beaux, sans faux ongles. Le gainage se refait à mesure de la pousse (toutes les 3 à 4 semaines), avec une dépose douce. À Noisy-le-Grand, VyNails93 vous conseille le renforcement adapté à vos ongles.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'Le gainage fait-il pousser les ongles ?',
      answer: 'Il empêche la casse : vos ongles gagnent donc en longueur naturellement, protégés.',
    },
    {
      question: 'Le gainage abîme-t-il les ongles ?',
      answer: 'Non, au contraire, il les protège ; la dépose se fait sans arracher.',
    },
  ],
  related: [
    { label: 'Prothésiste ongulaire', href: '/prothesiste-ongulaire-noisy-le-grand' },
    { label: 'Vernis semi-permanent', href: '/semi-permanent-noisy-le-grand' },
  ],
}

// ─── 10. Le semi-permanent abîme-t-il les ongles ? ─────────────────────────

const semiPermanentAbime: BlogPost = {
  slug: 'semi-permanent-abime-t-il-les-ongles',
  meta: {
    title: 'Le semi-permanent abîme-t-il les ongles ? · VyNails93',
    description:
      'Le semi-permanent n\'abîme pas l\'ongle : c\'est la dépose en arrachant qui le fragilise. Comment garder des ongles sains, par une prothésiste à Noisy-le-Grand.',
  },
  title: 'Le semi-permanent abîme-t-il les ongles ? La vérité sur la dépose',
  excerpt:
    '« Le semi-permanent, ça abîme les ongles » : la phrase qu\'on entend le plus. La réalité est plus nuancée, et tout se joue sur la dépose.',
  datePublished: '2026-06-30',
  dateModified: '2026-06-30',
  readingMinutes: 3,
  sections: [
    {
      h2: 'Ce n\'est pas le vernis, c\'est la dépose',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Le semi-permanent en lui-même n\'abîme pas l\'ongle : il forme une couche protectrice qui tient 2 à 3 semaines. Le vrai problème, c\'est la dépose sauvage : arracher le vernis (ou le décoller à la maison) emporte des couches de kératine avec lui. L\'ongle devient alors fin, mou, strié.',
        },
      ],
    },
    {
      h2: 'Une dépose douce change tout',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'En salon, une dépose correcte se fait à l\'acétone (compresse, papillote) et/ou à la ponceuse, sans jamais forcer. On retire le produit, pas l\'ongle. C\'est pour ça qu\'on répète : ne jamais arracher un semi-permanent.',
        },
      ],
    },
    {
      h2: 'Les bons réflexes pour des ongles sains',
      blocks: [
        {
          kind: 'list',
          items: [
            'Faire déposer en salon plutôt que « tirer » chez soi',
            'Espacer avec une cure de renforcement ou un gainage de temps en temps',
            'Hydrater les cuticules à l\'huile',
            'Choisir un salon qui prépare et dépose proprement',
          ],
        },
        {
          kind: 'paragraph',
          text:
            'À Noisy-le-Grand, VyNails93 pratique une dépose douce systématique, vos ongles ressortent nets, pas abîmés.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'Puis-je enlever mon semi-permanent moi-même ?',
      answer: 'Évitez : le risque d\'arracher la matière est élevé. La dépose seule est possible sur rendez-vous.',
    },
    {
      question: 'Faut-il faire des pauses entre deux poses ?',
      answer: 'Pas obligatoire si la dépose est douce ; une cure de renforcement ponctuelle est un plus.',
    },
  ],
  related: [
    { label: 'Vernis semi-permanent', href: '/semi-permanent-noisy-le-grand' },
    { label: 'Prothésiste ongulaire', href: '/prothesiste-ongulaire-noisy-le-grand' },
  ],
}

// ─── 11. Réhaussement de cils : prix, durée, contre-indications ────────────

const rehaussementCilsInfos: BlogPost = {
  slug: 'rehaussement-cils-prix-duree-contre-indications',
  meta: {
    title: 'Réhaussement de cils : prix, durée, contre-indications · VyNails93',
    description:
      'Prix, durée et contre-indications du réhaussement de cils. Tout ce qu\'il faut savoir avant de réserver son lash lift à Noisy-le-Grand.',
  },
  title: 'Réhaussement de cils : prix, durée et contre-indications',
  excerpt:
    'Le réhaussement de cils séduit celles qui veulent un beau regard sans extensions ni entretien. Voici l\'essentiel avant de réserver : prix, durée et contre-indications.',
  datePublished: '2026-06-23',
  dateModified: '2026-06-23',
  readingMinutes: 3,
  sections: [
    {
      h2: 'Prix et durée',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Le prix d\'un réhaussement se situe généralement autour de 45 € (souvent avec teinture incluse), un budget maîtrisé pour un effet qui dure plusieurs semaines, sans remplissage à prévoir. La tenue est de 4 à 6 semaines, le temps que vos cils suivent leur cycle de repousse naturel. Vous vous réveillez avec des cils courbés et ouverts sur le regard.',
        },
      ],
    },
    {
      h2: 'Les contre-indications à connaître',
      blocks: [
        {
          kind: 'list',
          items: [
            'Affection de l\'œil (conjonctivite, orgelet, blépharite, yeux très secs)',
            'Chirurgie oculaire récente',
            'Grossesse / allaitement (par précaution)',
          ],
        },
        {
          kind: 'paragraph',
          text:
            'En cas de doute, on en parle avant de réserver et on vous oriente vers la meilleure option.',
        },
      ],
    },
    {
      h2: 'Les « inconvénients »',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Ils sont rares s\'il est bien réalisé : cils temporairement plus secs si le soin nourrissant est négligé, ou résultat moins marqué que des extensions. D\'où l\'importance d\'une praticienne soigneuse et de produits professionnels. Chez VyNails93 à Noisy-le-Grand, le réhaussement (teinture incluse) recourbe vos cils naturels et les fonce légèrement, 7j/7.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'Peut-on se maquiller après ?',
      answer: 'Oui, après 24 h ; beaucoup s\'en passent, le regard étant déjà ouvert.',
    },
    {
      question: 'Réhaussement ou extensions ?',
      answer: 'Réhaussement = naturel sans entretien ; extensions = plus de longueur avec remplissages.',
    },
  ],
  related: [
    { label: 'Réhaussement de cils', href: '/rehaussement-cils-noisy-le-grand' },
    { label: 'Extensions de cils', href: '/extension-cils-noisy-le-grand' },
  ],
}

// ─── 12. Pose américaine / Gel-X ───────────────────────────────────────────

const poseAmericaine: BlogPost = {
  slug: 'pose-americaine-gel-x-difference',
  meta: {
    title: 'Pose américaine et Gel-X : quelle différence · VyNails93',
    description:
      'Pose américaine, Gel-X : une capsule 100 % gel, fine et naturelle. Différence avec le gel classique et la résine, expliquée à Noisy-le-Grand.',
  },
  title: 'Pose américaine et Gel-X : c\'est quoi, quelle différence avec le gel et la résine ?',
  excerpt:
    'Vous avez vu passer « pose américaine » ou « Gel-X » ? C\'est une technique de faux ongles moderne, à mi-chemin entre la capsule et le gel. On vous explique.',
  datePublished: '2026-06-16',
  dateModified: '2026-06-16',
  readingMinutes: 3,
  sections: [
    {
      h2: 'La pose américaine / Gel-X, c\'est quoi ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'C\'est une capsule intégralement en gel souple (et non en plastique), qui recouvre tout l\'ongle et se scelle sous lampe LED. On obtient une extension légère, fine et naturelle, avec une pose souvent plus rapide qu\'une sculpture classique.',
        },
      ],
    },
    {
      h2: 'Différence avec le gel classique et la résine',
      blocks: [
        {
          kind: 'list',
          items: [
            'Gel sur capsule plastique : capsule rigide + gel par-dessus, solide mais un peu plus épais',
            'Résine : poudre + liquide, très résistante, rendu plus rigide',
            'Pose américaine / Gel-X : capsule 100 % gel, plus fine et plus souple, effet naturel',
          ],
        },
      ],
    },
    {
      h2: 'Pour qui ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Pour un rendu naturel et léger, une belle longueur sans l\'effet « carapace ». La tenue est bonne (3 à 4 semaines) avec une dépose douce. À Noisy-le-Grand, demandez conseil à Vy pour savoir quelle technique convient le mieux à vos ongles.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'La pose américaine abîme-t-elle les ongles ?',
      answer: 'Non si la dépose est douce ; le gel souple est plutôt respectueux de l\'ongle.',
    },
    {
      question: 'Ça tient combien de temps ?',
      answer: 'En général 3 à 4 semaines, avec remplissage.',
    },
  ],
  related: [
    { label: 'Ongles en gel', href: '/ongles-gel-noisy-le-grand' },
    { label: 'Prothésiste ongulaire', href: '/prothesiste-ongulaire-noisy-le-grand' },
  ],
}

// ─── 13. Beauté des pieds : semi-permanent sur les orteils ─────────────────

const beautePiedsOrteils: BlogPost = {
  slug: 'beaute-des-pieds-semi-permanent-orteils',
  meta: {
    title: 'Beauté des pieds : le semi tient plus longtemps sur les orteils · VyNails93',
    description:
      'Pourquoi le semi-permanent tient 4 à 6 semaines sur les orteils, et ce qu\'apporte une vraie beauté des pieds. Institut à Noisy-le-Grand.',
  },
  title: 'Beauté des pieds : pourquoi le semi-permanent tient plus longtemps sur les orteils',
  excerpt:
    'On l\'oublie souvent, mais le semi-permanent sur les pieds est l\'un des meilleurs rapports plaisir/durée qui soit. Explication.',
  datePublished: '2026-06-09',
  dateModified: '2026-06-09',
  readingMinutes: 3,
  sections: [
    {
      h2: 'Une tenue record',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Sur les mains, un semi-permanent tient 2 à 3 semaines parce qu\'on sollicite énormément ses ongles (clavier, vaisselle, sacs). Sur les orteils, les ongles ne « travaillent » quasiment pas : le semi-permanent peut tenir 4 à 6 semaines, voire plus. Un seul rendez-vous vous suit tout l\'été.',
        },
      ],
    },
    {
      h2: 'La beauté des pieds, plus qu\'un vernis',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Une vraie beauté des pieds, c\'est aussi le soin : ponçage des zones rugueuses, cuticules, hydratation. Vos pieds sont lisses, nets, prêts pour les sandales, pas seulement colorés. Avant l\'été, un mariage ou les vacances, c\'est le moment idéal.',
        },
      ],
    },
    {
      h2: 'Le bon timing',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'À Noisy-le-Grand, VyNails93 propose la beauté des pieds, la pédicure et le semi-permanent sur les orteils, dès 9 €. Et comme ça tient longtemps, c\'est un vrai gain de temps.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'Combien de temps tient le semi sur les pieds ?',
      answer: 'Souvent 4 à 6 semaines, car les ongles des pieds sont peu sollicités.',
    },
    {
      question: 'Peut-on faire mains + pieds le même jour ?',
      answer: 'Oui, en une seule visite.',
    },
  ],
  related: [
    { label: 'Beauté des pieds', href: '/beaute-des-pieds-noisy-le-grand' },
    { label: 'Vernis semi-permanent', href: '/semi-permanent-noisy-le-grand' },
  ],
}

// ─── 14. Entretenir ses extensions de cils ─────────────────────────────────

const entretienCils: BlogPost = {
  slug: 'entretenir-extensions-cils-duree',
  meta: {
    title: 'Entretenir ses extensions de cils pour les faire durer · VyNails93',
    description:
      'Les gestes qui font durer vos extensions de cils : premières 48 h, brossage, produits à éviter, remplissage. Conseils d\'un institut à Noisy-le-Grand.',
  },
  title: 'Entretenir ses extensions de cils pour les faire durer plus longtemps',
  excerpt:
    'De belles extensions, c\'est 50 % la pose… et 50 % l\'entretien. Voici comment garder un regard parfait plus longtemps.',
  datePublished: '2026-06-02',
  dateModified: '2026-06-02',
  readingMinutes: 3,
  sections: [
    {
      h2: 'Les premières 24 à 48 h : la règle d\'or',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'La colle a besoin de sécher complètement. Pendant 24 à 48 h : pas d\'eau, pas de vapeur (douche chaude, hammam, sport intense). C\'est le geste qui conditionne toute la tenue.',
        },
      ],
    },
    {
      h2: 'Au quotidien',
      blocks: [
        {
          kind: 'list',
          items: [
            'Brossez vos cils chaque matin avec le goupillon pour les garder alignés',
            'Évitez les corps gras : démaquillants huileux et crèmes riches dissolvent la colle',
            'Pas de mascara waterproof (impossible à retirer sans frotter)',
            'Dormez sur le dos si possible : le frottement sur l\'oreiller casse les extensions',
          ],
        },
      ],
    },
    {
      h2: 'Le remplissage, pas l\'oubli',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Vos cils tombent naturellement : un remplissage toutes les 2 à 3 semaines recharge les zones dégarnies et coûte moins cher qu\'une pose neuve. C\'est le secret d\'un regard toujours fourni. À Noisy-le-Grand, VyNails93 réalise pose cil à cil et remplissages.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'Peut-on se démaquiller avec des extensions ?',
      answer: 'Oui, avec un démaquillant sans huile, en tamponnant.',
    },
    {
      question: 'Tous les combien faut-il un remplissage ?',
      answer: 'Toutes les 2 à 3 semaines pour garder l\'effet.',
    },
  ],
  related: [
    { label: 'Extensions de cils', href: '/extension-cils-noisy-le-grand' },
    { label: 'Réhaussement de cils', href: '/rehaussement-cils-noisy-le-grand' },
  ],
}

// ─── 15. Faire ses ongles enceinte ────────────────────────────────────────

const onglesEnceinte: BlogPost = {
  slug: 'ongles-enceinte-semi-permanent-gel',
  meta: {
    title: 'Peut-on faire ses ongles enceinte ? Semi-permanent & gel · VyNails93',
    description:
      'Semi-permanent, gel, lampe UV, HEMA et TPO : ce qui est sûr, ce qu\'on évite et nos précautions pour faire vos ongles enceinte, à Noisy-le-Grand.',
  },
  title: 'Faire ses ongles enceinte : semi-permanent, gel, ce qu\'il faut savoir',
  excerpt:
    'Enceinte, vous pouvez continuer à soigner vos ongles. Voici ce qui est sans danger, ce qu\'on préfère éviter et les précautions que Vy applique au salon.',
  datePublished: '2026-08-02',
  dateModified: '2026-08-02',
  readingMinutes: 8,
  sections: [
    {
      h2: 'Y a-t-il vraiment un risque à faire ses ongles enceinte ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'La réponse courte : il n\'existe aucune interdiction officielle de faire ses ongles pendant la grossesse. Une manucure, un vernis semi-permanent ou une pose de gel ne présentent pas de danger prouvé pour le bébé. Ce sont des soins de surface, appliqués sur l\'ongle, pas dans l\'organisme.',
        },
        {
          kind: 'paragraph',
          text:
            'Ce qui demande un peu d\'attention, ce sont trois points précis : certains ingrédients des vernis, l\'aération pendant la pose, et votre confort quand le ventre s\'arrondit. Rien d\'insurmontable. On détaille chaque point et ce que ça change en pratique.',
        },
        {
          kind: 'paragraph',
          text:
            'Un rappel important : cet article donne des repères de salon, pas un avis médical. En cas de grossesse à risque ou de doute, demandez conseil à votre sage-femme ou à votre médecin. C\'est la seule personne qui connaît votre dossier.',
        },
      ],
    },
    {
      h2: 'Le vernis semi-permanent enceinte',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Le vernis semi-permanent est le soin le plus demandé par les futures mamans, et pour une bonne raison : il tient trois semaines sans s\'écailler. Quand se pencher pour atteindre ses pieds devient compliqué, avoir des ongles nets qui durent est un vrai confort.',
        },
        {
          kind: 'paragraph',
          text:
            'Il n\'y a pas de contre-indication à porter du semi-permanent enceinte. Le seul vrai sujet, ce sont les composants du vernis. Depuis quelques années, les formules professionnelles évoluent pour retirer les molécules les plus allergisantes. On y revient plus bas avec le HEMA et le TPO.',
        },
        {
          kind: 'list',
          items: [
            'La pose se fait à l\'air libre, sans rien ingérer',
            'La tenue de 3 semaines évite de refaire ses ongles trop souvent',
            'Une couleur claire (nude, rosé, blanc laiteux) reste jolie même quand l\'ongle repousse',
            'La dépose se fait en douceur à l\'acétone, jamais à l\'arrachage',
          ],
        },
      ],
    },
    {
      h2: 'Les ongles en gel et les faux ongles enceinte',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Le gel, la résine et les capsules ne sont pas interdits non plus. La question qu\'on nous pose souvent porte sur la colle et l\'odeur. Pour les capsules, la colle utilisée est une colle cosmétique, en très petite quantité, posée sur l\'ongle. Pour le gel et la résine, l\'odeur peut être plus marquée pendant la pose.',
        },
        {
          kind: 'paragraph',
          text:
            'Or, pendant la grossesse, l\'odorat devient beaucoup plus sensible, surtout au premier trimestre. Beaucoup de futures mamans supportent mal les odeurs de résine ou de dépose. Ce n\'est pas dangereux, mais ça peut être désagréable, voire donner la nausée. Si c\'est votre cas, le semi-permanent, plus léger en odeur, est souvent plus confortable qu\'une pose de gel complète.',
        },
        {
          kind: 'paragraph',
          text:
            'Autre point pratique : vos ongles naturels changent pendant la grossesse. Sous l\'effet des hormones, ils poussent souvent plus vite et deviennent plus solides. C\'est le bon moment pour les laisser respirer avec un simple semi-permanent, plutôt que de partir sur des extensions longues à entretenir.',
        },
      ],
    },
    {
      h2: 'La lampe UV / LED est-elle dangereuse enceinte ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'C\'est la question qui revient le plus. La lampe qui sèche le semi-permanent et le gel émet des UV, mais en très faible quantité et sur une zone minuscule : le bout des doigts, quelques secondes par couche. On est très loin d\'une séance de bronzage en cabine, qui, elle, est déconseillée enceinte et expose tout le corps.',
        },
        {
          kind: 'paragraph',
          text:
            'Aucune étude ne montre de risque pour le bébé lié à la lampe à ongles. Si vous préférez être prudente, deux gestes simples suffisent : appliquer une crème solaire sur le dos des mains avant la pose, ou porter des mitaines anti-UV. Au salon, on peut tout à fait le prévoir.',
        },
      ],
    },
    {
      h2: 'HEMA et TPO : les ingrédients à connaître',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'C\'est le point le plus utile de cet article. Deux composants font parler d\'eux dans les vernis semi-permanents et les gels.',
        },
        {
          kind: 'paragraph',
          text:
            'Le HEMA est une molécule qui aide le vernis à adhérer. Le souci : c\'est un allergène connu. Une allergie au HEMA peut apparaître à force d\'expositions répétées, et la grossesse est une période où la peau réagit parfois différemment. Ce n\'est pas un risque pour le bébé, mais un risque d\'allergie pour vous. C\'est pour ça que VyNails93 propose une gamme sans HEMA, pensée pour les ongles sensibles et pour celles qui veulent éviter cette molécule.',
        },
        {
          kind: 'paragraph',
          text:
            'Le TPO est un photoinitiateur, l\'ingrédient qui déclenche le séchage sous la lampe. Depuis septembre 2025, il est interdit dans les cosmétiques vendus dans l\'Union européenne, par principe de précaution. Les marques professionnelles sérieuses ont déjà reformulé leurs produits sans TPO. En clair : un salon à jour de sa réglementation n\'utilise plus de vernis au TPO, enceinte ou non.',
        },
        {
          kind: 'list',
          items: [
            'HEMA : allergène possible, on l\'évite avec une pose sans HEMA',
            'TPO : interdit dans l\'UE depuis septembre 2025, plus utilisé dans les gammes à jour',
            'Le bon réflexe : demander une pose sans HEMA et vérifier que le salon a des produits récents',
          ],
        },
      ],
    },
    {
      h2: 'Et l\'épilation à la cire enceinte ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Puisqu\'on parle beauté et grossesse : l\'épilation à la cire est possible enceinte. La peau est parfois plus sensible et réactive, donc on travaille en douceur, sur des zones que vous supportez bien. Si vous avez des varices ou une peau très fragile, parlez-en avant. Pour le maillot en fin de grossesse, on adapte simplement la position pour votre confort.',
        },
      ],
    },
    {
      h2: 'Nos précautions pour vous au salon',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Concrètement, voici comment Vy adapte le rendez-vous quand vous êtes enceinte, à Noisy-le-Grand :',
        },
        {
          kind: 'list',
          items: [
            'Une pose sans HEMA sur demande, avec des produits récents sans TPO',
            'Un espace aéré pendant toute la pose',
            'Une chaise confortable, des pauses si besoin, la possibilité d\'aller aux toilettes sans stress',
            'Le soin le plus léger en odeur si les nausées vous gênent (souvent le semi-permanent plutôt qu\'une pose de gel complète)',
            'Une dépose toujours en douceur, jamais à l\'arrachage',
          ],
        },
        {
          kind: 'paragraph',
          text:
            'Le rendez-vous dure le temps qu\'il faut, sans précipitation. C\'est un moment pour vous, et vous devez vous y sentir bien.',
        },
      ],
    },
    {
      h2: 'En résumé',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Oui, vous pouvez faire vos ongles enceinte. Le semi-permanent est le choix le plus simple et le plus confortable ; le gel et les capsules restent possibles si l\'odeur ne vous dérange pas. Privilégiez une pose sans HEMA, avec des produits sans TPO, dans un salon aéré. Et pour toute question de santé, votre sage-femme ou votre médecin reste votre meilleur repère.',
        },
        {
          kind: 'paragraph',
          text:
            'Envie d\'une jolie manucure pendant votre grossesse ? VyNails93 vous reçoit 7j/7 jusqu\'à 20h à Noisy-le-Grand, à 5 minutes du RER Noisy-Champs. Réservez votre créneau en ligne et précisez que vous êtes enceinte : on prépare tout pour votre confort.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'Peut-on faire du vernis semi-permanent enceinte ?',
      answer:
        'Oui, il n\'y a pas de contre-indication. On conseille une pose sans HEMA et des produits sans TPO (interdit dans l\'UE depuis septembre 2025). En cas de doute, demandez l\'avis de votre sage-femme.',
    },
    {
      question: 'Peut-on faire les ongles en gel enceinte ?',
      answer:
        'Oui. Le seul frein habituel est l\'odeur de la pose ou de la dépose, souvent mal supportée au premier trimestre à cause de l\'odorat plus sensible. Si c\'est votre cas, le semi-permanent est plus confortable.',
    },
    {
      question: 'La lampe UV des ongles est-elle dangereuse pendant la grossesse ?',
      answer:
        'Aucune étude ne montre de risque pour le bébé. L\'exposition est minime (le bout des doigts, quelques secondes). Par prudence, on peut appliquer une crème solaire sur les mains ou porter des mitaines anti-UV.',
    },
    {
      question: 'Quelle manucure choisir quand on est enceinte ?',
      answer:
        'Un vernis semi-permanent dans une teinte claire (nude, rosé, blanc laiteux) est le choix le plus simple : il tient 3 semaines, l\'odeur est légère et la repousse se voit peu.',
    },
    {
      question: 'Peut-on faire du semi-permanent en allaitant ?',
      answer:
        'Oui, l\'allaitement n\'est pas une contre-indication à une pose de vernis sur l\'ongle. Les mêmes précautions s\'appliquent : pose sans HEMA et produits récents.',
    },
  ],
  related: [
    { label: 'Ongles sans HEMA', href: '/ongles-sans-hema-noisy-le-grand' },
    { label: 'Vernis semi-permanent', href: '/semi-permanent-noisy-le-grand' },
    { label: 'HEMA, allergies et vernis sans HEMA', href: '/conseils/vernis-sans-hema-allergies' },
    { label: 'Réserver un créneau', href: '/booking' },
  ],
}

// ─── 16. Ongles rongés : quelle pose ──────────────────────────────────────

const onglesRonges: BlogPost = {
  slug: 'ongles-ronges-pose-gel-faux-ongles',
  meta: {
    title: 'Ongles rongés : quelle pose pour les cacher · VyNails93',
    description:
      'Gel, résine ou capsules : la bonne solution pour camoufler des ongles rongés, les protéger et arrêter de les ronger. Conseils d\'une prothésiste à Noisy-le-Grand.',
  },
  title: 'Ongles rongés : quelle pose pour les cacher (et arrêter de les ronger)',
  excerpt:
    'Se ronger les ongles, ça se cache très bien, et une pose peut même aider à arrêter. Voici la technique, la forme et la couleur à choisir, expliquées par Vy.',
  datePublished: '2026-08-02',
  dateModified: '2026-08-02',
  readingMinutes: 8,
  sections: [
    {
      h2: 'Peut-on poser des faux ongles sur des ongles rongés ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Oui, et c\'est même l\'une des meilleures raisons de venir en salon. Contrairement aux faux ongles à coller du commerce, qui tiennent mal sur un ongle court et rongé, une pose professionnelle s\'adapte à la longueur qu\'il vous reste, même très courte. Vy travaille régulièrement sur des ongles rongés : il y a toujours une solution.',
        },
        {
          kind: 'paragraph',
          text:
            'Le principe est simple : on reconstruit une surface d\'ongle propre par-dessus la vôtre, avec du gel, de la résine ou une capsule. Résultat, des ongles nets et réguliers dès la sortie du salon, et une base solide qui vous empêche de mordre.',
        },
      ],
    },
    {
      h2: 'Gel, résine ou capsules : quoi choisir',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Les trois techniques fonctionnent, mais elles ne se valent pas selon l\'état de vos ongles.',
        },
        {
          kind: 'list',
          items: [
            'Le gel : idéal si vos ongles rongés gardent un peu de longueur. On renforce et on allonge légèrement, pour un rendu naturel et solide.',
            'La résine : très appréciée pour les ongles abîmés ou fragilisés. Réputée solide, elle permet de remodeler des ongles très courts.',
            'La capsule (pose américaine) : la solution quand il ne reste presque plus d\'ongle. On colle une capsule qui sert de base, puis on la recouvre de gel pour un fini net.',
          ],
        },
        {
          kind: 'paragraph',
          text:
            'Le jour du rendez-vous, Vy regarde vos ongles et vous conseille la technique la plus adaptée. Pas besoin de trancher à l\'avance : on décide ensemble.',
        },
      ],
    },
    {
      h2: 'Quelle forme et quelle longueur ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Sur des ongles rongés, on part toujours sur du court à moyen. Une longueur raisonnable tient mieux, se casse moins et paraît naturelle. Les formes carrée douce, arrondie ou amande courte sont les plus flatteuses pour rallonger visuellement le doigt sans effet artificiel.',
        },
        {
          kind: 'paragraph',
          text:
            'Les longueurs très longues sont à éviter au début : elles font levier sur une base fragile et cassent plus vite. On pourra allonger petit à petit, au fil des poses, une fois que vos ongles auront repoussé dessous.',
        },
      ],
    },
    {
      h2: 'Quelle couleur pour camoufler des ongles rongés ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Les teintes claires et naturelles sont vos alliées : nude, rose poudré, blanc laiteux. Elles agrandissent visuellement l\'ongle et se fondent avec la peau, ce qui rend la repousse presque invisible. Une french discrète fonctionne très bien aussi.',
        },
        {
          kind: 'paragraph',
          text:
            'Si vous voulez de la couleur, foncez : un rouge ou un bordeaux sur des ongles nets, c\'est justement ce qui change tout quand on a passé des années à cacher ses mains.',
        },
      ],
    },
    {
      h2: 'Comment une pose aide à arrêter de se ronger',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'C\'est le vrai bénéfice, au-delà de l\'esthétique. Se ronger les ongles (l\'onychophagie) est une habitude difficile à casser à la seule volonté. Une pose agit comme une barrière physique et mentale.',
        },
        {
          kind: 'list',
          items: [
            'La surface est lisse et dure : il n\'y a plus rien à attraper sous la dent',
            'On a payé et pris le temps de les faire : on a envie de les garder jolis',
            'De belles mains donnent envie de les montrer, pas de les cacher',
            'Pendant que la pose protège l\'ongle, celui-ci repousse tranquillement dessous',
          ],
        },
        {
          kind: 'paragraph',
          text:
            'Beaucoup de clientes racontent la même chose : après deux ou trois poses d\'affilée, l\'habitude de mordre s\'estompe, et les ongles naturels ont eu le temps de reprendre de la longueur. La pose n\'est pas magique, mais c\'est un vrai coup de pouce.',
        },
      ],
    },
    {
      h2: 'Le déroulé au salon',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Aucune inquiétude à avoir si vos ongles sont très courts ou abîmés : Vy en voit tous les jours, sans le moindre jugement. Le rendez-vous se passe comme une pose classique : préparation douce de l\'ongle, pose du gel, de la résine ou de la capsule, mise en forme, couleur et finition. Comptez le temps d\'une pose complète, en général une heure à une heure et demie selon la technique.',
        },
        {
          kind: 'paragraph',
          text:
            'Si la peau autour de l\'ongle a été abîmée à force de mordre, on reste doux et on évite les zones sensibles. On peut aussi ajouter une huile nourrissante sur les contours pour aider la peau à se réparer.',
        },
      ],
    },
    {
      h2: 'L\'entretien : garder le résultat',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Une pose sur ongles rongés tient en moyenne trois semaines. Ensuite, un remplissage comble la repousse et entretient la solidité, sans tout refaire. Au fil des remplissages, vos ongles naturels gagnent en longueur sous la pose : c\'est comme ça qu\'on passe, en quelques mois, d\'ongles rongés à des ongles sains que vous pourrez garder au naturel si vous le souhaitez.',
        },
        {
          kind: 'list',
          items: [
            'Un remplissage toutes les 3 semaines environ',
            'Une goutte d\'huile à cuticules chaque soir pour la souplesse',
            'On ne tire jamais sur une pose qui se décolle : on revient pour une dépose douce',
          ],
        },
      ],
    },
    {
      h2: 'Pour les hommes, les ados et les enfants',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Se ronger les ongles ne concerne pas que les femmes. Une pose de gel très naturelle, mate et courte, fonctionne aussi pour un homme qui veut arrêter, sans que ça se voie. Pour les ados, c\'est souvent une bonne motivation. Pour les jeunes enfants, on privilégie l\'accompagnement et le vernis plutôt qu\'une vraie pose ; on en parle ensemble selon l\'âge.',
        },
      ],
    },
    {
      h2: 'On s\'en occupe',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Quel que soit l\'état de vos ongles, il y a une solution pour les camoufler dès aujourd\'hui et repartir avec de belles mains. VyNails93 vous reçoit 7j/7 jusqu\'à 20h à Noisy-le-Grand, à 5 minutes du RER Noisy-Champs. Réservez en ligne, et si vous voulez, précisez que vos ongles sont rongés : Vy prévoit le temps et la technique qu\'il faut.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'Est-il possible de poser des faux ongles sur des ongles rongés ?',
      answer:
        'Oui. Une pose professionnelle (gel, résine ou capsule) s\'adapte à la longueur restante, même très courte, contrairement aux faux ongles à coller du commerce qui tiennent mal.',
    },
    {
      question: 'Quels faux ongles choisir pour des ongles rongés ?',
      answer:
        'Des formats courts à moyens, en gel ou en résine selon l\'état de l\'ongle. Le court tient mieux et paraît plus naturel ; on allonge progressivement au fil des poses.',
    },
    {
      question: 'Comment cacher des ongles rongés rapidement ?',
      answer:
        'Une pose de gel ou de résine dans une teinte nude ou rose poudré camoufle la repousse et agrandit visuellement l\'ongle. Le résultat est net dès la sortie du salon.',
    },
    {
      question: 'Les faux ongles aident-ils à arrêter de se ronger ?',
      answer:
        'Oui, souvent. La surface dure et lisse retire l\'envie de mordre, et l\'ongle naturel repousse protégé dessous. Après quelques poses, l\'habitude s\'estompe chez beaucoup de clientes.',
    },
    {
      question: 'Combien de temps tient une pose sur ongles rongés ?',
      answer:
        'Environ 3 semaines, puis un remplissage entretient le résultat sans tout refaire.',
    },
  ],
  related: [
    { label: 'Ongles en gel', href: '/ongles-gel-noisy-le-grand' },
    { label: 'Prothésiste ongulaire', href: '/prothesiste-ongulaire-noisy-le-grand' },
    { label: 'Faux ongles : capsule, gel ou résine', href: '/conseils/faux-ongles-capsule-gel-resine' },
    { label: 'Réserver un créneau', href: '/booking' },
  ],
}

// ─── 17. Manucure de mariée ───────────────────────────────────────────────

const manucureMariee: BlogPost = {
  slug: 'manucure-mariee-ongles-mariage',
  meta: {
    title: 'Manucure de mariée : couleur, forme, timing · VyNails93',
    description:
      'Quelle couleur, quelle forme et quand faire sa manucure pour un mariage. Le guide d\'une prothésiste pour des ongles de mariée réussis, à Noisy-le-Grand.',
  },
  title: 'Manucure de mariée : quelle couleur, quelle forme, quand la faire',
  excerpt:
    'Le jour J, vos mains sont sur toutes les photos, sur les alliances, sur le bouquet. Voici comment choisir votre manucure de mariée : couleur, forme et surtout le bon timing.',
  datePublished: '2026-08-02',
  dateModified: '2026-08-02',
  readingMinutes: 8,
  sections: [
    {
      h2: 'Pourquoi la manucure de mariée se prépare',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Le jour de votre mariage, vos mains sont partout : l\'échange des alliances, le bouquet, les photos rapprochées, la première part de gâteau. Une manucure soignée, c\'est un détail qui se voit sur des dizaines de clichés que vous garderez toute votre vie. Ça vaut la peine d\'y penser un peu à l\'avance, sans stress.',
        },
        {
          kind: 'paragraph',
          text:
            'Bonne nouvelle : pas besoin d\'un nail art compliqué. Les plus belles manucures de mariée sont souvent les plus simples. Voici les repères qui marchent.',
        },
      ],
    },
    {
      h2: 'Quelle couleur pour une manucure de mariée ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'La valeur sûre, c\'est le naturel. Les teintes nude, blanc laiteux, rose poudré et les rendus « clean » restent élégants, vont avec toutes les robes et ne datent pas sur les photos. C\'est le choix numéro un des mariées, et de loin.',
        },
        {
          kind: 'list',
          items: [
            'Nude et rosé : discret, chic, parfait avec une robe classique',
            'Blanc laiteux (milky) : lumineux, moderne, très tendance',
            'French manucure : l\'intemporel, en version fine et naturelle',
            'Babyboomer : le dégradé nude vers blanc, doux et raffiné',
          ],
        },
        {
          kind: 'paragraph',
          text:
            'Envie d\'une touche de couleur ? Accordez-la à votre thème plutôt qu\'à votre robe : un vert sauge pour un mariage champêtre, un rouge profond pour une ambiance glamour, quelques paillettes discrètes pour la fête. On peut aussi garder du nude sur toutes les mains et n\'ajouter qu\'un seul ongle accent.',
        },
      ],
    },
    {
      h2: 'Quelle forme et quelle longueur ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Pour un mariage, on conseille souvent une longueur raisonnable et une forme douce. Des ongles trop longs peuvent gêner pendant une journée où vous manipulez beaucoup de choses (bouquet, verres, tenue). Une forme amande ou carré arrondi allonge joliment le doigt tout en restant pratique.',
        },
        {
          kind: 'paragraph',
          text:
            'Si vous ne portez jamais d\'ongles longs, ce n\'est pas le jour pour tester. On reste dans quelque chose qui vous ressemble, en un peu plus soigné. Vous devez vous sentir vous-même.',
        },
      ],
    },
    {
      h2: 'Semi-permanent ou gel pour le mariage ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Les deux tiennent largement la journée et les jours qui suivent (utile si vous partez en voyage de noces juste après). Le choix dépend de vos ongles.',
        },
        {
          kind: 'list',
          items: [
            'Le semi-permanent : parfait si vous avez déjà de beaux ongles naturels. Pose rapide, rendu naturel, tenue 3 semaines.',
            'Le gel ou les capsules : si vous voulez allonger ou renforcer, ou si vos ongles sont fragiles. On construit la forme exacte que vous voulez.',
          ],
        },
        {
          kind: 'paragraph',
          text:
            'Dans les deux cas, la pose tient bien au-delà du jour J : vous n\'aurez pas à y penser pendant votre lune de miel.',
        },
      ],
    },
    {
      h2: 'Quand faire sa manucure de mariée ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'C\'est la question la plus importante, et la plus souvent oubliée. Le bon timing : 2 à 4 jours avant le mariage. Assez proche pour que les ongles soient impeccables le jour J, assez tôt pour corriger un détail si besoin et pour ne pas ajouter du stress à la veille.',
        },
        {
          kind: 'list',
          items: [
            'La veille : trop juste, aucune marge en cas d\'imprévu',
            '2 à 4 jours avant : le bon compromis, l\'idéal',
            'Une semaine avant : possible en semi-permanent ou gel, qui tiennent, mais la repousse commence à se voir sur ongles clairs',
          ],
        },
        {
          kind: 'paragraph',
          text:
            'Pensez aussi à réserver votre créneau plusieurs semaines à l\'avance : les périodes de mariage, au printemps et en été surtout, se remplissent vite. Si vous voulez un essai couleur, prévoyez-le encore avant.',
        },
      ],
    },
    {
      h2: 'Et les ongles de l\'invitée ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Invitée à un mariage, vous avez plus de liberté que la mariée. Vous pouvez accorder vos ongles à votre tenue ou au thème : une couleur qui rappelle votre robe, une french colorée, un chrome discret. Évitez simplement de voler la vedette avec un nail art trop chargé. Un joli semi-permanent bien net suffit largement.',
        },
      ],
    },
    {
      h2: 'N\'oubliez pas les pieds',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Si votre robe laisse voir vos pieds, ou si vous portez des sandales ouvertes, pensez à une beauté des pieds assortie. Le semi-permanent tient encore plus longtemps sur les orteils, ce qui est pratique pour la cérémonie et le voyage qui suit. On peut faire les mains et les pieds dans le même rendez-vous.',
        },
      ],
    },
    {
      h2: 'Réservez votre manucure de mariée',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'À Noisy-le-Grand, VyNails93 accompagne les mariées et leurs invitées 7j/7 jusqu\'à 20h, à 5 minutes du RER Noisy-Champs. Vy prend le temps de choisir avec vous la couleur et la forme qui iront avec votre robe et votre thème. Réservez votre créneau en ligne, quelques semaines à l\'avance de préférence, et mentionnez qu\'il s\'agit d\'un mariage pour qu\'on prévoie le temps nécessaire.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'Quelle manucure choisir pour une mariée ?',
      answer:
        'Les valeurs sûres sont les teintes naturelles : nude, blanc laiteux, rose poudré, french fine ou babyboomer. Élégantes, elles vont avec toutes les robes et ne datent pas sur les photos.',
    },
    {
      question: 'Quand faut-il faire sa manucure pour un mariage ?',
      answer:
        'Idéalement 2 à 4 jours avant. Assez proche pour des ongles impeccables le jour J, assez tôt pour corriger un détail sans stress. Réservez le créneau plusieurs semaines à l\'avance.',
    },
    {
      question: 'Semi-permanent ou gel pour un mariage ?',
      answer:
        'Les deux tiennent bien au-delà du jour J. Le semi-permanent convient si vous avez déjà de beaux ongles ; le gel ou les capsules si vous voulez allonger, renforcer ou construire une forme précise.',
    },
    {
      question: 'Quelle longueur d\'ongles pour un mariage ?',
      answer:
        'Une longueur raisonnable et une forme douce (amande ou carré arrondi). Trop long peut gêner pendant une journée où vous manipulez beaucoup de choses.',
    },
    {
      question: 'Quelle manucure quand on est invitée à un mariage ?',
      answer:
        'Plus de liberté que la mariée : accordez la couleur à votre tenue ou au thème, sans nail art trop chargé. Un semi-permanent net suffit.',
    },
  ],
  related: [
    { label: 'Manucure', href: '/manucure-noisy-le-grand' },
    { label: 'Nail art', href: '/nail-art-noisy-le-grand' },
    { label: 'Beauté des pieds', href: '/beaute-des-pieds-noisy-le-grand' },
    { label: 'Réserver un créneau', href: '/booking' },
  ],
}

// ─── 18. Nail art tendance 2026 ───────────────────────────────────────────

const nailArtTendance2026: BlogPost = {
  slug: 'nail-art-tendance-2026-chrome-cat-eye-aura',
  meta: {
    title: 'Ongles chrome, cat eye, aura : le nail art tendance 2026 · VyNails93',
    description:
      'Effet chrome, cat eye, aura nails, velours, glazed : les effets nail art tendance 2026 expliqués, comment ils tiennent et pour qui. Réalisables à Noisy-le-Grand.',
  },
  title: 'Nail art tendance 2026 : chrome, cat eye, aura et velours expliqués',
  excerpt:
    'Chrome, cat eye, aura, velours, glazed : les effets qui font le nail art de 2026. On explique ce que c\'est, comment ça tient et sur quelle base, sans jargon.',
  datePublished: '2026-08-02',
  dateModified: '2026-08-02',
  readingMinutes: 8,
  sections: [
    {
      h2: 'Les effets qui marquent 2026',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Le nail art de 2026 tourne autour des effets de matière : du métal, de la lumière, du reflet. Fini le vernis plat, place aux finitions qui accrochent la lumière et changent selon l\'angle. Voici les cinq effets les plus demandés, expliqués simplement, avec ce qu\'il faut savoir avant de choisir.',
        },
      ],
    },
    {
      h2: 'L\'effet chrome (ou effet miroir)',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'C\'est la star de 2026. L\'effet chrome donne un fini ultra-brillant, métallique, comme un miroir ou du métal liquide. On l\'obtient en appliquant une poudre chrome sur une base semi-permanent ou gel, puis en scellant avec un top coat. Popularisé par le fameux « glazed donut » de Hailey Bieber, il se décline en rose gold, argent, doré, mais aussi en pastel.',
        },
        {
          kind: 'paragraph',
          text:
            'Sur une base nude, le chrome reste discret et chic pour tous les jours. Sur une base foncée, il devient spectaculaire pour une soirée. Il tient aussi longtemps qu\'un semi-permanent classique, à condition de bien protéger le bord libre.',
        },
      ],
    },
    {
      h2: 'Le cat eye (œil de chat)',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Le cat eye, ou œil de chat, est un effet aimanté. Le vernis contient de fines particules métalliques que l\'on déplace avec un aimant pendant la pose, ce qui crée une bande de lumière suivant le mouvement, exactement comme l\'œil d\'un chat ou une pierre précieuse. Selon l\'angle, l\'ongle change d\'intensité.',
        },
        {
          kind: 'paragraph',
          text:
            'C\'est un effet profond et habillé, très joli en bleu nuit, bordeaux, vert ou violet. Il se fait sur base gel ou semi-permanent et demande un vrai savoir-faire pour placer la ligne de lumière au bon endroit sur chaque ongle.',
        },
      ],
    },
    {
      h2: 'Les aura nails',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Les aura nails, c\'est un dégradé en halo : une tache de couleur floue au centre de l\'ongle, comme une aura lumineuse, qui se fond dans une base plus claire. L\'effet est doux, presque brumeux. On le décline en rose, pêche, marron ou dans des tons vitaminés.',
        },
        {
          kind: 'paragraph',
          text:
            'C\'est un nail art tendance et pourtant très portable, parce qu\'il reste dans les nuances. Il se réalise à l\'aérographe ou à l\'éponge, sur base semi-permanent ou gel.',
        },
      ],
    },
    {
      h2: 'L\'effet velours',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'L\'effet velours (velvet nails) donne un rendu mat et duveteux, avec un reflet doux qui rappelle le tissu. Comme le cat eye, il utilise une poudre magnétique, mais le résultat est feutré plutôt que brillant. Parfait pour l\'automne et l\'hiver, magnifique en rouge, bordeaux ou émeraude, souvent choisi pour les fêtes.',
        },
      ],
    },
    {
      h2: 'Le glazed et le milky (le nude qui brille)',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Si vous aimez le naturel mais avec un twist, le glazed est fait pour vous : un nude nacré, perlé, comme un donut glacé. Son cousin le milky (blanc laiteux) donne un rendu translucide, propre et lumineux, qui va à toutes les carnations. Ce sont les rendus « clean » qu\'on voit partout, faciles à porter au quotidien comme pour une occasion.',
        },
      ],
    },
    {
      h2: 'Sur quelle base : semi-permanent ou gel ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Tous ces effets se posent sur une base semi-permanent ou gel, jamais sur du vernis classique qui ne tiendrait pas. Le choix dépend surtout de vos ongles :',
        },
        {
          kind: 'list',
          items: [
            'Vous avez de beaux ongles naturels : un semi-permanent avec l\'effet suffit, rendu naturel et tenue 3 semaines',
            'Vous voulez de la longueur ou de la solidité : on part sur du gel ou des capsules, puis on applique l\'effet',
          ],
        },
      ],
    },
    {
      h2: 'Est-ce que ça tient aussi longtemps qu\'un semi classique ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Oui, dans l\'ensemble. Un effet chrome, cat eye ou aura bien scellé tient autant qu\'un semi-permanent, autour de 3 semaines. Deux réflexes prolongent le résultat : un top coat de qualité qui protège l\'effet, et une goutte d\'huile à cuticules chaque soir. On évite aussi de se servir de ses ongles comme d\'outils, ce qui reste le meilleur moyen d\'éviter les éclats.',
        },
      ],
    },
    {
      h2: 'Quelle forme pour mettre l\'effet en valeur ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Les effets brillants et métalliques rendent particulièrement bien sur des ongles un peu longs et une forme amande ou ballerine, qui offrent une belle surface pour capter la lumière. Mais tout se fait aussi sur ongles courts : un chrome ou un glazed sur une forme carrée courte est très élégant et facile à vivre.',
        },
      ],
    },
    {
      h2: 'Envie d\'essayer un effet 2026 ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Chrome, cat eye, aura, velours, glazed : Vy réalise ces effets à Noisy-le-Grand, sur base semi-permanent ou gel, selon vos ongles et l\'occasion. Apportez une photo d\'inspiration si vous en avez une, on part de là. VyNails93 vous reçoit 7j/7 jusqu\'à 20h, à 5 minutes du RER Noisy-Champs. Réservez votre créneau en ligne.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'C\'est quoi les ongles chrome ?',
      answer:
        'Un fini ultra-brillant et métallique, comme un miroir, obtenu en appliquant une poudre chrome sur une base semi-permanent ou gel, puis en scellant avec un top coat. Il se décline en rose gold, argent, doré ou pastel.',
    },
    {
      question: 'Le cat eye (œil de chat), c\'est quoi ?',
      answer:
        'Un effet aimanté : le vernis contient des particules métalliques déplacées avec un aimant, créant une bande de lumière qui suit l\'angle de l\'ongle, comme une pierre précieuse.',
    },
    {
      question: 'Les aura nails, c\'est quoi ?',
      answer:
        'Un dégradé en halo : une tache de couleur floue au centre de l\'ongle qui se fond dans une base plus claire, pour un effet doux et brumeux. Réalisé à l\'aérographe ou à l\'éponge.',
    },
    {
      question: 'Ces effets tiennent-ils aussi longtemps qu\'un semi-permanent classique ?',
      answer:
        'Oui, environ 3 semaines quand ils sont bien scellés avec un bon top coat. Une goutte d\'huile à cuticules chaque soir et éviter d\'utiliser ses ongles comme outils prolongent la tenue.',
    },
    {
      question: 'Sur quelle base fait-on le nail art à effet ?',
      answer:
        'Sur une base semi-permanent ou gel, jamais sur du vernis classique. Le semi-permanent suffit sur de beaux ongles naturels ; on passe au gel ou aux capsules pour allonger ou renforcer.',
    },
  ],
  related: [
    { label: 'Nail art', href: '/nail-art-noisy-le-grand' },
    { label: 'Vernis semi-permanent', href: '/semi-permanent-noisy-le-grand' },
    { label: 'Ongles en gel', href: '/ongles-gel-noisy-le-grand' },
    { label: 'Voir la galerie', href: '/galerie' },
  ],
}

// ─── 19. Vernis avant une opération ───────────────────────────────────────

const vernisAvantOperation: BlogPost = {
  slug: 'vernis-semi-permanent-avant-operation',
  meta: {
    title: 'Faut-il enlever son vernis avant une opération ? · VyNails93',
    description:
      'Semi-permanent, gel ou faux ongles avant une opération, une IRM ou un scanner : pourquoi les retirer, sur quels doigts, et comment déposer sans abîmer vos ongles. Conseils d\'une prothésiste à Noisy-le-Grand.',
  },
  title: 'Faut-il enlever son vernis (semi-permanent, gel) avant une opération ?',
  excerpt:
    'Une opération, une IRM ou un scanner de prévu, et une jolie pose sur les ongles ? Voici ce que demandent vraiment les hôpitaux, pourquoi, et comment déposer proprement sans abîmer vos ongles.',
  datePublished: '2026-08-03',
  dateModified: '2026-08-03',
  readingMinutes: 8,
  sections: [
    {
      h2: 'La réponse courte',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Oui. Dans la grande majorité des cas, l\'hôpital vous demandera de retirer votre vernis avant une opération, y compris le semi-permanent, le gel et les faux ongles. Ce n\'est pas une contre-indication absolue, mais c\'est une consigne de sécurité et d\'hygiène que la plupart des cliniques appliquent. Le plus simple est donc d\'anticiper et de venir déposer votre pose en douceur avant votre rendez-vous.',
        },
        {
          kind: 'paragraph',
          text:
            'Un point important : cet article vous explique la règle générale et le pourquoi, mais votre consigne de référence reste celle de votre chirurgien, de votre anesthésiste ou du document préopératoire qu\'on vous a remis. En cas de doute, c\'est à eux qu\'il faut demander.',
        },
      ],
    },
    {
      h2: 'Pourquoi l\'hôpital demande de retirer le vernis',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'La raison principale n\'est pas esthétique, elle est médicale. Pendant l\'anesthésie, l\'équipe surveille en continu le taux d\'oxygène dans votre sang avec un petit capteur pincé au bout du doigt : l\'oxymètre de pouls (ou saturomètre). Ce capteur envoie une lumière à travers l\'ongle pour mesurer la saturation en oxygène. Un vernis foncé ou opaque, un gel ou une capsule peuvent fausser cette lecture ou la rendre impossible.',
        },
        {
          kind: 'paragraph',
          text:
            'Deuxième raison : la couleur naturelle de l\'ongle et de la peau renseigne l\'anesthésiste sur votre oxygénation et votre circulation. Des ongles recouverts cachent ce signal. À cela s\'ajoute l\'hygiène du bloc opératoire, où l\'on cherche à limiter tout ce qui pourrait retenir des micro-organismes.',
        },
        {
          kind: 'list',
          items: [
            'Le capteur d\'oxygène lit à travers l\'ongle : un vernis foncé ou un gel peut bloquer la mesure',
            'La couleur naturelle de l\'ongle est un indicateur que l\'équipe surveille',
            'L\'hygiène du bloc justifie de retirer vernis, faux ongles et bijoux',
          ],
        },
      ],
    },
    {
      h2: 'Semi-permanent, gel, faux ongles : tout doit partir ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'En pratique, oui pour la plupart des protocoles : vernis classique, semi-permanent, gel, résine et capsules doivent être retirés. Certains établissements se contentent de laisser un ou deux doigts libres (souvent les index), ou tolèrent un vernis transparent, mais les règles varient d\'un hôpital à l\'autre. Le plus sûr, et le plus simple, est de tout déposer avant de venir.',
        },
        {
          kind: 'paragraph',
          text:
            'Pensez aussi aux pieds : selon l\'intervention, l\'oxymètre peut être placé sur un orteil, donc un semi-permanent sur les ongles de pieds est parfois concerné lui aussi. Là encore, le document préopératoire ou l\'équipe vous le précisera.',
        },
      ],
    },
    {
      h2: 'IRM, scanner, radio : même règle ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Souvent oui. Pour une IRM en particulier, certains vernis et poudres à effet contiennent des pigments métalliques (chrome, effet miroir) qui peuvent créer des artefacts sur l\'image, voire chauffer légèrement. La plupart des centres d\'imagerie demandent donc de retirer le vernis et les faux ongles avant une IRM, un scanner ou parfois une simple radio. Le principe est le même : on évite tout ce qui pourrait gêner l\'examen.',
        },
      ],
    },
    {
      h2: 'Ne l\'arrachez surtout pas vous-même',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'C\'est le réflexe à éviter. Gratter ou arracher un semi-permanent, un gel ou une capsule enlève au passage les couches superficielles de l\'ongle naturel. Résultat : des ongles fins, striés et sensibles, juste au moment où vous ne pourrez pas les refaire tout de suite (avant et après une opération, mieux vaut des ongles nets et en bon état).',
        },
        {
          kind: 'paragraph',
          text:
            'La dépose se fait en douceur : la couche supérieure est limée, puis l\'ongle est enveloppé quelques minutes dans un coton imbibé d\'acétone, et le produit ramolli s\'enlève sans forcer. En salon, c\'est l\'affaire de quinze à vingt minutes, sans abîmer l\'ongle.',
        },
      ],
    },
    {
      h2: 'Quand la faire, et quoi faire après',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Prévoyez la dépose la veille ou l\'avant-veille, pas le matin même dans le stress. Vous arriverez à l\'hôpital les ongles propres, sans y penser. Une bonne huile à cuticules dans les jours qui précèdent aide aussi à garder des ongles souples.',
        },
        {
          kind: 'paragraph',
          text:
            'Après l\'opération, laissez passer le temps de récupération et attendez que vos mains aillent bien avant de refaire une pose. Dès que vous vous sentez prête, on repart sur une base propre, avec un soin nourrissant si vos ongles ont un peu souffert de l\'attente.',
        },
      ],
    },
    {
      h2: 'On vous dépose ça proprement, avant et après',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'À Noisy-le-Grand, VyNails93 réalise la dépose en douceur de votre semi-permanent, gel ou capsules, 7j/7 jusqu\'à 20h, à 5 minutes du RER Noisy-Champs. Précisez que c\'est pour une opération ou un examen : on prévoit le temps qu\'il faut, on retire tout proprement, et on ajoute une huile nourrissante pour que vos ongles restent en bon état. Et quand tout est terminé, on vous refait une jolie pose. Réservez votre créneau en ligne.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'Pourquoi faut-il enlever le vernis avant une opération ?',
      answer:
        'Parce que l\'oxymètre de pouls, le capteur qui mesure votre taux d\'oxygène pendant l\'anesthésie, lit à travers l\'ongle. Un vernis foncé, un gel ou une capsule peuvent fausser ou bloquer cette mesure. La couleur naturelle de l\'ongle est aussi un indicateur surveillé par l\'anesthésiste.',
    },
    {
      question: 'Peut-on garder du vernis transparent ou du semi-permanent clair ?',
      answer:
        'Cela dépend de l\'hôpital : certains le tolèrent, d\'autres non. Le plus sûr est de tout retirer avant de venir. En cas de doute, suivez le document préopératoire ou demandez à l\'équipe.',
    },
    {
      question: 'Faut-il aussi enlever le vernis des ongles de pieds ?',
      answer:
        'Souvent oui, car selon l\'intervention le capteur d\'oxygène peut être placé sur un orteil. Le semi-permanent sur les pieds est alors concerné comme celui des mains.',
    },
    {
      question: 'Faut-il enlever le semi-permanent pour une IRM ou un scanner ?',
      answer:
        'En général oui. Certains vernis et effets contiennent des pigments métalliques qui peuvent gêner l\'image ou chauffer légèrement lors d\'une IRM. La plupart des centres demandent de retirer vernis et faux ongles avant l\'examen.',
    },
    {
      question: 'L\'opération peut-elle être annulée à cause du vernis ?',
      answer:
        'C\'est rare, mais on vous demandera de le retirer, ce qui peut faire perdre du temps le jour J. Mieux vaut anticiper et déposer sa pose en douceur la veille ou l\'avant-veille.',
    },
  ],
  related: [
    { label: 'Vernis semi-permanent', href: '/semi-permanent-noisy-le-grand' },
    { label: 'Manucure', href: '/manucure-noisy-le-grand' },
    { label: 'Le semi-permanent abîme-t-il les ongles ?', href: '/conseils/semi-permanent-abime-t-il-les-ongles' },
    { label: 'Réserver une dépose', href: '/booking' },
  ],
}

// ─── 20. Faire remplir une pose faite ailleurs ────────────────────────────

const remplissageAutreSalon: BlogPost = {
  slug: 'faire-remplir-ongles-autre-salon',
  meta: {
    title: 'Changer de salon : remplir des ongles faits ailleurs ? · VyNails93',
    description:
      'Vous changez de salon d\'ongles ? Quand un remplissage sur une pose faite ailleurs est possible, quand une dépose complète est plus sûre, et comment se passe une première visite à Noisy-le-Grand.',
  },
  title: 'Changer de salon d\'ongles : peut-on faire remplir une pose faite ailleurs ?',
  excerpt:
    'Vous voulez changer de salon mais vous avez déjà une pose ? On vous reçoit. Voici quand on peut simplement remplir, quand une dépose complète est plus sûre, et comment se passe une première visite.',
  datePublished: '2026-08-03',
  dateModified: '2026-08-03',
  readingMinutes: 8,
  sections: [
    {
      h2: 'Oui, on reçoit les clientes qui viennent d\'un autre salon',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Changer de salon d\'ongles, ça arrive souvent : un déménagement, une prothésiste qui part, ou simplement l\'envie d\'un résultat plus régulier. Bonne nouvelle, vous n\'avez pas à attendre que votre pose actuelle tombe pour venir. Chez VyNails93, on accueille les nouvelles clientes qui ont déjà une pose faite ailleurs. On regarde ensemble ce qu\'on peut faire : un remplissage, ou une dépose suivie d\'une nouvelle pose.',
        },
      ],
    },
    {
      h2: 'Pourquoi certains salons refusent de remplir une autre pose',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Vous avez peut-être déjà entendu un "non, on ne remplit pas les poses des autres". Ce n\'est pas de la mauvaise volonté. Quand une prothésiste ne connaît pas la pose d\'origine, elle ne sait pas quel produit a été utilisé, s\'il a été bien catalysé, si les couches sont trop épaisses, si la préparation était propre, ni ce qu\'il y a vraiment sous le vernis. Remplir par-dessus quelque chose de mal fait, c\'est prendre le risque que tout se décolle deux jours plus tard, et que la cliente pense que c\'est le nouveau salon qui a raté.',
        },
        {
          kind: 'paragraph',
          text:
            'Vy préfère être honnête : elle regarde d\'abord, puis vous dit franchement ce qui est le mieux pour vos ongles, sans vous vendre plus que nécessaire.',
        },
      ],
    },
    {
      h2: 'Remplissage ou dépose complète : comment on décide',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Tout dépend de l\'état de la pose. Un remplissage est possible quand la base est saine.',
        },
        {
          kind: 'list',
          items: [
            'Remplissage possible : pose bien accrochée, pas de décollement, épaisseur raisonnable, ongle naturel en bon état dessous',
            'Dépose + nouvelle pose plus sûre : décollements, produit trop épais, pose abîmée, produit inconnu ou mal catalysé, ongle fragilisé',
          ],
        },
        {
          kind: 'paragraph',
          text:
            'Repartir sur une base propre n\'est pas une perte : une pose nette et bien préparée tient beaucoup mieux dans le temps. Souvent, c\'est même ce qui règle un problème de tenue que vous traîniez depuis plusieurs rendez-vous.',
        },
      ],
    },
    {
      h2: 'Ce qu\'on regarde à votre première visite',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'À la première visite, Vy prend le temps d\'examiner vos ongles : l\'adhérence de la pose, les éventuels décollements sur les bords, l\'épaisseur, et surtout l\'état de l\'ongle naturel en dessous. À partir de là, elle vous propose la solution la plus adaptée et vous explique pourquoi. Vous décidez en connaissance de cause.',
        },
      ],
    },
    {
      h2: 'Combien de fois peut-on remplir avant de tout refaire ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'En règle générale, on enchaîne deux à trois remplissages, puis on conseille une dépose complète pour repartir sur une base propre. Au fil des remplissages, le produit s\'accumule et la forme se déséquilibre légèrement ; une dépose de temps en temps garde des ongles sains et une pose fine et naturelle.',
        },
      ],
    },
    {
      h2: 'Réservez votre première visite',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Vous changez de salon et vous voulez un résultat qui tient enfin ses trois semaines ? VyNails93 vous reçoit à Noisy-le-Grand, 7j/7 jusqu\'à 20h, à 5 minutes du RER Noisy-Champs. Réservez votre première visite en ligne et précisez que vous avez déjà une pose : on prévoit le temps d\'évaluer et, selon l\'état, de remplir ou de repartir sur une base propre. Sans jugement, et avec des conseils honnêtes.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'Peut-on faire remplir une pose faite dans un autre salon ?',
      answer:
        'Oui, le plus souvent, après une évaluation rapide. Si la pose est saine (bien accrochée, pas décollée, épaisseur raisonnable), un remplissage est possible. Sinon, une dépose suivie d\'une nouvelle pose est plus sûre.',
    },
    {
      question: 'Vaut-il mieux un remplissage ou une nouvelle pose ?',
      answer:
        'Cela dépend de l\'état de la pose actuelle. On décide ensemble à la première visite : remplissage si la base est propre, dépose et nouvelle pose si elle est décollée, trop épaisse ou abîmée. Une base propre tient mieux.',
    },
    {
      question: 'Combien de fois peut-on faire un remplissage ?',
      answer:
        'En général deux à trois fois de suite, puis une dépose complète est recommandée pour éviter l\'accumulation de produit et garder des ongles sains.',
    },
    {
      question: 'Pourquoi certains salons refusent de remplir la pose d\'un autre salon ?',
      answer:
        'Parce qu\'ils ne connaissent pas le produit ni la préparation d\'origine. Remplir par-dessus une pose mal faite risque de tout faire décoller, et le nouveau salon en serait tenu responsable. C\'est pour ça qu\'on évalue d\'abord.',
    },
    {
      question: 'Que se passe-t-il lors d\'une première visite ?',
      answer:
        'Vy examine vos ongles et l\'état de la pose, vous conseille honnêtement (remplissage ou dépose et nouvelle pose), puis réalise la prestation adaptée. Vous repartez avec un résultat propre et des conseils d\'entretien.',
    },
  ],
  related: [
    { label: 'Ongles en gel', href: '/ongles-gel-noisy-le-grand' },
    { label: 'Prothésiste ongulaire', href: '/prothesiste-ongulaire-noisy-le-grand' },
    { label: 'Vernis semi-permanent', href: '/semi-permanent-noisy-le-grand' },
    { label: 'Réserver une première visite', href: '/booking' },
  ],
}

// ─── 21. Vernis semi-permanent qui se décolle ─────────────────────────────

const semiPermanentQuiSeDecolle: BlogPost = {
  slug: 'vernis-semi-permanent-qui-se-decolle-causes',
  meta: {
    title: 'Semi-permanent qui se décolle : 7 causes (et la solution) · VyNails93',
    description:
      'Votre semi-permanent se décolle au bout de quelques jours ? Les 7 vraies causes (préparation, corps gras, catalysation, bord libre) et pourquoi ce n\'est presque jamais votre faute. Prothésiste à Noisy-le-Grand.',
  },
  title: 'Vernis semi-permanent qui se décolle : les 7 causes (et pourquoi ce n\'est pas vous)',
  excerpt:
    'Un semi-permanent qui se décolle au bout de trois jours, ce n\'est pas normal, et ce n\'est presque jamais votre faute. Voici les 7 causes réelles et comment une pose bien faite tient ses 3 semaines.',
  datePublished: '2026-08-03',
  dateModified: '2026-08-03',
  readingMinutes: 8,
  sections: [
    {
      h2: 'Un semi qui se décolle en quelques jours, ce n\'est pas normal',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Un vernis semi-permanent bien posé tient trois semaines sans bouger. S\'il se décolle sur les bords au bout de trois ou quatre jours, s\'il s\'écaille ou fait des cloques, ce n\'est pas parce que vos ongles "ne tiennent pas le semi". Dans la grande majorité des cas, la cause est technique et se joue à la pose. Voici les sept raisons les plus fréquentes, du plus courant au plus rare.',
        },
      ],
    },
    {
      h2: '1. Une préparation de l\'ongle bâclée',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'C\'est la cause numéro un, et de loin. Près de 70 % de la tenue se joue avant même la première couche de couleur : repousser et retirer les cuticules et les petites peaux, poncer très légèrement la surface pour créer l\'accroche, dépoussiérer. Si les petites peaux restent sur la plaque, le vernis se pose dessus et non sur l\'ongle : il décolle par la base au bout de quelques jours.',
        },
      ],
    },
    {
      h2: '2. Un ongle mal dégraissé',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Le semi-permanent a besoin d\'un ongle parfaitement sec et sans corps gras. Un reste de crème pour les mains, de savon, d\'huile ou même le gras naturel de la peau suffit à empêcher l\'adhérence. C\'est pour ça qu\'on déshydrate l\'ongle juste avant la pose. Une pose maison faite après s\'être crémé les mains décolle presque à coup sûr.',
        },
      ],
    },
    {
      h2: '3. Des couches trop épaisses',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Le semi-permanent se pose en couches fines. Une couche trop épaisse ne catalyse pas à cœur sous la lampe : elle reste molle en dessous, fait des cloques et finit par se soulever d\'un bloc. Mieux vaut deux couches fines bien sèches qu\'une couche épaisse mal cuite.',
        },
      ],
    },
    {
      h2: '4. Une catalysation insuffisante',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Chaque couche doit sécher le temps qu\'il faut sous une lampe LED ou UV adaptée au produit. Une lampe trop ancienne, de mauvaise puissance, ou un temps de séchage trop court, et le vernis ne durcit pas complètement. Il tient quelques jours puis s\'écaille. C\'est un problème classique des poses maison avec une petite lampe d\'appoint.',
        },
      ],
    },
    {
      h2: '5. Le bord libre non capsulé',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Le bord libre, c\'est le bout de l\'ongle. S\'il n\'est pas "capsulé", c\'est-à-dire recouvert d\'un fin trait de vernis sur la tranche, l\'eau et les chocs s\'infiltrent par là et le vernis se décolle par le bout. C\'est le petit geste de finition qui fait gagner une semaine de tenue.',
        },
      ],
    },
    {
      h2: '6. Un ongle abîmé, fin ou qui se dédouble',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Parfois, le support lui-même est en cause : un ongle très fin, qui se dédouble ou se plie beaucoup, offre une surface instable. Le vernis suit les mouvements de l\'ongle et finit par lâcher. Dans ce cas, un gainage (une fine couche de renfort) sous le semi-permanent stabilise la plaque et améliore nettement la tenue.',
        },
      ],
    },
    {
      h2: '7. Les poses maison',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Ce n\'est pas un jugement, c\'est un cumul : à la maison, on additionne souvent plusieurs des causes ci-dessus. Base ordinaire, préparation rapide, ongle pas assez dégraissé, petite lampe, bord libre oublié. Chaque détail retire quelques jours de tenue, et bout à bout, la pose ne fait qu\'une semaine.',
        },
      ],
    },
    {
      h2: 'Ce que vous, vous pouvez faire',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Une fois la pose bien faite, votre entretien fait gagner facilement une semaine.',
        },
        {
          kind: 'list',
          items: [
            'Une goutte d\'huile à cuticules matin et soir : une cuticule souple n\'arrache pas la base',
            'Des gants pour la vaisselle et le ménage : l\'eau chaude et les produits fragilisent la tenue',
            'On n\'utilise pas ses ongles comme outils (décoller une étiquette, ouvrir une canette)',
            'On ne tire jamais sur un coin qui se soulève : on revient pour une dépose douce',
          ],
        },
      ],
    },
    {
      h2: 'La vraie solution : une pose de pro',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Si votre semi-permanent ne tient jamais, le problème n\'est presque jamais vous : c\'est la préparation et la pose. Chez VyNails93 à Noisy-le-Grand, chaque pose commence par une préparation soignée des cuticules, un dégraissage complet, des couches fines catalysées à cœur et un bord libre capsulé, avec un gainage si vos ongles sont fins. Le résultat tient ses trois semaines. Réservez en ligne, 7j/7 jusqu\'à 20h, à 5 minutes du RER Noisy-Champs.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'Pourquoi mon semi-permanent ne tient pas sur moi ?',
      answer:
        'Presque jamais à cause de vos ongles. La tenue dépend surtout de la pose : préparation des cuticules, dégraissage, couches fines bien catalysées et bord libre capsulé. Une pose bien réalisée tient 3 semaines, même sur des ongles réputés difficiles.',
    },
    {
      question: 'Pourquoi mon semi-permanent se décolle sur les bords ?',
      answer:
        'Le plus souvent parce que le bord libre (le bout de l\'ongle) n\'a pas été capsulé, ou parce qu\'il restait un corps gras à la pose. L\'eau et les chocs s\'infiltrent alors par la tranche et soulèvent le vernis.',
    },
    {
      question: 'Comment faire tenir un semi-permanent sur ongle naturel ?',
      answer:
        'Une bonne préparation (cuticules retirées, ongle dégraissé), des couches fines bien sèches, un bord libre capsulé, puis de l\'huile à cuticules chaque jour et des gants pour les tâches ménagères. Sur un ongle fin, un gainage améliore beaucoup la tenue.',
    },
    {
      question: 'Peut-on recoller un semi-permanent qui se décolle ?',
      answer:
        'Non. Une fois qu\'il se soulève, on ne recolle pas proprement : de l\'humidité passe dessous et peut favoriser un décollement plus large. Mieux vaut une dépose douce et une nouvelle pose bien préparée.',
    },
    {
      question: 'Pourquoi mon semi-permanent reste-t-il collant après la lampe ?',
      answer:
        'Une fine couche collante (dite de dispersion) est normale après catalysation et s\'essuie avec un nettoyant. Si toute la couche reste molle, c\'est un problème de séchage : lampe inadaptée, temps trop court ou couche trop épaisse.',
    },
  ],
  related: [
    { label: 'Vernis semi-permanent', href: '/semi-permanent-noisy-le-grand' },
    { label: 'Ongles en gel', href: '/ongles-gel-noisy-le-grand' },
    { label: 'Comment faire durer son semi-permanent', href: '/conseils/comment-faire-durer-son-vernis-semi-permanent' },
    { label: 'Réserver une pose', href: '/booking' },
  ],
}

// ─── 22. Manucure homme à Noisy-le-Grand ──────────────────────────────────

const manucureHomme: BlogPost = {
  slug: 'manucure-homme-noisy-le-grand',
  meta: {
    title: 'Manucure homme à Noisy-le-Grand : à quoi ça sert · VyNails93',
    description:
      'La manucure homme, mode d\'emploi : à quoi ça sert, comment ça se passe, le rendu discret et naturel, le prix. Sur rendez-vous 7j/7 à Noisy-le-Grand, à 5 min du RER Noisy-Champs.',
  },
  title: 'Manucure homme à Noisy-le-Grand : à quoi ça sert et comment ça se passe',
  excerpt:
    'De plus en plus d\'hommes prennent soin de leurs mains, et ça ne se voit même pas. Voici en quoi consiste une manucure homme, le rendu, le prix, et comment ça se passe à Noisy-le-Grand.',
  datePublished: '2026-08-03',
  dateModified: '2026-08-03',
  readingMinutes: 7,
  sections: [
    {
      h2: 'La manucure homme, ce n\'est plus un tabou',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Prendre soin de ses mains n\'a pas de genre. De plus en plus d\'hommes franchissent la porte d\'un salon pour des ongles nets et des mains soignées, que ce soit pour le travail, pour une occasion, ou simplement pour le confort. Et non, ça ne veut pas dire du vernis coloré : une manucure homme, c\'est avant tout un soin, avec une finition naturelle qui ne se remarque pas.',
        },
      ],
    },
    {
      h2: 'À quoi ça sert, concrètement',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Les mains se voient tout le temps : une poignée de main, une réunion, un rendez-vous. Des ongles propres et coupés net, des cuticules soignées et une peau non desséchée, ça change l\'allure sans en faire trop. C\'est utile pour un métier où l\'on serre des mains, pratique quand on travaille de ses mains et qu\'elles s\'abîment, et rassurant quand on a tendance à se ronger les ongles.',
        },
        {
          kind: 'list',
          items: [
            'Des ongles nets et à la bonne longueur, sans les couper de travers',
            'Des cuticules soignées, plus de petites peaux qui accrochent',
            'Des mains hydratées, moins sèches et moins rêches',
            'Un vrai coup de pouce pour arrêter de se ronger les ongles',
          ],
        },
      ],
    },
    {
      h2: 'Comment ça se passe, étape par étape',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Rien de compliqué, et rien d\'intimidant. Une manucure homme suit les mêmes étapes qu\'un soin des mains classique, en un peu plus sobre.',
        },
        {
          kind: 'list',
          items: [
            'Un bain tiède pour ramollir les cuticules',
            'Le limage et la mise en forme des ongles à la bonne longueur',
            'Le soin des cuticules (on repousse, on retire les petites peaux)',
            'Un ponçage très léger si besoin pour lisser la surface',
            'Un soin hydratant et un massage rapide des mains',
            'Une finition naturelle : mate ou transparente, jamais brillante si vous ne voulez pas',
          ],
        },
        {
          kind: 'paragraph',
          text:
            'Comptez entre trente et quarante-cinq minutes, le temps de souffler un peu.',
        },
      ],
    },
    {
      h2: 'Est-ce que ça se voit ?',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'C\'est la question qui revient le plus, et la réponse est non, c\'est justement le but. La finition est naturelle : un vernis mat incolore ou un simple lustrage qui donne des ongles nets sans brillance. Personne ne devinera que vous sortez d\'un salon, on verra juste des mains bien tenues. Si vous voulez du vernis coloré, c\'est possible aussi, mais ce n\'est pas la demande la plus courante.',
        },
      ],
    },
    {
      h2: 'Pour qui, et à quelle fréquence',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'La manucure homme s\'adresse à tout le monde : un actif qui reçoit du public, un futur marié qui veut de belles mains pour les photos et les alliances, quelqu\'un qui travaille de ses mains, ou un homme qui se ronge les ongles et veut arrêter. Pour l\'entretien courant, un rendez-vous toutes les trois à quatre semaines suffit à garder des mains nettes.',
        },
        {
          kind: 'paragraph',
          text:
            'Si vous vous rongez les ongles, une pose de gel très naturelle et mate peut aider : la surface dure retire l\'envie de mordre et l\'ongle repousse protégé dessous. On en parle sur notre page dédiée aux ongles rongés.',
        },
      ],
    },
    {
      h2: 'Combien ça coûte',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'Une manucure homme se situe au tarif d\'un soin des mains, à partir de 15 €, selon le soin choisi (simple mise en forme, soin complet, ajout d\'un vernis mat). Tous les tarifs sont affichés sur la page Prestations & Tarifs, sans surprise.',
        },
      ],
    },
    {
      h2: 'Réserver, en toute simplicité',
      blocks: [
        {
          kind: 'paragraph',
          text:
            'À Noisy-le-Grand, VyNails93 reçoit les hommes comme tout le monde, sans jugement, 7j/7 jusqu\'à 20h, à 5 minutes du RER Noisy-Champs. Que ce soit pour un entretien régulier, un mariage ou pour arrêter de vous ronger les ongles, réservez votre créneau en ligne et précisez ce que vous cherchez : on adapte le soin et le rendu à ce qui vous convient.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'Un homme peut-il faire une manucure ?',
      answer:
        'Bien sûr, et c\'est de plus en plus courant. Une manucure homme est avant tout un soin des mains et des ongles, avec une finition naturelle qui ne se voit pas. Chez VyNails93, les hommes sont reçus sans jugement, sur rendez-vous 7j/7.',
    },
    {
      question: 'Est-ce que la manucure homme se voit ?',
      answer:
        'Non, c\'est le but. La finition est mate ou transparente : des ongles nets et des mains soignées, sans brillance. Personne ne devine que vous sortez d\'un salon. Un vernis coloré reste possible si vous le souhaitez.',
    },
    {
      question: 'Quelles sont les étapes d\'une manucure homme ?',
      answer:
        'Un bain tiède, le limage et la mise en forme des ongles, le soin des cuticules, un léger ponçage si besoin, un soin hydratant avec massage des mains, puis une finition naturelle. Comptez 30 à 45 minutes.',
    },
    {
      question: 'Combien coûte une manucure homme ?',
      answer:
        'À partir de 15 €, au tarif d\'un soin des mains, selon la prestation choisie. Les tarifs détaillés sont sur la page Prestations & Tarifs de vynails.fr.',
    },
    {
      question: 'À quelle fréquence faire une manucure homme ?',
      answer:
        'Toutes les 3 à 4 semaines pour un entretien régulier. Si vous vous rongez les ongles, un rythme plus rapproché au début, avec éventuellement une pose de gel naturelle, aide à changer l\'habitude.',
    },
  ],
  related: [
    { label: 'Manucure', href: '/manucure-noisy-le-grand' },
    { label: 'Beauté des pieds', href: '/beaute-des-pieds-noisy-le-grand' },
    { label: 'Ongles rongés : quelle pose', href: '/conseils/ongles-ronges-pose-gel-faux-ongles' },
    { label: 'Réserver un créneau', href: '/booking' },
  ],
}

// ─── Registry ─────────────────────────────────────────────────────────────

export const blogPosts: Record<string, BlogPost> = {
  'comment-faire-durer-son-vernis-semi-permanent': faireDurerSemiPermanent,
  'gel-ou-semi-permanent-difference': gelOuSemiPermanent,
  'combien-de-temps-dure-un-semi-permanent': dureeSemiPermanent,
  'questions-frequentes-ongles': questionsFrequentesOngles,
  'vernis-sans-hema-allergies': vernisSansHema,
  'cil-a-cil-volume-rehaussement-choisir': cilsChoisir,
  'manucure-russe-c-est-quoi': manucureRusse,
  'faux-ongles-capsule-gel-resine': fauxOnglesDifference,
  'gainage-biab-renforcer-ongles': gainageBiab,
  'semi-permanent-abime-t-il-les-ongles': semiPermanentAbime,
  'rehaussement-cils-prix-duree-contre-indications': rehaussementCilsInfos,
  'pose-americaine-gel-x-difference': poseAmericaine,
  'beaute-des-pieds-semi-permanent-orteils': beautePiedsOrteils,
  'entretenir-extensions-cils-duree': entretienCils,
  'ongles-enceinte-semi-permanent-gel': onglesEnceinte,
  'ongles-ronges-pose-gel-faux-ongles': onglesRonges,
  'manucure-mariee-ongles-mariage': manucureMariee,
  'nail-art-tendance-2026-chrome-cat-eye-aura': nailArtTendance2026,
  'vernis-semi-permanent-avant-operation': vernisAvantOperation,
  'faire-remplir-ongles-autre-salon': remplissageAutreSalon,
  'vernis-semi-permanent-qui-se-decolle-causes': semiPermanentQuiSeDecolle,
  'manucure-homme-noisy-le-grand': manucureHomme,
}

export const blogPostSlugs = Object.keys(blogPosts)

/** Posts ordered newest-first for the index. */
export const blogPostsByDate: readonly BlogPost[] = Object.values(blogPosts)
  .slice()
  .sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1))

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts[slug]
}
