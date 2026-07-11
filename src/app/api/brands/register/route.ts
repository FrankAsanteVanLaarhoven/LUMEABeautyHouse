import { NextRequest, NextResponse } from "next/server";
import { registerBrand } from "@/lib/brands";
import { BRAND_COOKIE } from "@/lib/brand-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.email || !body.password || !body.contactName) {
      return NextResponse.json(
        { error: "name, email, password, contactName required" },
        { status: 400 }
      );
    }
    const result = await registerBrand({
      name: body.name,
      email: body.email,
      password: body.password,
      contactName: body.contactName,
      website: body.website,
      plan: body.plan,
    });
    const res = NextResponse.json(result, { status: 201 });
    res.cookies.set(BRAND_COOKIE, result.session.token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Register failed" },
      { status: 400 }
    );
  }
}
