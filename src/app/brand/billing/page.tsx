"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CreditCard, Lock, Sparkles, Zap } from "lucide-react";
import { BrandShell } from "@/components/brand/BrandShell";
import { useBrandPortal } from "@/hooks/useBrandPortal";
import { PLAN_DEFS, yearlySavings } from "@/lib/plans";
import type { BrandBilling, BrandPlan } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

function BillingInner() {
  const params = useSearchParams();
  const { brand, role, member, loading, reload, can } = useBrandPortal();
  const [billing, setBilling] = useState<BrandBilling | null>(null);
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");
  const [selected, setSelected] = useState<BrandPlan>("growth");
  const [card, setCard] = useState("4242 4242 4242 4242");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const [stripeOn, setStripeOn] = useState(false);
  const [stripeMode, setStripeMode] = useState("demo");

  useEffect(() => {
    fetch("/api/stripe/status")
      .then((r) => r.json())
      .then((d) => {
        setStripeOn(Boolean(d.enabled));
        setStripeMode(d.mode || "demo");
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const s = params.get("stripe");
    if (s === "success") {
      setMsg(
        "Stripe checkout completed. If plan hasn’t flipped yet, webhook is still processing — refresh in a moment."
      );
      reload();
    }
    if (s === "cancel") setError("Stripe checkout cancelled — no charge.");
  }, [params, reload]);

  useEffect(() => {
    if (!brand) return;
    setSelected(brand.plan === "starter" ? "growth" : brand.plan);
    setBilling(brand.billing || null);
    fetch("/api/brands/me/billing")
      .then((r) => r.json())
      .then((d) => {
        if (d.billing) setBilling(d.billing);
      })
      .catch(() => {});
  }, [brand]);

  async function payWithStripe() {
    if (!can("billing:write")) {
      setError("Only the brand owner can change billing");
      return;
    }
    setPaying(true);
    setError("");
    setMsg("");
    try {
      const res = await fetch("/api/brands/me/billing/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selected, interval }),
      });
      const data = await res.json();
      if (res.status === 503 || data.demo) {
        setError("Stripe keys not set — use demo checkout below, or add STRIPE_SECRET_KEY.");
        return;
      }
      if (!res.ok) throw new Error(data.error || "Stripe failed");
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("No checkout URL returned");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Stripe failed");
    } finally {
      setPaying(false);
    }
  }

  async function onDemoPay(e: FormEvent) {
    e.preventDefault();
    if (!can("billing:write")) {
      setError("Only the brand owner can change billing");
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
        `${PLAN_DEFS[selected].name} is live · invoice ${data.invoice.number} · receipt emailed`
      );
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setPaying(false);
    }
  }

  if (loading || !brand) {
    return <div className="p-16 text-center text-muted">Loading billing…</div>;
  }

  const price = PLAN_DEFS[selected]
    ? interval === "yearly"
      ? PLAN_DEFS[selected].yearly
      : PLAN_DEFS[selected].monthly
    : 0;

  return (
    <BrandShell brand={brand} role={role} memberName={member?.name}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-dim)]">
            Plans & seats
          </p>
          <h1 className="mt-1 font-display text-4xl text-[var(--text)]">
            Billing
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[var(--text-dim)]">
            Unlock seats, product caps, and custom domains.{" "}
            {stripeOn ? (
              <span className="text-champagne">
                Stripe {stripeMode} mode is on.
              </span>
            ) : (
              <span>
                Demo mode — no real charge. Connect Stripe keys for live
                subscriptions.
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 border border-[var(--border)] px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
          <Lock size={12} className="text-champagne" />
          {stripeOn ? "Stripe Checkout" : "Demo checkout"}
        </div>
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {[
          {
            label: "Plan",
            value: brand.plan,
          },
          {
            label: "Status",
            value: billing?.status || "trial",
          },
          {
            label: "Seats",
            value: `${brand.seatsUsed ?? "—"} / ${brand.seatLimit}`,
          },
        ].map((c) => (
          <div
            key={c.label}
            className="border border-[var(--border)] bg-[var(--panel)] p-5"
          >
            <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--text-dim)]">
              {c.label}
            </p>
            <p className="mt-2 font-display text-3xl capitalize text-[var(--text)]">
              {c.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
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
            {i === "yearly" ? "Yearly · save ~2 months" : "Monthly"}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {(Object.keys(PLAN_DEFS) as BrandPlan[]).map((id) => {
          const p = PLAN_DEFS[id];
          const amt = interval === "yearly" ? p.yearly : p.monthly;
          const isCurrent = brand.plan === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setSelected(id)}
              className={cn(
                "relative border p-5 text-left transition",
                selected === id
                  ? "border-champagne bg-[var(--panel)] ring-1 ring-champagne/40"
                  : "border-[var(--border)] bg-[var(--panel-2)] hover:border-champagne/40"
              )}
            >
              {id === "growth" && (
                <span className="absolute right-3 top-3 text-[9px] uppercase tracking-[0.12em] text-champagne">
                  Popular
                </span>
              )}
              <p className="font-display text-2xl text-[var(--text)]">{p.name}</p>
              <p className="mt-1 text-xs text-[var(--text-dim)]">{p.tagline}</p>
              <p className="mt-4 font-display text-3xl text-[var(--text)]">
                ${amt}
                <span className="text-sm text-[var(--text-dim)]">
                  /{interval === "yearly" ? "yr" : "mo"}
                </span>
              </p>
              {interval === "yearly" && (
                <p className="mt-1 text-[10px] text-champagne">
                  Save ${yearlySavings(id)} vs monthly
                </p>
              )}
              {isCurrent && (
                <p className="mt-2 text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
                  Current plan
                </p>
              )}
              <ul className="mt-4 space-y-1.5 text-xs text-[var(--text-dim)]">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Zap size={12} className="mt-0.5 shrink-0 text-champagne" />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="border border-[var(--border)] bg-[var(--panel)] p-6">
          <div className="flex items-center gap-2">
            <CreditCard size={16} className="text-champagne" />
            <h2 className="text-sm font-medium text-[var(--text)]">
              Pay with Stripe
            </h2>
          </div>
          <p className="mt-2 text-xs text-[var(--text-dim)]">
            Hosted Checkout · subscriptions · invoices. Requires{" "}
            <code className="text-champagne">STRIPE_SECRET_KEY</code>.
          </p>
          <p className="mt-4 font-display text-3xl text-[var(--text)]">
            ${price}
            <span className="text-sm text-[var(--text-dim)]">
              {" "}
              · {PLAN_DEFS[selected].name}
            </span>
          </p>
          <button
            type="button"
            onClick={payWithStripe}
            disabled={paying || !can("billing:write")}
            className="mt-5 w-full bg-[#635bff] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-white disabled:opacity-50"
          >
            {paying ? "Redirecting…" : "Continue to Stripe"}
          </button>
          {!stripeOn && (
            <p className="mt-3 text-[11px] text-[var(--text-dim)]">
              Keys missing — button will explain. Use demo checkout →
            </p>
          )}
        </div>

        <form
          onSubmit={onDemoPay}
          className="border border-[var(--border)] bg-[var(--panel)] p-6"
        >
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-champagne" />
            <h2 className="text-sm font-medium text-[var(--text)]">
              Demo activate
            </h2>
          </div>
          <p className="mt-2 text-xs text-[var(--text-dim)]">
            Instant plan upgrade for demos. Card{" "}
            <code className="text-champagne">4242…</code> · no real charge ·
            receipt to brand email.
          </p>
          <div className="mt-4">
            <label className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
              Test card
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
            className="mt-5 w-full bg-champagne px-6 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-ink disabled:opacity-50"
          >
            {paying ? "Activating…" : `Activate ${PLAN_DEFS[selected].name} · $${price}`}
          </button>
        </form>
      </div>

      {msg && (
        <p className="mt-6 border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {msg}
        </p>
      )}
      {error && (
        <p className="mt-4 border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {billing?.invoices && billing.invoices.length > 0 && (
        <section className="mt-12">
          <h2 className="text-[11px] uppercase tracking-[0.16em] text-[var(--text-dim)]">
            Invoices
          </h2>
          <ul className="mt-4 divide-y divide-[var(--border)] border border-[var(--border)]">
            {billing.invoices.map((inv) => (
              <li
                key={inv.id}
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm text-[var(--text)]"
              >
                <span className="font-mono text-xs">{inv.number}</span>
                <span className="capitalize text-[var(--text-dim)]">
                  {inv.plan} · {inv.interval}
                </span>
                <span>${inv.amount}</span>
                <span className="text-[10px] uppercase tracking-[0.1em] text-champagne">
                  {inv.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-10 flex flex-wrap gap-4 text-sm">
        <Link href="/brand/whitelabel" className="text-champagne hover:underline">
          Custom domains (Growth+) →
        </Link>
        <Link
          href="/brand/team"
          className="text-[var(--text-dim)] hover:underline"
        >
          Team seats →
        </Link>
        <Link href="/platform" className="text-[var(--text-dim)] hover:underline">
          Public pricing →
        </Link>
      </div>
    </BrandShell>
  );
}

export default function BrandBillingPage() {
  return (
    <Suspense
      fallback={<div className="p-16 text-center text-muted">Loading…</div>}
    >
      <BillingInner />
    </Suspense>
  );
}
