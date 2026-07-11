"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/shop/ProductCard";
import { useT } from "@/lib/i18n/useT";

export function FeaturedGrid({ products }: { products: Product[] }) {
  const { t } = useT();
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-8 md:py-28">
      <div className="mb-12 flex flex-col items-start justify-between gap-4 md:mb-16 md:flex-row md:items-end">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted">
            {t("home.edit")}
          </p>
          <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl lg:text-6xl">
            {t("home.iconic")}
          </h2>
        </div>
        <Link
          href="/shop"
          className="text-[11px] font-medium uppercase tracking-[0.18em] underline decoration-sand underline-offset-8 transition hover:decoration-ink"
        >
          {t("home.viewAll")}
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}

export function DualPromo() {
  const { t } = useT();
  return (
    <section className="mx-auto grid max-w-[1440px] gap-3 px-5 md:grid-cols-2 md:px-8">
      <PromoTile
        href="/product/lume-glass-lip-oil"
        video="/videos/campaign-lips.mp4"
        poster="/images/campaign-lips.jpg"
        eyebrow={t("home.lips")}
        title={t("home.glassMoves")}
        cta={t("home.shopGlass")}
      />
      <PromoTile
        href="/shop?category=skin"
        video="/videos/campaign-glow.mp4"
        poster="/images/campaign-glow.jpg"
        eyebrow={t("home.skin")}
        title={t("home.clinical")}
        cta={t("home.exploreSkin")}
        invert
      />
    </section>
  );
}

function PromoTile({
  href,
  image,
  video,
  poster,
  eyebrow,
  title,
  cta,
  invert,
}: {
  href: string;
  image?: string;
  video?: string;
  poster?: string;
  eyebrow: string;
  title: string;
  cta: string;
  invert?: boolean;
}) {
  return (
    <Link href={href} className="group relative block aspect-[4/5] overflow-hidden md:aspect-[5/4]">
      {video ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={poster}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={image!}
          alt=""
          fill
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
          sizes="50vw"
        />
      )}
      <div
        className={`absolute inset-0 ${
          invert
            ? "bg-gradient-to-t from-ink/70 via-ink/20 to-transparent"
            : "bg-gradient-to-t from-ink/75 via-transparent to-transparent"
        }`}
      />
      <div className="absolute inset-x-0 bottom-0 p-8 text-ivory md:p-10">
        <p className="text-[10px] uppercase tracking-[0.22em] text-champagne">
          {eyebrow}
        </p>
        <h3 className="mt-2 font-display text-3xl md:text-4xl">{title}</h3>
        <span className="mt-4 inline-block text-[11px] uppercase tracking-[0.18em] underline decoration-ivory/40 underline-offset-8 transition group-hover:decoration-ivory">
          {cta}
        </span>
      </div>
    </Link>
  );
}

export function Philosophy() {
  const { t } = useT();
  return (
    <section
      id="philosophy"
      className="relative overflow-hidden bg-ink py-24 text-ivory md:py-32"
    >
      <div className="absolute inset-0 opacity-30">
        <Image
          src="/images/texture-abstract.jpg"
          alt=""
          fill
          className="object-cover"
        />
      </div>
      <div className="relative mx-auto max-w-4xl px-5 text-center md:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[10px] uppercase tracking-[0.28em] text-champagne"
        >
          {t("home.philosophy")}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 font-display text-4xl leading-tight md:text-6xl"
        >
          {t("home.notMore")}
          <br />
          <span className="italic font-light">{t("home.moreYou")}</span>
        </motion.h2>
        <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-ivory/70 md:text-base">
          {t("home.philosophyBody")}
        </p>
        <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-6 border-t border-ivory/15 pt-10">
          {[
            { n: "50", l: t("home.statShades") },
            { n: "16h", l: t("home.statWear") },
            { n: "100%", l: t("home.statCruelty") },
          ].map((s) => (
            <div key={s.l}>
              <p className="font-display text-3xl md:text-4xl">{s.n}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-ivory/50">
                {s.l}
              </p>
            </div>
          ))}
        </div>
        <Link
          href="/studio"
          className="mt-12 inline-flex border border-ivory/40 px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-ivory transition hover:bg-ivory hover:text-ink"
        >
          {t("home.tryOnCta")}
        </Link>
      </div>
    </section>
  );
}

export function Categories() {
  const { t } = useT();
  const cats = [
    {
      href: "/shop?category=makeup",
      label: t("nav.makeup"),
      img: "/images/campaign-glow.jpg",
    },
    {
      href: "/shop?category=hair",
      label: t("nav.hair"),
      img: "/images/campaign-hair.jpg",
    },
    {
      href: "/shop?category=body",
      label: t("nav.body"),
      img: "/images/campaign-skincare.jpg",
    },
    {
      href: "/shop?category=tools",
      label: t("nav.tools"),
      img: "/images/product-brushes.jpg",
    },
    {
      href: "/shop?category=sets",
      label: t("nav.sets"),
      img: "/images/campaign-gloss.jpg",
    },
    {
      href: "/studio",
      label: t("nav.studio"),
      img: "/images/campaign-lips.jpg",
    },
  ];
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-8 md:py-28">
      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted">
        {t("home.explore")}
      </p>
      <h2 className="mt-3 font-display text-4xl md:text-5xl">{t("home.theHouse")}</h2>
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6 md:gap-4">
        {cats.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
          >
            <Link href={c.href} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden bg-sand">
                <Image
                  src={c.img}
                  alt={c.label}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="25vw"
                />
                <div className="absolute inset-0 bg-ink/10 transition group-hover:bg-ink/25" />
              </div>
              <p className="mt-3 text-center text-[11px] font-medium uppercase tracking-[0.2em]">
                {c.label}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function PromoBanner() {
  const { t } = useT();
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-8 md:px-8">
      <div className="relative overflow-hidden bg-blush px-8 py-14 text-center md:px-16 md:py-20">
        <Image
          src="/images/texture-abstract.jpg"
          alt=""
          fill
          className="object-cover opacity-30"
        />
        <div className="relative">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-ink-soft">
            {t("home.spendMore")}
          </p>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">
            {t("home.promoCodes")}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-ink-soft">
            {t("home.promoBody")}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/shop" className="btn-primary inline-flex">
              {t("home.shopNow")}
            </Link>
            <Link href="/quiz" className="btn-ghost inline-flex">
              {t("home.ctaQuiz")}
            </Link>
            <Link href="/gifts" className="btn-ghost inline-flex">
              {t("nav.gifts")}
            </Link>
            <Link href="/studio" className="btn-ghost inline-flex">
              {t("home.tryOnCta")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
