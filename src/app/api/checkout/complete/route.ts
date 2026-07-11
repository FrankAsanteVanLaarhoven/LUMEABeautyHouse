import { NextRequest, NextResponse } from "next/server";
import { getStripe, isStripeEnabled } from "@/lib/stripe";
import { createOrder, getSettings } from "@/lib/db";
import { sendEmail, templates } from "@/lib/email";
import { promises as fs } from "fs";
import path from "path";

const PENDING = path.join(process.cwd(), "data", "stripe-pending.json");

/** Client success page calls this to finalize order from session (when webhook delayed) */
export async function POST(req: NextRequest) {
  if (!isStripeEnabled()) {
    return NextResponse.json({ error: "Stripe off" }, { status: 503 });
  }
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "No stripe" }, { status: 503 });
  }

  const { sessionId } = await req.json();
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid" && session.status !== "complete") {
    return NextResponse.json({ error: "Payment not complete" }, { status: 400 });
  }

  let pending: {
    email: string;
    items: {
      productId: string;
      variantId: string;
      name: string;
      variantName: string;
      sku: string;
      quantity: number;
      unitPrice: number;
      image?: string;
    }[];
    shippingAddress: {
      firstName: string;
      lastName: string;
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      phone?: string;
    };
    promoCode?: string;
    sessionId?: string;
  } | null = null;

  try {
    const list = JSON.parse(await fs.readFile(PENDING, "utf8"));
    pending = list.find(
      (p: { sessionId?: string }) => p.sessionId === sessionId
    );
  } catch {
    pending = null;
  }

  if (!pending?.items?.length) {
    return NextResponse.json({
      ok: true,
      order: null,
      message: "Session paid — order may already be recorded via webhook",
      email: session.customer_email,
      amount: (session.amount_total || 0) / 100,
    });
  }

  const settings = await getSettings();
  const subtotal = pending.items.reduce(
    (s, i) => s + i.unitPrice * i.quantity,
    0
  );
  const total = (session.amount_total || 0) / 100;

  const order = await createOrder({
    email: pending.email || session.customer_email || "",
    status: "paid",
    fulfillmentStatus: "unfulfilled",
    items: pending.items,
    subtotal,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: total || subtotal,
    currency: settings.currency,
    shippingAddress: pending.shippingAddress,
    promoCode: pending.promoCode,
    notes: `Stripe ${sessionId}`,
  });

  const msg = templates().order({
    orderNumber: order.orderNumber,
    total: order.total,
    email: order.email,
  });
  await sendEmail({
    to: order.email,
    ...msg,
    template: "order",
    meta: { orderId: order.id, stripeSession: sessionId },
  });

  return NextResponse.json({ ok: true, order });
}
