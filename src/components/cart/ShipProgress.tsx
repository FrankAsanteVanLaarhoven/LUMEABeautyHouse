"use client";

import { useCart } from "@/store/cart";
import { useT } from "@/lib/i18n/useT";
import {
  FREE_GIFT_THRESHOLD,
  FREE_SHIP_THRESHOLD,
} from "@/lib/bundles";

export function ShipProgress() {
  const { formatPrice } = useT();
  const sub = useCart((s) => s.subtotal());
  const shipLeft = Math.max(0, FREE_SHIP_THRESHOLD - sub);
  const giftLeft = Math.max(0, FREE_GIFT_THRESHOLD - sub);
  const shipPct = Math.min(100, (sub / FREE_SHIP_THRESHOLD) * 100);
  const giftPct = Math.min(100, (sub / FREE_GIFT_THRESHOLD) * 100);

  return (
    <div className="space-y-4 border-b border-line px-6 py-4">
      <div>
        <div className="mb-1.5 flex justify-between text-[11px]">
          <span className="font-medium uppercase tracking-[0.1em]">
            {shipLeft === 0 ? "Free shipping unlocked" : "Free shipping"}
          </span>
          <span className="text-muted">
            {shipLeft === 0
              ? "✓"
              : `${formatPrice(shipLeft)} away`}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-sand">
          <div
            className="h-full bg-ink transition-all duration-500"
            style={{ width: `${shipPct}%` }}
          />
        </div>
      </div>
      <div>
        <div className="mb-1.5 flex justify-between text-[11px]">
          <span className="font-medium uppercase tracking-[0.1em] text-champagne">
            {giftLeft === 0
              ? "Free sponge gift unlocked"
              : "Free gift · Cloud Bounce"}
          </span>
          <span className="text-muted">
            {giftLeft === 0 ? "✓" : `${formatPrice(giftLeft)} away`}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-sand">
          <div
            className="h-full bg-champagne transition-all duration-500"
            style={{ width: `${giftPct}%` }}
          />
        </div>
      </div>
      <p className="text-[10px] text-muted">
        Codes LUME15 ($50+) · LUME25 ($75+) · 1 Glow Point per $1
      </p>
    </div>
  );
}
