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
  devtools((set, get) => ({
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
  })),
);
