import { useState } from "react";
import { format } from "date-fns";
import { useExpenseStore } from "../../stores/useExpenseStore";
import { useMetaStore } from "../../stores/useMetaStore";
import CategoryCreatableSelect from "../common/CategoryCreatableSelect";
import CreatableSelect from "../common/CreatableSelect";
import "./ExpenseForm.css";

export default function ExpenseForm({
  initialDate,
  editExpense,
  onSuccess,
  onCancel,
}) {
  const { createExpense, updateExpense } = useExpenseStore((s) => s);
  const { paymentMethods, isCreating, createPaymentMethod } = useMetaStore(
    (s) => s,
  );

  const [form, setForm] = useState({
    amount: editExpense?.amount ?? "",
    expenseDate:
      editExpense?.expenseDate?.slice(0, 10) ??
      format(initialDate ?? new Date(), "yyyy-MM-dd"),
    category: editExpense?.category ?? null,
    paymentMethod: editExpense?.paymentMethod ?? null,
    notes: editExpense?.notes ?? "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const setField = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    // Clear the error for this field on change
    if (errors[key]) setErrors((e) => ({ ...e, [key]: null }));
  };

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (
      !form.amount ||
      isNaN(parseFloat(form.amount)) ||
      parseFloat(form.amount) <= 0
    ) {
      errs.amount = "Enter a valid amount greater than 0";
    }
    if (!form.expenseDate) {
      errs.expenseDate = "Date is required";
    }
    return errs;
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        amount: parseFloat(parseFloat(form.amount).toFixed(2)),
        expenseDate: form.expenseDate,
        categoryId: form.category?.id ?? null,
        paymentMethodId: form.paymentMethod?.id ?? null,
        notes: form.notes.trim() || null,
      };

      if (editExpense) {
        await updateExpense(editExpense.id, payload);
      } else {
        await createExpense(payload);
      }

      onSuccess?.();
    } catch (err) {
      setErrors({ submit: err.message ?? "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") onCancel?.();
  };

  const isEdit = !!editExpense;

  return (
    <div className="exp-form" onKeyDown={handleKeyDown}>
      {/* ── Amount ─────────────────────────────── */}
      <div className={`form-field ${errors.amount ? "form-field--error" : ""}`}>
        <label className="form-label" htmlFor="ef-amount">
          Amount
        </label>
        <div className="amount-input-wrap">
          <span className="amount-prefix">$</span>
          <input
            id="ef-amount"
            type="number"
            className="form-input amount-input"
            value={form.amount}
            onChange={(e) => setField("amount", e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            autoFocus
          />
        </div>
        {errors.amount && <span className="form-error">{errors.amount}</span>}
      </div>

      {/* ── Date ───────────────────────────────── */}
      <div
        className={`form-field ${errors.expenseDate ? "form-field--error" : ""}`}
      >
        <label className="form-label" htmlFor="ef-date">
          Date
        </label>
        <input
          id="ef-date"
          type="date"
          className="form-input"
          value={form.expenseDate}
          onChange={(e) => setField("expenseDate", e.target.value)}
          max={format(new Date(), "yyyy-MM-dd")}
        />
        {errors.expenseDate && (
          <span className="form-error">{errors.expenseDate}</span>
        )}
      </div>

      {/* ── Category ───────────────────────────── */}
      <div className="form-field">
        <label className="form-label">Category</label>
        <CategoryCreatableSelect
          value={form.category}
          onChange={(v) => setField("category", v)}
        />
      </div>

      {/* ── Payment method ─────────────────────── */}
      <div className="form-field">
        <label className="form-label">Payment method</label>
        <CreatableSelect
          options={paymentMethods}
          value={form.paymentMethod}
          onChange={(v) => setField("paymentMethod", v)}
          onCreate={(name) => createPaymentMethod({ name })}
          placeholder="Payment method"
          isCreating={isCreating}
        />
      </div>

      {/* ── Notes ──────────────────────────────── */}
      <div className="form-field">
        <label className="form-label" htmlFor="ef-notes">
          Notes
          <span className="form-label-opt">optional</span>
        </label>
        <textarea
          id="ef-notes"
          className="form-input form-textarea"
          value={form.notes}
          onChange={(e) => setField("notes", e.target.value)}
          placeholder="What was this for?"
          rows={3}
        />
      </div>

      {/* ── Submit error ────────────────────────── */}
      {errors.submit && (
        <div className="form-submit-error">{errors.submit}</div>
      )}

      {/* ── Actions ────────────────────────────── */}
      <div className="form-actions">
        <button
          type="button"
          className="form-btn form-btn--primary"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting
            ? isEdit
              ? "Saving..."
              : "Adding..."
            : isEdit
              ? "Save changes"
              : "Add expense"}
        </button>
        <button
          type="button"
          className="form-btn form-btn--ghost"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
