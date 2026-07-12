"use client";

import Link from "next/link";
import Image from "next/image";
import {
  VERIFIED_EXPERTS,
  SESSION_FORMAT_LABELS,
  SPECIALTY_LABELS,
  DEFAULT_PRICING,
} from "@/lib/concierge-experts";
import {
  Calendar,
  Sparkles,
  Users,
  Video,
  HeartHandshake,
  BadgeCheck,
} from "lucide-react";

export default function ConciergeHubPage() {
  return (
    <div className="bg-ivory">
      <section className="border-b border-line bg-ink px-5 py-16 text-ivory md:px-8 md:py-24">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-champagne">
            Live beauty marketplace
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl tracking-tight md:text-6xl lg:text-7xl">
            Concierge · live with experts
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ivory/75 md:text-base">
            1:1 private streams, friend groups, wedding parties, and event glam
            — with verified industry experts who charge session fees and earn
            when you shop the products they recommend. Brands get real traffic
            with real knowledge behind every recommendation.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#experts"
              className="bg-ivory px-6 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-ink"
            >
              Meet experts
            </a>
            <Link
              href="/concierge/apply"
              className="border border-champagne px-6 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-champagne"
            >
              Become a concierge
            </Link>
            <Link
              href="/live"
              className="border border-ivory/30 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-ivory/80"
            >
              Multi-brand live rooms
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-6 text-[11px] uppercase tracking-[0.14em] text-ivory/55">
            <span className="inline-flex items-center gap-2">
              <Video size={14} className="text-champagne" /> Live 1:1 stream
            </span>
            <span className="inline-flex items-center gap-2">
              <Users size={14} className="text-champagne" /> Group & wedding
            </span>
            <span className="inline-flex items-center gap-2">
              <BadgeCheck size={14} className="text-champagne" /> Verified experts
            </span>
            <span className="inline-flex items-center gap-2">
              <HeartHandshake size={14} className="text-champagne" /> Product commissions
            </span>
          </div>
        </div>
      </section>

      {/* Pricing structures */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-[1440px] px-5 py-14 md:px-8 md:py-16">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
            Price structures
          </p>
          <h2 className="mt-2 font-display text-3xl md:text-4xl">
            From private to bridal party
          </h2>
          <p className="mt-3 max-w-xl text-sm text-muted">
            Experts set their rates. Platform share funds the house; experts
            keep the majority of the session fee plus product commission on
            attributed sales.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DEFAULT_PRICING.map((p) => (
              <div
                key={p.format}
                className="border border-line bg-ivory p-5"
              >
                <p className="text-[10px] uppercase tracking-[0.14em] text-champagne">
                  {SESSION_FORMAT_LABELS[p.format]}
                </p>
                <p className="mt-2 font-display text-3xl">
                  from ${p.priceUsd}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {p.durationMin} min · up to {p.maxClients} client
                  {p.maxClients > 1 ? "s" : ""}
                </p>
                <p className="mt-3 text-sm text-ink-soft">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experts */}
      <section id="experts" className="mx-auto max-w-[1440px] px-5 py-14 md:px-8 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
              Verified atelier
            </p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl">
              Book a live expert
            </h2>
          </div>
          <Link
            href="/concierge/apply"
            className="text-[11px] uppercase tracking-[0.12em] text-champagne hover:underline"
          >
            Apply to charge fees →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VERIFIED_EXPERTS.map((ex) => {
            const from = Math.min(...ex.pricing.map((p) => p.priceUsd));
            return (
              <Link
                key={ex.id}
                href={`/concierge/experts/${ex.slug}`}
                className="group flex flex-col overflow-hidden border border-line bg-surface transition hover:border-ink"
              >
                <div className="relative aspect-[3/4] bg-ivory-deep">
                  <Image
                    src={ex.image}
                    alt={ex.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="25vw"
                  />
                  {ex.verified && (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 bg-ink/90 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-ivory">
                      <BadgeCheck size={10} /> Verified
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-xl">{ex.name}</h3>
                  <p className="mt-1 text-xs text-muted">{ex.title}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {ex.specialties.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="border border-line px-2 py-0.5 text-[9px] uppercase tracking-[0.1em] text-muted"
                      >
                        {SPECIALTY_LABELS[s]}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 line-clamp-2 text-xs text-ink-soft">
                    {ex.bio}
                  </p>
                  <div className="mt-auto flex items-end justify-between pt-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.12em] text-muted">
                        From
                      </p>
                      <p className="font-display text-2xl">${from}</p>
                    </div>
                    <p className="text-[10px] text-muted">
                      {ex.rating} ★ · {ex.sessionCount} sessions
                    </p>
                  </div>
                  <span className="mt-3 text-[11px] uppercase tracking-[0.12em] text-champagne">
                    Book live stream →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Incentive for experts / brands */}
      <section className="border-t border-line bg-ink py-16 text-ivory md:py-20">
        <div className="mx-auto max-w-[1440px] px-5 md:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-champagne">
                Business incentive
              </p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl">
                Experts drive traffic with product truth
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ivory/70">
                Verified concierges earn session fees (you keep ~80%) plus
                product commission when clients buy from your live
                recommendations. Brands on LUMÉA floors get industry-led
                education — not empty ads — so sell-through follows trust.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-ivory/80">
                <li>· Host 1:1 or group live rooms with room codes</li>
                <li>· Wedding / event packages with higher ticket sizes</li>
                <li>· 8–10% product commission on attributed bags</li>
                <li>· Featured on brand floors you represent</li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/concierge/apply"
                  className="bg-champagne px-6 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-ink"
                >
                  Apply as expert
                </Link>
                <Link
                  href="/brand"
                  className="border border-ivory/30 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-ivory"
                >
                  Brands: list your floor
                </Link>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  t: "Session fee",
                  b: "Client pays expert rate. Platform share ~18–20%.",
                },
                {
                  t: "Product commission",
                  b: "Earn when dedicated clients shop your picks in-room.",
                },
                {
                  t: "Group & wedding",
                  b: "Higher tickets, multi-person live stream rooms.",
                },
                {
                  t: "Brand affinity",
                  b: "Recommend floors you know — Casa Luz, Coil Atelier…",
                },
              ].map((c) => (
                <div
                  key={c.t}
                  className="border border-ivory/15 bg-ivory/5 p-5"
                >
                  <Sparkles size={16} className="text-champagne" />
                  <p className="mt-3 font-medium">{c.t}</p>
                  <p className="mt-1 text-xs text-ivory/60">{c.b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
