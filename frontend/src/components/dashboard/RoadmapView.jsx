import { useState, useMemo } from "react";
import {
  Route,
  CheckCircle2,
  Circle,
  Sparkles,
  BookOpen,
  Award,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Calendar,
  Layers,
  ChevronRight,
  Clock,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { calculateAge } from "../InteractiveDatePicker";

export default function RoadmapView() {
  const { profile, user } = useAuth();

  const userAge = useMemo(() => {
    if (profile?.dob) {
      return calculateAge(profile.dob).years || 21;
    }
    return 21;
  }, [profile?.dob]);

  const educationDisplay = useMemo(() => {
    if (profile?.educationType === "Undergraduate") {
      return profile.educationDetails?.pursuingQualification || "Undergraduate";
    }
    if (profile?.educationType === "Intermediate") {
      return `Intermediate (${profile.educationDetails?.intermediateStream || "General"})`;
    }
    if (profile?.educationType === "School") {
      return `School (${profile.educationDetails?.schoolGrade || "High School"})`;
    }
    if (profile?.educationType === "Completed Undergraduate") {
      return profile.employmentDetails?.degreeName || "Graduate";
    }
    return "Undergraduate";
  }, [profile]);

  const targetRole = useMemo(() => {
    if (profile?.employmentStatus === "Employed" && profile?.employmentDetails?.jobRole) {
      return profile.employmentDetails.jobRole;
    }
    return "Frontend & Web Architect";
  }, [profile]);

  // Dynamic roadmap stages tailored to user background
  const initialStages = useMemo(() => {
    return [
      {
        id: "stage-1",
        stageNumber: 1,
        title: "Foundational Competencies & Modern Tooling",
        phase: "Phase 1: Fundamentals",
        description: `Aligned for ${educationDisplay} (Age ${userAge}). Focus on solidifying core computational fundamentals and modern version control workflows.`,
        status: "Completed",
        progress: 100,
        milestones: [
          { id: "m1-1", text: "HTML5 Semantic Structure & Modern Accessibility (a11y)", done: true },
          { id: "m1-2", text: "CSS3 Flexbox, CSS Grid & Tailwind Responsive Systems", done: true },
          { id: "m1-3", text: "JavaScript ES6+ Asynchronous Programming & DOM APIs", done: true },
          { id: "m1-4", text: "Git Version Control, Branching Models & GitHub Workflows", done: true },
        ],
        skills: ["HTML5", "CSS3 / Tailwind", "Modern JS (ES6+)", "Git & GitHub"],
        certifications: ["freeCodeCamp Responsive Web Design", "Coursera Web Dev Foundations"],
        duration: "Completed &bull; 6 Weeks",
      },
      {
        id: "stage-2",
        stageNumber: 2,
        title: "Advanced Frameworks & State Architecture",
        phase: "Phase 2: In Progress",
        description: `Key focus for ${targetRole}. Building modular single-page component architectures, hooks, and scalable client-server API interactions.`,
        status: "In Progress",
        progress: 65,
        milestones: [
          { id: "m2-1", text: "React 19 Core: Hooks, Context API & Custom State Management", done: true },
          { id: "m2-2", text: "TypeScript Type Safety, Generics & Strict Typing", done: true },
          { id: "m2-3", text: "RESTful API Integration with Axios, Query Caching & Error Handlers", done: false },
          { id: "m2-4", text: "Client-side Routing, Protected Views & Authentication Guards", done: true },
        ],
        skills: ["React 19", "TypeScript", "Axios / REST", "React Router 7"],
        certifications: ["Meta Certified Frontend Developer", "Scrimba Frontend Path"],
        duration: "Current Focus &bull; Estimated 8 Weeks",
      },
      {
        id: "stage-3",
        stageNumber: 3,
        title: "Testing, Performance & Cloud Deployment",
        phase: "Phase 3: Upcoming",
        description: `Transitioning from code to production-grade applications. End-to-end testing, Web Vitals performance tuning, and CI/CD pipelines.`,
        status: "Upcoming",
        progress: 15,
        milestones: [
          { id: "m3-1", text: "Unit & Integration Testing with Vitest and React Testing Library", done: false },
          { id: "m3-2", text: "Core Web Vitals Optimization, Lazy Loading & Bundle Analysis", done: false },
          { id: "m3-3", text: "Cloud Deployment on Vercel / AWS Amplify with CI/CD Actions", done: false },
        ],
        skills: ["Vitest / Jest", "Web Vitals Tuning", "CI/CD & GitHub Actions", "Cloud Hosting"],
        certifications: ["AWS Certified Cloud Practitioner", "Docker Essentials"],
        duration: "Upcoming &bull; Estimated 6 Weeks",
      },
      {
        id: "stage-4",
        stageNumber: 4,
        title: "System Design, Leadership & Industry Mastery",
        phase: "Phase 4: Specialization",
        description: `Senior engineering leadership, distributed frontend micro-frontends, high-concurrency systems, and portfolio readiness.`,
        status: "Upcoming",
        progress: 0,
        milestones: [
          { id: "m4-1", text: "Frontend Architecture & System Design for Scalable Web Apps", done: false },
          { id: "m4-2", text: "Open Source Contributions & Production Portfolio Launch", done: false },
          { id: "m4-3", text: "Technical Interview Mastery: Data Structures & Algorithms", done: false },
        ],
        skills: ["System Design", "Micro-Frontends", "Technical Leadership", "Data Structures"],
        certifications: ["Google Cloud Associate Cloud Engineer", "Meta Senior Engineer Certificate"],
        duration: "Target Completion &bull; 10 Weeks",
      },
    ];
  }, [educationDisplay, targetRole, userAge]);

  const [stages, setStages] = useState(initialStages);

  // Toggle milestone checkbox
  const toggleMilestone = (stageId, milestoneId) => {
    setStages((prev) =>
      prev.map((stage) => {
        if (stage.id !== stageId) return stage;
        const updatedMilestones = stage.milestones.map((m) =>
          m.id === milestoneId ? { ...m, done: !m.done } : m
        );
        const doneCount = updatedMilestones.filter((m) => m.done).length;
        const progress = Math.round((doneCount / updatedMilestones.length) * 100);
        const status = progress === 100 ? "Completed" : progress > 0 ? "In Progress" : "Upcoming";
        return {
          ...stage,
          milestones: updatedMilestones,
          progress,
          status,
        };
      })
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-r from-sky-500/10 via-white to-pink-500/10 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold text-sky-800">
              <Sparkles className="h-3.5 w-3.5 text-sky-500" />
              Tailored Career Roadmap
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
              Career Trajectory & Milestones
            </h1>
            <p className="mt-1 text-sm text-slate-600 max-w-2xl">
              Dynamically personalized for your background: <strong>{educationDisplay}</strong> &bull; Age {userAge} &bull; Target: <strong>{targetRole}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="rounded-2xl border border-sky-200 bg-white p-3.5 text-center shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">Overall Progress</span>
              <span className="text-xl font-extrabold text-sky-600">60%</span>
            </div>
            <div className="rounded-2xl border border-pink-200 bg-pink-50/70 p-3.5 text-center shadow-xs">
              <span className="text-[11px] font-semibold text-pink-600 uppercase block">Active Track</span>
              <span className="text-xs font-bold text-pink-800 truncate block max-w-[120px]">
                {targetRole}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Timeline Stages */}
      <div className="space-y-6">
        {stages.map((stage, idx) => {
          const isCompleted = stage.status === "Completed";
          const isInProgress = stage.status === "In Progress";

          return (
            <div
              key={stage.id}
              className={`relative overflow-hidden rounded-3xl border bg-white p-6 sm:p-8 shadow-sm transition hover:shadow-md ${
                isInProgress
                  ? "border-sky-300 ring-2 ring-sky-200/50"
                  : isCompleted
                  ? "border-emerald-200"
                  : "border-slate-200"
              }`}
            >
              {/* Header of Stage */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-bold text-sm shadow-sm ${
                      isCompleted
                        ? "bg-emerald-500 text-white"
                        : isInProgress
                        ? "bg-sky-500 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : `0${stage.stageNumber}`}
                  </div>

                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
                      {stage.phase}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                      {stage.title}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      isCompleted
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : isInProgress
                        ? "bg-sky-50 text-sky-800 border border-sky-200"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {stage.status}
                  </span>
                  <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isCompleted ? "bg-emerald-500" : "bg-sky-500"
                      }`}
                      style={{ width: `${stage.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {stage.description}
              </p>

              {/* Milestones Checklist */}
              <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Stage Milestones (Click to toggle completion)
                </p>
                <div className="space-y-2.5">
                  {stage.milestones.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggleMilestone(stage.id, m.id)}
                      className="flex w-full items-start gap-3 text-left transition hover:text-sky-700"
                    >
                      {m.done ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
                      ) : (
                        <Circle className="h-5 w-5 shrink-0 text-slate-400 mt-0.5" />
                      )}
                      <span
                        className={`text-sm ${
                          m.done
                            ? "line-through text-slate-400"
                            : "font-medium text-slate-800"
                        }`}
                      >
                        {m.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Skills & Recommended Certifications */}
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase block mb-2">
                    Key Competencies Targeted
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {stage.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-sky-200 bg-sky-50/80 px-2.5 py-1 text-xs font-medium text-sky-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase block mb-2">
                    Recommended Credentials
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {stage.certifications.map((cert) => (
                      <span
                        key={cert}
                        className="rounded-lg border border-pink-200 bg-pink-50/80 px-2.5 py-1 text-xs font-medium text-pink-700 flex items-center gap-1"
                      >
                        <Award className="h-3 w-3 text-pink-500" />
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
