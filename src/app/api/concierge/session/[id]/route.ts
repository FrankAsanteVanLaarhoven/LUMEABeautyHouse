import { NextRequest, NextResponse } from "next/server";
import { getBooking } from "@/lib/concierge-store";
import { getExpert } from "@/lib/concierge-experts";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const booking = await getBooking(id);
  if (!booking) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
  const expert = getExpert(booking.expertSlug);
  return NextResponse.json({ booking, expert: expert || null });
}
