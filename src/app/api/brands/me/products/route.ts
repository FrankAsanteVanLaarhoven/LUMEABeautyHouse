import { NextRequest, NextResponse } from "next/server";
import {
  createBrandProduct,
  listBrandProducts,
  syncBrandProductCount,
} from "@/lib/brands";
import { requireBrand } from "@/lib/brand-auth";
import { deleteProduct } from "@/lib/db";

export async function GET() {
  try {
    const { brand } = await requireBrand();
    const products = await listBrandProducts(brand.id);
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { brand } = await requireBrand();
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ error: "name required" }, { status: 400 });
    }
    const product = await createBrandProduct(brand.id, body);
    return NextResponse.json({ product }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed";
    if (msg === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { brand } = await requireBrand();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }
    const products = await listBrandProducts(brand.id);
    if (!products.some((p) => p.id === id)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    await deleteProduct(id);
    await syncBrandProductCount(brand.id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
