import { useState } from "react";
import CreatableSelect from "./CreatableSelect";
import InlineColorPicker from "./InlineColorPicker";
import { useMetaStore } from "../../stores/useMetaStore";
import "./CategoryCreatableSelect.css";

const DEFAULT_COLOR = "#6366f1";

export default function CategoryCreatableSelect({ value, onChange }) {
  const {
    categories,
    isCreating,
    createCategory,
    createError,
    clearCreateError,
  } = useMetaStore((s) => s);

  const [pendingName, setPendingName] = useState(null);
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR);

  // Step 1 — intercept the "create" call from CreatableSelect.
  // Instead of creating immediately, store the name and show the
  // color picker. Return a never-resolving Promise so CreatableSelect's
  // dropdown stays open while the picker is visible.
  const handleCreate = (name) => {
    clearCreateError();
    setPendingName(name);
    setSelectedColor(DEFAULT_COLOR);
    return new Promise(() => {});
  };

  // Step 2 — user picked a color and clicked Confirm.
  // Now actually call the store action.
  const handleConfirm = async () => {
    const created = await createCategory({
      name: pendingName,
      color: selectedColor,
    });
    if (created) {
      onChange(created);
      setPendingName(null);
      setSelectedColor(DEFAULT_COLOR);
    }
  };

  const handleCancel = () => {
    setPendingName(null);
    setSelectedColor(DEFAULT_COLOR);
    clearCreateError();
  };

  return (
    <div className="cat-cs-wrapper">
      <CreatableSelect
        options={categories}
        value={value}
        onChange={onChange}
        onCreate={handleCreate}
        placeholder="Category"
        isCreating={isCreating}
        renderOption={(option) => (
          <>
            <span
              className="cs-dot"
              style={{ background: option.color ?? "#a8a49e" }}
            />
            <span className="cs-option-label">{option.name}</span>
          </>
        )}
      />

      {/* Color picker panel — slides in below when a name is pending */}
      {pendingName && (
        <div className="cat-create-panel">
          <p className="cat-create-label">
            Pick a color for <strong>{pendingName}</strong>
          </p>

          <InlineColorPicker
            value={selectedColor}
            onChange={setSelectedColor}
          />

          {/* Preview swatch */}
          <div className="cat-preview">
            <span
              className="cat-preview-chip"
              style={{ background: selectedColor + "20", color: selectedColor }}
            >
              <span
                className="cat-preview-dot"
                style={{ background: selectedColor }}
              />
              {pendingName}
            </span>
          </div>

          {createError && <p className="cat-create-error">{createError}</p>}

          <div className="cat-create-actions">
            <button
              type="button"
              className="cat-confirm-btn"
              onClick={handleConfirm}
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Confirm"}
            </button>
            <button
              type="button"
              className="cat-cancel-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
