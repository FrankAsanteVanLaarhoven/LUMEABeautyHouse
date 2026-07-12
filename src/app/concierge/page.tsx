"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  CONCIERGE_SLOTS,
  TOPIC_LABELS,
  type ConciergeTopic,
} from "@/lib/experiences";
import { Calendar, Sparkles, Video } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ConciergePage() {
  const [slotId, setSlotId] = useState(CONCIERGE_SLOTS[0]?.id || "");
  const [topic, setTopic] = useState<ConciergeTopic>("shade-match");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setMsg("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          slotId,
          topic,
          notes: fd.get("notes"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      setMsg(data.message);
      e.currentTarget.reset();
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-ivory">
      <section className="border-b border-line bg-ink px-5 py-16 text-ivory md:px-8 md:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-champagne">
            Live service
          </p>
          <h1 className="mt-3 font-display text-5xl tracking-tight md:text-6xl">
            Beauty Concierge
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-ivory/75 md:text-base">
            Net-a-Porter personal shopping, online. Book 20–30 minutes with a
            LUMÉA artist — shade match, full-face edit, coils, bridal, or gift
            bags across brand floors. Video link follows by email.
          </p>
          <div className="mt-8 flex flex-wrap gap-6 text-[11px] uppercase tracking-[0.14em] text-ivory/60">
            <span className="inline-flex items-center gap-2">
              <Video size={14} className="text-champagne" /> Video session
            </span>
            <span className="inline-flex items-center gap-2">
              <Sparkles size={14} className="text-champagne" /> Shade passport
            </span>
            <span className="inline-flex items-center gap-2">
              <Calendar size={14} className="text-champagne" /> Multi-brand edit
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1100px] gap-12 px-5 py-14 md:grid-cols-[1fr_380px] md:px-8 md:py-20">
        <div>
          <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
            Available slots
          </h2>
          <ul className="mt-4 space-y-2">
            {CONCIERGE_SLOTS.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setSlotId(s.id)}
                  className={cn(
                    "flex w-full flex-col border p-4 text-left transition sm:flex-row sm:items-center sm:justify-between",
                    slotId === s.id
                      ? "border-ink bg-ink text-ivory"
                      : "border-line bg-surface hover:border-ink"
                  )}
                >
                  <div>
                    <p className="font-medium">{s.label}</p>
                    <p
                      className={cn(
                        "mt-1 text-sm",
                        slotId === s.id ? "text-ivory/70" : "text-muted"
                      )}
                    >
                      {s.artist} · {s.durationMin} min
                    </p>
                  </div>
                  <span
                    className={cn(
                      "mt-2 text-[10px] uppercase tracking-[0.12em] sm:mt-0",
                      slotId === s.id ? "text-champagne" : "text-muted"
                    )}
                  >
                    {s.seatsLeft} seats left
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <h2 className="mt-10 text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
            Session focus
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {(Object.keys(TOPIC_LABELS) as ConciergeTopic[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setTopic(id)}
                className={cn(
                  "px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em]",
                  topic === id
                    ? "bg-ink text-ivory"
                    : "border border-line hover:border-ink"
                )}
              >
                {TOPIC_LABELS[id]}
              </button>
            ))}
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="h-fit border border-line bg-surface p-6 lg:sticky lg:top-36"
        >
          <h2 className="font-display text-2xl">Book your slot</h2>
          <p className="mt-2 text-xs text-muted">
            Free for Flame+ Glow members · otherwise complimentary intro while
            we scale the atelier.
          </p>
          <div className="mt-6 space-y-4">
            <div>
              <label className="label">Name</label>
              <input name="name" required className="field" />
            </div>
            <div>
              <label className="label">Email</label>
              <input name="email" type="email" required className="field" />
            </div>
            <div>
              <label className="label">Notes (shade, occasion…)</label>
              <textarea name="notes" className="field min-h-[80px]" />
            </div>
          </div>
          {msg && <p className="mt-4 text-sm text-ok">{msg}</p>}
          {err && <p className="mt-4 text-sm text-danger">{err}</p>}
          <button type="submit" disabled={loading} className="btn-primary mt-6 w-full">
            {loading ? "Booking…" : "Request concierge"}
          </button>
          <Link
            href="/live"
            className="mt-4 block text-center text-[11px] uppercase tracking-[0.12em] text-muted hover:text-ink"
          >
            Prefer a live room? RSVP →
          </Link>
        </form>
      </div>
    </div>
  );
}
