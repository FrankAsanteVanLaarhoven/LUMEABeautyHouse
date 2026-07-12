"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PRIVATE_SALE_CODE,
  PRIVATE_SALE_ITEMS,
  PRIVATE_SALE_MIN_GLOW,
  canAccessPrivateSale,
} from "@/lib/private-sale";
import { useBrowse } from "@/store/browse";
import { useCart } from "@/store/cart";
import { useT } from "@/lib/i18n/useT";
import { Lock, Sparkles } from "lucide-react";

export default function PrivateSalePage() {
  const { formatPrice } = useT();
  const glow = useBrowse((s) => s.loyaltyPoints);
  const addItem = useCart((s) => s.addItem);
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (canAccessPrivateSale({ glowPoints: glow })) setUnlocked(true);
    try {
      if (sessionStorage.getItem("lumea-private-sale") === "1") setUnlocked(true);
    } catch {
      /* ignore */
    }
  }, [glow]);

  function tryUnlock(e: FormEvent) {
    e.preventDefault();
    if (canAccessPrivateSale({ code, glowPoints: glow })) {
      setUnlocked(true);
      setErr("");
      try {
        sessionStorage.setItem("lumea-private-sale", "1");
      } catch {
        /* ignore */
      }
    } else {
      setErr(`Invalid code. Try ${PRIVATE_SALE_CODE} or earn ${PRIVATE_SALE_MIN_GLOW}+ Glow Points.`);
    }
  }

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center md:py-28">
        <Lock className="mx-auto text-champagne" size={28} strokeWidth={1.4} />
        <p className="mt-6 text-[10px] uppercase tracking-[0.24em] text-muted">
          Members&apos; room
        </p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">Private Sale</h1>
        <p className="mt-4 text-sm text-muted">
          Invite-only edit. Enter code <strong className="text-ink">{PRIVATE_SALE_CODE}</strong>{" "}
          or hold Flame tier ({PRIVATE_SALE_MIN_GLOW}+ Glow Points). You have{" "}
          <strong className="text-ink">{glow}</strong> pts.
        </p>
        <form onSubmit={tryUnlock} className="mt-8 space-y-3 text-left">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Invite code"
            className="field text-center uppercase tracking-[0.2em]"
          />
          {err && <p className="text-xs text-danger">{err}</p>}
          <button type="submit" className="btn-primary w-full">
            Enter the Edit
          </button>
        </form>
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-[11px] uppercase tracking-[0.12em]">
          <Link href="/glow" className="text-champagne hover:underline">
            Glow Club
          </Link>
          <Link href="/concierge" className="text-muted hover:underline">
            Concierge unlock
          </Link>
          <Link href="/journal/private-sale-edit-etiquette" className="text-muted hover:underline">
            How it works
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ivory">
      <section className="border-b border-line bg-ink px-5 py-14 text-ivory md:px-8 md:py-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-champagne">
            <Sparkles size={12} /> Private Sale · The Edit
          </p>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">
            Quiet access. Real craft.
          </h1>
          <p className="mt-4 max-w-xl text-sm text-ivory/70">
            Not a fire sale — a members&apos; room. Limited sets, gift-ready
            packaging, white-glove notes. Concierge can build a multi-brand bag.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-14 md:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRIVATE_SALE_ITEMS.map((item) => (
            <article
              key={item.slug}
              className="flex flex-col border border-line bg-surface"
            >
              <div className="relative aspect-[3/4] bg-ivory-deep">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="33vw"
                />
                <span className="absolute left-3 top-3 bg-ink px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-ivory">
                  {item.badge}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <Link
                  href={`/product/${item.slug}`}
                  className="font-medium hover:underline"
                >
                  {item.name}
                </Link>
                <p className="mt-1 text-xs text-muted">{item.tagline}</p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-display text-2xl">
                    {formatPrice(item.price)}
                  </span>
                  <span className="text-sm text-muted line-through">
                    {formatPrice(item.was)}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-primary mt-auto w-full pt-5"
                  onClick={() =>
                    addItem({
                      productId: item.slug,
                      variantId: `${item.slug}-edit`,
                      slug: item.slug,
                      name: item.name,
                      variantName: "Private Sale",
                      sku: item.slug.slice(0, 10).toUpperCase(),
                      price: item.price,
                      image: item.image,
                      maxStock: 20,
                    })
                  }
                >
                  Add to bag
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
