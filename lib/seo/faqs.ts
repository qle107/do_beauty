/**
 * Homepage FAQ - 15 questions optimized for local SEO around Gentilly (94).
 * The same data feeds both the FaqAccordion section and the FAQPage JSON-LD,
 * so Google sees identical question/answer pairs on the page and in schema.
 */

export type FaqEntry = { question: string; answer: string }

export const homepageFaqs: readonly FaqEntry[] = [
  {
    question: 'Combien de temps dure un semi-permanent ?',
    answer:
      "Un vernis semi-permanent posé chez Do Beauty à Gentilly tient en moyenne 3 semaines. Sa durée dépend de la qualité de la pose, du soin apporté à vos ongles au quotidien et de votre activité manuelle.",
  },
  {
    question: 'Quelle est la différence entre gel et semi-permanent ?',
    answer:
      "Le semi-permanent est un vernis longue tenue posé sur l'ongle naturel (tenue ~3 semaines). Le gel est une matière constructrice qui rallonge ou renforce l'ongle (tenue ~4 semaines avec remplissage). Notre équipe vous conseille la technique adaptée à vos ongles lors du rendez-vous.",
  },
  {
    question: 'Puis-je faire réparer un ongle cassé chez Do Beauty ?',
    answer:
      "Oui, nous proposons la réparation d'ongles cassés ou abîmés. Selon l'état, la réparation se fait par renfort en gel ou résine, en quelques minutes. Réservez en ligne pour une intervention rapide.",
  },
  {
    question: 'Comment prendre rendez-vous ?',
    answer:
      "Réservez en ligne directement sur notre site, 24h/24, depuis votre mobile ou votre ordinateur — c'est le moyen le plus rapide. Vous pouvez aussi nous contacter pendant nos heures d'ouverture (environ 10h–19h30, du lundi au samedi).",
  },
  {
    question: 'Quels moyens de paiement acceptez-vous ?',
    answer:
      "Do Beauty accepte les règlements par carte bancaire et en espèces, sur place le jour de votre rendez-vous. La réservation en ligne ne demande aucun acompte : vous réglez uniquement à l'institut, une fois la prestation terminée.",
  },
  {
    question: 'Où vous situez-vous exactement à Gentilly ?',
    answer:
      "L'institut se trouve au 12 Avenue Jean Jaurès, 94250 Gentilly. Nous sommes à proximité de la gare RER B Gentilly et du tram T3a (Porte de Gentilly), aux portes de Paris (13e et 14e).",
  },
  {
    question: 'Y a-t-il un parking à proximité ?',
    answer:
      "Oui, du stationnement (gratuit ou payant) est disponible autour de l'Avenue Jean Jaurès et dans le centre de Gentilly, à quelques minutes à pied de l'institut.",
  },
  {
    question: 'Êtes-vous ouverts le dimanche ?',
    answer:
      "Non, Do Beauty est fermé le dimanche. Nous sommes ouverts du lundi au samedi, d'environ 10h à 19h30, avec des créneaux en soirée et le samedi, pratiques pour un rendez-vous après le travail.",
  },
  {
    question: 'Combien coûte une manucure complète ?',
    answer:
      "Nos manucures démarrent à 15 € (manucure complète sans vernis). Une pose de vernis semi-permanent est à partir de 25 €, et une manucure simple avec vernis classique à partir de 20 €. Tous les tarifs sont visibles sur la page Prestations & Tarifs.",
  },
  {
    question: 'Proposez-vous aussi les cils et le regard ?',
    answer:
      "Oui. Do Beauty réalise les extensions de cils en soie (cil à cil, mixte, volume russe) à partir de 55 €, ainsi que le rehaussement de cils, le soin botox-collagène, la teinture et le browlift des sourcils.",
  },
  {
    question: 'Quel délai pour avoir un rendez-vous ?',
    answer:
      "Les créneaux les plus demandés (samedis après-midi, soirées) sont souvent réservés plusieurs jours à l'avance. Pour les autres créneaux, nous avons régulièrement des disponibilités sous 24 à 48h. Réservez en ligne pour voir les créneaux libres en temps réel.",
  },
  {
    question: 'Faites-vous des prestations pour les mariées ?',
    answer:
      "Oui, nous préparons régulièrement les futures mariées de Gentilly et des environs : manucure, nail art, pose d'extensions de cils, un essai en amont et la pose le jour J. Appelez-nous au 07 56 94 88 88 pour caler l'essai et la date.",
  },
  {
    question: 'Proposez-vous des soins du visage et des massages ?',
    answer:
      "Oui. Au-delà des ongles et du regard, Do Beauty propose des soins du visage (nettoyage, hydrafacial, lifting collagène) et des massages du corps (thaï, californien, dos, jambes). Retrouvez le détail sur la page Prestations & Tarifs.",
  },
  {
    question: 'Que faire si je dois annuler mon rendez-vous ?',
    answer:
      "Nous vous remercions de prévenir au moins 24h à l'avance afin que nous puissions proposer le créneau à une autre cliente. Les annulations répétées de dernière minute peuvent entraîner un refus de prochaine réservation en ligne.",
  },
  {
    question: 'Acceptez-vous les enfants à l’institut ?',
    answer:
      "Les enfants accompagnés d'un adulte sont les bienvenus. Pour des raisons de sécurité (produits, instruments), nous demandons qu'ils restent à proximité et ne touchent pas au matériel pendant les prestations.",
  },
]
