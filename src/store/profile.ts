"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";

export interface ClientProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarHue: string;
  bio: string;
  birthday: string;
  country: string;
  city: string;
  skinType: string;
  undertone: string;
  skinDepth: string;
  concerns: string[];
  favoriteCategories: string[];
  notifyEmail: boolean;
  notifySms: boolean;
  walletBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTx {
  id: string;
  type: "topup" | "purchase" | "refund" | "reward";
  amount: number;
  note: string;
  createdAt: string;
}

export interface ListItem {
  id: string;
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  variantName: string;
  sku: string;
  price: number;
  image: string;
  note: string;
  addedAt: string;
}

export type ListViewMode = "list" | "icons";

interface ProfileState {
  profile: ClientProfile | null;
  walletTx: WalletTx[];
  shoppingList: ListItem[];
  listView: ListViewMode;
  createProfile: (
    data: Omit<
      ClientProfile,
      "id" | "walletBalance" | "createdAt" | "updatedAt" | "avatarHue"
    > & { avatarHue?: string }
  ) => void;
  updateProfile: (data: Partial<ClientProfile>) => void;
  clearProfile: () => void;
  topUp: (amount: number, note?: string) => void;
  spendWallet: (amount: number, note?: string) => boolean;
  addToList: (item: Omit<ListItem, "id" | "addedAt" | "note"> & { note?: string }) => void;
  removeFromList: (id: string) => void;
  updateListNote: (id: string, note: string) => void;
  clearList: () => void;
  setListView: (mode: ListViewMode) => void;
  isInList: (variantId: string) => boolean;
}

const hues = ["#1a1612", "#c4a574", "#c48b7a", "#3d6b4f", "#5c4a7a", "#7a4a32"];

export const useProfile = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: null,
      walletTx: [],
      shoppingList: [],
      listView: "icons",

      createProfile: (data) => {
        const now = new Date().toISOString();
        const profile: ClientProfile = {
          id: nanoid(10),
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || "",
          avatarHue: data.avatarHue || hues[Math.floor(Math.random() * hues.length)],
          bio: data.bio || "",
          birthday: data.birthday || "",
          country: data.country || "",
          city: data.city || "",
          skinType: data.skinType || "normal",
          undertone: data.undertone || "neutral",
          skinDepth: data.skinDepth || "medium",
          concerns: data.concerns || [],
          favoriteCategories: data.favoriteCategories || [],
          notifyEmail: data.notifyEmail ?? true,
          notifySms: data.notifySms ?? false,
          walletBalance: 25, // welcome credit
          createdAt: now,
          updatedAt: now,
        };
        set({
          profile,
          walletTx: [
            {
              id: nanoid(8),
              type: "reward",
              amount: 25,
              note: "Welcome credit",
              createdAt: now,
            },
          ],
        });
      },

      updateProfile: (data) => {
        const cur = get().profile;
        if (!cur) return;
        set({
          profile: {
            ...cur,
            ...data,
            updatedAt: new Date().toISOString(),
          },
        });
      },

      clearProfile: () => set({ profile: null, walletTx: [] }),

      topUp: (amount, note) => {
        const cur = get().profile;
        if (!cur || amount <= 0) return;
        const now = new Date().toISOString();
        set({
          profile: {
            ...cur,
            walletBalance: Math.round((cur.walletBalance + amount) * 100) / 100,
            updatedAt: now,
          },
          walletTx: [
            {
              id: nanoid(8),
              type: "topup",
              amount,
              note: note || "Wallet top-up",
              createdAt: now,
            },
            ...get().walletTx,
          ],
        });
      },

      spendWallet: (amount, note) => {
        const cur = get().profile;
        if (!cur || amount <= 0 || cur.walletBalance < amount) return false;
        const now = new Date().toISOString();
        set({
          profile: {
            ...cur,
            walletBalance: Math.round((cur.walletBalance - amount) * 100) / 100,
            updatedAt: now,
          },
          walletTx: [
            {
              id: nanoid(8),
              type: "purchase",
              amount: -amount,
              note: note || "Purchase",
              createdAt: now,
            },
            ...get().walletTx,
          ],
        });
        return true;
      },

      addToList: (item) => {
        const exists = get().shoppingList.some(
          (i) => i.variantId === item.variantId
        );
        if (exists) return;
        set({
          shoppingList: [
            {
              ...item,
              note: item.note || "",
              id: nanoid(8),
              addedAt: new Date().toISOString(),
            },
            ...get().shoppingList,
          ],
        });
      },

      removeFromList: (id) =>
        set({
          shoppingList: get().shoppingList.filter((i) => i.id !== id),
        }),

      updateListNote: (id, note) =>
        set({
          shoppingList: get().shoppingList.map((i) =>
            i.id === id ? { ...i, note } : i
          ),
        }),

      clearList: () => set({ shoppingList: [] }),

      setListView: (listView) => set({ listView }),

      isInList: (variantId) =>
        get().shoppingList.some((i) => i.variantId === variantId),
    }),
    { name: "lumea-profile" }
  )
);
