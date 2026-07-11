"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  productId: string;
  variantId: string;
  slug?: string;
  name: string;
  variantName: string;
  sku: string;
  price: number;
  image: string;
  quantity: number;
  maxStock: number;
}

interface CartState {
  items: CartLine[];
  isOpen: boolean;
  promoCode: string | null;
  discount: number;
  open: () => void;
  close: () => void;
  toggle: () => void;
  addItem: (item: Omit<CartLine, "quantity"> & { quantity?: number }) => void;
  removeItem: (variantId: string) => void;
  updateQty: (variantId: string, quantity: number) => void;
  setPromo: (code: string | null, discount: number) => void;
  clear: () => void;
  subtotal: () => number;
  count: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      promoCode: null,
      discount: 0,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      addItem: (item) => {
        const qty = item.quantity ?? 1;
        set((s) => {
          const existing = s.items.find((i) => i.variantId === item.variantId);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.variantId === item.variantId
                  ? {
                      ...i,
                      quantity: Math.min(i.maxStock, i.quantity + qty),
                    }
                  : i
              ),
              isOpen: true,
            };
          }
          return {
            items: [
              ...s.items,
              { ...item, quantity: Math.min(item.maxStock, qty) },
            ],
            isOpen: true,
          };
        });
      },
      removeItem: (variantId) =>
        set((s) => ({
          items: s.items.filter((i) => i.variantId !== variantId),
        })),
      updateQty: (variantId, quantity) =>
        set((s) => ({
          items:
            quantity <= 0
              ? s.items.filter((i) => i.variantId !== variantId)
              : s.items.map((i) =>
                  i.variantId === variantId
                    ? { ...i, quantity: Math.min(i.maxStock, quantity) }
                    : i
                ),
        })),
      setPromo: (code, discount) => set({ promoCode: code, discount }),
      clear: () => set({ items: [], promoCode: null, discount: 0 }),
      subtotal: () =>
        get().items.reduce((s, i) => s + i.price * i.quantity, 0),
      count: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    { name: "lumea-cart" }
  )
);
