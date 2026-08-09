import { google } from 'googleapis'

/**
 * Google Sheets as a durable, owner-visible data store — a third backend behind
 * the app's stores (alongside MySQL and the JSON fallback). Chosen because it's
 * free, survives Hostinger redeploys, and the owner can read/edit rows directly.
 *
 * Enabled only when GOOGLE_SERVICE_ACCOUNT_KEY (reused from the Calendar setup)
 * AND SHEETS_SPREADSHEET_ID are set, and the spreadsheet is shared (Editor) with
 * the service-account email. Otherwise stores keep their existing MySQL/JSON
 * behaviour, so this is fully non-breaking until configured.
 *
 * NOTE: Sheets holds DATA only — image bytes stay as files (gallery storage);
 * the Galerie tab carries metadata + a link. Volume at a salon is tiny, so the
 * whole-tab read/write model below is more than fast enough (with the caches the
 * public-read stores add on top).
 */

export function sheetsConfigured(): boolean {
  return !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY && !!process.env.SHEETS_SPREADSHEET_ID
}

// Parse the service-account JSON, undoing Hostinger's env-injection mangling
// (stray backslashes + escaped newlines) exactly like lib/google-calendar.ts.
function credentials(): object {
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  if (!keyJson) throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY is not set')
  const cleaned = keyJson.trim().replace(/\\(?!["\\/bfnrtu])/g, '')
  const creds = JSON.parse(cleaned) as Record<string, unknown>
  if (typeof creds.private_key === 'string') {
    creds.private_key = creds.private_key.replace(/\\n/g, '\n')
  }
  return creds as object
}

function spreadsheetId(): string {
  const id = process.env.SHEETS_SPREADSHEET_ID
  if (!id) throw new Error('SHEETS_SPREADSHEET_ID is not set')
  return id
}

// A1 notation REQUIRES single-quoting a sheet name that contains spaces or special
// characters (e.g. the hyphen in "Rendez-vous"); internal quotes are doubled.
// Unquoted, the Sheets API rejects the range with 400 "Unable to parse range".
function a1(tab: string, cells: string): string {
  return `'${tab.replace(/'/g, "''")}'!${cells}`
}

let _client: ReturnType<typeof google.sheets> | null = null
function client() {
  if (_client) return _client
  const auth = new google.auth.GoogleAuth({
    credentials: credentials(),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  // 5s ceiling so a slow/hung Sheets fails fast and the store falls back to
  // MySQL/JSON instead of stalling the request (the booking path awaits stores).
  _client = google.sheets({ version: 'v4', auth, timeout: 5_000 })
  return _client
}

// Cache which tabs we've confirmed exist, so we don't call spreadsheets.get on
// every read/write.
const knownTabs = new Set<string>()
// Tabs this process CREATED (didn't exist before). Consumed once by a store so it
// can seed a brand-new tab from JSON WITHOUT re-seeding a tab the owner emptied.
const freshlyCreatedTabs = new Set<string>()

async function ensureTab(tab: string, headers: string[]): Promise<void> {
  if (knownTabs.has(tab)) return
  const meta = await client().spreadsheets.get({
    spreadsheetId: spreadsheetId(),
    fields: 'sheets.properties.title',
  })
  const titles = (meta.data.sheets ?? []).map((s) => s.properties?.title)
  if (!titles.includes(tab)) {
    await client().spreadsheets.batchUpdate({
      spreadsheetId: spreadsheetId(),
      requestBody: { requests: [{ addSheet: { properties: { title: tab } } }] },
    })
    await client().spreadsheets.values.update({
      spreadsheetId: spreadsheetId(),
      range: a1(tab, 'A1'),
      valueInputOption: 'RAW',
      requestBody: { values: [headers] },
    })
    freshlyCreatedTabs.add(tab)
  }
  knownTabs.add(tab)
}

// ─── Column mapping ─────────────────────────────────────────────────────────
// Each store declares how its object maps to a row. The FIRST column must be the
// stable id. 'json' cells hold serialized nested fields (arrays/objects).

export type ColumnKind = 'string' | 'number' | 'boolean' | 'json'

export interface Column<T> {
  header: string
  key: keyof T
  kind?: ColumnKind // default 'string'
}

type Cell = string | number | boolean

/**
 * A tab-backed store for one object type. Mirrors the JSON store's whole-array
 * read/write (readAll / writeAll), so wiring it into an existing store is a
 * drop-in third branch. Deletes/updates go through writeAll(filtered/merged).
 */
export class SheetTable<T extends object> {
  private cache: { at: number; rows: T[] } | null = null

  // cacheTtlMs > 0 caches readAll for that long (for public read-heavy stores like
  // services/gallery, so pages don't call Sheets on every request). Writes refresh
  // the cache; append clears it.
  constructor(private tab: string, private columns: Column<T>[], private cacheTtlMs = 0) {}

  private headers(): string[] {
    return this.columns.map((c) => c.header)
  }

  private toCell(item: T, c: Column<T>): Cell {
    const v = item[c.key]
    if (v === undefined || v === null) return ''
    if ((c.kind ?? 'string') === 'json') return JSON.stringify(v)
    // Store numbers/booleans as NATIVE cell types under RAW so in-sheet SUM/filters
    // work; strings stay strings (RAW never re-parses them, so leading-zero phones
    // and ids are preserved verbatim — USER_ENTERED would mangle them).
    if (c.kind === 'boolean') return v === true || /^(true|1|oui|vrai)$/i.test(String(v))
    if (c.kind === 'number') {
      const n = Number(v)
      return Number.isFinite(n) ? n : ''
    }
    const s = String(v)
    // CSV/formula-injection guard: a cell starting with = + - @ (or tab/CR) becomes
    // a live formula/DDE payload when the owner exports the tab to CSV/XLSX. Prefix
    // with a single quote to force it to plain text.
    return /^[=+\-@\t\r]/.test(s) ? `'${s}` : s
  }

  private fromCell(raw: unknown, c: Column<T>): unknown {
    // With UNFORMATTED_VALUE, numeric/boolean cells arrive as native number/boolean;
    // text cells arrive as strings. Handle both.
    if (raw === undefined || raw === null || raw === '') {
      return (c.kind ?? 'string') === 'string' ? '' : undefined
    }
    switch (c.kind) {
      case 'number':
        return typeof raw === 'number' ? raw : Number(String(raw))
      case 'boolean':
        return typeof raw === 'boolean' ? raw : /^(true|1|oui|vrai)$/i.test(String(raw))
      case 'json':
        try {
          return JSON.parse(String(raw))
        } catch {
          return undefined
        }
      default:
        return typeof raw === 'string' ? raw : String(raw)
    }
  }

  /**
   * True exactly once, right after readAll() first created the tab this process —
   * lets a store seed a brand-new tab from JSON without ever resurrecting rows the
   * owner intentionally deleted from an existing tab. Consuming clears the flag.
   */
  consumeFreshlyCreated(): boolean {
    if (freshlyCreatedTabs.has(this.tab)) {
      freshlyCreatedTabs.delete(this.tab)
      return true
    }
    return false
  }

  async readAll(): Promise<T[]> {
    if (this.cacheTtlMs > 0 && this.cache && Date.now() - this.cache.at < this.cacheTtlMs) {
      return this.cache.rows.slice()
    }
    await ensureTab(this.tab, this.headers())
    const res = await client().spreadsheets.values.get({
      spreadsheetId: spreadsheetId(),
      range: a1(this.tab, 'A2:ZZ'),
      // Return native numbers/booleans (not the locale-formatted display, which in
      // a FR sheet would give "12,5" → NaN). Text cells still come back as strings.
      valueRenderOption: 'UNFORMATTED_VALUE',
    })
    const rows = (res.data.values ?? [])
      .filter((r) => r[0] !== undefined && r[0] !== '') // require a key in column A
      .map((r) => {
        const obj = {} as Record<keyof T, unknown>
        this.columns.forEach((c, i) => {
          obj[c.key] = this.fromCell(r[i], c)
        })
        return obj as T
      })
    if (this.cacheTtlMs > 0) {
      this.cache = { at: Date.now(), rows }
      return rows.slice()
    }
    return rows
  }

  async writeAll(items: T[]): Promise<void> {
    await ensureTab(this.tab, this.headers())
    const values: Cell[][] = [this.headers(), ...items.map((it) => this.columns.map((c) => this.toCell(it, c)))]
    await client().spreadsheets.values.update({
      spreadsheetId: spreadsheetId(),
      range: a1(this.tab, 'A1'),
      valueInputOption: 'RAW',
      requestBody: { values },
    })
    // Clear any leftover rows below the new data (e.g. after a delete). If this
    // fails, the tab may keep ghost rows, so invalidate the cache rather than
    // caching the (now-inaccurate) shorter array — the next read re-fetches truth.
    let cleared = true
    try {
      await client().spreadsheets.values.clear({
        spreadsheetId: spreadsheetId(),
        range: a1(this.tab, `A${values.length + 1}:ZZ`),
      })
    } catch {
      cleared = false
    }
    if (this.cacheTtlMs > 0) this.cache = cleared ? { at: Date.now(), rows: items.slice() } : null
  }

  /** Append a single row without rewriting the tab — for append-only logs. */
  async append(item: T): Promise<void> {
    await ensureTab(this.tab, this.headers())
    await client().spreadsheets.values.append({
      spreadsheetId: spreadsheetId(),
      range: a1(this.tab, 'A1'),
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [this.columns.map((c) => this.toCell(item, c))] },
    })
    this.cache = null
  }
}
