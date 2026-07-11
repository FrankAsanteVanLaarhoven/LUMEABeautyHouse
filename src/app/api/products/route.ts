import { NextRequest, NextResponse } from "next/server";
import { listProducts, upsertProduct } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const products = await listProducts({
    category: searchParams.get("category") || undefined,
    featured: searchParams.get("featured") === "true" || undefined,
    q: searchParams.get("q") || undefined,
    activeOnly: searchParams.get("all") !== "true",
  });
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const product = await upsertProduct(body);
    return NextResponse.json({ product }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 400 }
    );
  }
}
