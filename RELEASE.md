# RELEASE — VyNails93 SEO / Local SEO / GEO / Growth

On-site implementation for VyNails93 (Noisy-le-Grand). Branch `seo/ai-search-onsite` → **PR #2**. Build + lint green.

## ✅ Completed (in code / this PR)

**Pages & content**
- Landing pages: `/rehaussement-cils-noisy-le-grand`, `/onglerie-les-arcades-noisy-le-grand` — routes, self-canonical, OpenGraph, sitemap (auto), internal + reciprocal links. *(2 other candidates — bar-à-ongles-Noisy, standalone gainage — rejected in QA for cannibalisation; gainage instead added as a prothésiste-page section.)*
- 10 blog articles under `/conseils` (BlogPost objects) — each funnels to a service page.
- Gainage / renforcement section on the prothésiste page.

**Internal linking & measurement**
- Homepage body → all 9 service landing pages (DEV-01); `servicePageLinks` updated with the 2 new pages.
- Consent-safe GTM booking-funnel tracking (DEV-02): `lib/analytics.ts` (`booking_view`/`select_services`/`select_slot`/`begin_details`/`confirmed` + `tel_click`), no PII, SSR-safe, gated on consent.

**Schema / GEO**
- `LocalBusiness` `@type` now `['LocalBusiness','BeautySalon','NailSalon']`.
- FAQPage + Breadcrumb + Service auto on every landing page; BlogPosting + FAQPage + Breadcrumb on articles. No self-serving `aggregateRating`.
- `sameAs` (IG/FB/Google/Treatwell), OpeningHoursSpecification, NAP all consistent; `llms.txt` synced with the 2 pages + all articles.

**Data / correctness**
- Closing hour fixed **19h → 20h** across the source of truth, `OpeningHoursSpecification`, all copy, and slot logic (last slot now 19h30).

**Review engine**
- `site.reviewUrl` added; new `/avis` review-request page (QR / SMS / card target, `noindex`) + `/avis/merci` thank-you page; "⭐ Laisser un avis" CTA on the homepage reviews section.

## 📋 Remaining manual tasks (owner — need credentials, payment, or a business decision)

**Credentials / dashboards**
- **GTM → GA4 event tags** for the dataLayer events (turns funnel tracking into conversions). Recipe in the growth docs.
- **GBP optimisation** — apply the paste-ready pack: description (hour = 20h), secondary categories, services, attributes, 20 Q&A. → `operating-manual/build/05`, `operating-manual/GBP-ACTION-PACK.md`.
- **Listings** — create/claim on **Planity (#1 lever)**, Booksy, Fresha, PagesJaunes, Apple Business Connect, Bing Places, Yelp.fr, Mappy. → `build/08`, `build/09`, `build/12`.
- **Reviews** — turn on Planity post-appointment review request; start the SMS/email flow (→ `vynails.fr/avis`). → `build/12`. *(Optional: swap `site.reviewUrl` for the GBP `g.page/r/…` direct-form link.)*
- **Google Posts** — 12 weeks queued → `build/10`. **Backlink outreach** → `build/11`.

**Business decisions**
- **Displayed review count** — `site.rating.count` shows 109; live Google is 51 (Treatwell 134). Pick the number to advertise.
- **Manucure russe** — offer it? If yes, build the page (blog article already live as a defensive asset).
- **Gainage standalone page** — set a real price, then promote from prothésiste-section to a page.
- **Card payment (SumUp)** — when live, flip `site.paymentAccepted` + copy to "CB acceptée" (single-source refactor).

## 🚀 Deployment checklist
- [ ] Merge **PR #2** → `master` (Hostinger auto-builds; ~3–5 min in hPanel → Deployments).
- [ ] Env unchanged: `NEXT_PUBLIC_SITE_URL`, GTM `GTM-WF6G3H69`, Turnstile keys.
- [ ] hPanel deployment reaches "Completed".
- [ ] Cloudflare: purge cache once if HTML is edge-cached.

## ✅ Post-deployment checklist (verify live with a browser User-Agent)
- [ ] 200 on: `/rehaussement-cils-noisy-le-grand`, `/onglerie-les-arcades-noisy-le-grand`, `/avis`, `/avis/merci`, the 10 `/conseils/<slug>`.
- [ ] `sitemap.xml` includes the 2 pages + 10 articles; `llms.txt` returns 200 and lists them.
- [ ] Rich Results Test on `/`, a new landing page, a new article: LocalBusiness(**NailSalon**) + FAQPage + BreadcrumbList + Service + BlogPosting valid; **no** aggregateRating.
- [ ] Hours read **10h–20h** everywhere (site, schema, GBP); `/avis` reaches the Google review flow.
- [ ] GSC → URL-inspect + Request Indexing the 2 new pages and the top 3 articles.

## 📊 30-day monitoring plan
- **Weekly:** Google **review count** (the leading indicator — drives the pack); GSC clicks/impressions/avg-position for the 2 new pages + the "Arcades"/centre-ville + cils terms; GBP Insights (calls, directions, bookings).
- **Once GA4 tags are live:** booking funnel view → confirmed conversion rate.
- **Cannibalisation watch (GSC → Pages):** homepage vs the new pages should *diverge* — homepage keeps "onglerie/bar à ongles", the Arcades page takes "centre-ville/arcades", réhaussement takes its own term.
- **Indexation:** the 2 pages + 10 articles indexed within ~2–4 weeks.
- **Month-end scorecard:** bookings by source, review count/velocity, map-pack rank on the top-10 money terms, indexed pages. **Optimise on bookings, not impressions.**

---
*Full research + paste-ready assets live in `vynails.fr-audit/operating-manual/` (`build/`, `research/`, `13-growth-plan.md`).*
