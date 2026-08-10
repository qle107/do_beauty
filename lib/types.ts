// ─── Shared domain types (replaces @prisma/client) ────────────────────────

export type ServiceCategory =
  | 'FORFAIT'
  | 'MAINS'
  | 'PIEDS'
  | 'CAPSULE'
  | 'NAIL_ART'
  | 'CILS'
  | 'VISAGE'
  | 'CORPS'
  | 'EPILATION'

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW'

// ─── Service (stored in data/services.json) ───────────────────────────────

export interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number        // minutes
  category: ServiceCategory
  isActive: boolean
  /** Optional Planity service id - for future official write-back mapping. */
  planityId?: string
  featured?: boolean      // affiché en vitrine sur la homepage
  createdAt: string       // ISO string
  updatedAt: string       // ISO string

  // ── Carte / catalogue display (mirrors the live Planity menu) ───────────
  // `category` above stays the coarse pool key (availability logic). `section`
  // is the finer display group shown on the menu - many sections map to one
  // pool category (e.g. Offres spéciales + Spa VIPP both → FORFAIT). See lib/catalogue.ts.
  /** Display section id, one of the 15 SECTIONS in lib/catalogue.ts. */
  section?: string
  /** Optional sub-heading inside a section (only "Extension de cils": Poses / Remplissages / Déposes & suppléments). */
  subgroup?: string
  /** How the price is shown when it isn't a plain number. */
  priceType?: 'fixed' | 'from' | 'quote' | 'free' | 'range'
  /** Verbatim price text from the menu when priceType ≠ 'fixed' (e.g. "à partir de 55 €", "GRATUIT DÉPOSE", "Sur devis"). */
  priceLabel?: string
  /** Small grey subtitle under the name (e.g. "sur devis" on Réparation d'un ongle). */
  note?: string
}

// ─── Gallery image (metadata in data/gallery.json; bytes on disk/Drive) ────
// The image binaries live outside any database (public/ file, DATA_DIR upload,
// or Google Drive). Only this lightweight metadata is stored/queried.

export type GalleryCategory = 'nails' | 'eyes' | 'pedicure' | 'studio' | 'other'

// AI-catalog assistant state: a suggestion is never applied automatically - the
// owner reviews and approves it. 'approved' (or undefined) = owner-controlled.
export type CatalogStatus = 'suggested' | 'approved'

// Where the image bytes live:
//  · 'static' → a file already under /public (migrated existing photos)
//  · 'local'  → an admin upload saved under DATA_DIR (served via a proxy route)
//  · 'drive'  → Google Drive (wired later, behind the same GalleryStorage API)
export type GalleryStorageKind = 'static' | 'local' | 'drive'

export interface GalleryImage {
  id: string
  title: string
  alt: string
  category: GalleryCategory
  tags: string[]
  published: boolean
  featured?: boolean        // pinned/hero image within its category
  storage: GalleryStorageKind
  src?: string              // 'static': the /public path (e.g. /images/dob/g1.jpg)
  fileName?: string         // stored/original filename (local/drive)
  driveFileId?: string      // 'drive': Google Drive file id
  width?: number
  height?: number
  // AI-catalog assistant (optional): a machine suggestion the owner can accept or
  // reject. Never overwrites category/tags until approved.
  catalogStatus?: CatalogStatus
  suggestedCategory?: GalleryCategory
  suggestedTags?: string[]
  uploadedAt: string        // ISO - the sort key (newest first)
  createdAt: string         // ISO
  updatedAt: string         // ISO
}

// The shape sent to the browser: the resolved public URL + display fields only
// (no storage internals).
export interface GalleryImagePublic {
  id: string
  url: string
  alt: string
  title: string
  category: GalleryCategory
  tags: string[]
  uploadedAt: string
  featured?: boolean
  width?: number
  height?: number
}

// ─── Appointment (stored as Google Calendar events) ───────────────────────

export interface Appointment {
  id: string              // Google Calendar event ID
  clientName: string
  clientPhone: string
  serviceIds: string[]    // one or many service IDs (multi-service cart)
  services: Service[]     // resolved services for display
  totalDuration: number   // minutes (sum of all services)
  totalPrice: number      // euros (sum of all services)
  date: string            // ISO string (start of event)
  timeSlot: string        // "HH:MM"
  status: AppointmentStatus
  notes?: string
  employeeName?: string   // chosen praticienne (from event extendedProperties.private.employee)
  createdAt: string       // ISO string (event creation time)
  updatedAt: string       // ISO string (event updated time)
}

// ─── Serialised appointment (for client components) ───────────────────────
// Same as Appointment but date fields are guaranteed strings

export type AppointmentSerialized = Appointment
