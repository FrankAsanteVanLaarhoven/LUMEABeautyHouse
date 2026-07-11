export interface ProductReview {
  id: string;
  productSlug: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  skinTone?: string;
  skinType?: string;
  hairType?: string;
  verified: boolean;
  helpful: number;
  createdAt: string;
}

export const REVIEWS: ProductReview[] = [
  {
    id: "r1",
    productSlug: "veil-soft-focus-foundation",
    author: "Amara K.",
    rating: 5,
    title: "Finally my deep shade",
    body: "Cocoa-deep and not ashy. Contours on top look expensive. Shade match in studio was spot on.",
    skinTone: "Deep brown",
    skinType: "Combination",
    verified: true,
    helpful: 128,
    createdAt: "2026-06-12",
  },
  {
    id: "r2",
    productSlug: "veil-soft-focus-foundation",
    author: "Sofía R.",
    rating: 5,
    title: "Golden medium perfection",
    body: "Warm golden undertone finally matched. Wears through humidity in Miami.",
    skinTone: "Medium golden",
    skinType: "Oily",
    verified: true,
    helpful: 94,
    createdAt: "2026-06-20",
  },
  {
    id: "r3",
    productSlug: "coil-define-curl-cream",
    author: "Nia B.",
    rating: 5,
    title: "4C definition without crunch",
    body: "Soft hold, real moisture. My wash-and-go lasted 4 days. Pair with Flux oil.",
    hairType: "4C coily",
    verified: true,
    helpful: 210,
    createdAt: "2026-05-30",
  },
  {
    id: "r4",
    productSlug: "flux-9-in-1-hair-oil",
    author: "Priya M.",
    rating: 5,
    title: "Ends sealed, no grease",
    body: "Fine wavy hair — one drop is enough. Heat protect actually works.",
    hairType: "2B wavy",
    verified: true,
    helpful: 76,
    createdAt: "2026-06-01",
  },
  {
    id: "r5",
    productSlug: "edge-sculpt-contour-palette",
    author: "Keisha L.",
    rating: 5,
    title: "Shows on deep skin!",
    body: "Most contours disappear on me. Deep Define is the one. Brush set is mandatory.",
    skinTone: "Rich deep",
    skinType: "Dry",
    verified: true,
    helpful: 156,
    createdAt: "2026-06-18",
  },
  {
    id: "r6",
    productSlug: "lume-glass-lip-oil",
    author: "Mei C.",
    rating: 5,
    title: "Glass lips, zero sticky",
    body: "Rose Quartz on light-medium Asian skin looks expensive. Non-sticky miracle.",
    skinTone: "Light medium",
    verified: true,
    helpful: 88,
    createdAt: "2026-06-22",
  },
  {
    id: "r7",
    productSlug: "aura-illuminating-serum",
    author: "Valentina G.",
    rating: 5,
    title: "Glass from within",
    body: "Under foundation or alone — my Latina golden skin looks lit, not glittery.",
    skinTone: "Tan warm",
    skinType: "Normal",
    verified: true,
    helpful: 61,
    createdAt: "2026-06-08",
  },
  {
    id: "r8",
    productSlug: "repair-cloud-hair-mask",
    author: "Aisha T.",
    rating: 5,
    title: "Relaxed + natural friendly",
    body: "Weekly mask for heat-damaged edges. Soft without weighing coils down.",
    hairType: "3C / relaxed mix",
    verified: true,
    helpful: 99,
    createdAt: "2026-05-28",
  },
  {
    id: "r9",
    productSlug: "sun-sculpt-creme-bronzer",
    author: "Camila D.",
    rating: 5,
    title: "Warm bronze goddess",
    body: "Terra Glow on medium-tan skin is the Hispanic summer look. Blends like a dream.",
    skinTone: "Medium tan",
    verified: true,
    helpful: 72,
    createdAt: "2026-06-15",
  },
  {
    id: "r10",
    productSlug: "glow-edit-full-face-set",
    author: "Jade W.",
    rating: 5,
    title: "Everything I needed",
    body: "Tried shades in Mirror Studio first — zero returns. Best gift to myself.",
    skinTone: "Deep",
    skinType: "Combination",
    verified: true,
    helpful: 140,
    createdAt: "2026-06-25",
  },
];

export function reviewsForProduct(slug: string) {
  return REVIEWS.filter((r) => r.productSlug === slug);
}

export function averageRating(slug: string) {
  const list = reviewsForProduct(slug);
  if (!list.length) return null;
  return list.reduce((s, r) => s + r.rating, 0) / list.length;
}
