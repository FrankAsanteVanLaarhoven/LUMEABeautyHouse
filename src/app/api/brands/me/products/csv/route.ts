import { NextRequest, NextResponse } from "next/server";
import {
  CSV_TEMPLATE,
  importBrandProductsFromCsv,
} from "@/lib/brands";
import { requireBrand } from "@/lib/brand-auth";

export async function GET() {
  return new NextResponse(CSV_TEMPLATE, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="lumea-product-template.csv"',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { brand } = await requireBrand({ permission: "csv:import" });
    const contentType = req.headers.get("content-type") || "";

    let csvText = "";
    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file");
      if (!file || !(file instanceof File)) {
        return NextResponse.json({ error: "file required" }, { status: 400 });
      }
      csvText = await file.text();
    } else if (contentType.includes("text/csv") || contentType.includes("text/plain")) {
      csvText = await req.text();
    } else {
      const body = await req.json().catch(() => ({}));
      csvText = body.csv || body.text || "";
    }

    if (!csvText.trim()) {
      return NextResponse.json({ error: "Empty CSV" }, { status: 400 });
    }

    const result = await importBrandProductsFromCsv(brand.id, csvText);
    return NextResponse.json(result, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Import failed";
    if (msg === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
