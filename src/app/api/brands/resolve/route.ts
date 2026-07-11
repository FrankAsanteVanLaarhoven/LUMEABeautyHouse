import { NextRequest, NextResponse } from "next/server";
import {
  getBrandByDomain,
  getBrandBySlug,
  listBrandProducts,
  listBrands,
} from "@/lib/brands";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const host = searchParams.get("host");
  const slug = searchParams.get("slug");
  const list = searchParams.get("list");

  if (list === "1") {
    const brands = await listBrands();
    return NextResponse.json({
      brands: brands.filter((b) => b.status === "active" && b.whiteLabel.enabled),
    });
  }

  let brand = null;
  if (slug) brand = await getBrandBySlug(slug);
  else if (host) brand = await getBrandByDomain(host);

  if (!brand) {
    return NextResponse.json({ error: "Brand not found" }, { status: 404 });
  }

  const { password: _, ...pub } = brand;
  const products = (await listBrandProducts(brand.id)).filter((p) => p.active);
  return NextResponse.json({ brand: pub, products });
}
