/**
 * Department-store brand floors — Selfridges / Harrods / Fenwick style.
 * Each brand has a "confession": the house story you read on the brand floor.
 */

export interface HouseBrand {
  slug: string;
  name: string;
  /** Short floor label e.g. "Beauty · Level 1" */
  floor: string;
  /** Origin / heritage line */
  origin: string;
  /** One-line tagline */
  tagline: string;
  /** Full department-store confession / brand story */
  confession: string;
  /** Categories this brand is known for */
  specialties: string[];
  /** Campaign image */
  image: string;
  featured?: boolean;
  /** A–Z letter for directory */
  letter: string;
}

export const HOUSE_BRANDS: HouseBrand[] = [
  {
    slug: "lumea",
    name: "LUMÉA",
    floor: "The House · Flagship",
    origin: "Global · Inclusive luxury",
    tagline: "Light for every face.",
    confession:
      "The house brand. Fifty foundation undertones, clinical calm, and quiet luxury engineered for every skin depth and hair texture — deep brown to fair, coils to fine silk. When you want the full LUMÉA ritual, start here.",
    specialties: ["makeup", "skin", "hair", "sets"],
    image: "/images/campaign-glam.jpg",
    featured: true,
    letter: "L",
  },
  {
    slug: "glowlab",
    name: "GlowLab",
    floor: "Beauty · New Faces",
    origin: "Studio partners · Multi-tenant",
    tagline: "Glow for every hour.",
    confession:
      "Our partner floor — independent beauty houses that run on LUMÉA Commerce OS. GlowLab is the live demo brand: soft blush, contour, hair silk. Discover what white-label studio + catalogue feels like in the wild.",
    specialties: ["makeup", "hair"],
    image: "/images/campaign-glow.jpg",
    featured: true,
    letter: "G",
  },
  {
    slug: "atelier-noir",
    name: "Atelier Noir",
    floor: "Makeup · Sculpt",
    origin: "Paris-inspired · Contour house",
    tagline: "Bone structure, soft-focus.",
    confession:
      "For the woman who wants structure that photographs true. Contour, bronzer, and precision tools — cool and warm hollows that actually show on medium to deep skin. The sculpt floor.",
    specialties: ["makeup", "tools"],
    image: "/images/campaign-gloss.jpg",
    featured: true,
    letter: "A",
  },
  {
    slug: "maison-sol",
    name: "Maison Sol",
    floor: "Skin · Light",
    origin: "Clinical glass · Warm climates",
    tagline: "Serum light. Barrier first.",
    confession:
      "Clinical calm for humidity and heat. Illuminating serums, cleansers, and night restore — glass skin without the strip. Shop this floor when your barrier needs light, not weight.",
    specialties: ["skin"],
    image: "/images/campaign-skincare.jpg",
    featured: true,
    letter: "M",
  },
  {
    slug: "coil-atelier",
    name: "Coil Atelier",
    floor: "Hair · Texture",
    origin: "Afro-Caribbean · Pattern care",
    tagline: "Definition without crunch.",
    confession:
      "Written for coils, curls, and 4C patterns first. Cleanse, mask, define, seal — moisture that respects your pattern. The hair floor our customers of colour asked for and we built.",
    specialties: ["hair", "sets"],
    image: "/images/campaign-hair.jpg",
    featured: true,
    letter: "C",
  },
  {
    slug: "silk-route",
    name: "Silk Route",
    floor: "Skin · East",
    origin: "Asian beauty ritual",
    tagline: "Layer light. Never heavy.",
    confession:
      "Inspired by multi-step Asian skincare discipline — gel cleansers, barrier tints, sleeping masks. Soft finishes for fair-to-medium depths and humidity-smart formulas.",
    specialties: ["skin", "makeup"],
    image: "/images/campaign-asian.jpg",
    featured: true,
    letter: "S",
  },
  {
    slug: "casa-luz",
    name: "Casa Luz",
    floor: "Makeup · Warm glam",
    origin: "Hispanic · Golden hour",
    tagline: "Warmth that shows on camera.",
    confession:
      "Golden undertones, cream bronzer, glass lip — glam that flatters tan and medium-deep skin. The floor for soft glam that never turns ashy under flash.",
    specialties: ["makeup", "body"],
    image: "/images/campaign-latina.jpg",
    featured: true,
    letter: "C",
  },
  {
    slug: "velvet-north",
    name: "Velvet North",
    floor: "Body · Soft",
    origin: "Nordic calm · Body spa",
    tagline: "Second-skin soft.",
    confession:
      "Body crèmes, dry oils, and spa sets — buttery melt for cold climates and travel skin. Quiet luxury for the body floor.",
    specialties: ["body", "sets"],
    image: "/images/campaign-deep.jpg",
    letter: "V",
  },
  {
    slug: "edge-works",
    name: "Edge Works",
    floor: "Tools · Pro",
    origin: "Atelier tools",
    tagline: "Precision for every face.",
    confession:
      "Brushes, sponges, and pro kits. The tools floor — for artists and the rest of us who want zero streak and true hollows.",
    specialties: ["tools", "sets"],
    image: "/images/product-brushes.jpg",
    letter: "E",
  },
  {
    slug: "lume-edit",
    name: "Lumé Edit",
    floor: "Lips · Glass",
    origin: "House lip lab",
    tagline: "Mirror shine. Cushion comfort.",
    confession:
      "Dedicated lip oil and tint balm edit — high refraction, no sticky helmet. The glass floor for when the look starts and ends with the mouth.",
    specialties: ["makeup"],
    image: "/images/campaign-lips.jpg",
    featured: true,
    letter: "L",
  },
];

