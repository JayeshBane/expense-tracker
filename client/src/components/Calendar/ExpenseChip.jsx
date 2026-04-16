import "./ExpenseChip.css";

export default function ExpenseChip({ expense, onClick }) {
  const color = expense.category?.color ?? "#a8a49e";
  const label = expense.category?.name ?? "Other";
  const amt = parseFloat(expense.amount);

  return (
    <div
      className="exp-chip"
      style={{ "--chip-color": color }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(expense);
      }}
    >
      <span className="chip-dot" />
      <span className="chip-label">{label}</span>
      <span className="chip-amt">${amt.toFixed(2)}</span>
    </div>
  );
}
