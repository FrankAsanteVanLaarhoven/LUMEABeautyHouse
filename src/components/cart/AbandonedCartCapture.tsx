"use client";

import { FormEvent, useEffect, useState } from "react";
import { useCart } from "@/store/cart";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

/**
 * Soft abandon capture: after cart has items and user browses away from
 * cart/checkout for a bit, offer to save bag + email nudge.
 */
export function AbandonedCartCapture() {
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal);
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed || done) return;
    if (items.length === 0) {
      setShow(false);
      return;
    }
    const onCheckout =
      pathname?.startsWith("/checkout") || pathname?.startsWith("/cart");
    if (onCheckout) {
      setShow(false);
      return;
    }

    const t = setTimeout(() => setShow(true), 45000);
    return () => clearTimeout(t);
  }, [items.length, pathname, dismissed, done]);

  // Also capture on leave intent (mouse leaves top of viewport)
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
    await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "abandon",
        email,
        cartValue: subtotal(),
        itemCount: items.length,
      }),
    });
    setDone(true);
    setTimeout(() => setShow(false), 2200);
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
        <p className="pr-6 text-sm text-ok">
          Bag saved. We&apos;ll email a gentle nudge + WELCOME10 if you need it.
        </p>
      ) : (
        <>
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-champagne">
            Still thinking?
          </p>
          <h3 className="mt-1 font-display text-2xl">Save your bag</h3>
          <p className="mt-1 text-sm text-muted">
            {items.length} item{items.length > 1 ? "s" : ""} waiting · free ship
            from $75. Get a reminder + first-order perk.
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
