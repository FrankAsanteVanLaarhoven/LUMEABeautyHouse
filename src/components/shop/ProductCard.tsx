"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { useCart } from "@/store/cart";
import { useProfile } from "@/store/profile";
import { motion } from "framer-motion";
import { useT } from "@/lib/i18n/useT";
import type { MessageKey } from "@/lib/i18n/messages";
import { ListPlus } from "lucide-react";
import { resolveProductBrand } from "@/lib/house-brands";

export function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const { t, formatPrice } = useT();
  const addItem = useCart((s) => s.addItem);
  const addToList = useProfile((s) => s.addToList);
  const isInList = useProfile((s) => s.isInList);
  const primary = product.variants[0];
  const outOfStock = product.variants.every((v) => v.stock <= 0);
  const comingSoon = product.badges.includes("coming-soon") || outOfStock;
  const onList = primary ? isInList(primary.id) : false;
  const brand = resolveProductBrand(product);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.06 }}
      className="product-card group"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-ivory-deep">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="img-primary object-cover"
            sizes="(max-width:768px) 50vw, 25vw"
          />
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              className="img-secondary absolute inset-0 object-cover"
              sizes="(max-width:768px) 50vw, 25vw"
            />
          )}
          <div className="absolute left-3 top-3 flex flex-col gap-1">
            {product.badges.slice(0, 2).map((b) => (
              <span
                key={b}
                className="bg-ivory/90 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-ink backdrop-blur"
              >
                {t(`badge.${b}` as MessageKey)}
              </span>
            ))}
          </div>
          {product.shades && product.shades > 1 && (
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 opacity-0 transition group-hover:opacity-100">
              {product.variants
                .filter((v) => v.shadeHex)
                .slice(0, 8)
                .map((v) => (
                  <span
                    key={v.id}
                    className="h-3 w-3 rounded-full border border-white/50 shadow-sm"
                    style={{ background: v.shadeHex }}
                    title={v.name}
                  />
                ))}
              {product.shades > 8 && (
                <span className="text-[10px] text-ink/70">
                  +{product.shades - 8}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>

      <div className="mt-4 flex flex-col gap-1 px-0.5">
        <Link
          href={`/brands/${brand.slug}`}
          className="text-[10px] font-medium uppercase tracking-[0.14em] text-champagne hover:underline"
        >
          {brand.name}
        </Link>
        <div className="flex items-start justify-between gap-2">
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-sm font-medium leading-snug tracking-tight">
              {product.name}
            </h3>
          </Link>
          <p className="shrink-0 text-sm tabular-nums">
            {product.compareAtPrice && (
              <span className="mr-1.5 text-muted line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            {formatPrice(product.price)}
          </p>
        </div>
        <p className="text-xs text-muted">{product.tagline}</p>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-[11px] text-muted">
            {product.rating.toFixed(1)} ★ · {product.reviewCount.toLocaleString()}
            {product.shades
              ? ` · ${t("shop.shades", { n: product.shades })}`
              : ""}
          </p>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            className="btn-ghost flex-1 !py-2.5 text-[10px]"
            disabled={comingSoon}
            onClick={() => {
              if (!primary || comingSoon) return;
              addItem({
                productId: product.id,
                variantId: primary.id,
                slug: product.slug,
                name: product.name,
                variantName: primary.name,
                sku: primary.sku,
                price: primary.price,
                image: product.images[0],
                maxStock: primary.stock,
              });
            }}
          >
            {comingSoon ? t("shop.notify") : t("shop.quickAdd")}
          </button>
          {primary && !comingSoon && (
            <button
              className="border border-line px-2.5 text-ink-soft transition hover:border-ink hover:text-ink"
              title={onList ? t("list.added") : t("list.add")}
              onClick={() => {
                if (onList) return;
                addToList({
                  productId: product.id,
                  variantId: primary.id,
                  slug: product.slug,
                  name: product.name,
                  variantName: primary.name,
                  sku: primary.sku,
                  price: primary.price,
                  image: product.images[0],
                });
              }}
            >
              <ListPlus size={14} className={onList ? "text-champagne" : ""} />
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
