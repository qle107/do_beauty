# Registre des activités de traitement — VyNails93

Document interne tenu au titre de l'article 30 du RGPD. Non publié, mais
communicable à la CNIL sur demande. À relire et dater à chaque évolution du site.

- **Responsable du traitement :** VyNails93 — Entreprise individuelle, Madame Thi Lua Bui (SIREN 921 111 704 · SIRET 921 111 704 00018 · APE 9602B Soins de beauté)
- **Adresse :** 2 Place du 11 Novembre 1918, 93160 Noisy-le-Grand
- **Contact données :** contact@vynails.fr — 06 52 34 64 98
- **Délégué à la protection des données (DPO) :** non désigné (non obligatoire pour cette activité)
- **Dernière mise à jour :** 14/07/2026

---

## 1. Gestion des rendez-vous clients

| Élément | Détail |
|---|---|
| **Finalité** | Prendre, gérer et honorer les réservations en ligne |
| **Base légale** | Exécution de mesures précontractuelles / contrat (art. 6-1-b RGPD) |
| **Personnes concernées** | Clients et clients potentiels |
| **Catégories de données** | Nom, téléphone, remarques, photos d'inspiration (facultatives) |
| **Destinataires** | Gérante ; Google (Agenda + messagerie) en tant que sous-traitant |
| **Sous-traitants** | Google Ireland/LLC (Calendar, Gmail/SMTP), hébergeur du site |
| **Transferts hors UE** | Possibles via Google (USA), encadrés par le Data Privacy Framework |
| **Durée de conservation** | Pendant la relation, puis 3 ans après le dernier rendez-vous ; photos supprimées une fois le RDV terminé |
| **Mesures de sécurité** | HTTPS, accès admin authentifié (NextAuth), stockage restreint |

## 2. Messages de contact

| Élément | Détail |
|---|---|
| **Finalité** | Recevoir et répondre aux demandes envoyées via le formulaire de contact |
| **Base légale** | Intérêt légitime (répondre à une sollicitation) |
| **Personnes concernées** | Toute personne utilisant le formulaire |
| **Catégories de données** | Nom, email, objet, message, adresse IP (sécurité anti-spam) |
| **Destinataires** | Gérante ; email professionnel |
| **Sous-traitants** | Google (Gmail/SMTP), hébergeur du site |
| **Transferts hors UE** | Possibles via Google (USA), Data Privacy Framework |
| **Durée de conservation** | Jusqu'à 1 an après traitement de la demande |
| **Mesures de sécurité** | HTTPS, Turnstile, limitation de débit par IP, accès admin authentifié |

## 3. Prévention des abus de réservation

| Élément | Détail |
|---|---|
| **Finalité** | Limiter les faux rendez-vous, le spam et les absences répétées |
| **Base légale** | Intérêt légitime (prévention de la fraude / bon fonctionnement du service) |
| **Personnes concernées** | Visiteurs effectuant une réservation |
| **Catégories de données** | Identifiant d'appareil (UUID), empreinte navigateur (avec consentement), n° de téléphone normalisé, compteur d'absences, liste de blocage |
| **Destinataires** | Gérante uniquement (interface admin) |
| **Sous-traitants** | Hébergeur du site ; Cloudflare Turnstile (vérification anti-robot) |
| **Transferts hors UE** | Aucun transfert de donnée client identifiante |
| **Durée de conservation** | Au maximum 1 an après la dernière activité de l'appareil |
| **Mesures de sécurité** | Empreinte calculée uniquement après consentement, stockage restreint, accès admin authentifié |

## 4. Mesure d'audience du site

| Élément | Détail |
|---|---|
| **Finalité** | Statistiques de fréquentation pour améliorer le site |
| **Base légale** | Consentement (art. 82 Loi Informatique et Libertés) |
| **Personnes concernées** | Visiteurs du site ayant accepté les cookies |
| **Catégories de données** | Données de navigation collectées par Google Analytics / Google Tag Manager |
| **Destinataires** | Google |
| **Sous-traitants** | Google LLC |
| **Transferts hors UE** | Vers les USA, encadrés par le Data Privacy Framework |
| **Durée de conservation** | Selon la configuration Google (par défaut 14 mois) ; preuve de consentement ~6 mois |
| **Mesures de sécurité** | Traceurs chargés uniquement après consentement explicite, révocable via « Gérer les cookies » |

> ⚠️ Point de vigilance : la CNIL recommande de migrer vers une solution de mesure
> d'audience européenne (ex. Matomo, Plausible) d'ici mi-2026. Une telle solution,
> correctement configurée, peut être exemptée de consentement.

## 5. Preuve de consentement aux cookies

| Élément | Détail |
|---|---|
| **Finalité** | Démontrer le consentement (ou le refus) des visiteurs aux cookies de mesure d'audience |
| **Base légale** | Obligation légale / intérêt légitime (art. 7-1 RGPD : pouvoir prouver le consentement) |
| **Personnes concernées** | Visiteurs ayant répondu au bandeau cookies |
| **Catégories de données** | Choix (accepté/refusé), adresse IP anonymisée (dernier octet supprimé), user-agent, date |
| **Destinataires** | Gérante uniquement |
| **Sous-traitants** | Hébergeur du site |
| **Transferts hors UE** | Aucun |
| **Durée de conservation** | Conservée à titre probatoire (recommandé : purge périodique, ex. 12 mois) |
| **Mesures de sécurité** | IP anonymisée à l'enregistrement, stockage restreint |

## 6. Gestion du compte administrateur

| Élément | Détail |
|---|---|
| **Finalité** | Authentifier la gérante pour accéder à l'interface d'administration |
| **Base légale** | Intérêt légitime (sécurité du service) |
| **Personnes concernées** | Gérante / personnel autorisé |
| **Catégories de données** | Identifiants de connexion, cookie de session |
| **Destinataires** | Interne |
| **Sous-traitants** | Hébergeur du site |
| **Transferts hors UE** | Aucun |
| **Durée de conservation** | Le temps de la relation ; session expirant automatiquement |
| **Mesures de sécurité** | Mots de passe, cookie de session sécurisé (NextAuth) |
