export type ShadeUndertone = "cool" | "warm" | "neutral" | "olive";
export type ShadeCategory = "foundation" | "lips" | "bronzer" | "contour";

export interface ShadeOption {
  id: string;
  productId: string;
  slug: string;
  productName: string;
  name: string;
  hex: string;
  price: number;
  sku: string;
  stock: number;
  image: string;
  /** 0 = deepest, 1 = lightest */
  depth: number;
  undertone: ShadeUndertone;
  kind: ShadeCategory;
}

export const SHADES: ShadeOption[] = [
  // Foundation — extended range for selfie match
  { id: "LM-VEIL-v1", productId: "p-veil-foundation", slug: "veil-soft-focus-foundation", productName: "Veil Soft-Focus Foundation", name: "Porcelain 01C", hex: "#F5E6D8", price: 42, sku: "LM-VEIL-01", stock: 42, image: "/images/product-foundation.jpg", depth: 0.92, undertone: "cool", kind: "foundation" },
  { id: "LM-VEIL-v2", productId: "p-veil-foundation", slug: "veil-soft-focus-foundation", productName: "Veil Soft-Focus Foundation", name: "Ivory 05N", hex: "#EED9C4", price: 42, sku: "LM-VEIL-02", stock: 38, image: "/images/product-foundation.jpg", depth: 0.86, undertone: "neutral", kind: "foundation" },
  { id: "LM-VEIL-v2b", productId: "p-veil-foundation", slug: "veil-soft-focus-foundation", productName: "Veil Soft-Focus Foundation", name: "Almond 08W", hex: "#E8C9A8", price: 42, sku: "LM-VEIL-08W", stock: 40, image: "/images/product-foundation.jpg", depth: 0.82, undertone: "warm", kind: "foundation" },
  { id: "LM-VEIL-v3", productId: "p-veil-foundation", slug: "veil-soft-focus-foundation", productName: "Veil Soft-Focus Foundation", name: "Sand 12W", hex: "#E0C3A8", price: 42, sku: "LM-VEIL-03", stock: 55, image: "/images/product-foundation.jpg", depth: 0.78, undertone: "warm", kind: "foundation" },
  { id: "LM-VEIL-v3b", productId: "p-veil-foundation", slug: "veil-soft-focus-foundation", productName: "Veil Soft-Focus Foundation", name: "Olive 14O", hex: "#C9B08A", price: 42, sku: "LM-VEIL-14O", stock: 36, image: "/images/product-foundation.jpg", depth: 0.7, undertone: "olive", kind: "foundation" },
  { id: "LM-VEIL-v4", productId: "p-veil-foundation", slug: "veil-soft-focus-foundation", productName: "Veil Soft-Focus Foundation", name: "Honey 18N", hex: "#C99B72", price: 42, sku: "LM-VEIL-04", stock: 61, image: "/images/product-foundation.jpg", depth: 0.62, undertone: "neutral", kind: "foundation" },
  { id: "LM-VEIL-v4b", productId: "p-veil-foundation", slug: "veil-soft-focus-foundation", productName: "Veil Soft-Focus Foundation", name: "Caramel 20W", hex: "#B88458", price: 42, sku: "LM-VEIL-20W", stock: 50, image: "/images/product-foundation.jpg", depth: 0.55, undertone: "warm", kind: "foundation" },
  { id: "LM-VEIL-v5", productId: "p-veil-foundation", slug: "veil-soft-focus-foundation", productName: "Veil Soft-Focus Foundation", name: "Amber 24W", hex: "#A8704A", price: 42, sku: "LM-VEIL-05", stock: 48, image: "/images/product-foundation.jpg", depth: 0.48, undertone: "warm", kind: "foundation" },
  { id: "LM-VEIL-v5b", productId: "p-veil-foundation", slug: "veil-soft-focus-foundation", productName: "Veil Soft-Focus Foundation", name: "Sienna 28C", hex: "#8F5A3C", price: 42, sku: "LM-VEIL-28C", stock: 42, image: "/images/product-foundation.jpg", depth: 0.4, undertone: "cool", kind: "foundation" },
  { id: "LM-VEIL-v6", productId: "p-veil-foundation", slug: "veil-soft-focus-foundation", productName: "Veil Soft-Focus Foundation", name: "Cocoa 32N", hex: "#7A4A32", price: 42, sku: "LM-VEIL-06", stock: 44, image: "/images/product-foundation.jpg", depth: 0.32, undertone: "neutral", kind: "foundation" },
  { id: "LM-VEIL-v6b", productId: "p-veil-foundation", slug: "veil-soft-focus-foundation", productName: "Veil Soft-Focus Foundation", name: "Mahogany 36W", hex: "#5E3524", price: 42, sku: "LM-VEIL-36W", stock: 38, image: "/images/product-foundation.jpg", depth: 0.26, undertone: "warm", kind: "foundation" },
  { id: "LM-VEIL-v7", productId: "p-veil-foundation", slug: "veil-soft-focus-foundation", productName: "Veil Soft-Focus Foundation", name: "Espresso 40C", hex: "#4A2C1E", price: 42, sku: "LM-VEIL-07", stock: 36, image: "/images/product-foundation.jpg", depth: 0.2, undertone: "cool", kind: "foundation" },
  { id: "LM-VEIL-v7b", productId: "p-veil-foundation", slug: "veil-soft-focus-foundation", productName: "Veil Soft-Focus Foundation", name: "Truffle 44N", hex: "#3A2218", price: 42, sku: "LM-VEIL-44N", stock: 32, image: "/images/product-foundation.jpg", depth: 0.16, undertone: "neutral", kind: "foundation" },
  { id: "LM-VEIL-v8", productId: "p-veil-foundation", slug: "veil-soft-focus-foundation", productName: "Veil Soft-Focus Foundation", name: "Obsidian 48N", hex: "#2E1A12", price: 42, sku: "LM-VEIL-08", stock: 29, image: "/images/product-foundation.jpg", depth: 0.12, undertone: "neutral", kind: "foundation" },
  // Lips
  { id: "LM-GLASS-v1", productId: "p-lume-gloss", slug: "lume-glass-lip-oil", productName: "Lumé Glass Lip Oil", name: "Nude Prism", hex: "#E8C4B8", price: 24, sku: "LM-GLASS-01", stock: 72, image: "/images/product-gloss.jpg", depth: 0.8, undertone: "neutral", kind: "lips" },
  { id: "LM-GLASS-v2", productId: "p-lume-gloss", slug: "lume-glass-lip-oil", productName: "Lumé Glass Lip Oil", name: "Rose Quartz", hex: "#E8A0A8", price: 24, sku: "LM-GLASS-02", stock: 88, image: "/images/product-gloss.jpg", depth: 0.7, undertone: "cool", kind: "lips" },
  { id: "LM-GLASS-v3", productId: "p-lume-gloss", slug: "lume-glass-lip-oil", productName: "Lumé Glass Lip Oil", name: "Coral Signal", hex: "#E87868", price: 24, sku: "LM-GLASS-03", stock: 64, image: "/images/product-gloss.jpg", depth: 0.6, undertone: "warm", kind: "lips" },
  { id: "LM-GLASS-v4", productId: "p-lume-gloss", slug: "lume-glass-lip-oil", productName: "Lumé Glass Lip Oil", name: "Berry Static", hex: "#A82848", price: 24, sku: "LM-GLASS-04", stock: 52, image: "/images/product-gloss.jpg", depth: 0.45, undertone: "cool", kind: "lips" },
  { id: "LM-GLASS-v5", productId: "p-lume-gloss", slug: "lume-glass-lip-oil", productName: "Lumé Glass Lip Oil", name: "Cherry Static", hex: "#C82838", price: 24, sku: "LM-GLASS-05", stock: 47, image: "/images/product-gloss.jpg", depth: 0.4, undertone: "cool", kind: "lips" },
  // Bronzer
  { id: "LM-SUN-v1", productId: "p-sun-sculpt", slug: "sun-sculpt-creme-bronzer", productName: "Sun Sculpt Crème Bronzer", name: "Soft Solstice", hex: "#D4A888", price: 34, sku: "LM-SUN-01", stock: 58, image: "/images/product-bronzer.jpg", depth: 0.72, undertone: "warm", kind: "bronzer" },
  { id: "LM-SUN-v2", productId: "p-sun-sculpt", slug: "sun-sculpt-creme-bronzer", productName: "Sun Sculpt Crème Bronzer", name: "Maple Light", hex: "#C48858", price: 34, sku: "LM-SUN-02", stock: 72, image: "/images/product-bronzer.jpg", depth: 0.55, undertone: "warm", kind: "bronzer" },
  { id: "LM-SUN-v3", productId: "p-sun-sculpt", slug: "sun-sculpt-creme-bronzer", productName: "Sun Sculpt Crème Bronzer", name: "Toasted Clay", hex: "#9A6038", price: 34, sku: "LM-SUN-03", stock: 44, image: "/images/product-bronzer.jpg", depth: 0.4, undertone: "warm", kind: "bronzer" },
  { id: "LM-SUN-v4", productId: "p-sun-sculpt", slug: "sun-sculpt-creme-bronzer", productName: "Sun Sculpt Crème Bronzer", name: "Deep Ember", hex: "#7A4828", price: 34, sku: "LM-SUN-04", stock: 38, image: "/images/product-bronzer.jpg", depth: 0.3, undertone: "warm", kind: "bronzer" },
  // Contour
  { id: "LM-EDGE-v1", productId: "p-contour-sculpt", slug: "edge-sculpt-contour-palette", productName: "Edge Sculpt Contour", name: "Fair Sculpt", hex: "#C4A088", price: 46, sku: "LM-EDGE-01", stock: 48, image: "/images/product-contour.jpg", depth: 0.75, undertone: "cool", kind: "contour" },
  { id: "LM-EDGE-v2", productId: "p-contour-sculpt", slug: "edge-sculpt-contour-palette", productName: "Edge Sculpt Contour", name: "Medium Carve", hex: "#A07850", price: 46, sku: "LM-EDGE-02", stock: 62, image: "/images/product-contour.jpg", depth: 0.55, undertone: "warm", kind: "contour" },
  { id: "LM-EDGE-v3", productId: "p-contour-sculpt", slug: "edge-sculpt-contour-palette", productName: "Edge Sculpt Contour", name: "Deep Define", hex: "#6A4428", price: 46, sku: "LM-EDGE-03", stock: 40, image: "/images/product-contour.jpg", depth: 0.32, undertone: "neutral", kind: "contour" },
  { id: "LM-EDGE-v4", productId: "p-contour-sculpt", slug: "edge-sculpt-contour-palette", productName: "Edge Sculpt Contour", name: "Rich Structure", hex: "#3E2418", price: 46, sku: "LM-EDGE-04", stock: 34, image: "/images/product-contour.jpg", depth: 0.18, undertone: "cool", kind: "contour" },
];

export function pickBestShade(
  targetDepth: number,
  under: ShadeUndertone,
  kind: ShadeCategory = "foundation"
) {
  const pool = SHADES.filter((s) => s.kind === kind);
  const ranked = pool
    .map((s) => {
      const depthScore = 1 - Math.min(1, Math.abs(s.depth - targetDepth) * 2.2);
      const underScore =
        s.undertone === under
          ? 1
          : under === "neutral" || s.undertone === "neutral"
            ? 0.72
            : under === "olive" && s.undertone === "warm"
              ? 0.7
              : 0.42;
      return { shade: s, score: depthScore * 0.68 + underScore * 0.32 };
    })
    .sort((a, b) => b.score - a.score);
  return ranked;
}

export function depthLabelFromLum(lum: number) {
  if (lum > 0.85) return "fair";
  if (lum > 0.75) return "light";
  if (lum > 0.55) return "medium";
  if (lum > 0.4) return "tan";
  if (lum > 0.22) return "deep";
  return "rich";
}
