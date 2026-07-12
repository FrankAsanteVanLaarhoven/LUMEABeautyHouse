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
  const paypal = params.get("paypal") === "1";
  const orderParam = params.get("order") || "";
  const clear = useCart((s) => s.clear);
  const addLoyalty = useBrowse((s) => s.addLoyalty);
  const [orderNum, setOrderNum] = useState(orderParam);
  const [status, setStatus] = useState<"loading" | "ok" | "soft">("loading");
  const [provider, setProvider] = useState<"stripe" | "paypal" | "">("");

  useEffect(() => {
    clear();

    if (paypal && orderParam) {
      setProvider("paypal");
      fetch("/api/checkout/paypal/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber: orderParam }),
      })
        .then(async (r) => {
          const d = await r.json();
          if (d.order?.orderNumber) {
            setOrderNum(d.order.orderNumber);
            addLoyalty(Math.round(d.order.total || 50), "PayPal order");
          } else {
            setOrderNum(orderParam);
          }
          setStatus("ok");
        })
        .catch(() => {
          setOrderNum(orderParam);
          setStatus("soft");
        });
      return;
    }

    if (!sessionId) {
      if (orderParam) {
        setOrderNum(orderParam);
        setStatus("ok");
      } else {
        setStatus("soft");
      }
      return;
    }

    setProvider("stripe");
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
  }, [sessionId, paypal, orderParam, clear, addLoyalty]);

  const loadingMsg =
    provider === "paypal"
      ? "Confirming your PayPal payment…"
      : provider === "stripe"
        ? "Confirming your order with Stripe…"
        : "Confirming your order…";

  const bodyMsg =
    status === "loading"
      ? loadingMsg
      : orderNum
        ? `Order ${orderNum} is ${
            provider === "paypal" ? "paid via PayPal and " : ""
          }queued for fulfillment. A receipt is on its way.`
        : provider === "paypal"
          ? "Your PayPal payment completed. Check your email and account for order details."
          : "Your payment went through. If you don't see an order number yet, check your email.";

  return (
    <div className="mx-auto max-w-lg px-5 py-20 text-center md:py-28">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ok/15 text-ok">
        <CheckCircle2 size={32} />
      </div>
      <p className="mt-6 text-[10px] font-medium uppercase tracking-[0.24em] text-champagne">
        {provider === "paypal" ? "PayPal confirmed" : "Payment confirmed"}
      </p>
      <h1 className="mt-3 font-display text-4xl md:text-5xl">
        You&apos;re glowing
      </h1>
      <p className="mt-4 text-sm text-muted">{bodyMsg}</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          href={orderNum ? `/account?order=${orderNum}` : "/account"}
          className="btn-primary"
        >
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
