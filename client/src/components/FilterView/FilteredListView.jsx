import { useState } from "react";
import { useExpenseStore } from "../../stores/useExpenseStore";
import ExportButton from "../common/ExportButton";
import "./FilteredListView.css";

const SORT_OPTIONS = [
  { key: "expenseDate", dir: "desc", label: "Date (newest)" },
  { key: "expenseDate", dir: "asc", label: "Date (oldest)" },
  { key: "amount", dir: "desc", label: "Amount (high)" },
  { key: "amount", dir: "asc", label: "Amount (low)" },
];

export default function FilteredListView() {
  const { expenses, isLoading, deleteExpense } = useExpenseStore((s) => s);

  const [sortIdx, setSortIdx] = useState(0);
  const [deleting, setDeleting] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  const { key: sortKey, dir: sortDir } = SORT_OPTIONS[sortIdx];

  // ── Sort ──────────────────────────────────────────────────────────────────
  const sorted = [...expenses].sort((a, b) => {
    let av =
      sortKey === "amount"
        ? parseFloat(a.amount)
        : new Date(a.expenseDate).getTime();
    let bv =
      sortKey === "amount"
        ? parseFloat(b.amount)
        : new Date(b.expenseDate).getTime();
    return sortDir === "asc" ? av - bv : bv - av;
  });

  // ── Summary totals ─────────────────────────────────────────────────────────
  const grandTotal = expenses.reduce((s, e) => s + parseFloat(e.amount), 0);

  const totalByCategory = expenses.reduce((acc, e) => {
    const name = e.category?.name ?? "Other";
    const color = e.category?.color ?? "#a8a49e";
    if (!acc[name]) acc[name] = { total: 0, color };
    acc[name].total += parseFloat(e.amount);
    return acc;
  }, {});

  const topCategories = Object.entries(totalByCategory)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 4);

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (expense) => {
    if (
      !window.confirm(
        `Delete $${parseFloat(expense.amount).toFixed(2)} — ${expense.category?.name ?? "Other"}?`,
      )
    )
      return;
    setDeleting(expense.id);
    await deleteExpense(expense.id);
    setDeleting(null);
  };

  if (expenses.length === 0 && !isLoading) return null;

  return (
    <div className="list-view">
      {/* ── Header ───────────────────────── */}
      <div className="list-header">
        <div className="list-header-left">
          <button
            className="list-collapse-btn"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand list" : "Collapse list"}
          >
            <span
              className={`collapse-chevron ${collapsed ? "" : "collapse-chevron--open"}`}
            >
              ›
            </span>
          </button>
          <div>
            <div className="list-title">Expense list</div>
            <div className="list-subtitle">
              {expenses.length} result{expenses.length !== 1 ? "s" : ""}
              {" · "}
              <span className="list-total">${grandTotal.toFixed(2)} total</span>
            </div>
          </div>
        </div>
        <div className="list-header-right">
          <select
            className="list-sort-select"
            value={sortIdx}
            onChange={(e) => setSortIdx(parseInt(e.target.value))}
          >
            {SORT_OPTIONS.map((o, i) => (
              <option key={i} value={i}>
                {o.label}
              </option>
            ))}
          </select>
          <ExportButton />
        </div>
      </div>

      {!collapsed && (
        <>
          {/* ── Category breakdown ───────────── */}
          {topCategories.length > 0 && (
            <div className="list-breakdown">
              {topCategories.map(([name, { total, color }]) => (
                <div key={name} className="breakdown-item">
                  <span
                    className="breakdown-dot"
                    style={{ background: color }}
                  />
                  <span className="breakdown-name">{name}</span>
                  <div className="breakdown-bar-wrap">
                    <div
                      className="breakdown-bar"
                      style={{
                        width: `${(total / grandTotal) * 100}%`,
                        background: color,
                      }}
                    />
                  </div>
                  <span className="breakdown-amt">${total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          {/* ── Table ────────────────────────── */}
          <div className="list-table-wrap">
            {isLoading ? (
              <div className="list-loading">Loading...</div>
            ) : (
              <table className="list-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Payment</th>
                    <th>Notes</th>
                    <th className="col-amount">Amount</th>
                    <th className="col-actions"></th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((exp) => (
                    <ExpenseTableRow
                      key={exp.id}
                      expense={exp}
                      isDeleting={deleting === exp.id}
                      onDelete={() => handleDelete(exp)}
                    />
                  ))}
                </tbody>
                <tfoot>
                  <tr className="table-total-row">
                    <td colSpan={4} className="total-label">
                      Total
                    </td>
                    <td className="total-value col-amount">
                      ${grandTotal.toFixed(2)}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ── ExpenseTableRow ────────────────────────────────────────────────────────────
function ExpenseTableRow({ expense, isDeleting, onDelete }) {
  const color = expense.category?.color ?? "#a8a49e";
  const amt = parseFloat(expense.amount);

  // Format date cleanly in MMM DD, YYYY format

  const dateStr = expense.expenseDate
    ? new Date(expense.expenseDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return (
    <tr className={`table-row ${isDeleting ? "table-row--deleting" : ""}`}>
      <td className="col-date">{dateStr}</td>

      <td className="col-category">
        <span className="table-cat-pill" style={{ "--cat-color": color }}>
          <span className="table-cat-dot" />
          {expense.category?.name ?? "Other"}
        </span>
      </td>

      <td className="col-payment">{expense.paymentMethod?.name ?? "—"}</td>

      <td className="col-notes">
        <span className="notes-text">{expense.notes ?? "—"}</span>
      </td>

      <td className="col-amount">${amt.toFixed(2)}</td>

      <td className="col-actions">
        <button
          className="table-delete-btn"
          onClick={onDelete}
          disabled={isDeleting}
          aria-label="Delete expense"
        >
          {isDeleting ? "..." : "Delete"}
        </button>
      </td>
    </tr>
  );
}
