import { NextRequest, NextResponse } from "next/server";
import { platformSummary, summaryForBrand } from "@/lib/brand-analytics";

export async function GET(req: NextRequest) {
  const brand = new URL(req.url).searchParams.get("brand");
  if (brand) {
    const s = await summaryForBrand(brand);
    return NextResponse.json(s);
  }
  const p = await platformSummary();
  return NextResponse.json(p);
}
