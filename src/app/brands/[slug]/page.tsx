import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getHouseBrand } from "@/lib/house-brands";
import { listProducts } from "@/lib/db";
import { ProductCard } from "@/components/shop/ProductCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = getHouseBrand(slug);
  if (!brand) return { title: "Brand" };
  return {
    title: `${brand.name} · Brand floor`,
    description: brand.confession.slice(0, 160),
  };
}

export default async function BrandFloorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = getHouseBrand(slug);
  if (!brand) notFound();

  const products = await listProducts({ houseBrand: brand.slug });

  return (
    <div>
      <section className="relative min-h-[42vh] overflow-hidden bg-ink text-ivory md:min-h-[50vh]">
        <Image
          src={brand.image}
          alt=""
          fill
          className="object-cover opacity-55"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
        <div className="relative mx-auto flex min-h-[42vh] max-w-[1440px] flex-col justify-end px-5 pb-12 pt-24 md:min-h-[50vh] md:px-8 md:pb-16">
          <Link
            href="/brands"
            className="text-[10px] uppercase tracking-[0.2em] text-champagne hover:underline"
          >
            ← All brand floors
          </Link>
          <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.24em] text-ivory/60">
            {brand.floor} · {brand.origin}
          </p>
          <h1 className="mt-2 font-display text-5xl tracking-tight md:text-6xl lg:text-7xl">
            {brand.name}
          </h1>
          <p className="mt-3 max-w-xl text-lg text-champagne md:text-xl">
            {brand.tagline}
          </p>
        </div>
      </section>

      {/* Confession */}
      <section className="border-b border-line bg-ivory-deep/50">
        <div className="mx-auto max-w-[1440px] px-5 py-12 md:px-8 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted">
                Brand confession
              </p>
              <p className="mt-4 max-w-2xl font-display text-2xl leading-snug tracking-tight text-ink md:text-3xl">
                {brand.confession}
              </p>
            </div>
            <aside className="h-fit border border-line bg-surface p-6">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted">
                Specialties
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {brand.specialties.map((s) => (
                  <Link
                    key={s}
                    href={`/shop?brand=${brand.slug}&category=${s}`}
                    className="border border-line px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] hover:border-ink"
                  >
                    {s}
                  </Link>
                ))}
              </div>
              <Link
                href={`/shop?brand=${brand.slug}`}
                className="btn-primary mt-6 w-full"
              >
                Shop {brand.name}
              </Link>
              <Link
                href="/brands"
                className="mt-3 block text-center text-[11px] uppercase tracking-[0.12em] text-muted hover:text-ink"
              >
                Browse other floors
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-14 md:px-8 md:py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
              On this floor
            </p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl">
              {products.length} product{products.length === 1 ? "" : "s"}
            </h2>
          </div>
        </div>
        {products.length === 0 ? (
          <div className="border border-line py-20 text-center">
            <p className="font-display text-2xl">Floor restocking</p>
            <p className="mt-2 text-sm text-muted">
              New pieces for {brand.name} are on the way.
            </p>
            <Link href="/shop" className="btn-primary mt-6 inline-flex">
              Shop all houses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
