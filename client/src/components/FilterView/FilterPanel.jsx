import { useExpenseStore } from "../../stores/useExpenseStore";
import { useMetaStore } from "../../stores/useMetaStore";
import "./FilterPanel.css";

export default function FilterPanel() {
  const { filters, setFilter, clearFilters, fetchExpenses, isLoading } =
    useExpenseStore((s) => s);

  const { categories, paymentMethods } = useMetaStore((s) => s);

  const hasActiveFilters =
    filters.start ||
    filters.end ||
    filters.categoryId ||
    filters.paymentMethodId;

  const handleChange = (key, value) => {
    setFilter(key, value || null);
    fetchExpenses({ [key]: value || null });
  };

  const handleClear = () => {
    clearFilters();
    fetchExpenses({
      start: null,
      end: null,
      categoryId: null,
      paymentMethodId: null,
    });
  };

  return (
    <div className="filter-panel">
      <div className="filter-row">
        {/* ── Date range ───────────────────── */}
        <div className="filter-group">
          <label className="filter-label">From</label>
          <input
            type="date"
            className="filter-input"
            value={filters.start ?? ""}
            max={filters.end ?? ""}
            onChange={(e) => handleChange("start", e.target.value)}
          />
        </div>

        <div className="filter-sep">—</div>

        <div className="filter-group">
          <label className="filter-label">To</label>
          <input
            type="date"
            className="filter-input"
            value={filters.end ?? ""}
            min={filters.start ?? ""}
            onChange={(e) => handleChange("end", e.target.value)}
          />
        </div>

        {/* ── Category ─────────────────────── */}
        <div className="filter-group filter-group--grow">
          <label className="filter-label">Category</label>
          <div className="filter-select-wrap">
            <select
              className="filter-select"
              value={filters.categoryId ?? ""}
              onChange={(e) => handleChange("categoryId", e.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {/* Color dot for selected category */}
            {filters.categoryId &&
              (() => {
                const cat = categories.find(
                  (c) => c.id === parseInt(filters.categoryId),
                );
                return cat?.color ? (
                  <span
                    className="filter-cat-dot"
                    style={{ background: cat.color }}
                  />
                ) : null;
              })()}
          </div>
        </div>

        {/* ── Payment method ───────────────── */}
        <div className="filter-group filter-group--grow">
          <label className="filter-label">Payment method</label>
          <select
            className="filter-select"
            value={filters.paymentMethodId ?? ""}
            onChange={(e) => handleChange("paymentMethodId", e.target.value)}
          >
            <option value="">All methods</option>
            {paymentMethods.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* ── Clear button ─────────────────── */}
        {hasActiveFilters && (
          <div className="filter-group filter-group--end">
            <label className="filter-label">&nbsp;</label>
            <button
              className="filter-clear-btn"
              onClick={handleClear}
              disabled={isLoading}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* ── Active filter pills ───────────── */}
      {hasActiveFilters && (
        <div className="filter-pills">
          {filters.start && (
            <FilterPill
              label={`From ${filters.start}`}
              onRemove={() => handleChange("start", "")}
            />
          )}
          {filters.end && (
            <FilterPill
              label={`To ${filters.end}`}
              onRemove={() => handleChange("end", "")}
            />
          )}
          {filters.categoryId &&
            (() => {
              const cat = categories.find(
                (c) => c.id === parseInt(filters.categoryId),
              );
              return cat ? (
                <FilterPill
                  label={cat.name}
                  color={cat.color}
                  onRemove={() => handleChange("categoryId", "")}
                />
              ) : null;
            })()}
          {filters.paymentMethodId &&
            (() => {
              const pm = paymentMethods.find(
                (p) => p.id === parseInt(filters.paymentMethodId),
              );
              return pm ? (
                <FilterPill
                  label={pm.name}
                  onRemove={() => handleChange("paymentMethodId", "")}
                />
              ) : null;
            })()}
        </div>
      )}
    </div>
  );
}

// ── FilterPill ────────────────────────────────────────────────────────────────
function FilterPill({ label, color, onRemove }) {
  return (
    <span className="filter-pill">
      {color && <span className="pill-dot" style={{ background: color }} />}
      {label}
      <button
        className="pill-remove"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
      >
        ×
      </button>
    </span>
  );
}
