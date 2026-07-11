"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { BrandShell } from "@/components/brand/BrandShell";
import { useBrandPortal } from "@/hooks/useBrandPortal";
import { PLAN_DEFS, yearlySavings } from "@/lib/plans";
import type { BrandBilling, BrandPlan } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function BrandBillingPage() {
  const { brand, role, member, loading, reload, can } = useBrandPortal();
  const [billing, setBilling] = useState<BrandBilling | null>(null);
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");
  const [selected, setSelected] = useState<BrandPlan>("growth");
  const [card, setCard] = useState("4242 4242 4242 4242");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!brand) return;
    setSelected(brand.plan);
    setBilling(brand.billing || null);
    fetch("/api/brands/me/billing")
      .then((r) => r.json())
      .then((d) => {
        if (d.billing) setBilling(d.billing);
      })
      .catch(() => {});
  }, [brand]);

  async function onPay(e: FormEvent) {
    e.preventDefault();
    if (!can("billing:write")) {
      setError("Only the owner can change billing");
      return;
    }
    setPaying(true);
    setError("");
    setMsg("");
    try {
      const res = await fetch("/api/brands/me/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: selected,
          interval,
          cardNumber: card,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment failed");
      setBilling(data.brand.billing);
      setMsg(
        `Paid $${data.invoice.amount} · plan ${data.brand.plan} · invoice ${data.invoice.number}`
      );
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setPaying(false);
    }
  }

  if (loading || !brand) {
    return <div className="p-16 text-center text-muted">Loading…</div>;
  }

  const price = PLAN_DEFS[selected]
    ? interval === "yearly"
      ? PLAN_DEFS[selected].yearly
      : PLAN_DEFS[selected].monthly
    : 0;

  return (
    <BrandShell brand={brand} role={role} memberName={member?.name}>
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-dim)]">
          Monetization
        </p>
        <h1 className="mt-1 font-display text-4xl text-[var(--text)]">
          Plans & billing
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--text-dim)]">
          Seat limits, product caps, and custom domains unlock with Growth+. Demo
          checkout logs a receipt email to your brand inbox (see{" "}
          <code className="text-champagne">/api/outbox</code>).
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="border border-[var(--border)] bg-[var(--panel)] p-5">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--text-dim)]">
            Current plan
          </p>
          <p className="mt-2 font-display text-3xl capitalize text-[var(--text)]">
            {brand.plan}
          </p>
        </div>
        <div className="border border-[var(--border)] bg-[var(--panel)] p-5">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--text-dim)]">
            Billing status
          </p>
          <p className="mt-2 font-display text-3xl capitalize text-[var(--text)]">
            {billing?.status || "trial"}
          </p>
        </div>
        <div className="border border-[var(--border)] bg-[var(--panel)] p-5">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--text-dim)]">
            Seats
          </p>
          <p className="mt-2 font-display text-3xl text-[var(--text)]">
            {brand.seatsUsed ?? "—"}/{brand.seatLimit}
          </p>
        </div>
      </div>

      <div className="mb-6 flex gap-2">
        {(["monthly", "yearly"] as const).map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setInterval(i)}
            className={cn(
              "px-4 py-2 text-[11px] uppercase tracking-[0.14em]",
              interval === i
                ? "bg-champagne text-ink"
                : "border border-[var(--border)] text-[var(--text)]"
            )}
          >
            {i}
            {i === "yearly" ? " · save 2 mo" : ""}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {(Object.keys(PLAN_DEFS) as BrandPlan[]).map((id) => {
          const p = PLAN_DEFS[id];
          const amt = interval === "yearly" ? p.yearly : p.monthly;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setSelected(id)}
              className={cn(
                "border p-5 text-left transition",
                selected === id
                  ? "border-champagne bg-[var(--panel)]"
                  : "border-[var(--border)] bg-[var(--panel-2)] hover:border-champagne/50"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-display text-2xl text-[var(--text)]">
                  {p.name}
                </p>
                {brand.plan === id && (
                  <span className="text-[9px] uppercase tracking-[0.12em] text-champagne">
                    Current
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-[var(--text-dim)]">{p.tagline}</p>
              <p className="mt-4 font-display text-3xl text-[var(--text)]">
                ${amt}
                <span className="text-sm text-[var(--text-dim)]">
                  /{interval === "yearly" ? "yr" : "mo"}
                </span>
              </p>
              {interval === "yearly" && (
                <p className="mt-1 text-[10px] text-champagne">
                  Save ${yearlySavings(id)}/yr
                </p>
              )}
              <ul className="mt-4 space-y-1 text-xs text-[var(--text-dim)]">
                {p.features.map((f) => (
                  <li key={f}>· {f}</li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <form
        onSubmit={onPay}
        className="mt-10 max-w-lg space-y-4 border border-[var(--border)] bg-[var(--panel)] p-6"
      >
        <h2 className="text-sm font-medium text-[var(--text)]">
          Demo checkout · ${price} {PLAN_DEFS[selected].name}
        </h2>
        <p className="text-xs text-[var(--text-dim)]">
          Use card <code className="text-champagne">4242…</code> — no real charge.
          Receipt emails the brand owner.
        </p>
        <div>
          <label className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
            Card number
          </label>
          <input
            value={card}
            onChange={(e) => setCard(e.target.value)}
            className="w-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 font-mono text-sm text-[var(--text)]"
          />
        </div>
        <button
          type="submit"
          disabled={paying || !can("billing:write")}
          className="bg-champagne px-6 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-ink disabled:opacity-50"
        >
          {paying ? "Processing…" : `Pay $${price} & activate`}
        </button>
        {msg && <p className="text-sm text-emerald-400">{msg}</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
      </form>

      {billing?.invoices && billing.invoices.length > 0 && (
        <section className="mt-12">
          <h2 className="text-[11px] uppercase tracking-[0.16em] text-[var(--text-dim)]">
            Invoices
          </h2>
          <ul className="mt-4 space-y-2">
            {billing.invoices.map((inv) => (
              <li
                key={inv.id}
                className="flex flex-wrap items-center justify-between gap-2 border border-[var(--border)] px-4 py-3 text-sm text-[var(--text)]"
              >
                <span className="font-mono text-xs">{inv.number}</span>
                <span className="capitalize">
                  {inv.plan} · {inv.interval}
                </span>
                <span>${inv.amount}</span>
                <span className="text-[var(--text-dim)]">{inv.status}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-10 flex flex-wrap gap-3 text-sm">
        <Link href="/brand/whitelabel" className="text-champagne hover:underline">
          Configure domain →
        </Link>
        <Link href="/brand/team" className="text-[var(--text-dim)] hover:underline">
          Manage seats →
        </Link>
      </div>
    </BrandShell>
  );
}
