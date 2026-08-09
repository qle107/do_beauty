import fs from 'fs'
import path from 'path'
import os from 'os'

// ─── Persistent JSON store ──────────────────────────────────────────────────
// Runtime data lives OUTSIDE the git-deployed app folder so a redeploy (which
// replaces domains/<site>/nodejs) can't wipe it. In production it defaults to
// ~/vynails-data in the account home dir; override with DATA_DIR. The committed
// data/ folder is the read-only seed baseline (e.g. services.json).
//
// SAFETY: reads are PURE (never write) so the health-check read path
// (GET /api/services) can never block on disk I/O and wedge the process - a
// synchronous seed-write on that path is exactly what crash-looped the app once
// (see MEMORY: hostinger-deploy-not-instant). Writes are async and only run on
// explicit admin/booking actions, so a slow disk can't stall the event loop.

function resolveDataDir(): string {
  if (process.env.DATA_DIR) return process.env.DATA_DIR
  if (process.env.NODE_ENV === 'production') {
    try {
      const home = os.homedir()
      if (home) return path.join(home, 'vynails-data')
    } catch {
      /* fall through to the in-repo default */
    }
  }
  return path.join(process.cwd(), 'data')
}

const DATA_DIR = resolveDataDir()
const SEED_DIR = path.join(process.cwd(), 'data') // committed read-only baseline

// Exposed so other runtime stores (e.g. appointment-images) persist under the
// same redeploy-safe directory instead of re-deriving the path.
export function getDataDir(): string { return DATA_DIR }
export function getSeedDir(): string { return SEED_DIR }

// Pure read: persistent store first, then the committed seed, then the fallback.
// Never writes.
export function readJson<T>(file: string, fallback: T): T {
  for (const dir of [DATA_DIR, SEED_DIR]) {
    try {
      return JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8')) as T
    } catch {
      /* try the next source */
    }
  }
  return fallback
}

// Write to a temp file then rename (atomic on the same filesystem) so a crash or
// interleave mid-write can never leave a truncated / invalid JSON file - which
// readJson would silently treat as "empty", zeroing out the store.
async function atomicWrite(dir: string, file: string, content: string): Promise<void> {
  await fs.promises.mkdir(dir, { recursive: true, mode: 0o700 })
  const target = path.join(dir, file)
  const tmp = `${target}.${process.pid}.tmp`
  await fs.promises.writeFile(tmp, content, 'utf-8')
  await fs.promises.rename(tmp, target)
}

// Serialise writes per file: each store does read-all -> mutate -> write-all, so
// two concurrent writers to the same file (e.g. two consent-banner clicks) would
// otherwise interleave and lose an update. Chaining keeps them sequential.
const writeChains = new Map<string, Promise<void>>()

// Async write to the persistent dir; if that dir isn't writable, fall back to
// the in-repo dir so a booking/admin action never fails on a storage hiccup
// (it just won't survive the next redeploy). Only called off the hot path.
export async function writeJson(file: string, data: unknown): Promise<void> {
  const content = JSON.stringify(data, null, 2)
  const prev = writeChains.get(file) ?? Promise.resolve()
  const next = prev.catch(() => {}).then(async () => {
    try {
      await atomicWrite(DATA_DIR, file, content)
    } catch (err) {
      console.error('[json-store] persistent write failed, using in-repo dir:',
        (err as NodeJS.ErrnoException)?.code ?? (err as Error)?.message)
      await atomicWrite(SEED_DIR, file, content)
    }
  })
  writeChains.set(file, next)
  void next.finally(() => { if (writeChains.get(file) === next) writeChains.delete(file) })
  return next
}
