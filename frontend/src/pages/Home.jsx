import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Route,
  Target,
  UserRound,
  Sparkles,
  ShieldCheck,
  Check,
} from "lucide-react";
import { fetchTestMessage } from "../services/api";
import { useAuth } from "../context/AuthContext";

const features = [
  {
    title: "Student profile",
    text: "Store your username, DOB, education credentials, and career goals so gap recommendations have a precise foundation.",
    icon: UserRound,
  },
  {
    title: "Skill gaps",
    text: "Compare your current proficiency levels directly against the skills modern industry tracks require.",
    icon: Target,
  },
  {
    title: "Next steps",
    text: "Convert those diagnostic gaps into an actionable roadmap of certifications and learning pathways to conquer next.",
    icon: Route,
  },
];

export default function Home() {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const { user, profile, isAuthenticated } = useAuth();

  async function handleTestConnection() {
    setStatus("loading");
    setMessage("");

    try {
      const data = await fetchTestMessage();
      setStatus("success");
      setMessage(data.message || "Connected successfully to Pathwise backend API.");
    } catch (error) {
      setStatus("error");
      if (error.response) {
        setMessage(
          "The backend responded, but the test request did not succeed. Check the API terminal for details."
        );
      } else {
        setMessage(
          "The Pathwise backend is offline or unreachable on http://localhost:8000. Start it, then test again."
        );
      }
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 p-8 shadow-md shadow-sky-900/5 sm:p-12 backdrop-blur-md">
        {/* Subtle Ambient Decorative Spots */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sky-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-pink-100/50 blur-3xl" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-200/80 bg-pink-50/90 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-pink-700 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-pink-500" />
            Personalized Career Diagnostics
          </div>

          <h1 className="mt-4 max-w-2xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            See the gap between your skills and your dream career.
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
            Pathwise empowers students to map current capabilities against real-world industry benchmarks, 
            identifying exactly which certifications and practical skills to pursue next.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {/* Primary Action Button in Sky Blue */}
            <Link
              to="/setup-profile"
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-md shadow-sky-500/25 transition hover:bg-sky-600 active:scale-95"
            >
              <span>{profile?.username ? "Update My Profile" : "Set Up My Profile"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-pink-200/80 bg-pink-50/80 px-5 py-3 text-sm font-semibold text-pink-700 shadow-xs transition hover:bg-pink-100 active:scale-95"
            >
              Open dashboard
            </Link>

            {/* Existing Test Backend Connection Button */}
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={status === "loading"}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70 active:scale-95"
            >
              {status === "loading" && (
                <Loader2 className="h-4 w-4 animate-spin text-sky-600" aria-hidden="true" />
              )}
              {status === "loading" ? "Checking API..." : "Test backend connection"}
            </button>
          </div>

          {/* Test Status Messages */}
          {status === "success" && (
            <p className="mt-6 flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800 animate-fade-in">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
              {message}
            </p>
          )}

          {status === "error" && (
            <p className="mt-6 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800 animate-fade-in">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
              {message}
            </p>
          )}
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="grid gap-5 md:grid-cols-3">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <article
              key={feature.title}
              className="group rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-500/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 transition group-hover:scale-105 group-hover:bg-sky-500 group-hover:text-white">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-slate-900">{feature.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.text}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
