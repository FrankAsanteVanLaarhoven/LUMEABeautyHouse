"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Gift, Package, ShieldCheck, Truck } from "lucide-react";
import { useCart } from "@/store/cart";
import { useT } from "@/lib/i18n/useT";

type RecoverItem = {
  productId: string;
  variantId: string;
  slug?: string;
  name: string;
  variantName: string;
  sku: string;
  price: number;
  image: string;
  quantity: number;
  maxStock: number;
};

function RecoverInner() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const router = useRouter();
  const { formatPrice } = useT();
  const addItem = useCart((s) => s.addItem);
  const setPromo = useCart((s) => s.setPromo);
  const open = useCart((s) => s.open);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [items, setItems] = useState<RecoverItem[]>([]);
  const [done, setDone] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.price * (i.quantity || 1), 0),
    [items]
  );
  const afterWelcome = Math.max(0, subtotal - 10);

  useEffect(() => {
    if (!token) {
      setError("This recovery link is incomplete. Request a new one from your bag.");
      setLoading(false);
      return;
    }
    fetch(`/api/recover?token=${encodeURIComponent(token)}`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "Invalid link");
        setItems(d.items || []);
        setEmail(d.email || "");
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  async function restore() {
    setError("");
    setRestoring(true);
    try {
      const res = await fetch("/api/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not restore");
      for (const item of data.items || []) {
        addItem({
          productId: item.productId,
          variantId: item.variantId,
          slug: item.slug,
          name: item.name,
          variantName: item.variantName,
          sku: item.sku,
          price: item.price,
          image: item.image,
          maxStock: item.maxStock || 20,
          quantity: item.quantity || 1,
        });
      }
      setPromo("WELCOME10", 10);
      setDone(true);
      open();
      setTimeout(() => router.push("/checkout"), 900);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not restore");
    } finally {
      setRestoring(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-xl px-5 py-28 text-center">
        <div className="mx-auto h-10 w-10 animate-pulse rounded-full bg-sand" />
        <p className="mt-6 text-sm text-muted">Opening your saved bag…</p>
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
          Recovery
        </p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">
          Link expired
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">{error}</p>
        <p className="mt-2 text-sm text-muted">
          Links last 7 days. Add pieces again and save your bag from the cart
          reminder.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="btn-primary">
            Shop the house
          </Link>
          <Link href="/quiz" className="btn-ghost">
            Find my match
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 md:px-8 md:py-16">
      <div className="border border-line bg-surface p-6 md:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-champagne">
              Welcome back
            </p>
            <h1 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">
              Your bag is waiting
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
              We held your edit
              {email ? (
                <>
                  {" "}
                  for <span className="text-ink">{email}</span>
                </>
              ) : null}
              . Restore it in one tap —{" "}
              <strong className="text-ink">WELCOME10</strong> is ready for $10
              off.
            </p>
          </div>
          <div className="border border-champagne/40 bg-champagne/15 px-4 py-3 text-center">
            <Gift size={18} className="mx-auto text-champagne" />
            <p className="mt-1 text-[10px] uppercase tracking-[0.14em]">
              First-order perk
            </p>
            <p className="font-display text-2xl">$10 off</p>
          </div>
        </div>

        <ul className="mt-8 space-y-3">
          {items.map((item, i) => (
            <li
              key={item.variantId + i}
              className="flex gap-4 border border-line bg-ivory p-3"
            >
              <div className="relative h-24 w-[4.5rem] shrink-0 overflow-hidden bg-ivory-deep">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="72px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-snug">{item.name}</p>
                <p className="mt-0.5 text-xs text-muted">{item.variantName}</p>
                <p className="mt-2 text-sm">
                  {formatPrice(item.price)}
                  <span className="text-muted"> × {item.quantity}</span>
                </p>
              </div>
              <p className="text-sm font-medium">
                {formatPrice(item.price * (item.quantity || 1))}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-6 space-y-2 border-t border-line pt-5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-ok">
            <span>WELCOME10</span>
            <span>−{formatPrice(10)}</span>
          </div>
          <div className="flex justify-between border-t border-line pt-3 font-medium">
            <span>After perk</span>
            <span className="font-display text-2xl">
              {formatPrice(afterWelcome)}
            </span>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-danger">{error}</p>}

        {done ? (
          <p className="mt-8 text-center text-sm text-ok">
            Bag restored · WELCOME10 applied · taking you to secure checkout…
          </p>
        ) : (
          <button
            onClick={restore}
            disabled={restoring || items.length === 0}
            className="btn-primary mt-8 w-full"
          >
            {restoring ? "Restoring…" : "Restore bag & checkout"}
          </button>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { icon: Package, label: "Pieces held 7 days" },
            { icon: Truck, label: "Free ship $75+" },
            { icon: ShieldCheck, label: "30-day returns" },
          ].map((t) => (
            <div
              key={t.label}
              className="flex items-center gap-2 text-[10px] uppercase tracking-[0.1em] text-muted"
            >
              <t.icon size={14} className="text-champagne" />
              {t.label}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-4 text-[11px] uppercase tracking-[0.14em] text-muted">
        <Link href="/shop" className="hover:text-ink">
          Continue shopping
        </Link>
        <Link href="/studio" className="hover:text-ink">
          Try shades live
        </Link>
        <Link href="/glow" className="hover:text-ink">
          Glow Club
        </Link>
      </div>
    </div>
  );
}

export default function RecoverPage() {
  return (
    <Suspense
      fallback={
        <div className="p-24 text-center text-muted">Loading recovery…</div>
      }
    >
      <RecoverInner />
    </Suspense>
  );
}
