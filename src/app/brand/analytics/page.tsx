"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BrandShell } from "@/components/brand/BrandShell";
import { useBrandPortal } from "@/hooks/useBrandPortal";
import { HOUSE_BRANDS } from "@/lib/house-brands";

interface Summary {
  brandSlug: string;
  total: number;
  floorViews: number;
  productViews: number;
  addToBag: number;
  tryOnOpens: number;
  quizComplete: number;
  liveRsvp: number;
  conciergeBook: number;
  topProducts: { slug: string; n: number }[];
}

export default function BrandAnalyticsPage() {
  const { brand, role, member, loading } = useBrandPortal();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [slug, setSlug] = useState("lumea");

  useEffect(() => {
    // Map SaaS brand to house floor when possible
    if (brand?.slug) {
      const match = HOUSE_BRANDS.find(
        (b) =>
          b.slug === brand.slug ||
          brand.slug.includes(b.slug) ||
          b.name.toLowerCase().includes(brand.name.toLowerCase().slice(0, 4))
      );
      setSlug(match?.slug || "glowlab");
    }
  }, [brand]);

  useEffect(() => {
    fetch(`/api/analytics/summary?brand=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then(setSummary)
      .catch(() => {});
  }, [slug]);

  if (loading || !brand) {
    return <div className="p-16 text-center text-muted">Loading…</div>;
  }

  const cards = summary
    ? [
        { l: "Floor views", n: summary.floorViews },
        { l: "Product views", n: summary.productViews },
        { l: "Add to bag", n: summary.addToBag },
        { l: "Try-on opens", n: summary.tryOnOpens },
        { l: "Live RSVPs", n: summary.liveRsvp },
        { l: "Concierge", n: summary.conciergeBook },
      ]
    : [];

  return (
    <BrandShell brand={brand} role={role} memberName={member?.name}>
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-dim)]">
          Brand intelligence
        </p>
        <h1 className="mt-1 font-display text-4xl text-[var(--text)]">
          Floor analytics
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--text-dim)]">
          Why brands pay for a LUMÉA floor: try-ons, live RSVPs, add-to-bag, and
          concierge demand — sell-through signals department stores never gave
          you online.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {HOUSE_BRANDS.filter((b) => b.featured).map((b) => (
          <button
            key={b.slug}
            type="button"
            onClick={() => setSlug(b.slug)}
            className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] ${
              slug === b.slug
                ? "bg-champagne text-ink"
                : "border border-[var(--border)] text-[var(--text)]"
            }`}
          >
            {b.name}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((c) => (
          <div
            key={c.l}
            className="border border-[var(--border)] bg-[var(--panel)] p-4"
          >
            <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
              {c.l}
            </p>
            <p className="mt-2 font-display text-3xl text-[var(--text)]">{c.n}</p>
          </div>
        ))}
      </div>

      {summary && summary.topProducts.length > 0 && (
        <section className="mt-10">
          <h2 className="text-[11px] uppercase tracking-[0.16em] text-[var(--text-dim)]">
            Top products (events)
          </h2>
          <ul className="mt-4 space-y-2">
            {summary.topProducts.map((p) => (
              <li
                key={p.slug}
                className="flex justify-between border border-[var(--border)] px-4 py-3 text-sm text-[var(--text)]"
              >
                <span className="font-mono text-xs">{p.slug}</span>
                <span>{p.n}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-10 flex flex-wrap gap-3 text-sm">
        <Link href="/brand/billing" className="text-champagne hover:underline">
          Upgrade for featured floor →
        </Link>
        <Link href="/live" className="text-[var(--text-dim)] hover:underline">
          Host a live room →
        </Link>
        <Link
          href={`/brands/${slug}`}
          className="text-[var(--text-dim)] hover:underline"
        >
          Public floor →
        </Link>
      </div>
    </BrandShell>
  );
}
