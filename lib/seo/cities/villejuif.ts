import type { City } from "@/lib/seo/types"

/**
 * Villejuif (94800) — city landing page data.
 *
 * Drive time, distance and transit are typical, honest approximations;
 * landmarks (Gustave Roussy, Paul Brousse, parc des Hautes-Bruyères,
 * stations de la ligne 7) are factual references. Villejuif n'est pas
 * limitrophe de Gentilly : Le Kremlin-Bicêtre et Arcueil s'intercalent,
 * ce que le contenu assume plutôt que de le masquer.
 */
export const cityData: City = {
  name: "Villejuif",
  slug: "villejuif",
  postalCode: "94800",
  driveMinutes: 8,
  distanceKm: 3.5,
  publicTransport:
    "Depuis Villejuif, la ligne 7 du métro est votre point de départ, avec ses stations « Villejuif — Louis Aragon » (le terminus), « Paul Vaillant-Couturier » et « Léo Lagrange ». En remontant la ligne vers le nord, deux ou trois arrêts suffisent pour rejoindre Le Kremlin-Bicêtre, aux portes de Gentilly ; de là, on gagne l'institut par le tramway T3a (arrêt Porte de Gentilly) ou par la gare RER B « Gentilly », toute proche du 12 Avenue Jean Jaurès. Plusieurs lignes de bus relient aussi directement le centre de Villejuif au secteur de Gentilly, une bonne option aux heures creuses.",
  drivingHint:
    "En voiture, comptez environ 8 minutes depuis le centre de Villejuif, soit à peu près 3,5 km : remontez vers le nord par l'avenue de Paris puis l'avenue de Fontainebleau (RD7), traversez Le Kremlin-Bicêtre et rejoignez l'avenue Jean Jaurès à Gentilly. Un temps de trajet typique en journée, à majorer un peu aux heures de pointe.",
  lead:
    "À quelques minutes au nord de Villejuif, Do Beauty accueille les Villejuifoises dans un institut de beauté et nail salon calme et soigné, à Gentilly. Entre le centre-ville, le quartier de Gustave Roussy et les abords de la ligne 7, beaucoup viennent y retrouver notre équipe pour une manucure, un vernis semi-permanent, une pose gel ou des extensions de cils, sans avoir à monter jusqu'à Paris. Un rendez-vous sans se presser, à quelques minutes de chez vous.",
  neighborhoods: [
    "Centre-ville / Mairie de Villejuif",
    "Institut Gustave Roussy",
    "Hôpital Paul Brousse",
    "Parc des Hautes-Bruyères",
    "Villejuif — Louis Aragon",
  ],
  localBlocks: [
    {
      h2: "De Villejuif à Gentilly, en suivant la ligne 7",
      paragraphs: [
        "Villejuif et Gentilly ne se touchent pas tout à fait : Le Kremlin-Bicêtre et Arcueil s'intercalent entre les deux communes. La distance reste pourtant courte. En métro, la ligne 7 fait le lien : depuis « Louis Aragon », « Paul Vaillant-Couturier » ou « Léo Lagrange », on remonte vers Le Kremlin-Bicêtre, aux portes de Gentilly, avant de rejoindre l'avenue Jean Jaurès par le tram T3a ou le RER B. En voiture, l'avenue de Fontainebleau (RD7) trace un axe direct, pour environ 8 minutes et 3,5 km.",
        "C'est cette proximité qui amène beaucoup de Villejuifoises chez Do Beauty : un institut de quartier, plus posé qu'un salon du centre de Paris, où l'on prend le temps de conseiller la forme, la longueur et la finition qui vous vont. Que vous travailliez du côté de Gustave Roussy ou de l'hôpital Paul Brousse, que vous habitiez près du parc des Hautes-Bruyères ou du centre-ville, l'institut se cale facilement dans une fin de journée ou un rendez-vous du week-end. La réservation en ligne permet de choisir votre créneau en quelques instants.",
      ],
    },
    {
      h2: "Ongles, cils et regard : le soin du détail",
      paragraphs: [
        "Côté ongles, nos prothésistes travaillent la manucure classique, le vernis semi-permanent longue tenue, la pose en gel et le nail art, du plus discret au plus graphique. Chaque prestation est réalisée avec des gestes précis et une hygiène rigoureuse, pour un résultat net qui dure. Les habituées de Villejuif apprécient de repartir avec des mains impeccables sans avoir à traverser tout Paris.",
        "Le regard n'est pas en reste : extensions de cils posées cil à cil, rehaussement de cils et soins, pour un rendu naturel qui tient au quotidien comme pour une occasion. La beauté des pieds complète volontiers la carte aux beaux jours. Ouvert 7 jours sur 7, environ de 10h à 19h30, l'institut affiche une note de 4,6 sur 5 pour près de 99 avis Google.",
      ],
    },
  ],
  reasons: [
    "À environ 8 minutes et 3,5 km au nord de Villejuif, via l'avenue de Fontainebleau (RD7) et Le Kremlin-Bicêtre.",
    "Accessible en transports : ligne 7 du métro (Louis Aragon, Paul Vaillant-Couturier, Léo Lagrange), puis tram T3a ou RER B « Gentilly ».",
    "Pratique pour qui travaille du côté de Gustave Roussy ou de l'hôpital Paul Brousse.",
    "Une carte complète : manucure, vernis semi-permanent, pose en gel, nail art, extensions de cils et beauté des pieds.",
    "Ouvert 7j/7 (environ 10h–19h30), réservation en ligne simple et note de 4,6★ sur près de 99 avis Google.",
  ],
  localFaqs: [
    {
      question: "Combien de temps faut-il pour venir de Villejuif chez Do Beauty ?",
      answer:
        "Comptez environ 8 minutes en voiture, soit à peu près 3,5 km, depuis le centre de Villejuif, par l'avenue de Fontainebleau (RD7) en passant par Le Kremlin-Bicêtre. Sans voiture, la ligne 7 du métro vous rapproche du Kremlin-Bicêtre, aux portes de Gentilly, d'où le tram T3a (Porte de Gentilly) ou le RER B « Gentilly » vous déposent à quelques minutes à pied de l'avenue Jean Jaurès.",
    },
    {
      question: "Peut-on réserver une manucure ou des extensions de cils le week-end ?",
      answer:
        "Oui. L'institut est ouvert 7 jours sur 7, week-end compris, généralement de 10h à 19h30. Vous pouvez réserver en ligne votre manucure, votre vernis semi-permanent, une pose gel ou des extensions de cils et choisir le créneau qui vous convient, même en fin de journée.",
    },
  ],
}
