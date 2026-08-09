# Contact Inbox in Admin — Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Store every contact-form submission and let the admin list, read, reply to (via SMTP), and delete them from the Messages page.

**Architecture:** New `lib/contacts.ts` store follows the existing `lib/devices.ts` pattern (MySQL when `dbConfigured()`, JSON fallback via `lib/json-store.ts`). The public `POST /api/contact` persists after emailing. Auth-guarded admin endpoints under `/api/contact` power a rewritten master-detail Messages UI. Replies are sent from `contact@vynails.fr` via a new `sendContactReply()` in `lib/mail.ts`.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, mysql2, nodemailer, zod, react-hot-toast, Tailwind.

## Global Constraints

- No test framework exists. Verify each task with `npm run lint` and (for the final integration) `npm run build`. Manual functional checks where noted.
- Match existing house style: store pattern from `lib/devices.ts`, API auth guard `const session = await auth(); if (!session?.user) return 401`, admin page conventions (`'use client'`, `useCallback` loader, `toast`, cream/coral/dark Tailwind palette, `confirm()` for destructive actions).
- French UI copy and error messages.
- Money/IDs: `crypto.randomUUID()` for ids; `new Date().toISOString()` for timestamps.
- Storage in prod runs on the JSON fallback (DB creds currently broken) — this is expected and persists in the redeploy-safe data dir.

---

### Task 1: Contacts store (`lib/contacts.ts`) + DB schema

**Files:**
- Modify: `lib/db.ts` — add `contacts` table to `initSchema()`.
- Create: `lib/contacts.ts`

**Interfaces:**
- Produces: `ContactMessage`, `ContactReply` types; `listContacts()`, `getContact(id)`, `addContact(input)`, `setContactStatus(id, status)`, `addContactReply(id, body)`, `deleteContact(id)`.

- [ ] **Step 1: Add the `contacts` table to `initSchema()` in `lib/db.ts`** (after the `devices` CREATE TABLE, before `addColumnIfMissing`):

```sql
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
```

- [ ] **Step 2: Create `lib/contacts.ts`** following the `devices.ts` read/upsert pattern:

```ts
import { getPool, ensureSchema, dbConfigured } from '@/lib/db'
import { readJson, writeJson } from '@/lib/json-store'
import type { RowDataPacket } from 'mysql2'

const JSON_FILE = 'contacts.json'

export type ContactStatus = 'unread' | 'read' | 'replied'

export interface ContactReply {
  body: string
  sentAt: string   // ISO
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
  createdAt: string   // ISO
}

export interface NewContactInput {
  name: string
  email: string
  subject: string
  message: string
  clientIp?: string
}

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
```

- [ ] **Step 3: Verify** — `npm run lint` passes with no new errors.
- [ ] **Step 4: Commit** — `git add lib/db.ts lib/contacts.ts && git commit -m "feat: contacts store + schema"`

---

### Task 2: Reply email sender (`sendContactReply` in `lib/mail.ts`)

**Files:**
- Modify: `lib/mail.ts`

**Interfaces:**
- Produces: `sendContactReply({ to, customerName, subject, body })`.

- [ ] **Step 1: Add the reply template + sender to `lib/mail.ts`** (after `sendContactNotification`):

```ts
// ─── 4. Réponse admin → client ────────────────────────────────────────────

interface ContactReplyData {
  to: string
  customerName: string
  subject: string   // original subject (without the "Re:" prefix)
  body: string
}

function contactReplyHtml(data: ContactReplyData): string {
  return baseTemplate(`
    <h2 style="color:#831843;font-size:26px;font-weight:400;margin:0 0 24px;">
      Bonjour ${escapeHtml(data.customerName)},
    </h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FDF2F8;border-radius:6px;">
      <tr>
        <td style="padding:24px 28px;">
          <p style="color:#831843;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap;">${escapeHtml(data.body)}</p>
        </td>
      </tr>
    </table>
    <p style="color:#A8B0B8;font-size:13px;margin:24px 0 0;">
      Ceci est une réponse à votre message « ${escapeHtml(data.subject)} ».
    </p>
  `)
}

export async function sendContactReply(data: ContactReplyData): Promise<void> {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: data.to,
    subject: `Re: ${data.subject}`,
    html: contactReplyHtml(data),
  })
}
```

- [ ] **Step 2: Verify** — `npm run lint` passes.
- [ ] **Step 3: Commit** — `git add lib/mail.ts && git commit -m "feat: sendContactReply email"`

