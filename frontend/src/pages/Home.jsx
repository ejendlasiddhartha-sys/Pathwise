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
} from "lucide-react";
import { fetchTestMessage } from "../services/api";

const features = [
  {
    title: "Student profile",
    text: "Store a name, education, and career goal so recommendations have a starting point.",
    icon: UserRound,
  },
  {
    title: "Skill gaps",
    text: "Compare current skills with the skills a chosen career usually requires.",
    icon: Target,
  },
  {
    title: "Next steps",
    text: "Turn those gaps into a short list of skills and certifications to work on.",
    icon: Route,
  },
];

export default function Home() {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  async function handleTestConnection() {
    setStatus("loading");
    setMessage("");

    try {
      const data = await fetchTestMessage();
      setStatus("success");
      setMessage(data.message);
    } catch (error) {
      setStatus("error");
      if (error.response) {
        setMessage(
          "The backend responded, but the test request did not succeed. Check the API terminal for details."
        );
      } else {
        setMessage(
          "The Pathwise backend is unavailable. Start it on http://localhost:8000, then try again."
        );
      }
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
          Student skill gap analysis
        </p>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-[#0B1F3A] sm:text-5xl">
          See the gap between your skills and your career.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
          Pathwise helps students compare what they already know with what a
          career asks for, then points to the skills and certifications worth
          learning next. This first version connects the app to its API. Career
          analysis arrives in a later milestone.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Open dashboard
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={status === "loading"}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-[#0B1F3A] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "loading" && (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            {status === "loading" ? "Checking connection..." : "Test backend connection"}
          </button>
        </div>

        {status === "success" && (
          <p className="mt-6 flex items-start gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {message}
          </p>
        )}
        {status === "error" && (
          <p className="mt-6 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {message}
          </p>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <article
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <Icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
              <h2 className="mt-4 text-lg font-semibold text-[#0B1F3A]">{feature.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.text}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
