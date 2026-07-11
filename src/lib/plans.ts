import type { BrandPlan } from "./types";

export interface PlanDef {
  id: BrandPlan;
  name: string;
  tagline: string;
  seats: number;
  products: number; // 0 = unlimited
  monthly: number;
  yearly: number;
  customDomain: boolean;
  studioSkins: boolean;
  csvImport: boolean;
  analytics: boolean;
  prioritySupport: boolean;
  features: string[];
}

export const PLAN_DEFS: Record<BrandPlan, PlanDef> = {
  starter: {
    id: "starter",
    name: "Starter",
    tagline: "Launch your house on LUMÉA",
    seats: 2,
    products: 50,
    monthly: 49,
    yearly: 490,
    customDomain: false,
    studioSkins: true,
    csvImport: true,
    analytics: false,
    prioritySupport: false,
    features: [
      "2 team seats",
      "50 products",
      "Subdomain storefront /b/you",
      "Mirror Studio skin",
      "CSV product import",
    ],
  },
  growth: {
    id: "growth",
    name: "Growth",
    tagline: "Scale catalogue + custom domain",
    seats: 5,
    products: 500,
    monthly: 149,
    yearly: 1490,
    customDomain: true,
    studioSkins: true,
    csvImport: true,
    analytics: true,
    prioritySupport: false,
    features: [
      "5 team seats",
      "500 products",
      "Custom domain + DNS verify",
      "White-label theme",
      "Studio skin + brand colours",
      "Basic storefront analytics",
    ],
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Multi-brand ops & VIP support",
    seats: 25,
    products: 0,
    monthly: 499,
    yearly: 4990,
    customDomain: true,
    studioSkins: true,
    csvImport: true,
    analytics: true,
    prioritySupport: true,
    features: [
      "25 team seats",
      "Unlimited products",
      "Custom domain + priority SSL",
      "Role-based seats (owner→viewer)",
      "Concierge onboarding",
      "Priority support",
    ],
  },
};

export function planPrice(plan: BrandPlan, interval: "monthly" | "yearly") {
  const def = PLAN_DEFS[plan];
  return interval === "yearly" ? def.yearly : def.monthly;
}

export function planAllowsCustomDomain(plan: BrandPlan) {
  return PLAN_DEFS[plan].customDomain;
}

export function planProductLimit(plan: BrandPlan) {
  return PLAN_DEFS[plan].products;
}

export function yearlySavings(plan: BrandPlan) {
  const d = PLAN_DEFS[plan];
  return d.monthly * 12 - d.yearly;
}
