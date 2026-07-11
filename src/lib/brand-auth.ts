import { cookies } from "next/headers";
import { getSession } from "./brands";
import { roleHasPermission } from "./rbac";
import type { TeamPermission, TeamRole } from "./types";

export const BRAND_COOKIE = "lumea_brand_token";

export async function requireBrand(opts?: { permission?: TeamPermission }) {
  const jar = await cookies();
  const token = jar.get(BRAND_COOKIE)?.value;
  const session = await getSession(token);
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  if (opts?.permission) {
    const role = (session.role || session.member?.role || "viewer") as TeamRole;
    if (!roleHasPermission(role, opts.permission)) {
      throw new Error("FORBIDDEN");
    }
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
