"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BrandShell } from "@/components/brand/BrandShell";
import type { Brand, Product } from "@/lib/types";

export default function BrandDashboardPage() {
  const router = useRouter();
  const [brand, setBrand] = useState<Omit<Brand, "password"> | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/brands/me")
      .then(async (r) => {
        if (!r.ok) {
          router.replace("/brand");
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (!d) return;
        setBrand(d.brand);
        setProducts(d.products || []);
      });
  }, [router]);

  if (!brand) {
    return (
      <div className="p-16 text-center text-muted">Loading brand portal…</div>
    );
  }

  const wl = brand.whiteLabel;
  const cards = [
    { label: "Products", value: String(products.length), href: "/brand/products" },
    { label: "Plan", value: brand.plan, href: "/brand/whitelabel" },
    {
      label: "Storefront",
      value: wl.enabled ? "Live" : "Off",
      href: `/b/${wl.subdomain}`,
    },
    {
      label: "Domain",
      value: wl.customDomain || `${wl.subdomain}.lumea.beauty`,
      href: "/brand/whitelabel",
    },
  ];

  return (
    <BrandShell brand={brand}>
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-dim)]">
          Overview
        </p>
        <h1 className="mt-1 font-display text-4xl text-[var(--text)]">
          Welcome, {brand.contactName || brand.name}
        </h1>
        <p className="mt-2 text-sm text-[var(--text-dim)]">
          Manage catalogue, CSV imports, and white-label domain for{" "}
          <strong className="text-[var(--text)]">{brand.name}</strong>.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="border border-[var(--border)] bg-[var(--panel)] p-5 transition hover:border-champagne/40"
            >
              <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--text-dim)]">
                {c.label}
              </p>
              <p className="mt-2 truncate font-display text-2xl text-[var(--text)]">
                {c.value}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <div className="border border-[var(--border)] bg-[var(--panel)] p-6">
            <h2 className="text-sm font-medium text-[var(--text)]">Quick actions</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/brand/upload"
                className="bg-champagne px-4 py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-ink"
              >
                Upload CSV
              </Link>
              <Link
                href="/brand/products"
                className="border border-[var(--border)] px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-[var(--text)]"
              >
                Add product
              </Link>
              <Link
                href="/brand/whitelabel"
                className="border border-[var(--border)] px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-[var(--text)]"
              >
                Configure domain
              </Link>
              <Link
                href={`/b/${wl.subdomain}`}
                className="border border-[var(--border)] px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-champagne"
              >
                Open storefront
              </Link>
            </div>
          </div>
          <div className="border border-[var(--border)] bg-[var(--panel)] p-6">
            <h2 className="text-sm font-medium text-[var(--text)]">White-label status</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--text-dim)]">Subdomain</dt>
                <dd className="font-mono text-xs text-[var(--text)]">
                  /b/{wl.subdomain}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--text-dim)]">Custom domain</dt>
                <dd className="text-[var(--text)]">
                  {wl.customDomain || "— not set —"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--text-dim)]">Theme</dt>
                <dd className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ background: wl.primaryColor }}
                  />
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ background: wl.accentColor }}
                  />
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {products.length > 0 && (
          <div className="mt-10 border border-[var(--border)] bg-[var(--panel)]">
            <div className="border-b border-[var(--border)] px-5 py-4">
              <h2 className="text-sm font-medium text-[var(--text)]">
                Recent products
              </h2>
            </div>
            <ul className="divide-y divide-[var(--border)]">
              {products.slice(0, 5).map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between px-5 py-3 text-sm"
                >
                  <span className="text-[var(--text)]">{p.name}</span>
                  <span className="text-[var(--text-dim)] capitalize">
                    {p.category} · ${p.price}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </BrandShell>
  );
}
