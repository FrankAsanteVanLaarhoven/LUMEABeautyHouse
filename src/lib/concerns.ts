export interface ConcernCard {
  id: string;
  title: string;
  body: string;
  category: "skin" | "hair" | "makeup" | "body";
  image: string;
  productSlugs: string[];
  shopQuery?: string;
}

export const CONCERNS: ConcernCard[] = [
  {
    id: "dry-skin",
    title: "Dry / dehydrated skin",
    body: "Barrier repair, cream cleansers out — milk moisture in.",
    category: "skin",
    image: "/images/campaign-skincare.jpg",
    productSlugs: [
      "clean-canvas-gel-cleanser",
      "aura-illuminating-serum",
      "silk-veil-body-creme",
      "night-restore-sleeping-mask",
    ],
  },
  {
    id: "oily-skin",
    title: "Oil & shine control",
    body: "Balance without stripping. Soft matte that still glows.",
    category: "skin",
    image: "/images/campaign-glow.jpg",
    productSlugs: [
      "clean-canvas-gel-cleanser",
      "aura-illuminating-serum",
      "veil-soft-focus-foundation",
    ],
  },
  {
    id: "deep-shade",
    title: "Deep & rich foundation",
    body: "Fifty undertones. No ash. Contour that actually shows.",
    category: "makeup",
    image: "/images/campaign-deep.jpg",
    productSlugs: [
      "veil-soft-focus-foundation",
      "edge-sculpt-contour-palette",
      "sun-sculpt-creme-bronzer",
      "lume-glass-lip-oil",
    ],
  },
  {
    id: "coily-hair",
    title: "Coils & 4C moisture",
    body: "Definition without crunch. Repair that respects your pattern.",
    category: "hair",
    image: "/images/campaign-deep.jpg",
    productSlugs: [
      "coil-define-curl-cream",
      "repair-cloud-hair-mask",
      "flux-9-in-1-hair-oil",
      "clean-shine-balancing-shampoo",
      "hair-ritual-cleanse-treat-set",
    ],
  },
  {
    id: "damaged-hair",
    title: "Heat & colour damage",
    body: "Bond-minded mask + multi-oil. Soft again in one week.",
    category: "hair",
    image: "/images/campaign-hair.jpg",
    productSlugs: [
      "repair-cloud-hair-mask",
      "flux-9-in-1-hair-oil",
      "silk-slip-conditioner",
      "hair-ritual-cleanse-treat-set",
    ],
  },
  {
    id: "frizz",
    title: "Frizz & humidity",
    body: "Seal the cuticle. Shine without the grease helmet.",
    category: "hair",
    image: "/images/product-hairoil.jpg",
    productSlugs: [
      "flux-9-in-1-hair-oil",
      "coil-define-curl-cream",
      "silk-slip-conditioner",
    ],
  },
  {
    id: "contour",
    title: "Snatched structure",
    body: "Bone-true contour for every face map — fair to deepest.",
    category: "makeup",
    image: "/images/product-contour.jpg",
    productSlugs: [
      "edge-sculpt-contour-palette",
      "sculpt-angle-contour-brush",
      "sun-sculpt-creme-bronzer",
      "atelier-essential-brush-set",
    ],
  },
  {
    id: "lips",
    title: "Juicy lips that last",
    body: "Glass oil, tint balm, colour that flatters deep & warm tones.",
    category: "makeup",
    image: "/images/campaign-lips.jpg",
    productSlugs: [
      "lume-glass-lip-oil",
      "tint-balm-moisture-barrier",
      "glow-edit-full-face-set",
    ],
  },
  {
    id: "body-glow",
    title: "Body glass skin",
    body: "Scrub · oil · crème. Soft light from collarbone to ankle.",
    category: "body",
    image: "/images/campaign-skincare.jpg",
    productSlugs: [
      "polish-sugar-body-scrub",
      "lumen-dry-body-oil",
      "silk-veil-body-creme",
      "body-spa-soft-set",
    ],
  },
  {
    id: "beginner",
    title: "New to makeup",
    body: "Starter sets, sponge, clean base. No overwhelm.",
    category: "makeup",
    image: "/images/campaign-gloss.jpg",
    productSlugs: [
      "lumea-ritual-starter-set",
      "cloud-bounce-beauty-sponge",
      "pro-tool-starter-kit",
      "tint-balm-moisture-barrier",
    ],
  },
];

export const GIFT_GUIDES = [
  {
    id: "her-first",
    title: "Her first LUMÉA",
    budget: "Under $50",
    body: "Ritual starter + glass lip. Instant love.",
    slugs: ["lumea-ritual-starter-set", "lume-glass-lip-oil"],
    image: "/images/product-giftset.jpg",
  },
  {
    id: "glam-queen",
    title: "The glam queen",
    budget: "$75–120",
    body: "Full face edit + brushes. Snatched package.",
    slugs: ["glow-edit-full-face-set", "atelier-essential-brush-set"],
    image: "/images/campaign-glam.jpg",
  },
  {
    id: "hair-healer",
    title: "Hair healer",
    budget: "$80–100",
    body: "Cleanse, treat, seal — for curls & damage.",
    slugs: ["hair-ritual-cleanse-treat-set", "coil-define-curl-cream"],
    image: "/images/campaign-hair.jpg",
  },
  {
    id: "spa-night",
    title: "Spa night in",
    budget: "$90+",
    body: "Body spa trio + hand crème. Soft all over.",
    slugs: ["body-spa-soft-set", "velvet-hand-creme"],
    image: "/images/campaign-skincare.jpg",
  },
  {
    id: "deep-skin",
    title: "Deep skin icon",
    budget: "Any",
    body: "Foundation range + contour that shows + gloss.",
    slugs: [
      "veil-soft-focus-foundation",
      "edge-sculpt-contour-palette",
      "lume-glass-lip-oil",
    ],
    image: "/images/campaign-deep.jpg",
  },
  {
    id: "tools-pro",
    title: "Pro tool kit",
    budget: "Under $80",
    body: "Brushes, sponge, cleaner — apply like a MUA.",
    slugs: ["pro-tool-starter-kit", "cloud-bounce-beauty-sponge"],
    image: "/images/product-brushes.jpg",
  },
];
