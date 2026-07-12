import Image from "next/image";
import Link from "next/link";
import { JOURNAL } from "@/lib/journal";

export const metadata = {
  title: "Journal",
  description:
    "LUMÉA Journal — lookbooks, rituals, brand floors, and live commerce stories.",
};

export default function JournalIndexPage() {
  return (
    <div className="bg-ivory">
      <section className="border-b border-line px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-muted">
            Editorial
          </p>
          <h1 className="mt-3 font-display text-5xl tracking-tight md:text-6xl">
            The Journal
          </h1>
          <p className="mt-4 max-w-xl text-sm text-muted md:text-base">
            Net-a-Porter magazine culture for the house: lookbooks, wash-day
            rituals, brand floor walks, and how Private Sale works — every
            story shoppable.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-14 md:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {JOURNAL.map((a, i) => (
            <Link
              key={a.slug}
              href={`/journal/${a.slug}`}
              className={`group flex flex-col overflow-hidden border border-line bg-surface ${
                i === 0 ? "md:col-span-2 md:grid md:grid-cols-2" : ""
              }`}
            >
              <div
                className={`relative overflow-hidden bg-ivory-deep ${
                  i === 0 ? "aspect-[16/10] md:aspect-auto md:min-h-[320px]" : "aspect-[16/10]"
                }`}
              >
                <Image
                  src={a.image}
                  alt=""
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes={i === 0 ? "100vw" : "50vw"}
                />
              </div>
              <div className="flex flex-col justify-center p-6 md:p-8">
                <p className="text-[10px] uppercase tracking-[0.16em] text-champagne">
                  {a.category} · {a.date}
                </p>
                <h2 className="mt-2 font-display text-2xl md:text-3xl">{a.title}</h2>
                <p className="mt-3 text-sm text-muted">{a.excerpt}</p>
                <p className="mt-4 text-xs text-muted">By {a.author}</p>
                <span className="mt-6 text-[11px] uppercase tracking-[0.14em] text-ink underline decoration-sand underline-offset-4 group-hover:decoration-ink">
                  Read & shop →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
