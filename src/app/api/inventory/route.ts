import { NextRequest, NextResponse } from "next/server";
import { adjustInventory, getInventorySummary } from "@/lib/db";

export async function GET() {
  const summary = await getInventorySummary();
  return NextResponse.json(summary);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await adjustInventory({
      productId: body.productId,
      variantId: body.variantId,
      delta: Number(body.delta),
      reason: body.reason || "adjustment",
      note: body.note,
    });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 400 }
    );
  }
}
