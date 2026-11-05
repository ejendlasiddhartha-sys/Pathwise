import { useState } from "react";
import {
  Award,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  Building,
  FileText,
  Upload,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  X,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function CertificationsView() {
  const { certifications, addCertification, updateCertification, deleteCertification } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCertId, setEditingCertId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    completionDate: "",
    credentialId: "",
    documentName: "",
  });

  const [errorMsg, setErrorMsg] = useState("");

  const openAddModal = () => {
    setEditingCertId(null);
    setFormData({
      name: "",
      organization: "",
      completionDate: new Date().toISOString().split("T")[0],
      credentialId: "",
      documentName: "",
    });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const openEditModal = (cert) => {
    setEditingCertId(cert.id);
    setFormData({
      name: cert.name || "",
      organization: cert.organization || "",
      completionDate: cert.completionDate || "",
      credentialId: cert.credentialId || "",
      documentName: cert.documentName || "",
    });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCertId(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        documentName: file.name,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg("Certification name is required.");
      return;
    }
    if (!formData.organization.trim()) {
      setErrorMsg("Issuing organization is required.");
      return;
    }
    if (!formData.completionDate) {
      setErrorMsg("Completion date is required.");
      return;
    }

    if (editingCertId) {
      updateCertification(editingCertId, formData);
    } else {
      addCertification(formData);
    }
    closeModal();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Earned Certifications
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Validate and showcase verified industry certifications that boost your career readiness benchmark.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-sky-500/20 transition hover:bg-sky-600 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Add Certification</span>
        </button>
      </div>

      {/* Certifications Grid */}
      {certifications.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-500">
            <Award className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-800">No certifications recorded yet</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Add credentials you have completed to enhance your readiness score and attract recruiter attention.
          </p>
          <button
            type="button"
            onClick={openAddModal}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-xs font-bold text-white"
          >
            <Plus className="h-3.5 w-3.5" />
            Add First Certification
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-sky-300 hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-sky-400 text-white shadow-sm">
                    <Award className="h-6 w-6" />
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                    <ShieldCheck className="h-3 w-3" />
                    {cert.status || "Verified"}
                  </span>
                </div>

                <h2 className="mt-4 text-base font-bold text-slate-900 leading-snug">
                  {cert.name}
                </h2>

                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <p className="flex items-center gap-2">
                    <Building className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{cert.organization}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>Issued: {cert.completionDate}</span>
                  </p>
                  {cert.credentialId && (
                    <p className="font-mono text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md inline-block">
                      ID: {cert.credentialId}
                    </p>
                  )}
                </div>

                {cert.documentName && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-pink-100 bg-pink-50/50 p-2.5 text-xs text-pink-700">
                    <FileText className="h-4 w-4 shrink-0 text-pink-500" />
                    <span className="truncate font-medium">{cert.documentName}</span>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => openEditModal(cert)}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteCertification(cert.id)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                  title="Delete certification"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Certification Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-sky-600" />
                <h2 className="text-base font-bold text-slate-900">
                  {editingCertId ? "Edit Certification" : "Add New Certification"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 p-2.5 text-xs font-medium text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Certification Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Meta Frontend Developer"
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Issuing Organization <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="e.g. AWS, Google Cloud, Meta, Coursera"
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Completion Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.completionDate}
                    onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-xs focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Certificate ID
                  </label>
                  <input
                    type="text"
                    value={formData.credentialId}
                    onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                    placeholder="e.g. AWS-8921"
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-xs focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Upload Certificate Document
                </label>
                <div className="mt-1 flex items-center gap-3">
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-sky-300 bg-sky-50/50 px-4 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-100 transition">
                    <Upload className="h-4 w-4" />
                    <span>Choose File (PDF/PNG)</span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="truncate text-xs text-slate-500">
                    {formData.documentName || "No file selected"}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-sky-500 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-sky-600 active:scale-95"
                >
                  {editingCertId ? "Save Changes" : "Add Credential"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
