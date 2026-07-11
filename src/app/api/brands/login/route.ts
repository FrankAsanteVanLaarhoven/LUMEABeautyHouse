import { NextRequest, NextResponse } from "next/server";
import { loginBrand } from "@/lib/brands";
import { BRAND_COOKIE } from "@/lib/brand-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await loginBrand(body.email || "", body.password || "");
    const res = NextResponse.json(result);
    res.cookies.set(BRAND_COOKIE, result.session.token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Login failed" },
      { status: 401 }
    );
  }
}
