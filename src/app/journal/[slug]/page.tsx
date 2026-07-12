import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getArticle } from "@/lib/journal";
import { JournalShop } from "@/components/journal/JournalShop";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return { title: "Journal" };
  return { title: a.title, description: a.excerpt };
}

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <article className="bg-ivory">
      <div className="relative min-h-[40vh] bg-ink md:min-h-[50vh]">
        <Image
          src={article.image}
          alt=""
          fill
          className="object-cover opacity-60"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <div className="relative mx-auto flex min-h-[40vh] max-w-3xl flex-col justify-end px-5 pb-12 pt-28 md:min-h-[50vh] md:px-8">
          <Link
            href="/journal"
            className="text-[10px] uppercase tracking-[0.16em] text-champagne hover:underline"
          >
            ← Journal
          </Link>
          <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-ivory/60">
            {article.category} · {article.date} · {article.author}
          </p>
          <h1 className="mt-3 font-display text-4xl text-ivory md:text-5xl">
            {article.title}
          </h1>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1100px] gap-12 px-5 py-14 md:grid-cols-[1fr_300px] md:px-8 md:py-20">
        <div className="space-y-5 text-sm leading-relaxed text-ink-soft md:text-base">
          {article.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {article.brandSlug && (
            <Link
              href={`/brands/${article.brandSlug}`}
              className="inline-block text-[11px] uppercase tracking-[0.14em] text-champagne hover:underline"
            >
              Visit brand floor →
            </Link>
          )}
        </div>
        <JournalShop slugs={article.productSlugs} brandSlug={article.brandSlug} />
      </div>
    </article>
  );
}
