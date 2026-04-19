import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useChartStore } from "../../stores/useChartStore";
import "./Charts.css";

const FALLBACK_COLORS = [
  "#6366f1",
  "#f97316",
  "#22c55e",
  "#ef4444",
  "#a855f7",
  "#3b82f6",
  "#eab308",
  "#ec4899",
  "#14b8a6",
];

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { category, total } = payload[0].payload;
  const grandTotal = payload[0].payload.__grandTotal;
  const pct = grandTotal ? ((total / grandTotal) * 100).toFixed(1) : 0;

  return (
    <div className="chart-tooltip">
      <div className="tooltip-label">{category}</div>
      <div className="tooltip-value">${total.toFixed(2)}</div>
      <div className="tooltip-pct">{pct}% of total</div>
    </div>
  );
}

function PieLegend({ payload }) {
  return (
    <div className="pie-legend">
      {payload.map((entry, i) => (
        <div key={i} className="pie-legend-item">
          <span
            className="pie-legend-dot"
            style={{ background: entry.payload.fill }}
          />
          <span className="pie-legend-name">{entry.value}</span>
          <span className="pie-legend-amt">
            ${entry.payload.total.toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function SpendingPieChart() {
  const pieData = useChartStore((s) => s.pieData);

  if (!pieData.length) {
    return <div className="chart-empty">No data for this period</div>;
  }

  const grandTotal = pieData.reduce((s, d) => s + d.total, 0);

  // Inject grandTotal into each entry so the tooltip can compute %
  const data = pieData.map((d) => ({ ...d, __grandTotal: grandTotal }));

  return (
    <div className="pie-wrapper">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={64}
            outerRadius={100}
            paddingAngle={3}
            strokeWidth={0}
          >
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={
                  entry.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length]
                }
              />
            ))}
          </Pie>
          <Tooltip content={<PieTooltip />} />
          <Legend content={<PieLegend />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Centre total label — sits over the donut hole */}
      <div className="pie-center">
        <div className="pie-center-label">Total</div>
        <div className="pie-center-value">${grandTotal.toFixed(2)}</div>
      </div>
    </div>
  );
}
