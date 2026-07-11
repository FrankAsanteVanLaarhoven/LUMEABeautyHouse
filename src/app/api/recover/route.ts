import { NextRequest, NextResponse } from "next/server";
import { getAbandonByToken, markRecovered } from "@/lib/abandon";

export async function GET(req: NextRequest) {
  const token = new URL(req.url).searchParams.get("token") || "";
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }
  const rec = await getAbandonByToken(token);
  if (!rec) {
    return NextResponse.json(
      { error: "Link expired or invalid" },
      { status: 404 }
    );
  }
  return NextResponse.json({
    email: rec.email,
    items: rec.items,
    cartValue: rec.cartValue,
    recovered: rec.recovered,
    expiresAt: rec.expiresAt,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const token = String(body.token || "");
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }
  const rec = await getAbandonByToken(token);
  if (!rec) {
    return NextResponse.json(
      { error: "Link expired or invalid" },
      { status: 404 }
    );
  }
  await markRecovered(token);
  return NextResponse.json({
    ok: true,
    email: rec.email,
    items: rec.items,
    promoHint: "WELCOME10",
  });
}