---

### Task 3: Persist submissions in `POST /api/contact` + auth-guarded list `GET`

**Files:**
- Modify: `app/api/contact/route.ts`

**Interfaces:**
- Consumes: `addContact`, `listContacts` (Task 1).
- Produces: `GET /api/contact` (admin list), storage side effect on `POST`.

- [ ] **Step 1: Add imports** to `app/api/contact/route.ts`:

```ts
import { auth } from '@/lib/auth'
import { addContact, listContacts } from '@/lib/contacts'
```

- [ ] **Step 2: Persist after the email send** — in `POST`, replace the block:

```ts
    await sendContactNotification({ senderName: name, senderEmail: email, subject, message })

    return NextResponse.json({ success: true }, { status: 201 })
```

with:

```ts
    await sendContactNotification({ senderName: name, senderEmail: email, subject, message })

    // Store for the admin inbox. A storage hiccup must not fail the customer's
    // submission — the email already went out — so log and continue.
    try {
      await addContact({ name, email, subject, message, clientIp })
    } catch (err) {
      console.error('[POST /api/contact] store failed', err)
    }

    return NextResponse.json({ success: true }, { status: 201 })
```

- [ ] **Step 3: Add the admin `GET`** at the end of the file:

```ts
// GET /api/contact - admin only: list stored contact messages
export async function GET(): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(await listContacts())
}
```

- [ ] **Step 4: Verify** — `npm run lint` passes.
- [ ] **Step 5: Commit** — `git add app/api/contact/route.ts && git commit -m "feat: store contacts on submit + admin list endpoint"`

---

### Task 4: Detail / status / delete endpoints (`/api/contact/[id]`)

**Files:**
- Modify: `app/api/contact/[id]/route.ts` (replace the 410 stubs).

**Interfaces:**
- Consumes: `getContact`, `setContactStatus`, `deleteContact` (Task 1).
- Produces: `GET`/`PATCH`/`DELETE` `/api/contact/[id]`.

- [ ] **Step 1: Replace the whole file** `app/api/contact/[id]/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getContact, setContactStatus, deleteContact, type ContactStatus } from '@/lib/contacts'

type Ctx = { params: Promise<{ id: string }> }

// GET /api/contact/[id] - admin only. Marks an unread message as read.
export async function GET(_request: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const msg = await getContact(id)
  if (!msg) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (msg.status === 'unread') {
    await setContactStatus(id, 'read')
    msg.status = 'read'
  }
  return NextResponse.json(msg)
}

// PATCH /api/contact/[id] - admin only. Body: { status: 'read' | 'unread' }
export async function PATCH(request: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = (await request.json()) as { status?: string }
  const status = body.status
  if (status !== 'read' && status !== 'unread') {
    return NextResponse.json({ error: 'status must be read or unread' }, { status: 422 })
  }
  const ok = await setContactStatus(id, status as ContactStatus)
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return new NextResponse(null, { status: 204 })
}

// DELETE /api/contact/[id] - admin only.
export async function DELETE(_request: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const ok = await deleteContact(id)
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return new NextResponse(null, { status: 204 })
}
```

- [ ] **Step 2: Verify** — `npm run lint` passes.
- [ ] **Step 3: Commit** — `git add "app/api/contact/[id]/route.ts" && git commit -m "feat: contact detail/status/delete endpoints"`

---

### Task 5: Reply endpoint (`POST /api/contact/[id]/reply`)

**Files:**
- Create: `app/api/contact/[id]/reply/route.ts`

**Interfaces:**
- Consumes: `getContact`, `addContactReply` (Task 1); `sendContactReply` (Task 2).

- [ ] **Step 1: Create `app/api/contact/[id]/reply/route.ts`:**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getContact, addContactReply } from '@/lib/contacts'
import { sendContactReply } from '@/lib/mail'

type Ctx = { params: Promise<{ id: string }> }

