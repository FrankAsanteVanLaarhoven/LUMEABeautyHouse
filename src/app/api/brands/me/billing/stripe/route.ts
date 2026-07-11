import { NextRequest, NextResponse } from "next/server";
import { requireBrand } from "@/lib/brand-auth";
import { PLAN_DEFS } from "@/lib/plans";
import type { BrandPlan } from "@/lib/types";
import {
  appUrl,
  getStripe,
  isStripeEnabled,
  saasPriceId,
  saasProductName,
  saasUnitAmount,
} from "@/lib/stripe";

function authError(e: unknown) {
  const msg = e instanceof Error ? e.message : "Failed";
  if (msg === "UNAUTHORIZED") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (msg === "FORBIDDEN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ error: msg }, { status: 400 });
}

export async function POST(req: NextRequest) {
  try {
    const ctx = await requireBrand({ permission: "billing:write" });

    if (!isStripeEnabled()) {
      return NextResponse.json(
        {
          error: "Stripe not configured",
          demo: true,
          fallback: "Use demo checkout on /brand/billing",
        },
        { status: 503 }
      );
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: "Stripe unavailable" }, { status: 503 });
    }

    const body = await req.json();
    const plan = String(body.plan || "") as BrandPlan;
    const interval = body.interval === "yearly" ? "yearly" : "monthly";
    if (!PLAN_DEFS[plan]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const priceId = saasPriceId(plan, interval);
    const lineItem = priceId
      ? { price: priceId, quantity: 1 }
      : {
          quantity: 1,
          price_data: {
            currency: "usd" as const,
            unit_amount: saasUnitAmount(plan, interval),
            recurring: {
              interval: (interval === "yearly" ? "year" : "month") as
                | "year"
                | "month",
            },
            product_data: {
              name: saasProductName(plan),
              description: PLAN_DEFS[plan].features.join(" · "),
            },
          },
        };

    const base = appUrl();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: ctx.brand.email,
      line_items: [lineItem],
      success_url: `${base}/brand/billing?stripe=success&plan=${plan}`,
      cancel_url: `${base}/brand/billing?stripe=cancel`,
      metadata: {
        type: "saas",
        brandId: ctx.brand.id,
        plan,
        interval,
      },
      subscription_data: {
        metadata: {
          brandId: ctx.brand.id,
          plan,
          interval,
        },
      },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (e) {
    return authError(e);
  }
}
