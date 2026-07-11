import { NextRequest, NextResponse } from "next/server";
import { getStripe, isStripeEnabled } from "@/lib/stripe";
import { processBrandPayment } from "@/lib/brands";
import { createOrder, getSettings } from "@/lib/db";
import { sendEmail, templates } from "@/lib/email";
import type { BrandPlan } from "@/lib/types";
import { promises as fs } from "fs";
import path from "path";
import type Stripe from "stripe";

export const runtime = "nodejs";

const PENDING = path.join(process.cwd(), "data", "stripe-pending.json");

async function getPending(sessionId: string) {
  try {
    const list = JSON.parse(await fs.readFile(PENDING, "utf8")) as {
      id: string;
      sessionId?: string;
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
      notes?: string;
    }[];
    return list.find((p) => p.sessionId === sessionId) || null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  if (!isStripeEnabled()) {
    return NextResponse.json({ error: "Stripe off" }, { status: 503 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "No stripe" }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const raw = await req.text();

  let event: Stripe.Event;
  try {
    if (whSecret && sig) {
      event = stripe.webhooks.constructEvent(raw, sig, whSecret);
    } else {
      // Dev fallback without signature (never use in production)
      event = JSON.parse(raw) as Stripe.Event;
    }
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const type = session.metadata?.type;

      if (type === "saas") {
        const brandId = session.metadata?.brandId;
        const plan = session.metadata?.plan as BrandPlan;
        const interval =
          session.metadata?.interval === "yearly" ? "yearly" : "monthly";
        if (brandId && plan) {
          await processBrandPayment(brandId, {
            plan,
            interval,
            cardLast4: "stripe",
          });
        }
      }

      if (type === "consumer" || !type) {
        const pending = await getPending(session.id);
        if (pending?.items?.length) {
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
            shippingAddress: pending.shippingAddress || {
              firstName: "Stripe",
              lastName: "Customer",
              line1: "See Stripe",
              city: "—",
              state: "—",
              postalCode: "—",
              country: "US",
            },
            promoCode: pending.promoCode,
            notes: `Stripe session ${session.id}`,
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
            meta: { orderId: order.id, stripeSession: session.id },
          });
        }
      }
    }
  } catch (e) {
    console.error("webhook handler", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
