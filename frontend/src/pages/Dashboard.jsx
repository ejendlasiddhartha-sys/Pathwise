import { LayoutDashboard } from "lucide-react";

const placeholders = [
  {
    title: "Profile",
    text: "Student name, education, and career goal will appear here.",
  },
  {
    title: "Skill gaps",
    text: "Missing skills for the chosen career will be listed here.",
  },
  {
    title: "Recommendations",
    text: "Suggested skills and certifications will be listed here.",
  },
];

export default function Dashboard() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800">
          <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
          Placeholder
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#0B1F3A]">
          Dashboard
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          This page is a starting point. Later milestones will load a student
          profile, compare skills, and show career recommendations.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {placeholders.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-dashed border-slate-300 bg-white p-6"
          >
            <h2 className="text-lg font-semibold text-[#0B1F3A]">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
