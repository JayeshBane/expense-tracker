import { useState } from "react";
import { format } from "date-fns";
import ExpenseChip from "./ExpenseChip";
import ExpenseModal from "../ExpenseModal/ExpenseModal";
import "./DayCell.css";

const MAX_CHIPS = 2;

export default function DayCell({ date, expenses, isCurrentMonth, isToday }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExp, setSelectedExp] = useState(null); // pre-select an expense in modal

  const hasExpenses = expenses.length > 0;
  const overflow = Math.max(0, expenses.length - MAX_CHIPS);
  const dayTotal = expenses.reduce((s, e) => s + parseFloat(e.amount), 0);

  const handleChipClick = (expense) => {
    setSelectedExp(expense);
    setModalOpen(true);
  };

  const handleCellClick = () => {
    if (!isCurrentMonth) return;
    setSelectedExp(null);
    setModalOpen(true);
  };

  const cellClass = [
    "day-cell",
    !isCurrentMonth && "day-cell--other",
    isToday && "day-cell--today",
    hasExpenses && isCurrentMonth && "day-cell--active",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div className={cellClass} onClick={handleCellClick}>
        {/* Day number */}
        <span className={`day-num ${isToday ? "day-num--today" : ""}`}>
          {format(date, "d")}
        </span>

        {/* Expense chips — only render for current month */}
        {isCurrentMonth && (
          <>
            {expenses.slice(0, MAX_CHIPS).map((exp, i) => (
              <ExpenseChip
                key={exp.id ?? i}
                expense={exp}
                onClick={handleChipClick}
              />
            ))}

            {overflow > 0 && (
              <span className="day-overflow">+{overflow} more</span>
            )}

            {hasExpenses && (
              <span className="day-total">${dayTotal.toFixed(2)}</span>
            )}
          </>
        )}
      </div>

      {/* Modal — only mounts when open */}
      {modalOpen && (
        <ExpenseModal
          date={date}
          expenses={expenses}
          initialExpense={selectedExp}
          onClose={() => {
            setModalOpen(false);
            setSelectedExp(null);
          }}
        />
      )}
    </>
  );
}
