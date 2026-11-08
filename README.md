# CosmoTV — Landing

Next.js 16 + Tailwind v4, static export (`out/`). Pre-launch: no store links yet.

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm test         # contact endpoint contract (node:test)
pnpm build        # static export to out/
```

## Routes

`/` is English; `/pt-BR/`, `/es/` (and `/en/`, canonical to `/`) live under `app/[lang]`.
Each locale has the landing plus `privacy`, `terms`, `support`, `contact` and
`delete-account`. Two root layouts (`app/(default)`, `app/[lang]`) give every page
the right `<html lang>` in the server HTML. `og.png` route handlers render the
1200×630 social cards at build time.

## Where things live

- Copy: `messages/{en,pt-BR,es}.json` (typed against `en.json`).
- Prices, platforms, contact email: `lib/landing-data.ts` — the only place they exist.
- Screenshots: `lib/screenshots.ts` → `public/store/<locale>/<device>/<hash>.webp`,
  resized from the CosmoHQ store manifest. Store frames #3 and #5 are left out on
  purpose: they show or advertise ratings and private notes, which v1 doesn't ship.
- Forms: every form posts through `lib/contact-api.ts` to the hosted CosmoHQ
  `landing-contact` endpoint (same URL in every environment), differing only by
  `source` (`waitlist`, `contact`, `delete-account`).

## Gotchas

- `build` pins `NODE_ENV=production`: this machine's shell exports
  `NODE_ENV=development`, which makes `next build` crash prerendering `/_global-error`.
- Honeypot inputs are named `hp_field`, never `website` — Chrome autofills a field
  called "website" and the submission is silently dropped as a bot.
