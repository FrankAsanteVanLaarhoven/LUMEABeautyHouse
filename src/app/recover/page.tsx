"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/store/cart";
import { useT } from "@/lib/i18n/useT";

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
  const [items, setItems] = useState<
    {
      name: string;
      image: string;
      price: number;
      quantity: number;
      variantName: string;
    }[]
  >([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Missing recovery link");
      setLoading(false);
      return;
    }
    fetch(`/api/recover?token=${encodeURIComponent(token)}`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "Invalid link");
        setItems(d.items || []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  async function restore() {
    setError("");
    const res = await fetch("/api/recover", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not restore");
      return;
    }
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
    // Soft-apply WELCOME10 fixed $10 if bag qualifies (client; checkout revalidates)
    setPromo("WELCOME10", 10);
    setDone(true);
    open();
    setTimeout(() => router.push("/checkout"), 1200);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center text-muted">
        Restoring your bag…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <h1 className="font-display text-4xl">Link expired</h1>
        <p className="mt-3 text-sm text-muted">{error}</p>
        <Link href="/shop" className="btn-primary mt-8 inline-flex">
          Shop the house
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-5 py-16 md:py-24">
      <p className="text-[10px] uppercase tracking-[0.2em] text-champagne">
        Cart recovery
      </p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">
        Your bag is ready
      </h1>
      <p className="mt-3 text-sm text-muted">
        We saved your pieces. Restore and use <strong>WELCOME10</strong> for $10
        off at checkout.
      </p>
      <ul className="mt-8 space-y-4">
        {items.map((item, i) => (
          <li key={i} className="flex gap-4 border border-line bg-surface p-3">
            <div className="relative h-20 w-16 shrink-0 bg-ivory-deep">
              <Image
                src={item.image}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted">{item.variantName}</p>
              <p className="mt-1 text-sm">
                {formatPrice(item.price)} × {item.quantity}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {done ? (
        <p className="mt-8 text-sm text-ok">
          Bag restored · WELCOME10 applied · heading to checkout…
        </p>
      ) : (
        <button onClick={restore} className="btn-primary mt-8 w-full">
          Restore bag & checkout
        </button>
      )}
      <Link
        href="/shop"
        className="mt-4 block text-center text-[11px] uppercase tracking-[0.14em] text-muted"
      >
        Continue shopping
      </Link>
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
