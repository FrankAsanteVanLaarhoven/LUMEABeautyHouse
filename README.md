# LUMÉA Beauty House

**Light for every face.**

LUMÉA is an inclusive luxury beauty house and multi-tenant commerce platform: cinematic storefront, shade-true makeup and hair care, live Mirror Studio try-on, and Shopify-class operations for the house brand and partner labels.

| | |
|---|---|
| **Live** | [lumea-beige.vercel.app](https://lumea-beige.vercel.app) |
| **Repo** | [LUMEABeautyHouse](https://github.com/FrankAsanteVanLaarhoven/LUMEABeautyHouse) |
| **Local** | `http://localhost:3006` |
| **PayPal** | `frankleroyvan@gmail.com` |

---

## About the house

LUMÉA exists for the full spectrum of human skin and hair. Too many shelves still treat inclusive shade ranges as an afterthought — ash foundations, missing undertones, hair rituals written for one texture. We reverse that: start with every face, then engineer formulas, packaging, and digital tools that honour them.

**What we stand for**

- **Inclusive by design** — Fifty foundation undertones. Hair rituals for coils, waves, and fine textures.
- **Clinical calm** — Actives that earn their place, without clinical coldness.
- **Try before you buy** — Mirror Studio, match quiz, and reviews tagged by real skin and hair.
- **Quiet luxury** — Ivory, champagne, craft — motion with purpose, never noise.

---

## Brand

| | |
|---|---|
| **Name** | **LUMÉA** (loo-MAY-ah) |
| **Tagline** | Light for every face. · Beauty without boundaries. |
| **Domains** | `lumea.beauty` · `getlumea.com` · `shoplumea.com` · `lumeabeauty.com` |
| **Aesthetic** | Ivory · champagne gold · soft blush · ink charcoal |
| **Type** | Cormorant Garamond (display) · DM Sans (UI) |

---

## Product surface

### Consumer storefront
- Crossfading **hero reels** (deep brown · Asian · Hispanic · blonde · original glam)
- **Brand floors** (`/brands`) — Selfridges / Harrods-style A–Z directory with brand confessions; shop by house
- Shop by category, brand, concern, gift finder, routines, match quiz
- PDP: shades, stock, reviews by skin/hair, complete-the-look, subscribe & save
- Cart with free-shipping progress, abandon recovery, Glow Club loyalty
- **Checkout:** PayPal (`frankleroyvan@gmail.com`), Stripe (optional keys), LUMÉA Wallet
- Account, list, wallet, shade matches
- Mirror Studio try-on · tutorials · community UGC

### Ops (`/admin`)
Dashboard, products, inventory, orders, fulfillment, customers.

### Brand SaaS (`/brand`)
Register brands, CSV catalogue, white-label `/b/{slug}`, Mirror Studio skins, team seats (RBAC), billing plans, custom domain verify.

| Plan | Seats | Products | Domain | From |
|------|-------|----------|--------|------|
| Starter | 2 | 50 | Subdomain | $49/mo |
| Growth | 5 | 500 | Custom | $149/mo |
| Enterprise | 25 | Unlimited | Custom + VIP | $499/mo |

**Demo partner (GlowLab)**

| Role | Email | Password |
|------|-------|----------|
| Owner | `partner@glowlab.demo` | `glowlab-demo` |
| Editor | `editor@glowlab.demo` | `editor-demo` |
| Viewer | `viewer@glowlab.demo` | `viewer-demo` |

---

## Payments

### PayPal (live merchant email)
Orders can be paid via **PayPal Website Payments Standard** to:

**frankleroyvan@gmail.com**

- Checkout → select **PayPal** → order is created as `pending` → buyer completes payment on PayPal → return marks order `paid`
- Env override: `PAYPAL_BUSINESS_EMAIL=frankleroyvan@gmail.com`
- Optional sandbox: `PAYPAL_MODE=sandbox`

### Stripe (optional)
Set `STRIPE_SECRET_KEY` + publishable key for Hosted Checkout. Without keys, card path places a demo order.

### Promo codes
`LUME15` · `LUME25` · `WELCOME10` · affiliate codes (e.g. `NYMA15`, `COILS20`)

---

## Stack

- Next.js 16 (App Router) · TypeScript · Tailwind CSS v4  
- Framer Motion · Zustand (cart / profile / browse)  
- File JSON DB under `data/` (demo) · Resend-ready email outbox  
- Vercel deploy · GitHub connected  

---

## Run locally

```bash
npm install
cp .env.example .env.local
# optional: STRIPE_*, RESEND_*, PAYPAL_BUSINESS_EMAIL
npm run dev
# → http://localhost:3006
```

| Surface | Path |
|---------|------|
| Storefront | `/` |
| About | `/about` |
| Quiz · Studio | `/quiz` · `/studio` |
| Checkout · PayPal | `/checkout` |
| Brand portal | `/brand` |
| Admin | `/admin` |

---

## Environment

See `.env.example`:

```bash
NEXT_PUBLIC_APP_URL=https://your-domain.com
PAYPAL_BUSINESS_EMAIL=frankleroyvan@gmail.com
# PAYPAL_MODE=sandbox

STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

RESEND_API_KEY=
EMAIL_FROM=LUMÉA <hello@yourdomain.com>
```

---

## Deploy

```bash
npx vercel --prod
```

1. Set `NEXT_PUBLIC_APP_URL` and `PAYPAL_BUSINESS_EMAIL` in Vercel  
2. Optional Stripe webhook: `https://YOUR_DOMAIN/api/stripe/webhook`  
3. Confirm PayPal account email matches merchant email for live payments  

**Note:** File-backed `data/*.json` is suitable for demos. Production scale should use Postgres/Supabase and durable object storage.

---

## Project layout

```
src/app/           # routes (store, about, brand, admin, APIs)
src/components/    # hero, shop, cart, checkout, brand shell
src/lib/           # db, paypal, stripe, email, quiz, brands
public/images|videos/
data/              # runtime store (gitignored)
```

---

## Design principles

| Pattern | LUMÉA approach |
|---------|----------------|
| Inclusive range | Fifty undertones · coil-to-fine hair rituals |
| Launch hero | Multi-reel crossfade · diverse faces |
| Conversion | Quiz · try-on · concerns · Glow Club · abandon recover |
| Ops | Built-in inventory · fulfillment · CRM |
| Brand OS | White-label studio · seats · billing |

---

© LUMÉA Beauty House · Beauty without boundaries.
