"use client";

import Link from "next/link";
import Image from "next/image";
import { LIVE_EVENTS } from "@/lib/experiences";
import { cn } from "@/lib/utils";

export default function LiveEventsPage() {
  return (
    <div className="bg-ivory">
      <section className="border-b border-line bg-ink px-5 py-16 text-ivory md:px-8 md:py-24">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-champagne">
            Live commerce
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-5xl tracking-tight md:text-6xl">
            House of Light Live
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-ivory/75 md:text-base">
            Scheduled rooms with hosts, guest brand floors, shoppable SKUs, and
            replay. Brands buy a slot; clients shop in real time — Harrods
            events energy, Net-a-Porter desire.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/concierge" className="bg-ivory px-6 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-ink">
              Book concierge
            </Link>
            <Link href="/brand" className="border border-ivory/40 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-ivory">
              Host as a brand
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-14 md:px-8 md:py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {LIVE_EVENTS.map((ev) => (
            <Link
              key={ev.id}
              href={`/live/${ev.id}`}
              className="group flex flex-col overflow-hidden border border-line bg-surface"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={ev.image}
                  alt=""
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="33vw"
                />
                <span
                  className={cn(
                    "absolute left-3 top-3 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.14em]",
                    ev.status === "live"
                      ? "bg-danger text-ivory"
                      : ev.status === "replay"
                        ? "bg-ink/80 text-ivory"
                        : "bg-champagne text-ink"
                  )}
                >
                  {ev.status}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
                  {ev.when} · {ev.durationMin} min
                </p>
                <h2 className="mt-2 font-display text-2xl">{ev.title}</h2>
                <p className="mt-1 text-sm text-ink-soft">{ev.subtitle}</p>
                <p className="mt-3 text-xs text-muted">
                  Host {ev.host}
                  {ev.guestBrand ? ` · Guest ${ev.guestBrand}` : ""}
                </p>
                <span className="mt-auto pt-5 text-[11px] uppercase tracking-[0.14em] text-champagne">
                  Open room →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
