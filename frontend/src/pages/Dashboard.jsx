import { useState, useMemo, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Target,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  GraduationCap,
  RotateCcw,
  Edit3,
} from "lucide-react";

import CareerOverview from "../components/CareerOverview";
import ReadinessCard from "../components/ReadinessCard";
import SkillComparisonChart from "../components/SkillComparisonChart";
import SkillGapList from "../components/SkillGapList";
import SkillCard from "../components/SkillCard";

import {
  MOCK_STUDENT,
  MOCK_DASHBOARD_DATA,
  MOCK_ALTERNATIVE_CAREERS,
} from "../data/mockDashboardData";

/**
 * Dashboard Page
 * 
 * Main student career readiness and skill gap dashboard.
 * Evaluates current proficiencies against target career requirements.
 */
export default function Dashboard() {
  const location = useLocation();

  // Retrieve student details from router navigation state or localStorage
  const [student, setStudent] = useState(() => {
    if (location.state?.student) {
      return location.state.student;
    }
    try {
      const stored = localStorage.getItem("pathwise_student");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore parse error and fallback
    }
    try {
      const fullProfile = localStorage.getItem("pathwise_profile_full");
      if (fullProfile) {
        const parsed = JSON.parse(fullProfile);
        return {
          id: 1,
          name: `${parsed.firstName || ""} ${parsed.lastName || ""}`.trim() || parsed.username,
          username: parsed.username,
          email: `${parsed.username}@student.pathwise.edu`,
          education:
            parsed.educationType === "Undergraduate"
              ? parsed.educationDetails?.pursuingQualification || "Undergraduate"
              : parsed.educationType,
          career_goal:
            parsed.employmentStatus === "Employed"
              ? parsed.employmentDetails?.jobRole || "Frontend Developer"
              : "Frontend Developer",
        };
      }
    } catch {
      // Ignore
    }
    return MOCK_STUDENT;
  });

  // Selected career track ID
  const [selectedCareerId, setSelectedCareerId] = useState(() => {
    const studentGoal = student?.career_goal?.toLowerCase() || "";
    if (studentGoal.includes("data")) return "data_analyst";
    if (studentGoal.includes("cloud")) return "cloud_engineer";
    return "frontend_developer";
  });

  // Current active career analysis data
  const currentCareerData = useMemo(() => {
    const matched = MOCK_ALTERNATIVE_CAREERS.find((c) => c.id === selectedCareerId);
    return matched ? matched.data : MOCK_DASHBOARD_DATA;
  }, [selectedCareerId]);

  // Derived metrics for summary cards
  const metrics = useMemo(() => {
    const skills = currentCareerData?.skills || [];
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

    // Top critical action items (skills with highest priority & gap)
    const priorityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
    const focusSkills = [...skills]
      .filter((s) => s.gap > 0)
      .sort((a, b) => {
        const weightDiff = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        if (weightDiff !== 0) return weightDiff;
        return b.gap - a.gap;
      })
      .slice(0, 3);

    return {
      total: skills.length,
      matched,
      improving,
      missing,
      focusSkills,
    };
  }, [currentCareerData]);

  // Reset to default sample student if needed
  const handleResetSample = () => {
    localStorage.removeItem("pathwise_student");
    localStorage.removeItem("pathwise_student_id");
    localStorage.removeItem("pathwise_profile_full");
    setStudent(MOCK_STUDENT);
    setSelectedCareerId("frontend_developer");
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* 1. Career & Student Identity Header */}
      <CareerOverview
        student={student}
        careerName={currentCareerData.career}
        careerDescription={currentCareerData.career_description}
        careerList={MOCK_ALTERNATIVE_CAREERS}
        selectedCareerId={selectedCareerId}
        onCareerChange={setSelectedCareerId}
        readinessScore={currentCareerData.readiness_score}
      />

      {/* 2. Top KPI Cards & Overall Readiness Metric */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Left 5 Cols: Circular Radial Readiness Card */}
        <div className="md:col-span-5 lg:col-span-5 flex">
          <div className="w-full">
            <ReadinessCard
              score={currentCareerData.readiness_score}
              careerName={currentCareerData.career}
              matchedCount={metrics.matched}
              improvingCount={metrics.improving}
              missingCount={metrics.missing}
              totalSkills={metrics.total}
            />
          </div>
        </div>

        {/* Right 7 Cols: Quick KPI Summary Cards */}
        <div className="md:col-span-7 lg:col-span-7 flex flex-col justify-between gap-4">
          <div className="grid grid-cols-2 gap-4 h-full">
            {/* Total Competencies Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Target Skills
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <Target className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-slate-900">
                  {metrics.total}
                </span>
                <p className="mt-1 text-xs text-slate-500">
                  Curated competencies required for entry-level {currentCareerData.career}.
                </p>
              </div>
            </div>

            {/* Matched Skills Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Requirements Met
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-emerald-700">
                    {metrics.matched}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    / {metrics.total}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Skills meeting or exceeding the target benchmark level.
                </p>
              </div>
            </div>

            {/* Need Improvement Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Needs Improvement
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <TrendingUp className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-amber-700">
                    {metrics.improving}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    in progress
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Partial knowledge acquired; target level not yet achieved.
                </p>
              </div>
            </div>

            {/* Missing Skills Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Missing Skills
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                  <AlertTriangle className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-pink-700">
                    {metrics.missing}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    level 0
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Required competencies with no current recorded knowledge.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Recharts Proficiency Comparison Visualizer */}
      <section>
        <SkillComparisonChart
          skills={currentCareerData.skills}
          title={`Proficiency Benchmark Analysis — ${currentCareerData.career}`}
          defaultView="bar"
        />
      </section>

      {/* 4. Priority Growth Focus Area (Top Critical Gaps to Tackle First) */}
      {metrics.focusSkills.length > 0 && (
        <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-50 text-pink-600">
                <Lightbulb className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Immediate Focus Areas (Highest Impact)
                </h2>
                <p className="text-xs text-slate-500">
                  Tackling these key gaps will provide the highest boost to your career readiness score.
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-500">
              Sorted by gap urgency
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {metrics.focusSkills.map((skill) => (
              <SkillCard key={skill.name} skill={skill} compact={false} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Comprehensive Skill Gap Breakdown List (Tabs, Search, Sort) */}
      <section>
        <SkillGapList
          skills={currentCareerData.skills}
          title="All Career Competencies"
          initialFilter="all"
        />
      </section>

      {/* 6. Dashboard Footer / Profile Quick Navigation */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500 shadow-xs">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-sky-600" />
          <span>
            Viewing diagnostic for <strong>{student.name}</strong> ({student.education || "Student"}).
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleResetSample}
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition"
            title="Reset sample profile"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Demo</span>
          </button>

          <Link
            to="/setup-profile"
            className="inline-flex items-center gap-1.5 font-bold text-sky-600 hover:text-sky-700 transition"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Update Profile & Goals</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
