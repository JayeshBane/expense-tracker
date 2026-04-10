import { useEffect } from "react";
import { useExpenseStore } from "./stores/useExpenseStore";
import { useMetaStore } from "./stores/useMetaStore";

import "./App.css";

function App() {
  const fetchExpenses = useExpenseStore((s) => s.fetchExpenses);
  const fetchMeta = useMetaStore((s) => s.fetchMeta);
  const error = useExpenseStore((s) => s.error);
  const clearError = useExpenseStore((s) => s.clearError);

  return <div className="App">Expense Tracker</div>;
}

export default App;
