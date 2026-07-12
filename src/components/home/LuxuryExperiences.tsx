"use client";

import Link from "next/link";
import Image from "next/image";
import { CalendarHeart, Lock, Newspaper, Radio, Sparkles } from "lucide-react";
import { LIVE_EVENTS } from "@/lib/experiences";
import { HOUSE_BRANDS } from "@/lib/house-brands";

export function LuxuryExperiences() {
  const nextLive = LIVE_EVENTS.find((e) => e.status === "upcoming");
  const sponsored = HOUSE_BRANDS.filter((b) => b.sponsored).slice(0, 3);

  return (
    <section className="border-y border-line bg-surface py-16 md:py-20">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8">
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted">
          Harrods service · Net-a-Porter desire
        </p>
        <h2 className="mt-3 max-w-xl font-display text-3xl tracking-tight md:text-4xl lg:text-5xl">
          Live experiences on the platform
        </h2>
        <p className="mt-3 max-w-lg text-sm text-muted">
          Concierge, live rooms, private sale, and the journal — why clients
          stay and why brands buy a floor.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/concierge"
            className="group border border-line bg-ivory p-6 transition hover:border-ink"
          >
            <CalendarHeart className="text-champagne" size={20} strokeWidth={1.5} />
            <h3 className="mt-4 font-display text-2xl">Beauty Concierge</h3>
            <p className="mt-2 text-sm text-muted">
              Book a video session — shade match, glam, coils, gifts.
            </p>
            <span className="mt-5 inline-block text-[11px] uppercase tracking-[0.12em] underline decoration-sand group-hover:decoration-ink">
              Book →
            </span>
          </Link>

          <Link
            href={nextLive ? `/live/${nextLive.id}` : "/live"}
            className="group relative overflow-hidden border border-line bg-ink p-6 text-ivory"
          >
            {nextLive && (
              <Image
                src={nextLive.image}
                alt=""
                fill
                className="object-cover opacity-30 transition group-hover:scale-105"
              />
            )}
            <div className="relative">
              <Radio className="text-champagne" size={20} strokeWidth={1.5} />
              <h3 className="mt-4 font-display text-2xl">Live rooms</h3>
              <p className="mt-2 text-sm text-ivory/70">
                {nextLive
                  ? `${nextLive.title} · ${nextLive.when}`
                  : "Multi-brand live shopping"}
              </p>
              <span className="mt-5 inline-block text-[11px] uppercase tracking-[0.12em] text-champagne">
                RSVP →
              </span>
            </div>
          </Link>

          <Link
            href="/private-sale"
            className="group border border-line bg-ivory p-6 transition hover:border-ink"
          >
            <Lock className="text-champagne" size={20} strokeWidth={1.5} />
            <h3 className="mt-4 font-display text-2xl">Private Sale</h3>
            <p className="mt-2 text-sm text-muted">
              Members&apos; Edit — code LUMEAEDIT or Flame+ Glow.
            </p>
            <span className="mt-5 inline-block text-[11px] uppercase tracking-[0.12em] underline decoration-sand group-hover:decoration-ink">
              Enter →
            </span>
          </Link>

          <Link
            href="/journal"
            className="group border border-line bg-ivory p-6 transition hover:border-ink"
          >
            <Newspaper className="text-champagne" size={20} strokeWidth={1.5} />
            <h3 className="mt-4 font-display text-2xl">The Journal</h3>
            <p className="mt-2 text-sm text-muted">
              Lookbooks, rituals, floor walks — every story shoppable.
            </p>
            <span className="mt-5 inline-block text-[11px] uppercase tracking-[0.12em] underline decoration-sand group-hover:decoration-ink">
              Read →
            </span>
          </Link>
        </div>

        {/* Sponsored concessions */}
        <div className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
                In the house · paid floors
              </p>
              <h3 className="mt-2 font-display text-2xl md:text-3xl">
                Featured concessions
              </h3>
            </div>
            <Link
              href="/brand/billing"
              className="text-[11px] uppercase tracking-[0.12em] text-champagne hover:underline"
            >
              Brands: buy a floor →
            </Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {sponsored.map((b) => (
              <Link
                key={b.slug}
                href={`/brands/${b.slug}`}
                className="group relative aspect-[5/3] overflow-hidden border border-line"
              >
                <Image
                  src={b.image}
                  alt={b.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-ivory">
                  <span className="text-[9px] uppercase tracking-[0.14em] text-champagne">
                    Sponsored floor
                    {b.floorFee ? ` · from $${b.floorFee}/mo` : ""}
                  </span>
                  <p className="font-display text-xl">{b.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/brands" className="btn-primary">
            <Sparkles size={14} /> Walk brand floors
          </Link>
          <Link href="/platform" className="btn-ghost">
            Platform for brands
          </Link>
        </div>
      </div>
    </section>
  );
}
