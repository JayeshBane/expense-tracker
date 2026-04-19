import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useChartStore } from "../../stores/useChartStore";
import "./Charts.css";

const BAR_COLOR = "#6366f1";
const BAR_COLOR_HOVER = "#4f46e5";
const EMPTY_COLOR = "#f0ede6";

// Custom tooltip
function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="tooltip-label">{label}</div>
      <div className="tooltip-value">${payload[0].value.toFixed(2)}</div>
    </div>
  );
}

// Custom Y-axis tick formatter
const formatY = (v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`;

export default function SpendingBarChart() {
  const barData = useChartStore((s) => s.barData);

  if (!barData.length) {
    return <div className="chart-empty">No data for this period</div>;
  }

  // Highlight the highest bar
  const maxVal = Math.max(...barData.map((d) => d.total));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={barData}
        margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
        barCategoryGap="35%"
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#f0ede6"
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: "#a8a49e" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => {
            const d = new Date(v + "T00:00:00");
            return d.getDate();
          }}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#a8a49e" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatY}
          width={42}
        />
        <Tooltip content={<BarTooltip />} cursor={{ fill: "#f5f3ef" }} />
        <Bar dataKey="total" radius={[4, 4, 0, 0]}>
          {barData.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.total === maxVal ? BAR_COLOR_HOVER : BAR_COLOR}
              opacity={entry.total === maxVal ? 1 : 0.75}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
