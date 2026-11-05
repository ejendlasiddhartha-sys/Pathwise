import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import InteractiveBackground from "./components/InteractiveBackground";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ProfileSetup from "./pages/ProfileSetup";
import Auth from "./pages/Auth";

function NotFound() {
  return (
    <section className="relative z-10 mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg my-12">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 font-bold text-2xl">
        404
      </div>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 text-sm text-slate-600">
        The destination address is not part of Pathwise.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-sky-600"
      >
        Back to Home
      </Link>
    </section>
  );
}

function AppContent() {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  return (
    <div className="relative min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-sky-100 selection:text-sky-900">
      {/* Subtle Canvas Interactive Animated Background */}
      <InteractiveBackground />

      {/* Render top global Navbar only on non-dashboard screens */}
      {!isDashboardRoute && <Navbar />}

      {/* Main Container: Full width for Dashboard; centered max-w-6xl for marketing & onboarding */}
      <main
        className={`relative z-10 flex-1 ${
          isDashboardRoute ? "w-full" : "mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8"
        }`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/setup-profile" element={<ProfileSetup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Public Footer */}
      {!isDashboardRoute && (
        <footer className="relative z-10 border-t border-slate-200/80 bg-white/70 py-6 text-center text-xs text-slate-500 backdrop-blur-xs">
          <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-medium text-slate-600">
              Pathwise &bull; Student Skill Gap & Career Diagnostic Platform
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <Link to="/" className="hover:text-sky-600 transition">
                Home
              </Link>
              <Link to="/setup-profile" className="hover:text-sky-600 transition">
                Set Up Profile
              </Link>
              <Link to="/dashboard" className="hover:text-sky-600 transition">
                Dashboard
              </Link>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
