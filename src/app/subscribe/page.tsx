"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { RefreshCw, Sparkles } from "lucide-react";
import { useBrowse } from "@/store/browse";
import { useT } from "@/lib/i18n/useT";

const PLANS = [
  {
    id: "veil",
    slug: "veil-soft-focus-foundation",
    name: "Veil Foundation",
    price: 42,
    interval: 60,
    body: "Your matched shade, every 60 days. Pause anytime.",
  },
  {
    id: "aura",
    slug: "aura-illuminating-serum",
    name: "Aura Serum",
    price: 58,
    interval: 30,
    body: "Daily light. Auto-ship before you run out.",
  },
  {
    id: "coil",
    slug: "coil-define-curl-cream",
    name: "Coil Define + Flux pair",
    price: 64,
    interval: 45,
    body: "Pattern care on a cycle that respects wash day.",
  },
  {
    id: "glass",
    slug: "lume-glass-lip-oil",
    name: "Lumé Glass Lip Oil",
    price: 24,
    interval: 45,
    body: "Mirror shine refill. 15% off every delivery.",
  },
];

export default function SubscribePage() {
  const { formatPrice } = useT();
  const setSubscribeSave = useBrowse((s) => s.setSubscribeSave);
  const addLoyalty = useBrowse((s) => s.addLoyalty);
  const [active, setActive] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  async function enroll(e: FormEvent<HTMLFormElement>, planId: string) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const plan = PLANS.find((p) => p.id === planId);
    if (!plan) return;
    const res = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "subscribe",
        email: fd.get("email"),
        productSlug: plan.slug,
        intervalDays: plan.interval,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error || "Could not save");
      return;
    }
    setActive(planId);
    setSubscribeSave(true);
    addLoyalty(40, "Subscribe enrollment");
    setMsg(
      `${plan.name} subscription preference saved. Stripe billing hooks ready for production — demo confirms email + interval.`
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted">
        Auto-replenish
      </p>
      <h1 className="mt-2 font-display text-5xl tracking-tight">
        Subscribe & never run out
      </h1>
      <p className="mt-3 text-sm text-muted">
        15% off every delivery. Extra Glow Points. Pause, skip, or cancel in
        one tap when live billing is connected.
      </p>

      {msg && (
        <div className="mt-6 border border-ok/30 bg-ok/5 px-4 py-3 text-sm">
          {msg}
        </div>
      )}

      <div className="mt-10 space-y-4">
        {PLANS.map((p) => (
          <article
            key={p.id}
            className="border border-line bg-surface p-5 md:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 font-display text-2xl">
                  <RefreshCw size={18} className="text-champagne" />
                  {p.name}
                </p>
                <p className="mt-1 text-sm text-muted">{p.body}</p>
                <p className="mt-2 text-sm">
                  <span className="font-display text-2xl">
                    {formatPrice(p.price * 0.85)}
                  </span>
                  <span className="ml-2 text-muted line-through">
                    {formatPrice(p.price)}
                  </span>
                  <span className="ml-2 text-xs text-muted">
                    every {p.interval} days
                  </span>
                </p>
              </div>
              <Link
                href={`/product/${p.slug}`}
                className="text-[11px] uppercase tracking-[0.12em] underline"
              >
                View product
              </Link>
            </div>
            <form
              onSubmit={(e) => enroll(e, p.id)}
              className="mt-4 flex flex-col gap-2 sm:flex-row"
            >
              <input
                name="email"
                type="email"
                required
                placeholder="Email for delivery notices"
                className="field flex-1"
              />
              <button
                type="submit"
                className="btn-primary whitespace-nowrap"
                disabled={active === p.id}
              >
                {active === p.id ? "Enrolled ✓" : "Start 15% off"}
              </button>
            </form>
          </article>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/glow" className="btn-ghost">
          <Sparkles size={14} /> Glow Club perks
        </Link>
        <Link href="/shop" className="btn-ghost">
          Shop all
        </Link>
      </div>
    </div>
  );
}
