/** Complete-the-look & frequently-bought-together maps by product slug */

export interface BundleItem {
  slug: string;
  name: string;
  price: number;
  image: string;
  role: string;
}

export const COMPLETE_LOOK: Record<string, BundleItem[]> = {
  "veil-soft-focus-foundation": [
    {
      slug: "edge-sculpt-contour-palette",
      name: "Edge Sculpt Contour",
      price: 46,
      image: "/images/product-contour.jpg",
      role: "Sculpt",
    },
    {
      slug: "sun-sculpt-creme-bronzer",
      name: "Sun Sculpt Bronzer",
      price: 34,
      image: "/images/product-bronzer.jpg",
      role: "Warmth",
    },
    {
      slug: "lume-glass-lip-oil",
      name: "Lumé Glass Lip Oil",
      price: 24,
      image: "/images/product-gloss.jpg",
      role: "Finish",
    },
    {
      slug: "cloud-bounce-beauty-sponge",
      name: "Cloud Bounce Sponge",
      price: 16,
      image: "/images/product-sponge.jpg",
      role: "Tool",
    },
  ],
  "coil-define-curl-cream": [
    {
      slug: "repair-cloud-hair-mask",
      name: "Repair Cloud Mask",
      price: 38,
      image: "/images/product-hairmask.jpg",
      role: "Treat",
    },
    {
      slug: "flux-9-in-1-hair-oil",
      name: "Flux 9-in-1 Oil",
      price: 32,
      image: "/images/product-hairoil.jpg",
      role: "Seal",
    },
    {
      slug: "clean-shine-balancing-shampoo",
      name: "Clean Shine Shampoo",
      price: 28,
      image: "/images/product-haircare.jpg",
      role: "Cleanse",
    },
  ],
  "aura-illuminating-serum": [
    {
      slug: "clean-canvas-gel-cleanser",
      name: "Clean Canvas Cleanser",
      price: 28,
      image: "/images/skincare-still.jpg",
      role: "Prep",
    },
    {
      slug: "night-restore-sleeping-mask",
      name: "Night Restore Mask",
      price: 52,
      image: "/images/product-bodycream.jpg",
      role: "Night",
    },
    {
      slug: "veil-soft-focus-foundation",
      name: "Veil Foundation",
      price: 42,
      image: "/images/product-foundation.jpg",
      role: "Makeup",
    },
  ],
  "lume-glass-lip-oil": [
    {
      slug: "tint-balm-moisture-barrier",
      name: "Tint Balm",
      price: 18,
      image: "/images/product-gloss.jpg",
      role: "Care",
    },
    {
      slug: "veil-soft-focus-foundation",
      name: "Veil Foundation",
      price: 42,
      image: "/images/product-foundation.jpg",
      role: "Base",
    },
  ],
  "flux-9-in-1-hair-oil": [
    {
      slug: "coil-define-curl-cream",
      name: "Coil Define Cream",
      price: 32,
      image: "/images/product-hairmask.jpg",
      role: "Define",
    },
    {
      slug: "repair-cloud-hair-mask",
      name: "Repair Cloud Mask",
      price: 38,
      image: "/images/product-hairmask.jpg",
      role: "Mask",
    },
  ],
  "edge-sculpt-contour-palette": [
    {
      slug: "veil-soft-focus-foundation",
      name: "Veil Foundation",
      price: 42,
      image: "/images/product-foundation.jpg",
      role: "Base",
    },
    {
      slug: "sculpt-angle-contour-brush",
      name: "Sculpt Angle Brush",
      price: 28,
      image: "/images/product-brushes.jpg",
      role: "Tool",
    },
    {
      slug: "sun-sculpt-creme-bronzer",
      name: "Sun Sculpt Bronzer",
      price: 34,
      image: "/images/product-bronzer.jpg",
      role: "Bronze",
    },
  ],
};

export const FREE_SHIP_THRESHOLD = 75;
export const FREE_GIFT_THRESHOLD = 120;
export const FREE_GIFT_SLUG = "cloud-bounce-beauty-sponge";
export const FREE_GIFT_NAME = "Cloud Bounce Sponge";
export const FREE_GIFT_IMAGE = "/images/product-sponge.jpg";

/** Glow Club tiers */
export const GLOW_TIERS = [
  {
    id: "spark",
    name: "Spark",
    min: 0,
    perks: ["1 pt per $1 spent", "Birthday mini", "Early sale access"],
  },
  {
    id: "flame",
    name: "Flame",
    min: 500,
    perks: ["1.25× points", "Free samples", "Restock priority"],
  },
  {
    id: "lumen",
    name: "Lumen",
    min: 1500,
    perks: ["1.5× points", "Free shipping always", "VIP shade drops"],
  },
  {
    id: "icon",
    name: "Icon",
    min: 4000,
    perks: ["2× points", "Concierge match", "Limited editions first"],
  },
] as const;

export type GlowTier = (typeof GLOW_TIERS)[number];

export function tierForPoints(pts: number) {
  let current: GlowTier = GLOW_TIERS[0];
  for (const t of GLOW_TIERS) {
    if (pts >= t.min) current = t;
  }
  const idx = GLOW_TIERS.findIndex((t) => t.id === current.id);
  const next = GLOW_TIERS[idx + 1] as GlowTier | undefined;
  return {
    current,
    next,
    progress: next ? (pts - current.min) / (next.min - current.min) : 1,
  };
}
