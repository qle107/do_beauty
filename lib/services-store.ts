import { getPool, ensureSchema, dbConfigured } from '@/lib/db'
import { readJson, writeJson } from '@/lib/json-store'
import { sheetsConfigured, SheetTable } from '@/lib/sheets'
import type { Service, ServiceCategory } from '@/lib/types'
import type { RowDataPacket, ResultSetHeader } from 'mysql2'

const JSON_FILE = 'services.json'

// Google Sheets backend (Prestations tab). Active when SHEETS_SPREADSHEET_ID is set.
const sheet = new SheetTable<Service>('Prestations', [
  { header: 'ID', key: 'id' },
  { header: 'Nom', key: 'name' },
  { header: 'Description', key: 'description' },
  { header: 'Prix (€)', key: 'price', kind: 'number' },
  { header: 'Durée (min)', key: 'duration', kind: 'number' },
  { header: 'Catégorie', key: 'category' },
  { header: 'Actif', key: 'isActive', kind: 'boolean' },
  { header: 'Mise en avant', key: 'featured', kind: 'boolean' },
  { header: 'Créé le', key: 'createdAt' },
  { header: 'Modifié le', key: 'updatedAt' },
], 60_000)

// ─── Row mapping ───────────────────────────────────────────────────────────

interface ServiceRow extends RowDataPacket {
  id: string
  name: string
  description: string
  price: string | number      // DECIMAL comes back as a string from mysql2
  duration: number
  category: string
  is_active: number
  featured: number
  created_at: string
  updated_at: string
}

function rowToService(r: ServiceRow): Service {
  return {
    id:          r.id,
    name:        r.name,
    description: r.description,
    price:       Number(r.price),
    duration:    r.duration,
    category:    r.category as ServiceCategory,
    isActive:    !!r.is_active,
    featured:    !!r.featured,
    createdAt:   r.created_at,
    updatedAt:   r.updated_at,
  }
}

async function selectRows(sql: string, params?: unknown[]): Promise<ServiceRow[]> {
  await ensureSchema()
  const [rows] = await getPool().query<ServiceRow[]>(sql, params)
  return rows
}

// ─── Public API ───────────────────────────────────────────────────────────

// Read every service, from MySQL when it's configured AND reachable, otherwise
// from the committed data/services.json. Falling back on a *failed* query (not
// just missing config) means a broken DB - wrong credentials, host down - can
// never take the public catalogue offline. Ordered by created_at either way.
async function readAllServices(): Promise<Service[]> {
  if (sheetsConfigured()) {
    try {
      let rows = await sheet.readAll()
      if (rows.length === 0) {
        const seed = readJson<Service[]>(JSON_FILE, [])
        if (seed.length) { await sheet.writeAll(seed); rows = seed }
      }
      return rows.slice().sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    } catch (err) { console.error('[services-store] Sheets read failed, using next store:', (err as Error)?.message) }
  }
  if (dbConfigured()) {
    try {
      const rows = await selectRows('SELECT * FROM services ORDER BY created_at')
      return rows.map(rowToService)
    } catch (err) {
      console.error('[services-store] DB read failed, using JSON fallback:',
        (err as NodeJS.ErrnoException)?.code ?? (err as Error)?.message)
    }
  }
  return readJson<Service[]>(JSON_FILE, [])
    .slice()
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

export async function getAllServices(category?: ServiceCategory): Promise<Service[]> {
  const all = await readAllServices()
  return all.filter((s) => s.isActive && (!category || s.category === category))
}

export async function getAllServicesAdmin(): Promise<Service[]> {
  return readAllServices()
}

export async function getServiceById(id: string): Promise<Service | undefined> {
  return (await readAllServices()).find((s) => s.id === id)
}

export async function createService(
  data: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Service> {
  const now = new Date().toISOString()
  const svc: Service = { ...data, id: `svc_${crypto.randomUUID()}`, createdAt: now, updatedAt: now }
  if (sheetsConfigured()) {
    try { const all = await sheet.readAll(); all.push(svc); await sheet.writeAll(all); return svc }
    catch (err) { console.error('[services-store] Sheets create failed, using next store:', (err as Error)?.message) }
  }
  if (!dbConfigured()) {
    const all = readJson<Service[]>(JSON_FILE, [])
    all.push(svc)
    await writeJson(JSON_FILE, all)
    return svc
  }
  await ensureSchema()
  await getPool().query(
    `INSERT INTO services
       (id, name, description, price, duration, category, is_active, featured, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [svc.id, svc.name, svc.description, svc.price, svc.duration, svc.category,
     svc.isActive ? 1 : 0, svc.featured ? 1 : 0, svc.createdAt, svc.updatedAt]
  )
  return svc
}

export async function updateService(
  id: string,
  data: Partial<Omit<Service, 'id' | 'createdAt'>>
): Promise<Service | null> {
  const existing = await getServiceById(id)
  if (!existing) return null
  const updated: Service = { ...existing, ...data, updatedAt: new Date().toISOString() }
  if (sheetsConfigured()) {
    try { const all = await sheet.readAll(); const idx = all.findIndex((s) => s.id === id); if (idx === -1) return null; all[idx] = updated; await sheet.writeAll(all); return updated }
    catch (err) { console.error('[services-store] Sheets update failed, using next store:', (err as Error)?.message) }
  }
  if (!dbConfigured()) {
    const all = readJson<Service[]>(JSON_FILE, [])
    const idx = all.findIndex((s) => s.id === id)
    if (idx === -1) return null
    all[idx] = updated
    await writeJson(JSON_FILE, all)
    return updated
  }
  await getPool().query(
    `UPDATE services
        SET name = ?, description = ?, price = ?, duration = ?, category = ?,
            is_active = ?, featured = ?, updated_at = ?
      WHERE id = ?`,
    [updated.name, updated.description, updated.price, updated.duration, updated.category,
     updated.isActive ? 1 : 0, updated.featured ? 1 : 0, updated.updatedAt, id]
  )
  return updated
}

export async function deleteService(id: string): Promise<boolean> {
  if (sheetsConfigured()) {
    try { const all = await sheet.readAll(); const filtered = all.filter((s) => s.id !== id); if (filtered.length === all.length) return false; await sheet.writeAll(filtered); return true }
    catch (err) { console.error('[services-store] Sheets delete failed, using next store:', (err as Error)?.message) }
  }
  if (!dbConfigured()) {
    const all = readJson<Service[]>(JSON_FILE, [])
    const filtered = all.filter((s) => s.id !== id)
    if (filtered.length === all.length) return false
    await writeJson(JSON_FILE, filtered)
    return true
  }
  await ensureSchema()
  const [res] = await getPool().query<ResultSetHeader>('DELETE FROM services WHERE id = ?', [id])
  return res.affectedRows > 0
}

export async function countActiveServices(): Promise<number> {
  return (await readAllServices()).filter((s) => s.isActive).length
}
