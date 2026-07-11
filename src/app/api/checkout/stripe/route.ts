import { NextRequest, NextResponse } from "next/server";
import { getPromo, getSettings } from "@/lib/db";
import { appUrl, getStripe, isStripeEnabled } from "@/lib/stripe";
import type { Address, OrderLineItem } from "@/lib/types";
import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";

const PENDING = path.join(process.cwd(), "data", "stripe-pending.json");

interface PendingCheckout {
  id: string;
  sessionId?: string;
  email: string;
  items: OrderLineItem[];
  shippingAddress: Address;
  promoCode?: string;
  notes?: string;
  createdAt: string;
}

async function savePending(p: PendingCheckout) {
  await fs.mkdir(path.dirname(PENDING), { recursive: true });
  let list: PendingCheckout[] = [];
  try {
    list = JSON.parse(await fs.readFile(PENDING, "utf8"));
  } catch {
    list = [];
  }
  list.unshift(p);
  list = list.slice(0, 100);
  await fs.writeFile(PENDING, JSON.stringify(list, null, 2));
}

export async function getPendingBySession(sessionId: string) {
  try {
    const list: PendingCheckout[] = JSON.parse(
      await fs.readFile(PENDING, "utf8")
    );
    return list.find((p) => p.sessionId === sessionId) || null;
  } catch {
    return null;
  }
}

export async function attachSession(id: string, sessionId: string) {
  try {
    const list: PendingCheckout[] = JSON.parse(
      await fs.readFile(PENDING, "utf8")
    );
    const idx = list.findIndex((p) => p.id === id);
    if (idx >= 0) {
      list[idx].sessionId = sessionId;
      await fs.writeFile(PENDING, JSON.stringify(list, null, 2));
    }
  } catch {
    /* ignore */
  }
}

export async function POST(req: NextRequest) {
  if (!isStripeEnabled()) {
    return NextResponse.json(
      {
        error: "Stripe not configured",
        demo: true,
        message: "Set STRIPE_SECRET_KEY to enable Stripe Checkout",
      },
      { status: 503 }
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe unavailable" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const items = body.items as OrderLineItem[];
    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
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

    const pendingId = nanoid(12);
    const email = String(body.email || "").trim();
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    await savePending({
      id: pendingId,
      email,
      items,
      shippingAddress: body.shippingAddress,
      promoCode,
      notes: body.notes,
      createdAt: new Date().toISOString(),
    });

    const line_items: {
      quantity: number;
      price_data: {
        currency: string;
        unit_amount: number;
        product_data: {
          name: string;
          description?: string;
          images?: string[];
        };
      };
    }[] = items.map((i) => {
      const images =
        i.image?.startsWith("http")
          ? [i.image]
          : i.image
            ? [`${appUrl()}${i.image}`]
            : undefined;
      return {
        quantity: i.quantity,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(i.unitPrice * 100),
          product_data: {
            name: i.name,
            ...(i.variantName ? { description: i.variantName } : {}),
            ...(images ? { images } : {}),
          },
        },
      };
    });

    if (shipping > 0) {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(shipping * 100),
          product_data: { name: "Shipping" },
        },
      });
    }
    if (tax > 0) {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(tax * 100),
          product_data: { name: "Estimated tax" },
        },
      });
    }

    let discounts: { coupon: string }[] | undefined;
    if (discount > 0) {
      const coupon = await stripe.coupons.create({
        amount_off: Math.round(discount * 100),
        currency: "usd",
        duration: "once",
        name: promoCode || "LUMÉA discount",
      });
      discounts = [{ coupon: coupon.id }];
    }

    const base = appUrl();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items,
      discounts,
      success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/checkout?cancelled=1`,
      metadata: {
        pendingId,
        promoCode: promoCode || "",
        type: "consumer",
      },
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU", "NL", "DE", "FR"],
      },
    });

    await attachSession(pendingId, session.id);

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      pendingId,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Stripe checkout failed" },
      { status: 500 }
    );
  }
}
