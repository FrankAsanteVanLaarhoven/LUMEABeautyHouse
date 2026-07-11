"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/lib/types";
import { useCart } from "@/store/cart";
import { useProfile } from "@/store/profile";
import { useBrowse } from "@/store/browse";
import {
  Bell,
  ListPlus,
  Minus,
  Plus,
  RefreshCw,
  Sparkles,
  Star,
} from "lucide-react";
import { useT } from "@/lib/i18n/useT";
import type { MessageKey } from "@/lib/i18n/messages";
import { SocialShare } from "@/components/social/SocialShare";
import { reviewsForProduct } from "@/lib/reviews";
import { COMPLETE_LOOK } from "@/lib/bundles";

export function ProductDetail({ product }: { product: Product }) {
  const { t, formatPrice } = useT();
  const [imageIdx, setImageIdx] = useState(0);
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const [qty, setQty] = useState(1);
  const [restockEmail, setRestockEmail] = useState("");
  const [restockOk, setRestockOk] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const addToList = useProfile((s) => s.addToList);
  const isInList = useProfile((s) => s.isInList);
  const trackView = useBrowse((s) => s.trackView);
  const addLoyalty = useBrowse((s) => s.addLoyalty);
  const addRestockAlert = useBrowse((s) => s.addRestockAlert);
  const restockAlerts = useBrowse((s) => s.restockAlerts);
  const subscribeSave = useBrowse((s) => s.subscribeSave);
  const setSubscribeSave = useBrowse((s) => s.setSubscribeSave);
  const shadeMatches = useBrowse((s) => s.shadeMatches);
  const reviews = reviewsForProduct(product.slug);
  const completeLook = COMPLETE_LOOK[product.slug] || [];
  const yourMatch = shadeMatches.find((m) => m.productSlug === product.slug);

  useEffect(() => {
    trackView({
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price,
    });
  }, [product.id, product.slug, product.name, product.images, product.price, trackView]);

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
  const alreadyAlerted = restockAlerts.some((a) => a.slug === product.slug);
  const unitPrice = variant?.price ?? product.price;
  const subPrice = Math.round(unitPrice * 0.85 * 100) / 100;

  async function onRestock(e: FormEvent) {
    e.preventDefault();
    if (!restockEmail.trim()) return;
    addRestockAlert({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      variantId: variant?.id,
      email: restockEmail.trim(),
    });
    await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "restock",
        email: restockEmail.trim(),
        productSlug: product.slug,
        productName: product.name,
        variantId: variant?.id,
      }),
    }).catch(() => null);
    setRestockOk(true);
    addLoyalty(10, "Restock alert");
  }

  function addCompleteLook() {
    completeLook.forEach((item) => {
      addItem({
        productId: item.slug,
        variantId: `${item.slug}-look`,
        slug: item.slug,
        name: item.name,
        variantName: item.role,
        sku: item.slug.slice(0, 10).toUpperCase(),
        price: item.price,
        image: item.image,
        maxStock: 40,
      });
    });
    addLoyalty(15, "Complete the look");
  }

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
          {stock > 0 && stock <= 8 && (
            <span className="absolute left-3 top-3 bg-ink px-2 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-ivory">
              Almost gone
            </span>
          )}
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
        {yourMatch && (
          <div className="mt-4 flex items-center gap-3 border border-champagne bg-champagne/15 px-3 py-2">
            <span
              className="h-7 w-7 rounded-full border border-ink/20"
              style={{ background: yourMatch.hex }}
            />
            <div>
              <p className="text-[10px] uppercase tracking-[0.14em] text-champagne">
                Your selfie match
                {yourMatch.score ? ` · ${yourMatch.score}%` : ""}
              </p>
              <p className="text-sm font-medium">{yourMatch.name}</p>
            </div>
            <Link
              href="/studio"
              className="ml-auto text-[10px] uppercase tracking-[0.12em] underline"
            >
              Re-try
            </Link>
          </div>
        )}
        <div className="mt-4 flex items-baseline gap-3">
          <p className="font-display text-3xl">
            {formatPrice(subscribeSave ? subPrice : unitPrice)}
          </p>
          {(variant?.compareAtPrice || product.compareAtPrice) && (
            <p className="text-muted line-through">
              {formatPrice(variant?.compareAtPrice || product.compareAtPrice || 0)}
            </p>
          )}
          {subscribeSave && (
            <span className="text-xs text-ok">Save 15%</span>
          )}
        </div>
        <p className="mt-2 text-xs text-muted">
          {product.rating.toFixed(1)} ★ ·{" "}
          {t("product.reviewsCount", {
            count: product.reviewCount.toLocaleString(),
          })}
          {" · "}+{Math.round(unitPrice)} Glow Points
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
            {isColorProduct && (
              <Link
                href="/quiz"
                className="mt-3 inline-block text-[11px] uppercase tracking-[0.12em] text-champagne underline-offset-4 hover:underline"
              >
                Not sure? Take the shade quiz →
              </Link>
            )}
          </div>
        )}

        <p className={`mt-6 text-xs font-medium uppercase tracking-[0.14em] ${stockTone}`}>
          {stockText}
          {variant ? ` · SKU ${variant.sku}` : ""}
        </p>

        {/* Subscribe & save */}
        <label className="mt-5 flex cursor-pointer items-start gap-3 border border-line bg-surface p-3">
          <input
            type="checkbox"
            checked={subscribeSave}
            onChange={(e) => setSubscribeSave(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            <span className="flex items-center gap-1.5 text-sm font-medium">
              <RefreshCw size={14} className="text-champagne" />
              Subscribe & save 15%
            </span>
            <span className="mt-0.5 block text-xs text-muted">
              Deliver every 30 days · pause anytime · extra Glow Points
            </span>
          </span>
        </label>

        <div className="mt-6 flex flex-wrap items-center gap-3">
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
              const price = subscribeSave ? subPrice : variant.price;
              addItem({
                productId: product.id,
                variantId: subscribeSave
                  ? `${variant.id}-sub`
                  : variant.id,
                slug: product.slug,
                name: product.name,
                variantName: subscribeSave
                  ? `${variant.name} · Subscribe`
                  : variant.name,
                sku: variant.sku,
                price,
                image: product.images[0],
                maxStock: variant.stock,
                quantity: qty,
              });
              addLoyalty(
                Math.round(price) + (subscribeSave ? 20 : 0),
                subscribeSave ? "Subscribe & save" : "Add to bag"
              );
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

        {/* Restock alert */}
        {!canAdd && (
          <form
            onSubmit={onRestock}
            className="mt-4 border border-line bg-ivory-deep/50 p-4"
          >
            <p className="flex items-center gap-2 text-sm font-medium">
              <Bell size={14} className="text-champagne" />
              Get notified when it&apos;s back
            </p>
            {restockOk || alreadyAlerted ? (
              <p className="mt-2 text-xs text-ok">
                You&apos;re on the list — we&apos;ll email you (+10 Glow Points).
              </p>
            ) : (
              <div className="mt-3 flex gap-2">
                <input
                  type="email"
                  required
                  value={restockEmail}
                  onChange={(e) => setRestockEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="field flex-1 !py-2"
                />
                <button type="submit" className="btn-primary !px-4 !py-2">
                  Notify me
                </button>
              </div>
            )}
          </form>
        )}

        {isColorProduct && (
          <Link
            href="/studio"
            className="mt-4 flex w-full items-center justify-center gap-2 border border-champagne bg-champagne/15 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-ink transition hover:bg-champagne/30"
          >
            <Sparkles size={14} />
            {t("product.tryOn")} — {t("home.tryOnCta")}
          </Link>
        )}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Link
            href="/quiz"
            className="border border-line px-3 py-2.5 text-center text-[10px] uppercase tracking-[0.12em] hover:border-ink"
          >
            Shade & hair quiz
          </Link>
          <Link
            href="/concerns"
            className="border border-line px-3 py-2.5 text-center text-[10px] uppercase tracking-[0.12em] hover:border-ink"
          >
            Shop by concern
          </Link>
        </div>

        {/* Trust strip */}
        <ul className="mt-6 grid grid-cols-2 gap-2 text-[10px] uppercase tracking-[0.1em] text-muted">
          <li className="border border-line px-2 py-2">30-day returns</li>
          <li className="border border-line px-2 py-2">Free ship $75+</li>
          <li className="border border-line px-2 py-2">Clean formula</li>
          <li className="border border-line px-2 py-2">Cruelty-free</li>
        </ul>

        {/* Complete the look */}
        {completeLook.length > 0 && (
          <div className="mt-10 border border-line bg-surface p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-champagne">
                  Complete the look
                </p>
                <h3 className="mt-1 font-display text-xl">Pairs perfectly</h3>
              </div>
              <button
                onClick={addCompleteLook}
                className="shrink-0 bg-ink px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-ivory"
              >
                Add all
              </button>
            </div>
            <ul className="mt-4 space-y-3">
              {completeLook.map((item) => (
                <li key={item.slug} className="flex items-center gap-3">
                  <div className="relative h-14 w-11 shrink-0 overflow-hidden bg-ivory-deep">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-[0.1em] text-muted">
                      {item.role}
                    </p>
                    <Link
                      href={`/product/${item.slug}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {item.name}
                    </Link>
                  </div>
                  <span className="text-sm">{formatPrice(item.price)}</span>
                  <button
                    className="text-[10px] uppercase tracking-[0.1em] underline"
                    onClick={() => {
                      addItem({
                        productId: item.slug,
                        variantId: `${item.slug}-look`,
                        slug: item.slug,
                        name: item.name,
                        variantName: item.role,
                        sku: item.slug.slice(0, 10).toUpperCase(),
                        price: item.price,
                        image: item.image,
                        maxStock: 40,
                      });
                      addLoyalty(Math.round(item.price), "Complete look item");
                    }}
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          </div>
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
          {reviews.length > 0 && (
            <div>
              <h3 className="text-[11px] font-medium uppercase tracking-[0.16em]">
                Reviews from real skin & hair
              </h3>
              <ul className="mt-4 space-y-4">
                {reviews.map((r) => (
                  <li key={r.id} className="border border-line bg-surface p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium">{r.author}</p>
                      <span className="inline-flex items-center gap-0.5 text-xs text-champagne">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} size={10} className="fill-champagne" />
                        ))}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium">{r.title}</p>
                    <p className="mt-1 text-sm text-ink-soft">{r.body}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.1em] text-muted">
                      {r.skinTone && (
                        <span className="border border-line px-2 py-0.5">
                          {r.skinTone}
                        </span>
                      )}
                      {r.skinType && (
                        <span className="border border-line px-2 py-0.5">
                          {r.skinType}
                        </span>
                      )}
                      {r.hairType && (
                        <span className="border border-line px-2 py-0.5">
                          {r.hairType}
                        </span>
                      )}
                      {r.verified && (
                        <span className="text-ok">Verified</span>
                      )}
                      <span>Helpful · {r.helpful}</span>
                    </div>
                  </li>
                ))}
              </ul>
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
