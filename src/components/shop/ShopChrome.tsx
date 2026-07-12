"use client";

import Link from "next/link";
import { HOUSE_BRANDS } from "@/lib/house-brands";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/useT";

export function ShopChrome({
  category,
  q,
  brand = "",
  brandName,
  count,
  children,
}: {
  category: string;
  q: string;
  brand?: string;
  brandName?: string;
  count: number;
  children: React.ReactNode;
}) {
  const { t } = useT();
  const categories = [
    { id: "all", label: t("shop.all") },
    { id: "makeup", label: t("nav.makeup") },
    { id: "skin", label: t("nav.skin") },
    { id: "hair", label: t("nav.hair") },
    { id: "body", label: t("nav.body") },
    { id: "tools", label: t("nav.tools") },
    { id: "sets", label: t("nav.sets") },
  ];

  function hrefForCategory(catId: string) {
    const p = new URLSearchParams();
    if (catId !== "all") p.set("category", catId);
    if (brand) p.set("brand", brand);
    if (q) p.set("q", q);
    const s = p.toString();
    return s ? `/shop?${s}` : "/shop";
  }

  function hrefForBrand(slug: string) {
    const p = new URLSearchParams();
    if (slug) p.set("brand", slug);
    if (category !== "all") p.set("category", category);
    if (q) p.set("q", q);
    const s = p.toString();
    return s ? `/shop?${s}` : "/shop";
  }

  const title = q
    ? t("shop.results", { q })
    : brandName
      ? brandName
      : category === "all"
        ? t("shop.shopAll")
        : categories.find((c) => c.id === category)?.label || t("shop.shopAll");

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-12 md:px-8 md:py-16">
      <div className="mb-10 md:mb-14">
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted">
          {brandName ? "Brand floor" : t("shop.collection")}
        </p>
        <h1 className="mt-2 font-display text-5xl tracking-tight md:text-6xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-muted">
          {count === 1
            ? t("shop.products", { n: count })
            : t("shop.products_plural", { n: count })}
          {brandName ? ` · ${brandName}` : ""}
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.12em]">
          <Link href="/brands" className="text-champagne underline-offset-4 hover:underline">
            Browse all brand floors →
          </Link>
          {brand && (
            <Link href={hrefForBrand("")} className="text-muted hover:text-ink">
              Clear brand filter
            </Link>
          )}
        </div>
      </div>

      {/* Category filters */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-line pb-5">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={hrefForCategory(c.id)}
            className={cn(
              "px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] transition",
              category === c.id
                ? "bg-ink text-ivory"
                : "border border-line text-ink-soft hover:border-ink hover:text-ink"
            )}
          >
            {c.label}
          </Link>
        ))}
      </div>

      {/* Brand floor filters — department store style */}
      <div className="mb-10">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
          Shop by brand
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={hrefForBrand("")}
            className={cn(
              "px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em]",
              !brand
                ? "bg-ink text-ivory"
                : "border border-line text-ink-soft hover:border-ink"
            )}
          >
            All houses
          </Link>
          {HOUSE_BRANDS.map((b) => (
            <Link
              key={b.slug}
              href={hrefForBrand(b.slug)}
              className={cn(
                "px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em]",
                brand === b.slug
                  ? "bg-ink text-ivory"
                  : "border border-line text-ink-soft hover:border-ink"
              )}
            >
              {b.name}
            </Link>
          ))}
        </div>
      </div>

      {count === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-3xl">{t("shop.nothing")}</p>
          <Link href="/shop" className="btn-primary mt-6 inline-flex">
            {t("shop.browseAll")}
          </Link>
          <Link
            href="/brands"
            className="btn-ghost mt-3 inline-flex"
          >
            Browse brands
          </Link>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
