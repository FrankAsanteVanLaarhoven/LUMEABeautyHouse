export type TutorialCategory =
  | "contour"
  | "base"
  | "eyes"
  | "lips"
  | "hair"
  | "tools"
  | "full-face";

/** Skin focus for clients who shop by how they see themselves */
export type SkinFocus =
  | "all"
  | "deep-brown"
  | "afro-caribbean"
  | "asian"
  | "hispanic"
  | "medium-warm"
  | "light";

export interface Tutorial {
  id: string;
  title: string;
  artist: string;
  artistNote: string;
  category: TutorialCategory;
  skinFocus: Exclude<SkinFocus, "all">[];
  duration: string;
  level: "beginner" | "intermediate" | "pro";
  description: string;
  youtubeId: string;
  relatedProductSlugs: string[];
  tags: string[];
}

/**
 * Free public YouTube tutorials featuring women artists across deep brown,
 * Afro-Caribbean, Asian, Hispanic, and warm medium tones — the buyers LUMÉA serves.
 */
export const TUTORIALS: Tutorial[] = [
  // ── Deep brown / dark skin ─────────────────────────────
  {
    id: "t-nyma-contour",
    title: "Contours for Dark Skin",
    artist: "Nyma Tang",
    artistNote: "Queen of deep-skin education · free YouTube",
    category: "contour",
    skinFocus: ["deep-brown", "afro-caribbean"],
    duration: "5:05",
    level: "beginner",
    description:
      "Favourite contours that actually show on deep and dark skin — no ashy lines, real dimension. Pair with Edge Sculpt deep shades.",
    youtubeId: "p_ci6UBFQWA",
    relatedProductSlugs: [
      "edge-sculpt-contour-palette",
      "sun-sculpt-creme-bronzer",
      "sculpt-angle-contour-brush",
    ],
    tags: ["deep skin", "contour", "dark skin", "dimension"],
  },
  {
    id: "t-nyma-foundation",
    title: "Foundation Routine for Dark Skin",
    artist: "Nyma Tang",
    artistNote: "Shade-matching & base for deeper complexions",
    category: "base",
    skinFocus: ["deep-brown", "afro-caribbean"],
    duration: "9:47",
    level: "beginner",
    description:
      "Step-by-step foundation for dark skin — undertones, coverage, and a finish that looks like skin, not grey.",
    youtubeId: "LWVpvo0m4gQ",
    relatedProductSlugs: [
      "veil-soft-focus-foundation",
      "cloud-bounce-beauty-sponge",
      "aura-illuminating-serum",
    ],
    tags: ["foundation", "deep skin", "base", "shade match"],
  },
  {
    id: "t-jackie-everyday",
    title: "Everyday Makeup Tutorial",
    artist: "Jackie Aina",
    artistNote: "Afro-Caribbean beauty icon · full glam everyday",
    category: "full-face",
    skinFocus: ["deep-brown", "afro-caribbean"],
    duration: "9:39",
    level: "intermediate",
    description:
      "Step-by-step everyday glam on deep brown skin — colour that pops, contour that reads, lips that finish the look.",
    youtubeId: "eRpwH7HXNDc",
    relatedProductSlugs: [
      "veil-soft-focus-foundation",
      "edge-sculpt-contour-palette",
      "lume-glass-lip-oil",
      "glow-edit-full-face-set",
    ],
    tags: ["deep skin", "everyday", "glam", "Afro-Caribbean"],
  },
  {
    id: "t-jackie-nyma",
    title: "Deepest Shades Discussed — Beauty for Dark Skin",
    artist: "Jackie Aina · Nyma Tang",
    artistNote: "Two powerhouse women on deep-shade real talk",
    category: "base",
    skinFocus: ["deep-brown", "afro-caribbean"],
    duration: "30:13",
    level: "intermediate",
    description:
      "What actually works in the deepest range — foundation truth-telling so deep and rich skin gets the love it deserves.",
    youtubeId: "EOaVDa26bH8",
    relatedProductSlugs: [
      "veil-soft-focus-foundation",
      "lumea-ritual-starter-set",
    ],
    tags: ["deep skin", "foundation", "shade range", "education"],
  },
  {
    id: "t-jackie-bronze",
    title: "How to Look Like a Bronzed Goddess",
    artist: "Jackie Aina",
    artistNote: "Deep-skin bronze & highlight mastery",
    category: "contour",
    skinFocus: ["deep-brown", "afro-caribbean", "medium-warm"],
    duration: "20:37",
    level: "intermediate",
    description:
      "Ultimate bronzed goddess glow on deep brown skin — highlight that actually shows, bronze that never ashy.",
    youtubeId: "T_Wo9yiakY4",
    relatedProductSlugs: [
      "sun-sculpt-creme-bronzer",
      "edge-sculpt-contour-palette",
      "lumen-dry-body-oil",
      "lume-glass-lip-oil",
    ],
    tags: ["bronze", "deep skin", "glow", "goddess"],
  },
  {
    id: "t-jackie-snatched",
    title: "From Struggle to Snatched Makeup Tutorial",
    artist: "Jackie Aina",
    artistNote: "Full snatched glam for deep complexions",
    category: "full-face",
    skinFocus: ["deep-brown", "afro-caribbean"],
    duration: "18:00",
    level: "pro",
    description:
      "Full snatched glam built for deep skin — contour, colour, and finish that photographs rich and true.",
    youtubeId: "47l8Jml7kso",
    relatedProductSlugs: [
      "veil-soft-focus-foundation",
      "edge-sculpt-contour-palette",
      "glow-edit-full-face-set",
      "atelier-essential-brush-set",
    ],
    tags: ["snatched", "full glam", "deep skin", "contour"],
  },
  {
    id: "t-jackie-night",
    title: "Full Glam Night Out Makeup",
    artist: "Jackie Aina",
    artistNote: "Night-out glam for rich brown skin",
    category: "full-face",
    skinFocus: ["deep-brown", "afro-caribbean"],
    duration: "8:33",
    level: "intermediate",
    description:
      "Club-ready full glam — deep skin, high impact colour, lips that light up the room.",
    youtubeId: "3PW4sNYtBOY",
    relatedProductSlugs: [
      "lume-glass-lip-oil",
      "edge-sculpt-contour-palette",
      "veil-soft-focus-foundation",
    ],
    tags: ["night", "glam", "deep skin", "party"],
  },

  // ── Asian / East & Southeast Asian ─────────────────────
  {
    id: "t-tina-contour",
    title: "How to Contour for Beginners",
    artist: "Tina Yong",
    artistNote: "Asian face mapping · contour that flatters",
    category: "contour",
    skinFocus: ["asian", "light", "medium-warm"],
    duration: "10:00",
    level: "beginner",
    description:
      "Contour techniques that work on Asian bone structure — soft sculpture without muddying warm or light-medium undertones.",
    youtubeId: "4qsLJArkAe4",
    relatedProductSlugs: [
      "edge-sculpt-contour-palette",
      "sculpt-angle-contour-brush",
      "sun-sculpt-creme-bronzer",
    ],
    tags: ["Asian", "contour", "beginner", "face map"],
  },
  {
    id: "t-tina-daynight",
    title: "Contour for Day and Night",
    artist: "Tina Yong",
    artistNote: "Soft day vs defined night on Asian features",
    category: "contour",
    skinFocus: ["asian", "light", "medium-warm"],
    duration: "13:38",
    level: "intermediate",
    description:
      "Two contour intensities for day polish and night definition — tailored for Asian faces and warm-light undertones.",
    youtubeId: "QujqPIua_AQ",
    relatedProductSlugs: [
      "edge-sculpt-contour-palette",
      "sun-sculpt-creme-bronzer",
      "atelier-essential-brush-set",
    ],
    tags: ["Asian", "contour", "day", "night"],
  },
  {
    id: "t-tina-festival",
    title: "Easy Festival Makeup Tutorial",
    artist: "Tina Yong",
    artistNote: "Bright glam on Asian skin",
    category: "full-face",
    skinFocus: ["asian", "medium-warm"],
    duration: "8:49",
    level: "intermediate",
    description:
      "Festival-ready colour and glow on Asian skin — fun, feminine, camera-ready.",
    youtubeId: "xj8fSQq2yKg",
    relatedProductSlugs: [
      "lume-glass-lip-oil",
      "veil-soft-focus-foundation",
      "sun-sculpt-creme-bronzer",
    ],
    tags: ["Asian", "glam", "festival", "colour"],
  },
  {
    id: "t-tina-douyin",
    title: "Douyin Makeup Tutorial from a Pro",
    artist: "Tina Yong",
    artistNote: "East Asian soft glam technique",
    category: "full-face",
    skinFocus: ["asian", "light"],
    duration: "19:18",
    level: "intermediate",
    description:
      "Pro Douyin-inspired technique — lifted eyes, soft contour, glass-skin finish for Asian complexions.",
    youtubeId: "6Q1Tf7sUNzM",
    relatedProductSlugs: [
      "veil-soft-focus-foundation",
      "aura-illuminating-serum",
      "lume-glass-lip-oil",
    ],
    tags: ["Asian", "Douyin", "soft glam", "glass skin"],
  },

  // ── Hispanic / Latina / warm medium-tan ────────────────
  {
    id: "t-latina-soft",
    title: "Trying The Latina Makeup Tutorial",
    artist: "Beauty Life · women creators",
    artistNote: "Warm-tone glam · Hispanic-inspired looks",
    category: "full-face",
    skinFocus: ["hispanic", "medium-warm", "deep-brown"],
    duration: "22:09",
    level: "intermediate",
    description:
      "Latina-inspired soft snatched glam — warm bronze, defined brows, glossy lips on golden and medium-deep skin.",
    youtubeId: "lv6R20WgTlc",
    relatedProductSlugs: [
      "sun-sculpt-creme-bronzer",
      "edge-sculpt-contour-palette",
      "lume-glass-lip-oil",
      "veil-soft-focus-foundation",
    ],
    tags: ["Latina", "Hispanic", "warm tone", "glam"],
  },
  {
    id: "t-latina-full",
    title: "Latina Makeup Tutorial — Full Glam",
    artist: "Antonia Grigore",
    artistNote: "Warm golden skin · full feminine glam",
    category: "full-face",
    skinFocus: ["hispanic", "medium-warm"],
    duration: "20:23",
    level: "intermediate",
    description:
      "Full Latina glam walkthrough — bronzed skin, lifted eyes, juicy lips for warm and golden undertones.",
    youtubeId: "dIcMbszI70k",
    relatedProductSlugs: [
      "sun-sculpt-creme-bronzer",
      "lume-glass-lip-oil",
      "glow-edit-full-face-set",
    ],
    tags: ["Latina", "full glam", "bronze", "warm"],
  },

  // ── Universal women icons (still useful across tones) ─
  {
    id: "t-lisa-bronze",
    title: "Bronzed Contoured & Highlighted Makeup Look",
    artist: "Lisa Eldridge",
    artistNote: "Celebrity MUA · technique that scales to every tone",
    category: "contour",
    skinFocus: ["light", "medium-warm", "hispanic", "asian"],
    duration: "11:16",
    level: "intermediate",
    description:
      "Classic bronze, contour, and highlight — techniques you can adapt with deeper or warmer shades in our studio.",
    youtubeId: "D8g3orq4M7U",
    relatedProductSlugs: [
      "edge-sculpt-contour-palette",
      "sun-sculpt-creme-bronzer",
      "lumen-dry-body-oil",
    ],
    tags: ["bronze", "contour", "glow"],
  },
  {
    id: "t-lisa-blend",
    title: "This Hack Will Transform Your Makeup Instantly",
    artist: "Lisa Eldridge",
    artistNote: "Blending mastery for every complexion",
    category: "base",
    skinFocus: ["light", "medium-warm", "asian", "hispanic"],
    duration: "11:08",
    level: "intermediate",
    description:
      "Blending and base finesse — the polish that makes every undertone look expensive.",
    youtubeId: "mlSnP2HPjIs",
    relatedProductSlugs: [
      "veil-soft-focus-foundation",
      "cloud-bounce-beauty-sponge",
      "atelier-essential-brush-set",
    ],
    tags: ["blending", "base", "skin"],
  },
  {
    id: "t-lisa-nomakeup",
    title: "No Make-up Look Tutorial",
    artist: "Lisa Eldridge",
    artistNote: "Soft-skin finish · adaptable to all shades",
    category: "full-face",
    skinFocus: ["light", "medium-warm", "asian", "hispanic"],
    duration: "15:08",
    level: "beginner",
    description:
      "“Your skin but better” — sheer layers and glow you can build in any shade of Veil.",
    youtubeId: "oGpLLWnO3XY",
    relatedProductSlugs: [
      "veil-soft-focus-foundation",
      "lume-glass-lip-oil",
      "aura-illuminating-serum",
    ],
    tags: ["natural", "skin", "everyday", "glow"],
  },
];

export const SKIN_FOCUS_FILTERS: { id: SkinFocus; label: string }[] = [
  { id: "all", label: "All skin" },
  { id: "deep-brown", label: "Deep & brown" },
  { id: "afro-caribbean", label: "Afro-Caribbean" },
  { id: "asian", label: "Asian" },
  { id: "hispanic", label: "Hispanic & Latina" },
  { id: "medium-warm", label: "Medium & warm" },
  { id: "light", label: "Light" },
];

export const TUTORIAL_CATEGORIES: {
  id: TutorialCategory | "all";
  label: string;
}[] = [
  { id: "all", label: "All looks" },
  { id: "contour", label: "Contouring" },
  { id: "base", label: "Base & skin" },
  { id: "full-face", label: "Full face" },
  { id: "eyes", label: "Eyes" },
  { id: "lips", label: "Lips" },
  { id: "hair", label: "Hair" },
  { id: "tools", label: "Tools" },
];