/** Map product slugs → brand floor (department store assignment) */
export const PRODUCT_BRAND_MAP: Record<string, string> = {
  "veil-soft-focus-foundation": "lumea",
  "lume-glass-lip-oil": "lume-edit",
  "aura-illuminating-serum": "maison-sol",
  "silk-veil-body-creme": "velvet-north",
  "sun-sculpt-creme-bronzer": "casa-luz",
  "flux-9-in-1-hair-oil": "coil-atelier",
  "clean-canvas-gel-cleanser": "silk-route",
  "tint-balm-moisture-barrier": "lume-edit",
  "lumea-ritual-starter-set": "lumea",
  "night-restore-sleeping-mask": "silk-route",
  "edge-sculpt-contour-palette": "atelier-noir",
  "coil-define-curl-cream": "coil-atelier",
  "repair-cloud-hair-mask": "coil-atelier",
  "clean-shine-balancing-shampoo": "coil-atelier",
  "silk-slip-conditioner": "coil-atelier",
  "air-lift-dry-shampoo": "velvet-north",
  "lumen-dry-body-oil": "velvet-north",
  "glow-edit-full-face-set": "casa-luz",
  "hair-ritual-cleanse-treat-set": "coil-atelier",
  "cloud-bounce-beauty-sponge": "edge-works",
  "sculpt-angle-contour-brush": "edge-works",
  "atelier-essential-brush-set": "edge-works",
  "pro-tool-starter-kit": "edge-works",
  "body-spa-soft-set": "velvet-north",
  "velvet-hand-creme": "velvet-north",
  "lift-frame-lash-curler": "edge-works",
  "polish-sugar-body-scrub": "velvet-north",
  "pure-reset-brush-cleaner": "edge-works",
};

export function getHouseBrand(slug: string): HouseBrand | undefined {
  return HOUSE_BRANDS.find((b) => b.slug === slug);
}

export function brandSlugForProduct(product: {
  slug: string;
  brandId?: string | null;
  houseBrand?: string | null;
}): string {
  if (product.houseBrand) return product.houseBrand;
  if (product.brandId === "brand-demo-glow" || product.brandId?.includes("glow")) {
    return "glowlab";
  }
  return PRODUCT_BRAND_MAP[product.slug] || "lumea";
}

export function resolveProductBrand(product: {
  slug: string;
  brandId?: string | null;
  houseBrand?: string | null;
}): HouseBrand {
  const slug = brandSlugForProduct(product);
  return getHouseBrand(slug) || HOUSE_BRANDS[0];
}

export function brandsByLetter(): Record<string, HouseBrand[]> {
  const map: Record<string, HouseBrand[]> = {};
  for (const b of HOUSE_BRANDS) {
    const L = b.letter.toUpperCase();
    if (!map[L]) map[L] = [];
    map[L].push(b);
  }
  return map;
}

export function searchBrands(q: string): HouseBrand[] {
  const s = q.toLowerCase().trim();
  if (!s) return HOUSE_BRANDS;
  return HOUSE_BRANDS.filter(
    (b) =>
      b.name.toLowerCase().includes(s) ||
      b.tagline.toLowerCase().includes(s) ||
      b.confession.toLowerCase().includes(s) ||
      b.origin.toLowerCase().includes(s) ||
      b.specialties.some((x) => x.includes(s))
  );
}
