/** Verified beauty experts + session pricing (marketplace) */

export type SessionFormat = "one-on-one" | "group" | "wedding" | "event";
export type ExpertSpecialty =
  | "shade-match"
  | "full-face"
  | "coils-texture"
  | "bridal"
  | "editorial"
  | "skin-barrier"
  | "brand-ambassador";

export interface SessionPriceTier {
  format: SessionFormat;
  label: string;
  durationMin: number;
  /** Client pays (USD) */
  priceUsd: number;
  /** Max clients in session (1 for 1:1) */
  maxClients: number;
  description: string;
}

export interface ConciergeExpert {
  id: string;
  slug: string;
  name: string;
  title: string;
  bio: string;
  image: string;
  specialties: ExpertSpecialty[];
  languages: string[];
  /** Brands they can authentically recommend (affiliate incentive) */
  brandSlugs: string[];
  productSlugs: string[];
  verified: boolean;
  rating: number;
  sessionCount: number;
  /** Platform take rate 0–1 (rest goes to expert) */
  platformShare: number;
  /** Extra % of product sales attributed to session (affiliate) */
  productCommissionPct: number;
  pricing: SessionPriceTier[];
  /** Live stream room label */
  streamLabel: string;
}

export const SESSION_FORMAT_LABELS: Record<SessionFormat, string> = {
  "one-on-one": "1:1 private live",
  group: "Group live (friends)",
  wedding: "Wedding / bridal party",
  event: "Event glam party",
};

export const SPECIALTY_LABELS: Record<ExpertSpecialty, string> = {
  "shade-match": "Shade match",
  "full-face": "Full face glam",
  "coils-texture": "Coils & texture",
  bridal: "Bridal",
  editorial: "Editorial / camera",
  "skin-barrier": "Skin barrier",
  "brand-ambassador": "Brand ambassador",
};

/** Default pricing ladders experts can adopt / override */
export const DEFAULT_PRICING: SessionPriceTier[] = [
  {
    format: "one-on-one",
    label: "1:1 Private live",
    durationMin: 25,
    priceUsd: 45,
    maxClients: 1,
    description: "Dedicated video with your expert. Shade passport + product list.",
  },
  {
    format: "group",
    label: "Group (2–4)",
    durationMin: 40,
    priceUsd: 89,
    maxClients: 4,
    description: "Friends live room — each gets tips; shared shopping list.",
  },
  {
    format: "wedding",
    label: "Wedding party",
    durationMin: 75,
    priceUsd: 249,
    maxClients: 8,
    description: "Bride + party: looks, trials, gift bags, timeline for the day.",
  },
  {
    format: "event",
    label: "Event / gala",
    durationMin: 60,
    priceUsd: 179,
    maxClients: 6,
    description: "Camera-ready glam for galas, launches, content days.",
  },
];

export const VERIFIED_EXPERTS: ConciergeExpert[] = [
  {
    id: "ex-amara",
    slug: "amara-k",
    name: "Amara K.",
    title: "Deep & rich shade architect",
    bio: "Former editorial MUA specialising in deep brown and rich undertones. No ash. Contour that photographs. Hosts private Veil trials and bridal trials for melanin-rich parties.",
    image: "/images/campaign-deep.jpg",
    specialties: ["shade-match", "full-face", "bridal", "editorial"],
    languages: ["EN"],
    brandSlugs: ["lumea", "atelier-noir", "casa-luz"],
    productSlugs: [
      "veil-soft-focus-foundation",
      "edge-sculpt-contour-palette",
      "sun-sculpt-creme-bronzer",
      "lume-glass-lip-oil",
    ],
    verified: true,
    rating: 4.97,
    sessionCount: 312,
    platformShare: 0.2,
    productCommissionPct: 8,
    streamLabel: "Amara Live Atelier",
    pricing: DEFAULT_PRICING.map((p) =>
      p.format === "one-on-one" ? { ...p, priceUsd: 55 } : p
    ),
  },
  {
    id: "ex-priya",
    slug: "priya-s",
    name: "Priya S.",
    title: "Glass skin & olive undertones",
    bio: "Clinical-meets-soft-glam. Humidity-proof layering, olive and medium depths, Silk Route rituals. Ideal for 1:1 shade passport and small friend groups.",
    image: "/images/campaign-asian.jpg",
    specialties: ["shade-match", "skin-barrier", "full-face"],
    languages: ["EN", "HI"],
    brandSlugs: ["silk-route", "maison-sol", "lumea"],
    productSlugs: [
      "aura-illuminating-serum",
      "clean-canvas-gel-cleanser",
      "night-restore-sleeping-mask",
      "veil-soft-focus-foundation",
    ],
    verified: true,
    rating: 4.94,
    sessionCount: 198,
    platformShare: 0.2,
    productCommissionPct: 8,
    streamLabel: "Priya Glass Lab",
    pricing: DEFAULT_PRICING,
  },
  {
    id: "ex-keisha",
    slug: "keisha-m",
    name: "Keisha M.",
    title: "Coils, 4C & wash-day architecture",
    bio: "Texture-first educator. Group wash-day rooms, bridal hair+makeup coordination, Coil Atelier product stories that convert because they work.",
    image: "/images/campaign-hair.jpg",
    specialties: ["coils-texture", "bridal", "brand-ambassador"],
    languages: ["EN"],
    brandSlugs: ["coil-atelier", "lumea"],
    productSlugs: [
      "coil-define-curl-cream",
      "repair-cloud-hair-mask",
      "flux-9-in-1-hair-oil",
      "hair-ritual-cleanse-treat-set",
    ],
    verified: true,
    rating: 4.99,
    sessionCount: 421,
    platformShare: 0.18,
    productCommissionPct: 10,
    streamLabel: "Coil Night Live",
    pricing: DEFAULT_PRICING.map((p) =>
      p.format === "group" || p.format === "wedding"
        ? { ...p, priceUsd: p.priceUsd + 20 }
        : p
    ),
  },
  {
    id: "ex-valentina",
    slug: "valentina-r",
    name: "Valentina R.",
    title: "Warm glam & golden hour",
    bio: "Casa Luz specialist. Soft glam for tan and medium-deep skin, wedding parties, content days. Strong product storytelling for bronzer and glass lip.",
    image: "/images/campaign-latina.jpg",
    specialties: ["full-face", "bridal", "editorial", "brand-ambassador"],
    languages: ["EN", "ES"],
    brandSlugs: ["casa-luz", "lume-edit", "atelier-noir"],
    productSlugs: [
      "sun-sculpt-creme-bronzer",
      "glow-edit-full-face-set",
      "lume-glass-lip-oil",
      "edge-sculpt-contour-palette",
    ],
    verified: true,
    rating: 4.95,
    sessionCount: 267,
    platformShare: 0.2,
    productCommissionPct: 9,
    streamLabel: "Luz Soft Glam",
    pricing: DEFAULT_PRICING,
  },
];

export function getExpert(slugOrId: string) {
  return VERIFIED_EXPERTS.find(
    (e) => e.slug === slugOrId || e.id === slugOrId
  );
}

export function priceFor(
  expert: ConciergeExpert,
  format: SessionFormat
): SessionPriceTier | undefined {
  return expert.pricing.find((p) => p.format === format);
}

export function splitFee(priceUsd: number, platformShare: number) {
  const platform = Math.round(priceUsd * platformShare * 100) / 100;
  const expert = Math.round((priceUsd - platform) * 100) / 100;
  return { expert, platform };
}
