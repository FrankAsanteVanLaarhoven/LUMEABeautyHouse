export interface UgcPost {
  id: string;
  author: string;
  handle: string;
  skinTone: string;
  hairType?: string;
  title: string;
  body: string;
  productSlug: string;
  productName: string;
  beforeImage: string;
  afterImage: string;
  likes: number;
  verified: boolean;
  look: string;
}

export const UGC_POSTS: UgcPost[] = [
  {
    id: "u1",
    author: "Amara K.",
    handle: "@amaraglow",
    skinTone: "Deep / warm",
    hairType: "4C coils",
    title: "Veil in Espresso — finally no ash",
    body: "Matched in Mirror Studio, then sealed coils with Flux oil. Soft glam that actually photographs true.",
    productSlug: "veil-soft-focus-foundation",
    productName: "Veil Soft-Focus Foundation",
    beforeImage: "/images/campaign-deep.jpg",
    afterImage: "/images/campaign-glam.jpg",
    likes: 1842,
    verified: true,
    look: "Soft glam",
  },
  {
    id: "u2",
    author: "Priya S.",
    handle: "@priya.lume",
    skinTone: "Medium / olive",
    title: "AM glass skin in 6 minutes",
    body: "Aura serum under Veil Sand. Quiz said combination — it was right. Humidity-proof on a Mumbai commute.",
    productSlug: "aura-illuminating-serum",
    productName: "Aura Illuminating Serum",
    beforeImage: "/images/campaign-asian.jpg",
    afterImage: "/images/campaign-glow.jpg",
    likes: 1204,
    verified: true,
    look: "Glass skin",
  },
  {
    id: "u3",
    author: "Valentina R.",
    handle: "@valen.beauty",
    skinTone: "Tan / warm",
    title: "Edge Sculpt that shows on camera",
    body: "Contour used to disappear on me. Medium Carve + Sun Sculpt Maple — bone structure finally reads.",
    productSlug: "edge-sculpt-contour-palette",
    productName: "Edge Sculpt Contour",
    beforeImage: "/images/campaign-latina.jpg",
    afterImage: "/images/campaign-gloss.jpg",
    likes: 967,
    verified: true,
    look: "Sculpted",
  },
  {
    id: "u4",
    author: "Keisha M.",
    handle: "@coilsbykeisha",
    skinTone: "Rich / cool",
    hairType: "4B–4C",
    title: "Wash day → defined, not crunchy",
    body: "Clean Shine → Repair Cloud → Coil Define → Flux seal. Pattern still mine. Frizz? Handled.",
    productSlug: "coil-define-curl-cream",
    productName: "Coil Define Curl Cream",
    beforeImage: "/images/campaign-hair.jpg",
    afterImage: "/images/campaign-deep.jpg",
    likes: 2103,
    verified: true,
    look: "Defined coils",
  },
  {
    id: "u5",
    author: "Mina H.",
    handle: "@minaskin",
    skinTone: "Light / cool",
    title: "Barrier repair after travel",
    body: "Night Restore + Aura for a week. No more plane face. Lumé Glass for the soft finish.",
    productSlug: "night-restore-sleeping-mask",
    productName: "Night Restore Sleeping Mask",
    beforeImage: "/images/campaign-skincare.jpg",
    afterImage: "/images/campaign-lips.jpg",
    likes: 744,
    verified: false,
    look: "Restored",
  },
  {
    id: "u6",
    author: "Jade L.",
    handle: "@jadelumea",
    skinTone: "Deep / neutral",
    title: "Full face set — first Fenty alternative I kept",
    body: "Glow Edit Full Face for a wedding. Shade match quiz + studio try-on. Zero returns. Zero regret.",
    productSlug: "glow-edit-full-face-set",
    productName: "Glow Edit Full Face Set",
    beforeImage: "/images/campaign-diptych.jpg",
    afterImage: "/images/campaign-glam.jpg",
    likes: 1560,
    verified: true,
    look: "Wedding glam",
  },
];
