import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { logoutBrand } from "@/lib/brands";
import { BRAND_COOKIE } from "@/lib/brand-auth";

export async function POST() {
  const jar = await cookies();
  const token = jar.get(BRAND_COOKIE)?.value;
  if (token) await logoutBrand(token);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(BRAND_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
