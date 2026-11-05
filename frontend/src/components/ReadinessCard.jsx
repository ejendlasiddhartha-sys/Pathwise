import { CheckCircle2, TrendingUp, AlertTriangle, ShieldCheck } from "lucide-react";

/**
 * ReadinessCard Component
 * 
 * Displays the overall career readiness score calculated from the backend
 * formula: sum(weight * min(current_level, required_level)) / sum(weight * required_level) * 100.
 * Renders an SVG radial gauge, status tier, and quick metric pills.
 *
 * @param {Object} props
 * @param {number} props.score - Career readiness percentage (0-100)
 * @param {string} [props.careerName] - Career title
 * @param {number} [props.matchedCount] - Count of skills meeting or exceeding requirements
 * @param {number} [props.improvingCount] - Count of skills with partial progress
 * @param {number} [props.missingCount] - Count of skills with level 0
 * @param {number} [props.totalSkills] - Total skills evaluated
 */
export default function ReadinessCard({
  score = 0,
  careerName = "Career",
  matchedCount = 0,
  improvingCount = 0,
  missingCount = 0,
  totalSkills = 0,
}) {
  // Clamp score between 0 and 100
  const normalizedScore = Math.min(Math.max(Math.round(score), 0), 100);

  // SVG Radial circle calculations
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  // Determine readiness status tier
  const getTier = (val) => {
    if (val >= 80) {
      return {
        label: "Ready for Junior Roles",
        description: "Your proficiencies closely match or exceed entry-level industry expectations.",
        textColor: "text-emerald-700",
        badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        strokeColor: "#059669",
        gradientId: "gauge-emerald",
      };
    }
    if (val >= 60) {
      return {
        label: "Competitive & On Track",
        description: "You have strong foundations with a few targeted skill gaps to bridge before applying.",
        textColor: "text-blue-700",
        badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
        strokeColor: "#2563eb",
        gradientId: "gauge-blue",
      };
    }
    if (val >= 40) {
      return {
        label: "Foundational Progress",
        description: "Good initial traction. Focus on high-priority missing technical proficiencies.",
        textColor: "text-amber-700",
        badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
        strokeColor: "#d97706",
        gradientId: "gauge-amber",
      };
    }
    return {
      label: "Early Stage",
      description: "Significant skill gaps present. Systematic study of prerequisite core skills advised.",
      textColor: "text-rose-700",
      badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
      strokeColor: "#e11d48",
      gradientId: "gauge-rose",
    };
  };

  const tier = getTier(normalizedScore);

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      {/* Card Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            </span>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Readiness Score
            </h2>
          </div>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${tier.badgeBg}`}
          >
            {tier.label}
          </span>
        </div>

        {/* Central Radial Gauge and Score Display */}
        <div className="my-6 flex flex-col items-center justify-center sm:flex-row sm:gap-6">
          <div className="relative flex items-center justify-center">
            <svg className="h-32 w-32 -rotate-90 transform" viewBox="0 0 120 120">
              {/* Defs for gradients */}
              <defs>
                <linearGradient id="gauge-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
                <linearGradient id="gauge-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="gauge-amber" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="gauge-rose" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f87171" />
                  <stop offset="100%" stopColor="#e11d48" />
                </linearGradient>
              </defs>

              {/* Background track circle */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="10"
                fill="transparent"
              />

              {/* Active progress arc */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke={`url(#${tier.gradientId})`}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Score in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold tracking-tight text-[#0B1F3A]">
                {normalizedScore}%
              </span>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Readiness
              </span>
            </div>
          </div>

          <div className="mt-4 text-center sm:mt-0 sm:text-left">
            <h3 className="text-base font-semibold text-[#0B1F3A]">
              Fit for {careerName}
            </h3>
            <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-600">
              {tier.description}
            </p>
          </div>
        </div>
      </div>

      {/* Breakdown Pills Footer */}
      <div className="border-t border-slate-100 pt-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-emerald-50/70 p-2.5 border border-emerald-100/60">
            <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-emerald-800">
              <CheckCircle2 className="h-3 w-3" />
              <span>Matched</span>
            </div>
            <div className="mt-1 text-lg font-bold text-emerald-900">
              {matchedCount}
            </div>
          </div>

          <div className="rounded-xl bg-amber-50/70 p-2.5 border border-amber-100/60">
            <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-amber-800">
              <TrendingUp className="h-3 w-3" />
              <span>Improving</span>
            </div>
            <div className="mt-1 text-lg font-bold text-amber-900">
              {improvingCount}
            </div>
          </div>

          <div className="rounded-xl bg-rose-50/70 p-2.5 border border-rose-100/60">
            <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-rose-800">
              <AlertTriangle className="h-3 w-3" />
              <span>Missing</span>
            </div>
            <div className="mt-1 text-lg font-bold text-rose-900">
              {missingCount}
            </div>
          </div>
        </div>

        <p className="mt-3 text-center text-[11px] text-slate-400">
          Estimated benchmark across {totalSkills || (matchedCount + improvingCount + missingCount)} core competencies.
        </p>
      </div>
    </div>
  );
}
