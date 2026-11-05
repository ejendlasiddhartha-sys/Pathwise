import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Compass,
  LayoutDashboard,
  Route,
  Bell,
  Award,
  User,
  HelpCircle,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ChevronDown,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

import DashboardHome from "./DashboardHome";
import RoadmapView from "./RoadmapView";
import NotificationsView from "./NotificationsView";
import CertificationsView from "./CertificationsView";
import PersonalDetailsView from "./PersonalDetailsView";
import HelpSupportView from "./HelpSupportView";
import SettingsView from "./SettingsView";

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, unreadCount, logout, updateAvatar } = useAuth();

  // Tab mapping based on URL or query
  const queryTab = new URLSearchParams(location.search).get("tab");
  const [activeTab, setActiveTab] = useState(() => {
    if (queryTab) return queryTab;
    if (location.pathname.includes("roadmap")) return "roadmap";
    if (location.pathname.includes("notifications")) return "notifications";
    if (location.pathname.includes("certifications")) return "certifications";
    if (location.pathname.includes("personal-details")) return "personal-details";
    if (location.pathname.includes("support")) return "support";
    if (location.pathname.includes("settings")) return "settings";
    return "dashboard";
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // Sync activeTab when queryTab changes
  useEffect(() => {
    if (queryTab && queryTab !== activeTab) {
      setActiveTab(queryTab);
    }
  }, [queryTab]);

  const handleSelectTab = (tabId) => {
    if (tabId === "logout") {
      setIsLogoutModalOpen(true);
      setIsMobileSidebarOpen(false);
      setIsProfileDropdownOpen(false);
      return;
    }
    setActiveTab(tabId);
    navigate(`/dashboard?tab=${tabId}`, { replace: true });
    setIsMobileSidebarOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
    navigate("/auth", { replace: true, state: { mode: "login" } });
  };

  // Dynamic titles
  const pageTitles = {
    dashboard: "Dashboard Overview",
    roadmap: "My Personalized Roadmap",
    notifications: "Notifications & Alerts",
    certifications: "Earned Certifications",
    "personal-details": "Personal Details",
    support: "Help & Support",
    settings: "Account Settings",
  };

  // Exactly 8 items in the required order
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "roadmap", label: "My Roadmap", icon: Route },
    { id: "notifications", label: "Notifications", icon: Bell, badge: unreadCount },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "personal-details", label: "Personal Details", icon: User },
    { id: "support", label: "Help & Support", icon: HelpCircle },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "logout", label: "Logout", icon: LogOut, isDanger: true },
  ];

  const displayName = profile?.firstName || user?.firstName || user?.name || user?.username || "Student";
  const displayUsername = user?.username || profile?.username || "student";
  const displayEmail = user?.email || `${displayUsername}@student.pathwise.edu`;
  const avatarUrl = user?.avatar || AVATAR_PRESETS[0];

  // Handle avatar upload
  const handleCustomAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateAvatar(reader.result);
        setIsAvatarModalOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-65px)] bg-slate-50/50 text-slate-900">
      {/* ---------------- A. LEFT-SIDE NAVIGATION MENU (SIDEBAR) ---------------- */}
      <aside
        className={`sticky top-0 z-30 flex flex-col justify-between border-r border-slate-200/90 bg-white transition-all duration-300 shadow-xs hidden md:flex ${
          isSidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div>
          {/* Sidebar Brand Header */}
          <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4">
            <Link
              to="/"
              className={`flex items-center gap-2.5 font-extrabold text-slate-900 transition ${
                isSidebarCollapsed ? "justify-center w-full" : ""
              }`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-sky-400 text-white shadow-xs">
                <Compass className="h-5 w-5" />
              </div>
              {!isSidebarCollapsed && (
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  Pathwise
                </span>
              )}
            </Link>

            {/* Collapse / Expand Toggle Button */}
            {!isSidebarCollapsed && (
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(true)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                title="Collapse sidebar"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* If collapsed, quick expand button */}
          {isSidebarCollapsed && (
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                title="Expand sidebar"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Navigation Menu Items (Order 1 through 8) */}
          <nav className="space-y-1 p-3">
            {menuItems.map((item) => {
              const ItemIcon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectTab(item.id)}
                  title={isSidebarCollapsed ? item.label : undefined}
                  className={`group flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-xs font-bold transition ${
                    item.isDanger
                      ? "text-red-600 hover:bg-red-50 mt-4 border-t border-slate-100 pt-3"
                      : isActive
                      ? "bg-sky-500 text-white shadow-md shadow-sky-500/25 ring-1 ring-sky-400"
                      : "text-slate-600 hover:bg-sky-50/60 hover:text-sky-700"
                  } ${isSidebarCollapsed ? "justify-center px-0" : ""}`}
                >
                  <ItemIcon
                    className={`h-4 w-4 shrink-0 transition ${
                      isActive ? "text-white" : item.isDanger ? "text-red-500" : "text-slate-400 group-hover:text-sky-600"
                    }`}
                  />
                  {!isSidebarCollapsed && (
                    <span className="flex-1 text-left truncate">{item.label}</span>
                  )}
                  {!isSidebarCollapsed && item.badge > 0 && (
                    <span className="rounded-full bg-pink-500 px-2 py-0.5 text-[10px] font-bold text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Mini Profile */}
        {!isSidebarCollapsed && (
          <div className="border-t border-slate-100 p-4">
            <div className="flex items-center gap-3">
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-sky-300"
              />
              <div className="flex-1 truncate">
                <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                <p className="text-[11px] text-slate-400 truncate">@{displayUsername}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Drawer (Responsive Navigation) */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-fade-in">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative z-10 flex w-72 flex-col justify-between bg-white p-4 shadow-2xl">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500 text-white">
                    <Compass className="h-5 w-5" />
                  </div>
                  <span className="font-extrabold text-slate-900">Pathwise</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-4 space-y-1">
                {menuItems.map((item) => {
                  const ItemIcon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectTab(item.id)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-xs font-bold transition ${
                        item.isDanger
                          ? "text-red-600 hover:bg-red-50 mt-4 border-t border-slate-100"
                          : isActive
                          ? "bg-sky-500 text-white shadow-sm"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <ItemIcon className="h-4 w-4" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge > 0 && (
                        <span className="rounded-full bg-pink-500 px-2 py-0.5 text-[10px] font-bold text-white">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- B. MAIN CONTENT AREA + TOP NAVIGATION BAR ---------------- */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/90 bg-white/95 px-4 sm:px-6 shadow-xs backdrop-blur-md">
          {/* Left: Mobile Toggle & Page Title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 md:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                {pageTitles[activeTab] || "Dashboard"}
              </h1>
            </div>
          </div>

          {/* Right: Notification Bell & Profile Dropdown */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => handleSelectTab("notifications")}
              className="relative rounded-full p-2 text-slate-500 hover:bg-sky-50 hover:text-sky-600 transition"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile Section with Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 text-xs font-bold text-slate-800 shadow-xs transition hover:border-sky-300 hover:bg-sky-50/50"
              >
                <div className="relative">
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-sky-300"
                  />
                </div>
                <span className="hidden sm:inline-block max-w-[120px] truncate">
                  {displayName}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-3xl border border-slate-200 bg-white p-2 text-slate-800 shadow-2xl animate-fade-in z-50">
                  <div className="border-b border-slate-100 p-3 flex items-center gap-3">
                    <div className="relative group cursor-pointer" onClick={() => setIsAvatarModalOpen(true)}>
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-sky-400"
                      />
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition">
                        <Camera className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 truncate">
                      <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                      <p className="text-[11px] text-slate-400 truncate">@{displayUsername}</p>
                      <p className="text-[10px] text-slate-400 truncate">{displayEmail}</p>
                    </div>
                  </div>

                  <div className="py-1 text-xs">
                    <button
                      type="button"
                      onClick={() => handleSelectTab("personal-details")}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition"
                    >
                      <User className="h-4 w-4 text-sky-500" />
                      <span>View Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectTab("personal-details")}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition"
                    >
                      <Sparkles className="h-4 w-4 text-pink-500" />
                      <span>Edit Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectTab("settings")}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition"
                    >
                      <Settings className="h-4 w-4 text-slate-500" />
                      <span>Account Settings</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        setIsAvatarModalOpen(true);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition"
                    >
                      <Camera className="h-4 w-4 text-sky-500" />
                      <span>Update Profile Picture</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        setIsLogoutModalOpen(true);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic View Rendering */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === "dashboard" && <DashboardHome onNavigateTab={handleSelectTab} />}
          {activeTab === "roadmap" && <RoadmapView />}
          {activeTab === "notifications" && <NotificationsView />}
          {activeTab === "certifications" && <CertificationsView />}
          {activeTab === "personal-details" && <PersonalDetailsView />}
          {activeTab === "support" && <HelpSupportView />}
          {activeTab === "settings" && <SettingsView />}
        </main>
      </div>

      {/* ---------------- 9. LOGOUT CONFIRMATION DIALOG MODAL ---------------- */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <LogOut className="h-7 w-7" />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Are you sure you want to log out?
            </h3>
            <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
              You will be securely signed out of your Pathwise session. You can sign back in anytime.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="w-full rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-red-700 active:scale-95"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- PROFILE PICTURE UPLOAD MODAL ---------------- */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-sky-600" />
                <h3 className="text-base font-bold text-slate-900">Update Profile Picture</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 text-center">
              <img
                src={avatarUrl}
                alt={displayName}
                className="mx-auto h-20 w-20 rounded-full object-cover ring-4 ring-sky-300 shadow-md"
              />
              <p className="mt-2 text-xs font-bold text-slate-800">{displayName}</p>
            </div>

            {/* Choose from presets */}
            <div className="mt-4">
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-2">
                Choose an Avatar Preset
              </label>
              <div className="flex justify-center gap-3">
                {AVATAR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      updateAvatar(preset);
                      setIsAvatarModalOpen(false);
                    }}
                    className={`rounded-full p-0.5 transition ${
                      avatarUrl === preset ? "ring-2 ring-sky-500 scale-105" : "hover:opacity-80"
                    }`}
                  >
                    <img
                      src={preset}
                      alt="Preset"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Custom File */}
            <div className="mt-5 border-t border-slate-100 pt-4">
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-2">
                Or Upload from Device
              </label>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-sky-300 bg-sky-50/50 py-3 text-xs font-bold text-sky-700 hover:bg-sky-100 transition">
                <Upload className="h-4 w-4" />
                <span>Choose Image (PNG/JPG)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
