import mysql from 'mysql2/promise'
import fs from 'fs'
import path from 'path'
import type { Service, GalleryImage } from '@/lib/types'

// ─── MySQL connection pool ─────────────────────────────────────────────────
// Config comes from discrete MYSQL_* env vars (what Hostinger's panel gives you)
// or a single DATABASE_URL. The pool is created lazily so importing this module
// never opens a connection at build time.

let pool: mysql.Pool | null = null

// True when MySQL connection details are present. When false, the stores fall
// back to JSON files (lib/json-store.ts) so the site stays up without a DB.
export function dbConfigured(): boolean {
  if (process.env.DATABASE_URL) return true
  return Boolean(process.env.MYSQL_HOST && process.env.MYSQL_USER && process.env.MYSQL_DATABASE)
}

export function getPool(): mysql.Pool {
  if (pool) return pool

  pool = createPool()

  // A pooled connection can emit 'error' asynchronously (the DB drops an idle
  // connection, auth fails, etc). Without a listener Node treats an EventEmitter
  // 'error' as uncaught and crashes the WHOLE process - which would take down
  // even the static pages over a mere DB hiccup. Swallow it here; the individual
  // query still rejects and is handled by its caller's try/catch.
  ;(pool as unknown as { on(event: 'error', listener: (err: NodeJS.ErrnoException) => void): void })
    .on('error', (err) => {
      console.error('[db] pool error (ignored):', err.code ?? err.message)
    })

  return pool
}

function createPool(): mysql.Pool {
  if (process.env.DATABASE_URL) {
    return mysql.createPool(process.env.DATABASE_URL)
  }

  const host = process.env.MYSQL_HOST
  const user = process.env.MYSQL_USER
  const database = process.env.MYSQL_DATABASE
  if (!host || !user || !database) {
    throw new Error('Database not configured: set DATABASE_URL or MYSQL_HOST/MYSQL_USER/MYSQL_PASSWORD/MYSQL_DATABASE')
  }

  return mysql.createPool({
    host,
    port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
    user,
    password: process.env.MYSQL_PASSWORD ?? '',
    database,
    connectionLimit: 5,
    charset: 'utf8mb4',
  })
}

// ─── Schema bootstrap ──────────────────────────────────────────────────────
// Runs once per process (memoised). Creates the tables if they don't exist and
// seeds the services catalogue from data/services.json the first time, so a
// fresh database comes up populated without a manual migration step.

let schemaReady: Promise<void> | null = null

export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = initSchema().catch((err) => {
      // Reset so a transient failure (e.g. DB briefly unreachable) can retry.
      schemaReady = null
      throw err
    })
  }
  return schemaReady
}

