import { useState } from "react";
import { useExpenseStore } from "../../stores/useExpenseStore";
import { exportExpenses } from "../../services/api";
import "./ExportButton.css";

export default function ExportButton() {
  const filters = useExpenseStore((s) => s.filters);
  const expenses = useExpenseStore((s) => s.expenses);
  const [open, setOpen] = useState(false);

  const handleExport = (format) => {
    exportExpenses(filters, format);
    setOpen(false);
  };

  // Don't render if there's nothing to export
  if (expenses.length === 0) return null;

  return (
    <div className="export-wrapper">
      <button className="export-trigger" onClick={() => setOpen((o) => !o)}>
        <span className="export-icon">↓</span>
        Export
        <span
          className={`export-chevron ${open ? "export-chevron--open" : ""}`}
        >
          ›
        </span>
      </button>

      {open && (
        <>
          {/* Backdrop to close on outside click */}
          <div className="export-backdrop" onClick={() => setOpen(false)} />
          <div className="export-menu">
            <button
              className="export-option"
              onClick={() => handleExport("csv")}
            >
              <span className="export-option-icon">📄</span>
              <div>
                <div className="export-option-label">Export as CSV</div>
                <div className="export-option-sub">
                  Opens in Excel, Sheets, Numbers
                </div>
              </div>
            </button>
            <button
              className="export-option"
              onClick={() => handleExport("excel")}
            >
              <span className="export-option-icon">📊</span>
              <div>
                <div className="export-option-label">Export as Excel</div>
                <div className="export-option-sub">
                  Styled .xlsx with header row
                </div>
              </div>
            </button>

            <div className="export-footer">
              {expenses.length} expense{expenses.length !== 1 ? "s" : ""} with
              current filters
            </div>
          </div>
        </>
      )}
    </div>
  );
}
