import { useEffect } from "react";
import { useExpenseStore } from "./stores/useExpenseStore";
import { useMetaStore } from "./stores/useMetaStore";
import { useAuthStore } from "./stores/useAuthStore";

import CalendarView from "./components/Calendar/CalendarView";
import ChartSection from "./components/Charts/ChartSection";
import FilterPanel from "./components/FilterView/FilterPanel";
import FilteredListView from "./components/FilterView/FilteredListView";
import ExportButton from "./components/common/ExportButton";
import LoginView from "./components/Auth/LoginView";

import "./App.css";

function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const loadUser = useAuthStore((s) => s.loadUser);
  const logout = useAuthStore((s) => s.logout);

  const fetchExpenses = useExpenseStore((s) => s.fetchExpenses);
  const fetchMeta = useMetaStore((s) => s.fetchMeta);
  const error = useExpenseStore((s) => s.error);
  const clearError = useExpenseStore((s) => s.clearError);

  // Validate any stored token on startup.
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Load the user's data once authenticated.
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchMeta();
    fetchExpenses();
  }, [isAuthenticated, fetchMeta, fetchExpenses]);

  if (!isAuthenticated) {
    return <LoginView />;
  }

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
          {user?.email && <span className="user-email">{user.email}</span>}
          <button className="logout-button" onClick={logout}>
            Log out
          </button>
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