async function initSchema(): Promise<void> {
  const db = getPool()

  await db.query(`
    CREATE TABLE IF NOT EXISTS services (
      id          VARCHAR(64)  PRIMARY KEY,
      name        VARCHAR(255) NOT NULL,
      description TEXT         NOT NULL,
      price       DECIMAL(8,2) NOT NULL,
      duration    INT          NOT NULL,
      category    VARCHAR(32)  NOT NULL,
      is_active   TINYINT(1)   NOT NULL DEFAULT 1,
      featured    TINYINT(1)   NOT NULL DEFAULT 0,
      created_at  VARCHAR(32)  NOT NULL,
      updated_at  VARCHAR(32)  NOT NULL
    ) CHARACTER SET utf8mb4
  `)

  await db.query(`
    CREATE TABLE IF NOT EXISTS blocklist (
      phone         VARCHAR(32)  PRIMARY KEY,
      client_name   VARCHAR(255) NOT NULL DEFAULT '',
      no_show_count INT          NOT NULL DEFAULT 0,
      blocked       TINYINT(1)   NOT NULL DEFAULT 0,
      blocked_at    VARCHAR(32)  NULL,
      reason        VARCHAR(255) NULL,
      ips           TEXT         NULL,
      updated_at    VARCHAR(32)  NOT NULL
    ) CHARACTER SET utf8mb4
  `)

  await db.query(`
    CREATE TABLE IF NOT EXISTS devices (
      device_id     VARCHAR(64)  PRIMARY KEY,
      phones        TEXT         NULL,
      fingerprints  TEXT         NULL,
      client_name   VARCHAR(255) NOT NULL DEFAULT '',
      booking_count INT          NOT NULL DEFAULT 0,
      no_show_count INT          NOT NULL DEFAULT 0,
      blocked       TINYINT(1)   NOT NULL DEFAULT 0,
      blocked_at    VARCHAR(32)  NULL,
      reason        VARCHAR(255) NULL,
      first_seen    VARCHAR(32)  NOT NULL,
      updated_at    VARCHAR(32)  NOT NULL
    ) CHARACTER SET utf8mb4
  `)

  await db.query(`
    CREATE TABLE IF NOT EXISTS contacts (
      id         VARCHAR(64)  PRIMARY KEY,
      name       VARCHAR(255) NOT NULL,
      email      VARCHAR(255) NOT NULL,
      subject    VARCHAR(255) NOT NULL,
      message    TEXT         NOT NULL,
      status     VARCHAR(16)  NOT NULL DEFAULT 'unread',
      client_ip  VARCHAR(64)  NULL,
      replies    TEXT         NULL,
      created_at VARCHAR(32)  NOT NULL
    ) CHARACTER SET utf8mb4
  `)

  await db.query(`
    CREATE TABLE IF NOT EXISTS consent_logs (
      id         VARCHAR(64)  PRIMARY KEY,
      choice     VARCHAR(16)  NOT NULL,
      ip         VARCHAR(64)  NULL,
      user_agent VARCHAR(512) NULL,
      created_at VARCHAR(32)  NOT NULL
    ) CHARACTER SET utf8mb4
  `)

  await db.query(`
    CREATE TABLE IF NOT EXISTS gallery (
      id            VARCHAR(64)  PRIMARY KEY,
      title         VARCHAR(255) NOT NULL DEFAULT '',
      alt           VARCHAR(255) NOT NULL,
      category      VARCHAR(16)  NOT NULL,
      tags          TEXT         NULL,
      published     TINYINT(1)   NOT NULL DEFAULT 1,
      featured      TINYINT(1)   NOT NULL DEFAULT 0,
      storage       VARCHAR(16)  NOT NULL,
      src           VARCHAR(512) NULL,
      file_name     VARCHAR(255) NULL,
      drive_file_id VARCHAR(255) NULL,
      width         INT          NULL,
      height        INT          NULL,
      catalog_status     VARCHAR(16)  NULL,
      suggested_category VARCHAR(16)  NULL,
      suggested_tags     TEXT         NULL,
      uploaded_at   VARCHAR(32)  NOT NULL,
      created_at    VARCHAR(32)  NOT NULL,
      updated_at    VARCHAR(32)  NOT NULL
    ) CHARACTER SET utf8mb4
  `)

  // Columns added after the tables were first created. Idempotent: ignore the
  // "duplicate column" error on databases that already have them.
  await addColumnIfMissing(db, 'devices', 'fingerprints', 'TEXT NULL')
  await addColumnIfMissing(db, 'gallery', 'featured', 'TINYINT(1) NOT NULL DEFAULT 0')
  await addColumnIfMissing(db, 'gallery', 'catalog_status', 'VARCHAR(16) NULL')
  await addColumnIfMissing(db, 'gallery', 'suggested_category', 'VARCHAR(16) NULL')
  await addColumnIfMissing(db, 'gallery', 'suggested_tags', 'TEXT NULL')

  await seedServices(db)
  await seedGallery(db)
}

async function addColumnIfMissing(
  db: mysql.Pool, table: string, column: string, definition: string
): Promise<void> {
  try {
    await db.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`)
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code
    if (code !== 'ER_DUP_FIELDNAME') {
      console.error(`[db] ALTER ${table} ADD ${column} failed:`, code ?? (err as Error)?.message)
    }
  }
}

async function seedServices(db: mysql.Pool): Promise<void> {
  const [rows] = await db.query<mysql.RowDataPacket[]>('SELECT COUNT(*) AS n FROM services')
  if (Number(rows[0]?.n ?? 0) > 0) return

  let seed: Service[] = []
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'data', 'services.json'), 'utf-8')
    seed = JSON.parse(raw) as Service[]
  } catch {
    return // no seed file - start with an empty catalogue
  }
  if (seed.length === 0) return

  const values = seed.map((s) => [
    s.id, s.name, s.description, s.price, s.duration, s.category,
    s.isActive ? 1 : 0, s.featured ? 1 : 0, s.createdAt, s.updatedAt,
  ])
  await db.query(
    `INSERT IGNORE INTO services
       (id, name, description, price, duration, category, is_active, featured, created_at, updated_at)
     VALUES ?`,
    [values]
  )
}

async function seedGallery(db: mysql.Pool): Promise<void> {
  const [rows] = await db.query<mysql.RowDataPacket[]>('SELECT COUNT(*) AS n FROM gallery')
  if (Number(rows[0]?.n ?? 0) > 0) return

  let seed: GalleryImage[] = []
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'data', 'gallery.json'), 'utf-8')
    seed = JSON.parse(raw) as GalleryImage[]
  } catch {
    return // no seed file - start with an empty gallery
  }
  if (seed.length === 0) return

  const values = seed.map((g) => [
    g.id, g.title, g.alt, g.category, JSON.stringify(g.tags ?? []),
    g.published ? 1 : 0, g.storage, g.src ?? null, g.fileName ?? null,
    g.driveFileId ?? null, g.width ?? null, g.height ?? null,
    g.uploadedAt, g.createdAt, g.updatedAt,
  ])
  await db.query(
    `INSERT IGNORE INTO gallery
       (id, title, alt, category, tags, published, storage, src, file_name,
        drive_file_id, width, height, uploaded_at, created_at, updated_at)
     VALUES ?`,
    [values]
  )
}
