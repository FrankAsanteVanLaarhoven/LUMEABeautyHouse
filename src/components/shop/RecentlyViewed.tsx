"use client";

import Link from "next/link";
import Image from "next/image";
import { useBrowse } from "@/store/browse";
import { useT } from "@/lib/i18n/useT";

export function RecentlyViewed() {
  const viewed = useBrowse((s) => s.recentlyViewed);
  const { formatPrice } = useT();
  if (viewed.length < 2) return null;

  return (
    <section className="border-t border-line bg-ivory-deep/40 py-12">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8">
        <h2 className="font-display text-2xl md:text-3xl">Recently viewed</h2>
        <div className="mt-6 flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {viewed.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              className="w-36 shrink-0 sm:w-40"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-surface">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </div>
              <p className="mt-2 line-clamp-2 text-xs font-medium">{p.name}</p>
              <p className="text-xs text-muted">{formatPrice(p.price)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
