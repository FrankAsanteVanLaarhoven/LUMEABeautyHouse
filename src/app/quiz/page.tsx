"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles, RotateCcw } from "lucide-react";
import {
  questionsForTrack,
  scoreQuiz,
  type QuizTrack,
  type QuizResult,
} from "@/lib/quiz";
import { usePrefs } from "@/store/prefs";
import { useBrowse } from "@/store/browse";
import { useCart } from "@/store/cart";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/useT";

// Client-side product meta for results (no server fetch needed for demo)
const PRODUCT_META: Record<
  string,
  { name: string; price: number; image: string; tagline: string }
> = {
  "veil-soft-focus-foundation": {
    name: "Veil Soft-Focus Foundation",
    price: 42,
    image: "/images/product-foundation.jpg",
    tagline: "Weightless coverage. True-to-you finish.",
  },
  "aura-illuminating-serum": {
    name: "Aura Illuminating Serum",
    price: 58,
    image: "/images/skincare-still.jpg",
    tagline: "Light from within.",
  },
  "lume-glass-lip-oil": {
    name: "Lumé Glass Lip Oil",
    price: 24,
    image: "/images/product-gloss.jpg",
    tagline: "Mirror shine.",
  },
  "edge-sculpt-contour-palette": {
    name: "Edge Sculpt Contour Palette",
    price: 46,
    image: "/images/product-contour.jpg",
    tagline: "Bone structure, soft-focus.",
  },
  "sun-sculpt-creme-bronzer": {
    name: "Sun Sculpt Crème Bronzer",
    price: 34,
    image: "/images/product-bronzer.jpg",
    tagline: "Warmth, not weight.",
  },
  "flux-9-in-1-hair-oil": {
    name: "Flux 9-in-1 Hair Oil",
    price: 32,
    image: "/images/product-hairoil.jpg",
    tagline: "Full spectrum repair.",
  },
  "coil-define-curl-cream": {
    name: "Coil Define Curl Cream",
    price: 32,
    image: "/images/product-hairmask.jpg",
    tagline: "Definition without crunch.",
  },
  "repair-cloud-hair-mask": {
    name: "Repair Cloud Hair Mask",
    price: 38,
    image: "/images/product-hairmask.jpg",
    tagline: "Weekly rescue.",
  },
  "clean-shine-balancing-shampoo": {
    name: "Clean Shine Balancing Shampoo",
    price: 28,
    image: "/images/product-haircare.jpg",
    tagline: "Clarify without the crash.",
  },
  "silk-slip-conditioner": {
    name: "Silk Slip Conditioner",
    price: 30,
    image: "/images/product-haircare.jpg",
    tagline: "Detangle. Soften.",
  },
  "air-lift-dry-shampoo": {
    name: "Air Lift Dry Shampoo",
    price: 26,
    image: "/images/product-dryshampoo.jpg",
    tagline: "Invisible volume.",
  },
  "clean-canvas-gel-cleanser": {
    name: "Clean Canvas Gel Cleanser",
    price: 28,
    image: "/images/skincare-still.jpg",
    tagline: "Remove everything. Disturb nothing.",
  },
  "silk-veil-body-creme": {
    name: "Silk Veil Body Crème",
    price: 36,
    image: "/images/product-bodycream.jpg",
    tagline: "Second-skin soft.",
  },
  "lumen-dry-body-oil": {
    name: "Lumen Dry Body Oil",
    price: 40,
    image: "/images/product-bodyoil.jpg",
    tagline: "Liquid light for skin.",
  },
  "lumea-ritual-starter-set": {
    name: "Ritual Starter Set",
    price: 48,
    image: "/images/skincare-still.jpg",
    tagline: "Cleanse. Illuminate. Veil.",
  },
  "glow-edit-full-face-set": {
    name: "Glow Edit Full Face Set",
    price: 98,
    image: "/images/product-giftset.jpg",
    tagline: "Foundation · Contour · Gloss · Sponge",
  },
  "hair-ritual-cleanse-treat-set": {
    name: "Hair Ritual Set",
    price: 88,
    image: "/images/product-giftset.jpg",
    tagline: "Shampoo · Conditioner · Oil · Mask",
  },
  "cloud-bounce-beauty-sponge": {
    name: "Cloud Bounce Beauty Sponge",
    price: 16,
    image: "/images/product-sponge.jpg",
    tagline: "Zero streak.",
  },
  "sculpt-angle-contour-brush": {
    name: "Sculpt Angle Contour Brush",
    price: 28,
    image: "/images/product-brushes.jpg",
    tagline: "Precision hollows.",
  },
  "atelier-essential-brush-set": {
    name: "Atelier Essential Brush Set",
    price: 68,
    image: "/images/product-brushes.jpg",
    tagline: "Six brushes. Every face.",
  },
  "tint-balm-moisture-barrier": {
    name: "Tint Balm Moisture Barrier",
    price: 18,
    image: "/images/product-gloss.jpg",
    tagline: "Care first. Color second.",
  },
  "night-restore-sleeping-mask": {
    name: "Night Restore Sleeping Mask",
    price: 52,
    image: "/images/product-bodycream.jpg",
    tagline: "Wake up glass.",
  },
  "pro-tool-starter-kit": {
    name: "Pro Tool Starter Kit",
    price: 79,
    image: "/images/product-brushes.jpg",
    tagline: "Brushes · Sponge · Cleaner",
  },
};

