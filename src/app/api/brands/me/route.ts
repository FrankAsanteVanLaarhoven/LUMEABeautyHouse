import { NextRequest, NextResponse } from "next/server";
import { listBrandProducts, updateBrand } from "@/lib/brands";
import { requireBrand } from "@/lib/brand-auth";

export async function GET() {
  try {
    const { brand } = await requireBrand();
    const products = await listBrandProducts(brand.id);
    return NextResponse.json({
      brand: { ...brand, productCount: products.length },
      products,
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { brand } = await requireBrand();
    const body = await req.json();
    const updated = await updateBrand(brand.id, {
      name: body.name,
      contactName: body.contactName,
      website: body.website,
      plan: body.plan,
      whiteLabel: body.whiteLabel,
    });
    return NextResponse.json({ brand: updated });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed";
    if (msg === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
