import { NextRequest, NextResponse } from "next/server";
import { trackEvent, type AnalyticsEventType } from "@/lib/brand-analytics";

const ALLOWED: AnalyticsEventType[] = [
  "floor_view",
  "product_view",
  "add_to_bag",
  "try_on_open",
  "quiz_complete",
  "live_rsvp",
  "concierge_book",
];

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const brandSlug = String(body.brandSlug || "lumea");
  const type = body.type as AnalyticsEventType;
  if (!ALLOWED.includes(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }
  const ev = await trackEvent({
    brandSlug,
    type,
    productSlug: body.productSlug ? String(body.productSlug) : undefined,
    meta: body.meta ? String(body.meta) : undefined,
  });
  return NextResponse.json({ ok: true, id: ev.id });
}
