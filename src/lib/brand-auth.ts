import { cookies } from "next/headers";
import { getSession } from "./brands";

export const BRAND_COOKIE = "lumea_brand_token";

export async function requireBrand() {
  const jar = await cookies();
  const token = jar.get(BRAND_COOKIE)?.value;
  const session = await getSession(token);
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function getOptionalBrand() {
  try {
    const jar = await cookies();
    const token = jar.get(BRAND_COOKIE)?.value;
    return await getSession(token);
  } catch {
    return null;
  }
}
