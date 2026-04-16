import { useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import { useExpenseStore } from "../../stores/useExpenseStore";
import { useMetaStore } from "../../stores/useMetaStore";
import DayCell from "./DayCell";
import "./CalendarView.css";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarView() {
  const {
    currentMonth,
    setCurrentMonth,
    expensesByDate,
    fetchExpenses,
    isLoading,
  } = useExpenseStore((s) => s);

  // Re-fetch whenever the displayed month changes
  useEffect(() => {
    fetchExpenses({
      start: format(startOfMonth(currentMonth), "yyyy-MM-dd"),
      end: format(endOfMonth(currentMonth), "yyyy-MM-dd"),
    });
  }, [currentMonth, fetchExpenses]);

  // Build full grid — always starts on Sunday, ends on Saturday
  const gridDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToday = () => setCurrentMonth(new Date());

  return (
    <div className="cal-wrapper">
      {/* ── Summary bar ──────────────────── */}
      <SummaryBar expensesByDate={expensesByDate} />

      {/* ── Navigation ───────────────────── */}
      <div className="cal-nav">
        <div className="cal-month-label">
          {format(currentMonth, "MMMM")}
          <span className="cal-year">{format(currentMonth, "yyyy")}</span>
        </div>

        <div className="cal-nav-right">
          {isLoading && <span className="cal-loading">Updating...</span>}
          <div className="nav-btns">
            <button className="nav-btn" onClick={prevMonth}>
              ‹
            </button>
            <button className="nav-btn" onClick={goToday}>
              Today
            </button>
            <button className="nav-btn" onClick={nextMonth}>
              ›
            </button>
          </div>
        </div>
      </div>

      {/* ── Grid ─────────────────────────── */}
      <div className="cal-grid">
        <div className="cal-weekdays">
          {WEEKDAYS.map((d) => (
            <div key={d} className="cal-weekday">
              {d}
            </div>
          ))}
        </div>

        <div className="cal-days">
          {gridDays.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            return (
              <DayCell
                key={key}
                date={day}
                expenses={expensesByDate[key] ?? []}
                isCurrentMonth={isSameMonth(day, currentMonth)}
                isToday={isToday(day)}
              />
            );
          })}
        </div>
      </div>

      {/* ── Category legend ──────────────── */}
      <CategoryLegend />
    </div>
  );
}

// ── SummaryBar ────────────────────────────────────────────────────────────────
function SummaryBar({ expensesByDate }) {
  const allExpenses = Object.values(expensesByDate).flat();
  const monthTotal = allExpenses.reduce((s, e) => s + parseFloat(e.amount), 0);
  const txCount = allExpenses.length;

  const daysWithData = Object.values(expensesByDate).filter(
    (d) => d.length > 0,
  ).length;
  const dailyAvg = daysWithData ? monthTotal / daysWithData : 0;

  const largestDay = Object.entries(expensesByDate)
    .map(([date, exps]) => ({
      date,
      total: exps.reduce((s, e) => s + parseFloat(e.amount), 0),
    }))
    .sort((a, b) => b.total - a.total)[0];

  const catTotals = allExpenses.reduce((acc, e) => {
    const name = e.category?.name ?? "Other";
    acc[name] = (acc[name] || 0) + parseFloat(e.amount);
    return acc;
  }, {});
  const topCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="summary-bar">
      <SummaryCard
        label="This month"
        value={`$${monthTotal.toFixed(2)}`}
        sub={`${txCount} transaction${txCount !== 1 ? "s" : ""}`}
        accent
      />
      <SummaryCard
        label="Daily average"
        value={`$${dailyAvg.toFixed(2)}`}
        sub="on days with spending"
      />
      <SummaryCard
        label="Largest day"
        value={largestDay ? `$${largestDay.total.toFixed(2)}` : "—"}
        sub={
          largestDay
            ? format(new Date(largestDay.date + "T00:00:00"), "MMM d")
            : "No data yet"
        }
      />
      <SummaryCard
        label="Top category"
        value={topCat?.[0] ?? "—"}
        sub={topCat ? `$${topCat[1].toFixed(2)} spent` : "No data yet"}
      />
    </div>
  );
}

function SummaryCard({ label, value, sub, accent }) {
  return (
    <div className="summary-card">
      <div className="summary-label">{label}</div>
      <div className={`summary-value ${accent ? "summary-value--accent" : ""}`}>
        {value}
      </div>
      <div className="summary-sub">{sub}</div>
    </div>
  );
}

// ── CategoryLegend ─────────────────────────────────────────────────────────────
function CategoryLegend() {
  const categories = useMetaStore((s) => s.categories);
  if (!categories.length) return null;

  return (
    <div className="cat-legend">
      {categories.map((cat) => (
        <div key={cat.id} className="legend-item">
          <span
            className="legend-dot"
            style={{ background: cat.color ?? "#a8a49e" }}
          />
          {cat.name}
        </div>
      ))}
    </div>
  );
}
