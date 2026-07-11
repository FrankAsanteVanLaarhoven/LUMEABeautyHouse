"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { BrandShell } from "@/components/brand/BrandShell";
import { useBrandPortal } from "@/hooks/useBrandPortal";
import type { StudioSkinConfig } from "@/lib/types";

export default function BrandStudioSkinPage() {
  const { brand, role, member, loading, can } = useBrandPortal();
  const [skin, setSkin] = useState<StudioSkinConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (brand?.studioSkin) setSkin({ ...brand.studioSkin });
  }, [brand]);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!skin || !can("studio:write")) return;
    setSaving(true);
    setMsg("");
    setError("");
    try {
      const res = await fetch("/api/brands/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studioSkin: skin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setSkin(data.brand.studioSkin);
      setMsg("Mirror Studio skin saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !brand || !skin) {
    return <div className="p-16 text-center text-muted">Loading…</div>;
  }

  const preview = `/b/${brand.whiteLabel.subdomain}/studio`;
  const readOnly = !can("studio:write");

  return (
    <BrandShell brand={brand} role={role} memberName={member?.name}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-dim)]">
            Mirror Studio
          </p>
          <h1 className="mt-1 font-display text-4xl text-[var(--text)]">
            Studio skinning
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[var(--text-dim)]">
            Brand the try-on room: vanity colours, ring light, CTA buttons,
            watermark, and default look. Clients see your skin on the storefront
            studio.
          </p>
        </div>
        <Link
          href={preview}
          target="_blank"
          className="border border-[var(--border)] px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-champagne"
        >
          Preview branded studio →
        </Link>
      </div>

      <form onSubmit={onSave} className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4 border border-[var(--border)] bg-[var(--panel)] p-6">
          <h2 className="text-sm font-medium text-[var(--text)]">Identity</h2>
          {(
            [
              ["studioName", "Studio name"],
              ["headline", "Headline"],
              ["subheadline", "Subheadline"],
              ["watermark", "Watermark"],
              ["logoUrl", "Logo URL"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
                {label}
              </label>
              {key === "subheadline" ? (
                <textarea
                  disabled={readOnly}
                  value={skin[key]}
                  onChange={(e) => setSkin({ ...skin, [key]: e.target.value })}
                  className="min-h-[70px] w-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm text-[var(--text)] disabled:opacity-50"
                />
              ) : (
                <input
                  disabled={readOnly}
                  value={skin[key]}
                  onChange={(e) => setSkin({ ...skin, [key]: e.target.value })}
                  className="w-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm text-[var(--text)] disabled:opacity-50"
                />
              )}
            </div>
          ))}
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
              Default look
            </label>
            <select
              disabled={readOnly}
              value={skin.defaultLook}
              onChange={(e) =>
                setSkin({
                  ...skin,
                  defaultLook: e.target.value as StudioSkinConfig["defaultLook"],
                })
              }
              className="w-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm text-[var(--text)]"
            >
              <option value="brand">Brand vanity</option>
              <option value="mirror-white">Crisp white</option>
              <option value="soft-luxe">Soft luxe</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-[var(--text)]">
            <input
              type="checkbox"
              disabled={readOnly}
              checked={skin.enabled}
              onChange={(e) => setSkin({ ...skin, enabled: e.target.checked })}
            />
            Studio skin enabled
          </label>
          <label className="flex items-center gap-2 text-sm text-[var(--text)]">
            <input
              type="checkbox"
              disabled={readOnly}
              checked={skin.showPoweredBy}
              onChange={(e) =>
                setSkin({ ...skin, showPoweredBy: e.target.checked })
              }
            />
            Show “Powered by LUMÉA”
          </label>
        </div>

        <div className="space-y-4 border border-[var(--border)] bg-[var(--panel)] p-6">
          <h2 className="text-sm font-medium text-[var(--text)]">Colours</h2>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                ["frameColor", "Frame"],
                ["ringLightColor", "Ring light"],
                ["panelColor", "Panel"],
                ["textColor", "Text"],
                ["accentColor", "Accent"],
                ["buttonColor", "Button"],
                ["buttonTextColor", "Button text"],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <label className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
                  {label}
                </label>
                <input
                  type="color"
                  disabled={readOnly}
                  value={skin[key]}
                  onChange={(e) => setSkin({ ...skin, [key]: e.target.value })}
                  className="h-10 w-full cursor-pointer border border-[var(--border)] bg-transparent disabled:opacity-50"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
                Default brightness ({Math.round(skin.defaultBrightness * 100)}%)
              </label>
              <input
                type="range"
                min={0.85}
                max={1.35}
                step={0.01}
                disabled={readOnly}
                value={skin.defaultBrightness}
                onChange={(e) =>
                  setSkin({
                    ...skin,
                    defaultBrightness: Number(e.target.value),
                  })
                }
                className="w-full accent-champagne"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-[var(--text-dim)]">
                Default intensity ({Math.round(skin.defaultIntensity * 100)}%)
              </label>
              <input
                type="range"
                min={0.1}
                max={0.9}
                step={0.01}
                disabled={readOnly}
                value={skin.defaultIntensity}
                onChange={(e) =>
                  setSkin({
                    ...skin,
                    defaultIntensity: Number(e.target.value),
                  })
                }
                className="w-full accent-champagne"
              />
            </div>
          </div>

          {/* Live chrome preview */}
          <div
            className="mt-4 overflow-hidden border border-[var(--border)]"
            style={{ background: skin.frameColor, color: skin.textColor }}
          >
            <div
              className="px-4 py-3 text-[10px] uppercase tracking-[0.16em]"
              style={{ background: skin.panelColor }}
            >
              {skin.studioName}
            </div>
            <div className="relative aspect-[16/10] p-4">
              <div
                className="absolute inset-4 rounded-sm"
                style={{
                  boxShadow: `inset 0 0 40px ${skin.ringLightColor}88`,
                  background: "#ddd",
                }}
              />
              <div className="relative z-10 flex h-full flex-col justify-end">
                <p className="font-display text-xl">{skin.headline}</p>
                <p className="mt-1 text-xs opacity-70 line-clamp-2">
                  {skin.subheadline}
                </p>
                <button
                  type="button"
                  className="mt-3 self-start px-4 py-2 text-[10px] uppercase tracking-[0.14em]"
                  style={{
                    background: skin.buttonColor,
                    color: skin.buttonTextColor,
                  }}
                >
                  Start mirror camera
                </button>
                {skin.watermark && (
                  <p
                    className="mt-2 text-[9px] uppercase tracking-[0.2em]"
                    style={{ color: skin.accentColor }}
                  >
                    {skin.watermark}
                    {skin.showPoweredBy && " · LUMÉA"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {!readOnly && (
          <div className="lg:col-span-2 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-champagne px-6 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-ink disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save studio skin"}
            </button>
            {msg && <p className="text-sm text-emerald-400">{msg}</p>}
            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>
        )}
        {readOnly && (
          <p className="lg:col-span-2 text-sm text-[var(--text-dim)]">
            Your role ({role}) can view studio skin but not edit it.
          </p>
        )}
      </form>
    </BrandShell>
  );
}
