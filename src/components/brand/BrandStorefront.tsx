"use client";

import Link from "next/link";
import Image from "next/image";
import type { Brand, Product } from "@/lib/types";
import { useCart } from "@/store/cart";
import { formatMoney } from "@/lib/utils";

export function BrandStorefront({
  brand,
  products,
}: {
  brand: Omit<Brand, "password">;
  products: Product[];
}) {
  const addItem = useCart((s) => s.addItem);
  const wl = brand.whiteLabel;
  const primary = wl.primaryColor || "#1a1612";
  const accent = wl.accentColor || "#c4a574";
  const bg = wl.backgroundColor || "#faf7f2";

  return (
    <div style={{ background: bg, color: primary, minHeight: "60vh" }}>
      {/* Brand bar */}
      <div
        className="border-b"
        style={{ borderColor: `${primary}18`, background: `${bg}` }}
      >
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-8">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={wl.logoUrl || "/icons/lumea-mark.svg"}
              alt=""
              className="h-8 w-8 object-contain"
            />
            <div>
              <p
                className="font-display text-2xl tracking-[0.16em] md:text-3xl"
                style={{ color: primary }}
              >
                {wl.storeName || brand.name}
              </p>
              <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: accent }}>
                {wl.tagline}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.14em]">
            <Link
              href={`/b/${wl.subdomain}/studio`}
              style={{ color: accent }}
            >
              Mirror Studio
            </Link>
            <Link href="/tutorials" style={{ color: primary, opacity: 0.7 }}>
              Tutorials
            </Link>
            <Link href="/brand" style={{ color: primary, opacity: 0.5 }}>
              Brand portal
            </Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-[1200px] px-5 py-14 md:px-8 md:py-20">
        <p
          className="text-[10px] font-medium uppercase tracking-[0.24em]"
          style={{ color: accent }}
        >
          White-label storefront
        </p>
        <h1
          className="mt-3 max-w-2xl font-display text-4xl leading-tight md:text-6xl"
          style={{ color: primary }}
        >
          {wl.storeName || brand.name}
        </h1>
        <p className="mt-4 max-w-lg text-sm opacity-70 md:text-base">
          Shop {brand.name} on the LUMÉA network — try colour in Mirror Studio,
          learn from free artist tutorials, checkout with live inventory.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#catalogue"
            className="px-6 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white"
            style={{ background: primary }}
          >
            Shop {products.length} products
          </a>
          <Link
            href={`/b/${wl.subdomain}/studio`}
            className="border px-6 py-3 text-[11px] font-medium uppercase tracking-[0.16em]"
            style={{ borderColor: `${primary}40`, color: primary }}
          >
            Open branded studio
          </Link>
        </div>
        {wl.customDomain && (
          <p className="mt-6 text-xs opacity-50">
            Custom domain: {wl.customDomain}
          </p>
        )}
      </section>

      {/* Catalogue */}
      <section id="catalogue" className="mx-auto max-w-[1200px] px-5 pb-20 md:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-3xl" style={{ color: primary }}>
            Collection
          </h2>
          <p className="text-xs opacity-50">{products.length} items</p>
        </div>

        {products.length === 0 ? (
          <div
            className="border p-12 text-center text-sm opacity-60"
            style={{ borderColor: `${primary}20` }}
          >
            No products published yet. Brand admins can upload via CSV in the
            portal.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {products.map((p) => {
              const v = p.variants[0];
              return (
                <article
                  key={p.id}
                  className="group"
                  style={{ background: `${bg}` }}
                >
                  <Link href={`/product/${p.slug}`}>
                    <div
                      className="relative aspect-[3/4] overflow-hidden"
                      style={{ background: `${primary}08` }}
                    >
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        sizes="25vw"
                      />
                    </div>
                  </Link>
                  <div className="mt-3">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/product/${p.slug}`}>
                        <h3 className="text-sm font-medium leading-snug">
                          {p.name}
                        </h3>
                      </Link>
                      <p className="shrink-0 text-sm tabular-nums">
                        {formatMoney(p.price)}
                      </p>
                    </div>
                    <p className="mt-1 text-xs opacity-50">{p.tagline}</p>
                    {v && (
                      <button
                        className="mt-3 w-full py-2.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white transition opacity-90 hover:opacity-100"
                        style={{ background: primary }}
                        onClick={() =>
                          addItem({
                            productId: p.id,
                            variantId: v.id,
                            slug: p.slug,
                            name: p.name,
                            variantName: v.name,
                            sku: v.sku,
                            price: v.price,
                            image: p.images[0],
                            maxStock: v.stock,
                          })
                        }
                      >
                        Add to bag
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <footer
        className="border-t px-5 py-8 text-center text-[11px] opacity-50 md:px-8"
        style={{ borderColor: `${primary}15` }}
      >
        {wl.storeName || brand.name} · Powered by LUMÉA Commerce OS · Mirror
        Studio & tutorials included
        {wl.supportEmail && (
          <span className="mt-1 block">{wl.supportEmail}</span>
        )}
      </footer>
    </div>
  );
}
