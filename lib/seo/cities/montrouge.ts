import type { City } from "@/lib/seo/types"

/**
 * Montrouge (92120, Hauts-de-Seine) — ville limitrophe de Gentilly à l'ouest.
 * Contenu rédigé à la main, ancré localement (métro 4 « Mairie de Montrouge »,
 * relais tram T3a vers la Porte de Gentilly, gare RER B « Gentilly »).
 * Temps et distances indicatifs, en conditions normales de circulation.
 */
export const cityData: City = {
  name: "Montrouge",
  slug: "montrouge",
  postalCode: "92120",
  driveMinutes: 7,
  distanceKm: 3,
  publicTransport:
    "Depuis Montrouge, la ligne 4 du métro et sa station « Mairie de Montrouge » desservent le cœur de ville et vous rapprochent des boulevards des Maréchaux ; de là, le tram T3a file vers la Porte de Gentilly, à quelques pas de l'institut. Vous pouvez aussi gagner la gare de Gentilly (RER B), à quelques minutes à pied du 12 Avenue Jean Jaurès. Plusieurs lignes de bus complètent ces accès entre les deux villes, qui partagent une frontière.",
  drivingHint:
    "En voiture, comptez environ 7 minutes depuis le centre de Montrouge, soit près de 3 km : gagnez la Porte de Châtillon, longez les boulevards des Maréchaux jusqu'à la Porte de Gentilly, puis descendez sur l'avenue Jean Jaurès. Un trajet direct, praticable en semaine comme le week-end. Le stationnement se trouve dans les rues voisines de l'institut.",
  lead:
    "À l'ouest de Gentilly, Montrouge n'est qu'à quelques minutes : les deux communes se partagent une frontière, quelque part entre la Porte de Châtillon et la Porte de Gentilly. C'est ce qui amène beaucoup de Montrougiennes à pousser la porte de Do Beauty pour leurs ongles et leur regard, plutôt que de remonter vers Paris. Manucure, vernis semi-permanent, pose en gel ou extensions de cils : notre équipe travaille avec soin et sans précipitation, à trois kilomètres à peine du Beffroi.",
  neighborhoods: [
    "Le Beffroi",
    "Mairie de Montrouge",
    "Avenue de la République",
    "Porte de Châtillon",
    "Porte de Montrouge",
  ],
  localBlocks: [
    {
      h2: "De Montrouge à Gentilly, presque sans quitter le quartier",
      paragraphs: [
        "Montrouge borde Gentilly à l'est : les deux communes se touchent, quelque part entre la Porte de Châtillon et la Porte de Gentilly. Depuis la Mairie, l'avenue de la République ou les abords du Beffroi, il ne faut qu'une poignée de minutes en voiture, ou un court trajet en métro ligne 4 relayé par le tram T3a, pour arriver au 12 Avenue Jean Jaurès. Cette proximité a fait de Do Beauty une adresse de quartier pour bon nombre de Montrougiennes, sans les contraintes de stationnement de Paris intra-muros.",
        "Sur place, on prend le temps. Nos prothésistes commencent par écouter ce que vous cherchez — une manucure nette pour la semaine, un semi-permanent qui tienne jusqu'au prochain rendez-vous, une couleur pour une occasion — avant de conseiller la forme et la finition. L'institut est ouvert 7 jours sur 7, ce qui laisse le choix d'un créneau après le travail comme d'une pause le samedi, et la réservation se fait en ligne en quelques instants.",
      ],
    },
    {
      h2: "Ongles et regard : ce que l'on vient chercher chez nous",
      paragraphs: [
        "Côté mains, la carte couvre la manucure, le vernis semi-permanent, la pose en gel et le nail art, du nude discret aux décors plus travaillés. On travaille avec des produits professionnels et une hygiène stricte, pour un résultat net qui tient. Aux beaux jours, une beauté des pieds s'ajoute volontiers au rendez-vous, pour accorder mains et pieds avant les sandales.",
        "Le regard tient une place à part : nos poses d'extensions de cils se travaillent cil à cil, du rendu naturel au plus dense, et le rehaussement de cils ouvre l'œil sans artifice. C'est le genre de soin que l'on réserve avant un événement ou simplement pour gagner du temps le matin. Avec une note de 4,6 sur 5 pour près d'une centaine d'avis Google, Do Beauty s'est fait une place auprès des habitantes de Montrouge.",
      ],
    },
  ],
  reasons: [
    "À l'ouest de Gentilly et directement limitrophe : environ 7 minutes en voiture, soit près de 3 km depuis le centre de Montrouge.",
    "Accessible sans voiture : métro ligne 4 « Mairie de Montrouge », relais tram T3a vers la Porte de Gentilly, ou gare RER B « Gentilly » toute proche.",
    "Une carte complète sous un même toit : manucure, vernis semi-permanent, pose en gel, nail art, extensions de cils et beauté des pieds.",
    "Ouvert 7 jours sur 7, avec des créneaux en soirée et une réservation en ligne rapide.",
    "Une note de 4,6★ sur près de 99 avis Google, signe d'un travail précis et d'un accueil attentif.",
  ],
  localFaqs: [
    {
      question: "Combien de temps faut-il pour venir de Montrouge chez Do Beauty ?",
      answer:
        "Comptez environ 7 minutes en voiture depuis le centre de Montrouge, soit près de 3 km, en passant par la Porte de Châtillon puis les boulevards des Maréchaux vers la Porte de Gentilly. Montrouge étant limitrophe de Gentilly, le trajet reste court ; prévoyez un peu plus aux heures de pointe.",
    },
    {
      question: "Comment rejoindre l'institut depuis Montrouge sans voiture ?",
      answer:
        "La ligne 4 du métro, à la station « Mairie de Montrouge », vous mène vers les boulevards des Maréchaux, où le tram T3a rejoint la Porte de Gentilly, tout près de l'institut. Vous pouvez aussi descendre à la gare de Gentilly (RER B), à quelques minutes à pied du 12 Avenue Jean Jaurès. Plusieurs lignes de bus desservent également le trajet entre les deux villes.",
    },
  ],
}
