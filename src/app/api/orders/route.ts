import { NextRequest, NextResponse } from "next/server";
import {
  createOrder,
  getPromo,
  getSettings,
  listOrders,
} from "@/lib/db";
import type { Address, OrderLineItem } from "@/lib/types";

export async function GET() {
  const orders = await listOrders();
  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const settings = await getSettings();
    const items = body.items as OrderLineItem[];
    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const subtotal = items.reduce(
      (s, i) => s + i.unitPrice * i.quantity,
      0
    );

    let discount = 0;
    let promoCode: string | undefined;
    if (body.promoCode) {
      const promo = await getPromo(body.promoCode);
      if (!promo) {
        return NextResponse.json(
          { error: "Invalid promo code" },
          { status: 400 }
        );
      }
      if (promo.minSubtotal && subtotal < promo.minSubtotal) {
        return NextResponse.json(
          { error: `Minimum spend $${promo.minSubtotal}` },
          { status: 400 }
        );
      }
      discount =
        promo.type === "percent"
          ? (subtotal * promo.value) / 100
          : promo.value;
      promoCode = promo.code;
    }

    const afterDiscount = Math.max(0, subtotal - discount);
    const shipping =
      afterDiscount >= settings.freeShippingThreshold
        ? 0
        : settings.shippingFlatRate;
    const tax = Math.round(afterDiscount * settings.taxRate * 100) / 100;
    const total = Math.round((afterDiscount + shipping + tax) * 100) / 100;

    const shippingAddress = body.shippingAddress as Address;
    const order = await createOrder({
      email: body.email,
      status: "paid",
      fulfillmentStatus: "unfulfilled",
      items,
      subtotal,
      shipping,
      tax,
      discount,
      total,
      currency: settings.currency,
      shippingAddress,
      billingAddress: body.billingAddress || shippingAddress,
      promoCode,
      notes: body.notes,
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Checkout failed" },
      { status: 400 }
    );
  }
}
