"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CurrencyCode, LocaleCode } from "@/lib/i18n/config";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";

interface PrefsState {
  locale: LocaleCode;
  currency: CurrencyCode;
  likedProducts: string[];
  following: boolean;
  skinType: string;
  undertone: string;
  skinDepth: string;
  setLocale: (locale: LocaleCode) => void;
  setCurrency: (currency: CurrencyCode) => void;
  toggleLike: (productId: string) => void;
  setFollowing: (v: boolean) => void;
  setSkinProfile: (p: {
    skinType?: string;
    undertone?: string;
    skinDepth?: string;
  }) => void;
}

export const usePrefs = create<PrefsState>()(
  persist(
    (set, get) => ({
      locale: DEFAULT_LOCALE,
      currency: "USD",
      likedProducts: [],
      following: false,
      skinType: "normal",
      undertone: "neutral",
      skinDepth: "medium",
      setLocale: (locale) => set({ locale }),
      setCurrency: (currency) => set({ currency }),
      toggleLike: (productId) => {
        const liked = get().likedProducts;
        set({
          likedProducts: liked.includes(productId)
            ? liked.filter((id) => id !== productId)
            : [...liked, productId],
        });
      },
      setFollowing: (following) => set({ following }),
      setSkinProfile: (p) => set((s) => ({ ...s, ...p })),
    }),
    { name: "lumea-prefs" }
  )
);
