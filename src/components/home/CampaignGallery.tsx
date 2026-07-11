"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const shots = [
  {
    src: "/images/campaign-deep.jpg",
    video: "/videos/campaign-deep.mp4",
    label: "Deep & Afro-Caribbean",
    href: "/tutorials",
    aspect: "aspect-[3/4]",
  },
  {
    src: "/images/campaign-latina.jpg",
    video: "/videos/campaign-latina.mp4",
    label: "Hispanic & Latina",
    href: "/tutorials",
    aspect: "aspect-[3/4]",
  },
  {
    src: "/images/campaign-asian.jpg",
    video: "/videos/campaign-asian.mp4",
    label: "Asian",
    href: "/tutorials",
    aspect: "aspect-[3/4]",
  },
  {
    src: "/images/campaign-gloss.jpg",
    video: "/videos/campaign-gloss.mp4",
    label: "Inclusive glam",
    href: "/shop?category=makeup",
    aspect: "aspect-[3/4]",
  },
  {
    src: "/images/campaign-glow.jpg",
    video: "/videos/campaign-glow.mp4",
    label: "Glow for every tone",
    href: "/studio",
    aspect: "aspect-[3/4]",
  },
  {
    src: "/images/campaign-lips.jpg",
    video: "/videos/campaign-lips.mp4",
    label: "Lips",
    href: "/product/lume-glass-lip-oil",
    aspect: "aspect-[3/4]",
  },
];

export function CampaignGallery() {
  return (
    <section className="bg-ink py-16 text-ivory md:py-24">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:mb-14 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-champagne">
              Campaign
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl lg:text-6xl">
              Faces of light.
            </h2>
            <p className="mt-3 max-w-md text-sm text-ivory/60">
              Deep brown, Afro-Caribbean, Asian, Hispanic & warm gold — the
              faces of our community. See yourself. Shop your shade.
            </p>
          </div>
          <Link
            href="/studio"
            className="border border-ivory/30 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-ivory transition hover:bg-ivory hover:text-ink"
          >
            Try the look live
          </Link>
        </div>

        {/* Wide hero diptych */}
        <Link
          href="/shop"
          className="group relative mb-3 block aspect-[21/9] overflow-hidden md:aspect-[2.4/1]"
        >
          <Image
            src="/images/campaign-diptych.jpg"
            alt="LUMÉA beauty campaign"
            fill
            className="object-cover transition duration-700 group-hover:scale-[1.02]"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
          <span className="absolute bottom-6 left-6 text-[11px] uppercase tracking-[0.2em] text-ivory/90">
            The collection
          </span>
        </Link>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {shots.map((s, i) => (
            <motion.div
              key={s.src}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={s.href} className="group relative block overflow-hidden">
                <div className={`relative ${s.aspect} bg-ink`}>
                  {s.video ? (
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      poster={s.src}
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                    >
                      <source src={s.video} type="video/mp4" />
                    </video>
                  ) : (
                    <Image
                      src={s.src}
                      alt={s.label}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-[1.04]"
                      sizes="20vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-ink/10 transition group-hover:bg-ink/0" />
                </div>
                <p className="mt-2 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-ivory/70">
                  {s.label}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
