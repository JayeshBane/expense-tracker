import { create } from "zustand";
import { devtools } from "zustand/middleware";
import * as api from "../services/api";

const groupByDate = (expenses) => {
  expenses.reduce((acc, exp) => {
    const key = exp.expenseDate.slice(0, 10);

    if (!acc[key]) acc[key] = [];

    acc[key].push(exp);

    return acc;
  }, {});
};

export const useExpenseStore = create(
  devtools((set, get) => ({
    expenses: [],
    expensesByDate: {},
    currentMonth: new Date(),
    filters: {
      start: null,
      end: null,
      categoryId: null,
      paymentMethodId: null,
    },
    isLoading: false,
    error: null,

    setCurrentMonth: (date) => set({ currentMonth: date }),

    setFilter: (key, value) =>
      set((s) => ({ filters: { ...s.filters, [key]: value } })),

    clearFilters: () =>
      set({
        filters: {
          start: null,
          end: null,
          categoryId: null,
          paymentMethodId: null,
        },
      }),

    fetchExpenses: async (overrides = {}) => {
      set({ isLoading: true, error: null });

      try {
        const params = { ...get().filters, ...overrides };
        const expenses = await api.getExpenses(params);

        set({
          expenses,
          expensesByDate: groupByDate(expenses),
          isLoading: false,
        });
      } catch (err) {
        set({ error: err.message, isLoading: false });
      }
    },

    createExpense: async (data) => {
      try {
        const expense = await api.createExpense(data);

        set((s) => {
          const key = expense.expenseDate.slice(0, 10);

          return {
            expenses: [expense, ...s.expenses],
            expensesByDate: {
              ...s.expensesByDate,
              [key]: [...(s.expensesByDate[key] ?? []), expense],
            },
          };
        });

        return expense;
      } catch (err) {
        set({ error: err.message });
        return null;
      }
    },

    updateExpense: async (id, data) => {
      try {
        const updated = await api.updateExpense(id, data);

        set((s) => {
          const oldKey = s.expenses
            .find((e) => e.id === id)
            .expenseDate.slice(0, 10);

          const newKey = updated.expenseDate.slice(0, 10);

          const ebd = { ...s.expensesByDate };

          if (oldKey) {
            ebd[oldKey] = (ebd[oldKey] ?? []).filter((e) => e.id !== id);
          }

          ebd[newKey] = [...(ebd[newKey] ?? []), updated];

          return {
            expenses: s.expenses.map((e) => (e.id === id ? updated : e)),
            expensesByDate: ebd,
          };
        });
      } catch (err) {
        set({ error: err.message });
      }
    },
  })),
);
