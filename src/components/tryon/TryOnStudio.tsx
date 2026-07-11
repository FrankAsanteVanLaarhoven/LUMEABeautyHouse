"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Camera,
  ImagePlus,
  Lightbulb,
  Sparkles,
  Upload,
  FlipHorizontal2,
  PlayCircle,
} from "lucide-react";
import { useT } from "@/lib/i18n/useT";
import { usePrefs } from "@/store/prefs";
import { useProfile } from "@/store/profile";
import { useCart } from "@/store/cart";
import { useBrowse } from "@/store/browse";
import { cn } from "@/lib/utils";
import type { StudioSkinConfig } from "@/lib/types";
import {
  SHADES,
  pickBestShade,
  depthLabelFromLum,
  type ShadeCategory,
  type ShadeOption,
  type ShadeUndertone,
} from "@/lib/shades";

type Category = ShadeCategory;
type StudioLook = "mirror-white" | "soft-luxe" | "brand";

const SKIN_TYPES = ["normal", "dry", "oily", "combination", "sensitive"] as const;
const UNDERTONES = ["cool", "warm", "neutral", "olive"] as const;
const DEPTHS = ["fair", "light", "medium", "tan", "deep", "rich"] as const;

function depthFromLabel(d: string) {
  const map: Record<string, number> = {
    fair: 0.92, light: 0.82, medium: 0.62, tan: 0.48, deep: 0.28, rich: 0.14,
  };
  return map[d] ?? 0.62;
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function luminance(r: number, g: number, b: number) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export function TryOnStudio({
  brandSkin,
  brandName,
}: {
  brandSkin?: StudioSkinConfig | null;
  brandName?: string;
} = {}) {
  const { t, formatPrice } = useT();
  const addItem = useCart((s) => s.addItem);
  const skinType = usePrefs((s) => s.skinType);
  const undertone = usePrefs((s) => s.undertone);
  const skinDepth = usePrefs((s) => s.skinDepth);
  const setSkinProfile = usePrefs((s) => s.setSkinProfile);
  const clientProfile = useProfile((s) => s.profile);
  const updateClientProfile = useProfile((s) => s.updateProfile);
  const saveShadeMatch = useBrowse((s) => s.saveShadeMatch);
  const addLoyalty = useBrowse((s) => s.addLoyalty);
  const skinned = Boolean(brandSkin?.enabled);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animRef = useRef<number>(0);
  const stillRef = useRef<HTMLImageElement | null>(null);

  const [mode, setMode] = useState<"live" | "upload">("live");
  const [studioLook, setStudioLook] = useState<StudioLook>(
    brandSkin?.defaultLook || "mirror-white"
  );
  const [camOn, setCamOn] = useState(false);
  const [camError, setCamError] = useState("");
  const [facingUser, setFacingUser] = useState(true);
  const [category, setCategory] = useState<Category>("foundation");
  const [selected, setSelected] = useState<ShadeOption>(SHADES[3]);
  const [intensity, setIntensity] = useState(
    brandSkin?.defaultIntensity ?? 0.42
  );
  const [brightness, setBrightness] = useState(
    brandSkin?.defaultBrightness ?? 1.12
  );

  useEffect(() => {
    if (!brandSkin?.enabled) return;
    setStudioLook(brandSkin.defaultLook || "brand");
    setIntensity(brandSkin.defaultIntensity ?? 0.42);
    setBrightness(brandSkin.defaultBrightness ?? 1.12);
  }, [brandSkin]);
  const [analyzing, setAnalyzing] = useState(false);
  const [sampledDepth, setSampledDepth] = useState<number | null>(null);
  const [matchNote, setMatchNote] = useState("");
  const [hasMedia, setHasMedia] = useState(false);

  useEffect(() => {
    if (!clientProfile) return;
    setSkinProfile({
      skinType: clientProfile.skinType,
      undertone: clientProfile.undertone,
      skinDepth: clientProfile.skinDepth,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientProfile?.id]);

  const filtered = useMemo(
    () => SHADES.filter((s) => s.kind === category),
    [category]
  );

  const matches = useMemo(() => {
    const target = sampledDepth ?? depthFromLabel(skinDepth);
    return [...filtered]
      .map((s) => {
        const depthScore = 1 - Math.min(1, Math.abs(s.depth - target) * 2.2);
        const underScore =
          s.undertone === undertone
            ? 1
            : undertone === "neutral" || s.undertone === "neutral"
              ? 0.75
              : 0.45;
        const score = Math.round((depthScore * 0.65 + underScore * 0.35) * 100);
        return { shade: s, score: Math.min(99, Math.max(40, score)) };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }, [filtered, sampledDepth, skinDepth, undertone]);

  const stopCam = useCallback(() => {
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    streamRef.current = null;
    setCamOn(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.removeAttribute("src");
    }
  }, []);

  const startCam = useCallback(async (userFacing = true) => {
    setCamError("");
    try {
      stillRef.current = null;
      streamRef.current?.getTracks().forEach((tr) => tr.stop());
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: userFacing ? "user" : "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setFacingUser(userFacing);
      setCamOn(true);
      setHasMedia(true);
      setMode("live");
    } catch {
      setCamError(t("studio.noCam"));
      setMode("upload");
    }
  }, [t]);

  useEffect(() => () => {
    stopCam();
    cancelAnimationFrame(animRef.current);
  }, [stopCam]);

  // Canvas render loop — mirror white studio
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const draw = () => {
      const video = videoRef.current;
      const still = stillRef.current;
      let w = 720;
      let h = 900;
      if (mode === "live" && video && video.readyState >= 2) {
        w = video.videoWidth || 720;
        h = video.videoHeight || 900;
      } else if (still?.complete) {
        w = still.naturalWidth || 720;
        h = still.naturalHeight || 900;
      }
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      ctx.clearRect(0, 0, w, h);

      // Studio fill behind (visible if letterboxed)
      if (studioLook === "mirror-white" || studioLook === "brand") {
        ctx.fillStyle =
          studioLook === "brand" && brandSkin?.frameColor
            ? brandSkin.frameColor
            : "#f7f7f5";
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.fillStyle = "#1a1612";
        ctx.fillRect(0, 0, w, h);
      }

      const mirror = mode === "live" && facingUser;

      if (mode === "live" && video && video.readyState >= 2) {
        ctx.save();
        if (mirror) {
          ctx.translate(w, 0);
          ctx.scale(-1, 1);
        }
        // brightness boost for crisp white studio
        ctx.filter = `brightness(${brightness}) contrast(1.05) saturate(1.05)`;
        ctx.drawImage(video, 0, 0, w, h);
        ctx.filter = "none";
        ctx.restore();
      } else if (still?.complete) {
        ctx.filter = `brightness(${brightness}) contrast(1.05)`;
        ctx.drawImage(still, 0, 0, w, h);
        ctx.filter = "none";
      } else {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      const rgb = hexToRgb(selected.hex);
      ctx.save();

      if (category === "foundation") {
        const cx = w * 0.5;
        const cy = h * 0.42;
        const rx = w * 0.24;
        const ry = h * 0.3;
        const grad = ctx.createRadialGradient(cx, cy, rx * 0.15, cx, cy, rx);
        grad.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},${intensity * 0.5})`);
        grad.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`);
        ctx.globalCompositeOperation = "multiply";
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (category === "lips") {
        const cx = w * 0.5;
        const cy = h * 0.62;
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${intensity * 0.78})`;
        ctx.beginPath();
        ctx.ellipse(cx, cy, w * 0.08, h * 0.028, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = `rgba(255,255,255,${intensity * 0.28})`;
        ctx.beginPath();
        ctx.ellipse(cx, cy - h * 0.008, w * 0.055, h * 0.01, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (category === "contour") {
        // dual cheek hollow + jaw
        ctx.globalCompositeOperation = "multiply";
        const zones = [
          [0.28, 0.46, 0.11, 0.055, 0.45],
          [0.72, 0.46, 0.11, 0.055, -0.45],
          [0.5, 0.72, 0.16, 0.035, 0],
        ] as const;
        for (const [px, py, rx, ry, rot] of zones) {
          const cx = w * px;
          const cy = h * py;
          const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * rx);
          grad.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},${intensity * 0.48})`);
          grad.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.ellipse(cx, cy, w * rx, h * ry, rot, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // bronzer
        ctx.globalCompositeOperation = "multiply";
        for (const [px, py] of [[0.32, 0.48], [0.68, 0.48]] as const) {
          const cx = w * px;
          const cy = h * py;
          const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.1);
          grad.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},${intensity * 0.48})`);
          grad.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.ellipse(cx, cy, w * 0.1, h * 0.06, px < 0.5 ? 0.4 : -0.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // Sampling guide
      ctx.strokeStyle =
        studioLook === "mirror-white"
          ? "rgba(26,22,18,0.35)"
          : "rgba(255,255,255,0.7)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.4, 12, 0, Math.PI * 2);
      ctx.stroke();

      // Soft ring-light vignette (studio identity)
      if (studioLook === "mirror-white" || studioLook === "brand") {
        const vg = ctx.createRadialGradient(
          w * 0.5, h * 0.4, w * 0.25,
          w * 0.5, h * 0.45, w * 0.75
        );
        vg.addColorStop(0, "rgba(255,255,255,0)");
        const ring =
          studioLook === "brand" && brandSkin?.ringLightColor
            ? brandSkin.ringLightColor
            : "#ffffff";
        // parse hex to soft fade
        vg.addColorStop(1, `${ring}2e`);
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = vg;
        ctx.fillRect(0, 0, w, h);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [
    mode,
    selected,
    intensity,
    category,
    hasMedia,
    studioLook,
    brightness,
    facingUser,
    brandSkin,
  ]);

  function analyzeSkin() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setAnalyzing(true);
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    try {
      // Multi-zone sample: cheek + forehead (selfie shade match)
      const zones = [
        [0.42, 0.36, 0.16, 0.1],
        [0.45, 0.48, 0.1, 0.08],
        [0.5, 0.32, 0.08, 0.06],
      ] as const;
      let r = 0,
        g = 0,
        b = 0,
        n = 0;
      for (const [px, py, rw, rh] of zones) {
        const data = ctx.getImageData(
          Math.floor(w * px),
          Math.floor(h * py),
          Math.max(4, Math.floor(w * rw)),
          Math.max(4, Math.floor(h * rh))
        ).data;
        for (let i = 0; i < data.length; i += 12) {
          const pr = data[i];
          const pg = data[i + 1];
          const pb = data[i + 2];
          const lumPx = luminance(pr, pg, pb);
          if (lumPx < 0.08 || lumPx > 0.95) continue;
          r += pr;
          g += pg;
          b += pb;
          n++;
        }
      }
      if (n < 8) throw new Error("no sample");
      r /= n;
      g /= n;
      b /= n;
      const lum = luminance(r, g, b);
      setSampledDepth(lum);
      const under: ShadeUndertone =
        r - b > 18
          ? "warm"
          : b - r > 18
            ? "cool"
            : g > r && g > b
              ? "olive"
              : "neutral";
      const depthLabel = depthLabelFromLum(lum) as (typeof DEPTHS)[number];
      setSkinProfile({ undertone: under, skinDepth: depthLabel });
      if (clientProfile) {
        updateClientProfile({ undertone: under, skinDepth: depthLabel });
      }
      setCategory("foundation");
      const ranked = pickBestShade(lum, under, "foundation");
      const best = ranked[0]?.shade;
      const score = Math.round((ranked[0]?.score || 0) * 100);
      if (best) {
        setSelected(best);
        setMatchNote(
          `Selfie match ${score}% · ${depthLabel} ${under} → ${best.name}`
        );
        saveShadeMatch({
          shadeId: best.id,
          name: best.name,
          hex: best.hex,
          productSlug: best.slug,
          productName: best.productName,
          depthLabel,
          undertone: under,
          score,
        });
        addLoyalty(30, "Selfie shade match");
      } else {
        setMatchNote(`Profile set · ${depthLabel} / ${under}`);
      }
    } catch {
      setMatchNote("Could not sample — try brighter light on cheeks.");
    }
    setTimeout(() => setAnalyzing(false), 450);
  }

  function onFile(file: File) {
    stopCam();
    const url = URL.createObjectURL(file);
    if (file.type.startsWith("video/")) {
      setMode("live");
      const video = videoRef.current;
      if (video) {
        video.srcObject = null;
        video.src = url;
        video.loop = true;
        video.muted = true;
        video.play();
        setCamOn(true);
        setHasMedia(true);
      }
    } else {
      setMode("upload");
      const img = new window.Image();
      img.onload = () => {
        stillRef.current = img;
        setHasMedia(true);
        // Auto shade-match shortly after selfie loads
        setTimeout(() => analyzeSkin(), 350);
      };
      img.src = url;
    }
  }

  function addMatched() {
    addItem({
      productId: selected.productId,
      variantId: selected.id,
      slug: selected.slug,
      name: selected.productName,
      variantName: selected.name,
      sku: selected.sku,
      price: selected.price,
      image: selected.image,
      maxStock: selected.stock,
    });
  }

  const isWhite =
    studioLook === "mirror-white" ||
    (studioLook === "brand" && skinned);
  const isBrandLook = studioLook === "brand" && skinned;
  const pageBg = isBrandLook
    ? brandSkin!.panelColor
    : isWhite
      ? "#f4f4f2"
      : undefined;
  const textCol = isBrandLook ? brandSkin!.textColor : undefined;
  const accentCol = isBrandLook ? brandSkin!.accentColor : undefined;
  const btnCol = isBrandLook ? brandSkin!.buttonColor : undefined;
  const btnText = isBrandLook ? brandSkin!.buttonTextColor : undefined;
  const frameBg = isBrandLook
    ? brandSkin!.frameColor
    : isWhite
      ? "#ffffff"
      : "#1a1612";
  const ringCol = isBrandLook ? brandSkin!.ringLightColor : "#ffffff";

  return (
    <div
      className={cn(!pageBg && (isWhite ? "bg-[#f4f4f2]" : "bg-ivory"))}
      style={pageBg ? { background: pageBg, color: textCol } : undefined}
    >
      {/* Studio hero band */}
      <div
        className="relative overflow-hidden border-b border-line"
        style={
          isBrandLook
            ? { borderColor: `${textCol}18`, background: brandSkin!.panelColor }
            : undefined
        }
      >
        <div className="absolute inset-0 opacity-30">
          <Image src="/images/studio-white.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="relative mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2">
                {skinned && brandSkin?.logoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={brandSkin.logoUrl}
                    alt=""
                    className="h-6 w-6 object-contain"
                  />
                )}
                <p
                  className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted"
                  style={accentCol ? { color: accentCol } : undefined}
                >
                  {skinned
                    ? brandSkin!.watermark || brandName || "Brand studio"
                    : t("studio.mirrorBadge")}
                </p>
              </div>
              <h1
                className="mt-2 font-display text-4xl tracking-tight md:text-6xl"
                style={textCol ? { color: textCol } : undefined}
              >
                {skinned ? brandSkin!.studioName : t("studio.mirrorTitle")}
              </h1>
              <p
                className="mt-3 text-sm text-muted md:text-base"
                style={textCol ? { color: textCol, opacity: 0.75 } : undefined}
              >
                {skinned
                  ? brandSkin!.subheadline || brandSkin!.headline
                  : t("studio.mirrorSub")}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/tutorials" className="btn-ghost !py-2.5 text-[10px]">
                <PlayCircle size={14} /> {t("nav.tutorials")}
              </Link>
              {!skinned && (
                <Link href="/platform" className="btn-primary !py-2.5 text-[10px]">
                  {t("nav.platform")}
                </Link>
              )}
              {skinned && brandSkin?.showPoweredBy && (
                <Link
                  href="/platform"
                  className="border px-4 py-2.5 text-[10px] uppercase tracking-[0.14em]"
                  style={{ borderColor: `${accentCol}66`, color: accentCol }}
                >
                  Powered by LUMÉA
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Mirror stage */}
          <div>
            {/* Studio look toggle */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {skinned && (
                <button
                  onClick={() => setStudioLook("brand")}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.14em]",
                    isBrandLook ? "text-white" : "border border-line"
                  )}
                  style={
                    isBrandLook
                      ? { background: btnCol, color: btnText }
                      : undefined
                  }
                >
                  Brand vanity
                </button>
              )}
              <button
                onClick={() => setStudioLook("mirror-white")}
                className={cn(
                  "inline-flex items-center gap-1.5 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.14em]",
                  studioLook === "mirror-white"
                    ? "bg-ink text-ivory"
                    : "border border-line"
                )}
              >
                <Lightbulb size={12} /> {t("studio.lookWhite")}
              </button>
              <button
                onClick={() => setStudioLook("soft-luxe")}
                className={cn(
                  "inline-flex items-center gap-1.5 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.14em]",
                  studioLook === "soft-luxe"
                    ? "bg-ink text-ivory"
                    : "border border-line"
                )}
              >
                {t("studio.lookSoft")}
              </button>
            </div>

            {/* Studio frame */}
            <div
              className={cn(
                "relative overflow-hidden",
                isWhite || isBrandLook
                  ? "p-3 shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_25px_80px_-20px_rgba(0,0,0,0.15)] md:p-5"
                  : "p-1"
              )}
              style={{ background: frameBg }}
            >
              {/* Ring light ornament */}
              {(isWhite || isBrandLook) && (
                <div
                  className="pointer-events-none absolute left-1/2 top-2 z-10 h-1 w-24 -translate-x-1/2 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${ringCol}, transparent)`,
                    boxShadow: `0 0 20px 8px ${ringCol}cc`,
                  }}
                />
              )}
              <div className="relative aspect-[3/4] overflow-hidden bg-[#eee] md:aspect-[4/5]">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {!hasMedia && (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center"
                    style={{
                      background: isBrandLook ? brandSkin!.panelColor : "#fff",
                      color: textCol,
                    }}
                  >
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-full border"
                      style={{
                        borderColor: `${accentCol || "#c4a574"}55`,
                        background: isBrandLook
                          ? brandSkin!.frameColor
                          : "#faf7f2",
                      }}
                    >
                      <Sparkles
                        size={26}
                        style={{ color: accentCol || "#c4a574" }}
                      />
                    </div>
                    <p className="font-display text-2xl md:text-3xl">
                      {skinned
                        ? brandSkin!.headline || t("studio.mirrorReady")
                        : t("studio.mirrorReady")}
                    </p>
                    <p
                      className="max-w-xs text-xs text-muted"
                      style={textCol ? { color: textCol, opacity: 0.7 } : undefined}
                    >
                      {skinned
                        ? brandSkin!.subheadline || t("studio.mirrorHint")
                        : t("studio.mirrorHint")}
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <button
                        onClick={() => startCam(true)}
                        className="btn-primary"
                        style={
                          isBrandLook
                            ? {
                                background: btnCol,
                                color: btnText,
                                borderColor: btnCol,
                              }
                            : undefined
                        }
                      >
                        <Camera size={14} /> {t("studio.startMirror")}
                      </button>
                      <button
                        onClick={() => fileRef.current?.click()}
                        className="btn-ghost"
                      >
                        <Upload size={14} /> {t("studio.browse")}
                      </button>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
                  {!camOn ? (
                    <button
                      onClick={() => startCam(true)}
                      className="bg-white/95 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em] shadow-sm backdrop-blur"
                    >
                      <Camera size={12} className="mr-1 inline" />
                      {t("studio.startMirror")}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={stopCam}
                        className="bg-white/95 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em] shadow-sm"
                      >
                        {t("studio.stopCam")}
                      </button>
                      <button
                        onClick={() => startCam(!facingUser)}
                        className="bg-white/95 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em] shadow-sm"
                      >
                        <FlipHorizontal2 size={12} className="mr-1 inline" />
                        {t("studio.flip")}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="bg-white/95 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em] shadow-sm"
                  >
                    <ImagePlus size={12} className="mr-1 inline" />
                    {t("studio.upload")}
                  </button>
                  {hasMedia && (
                    <button
                      onClick={analyzeSkin}
                      disabled={analyzing}
                      className="bg-ink px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-ivory"
                    >
                      {analyzing ? t("studio.analyzing") : t("studio.analyze")}
                    </button>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onFile(f);
                  }}
                />
              </div>
              {matchNote && (
                <p className="mt-3 border border-champagne/40 bg-champagne/15 px-3 py-2 text-center text-xs text-ink">
                  {matchNote}
                </p>
              )}
              {(isWhite || isBrandLook) && (
                <p
                  className="mt-3 text-center text-[10px] uppercase tracking-[0.2em] text-muted"
                  style={accentCol ? { color: accentCol } : undefined}
                >
                  {skinned
                    ? `${brandSkin!.watermark || brandName} · front-facing`
                    : t("studio.vanityLabel")}
                </p>
              )}
            </div>
            {camError && <p className="mt-2 text-xs text-danger">{camError}</p>}
            <p className="mt-3 text-[11px] text-muted">{t("studio.privacy")}</p>
          </div>

          {/* Controls */}
          <div className="space-y-7">
            <section>
              <p className="label">{t("studio.product")}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["foundation", "contour", "bronzer", "lips"] as Category[]).map(
                  (c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setCategory(c);
                        const first = SHADES.find((s) => s.kind === c);
                        if (first) setSelected(first);
                      }}
                      className={cn(
                        "border px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em]",
                        category === c
                          ? "border-ink bg-ink text-ivory"
                          : "border-line hover:border-ink"
                      )}
                    >
                      {c === "contour"
                        ? t("studio.category.contour")
                        : t(`studio.category.${c}` as "studio.category.foundation")}
                    </button>
                  )
                )}
              </div>
            </section>

            <section>
              <p className="label">{t("studio.skinType")}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {SKIN_TYPES.map((st) => (
                  <button
                    key={st}
                    onClick={() => setSkinProfile({ skinType: st })}
                    className={cn(
                      "border px-2.5 py-1 text-[10px] uppercase tracking-[0.1em]",
                      skinType === st ? "border-ink bg-ink text-ivory" : "border-line"
                    )}
                  >
                    {t(`studio.type.${st}` as "studio.type.normal")}
                  </button>
                ))}
              </div>
            </section>

            <section className="grid grid-cols-2 gap-4">
              <div>
                <p className="label">{t("studio.undertone")}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {UNDERTONES.map((u) => (
                    <button
                      key={u}
                      onClick={() => setSkinProfile({ undertone: u })}
                      className={cn(
                        "border px-2 py-1 text-[10px] uppercase",
                        undertone === u ? "border-ink bg-ink text-ivory" : "border-line"
                      )}
                    >
                      {t(`studio.under.${u}` as "studio.under.cool")}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="label">{t("studio.skinTone")}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {DEPTHS.map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        setSkinProfile({ skinDepth: d });
                        setSampledDepth(null);
                      }}
                      className={cn(
                        "border px-2 py-1 text-[10px] uppercase",
                        skinDepth === d ? "border-ink bg-ink text-ivory" : "border-line"
                      )}
                    >
                      {t(`studio.depth.${d}` as "studio.depth.fair")}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div>
                <div className="flex justify-between">
                  <p className="label !mb-0">{t("studio.intensity")}</p>
                  <span className="text-xs tabular-nums text-muted">
                    {Math.round(intensity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0.1}
                  max={0.9}
                  step={0.01}
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="mt-2 w-full accent-ink"
                />
              </div>
              <div>
                <div className="flex justify-between">
                  <p className="label !mb-0">{t("studio.light")}</p>
                  <span className="text-xs tabular-nums text-muted">
                    {Math.round(brightness * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0.85}
                  max={1.35}
                  step={0.01}
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="mt-2 w-full accent-ink"
                />
              </div>
            </section>

            <section>
              <p className="label">{t("studio.match")}</p>
              <div className="mt-3 max-h-56 space-y-2 overflow-y-auto">
                {matches.map(({ shade, score }) => (
                  <button
                    key={shade.id}
                    onClick={() => setSelected(shade)}
                    className={cn(
                      "flex w-full items-center gap-3 border px-3 py-2.5 text-left",
                      selected.id === shade.id
                        ? "border-ink bg-white"
                        : "border-line hover:border-ink"
                    )}
                  >
                    <span
                      className="h-8 w-8 shrink-0 rounded-full border border-line"
                      style={{ background: shade.hex }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{shade.name}</p>
                      <p className="text-xs text-muted">{shade.productName}</p>
                    </div>
                    <span className="text-xs font-medium text-champagne">
                      {t("studio.score", { n: score })}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <div className="flex flex-wrap gap-2 border-t border-line pt-5">
              <button onClick={addMatched} className="btn-primary flex-1">
                {t("studio.addMatched")} · {formatPrice(selected.price)}
              </button>
              <Link href={`/product/${selected.slug}`} className="btn-ghost">
                {t("product.tryOn")}
              </Link>
            </div>

            <div className="border border-line bg-white p-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                {t("studio.toolsCta")}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href="/shop?category=tools"
                  className="border border-line px-3 py-2 text-xs hover:border-ink"
                >
                  {t("nav.tools")}
                </Link>
                <Link
                  href="/product/atelier-essential-brush-set"
                  className="border border-line px-3 py-2 text-xs hover:border-ink"
                >
                  Brush set
                </Link>
                <Link
                  href="/tutorials"
                  className="border border-line px-3 py-2 text-xs hover:border-ink"
                >
                  Contour tutorials
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
