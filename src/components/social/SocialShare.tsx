"use client";

import { useState } from "react";
import { Check, Copy, Heart, Share2 } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/i18n/config";
import { usePrefs } from "@/store/prefs";
import { useT } from "@/lib/i18n/useT";
import { cn } from "@/lib/utils";

export function SocialShare({
  url,
  title,
  productId,
  compact,
}: {
  url?: string;
  title: string;
  productId?: string;
  compact?: boolean;
}) {
  const { t } = useT();
  const likedProducts = usePrefs((s) => s.likedProducts);
  const toggleLike = usePrefs((s) => s.toggleLike);
  const following = usePrefs((s) => s.following);
  const setFollowing = usePrefs((s) => s.setFollowing);
  const [copied, setCopied] = useState(false);

  const shareUrl =
    url || (typeof window !== "undefined" ? window.location.href : "https://lumea.beauty");
  const liked = productId ? likedProducts.includes(productId) : false;

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  function shareNative() {
    if (navigator.share) {
      navigator.share({ title, url: shareUrl, text: title }).catch(() => {});
    }
  }

  const encoded = encodeURIComponent(shareUrl);
  const text = encodeURIComponent(title);

  const networks = [
    {
      id: "x",
      label: t("social.x"),
      href: `https://twitter.com/intent/tweet?url=${encoded}&text=${text}`,
    },
    {
      id: "facebook",
      label: t("social.facebook"),
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
    },
    {
      id: "pinterest",
      label: t("social.pinterest"),
      href: `https://pinterest.com/pin/create/button/?url=${encoded}&description=${text}`,
    },
    {
      id: "whatsapp",
      label: t("social.whatsapp"),
      href: `https://wa.me/?text=${text}%20${encoded}`,
    },
    {
      id: "email",
      label: t("social.email"),
      href: `mailto:?subject=${text}&body=${encoded}`,
    },
  ];

  return (
    <div className={cn("space-y-4", compact && "space-y-2")}>
      <div className="flex flex-wrap items-center gap-2">
        {productId && (
          <button
            onClick={() => toggleLike(productId)}
            className={cn(
              "inline-flex items-center gap-1.5 border px-3 py-2 text-[10px] font-medium uppercase tracking-[0.14em] transition",
              liked
                ? "border-rose bg-blush/40 text-ink"
                : "border-line hover:border-ink"
            )}
          >
            <Heart
              size={12}
              className={liked ? "fill-rose text-rose" : ""}
              strokeWidth={1.5}
            />
            {liked ? t("social.liked") : t("social.like")}
          </button>
        )}
        <button
          onClick={() => setFollowing(!following)}
          className={cn(
            "inline-flex items-center gap-1.5 border px-3 py-2 text-[10px] font-medium uppercase tracking-[0.14em] transition",
            following
              ? "border-ink bg-ink text-ivory"
              : "border-line hover:border-ink"
          )}
        >
          {following ? t("social.following") : t("social.follow")}
        </button>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 border border-line px-3 py-2 text-[10px] font-medium uppercase tracking-[0.14em] hover:border-ink"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? t("social.copied") : t("social.copyLink")}
        </button>
        {"share" in navigator && (
          <button
            onClick={shareNative}
            className="inline-flex items-center gap-1.5 border border-line px-3 py-2 text-[10px] font-medium uppercase tracking-[0.14em] hover:border-ink"
          >
            <Share2 size={12} />
            {t("product.share")}
          </button>
        )}
      </div>

      <div>
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
          {t("social.shareProduct")}
        </p>
        <div className="flex flex-wrap gap-2">
          {networks.map((n) => (
            <a
              key={n.id}
              href={n.href}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-line px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-ink-soft transition hover:border-ink hover:text-ink"
            >
              {n.label}
            </a>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
          {t("footer.follow")}
        </p>
        <div className="flex flex-wrap gap-3 text-xs text-ink-soft">
          {Object.entries(SOCIAL_LINKS).map(([key, href]) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-sand underline-offset-4 transition hover:text-ink hover:decoration-ink capitalize"
            >
              {key}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SocialFooterStrip() {
  const { t } = useT();
  return (
    <div className="flex flex-wrap items-center gap-4">
      {Object.entries(SOCIAL_LINKS).map(([key, href]) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs capitalize text-ink-soft transition hover:text-ink"
        >
          {key}
        </a>
      ))}
      <span className="text-[10px] uppercase tracking-[0.14em] text-muted">
        {t("footer.follow")}
      </span>
    </div>
  );
}
