import { z } from 'zod'

// ─── Prestation ───────────────────────────────────────────────────────────

export const serviceSchema = z.object({
  name: z.string().min(2, 'Le nom doit comporter au moins 2 caractères'),
  description: z.string().min(5, 'La description doit comporter au moins 5 caractères'),
  price: z.number().positive('Le prix doit être positif'),
  duration: z.number().int().positive('La durée doit être un entier positif (en minutes)'),
  category: z.enum([
    'FORFAIT',
    'MAINS',
    'PIEDS',
    'CAPSULE',
    'NAIL_ART',
    'CILS',
    'VISAGE',
    'CORPS',
    'EPILATION',
  ]),
  isActive: z.boolean().optional().default(true),
})

export const serviceUpdateSchema = serviceSchema.partial()

export type ServiceInput = z.infer<typeof serviceSchema>
export type ServiceUpdateInput = z.infer<typeof serviceUpdateSchema>

// ─── Galerie ──────────────────────────────────────────────────────────────

const galleryCategory = z.enum(['nails', 'eyes', 'pedicure', 'studio', 'other'])
// Free-form tags: lowercase-ish slugs the admin can invent on the fly. Bounded
// so the metadata store can't be flooded with junk.
const galleryTags = z
  .array(z.string().trim().min(1).max(40))
  .max(20, 'Vous pouvez ajouter jusqu’à 20 tags.')

// Create = metadata + the image itself, sent as a compressed base64 data URL
// (the browser resizes/encodes before upload). The byte cap is enforced again
// server-side when the data URL is decoded.
export const galleryCreateSchema = z.object({
  title: z.string().max(120).optional().default(''),
  alt: z.string().trim().min(3, 'Le texte alternatif est requis (min. 3 caractères)').max(200),
  category: galleryCategory,
  tags: galleryTags.optional().default([]),
  published: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false),
  image: z
    .string()
    .regex(
      /^data:image\/(jpeg|png|webp);base64,/,
      'Format d’image non supporté (JPEG, PNG ou WebP uniquement).',
    ),
})

// Update = metadata only; the image is never re-uploaded on edit. `catalogStatus`
// flips to 'approved' when the owner accepts an AI suggestion.
export const galleryUpdateSchema = z.object({
  title: z.string().max(120).optional(),
  alt: z.string().trim().min(3).max(200).optional(),
  category: galleryCategory.optional(),
  tags: galleryTags.optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  catalogStatus: z.enum(['suggested', 'approved']).optional(),
})

// Bulk classify many images at once (admin). Tags are added/removed, not replaced,
// so a bulk pass never wipes an image's existing hand-picked tags.
export const galleryBulkSchema = z.object({
  ids: z.array(z.string().min(1)).min(1, 'Sélectionnez au moins une image.').max(500),
  category: galleryCategory.optional(),
  addTags: galleryTags.optional(),
  removeTags: galleryTags.optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
})

export type GalleryCreateInput = z.infer<typeof galleryCreateSchema>
export type GalleryUpdateInput = z.infer<typeof galleryUpdateSchema>
export type GalleryBulkInput = z.infer<typeof galleryBulkSchema>

// ─── Rendez-vous ──────────────────────────────────────────────────────────

export const appointmentSchema = z.object({
  clientName: z.string().min(2, 'Le nom doit comporter au moins 2 caractères'),
  clientPhone: z
    .string()
    .min(1, 'Le numéro de téléphone est requis')
    .refine(
      (val) => /^(?:(?:\+|00)33|0)[1-9]\d{8}$/.test(val.replace(/[\s.\-()]/g, '')),
      'Numéro français invalide (ex : 06 12 34 56 78)'
    ),
  serviceIds: z
    .array(z.string().min(1))
    .min(1, 'Sélectionnez au moins une prestation'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'La date doit être au format AAAA-MM-JJ'),
  timeSlot: z.string().regex(/^\d{2}:\d{2}$/, 'Le créneau doit être au format HH:MM'),
  notes: z.string().max(500, 'Les remarques ne doivent pas dépasser 500 caractères').optional(),
  // Optional customer reference photos, sent as compressed base64 data URLs (the
  // browser resizes/encodes them before upload). Shape + per-string length are
  // capped here; the exact byte size and image decoding happen server-side.
  images: z
    .array(z.string())
    .max(3, 'Vous pouvez joindre jusqu’à 3 photos.')
    .optional()
    .refine(
      (arr) => !arr || arr.every((u) => /^data:image\/(jpeg|png|webp);base64,/.test(u)),
      'Format d’image non supporté (JPEG, PNG ou WebP uniquement).'
    )
    .refine(
      (arr) => !arr || arr.every((u) => u.length <= 7_500_000),
      'Une photo est trop volumineuse.'
    ),
  // Persistent browser device id (UUID) generated client-side. Optional: absent
  // when the visitor has localStorage disabled. Bounded to reject junk values.
  deviceId: z.string().max(64).optional(),
  // Browser fingerprint (hash) generated client-side. Fallback identifier that
  // survives clearing the deviceId; matched behind phone/deviceId. Shape-locked
  // to getFingerprint()'s output - exactly 16 lowercase hex chars, or empty when
  // the browser blocked the APIs - so a caller can't submit an arbitrary or
  // oversized chosen value.
  fingerprint: z.string().regex(/^([0-9a-f]{16})?$/).optional(),
  turnstileToken: z.string().optional(),
  // If true, cancel the caller's existing active appointment (matched server-side
  // by phone) before creating the new one. The client never handles the event id.
  confirmReplace: z.boolean().optional(),
  // Optional preferred practitioner (client's choice at the end - a hint). The
  // server resolves the id to a name/agenda; an unknown id is simply ignored.
  preferredEmployeeId: z.string().max(40).optional(),
})

export const appointmentStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW']),
  // clientPhone is required when status = NO_SHOW so the API can record the no-show
  clientPhone: z.string().optional(),
  clientName: z.string().optional(),
})

export const clientDetailsSchema = appointmentSchema.pick({
  clientName: true,
  clientPhone: true,
  notes: true,
})

export type AppointmentInput = z.infer<typeof appointmentSchema>
export type ClientDetailsInput = z.infer<typeof clientDetailsSchema>
export type AppointmentStatusInput = z.infer<typeof appointmentStatusSchema>

// ─── Message de contact ───────────────────────────────────────────────────

export const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit comporter au moins 2 caractères'),
  email: z.string().email('Veuillez saisir une adresse email valide'),
  subject: z.string().min(3, "L'objet doit comporter au moins 3 caractères"),
  message: z.string().min(10, 'Le message doit comporter au moins 10 caractères').max(2000),
  turnstileToken: z.string().optional(),
})

export type ContactInput = z.infer<typeof contactSchema>

// Admin-composed outgoing email (from the business to any recipient).
export const businessEmailSchema = z.object({
  to: z.string().email('Veuillez saisir une adresse email valide'),
  subject: z.string().min(3, "L'objet doit comporter au moins 3 caractères"),
  body: z.string().min(1, 'Le message est requis').max(2000),
  greetingName: z.string().optional(),
})

export type BusinessEmailInput = z.infer<typeof businessEmailSchema>

// ─── Disponibilités ───────────────────────────────────────────────────────
// Le front envoie la durée totale calculée (somme des prestations choisies).

export const availabilityQuerySchema = z.object({
  date:     z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'La date doit être au format AAAA-MM-JJ'),
  duration: z.coerce.number().int().positive('La durée doit être un entier positif (en minutes)'),
})

