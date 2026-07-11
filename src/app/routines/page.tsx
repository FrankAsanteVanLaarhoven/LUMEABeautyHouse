"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/store/cart";
import { useBrowse } from "@/store/browse";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/useT";

type RitualId = "am-skin" | "pm-skin" | "hair-coily" | "hair-damage" | "glam";

interface Step {
  order: number;
  label: string;
  slug: string;
  name: string;
  image: string;
  price: number;
}

const RITUALS: Record<
  RitualId,
  { title: string; body: string; steps: Step[] }
> = {
  "am-skin": {
    title: "AM glass skin",
    body: "Cleanse → illuminate → veil → lips. 5 minutes that look like 50.",
    steps: [
      {
        order: 1,
        label: "Cleanse",
        slug: "clean-canvas-gel-cleanser",
        name: "Clean Canvas Gel Cleanser",
        image: "/images/skincare-still.jpg",
        price: 28,
      },
      {
        order: 2,
        label: "Serum",
        slug: "aura-illuminating-serum",
        name: "Aura Illuminating Serum",
        image: "/images/skincare-still.jpg",
        price: 58,
      },
      {
        order: 3,
        label: "Foundation",
        slug: "veil-soft-focus-foundation",
        name: "Veil Soft-Focus Foundation",
        image: "/images/product-foundation.jpg",
        price: 42,
      },
      {
        order: 4,
        label: "Lips",
        slug: "lume-glass-lip-oil",
        name: "Lumé Glass Lip Oil",
        image: "/images/product-gloss.jpg",
        price: 24,
      },
    ],
  },
  "pm-skin": {
    title: "PM restore",
    body: "Melt the day off. Feed the barrier. Wake up glass.",
    steps: [
      {
        order: 1,
        label: "Cleanse",
        slug: "clean-canvas-gel-cleanser",
        name: "Clean Canvas Gel Cleanser",
        image: "/images/skincare-still.jpg",
        price: 28,
      },
      {
        order: 2,
        label: "Treat",
        slug: "aura-illuminating-serum",
        name: "Aura Illuminating Serum",
        image: "/images/skincare-still.jpg",
        price: 58,
      },
      {
        order: 3,
        label: "Night mask",
        slug: "night-restore-sleeping-mask",
        name: "Night Restore Sleeping Mask",
        image: "/images/product-bodycream.jpg",
        price: 52,
      },
    ],
  },
  "hair-coily": {
    title: "Coils & 4C moisture",
    body: "Cleanse gently → deep treat → define → seal. Pattern respect.",
    steps: [
      {
        order: 1,
        label: "Cleanse",
        slug: "clean-shine-balancing-shampoo",
        name: "Clean Shine Balancing Shampoo",
        image: "/images/product-haircare.jpg",
        price: 28,
      },
      {
        order: 2,
        label: "Mask",
        slug: "repair-cloud-hair-mask",
        name: "Repair Cloud Hair Mask",
        image: "/images/product-hairmask.jpg",
        price: 38,
      },
      {
        order: 3,
        label: "Define",
        slug: "coil-define-curl-cream",
        name: "Coil Define Curl Cream",
        image: "/images/product-hairmask.jpg",
        price: 32,
      },
      {
        order: 4,
        label: "Seal",
        slug: "flux-9-in-1-hair-oil",
        name: "Flux 9-in-1 Hair Oil",
        image: "/images/product-hairoil.jpg",
        price: 32,
      },
    ],
  },
  "hair-damage": {
    title: "Repair ritual",
    body: "Bond-minded recovery for heat, colour, and breakage.",
    steps: [
      {
        order: 1,
        label: "Cleanse",
        slug: "clean-shine-balancing-shampoo",
        name: "Clean Shine Shampoo",
        image: "/images/product-haircare.jpg",
        price: 28,
      },
      {
        order: 2,
        label: "Condition",
        slug: "silk-slip-conditioner",
        name: "Silk Slip Conditioner",
        image: "/images/product-haircare.jpg",
        price: 30,
      },
      {
        order: 3,
        label: "Mask",
        slug: "repair-cloud-hair-mask",
        name: "Repair Cloud Hair Mask",
        image: "/images/product-hairmask.jpg",
        price: 38,
      },
      {
        order: 4,
        label: "Oil",
        slug: "flux-9-in-1-hair-oil",
        name: "Flux 9-in-1 Hair Oil",
        image: "/images/product-hairoil.jpg",
        price: 32,
      },
    ],
  },
  glam: {
    title: "Soft glam face",
    body: "Base → sculpt → bronze → glass lip. Studio-proven order.",
    steps: [
      {
        order: 1,
        label: "Base",
        slug: "veil-soft-focus-foundation",
        name: "Veil Foundation",
        image: "/images/product-foundation.jpg",
        price: 42,
      },
      {
        order: 2,
        label: "Sculpt",
        slug: "edge-sculpt-contour-palette",
        name: "Edge Sculpt Contour",
        image: "/images/product-contour.jpg",
        price: 46,
      },
      {
        order: 3,
        label: "Bronze",
        slug: "sun-sculpt-creme-bronzer",
        name: "Sun Sculpt Bronzer",
        image: "/images/product-bronzer.jpg",
        price: 34,
      },
      {
        order: 4,
        label: "Lips",
        slug: "lume-glass-lip-oil",
        name: "Lumé Glass Lip Oil",
        image: "/images/product-gloss.jpg",
        price: 24,
      },
      {
        order: 5,
        label: "Tools",
        slug: "atelier-essential-brush-set",
        name: "Atelier Brush Set",
        image: "/images/product-brushes.jpg",
        price: 68,
      },
    ],
  },
};

