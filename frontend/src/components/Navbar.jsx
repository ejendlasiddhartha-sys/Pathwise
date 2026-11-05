import { useState } from "react";
import {
  Compass,
  LayoutDashboard,
  UserRound,
  LogIn,
  LogOut,
  Sparkles,
  Menu,
  X,
  ChevronDown,
  UserCheck,
} from "lucide-react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navLinkClass = ({ isActive }) =>
  `inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition ${
    isActive
      ? "bg-sky-500/25 text-white shadow-xs border border-sky-300/30"
      : "text-sky-100 hover:bg-sky-800/40 hover:text-white"
  }`;

export default function Navbar() {
  const { user, profile, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const displayName = profile?.firstName || user?.firstName || user?.name || user?.username || "Student";
  const userInitials = displayName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-sky-800/40 bg-gradient-to-r from-sky-950 via-sky-900 to-[#0c4a6e] text-white shadow-md backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 text-lg font-bold tracking-tight text-white transition hover:opacity-95"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-sky-400 text-white shadow-sm shadow-sky-500/30">
            <Compass className="h-5 w-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">Pathwise</span>
          {/* Subtle Pink Accent Pill */}
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-pink-400/30 bg-pink-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-pink-200">
            <Sparkles className="h-3 w-3 text-pink-300" />
            Beta
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/setup-profile" className={navLinkClass}>
            <UserRound className="h-4 w-4 text-sky-300" />
            Set Up Profile
          </NavLink>
          <NavLink to="/dashboard" className={navLinkClass}>
            <LayoutDashboard className="h-4 w-4 text-sky-300" />
            Dashboard
          </NavLink>
        </nav>

        {/* Auth / Action Menu (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 rounded-full border border-sky-400/30 bg-sky-800/50 py-1.5 pl-2 pr-3 text-sm font-semibold text-white shadow-xs transition hover:bg-sky-800/80"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-xs font-bold text-white shadow-inner">
                  {userInitials}
                </div>
                <span className="max-w-[120px] truncate text-xs">{displayName}</span>
                <ChevronDown className="h-3.5 w-3.5 text-sky-300" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 text-slate-800 shadow-xl animate-fade-in z-50">
                  <div className="border-b border-slate-100 px-3 py-2">
                    <p className="text-xs font-semibold text-slate-400 uppercase">Signed in as</p>
                    <p className="text-sm font-bold text-slate-900 truncate">
                      @{user?.username || "student"}
                    </p>
                    {user?.email && (
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    )}
                  </div>

                  <div className="py-1">
                    <Link
                      to="/setup-profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition"
                    >
                      <UserCheck className="h-4 w-4 text-sky-500" />
                      Profile Setup Wizard
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition"
                    >
                      <LayoutDashboard className="h-4 w-4 text-sky-500" />
                      My Dashboard
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/auth"
                state={{ mode: "login" }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-pink-400/40 bg-pink-500/20 px-3.5 py-1.5 text-xs font-semibold text-pink-200 transition hover:bg-pink-500/30"
              >
                <LogIn className="h-3.5 w-3.5" />
                Sign In
              </Link>
              <Link
                to="/auth"
                state={{ mode: "signup" }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-sky-500/30 transition hover:bg-sky-400 active:scale-95"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl p-2 text-sky-200 hover:bg-sky-800 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-sky-800/60 bg-sky-950 px-4 py-4 md:hidden animate-fade-in space-y-3">
          <nav className="flex flex-col gap-1.5">
            <NavLink
              to="/"
              end
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
            >
              Home
            </NavLink>
            <NavLink
              to="/setup-profile"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
            >
              <UserRound className="h-4 w-4 text-sky-300" />
              Set Up Profile
            </NavLink>
            <NavLink
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
            >
              <LayoutDashboard className="h-4 w-4 text-sky-300" />
              Dashboard
            </NavLink>
          </nav>

          <div className="border-t border-sky-800/40 pt-3">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-xs font-bold text-white">
                    {userInitials}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white truncate">{displayName}</p>
                    <p className="text-[11px] text-sky-300 truncate">@{user?.username || "student"}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl border border-red-500/40 bg-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-200"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/auth"
                  state={{ mode: "login" }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center rounded-xl border border-pink-400/40 bg-pink-500/20 py-2.5 text-xs font-semibold text-pink-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth"
                  state={{ mode: "signup" }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center rounded-xl bg-sky-500 py-2.5 text-xs font-bold text-white shadow-sm"
                >
                  Create New Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
