"use client";

import Link from "next/link";
import Image from "next/image";
import { GIFT_GUIDES } from "@/lib/concerns";
import { useCart } from "@/store/cart";
import { useT } from "@/lib/i18n/useT";

const PRICE: Record<string, { name: string; price: number; image: string }> = {
  "lumea-ritual-starter-set": {
    name: "Ritual Starter Set",
    price: 48,
    image: "/images/skincare-still.jpg",
  },
  "lume-glass-lip-oil": {
    name: "Lumé Glass Lip Oil",
    price: 24,
    image: "/images/product-gloss.jpg",
  },
  "glow-edit-full-face-set": {
    name: "Glow Edit Full Face Set",
    price: 98,
    image: "/images/product-giftset.jpg",
  },
  "atelier-essential-brush-set": {
    name: "Atelier Brush Set",
    price: 68,
    image: "/images/product-brushes.jpg",
  },
  "hair-ritual-cleanse-treat-set": {
    name: "Hair Ritual Set",
    price: 88,
    image: "/images/product-giftset.jpg",
  },
  "coil-define-curl-cream": {
    name: "Coil Define Curl Cream",
    price: 32,
    image: "/images/product-hairmask.jpg",
  },
  "body-spa-soft-set": {
    name: "Body Spa Soft Set",
    price: 92,
    image: "/images/product-giftset.jpg",
  },
  "velvet-hand-creme": {
    name: "Velvet Hand Crème",
    price: 18,
    image: "/images/product-bodycream.jpg",
  },
  "veil-soft-focus-foundation": {
    name: "Veil Foundation",
    price: 42,
    image: "/images/product-foundation.jpg",
  },
  "edge-sculpt-contour-palette": {
    name: "Edge Sculpt Contour",
    price: 46,
    image: "/images/product-contour.jpg",
  },
  "pro-tool-starter-kit": {
    name: "Pro Tool Kit",
    price: 79,
    image: "/images/product-brushes.jpg",
  },
  "cloud-bounce-beauty-sponge": {
    name: "Cloud Bounce Sponge",
    price: 16,
    image: "/images/product-sponge.jpg",
  },
};

export default function GiftsPage() {
  const { formatPrice } = useT();
  const addItem = useCart((s) => s.addItem);

  function addGuide(slugs: string[]) {
    slugs.forEach((slug) => {
      const p = PRICE[slug];
      if (!p) return;
      addItem({
        productId: slug,
        variantId: `${slug}-g`,
        slug,
        name: p.name,
        variantName: "Gift",
        sku: slug.slice(0, 10).toUpperCase(),
        price: p.price,
        image: p.image,
        maxStock: 30,
      });
    });
  }

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-12 md:px-8 md:py-16">
      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted">
        Gift finder
      </p>
      <h1 className="mt-2 font-display text-5xl tracking-tight md:text-6xl">
        Gifts she’ll actually use.
      </h1>
      <p className="mt-3 max-w-xl text-sm text-muted">
        Curated for first-timers, glam queens, hair healers, deep-skin icons, and
        spa nights — ready to bag.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {GIFT_GUIDES.map((g) => {
          const total = g.slugs.reduce(
            (s, slug) => s + (PRICE[slug]?.price || 0),
            0
          );
          return (
            <article
              key={g.id}
              className="flex flex-col overflow-hidden border border-line bg-surface"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={g.image}
                  alt={g.title}
                  fill
                  className="object-cover"
                  sizes="33vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[10px] uppercase tracking-[0.14em] text-champagne">
                  {g.budget}
                </p>
                <h2 className="mt-1 font-display text-2xl">{g.title}</h2>
                <p className="mt-2 text-sm text-muted">{g.body}</p>
                <ul className="mt-4 space-y-1 text-xs text-ink-soft">
                  {g.slugs.map((slug) => (
                    <li key={slug}>
                      <Link
                        href={`/product/${slug}`}
                        className="hover:underline"
                      >
                        · {PRICE[slug]?.name || slug}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex items-center justify-between pt-5">
                  <span className="font-display text-2xl">
                    {formatPrice(total)}
                  </span>
                  <button
                    onClick={() => addGuide(g.slugs)}
                    className="bg-ink px-4 py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-ivory"
                  >
                    Add gift set
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
