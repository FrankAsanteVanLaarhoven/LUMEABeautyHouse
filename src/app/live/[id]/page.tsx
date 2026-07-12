"use client";

import { FormEvent, use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getLiveEvent } from "@/lib/experiences";
import { useCart } from "@/store/cart";
import { useT } from "@/lib/i18n/useT";

const PRICE: Record<string, { name: string; price: number; image: string }> = {
  "veil-soft-focus-foundation": {
    name: "Veil Foundation",
    price: 42,
    image: "/images/product-foundation.jpg",
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
  "glow-edit-full-face-set": {
    name: "Glow Edit Set",
    price: 98,
    image: "/images/product-giftset.jpg",
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
  "edge-sculpt-contour-palette": {
    name: "Edge Sculpt Contour",
    price: 46,
    image: "/images/product-contour.jpg",
  },
  "cloud-bounce-beauty-sponge": {
    name: "Cloud Bounce Sponge",
    price: 16,
    image: "/images/product-sponge.jpg",
  },
};

export default function LiveEventRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const event = getLiveEvent(id);
  const { formatPrice } = useT();
  const addItem = useCart((s) => s.addItem);
  const [rsvpOk, setRsvpOk] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!event) return;
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brandSlug: event.guestBrandSlug || "lumea",
        type: "floor_view",
        meta: `live:${event.id}`,
      }),
    }).catch(() => {});
  }, [event]);

  if (!event) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <h1 className="font-display text-4xl">Event not found</h1>
        <Link href="/live" className="btn-primary mt-8 inline-flex">
          All live events
        </Link>
      </div>
    );
  }

  async function onRsvp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/live/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: fd.get("email"),
        eventId: event!.id,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setErr(data.error || "RSVP failed");
      return;
    }
    setRsvpOk(true);
  }

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-14">
      <Link
        href="/live"
        className="text-[10px] uppercase tracking-[0.16em] text-muted hover:text-ink"
      >
        ← All live events
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_380px]">
        <div>
          <div className="relative aspect-video overflow-hidden bg-ink">
            {event.youtubeId ? (
              <iframe
                title={event.title}
                src={`https://www.youtube.com/embed/${event.youtubeId}?rel=0`}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <Image src={event.image} alt="" fill className="object-cover opacity-80" />
            )}
          </div>
          <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-champagne">
            {event.status} · {event.when} · {event.durationMin} min
          </p>
          <h1 className="mt-2 font-display text-4xl md:text-5xl">{event.title}</h1>
          <p className="mt-2 text-muted">{event.subtitle}</p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft">
            {event.description}
          </p>
          <p className="mt-3 text-xs text-muted">
            Host {event.host}
            {event.guestBrand ? (
              <>
                {" "}
                · Guest{" "}
                <Link
                  href={`/brands/${event.guestBrandSlug}`}
                  className="text-champagne underline"
                >
                  {event.guestBrand}
                </Link>
              </>
            ) : null}
          </p>
        </div>

        <aside className="space-y-6">
          <form
            onSubmit={onRsvp}
            className="border border-line bg-surface p-5"
          >
            <h2 className="font-display text-xl">RSVP</h2>
            <p className="mt-1 text-xs text-muted">
              Get a reminder + shoppable list. Brands track RSVPs as live demand.
            </p>
            {rsvpOk ? (
              <p className="mt-4 text-sm text-ok">You&apos;re on the list.</p>
            ) : (
              <>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@email.com"
                  className="field mt-4"
                />
                {err && <p className="mt-2 text-xs text-danger">{err}</p>}
                <button type="submit" className="btn-primary mt-3 w-full">
                  Save my seat
                </button>
              </>
            )}
          </form>

          <div className="border border-line bg-surface p-5">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
              Shop the room
            </h2>
            <ul className="mt-4 space-y-3">
              {event.productSlugs.map((slug) => {
                const p = PRICE[slug];
                if (!p) return null;
                return (
                  <li key={slug} className="flex items-center gap-3">
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
                    </div>
                    <button
                      type="button"
                      className="text-[10px] uppercase tracking-[0.1em] underline"
                      onClick={() => {
                        addItem({
                          productId: slug,
                          variantId: `${slug}-live`,
                          slug,
                          name: p.name,
                          variantName: "Live room",
                          sku: slug.slice(0, 10).toUpperCase(),
                          price: p.price,
                          image: p.image,
                          maxStock: 40,
                        });
                        fetch("/api/analytics/track", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            brandSlug: event.guestBrandSlug || "lumea",
                            type: "add_to_bag",
                            productSlug: slug,
                            meta: event.id,
                          }),
                        }).catch(() => {});
                      }}
                    >
                      Add
                    </button>
                  </li>
                );
              })}
            </ul>
            <Link href="/concierge" className="btn-ghost mt-4 w-full">
              Book follow-up concierge
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
