import { useEffect } from "react";
import { useChartStore } from "../../stores/useChartStore";
import ChartControls from "./ChartControls";
import SpendingBarChart from "./SpendingBarChart";
import SpendingLineChart from "./SpendingLineChart";
import SpendingPieChart from "./SpendingPieChart";
import "./ChartSection.css";

export default function ChartSection() {
  const {
    fetchAllCharts,
    isLoading,
    rangeMode,
    selectedMonth,
    customStart,
    customEnd,
    lineMonths,
  } = useChartStore((s) => s);

  // Re-fetch whenever any control changes
  useEffect(() => {
    fetchAllCharts();
  }, [rangeMode, selectedMonth, customStart, customEnd, lineMonths]);

  return (
    <section className="chart-section">
      <div className="chart-section-header">
        <div>
          <h2 className="chart-section-title">Spending overview</h2>
          <p className="chart-section-sub">
            Visualise your spending patterns across time and categories
          </p>
        </div>
      </div>

      <ChartControls />

      {isLoading ? (
        <div className="chart-skeleton-grid">
          <div className="chart-skeleton" />
          <div className="chart-skeleton" />
          <div className="chart-skeleton chart-skeleton--wide" />
        </div>
      ) : (
        <div className="chart-grid">
          {/* Top row — bar + pie side by side */}
          <div className="chart-row">
            <div className="chart-card">
              <div className="chart-card-header">
                <h3 className="chart-card-title">Daily spending</h3>
                <span className="chart-card-sub">Spend per day in range</span>
              </div>
              <SpendingBarChart />
            </div>

            <div className="chart-card">
              <div className="chart-card-header">
                <h3 className="chart-card-title">By category</h3>
                <span className="chart-card-sub">Breakdown for period</span>
              </div>
              <SpendingPieChart />
            </div>
          </div>

          {/* Full-width line chart */}
          <div className="chart-card chart-card--wide">
            <div className="chart-card-header">
              <h3 className="chart-card-title">Monthly trend</h3>
              <span className="chart-card-sub">
                Spending over the last {useChartStore.getState().lineMonths}{" "}
                months
              </span>
            </div>
            <SpendingLineChart />
          </div>
        </div>
      )}
    </section>
  );
}
