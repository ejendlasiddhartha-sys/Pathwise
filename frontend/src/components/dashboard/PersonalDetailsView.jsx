import { useState, useMemo } from "react";
import {
  User,
  Calendar,
  GraduationCap,
  Briefcase,
  Edit3,
  Save,
  CheckCircle2,
  AlertCircle,
  Building,
  School,
  BookOpen,
  Award,
  Sparkles,
  Layers,
  Search,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import InteractiveDatePicker, { calculateAge } from "../InteractiveDatePicker";

export default function PersonalDetailsView() {
  const { profile, user, saveFullProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle"); // "idle" | "saving" | "success" | "error"

  // Form state initialized with saved profile
  const [formData, setFormData] = useState({
    username: profile?.username || user?.username || "student",
    firstName: profile?.firstName || user?.firstName || "Student",
    middleName: profile?.middleName || "",
    lastName: profile?.lastName || user?.lastName || "",
    dob: profile?.dob || "2003-08-15",
    educationType: profile?.educationType || "Undergraduate",
    educationDetails: {
      schoolGrade: profile?.educationDetails?.schoolGrade || "Class 12",
      intermediateStream: profile?.educationDetails?.intermediateStream || "MPC",
      intermediateOther: profile?.educationDetails?.intermediateOther || "",
      pursuingQualification: profile?.educationDetails?.pursuingQualification || "B.Tech Computer Science & Engineering",
    },
    employmentStatus: profile?.employmentStatus || "Employed",
    employmentDetails: {
      jobRole: profile?.employmentDetails?.jobRole || "Frontend Engineer",
      jobTitle: profile?.employmentDetails?.jobTitle || "Junior Software Engineer",
      industrySector: profile?.employmentDetails?.industrySector || "Technology & Software",
      companyName: profile?.employmentDetails?.companyName || "Tech Innovations Ltd.",
      completedQualification: profile?.employmentDetails?.completedQualification || "B.Tech",
      degreeName: profile?.employmentDetails?.degreeName || "Computer Science",
      collegeName: profile?.employmentDetails?.collegeName || "National Institute of Technology",
      graduationYear: profile?.employmentDetails?.graduationYear || "2024",
    },
  });

  const ageData = useMemo(() => calculateAge(formData.dob), [formData.dob]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveStatus("saving");
    try {
      await saveFullProfile(formData);
      setSaveStatus("success");
      setIsEditing(false);
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header and Toggle Edit Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Personal & Career Profile
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            View and manage your core identity, educational background, and employment credentials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saveStatus === "saving"}
                className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-sky-600 active:scale-95"
              >
                <Save className="h-4 w-4" />
                <span>{saveStatus === "saving" ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-pink-200 bg-pink-50 px-4 py-2 text-xs font-bold text-pink-700 shadow-xs transition hover:bg-pink-100 active:scale-95"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit Details</span>
            </button>
          )}
        </div>
      </div>

      {saveStatus === "success" && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Profile changes saved and synchronized successfully!</span>
        </div>
      )}

      {/* 1. PERSONAL INFORMATION CARD */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
            <p className="text-xs text-slate-500">Your core identity details</p>
          </div>
        </div>

        {isEditing ? (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600">Middle Name</label>
              <input
                type="text"
                value={formData.middleName}
                onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-2">
                Date of Birth
              </label>
              <InteractiveDatePicker
                value={formData.dob}
                onChange={(newDob) => setFormData({ ...formData, dob: newDob })}
              />
            </div>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <span className="text-xs text-slate-400 block">Username</span>
              <span className="text-sm font-semibold text-slate-900">@{formData.username}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Full Name</span>
              <span className="text-sm font-semibold text-slate-900">
                {[formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(" ")}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Date of Birth</span>
              <span className="text-sm font-semibold text-slate-900">{formData.dob}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Calculated Age</span>
              <span className="inline-flex items-center gap-1 font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md text-xs border border-sky-200">
                <Sparkles className="h-3 w-3 text-sky-500" />
                {ageData.years} Years Old
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. EDUCATIONAL INFORMATION CARD */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Educational Qualification</h2>
            <p className="text-xs text-slate-500">Degree, level, and curriculum focus</p>
          </div>
        </div>

        {isEditing ? (
          <div className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Educational Status
              </label>
              <select
                value={formData.educationType}
                onChange={(e) => setFormData({ ...formData, educationType: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900"
              >
                <option value="School">School</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Completed Undergraduate">Completed Undergraduate</option>
              </select>
            </div>

            {formData.educationType === "School" && (
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  School Class / Grade
                </label>
                <input
                  type="text"
                  value={formData.educationDetails.schoolGrade}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      educationDetails: { ...formData.educationDetails, schoolGrade: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900"
                />
              </div>
            )}

            {formData.educationType === "Intermediate" && (
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Intermediate Stream
                </label>
                <input
                  type="text"
                  value={formData.educationDetails.intermediateStream}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      educationDetails: { ...formData.educationDetails, intermediateStream: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900"
                />
              </div>
            )}

            {formData.educationType === "Undergraduate" && (
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600">
                  Pursuing Qualification / Course
                </label>
                <input
                  type="text"
                  value={formData.educationDetails.pursuingQualification}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      educationDetails: {
                        ...formData.educationDetails,
                        pursuingQualification: e.target.value,
                      },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span className="text-xs text-slate-400 block">Level</span>
              <span className="text-sm font-semibold text-slate-900">{formData.educationType}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Course / Qualification</span>
              <span className="text-sm font-semibold text-slate-900">
                {formData.educationType === "School"
                  ? formData.educationDetails.schoolGrade
                  : formData.educationType === "Intermediate"
                  ? formData.educationDetails.intermediateStream
                  : formData.educationType === "Undergraduate"
                  ? formData.educationDetails.pursuingQualification
                  : formData.employmentDetails.degreeName || "Completed Degree"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. EMPLOYMENT INFORMATION CARD */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Employment Details</h2>
            <p className="text-xs text-slate-500">Current work trajectory and industry</p>
          </div>
        </div>

        {isEditing ? (
          <div className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Are you currently employed?
              </label>
              <select
                value={formData.employmentStatus}
                onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900"
              >
                <option value="Employed">Employed</option>
                <option value="Unemployed">Unemployed</option>
              </select>
            </div>

            {formData.employmentStatus === "Employed" ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600">Job Role</label>
                  <input
                    type="text"
                    value={formData.employmentDetails.jobRole}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        employmentDetails: { ...formData.employmentDetails, jobRole: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600">Job Title</label>
                  <input
                    type="text"
                    value={formData.employmentDetails.jobTitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        employmentDetails: { ...formData.employmentDetails, jobTitle: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600">Industry Sector</label>
                  <input
                    type="text"
                    value={formData.employmentDetails.industrySector}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        employmentDetails: { ...formData.employmentDetails, industrySector: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600">Company Name</label>
                  <input
                    type="text"
                    value={formData.employmentDetails.companyName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        employmentDetails: { ...formData.employmentDetails, companyName: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600">Completed Degree</label>
                  <input
                    type="text"
                    value={formData.employmentDetails.completedQualification}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        employmentDetails: { ...formData.employmentDetails, completedQualification: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600">College / University</label>
                  <input
                    type="text"
                    value={formData.employmentDetails.collegeName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        employmentDetails: { ...formData.employmentDetails, collegeName: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900"
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <span className="text-xs text-slate-400 block">Status</span>
              <span className="inline-block mt-0.5 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                {formData.employmentStatus}
              </span>
            </div>
            {formData.employmentStatus === "Employed" ? (
              <>
                <div>
                  <span className="text-xs text-slate-400 block">Role & Title</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {formData.employmentDetails.jobRole} ({formData.employmentDetails.jobTitle})
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Organization</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {formData.employmentDetails.companyName || formData.employmentDetails.industrySector}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className="text-xs text-slate-400 block">Completed Degree</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {formData.employmentDetails.completedQualification} - {formData.employmentDetails.degreeName}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Graduation Year</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {formData.employmentDetails.graduationYear}
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
