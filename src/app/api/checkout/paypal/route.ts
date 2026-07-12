import { NextRequest, NextResponse } from "next/server";
import { createOrder, getPromo, getSettings } from "@/lib/db";
import {
  buildPaypalRedirectUrlWithHost,
  isPaypalEnabled,
  paypalBusinessEmail,
} from "@/lib/paypal";
import { appUrl } from "@/lib/stripe";
import type { Address, OrderLineItem } from "@/lib/types";

export async function GET() {
  return NextResponse.json({
    enabled: isPaypalEnabled(),
    business: paypalBusinessEmail().replace(
      /(.{2}).+(@.+)/,
      "$1***$2"
    ),
  });
}

export async function POST(req: NextRequest) {
  if (!isPaypalEnabled()) {
    return NextResponse.json(
      { error: "PayPal is not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const items = body.items as OrderLineItem[];
    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const email = String(body.email || "").trim();
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const settings = await getSettings();
    const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

    let discount = 0;
    let promoCode: string | undefined;
    if (body.promoCode) {
      const promo = await getPromo(body.promoCode);
      if (promo) {
        if (!promo.minSubtotal || subtotal >= promo.minSubtotal) {
          discount =
            promo.type === "percent"
              ? (subtotal * promo.value) / 100
              : promo.value;
          promoCode = promo.code;
        }
      }
    }

    const afterDiscount = Math.max(0, subtotal - discount);
    const shipping =
      afterDiscount >= settings.freeShippingThreshold
        ? 0
        : settings.shippingFlatRate;
    const tax = Math.round(afterDiscount * settings.taxRate * 100) / 100;
    const total = Math.round((afterDiscount + shipping + tax) * 100) / 100;

    const shippingAddress = body.shippingAddress as Address;
    if (!shippingAddress?.line1 || !shippingAddress?.city) {
      return NextResponse.json(
        { error: "Shipping address required" },
        { status: 400 }
      );
    }

    // Create order as pending until PayPal completes
    const order = await createOrder({
      email,
      status: "pending",
      fulfillmentStatus: "unfulfilled",
      items,
      subtotal,
      shipping,
      tax,
      discount,
      total,
      currency: settings.currency || "USD",
      shippingAddress,
      billingAddress: body.billingAddress || shippingAddress,
      promoCode,
      notes: `PayPal · ${paypalBusinessEmail()} · ${body.notes || ""}`.trim(),
    });

    const base = appUrl(req.url);
    const paypalUrl = buildPaypalRedirectUrlWithHost({
      amount: total,
      itemName: `LUMÉA order ${order.orderNumber}`,
      invoice: order.orderNumber,
      returnUrl: `${base}/checkout/success?paypal=1&order=${encodeURIComponent(order.orderNumber)}`,
      cancelUrl: `${base}/checkout?cancelled=paypal&order=${encodeURIComponent(order.orderNumber)}`,
      custom: order.id,
      currency: "USD",
    });

    return NextResponse.json({
      url: paypalUrl,
      orderNumber: order.orderNumber,
      orderId: order.id,
      total,
      business: paypalBusinessEmail(),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "PayPal checkout failed" },
      { status: 500 }
    );
  }
}
