// ─── Short "what's included" line shown under each service on the menu ───────
//
// The salon owner asked for a simple line under the duration explaining what a
// formula actually includes (e.g. a spa mani-pedi = bain, ponçage des talons,
// coupe/limage, gommage, massage). Kept deliberately short and plain.
//
// Sourced here as static code (not from the Sheet/JSON store) so it shows on the
// live site without re-seeding the data store. Keyed by the stable service id;
// `descriptionFor()` prefers a description already present on the service.

import type { Service } from '@/lib/types'

const DESCRIPTIONS: Record<string, string> = {
  // Offres spéciales - forfaits mains + pieds
  svc_off_01: 'Mains et pieds, formule de base : bain, ponçage des talons, cuticules, coupe et limage, gommage et massage. Sans vernis.',
  svc_off_02: 'Formule de base mains et pieds (gommage, ponçage, massage) avec finition en vernis classique.',
  svc_off_03: 'Formule de base mains et pieds avec finition en vernis semi-permanent, tenue 2 à 3 semaines.',
  svc_off_04: 'Mains et pieds, formule premium : gommage, masque nourrissant et long massage. Sans vernis.',
  svc_off_05: 'Formule premium mains et pieds avec finition en vernis classique.',
  svc_off_06: 'Formule premium mains et pieds avec finition en vernis semi-permanent.',

  // Soin des mains
  svc_mains_01: 'Mise en beauté des mains : cuticules, coupe et limage, gommage léger. Sans pose de vernis.',
  svc_mains_02: 'Manucure des mains avec finition en vernis classique.',
  svc_mains_03: 'Manucure des mains avec vernis semi-permanent, tenue 2 à 3 semaines.',
  svc_mains_04: 'Coupe, limage et pose de vernis classique, sans soin complet des cuticules.',
  svc_mains_05: 'Pose de vernis semi-permanent sur ongles préparés, tenue 2 à 3 semaines.',
  svc_mains_06: 'Semi-permanent en dégradé naturel, du blanc vers le rosé, effet fondu et lumineux.',
  svc_mains_07: "Vernis semi-permanent avec French (fin liseré blanc au bout de l'ongle).",

  // Soin des pieds
  svc_pieds_01: 'Soin complet des pieds : bain, ponçage des talons, cuticules, coupe et limage, gommage et massage. Sans vernis.',
  svc_pieds_02: 'Soin spa des pieds avec finition en vernis classique.',
  svc_pieds_03: 'Soin spa des pieds avec vernis semi-permanent, tenue 2 à 3 semaines.',
  svc_pieds_04: 'Soin spa des pieds avec finition French.',
  svc_pieds_05: 'Coupe, limage et pose de vernis classique sur les pieds.',
  svc_pieds_06: 'Pose de vernis semi-permanent sur les pieds, tenue 2 à 3 semaines.',
  svc_pieds_07: 'Vernis semi-permanent avec French sur les pieds.',
  svc_pieds_08: "Quelques minutes de massage des pieds, en complément d'un soin.",

  // Pose de capsule
  svc_caps_01: 'Allongement des ongles avec capsules en résine, mise en forme et finition semi-permanent.',
  svc_caps_02: 'Comblement de la repousse sur capsules résine, remise en forme et semi-permanent.',
  svc_caps_03: 'Allongement des ongles avec capsules en gel, mise en forme et finition semi-permanent.',
  svc_caps_04: 'Comblement de la repousse sur pose gel, remise en forme et semi-permanent.',
  svc_caps_05: 'Capsules américaines Gel X pré-formées, pose complète et finition semi-permanent.',
  svc_caps_06: 'Allongement des ongles des pieds en résine, mise en forme et semi-permanent.',
  svc_caps_07: 'Capsules en résine avec dégradé Baby Boomer, du blanc vers le rosé.',
  svc_caps_08: 'Capsules en gel avec dégradé Baby Boomer, du blanc vers le rosé.',

  // Gainage & renforcement
  svc_gain_01: "Renforcement de l'ongle naturel au gel builder, sans allongement, finition semi-permanent.",
  svc_gain_02: "Renforcement de l'ongle naturel en résine, sans allongement, finition semi-permanent.",

  // Spa VIPP américain
  svc_vipp_01: 'Manucure premium des mains : gommage, masque nourrissant et massage prolongé. Sans vernis.',
  svc_vipp_02: 'Manucure premium des mains avec finition en vernis classique.',
  svc_vipp_03: 'Manucure premium des mains avec vernis semi-permanent.',
  svc_vipp_04: 'Soin premium des pieds : ponçage, gommage, masque et massage prolongé. Sans vernis.',
  svc_vipp_05: 'Soin premium des pieds avec finition en vernis classique.',
  svc_vipp_06: 'Soin premium des pieds avec vernis semi-permanent.',

  // Nails pour hommes
  svc_hom_01: 'Mise en beauté des mains pour homme : cuticules, coupe, limage et finition naturelle mate.',
  svc_hom_02: 'Soin des pieds pour homme : ponçage des talons, cuticules, coupe, limage et massage.',
  svc_hom_03: 'Soin complet des mains et des pieds pour homme, en une seule séance.',

  // Extension de cils - poses (le guide au-dessus détaille chaque style)
  svc_cils_01: 'Une extension par cil naturel, effet allongé très naturel.',
  svc_cils_02: 'Base cil à cil densifiée de quelques éventails : naturel un peu plus fourni.',
  svc_cils_06: 'Cil à cil et éventails plus présents, densité marquée mais portable au quotidien.',
  svc_cils_10: 'Éventails ultra-fins faits main, volume aérien et duveteux.',
  svc_cils_11: 'Éventails fournis, frange dense et spectaculaire.',
  svc_cils_15: 'Jeu de longueurs texturé façon Kim K, regard mode et aéré.',

  // Rehaussement de cils
  svc_reh_01: 'Recourbe les cils naturels vers le haut, avec soin botox collagène et teinture : regard ouvert, effet mascara.',
  svc_reh_02: 'Recourbe les cils naturels avec soin botox collagène, sans teinture.',
  svc_reh_03: 'Coloration des cils pour foncer la pointe, effet mascara sans maquillage.',
  svc_reh_04: 'Coloration des sourcils pour les redessiner et les intensifier.',

  // Soins du visage
  svc_vis_01: 'Nettoyage de la peau : démaquillage, gommage doux et hydratation.',
  svc_vis_02: 'Nettoyage en profondeur et hydratation intense, pour une peau nette et lumineuse.',
  svc_vis_03: 'Soin purifiant qui désincruste les pores et matifie le teint.',
  svc_vis_04: 'Soin complet en 9 étapes : nettoyage, gommage, extraction, masque, sérum collagène et hydratation.',
  svc_vis_05: "Soin anti-âge complet, ciblé sur la fermeté et l'éclat de la peau.",
  svc_vis_06: 'Soin raffermissant au collagène, effet lifting et rebond de la peau.',

  // Soins du corps - massages
  svc_corps_01: 'Massage thaï aux huiles essentielles : pressions et étirements pour dénouer tout le corps.',
  svc_corps_02: 'Massage thaï aux huiles essentielles : pressions et étirements pour dénouer tout le corps.',
  svc_corps_03: 'Massage thaï aux huiles essentielles : pressions et étirements pour détendre le corps.',
  svc_corps_04: 'Massage thaï aux huiles essentielles, version courte ciblée sur les tensions.',
  svc_corps_05: 'Massage californien enveloppant, longs mouvements fluides très relaxants.',
  svc_corps_06: 'Massage ciblé du dos pour relâcher les tensions.',
  svc_corps_07: 'Massage relaxant du corps entier, pour une détente profonde.',
  svc_corps_08: 'Massage relaxant des pieds, pressions douces façon réflexologie.',
  svc_corps_09: 'Massage du dos, du cou et des épaules, les zones de tension du quotidien.',
  svc_corps_10: 'Massage relaxant des bras.',
  svc_corps_11: 'Massage des jambes, effet jambes légères.',
  svc_corps_12: 'Massage du ventre, favorise la digestion et la détente.',
  svc_corps_13: 'Massage du ventre prolongé, favorise la digestion et la détente.',

  // Browlift sourcils
  svc_brow_01: 'Restructuration des sourcils : fixés vers le haut, teintés et nourris (soin botox) pour un regard structuré.',
}

/** Short menu description for a service: the one on the record if any, else our map. */
export function descriptionFor(service: Pick<Service, 'id' | 'description'>): string | undefined {
  const own = service.description?.trim()
  if (own) return own
  return DESCRIPTIONS[service.id]
}
