# Review engine (VyNails93)

Goal: steady Google-review velocity (**+8–10/mo, no gap > ~18 days**) to close the gap with Colorvy (82) and widen the map radius. Everything points to **one URL**.

## Wiring — single destination

```
Customer → https://vynails.fr/avis  →  (button)  →  site.reviewUrl → Google review form
```

- **`site.reviewUrl`** (`lib/site.ts`) = `https://www.google.com/maps?cid=8540964610218243177`.
  *Optional upgrade:* replace with the GBP direct-write link (`g.page/r/…/review`, from Business Profile → « Demander des avis ») so the form opens on the star step. `/avis` already reads `site.reviewUrl`, so swapping that one value upgrades every channel at once.

## Already built (code, live)

| Piece | Where | Status |
|---|---|---|
| **QR / vanity page** | `/avis` (`app/(public)/avis/page.tsx`), `noindex` | ✅ live — button → `site.reviewUrl` |
| **Thank-you page** | `/avis/merci` | ✅ live |
| **Homepage review CTA** | `TestimonialsLive` — "⭐ Laisser un avis" | ✅ live |
| **Negative-feedback deflection** | `/avis` routes unhappy clients to `/contact` first | ✅ live |

**QR code:** generate a QR encoding `https://vynails.fr/avis` (any free generator). Print for the desk + mirror. One QR, forever — the redirect target is controlled in code.

## Message templates — all link to `https://vynails.fr/avis`

Send within ~2 h of the appointment (peak-satisfaction window). Merge `[Prénom]`.

### SMS (≤ 160 caractères)
```
Bonjour [Prénom], merci de votre visite chez VyNails93 ! 🌸 Un petit avis Google nous aide énormément : https://vynails.fr/avis — Merci ! À bientôt.
```

### WhatsApp
```
Bonjour [Prénom] 🌸
Merci d'être passée chez VyNails93 aujourd'hui, c'était un plaisir de m'occuper de vous !
Si vous êtes satisfaite, votre avis Google compte énormément pour un petit salon comme le nôtre — ça prend 30 secondes :
👉 https://vynails.fr/avis
Belle journée et à très vite,
Vy — VyNails93, Noisy-le-Grand
```

### Email  *(NEW — missing until now)*
**Objet :** Merci pour votre visite chez VyNails93 🌸
```
Bonjour [Prénom],

Merci d'avoir choisi VyNails93 pour vos ongles/votre soin à Noisy-le-Grand — j'espère que le résultat vous plaît toujours autant !

Si vous avez passé un bon moment, un petit avis Google m'aiderait énormément : pour un salon indépendant, chaque avis fait une vraie différence et aide d'autres clientes à nous trouver. Cela ne prend qu'une minute :

👉 Laisser un avis : https://vynails.fr/avis

Un détail à améliorer ? Répondez simplement à cet email, je préfère régler ça directement avec vous.

Merci encore et à très bientôt,
Vy
VyNails93 — 2 Place du 11 Novembre 1918, 93160 Noisy-le-Grand
06 52 34 64 98 · https://vynails.fr
```

## Review-reply templates
Already in `local-seo-pack.md` §2 (★★★★★ / ★★★★ / négatif). **Respond to 100 %** of reviews within a few days — response rate is a ranking/trust signal.

## Cadence
- Ask **every satisfied client** at checkout (verbally + QR) and follow up by SMS/WhatsApp/email the same day.
- Track weekly; never let 18 days pass without a new review.
- Keep `site.rating.count` synced to the live Google total (currently **52**).
