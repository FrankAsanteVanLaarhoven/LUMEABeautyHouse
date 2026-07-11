export type TutorialCategory =
  | "contour"
  | "base"
  | "eyes"
  | "lips"
  | "hair"
  | "tools"
  | "full-face";

export interface Tutorial {
  id: string;
  title: string;
  artist: string;
  artistNote: string;
  category: TutorialCategory;
  duration: string;
  level: "beginner" | "intermediate" | "pro";
  description: string;
  youtubeId: string;
  relatedProductSlugs: string[];
  tags: string[];
}

/** Free public YouTube tutorials from world-class artists — embedded in-app for learning, not affiliation claims. */
export const TUTORIALS: Tutorial[] = [
  {
    id: "t-goss-contour",
    title: "Contouring & Highlighting — Technique One",
    artist: "Wayne Goss",
    artistNote: "Celebrity makeup artist · free YouTube education",
    category: "contour",
    duration: "12:07",
    level: "beginner",
    description:
      "A clear, classic contour and highlight map — placement, blending, and soft sculpture without harsh lines.",
    youtubeId: "VfrhZ8Jm2bk",
    relatedProductSlugs: [
      "edge-sculpt-contour-palette",
      "sun-sculpt-creme-bronzer",
      "sculpt-angle-contour-brush",
    ],
    tags: ["contour", "highlight", "face shape"],
  },
  {
    id: "t-lisa-blend",
    title: "This Hack Will Transform Your Makeup Instantly",
    artist: "Lisa Eldridge",
    artistNote: "International makeup artist · free masterclass energy",
    category: "base",
    duration: "11:08",
    level: "intermediate",
    description:
      "Blending philosophy and base finesse from one of the most respected faces in editorial beauty.",
    youtubeId: "mlSnP2HPjIs",
    relatedProductSlugs: [
      "veil-soft-focus-foundation",
      "cloud-bounce-beauty-sponge",
      "atelier-essential-brush-set",
    ],
    tags: ["blending", "base", "skin"],
  },
  {
    id: "t-lisa-bronze",
    title: "Bronzed Contoured & Highlighted Makeup Look",
    artist: "Lisa Eldridge",
    artistNote: "Red-carpet technique, free tutorial",
    category: "contour",
    duration: "11:16",
    level: "intermediate",
    description:
      "Warm contour, bronze, and highlight for a luminous sculpted face — ideal with Edge Sculpt + Sun Sculpt.",
    youtubeId: "D8g3orq4M7U",
    relatedProductSlugs: [
      "edge-sculpt-contour-palette",
      "sun-sculpt-creme-bronzer",
      "lumen-dry-body-oil",
    ],
    tags: ["bronze", "contour", "glow"],
  },
  {
    id: "t-lisa-nomakeup",
    title: "No Make-up Look Tutorial",
    artist: "Lisa Eldridge",
    artistNote: "Signature soft-skin look",
    category: "full-face",
    duration: "15:08",
    level: "beginner",
    description:
      "The iconic “your skin but better” full face — perfect for Veil foundation and Lumé Glass.",
    youtubeId: "oGpLLWnO3XY",
    relatedProductSlugs: [
      "veil-soft-focus-foundation",
      "lume-glass-lip-oil",
      "aura-illuminating-serum",
    ],
    tags: ["natural", "skin", "everyday"],
  },
  {
    id: "t-goss-invisible",
    title: "A Full Face of Invisible Makeup",
    artist: "Wayne Goss",
    artistNote: "Soft skin finish techniques",
    category: "full-face",
    duration: "8:58",
    level: "beginner",
    description:
      "How to wear a full face that reads as bare skin — sheer layers, soft tools, light hands.",
    youtubeId: "jbvNNGRqXS0",
    relatedProductSlugs: [
      "veil-soft-focus-foundation",
      "cloud-bounce-beauty-sponge",
      "tint-balm-moisture-barrier",
    ],
    tags: ["invisible", "natural", "base"],
  },
  {
    id: "t-contour-secrets",
    title: "Contouring Secrets of a Makeup Artist",
    artist: "Beauty and the Boutique",
    artistNote: "Classic free contour breakdown",
    category: "contour",
    duration: "15:57",
    level: "intermediate",
    description:
      "Artist-level contour placement for multiple face maps — pair with our angle brush and palette.",
    youtubeId: "qGNwm3mP7EA",
    relatedProductSlugs: [
      "edge-sculpt-contour-palette",
      "sculpt-angle-contour-brush",
      "atelier-essential-brush-set",
    ],
    tags: ["contour", "pro tips", "structure"],
  },
];

export const TUTORIAL_CATEGORIES: { id: TutorialCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "contour", label: "Contouring" },
  { id: "base", label: "Base & skin" },
  { id: "full-face", label: "Full face" },
  { id: "eyes", label: "Eyes" },
  { id: "lips", label: "Lips" },
  { id: "hair", label: "Hair" },
  { id: "tools", label: "Tools" },
];
