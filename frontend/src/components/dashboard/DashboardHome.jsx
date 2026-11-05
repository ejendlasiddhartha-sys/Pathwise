import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Sparkles,
  TrendingUp,
  Target,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Award,
  Layers,
  ChevronRight,
  Route,
  Activity,
  Plus,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import CareerOverview from "../CareerOverview";
import ReadinessCard from "../ReadinessCard";
import SkillComparisonChart from "../SkillComparisonChart";
import SkillGapList from "../SkillGapList";
import SkillCard from "../SkillCard";
import {
  MOCK_STUDENT,
  MOCK_DASHBOARD_DATA,
  MOCK_ALTERNATIVE_CAREERS,
} from "../../data/mockDashboardData";

export default function DashboardHome({ onNavigateTab }) {
  const { user, profile, certifications } = useAuth();

  // Dynamic user display name
  const displayName = profile?.firstName || user?.firstName || user?.name || user?.username || "Student";
  const displayUsername = user?.username || profile?.username || "student";

  // Calculate profile completion percentage
  const profileCompletion = useMemo(() => {
    let score = 0;
    if (profile?.username || user?.username) score += 20;
    if (profile?.firstName || user?.firstName) score += 15;
    if (profile?.lastName || user?.lastName) score += 15;
    if (profile?.dob) score += 15;
    if (profile?.educationType) score += 15;
    if (profile?.employmentStatus) score += 10;
    if (certifications && certifications.length > 0) score += 10;
    return Math.min(score, 100);
  }, [profile, user, certifications]);

  // Derived Education Level display
  const educationLevelDisplay = useMemo(() => {
    if (!profile?.educationType) return "Undergraduate";
    if (profile.educationType === "Undergraduate") {
      return profile.educationDetails?.pursuingQualification || "Undergraduate";
    }
    if (profile.educationType === "Intermediate") {
      return `Intermediate (${profile.educationDetails?.intermediateStream || "General"})`;
    }
    if (profile.educationType === "School") {
      return `School (${profile.educationDetails?.schoolGrade || "Class 12"})`;
    }
    if (profile.educationType === "Completed Undergraduate") {
      return profile.employmentDetails?.degreeName || "Graduate Degree";
    }
    return profile.educationType;
  }, [profile]);

  // Student object for career overview
  const student = useMemo(() => {
    const fullName = [profile?.firstName, profile?.middleName, profile?.lastName].filter(Boolean).join(" ") || user?.name || "Student";
    const goal = profile?.employmentStatus === "Employed"
      ? profile?.employmentDetails?.jobRole || "Frontend Developer"
      : "Frontend Developer";

    return {
      id: 1,
      name: fullName,
      username: displayUsername,
      email: user?.email || `${displayUsername}@student.pathwise.edu`,
      education: educationLevelDisplay,
      career_goal: goal,
    };
  }, [profile, user, displayUsername, educationLevelDisplay]);

  // Selected career track ID
  const [selectedCareerId, setSelectedCareerId] = useState(() => {
    const goal = student?.career_goal?.toLowerCase() || "";
    if (goal.includes("data")) return "data_analyst";
    if (goal.includes("cloud")) return "cloud_engineer";
    return "frontend_developer";
  });

  const currentCareerData = useMemo(() => {
    const matched = MOCK_ALTERNATIVE_CAREERS.find((c) => c.id === selectedCareerId);
    return matched ? matched.data : MOCK_DASHBOARD_DATA;
  }, [selectedCareerId]);

  // Career Metrics
  const metrics = useMemo(() => {
    const skills = currentCareerData?.skills || [];
    let matched = 0;
    let improving = 0;
    let missing = 0;

    skills.forEach((s) => {
      if (s.gap === 0) matched++;
      else if (s.current_level === 0) missing++;
      else improving++;
    });

    const priorityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
    const focusSkills = [...skills]
      .filter((s) => s.gap > 0)
      .sort((a, b) => {
        const weightDiff = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        if (weightDiff !== 0) return weightDiff;
        return b.gap - a.gap;
      })
      .slice(0, 3);

    return { total: skills.length, matched, improving, missing, focusSkills };
  }, [currentCareerData]);

  // Recommended Career Opportunities based on active track
  const careerOpportunities = [
    { title: "Junior Frontend Engineer", company: "NextGen Cloud", fit: "88% Match", level: "Entry Level" },
    { title: "React Web Developer", company: "FinTech Global", fit: "75% Match", level: "Associate" },
    { title: "UI/UX Application Engineer", company: "Creative Tech Hub", fit: "68% Match", level: "Junior" },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* 1. WELCOME SECTION */}
      <div className="relative overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-r from-sky-500/10 via-white to-pink-500/10 p-6 sm:p-10 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-pink-200/80 bg-pink-50/90 px-3 py-1 text-xs font-bold text-pink-700">
              <Sparkles className="h-3.5 w-3.5 text-pink-500" />
              Dynamic Student Dashboard
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Welcome Back, {displayName}!
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
              Your journey towards achieving your goals starts here. Let's build your future with Pathwise.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigateTab("roadmap")}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-sky-500/20 transition hover:bg-sky-600 active:scale-95"
            >
              <Route className="h-4 w-4" />
              <span>View My Roadmap</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab("certifications")}
              className="inline-flex items-center gap-2 rounded-xl border border-pink-200 bg-pink-50 px-4 py-2.5 text-xs font-bold text-pink-700 shadow-xs hover:bg-pink-100 active:scale-95"
            >
              <Award className="h-4 w-4" />
              <span>Certifications</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. DASHBOARD INFORMATION CARDS (4 CARDS) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Education Level */}
        <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-sky-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Education Level
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-lg font-extrabold text-slate-900 truncate" title={educationLevelDisplay}>
              {profile?.educationType || "Undergraduate"}
            </h2>
            <p className="mt-1 text-xs text-slate-500 truncate" title={educationLevelDisplay}>
              {educationLevelDisplay}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Status</span>
            <span className="font-semibold text-sky-700">Verified Profile</span>
          </div>
        </div>

        {/* Card 2: Profile Completion Percentage */}
        <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-sky-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Profile Completion
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <h2 className="text-2xl font-extrabold text-slate-900">{profileCompletion}%</h2>
              <span className="text-xs font-bold text-pink-600">
                {profileCompletion === 100 ? "Complete" : "Action Needed"}
              </span>
            </div>
            {/* Progress bar */}
            <div className="mt-2 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-400 to-pink-500 transition-all duration-500"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={() => onNavigateTab("personal-details")}
              className="text-pink-600 hover:underline font-semibold"
            >
              Update details &rarr;
            </button>
            <span className="text-slate-400">All Steps</span>
          </div>
        </div>

        {/* Card 3: Learning Progress */}
        <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-sky-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Learning Progress
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-extrabold text-emerald-700">
                {currentCareerData.readiness_score}%
              </h2>
              <span className="text-xs text-slate-400">Readiness Score</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {metrics.matched} of {metrics.total} benchmark skills mastered
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">In Progress</span>
            <span className="font-semibold text-emerald-700">{metrics.improving} Skills Active</span>
          </div>
        </div>

        {/* Card 4: Recommended Career Opportunities */}
        <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-sky-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recommended Roles
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-base font-extrabold text-slate-900 truncate">
              {currentCareerData.career}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              3 High-match entry roles unlocked
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-amber-700 font-semibold">High Demand Track</span>
            <span className="text-slate-400">2026 Index</span>
          </div>
        </div>
      </div>

      {/* 3. DIAGNOSTIC HERO & BENCHMARK DIAGNOSTIC (Milestone 1 & 2 Preservation) */}
      <CareerOverview
        student={student}
        careerName={currentCareerData.career}
        careerDescription={currentCareerData.career_description}
        careerList={MOCK_ALTERNATIVE_CAREERS}
        selectedCareerId={selectedCareerId}
        onCareerChange={setSelectedCareerId}
        readinessScore={currentCareerData.readiness_score}
      />

      {/* 4. GAUGE & SKILL METRICS */}
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-5 flex">
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

        {/* Recommended Career Opportunities List */}
        <div className="md:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-sky-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Target Role Opportunities
                </h2>
              </div>
              <span className="text-xs text-slate-500">Curated for your profile</span>
            </div>

            <div className="mt-4 space-y-3">
              {careerOpportunities.map((opp, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 transition hover:border-sky-300 hover:bg-sky-50/40"
                >
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{opp.title}</h3>
                    <p className="text-xs text-slate-500">{opp.company} &bull; {opp.level}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block rounded-lg bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                      {opp.fit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Based on your educational background</span>
            <button
              type="button"
              onClick={() => onNavigateTab("roadmap")}
              className="inline-flex items-center gap-1 font-bold text-sky-600 hover:text-sky-700"
            >
              <span>Explore full trajectory</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. VISUAL RECHARTS PROFICIENCY BENCHMARK */}
      <section>
        <SkillComparisonChart
          skills={currentCareerData.skills}
          title={`Proficiency Benchmark Analysis — ${currentCareerData.career}`}
          defaultView="bar"
        />
      </section>

      {/* 6. CRITICAL FOCUS AREAS */}
      {metrics.focusSkills.length > 0 && (
        <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-50 text-pink-600">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Immediate Skill Gaps to Bridge
                </h2>
                <p className="text-xs text-slate-500">
                  Targeting these gaps will provide the highest boost to your career readiness.
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-400">Priority Ranked</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {metrics.focusSkills.map((skill) => (
              <SkillCard key={skill.name} skill={skill} compact={false} />
            ))}
          </div>
        </section>
      )}

      {/* 7. ALL COMPETENCIES LIST */}
      <section>
        <SkillGapList
          skills={currentCareerData.skills}
          title="All Career Competencies"
          initialFilter="all"
        />
      </section>
    </div>
  );
}
