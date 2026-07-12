"use client";

import { FormEvent, use, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getExpert,
  SESSION_FORMAT_LABELS,
  SPECIALTY_LABELS,
  type SessionFormat,
} from "@/lib/concierge-experts";
import { useT } from "@/lib/i18n/useT";
import { BadgeCheck, Video } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ExpertProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const expert = getExpert(slug);
  const { formatPrice } = useT();
  const [format, setFormat] = useState<SessionFormat>("one-on-one");
  const [partySize, setPartySize] = useState(1);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [roomUrl, setRoomUrl] = useState("");
  const [paypalUrl, setPaypalUrl] = useState("");

  const tier = useMemo(
    () => expert?.pricing.find((p) => p.format === format),
    [expert, format]
  );

  if (!expert) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <h1 className="font-display text-4xl">Expert not found</h1>
        <Link href="/concierge" className="btn-primary mt-8 inline-flex">
          All concierges
        </Link>
      </div>
    );
  }

  async function onBook(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setMsg("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/concierge/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expertSlug: expert!.slug,
          format,
          name: fd.get("name"),
          email: fd.get("email"),
          partySize,
          eventType: fd.get("eventType"),
          notes: fd.get("notes"),
          payWithPaypal: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      setMsg(data.message);
      setRoomUrl(data.roomUrl || "");
      setPaypalUrl(data.paypalUrl || "");
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-ivory">
      <div className="mx-auto grid max-w-[1440px] gap-0 lg:grid-cols-[1fr_420px]">
        <div className="relative min-h-[50vh] bg-ink lg:min-h-screen">
          <Image
            src={expert.image}
            alt={expert.name}
            fill
            className="object-cover opacity-80"
            priority
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/30" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-ivory md:p-12">
            <Link
              href="/concierge"
              className="text-[10px] uppercase tracking-[0.16em] text-champagne hover:underline"
            >
              ← All experts
            </Link>
            <p className="mt-4 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-champagne">
              <BadgeCheck size={12} /> Verified concierge
            </p>
            <h1 className="mt-2 font-display text-5xl md:text-6xl">
              {expert.name}
            </h1>
            <p className="mt-2 text-ivory/75">{expert.title}</p>
            <p className="mt-2 text-xs text-ivory/50">
              {expert.rating} ★ · {expert.sessionCount} live sessions ·{" "}
              {expert.streamLabel}
            </p>
          </div>
        </div>

        <div className="px-5 py-10 md:px-8 md:py-14">
          <p className="text-sm leading-relaxed text-ink-soft">{expert.bio}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {expert.specialties.map((s) => (
              <span
                key={s}
                className="border border-line px-2 py-1 text-[10px] uppercase tracking-[0.1em]"
              >
                {SPECIALTY_LABELS[s]}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted">
            Languages: {expert.languages.join(", ")} · Brands:{" "}
            {expert.brandSlugs.join(", ")}
          </p>
          <p className="mt-2 text-xs text-champagne">
            Earns ~{Math.round((1 - expert.platformShare) * 100)}% of session fee
            + {expert.productCommissionPct}% product commission on attributed
            bags
          </p>

          <h2 className="mt-10 text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
            Session type
          </h2>
          <div className="mt-3 space-y-2">
            {expert.pricing.map((p) => (
              <button
                key={p.format}
                type="button"
                onClick={() => {
                  setFormat(p.format);
                  setPartySize(1);
                }}
                className={cn(
                  "flex w-full items-start justify-between border p-4 text-left transition",
                  format === p.format
                    ? "border-ink bg-ink text-ivory"
                    : "border-line bg-surface hover:border-ink"
                )}
              >
                <div>
                  <p className="font-medium">{SESSION_FORMAT_LABELS[p.format]}</p>
                  <p
                    className={cn(
                      "mt-1 text-xs",
                      format === p.format ? "text-ivory/65" : "text-muted"
                    )}
                  >
                    {p.durationMin} min · max {p.maxClients} · {p.description}
                  </p>
                </div>
                <span className="font-display text-xl">
                  {formatPrice(p.priceUsd)}
                </span>
              </button>
            ))}
          </div>

          <form onSubmit={onBook} className="mt-8 space-y-4 border border-line bg-surface p-5">
            <h2 className="font-display text-xl">Book live stream</h2>
            <div>
              <label className="label">Your name</label>
              <input name="name" required className="field" />
            </div>
            <div>
              <label className="label">Email</label>
              <input name="email" type="email" required className="field" />
            </div>
            {tier && tier.maxClients > 1 && (
              <div>
                <label className="label">
                  Party size (max {tier.maxClients})
                </label>
                <input
                  type="number"
                  min={1}
                  max={tier.maxClients}
                  value={partySize}
                  onChange={(e) =>
                    setPartySize(
                      Math.min(
                        tier.maxClients,
                        Math.max(1, Number(e.target.value) || 1)
                      )
                    )
                  }
                  className="field"
                />
              </div>
            )}
            {(format === "wedding" || format === "event") && (
              <div>
                <label className="label">Event type / date</label>
                <input
                  name="eventType"
                  placeholder="e.g. Wedding · 12 Sep · 6 in party"
                  className="field"
                />
              </div>
            )}
            <div>
              <label className="label">Goals & notes</label>
              <textarea
                name="notes"
                className="field min-h-[80px]"
                placeholder="Shade depth, hair type, products you want to try…"
              />
            </div>
            {msg && <p className="text-sm text-ok">{msg}</p>}
            {err && <p className="text-sm text-danger">{err}</p>}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading
                ? "Booking…"
                : `Book ${SESSION_FORMAT_LABELS[format]} · ${formatPrice(tier?.priceUsd || 0)}`}
            </button>
            {paypalUrl && (
              <a
                href={paypalUrl}
                className="mt-2 flex w-full items-center justify-center bg-[#0070ba] py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-white"
              >
                Pay session fee with PayPal
              </a>
            )}
            {roomUrl && (
              <a
                href={roomUrl}
                className="btn-ghost mt-2 flex w-full items-center justify-center gap-2"
              >
                <Video size={14} /> Open live room
              </a>
            )}
          </form>

          <div className="mt-8">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
              Signature products
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {expert.productSlugs.map((slug) => (
                <Link
                  key={slug}
                  href={`/product/${slug}`}
                  className="border border-line px-2 py-1 text-[10px] uppercase tracking-[0.1em] hover:border-ink"
                >
                  {slug.split("-").slice(0, 2).join(" ")}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
