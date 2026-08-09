import { getPool, ensureSchema, dbConfigured } from '@/lib/db'
import { readJson, writeJson } from '@/lib/json-store'
import { sheetsConfigured, SheetTable } from '@/lib/sheets'
import type { RowDataPacket } from 'mysql2'

const JSON_FILE = 'contacts.json'

// ─── Contact inbox store ───────────────────────────────────────────────────
// Persists contact-form submissions so the admin can list, read, reply to and
// delete them. Mirrors lib/devices.ts: MySQL when configured, JSON fallback
// otherwise (in the redeploy-safe data dir). Replies sent from the admin are
// recorded on the message so the thread is visible.

export type ContactStatus = 'unread' | 'read' | 'replied'

export interface ContactReply {
  body: string
  sentAt: string   // ISO string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: ContactStatus
  clientIp?: string
  replies: ContactReply[]
  createdAt: string   // ISO string
}

export interface NewContactInput {
  name: string
  email: string
  subject: string
  message: string
  clientIp?: string
}

// Google Sheets backend (Messages tab). Active when SHEETS_SPREADSHEET_ID is set.
const sheet = new SheetTable<ContactMessage>('Messages', [
  { header: 'ID', key: 'id' },
  { header: 'Reçu le', key: 'createdAt' },
  { header: 'Nom', key: 'name' },
  { header: 'Email', key: 'email' },
  { header: 'Sujet', key: 'subject' },
  { header: 'Message', key: 'message' },
  { header: 'Statut', key: 'status' },
  { header: 'IP', key: 'clientIp' },
  { header: 'Réponses', key: 'replies', kind: 'json' },
])

// ─── Row mapping / persistence ─────────────────────────────────────────────

interface ContactRow extends RowDataPacket {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: string
  client_ip: string | null
  replies: string | null
  created_at: string
}

function rowToMessage(r: ContactRow): ContactMessage {
  return {
    id:        r.id,
    name:      r.name,
    email:     r.email,
    subject:   r.subject,
    message:   r.message,
    status:    (r.status as ContactStatus) ?? 'unread',
    clientIp:  r.client_ip ?? undefined,
    replies:   r.replies ? (JSON.parse(r.replies) as ContactReply[]) : [],
    createdAt: r.created_at,
  }
}

async function readAll(): Promise<ContactMessage[]> {
  if (sheetsConfigured()) {
    try {
      return (await sheet.readAll()).map((c) => ({ ...c, replies: c.replies ?? [] }))
    } catch (err) {
      console.error('[contacts] Sheets read failed, using next store:', (err as Error)?.message)
    }
  }
  if (dbConfigured()) {
    try {
      await ensureSchema()
      const [rows] = await getPool().query<ContactRow[]>('SELECT * FROM contacts')
      return rows.map(rowToMessage)
    } catch (err) {
      console.error('[contacts] DB read failed, using JSON fallback:',
        (err as NodeJS.ErrnoException)?.code ?? (err as Error)?.message)
    }
  }
  return readJson<ContactMessage[]>(JSON_FILE, []).map((c) => ({ ...c, replies: c.replies ?? [] }))
}

async function upsert(msg: ContactMessage): Promise<void> {
  if (sheetsConfigured()) {
    try {
      const all = await sheet.readAll()
      const idx = all.findIndex((c) => c.id === msg.id)
      if (idx === -1) all.push(msg)
      else all[idx] = msg
      await sheet.writeAll(all)
      return
    } catch (err) {
      console.error('[contacts] Sheets write failed, using next store:', (err as Error)?.message)
    }
  }
  if (dbConfigured()) {
    try {
      await getPool().query(
        `INSERT INTO contacts (id, name, email, subject, message, status, client_ip, replies, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           status  = VALUES(status),
           replies = VALUES(replies)`,
        [msg.id, msg.name, msg.email, msg.subject, msg.message, msg.status,
         msg.clientIp ?? null, JSON.stringify(msg.replies), msg.createdAt]
      )
      return
    } catch (err) {
      console.error('[contacts] DB write failed, using JSON fallback:',
        (err as NodeJS.ErrnoException)?.code ?? (err as Error)?.message)
    }
  }
  const all = readJson<ContactMessage[]>(JSON_FILE, [])
  const idx = all.findIndex((c) => c.id === msg.id)
  if (idx === -1) all.push(msg)
  else all[idx] = msg
  await writeJson(JSON_FILE, all)
}

async function removeById(id: string): Promise<void> {
  if (sheetsConfigured()) {
    try {
      const all = (await sheet.readAll()).filter((c) => c.id !== id)
      await sheet.writeAll(all)
      return
    } catch (err) {
      console.error('[contacts] Sheets delete failed, using next store:', (err as Error)?.message)
    }
  }
  if (dbConfigured()) {
    try {
      await getPool().query('DELETE FROM contacts WHERE id = ?', [id])
      return
    } catch (err) {
      console.error('[contacts] DB delete failed, using JSON fallback:',
        (err as NodeJS.ErrnoException)?.code ?? (err as Error)?.message)
    }
  }
  const all = readJson<ContactMessage[]>(JSON_FILE, []).filter((c) => c.id !== id)
  await writeJson(JSON_FILE, all)
}

// ─── Public API ───────────────────────────────────────────────────────────

/** All messages, newest first. */
export async function listContacts(): Promise<ContactMessage[]> {
  const all = await readAll()
  return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getContact(id: string): Promise<ContactMessage | null> {
  return (await readAll()).find((c) => c.id === id) ?? null
}

export async function addContact(input: NewContactInput): Promise<void> {
  const now = new Date().toISOString()
  await upsert({
    id: crypto.randomUUID(),
    name: input.name,
    email: input.email,
    subject: input.subject,
    message: input.message,
    status: 'unread',
    clientIp: input.clientIp,
    replies: [],
    createdAt: now,
  })
}

export async function setContactStatus(id: string, status: ContactStatus): Promise<boolean> {
  const msg = await getContact(id)
  if (!msg) return false
  msg.status = status
  await upsert(msg)
  return true
}

export async function addContactReply(id: string, body: string): Promise<boolean> {
  const msg = await getContact(id)
  if (!msg) return false
  msg.replies.push({ body, sentAt: new Date().toISOString() })
  msg.status = 'replied'
  await upsert(msg)
  return true
}

export async function deleteContact(id: string): Promise<boolean> {
  const msg = await getContact(id)
  if (!msg) return false
  await removeById(id)
  return true
}
