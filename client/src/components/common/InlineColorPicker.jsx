import "./InlineColorPicker.css";

const PRESET_COLORS = [
  "#6366f1",
  "#f97316",
  "#22c55e",
  "#ef4444",
  "#a855f7",
  "#3b82f6",
  "#eab308",
  "#ec4899",
  "#14b8a6",
  "#f43f5e",
  "#84cc16",
  "#06b6d4",
];

export default function InlineColorPicker({ value, onChange }) {
  return (
    <div className="color-picker">
      {PRESET_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          className={`color-swatch ${value === color ? "color-swatch--active" : ""}`}
          style={{ background: color }}
          onMouseDown={(e) => {
            e.preventDefault(); // prevent input blur before color registers
            onChange(color);
          }}
          aria-label={color}
        />
      ))}
    </div>
  );
}
