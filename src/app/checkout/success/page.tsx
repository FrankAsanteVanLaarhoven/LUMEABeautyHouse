"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Sparkles } from "lucide-react";
import { useCart } from "@/store/cart";
import { useBrowse } from "@/store/browse";

function SuccessInner() {
  const params = useSearchParams();
  const sessionId = params.get("session_id") || "";
  const clear = useCart((s) => s.clear);
  const addLoyalty = useBrowse((s) => s.addLoyalty);
  const [orderNum, setOrderNum] = useState("");
  const [status, setStatus] = useState<"loading" | "ok" | "soft">("loading");

  useEffect(() => {
    clear();
    if (!sessionId) {
      setStatus("soft");
      return;
    }
    fetch("/api/checkout/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then(async (r) => {
        const d = await r.json();
        if (d.order?.orderNumber) {
          setOrderNum(d.order.orderNumber);
          addLoyalty(Math.round(d.order.total || 50), "Stripe order");
        }
        setStatus("ok");
      })
      .catch(() => setStatus("soft"));
  }, [sessionId, clear, addLoyalty]);

  return (
    <div className="mx-auto max-w-lg px-5 py-20 text-center md:py-28">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ok/15 text-ok">
        <CheckCircle2 size={32} />
      </div>
      <p className="mt-6 text-[10px] font-medium uppercase tracking-[0.24em] text-champagne">
        Payment confirmed
      </p>
      <h1 className="mt-3 font-display text-4xl md:text-5xl">
        You&apos;re glowing
      </h1>
      <p className="mt-4 text-sm text-muted">
        {status === "loading"
          ? "Confirming your order with Stripe…"
          : orderNum
            ? `Order ${orderNum} is paid and queued for fulfillment. A receipt is on its way.`
            : "Your Stripe payment went through. If you don't see an order number yet, check your email — webhooks may still be catching up."}
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href={orderNum ? `/account?order=${orderNum}` : "/account"} className="btn-primary">
          View account
        </Link>
        <Link href="/studio" className="btn-ghost">
          <Sparkles size={14} /> Mirror Studio
        </Link>
        <Link href="/shop" className="btn-ghost">
          Keep shopping
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="p-24 text-center text-muted">Confirming payment…</div>
      }
    >
      <SuccessInner />
    </Suspense>
  );
}