export default function RoutinesPage() {
  const { formatPrice } = useT();
  const [ritual, setRitual] = useState<RitualId>("am-skin");
  const addItem = useCart((s) => s.addItem);
  const addLoyalty = useBrowse((s) => s.addLoyalty);
  const current = RITUALS[ritual];
  const total = useMemo(
    () => current.steps.reduce((s, x) => s + x.price, 0),
    [current]
  );

  function addAll() {
    current.steps.forEach((s) => {
      addItem({
        productId: s.slug,
        variantId: `${s.slug}-r`,
        slug: s.slug,
        name: s.name,
        variantName: s.label,
        sku: s.slug.slice(0, 10).toUpperCase(),
        price: s.price,
        image: s.image,
        maxStock: 40,
      });
    });
    addLoyalty(25, "Full ritual bag");
  }

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-12 md:px-8 md:py-16">
      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted">
        Rituals
      </p>
      <h1 className="mt-2 font-display text-5xl tracking-tight">
        Build your routine
      </h1>
      <p className="mt-3 max-w-xl text-sm text-muted">
        Step-by-step skin and hair rituals — add the full stack in one tap.
        Coils, damage, glam, AM glass, PM restore.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {(
          [
            ["am-skin", "AM glass skin"],
            ["pm-skin", "PM restore"],
            ["hair-coily", "Coils & 4C"],
            ["hair-damage", "Repair hair"],
            ["glam", "Soft glam face"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setRitual(id)}
            className={cn(
              "px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em]",
              ritual === id
                ? "bg-ink text-ivory"
                : "border border-line hover:border-ink"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        <ol className="space-y-4">
          {current.steps.map((s) => (
            <li
              key={s.slug + s.order}
              className="flex gap-4 border border-line bg-surface p-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-ink text-xs text-ivory">
                {s.order}
              </span>
              <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-ivory-deep">
                <Image src={s.image} alt="" fill className="object-cover" sizes="64px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-[0.14em] text-champagne">
                  {s.label}
                </p>
                <Link
                  href={`/product/${s.slug}`}
                  className="font-medium hover:underline"
                >
                  {s.name}
                </Link>
                <p className="mt-1 text-sm">{formatPrice(s.price)}</p>
              </div>
            </li>
          ))}
        </ol>

        <aside className="h-fit border border-line bg-surface p-6 lg:sticky lg:top-36">
          <h2 className="font-display text-2xl">{current.title}</h2>
          <p className="mt-2 text-sm text-muted">{current.body}</p>
          <div className="mt-6 flex justify-between border-t border-line pt-4">
            <span className="text-sm text-muted">Ritual total</span>
            <span className="font-display text-3xl">{formatPrice(total)}</span>
          </div>
          <button onClick={addAll} className="btn-primary mt-6 w-full">
            Add full ritual to bag
          </button>
          <Link href="/quiz" className="btn-ghost mt-3 w-full">
            Not sure? Take the quiz
          </Link>
          <Link href="/studio" className="mt-4 block text-center text-[11px] uppercase tracking-[0.14em] text-muted hover:text-ink">
            Try makeup shades live →
          </Link>
        </aside>
      </div>
    </div>
  );
}
