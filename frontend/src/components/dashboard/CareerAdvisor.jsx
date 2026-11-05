import { useState } from "react";
import {
  Sparkles,
  RefreshCw,
  Award,
  ExternalLink,
  Target,
  CheckCircle2,
  Clock,
  Search,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Layers,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function CareerAdvisor({ targetCareerId, targetCareerName }) {
  const { recommendations, isRecsLoading, recsError, loadRecommendations } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadRecommendations(null, targetCareerId, true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const rec = recommendations?.recommendation;
  const readinessScore = recommendations?.readiness_score ?? 65;
  const isCached = recommendations?.cached ?? false;
  const isGrounded = recommendations?.grounding_used ?? false;
  const prioritySkills = rec?.priority_skills || [];
  const certs = rec?.certifications || [];
  const nextSteps = rec?.next_steps || [];
  const sources = rec?.sources || [];
  const generatedAt = rec?.generated_at
    ? new Date(rec.generated_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "Recently";

  const getPriorityStyle = (priority) => {
    switch (priority?.toLowerCase()) {
      case "critical":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "high":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "medium":
      default:
        return "bg-sky-50 text-sky-700 border-sky-200";
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-sky-200/90 bg-gradient-to-br from-white via-sky-50/20 to-pink-50/25 p-6 sm:p-8 shadow-sm transition hover:shadow-md">
      {/* Decorative ambient spots */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-sky-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-pink-200/30 blur-3xl" />

      {/* Top Header Row */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-300/80 bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-800">
              <Sparkles className="h-3.5 w-3.5 text-sky-600 animate-pulse" />
              Gemini AI Career Advisor
            </span>

            {isGrounded ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                <Search className="h-3 w-3" />
                Google Search Grounded
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                <ShieldCheck className="h-3 w-3 text-slate-400" />
                Verified Career Standards
              </span>
            )}

            {isCached && (
              <span className="text-[11px] text-slate-400">
                (Cached Analysis)
              </span>
            )}
          </div>

          <h2 className="mt-2 text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            AI Recommendations for {targetCareerName || recommendations?.target_career_name || "Frontend Developer"}
          </h2>
        </div>

        {/* Action button & score pill */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Readiness gauge pill */}
          <div className="flex items-center gap-2 rounded-2xl border border-sky-200 bg-white px-3.5 py-2 shadow-xs">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Readiness</span>
              <span className="text-sm font-extrabold text-sky-700">{readinessScore}%</span>
            </div>
            <div className="h-7 w-7 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
              <Target className="h-4 w-4" />
            </div>
          </div>

          {/* Refresh button */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing || isRecsLoading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-pink-200 bg-pink-50/80 px-3.5 py-2 text-xs font-bold text-pink-700 shadow-xs transition hover:bg-pink-100 active:scale-95 disabled:opacity-60"
            title="Refresh recommendations"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing || isRecsLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh Analysis</span>
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isRecsLoading && (
        <div className="mt-6 space-y-4 animate-pulse">
          <div className="h-16 w-full rounded-2xl bg-sky-100/60" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-36 rounded-2xl bg-slate-100" />
            <div className="h-36 rounded-2xl bg-slate-100" />
            <div className="h-36 rounded-2xl bg-slate-100" />
          </div>
        </div>
      )}

      {/* Error / Offline State */}
      {!isRecsLoading && !rec && (
        <div className="relative z-10 mt-6 rounded-2xl border border-amber-200 bg-amber-50/80 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-900">
              {recsError ? "AI analysis temporarily unavailable" : "No recommendations yet"}
            </p>
            <p className="mt-1 text-xs text-amber-700">
              {recsError
                ? String(recsError)
                : "Start the FastAPI backend and click Refresh Analysis to generate your personalised Gemini career recommendations."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-amber-300 bg-white px-4 py-2 text-xs font-bold text-amber-800 shadow-xs transition hover:bg-amber-50 active:scale-95 disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Retry
          </button>
        </div>
      )}

      {/* Content Section */}
      {!isRecsLoading && rec && (
        <div className="relative z-10 mt-6 space-y-6">
          {/* Personalised AI Summary */}
          <div className="rounded-2xl border border-sky-100 bg-white/90 p-5 shadow-xs backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500 text-white shadow-xs">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium leading-relaxed text-slate-800">
                  {rec.summary}
                </p>

                {rec.changes_detected && rec.changes_detected.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs text-sky-800">
                    <span className="font-semibold text-sky-900">Analysis basis:</span>
                    {rec.changes_detected.map((change, i) => (
                      <span key={i} className="rounded-md bg-sky-50 px-2 py-0.5 text-[11px] font-medium border border-sky-100">
                        {change}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Last evaluated: {generatedAt}
                  </span>
                  <span>Backend Official Diagnostic: {readinessScore}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Three Priority Skills */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-sky-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Top Priority Skill Focus (Highest Career Impact)
                </h3>
              </div>
              <span className="text-xs text-slate-400">Strictly 3 key areas</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {prioritySkills.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-sky-300 hover:shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {item.skill}
                      </h4>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getPriorityStyle(
                          item.priority
                        )}`}
                      >
                        {item.priority}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      {item.reason}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Actionable Step:
                    </span>
                    <p className="text-xs font-semibold text-sky-800 bg-sky-50/70 p-2 rounded-xl border border-sky-100">
                      {item.suggested_action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Certifications with Official Links */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-pink-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Recommended Industry Certifications
                </h3>
              </div>
              <span className="text-xs text-slate-400">Official Provider Verified</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {certs.map((cert, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-pink-300 hover:shadow-sm"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                        <Award className="h-5 w-5" />
                      </div>
                      <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200 truncate max-w-[130px]">
                        {cert.provider}
                      </span>
                    </div>

                    <h4 className="mt-3 text-sm font-bold text-slate-900 leading-snug">
                      {cert.name}
                    </h4>

                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                      {cert.reason}
                    </p>

                    {cert.relevant_skills && cert.relevant_skills.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {cert.relevant_skills.slice(0, 3).map((s, i) => (
                          <span
                            key={i}
                            className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <a
                      href={cert.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-pink-200 bg-pink-50 py-2 text-xs font-bold text-pink-700 transition hover:bg-pink-100 active:scale-95"
                    >
                      <span>Official Provider Link</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps & Grounding Sources */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Immediate Next Steps */}
            {nextSteps.length > 0 && (
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <span className="text-xs font-bold uppercase text-slate-600 tracking-wider block mb-2">
                  Immediate Recommended Actions
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {nextSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Research Sources / Search Grounding links */}
            {sources.length > 0 && (
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <span className="text-xs font-bold uppercase text-slate-600 tracking-wider block mb-2">
                  Research Sources & Citations
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {sources.map((src, idx) => {
                    const title = typeof src === "object" ? src.title || src.url : String(src);
                    const url = typeof src === "object" ? src.url : String(src);
                    return (
                      <li key={idx} className="flex items-center gap-2 truncate">
                        <ExternalLink className="h-3 w-3 text-sky-500 shrink-0" />
                        {url && url.startsWith("http") ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-700 hover:underline truncate"
                          >
                            {title}
                          </a>
                        ) : (
                          <span className="truncate">{title}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
