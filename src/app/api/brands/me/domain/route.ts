import { NextRequest, NextResponse } from "next/server";
import { updateBrand, verifyBrandDomain } from "@/lib/brands";
import { requireBrand } from "@/lib/brand-auth";
import { planAllowsCustomDomain } from "@/lib/plans";

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

/** Set custom domain (pending) or run demo verify */
export async function POST(req: NextRequest) {
  try {
    const ctx = await requireBrand({ permission: "whitelabel:write" });
    const body = await req.json();
    const action = String(body.action || "set");

    if (action === "verify") {
      const brand = await verifyBrandDomain(ctx.brand.id);
      return NextResponse.json({ brand, message: "Domain verified" });
    }

    if (!planAllowsCustomDomain(ctx.brand.plan)) {
      return NextResponse.json(
        { error: "Upgrade to Growth or Enterprise for custom domains" },
        { status: 403 }
      );
    }

    const domain = String(body.customDomain || "")
      .toLowerCase()
      .trim();
    const brand = await updateBrand(ctx.brand.id, {
      whiteLabel: {
        customDomain: domain,
        domainStatus: domain ? "pending" : "none",
        dnsTarget: "edge.lumea.beauty",
      },
    });
    return NextResponse.json({
      brand,
      message: domain
        ? "Domain saved as pending — add CNAME then verify"
        : "Custom domain cleared",
    });
  } catch (e) {
    return authError(e);
  }
}
