import { Briefcase, Compass, GraduationCap, Sparkles } from "lucide-react";

/**
 * CareerOverview Component
 * 
 * Displays the student's profile context, their active career target,
 * and allows switching between available career tracks to inspect differing skill benchmarks.
 *
 * @param {Object} props
 * @param {Object} props.student - Student details { name, email, education, career_goal }
 * @param {string} props.careerName - Active career name (e.g., "Frontend Developer")
 * @param {string} [props.careerDescription] - Short description of the selected career role
 * @param {Array<{id: string, name: string}>} [props.careerList] - List of available career paths
 * @param {string} [props.selectedCareerId] - Currently selected career identifier
 * @param {Function} [props.onCareerChange] - Callback when user switches career path
 * @param {number} [props.readinessScore] - Overall career readiness percentage
 */
export default function CareerOverview({
  student,
  careerName,
  careerDescription,
  careerList = [],
  selectedCareerId,
  onCareerChange,
  readinessScore,
}) {
  const displayName = student?.name || "Student";
  const displayEducation = student?.education || "Undergraduate Student";
  const displayGoal = careerName || student?.career_goal || "Selected Career";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-sky-800/30 bg-gradient-to-r from-sky-950 via-sky-900 to-[#0c4a6e] p-6 text-white shadow-md sm:p-8">
      {/* Decorative subtle ambient backdrop with sky blue and soft pink glow */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sky-400/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-16 h-60 w-60 rounded-full bg-pink-400/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Column: Student identity & target career */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/25 px-3 py-1 text-xs font-semibold tracking-wide text-sky-200 backdrop-blur-sm border border-sky-400/30">
              <Sparkles className="h-3.5 w-3.5 text-sky-300" aria-hidden="true" />
              Career Readiness Diagnostic
            </span>
            {student?.email && (
              <span className="text-xs text-sky-200/80">
                {student.email}
              </span>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Welcome back, <span className="text-sky-300">{displayName}</span>
            </h1>
            <p className="mt-1 text-sm text-sky-100/90 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-sky-300 shrink-0" aria-hidden="true" />
              <span>{displayEducation}</span>
            </p>
          </div>

          {careerDescription && (
            <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-sky-100/90 bg-white/5 p-3.5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <span className="font-semibold text-white">Target Role Scope: </span>
              {careerDescription}
            </p>
          )}
        </div>

        {/* Right Column: Career selection & quick readiness badge */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center lg:flex-col lg:items-end">
          {careerList && careerList.length > 0 && onCareerChange && (
            <div className="w-full sm:w-auto">
              <label
                htmlFor="career-select"
                className="block text-xs font-medium text-sky-200 mb-1.5 flex items-center gap-1.5"
              >
                <Briefcase className="h-3.5 w-3.5 text-sky-300" aria-hidden="true" />
                Target Career Path:
              </label>
              <select
                id="career-select"
                value={selectedCareerId}
                onChange={(e) => onCareerChange(e.target.value)}
                className="w-full sm:w-64 rounded-xl border border-white/20 bg-sky-950/80 px-3.5 py-2.5 text-sm font-medium text-white shadow-inner outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30 cursor-pointer"
              >
                {careerList.map((item) => (
                  <option key={item.id} value={item.id} className="bg-sky-950 text-white">
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-2.5 border border-white/10 backdrop-blur-sm">
            <Compass className="h-5 w-5 text-sky-300" aria-hidden="true" />
            <div>
              <div className="text-[11px] uppercase tracking-wider text-sky-200 font-medium">
                Current Goal
              </div>
              <div className="text-sm font-bold text-white">
                {displayGoal}
              </div>
            </div>
            {typeof readinessScore === "number" && (
              <div className="ml-3 border-l border-white/20 pl-3 text-right">
                <span className="text-[11px] uppercase tracking-wider text-sky-200 block font-medium">
                  Readiness
                </span>
                <span className="text-sm font-extrabold text-sky-300">
                  {readinessScore}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
