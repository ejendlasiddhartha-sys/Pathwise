import { useState } from "react";
import {
  Settings,
  User,
  Lock,
  Mail,
  Bell,
  Sun,
  Moon,
  Globe,
  Shield,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  KeyRound,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function SettingsView() {
  const { user, profile, updateAccountInfo, resetPassword, deleteAccount } = useAuth();

  // Account settings form
  const [accountForm, setAccountForm] = useState({
    firstName: profile?.firstName || user?.firstName || "Rahul",
    lastName: profile?.lastName || user?.lastName || "Sharma",
    username: user?.username || profile?.username || "rahul_tech",
    email: user?.email || "rahul@example.com",
  });
  const [accountSaved, setAccountSaved] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });

  // Preferences state
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [inAppNotifs, setInAppNotifs] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [themeMode, setThemeMode] = useState("light");
  const [language, setLanguage] = useState("English (US)");

  // Privacy & Security state
  const [publicProfile, setPublicProfile] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState("");

  const handleSaveAccount = (e) => {
    e.preventDefault();
    updateAccountInfo(accountForm);
    setAccountSaved(true);
    setTimeout(() => setAccountSaved(false), 3000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: "", text: "" });

    if (!newPassword || newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "New password must be at least 6 characters long." });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match." });
      return;
    }

    try {
      await resetPassword(accountForm.email, newPassword);
      setPasswordMsg({ type: "success", text: "Password changed successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setPasswordMsg({ type: "error", text: "Failed to update password." });
    }
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmationInput === "DELETE") {
      deleteAccount();
      window.location.href = "/";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Account Settings & Preferences
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage your personal account credentials, communication preferences, and security privacy controls.
        </p>
      </div>

      {/* 1. ACCOUNT INFORMATION */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Account Information</h2>
            <p className="text-xs text-slate-500">Update your primary identity and email address</p>
          </div>
        </div>

        {accountSaved && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 border border-emerald-200 animate-fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Account information updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSaveAccount} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600">First Name</label>
              <input
                type="text"
                value={accountForm.firstName}
                onChange={(e) => setAccountForm({ ...accountForm, firstName: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600">Last Name</label>
              <input
                type="text"
                value={accountForm.lastName}
                onChange={(e) => setAccountForm({ ...accountForm, lastName: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600">Username</label>
              <input
                type="text"
                value={accountForm.username}
                onChange={(e) => setAccountForm({ ...accountForm, username: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600">Email Address</label>
              <input
                type="email"
                value={accountForm.email}
                onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-sky-600 active:scale-95"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Account Info</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. CHANGE PASSWORD */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Change Password</h2>
            <p className="text-xs text-slate-500">Ensure your account is protected with a secure password</p>
          </div>
        </div>

        {passwordMsg.text && (
          <div
            className={`mt-4 flex items-center gap-2 rounded-xl p-3 text-xs font-semibold border ${
              passwordMsg.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            {passwordMsg.type === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span>{passwordMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600">New Password</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full rounded-xl border border-slate-300 bg-white pr-10 pl-3.5 py-2 text-sm text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600">Confirm New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Re-enter password"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-sky-600 active:scale-95"
            >
              <KeyRound className="h-3.5 w-3.5" />
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. PREFERENCES */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Preferences & Alerts</h2>
            <p className="text-xs text-slate-500">Configure notification alerts, theme, and language</p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <p className="text-sm font-semibold text-slate-900">Email Notifications</p>
              <p className="text-xs text-slate-500">Receive career benchmark updates and milestone reminders via email</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <p className="text-sm font-semibold text-slate-900">In-App Notification Badges</p>
              <p className="text-xs text-slate-500">Show notification counts and alerts on the dashboard bell</p>
            </div>
            <input
              type="checkbox"
              checked={inAppNotifs}
              onChange={(e) => setInAppNotifs(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">Weekly Skill Gap Digest</p>
              <p className="text-xs text-slate-500">Get a weekly summary of recommended certifications and trending skills</p>
            </div>
            <input
              type="checkbox"
              checked={weeklyDigest}
              onChange={(e) => setWeeklyDigest(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Theme Display
              </label>
              <select
                value={themeMode}
                onChange={(e) => setThemeMode(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900"
              >
                <option value="light">Pathwise Clean White & Sky Blue (Default)</option>
                <option value="dark">Dark High-Contrast (Preview)</option>
                <option value="system">Follow System Preferences</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Platform Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900"
              >
                <option value="English (US)">English (US)</option>
                <option value="English (UK)">English (UK)</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Telugu">Telugu (తెలుగు)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 4. PRIVACY & SECURITY / DANGER ZONE */}
      <div className="rounded-3xl border border-red-200/80 bg-red-50/20 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2.5 border-b border-red-100 pb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-red-950">Privacy, Security & Danger Zone</h2>
            <p className="text-xs text-slate-500">Security authentication controls and account deletion</p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">Two-Factor Authentication (2FA)</p>
              <p className="text-xs text-slate-500">Require an authenticator code or SMS code on login</p>
            </div>
            <input
              type="checkbox"
              checked={twoFactorAuth}
              onChange={(e) => setTwoFactorAuth(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
          </div>

          <div className="border-t border-red-100 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-red-700">Delete Account</p>
              <p className="text-xs text-slate-500">Permanently erase your account, diagnostic score, and profile data.</p>
            </div>
            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-300 bg-white px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete My Account</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Modal Confirmation */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-red-600 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Permanently Delete Account?
            </h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              This action cannot be undone. All your profile diagnostics, certifications, and settings will be permanently removed.
            </p>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700">
                Type <strong>DELETE</strong> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmationInput}
                onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                placeholder="DELETE"
                className="mt-1 w-full rounded-xl border border-red-300 bg-white p-2 text-xs text-slate-900"
              />
            </div>

            <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDeleteConfirmationInput("");
                }}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmationInput !== "DELETE"}
                onClick={handleConfirmDelete}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
