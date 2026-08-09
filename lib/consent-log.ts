import { getPool, ensureSchema, dbConfigured } from '@/lib/db'
import { readJson, writeJson } from '@/lib/json-store'
import { sheetsConfigured, SheetTable } from '@/lib/sheets'
import type { RowDataPacket } from 'mysql2'

const JSON_FILE = 'consent-log.json'

// ─── Consent proof log ─────────────────────────────────────────────────────
// RGPD art. 7-1 requires the site to be able to DEMONSTRATE that a visitor
// consented to non-essential trackers (Google Analytics). Each accept/refuse
// choice from the cookie banner is appended here with an anonymised IP and the
// user-agent, so there is a datable record if the CNIL ever asks. Mirrors the
// other stores: MySQL when configured, JSON fallback otherwise.

export type ConsentChoice = 'granted' | 'denied'

export interface ConsentLog {
  id: string
  choice: ConsentChoice
  ip: string          // anonymised (last octet / suffix dropped)
  userAgent: string
  createdAt: string   // ISO string
}

interface ConsentRow extends RowDataPacket {
  id: string
  choice: string
  ip: string | null
  user_agent: string | null
  created_at: string
}

/**
 * Drop the identifying part of an IP so the proof log can't single anyone out:
 * last octet for IPv4, everything after the 4th group for IPv6.
 */
export function anonymiseIp(ip: string): string {
  if (!ip) return ''
  if (ip.includes('.')) return ip.replace(/\.\d+$/, '.0')
  if (ip.includes(':')) return ip.split(':').slice(0, 4).join(':') + '::'
  return ip
}

// Google Sheets backend (Consentements tab). Active when SHEETS_SPREADSHEET_ID is set.
const sheet = new SheetTable<ConsentLog>('Consentements', [
  { header: 'ID', key: 'id' },
  { header: 'Choix', key: 'choice' },
  { header: 'IP (anonymisée)', key: 'ip' },
  { header: 'User-Agent', key: 'userAgent' },
  { header: 'Date', key: 'createdAt' },
])

export async function logConsent(input: {
  choice: ConsentChoice
  ip: string
  userAgent: string
}): Promise<void> {
  const record: ConsentLog = {
    id: crypto.randomUUID(),
    choice: input.choice,
    ip: anonymiseIp(input.ip),
    userAgent: input.userAgent.slice(0, 512),
    createdAt: new Date().toISOString(),
  }

  if (sheetsConfigured()) {
    try { await sheet.append(record); return }
    catch (err) { console.error('[consent-log] Sheets write failed, using next store:', (err as Error)?.message) }
  }
  if (dbConfigured()) {
    try {
      await ensureSchema()
      await getPool().query(
        `INSERT INTO consent_logs (id, choice, ip, user_agent, created_at)
         VALUES (?, ?, ?, ?, ?)`,
        [record.id, record.choice, record.ip, record.userAgent, record.createdAt]
      )
      return
    } catch (err) {
      console.error('[consent-log] DB write failed, using JSON fallback:',
        (err as NodeJS.ErrnoException)?.code ?? (err as Error)?.message)
    }
  }
  const all = readJson<ConsentLog[]>(JSON_FILE, [])
  all.push(record)
  // Cap the JSON fallback so the proof log can't grow unbounded (rewritten in
  // full on every append). Keep the most recent entries; the DB path, when
  // configured, is an append-only INSERT and isn't capped here.
  const MAX_ENTRIES = 5000
  await writeJson(JSON_FILE, all.length > MAX_ENTRIES ? all.slice(-MAX_ENTRIES) : all)
}

/** All consent records, newest first (for admin / CNIL retrieval). */
export async function listConsentLogs(): Promise<ConsentLog[]> {
  if (sheetsConfigured()) {
    try { return (await sheet.readAll()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) }
    catch (err) { console.error('[consent-log] Sheets read failed, using next store:', (err as Error)?.message) }
  }
  if (dbConfigured()) {
    try {
      await ensureSchema()
      const [rows] = await getPool().query<ConsentRow[]>('SELECT * FROM consent_logs')
      return rows
        .map((r) => ({
          id: r.id,
          choice: (r.choice as ConsentChoice) ?? 'denied',
          ip: r.ip ?? '',
          userAgent: r.user_agent ?? '',
          createdAt: r.created_at,
        }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } catch (err) {
      console.error('[consent-log] DB read failed, using JSON fallback:',
        (err as NodeJS.ErrnoException)?.code ?? (err as Error)?.message)
    }
  }
  return readJson<ConsentLog[]>(JSON_FILE, [])
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}
