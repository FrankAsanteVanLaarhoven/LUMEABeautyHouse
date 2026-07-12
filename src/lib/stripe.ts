import Stripe from "stripe";
import type { BrandPlan } from "./types";
import { planPrice, PLAN_DEFS } from "./plans";

export function isStripeEnabled() {
  return Boolean(process.env.STRIPE_SECRET_KEY?.startsWith("sk_"));
}

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key?.startsWith("sk_")) return null;
  return new Stripe(key, {
    typescript: true,
  });
}

export function appUrl(reqUrl?: string) {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  if (reqUrl) {
    try {
      const u = new URL(reqUrl);
      return `${u.protocol}//${u.host}`;
    } catch {
      /* fallthrough */
    }
  }
  return "http://localhost:3006";
}

/** Map SaaS plan+interval to a Stripe Price ID from env, or null to use price_data */
export function saasPriceId(
  plan: BrandPlan,
  interval: "monthly" | "yearly"
): string | null {
  const map: Record<string, string | undefined> = {
    "starter-monthly": process.env.STRIPE_PRICE_STARTER_MONTHLY,
    "starter-yearly": process.env.STRIPE_PRICE_STARTER_YEARLY,
    "growth-monthly": process.env.STRIPE_PRICE_GROWTH_MONTHLY,
    "growth-yearly": process.env.STRIPE_PRICE_GROWTH_YEARLY,
    "enterprise-monthly": process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY,
    "enterprise-yearly": process.env.STRIPE_PRICE_ENTERPRISE_YEARLY,
  };
  return map[`${plan}-${interval}`] || null;
}

export function saasUnitAmount(plan: BrandPlan, interval: "monthly" | "yearly") {
  return Math.round(planPrice(plan, interval) * 100);
}

export function saasProductName(plan: BrandPlan) {
  return `LUMÉA Brand · ${PLAN_DEFS[plan].name}`;
}

export type ConsumerLine = {
  name: string;
  variantName?: string;
  unitPrice: number;
  quantity: number;
  image?: string;
};
