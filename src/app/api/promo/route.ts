import { NextRequest, NextResponse } from "next/server";
import { getPromo } from "@/lib/db";
import { getAffiliateCode } from "@/lib/affiliates";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const codeRaw = String(body.code || "").trim().toUpperCase();
  const subtotal = Number(body.subtotal) || 0;

  // Glow Club redemptions (set client-side but re-validate loosely)
  if (codeRaw.startsWith("GLOW")) {
    const pts = Number(codeRaw.replace("GLOW", "")) || 0;
    const map: Record<number, number> = { 200: 10, 400: 25, 800: 50 };
    const discount = map[pts];
    if (!discount) {
      return NextResponse.json({ error: "Invalid Glow reward" }, { status: 400 });
    }
    return NextResponse.json({
      code: codeRaw,
      type: "fixed",
      value: discount,
      discount,
      source: "glow",
    });
  }

  let promo = await getPromo(codeRaw);
  let source: "store" | "affiliate" = "store";
  if (!promo) {
    const aff = getAffiliateCode(codeRaw);
    if (aff) {
      promo = {
        code: aff.code,
        type: aff.type,
        value: aff.value,
        minSubtotal: aff.minSubtotal,
        active: aff.active,
      };
      source = "affiliate";
    }
  }
  if (!promo) {
    return NextResponse.json({ error: "Invalid code" }, { status: 404 });
  }
  if (promo.minSubtotal && subtotal < promo.minSubtotal) {
    return NextResponse.json(
      {
        error: `Minimum spend $${promo.minSubtotal} for code ${promo.code}`,
      },
      { status: 400 }
    );
  }
  const discount =
    promo.type === "percent"
      ? (subtotal * promo.value) / 100
      : promo.value;
  return NextResponse.json({
    code: promo.code,
    type: promo.type,
    value: promo.value,
    discount: Math.round(discount * 100) / 100,
    source,
  });
}
