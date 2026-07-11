"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const communities = [
  {
    title: "Deep & brown",
    body: "Contour that shows. Foundation that matches. Glow that belongs on rich skin.",
    img: "/images/campaign-deep.jpg",
    href: "/tutorials",
    tone: "Deep & brown",
  },
  {
    title: "Afro-Caribbean",
    body: "Built for melanin — bronze, highlight, and colour that never greys out.",
    img: "/images/campaign-glow.jpg",
    href: "/tutorials",
    tone: "Afro-Caribbean",
  },
  {
    title: "Asian",
    body: "Face maps, soft contour, and glass-skin techniques for East & Southeast Asian features.",
    img: "/images/campaign-asian.jpg",
    href: "/tutorials",
    tone: "Asian",
  },
  {
    title: "Hispanic & Latina",
    body: "Warm gold, bronze goddess, and snatched glam for medium-tan and deep warm undertones.",
    img: "/images/campaign-latina.jpg",
    href: "/tutorials",
    tone: "Hispanic & Latina",
  },
];

export function SkinCommunity() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-16 md:px-8 md:py-24">
      <div className="mb-10 max-w-2xl md:mb-14">
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted">
          Our community
        </p>
        <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl lg:text-6xl">
          Beauty for the women who buy.
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
          Deep brown, Afro-Caribbean, Asian, Hispanic & warm gold — not an
          afterthought. Tutorials, shades, and campaign faces that look like you.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {communities.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
          >
            <Link href={c.href} className="group block overflow-hidden">
              <div className="relative aspect-[3/4] overflow-hidden bg-ivory-deep">
                <Image
                  src={c.img}
                  alt={c.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  sizes="25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-ivory">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-champagne">
                    {c.tone}
                  </p>
                  <h3 className="mt-1 font-display text-2xl">{c.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-ivory/75">
                    {c.body}
                  </p>
                  <span className="mt-3 inline-block text-[10px] uppercase tracking-[0.16em] underline decoration-ivory/40 underline-offset-4 transition group-hover:decoration-ivory">
                    Watch tutorials
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/tutorials" className="btn-primary">
          All skin-tone tutorials
        </Link>
        <Link href="/studio" className="btn-ghost">
          Match your shade live
        </Link>
        <Link href="/shop?category=makeup" className="btn-ghost">
          Shop foundation shades
        </Link>
      </div>
    </section>
  );
}
