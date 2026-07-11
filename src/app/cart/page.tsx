"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/store/cart";
import { useT } from "@/lib/i18n/useT";

export default function CartPage() {
  const { t, formatPrice } = useT();
  const { items, removeItem, updateQty, subtotal, discount } = useCart();
  const total = Math.max(0, subtotal() - discount);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-5 py-28 text-center">
        <h1 className="font-display text-5xl">{t("cart.empty")}</h1>
        <p className="mt-4 text-muted">{t("cart.emptySub")}</p>
        <Link href="/shop" className="btn-primary mt-8 inline-flex">
          {t("home.ctaShop")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-12 md:px-8 md:py-16">
      <h1 className="font-display text-5xl tracking-tight">{t("cart.yourBag")}</h1>
      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_340px]">
        <ul className="divide-y divide-line border-y border-line">
          {items.map((item) => (
            <li key={item.variantId} className="flex gap-5 py-6">
              <div className="relative h-32 w-24 shrink-0 overflow-hidden bg-ivory-deep">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-4">
                  <div>
                    <Link href={`/product/${item.slug || item.productId}`} className="font-medium">
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted">{item.variantName}</p>
                    <p className="mt-1 text-xs text-muted">{item.sku}</p>
                  </div>
                  <button onClick={() => removeItem(item.variantId)}>
                    <X size={16} className="text-muted" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <div className="flex items-center border border-line">
                    <button className="p-2" onClick={() => updateQty(item.variantId, item.quantity - 1)}>
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-xs">{item.quantity}</span>
                    <button className="p-2" onClick={() => updateQty(item.variantId, item.quantity + 1)}>
                      <Plus size={12} />
                    </button>
                  </div>
                  <p>{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit border border-line bg-surface p-6">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
            Summary
          </h2>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">{t("cart.subtotal")}</span>
              <span>{formatPrice(subtotal())}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-ok">
                <span>{t("cart.discount")}</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted">{t("cart.shipping")}</span>
              <span className="text-muted">{t("cart.shippingCalc")}</span>
            </div>
          </div>
          <div className="mt-6 flex justify-between border-t border-line pt-4">
            <span className="font-medium">{t("cart.total")}</span>
            <span className="font-display text-2xl">{formatPrice(total)}</span>
          </div>
          <Link href="/checkout" className="btn-primary mt-6 w-full">
            Checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}
