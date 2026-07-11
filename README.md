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
| CSV template + import | `GET/POST /api/brands/me/products/csv` |
| Domain resolve | `GET /api/brands/resolve?host=` or `?slug=` |

**Demo partner:** `partner@glowlab.demo` / `glowlab-demo`

CSV columns: `name,slug,category,tagline,description,price,stock,sku,variant,shade_hex,image,badges,featured,active`

## Run

```bash
cd lumea
npm install
npm run dev
```

Open [http://localhost:3006](http://localhost:3006)

| Surface | URL |
|---------|-----|
| Storefront | `/` |
| Shop | `/shop` |
| Admin ops | `/admin` |
| Fulfillment | `/admin/fulfillment` |
| Inventory | `/admin/inventory` |

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