// POST /api/contact/[id]/reply - admin only. Body: { body: string }
export async function POST(request: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const payload = (await request.json()) as { body?: string }
  const body = (payload.body ?? '').trim()
  if (body.length < 1 || body.length > 2000) {
    return NextResponse.json({ error: 'Le message doit comporter entre 1 et 2000 caractères.' }, { status: 422 })
  }

  const msg = await getContact(id)
  if (!msg) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Send first; only record the reply if the email actually went out.
  try {
    await sendContactReply({ to: msg.email, customerName: msg.name, subject: msg.subject, body })
  } catch (err) {
    console.error('[POST /api/contact/[id]/reply] send failed', err)
    return NextResponse.json({ error: "L'envoi de l'email a échoué." }, { status: 500 })
  }

  await addContactReply(id, body)
  return new NextResponse(null, { status: 201 })
}
```

- [ ] **Step 2: Verify** — `npm run lint` passes.
- [ ] **Step 3: Commit** — `git add "app/api/contact/[id]/reply/route.ts" && git commit -m "feat: contact reply endpoint"`

---

### Task 6: Rewrite the Messages admin page (master-detail inbox)

**Files:**
- Modify: `app/admin/(protected)/messages/page.tsx` (full rewrite).

**Interfaces:**
- Consumes: `GET /api/contact`, `GET/PATCH/DELETE /api/contact/[id]`, `POST /api/contact/[id]/reply`.

- [ ] **Step 1: Replace the whole file** with a client component. Full contents:

```tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'

type ContactStatus = 'unread' | 'read' | 'replied'
interface ContactReply { body: string; sentAt: string }
interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: ContactStatus
  replies: ContactReply[]
  createdAt: string
}

