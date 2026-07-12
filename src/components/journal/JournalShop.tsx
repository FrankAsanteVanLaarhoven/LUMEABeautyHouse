"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { useT } from "@/lib/i18n/useT";

const META: Record<string, { name: string; price: number; image: string }> = {
  "veil-soft-focus-foundation": {
    name: "Veil Foundation",
    price: 42,
    image: "/images/product-foundation.jpg",
  },
  "lume-glass-lip-oil": {
    name: "Lumé Glass Lip Oil",
    price: 24,
    image: "/images/product-gloss.jpg",
  },
  "aura-illuminating-serum": {
    name: "Aura Serum",
    price: 58,
    image: "/images/skincare-still.jpg",
  },
  "coil-define-curl-cream": {
    name: "Coil Define Cream",
    price: 32,
    image: "/images/product-hairmask.jpg",
  },
  "repair-cloud-hair-mask": {
    name: "Repair Cloud Mask",
    price: 38,
    image: "/images/product-hairmask.jpg",
  },
  "flux-9-in-1-hair-oil": {
    name: "Flux Hair Oil",
    price: 32,
    image: "/images/product-hairoil.jpg",
  },
  "hair-ritual-cleanse-treat-set": {
    name: "Hair Ritual Set",
    price: 88,
    image: "/images/product-giftset.jpg",
  },
  "sun-sculpt-creme-bronzer": {
    name: "Sun Sculpt Bronzer",
    price: 34,
    image: "/images/product-bronzer.jpg",
  },
  "edge-sculpt-contour-palette": {
    name: "Edge Sculpt Contour",
    price: 46,
    image: "/images/product-contour.jpg",
  },
  "glow-edit-full-face-set": {
    name: "Glow Edit Set",
    price: 98,
    image: "/images/product-giftset.jpg",
  },
  "lumea-ritual-starter-set": {
    name: "Ritual Starter Set",
    price: 48,
    image: "/images/skincare-still.jpg",
  },
  "pro-tool-starter-kit": {
    name: "Pro Tool Kit",
    price: 79,
    image: "/images/product-brushes.jpg",
  },
};

export function JournalShop({
  slugs,
  brandSlug,
}: {
  slugs: string[];
  brandSlug?: string;
}) {
  const { formatPrice } = useT();
  const addItem = useCart((s) => s.addItem);

  return (
    <aside className="h-fit border border-line bg-surface p-5 lg:sticky lg:top-36">
      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
        Shop the story
      </p>
      <ul className="mt-4 space-y-3">
        {slugs.map((slug) => {
          const p = META[slug];
          if (!p) return null;
          return (
            <li key={slug} className="flex gap-3">
              <div className="relative h-16 w-12 shrink-0 overflow-hidden bg-ivory-deep">
                <Image src={p.image} alt="" fill className="object-cover" sizes="48px" />
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/product/${slug}`} className="text-sm font-medium hover:underline">
                  {p.name}
                </Link>
                <p className="text-xs text-muted">{formatPrice(p.price)}</p>
                <button
                  type="button"
                  className="mt-1 text-[10px] uppercase tracking-[0.1em] underline"
                  onClick={() => {
                    addItem({
                      productId: slug,
                      variantId: `${slug}-journal`,
                      slug,
                      name: p.name,
                      variantName: "Journal",
                      sku: slug.slice(0, 10).toUpperCase(),
                      price: p.price,
                      image: p.image,
                      maxStock: 40,
                    });
                    if (brandSlug) {
                      fetch("/api/analytics/track", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          brandSlug,
                          type: "add_to_bag",
                          productSlug: slug,
                          meta: "journal",
                        }),
                      }).catch(() => {});
                    }
                  }}
                >
                  Add
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
