"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ViewedProduct {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  viewedAt: string;
}

export interface RestockAlert {
  productId: string;
  slug: string;
  name: string;
  variantId?: string;
  email: string;
  createdAt: string;
}

export interface LoyaltyEvent {
  id: string;
  pts: number;
  reason: string;
  at: string;
}

interface BrowseState {
  recentlyViewed: ViewedProduct[];
  loyaltyPoints: number;
  loyaltyLog: LoyaltyEvent[];
  restockAlerts: RestockAlert[];
  subscribeSave: boolean;
  trackView: (p: Omit<ViewedProduct, "viewedAt">) => void;
  addLoyalty: (pts: number, reason?: string) => void;
  redeemLoyalty: (pts: number, reason?: string) => boolean;
  clearViewed: () => void;
  addRestockAlert: (a: Omit<RestockAlert, "createdAt">) => void;
  removeRestockAlert: (slug: string) => void;
  setSubscribeSave: (on: boolean) => void;
}

export const useBrowse = create<BrowseState>()(
  persist(
    (set, get) => ({
      recentlyViewed: [],
      loyaltyPoints: 0,
      loyaltyLog: [],
      restockAlerts: [],
      subscribeSave: false,
      trackView: (p) => {
        const rest = get().recentlyViewed.filter((x) => x.id !== p.id);
        set({
          recentlyViewed: [
            { ...p, viewedAt: new Date().toISOString() },
            ...rest,
          ].slice(0, 12),
        });
      },
      addLoyalty: (pts, reason = "Activity") => {
        if (pts === 0) return;
        const ev: LoyaltyEvent = {
          id: `lp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          pts,
          reason,
          at: new Date().toISOString(),
        };
        set({
          loyaltyPoints: Math.max(0, get().loyaltyPoints + pts),
          loyaltyLog: [ev, ...get().loyaltyLog].slice(0, 40),
        });
      },
      redeemLoyalty: (pts, reason = "Redeemed") => {
        if (pts <= 0 || get().loyaltyPoints < pts) return false;
        const ev: LoyaltyEvent = {
          id: `lp-${Date.now()}-r`,
          pts: -pts,
          reason,
          at: new Date().toISOString(),
        };
        set({
          loyaltyPoints: get().loyaltyPoints - pts,
          loyaltyLog: [ev, ...get().loyaltyLog].slice(0, 40),
        });
        return true;
      },
      clearViewed: () => set({ recentlyViewed: [] }),
      addRestockAlert: (a) => {
        const rest = get().restockAlerts.filter(
          (x) => !(x.slug === a.slug && x.email === a.email)
        );
        set({
          restockAlerts: [
            { ...a, createdAt: new Date().toISOString() },
            ...rest,
          ].slice(0, 20),
        });
      },
      removeRestockAlert: (slug) =>
        set({
          restockAlerts: get().restockAlerts.filter((x) => x.slug !== slug),
        }),
      setSubscribeSave: (on) => set({ subscribeSave: on }),
    }),
    { name: "lumea-browse" }
  )
);
