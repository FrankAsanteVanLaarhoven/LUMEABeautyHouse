"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { useCart } from "@/store/cart";
import { useProfile } from "@/store/profile";
import { useT } from "@/lib/i18n/useT";

function CheckoutInner() {
  const { t, formatPrice } = useT();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, subtotal, discount, promoCode, setPromo, clear } = useCart();
  const profile = useProfile((s) => s.profile);
  const spendWallet = useProfile((s) => s.spendWallet);
  const [promoInput, setPromoInput] = useState(promoCode || "");
  const [promoError, setPromoError] = useState("");
  const [loading, setLoading] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [error, setError] = useState("");
  const [payWithWallet, setPayWithWallet] = useState(false);
  const [stripeOn, setStripeOn] = useState(false);
  const [paypalOn, setPaypalOn] = useState(true);
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [method, setMethod] = useState<"card" | "paypal" | "wallet">("paypal");

  useEffect(() => {
    fetch("/api/stripe/status")
      .then((r) => r.json())
      .then((d) => setStripeOn(Boolean(d.enabled)))
      .catch(() => {});
    fetch("/api/checkout/paypal")
      .then((r) => r.json())
      .then((d) => setPaypalOn(d.enabled !== false))
      .catch(() => setPaypalOn(true));
    if (searchParams.get("cancelled") === "1") {
      setError("Stripe payment cancelled — your bag is still here.");
    }
    if (searchParams.get("cancelled") === "paypal") {
      setError("PayPal checkout cancelled — your bag is still here.");
    }
  }, [searchParams]);

  const sub = subtotal();
  const afterDiscount = Math.max(0, sub - discount);
  const shipping = afterDiscount >= 75 ? 0 : 8;
  const tax = Math.round(afterDiscount * 0.08 * 100) / 100;
  const total = Math.round((afterDiscount + shipping + tax) * 100) / 100;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-5 py-28 text-center">
        <h1 className="font-display text-4xl">{t("checkout.nothing")}</h1>
        <Link href="/shop" className="btn-primary mt-8 inline-flex">
          {t("home.ctaShop")}
        </Link>
      </div>
    );
  }

  async function applyPromo() {
    setPromoError("");
    const res = await fetch("/api/promo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: promoInput, subtotal: sub }),
    });
    const data = await res.json();
    if (!res.ok) {
      setPromoError(data.error || "Invalid code");
      setPromo(null, 0);
      return;
    }
    setPromo(data.code, data.discount);
  }

  function shippingFromForm(fd: FormData) {
    return {
      firstName: String(fd.get("firstName")),
      lastName: String(fd.get("lastName")),
      line1: String(fd.get("line1")),
      line2: String(fd.get("line2") || ""),
      city: String(fd.get("city")),
      state: String(fd.get("state")),
      postalCode: String(fd.get("postalCode")),
      country: String(fd.get("country") || "US"),
      phone: String(fd.get("phone") || ""),
    };
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (method === "paypal") {
      await payWithPaypal(e.currentTarget);
      return;
    }
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const shippingAddress = shippingFromForm(fd);

    try {
      if (method === "wallet" || payWithWallet) {
        const ok = spendWallet(total, `Order checkout`);
        if (!ok) throw new Error(t("wallet.insufficient"));
      }
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fd.get("email") || profile?.email,
          shippingAddress,
          promoCode: promoCode || undefined,
          notes: fd.get("notes"),
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            name: i.name,
            variantName: i.variantName,
            sku: i.sku,
            quantity: i.quantity,
            unitPrice: i.price,
            image: i.image,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      clear();
      router.push(`/account?order=${data.order.orderNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  async function payWithPaypal(form: HTMLFormElement) {
    setPaypalLoading(true);
    setError("");
    const fd = new FormData(form);
    const email = String(fd.get("email") || profile?.email || "");
    if (!email) {
      setError("Email is required for PayPal checkout");
      setPaypalLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/checkout/paypal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          shippingAddress: shippingFromForm(fd),
          promoCode: promoCode || undefined,
          notes: fd.get("notes"),
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            name: i.name,
            variantName: i.variantName,
            sku: i.sku,
            quantity: i.quantity,
            unitPrice: i.price,
            image: i.image,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "PayPal checkout failed");
      if (data.url) {
        // Cart cleared after PayPal return on success page
        window.location.href = data.url;
        return;
      }
      throw new Error("No PayPal URL returned");
    } catch (err) {
      setError(err instanceof Error ? err.message : "PayPal failed");
    } finally {
      setPaypalLoading(false);
    }
  }

  async function payWithStripe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStripeLoading(true);
    setError("");
    const form = e.currentTarget.closest("form") || document.querySelector("form");
    if (!form) {
      setError("Form not ready");
      setStripeLoading(false);
      return;
    }
    const fd = new FormData(form as HTMLFormElement);
    const email = String(fd.get("email") || profile?.email || "");
    if (!email) {
      setError("Email is required for Stripe Checkout");
      setStripeLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          shippingAddress: shippingFromForm(fd),
          promoCode: promoCode || undefined,
          notes: fd.get("notes"),
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            name: i.name,
            variantName: i.variantName,
            sku: i.sku,
            quantity: i.quantity,
            unitPrice: i.price,
            image: i.image,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.message || data.error || "Stripe Checkout unavailable"
        );
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("No Stripe URL returned");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Stripe failed");
    } finally {
      setStripeLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-12 md:px-8 md:py-16">
      <h1 className="font-display text-5xl tracking-tight">{t("checkout.title")}</h1>
      <p className="mt-2 text-sm text-muted">
        {t("checkout.sub")}
      </p>

      <form onSubmit={onSubmit} className="mt-12 grid gap-12 lg:grid-cols-[1fr_380px]">
        <div className="space-y-10">
          <section>
            <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
              {t("checkout.contact")}
            </h2>
            <div className="mt-4 grid gap-4">
              <div>
                <label className="label">{t("checkout.email")}</label>
                <input name="email" type="email" required className="field" placeholder="you@email.com" defaultValue={profile?.email || ""} />
              </div>
              <div>
                <label className="label">{t("checkout.phone")}</label>
                <input name="phone" type="tel" className="field" placeholder="+1 ..." defaultValue={profile?.phone || ""} />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
              {t("checkout.shipping")}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">{t("checkout.firstName")}</label>
                <input name="firstName" required className="field" defaultValue={profile?.firstName || ""} />
              </div>
              <div>
                <label className="label">{t("checkout.lastName")}</label>
                <input name="lastName" required className="field" defaultValue={profile?.lastName || ""} />
              </div>
              <div className="sm:col-span-2">
                <label className="label">{t("checkout.address")}</label>
                <input name="line1" required className="field" placeholder="Street address" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">{t("checkout.apt")}</label>
                <input name="line2" className="field" />
              </div>
              <div>
                <label className="label">{t("checkout.city")}</label>
                <input name="city" required className="field" />
              </div>
              <div>
                <label className="label">{t("checkout.state")}</label>
                <input name="state" required className="field" />
              </div>
              <div>
                <label className="label">{t("checkout.postal")}</label>
                <input name="postalCode" required className="field" />
              </div>
              <div>
                <label className="label">{t("checkout.country")}</label>
                <select name="country" className="field" defaultValue="US">
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
              {t("checkout.payment")}
            </h2>
            <div className="mt-4 grid gap-4">
              <div>
                <label className="label">{t("checkout.card")}</label>
                <input className="field" placeholder="4242 4242 4242 4242" defaultValue="4242 4242 4242 4242" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">{t("checkout.expiry")}</label>
                  <input className="field" placeholder="12/28" defaultValue="12/28" />
                </div>
                <div>
                  <label className="label">{t("checkout.cvc")}</label>
                  <input className="field" placeholder="123" defaultValue="123" />
                </div>
              </div>
              <div>
                <label className="label">{t("checkout.notes")}</label>
                <textarea name="notes" className="field min-h-[80px]" placeholder={t("checkout.notesPh")} />
              </div>
            </div>
          </section>
        </div>

        <aside className="h-fit border border-line bg-surface p-6 lg:sticky lg:top-28">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
            {t("checkout.order")}
          </h2>
          <ul className="mt-5 max-h-64 space-y-4 overflow-y-auto">
            {items.map((i) => (
              <li key={i.variantId} className="flex gap-3">
                <div className="relative h-16 w-12 shrink-0 overflow-hidden bg-ivory-deep">
                  <Image src={i.image} alt="" fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1 text-sm">
                  <p className="truncate font-medium">{i.name}</p>
                  <p className="text-xs text-muted">
                    {i.variantName} × {i.quantity}
                  </p>
                </div>
                <p className="text-sm">{formatPrice(i.price * i.quantity)}</p>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex gap-2">
            <input
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              placeholder={t("checkout.promo")}
              className="field !py-2.5"
            />
            <button type="button" onClick={applyPromo} className="btn-ghost !px-4 !py-2.5 shrink-0">
              Apply
            </button>
          </div>
          {promoError && <p className="mt-2 text-xs text-danger">{promoError}</p>}
          {promoCode && (
            <p className="mt-2 text-xs text-ok">{t("checkout.applied", { code: promoCode })}</p>
          )}

          <div className="mt-6 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">{t("cart.subtotal")}</span>
              <span>{formatPrice(sub)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-ok">
                <span>{t("cart.discount")}</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted">{t("checkout.shipping")}</span>
              <span>{shipping === 0 ? t("checkout.free") : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">{t("checkout.tax")}</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between border-t border-line pt-3 font-medium">
              <span>{t("cart.total")}</span>
              <span className="font-display text-2xl">{formatPrice(total)}</span>
            </div>
          </div>

          <div className="mt-6 border-t border-line pt-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
              {t("checkout.method")}
            </p>
            <div className="mt-3 space-y-2">
              {paypalOn && (
                <label className="flex cursor-pointer items-center gap-3 border border-line bg-surface p-3 text-sm has-[:checked]:border-ink">
                  <input
                    type="radio"
                    name="payMethod"
                    checked={method === "paypal"}
                    onChange={() => {
                      setMethod("paypal");
                      setPayWithWallet(false);
                    }}
                  />
                  <span className="flex-1 font-medium">PayPal</span>
                  <span className="text-[10px] uppercase tracking-[0.1em] text-[#0070ba]">
                    frankleroyvan@gmail.com
                  </span>
                </label>
              )}
              <label className="flex cursor-pointer items-center gap-3 border border-line bg-surface p-3 text-sm has-[:checked]:border-ink">
                <input
                  type="radio"
                  name="payMethod"
                  checked={method === "card"}
                  onChange={() => {
                    setMethod("card");
                    setPayWithWallet(false);
                  }}
                />
                <span className="font-medium">
                  {stripeOn ? "Card · Stripe" : "Card · place order"}
                </span>
              </label>
              {profile && (
                <label
                  className={`flex cursor-pointer items-center gap-3 border border-line bg-surface p-3 text-sm has-[:checked]:border-ink ${
                    profile.walletBalance < total ? "opacity-50" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payMethod"
                    checked={method === "wallet"}
                    disabled={profile.walletBalance < total}
                    onChange={() => {
                      setMethod("wallet");
                      setPayWithWallet(true);
                    }}
                  />
                  <span>
                    {t("wallet.payWith")} ({formatPrice(profile.walletBalance)})
                  </span>
                </label>
              )}
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-danger">{error}</p>}

          {method === "paypal" && (
            <button
              type="submit"
              disabled={paypalLoading || loading}
              className="mt-6 w-full bg-[#0070ba] px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.16em] text-white transition hover:bg-[#005ea6] disabled:opacity-50"
            >
              {paypalLoading
                ? t("checkout.paypalRedirect")
                : `${t("checkout.payPaypal")} · ${formatPrice(total)}`}
            </button>
          )}

          {method === "card" && stripeOn && (
            <button
              type="button"
              disabled={stripeLoading || loading}
              onClick={(ev) => {
                const form = (ev.target as HTMLElement).closest("form");
                if (form) {
                  payWithStripe({
                    preventDefault: () => {},
                    currentTarget: form,
                  } as unknown as FormEvent<HTMLFormElement>);
                }
              }}
              className="mt-6 w-full bg-[#635bff] px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.16em] text-white disabled:opacity-50"
            >
              {stripeLoading
                ? "Redirecting to Stripe…"
                : `Pay ${formatPrice(total)} with Stripe`}
            </button>
          )}

          {(method === "card" && !stripeOn) || method === "wallet" ? (
            <button
              type="submit"
              disabled={loading || stripeLoading || paypalLoading}
              className="btn-primary mt-3 w-full"
            >
              {loading
                ? t("checkout.placing")
                : t("checkout.pay", { amount: formatPrice(total) })}
            </button>
          ) : null}

          {method === "card" && stripeOn && (
            <button
              type="submit"
              disabled={loading || stripeLoading}
              className="btn-ghost mt-2 w-full"
            >
              Place order without Stripe
            </button>
          )}

          <p className="mt-3 text-center text-[10px] text-muted">
            PayPal merchant · frankleroyvan@gmail.com
            {stripeOn ? " · Stripe cards available" : ""}
          </p>
          <p className="mt-2 text-center text-[10px] text-muted">
            Codes LUME15 · LUME25 · WELCOME10 · NYMA15 · COILS20
          </p>
        </aside>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={<div className="p-16 text-center text-muted">Loading checkout…</div>}
    >
      <CheckoutInner />
    </Suspense>
  );
}
