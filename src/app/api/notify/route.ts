import { NextRequest, NextResponse } from "next/server";
import { addLead, listLeads } from "@/lib/notify-store";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const kind = String(body.type || "restock");

  if (kind === "restock") {
    const lead = await addLead({
      type: "restock",
      email,
      productSlug: String(body.productSlug || ""),
      productName: String(body.productName || "Product"),
      variantId: body.variantId ? String(body.variantId) : undefined,
    });
    return NextResponse.json({
      ok: true,
      message: "We'll email you when it's back in stock.",
      lead,
    });
  }

  if (kind === "abandon") {
    const lead = await addLead({
      type: "abandon",
      email,
      cartValue: Number(body.cartValue) || 0,
      itemCount: Number(body.itemCount) || 0,
    });
    return NextResponse.json({
      ok: true,
      message: "Cart saved. We'll nudge you with 10% off if you leave it.",
      lead,
    });
  }

  if (kind === "newsletter" || kind === "subscribe") {
    const lead = await addLead({
      type: kind === "subscribe" ? "subscribe" : "newsletter",
      email,
      productSlug: body.productSlug ? String(body.productSlug) : undefined,
      intervalDays: body.intervalDays ? Number(body.intervalDays) : 30,
    });
    return NextResponse.json({
      ok: true,
      message:
        kind === "subscribe"
          ? "Subscription preference saved. Confirm in email to activate billing."
          : "You're on the list for drops & Glow perks.",
      lead,
    });
  }

  return NextResponse.json({ error: "Unknown type" }, { status: 400 });
}

export async function GET() {
  const leads = await listLeads();
  return NextResponse.json({
    count: leads.length,
    // Don't expose emails publicly in full — summary only
    summary: {
      restock: leads.filter((l) => l.type === "restock").length,
      abandon: leads.filter((l) => l.type === "abandon").length,
      subscribe: leads.filter(
        (l) => l.type === "subscribe" || l.type === "newsletter"
      ).length,
    },
  });
}
