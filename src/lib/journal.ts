/** Editorial journal — Net-a-Porter style shoppable stories */

export interface JournalArticle {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  author: string;
  date: string;
  image: string;
  category: "lookbook" | "ritual" | "floor" | "live";
  productSlugs: string[];
  brandSlug?: string;
}

export const JOURNAL: JournalArticle[] = [
  {
    slug: "light-for-every-face-ss26",
    title: "Light for every face — SS26 house edit",
    excerpt:
      "How we cast the hero reels: deep brown, Asian, Hispanic, and blonde — same crop, same quiet luxury language.",
    body: [
      "The house season opens on light — not one light, every light. Our hero reels cycle five faces because one model never told the full story of foundation, hair oil, or glass lip.",
      "Deep brown opens the loop: espresso and rich depths that refuse ash. Asian glass-skin calm follows. Casa Luz warmth. Blonde nude glow. Then the original glam that started the house film.",
      "Shop the looks below, or book a concierge slot to translate the edit to your undertone.",
    ],
    author: "LUMÉA Atelier",
    date: "2026-03-12",
    image: "/images/campaign-glam.jpg",
    category: "lookbook",
    productSlugs: [
      "veil-soft-focus-foundation",
      "lume-glass-lip-oil",
      "aura-illuminating-serum",
    ],
    brandSlug: "lumea",
  },
  {
    slug: "coil-atelier-wash-day",
    title: "Wash day, pattern-first",
    excerpt:
      "Cleanse → mask → define → seal. The Coil Atelier order that respects 4C without crunch.",
    body: [
      "Texture floors in great department stores always had a specialist. Coil Atelier is ours — written for coils before it was written for everyone else.",
      "Start with Clean Shine, weekly Repair Cloud, define while damp, seal with Flux. The live Coil Night walks the same order with Q&A.",
    ],
    author: "Keisha M.",
    date: "2026-03-08",
    image: "/images/campaign-hair.jpg",
    category: "ritual",
    productSlugs: [
      "coil-define-curl-cream",
      "repair-cloud-hair-mask",
      "flux-9-in-1-hair-oil",
      "hair-ritual-cleanse-treat-set",
    ],
    brandSlug: "coil-atelier",
  },
  {
    slug: "walking-the-brand-floors",
    title: "Walking the brand floors",
    excerpt:
      "Selfridges energy, online: confessions, specialties, and how to shop by house not only by category.",
    body: [
      "Harrods taught the world that brands deserve rooms. Online, we give them floors — A–Z directory, confession copy, and a filtered shop so you never lose the house in a grid of SKUs.",
      "Featured concessions sit on the homepage. Partner brands can sponsor placement. Clients search “Casa Luz” or “shade” and land on the right story.",
    ],
    author: "House desk",
    date: "2026-03-01",
    image: "/images/campaign-diptych.jpg",
    category: "floor",
    productSlugs: [
      "sun-sculpt-creme-bronzer",
      "edge-sculpt-contour-palette",
      "glow-edit-full-face-set",
    ],
  },
  {
    slug: "private-sale-edit-etiquette",
    title: "Private Sale: how the Edit works",
    excerpt:
      "Invite code or Glow Flame+ access. Limited pieces, white-glove gift notes, no public markdown theatre.",
    body: [
      "Private Sale is not a fire sale. It is the members’ room: early access, curated sets, and packaging that still feels like sculpture.",
      "Enter with code LUMEAEDIT or hold Flame tier in Glow Club. Concierge can unlock a personal edit if you book a gift session.",
    ],
    author: "LUMÉA Members",
    date: "2026-02-20",
    image: "/images/product-giftset.jpg",
    category: "live",
    productSlugs: [
      "lumea-ritual-starter-set",
      "glow-edit-full-face-set",
      "pro-tool-starter-kit",
    ],
  },
];

export function getArticle(slug: string) {
  return JOURNAL.find((a) => a.slug === slug);
}