type Filter = 'all' | 'unread' | 'replied'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading]   = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [filter, setFilter]     = useState<Filter>('all')
  const [replyBody, setReplyBody] = useState('')
  const [sending, setSending]   = useState(false)

  const load = useCallback(async () => {
    try {
      const res  = await fetch('/api/contact')
      if (!res.ok) throw new Error()
      const data = await res.json() as ContactMessage[]
      setMessages(data)
    } catch {
      toast.error('Impossible de charger les messages')
    } finally {
      setLoading(false)
    }
  }, [])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load() }, [load])

  const selected = messages.find((m) => m.id === selectedId) ?? null

  const open = async (msg: ContactMessage) => {
    setSelectedId(msg.id)
    setReplyBody('')
    if (msg.status === 'unread') {
      // Marks read server-side; reflect locally.
      await fetch(`/api/contact/${msg.id}`)
      setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, status: 'read' } : m))
    }
  }

  const sendReply = async () => {
    if (!selected) return
    const body = replyBody.trim()
    if (!body) { toast.error('Écrivez une réponse'); return }
    setSending(true)
    try {
      const res = await fetch(`/api/contact/${selected.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      })
      if (!res.ok) throw new Error()
      toast.success('Réponse envoyée')
      setReplyBody('')
      const sentAt = new Date().toISOString()
      setMessages((prev) => prev.map((m) => m.id === selected.id
        ? { ...m, status: 'replied', replies: [...m.replies, { body, sentAt }] } : m))
    } catch {
      toast.error("L'envoi a échoué")
    } finally {
      setSending(false)
    }
  }

  const remove = async (msg: ContactMessage) => {
    if (!confirm(`Supprimer le message de ${msg.name} ?`)) return
    try {
      const res = await fetch(`/api/contact/${msg.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Message supprimé')
      setMessages((prev) => prev.filter((m) => m.id !== msg.id))
      if (selectedId === msg.id) setSelectedId(null)
    } catch {
      toast.error('Impossible de supprimer')
    }
  }

  const filtered = messages.filter((m) =>
    filter === 'all' ? true : filter === 'unread' ? m.status === 'unread' : m.status === 'replied')
  const unreadCount = messages.filter((m) => m.status === 'unread').length

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-light text-dark">Messages</h1>
        <p className="font-sans text-sm text-dark/40 mt-1">
          Formulaires de contact reçus · répondez directement depuis cette page.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {([['all', 'Tous'], ['unread', `Non lus${unreadCount ? ` (${unreadCount})` : ''}`], ['replied', 'Répondus']] as [Filter, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`text-xs font-sans tracking-wider px-4 py-2 border transition-colors ${
              filter === key ? 'bg-dark text-cream border-dark' : 'border-dark/20 text-dark/60 hover:border-dark'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,380px)_1fr] gap-6">
        {/* List */}
        <div className="bg-cream border border-dark/10">
          {loading ? (
            <div className="p-6 flex flex-col gap-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-dark/5 animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <p className="p-8 text-sm font-sans text-dark/30 italic text-center">Aucun message.</p>
          ) : (
            <ul className="divide-y divide-dark/5 max-h-[70vh] overflow-y-auto">
              {filtered.map((m) => (
                <li key={m.id}>
                  <button
                    onClick={() => void open(m)}
                    className={`w-full text-left p-4 hover:bg-blush/50 transition-colors ${selectedId === m.id ? 'bg-blush/60' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      {m.status === 'unread' && <span className="w-2 h-2 rounded-full bg-coral shrink-0" aria-label="Non lu" />}
                      <span className={`font-sans text-sm truncate ${m.status === 'unread' ? 'text-dark font-medium' : 'text-dark/70'}`}>{m.name}</span>
                      {m.status === 'replied' && <span className="ml-auto text-[10px] uppercase tracking-wider text-green-700 shrink-0">Répondu</span>}
                    </div>
                    <p className="font-sans text-sm text-dark/60 truncate mt-1">{m.subject}</p>
                    <p className="font-sans text-xs text-dark/30 mt-1">{formatDate(m.createdAt)}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Detail */}
        <div className="bg-cream border border-dark/10 p-6 min-h-[400px]">
          {!selected ? (
            <p className="text-sm font-sans text-dark/30 italic h-full flex items-center justify-center">
              Sélectionnez un message pour le lire et y répondre.
            </p>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-light text-dark">{selected.subject}</h2>
                  <p className="font-sans text-sm text-dark/60 mt-1">
                    {selected.name} ·{' '}
                    <a href={`mailto:${selected.email}`} className="text-coral hover:underline">{selected.email}</a>
                  </p>
                  <p className="font-sans text-xs text-dark/30 mt-1">{formatDate(selected.createdAt)}</p>
                </div>
                <button
                  onClick={() => void remove(selected)}
                  className="shrink-0 text-xs font-sans text-dark/40 border border-dark/15 px-3 py-2 hover:border-red-400 hover:text-red-600 transition-colors"
                >
                  Supprimer
                </button>
              </div>

              <div className="bg-cream border border-dark/10 p-4">
                <p className="font-sans text-sm text-dark/80 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              {selected.replies.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h3 className="font-sans text-xs tracking-[0.2em] uppercase text-dark/40">Vos réponses</h3>
                  {selected.replies.map((r, i) => (
                    <div key={i} className="border-l-2 border-coral/40 pl-4">
                      <p className="font-sans text-sm text-dark/70 whitespace-pre-wrap">{r.body}</p>
                      <p className="font-sans text-xs text-dark/30 mt-1">{formatDate(r.sentAt)}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-dark/10 pt-5">
                <label className="font-sans text-xs tracking-[0.2em] uppercase text-dark/40">Répondre</label>
                <textarea
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  rows={5}
                  maxLength={2000}
                  placeholder={`Bonjour ${selected.name},`}
                  className="w-full border border-dark/15 bg-white p-3 font-sans text-sm text-dark focus:border-dark focus:outline-none resize-y"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => void sendReply()}
                    disabled={sending}
                    className="bg-dark text-cream text-sm px-6 py-3 font-sans tracking-wider hover:bg-coral-dark transition-colors disabled:opacity-50"
                  >
                    {sending ? 'Envoi…' : 'Envoyer la réponse'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify** — `npm run lint` then `npm run build` both pass.
- [ ] **Step 3: Commit** — `git add "app/admin/(protected)/messages/page.tsx" && git commit -m "feat: contact inbox admin UI"`

---

### Task 7: Final integration verification

- [ ] **Step 1:** `npm run build` passes clean.
- [ ] **Step 2 (manual, best-effort):** Run `npm run dev`, submit the public `/contact` form, confirm the message appears in `/admin/messages` as unread; open it (dot clears); send a reply (toast success, moves to Répondu); delete it. Note: reply email send requires SMTP env vars; if not set locally, the reply endpoint will 500 — that's expected outside prod.

---

## Self-Review

- **Spec coverage:** store (T1), capture-on-submit (T3), list/detail/status/delete (T3/T4), reply send+record (T2/T5), UI rewrite (T6), retention=manual-delete only (no purge — covered), plain-text reply (T6). All spec sections mapped.
- **Placeholders:** none — every step has full code.
- **Type consistency:** `ContactMessage`/`ContactReply`/`ContactStatus` defined in T1 and reused verbatim in T4/T5; UI redeclares matching shapes locally (client can't import server types that pull in `mysql2`/`fs`) — fields align with the API JSON.
- **Note:** UI mirrors types rather than importing them, deliberately, to keep the client bundle free of server-only imports (`lib/contacts.ts` imports `fs` via json-store).
