"use client";

import Link from "next/link";
import { Star, Sparkles } from "lucide-react";
import { useBrowse } from "@/store/browse";
import { GLOW_TIERS, tierForPoints } from "@/lib/bundles";
import { useCart } from "@/store/cart";
import { cn } from "@/lib/utils";

export default function GlowClubPage() {
  const points = useBrowse((s) => s.loyaltyPoints);
  const log = useBrowse((s) => s.loyaltyLog);
  const redeem = useBrowse((s) => s.redeemLoyalty);
  const setPromo = useCart((s) => s.setPromo);
  const { current, next, progress } = tierForPoints(points);

  function redeemReward(pts: number, label: string, discount: number) {
    if (!redeem(pts, label)) {
      alert("Not enough Glow Points yet.");
      return;
    }
    setPromo(`GLOW${pts}`, discount);
    alert(`${label} applied — $${discount} off your bag.`);
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-champagne">
        Loyalty
      </p>
      <h1 className="mt-2 font-display text-5xl tracking-tight md:text-6xl">
        Glow Club
      </h1>
      <p className="mt-3 max-w-lg text-sm text-muted">
        Every quiz, ritual, and bag earns points. Climb tiers for free shipping,
        VIP drops, and double points — the house that rewards real beauty habits.
      </p>

      <div className="mt-10 border border-line bg-ink p-6 text-ivory md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-champagne">
              Your tier · {current.name}
            </p>
            <p className="mt-2 font-display text-5xl tabular-nums">{points}</p>
            <p className="mt-1 text-sm text-ivory/60">Glow Points</p>
          </div>
          <Star className="text-champagne" size={32} strokeWidth={1.2} />
        </div>
        {next && (
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-[11px] text-ivory/60">
              <span>
                Next: {next.name} at {next.min}
              </span>
              <span>
                {Math.max(0, next.min - points)} pts to go
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-ivory/15">
              <div
                className="h-full bg-champagne transition-all"
                style={{ width: `${Math.min(100, progress * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <section className="mt-12">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
          Tiers
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {GLOW_TIERS.map((t) => (
            <div
              key={t.id}
              className={cn(
                "border p-5",
                t.id === current.id
                  ? "border-ink bg-surface"
                  : "border-line bg-ivory"
              )}
            >
              <div className="flex items-center justify-between">
                <p className="font-display text-2xl">{t.name}</p>
                <span className="text-[10px] uppercase tracking-[0.12em] text-muted">
                  {t.min}+ pts
                </span>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-ink-soft">
                {t.perks.map((p) => (
                  <li key={p}>· {p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
          Redeem
        </h2>
        <div className="mt-4 space-y-2">
          {[
            { pts: 200, label: "$10 off", discount: 10 },
            { pts: 400, label: "$25 off", discount: 25 },
            { pts: 800, label: "$50 off", discount: 50 },
          ].map((r) => (
            <button
              key={r.pts}
              onClick={() => redeemReward(r.pts, r.label, r.discount)}
              disabled={points < r.pts}
              className="flex w-full items-center justify-between border border-line bg-surface px-5 py-4 text-left transition hover:border-ink disabled:opacity-40"
            >
              <span className="text-sm font-medium">{r.label}</span>
              <span className="text-[11px] uppercase tracking-[0.12em] text-muted">
                {r.pts} pts
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
          Earn faster
        </h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {[
            { href: "/quiz", label: "Match quiz", pts: "+50" },
            { href: "/routines", label: "Add a ritual", pts: "+25" },
            { href: "/shop", label: "Shop · $1 = 1 pt", pts: "∞" },
          ].map((x) => (
            <Link
              key={x.href}
              href={x.href}
              className="border border-line p-4 text-center transition hover:border-ink"
            >
              <p className="font-display text-xl text-champagne">{x.pts}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.12em]">{x.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {log.length > 0 && (
        <section className="mt-12">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
            Activity
          </h2>
          <ul className="mt-4 max-h-56 space-y-2 overflow-y-auto">
            {log.map((e) => (
              <li
                key={e.id}
                className="flex justify-between border-b border-line py-2 text-sm"
              >
                <span className="text-muted">{e.reason}</span>
                <span
                  className={cn(
                    "tabular-nums font-medium",
                    e.pts >= 0 ? "text-ok" : "text-ink"
                  )}
                >
                  {e.pts >= 0 ? "+" : ""}
                  {e.pts}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="/quiz" className="btn-primary">
          <Sparkles size={14} /> Earn with quiz
        </Link>
        <Link href="/shop" className="btn-ghost">
          Shop the house
        </Link>
      </div>
    </div>
  );
}
