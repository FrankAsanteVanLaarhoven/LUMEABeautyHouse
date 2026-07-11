export type QuizTrack = "skin" | "hair" | "full";

export interface QuizOption {
  id: string;
  label: string;
  hint?: string;
  tags: string[];
}

export interface QuizQuestion {
  id: string;
  track: QuizTrack | "both";
  title: string;
  subtitle?: string;
  options: QuizOption[];
}

export interface QuizResult {
  title: string;
  summary: string;
  skinDepth?: string;
  undertone?: string;
  skinType?: string;
  hairType?: string;
  concerns: string[];
  productSlugs: string[];
  routineHint: string;
  matchScore: number;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "goal",
    track: "both",
    title: "What do you want most right now?",
    subtitle: "Be honest — we’ll build around your real life.",
    options: [
      { id: "glow", label: "Glowing, glass skin", tags: ["glow", "serum", "illuminate"] },
      { id: "even", label: "Even tone & coverage", tags: ["foundation", "coverage", "base"] },
      { id: "hair-soft", label: "Soft, healthy hair", tags: ["hair", "repair", "moisture"] },
      { id: "defined", label: "Defined curls / coils", tags: ["curl", "define", "hair"] },
      { id: "sculpt", label: "Sculpted face", tags: ["contour", "bronze", "structure"] },
      { id: "full", label: "Full beauty ritual", tags: ["set", "ritual", "full"] },
    ],
  },
  {
    id: "skin-depth",
    track: "skin",
    title: "How would you describe your skin depth?",
    options: [
      { id: "fair", label: "Fair / light", tags: ["depth:fair"] },
      { id: "light-med", label: "Light–medium", tags: ["depth:light"] },
      { id: "medium", label: "Medium / golden", tags: ["depth:medium", "warm"] },
      { id: "tan", label: "Tan / deep golden", tags: ["depth:tan", "warm", "hispanic"] },
      { id: "deep", label: "Deep brown", tags: ["depth:deep", "deep-skin"] },
      { id: "rich", label: "Rich / deepest", tags: ["depth:rich", "deep-skin", "afro"] },
    ],
  },
  {
    id: "undertone",
    track: "skin",
    title: "Your undertone?",
    subtitle: "Veins, jewellery, or what flatters you most.",
    options: [
      { id: "cool", label: "Cool (pink / blue)", tags: ["under:cool"] },
      { id: "warm", label: "Warm (golden / peach)", tags: ["under:warm"] },
      { id: "neutral", label: "Neutral", tags: ["under:neutral"] },
      { id: "olive", label: "Olive", tags: ["under:olive", "under:warm"] },
    ],
  },
  {
    id: "skin-type",
    track: "skin",
    title: "Skin type right now?",
    options: [
      { id: "dry", label: "Dry / tight", tags: ["type:dry", "moisture"] },
      { id: "oily", label: "Oily / shiny T-zone", tags: ["type:oily", "balance"] },
      { id: "combo", label: "Combination", tags: ["type:combination"] },
      { id: "normal", label: "Normal / balanced", tags: ["type:normal"] },
      { id: "sensitive", label: "Sensitive / reactive", tags: ["type:sensitive", "calm"] },
    ],
  },
  {
    id: "skin-concern",
    track: "skin",
    title: "Biggest skin concern?",
    options: [
      { id: "dull", label: "Dullness", tags: ["glow", "serum"] },
      { id: "texture", label: "Texture / pores", tags: ["smooth", "base"] },
      { id: "dryness", label: "Dryness", tags: ["moisture", "cream"] },
      { id: "oil", label: "Oil control", tags: ["balance", "cleanse"] },
      { id: "aging", label: "Fine lines", tags: ["repair", "night"] },
      { id: "even", label: "Uneven tone", tags: ["coverage", "foundation"] },
    ],
  },
  {
    id: "hair-type",
    track: "hair",
    title: "Your hair texture?",
    options: [
      { id: "straight", label: "Straight (1A–1C)", tags: ["hair:straight", "shine", "oil-light"] },
      { id: "wavy", label: "Wavy (2A–2C)", tags: ["hair:wavy", "define", "frizz"] },
      { id: "curly", label: "Curly (3A–3C)", tags: ["hair:curly", "curl", "moisture"] },
      { id: "coily", label: "Coily / kinky (4A–4C)", tags: ["hair:coily", "curl", "repair", "moisture"] },
    ],
  },
  {
    id: "hair-concern",
    track: "hair",
    title: "Hair goal?",
    options: [
      { id: "moisture", label: "More moisture", tags: ["moisture", "mask", "cream"] },
      { id: "repair", label: "Repair damage", tags: ["repair", "mask", "bond"] },
      { id: "frizz", label: "Tame frizz", tags: ["frizz", "oil", "cream"] },
      { id: "volume", label: "Root lift / volume", tags: ["volume", "dry-shampoo"] },
      { id: "definition", label: "Curl definition", tags: ["curl", "define"] },
      { id: "shine", label: "Shine without grease", tags: ["shine", "oil-light"] },
    ],
  },
  {
    id: "vibe",
    track: "both",
    title: "Your everyday vibe?",
    options: [
      { id: "clean", label: "Clean girl / soft", tags: ["natural", "minimal", "serum"] },
      { id: "glam", label: "Soft glam always", tags: ["glam", "contour", "lips"] },
      { id: "bold", label: "Bold & snatched", tags: ["contour", "full", "glam"] },
      { id: "ritual", label: "Skincare-first ritual", tags: ["ritual", "serum", "cleanse"] },
    ],
  },
];

