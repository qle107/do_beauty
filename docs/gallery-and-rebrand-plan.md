# Do Beauty — Gallery + Cursor + Services + Rebrand — Plan

Date: 2026-08-09. Status: approved (local-only storage now; full scope incl. rebrand).

## Verified context (discovery)
- Next.js 16.2.6 App Router, React 19, TS strict, next-auth v5. Deploys on **Hostinger** (not Vercel); `~/vynails-data` DATA_DIR persists across redeploys.
- `googleapis@144` + `browser-image-compression` already installed. No new paid deps.
- CRUD pattern: zod (`lib/validations.ts`) → `lib/<e>-store.ts` (MySQL-or-JSON) → `app/api/<e>` route. Template = Services.
- Auth: `proxy.ts` gates `/admin/*`; `(protected)/layout.tsx` re-checks; each API route self-checks `auth()`.
- Image byte-proxy idiom exists: `app/api/appointments/[id]/images/[name]/route.ts`.
- Existing `/galerie` is static + **broken** (points at nonexistent `nail_*.jpg`). Real photos: `public/images/dob/g1-9.jpg`, `svc-*.jpg`, `entrance.png`, ~80 `WhatsApp*.jpeg`.
- Theme: correct `--db-*` quiet-luxury system in `globals.css` (ivory #F5F1EA, ink #171614, champagne #C8A66A; Cormorant + Manrope). `tailwind.config.ts` still ships OLD pink palette; ~52 files use pink classes. (No undefined-var bug — that agent claim was stale.)
- Cursor: **two** systems. Live culprit = global `components/layout/CustomCursor` (`app/(public)/layout.tsx`) with `cursor:none !important` on `html.has-db-cursor *`. Redundant second cursor `components/hero/CustomCursor` stacked on homepage.
- `lib/site.ts` already Do Beauty (Gentilly, 4.6/99). ~50 files still say VyNails93 / Noisy-le-Grand.

## Storage design (local-only now, Drive behind abstraction later)
- `lib/gallery-storage.ts`: `GalleryStorage` interface (`upload/delete/getPublicUrl`). `LocalGalleryStorage` (bytes → `getDataDir()/gallery`, served via `/api/gallery/image/[id]`). `DriveGalleryStorage` = documented stub to wire later (OAuth2 refresh token; reuse `GOOGLE_CLIENT_ID/SECRET`).
- `lib/gallery-store.ts`: metadata CRUD, MySQL-or-JSON, mirrors `services-store.ts`. Persists in DATA_DIR.
- Metadata: `{ id, category(nails|eyes|studio), tags[], title, alt, uploadedAt, published, storage(static|local|drive), src|driveFileId, width?, height? }`.
- Migrated existing images: `storage:'static'`, `src:'/images/...'` (served directly). New uploads: `storage:'local'` (proxy).

## Phases
1. **Cursor fix** — consolidate to one robust, §23-compliant cursor; remove `!important`/`*` global hide; guarantee native fallback + viewport-leave restore; drop redundant hero cursor (add `data-cursor="image"` to hero visual). Verify: build + cursor never vanishes.
2. **Gallery** — types, zod, gallery-storage, gallery-store, db table, `data/gallery.json` seed (migrate `public/images`), `/api/gallery` (+`[id]`, `image/[id]`), admin page `/admin/(protected)/gallery`, rewrite public `/galerie` (data-driven, filters TOUT/ONGLES/CILS + tags, URL state, newest-first, lazy), Sidebar link. Verify: build + CRUD + filter + migrated images render.
3. **Services/prices** — replace `data/services.json` with the live Planity catalog (109 services / 15 categories); extend `ServiceCategory` + validations + category-driven UI (ServicesGrid, ServicePicker). Verify: build + services page + booking picker.
4. **Rebrand** — VyNails93→Do Beauty, Noisy-le-Grand/93→Gentilly/94 across components/SEO/blog/admin; retire pink palette (retheme to `--db-*`). Orchestrated per file-group. Verify: build + grep clean.
5. **Final verify** — `npm run build`; spot-check checklist from spec §32.

## Guardrails
- Surgical edits; don't touch `photo-tint` vestige or unrelated code.
- Never fabricate business info; `site.ts` is source of truth. Phone +84 flagged as GBP data error.
- Keep `/galerie` URL + JSON-LD (SEO). Public GET never calls `auth()`.
- `data/gallery.json` → add to `.gitignore` runtime writes; commit only the seed baseline.
