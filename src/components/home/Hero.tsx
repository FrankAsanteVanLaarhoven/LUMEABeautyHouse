"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useT } from "@/lib/i18n/useT";

export function Hero() {
  const { t } = useT();
  return (
    <section className="relative min-h-[88vh] overflow-hidden bg-ink text-ivory">
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/images/hero-products.jpg"
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      >
        <source src="/videos/hero-products.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/45 to-transparent" />
      <div className="noise-overlay absolute inset-0" />

      <div className="relative mx-auto flex min-h-[88vh] max-w-[1440px] flex-col justify-end px-5 pb-16 pt-28 md:justify-center md:px-8 md:pb-24">
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

      <div className="absolute bottom-6 right-6 hidden text-right md:block">
        <p className="text-[10px] uppercase tracking-[0.2em] text-ivory/50">
          {t("home.shadeCount")}
        </p>
      </div>
    </section>
  );
}
