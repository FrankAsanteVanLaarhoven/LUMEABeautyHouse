import { NextRequest, NextResponse } from "next/server";
import { processBrandPayment } from "@/lib/brands";
import { requireBrand } from "@/lib/brand-auth";
import { PLAN_DEFS } from "@/lib/plans";
import type { BrandPlan } from "@/lib/types";

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

export async function GET() {
  try {
    const ctx = await requireBrand({ permission: "billing:write" }).catch(
      async () => requireBrand({ permission: "dashboard:read" })
    );
    const plan = ctx.brand.plan;
    return NextResponse.json({
      plan,
      seatLimit: ctx.brand.seatLimit,
      seatsUsed: (ctx.brand.members || []).filter((m) => m.status !== "disabled")
        .length,
      billing: ctx.brand.billing,
      plans: PLAN_DEFS,
      whiteLabel: {
        customDomain: ctx.brand.whiteLabel.customDomain,
        domainStatus: ctx.brand.whiteLabel.domainStatus,
        subdomain: ctx.brand.whiteLabel.subdomain,
      },
    });
  } catch (e) {
    return authError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const ctx = await requireBrand({ permission: "billing:write" });
    const body = await req.json();
    const plan = String(body.plan || "") as BrandPlan;
    const interval = body.interval === "yearly" ? "yearly" : "monthly";
    if (!PLAN_DEFS[plan]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }
    // Demo card validation — accept any 16-ish digits; prefer 4242
    const card = String(body.cardNumber || "").replace(/\s/g, "");
    if (card && card.length < 12) {
      return NextResponse.json({ error: "Invalid card number" }, { status: 400 });
    }
    const result = await processBrandPayment(ctx.brand.id, {
      plan,
      interval,
      cardLast4: card ? card.slice(-4) : "4242",
    });
    return NextResponse.json(result);
  } catch (e) {
    return authError(e);
  }
}
