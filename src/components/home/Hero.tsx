"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "@/lib/i18n/useT";
import { cn } from "@/lib/utils";

/**
 * Fresh hero reels (new assets) + original glam campaign only.
 * Paths are dedicated hero-reel-* files — not reused gallery campaign media.
 */
const HERO_REELS = [
  {
    id: "deep",
    poster: "/images/hero-reel-deep.jpg",
    src: "/videos/hero-reel-deep.mp4",
    label: "Deep",
  },
  {
    id: "asian",
    poster: "/images/hero-reel-asian.jpg",
    src: "/videos/hero-reel-asian.mp4",
    label: "Asian",
  },
  {
    id: "latina",
    poster: "/images/hero-reel-latina.jpg",
    src: "/videos/hero-reel-latina.mp4",
    label: "Hispanic",
  },
  {
    id: "blonde",
    poster: "/images/hero-reel-blonde.jpg",
    src: "/videos/hero-reel-blonde.mp4",
    label: "Blonde",
  },
  {
    id: "original",
    poster: "/images/campaign-glam.jpg",
    src: "/videos/campaign-glam.mp4",
    label: "Original",
  },
] as const;

const HOLD_MS = 7000;
const FADE_S = 1.35;

export function Hero() {
  const { t } = useT();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const goTo = useCallback((index: number) => {
    setActive((index + HERO_REELS.length) % HERO_REELS.length);
  }, []);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % HERO_REELS.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(next, HOLD_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, paused, next]);

  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === active) {
        v.currentTime = 0;
        const p = v.play();
        if (p) p.catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [active]);

  return (
    <section
      className="relative min-h-[88vh] overflow-hidden bg-ink text-ivory"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0">
        {HERO_REELS.map((reel, i) => (
          <motion.div
            key={reel.id}
            className="absolute inset-0"
            initial={false}
            animate={{
              opacity: i === active ? 1 : 0,
              scale: i === active ? 1 : 1.04,
            }}
            transition={{
              opacity: { duration: FADE_S, ease: [0.4, 0, 0.2, 1] },
              scale: { duration: FADE_S + 0.4, ease: [0.4, 0, 0.2, 1] },
            }}
            style={{ zIndex: i === active ? 2 : 1 }}
            aria-hidden={i !== active}
          >
            <video
              ref={(el) => {
                videoRefs.current[i] = el;
              }}
              muted
              playsInline
              loop
              preload={
                i === 0 || Math.abs(i - active) <= 1 ? "auto" : "metadata"
              }
              poster={reel.poster}
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            >
              <source src={reel.src} type="video/mp4" />
            </video>
          </motion.div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-r from-ink/85 via-ink/40 to-transparent" />
      <div className="noise-overlay absolute inset-0 z-[3]" />

      <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-[1440px] flex-col justify-end px-5 pb-16 pt-28 md:justify-center md:px-8 md:pb-24">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[10px] font-medium uppercase tracking-[0.32em] text-champagne"
        >
          {t("home.season")}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08 }}
          className="mt-4 max-w-3xl font-display text-[clamp(3rem,8vw,6.5rem)] leading-[0.95] tracking-[-0.03em]"
        >
          {t("home.heroTitle1")}
          <br />
          <span className="italic font-light">{t("home.heroTitle2")}</span>{" "}
          {t("home.heroTitle3")}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18 }}
          className="mt-6 max-w-md text-sm leading-relaxed text-ivory/75 md:text-base"
        >
          {t("home.heroSub")}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28 }}
          className="mt-10 flex flex-wrap gap-3"
        >
          <Link
            href="/shop"
            className="inline-flex items-center justify-center bg-ivory px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-ink transition hover:bg-champagne"
          >
            {t("home.ctaShop")}
          </Link>
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center border border-champagne bg-champagne/20 px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-ivory transition hover:bg-champagne hover:text-ink"
          >
            {t("home.ctaQuiz")}
          </Link>
          <Link
            href="/studio"
            className="inline-flex items-center justify-center border border-ivory/40 px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-ivory transition hover:border-ivory hover:bg-ivory/10"
          >
            {t("home.tryOnCta")}
          </Link>
          <Link
            href="/product/veil-soft-focus-foundation"
            className="inline-flex items-center justify-center border border-ivory/20 px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-ivory/80 transition hover:text-ivory"
          >
            {t("home.ctaVeil")}
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-5 z-20 flex flex-col gap-3 md:left-8">
        <div className="flex items-center gap-2">
          {HERO_REELS.map((reel, i) => (
            <button
              key={reel.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${reel.label} campaign`}
              className={cn(
                "h-1 rounded-full transition-all duration-500",
                i === active
                  ? "w-10 bg-champagne"
                  : "w-4 bg-ivory/30 hover:bg-ivory/50"
              )}
            />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={HERO_REELS[active].id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35 }}
            className="text-[10px] uppercase tracking-[0.2em] text-ivory/55"
          >
            {HERO_REELS[active].label} · {active + 1}/{HERO_REELS.length}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-6 right-6 z-20 hidden text-right md:block">
        <p className="text-[10px] uppercase tracking-[0.2em] text-ivory/50">
          {t("home.shadeCount")}
        </p>
      </div>
    </section>
  );
}
