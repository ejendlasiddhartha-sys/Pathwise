import { useState, useMemo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Compass,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  KeyRound,
  ArrowLeft,
  Check,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

// Google multi-color SVG icon
function GoogleIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

// Apple SVG icon
function AppleIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 170 170" fill="currentColor">
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.07-7.73-7.85-12.09-14.35-8.49-12.63-14.86-26.68-19.12-42.15-4.25-15.48-6.39-29.58-6.39-42.31 0-16.12 4.15-29.74 12.44-40.87 8.3-11.12 18.66-16.8 31.08-17.03 4.8 0 10.3 1.34 16.5 4.02 6.2 2.68 10.3 4.12 12.3 4.31 2.39-.38 6.78-1.92 13.16-4.63 6.39-2.7 11.96-3.9 16.71-3.6 12.45.69 22.5 4.89 30.15 12.62-10.89 6.64-16.22 15.77-16.01 27.42.23 9.4 3.82 17.25 10.79 23.57 6.96 6.31 15.22 9.87 24.78 10.67-2.18 6.52-4.8 13.2-7.86 20.04-3.06 6.84-5.99 12.98-8.8 18.42zM119.22 33.02c0-7.39 2.66-14.41 7.99-21.06 5.33-6.64 11.97-10.99 19.92-13.04.54 2.82.81 5.48.81 7.99 0 7.39-2.77 14.46-8.31 21.22-5.55 6.75-12.33 11.05-20.35 12.89-.06-2.67-.06-5.33-.06-8z" />
    </svg>
  );
}

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithEmail, signup, loginWithGoogle, loginWithApple, resetPassword, profile } = useAuth();

  // "login" | "signup" | "forgot"
  const [mode, setMode] = useState(() => {
    return location.state?.mode === "signup" ? "signup" : "login";
  });

  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const [signupUsername, setSignupUsername] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Forgot Password sub-steps: 1 = email, 2 = code, 3 = new password, 4 = success
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotCode, setForgotCode] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [loadingAction, setLoadingAction] = useState(""); // "login" | "signup" | "google" | "apple" | "forgot"
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    const pwd = signupPassword;
    if (!pwd) return { score: 0, label: "Enter password", color: "bg-slate-200" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    switch (score) {
      case 1:
        return { score: 1, label: "Weak", color: "bg-red-400" };
      case 2:
        return { score: 2, label: "Fair", color: "bg-amber-400" };
      case 3:
        return { score: 3, label: "Good", color: "bg-sky-500" };
      case 4:
        return { score: 4, label: "Strong", color: "bg-emerald-500" };
      default:
        return { score: 1, label: "Weak", color: "bg-red-400" };
    }
  }, [signupPassword]);

  // Clear messages on tab change
  const switchMode = (newMode) => {
    setMode(newMode);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleSuccessfulAuth = (userObj) => {
    // If profile is not already completed, go to profile setup
    if (!profile?.username && !userObj?.profileCompleted) {
      navigate("/setup-profile", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  };

  // 1. Handle Email Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!loginEmail.trim() || !loginPassword) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setLoadingAction("login");
    try {
      const user = await loginWithEmail(loginEmail, loginPassword, rememberMe);
      setSuccessMsg("Signed in successfully! Redirecting...");
      setTimeout(() => {
        handleSuccessfulAuth(user);
      }, 600);
    } catch (err) {
      setErrorMsg(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoadingAction("");
    }
  };

  // 2. Handle Sign Up
  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!signupUsername.trim()) {
      setErrorMsg("Username is required.");
      return;
    }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(signupUsername.trim())) {
      setErrorMsg("Username must be 3-20 alphanumeric characters (letters, numbers, underscore).");
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (signupPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (!agreeTerms) {
      setErrorMsg("Please agree to the Terms of Service.");
      return;
    }

    setLoadingAction("signup");
    try {
      const user = await signup({
        username: signupUsername.trim(),
        name: signupName.trim() || signupUsername.trim(),
        email: signupEmail.trim(),
        password: signupPassword,
      });

      setSuccessMsg("Account created! Let's set up your profile...");
      setTimeout(() => {
        // Pass entered username and name to ProfileSetup
        navigate("/setup-profile", {
          replace: true,
          state: {
            initialUsername: signupUsername.trim(),
            initialName: signupName.trim(),
            initialEmail: signupEmail.trim(),
          },
        });
      }, 700);
    } catch (err) {
      setErrorMsg(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoadingAction("");
    }
  };

  // 3. Handle Google Auth
  const handleGoogleClick = () => {
    setShowGoogleModal(true);
  };

  const confirmGoogleAuth = async (customAccount = null) => {
    setShowGoogleModal(false);
    setLoadingAction("google");
    setErrorMsg("");
    try {
      const user = await loginWithGoogle(customAccount);
      setSuccessMsg(`Welcome, ${user.name}! Redirecting...`);
      setTimeout(() => {
        handleSuccessfulAuth(user);
      }, 600);
    } catch (err) {
      setErrorMsg("Google authentication failed. Please try again.");
    } finally {
      setLoadingAction("");
    }
  };

  // 4. Handle Apple Auth
  const handleAppleAuth = async () => {
    setLoadingAction("apple");
    setErrorMsg("");
    try {
      const user = await loginWithApple();
      setSuccessMsg("Apple authentication verified! Redirecting...");
      setTimeout(() => {
        handleSuccessfulAuth(user);
      }, 600);
    } catch (err) {
      setErrorMsg("Apple sign-in could not be completed.");
    } finally {
      setLoadingAction("");
    }
  };

  // 5. Handle Forgot Password Steps
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (forgotStep === 1) {
      if (!forgotEmail.trim() || !forgotEmail.includes("@")) {
        setErrorMsg("Please enter a valid email address.");
        return;
      }
      setLoadingAction("forgot");
      setTimeout(() => {
        setLoadingAction("");
        setForgotStep(2);
        setForgotCode("482910"); // auto-suggested simulation code
      }, 700);
    } else if (forgotStep === 2) {
      if (!forgotCode || forgotCode.length < 4) {
        setErrorMsg("Please enter the verification code.");
        return;
      }
      setForgotStep(3);
    } else if (forgotStep === 3) {
      if (!forgotNewPassword || forgotNewPassword.length < 6) {
        setErrorMsg("New password must be at least 6 characters.");
        return;
      }
      if (forgotNewPassword !== forgotConfirmPassword) {
        setErrorMsg("Passwords do not match.");
        return;
      }
      setLoadingAction("forgot");
      try {
        await resetPassword(forgotEmail, forgotNewPassword);
        setForgotStep(4);
      } catch (err) {
        setErrorMsg("Failed to reset password. Please try again.");
      } finally {
        setLoadingAction("");
      }
    }
  };

  return (
    <div className="relative mx-auto my-6 max-w-md animate-fade-in px-4">
      {/* Decorative Brand Header */}
      <div className="mb-6 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-2xl bg-white/80 px-4 py-2 text-xl font-bold text-sky-950 shadow-xs ring-1 ring-slate-200/80 backdrop-blur-md transition hover:scale-105"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500 text-white shadow-sm">
            <Compass className="h-5 w-5" />
          </div>
          Pathwise
        </Link>
        <p className="mt-2 text-sm text-slate-600">
          Student Skill Gap & Career Readiness Platform
        </p>
      </div>

      {/* Main Glass Card */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 p-6 sm:p-8 shadow-xl shadow-sky-900/5 backdrop-blur-xl">
        {/* Top Tab Switcher (if not in forgot password mode) */}
        {mode !== "forgot" ? (
          <div className="mb-6 flex rounded-2xl bg-slate-100 p-1.5 shadow-inner">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`flex-1 rounded-xl py-2.5 text-center text-sm font-semibold transition ${
                mode === "login"
                  ? "bg-white text-sky-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`flex-1 rounded-xl py-2.5 text-center text-sm font-semibold transition ${
                mode === "signup"
                  ? "bg-white text-sky-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Create Account
            </button>
          </div>
        ) : (
          <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-sky-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </button>
            <span className="text-xs font-semibold uppercase tracking-wider text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-200/60">
              Recovery
            </span>
          </div>
        )}

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50/90 p-3.5 text-xs text-red-800 shadow-xs animate-fade-in">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            <p className="font-medium leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {/* Global Success Banner */}
        {successMsg && (
          <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-3.5 text-xs text-emerald-800 shadow-xs animate-fade-in">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <p className="font-medium leading-relaxed">{successMsg}</p>
          </div>
        )}

        {/* ----------------- LOGIN / SIGNUP WORKFLOW ----------------- */}
        {mode !== "forgot" && (
          <div className="space-y-4">
            {/* Social Authentication Options */}
            <div className="grid grid-cols-2 gap-3">
              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleClick}
                disabled={Boolean(loadingAction)}
                className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] disabled:opacity-60"
              >
                {loadingAction === "google" ? (
                  <Loader2 className="h-4 w-4 animate-spin text-sky-600" />
                ) : (
                  <GoogleIcon className="h-4 w-4 shrink-0" />
                )}
                <span>Google</span>
              </button>

              {/* Apple Button */}
              <button
                type="button"
                onClick={handleAppleAuth}
                disabled={Boolean(loadingAction)}
                className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-slate-900 bg-slate-900 py-2.5 px-3 text-sm font-semibold text-white shadow-xs transition hover:bg-black active:scale-[0.98] disabled:opacity-60"
              >
                {loadingAction === "apple" ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <AppleIcon className="h-4 w-4 shrink-0 text-white" />
                )}
                <span>Apple</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="w-full border-t border-slate-200" />
              <span className="absolute bg-white px-3 text-xs uppercase tracking-wider text-slate-400">
                or with email
              </span>
            </div>

            {/* MODE: SIGN IN */}
            {mode === "login" && (
              <form onSubmit={handleEmailLogin} className="space-y-4" noValidate>
                {/* Email Field */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Email Address
                  </label>
                  <div className="relative mt-1.5">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-xs focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => switchMode("forgot")}
                      className="text-xs font-medium text-sky-600 hover:text-sky-700 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative mt-1.5">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-xs focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span className="text-xs text-slate-600">Remember me for 30 days</span>
                  </label>
                </div>

                {/* Submit Sign In Button */}
                <button
                  type="submit"
                  disabled={Boolean(loadingAction)}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 py-3 px-4 text-sm font-semibold text-white shadow-md shadow-sky-500/25 transition hover:bg-sky-600 active:scale-[0.98] disabled:opacity-70"
                >
                  {loadingAction === "login" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to Pathwise</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* MODE: CREATE ACCOUNT (SIGN UP) */}
            {mode === "signup" && (
              <form onSubmit={handleSignup} className="space-y-3.5" noValidate>
                {/* Username */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                      placeholder="e.g. rahul_tech"
                      className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-xs focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                      required
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    3-20 letters, numbers, or underscore.
                  </span>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Full Name
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="Rahul Sharma"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-xs focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-xs focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                      required
                    />
                  </div>
                </div>

                {/* Password & Live Strength Meter */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Create Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-xs focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Password Strength Bar */}
                  {signupPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="flex h-1.5 w-full gap-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full transition-all duration-300 ${
                            passwordStrength.score >= 1 ? passwordStrength.color : "bg-transparent"
                          } w-1/4`}
                        />
                        <div
                          className={`h-full transition-all duration-300 ${
                            passwordStrength.score >= 2 ? passwordStrength.color : "bg-transparent"
                          } w-1/4`}
                        />
                        <div
                          className={`h-full transition-all duration-300 ${
                            passwordStrength.score >= 3 ? passwordStrength.color : "bg-transparent"
                          } w-1/4`}
                        />
                        <div
                          className={`h-full transition-all duration-300 ${
                            passwordStrength.score >= 4 ? passwordStrength.color : "bg-transparent"
                          } w-1/4`}
                        />
                      </div>
                      <p className="text-[11px] font-medium text-slate-500 flex justify-between">
                        <span>Strength: {passwordStrength.label}</span>
                        <span className="text-slate-400">Min 6 chars</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-xs focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                      required
                    />
                  </div>
                  {signupConfirmPassword && signupPassword !== signupConfirmPassword && (
                    <span className="text-[11px] text-red-500 mt-1 block">Passwords do not match</span>
                  )}
                </div>

                {/* Terms Acceptance */}
                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span className="text-xs text-slate-600 leading-tight">
                      I agree to the Pathwise Terms of Service and Privacy Policy.
                    </span>
                  </label>
                </div>

                {/* Submit Sign Up Button */}
                <button
                  type="submit"
                  disabled={Boolean(loadingAction)}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 py-3 px-4 text-sm font-semibold text-white shadow-md shadow-sky-500/25 transition hover:bg-sky-600 active:scale-[0.98] disabled:opacity-70"
                >
                  {loadingAction === "signup" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <span>Create Account & Continue</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ----------------- FORGOT PASSWORD WORKFLOW ----------------- */}
        {mode === "forgot" && (
          <div className="space-y-4">
            {forgotStep === 1 && (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-bold text-slate-900">Reset your password</h3>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    Enter your registered email address. We will verify your account and send a 6-digit recovery code.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Email Address
                  </label>
                  <div className="relative mt-1.5">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3.5 py-2.5 text-sm text-slate-900 shadow-xs focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={Boolean(loadingAction)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 py-3 px-4 text-sm font-semibold text-white shadow-md transition hover:bg-sky-600 disabled:opacity-70"
                >
                  {loadingAction === "forgot" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Send Verification Code"
                  )}
                </button>
              </form>
            )}

            {forgotStep === 2 && (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-bold text-slate-900">Enter verification code</h3>
                  <p className="mt-1 text-xs text-slate-600">
                    We sent a security code to <strong className="text-slate-800">{forgotEmail}</strong>.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    6-Digit Code
                  </label>
                  <input
                    type="text"
                    value={forgotCode}
                    onChange={(e) => setForgotCode(e.target.value)}
                    maxLength={6}
                    placeholder="123456"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-center text-lg font-bold tracking-widest text-slate-900 shadow-xs focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    required
                  />
                  <p className="mt-1.5 text-center text-xs text-slate-500">
                    Demo simulation code pre-filled.
                  </p>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 py-3 px-4 text-sm font-semibold text-white shadow-md hover:bg-sky-600"
                >
                  Verify Code
                </button>
              </form>
            )}

            {forgotStep === 3 && (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-bold text-slate-900">Set new password</h3>
                  <p className="mt-1 text-xs text-slate-600">
                    Choose a strong new password for your Pathwise account.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-xs focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={forgotConfirmPassword}
                    onChange={(e) => setForgotConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-xs focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={Boolean(loadingAction)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 py-3 px-4 text-sm font-semibold text-white shadow-md hover:bg-sky-600 disabled:opacity-70"
                >
                  {loadingAction === "forgot" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Update Password"
                  )}
                </button>
              </form>
            )}

            {forgotStep === 4 && (
              <div className="text-center space-y-4 py-4 animate-fade-in">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <Check className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Password reset complete!</h3>
                <p className="text-xs text-slate-600">
                  You can now sign in using your new credentials.
                </p>
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-500 py-2.5 px-6 text-sm font-semibold text-white shadow-sm hover:bg-sky-600"
                >
                  Back to Sign In
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Google Mock Account Chooser Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <GoogleIcon className="h-5 w-5" />
                <span className="font-semibold text-slate-800 text-sm">Sign in with Google</span>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Choose an account to continue to <strong>Pathwise</strong>:
            </p>

            <div className="mt-4 space-y-2">
              {/* Account 1 */}
              <button
                type="button"
                onClick={() =>
                  confirmGoogleAuth({
                    id: "goog_1",
                    username: "alex_chen",
                    name: "Alex Chen",
                    firstName: "Alex",
                    lastName: "Chen",
                    email: "alex.chen@gmail.com",
                    provider: "google",
                  })
                }
                className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 p-3 text-left transition hover:bg-sky-50 hover:border-sky-300"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  AC
                </div>
                <div className="flex-1 truncate">
                  <p className="text-sm font-semibold text-slate-900 truncate">Alex Chen</p>
                  <p className="text-xs text-slate-500 truncate">alex.chen@gmail.com</p>
                </div>
              </button>

              {/* Account 2 */}
              <button
                type="button"
                onClick={() =>
                  confirmGoogleAuth({
                    id: "goog_2",
                    username: "priya_sharma",
                    name: "Priya Sharma",
                    firstName: "Priya",
                    lastName: "Sharma",
                    email: "priya.sharma@gmail.com",
                    provider: "google",
                  })
                }
                className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 p-3 text-left transition hover:bg-sky-50 hover:border-sky-300"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                  PS
                </div>
                <div className="flex-1 truncate">
                  <p className="text-sm font-semibold text-slate-900 truncate">Priya Sharma</p>
                  <p className="text-xs text-slate-500 truncate">priya.sharma@gmail.com</p>
                </div>
              </button>
            </div>

            <p className="mt-4 text-center text-[11px] text-slate-400">
              Simulated Google OAuth secure environment
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
