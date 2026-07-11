"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/useT";

export function ShopChrome({
  category,
  q,
  count,
  children,
}: {
  category: string;
  q: string;
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

  const title = q
    ? t("shop.results", { q })
    : category === "all"
      ? t("shop.shopAll")
      : categories.find((c) => c.id === category)?.label || t("shop.shopAll");

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-12 md:px-8 md:py-16">
      <div className="mb-10 md:mb-14">
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted">
          {t("shop.collection")}
        </p>
        <h1 className="mt-2 font-display text-5xl tracking-tight md:text-6xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-muted">
          {count === 1
            ? t("shop.products", { n: count })
            : t("shop.products_plural", { n: count })}
        </p>
      </div>

      <div className="mb-10 flex flex-wrap gap-2 border-b border-line pb-6">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={c.id === "all" ? "/shop" : `/shop?category=${c.id}`}
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

      {count === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-3xl">{t("shop.nothing")}</p>
          <Link href="/shop" className="btn-primary mt-6 inline-flex">
            {t("shop.browseAll")}
          </Link>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
