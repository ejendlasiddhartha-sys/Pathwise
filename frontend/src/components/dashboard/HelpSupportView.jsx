import { useState } from "react";
import {
  HelpCircle,
  MessageSquare,
  AlertTriangle,
  Star,
  ChevronDown,
  ChevronUp,
  Mail,
  Send,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  FileQuestion,
  Headphones,
} from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "How does Pathwise calculate my Career Readiness Score?",
    a: "Your score is computed using the Milestone 2 benchmark formula: sum(weight * min(current_level, required_level)) / sum(weight * required_level) * 100. It measures your actual proficiency levels against curated industry baselines for your chosen career track.",
  },
  {
    q: "How can I update my target career role?",
    a: "You can change your target role directly from the Dashboard header selector dropdown, or by updating your Employment Details in the Personal Details page.",
  },
  {
    q: "Are the recommendations and roadmap milestones personalized?",
    a: "Yes! Pathwise analyzes your age, educational qualification (School, Intermediate, Undergraduate, or Graduate), current stream, and employment status to tailor achievable sequential milestones.",
  },
  {
    q: "How do I add a newly earned certification?",
    a: "Navigate to the Certifications tab on the sidebar and click 'Add Certification'. You can enter the issuing body, completion date, certificate ID, and upload documentation for verification.",
  },
];

export default function HelpSupportView() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Contact support form state
  const [contactForm, setContactForm] = useState({
    subject: "",
    category: "Technical Issue",
    message: "",
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Feedback form state
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Report problem modal
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportText, setReportText] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.subject || !contactForm.message) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactForm({ subject: "", category: "Technical Issue", message: "" });
      setContactSubmitted(false);
    }, 4000);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackComment("");
      setFeedbackSubmitted(false);
    }, 4000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Help & Support Center
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Find answers to frequently asked questions, report an issue, or connect with the Pathwise engineering team.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setReportModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Report a Problem</span>
          </button>
        </div>
      </div>

      {/* Grid: 2 Columns for FAQs and Contact Support */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: FAQs Accordion (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 text-sky-800">
            <FileQuestion className="h-5 w-5 text-sky-600" />
            <h2 className="text-base font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition hover:border-sky-300"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-4 sm:p-5 text-left font-semibold text-slate-900 focus:outline-none"
                  >
                    <span className="text-sm">{item.q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 shrink-0 text-sky-600" />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100 bg-slate-50/50 p-4 sm:p-5 text-xs sm:text-sm text-slate-600 leading-relaxed animate-fade-in">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Contact Support Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 text-sky-800">
            <Headphones className="h-5 w-5 text-sky-600" />
            <h2 className="text-base font-bold text-slate-900">
              Contact Support
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            {contactSubmitted ? (
              <div className="text-center py-6 animate-fade-in space-y-2">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Message sent!</h3>
                <p className="text-xs text-slate-600">
                  Our team has received your ticket and will follow up shortly via email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600">
                    Category
                  </label>
                  <select
                    value={contactForm.category}
                    onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900"
                  >
                    <option value="Technical Issue">Technical Issue</option>
                    <option value="Diagnostic & Gaps">Diagnostic & Skill Gaps</option>
                    <option value="Account & Auth">Account & Authentication</option>
                    <option value="Certifications">Certification Verification</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="Brief description of the query"
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Provide details about your question..."
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-sky-500 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-sky-600 active:scale-95"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send Support Request</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="rounded-3xl border border-pink-200/80 bg-gradient-to-r from-pink-50/50 via-white to-sky-50/50 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Submit Platform Feedback
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              How has your experience with Pathwise been so far? Rate our tool and tell us what we can improve.
            </p>
          </div>

          {feedbackSubmitted ? (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Thank you for your feedback!</span>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="flex flex-wrap items-center gap-3">
              {/* Star Rating */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        star <= feedbackRating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder="Optional thoughts..."
                className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800"
              />

              <button
                type="submit"
                className="rounded-xl bg-pink-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-pink-700 active:scale-95"
              >
                Submit Feedback
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Report Problem Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Report a Problem
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Encountered a bug or rendering issue? Submit the issue details below for rapid triaging.
            </p>

            {reportSubmitted ? (
              <div className="mt-4 text-center py-6 space-y-2">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
                <p className="text-xs font-bold text-slate-800">Issue reported successfully!</p>
                <button
                  type="button"
                  onClick={() => {
                    setReportSubmitted(false);
                    setReportModalOpen(false);
                  }}
                  className="mt-2 rounded-xl bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-700"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!reportText) return;
                  setReportSubmitted(true);
                }}
                className="mt-4 space-y-3"
              >
                <textarea
                  rows={4}
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Describe the steps to reproduce the problem..."
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900"
                  required
                />
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