export default function QuizPage() {
  const { formatPrice } = useT();
  const setSkinProfile = usePrefs((s) => s.setSkinProfile);
  const addLoyalty = useBrowse((s) => s.addLoyalty);
  const addItem = useCart((s) => s.addItem);

  const [track, setTrack] = useState<QuizTrack | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);

  const questions = useMemo(
    () => (track ? questionsForTrack(track) : []),
    [track]
  );
  const q = questions[step];
  const progress = questions.length
    ? Math.round(((step + (result ? 1 : 0)) / questions.length) * 100)
    : 0;

  function pick(optionId: string) {
    if (!q) return;
    const next = { ...answers, [q.id]: optionId };
    setAnswers(next);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      const r = scoreQuiz(next);
      setResult(r);
      // Sync prefs for studio
      const depthMap: Record<string, string> = {
        fair: "fair",
        "light-med": "light",
        medium: "medium",
        tan: "tan",
        deep: "deep",
        rich: "rich",
      };
      const underMap: Record<string, string> = {
        cool: "cool",
        warm: "warm",
        neutral: "neutral",
        olive: "olive",
      };
      setSkinProfile({
        skinDepth: depthMap[next["skin-depth"]] || undefined,
        undertone: underMap[next.undertone] || undefined,
        skinType: next["skin-type"] || undefined,
      });
      addLoyalty(50, "Match quiz");
    }
  }

  function reset() {
    setTrack(null);
    setStep(0);
    setAnswers({});
    setResult(null);
  }

  if (!track) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted">
          Beauty match
        </p>
        <h1 className="mt-3 font-display text-5xl tracking-tight md:text-6xl">
          Find what was made for you.
        </h1>
        <p className="mt-4 max-w-xl text-sm text-muted md:text-base">
          2-minute quiz for skin, hair, or both. Built for deep brown,
          Afro-Caribbean, Asian, Hispanic & warm tones — then shop your edit or
          try shades live.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {(
            [
              {
                id: "skin" as const,
                title: "Skin & makeup",
                body: "Depth, undertone, concerns → foundation & face.",
              },
              {
                id: "hair" as const,
                title: "Hair ritual",
                body: "Texture & goals → cleanse, mask, oil, define.",
              },
              {
                id: "full" as const,
                title: "Full beauty",
                body: "Skin + hair + vibe → complete LUMÉA edit.",
              },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTrack(t.id)}
              className="border border-line bg-surface p-6 text-left transition hover:border-ink"
            >
              <p className="font-display text-2xl">{t.title}</p>
              <p className="mt-2 text-sm text-muted">{t.body}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-champagne">
                Start <ChevronRight size={14} />
              </span>
            </button>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3 text-sm">
          <Link href="/studio" className="text-muted underline-offset-4 hover:underline">
            Or open Mirror Studio →
          </Link>
          <Link href="/concerns" className="text-muted underline-offset-4 hover:underline">
            Shop by concern →
          </Link>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-12 md:px-8 md:py-16">
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-champagne">
          {result.matchScore}% match
        </p>
        <h1 className="mt-2 font-display text-4xl md:text-5xl">{result.title}</h1>
        <p className="mt-3 text-sm text-muted">{result.summary}</p>
        {result.concerns.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {result.concerns.map((c) => (
              <span
                key={c}
                className="border border-line px-3 py-1 text-[10px] uppercase tracking-[0.12em]"
              >
                {c}
              </span>
            ))}
          </div>
        )}
        <div className="mt-6 border border-line bg-ivory-deep/50 p-4 text-sm text-ink-soft">
          <strong className="text-ink">Your ritual: </strong>
          {result.routineHint}
        </div>
        <p className="mt-2 text-xs text-ok">+50 Glow Points added to loyalty</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.productSlugs.map((slug) => {
            const p = PRODUCT_META[slug];
            if (!p) return null;
            return (
              <article key={slug} className="border border-line bg-surface">
                <Link href={`/product/${slug}`}>
                  <div className="relative aspect-[3/4] bg-ivory-deep">
                    <Image src={p.image} alt={p.name} fill className="object-cover" sizes="33vw" />
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/product/${slug}`}>
                    <h3 className="text-sm font-medium">{p.name}</h3>
                  </Link>
                  <p className="mt-1 text-xs text-muted">{p.tagline}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-display text-xl">
                      {formatPrice(p.price)}
                    </span>
                    <button
                      className="text-[10px] uppercase tracking-[0.12em] underline"
                      onClick={() =>
                        addItem({
                          productId: slug,
                          variantId: `${slug}-default`,
                          slug,
                          name: p.name,
                          variantName: "Default",
                          sku: slug.slice(0, 12).toUpperCase(),
                          price: p.price,
                          image: p.image,
                          maxStock: 50,
                        })
                      }
                    >
                      Add
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/studio" className="btn-primary">
            <Sparkles size={14} /> Try shades live
          </Link>
          <Link href="/routines" className="btn-ghost">
            Build full routine
          </Link>
          <button onClick={reset} className="btn-ghost">
            <RotateCcw size={14} /> Retake quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-12 md:px-8 md:py-16">
      <div className="mb-8">
        <div className="h-1 overflow-hidden rounded-full bg-sand">
          <div
            className="h-full bg-ink transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 flex justify-between text-[10px] uppercase tracking-[0.14em] text-muted">
          <span>
            Step {step + 1} / {questions.length}
          </span>
          <button
            onClick={() => (step === 0 ? reset() : setStep(step - 1))}
            className="inline-flex items-center gap-1 hover:text-ink"
          >
            <ChevronLeft size={12} /> Back
          </button>
        </div>
      </div>

      {q && (
        <>
          <h1 className="font-display text-3xl tracking-tight md:text-4xl">
            {q.title}
          </h1>
          {q.subtitle && (
            <p className="mt-2 text-sm text-muted">{q.subtitle}</p>
          )}
          <div className="mt-8 space-y-2">
            {q.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => pick(opt.id)}
                className={cn(
                  "flex w-full items-center justify-between border px-5 py-4 text-left transition",
                  answers[q.id] === opt.id
                    ? "border-ink bg-ink text-ivory"
                    : "border-line bg-surface hover:border-ink"
                )}
              >
                <span className="text-sm font-medium">{opt.label}</span>
                <ChevronRight size={16} className="opacity-40" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