/** Map tags → product slugs in catalogue */
const TAG_PRODUCTS: Record<string, string[]> = {
  foundation: ["veil-soft-focus-foundation"],
  coverage: ["veil-soft-focus-foundation"],
  base: ["veil-soft-focus-foundation", "cloud-bounce-beauty-sponge"],
  glow: ["aura-illuminating-serum", "lumen-dry-body-oil"],
  illuminate: ["aura-illuminating-serum"],
  serum: ["aura-illuminating-serum"],
  contour: ["edge-sculpt-contour-palette", "sculpt-angle-contour-brush"],
  bronze: ["sun-sculpt-creme-bronzer"],
  structure: ["edge-sculpt-contour-palette"],
  lips: ["lume-glass-lip-oil", "tint-balm-moisture-barrier"],
  moisture: ["silk-veil-body-creme", "repair-cloud-hair-mask", "coil-define-curl-cream"],
  cream: ["silk-veil-body-creme", "coil-define-curl-cream"],
  cleanse: ["clean-canvas-gel-cleanser", "clean-shine-balancing-shampoo"],
  balance: ["clean-canvas-gel-cleanser", "clean-shine-balancing-shampoo"],
  repair: ["repair-cloud-hair-mask", "flux-9-in-1-hair-oil", "night-restore-sleeping-mask"],
  night: ["night-restore-sleeping-mask"],
  hair: ["clean-shine-balancing-shampoo", "silk-slip-conditioner", "flux-9-in-1-hair-oil"],
  curl: ["coil-define-curl-cream", "flux-9-in-1-hair-oil"],
  define: ["coil-define-curl-cream"],
  frizz: ["flux-9-in-1-hair-oil", "coil-define-curl-cream"],
  shine: ["flux-9-in-1-hair-oil"],
  "oil-light": ["flux-9-in-1-hair-oil"],
  volume: ["air-lift-dry-shampoo"],
  "dry-shampoo": ["air-lift-dry-shampoo"],
  mask: ["repair-cloud-hair-mask"],
  bond: ["repair-cloud-hair-mask"],
  set: ["glow-edit-full-face-set", "lumea-ritual-starter-set", "hair-ritual-cleanse-treat-set"],
  ritual: ["lumea-ritual-starter-set", "hair-ritual-cleanse-treat-set"],
  full: ["glow-edit-full-face-set", "pro-tool-starter-kit"],
  glam: ["glow-edit-full-face-set", "lume-glass-lip-oil"],
  natural: ["tint-balm-moisture-barrier", "aura-illuminating-serum"],
  minimal: ["tint-balm-moisture-barrier", "clean-canvas-gel-cleanser"],
  smooth: ["clean-canvas-gel-cleanser", "veil-soft-focus-foundation"],
  tools: ["atelier-essential-brush-set", "cloud-bounce-beauty-sponge"],
  "deep-skin": ["veil-soft-focus-foundation", "edge-sculpt-contour-palette"],
  afro: ["coil-define-curl-cream", "repair-cloud-hair-mask", "flux-9-in-1-hair-oil"],
  hispanic: ["sun-sculpt-creme-bronzer", "lume-glass-lip-oil"],
  warm: ["sun-sculpt-creme-bronzer"],
};

