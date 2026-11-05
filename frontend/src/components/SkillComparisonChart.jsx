import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { BarChart3, Radar as RadarIcon, Info } from "lucide-react";
import { PROFICIENCY_LEVELS } from "../data/mockDashboardData";

/**
 * Custom Tooltip for Recharts
 */
function CustomChartTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    if (!data) return null;

    const currentLvl = data.current_level ?? 0;
    const requiredLvl = data.required_level ?? 0;
    const gap = data.gap ?? Math.max(requiredLvl - currentLvl, 0);

    return (
      <div className="rounded-xl border border-slate-200 bg-white/95 p-3.5 shadow-lg backdrop-blur-md">
        <div className="text-xs font-bold text-[#0B1F3A] mb-1.5 flex items-center justify-between gap-4">
          <span>{data.name || label}</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              gap === 0
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {gap === 0 ? "Requirement Met" : `${gap} Level Gap`}
          </span>
        </div>

        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between gap-4 text-blue-700">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="h-2 w-2 rounded-full bg-blue-600 inline-block" />
              Current Proficiency:
            </span>
            <span className="font-semibold">
              Lvl {currentLvl} ({PROFICIENCY_LEVELS[currentLvl]?.short || "None"})
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 text-slate-700">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="h-2 w-2 rounded-full bg-[#0B1F3A] inline-block" />
              Required Benchmark:
            </span>
            <span className="font-semibold">
              Lvl {requiredLvl} ({PROFICIENCY_LEVELS[requiredLvl]?.short || "None"})
            </span>
          </div>
        </div>

        {data.priority && (
          <div className="mt-2 border-t border-slate-100 pt-1.5 text-[10px] text-slate-400">
            Priority: <span className="font-semibold text-slate-600">{data.priority}</span>
          </div>
        )}
      </div>
    );
  }
  return null;
}

/**
 * SkillComparisonChart Component
 * 
 * Interactive visualization comparing student's current proficiency
 * with the career role's required proficiency.
 * Supports toggling between a Grouped Bar Chart and a Radar Chart.
 *
 * @param {Object} props
 * @param {Array<Object>} props.skills - Array of skill objects
 * @param {string} [props.title] - Chart section title
 * @param {string} [props.defaultView] - "bar" | "radar"
 */
export default function SkillComparisonChart({
  skills = [],
  title = "Proficiency Gap Visualizer",
  defaultView = "bar",
}) {
  const [chartType, setChartType] = useState(defaultView);

  // Prepare chart dataset
  const chartData = skills.map((s) => ({
    name: s.name,
    current_level: s.current_level,
    required_level: s.required_level,
    gap: s.gap,
    priority: s.priority,
    category: s.category,
    fullMark: 5,
  }));

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
      {/* Header and Toggle Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              {chartType === "bar" ? (
                <BarChart3 className="h-4 w-4" />
              ) : (
                <RadarIcon className="h-4 w-4" />
              )}
            </span>
            <h2 className="text-base font-bold text-[#0B1F3A]">
              {title}
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Side-by-side assessment of current student level vs industry target (0-5 scale).
          </p>
        </div>

        {/* View Toggle Buttons */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setChartType("bar")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              chartType === "bar"
                ? "bg-white text-[#0B1F3A] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Bar View</span>
          </button>
          <button
            onClick={() => setChartType("radar")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              chartType === "radar"
                ? "bg-white text-[#0B1F3A] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <RadarIcon className="h-3.5 w-3.5" />
            <span>Radar View</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="mt-6 h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -15, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                interval={0}
                tick={({ x, y, payload }) => (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      x={0}
                      y={0}
                      dy={14}
                      textAnchor="end"
                      fill="#64748b"
                      fontSize={11}
                      transform="rotate(-30)"
                    >
                      {payload.value.length > 14
                        ? `${payload.value.substring(0, 12)}…`
                        : payload.value}
                    </text>
                  </g>
                )}
                stroke="#cbd5e1"
              />
              <YAxis
                domain={[0, 5]}
                ticks={[0, 1, 2, 3, 4, 5]}
                tick={{ fontSize: 11, fill: "#64748b" }}
                stroke="#cbd5e1"
                tickFormatter={(val) => `L${val}`}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: 12, fontSize: 12 }}
                formatter={(value) => (
                  <span className="font-medium text-slate-700">
                    {value === "current_level" ? "Current Proficiency" : "Required Benchmark"}
                  </span>
                )}
              />
              <Bar
                name="current_level"
                dataKey="current_level"
                fill="#2563eb"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
              <Bar
                name="required_level"
                dataKey="required_level"
                fill="#0B1F3A"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          ) : (
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis
                dataKey="name"
                tick={{ fill: "#475569", fontSize: 11, fontWeight: 500 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 5]}
                stroke="#cbd5e1"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: 10, fontSize: 12 }}
                formatter={(value) => (
                  <span className="font-medium text-slate-700">
                    {value === "current_level" ? "Current Proficiency" : "Required Benchmark"}
                  </span>
                )}
              />
              <Radar
                name="current_level"
                dataKey="current_level"
                stroke="#2563eb"
                fill="#3b82f6"
                fillOpacity={0.4}
              />
              <Radar
                name="required_level"
                dataKey="required_level"
                stroke="#0B1F3A"
                fill="#0B1F3A"
                fillOpacity={0.15}
              />
            </RadarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Metric helper footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <Info className="h-3.5 w-3.5 text-blue-600 shrink-0" />
          <span>
            Levels: 0 = No knowledge, 1 = Beginner, 2 = Basic, 3 = Intermediate, 4 = Advanced, 5 = Proficient.
          </span>
        </div>
        <div className="font-medium text-slate-600">
          Dark Navy = Career Requirement | Royal Blue = Student Current
        </div>
      </div>
    </div>
  );
}
