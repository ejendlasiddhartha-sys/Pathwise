import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Mail,
  User,
  UserRound,
  Sparkles,
  Calendar,
  Edit3,
} from "lucide-react";
import { createStudent } from "../services/api";
import { useAuth } from "../context/AuthContext";

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export default function Profile() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [formData, setFormData] = useState({
    name: profile?.firstName ? `${profile.firstName} ${profile.lastName}` : user?.name || "",
    email: user?.email || "",
    education:
      profile?.educationType === "Undergraduate"
        ? profile?.educationDetails?.pursuingQualification || ""
        : profile?.educationType || "",
    career_goal:
      profile?.employmentStatus === "Employed"
        ? profile?.employmentDetails?.jobRole || ""
        : "",
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    education: false,
    career_goal: false,
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "success" | "error"
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateField = (name, value) => {
    const trimmed = (value || "").trim();
    switch (name) {
      case "name":
        if (!trimmed) return "Full name is required.";
        if (trimmed.length < 2) return "Full name must be at least 2 characters.";
        return "";
      case "email":
        if (!trimmed) return "Email address is required.";
        if (!EMAIL_REGEX.test(trimmed)) {
          return "Please enter a valid email address (e.g., student@example.com).";
        }
        return "";
      case "education":
        if (!trimmed) return "Education details are required.";
        return "";
      case "career_goal":
        if (!trimmed) return "Desired career role is required.";
        return "";
      default:
        return "";
    }
  };

  const validateForm = (values) => {
    const newErrors = {};
    Object.keys(values).forEach((field) => {
      const fieldError = validateField(field, values[field]);
      if (fieldError) {
        newErrors[field] = fieldError;
      }
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const fieldError = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      name: true,
      email: true,
      education: true,
      career_goal: true,
    });

    const formValidationErrors = validateForm(formData);
    setErrors(formValidationErrors);

    if (Object.keys(formValidationErrors).length > 0) {
      return;
    }

    setStatus("loading");
    setApiError("");
    setSuccessMessage("");

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      education: formData.education.trim(),
      career_goal: formData.career_goal.trim(),
    };

    try {
      const responseData = await createStudent(payload);

      if (responseData?.id) {
        localStorage.setItem("pathwise_student_id", String(responseData.id));
        localStorage.setItem("pathwise_student", JSON.stringify(responseData));
      }

      setStatus("success");
      setSuccessMessage(
        `Welcome, ${responseData.name || "Student"}! Your profile was created successfully. Redirecting to your dashboard...`
      );

      setTimeout(() => {
        navigate("/dashboard", {
          state: {
            studentId: responseData.id,
            student: responseData,
          },
        });
      }, 1200);
    } catch (error) {
      setStatus("error");
      if (!error.response) {
        // Offline / fallback persistence
        const fallbackStudent = {
          id: Date.now(),
          ...payload,
        };
        localStorage.setItem("pathwise_student_id", String(fallbackStudent.id));
        localStorage.setItem("pathwise_student", JSON.stringify(fallbackStudent));
        setStatus("success");
        setSuccessMessage(
          `Profile saved locally! Redirecting to your dashboard...`
        );
        setTimeout(() => {
          navigate("/dashboard", {
            state: {
              studentId: fallbackStudent.id,
              student: fallbackStudent,
            },
          });
        }, 1200);
      } else if (error.response.status === 409) {
        setApiError(
          error.response.data?.detail ||
            "A student profile with this email address already exists. Please use a different email."
        );
      } else if (error.response.status === 422) {
        const detail = error.response.data?.detail;
        if (Array.isArray(detail)) {
          const formattedDetails = detail.map((d) => d.msg || d.message).join(", ");
          setApiError(`Validation error: ${formattedDetails}`);
        } else if (typeof detail === "string") {
          setApiError(detail);
        } else {
          setApiError("The submitted profile data was invalid. Please check your inputs.");
        }
      } else {
        setApiError(
          error.response.data?.detail ||
            "An unexpected error occurred while saving your profile. Please try again."
        );
      }
    }
  };

  const isSubmitting = status === "loading";
  const isSuccess = status === "success";

  return (
    <div className="mx-auto max-w-2xl animate-fade-in space-y-6">
      {/* If the user already completed Profile Setup, show a card */}
      {profile?.username && (
        <div className="rounded-3xl border border-sky-200/90 bg-gradient-to-br from-sky-50/80 via-white to-pink-50/60 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 text-white font-bold shadow-sm">
                {(profile.firstName?.[0] || profile.username?.[0] || "U").toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <span className="text-xs font-semibold text-sky-700 bg-sky-100/70 px-2.5 py-0.5 rounded-full">
                    @{profile.username}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Full profile setup is active &bull; {profile.educationType}
                </p>
              </div>
            </div>

            <Link
              to="/setup-profile"
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-sky-600 self-start sm:self-auto"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Open Setup Wizard
            </Link>
          </div>
        </div>
      )}

      {/* Main Student Profile Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        {/* Header Badge & Title */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold text-sky-800">
            <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
            Student Registration
          </div>

          <Link
            to="/setup-profile"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-xl border border-pink-200/60 transition"
          >
            <Sparkles className="h-3.5 w-3.5 text-pink-500" />
            Switch to Setup Wizard
          </Link>
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
          Create Student Profile
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter your details and career aspirations. Pathwise will use this profile to analyze
          your skill gaps and recommend tailored learning pathways.
        </p>

        {/* Global Success Banner */}
        {isSuccess && (
          <div
            role="status"
            className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 shadow-xs animate-fade-in"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
            <div>
              <p className="font-semibold">{successMessage}</p>
              <p className="mt-1 text-xs text-emerald-700">
                Redirecting to your dashboard...
              </p>
            </div>
          </div>
        )}

        {/* Global Error Banner */}
        {status === "error" && apiError && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-900 shadow-xs animate-fade-in"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
            <div>
              <p className="font-semibold">Could not create profile</p>
              <p className="mt-1 text-xs text-red-700">{apiError}</p>
            </div>
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <User className="h-4 w-4" aria-hidden="true" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting || isSuccess}
                className={`w-full rounded-xl border bg-white py-2.5 pr-4 pl-10 text-sm text-slate-900 placeholder:text-slate-400 shadow-xs focus:outline-none focus:ring-2 ${
                  errors.name
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-slate-300 focus:border-sky-500 focus:ring-sky-200"
                } disabled:cursor-not-allowed disabled:bg-slate-50`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail className="h-4 w-4" aria-hidden="true" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="e.g. rahul@example.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting || isSuccess}
                className={`w-full rounded-xl border bg-white py-2.5 pr-4 pl-10 text-sm text-slate-900 placeholder:text-slate-400 shadow-xs focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-slate-300 focus:border-sky-500 focus:ring-sky-200"
                } disabled:cursor-not-allowed disabled:bg-slate-50`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Education */}
          <div>
            <label htmlFor="education" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Education <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <GraduationCap className="h-4 w-4" aria-hidden="true" />
              </div>
              <input
                id="education"
                name="education"
                type="text"
                placeholder="e.g. B.Tech CSE, 2nd Year"
                value={formData.education}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting || isSuccess}
                className={`w-full rounded-xl border bg-white py-2.5 pr-4 pl-10 text-sm text-slate-900 placeholder:text-slate-400 shadow-xs focus:outline-none focus:ring-2 ${
                  errors.education
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-slate-300 focus:border-sky-500 focus:ring-sky-200"
                } disabled:cursor-not-allowed disabled:bg-slate-50`}
              />
            </div>
            {errors.education && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.education}
              </p>
            )}
          </div>

          {/* Desired Career Role */}
          <div>
            <label htmlFor="career_goal" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Desired Career Role <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Briefcase className="h-4 w-4" aria-hidden="true" />
              </div>
              <input
                id="career_goal"
                name="career_goal"
                type="text"
                placeholder="e.g. Frontend Developer"
                value={formData.career_goal}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting || isSuccess}
                className={`w-full rounded-xl border bg-white py-2.5 pr-4 pl-10 text-sm text-slate-900 placeholder:text-slate-400 shadow-xs focus:outline-none focus:ring-2 ${
                  errors.career_goal
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-slate-300 focus:border-sky-500 focus:ring-sky-200"
                } disabled:cursor-not-allowed disabled:bg-slate-50`}
              />
            </div>
            {errors.career_goal && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.career_goal}
              </p>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-sky-500/20 transition hover:bg-sky-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Creating profile...
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  Profile Created
                </>
              ) : (
                <>
                  <span>Create Profile & Continue</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
