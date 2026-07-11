"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Play, ExternalLink, Sparkles } from "lucide-react";
import {
  TUTORIALS,
  TUTORIAL_CATEGORIES,
  type Tutorial,
  type TutorialCategory,
} from "@/lib/tutorials";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/useT";

export default function TutorialsPage() {
  const { t } = useT();
  const [cat, setCat] = useState<TutorialCategory | "all">("all");
  const [active, setActive] = useState<Tutorial>(TUTORIALS[0]);

  const filtered = useMemo(
    () =>
      cat === "all" ? TUTORIALS : TUTORIALS.filter((x) => x.category === cat),
    [cat]
  );

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-14">
      <div className="max-w-2xl">
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted">
          {t("tutorials.eyebrow")}
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-tight md:text-6xl">
          {t("tutorials.title")}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
          {t("tutorials.sub")}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {TUTORIAL_CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={cn(
              "px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em]",
              cat === c.id
                ? "bg-ink text-ivory"
                : "border border-line text-ink-soft hover:border-ink"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
        {/* Embedded player */}
        <div>
          <div className="relative aspect-video overflow-hidden bg-ink shadow-soft">
            <iframe
              key={active.youtubeId}
              src={`https://www.youtube-nocookie.com/embed/${active.youtubeId}?rel=0&modestbranding=1`}
              title={active.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
          <div className="mt-5 border border-line bg-surface p-5 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-champagne">
                  {active.artist}
                </p>
                <h2 className="mt-1 font-display text-2xl md:text-3xl">
                  {active.title}
                </h2>
                <p className="mt-1 text-xs text-muted">{active.artistNote}</p>
              </div>
              <div className="flex gap-2 text-[10px] uppercase tracking-[0.12em]">
                <span className="border border-line px-2 py-1">{active.duration}</span>
                <span className="border border-line px-2 py-1">{active.level}</span>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              {active.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {active.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-ivory-deep px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/studio" className="btn-primary !py-2.5">
                <Sparkles size={14} /> {t("tutorials.tryStudio")}
              </Link>
              <a
                href={`https://www.youtube.com/watch?v=${active.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost !py-2.5"
              >
                <ExternalLink size={14} /> {t("tutorials.openYt")}
              </a>
            </div>
            {active.relatedProductSlugs.length > 0 && (
              <div className="mt-6 border-t border-line pt-5">
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
                  {t("tutorials.shopLook")}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {active.relatedProductSlugs.map((slug) => (
                    <Link
                      key={slug}
                      href={`/product/${slug}`}
                      className="border border-line px-3 py-2 text-xs transition hover:border-ink"
                    >
                      {slug.replace(/-/g, " ")}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-muted">
            {t("tutorials.disclaimer")}
          </p>
        </div>

        {/* Playlist */}
        <div className="max-h-[80vh] space-y-2 overflow-y-auto pr-1">
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
            {t("tutorials.playlist")} · {filtered.length}
          </p>
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item)}
              className={cn(
                "flex w-full gap-3 border p-3 text-left transition",
                active.id === item.id
                  ? "border-ink bg-ink text-ivory"
                  : "border-line bg-surface hover:border-ink"
              )}
            >
              <div
                className={cn(
                  "relative flex h-16 w-24 shrink-0 items-center justify-center",
                  active.id === item.id ? "bg-ivory/10" : "bg-ivory-deep"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-80"
                />
                <Play
                  size={16}
                  className={
                    active.id === item.id ? "relative text-champagne" : "relative text-ink"
                  }
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-medium leading-snug">
                  {item.title}
                </p>
                <p
                  className={cn(
                    "mt-1 text-[11px]",
                    active.id === item.id ? "text-ivory/60" : "text-muted"
                  )}
                >
                  {item.artist} · {item.duration}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
