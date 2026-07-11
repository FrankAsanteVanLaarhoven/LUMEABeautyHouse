import { NextRequest, NextResponse } from "next/server";
import { listBrandProducts, updateBrand } from "@/lib/brands";
import { requireBrand } from "@/lib/brand-auth";
import { permissionsForRole } from "@/lib/rbac";

function authError(e: unknown) {
  const msg = e instanceof Error ? e.message : "Failed";
  if (msg === "UNAUTHORIZED") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (msg === "FORBIDDEN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ error: msg }, { status: 400 });
}

export async function GET() {
  try {
    const ctx = await requireBrand({ permission: "dashboard:read" });
    const products = await listBrandProducts(ctx.brand.id);
    return NextResponse.json({
      brand: { ...ctx.brand, productCount: products.length },
      products,
      member: ctx.member,
      role: ctx.role,
      permissions: permissionsForRole(ctx.role),
    });
  } catch (e) {
    return authError(e);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    // Route permission by what's being updated
    if (body.studioSkin) {
      await requireBrand({ permission: "studio:write" });
    } else if (body.whiteLabel || body.plan) {
      await requireBrand({ permission: "whitelabel:write" });
    } else {
      await requireBrand({ permission: "whitelabel:write" });
    }
    const ctx = await requireBrand();
    const updated = await updateBrand(ctx.brand.id, {
      name: body.name,
      contactName: body.contactName,
      website: body.website,
      plan: body.plan,
      whiteLabel: body.whiteLabel,
      studioSkin: body.studioSkin,
    });
    return NextResponse.json({ brand: updated });
  } catch (e) {
    return authError(e);
  }
}
