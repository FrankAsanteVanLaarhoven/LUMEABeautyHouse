"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, ExternalLink, Sparkles } from "lucide-react";
import {
  TUTORIALS,
  TUTORIAL_CATEGORIES,
  SKIN_FOCUS_FILTERS,
  type Tutorial,
  type TutorialCategory,
  type SkinFocus,
} from "@/lib/tutorials";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/useT";

export default function TutorialsPage() {
  const { t } = useT();
  const [cat, setCat] = useState<TutorialCategory | "all">("all");
  // Default deep-brown filter — core buyer community
  const [skin, setSkin] = useState<SkinFocus>("deep-brown");
  const [active, setActive] = useState<Tutorial>(
    TUTORIALS.find((x) => x.id === "t-nyma-contour") || TUTORIALS[0]
  );

  const filtered = useMemo(() => {
    return TUTORIALS.filter((x) => {
      const catOk = cat === "all" || x.category === cat;
      const skinOk =
        skin === "all" || x.skinFocus.includes(skin);
      return catOk && skinOk;
    });
  }, [cat, skin]);

  // Keep active in filtered set
  const shown = filtered.length
    ? filtered.some((t) => t.id === active.id)
      ? active
      : filtered[0]
    : active;

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[44vh] overflow-hidden bg-ink text-ivory md:min-h-[50vh]">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/campaign-deep.jpg"
          className="absolute inset-0 h-full w-full object-cover object-[center_20%] opacity-90"
        >
          <source src="/videos/campaign-glow.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-ink/92 via-ink/60 to-ink/30" />
        <div className="relative mx-auto flex min-h-[44vh] max-w-[1440px] flex-col justify-end px-5 pb-12 pt-24 md:min-h-[50vh] md:px-8 md:pb-16">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-champagne">
            Every undertone · free women artists
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight tracking-tight md:text-6xl">
            Made for your skin.
            <br />
            <span className="italic font-light">Deep. Brown. Golden. Asian.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ivory/75 md:text-base">
            Tutorials for Afro-Caribbean, deep brown, Asian, Hispanic & warm
            medium skin — the women who actually buy. Learn, then try colour in
            Mirror Studio.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 bg-ivory px-6 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-ink transition hover:bg-champagne"
            >
              <Sparkles size={14} /> Practice in Mirror Studio
            </Link>
            <a
              href="#playlist"
              className="inline-flex border border-ivory/40 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-ivory"
            >
              Browse by skin tone
            </a>
          </div>
        </div>
      </section>

      {/* Skin tone strip */}
      <div className="border-b border-line bg-ivory-deep">
        <div className="mx-auto grid max-w-[1440px] grid-cols-3 gap-2 px-5 py-4 md:grid-cols-3 md:gap-4 md:px-8">
          {[
            {
              img: "/images/campaign-deep.jpg",
              label: "Deep & Afro-Caribbean",
              focus: "deep-brown" as SkinFocus,
            },
            {
              img: "/images/campaign-asian.jpg",
              label: "Asian",
              focus: "asian" as SkinFocus,
            },
            {
              img: "/images/campaign-latina.jpg",
              label: "Hispanic & warm",
              focus: "hispanic" as SkinFocus,
            },
          ].map((c) => (
            <button
              key={c.focus}
              onClick={() => {
                setSkin(c.focus);
                document.getElementById("playlist")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className={cn(
                "group relative aspect-[16/9] overflow-hidden md:aspect-[2.4/1]",
                skin === c.focus && "ring-2 ring-ink ring-offset-2"
              )}
            >
              <Image
                src={c.img}
                alt={c.label}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
              <span className="absolute bottom-3 left-3 text-[10px] font-medium uppercase tracking-[0.16em] text-ivory md:text-[11px]">
                {c.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div
        id="playlist"
        className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-14"
      >
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
          Filter by skin
        </p>
        <div className="mb-6 flex flex-wrap gap-2">
          {SKIN_FOCUS_FILTERS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSkin(s.id)}
              className={cn(
                "px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em] md:px-4 md:text-[11px]",
                skin === s.id
                  ? "bg-ink text-ivory"
                  : "border border-line text-ink-soft hover:border-ink"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
          Filter by look
        </p>
        <div className="mb-10 flex flex-wrap gap-2">
          {TUTORIAL_CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={cn(
                "px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em] md:px-4 md:text-[11px]",
                cat === c.id
                  ? "bg-champagne text-ink"
                  : "border border-line text-ink-soft hover:border-ink"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
          <div>
            <div className="relative aspect-video overflow-hidden bg-ink shadow-soft">
              <iframe
                key={shown.youtubeId}
                src={`https://www.youtube-nocookie.com/embed/${shown.youtubeId}?rel=0&modestbranding=1`}
                title={shown.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
            <div className="mt-5 border border-line bg-surface p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-champagne">
                    {shown.artist}
                  </p>
                  <h2 className="mt-1 font-display text-2xl md:text-3xl">
                    {shown.title}
                  </h2>
                  <p className="mt-1 text-xs text-muted">{shown.artistNote}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.12em]">
                  <span className="border border-line px-2 py-1">
                    {shown.duration}
                  </span>
                  <span className="border border-line px-2 py-1">
                    {shown.level}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {shown.skinFocus.map((s) => (
                  <span
                    key={s}
                    className="bg-ink px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] text-ivory"
                  >
                    {SKIN_FOCUS_FILTERS.find((f) => f.id === s)?.label || s}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                {shown.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {shown.tags.map((tag) => (
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
                  href={`https://www.youtube.com/watch?v=${shown.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost !py-2.5"
                >
                  <ExternalLink size={14} /> {t("tutorials.openYt")}
                </a>
              </div>
              {shown.relatedProductSlugs.length > 0 && (
                <div className="mt-6 border-t border-line pt-5">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
                    {t("tutorials.shopLook")}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {shown.relatedProductSlugs.map((slug) => (
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
              {t("tutorials.disclaimer")} Built for deep brown, Afro-Caribbean,
              Asian, Hispanic, and warm medium skin — our core community.
            </p>
          </div>

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
                  shown.id === item.id
                    ? "border-ink bg-ink text-ivory"
                    : "border-line bg-surface hover:border-ink"
                )}
              >
                <div className="relative flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden bg-ivory-deep">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-90"
                  />
                  <Play
                    size={16}
                    className="relative text-ivory drop-shadow"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium leading-snug">
                    {item.title}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-[11px]",
                      shown.id === item.id ? "text-ivory/60" : "text-muted"
                    )}
                  >
                    {item.artist} · {item.duration}
                  </p>
                  <p
                    className={cn(
                      "mt-0.5 text-[9px] uppercase tracking-[0.1em]",
                      shown.id === item.id ? "text-champagne" : "text-muted"
                    )}
                  >
                    {item.skinFocus
                      .slice(0, 2)
                      .map(
                        (s) =>
                          SKIN_FOCUS_FILTERS.find((f) => f.id === s)?.label || s
                      )
                      .join(" · ")}
                  </p>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="py-10 text-center text-sm text-muted">
                No tutorials in this combo — try “All skin” or another look.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
