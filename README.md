# LUMÉA — Beauty Without Boundaries

A professional-grade beauty e-commerce platform inspired by (and designed to surpass) Fenty-class storefronts: cinematic motion, minimalist luxury UI, inclusive shade architecture, and a full Shopify-style operations backend.

## Brand

| | |
|---|---|
| **Name** | **LUMÉA** (loo-MAY-ah) |
| **Tagline** | Light for every face. / Beauty without boundaries. |
| **Registerable domains** | `lumea.beauty` · `getlumea.com` · `shoplumea.com` · `lumeabeauty.com` |
| **Aesthetic** | Ivory · champagne gold · soft blush · ink charcoal |
| **Type** | Cormorant Garamond (display) · DM Sans (UI) |

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4
- **Framer Motion** — scroll reveals, drawers, page motion
- **Zustand** — cart with localStorage persistence
- **File-backed commerce DB** (`data/store.json`) — products, variants, stock, orders, customers, inventory ledger, promos
- **Generated media** — campaign stills + hero video loops in `/public`

## Features

### Storefront
- Cinematic hero with autoplay video
- Featured edit, dual promo tiles, category house grid, philosophy band
- Shop with category filters + search
- PDP: shade/size picker, live stock labels, image gallery, quick-add
- Cart drawer + full bag page
- Checkout with promo codes, tax, free shipping threshold, stock decrement
- Account / order confirmation

### Ops Console (`/admin`) — Shopify-style
- **Dashboard** — revenue, orders, customers, low stock, fulfillment queue
- **Products** — create / edit / delete, badges, featured flag, images
- **Inventory** — SKU stock levels, status (ok / low / critical / out), restock adjustments, movement log
- **Orders** — list, detail, status transitions
- **Fulfillment** — pick queue, tracking numbers, mark shipped
- **Customers** — CRM list, LTV, tags, manual client upload/create

### Promo codes
- `LUME15` — 15% off $50+
- `LUME25` — 25% off $75+
- `WELCOME10` — $10 off

## Multi-tenant brand platform

| Feature | Path / API |
|---------|------------|
| Brand portal (login / register) | `/brand` |
| Dashboard · products · CSV · white-label | `/brand/dashboard` etc. |
| White-label storefront | `/b/{subdomain}` e.g. `/b/glowlab` |
| Branded Mirror Studio | `/b/{subdomain}/studio` |
| Studio skin config | `/brand/studio` |
| Team seats (RBAC) | `/brand/team` |
| CSV template + import | `GET/POST /api/brands/me/products/csv` |
| Domain resolve | `GET /api/brands/resolve?host=` or `?slug=` |

**Demo partner seats**

| Role | Email | Password |
|------|-------|----------|
| Owner | `partner@glowlab.demo` | `glowlab-demo` |
| Editor | `editor@glowlab.demo` | `editor-demo` |
| Viewer | `viewer@glowlab.demo` | `viewer-demo` |

Seat limits: starter **2** · growth **5** · enterprise **25**

CSV columns: `name,slug,category,tagline,description,price,stock,sku,variant,shade_hex,image,badges,featured,active`

## Run locally

```bash
npm install
cp .env.example .env.local   # optional Stripe / Resend keys
npm run dev                  # http://localhost:3006
```

| Surface | URL |
|---------|-----|
| Storefront | `/` |
| Match quiz · recover bag | `/quiz` · `/recover` |
| Checkout (+ Stripe) | `/checkout` |
| Brand portal · billing | `/brand` · `/brand/billing` |
| Admin ops | `/admin` |

## Stripe

Without keys the app stays in **demo mode** (local orders + demo SaaS activate).

With keys:

| Flow | Endpoint |
|------|----------|
| Consumer Checkout | `POST /api/checkout/stripe` → Stripe Hosted Checkout |
| Success finalize | `/checkout/success` + `POST /api/checkout/complete` |
| Brand SaaS subscription | `POST /api/brands/me/billing/stripe` |
| Webhooks | `POST /api/stripe/webhook` |
| Status | `GET /api/stripe/status` |

```bash
# .env.local
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3006
```

Local webhooks:

```bash
stripe listen --forward-to localhost:3006/api/stripe/webhook
```

## Deploy (Vercel)

1. Push to GitHub (`LUMEABeautyHouse`)
2. **Import project** in [Vercel](https://vercel.com/new) → framework Next.js
3. Set env vars from `.env.example` (at least `NEXT_PUBLIC_APP_URL` = your production URL)
4. Deploy
5. Stripe Dashboard → Webhooks → `https://YOUR_DOMAIN/api/stripe/webhook`  
   Events: `checkout.session.completed`
6. Optional: Resend for real email (`RESEND_API_KEY`, `EMAIL_FROM`)

```bash
# CLI alternative
npx vercel
npx vercel --prod
```

**Note:** File-backed `data/*.json` works for demos on a single instance. For production scale, migrate to Postgres/Supabase and durable object storage.

## Project layout

```
src/
  app/           # routes (store + admin + API)
  components/    # layout, home, shop, cart, admin
  lib/           # types, db, seed, utils
  store/         # zustand cart
public/
  images/        # campaign + product photography
  videos/        # hero motion loops
data/
  store.json     # created on first run (commerce state)
```

## Design principles vs. reference

| Fenty-class pattern | LUMÉA elevation |
|---------------------|-----------------|
| Promo ticker | Continuous marquee + champagne accents |
| Hero launch | Full-bleed video + typographic hierarchy |
| Quick shop | Shade swatches on hover + stock-aware add |
| Multi-promo grids | Dual cinematic tiles + motion |
| Catalog density | Breathing space, display type, soft ivory system |
| Ops (Shopify) | Built-in admin: stock, fulfill, CRM, products |

---

© LUMÉA Beauty House — demo commerce platform
