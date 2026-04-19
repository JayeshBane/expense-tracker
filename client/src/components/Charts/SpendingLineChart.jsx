import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";
import { useChartStore } from "../../stores/useChartStore";
import "./Charts.css";

const LINE_COLOR = "#6366f1";
const AREA_COLOR = "#6366f1";
const AVG_COLOR = "#f97316";

function LineTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="tooltip-label">{label}</div>
      <div className="tooltip-value">${payload[0].value.toFixed(2)}</div>
    </div>
  );
}

const formatY = (v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`;

export default function SpendingLineChart() {
  const lineData = useChartStore((s) => s.lineData);
  const lineMonths = useChartStore((s) => s.lineMonths);

  if (!lineData.length) {
    return <div className="chart-empty">No data for this period</div>;
  }

  const avg = lineData.reduce((s, d) => s + d.total, 0) / lineData.length;

  // Find highest and lowest months for annotation
  const maxMonth = lineData.reduce((a, b) => (a.total > b.total ? a : b));
  const minMonth = lineData.reduce((a, b) => (a.total < b.total ? a : b));

  return (
    <div>
      {/* Trend summary chips */}
      <div className="line-summary">
        <div className="line-chip line-chip--avg">
          <span className="line-chip-label">Avg/month</span>
          <span className="line-chip-value">${avg.toFixed(2)}</span>
        </div>
        <div className="line-chip line-chip--high">
          <span className="line-chip-label">Peak</span>
          <span className="line-chip-value">
            {maxMonth.month} · ${maxMonth.total.toFixed(2)}
          </span>
        </div>
        <div className="line-chip line-chip--low">
          <span className="line-chip-label">Lowest</span>
          <span className="line-chip-value">
            {minMonth.month} · ${minMonth.total.toFixed(2)}
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart
          data={lineData}
          margin={{ top: 12, right: 8, left: 0, bottom: 4 }}
        >
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={AREA_COLOR} stopOpacity={0.15} />
              <stop offset="95%" stopColor={AREA_COLOR} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0ede6"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#a8a49e" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#a8a49e" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatY}
            width={42}
          />
          <Tooltip content={<LineTooltip />} />

          {/* Average reference line */}
          <ReferenceLine
            y={avg}
            stroke={AVG_COLOR}
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{
              value: `Avg $${avg.toFixed(0)}`,
              fill: AVG_COLOR,
              fontSize: 10,
              position: "insideTopRight",
            }}
          />

          <Area
            type="monotone"
            dataKey="total"
            stroke={LINE_COLOR}
            strokeWidth={2.5}
            fill="url(#areaGrad)"
            dot={{
              r: 4,
              fill: "#fff",
              stroke: LINE_COLOR,
              strokeWidth: 2,
            }}
            activeDot={{
              r: 6,
              fill: LINE_COLOR,
              stroke: "#fff",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
