"use client";

import Link from "next/link";
import {
  Building2,
  Gift,
  HeartPulse,
  Layers,
  RefreshCw,
  Sparkles,
  Star,
  Users,
  Wand2,
} from "lucide-react";
import { useT } from "@/lib/i18n/useT";

const CARDS = [
  {
    href: "/quiz",
    icon: Wand2,
    title: "Match quiz",
    body: "Skin + hair in 2 minutes. Personal edit + 50 Glow Points.",
    cta: "Start quiz",
  },
  {
    href: "/routines",
    icon: Layers,
    title: "Rituals",
    body: "AM glass, PM restore, coils, repair — add the full stack.",
    cta: "Build routine",
  },
  {
    href: "/brands",
    icon: Building2,
    title: "Brand floors",
    body: "Selfridges-style directory — search LUMÉA, Coil Atelier, Casa Luz & more.",
    cta: "Browse houses",
  },
  {
    href: "/concerns",
    icon: HeartPulse,
    title: "Shop by concern",
    body: "Dryness, 4C coils, deep shades, frizz — skip the scroll.",
    cta: "Solve it",
  },
  {
    href: "/gifts",
    icon: Gift,
    title: "Gift finder",
    body: "Sets she’ll actually use. Budget-ready. Bag in one tap.",
    cta: "Find a gift",
  },
  {
    href: "/studio",
    icon: Sparkles,
    title: "Mirror Studio",
    body: "Selfie shade match + live try-on. Trial before you buy.",
    cta: "Try on",
  },
  {
    href: "/community",
    icon: Users,
    title: "Community",
    body: "Before & after from real skin & hair. Shop the exact look.",
    cta: "See looks",
  },
  {
    href: "/glow",
    icon: Star,
    title: "Glow Club",
    body: "Points on every move. Free shipping tiers. VIP shade drops.",
    cta: "See perks",
  },
  {
    href: "/subscribe",
    icon: RefreshCw,
    title: "Subscribe & save",
    body: "15% off auto-replenish for foundation, serum, coils, glass.",
    cta: "Never run out",
  },
] as const;

export function DiscoveryStrip() {
  const { t } = useT();
  return (
    <section className="border-y border-line bg-surface py-16 md:py-20">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8">
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted">
          Why LUMÉA
        </p>
        <h2 className="mt-3 max-w-xl font-display text-3xl tracking-tight md:text-4xl lg:text-5xl">
          {t("home.discover")}
        </h2>
        <p className="mt-3 max-w-lg text-sm text-muted">{t("home.discoverSub")}</p>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group flex flex-col border border-line bg-ivory p-6 transition hover:border-ink hover:shadow-soft"
            >
              <c.icon
                size={20}
                className="text-champagne transition group-hover:text-ink"
                strokeWidth={1.5}
              />
              <h3 className="mt-4 font-display text-2xl tracking-tight">
                {c.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                {c.body}
              </p>
              <span className="mt-5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink underline decoration-sand underline-offset-4 group-hover:decoration-ink">
                {c.cta} →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustBar() {
  const { t } = useT();
  const items = [
    t("home.trustReturns"),
    t("home.trustShip"),
    t("home.trustClean"),
    t("home.trustShades"),
    t("home.trustTry"),
  ];
  return (
    <div className="border-b border-line bg-ivory-deep/60">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-x-8 gap-y-2 px-5 py-3 md:px-8">
        {items.map((label) => (
          <span
            key={label}
            className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
