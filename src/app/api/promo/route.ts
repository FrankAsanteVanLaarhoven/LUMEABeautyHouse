import { NextRequest, NextResponse } from "next/server";
import { getPromo } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const promo = await getPromo(body.code || "");
  if (!promo) {
    return NextResponse.json({ error: "Invalid code" }, { status: 404 });
  }
  const subtotal = Number(body.subtotal) || 0;
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
  });
}
