"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ConciergeBooking } from "@/lib/concierge-store";
import type { ConciergeExpert } from "@/lib/concierge-experts";
import {
  SESSION_FORMAT_LABELS,
  type SessionFormat,
} from "@/lib/concierge-experts";
import { useCart } from "@/store/cart";
import { useT } from "@/lib/i18n/useT";
import { Copy, Video, Users } from "lucide-react";

const PRICE: Record<string, { name: string; price: number; image: string }> = {
  "veil-soft-focus-foundation": {
    name: "Veil Foundation",
    price: 42,
    image: "/images/product-foundation.jpg",
  },
  "edge-sculpt-contour-palette": {
    name: "Edge Sculpt Contour",
    price: 46,
    image: "/images/product-contour.jpg",
  },
  "sun-sculpt-creme-bronzer": {
    name: "Sun Sculpt Bronzer",
    price: 34,
    image: "/images/product-bronzer.jpg",
  },
  "lume-glass-lip-oil": {
    name: "Lumé Glass Lip Oil",
    price: 24,
    image: "/images/product-gloss.jpg",
  },
  "aura-illuminating-serum": {
    name: "Aura Serum",
    price: 58,
    image: "/images/skincare-still.jpg",
  },
  "clean-canvas-gel-cleanser": {
    name: "Clean Canvas Cleanser",
    price: 28,
    image: "/images/skincare-still.jpg",
  },
  "night-restore-sleeping-mask": {
    name: "Night Restore Mask",
    price: 52,
    image: "/images/product-bodycream.jpg",
  },
  "coil-define-curl-cream": {
    name: "Coil Define Cream",
    price: 32,
    image: "/images/product-hairmask.jpg",
  },
  "repair-cloud-hair-mask": {
    name: "Repair Cloud Mask",
    price: 38,
    image: "/images/product-hairmask.jpg",
  },
  "flux-9-in-1-hair-oil": {
    name: "Flux Hair Oil",
    price: 32,
    image: "/images/product-hairoil.jpg",
  },
  "hair-ritual-cleanse-treat-set": {
    name: "Hair Ritual Set",
    price: 88,
    image: "/images/product-giftset.jpg",
  },
  "glow-edit-full-face-set": {
    name: "Glow Edit Set",
    price: 98,
    image: "/images/product-giftset.jpg",
  },
};

