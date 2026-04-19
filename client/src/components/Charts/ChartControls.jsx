import { useChartStore } from "../../stores/useChartStore";
import { format } from "date-fns";
import "./ChartControls.css";

const LINE_MONTH_OPTIONS = [3, 6, 12];

export default function ChartControls() {
  const {
    rangeMode,
    setRangeMode,
    selectedMonth,
    prevMonth,
    nextMonth,
    customStart,
    customEnd,
    setCustomRange,
    lineMonths,
    setLineMonths,
  } = useChartStore((s) => s);

  const handleCustomStart = (e) => {
    setCustomRange(e.target.value || null, customEnd);
  };

  const handleCustomEnd = (e) => {
    setCustomRange(customStart, e.target.value || null);
  };

  return (
    <div className="chart-controls">
      {/* ── Left: range mode toggle ──────── */}
      <div className="controls-left">
        <div className="toggle-group">
          <button
            className={`toggle-btn ${rangeMode === "month" ? "toggle-btn--active" : ""}`}
            onClick={() => setRangeMode("month")}
          >
            Month
          </button>
          <button
            className={`toggle-btn ${rangeMode === "custom" ? "toggle-btn--active" : ""}`}
            onClick={() => setRangeMode("custom")}
          >
            Custom
          </button>
        </div>

        {/* Month picker */}
        {rangeMode === "month" && (
          <div className="month-nav">
            <button className="month-nav-btn" onClick={prevMonth}>
              ‹
            </button>
            <span className="month-nav-label">
              {format(selectedMonth, "MMMM yyyy")}
            </span>
            <button className="month-nav-btn" onClick={nextMonth}>
              ›
            </button>
          </div>
        )}

        {/* Custom date range */}
        {rangeMode === "custom" && (
          <div className="custom-range">
            <input
              type="date"
              className="range-input"
              value={customStart ?? ""}
              max={customEnd ?? ""}
              onChange={handleCustomStart}
            />
            <span className="range-sep">—</span>
            <input
              type="date"
              className="range-input"
              value={customEnd ?? ""}
              min={customStart ?? ""}
              onChange={handleCustomEnd}
            />
          </div>
        )}
      </div>

      {/* ── Right: line chart depth ──────── */}
      <div className="controls-right">
        <span className="depth-label">Trend</span>
        <div className="depth-group">
          {LINE_MONTH_OPTIONS.map((n) => (
            <button
              key={n}
              className={`depth-btn ${lineMonths === n ? "depth-btn--active" : ""}`}
              onClick={() => setLineMonths(n)}
            >
              {n}mo
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
