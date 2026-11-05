import { useState, useMemo } from "react";
import { CheckCircle2, TrendingUp, AlertTriangle, ListFilter, Search, Layers } from "lucide-react";
import SkillCard from "./SkillCard";

/**
 * SkillGapList Component
 * 
 * Renders categorized skill gap cards with:
 * - Filter tabs (All, Matched, Needs Improvement, Missing)
 * - Quick search and sort controls
 * - Empty states
 * - Responsive grid layout
 *
 * @param {Object} props
 * @param {Array<Object>} props.skills - Array of skill gap objects
 * @param {string} [props.title] - Section heading
 * @param {string} [props.initialFilter] - Default active tab ("all" | "matched" | "improving" | "missing")
 */
export default function SkillGapList({
  skills = [],
  title = "Skill Gap Breakdown",
  initialFilter = "all",
}) {
  const [filter, setFilter] = useState(initialFilter);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("priority"); // "priority" | "gap" | "name"

  // Priority weight for sorting
  const priorityWeight = {
    Critical: 4,
    High: 3,
    Medium: 2,
    Low: 1,
  };

  // Grouped counters
  const counts = useMemo(() => {
    let matched = 0;
    let improving = 0;
    let missing = 0;

    skills.forEach((s) => {
      if (s.gap === 0) {
        matched += 1;
      } else if (s.current_level === 0) {
        missing += 1;
      } else {
        improving += 1;
      }
    });

    return {
      all: skills.length,
      matched,
      improving,
      missing,
    };
  }, [skills]);

  // Filtered and sorted skills
  const filteredSkills = useMemo(() => {
    let result = skills.filter((s) => {
      // Category / Status Filter
      if (filter === "matched" && s.gap !== 0) return false;
      if (filter === "missing" && s.current_level !== 0) return false;
      if (filter === "improving" && (s.gap === 0 || s.current_level === 0)) return false;

      // Search Query
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(query);
        const matchesCategory = s.category?.toLowerCase().includes(query);
        return matchesName || matchesCategory;
      }

      return true;
    });

    // Sort order
    return result.sort((a, b) => {
      if (sortBy === "priority") {
        const weightA = priorityWeight[a.priority] || 0;
        const weightB = priorityWeight[b.priority] || 0;
        if (weightB !== weightA) return weightB - weightA;
        return b.gap - a.gap;
      }
      if (sortBy === "gap") {
        return b.gap - a.gap;
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [skills, filter, searchTerm, sortBy]);

  const filterTabs = [
    { id: "all", label: "All Skills", count: counts.all, icon: Layers },
    { id: "matched", label: "Matched", count: counts.matched, icon: CheckCircle2, badgeColor: "text-emerald-700 bg-emerald-100/80" },
    { id: "improving", label: "Needs Improvement", count: counts.improving, icon: TrendingUp, badgeColor: "text-amber-700 bg-amber-100/80" },
    { id: "missing", label: "Missing Skills", count: counts.missing, icon: AlertTriangle, badgeColor: "text-rose-700 bg-rose-100/80" },
  ];

  return (
    <div className="space-y-5">
      {/* Header with Title and Search/Sort Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#0B1F3A]">
            {title}
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Compare target benchmark levels against your self-assessed proficiencies.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search skills..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm outline-none focus:border-blue-500"
            >
              <option value="priority">Sort: By Priority</option>
              <option value="gap">Sort: By Gap Size</option>
              <option value="name">Sort: Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {filterTabs.map((tab) => {
          const isActive = filter === tab.id;
          const TabIcon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                isActive
                  ? "bg-[#0B1F3A] text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80"
              }`}
            >
              <TabIcon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : tab.badgeColor || "bg-slate-100 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Skills Grid */}
      {filteredSkills.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSkills.map((skill) => (
            <SkillCard key={skill.name} skill={skill} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-12 px-4 text-center">
          <ListFilter className="h-10 w-10 text-slate-300 mb-3" />
          <h3 className="text-sm font-semibold text-[#0B1F3A]">
            No skills match your criteria
          </h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500">
            {searchTerm
              ? `No skills matching "${searchTerm}" found in this view.`
              : "There are no skills under this category filter."}
          </p>
          {(searchTerm || filter !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilter("all");
              }}
              className="mt-4 text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Reset filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
