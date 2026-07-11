"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { AFFILIATE_CODES } from "@/lib/affiliates";
import { useCart } from "@/store/cart";
import { useT } from "@/lib/i18n/useT";

export default function AffiliatePage() {
  const { formatPrice } = useT();
  const setPromo = useCart((s) => s.setPromo);
  const cartSubtotal = useCart((s) => s.subtotal());
  const [applied, setApplied] = useState("");
  const [joinOk, setJoinOk] = useState(false);
  const [err, setErr] = useState("");

  async function applyCode(code: string) {
    setErr("");
    const res = await fetch("/api/promo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, subtotal: cartSubtotal || 60 }),
    });
    const data = await res.json();
    if (!res.ok) {
      setErr(data.error || "Could not apply");
      return;
    }
    setPromo(data.code, data.discount);
    setApplied(data.code);
  }

  async function onJoin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "newsletter",
        email: fd.get("email"),
        productSlug: "affiliate-apply",
      }),
    });
    setJoinOk(true);
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-champagne">
        Creators
      </p>
      <h1 className="mt-2 font-display text-5xl tracking-tight md:text-6xl">
        Affiliate & influencer codes
      </h1>
      <p className="mt-3 text-sm text-muted">
        Share your code. Your community saves. You earn commission on every
        order — built for beauty educators, coil artists, and shade matchers.
      </p>

      <div className="mt-10 space-y-3">
        {AFFILIATE_CODES.map((a) => (
          <div
            key={a.code}
            className="flex flex-wrap items-center justify-between gap-4 border border-line bg-surface p-5"
          >
            <div>
              <p className="font-display text-2xl tracking-wide">{a.code}</p>
              <p className="mt-1 text-sm">
                {a.creator} · {a.handle}
              </p>
              <p className="mt-1 text-xs text-muted">{a.commissionNote}</p>
              <p className="mt-1 text-xs text-muted">
                {a.type === "percent" ? `${a.value}% off` : formatPrice(a.value)}
                {a.minSubtotal ? ` · min $${a.minSubtotal}` : ""}
              </p>
            </div>
            <button
              onClick={() => applyCode(a.code)}
              className="bg-ink px-4 py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-ivory"
            >
              {applied === a.code ? "Applied ✓" : "Apply to bag"}
            </button>
          </div>
        ))}
      </div>
      {err && <p className="mt-3 text-sm text-danger">{err}</p>}
      {applied && (
        <p className="mt-3 text-sm text-ok">
          {applied} locked in — continue to{" "}
          <Link href="/checkout" className="underline">
            checkout
          </Link>
          .
        </p>
      )}

      <section className="mt-14 border border-line bg-ink p-6 text-ivory md:p-8">
        <h2 className="font-display text-3xl">Join the creator program</h2>
        <p className="mt-2 text-sm text-ivory/70">
          Custom codes, dashboard (coming), early product access, and co-branded
          Mirror Studio skins for partner brands.
        </p>
        {joinOk ? (
          <p className="mt-6 text-champagne">
            Application received — we&apos;ll reach out with your code kit.
          </p>
        ) : (
          <form onSubmit={onJoin} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              name="email"
              type="email"
              required
              placeholder="creator@email.com"
              className="field flex-1 !border-ivory/20 !bg-transparent !text-ivory placeholder:!text-ivory/40"
            />
            <input
              name="handle"
              placeholder="@handle"
              className="field sm:w-40 !border-ivory/20 !bg-transparent !text-ivory placeholder:!text-ivory/40"
            />
            <button
              type="submit"
              className="bg-champagne px-6 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-ink"
            >
              Apply
            </button>
          </form>
        )}
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/community" className="btn-ghost">
          Community looks
        </Link>
        <Link href="/platform" className="btn-ghost">
          Brand SaaS
        </Link>
      </div>
    </div>
  );
}
