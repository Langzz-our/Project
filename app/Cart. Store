// ============================================================
// store/cart.store.ts — Zustand Cart State Management
// Persisted ke localStorage agar tidak hilang saat refresh
// ============================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id:       string;
  name:     string;
  price:    number;
  imageUrl: string;
  quantity: number;
  stock:    number;
}

interface CartStore {
  items:       CartItem[];
  addItem:     (item: Omit<CartItem, "quantity">) => void;
  removeItem:  (id: string) => void;
  updateQty:   (id: string, quantity: number) => void;
  clearCart:   () => void;
  totalItems:  () => number;
  totalPrice:  () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // Tambah item — jika sudah ada, naikkan quantity
      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQty: (id, quantity) => {
        if (quantity < 1) return get().removeItem(id);
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.min(quantity, i.stock) } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems:  () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice:  () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "luxe-cart" } // Key di localStorage
  )
);
