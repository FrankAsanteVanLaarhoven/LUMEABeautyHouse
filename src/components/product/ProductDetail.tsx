"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/lib/types";
import { useCart } from "@/store/cart";
import { useProfile } from "@/store/profile";
import { ListPlus, Minus, Plus, Sparkles } from "lucide-react";
import { useT } from "@/lib/i18n/useT";
import type { MessageKey } from "@/lib/i18n/messages";
import { SocialShare } from "@/components/social/SocialShare";

export function ProductDetail({ product }: { product: Product }) {
  const { t, formatPrice } = useT();
  const [imageIdx, setImageIdx] = useState(0);
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const [qty, setQty] = useState(1);
  const addItem = useCart((s) => s.addItem);
  const addToList = useProfile((s) => s.addToList);
  const isInList = useProfile((s) => s.isInList);

  const variant = useMemo(
    () => product.variants.find((v) => v.id === variantId) || product.variants[0],
    [product.variants, variantId]
  );

  const stock = variant?.stock ?? 0;
  const stockText =
    stock <= 0
      ? t("product.outOfStock")
      : stock <= 8
        ? t("product.onlyLeft", { n: stock })
        : stock <= 25
          ? t("product.lowStock")
          : t("product.inStock");
  const stockTone =
    stock <= 0 ? "text-danger" : stock <= 25 ? "text-warn" : "text-ok";
  const canAdd = stock > 0 && !product.badges.includes("coming-soon");
  const onList = variant ? isInList(variant.id) : false;
  const isColorProduct =
    product.category === "makeup" &&
    (product.subcategory === "Face" || product.subcategory === "Lips");

  return (
    <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-10 md:grid-cols-2 md:gap-16 md:px-8 md:py-16">
      <div>
        <div className="relative aspect-[3/4] overflow-hidden bg-ivory-deep">
          <AnimatePresence mode="wait">
            <motion.div
              key={imageIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0"
            >
              <Image
                src={product.images[imageIdx]}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="50vw"
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {product.images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setImageIdx(i)}
              className={`relative aspect-square overflow-hidden border ${
                i === imageIdx ? "border-ink" : "border-transparent"
              }`}
            >
              <Image src={img} alt="" fill className="object-cover" sizes="120px" />
            </button>
          ))}
        </div>
      </div>

      <div className="md:sticky md:top-36 md:self-start">
        <div className="flex flex-wrap gap-2">
          {product.badges.map((b) => (
            <span
              key={b}
              className="border border-line px-2 py-1 text-[9px] font-medium uppercase tracking-[0.14em]"
            >
              {t(`badge.${b}` as MessageKey)}
            </span>
          ))}
        </div>
        <h1 className="mt-4 font-display text-4xl tracking-tight md:text-5xl lg:text-6xl">
          {product.name}
        </h1>
        <p className="mt-3 text-muted">{product.tagline}</p>
        <div className="mt-4 flex items-baseline gap-3">
          <p className="font-display text-3xl">
            {formatPrice(variant?.price ?? product.price)}
          </p>
          {(variant?.compareAtPrice || product.compareAtPrice) && (
            <p className="text-muted line-through">
              {formatPrice(variant?.compareAtPrice || product.compareAtPrice || 0)}
            </p>
          )}
        </div>
        <p className="mt-2 text-xs text-muted">
          {product.rating.toFixed(1)} ★ ·{" "}
          {t("product.reviewsCount", {
            count: product.reviewCount.toLocaleString(),
          })}
        </p>

        {product.variants.length > 1 && (
          <div className="mt-8">
            <p className="label">
              {variant?.shadeHex ? t("product.shade") : t("product.size")} —{" "}
              {variant?.name}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.variants.map((v) =>
                v.shadeHex ? (
                  <button
                    key={v.id}
                    title={`${v.name} (${v.stock})`}
                    onClick={() => setVariantId(v.id)}
                    className={`h-9 w-9 rounded-full border-2 transition ${
                      v.id === variantId
                        ? "border-ink scale-110"
                        : "border-transparent ring-1 ring-line"
                    } ${v.stock <= 0 ? "opacity-30" : ""}`}
                    style={{ background: v.shadeHex }}
                  />
                ) : (
                  <button
                    key={v.id}
                    onClick={() => setVariantId(v.id)}
                    className={`border px-4 py-2 text-xs uppercase tracking-[0.12em] transition ${
                      v.id === variantId
                        ? "border-ink bg-ink text-ivory"
                        : "border-line hover:border-ink"
                    } ${v.stock <= 0 ? "opacity-40" : ""}`}
                  >
                    {v.name}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        <p className={`mt-6 text-xs font-medium uppercase tracking-[0.14em] ${stockTone}`}>
          {stockText}
          {variant ? ` · SKU ${variant.sku}` : ""}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <div className="flex items-center border border-line">
            <button
              className="p-3"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              <Minus size={14} />
            </button>
            <span className="w-10 text-center text-sm">{qty}</span>
            <button
              className="p-3"
              onClick={() =>
                setQty((q) => Math.min(variant?.stock ?? 1, q + 1))
              }
            >
              <Plus size={14} />
            </button>
          </div>
          <button
            className="btn-primary flex-1 min-w-[140px]"
            disabled={!canAdd}
            onClick={() => {
              if (!variant || !canAdd) return;
              addItem({
                productId: product.id,
                variantId: variant.id,
                slug: product.slug,
                name: product.name,
                variantName: variant.name,
                sku: variant.sku,
                price: variant.price,
                image: product.images[0],
                maxStock: variant.stock,
                quantity: qty,
              });
            }}
          >
            {canAdd ? t("product.addToBag") : t("product.outOfStock")}
          </button>
          {variant && (
            <button
              className="btn-ghost !px-4"
              onClick={() => {
                if (onList) return;
                addToList({
                  productId: product.id,
                  variantId: variant.id,
                  slug: product.slug,
                  name: product.name,
                  variantName: variant.name,
                  sku: variant.sku,
                  price: variant.price,
                  image: product.images[0],
                });
              }}
            >
              <ListPlus size={14} />
              {onList ? t("list.added") : t("list.add")}
            </button>
          )}
        </div>

        {isColorProduct && (
          <Link
            href="/studio"
            className="mt-4 flex w-full items-center justify-center gap-2 border border-champagne bg-champagne/15 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-ink transition hover:bg-champagne/30"
          >
            <Sparkles size={14} />
            {t("product.tryOn")} — {t("home.tryOnCta")}
          </Link>
        )}

        <div className="mt-10 space-y-6 border-t border-line pt-8">
          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.16em]">
              {t("product.about")}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              {product.description}
            </p>
          </div>
          {product.howToUse && (
            <div>
              <h3 className="text-[11px] font-medium uppercase tracking-[0.16em]">
                {t("product.howTo")}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {product.howToUse}
              </p>
            </div>
          )}
          {product.ingredients && (
            <div>
              <h3 className="text-[11px] font-medium uppercase tracking-[0.16em]">
                {t("product.ingredients")}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="border border-line bg-surface px-3 py-1.5 text-xs text-ink-soft"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="border-t border-line pt-6">
            <SocialShare
              title={`${product.name} — LUMÉA`}
              productId={product.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