export default function ConciergeSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { formatPrice } = useT();
  const addItem = useCart((s) => s.addItem);
  const [booking, setBooking] = useState<ConciergeBooking | null>(null);
  const [expert, setExpert] = useState<ConciergeExpert | null>(null);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);
  const paid = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("paid") === "1"
    : false;

  useEffect(() => {
    fetch(`/api/concierge/session/${id}`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "Not found");
        setBooking(d.booking);
        setExpert(d.expert);
      })
      .catch((e) => setErr(e.message));
  }, [id]);

  if (err) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <h1 className="font-display text-4xl">Session not found</h1>
        <p className="mt-2 text-sm text-muted">{err}</p>
        <Link href="/concierge" className="btn-primary mt-8 inline-flex">
          Concierge hub
        </Link>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-24 text-center text-muted">Loading live room…</div>
    );
  }

  const formatLabel =
    SESSION_FORMAT_LABELS[booking.format as SessionFormat] || booking.format;

  function copyCode() {
    navigator.clipboard?.writeText(booking!.roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-14">
      <Link
        href={`/concierge/experts/${booking.expertSlug}`}
        className="text-[10px] uppercase tracking-[0.14em] text-muted hover:text-ink"
      >
        ← {booking.expertName}
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_360px]">
        {/* Live stage */}
        <div>
          <div className="relative aspect-video overflow-hidden bg-ink text-ivory">
            {expert && (
              <Image
                src={expert.image}
                alt=""
                fill
                className="object-cover opacity-40"
              />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-danger px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ivory" />
                Live ready
              </span>
              <h1 className="mt-4 font-display text-3xl md:text-4xl">
                {expert?.streamLabel || "Concierge live room"}
              </h1>
              <p className="mt-2 text-sm text-ivory/70">
                {formatLabel} · {booking.durationMin} min · {booking.partySize}{" "}
                client{booking.partySize > 1 ? "s" : ""}
              </p>
              <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-champagne">
                Room code
              </p>
              <button
                type="button"
                onClick={copyCode}
                className="mt-2 inline-flex items-center gap-2 border border-ivory/30 px-6 py-3 font-mono text-2xl tracking-[0.2em]"
              >
                {booking.roomCode}
                <Copy size={16} />
              </button>
              {copied && (
                <p className="mt-2 text-xs text-ok">Copied — share with your party</p>
              )}
              <p className="mt-6 max-w-md text-xs text-ivory/50">
                Share this page URL and room code with your wedding party or
                friends for group sessions. Your expert joins with the same code.
                Demo room — connect Daily/LiveKit/Zoom for production streams.
              </p>
              <a
                href={`https://meet.jit.si/LUMEA-${booking.roomCode}`}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 bg-champagne px-6 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-ink"
              >
                <Video size={14} /> Start free video room
              </a>
            </div>
          </div>

          <div className="mt-6 border border-line bg-surface p-5">
            <h2 className="font-display text-xl">Session brief</h2>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.12em] text-muted">
                  Client
                </dt>
                <dd>{booking.clientName}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.12em] text-muted">
                  Format
                </dt>
                <dd className="inline-flex items-center gap-1">
                  <Users size={14} /> {formatLabel}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.12em] text-muted">
                  Fee
                </dt>
                <dd>
                  {formatPrice(booking.priceUsd)}
                  {paid ? (
                    <span className="ml-2 text-xs text-ok">PayPal paid</span>
                  ) : (
                    <span className="ml-2 text-xs text-muted">pay via email link</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.12em] text-muted">
                  Expert earns
                </dt>
                <dd>
                  {formatPrice(booking.expertEarns)} +{" "}
                  {booking.productCommissionPct}% products
                </dd>
              </div>
            </dl>
            {booking.notes && (
              <p className="mt-4 text-sm text-ink-soft">
                <strong>Notes:</strong> {booking.notes}
              </p>
            )}
            {booking.eventType && (
              <p className="mt-2 text-sm text-ink-soft">
                <strong>Event:</strong> {booking.eventType}
              </p>
            )}
          </div>
        </div>

        {/* Expert product rack — commission incentive */}
        <aside className="h-fit border border-line bg-surface p-5 lg:sticky lg:top-36">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
            Expert recommendations
          </p>
          <p className="mt-1 text-xs text-champagne">
            Shop from this room — {booking.productCommissionPct}% supports{" "}
            {booking.expertName}
          </p>
          <ul className="mt-4 space-y-3">
            {(expert?.productSlugs || []).map((slug) => {
              const p = PRICE[slug];
              if (!p) return null;
              return (
                <li key={slug} className="flex gap-3">
                  <div className="relative h-14 w-11 shrink-0 overflow-hidden bg-ivory-deep">
                    <Image src={p.image} alt="" fill className="object-cover" sizes="44px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/product/${slug}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {p.name}
                    </Link>
                    <p className="text-xs text-muted">{formatPrice(p.price)}</p>
                    <button
                      type="button"
                      className="text-[10px] uppercase tracking-[0.1em] underline"
                      onClick={() => {
                        addItem({
                          productId: slug,
                          variantId: `${slug}-concierge`,
                          slug,
                          name: p.name,
                          variantName: `Via ${booking.expertName}`,
                          sku: slug.slice(0, 10).toUpperCase(),
                          price: p.price,
                          image: p.image,
                          maxStock: 40,
                        });
                        for (const b of expert?.brandSlugs || ["lumea"]) {
                          fetch("/api/analytics/track", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              brandSlug: b,
                              type: "add_to_bag",
                              productSlug: slug,
                              meta: `concierge:${booking.id}`,
                            }),
                          }).catch(() => {});
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <Link href="/studio" className="btn-ghost mt-5 w-full">
            Open Mirror Studio
          </Link>
        </aside>
      </div>
    </div>
  );
}