export function scoreQuiz(answers: Record<string, string>): QuizResult {
  const tags: string[] = [];
  const concerns: string[] = [];
  let skinDepth = "";
  let undertone = "";
  let skinType = "";
  let hairType = "";

  for (const q of QUIZ_QUESTIONS) {
    const optId = answers[q.id];
    if (!optId) continue;
    const opt = q.options.find((o) => o.id === optId);
    if (!opt) continue;
    tags.push(...opt.tags);
    if (q.id === "skin-depth") skinDepth = opt.label;
    if (q.id === "undertone") undertone = opt.label;
    if (q.id === "skin-type") skinType = opt.label;
    if (q.id === "hair-type") hairType = opt.label;
    if (q.id === "skin-concern" || q.id === "hair-concern") {
      concerns.push(opt.label);
    }
  }

  const slugScores = new Map<string, number>();
  for (const tag of tags) {
    const pure = tag.includes(":") ? tag.split(":")[1] : tag;
    const list = TAG_PRODUCTS[tag] || TAG_PRODUCTS[pure] || [];
    for (const slug of list) {
      slugScores.set(slug, (slugScores.get(slug) || 0) + 1);
    }
  }

  // Boost essentials
  if (tags.some((t) => t.startsWith("depth:") || t.startsWith("under:"))) {
    slugScores.set(
      "veil-soft-focus-foundation",
      (slugScores.get("veil-soft-focus-foundation") || 0) + 2
    );
  }

  const ranked = [...slugScores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([slug]) => slug)
    .slice(0, 6);

  if (ranked.length < 3) {
    ranked.push(
      "veil-soft-focus-foundation",
      "aura-illuminating-serum",
      "flux-9-in-1-hair-oil"
    );
  }

  const unique = [...new Set(ranked)].slice(0, 6);
  const max = Math.max(...[...slugScores.values(), 1]);
  const matchScore = Math.min(
    98,
    72 + Math.round((max / Math.max(tags.length, 1)) * 20)
  );

  const hasHair = tags.some(
    (t) => t.startsWith("hair:") || ["curl", "repair", "frizz", "volume"].includes(t)
  );
  const hasSkin = tags.some(
    (t) =>
      t.startsWith("type:") ||
      t.startsWith("depth:") ||
      ["glow", "foundation", "contour"].includes(t)
  );

  let title = "Your LUMÉA edit";
  if (hasHair && hasSkin) title = "Your full beauty match";
  else if (hasHair) title = "Your hair ritual match";
  else if (hasSkin) title = "Your skin & makeup match";

  const summaryParts = [
    skinDepth && `Skin depth: ${skinDepth}`,
    undertone && `Undertone: ${undertone}`,
    skinType && `Type: ${skinType}`,
    hairType && `Hair: ${hairType}`,
  ].filter(Boolean);

  return {
    title,
    summary:
      summaryParts.join(" · ") ||
      "Personalised picks based on your goals and vibe.",
    skinDepth,
    undertone,
    skinType,
    hairType,
    concerns,
    productSlugs: unique,
    routineHint: hasHair
      ? "Cleanse → condition → weekly mask → oil on ends. Define curls while damp."
      : "Cleanse → Aura serum → Veil foundation → sculpt → lips. Night: restore mask.",
    matchScore,
  };
}

export function questionsForTrack(track: QuizTrack): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter((q) => {
    if (q.track === "both") return true;
    if (track === "full") return q.track === "skin" || q.track === "hair";
    return q.track === track;
  });
}
