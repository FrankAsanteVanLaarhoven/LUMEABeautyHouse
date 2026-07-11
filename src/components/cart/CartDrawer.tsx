"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/store/cart";
import { useT } from "@/lib/i18n/useT";

export function CartDrawer() {
  const { t, formatPrice } = useT();
  const { items, isOpen, close, removeItem, updateQty, subtotal, discount } =
    useCart();
  const total = Math.max(0, subtotal() - discount);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-ink/40 backdrop-blur-sm"
            onClick={close}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 right-0 top-0 z-[90] flex w-full max-w-md flex-col bg-ivory shadow-soft"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
                  {t("cart.yourBag")}
                </p>
                <h2 className="font-display text-2xl tracking-tight">
                  {items.length}{" "}
                  {items.length === 1 ? t("cart.piece") : t("cart.pieces")}
                </h2>
              </div>
              <button onClick={close} aria-label={t("nav.close")} className="p-1">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="font-display text-3xl">{t("cart.empty")}</p>
                  <p className="mt-2 text-sm text-muted">{t("cart.emptySub")}</p>
                  <button onClick={close} className="btn-primary mt-8">
                    {t("cart.continue")}
                  </button>
                </div>
              ) : (
                <ul className="space-y-6">
                  {items.map((item) => (
                    <li key={item.variantId} className="flex gap-4">
                      <div className="relative h-28 w-[5.5rem] shrink-0 overflow-hidden bg-ivory-deep">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="88px"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium leading-snug">
                              {item.name}
                            </p>
                            <p className="mt-0.5 text-xs text-muted">
                              {item.variantName}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.variantId)}
                            className="text-muted hover:text-ink"
                            aria-label={t("cart.remove")}
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="flex items-center border border-line">
                            <button
                              className="p-2"
                              onClick={() =>
                                updateQty(item.variantId, item.quantity - 1)
                              }
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-xs">
                              {item.quantity}
                            </span>
                            <button
                              className="p-2"
                              onClick={() =>
                                updateQty(item.variantId, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.maxStock}
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <p className="text-sm">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-line px-6 py-5">
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-muted">{t("cart.subtotal")}</span>
                  <span>{formatPrice(subtotal())}</span>
                </div>
                {discount > 0 && (
                  <div className="mb-1 flex justify-between text-sm text-ok">
                    <span>{t("cart.discount")}</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="mb-4 flex justify-between text-sm">
                  <span className="text-muted">{t("cart.shipping")}</span>
                  <span className="text-muted">{t("cart.shippingCalc")}</span>
                </div>
                <div className="mb-5 flex justify-between font-medium">
                  <span>{t("cart.estimated")}</span>
                  <span className="font-display text-2xl">
                    {formatPrice(total)}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={close}
                  className="btn-primary w-full"
                >
                  {t("cart.checkout")}
                </Link>
                <Link
                  href="/cart"
                  onClick={close}
                  className="mt-3 block text-center text-[11px] uppercase tracking-[0.16em] text-muted hover:text-ink"
                >
                  {t("cart.viewFull")}
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
