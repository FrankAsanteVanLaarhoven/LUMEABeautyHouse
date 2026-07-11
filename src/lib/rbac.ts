import type { BrandPlan, TeamPermission, TeamRole } from "./types";

export const PLAN_SEAT_LIMITS: Record<BrandPlan, number> = {
  starter: 2,
  growth: 5,
  enterprise: 25,
};

const ROLE_PERMS: Record<TeamRole, TeamPermission[]> = {
  owner: [
    "dashboard:read",
    "products:read",
    "products:write",
    "csv:import",
    "whitelabel:write",
    "studio:write",
    "team:read",
    "team:write",
    "billing:write",
  ],
  admin: [
    "dashboard:read",
    "products:read",
    "products:write",
    "csv:import",
    "whitelabel:write",
    "studio:write",
    "team:read",
    "team:write",
  ],
  editor: [
    "dashboard:read",
    "products:read",
    "products:write",
    "csv:import",
    "studio:write",
    "team:read",
  ],
  viewer: ["dashboard:read", "products:read", "team:read"],
};

export function roleHasPermission(role: TeamRole, perm: TeamPermission) {
  return ROLE_PERMS[role]?.includes(perm) ?? false;
}

export function permissionsForRole(role: TeamRole) {
  return [...ROLE_PERMS[role]];
}

export const ROLE_LABELS: Record<TeamRole, string> = {
  owner: "Owner",
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
};

export const ROLE_DESCRIPTIONS: Record<TeamRole, string> = {
  owner: "Full control including billing and ownership",
  admin: "Manage products, studio, white-label, and team",
  editor: "Manage products, CSV import, and studio skin",
  viewer: "Read-only access to dashboard and catalogue",
};
