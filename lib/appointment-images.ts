import fs from 'fs'
import path from 'path'
import { getDataDir, getSeedDir } from '@/lib/json-store'

// ─── Customer reference photos for a booking ────────────────────────────────
// Photos a customer attaches at booking time are stored under the redeploy-safe
// data dir, keyed by the Google Calendar event id (the appointment's id). They
// are the salon owner's convenience copy (the durable copy is the alert email
// attachment) and are removed when the appointment reaches a terminal state.

const SUBDIR = 'appointment-images'

const MIME_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png':  'png',
  'image/webp': 'webp',
}
const EXT_MIME: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp',
}

const MAX_IMAGES     = 3
const MAX_BYTES      = 5 * 1024 * 1024   // 5 MB per image after decode
// Drop reference-photo folders 30 days after upload. The booking-alert email is
// the durable copy the salon works from, so trimming our server copies quickly
// honors the privacy policy ("supprimées dans un délai de 30 jours") without
// affecting the appointment.
const PRUNE_AFTER_MS = 30 * 864e5

export interface DecodedImage {
  buffer: Buffer
  mime: string
  ext: string
}

export interface StoredImage {
  name: string
}

// The id is a Google Calendar event id (URL-safe base32-ish). Reject anything
// with path separators or other junk so it can never escape the images root.
function safeId(eventId: string): string | null {
  return /^[A-Za-z0-9_-]{1,256}$/.test(eventId) ? eventId : null
}

// Both the persistent dir and the in-repo fallback dir for a given appointment.
function dirsFor(eventId: string): string[] {
  const id = safeId(eventId)
  if (!id) return []
  return [getDataDir(), getSeedDir()].map((d) => path.join(d, SUBDIR, id))
}

// Parse and validate a single `data:` URL. Returns null when the payload is not
// an allowed image type or exceeds the per-image size cap.
export function decodeDataUrl(dataUrl: string): DecodedImage | null {
  const m = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl)
  if (!m) return null
  const mime   = m[1]
  const buffer = Buffer.from(m[2], 'base64')
  if (buffer.length === 0 || buffer.length > MAX_BYTES) return null
  return { buffer, mime, ext: MIME_EXT[mime] }
}

// Decode up to MAX_IMAGES data URLs; invalid entries are silently dropped so one
// bad image never fails the whole booking.
export function decodeImages(dataUrls: string[] | undefined): DecodedImage[] {
  if (!dataUrls?.length) return []
  const out: DecodedImage[] = []
  for (const url of dataUrls.slice(0, MAX_IMAGES)) {
    const img = decodeDataUrl(url)
    if (img) out.push(img)
  }
  return out
}

// Persist decoded images as 1.<ext>, 2.<ext>… under the appointment's folder.
// Best-effort: a disk hiccup logs and returns (the email keeps the durable copy).
export async function saveImages(eventId: string, images: DecodedImage[]): Promise<void> {
  const id = safeId(eventId)
  if (!id || images.length === 0) return
  void pruneOld()   // background housekeeping; never blocks the save
  const base = path.join(getDataDir(), SUBDIR, id)
  try {
    await fs.promises.mkdir(base, { recursive: true, mode: 0o700 })
    await Promise.all(images.map((img, i) =>
      fs.promises.writeFile(path.join(base, `${i + 1}.${img.ext}`), img.buffer)))
  } catch (err) {
    console.error('[appointment-images] save failed:',
      (err as NodeJS.ErrnoException)?.code ?? (err as Error)?.message)
  }
}

// Filenames of the images stored for an appointment (sorted, both dirs).
export async function listImages(eventId: string): Promise<StoredImage[]> {
  for (const dir of dirsFor(eventId)) {
    try {
      const names = (await fs.promises.readdir(dir))
        .filter((n) => EXT_MIME[n.split('.').pop()?.toLowerCase() ?? ''])
        .sort()
      if (names.length) return names.map((name) => ({ name }))
    } catch { /* try next dir */ }
  }
  return []
}

// Read one image by filename. The name is validated to block path traversal.
export async function readImage(
  eventId: string,
  name: string,
): Promise<{ buffer: Buffer; mime: string } | null> {
  if (!/^\d+\.(jpg|jpeg|png|webp)$/i.test(name)) return null
  const ext = name.split('.').pop()!.toLowerCase()
  for (const dir of dirsFor(eventId)) {
    try {
      const buffer = await fs.promises.readFile(path.join(dir, name))
      return { buffer, mime: EXT_MIME[ext] }
    } catch { /* try next dir */ }
  }
  return null
}

// Remove every image for an appointment (called once it reaches a terminal state).
export async function deleteImages(eventId: string): Promise<void> {
  for (const dir of dirsFor(eventId)) {
    try {
      await fs.promises.rm(dir, { recursive: true, force: true })
    } catch (err) {
      console.error('[appointment-images] delete failed:',
        (err as NodeJS.ErrnoException)?.code ?? (err as Error)?.message)
    }
  }
}

// The set of appointment ids that currently have an image folder. Lets the admin
// listing avoid a per-appointment directory probe — read the root once instead.
export async function existingImageDirs(): Promise<Set<string>> {
  const set = new Set<string>()
  for (const root of [getDataDir(), getSeedDir()].map((d) => path.join(d, SUBDIR))) {
    try { for (const n of await fs.promises.readdir(root)) set.add(n) } catch { /* none yet */ }
  }
  return set
}

// Safety net for appointments that were never marked done: drop image folders
// whose last write is older than 30 days. Runs opportunistically off saveImages.
async function pruneOld(): Promise<void> {
  const root   = path.join(getDataDir(), SUBDIR)
  const cutoff = Date.now() - PRUNE_AFTER_MS
  try {
    const entries = await fs.promises.readdir(root)
    await Promise.all(entries.map(async (name) => {
      const p = path.join(root, name)
      try {
        const st = await fs.promises.stat(p)
        if (st.isDirectory() && st.mtimeMs < cutoff) {
          await fs.promises.rm(p, { recursive: true, force: true })
        }
      } catch { /* ignore */ }
    }))
  } catch { /* root doesn't exist yet */ }
}
