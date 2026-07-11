"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BrandShell } from "@/components/brand/BrandShell";
import type { Brand, WhiteLabelConfig } from "@/lib/types";

export default function BrandWhitelabelPage() {
  const router = useRouter();
  const [brand, setBrand] = useState<Omit<Brand, "password"> | null>(null);
  const [wl, setWl] = useState<WhiteLabelConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/brands/me").then(async (r) => {
      if (!r.ok) {
        router.replace("/brand");
        return;
      }
      const d = await r.json();
      setBrand(d.brand);
      setWl(d.brand.whiteLabel);
    });
  }, [router]);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!wl) return;
    setSaving(true);
    setMsg("");
    setError("");
    try {
      const res = await fetch("/api/brands/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whiteLabel: wl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setBrand(data.brand);
      setWl(data.brand.whiteLabel);
      setMsg("White-label settings saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (!brand || !wl) {
    return <div className="p-16 text-center text-muted">Loading…</div>;
  }

  const previewPath = `/b/${wl.subdomain}`;

  return (
    <BrandShell brand={brand}>
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-dim)]">
          Domains & theme
        </p>
        <h1 className="mt-1 font-display text-4xl text-[var(--text)]">
          White-label
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--text-dim)]">
          Point a custom domain or use a LUMÉA subdomain. Theme your storefront
          colours and branding — Mirror Studio stays powered by LUMÉA.
        </p>
      </div>

      <form onSubmit={onSave} className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-5 border border-[var(--border)] bg-[var(--panel)] p-6">
          <h2 className="text-sm font-medium text-[var(--text)]">Storefront identity</h2>
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
              Store name
            </label>
            <input
              value={wl.storeName}
              onChange={(e) => setWl({ ...wl, storeName: e.target.value })}
              className="w-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm text-[var(--text)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
              Tagline
            </label>
            <input
              value={wl.tagline}
              onChange={(e) => setWl({ ...wl, tagline: e.target.value })}
              className="w-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm text-[var(--text)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
              Support email
            </label>
            <input
              value={wl.supportEmail}
              onChange={(e) => setWl({ ...wl, supportEmail: e.target.value })}
              className="w-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm text-[var(--text)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
              Logo URL
            </label>
            <input
              value={wl.logoUrl}
              onChange={(e) => setWl({ ...wl, logoUrl: e.target.value })}
              className="w-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm text-[var(--text)]"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-[var(--text)]">
            <input
              type="checkbox"
              checked={wl.enabled}
              onChange={(e) => setWl({ ...wl, enabled: e.target.checked })}
            />
            Storefront enabled
          </label>
        </div>

        <div className="space-y-5 border border-[var(--border)] bg-[var(--panel)] p-6">
          <h2 className="text-sm font-medium text-[var(--text)]">Domains</h2>
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
              Subdomain (path preview)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--text-dim)]">/b/</span>
              <input
                value={wl.subdomain}
                onChange={(e) =>
                  setWl({
                    ...wl,
                    subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                  })
                }
                className="min-w-0 flex-1 border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 font-mono text-sm text-[var(--text)]"
              />
            </div>
            <p className="mt-2 text-xs text-[var(--text-dim)]">
              Local preview:{" "}
              <Link href={previewPath} className="text-champagne hover:underline">
                {previewPath}
              </Link>
            </p>
            <p className="mt-1 text-xs text-[var(--text-dim)]">
              Production pattern:{" "}
              <code className="text-champagne">{wl.subdomain}.lumea.beauty</code>
            </p>
          </div>
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
              Custom domain
            </label>
            <input
              value={wl.customDomain}
              onChange={(e) => setWl({ ...wl, customDomain: e.target.value })}
              placeholder="shop.yourbrand.com"
              className="w-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 font-mono text-sm text-[var(--text)]"
            />
            <p className="mt-2 text-xs text-[var(--text-dim)]">
              Point a CNAME to{" "}
              <code className="text-champagne">edge.lumea.beauty</code> then save
              here. Resolver API:{" "}
              <code className="text-champagne">/api/brands/resolve?host=</code>
            </p>
          </div>

          <h2 className="pt-2 text-sm font-medium text-[var(--text)]">Theme</h2>
          <div className="grid grid-cols-3 gap-3">
            {(
              [
                ["primaryColor", "Primary"],
                ["accentColor", "Accent"],
                ["backgroundColor", "Background"],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
                  {label}
                </label>
                <input
                  type="color"
                  value={wl[key]}
                  onChange={(e) => setWl({ ...wl, [key]: e.target.value })}
                  className="h-10 w-full cursor-pointer border border-[var(--border)] bg-transparent"
                />
              </div>
            ))}
          </div>

          {/* Live mini preview */}
          <div
            className="mt-2 border border-[var(--border)] p-5"
            style={{ background: wl.backgroundColor, color: wl.primaryColor }}
          >
            <p
              className="font-display text-2xl tracking-[0.12em]"
              style={{ color: wl.primaryColor }}
            >
              {wl.storeName || brand.name}
            </p>
            <p className="mt-1 text-xs" style={{ color: wl.accentColor }}>
              {wl.tagline}
            </p>
            <button
              type="button"
              className="mt-4 px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-white"
              style={{ background: wl.primaryColor }}
            >
              Shop collection
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-champagne px-6 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-ink disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save white-label"}
          </button>
          <Link
            href={previewPath}
            className="border border-[var(--border)] px-6 py-3 text-[11px] uppercase tracking-[0.14em] text-[var(--text)]"
          >
            Open storefront
          </Link>
          {msg && <p className="text-sm text-emerald-400">{msg}</p>}
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>
      </form>
    </BrandShell>
  );
}
