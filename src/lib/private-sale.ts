/** Members’ room / Private Sale Edit */

export const PRIVATE_SALE_CODE = "LUMEAEDIT";
/** Glow points required if no code (Flame tier starts ~500) */
export const PRIVATE_SALE_MIN_GLOW = 500;

export interface PrivateSaleItem {
  slug: string;
  name: string;
  tagline: string;
  price: number;
  was: number;
  image: string;
  badge: string;
}

export const PRIVATE_SALE_ITEMS: PrivateSaleItem[] = [
  {
    slug: "glow-edit-full-face-set",
    name: "Glow Edit Full Face Set",
    tagline: "Foundation · Contour · Gloss · Sponge",
    price: 78,
    was: 98,
    image: "/images/product-giftset.jpg",
    badge: "Edit exclusive",
  },
  {
    slug: "lumea-ritual-starter-set",
    name: "Ritual Starter Set",
    tagline: "Cleanse · Illuminate · Veil",
    price: 38,
    was: 48,
    image: "/images/skincare-still.jpg",
    badge: "Members only",
  },
  {
    slug: "hair-ritual-cleanse-treat-set",
    name: "Hair Ritual Set",
    tagline: "Shampoo · Conditioner · Oil · Mask",
    price: 72,
    was: 88,
    image: "/images/product-giftset.jpg",
    badge: "Floor special",
  },
  {
    slug: "pro-tool-starter-kit",
    name: "Pro Tool Starter Kit",
    tagline: "Brushes · Sponge · Cleaner",
    price: 62,
    was: 79,
    image: "/images/product-brushes.jpg",
    badge: "Limited",
  },
  {
    slug: "veil-soft-focus-foundation",
    name: "Veil Soft-Focus Foundation",
    tagline: "Gift-wrap eligible · any shade",
    price: 36,
    was: 42,
    image: "/images/product-foundation.jpg",
    badge: "Shade passport",
  },
  {
    slug: "atelier-essential-brush-set",
    name: "Atelier Essential Brush Set",
    tagline: "Six brushes. Every face.",
    price: 54,
    was: 68,
    image: "/images/product-brushes.jpg",
    badge: "Concierge pick",
  },
];

export function canAccessPrivateSale(opts: {
  code?: string;
  glowPoints?: number;
}) {
  if (opts.code?.trim().toUpperCase() === PRIVATE_SALE_CODE) return true;
  if ((opts.glowPoints ?? 0) >= PRIVATE_SALE_MIN_GLOW) return true;
  return false;
}
