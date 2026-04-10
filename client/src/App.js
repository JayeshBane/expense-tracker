import { useEffect } from "react";
import { useExpenseStore } from "./stores/useExpenseStore";
import { useMetaStore } from "./stores/useMetaStore";

import CalendarView from "./components/Calendar/CalendarView";
import ChartSection from "./components/Charts/ChartSection";
import FilterPanel from "./components/FilterView/FilterPanel";
import FilteredListView from "./components/FilterView/FilteredListView";
import ExportButton from "./components/common/ExportButton";

import "./App.css";

function App() {
  const fetchExpenses = useExpenseStore((s) => s.fetchExpenses);
  const fetchMeta = useMetaStore((s) => s.fetchMeta);
  const error = useExpenseStore((s) => s.error);
  const clearError = useExpenseStore((s) => s.clearError);

  useEffect(() => {
    fetchMeta();
    fetchExpenses();
  }, [fetchMeta, fetchExpenses]);

  return (
    <div className="App">
      {/* Global error banner */}
      {error && (
        <div className="error-banner">
          {error}
          <button onClick={clearError}>×</button>
        </div>
      )}

      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">Expenses</h1>
        <div className="header-actions">
          <ExportButton />
        </div>
      </header>

      {/* Main content */}
      <main className="app-main">
        {/* Filter bar sits above the calendar */}
        <FilterPanel />

        {/* Calendar — primary view */}
        <CalendarView />

        {/* Filtered list — shows the same data as a table */}
        <FilteredListView />

        {/* Charts — below the calendar */}
        <ChartSection />
      </main>
    </div>
  );
}

export default App;
