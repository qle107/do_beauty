import fs from 'fs'
import path from 'path'
import { getDataDir, getSeedDir } from '@/lib/json-store'
import type { GalleryImage, GalleryStorageKind } from '@/lib/types'

// ─── Gallery image BYTES storage (metadata lives in lib/gallery-store.ts) ────
//
// A clean seam over "where the image file lives" so the admin/public UI never
// cares. Three backends behind one interface:
//   · static → a file already committed under /public (migrated existing photos)
//   · local  → an admin upload saved under the redeploy-safe DATA_DIR
//   · drive  → Google Drive (not wired yet; the stub documents exactly how)
//
// Chosen by getGalleryStorage(): Local today. When Drive credentials are added,
// flip the factory to DriveGalleryStorage - nothing else in the app changes.

const SUBDIR = 'gallery'

const MIME_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}
const EXT_MIME: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp',
}

export interface UploadInput {
  id: string
  buffer: Buffer
  mime: string
}

export interface UploadResult {
  storage: GalleryStorageKind
  fileName?: string
  driveFileId?: string
  src?: string
}

export interface ReadResult {
  buffer: Buffer
  mime: string
}

export interface GalleryStorage {
  /** Persist the bytes for a new image and return how to find them later. */
  upload(input: UploadInput): Promise<UploadResult>
  /** Read the bytes back (used by the same-origin image proxy route). */
  read(img: GalleryImage): Promise<ReadResult | null>
  /** Remove the stored bytes (best-effort; metadata deletion is separate). */
  remove(img: GalleryImage): Promise<void>
  /** The URL the browser should load for this image. */
  publicUrl(img: GalleryImage): string
}

// Reject anything with path separators so an id can never escape the root.
function safeId(id: string): string | null {
  return /^[A-Za-z0-9_-]{1,128}$/.test(id) ? id : null
}

// The public URL is the same regardless of backend: 'static' images are served
// straight from /public; everything else streams through the proxy route. Shared
// so both storages agree.
function resolvePublicUrl(img: GalleryImage): string {
  if (img.storage === 'static' && img.src) return img.src
  return `/api/gallery/image/${img.id}`
}

// ─── Local (DATA_DIR) ────────────────────────────────────────────────────────
// Uploaded bytes go under DATA_DIR/gallery/<id>.<ext>. Migrated 'static' images
// are read directly from /public. Reading also checks the seed dir so images
// survive the same redeploy semantics as the rest of the JSON stores.

class LocalGalleryStorage implements GalleryStorage {
  async upload({ id, buffer, mime }: UploadInput): Promise<UploadResult> {
    const cleanId = safeId(id)
    const ext = MIME_EXT[mime]
    if (!cleanId || !ext) throw new Error('Invalid image id or type')
    const dir = path.join(getDataDir(), SUBDIR)
    await fs.promises.mkdir(dir, { recursive: true, mode: 0o700 })
    const fileName = `${cleanId}.${ext}`
    await fs.promises.writeFile(path.join(dir, fileName), buffer)
    return { storage: 'local', fileName }
  }

  async read(img: GalleryImage): Promise<ReadResult | null> {
    // Static images are served by Next straight from /public - the proxy route
    // shouldn't be asked for them, but support it defensively.
    if (img.storage === 'static' && img.src) {
      try {
        const rel = decodeURIComponent(img.src.replace(/^\//, ''))
        const buffer = await fs.promises.readFile(path.join(process.cwd(), 'public', rel))
        const ext = rel.split('.').pop()?.toLowerCase() ?? ''
        return { buffer, mime: EXT_MIME[ext] ?? 'application/octet-stream' }
      } catch {
        return null
      }
    }
    if (!img.fileName) return null
    if (!/^[A-Za-z0-9_-]+\.(jpg|jpeg|png|webp)$/i.test(img.fileName)) return null
    const ext = img.fileName.split('.').pop()!.toLowerCase()
    for (const base of [getDataDir(), getSeedDir()]) {
      try {
        const buffer = await fs.promises.readFile(path.join(base, SUBDIR, img.fileName))
        return { buffer, mime: EXT_MIME[ext] ?? 'application/octet-stream' }
      } catch {
        /* try the next dir */
      }
    }
    return null
  }

  async remove(img: GalleryImage): Promise<void> {
    // Never delete committed /public files from here.
    if (img.storage === 'static' || !img.fileName) return
    for (const base of [getDataDir(), getSeedDir()]) {
      try {
        await fs.promises.rm(path.join(base, SUBDIR, img.fileName), { force: true })
      } catch (err) {
        console.error('[gallery-storage] local remove failed:',
          (err as NodeJS.ErrnoException)?.code ?? (err as Error)?.message)
      }
    }
  }

  publicUrl(img: GalleryImage): string {
    return resolvePublicUrl(img)
  }
}

// ─── Google Drive (stub - wire later) ────────────────────────────────────────
// To enable: create lib/google-drive.ts reusing the service-account/OAuth2 auth
// pattern from lib/google-calendar.ts (add scope https://www.googleapis.com/auth/
// drive.file, reuse the Hostinger backslash-cleaning), then implement these four
// methods with drive.files.create / .get({alt:'media'}) / .delete, uploading into
// GOOGLE_DRIVE_FOLDER_ID. NOTE: uploads to a *consumer* Google account require
// OAuth2 refresh-token auth (owner's Drive quota); a bare service account has no
// personal quota and fails with storageQuotaExceeded. publicUrl already routes
// drive images through the same-origin proxy, so no next.config remotePatterns
// change is needed. Until then getGalleryStorage() returns LocalGalleryStorage.
class DriveGalleryStorage implements GalleryStorage {
  private notWired(): never {
    throw new Error('DriveGalleryStorage is not configured yet (see lib/gallery-storage.ts)')
  }
  async upload(): Promise<UploadResult> { return this.notWired() }
  async read(): Promise<ReadResult | null> { return this.notWired() }
  async remove(): Promise<void> { return this.notWired() }
  publicUrl(img: GalleryImage): string { return resolvePublicUrl(img) }
}

let cached: GalleryStorage | null = null

// Drive requires a folder id AND credentials; until DriveGalleryStorage is
// implemented we always return Local (uploads land in DATA_DIR). The check is
// kept so flipping to Drive is a one-line change once the stub is filled in.
function driveConfigured(): boolean {
  return false // set to Boolean(process.env.GOOGLE_DRIVE_FOLDER_ID) once wired
}

export function getGalleryStorage(): GalleryStorage {
  if (!cached) cached = driveConfigured() ? new DriveGalleryStorage() : new LocalGalleryStorage()
  return cached
}

export { MIME_EXT, EXT_MIME }
