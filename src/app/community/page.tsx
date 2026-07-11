"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, BadgeCheck } from "lucide-react";
import { UGC_POSTS, type UgcPost } from "@/lib/ugc";
import { useBrowse } from "@/store/browse";
import { cn } from "@/lib/utils";

export default function CommunityPage() {
  const [posts, setPosts] = useState<UgcPost[]>(UGC_POSTS);
  const [filter, setFilter] = useState("all");
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const addLoyalty = useBrowse((s) => s.addLoyalty);

  const tones = ["all", "Deep", "Rich", "Medium", "Tan", "Light", "Fair"];
  const list =
    filter === "all"
      ? posts
      : posts.filter((p) =>
          p.skinTone.toLowerCase().includes(filter.toLowerCase())
        );

  function toggleLike(id: string) {
    setLiked((s) => ({ ...s, [id]: !s[id] }));
    setPosts((ps) =>
      ps.map((p) =>
        p.id === id
          ? { ...p, likes: p.likes + (liked[id] ? -1 : 1) }
          : p
      )
    );
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const post: UgcPost = {
      id: `local-${Date.now()}`,
      author: String(fd.get("name") || "You"),
      handle: "@you",
      skinTone: String(fd.get("tone") || "Medium"),
      hairType: String(fd.get("hair") || "") || undefined,
      title: String(fd.get("title") || "My LUMÉA look"),
      body: String(fd.get("body") || ""),
      productSlug: "veil-soft-focus-foundation",
      productName: "Veil Soft-Focus Foundation",
      beforeImage: "/images/campaign-skincare.jpg",
      afterImage: "/images/campaign-glow.jpg",
      likes: 1,
      verified: false,
      look: String(fd.get("look") || "Everyday"),
    };
    setPosts((p) => [post, ...p]);
    setSubmitted(true);
    addLoyalty(75, "UGC community post");
    e.currentTarget.reset();
  }

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-12 md:px-8 md:py-16">
      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted">
        Community
      </p>
      <h1 className="mt-2 font-display text-5xl tracking-tight md:text-6xl">
        Real skin. Real hair. Real results.
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-muted md:text-base">
        Before & after from deep brown, Afro-Caribbean, Asian, Hispanic & every
        undertone in between. Shop the exact product. Earn 75 Glow Points when
        you share your look.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {tones.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={cn(
              "px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em]",
              filter === t
                ? "bg-ink text-ivory"
                : "border border-line hover:border-ink"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {list.map((p) => (
          <article
            key={p.id}
            className="flex flex-col overflow-hidden border border-line bg-surface"
          >
            <div className="grid grid-cols-2">
              <div className="relative aspect-[3/4]">
                <Image
                  src={p.beforeImage}
                  alt="Before"
                  fill
                  className="object-cover"
                  sizes="25vw"
                />
                <span className="absolute left-2 top-2 bg-ink/80 px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] text-ivory">
                  Before
                </span>
              </div>
              <div className="relative aspect-[3/4]">
                <Image
                  src={p.afterImage}
                  alt="After"
                  fill
                  className="object-cover"
                  sizes="25vw"
                />
                <span className="absolute left-2 top-2 bg-champagne px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] text-ink">
                  After
                </span>
              </div>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="flex items-center gap-1 text-sm font-medium">
                    {p.author}
                    {p.verified && (
                      <BadgeCheck size={14} className="text-champagne" />
                    )}
                  </p>
                  <p className="text-xs text-muted">
                    {p.handle} · {p.skinTone}
                    {p.hairType ? ` · ${p.hairType}` : ""}
                  </p>
                </div>
                <button
                  onClick={() => toggleLike(p.id)}
                  className={cn(
                    "inline-flex items-center gap-1 text-xs",
                    liked[p.id] ? "text-danger" : "text-muted"
                  )}
                >
                  <Heart
                    size={14}
                    className={liked[p.id] ? "fill-danger" : ""}
                  />
                  {p.likes}
                </button>
              </div>
              <p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-champagne">
                {p.look}
              </p>
              <h2 className="mt-1 font-display text-xl">{p.title}</h2>
              <p className="mt-2 flex-1 text-sm text-ink-soft">{p.body}</p>
              <Link
                href={`/product/${p.productSlug}`}
                className="mt-4 text-[11px] font-medium uppercase tracking-[0.14em] underline decoration-sand underline-offset-4 hover:decoration-ink"
              >
                Shop {p.productName} →
              </Link>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-16 border border-line bg-ivory-deep/40 p-6 md:p-10">
        <h2 className="font-display text-3xl">Share your before & after</h2>
        <p className="mt-2 max-w-lg text-sm text-muted">
          Tag your skin depth + hair pattern. Verified looks get featured and
          earn Glow Points. Demo form stores locally (+75 pts).
        </p>
        {submitted && (
          <p className="mt-4 text-sm text-ok">
            Posted · +75 Glow Points. Thank you for lighting the house.
          </p>
        )}
        <form onSubmit={onSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <input name="name" required placeholder="Your name" className="field" />
          <input name="tone" placeholder="Skin tone e.g. Deep / warm" className="field" />
          <input name="hair" placeholder="Hair type (optional)" className="field" />
          <input name="look" placeholder="Look name" className="field" />
          <input
            name="title"
            required
            placeholder="Title"
            className="field md:col-span-2"
          />
          <textarea
            name="body"
            required
            placeholder="What worked for you?"
            className="field min-h-[100px] md:col-span-2"
          />
          <button type="submit" className="btn-primary md:col-span-2 md:w-fit">
            Post look · +75 pts
          </button>
        </form>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/studio" className="btn-primary">
          Try your shade live
        </Link>
        <Link href="/quiz" className="btn-ghost">
          Match quiz
        </Link>
        <Link href="/affiliate" className="btn-ghost">
          Creator codes
        </Link>
      </div>
    </div>
  );
}
