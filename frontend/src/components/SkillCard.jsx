import { Check, AlertCircle, ArrowUpRight, Zap, BookOpen } from "lucide-react";
import { PROFICIENCY_LEVELS } from "../data/mockDashboardData";

/**
 * SkillCard Component
 * 
 * Reusable card representing an individual skill with:
 * - Current level vs Required level (0-5 scale)
 * - Visual step indicators
 * - Priority tag (Critical, High, Medium, Low)
 * - Skill gap indicator
 * - Status indicator (Met, Needs Improvement, Missing)
 *
 * @param {Object} props
 * @param {Object} props.skill - Skill data object
 * @param {string} props.skill.name - Skill name (e.g., "JavaScript")
 * @param {string} [props.skill.category] - "technical" | "professional"
 * @param {number} props.skill.current_level - Current proficiency (0 to 5)
 * @param {number} props.skill.required_level - Required career proficiency (0 to 5)
 * @param {number} props.skill.gap - Computed skill gap (max(required - current, 0))
 * @param {string} props.skill.priority - "Critical" | "High" | "Medium" | "Low"
 * @param {string} [props.skill.importance] - Context note explaining requirement
 * @param {boolean} [props.compact] - Compact presentation flag
 */
export default function SkillCard({ skill, compact = false }) {
  if (!skill) return null;

  const {
    name = "Skill Name",
    category = "technical",
    current_level = 0,
    required_level = 0,
    gap = 0,
    priority = "Low",
    importance = "",
  } = skill;

  const isMatched = gap === 0;
  const isMissing = current_level === 0;
  const isImproving = !isMatched && !isMissing;

  // Priority badge styling
  const getPriorityBadge = (p, isMet) => {
    if (isMet) {
      return {
        label: "Requirement Met",
        classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: Check,
      };
    }
    switch (p?.toLowerCase()) {
      case "critical":
        return {
          label: "Critical Priority",
          classes: "bg-rose-50 text-rose-700 border-rose-200",
          icon: AlertCircle,
        };
      case "high":
        return {
          label: "High Priority",
          classes: "bg-orange-50 text-orange-700 border-orange-200",
          icon: ArrowUpRight,
        };
      case "medium":
        return {
          label: "Medium Priority",
          classes: "bg-amber-50 text-amber-700 border-amber-200",
          icon: Zap,
        };
      case "low":
      default:
        return {
          label: "Low Priority",
          classes: "bg-slate-100 text-slate-700 border-slate-200",
          icon: BookOpen,
        };
    }
  };

  const badge = getPriorityBadge(priority, isMatched);
  const BadgeIcon = badge.icon;

  const currentMeta = PROFICIENCY_LEVELS[current_level] || PROFICIENCY_LEVELS[0];
  const requiredMeta = PROFICIENCY_LEVELS[required_level] || PROFICIENCY_LEVELS[0];

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        isMatched
          ? "border-emerald-200/70 bg-gradient-to-br from-white to-emerald-50/20"
          : isMissing
          ? "border-rose-200/70 bg-gradient-to-br from-white to-rose-50/20"
          : "border-slate-200/90 bg-white"
      } ${compact ? "p-4" : "p-5"}`}
    >
      <div>
        {/* Header: Skill Name, Category & Priority Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${
                  category === "professional"
                    ? "bg-purple-50 text-purple-700 border border-purple-200/70"
                    : "bg-blue-50 text-blue-700 border border-blue-200/70"
                }`}
              >
                {category}
              </span>
              {isMatched && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <Check className="h-3 w-3 stroke-[3]" />
                  <span>Target Met</span>
                </span>
              )}
            </div>
            <h3 className="text-base font-semibold text-[#0B1F3A] group-hover:text-blue-700 transition-colors">
              {name}
            </h3>
          </div>

          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${badge.classes}`}
          >
            <BadgeIcon className="h-3 w-3" />
            <span>{badge.label}</span>
          </span>
        </div>

        {/* Importance / Context note if present */}
        {importance && !compact && (
          <p className="mt-2.5 text-xs text-slate-500 leading-relaxed line-clamp-2">
            {importance}
          </p>
        )}
      </div>

      {/* Visual Proficiency Progress Indicators */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-slate-500">Current:</span>
            <span
              className={`font-semibold ${
                current_level > 0 ? "text-[#0B1F3A]" : "text-rose-600"
              }`}
            >
              Lvl {current_level} ({currentMeta.label})
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-slate-400">Required:</span>
            <span className="font-semibold text-slate-700">
              Lvl {required_level} ({requiredMeta.short})
            </span>
          </div>
        </div>

        {/* 5-Step Segmented Bar Visualizer */}
        <div className="grid grid-cols-5 gap-1.5">
          {[1, 2, 3, 4, 5].map((step) => {
            const isAcquired = step <= current_level;
            const isRequiredTarget = step === required_level;
            const isRequiredStep = step <= required_level;

            let segmentBg = "bg-slate-100";
            if (isAcquired) {
              segmentBg = isMatched ? "bg-emerald-500" : "bg-blue-600";
            } else if (isRequiredStep) {
              segmentBg = "bg-blue-100/70 border border-dashed border-blue-300";
            }

            return (
              <div key={step} className="group/step relative">
                <div
                  className={`h-2.5 w-full rounded-md transition-all ${segmentBg} ${
                    isRequiredTarget
                      ? "ring-2 ring-blue-500 ring-offset-1"
                      : ""
                  }`}
                  title={`Level ${step}: ${PROFICIENCY_LEVELS[step]?.label || ""}`}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom Gap Status Strip */}
        <div className="mt-3 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">
            Scale: 0 (None) to 5 (Proficient)
          </span>

          {gap > 0 ? (
            <span
              className={`font-bold ${
                isMissing ? "text-rose-600" : "text-amber-600"
              }`}
            >
              Gap: +{gap} {gap === 1 ? "level" : "levels"} needed
            </span>
          ) : (
            <span className="font-semibold text-emerald-600">
              Proficiency requirement fulfilled
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
