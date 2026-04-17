import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { useExpenseStore } from "../../stores/useExpenseStore";
import ExpenseForm from "./ExpenseForm";
import "./ExpenseModal.css";

export default function ExpenseModal({
  date,
  expenses,
  initialExpense,
  onClose,
}) {
  const deleteExpense = useExpenseStore((s) => s.deleteExpense);

  // 'list' | 'create' | 'edit'
  const [view, setView] = useState("list");
  const [editTarget, setEditTarget] = useState(initialExpense ?? null);
  const [deleting, setDeleting] = useState(null); // id of expense being deleted

  const modalRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Trap focus inside modal
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  const handleEdit = (expense) => {
    setEditTarget(expense);
    setView("edit");
  };

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
    // Close modal if this was the last expense
    if (expenses.length <= 1) onClose();
  };

  const handleFormSuccess = () => {
    setView("list");
    setEditTarget(null);
  };

  const dayTotal = expenses.reduce((s, e) => s + parseFloat(e.amount), 0);

  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Expenses for ${format(date, "MMMM d, yyyy")}`}
    >
      <div className="modal" ref={modalRef} tabIndex={-1}>
        {/* ── Header ─────────────────────────── */}
        <div className="modal-header">
          <div className="modal-header-left">
            {/* Back button when in form views */}
            {view !== "list" && (
              <button
                className="modal-back"
                onClick={() => {
                  setView("list");
                  setEditTarget(null);
                }}
              >
                ‹
              </button>
            )}
            <div>
              <div className="modal-date">{format(date, "EEEE, MMMM d")}</div>
              <div className="modal-date-sub">
                {view === "list" &&
                  `${expenses.length} expense${expenses.length !== 1 ? "s" : ""}`}
                {view === "create" && "New expense"}
                {view === "edit" && "Edit expense"}
              </div>
            </div>
          </div>

          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {/* ── Body ───────────────────────────── */}
        <div className="modal-body">
          {/* List view */}
          {view === "list" && (
            <>
              {expenses.length === 0 ? (
                <div className="modal-empty">No expenses on this day yet.</div>
              ) : (
                <div className="modal-list">
                  {expenses.map((exp) => (
                    <ExpenseRow
                      key={exp.id}
                      expense={exp}
                      isDeleting={deleting === exp.id}
                      onEdit={() => handleEdit(exp)}
                      onDelete={() => handleDelete(exp)}
                    />
                  ))}
                </div>
              )}

              {/* Day total */}
              {expenses.length > 0 && (
                <div className="modal-total-row">
                  <span className="modal-total-label">Day total</span>
                  <span className="modal-total-value">
                    ${dayTotal.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Add expense CTA */}
              <button
                className="modal-add-btn"
                onClick={() => {
                  setEditTarget(null);
                  setView("create");
                }}
              >
                + Add expense for this day
              </button>
            </>
          )}

          {/* Create / Edit form */}
          {(view === "create" || view === "edit") && (
            <ExpenseForm
              initialDate={date}
              editExpense={view === "edit" ? editTarget : null}
              onSuccess={handleFormSuccess}
              onCancel={() => {
                setView("list");
                setEditTarget(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ── ExpenseRow ─────────────────────────────────────────────────────────────────
function ExpenseRow({ expense, isDeleting, onEdit, onDelete }) {
  const color = expense.category?.color ?? "#a8a49e";
  const amt = parseFloat(expense.amount);

  return (
    <div className={`exp-row ${isDeleting ? "exp-row--deleting" : ""}`}>
      {/* Color dot */}
      <span className="exp-row-dot" style={{ background: color }} />

      {/* Info */}
      <div className="exp-row-info">
        <div className="exp-row-cat">{expense.category?.name ?? "Other"}</div>
        {expense.notes && <div className="exp-row-note">{expense.notes}</div>}
      </div>

      {/* Right side — amount + payment method */}
      <div className="exp-row-right">
        <div className="exp-row-amt">${amt.toFixed(2)}</div>
        {expense.paymentMethod?.name && (
          <div className="exp-row-pm">{expense.paymentMethod.name}</div>
        )}
      </div>

      {/* Actions */}
      <div className="exp-row-actions">
        <button
          className="exp-row-btn exp-row-btn--edit"
          onClick={onEdit}
          disabled={isDeleting}
          aria-label="Edit expense"
        >
          Edit
        </button>
        <button
          className="exp-row-btn exp-row-btn--delete"
          onClick={onDelete}
          disabled={isDeleting}
          aria-label="Delete expense"
        >
          {isDeleting ? "..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
