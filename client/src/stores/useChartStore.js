import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  format,
  startOfMonth,
  endOfMonth,
  subMonths,
  addMonths,
} from "date-fns";
import * as api from "../services/api";

export const useChartStore = create(
  devtools(
    (set, get) => ({
      barData: [],
      lineData: [],
      pieData: [],
      isLoading: false,

      // Range controls for bar and pie charts
      rangeMode: "month",
      selectedMonth: new Date(),
      customStart: null,
      customEnd: null,

      // Number of months for line chart X axis
      lineMonths: 6,

      getDateRange: () => {
        const { rangeMode, selectedMonth, customStart, customEnd } = get();

        if (rangeMode === "month") {
          return {
            start: format(startOfMonth(selectedMonth), "yyyy-MM-dd"),
            end: format(endOfMonth(selectedMonth), "yyyy-MM-dd"),
          };
        }

        return { start: customStart, end: customEnd };
      },

      setRangeMode: (mode) => set({ rangeMode: mode }),

      setSelectedMonth: (date) => set({ selectedMonth: date }),

      prevMonth: () =>
        set((s) => ({ selectedMonth: subMonths(s.selectedMonth, 1) })),
      nextMonth: () =>
        set((s) => ({ selectedMonth: addMonths(s.selectedMonth, 1) })),

      setCustomRange: (start, end) =>
        set({ customStart: start, customEnd: end }),

      setLineMonths: (n) => set({ lineMonths: n }),

      fetchAllCharts: async () => {
        const { getDateRange, lineMonths } = get();
        const { start, end } = getDateRange();
        if (!start || !end) return;

        set({ isLoading: true });
        try {
          const [barData, lineData, pieData] = await Promise.all([
            api.getBarChartData(start, end),
            api.getLineChartData(lineMonths),
            api.getPieChartData(start, end),
          ]);
          set({ barData, lineData, pieData, isLoading: false });
        } catch (err) {
          console.error("Chart fetch failed:", err);
          set({ isLoading: false });
        }
      },
    }),
    { name: "ChartStore" },
  ),
);
