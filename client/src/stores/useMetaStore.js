import { create } from "zustand";
import { devtools } from "zustand/middleware";
import * as api from "../services/api";

export const useMetaStore = create(
  devtools((set) => ({
    categories: [],
    paymentMethods: [],
    isCreating: false,
    createError: null,

    fetchMeta: async () => {
      const [categories, paymentMethods] = await Promise.all([
        api.getCategories(),
        api.getPaymentMethods(),
      ]);

      set({ categories, paymentMethods });
    },

    createCategory: async ({ name, color }) => {
      set({ isCreating: true, createError: null });

      try {
        const created = await api.createCategory({ name, color });
        set((s) => ({
          categories: [...s.categories, created].sort((a, b) =>
            a.name.localCompare(b.name),
          ),
          isCreating: false,
        }));

        return created;
      } catch (err) {
        set({
          createError: err.response?.data?.error ?? "Failed",
          isCreating: false,
        });

        return null;
      }
    },

    createPaymentMethod: async ({ name }) => {
      set({ isCreating: true, createError: null });

      try {
        const created = await api.createPaymentMethod({ name });
        set((s) => ({
          paymentMethods: [...s.paymentMethods, created].sort((a, b) =>
            a.name.localeCompare(b.name),
          ),
          isCreating: false,
        }));

        return created;
      } catch (err) {
        set({
          createError: err.response?.data?.error ?? "Failed",
          isCreating: false,
        });

        return null;
      }
    },
  })),
);
