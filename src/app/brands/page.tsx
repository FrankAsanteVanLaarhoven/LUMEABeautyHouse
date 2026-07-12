"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HOUSE_BRANDS,
  brandsByLetter,
  searchBrands,
} from "@/lib/house-brands";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BrandsDirectoryPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => searchBrands(q), [q]);
  const byLetter = useMemo(() => {
    const map: Record<string, typeof HOUSE_BRANDS> = {};
    for (const b of filtered) {
      const L = b.letter.toUpperCase();
      if (!map[L]) map[L] = [];
      map[L].push(b);
    }
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const featured = HOUSE_BRANDS.filter((b) => b.featured);
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const lettersPresent = new Set(Object.keys(brandsByLetter()));

  return (
    <div className="bg-ivory">
      {/* Department store hero */}
      <section className="border-b border-line bg-ink px-5 py-16 text-ivory md:px-8 md:py-24">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-champagne">
            The brand floors
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl tracking-tight md:text-6xl lg:text-7xl">
            Shop by house.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ivory/70 md:text-base">
            Like the great department stores — Selfridges, Fenwick, Harrods,
            House of Fraser — every beauty house has a floor and a confession.
            Search brands, walk the A–Z directory, or enter a floor to shop
            only their edit.
          </p>
          <form
            className="mt-10 flex max-w-xl border border-ivory/25 bg-ivory/5"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex flex-1 items-center gap-3 px-4">
              <Search size={16} className="text-ivory/50" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search brands — e.g. Coil Atelier, Casa Luz, LUMÉA"
                className="w-full bg-transparent py-3.5 text-sm text-ivory outline-none placeholder:text-ivory/40"
              />
            </div>
          </form>
        </div>
      </section>

      {/* Featured houses */}
      {!q && (
        <section className="mx-auto max-w-[1440px] px-5 py-14 md:px-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted">
            Featured floors
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((b) => (
              <Link
                key={b.slug}
                href={`/brands/${b.slug}`}
                className="group relative aspect-[16/10] overflow-hidden border border-line bg-surface"
              >
                <Image
                  src={b.image}
                  alt={b.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-ivory">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-champagne">
                    {b.floor}
                  </p>
                  <h2 className="mt-1 font-display text-2xl">{b.name}</h2>
                  <p className="mt-1 text-xs text-ivory/70">{b.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* A–Z jump */}
      <div className="sticky top-[7.5rem] z-30 border-y border-line bg-ivory/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] gap-1 overflow-x-auto px-5 py-3 md:px-8">
          {alphabet.map((L) => (
            <a
              key={L}
              href={lettersPresent.has(L) ? `#letter-${L}` : undefined}
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center text-[11px] font-medium",
                lettersPresent.has(L)
                  ? "text-ink hover:bg-sand"
                  : "cursor-default text-muted/40"
              )}
            >
              {L}
            </a>
          ))}
          <Link
            href="/shop"
            className="ml-auto shrink-0 self-center text-[10px] uppercase tracking-[0.14em] text-champagne hover:underline"
          >
            Shop all →
          </Link>
        </div>
      </div>

      {/* Directory */}
      <section className="mx-auto max-w-[1440px] px-5 py-12 md:px-8 md:py-16">
        {byLetter.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-display text-3xl">No brands match</p>
            <button
              type="button"
              onClick={() => setQ("")}
              className="btn-primary mt-6"
            >
              Clear search
            </button>
          </div>
        ) : (
          byLetter.map(([letter, brands]) => (
            <div
              key={letter}
              id={`letter-${letter}`}
              className="scroll-mt-40 border-b border-line py-10 first:pt-0"
            >
              <h2 className="font-display text-4xl text-champagne">{letter}</h2>
              <ul className="mt-6 grid gap-6 md:grid-cols-2">
                {brands.map((b) => (
                  <li key={b.slug}>
                    <Link
                      href={`/brands/${b.slug}`}
                      className="group block border border-line bg-surface p-6 transition hover:border-ink"
                    >
                      <div className="flex gap-4">
                        <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-ivory-deep">
                          <Image
                            src={b.image}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
                            {b.floor}
                          </p>
                          <h3 className="mt-1 font-display text-2xl group-hover:underline">
                            {b.name}
                          </h3>
                          <p className="mt-1 text-sm text-ink-soft">{b.tagline}</p>
                          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">
                            {b.confession}
                          </p>
                          <p className="mt-3 text-[10px] uppercase tracking-[0.12em] text-champagne">
                            Enter floor →
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
