"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Building2,
  Camera,
  Layers,
  Palette,
  Shield,
  Sparkles,
  Upload,
  Users,
  Wand2,
} from "lucide-react";
import { useT } from "@/lib/i18n/useT";

export default function PlatformPage() {
  const { t } = useT();
  const [sent, setSent] = useState(false);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-ivory">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="/images/studio-white.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/40" />
        </div>
        <div className="relative mx-auto max-w-[1440px] px-5 py-24 md:px-8 md:py-32">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-champagne">
            {t("platform.eyebrow")}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight md:text-6xl lg:text-7xl">
            {t("platform.title")}
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-ivory/75 md:text-base">
            {t("platform.sub")}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/brand"
              className="bg-ivory px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.16em] text-ink"
            >
              Open brand portal
            </Link>
            <a href="#demo" className="border border-ivory/40 px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.16em] text-ivory">
              {t("platform.ctaDemo")}
            </a>
            <Link
              href="/studio"
              className="border border-ivory/20 px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.16em] text-ivory/80"
            >
              {t("platform.ctaStudio")}
            </Link>
            <Link
              href="/b/glowlab"
              className="border border-champagne/50 px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.16em] text-champagne"
            >
              Demo storefront
            </Link>
          </div>
        </div>
      </section>

      {/* Like SpreeAI pitch */}
      <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
              {t("platform.why")}
            </p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">
              {t("platform.whyTitle")}
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-ink-soft">
              {t("platform.whyBody")}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: Camera, t: t("platform.f1") },
              { icon: Palette, t: t("platform.f2") },
              { icon: Upload, t: t("platform.f3") },
              { icon: Wand2, t: t("platform.f4") },
              { icon: Layers, t: t("platform.f5") },
              { icon: Users, t: t("platform.f6") },
            ].map((f) => (
              <div
                key={f.t}
                className="border border-line bg-surface p-5"
              >
                <f.icon size={18} className="text-champagne" strokeWidth={1.5} />
                <p className="mt-3 text-sm font-medium leading-snug">{f.t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="bg-ivory-deep py-20">
        <div className="mx-auto max-w-[1440px] px-5 md:px-8">
          <h2 className="font-display text-4xl md:text-5xl">
            {t("platform.modules")}
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                title: t("platform.m1t"),
                body: t("platform.m1b"),
                href: "/studio",
              },
              {
                title: t("platform.m2t"),
                body: t("platform.m2b"),
                href: "/tutorials",
              },
              {
                title: t("platform.m3t"),
                body: t("platform.m3b"),
                href: "/admin",
              },
            ].map((m) => (
              <Link
                key={m.title}
                href={m.href}
                className="group border border-line bg-surface p-8 transition hover:border-ink"
              >
                <Sparkles size={18} className="text-champagne" />
                <h3 className="mt-4 font-display text-2xl">{m.title}</h3>
                <p className="mt-3 text-sm text-muted">{m.body}</p>
                <span className="mt-6 inline-block text-[11px] uppercase tracking-[0.16em] underline decoration-sand underline-offset-4 group-hover:decoration-ink">
                  {t("platform.explore")}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brand upload */}
      <section id="demo" className="mx-auto max-w-[900px] px-5 py-20 md:px-8">
        <div className="flex items-center gap-2 text-champagne">
          <Building2 size={16} />
          <p className="text-[10px] uppercase tracking-[0.2em]">
            {t("platform.partner")}
          </p>
        </div>
        <h2 className="mt-3 font-display text-4xl">{t("platform.partnerTitle")}</h2>
        <p className="mt-3 text-sm text-muted">{t("platform.partnerSub")}</p>

        {sent ? (
          <div className="mt-10 border border-ok/30 bg-ok/5 p-8 text-center">
            <Shield className="mx-auto text-ok" size={28} />
            <p className="mt-4 font-display text-2xl">{t("platform.thanks")}</p>
            <p className="mt-2 text-sm text-muted">{t("platform.thanksSub")}</p>
          </div>
        ) : (
          <form
            className="mt-10 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">{t("platform.brandName")}</label>
                <input required name="brand" className="field" />
              </div>
              <div>
                <label className="label">{t("platform.contactEmail")}</label>
                <input required type="email" name="email" className="field" />
              </div>
              <div>
                <label className="label">{t("platform.website")}</label>
                <input name="site" className="field" placeholder="https://" />
              </div>
              <div>
                <label className="label">{t("platform.catalog")}</label>
                <select name="catalog" className="field" defaultValue="50-200">
                  <option value="1-50">1–50 SKUs</option>
                  <option value="50-200">50–200 SKUs</option>
                  <option value="200+">200+ SKUs</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">{t("platform.needs")}</label>
              <textarea
                name="needs"
                className="field min-h-[100px]"
                placeholder={t("platform.needsPh")}
              />
            </div>
            <button type="submit" className="btn-primary">
              {t("platform.submit")}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
