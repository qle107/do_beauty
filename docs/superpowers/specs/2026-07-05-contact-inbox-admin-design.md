# Contact Inbox in Admin — Design

**Date:** 2026-07-05
**Status:** Approved (design)

## Problem

Contact-form submissions are emailed straight to Gmail via Nodemailer and are
**not stored anywhere**. The admin "Messages" page is a placeholder that tells
the owner to check Gmail. There is no way to see past messages or reply from
inside the admin.

## Goal

Turn the admin "Messages" page into a real inbox: store every future contact
submission, list it, read it, and reply to the customer by email — all from the
admin.

## Non-goals / constraints

- **Past messages are not recoverable.** Submissions before this ships were never
  stored, so only new submissions appear. The owner can still reply to old ones
  from Gmail.
- Keep the email notification to Gmail (backup channel).
- Retention: keep all messages until manually deleted. No auto-purge.
- Reply body is plain text. No rich formatting, no saved templates.
- Follow existing house patterns (`lib/devices.ts` store, admin auth guard,
  admin page styling). Simplicity first — no speculative features.

## Architecture

### 1. Store — `lib/contacts.ts`

Mirrors `lib/devices.ts`: **MySQL when `dbConfigured()`, else JSON fallback**
via `lib/json-store.ts` (`contacts.json`, in the redeploy-safe data dir). Adds a
`contacts` table to `ensureSchema()` in `lib/db.ts`.

Record shape:

```ts
interface ContactReply {
  body: string
  sentAt: string   // ISO
}

interface ContactMessage {
  id: string           // crypto.randomUUID()
  name: string
  email: string
  subject: string
  message: string
  status: 'unread' | 'read' | 'replied'
  createdAt: string    // ISO
  clientIp?: string
  replies: ContactReply[]
}
```

Store functions:
- `listContacts(): Promise<ContactMessage[]>` — newest first.
- `getContact(id): Promise<ContactMessage | null>`
- `addContact(data): Promise<void>` — called on public submit; status `unread`.
- `setContactStatus(id, status): Promise<void>`
- `addContactReply(id, body): Promise<void>` — appends reply, sets status `replied`.
- `deleteContact(id): Promise<void>`

DB column mapping: store `replies` as a JSON column (matching how devices stores
arrays). The JSON-fallback path stores the array natively.

### 2. Capture on submit — `app/api/contact/route.ts` (POST)

After `sendContactNotification(...)` succeeds, also call
`addContact({ name, email, subject, message, clientIp })`. Wrap the store call so
a storage failure is logged but does **not** fail the customer's submission (the
email already went out). Order: send email first (existing behavior), then store.

### 3. Admin API — reuse the `/api/contact` namespace

All admin endpoints guard with the existing pattern:
`const session = await auth(); if (!session?.user) return 401`.

- `GET /api/contact` — list stored messages. (Add an auth-guarded GET to the
  existing `route.ts`; POST stays public.)
- `GET /api/contact/[id]` — return one message; side effect: if `unread`, mark
  `read`.
- `PATCH /api/contact/[id]` — body `{ status: 'read' | 'unread' }`; set status.
- `POST /api/contact/[id]/reply` — body `{ body: string }`; validate (min length
  via zod), send via `sendContactReply(...)`, then `addContactReply(id, body)`.
- `DELETE /api/contact/[id]` — delete the message.

These replace the current `410 Gone` stubs in `app/api/contact/[id]/route.ts`.
New file: `app/api/contact/[id]/reply/route.ts`.

### 4. Reply email — `sendContactReply()` in `lib/mail.ts`

```ts
sendContactReply({ to, customerName, subject, body }): Promise<void>
```

Sends from `SMTP_FROM` (`contact@vynails.fr`) to the customer, subject
`Re: <original subject>`, using the existing `baseTemplate(...)`. Body rendered
with `escapeHtml` + `white-space: pre-wrap` (same treatment as the contact
notification message). Customer replies land in Gmail as normal (their address is
the `To`, our address is the `From`).

### 5. Admin UI — rewrite `app/admin/(protected)/messages/page.tsx`

Client component replacing the placeholder. Layout: master-detail.

- **List (left):** each row shows sender name, subject, relative date, and an
  unread dot. Filter tabs: All / Unread / Replied.
- **Detail (right):** full message (sender, email, subject, body, received date),
  the thread of any sent replies, and a **reply box** (textarea + Send button).
- Actions: Send reply (POST reply → toast → refresh, status → replied), toggle
  read/unread, delete (with confirm — avoid native `confirm()` dialog issues;
  use an inline confirm or the app's existing pattern).
- Styling matches existing admin pages: cream/coral/dark palette, serif headers,
  `react-hot-toast` for feedback (already a dependency).

Data fetching: client-side `fetch` to the admin API routes above, consistent
with how other admin pages talk to their APIs.

## Validation

New zod schema for the reply: `{ body: z.string().min(1).max(2000) }` in
`lib/validations.ts` (or inline in the reply route).

## Error handling

- Public submit: store failure logged, submission still succeeds.
- Admin API: unauth → 401; not found → 404; send failure → 500 with a French
  error message surfaced as a toast.
- Reply route sends the email first; only record the reply if send succeeds, so a
  failed send doesn't show as "replied."

## Testing / success criteria

1. `npm run build` passes.
2. Submit the public contact form → the message appears in the admin inbox as
   unread.
3. Open it → status flips to read.
4. Write a reply and send → the customer's address receives a `Re:` email from
   `contact@vynails.fr`; the message status flips to replied and the reply shows
   in the thread.
5. Delete → the message is gone from the list.
6. Gmail still receives the original notification email (backup unaffected).

## Files touched

- `lib/db.ts` — add `contacts` table to `ensureSchema()`.
- `lib/contacts.ts` — new store.
- `lib/mail.ts` — add `sendContactReply()`.
- `lib/validations.ts` — add reply schema (optional; may inline).
- `app/api/contact/route.ts` — store on POST; add auth-guarded GET.
- `app/api/contact/[id]/route.ts` — replace 410 stubs with GET/PATCH/DELETE.
- `app/api/contact/[id]/reply/route.ts` — new reply endpoint.
- `app/admin/(protected)/messages/page.tsx` — rewrite as inbox UI.
