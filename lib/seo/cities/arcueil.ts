import type { City } from "@/lib/seo/types"

/**
 * Arcueil (94110) - commune limitrophe sud de Gentilly.
 * Contenu écrit à la main, ancré localement (RER B : deux gares à Arcueil,
 * Laplace à une station de Gentilly ; quartiers Vache Noire / Chaperon-Vert
 * frontaliers de Gentilly ; aqueduc d'Arcueil). Temps et distances approximatifs.
 */
export const cityData: City = {
  name: "Arcueil",
  slug: "arcueil",
  postalCode: "94110",
  driveMinutes: 4,
  distanceKm: 1.6,
  publicTransport:
    "Arcueil compte elle-même deux gares sur la ligne B du RER, ce qui rend le trajet vers Gentilly particulièrement direct. Depuis la gare Laplace, au centre d'Arcueil, Gentilly est la station suivante : un seul arrêt, puis quelques minutes à pied le long de l'avenue Jean Jaurès jusqu'au 12. Depuis la gare Arcueil-Cachan, comptez deux arrêts vers le nord (Laplace, puis Gentilly). Et si vous habitez le quartier de la Vache Noire ou du Chaperon-Vert, au nord de la commune, vous êtes déjà à la frontière de Gentilly : l'institut se rejoint alors en quelques minutes à pied.",
  drivingHint:
    "En voiture, comptez environ 4 minutes depuis le nord d'Arcueil, soit à peine 1,6 km : les quartiers de la Vache Noire et du Chaperon-Vert touchent directement Gentilly, et l'avenue Jean Jaurès se rejoint sans détour. Depuis le centre-ville ou les abords de la gare Arcueil-Cachan, prévoyez quelques minutes de plus selon la circulation. Le stationnement se trouve dans les rues voisines de l'institut.",
  lead:
    "Arcueil et Gentilly partagent les arches du même aqueduc et, au nord, tout un pan de ville autour de la Vache Noire et du Chaperon-Vert. À quatre minutes à peine, Do Beauty accueille les Arcueillaises pour prendre soin des ongles, du regard et des pieds : manucure nette, vernis semi-permanent longue tenue, pose en gel ou extensions de cils, dans un institut calme où l'on prend le temps de bien faire.",
  neighborhoods: [
    "Quartier Laplace",
    "La Vache Noire",
    "Le Chaperon-Vert",
    "L'Aqueduc d'Arcueil",
    "Gare Arcueil-Cachan",
  ],
  localBlocks: [
    {
      h2: "D'Arcueil à Gentilly, presque la même rue",
      paragraphs: [
        "Peu de villes sont aussi proches de notre institut qu'Arcueil. Au nord de la commune, le quartier de la Vache Noire et le Chaperon-Vert se prolongent directement dans Gentilly : d'un trottoir à l'autre, on a déjà changé de ville. Depuis le centre-ville, l'avenue Laplace ou les hauteurs qui dominent l'aqueduc, il suffit de quelques minutes pour rejoindre le 12 Avenue Jean Jaurès, en voiture comme à pied.",
        "Le RER B rend le trajet encore plus simple : la gare Laplace, en plein Arcueil, n'est qu'à une seule station de Gentilly. Beaucoup de nos clientes arcueillaises passent ainsi en sortant du travail ou après un tour au centre commercial, sans avoir à remonter dans Paris. L'institut est ouvert du lundi au samedi et la réservation se fait en ligne, pour caler un créneau en semaine, en soirée ou le week-end.",
      ],
    },
    {
      h2: "Ongles, regard et pieds : le soin du détail",
      paragraphs: [
        "Côté mains, nos prothésistes travaillent la manucure, le vernis semi-permanent et la pose en gel, du nude discret au nail art plus graphique, en soignant la forme et la finition. Pour le regard, le rehaussement et les extensions de cils ouvrent l'œil avec naturel, cil à cil, pour un rendu que l'on porte aussi bien au quotidien que pour une occasion. La beauté des pieds complète volontiers le rendez-vous, surtout aux beaux jours.",
        "Nous accordons la même attention à l'hygiène et à la précision du geste sur chaque prestation, avec des produits professionnels. À titre indicatif, la manucure démarre autour de 15 à 20 €, le vernis semi-permanent dès 25 €, la pose en gel dès 35 €, le rehaussement de cils dès 45 € et la beauté des pieds dès 25 €. Tarifs indicatifs, confirmés lors de la réservation. Avec une note de 4,6 sur 5 pour près de 99 avis Google, Do Beauty est devenu une adresse de confiance pour les habitantes d'Arcueil.",
      ],
    },
  ],
  reasons: [
    "À environ 4 minutes et 1,6 km : le nord d'Arcueil (Vache Noire, Chaperon-Vert) touche directement Gentilly.",
    "Deux gares RER B à Arcueil même : depuis Laplace, Gentilly n'est qu'à une seule station.",
    "Ouvert du lundi au samedi, avec des créneaux en soirée et le samedi, pratique après le travail ou le RER.",
    "Une carte complète : manucure, vernis semi-permanent, pose en gel, nail art, extensions de cils et beauté des pieds.",
    "Une note de 4,6★ sur près de 99 avis Google et une réservation en ligne simple et rapide.",
  ],
  localFaqs: [
    {
      question: "Combien de temps faut-il pour venir d'Arcueil chez Do Beauty ?",
      answer:
        "Depuis le nord d'Arcueil, autour de la Vache Noire et du Chaperon-Vert, comptez environ 4 minutes en voiture, soit à peine 1,6 km, ces quartiers touchant directement Gentilly. Depuis le centre-ville ou la gare Arcueil-Cachan, prévoyez quelques minutes de plus. En RER B, la gare Laplace vous met à une seule station de Gentilly, à quelques pas de l'avenue Jean Jaurès.",
    },
    {
      question: "Peut-on venir en RER B depuis Arcueil ?",
      answer:
        "Oui, très facilement. Arcueil dispose de deux gares sur la ligne B : depuis Laplace, Gentilly est la station suivante ; depuis Arcueil-Cachan, comptez deux arrêts vers le nord. Une fois à la gare de Gentilly, l'institut se rejoint à pied en quelques minutes le long de l'avenue Jean Jaurès. Vous pouvez réserver votre manucure, votre vernis semi-permanent ou vos extensions de cils en ligne avant de venir.",
    },
  ],
}
