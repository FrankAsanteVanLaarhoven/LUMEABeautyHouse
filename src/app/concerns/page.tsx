"use client";

import Link from "next/link";
import Image from "next/image";
import { CONCERNS } from "@/lib/concerns";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function ConcernsPage() {
  const [filter, setFilter] = useState<string>("all");
  const cats = ["all", "skin", "hair", "makeup", "body"] as const;
  const list =
    filter === "all"
      ? CONCERNS
      : CONCERNS.filter((c) => c.category === filter);

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-12 md:px-8 md:py-16">
      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted">
        Shop by concern
      </p>
      <h1 className="mt-2 font-display text-5xl tracking-tight md:text-6xl">
        What are we solving today?
      </h1>
      <p className="mt-3 max-w-xl text-sm text-muted">
        Dryness, coils, deep shades, frizz, snatched structure — skip the scroll
        and go straight to products that work for you.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={cn(
              "px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em]",
              filter === c
                ? "bg-ink text-ivory"
                : "border border-line hover:border-ink"
            )}
          >
            {c === "all" ? "All" : c}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => (
          <article
            key={c.id}
            className="group flex flex-col overflow-hidden border border-line bg-surface"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={c.image}
                alt={c.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="33vw"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <p className="text-[10px] uppercase tracking-[0.14em] text-champagne">
                {c.category}
              </p>
              <h2 className="mt-1 font-display text-2xl">{c.title}</h2>
              <p className="mt-2 text-sm text-muted">{c.body}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {c.productSlugs.slice(0, 3).map((slug) => (
                  <Link
                    key={slug}
                    href={`/product/${slug}`}
                    className="border border-line px-2 py-1 text-[10px] uppercase tracking-[0.1em] hover:border-ink"
                  >
                    {slug.split("-").slice(0, 2).join(" ")}
                  </Link>
                ))}
              </div>
              <Link
                href={`/product/${c.productSlugs[0]}`}
                className="mt-auto pt-5 text-[11px] font-medium uppercase tracking-[0.14em] underline decoration-sand underline-offset-4 hover:decoration-ink"
              >
                Start here →
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="/quiz" className="btn-primary">
          Not sure? Take the match quiz
        </Link>
        <Link href="/routines" className="btn-ghost">
          Build a routine
        </Link>
      </div>
    </div>
  );
}
