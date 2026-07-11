"use client";

import { FormEvent, useEffect, useState } from "react";
import { useCart } from "@/store/cart";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

/**
 * Soft abandon capture: after cart has items and user browses away from
 * cart/checkout, offer email recovery. Sends real outbox email + token.
 */
export function AbandonedCartCapture() {
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal);
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [recoverUrl, setRecoverUrl] = useState("");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed || done) return;
    if (items.length === 0) {
      setShow(false);
      return;
    }
    const onCheckout =
      pathname?.startsWith("/checkout") ||
      pathname?.startsWith("/cart") ||
      pathname?.startsWith("/recover");
    if (onCheckout) {
      setShow(false);
      return;
    }

    const t = setTimeout(() => setShow(true), 25000);
    return () => clearTimeout(t);
  }, [items.length, pathname, dismissed, done]);

  useEffect(() => {
    if (dismissed || done || items.length === 0) return;
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 8) setShow(true);
    };
    document.addEventListener("mouseout", onLeave);
    return () => document.removeEventListener("mouseout", onLeave);
  }, [items.length, dismissed, done]);

  if (!show || items.length === 0) return null;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "abandon",
        email,
        cartValue: subtotal(),
        itemCount: items.length,
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          slug: i.slug,
          name: i.name,
          variantName: i.variantName,
          sku: i.sku,
          price: i.price,
          image: i.image,
          quantity: i.quantity,
          maxStock: i.maxStock,
        })),
      }),
    });
    const data = await res.json();
    if (data.recoverUrl) setRecoverUrl(data.recoverUrl);
    setDone(true);
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-md border border-line bg-ivory p-5 shadow-soft md:left-auto md:right-6">
      <button
        className="absolute right-3 top-3 text-muted"
        onClick={() => {
          setDismissed(true);
          setShow(false);
        }}
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
      {done ? (
        <div className="pr-6 text-sm">
          <p className="text-ok">
            Recovery email sent with <strong>WELCOME10</strong>.
          </p>
          {recoverUrl && (
            <a
              href={recoverUrl}
              className="mt-2 block text-xs text-champagne underline"
            >
              Open recovery link (demo)
            </a>
          )}
        </div>
      ) : (
        <>
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-champagne">
            Don&apos;t lose your edit
          </p>
          <h3 className="mt-1 font-display text-2xl">Email me my bag</h3>
          <p className="mt-1 text-sm text-muted">
            {items.length} piece{items.length > 1 ? "s" : ""} held for 7 days ·
            free ship $75+ · restore link + <strong>WELCOME10</strong>.
          </p>
          <form onSubmit={onSubmit} className="mt-4 flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="field flex-1 !py-2"
            />
            <button type="submit" className="btn-primary !px-4 !py-2">
              Save
            </button>
          </form>
        </>
      )}
    </div>
  );
}
