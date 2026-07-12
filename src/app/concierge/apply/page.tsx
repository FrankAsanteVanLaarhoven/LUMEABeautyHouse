"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { SPECIALTY_LABELS, type ExpertSpecialty } from "@/lib/concierge-experts";
import { HOUSE_BRANDS } from "@/lib/house-brands";
import { BadgeCheck } from "lucide-react";

const SPECS = Object.keys(SPECIALTY_LABELS) as ExpertSpecialty[];

export default function ConciergeApplyPage() {
  const [specs, setSpecs] = useState<ExpertSpecialty[]>(["shade-match"]);
  const [brands, setBrands] = useState<string[]>(["lumea"]);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleSpec(s: ExpertSpecialty) {
    setSpecs((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }
  function toggleBrand(slug: string) {
    setBrands((prev) =>
      prev.includes(slug) ? prev.filter((x) => x !== slug) : [...prev, slug]
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setMsg("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/concierge/experts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          title: fd.get("title"),
          bio: fd.get("bio"),
          instagram: fd.get("instagram"),
          yearsExp: fd.get("yearsExp"),
          specialties: specs,
          brandSlugs: brands,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMsg(data.message);
      e.currentTarget.reset();
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-14 md:px-8 md:py-20">
      <p className="text-[10px] uppercase tracking-[0.24em] text-champagne">
        Verified experts
      </p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">
        Become a Beauty Concierge
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        Charge for 1:1, group, wedding, and event live streams. Keep ~80% of
        session fees and earn product commissions when clients buy what you
        recommend — driving traffic with real industry knowledge, not cold ads.
      </p>

      <ul className="mt-6 space-y-2 border border-line bg-surface p-5 text-sm text-ink-soft">
        <li className="flex gap-2">
          <BadgeCheck size={16} className="shrink-0 text-champagne" />
          Verification review before you go live on the marketplace
        </li>
        <li className="flex gap-2">
          <BadgeCheck size={16} className="shrink-0 text-champagne" />
          Set formats: private, friends, bridal party, event glam
        </li>
        <li className="flex gap-2">
          <BadgeCheck size={16} className="shrink-0 text-champagne" />
          Affiliate brands you know (Coil Atelier, Casa Luz, LUMÉA…)
        </li>
      </ul>

      <form onSubmit={onSubmit} className="mt-10 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Full name</label>
            <input name="name" required className="field" />
          </div>
          <div>
            <label className="label">Email</label>
            <input name="email" type="email" required className="field" />
          </div>
          <div>
            <label className="label">Professional title</label>
            <input
              name="title"
              required
              placeholder="e.g. Bridal MUA · 4C specialist"
              className="field"
            />
          </div>
          <div>
            <label className="label">Years experience</label>
            <input
              name="yearsExp"
              type="number"
              min={0}
              defaultValue={3}
              className="field"
            />
          </div>
        </div>
        <div>
          <label className="label">Instagram / portfolio</label>
          <input name="instagram" placeholder="@handle or URL" className="field" />
        </div>
        <div>
          <label className="label">Bio</label>
          <textarea
            name="bio"
            required
            className="field min-h-[100px]"
            placeholder="Who you serve, techniques, brand floors you know…"
          />
        </div>
        <div>
          <p className="label">Specialties</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {SPECS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSpec(s)}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] ${
                  specs.includes(s)
                    ? "bg-ink text-ivory"
                    : "border border-line"
                }`}
              >
                {SPECIALTY_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="label">Brand floors you can authentically sell</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {HOUSE_BRANDS.map((b) => (
              <button
                key={b.slug}
                type="button"
                onClick={() => toggleBrand(b.slug)}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] ${
                  brands.includes(b.slug)
                    ? "bg-ink text-ivory"
                    : "border border-line"
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>
        {msg && <p className="text-sm text-ok">{msg}</p>}
        {err && <p className="text-sm text-danger">{err}</p>}
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Submitting…" : "Submit application"}
        </button>
        <Link
          href="/concierge"
          className="ml-3 text-[11px] uppercase tracking-[0.12em] text-muted hover:text-ink"
        >
          Back to concierge
        </Link>
      </form>
    </div>
  );
}
