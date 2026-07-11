import { NextResponse } from "next/server";
import { isStripeEnabled } from "@/lib/stripe";

export async function GET() {
  return NextResponse.json({
    enabled: isStripeEnabled(),
    mode: isStripeEnabled()
      ? process.env.STRIPE_SECRET_KEY?.startsWith("sk_live")
        ? "live"
        : "test"
      : "demo",
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || null,
  });
}
