import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  User,
  Calendar as CalendarIcon,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Edit3,
  Sparkles,
  School,
  BookOpen,
  Award,
  Building,
  Check,
  AlertCircle,
  HelpCircle,
  Clock,
  Layers,
  Search,
} from "lucide-react";
import InteractiveDatePicker, { calculateAge } from "../components/InteractiveDatePicker";
import { useAuth } from "../context/AuthContext";

export default function ProfileSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, saveFullProfile } = useAuth();

  // Current onboarding step (1 to 6)
  // 1: Personal Details
  // 2: Date of Birth
  // 3: Educational Qualification
  // 4: Employment Status
  // 5: Profile Review
  // 6: Final Welcome Screen
  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    username: location.state?.initialUsername || user?.username || profile?.username || "",
    firstName: location.state?.initialName?.split(" ")[0] || user?.firstName || profile?.firstName || "",
    middleName: profile?.middleName || "",
    lastName: location.state?.initialName?.split(" ").slice(1).join(" ") || user?.lastName || profile?.lastName || "",

    // Step 2: Date of Birth
    dob: profile?.dob || "2003-08-15",

    // Step 3: Educational Qualification
    educationType: profile?.educationType || "Undergraduate", // "School" | "Intermediate" | "Undergraduate" | "Completed Undergraduate"
    educationDetails: {
      schoolGrade: profile?.educationDetails?.schoolGrade || "Class 12",
      intermediateStream: profile?.educationDetails?.intermediateStream || "MPC",
      intermediateOther: profile?.educationDetails?.intermediateOther || "",
      pursuingQualification: profile?.educationDetails?.pursuingQualification || "B.Tech Computer Science & Engineering",
    },

    // Step 4: Employment Status
    employmentStatus: profile?.employmentStatus || "Employed", // "Employed" | "Unemployed"
    employmentDetails: {
      jobRole: profile?.employmentDetails?.jobRole || "Frontend Engineer",
      jobTitle: profile?.employmentDetails?.jobTitle || "Junior Software Engineer",
      industrySector: profile?.employmentDetails?.industrySector || "Technology & Software",
      companyName: profile?.employmentDetails?.companyName || "Tech Innovations Ltd.",
      // Unemployed fields
      completedQualification: profile?.employmentDetails?.completedQualification || "B.Tech",
      degreeName: profile?.employmentDetails?.degreeName || "Computer Science",
      collegeName: profile?.employmentDetails?.collegeName || "National Institute of Technology",
      graduationYear: profile?.employmentDetails?.graduationYear || "2024",
    },
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Age calculation
  const calculatedAge = useMemo(() => calculateAge(formData.dob), [formData.dob]);

  // Step names for stepper
  const steps = [
    { number: 1, title: "Personal Details", icon: User },
    { number: 2, title: "Date of Birth", icon: CalendarIcon },
    { number: 3, title: "Education", icon: GraduationCap },
    { number: 4, title: "Employment", icon: Briefcase },
    { number: 5, title: "Review", icon: CheckCircle2 },
  ];

  // Validation functions
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.username.trim()) {
        newErrors.username = "Username is required.";
      } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username.trim())) {
        newErrors.username = "Username must be 3-20 alphanumeric characters or underscore.";
      }

      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required.";
      } else if (formData.firstName.trim().length < 2) {
        newErrors.firstName = "First name must have at least 2 characters.";
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required.";
      }
    }

    if (step === 2) {
      if (!formData.dob) {
        newErrors.dob = "Please select your date of birth.";
      } else {
        const { isFuture, isValid } = calculateAge(formData.dob);
        if (isFuture) {
          newErrors.dob = "Date of birth cannot be in the future.";
        } else if (!isValid) {
          newErrors.dob = "Please enter a valid date of birth.";
        }
      }
    }

    if (step === 3) {
      if (!formData.educationType) {
        newErrors.educationType = "Please select your current educational status.";
      }

      if (formData.educationType === "School") {
        if (!formData.educationDetails.schoolGrade?.trim()) {
          newErrors.schoolGrade = "Please enter your current school class or grade.";
        }
      } else if (formData.educationType === "Intermediate") {
        if (!formData.educationDetails.intermediateStream) {
          newErrors.intermediateStream = "Please select your stream.";
        } else if (
          formData.educationDetails.intermediateStream === "Other" &&
          !formData.educationDetails.intermediateOther?.trim()
        ) {
          newErrors.intermediateOther = "Please specify your stream.";
        }
      } else if (formData.educationType === "Undergraduate") {
        if (!formData.educationDetails.pursuingQualification?.trim()) {
          newErrors.pursuingQualification = "Please enter your pursuing qualification.";
        }
      }
    }

    if (step === 4) {
      if (!formData.employmentStatus) {
        newErrors.employmentStatus = "Please select your employment status.";
      }

      if (formData.employmentStatus === "Employed") {
        if (!formData.employmentDetails.jobRole?.trim()) {
          newErrors.jobRole = "Current Job Role is required.";
        }
        if (!formData.employmentDetails.jobTitle?.trim()) {
          newErrors.jobTitle = "Job Title / Designation is required.";
        }
        if (!formData.employmentDetails.industrySector?.trim()) {
          newErrors.industrySector = "Industry or Work Sector is required.";
        }
      } else if (formData.employmentStatus === "Unemployed") {
        if (!formData.employmentDetails.completedQualification?.trim()) {
          newErrors.completedQualification = "Completed undergraduate qualification is required.";
        }
        if (!formData.employmentDetails.degreeName?.trim()) {
          newErrors.degreeName = "Degree or course name is required.";
        }
        if (!formData.employmentDetails.collegeName?.trim()) {
          newErrors.collegeName = "College or University name is required.";
        }
        if (!formData.employmentDetails.graduationYear?.trim()) {
          newErrors.graduationYear = "Year of graduation is required.";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setErrors({});
      window.scrollTo({ top: 0, behavior: "smooth" });
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const jumpToStep = (stepNumber) => {
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentStep(stepNumber);
  };

  // Submit profile to backend & local storage
  const handleConfirmAndContinue = async () => {
    setIsSubmitting(true);
    try {
      await saveFullProfile(formData);
      setIsSubmitting(false);
      setCurrentStep(6); // Final Welcome Screen
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      // Still show welcome screen on fallback
      setCurrentStep(6);
    }
  };

  // Quick chips for undergraduate suggestions
  const ugSuggestions = ["B.Tech", "B.Sc", "B.Com", "BBA", "BCA", "BA", "MBBS", "B.Arch"];

  // Graduation years options (from current year down to 10 years ago)
  const currentYear = new Date().getFullYear();
  const gradYears = Array.from({ length: 15 }, (_, i) => String(currentYear - i));

  return (
    <div className="mx-auto max-w-3xl pb-16 pt-4 animate-fade-in">
      {/* ---------------- PROGRESS STEPPER (Steps 1 to 5) ---------------- */}
      {currentStep <= 5 && (
        <div className="mb-8">
          {/* Top Info Badge */}
          <div className="flex items-center justify-between px-2 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              Step {currentStep} of 5
            </span>
            <span className="text-xs font-medium text-slate-500">
              {Math.round((currentStep / 5) * 100)}% Completed
            </span>
          </div>

          {/* Stepper Progress Bar */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 transition-all duration-500"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>

          {/* Stepper Step Pills */}
          <div className="mt-4 grid grid-cols-5 gap-1.5 sm:gap-2">
            {steps.map((s) => {
              const StepIcon = s.icon;
              const isDone = currentStep > s.number;
              const isCurrent = currentStep === s.number;

              return (
                <button
                  key={s.number}
                  type="button"
                  disabled={!isDone && !isCurrent}
                  onClick={() => isDone && jumpToStep(s.number)}
                  className={`flex flex-col items-center gap-1 rounded-xl p-2 text-center transition ${
                    isCurrent
                      ? "bg-sky-50 text-sky-700 font-semibold ring-2 ring-sky-400"
                      : isDone
                      ? "text-slate-700 hover:bg-slate-100 cursor-pointer"
                      : "text-slate-300 cursor-not-allowed"
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition ${
                      isCurrent
                        ? "bg-sky-500 text-white shadow-sm"
                        : isDone
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isDone ? <Check className="h-4 w-4" /> : <StepIcon className="h-3.5 w-3.5" />}
                  </div>
                  <span className="hidden sm:inline text-[11px] truncate max-w-full">
                    {s.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------------- STEP 1: SET UP MY PROFILE ---------------- */}
      {currentStep === 1 && (
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-sm transition hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 border border-sky-100">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Set Up My Profile
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Enter your identity details to personalize your career gap roadmap.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-5">
            {/* Username */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-900">
                  Username <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-slate-500">Unique handle for your profile</span>
              </div>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                  @
                </span>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                    }))
                  }
                  placeholder="alex_dev"
                  className={`w-full rounded-xl border bg-white pl-8 pr-3.5 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-xs focus:outline-none focus:ring-2 ${
                    errors.username
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-slate-300 focus:border-sky-500 focus:ring-sky-200"
                  }`}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.username}
                </p>
              )}
            </div>

            {/* First Name & Middle Name */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-slate-900">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                  }
                  placeholder="Rahul"
                  className={`mt-2 w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-xs focus:outline-none focus:ring-2 ${
                    errors.firstName
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-slate-300 focus:border-sky-500 focus:ring-sky-200"
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-900">
                    Middle Name
                  </label>
                  <span className="text-[11px] font-medium text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200/60">
                    Optional
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.middleName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, middleName: e.target.value }))
                  }
                  placeholder="Kumar"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-xs focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-900">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                }
                placeholder="Sharma"
                className={`mt-2 w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-xs focus:outline-none focus:ring-2 ${
                  errors.lastName
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-slate-300 focus:border-sky-500 focus:ring-sky-200"
                }`}
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="mt-10 flex items-center justify-end border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-sky-500/20 transition hover:bg-sky-600 active:scale-95"
            >
              <span>Continue to Date of Birth</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ---------------- STEP 2: DATE OF BIRTH ---------------- */}
      {currentStep === 2 && (
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-sm transition hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 border border-sky-100">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Date of Birth
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Select your birth date. Your age will be automatically calculated and future dates are prevented.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <InteractiveDatePicker
              value={formData.dob}
              onChange={(newDob) => setFormData((prev) => ({ ...prev, dob: newDob }))}
              error={errors.dob}
            />
          </div>

          {/* Navigation Controls */}
          <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-sky-500/20 transition hover:bg-sky-600 active:scale-95"
            >
              <span>Continue to Education</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ---------------- STEP 3: EDUCATIONAL QUALIFICATION ---------------- */}
      {currentStep === 3 && (
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-sm transition hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 border border-sky-100">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Educational Qualification
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Select your current educational status to view customized qualification fields.
              </p>
            </div>
          </div>

          {/* 4 Educational Status Cards */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              {
                id: "School",
                title: "School",
                desc: "Currently studying in school / high school",
                icon: School,
              },
              {
                id: "Intermediate",
                title: "Intermediate",
                desc: "+2, Junior College, or pre-university",
                icon: Layers,
              },
              {
                id: "Undergraduate",
                title: "Undergraduate",
                desc: "Currently pursuing a bachelor's degree",
                icon: BookOpen,
              },
              {
                id: "Completed Undergraduate",
                title: "Completed Undergraduate",
                desc: "Graduated with a bachelor's or higher degree",
                icon: Award,
              },
            ].map((item) => {
              const ItemIcon = item.icon;
              const isSelected = formData.educationType === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, educationType: item.id }))
                  }
                  className={`flex items-start gap-3.5 rounded-2xl border p-4 text-left transition ${
                    isSelected
                      ? "border-sky-500 bg-sky-50/70 shadow-sm ring-2 ring-sky-300"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                      isSelected
                        ? "bg-sky-500 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <ItemIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">{item.title}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* DYNAMIC FIELDS BASED ON SELECTED QUALIFICATION */}
          <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50/70 p-5 sm:p-6">
            {/* A. SCHOOL */}
            {formData.educationType === "School" && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 text-sky-800">
                  <School className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    School Details
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900">
                    Current School Class or Grade <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.educationDetails.schoolGrade}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        educationDetails: {
                          ...prev.educationDetails,
                          schoolGrade: e.target.value,
                        },
                      }))
                    }
                    placeholder="e.g. Class 10, Class 12, 11th Grade"
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 shadow-xs focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  />
                  {errors.schoolGrade && (
                    <p className="mt-1 text-xs text-red-600">{errors.schoolGrade}</p>
                  )}
                </div>
              </div>
            )}

            {/* B. INTERMEDIATE */}
            {formData.educationType === "Intermediate" && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 text-sky-800">
                  <Layers className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Intermediate Stream Selection
                  </span>
                </div>

                <label className="block text-sm font-semibold text-slate-900">
                  Select Your Stream <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {["MPC", "BiPC", "MEC", "CEC", "Other"].map((stream) => {
                    const isSelected =
                      formData.educationDetails.intermediateStream === stream;
                    return (
                      <button
                        key={stream}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            educationDetails: {
                              ...prev.educationDetails,
                              intermediateStream: stream,
                            },
                          }))
                        }
                        className={`rounded-xl py-2.5 px-3 text-center text-sm font-bold transition ${
                          isSelected
                            ? "bg-sky-500 text-white shadow-xs ring-2 ring-sky-300"
                            : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {stream}
                      </button>
                    );
                  })}
                </div>

                {formData.educationDetails.intermediateStream === "Other" && (
                  <div className="mt-3">
                    <label className="block text-xs font-semibold text-slate-700">
                      Specify Stream Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.educationDetails.intermediateOther}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          educationDetails: {
                            ...prev.educationDetails,
                            intermediateOther: e.target.value,
                          },
                        }))
                      }
                      placeholder="e.g. Arts, Humanities, Vocational"
                      className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-xs focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    />
                    {errors.intermediateOther && (
                      <p className="mt-1 text-xs text-red-600">{errors.intermediateOther}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* C. UNDERGRADUATE */}
            {formData.educationType === "Undergraduate" && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 text-sky-800">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Undergraduate Details
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900">
                    Enter Your Pursuing Qualification <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enter any degree or course, such as B.Tech, B.Sc, B.Com, BBA, BCA, BA, or any other qualification.
                  </p>
                  <input
                    type="text"
                    value={formData.educationDetails.pursuingQualification}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        educationDetails: {
                          ...prev.educationDetails,
                          pursuingQualification: e.target.value,
                        },
                      }))
                    }
                    placeholder="e.g. B.Tech Computer Science, B.Sc Data Science, BBA..."
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 shadow-xs focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  />
                  {errors.pursuingQualification && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.pursuingQualification}
                    </p>
                  )}

                  {/* Suggestion Chips */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-400">Popular:</span>
                    {ugSuggestions.map((deg) => (
                      <button
                        key={deg}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            educationDetails: {
                              ...prev.educationDetails,
                              pursuingQualification: `${deg} `,
                            },
                          }))
                        }
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 transition"
                      >
                        +{deg}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* D. COMPLETED UNDERGRADUATE */}
            {formData.educationType === "Completed Undergraduate" && (
              <div className="flex items-center gap-3 py-2 animate-fade-in text-sky-900">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    Completed Undergraduate degree selected!
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Click continue to proceed to your employment and professional experience details.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-sky-500/20 transition hover:bg-sky-600 active:scale-95"
            >
              <span>Continue to Employment Status</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ---------------- STEP 4: EMPLOYMENT STATUS ---------------- */}
      {currentStep === 4 && (
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-sm transition hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 border border-sky-100">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Employment Status
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Are you currently employed? Select your status to enter your career or graduation profile.
              </p>
            </div>
          </div>

          {/* Question: Are you currently employed? */}
          <div className="mt-8">
            <p className="text-sm font-semibold text-slate-900 mb-3">
              Are you currently employed?
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Employed Card */}
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, employmentStatus: "Employed" }))
                }
                className={`flex items-center gap-3.5 rounded-2xl border p-4 text-left transition ${
                  formData.employmentStatus === "Employed"
                    ? "border-sky-500 bg-sky-50/70 shadow-sm ring-2 ring-sky-300"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
                    formData.employmentStatus === "Employed"
                      ? "bg-sky-500 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Employed</h2>
                  <p className="text-xs text-slate-500">I am currently working full-time or part-time</p>
                </div>
              </button>

              {/* Unemployed Card */}
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, employmentStatus: "Unemployed" }))
                }
                className={`flex items-center gap-3.5 rounded-2xl border p-4 text-left transition ${
                  formData.employmentStatus === "Unemployed"
                    ? "border-sky-500 bg-sky-50/70 shadow-sm ring-2 ring-sky-300"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
                    formData.employmentStatus === "Unemployed"
                      ? "bg-sky-500 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Unemployed</h2>
                  <p className="text-xs text-slate-500">I am seeking employment or fresh graduate</p>
                </div>
              </button>
            </div>
          </div>

          {/* DYNAMIC FIELDS: EMPLOYED */}
          {formData.employmentStatus === "Employed" && (
            <div className="mt-8 space-y-4 rounded-2xl border border-sky-100 bg-sky-50/40 p-5 sm:p-6 animate-fade-in">
              <div className="flex items-center gap-2 text-sky-800">
                <Briefcase className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Professional Employment Details
                </span>
              </div>

              {/* Current Job Role */}
              <div>
                <label className="block text-sm font-semibold text-slate-900">
                  Current Job Role <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.employmentDetails.jobRole}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      employmentDetails: {
                        ...prev.employmentDetails,
                        jobRole: e.target.value,
                      },
                    }))
                  }
                  placeholder="e.g. Frontend Developer, QA Engineer, Business Analyst"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 shadow-xs focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                />
                {errors.jobRole && (
                  <p className="mt-1 text-xs text-red-600">{errors.jobRole}</p>
                )}
              </div>

              {/* Job Title / Designation & Industry */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-900">
                    Job Title / Designation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.employmentDetails.jobTitle}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        employmentDetails: {
                          ...prev.employmentDetails,
                          jobTitle: e.target.value,
                        },
                      }))
                    }
                    placeholder="e.g. Associate Software Engineer"
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 shadow-xs focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  />
                  {errors.jobTitle && (
                    <p className="mt-1 text-xs text-red-600">{errors.jobTitle}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900">
                    Industry or Work Sector <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.employmentDetails.industrySector}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        employmentDetails: {
                          ...prev.employmentDetails,
                          industrySector: e.target.value,
                        },
                      }))
                    }
                    placeholder="e.g. Information Technology, Healthcare, Banking"
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 shadow-xs focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  />
                  {errors.industrySector && (
                    <p className="mt-1 text-xs text-red-600">{errors.industrySector}</p>
                  )}
                </div>
              </div>

              {/* Company Name (Optional) */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-900">
                    Company Name
                  </label>
                  <span className="text-[11px] font-medium text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200/60">
                    Optional
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.employmentDetails.companyName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      employmentDetails: {
                        ...prev.employmentDetails,
                        companyName: e.target.value,
                      },
                    }))
                  }
                  placeholder="e.g. Google, Infosys, Startup Inc."
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 shadow-xs focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                />
              </div>
            </div>
          )}

          {/* DYNAMIC FIELDS: UNEMPLOYED */}
          {formData.employmentStatus === "Unemployed" && (
            <div className="mt-8 space-y-4 rounded-2xl border border-pink-100 bg-pink-50/30 p-5 sm:p-6 animate-fade-in">
              <div className="flex items-center gap-2 text-pink-800">
                <GraduationCap className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Completed Educational Background
                </span>
              </div>

              {/* Completed Undergraduate Qualification */}
              <div>
                <label className="block text-sm font-semibold text-slate-900">
                  Enter Your Completed Undergraduate Qualification <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.employmentDetails.completedQualification}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      employmentDetails: {
                        ...prev.employmentDetails,
                        completedQualification: e.target.value,
                      },
                    }))
                  }
                  placeholder="e.g. B.Tech, B.Sc, B.Com, BCA"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 shadow-xs focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                />
                {errors.completedQualification && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.completedQualification}
                  </p>
                )}
              </div>

              {/* Degree or Course Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-900">
                  Enter Your Degree or Course Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.employmentDetails.degreeName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      employmentDetails: {
                        ...prev.employmentDetails,
                        degreeName: e.target.value,
                      },
                    }))
                  }
                  placeholder="e.g. Computer Science and Engineering"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 shadow-xs focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                />
                {errors.degreeName && (
                  <p className="mt-1 text-xs text-red-600">{errors.degreeName}</p>
                )}
              </div>

              {/* College / University & Year */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-900">
                    Enter Your College or University Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.employmentDetails.collegeName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        employmentDetails: {
                          ...prev.employmentDetails,
                          collegeName: e.target.value,
                        },
                      }))
                    }
                    placeholder="e.g. Hyderabad Institute of Technology"
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 shadow-xs focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  />
                  {errors.collegeName && (
                    <p className="mt-1 text-xs text-red-600">{errors.collegeName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900">
                    Year of Graduation <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.employmentDetails.graduationYear}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        employmentDetails: {
                          ...prev.employmentDetails,
                          graduationYear: e.target.value,
                        },
                      }))
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 shadow-xs focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  >
                    {gradYears.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-sky-500/20 transition hover:bg-sky-600 active:scale-95"
            >
              <span>Review Profile</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ---------------- STEP 5: PROFILE REVIEW ---------------- */}
      {currentStep === 5 && (
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-sm transition hover:shadow-md animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 border border-sky-100">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Profile Review
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Verify your profile details before confirming. You can edit any section below.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {/* Card 1: Personal Details */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-sky-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-sky-600" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Personal Identity
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => jumpToStep(1)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-pink-600 bg-pink-50 hover:bg-pink-100 px-2.5 py-1 rounded-lg border border-pink-200/60 transition"
                >
                  <Edit3 className="h-3 w-3" />
                  Edit
                </button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                <div>
                  <span className="text-xs text-slate-500 block">Username</span>
                  <span className="font-semibold text-slate-900">@{formData.username}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">First Name</span>
                  <span className="font-semibold text-slate-900">{formData.firstName}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Middle Name</span>
                  <span className="font-semibold text-slate-900">{formData.middleName || "—"}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Last Name</span>
                  <span className="font-semibold text-slate-900">{formData.lastName}</span>
                </div>
              </div>
            </div>

            {/* Card 2: Date of Birth & Age */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-sky-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-sky-600" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Date of Birth & Age
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => jumpToStep(2)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-pink-600 bg-pink-50 hover:bg-pink-100 px-2.5 py-1 rounded-lg border border-pink-200/60 transition"
                >
                  <Edit3 className="h-3 w-3" />
                  Edit
                </button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-6 text-sm">
                <div>
                  <span className="text-xs text-slate-500 block">Date of Birth</span>
                  <span className="font-semibold text-slate-900">{formData.dob}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Calculated Age</span>
                  <span className="inline-flex items-center gap-1 font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">
                    <Sparkles className="h-3.5 w-3.5 text-sky-500" />
                    {calculatedAge.years} Years Old
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: Educational Qualification */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-sky-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-sky-600" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Educational Qualification
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => jumpToStep(3)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-pink-600 bg-pink-50 hover:bg-pink-100 px-2.5 py-1 rounded-lg border border-pink-200/60 transition"
                >
                  <Edit3 className="h-3 w-3" />
                  Edit
                </button>
              </div>
              <div className="mt-3 text-sm space-y-1">
                <div>
                  <span className="text-xs text-slate-500">Status: </span>
                  <span className="font-semibold text-slate-900">{formData.educationType}</span>
                </div>
                {formData.educationType === "School" && (
                  <div>
                    <span className="text-xs text-slate-500">Grade/Class: </span>
                    <span className="font-semibold text-slate-900">
                      {formData.educationDetails.schoolGrade}
                    </span>
                  </div>
                )}
                {formData.educationType === "Intermediate" && (
                  <div>
                    <span className="text-xs text-slate-500">Stream: </span>
                    <span className="font-semibold text-slate-900">
                      {formData.educationDetails.intermediateStream === "Other"
                        ? formData.educationDetails.intermediateOther
                        : formData.educationDetails.intermediateStream}
                    </span>
                  </div>
                )}
                {formData.educationType === "Undergraduate" && (
                  <div>
                    <span className="text-xs text-slate-500">Pursuing Qualification: </span>
                    <span className="font-semibold text-slate-900">
                      {formData.educationDetails.pursuingQualification}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Card 4: Employment Status */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-sky-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-sky-600" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Employment Details
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => jumpToStep(4)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-pink-600 bg-pink-50 hover:bg-pink-100 px-2.5 py-1 rounded-lg border border-pink-200/60 transition"
                >
                  <Edit3 className="h-3 w-3" />
                  Edit
                </button>
              </div>
              <div className="mt-3 text-sm">
                <div className="mb-2">
                  <span className="text-xs text-slate-500">Status: </span>
                  <span
                    className={`font-semibold inline-block px-2 py-0.5 rounded-md text-xs ${
                      formData.employmentStatus === "Employed"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-amber-50 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {formData.employmentStatus}
                  </span>
                </div>

                {formData.employmentStatus === "Employed" ? (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <div>
                      <span className="text-xs text-slate-500 block">Job Role</span>
                      <span className="font-semibold text-slate-900">
                        {formData.employmentDetails.jobRole}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Title / Designation</span>
                      <span className="font-semibold text-slate-900">
                        {formData.employmentDetails.jobTitle}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Industry Sector</span>
                      <span className="font-semibold text-slate-900">
                        {formData.employmentDetails.industrySector}
                      </span>
                    </div>
                    {formData.employmentDetails.companyName && (
                      <div className="sm:col-span-3">
                        <span className="text-xs text-slate-500 block">Company</span>
                        <span className="font-semibold text-slate-900">
                          {formData.employmentDetails.companyName}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div>
                      <span className="text-xs text-slate-500 block">Completed Degree</span>
                      <span className="font-semibold text-slate-900">
                        {formData.employmentDetails.completedQualification} - {formData.employmentDetails.degreeName}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">College / University</span>
                      <span className="font-semibold text-slate-900">
                        {formData.employmentDetails.collegeName} ({formData.employmentDetails.graduationYear})
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={() => jumpToStep(1)}
              className="inline-flex items-center gap-2 rounded-xl border border-pink-200/80 bg-pink-50/80 px-5 py-2.5 text-sm font-semibold text-pink-700 shadow-xs transition hover:bg-pink-100 active:scale-95"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleConfirmAndContinue}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-7 py-3 text-sm font-semibold text-white shadow-md shadow-sky-500/25 transition hover:bg-sky-600 active:scale-95 disabled:opacity-70"
            >
              <span>{isSubmitting ? "Saving Profile..." : "Confirm and Continue"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ---------------- STEP 6: FINAL WELCOME SCREEN ---------------- */}
      {currentStep === 6 && (
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-14 text-center shadow-xl shadow-sky-900/5 animate-fade-in">
          {/* Decorative ambient celebration background */}
          <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-sky-200/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-pink-200/50 blur-3xl" />

          {/* Celebration Icon / Avatar */}
          <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-sky-500 to-sky-400 text-white shadow-lg shadow-sky-500/30">
            <Sparkles className="h-10 w-10 animate-float" />
          </div>

          {/* Dynamic Personalized Heading */}
          <h1 className="mt-6 text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Welcome to Pathwise!
          </h1>

          <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-pink-200/80 bg-pink-50/90 px-4 py-1.5 text-sm font-bold text-pink-700">
            <span>Hello, {formData.firstName || formData.username}!</span>
          </div>

          {/* Subtitle */}
          <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-slate-600">
            Your journey towards discovering opportunities and building your future starts here.
          </p>

          {/* Feature highlights summary */}
          <div className="mx-auto mt-8 grid max-w-lg grid-cols-1 gap-3 sm:grid-cols-3 text-left">
            <div className="rounded-2xl border border-slate-100 bg-sky-50/50 p-4">
              <span className="text-xs font-bold text-sky-700 uppercase block">Profile</span>
              <span className="text-sm font-semibold text-slate-800">
                @{formData.username}
              </span>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-sky-50/50 p-4">
              <span className="text-xs font-bold text-sky-700 uppercase block">Education</span>
              <span className="text-sm font-semibold text-slate-800 truncate block">
                {formData.educationType}
              </span>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-pink-50/50 p-4">
              <span className="text-xs font-bold text-pink-700 uppercase block">Status</span>
              <span className="text-sm font-semibold text-slate-800 truncate block">
                {formData.employmentStatus}
              </span>
            </div>
          </div>

          {/* Professional Get Started button */}
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                navigate("/dashboard", {
                  replace: true,
                  state: {
                    fromSetup: true,
                    student: {
                      name: `${formData.firstName} ${formData.lastName}`.trim(),
                      username: formData.username,
                      email: user?.email || `${formData.username}@student.pathwise.edu`,
                      education:
                        formData.educationType === "Undergraduate"
                          ? formData.educationDetails.pursuingQualification
                          : formData.educationType,
                      career_goal:
                        formData.employmentStatus === "Employed"
                          ? formData.employmentDetails.jobRole
                          : "Frontend Developer",
                    },
                  },
                });
              }}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-2xl bg-sky-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-600 hover:shadow-sky-500/40 active:scale-95"
            >
              <span>Get Started</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
