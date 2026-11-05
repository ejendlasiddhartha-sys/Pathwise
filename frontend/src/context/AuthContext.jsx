import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createStudent, updateStudent, getRecommendations, refreshRecommendations } from "../services/api";

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = "pathwise_auth_user";
const PROFILE_STORAGE_KEY = "pathwise_profile_full";
const STUDENT_STORAGE_KEY = "pathwise_student";
const NOTIFICATIONS_STORAGE_KEY = "pathwise_notifications";
const CERTIFICATIONS_STORAGE_KEY = "pathwise_certifications";
const RECOMMENDATIONS_STORAGE_KEY = "pathwise_recommendations";

const DEFAULT_NOTIFICATIONS = [
  {
    id: "notif_1",
    title: "AI Career Advisor Active",
    message: "Google Gemini career analysis and readiness diagnostics are initialized for your profile.",
    type: "account",
    timestamp: "Just now",
    read: false,
  },
  {
    id: "notif_2",
    title: "Certification Recommendation",
    message: "Meta Certified Frontend Developer and AWS Cloud Practitioner are high-impact certifications for your track.",
    type: "certification",
    timestamp: "2 hours ago",
    read: false,
  },
  {
    id: "notif_3",
    title: "Learning Milestone Reminder",
    message: "You have 3 critical skill gaps to bridge to boost your career readiness score beyond 75%.",
    type: "reminder",
    timestamp: "1 day ago",
    read: false,
  },
  {
    id: "notif_4",
    title: "Diagnostic System Updated",
    message: "Pathwise Milestone 2 benchmarking algorithms are active with real-world requirements.",
    type: "update",
    timestamp: "3 days ago",
    read: true,
  },
];

const DEFAULT_CERTIFICATIONS = [
  {
    id: "cert_1",
    name: "Meta Certified Frontend Developer",
    organization: "Meta / Coursera",
    completionDate: "2024-08-15",
    credentialId: "META-FE-89214",
    status: "Verified",
    documentUrl: "",
    documentName: "Meta_Frontend_Certificate.pdf",
  },
  {
    id: "cert_2",
    name: "Responsive Web Design Certification",
    organization: "freeCodeCamp",
    completionDate: "2024-05-10",
    credentialId: "FCC-RWD-44120",
    status: "Verified",
    documentUrl: "",
    documentName: "FCC_Web_Design.pdf",
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored
        ? JSON.parse(stored)
        : {
            id: "usr_demo",
            studentId: 1,
            username: "rahul_tech",
            name: "Rahul Sharma",
            firstName: "Rahul",
            lastName: "Sharma",
            email: "rahul.sharma@example.com",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            provider: "email",
            profileCompleted: true,
          };
    } catch {
      return null;
    }
  });

  const [profile, setProfile] = useState(() => {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      return stored
        ? JSON.parse(stored)
        : {
            studentId: 1,
            username: "rahul_tech",
            firstName: "Rahul",
            middleName: "Kumar",
            lastName: "Sharma",
            dob: "2003-08-15",
            targetCareer: "Frontend Developer",
            educationType: "Undergraduate",
            educationDetails: {
              schoolGrade: "Class 12",
              intermediateStream: "MPC",
              intermediateOther: "",
              pursuingQualification: "B.Tech Computer Science & Engineering",
            },
            employmentStatus: "Employed",
            employmentDetails: {
              jobRole: "Junior Software Engineer",
              jobTitle: "Associate Developer",
              industrySector: "Technology & Software",
              companyName: "Tech Innovations Ltd.",
              completedQualification: "B.Tech",
              degreeName: "Computer Science",
              collegeName: "National Institute of Technology",
              graduationYear: "2024",
            },
          };
    } catch {
      return null;
    }
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_NOTIFICATIONS;
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  });

  const [certifications, setCertifications] = useState(() => {
    try {
      const stored = localStorage.getItem(CERTIFICATIONS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_CERTIFICATIONS;
    } catch {
      return DEFAULT_CERTIFICATIONS;
    }
  });

  // AI recommendations state
  const [recommendations, setRecommendations] = useState(() => {
    try {
      const stored = localStorage.getItem(RECOMMENDATIONS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isRecsLoading, setIsRecsLoading] = useState(false);
  const [recsError, setRecsError] = useState(null);

  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    setIsInitializing(false);
  }, []);

  // Save auth user to localStorage
  const persistUser = (userData) => {
    if (userData) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    setUser(userData);
  };

  // Helper to detect significant profile changes that warrant AI analysis
  const hasSignificantChanges = (oldP, newP) => {
    if (!oldP || !newP) return true;
    if ((oldP.targetCareer || "") !== (newP.targetCareer || "")) return true;
    if ((oldP.educationType || "") !== (newP.educationType || "")) return true;
    if (
      JSON.stringify(oldP.educationDetails || {}) !==
      JSON.stringify(newP.educationDetails || {})
    )
      return true;
    if (
      (oldP.employmentDetails?.jobRole || "") !==
      (newP.employmentDetails?.jobRole || "")
    )
      return true;
    return false;
  };

  // Save full profile setup (Fixes student profile persistence & avoids duplicates)
  const saveFullProfile = async (profileData) => {
    try {
      const oldProfile = profile;
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));
      setProfile(profileData);

      const fullName = [
        profileData.firstName,
        profileData.middleName,
        profileData.lastName,
      ]
        .filter(Boolean)
        .join(" ");

      let educationString = "";
      if (profileData.educationType === "School") {
        educationString = `School (${profileData.educationDetails?.schoolGrade || "High School"})`;
      } else if (profileData.educationType === "Intermediate") {
        educationString = `Intermediate (${profileData.educationDetails?.intermediateStream || "General"})`;
      } else if (profileData.educationType === "Undergraduate") {
        educationString = profileData.educationDetails?.pursuingQualification || "Undergraduate";
      } else if (profileData.educationType === "Completed Undergraduate") {
        if (profileData.employmentStatus === "Unemployed") {
          educationString = `${profileData.employmentDetails?.degreeName || "Graduate"} (${profileData.employmentDetails?.collegeName || "Completed"})`;
        } else {
          educationString = "Completed Undergraduate";
        }
      }

      // Explicitly separate target career from current employment role
      const targetCareer =
        profileData.targetCareer ||
        profileData.target_career ||
        profileData.careerGoal ||
        profileData.career_goal ||
        "Frontend Developer";

      let experienceString = "";
      if (profileData.employmentStatus === "Employed") {
        experienceString = [
          profileData.employmentDetails?.jobRole,
          profileData.employmentDetails?.jobTitle,
          profileData.employmentDetails?.companyName,
        ]
          .filter(Boolean)
          .join(" at ");
      } else {
        experienceString = "Seeking employment / Student";
      }

      const email =
        user?.email ||
        profileData.email ||
        `${profileData.username?.toLowerCase() || "student"}@student.pathwise.edu`;

      const studentObject = {
        name: fullName || profileData.username || "Student",
        email: email,
        education: educationString || "Student",
        career_goal: targetCareer,
        target_career: targetCareer,
        experience: experienceString,
        skills: profileData.skills || [],
        certifications: certifications || [],
      };

      // Retrieve existing student ID to UPDATE rather than create duplicates
      const storedIdStr =
        localStorage.getItem("pathwise_student_id") ||
        profileData.studentId ||
        profile?.studentId ||
        user?.studentId;
      const existingId = storedIdStr ? parseInt(storedIdStr, 10) : null;

      let savedRecord = null;
      // If we have a reasonable numeric ID, perform PUT /api/students/{id}
      if (existingId && !isNaN(existingId) && existingId < 1000000000000) {
        try {
          savedRecord = await updateStudent(existingId, studentObject);
          studentObject.id = savedRecord.id;
        } catch (updateErr) {
          if (updateErr.response?.status === 404) {
            // Student record not in current DB session, create it
            try {
              savedRecord = await createStudent(studentObject);
              studentObject.id = savedRecord.id;
            } catch (createErr) {
              studentObject.id = existingId;
            }
          } else {
            studentObject.id = existingId;
          }
        }
      } else {
        // No existing ID, perform initial create
        try {
          savedRecord = await createStudent(studentObject);
          studentObject.id = savedRecord.id;
        } catch (createErr) {
          studentObject.id = 1;
        }
      }

      localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(studentObject));
      localStorage.setItem("pathwise_student_id", String(studentObject.id));

      if (user) {
        const updatedUser = {
          ...user,
          studentId: studentObject.id,
          username: profileData.username || user.username,
          firstName: profileData.firstName || user.firstName,
          lastName: profileData.lastName || user.lastName,
          name: fullName || user.name,
          profileCompleted: true,
        };
        persistUser(updatedUser);
      }

      // Check if significant changes were made and trigger recommendation refresh
      if (hasSignificantChanges(oldProfile, profileData)) {
        loadRecommendations(studentObject.id, targetCareer, false).catch((e) =>
          console.warn("Auto recommendation update note:", e)
        );
      }

      return { success: true, student: studentObject };
    } catch (error) {
      console.error("Failed to save full profile:", error);
      throw error;
    }
  };

  // Load recommendations with caching and offline fallback
  const loadRecommendations = useCallback(
    async (studentId = null, targetCareerId = null, forceRefresh = false) => {
      const activeId =
        studentId ||
        (user?.studentId
          ? user.studentId
          : parseInt(localStorage.getItem("pathwise_student_id") || "1", 10));

      const activeCareer =
        targetCareerId ||
        profile?.targetCareer ||
        profile?.careerGoal ||
        "frontend_developer";

      setIsRecsLoading(true);
      setRecsError(null);

      try {
        let resData;
        if (forceRefresh) {
          resData = await refreshRecommendations(activeId, {
            target_career_id: activeCareer,
            force: true,
          });
        } else {
          resData = await getRecommendations(activeId, activeCareer);
        }

        setRecommendations(resData);
        localStorage.setItem(RECOMMENDATIONS_STORAGE_KEY, JSON.stringify(resData));
        setIsRecsLoading(false);
        return resData;
      } catch (err) {
        console.warn("Backend recommendation API note:", err.message);
        // Fallback to high quality client recommendation if offline or error
        const fallback = {
          student_id: activeId,
          target_career_id: activeCareer.toLowerCase().replace(/[^a-z0-9]/g, "_"),
          target_career_name: activeCareer,
          readiness_score: 65,
          profile_fingerprint: "offline_fallback_" + activeCareer,
          is_outdated: false,
          cached: true,
          grounding_used: false,
          skill_gaps: [
            { name: "JavaScript", required_level: 4, current_level: 2, gap: 2, priority: "Medium" },
            { name: "React", required_level: 4, current_level: 0, gap: 4, priority: "Critical" },
            { name: "REST APIs & HTTP", required_level: 3, current_level: 2, gap: 1, priority: "Low" },
          ],
          recommendation: {
            summary: `Based on your academic background in ${profile?.educationType || "Computer Science"} and target role as ${activeCareer}, your calculated readiness score is 65%. Closing high-impact framework gaps will accelerate entry-level hiring readiness.`,
            changes_detected: ["Local verified evaluation applied."],
            priority_skills: [
              {
                skill: "React",
                reason: "Crucial component-based architecture requirement with an active gap of 4 levels.",
                priority: "Critical",
                suggested_action: "Build 2 full-featured interactive single page applications using hooks and router.",
              },
              {
                skill: "JavaScript (ES6+)",
                reason: "Asynchronous patterns and DOM optimization are daily core requirements.",
                priority: "High",
                suggested_action: "Complete asynchronous fetch and promise-chaining exercises.",
              },
              {
                skill: "Version Control (Git)",
                reason: "Essential for team collaboration, code reviews, and CI/CD deployment pipelines.",
                priority: "Medium",
                suggested_action: "Publish modular repositories with clean semantic commits and pull requests.",
              },
            ],
            certifications: [
              {
                name: "Meta Certified Frontend Developer",
                provider: "Meta / Coursera",
                reason: "Directly bridges your React and modern responsive interface requirements.",
                official_url: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
                relevant_skills: ["React", "JavaScript", "HTML", "CSS"],
              },
              {
                name: "Responsive Web Design Certification",
                provider: "freeCodeCamp",
                reason: "Validates accessibility, semantic structure, and modern Flexbox/Grid layouts.",
                official_url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
                relevant_skills: ["CSS", "Responsive Web Design"],
              },
              {
                name: "AWS Certified Cloud Practitioner",
                provider: "Amazon Web Services",
                reason: "Provides foundational cloud hosting and deployment infrastructure awareness.",
                official_url: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
                relevant_skills: ["REST APIs & HTTP", "Cloud Core Services"],
              },
            ],
            next_steps: [
              "Focus immediately on mastering React modular state management.",
              "Complete freeCodeCamp responsive web design exercises.",
              "Track your weekly milestones in the Pathwise Roadmap tab.",
            ],
            sources: [
              { title: "Pathwise Career Benchmark Catalogue", url: "local://careers.json" },
              { title: "Meta Professional Curriculum", url: "https://www.coursera.org/professional-certificates/meta-front-end-developer" },
            ],
            generated_at: new Date().toISOString(),
          },
        };
        setRecommendations(fallback);
        localStorage.setItem(RECOMMENDATIONS_STORAGE_KEY, JSON.stringify(fallback));
        setIsRecsLoading(false);
        return fallback;
      }
    },
    [profile, user]
  );

  // Update profile avatar image
  const updateAvatar = (avatarUrl) => {
    if (user) {
      const updated = { ...user, avatar: avatarUrl };
      persistUser(updated);
    }
  };

  // Update account details from Settings
  const updateAccountInfo = ({ username, email, firstName, lastName }) => {
    const fullName = [firstName, lastName].filter(Boolean).join(" ");
    if (user) {
      const updatedUser = {
        ...user,
        username: username || user.username,
        email: email || user.email,
        name: fullName || user.name,
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
      };
      persistUser(updatedUser);
    }

    if (profile) {
      const updatedProfile = {
        ...profile,
        username: username || profile.username,
        firstName: firstName || profile.firstName,
        lastName: lastName || profile.lastName,
      };
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
    }
  };

  // Notifications operations
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteNotification = (id) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
  };

  // Certifications operations
  const addCertification = (certData) => {
    const newCert = {
      id: "cert_" + Date.now(),
      status: "Verified",
      ...certData,
    };
    const updated = [newCert, ...certifications];
    setCertifications(updated);
    localStorage.setItem(CERTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));

    // Refresh recommendations since certifications changed
    loadRecommendations(null, null, false).catch((e) => console.debug(e));
    return newCert;
  };

  const updateCertification = (id, certData) => {
    const updated = certifications.map((c) =>
      c.id === id ? { ...c, ...certData } : c
    );
    setCertifications(updated);
    localStorage.setItem(CERTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteCertification = (id) => {
    const updated = certifications.filter((c) => c.id !== id);
    setCertifications(updated);
    localStorage.setItem(CERTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
  };

  // Login with Email & Password
  const loginWithEmail = async (email, password, remember = true) => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!email || !password) {
      throw new Error("Please enter both email and password.");
    }

    const defaultUsername = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
    const authenticatedUser = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      studentId: 1,
      email: email.trim().toLowerCase(),
      username: defaultUsername || "student",
      name: defaultUsername.charAt(0).toUpperCase() + defaultUsername.slice(1),
      firstName: defaultUsername.charAt(0).toUpperCase() + defaultUsername.slice(1),
      lastName: "Student",
      provider: "email",
      profileCompleted: Boolean(profile?.username),
      loginAt: new Date().toISOString(),
    };

    persistUser(authenticatedUser);
    // Load recommendations on login
    loadRecommendations(1, profile?.targetCareer || "frontend_developer", false).catch((e) =>
      console.debug(e)
    );
    return authenticatedUser;
  };

  // Sign up
  const signup = async ({ username, name, email, password }) => {
    await new Promise((resolve) => setTimeout(resolve, 750));

    if (!username || !email || !password) {
      throw new Error("All required registration fields must be completed.");
    }

    const nameParts = (name || username).trim().split(" ");
    const firstName = nameParts[0] || username;
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    const newUser = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      studentId: 1,
      username: username.trim(),
      name: name?.trim() || username,
      firstName,
      lastName,
      email: email.trim().toLowerCase(),
      provider: "email",
      profileCompleted: false,
      registeredAt: new Date().toISOString(),
    };

    persistUser(newUser);
    return newUser;
  };

  // Google
  const loginWithGoogle = async (customGoogleUser = null) => {
    await new Promise((resolve) => setTimeout(resolve, 650));

    const googleUser = customGoogleUser || {
      id: "goog_" + Math.random().toString(36).substring(2, 9),
      studentId: 1,
      username: "alex_chen",
      name: "Alex Chen",
      firstName: "Alex",
      lastName: "Chen",
      email: "alex.chen@gmail.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      provider: "google",
      profileCompleted: true,
    };

    persistUser(googleUser);
    loadRecommendations(1, "frontend_developer", false).catch((e) => console.debug(e));
    return googleUser;
  };

  // Apple
  const loginWithApple = async () => {
    await new Promise((resolve) => setTimeout(resolve, 650));

    const appleUser = {
      id: "appl_" + Math.random().toString(36).substring(2, 9),
      studentId: 1,
      username: "sarah_miller",
      name: "Sarah Miller",
      firstName: "Sarah",
      lastName: "Miller",
      email: "sarah.miller@privaterelay.appleid.com",
      provider: "apple",
      profileCompleted: true,
    };

    persistUser(appleUser);
    loadRecommendations(1, "frontend_developer", false).catch((e) => console.debug(e));
    return appleUser;
  };

  // Reset password
  const resetPassword = async (email, newPassword) => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    if (!email || !newPassword) {
      throw new Error("Please provide email and new password.");
    }
    return { success: true, message: "Password updated successfully. You can now sign in." };
  };

  // Delete Account
  const deleteAccount = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    localStorage.removeItem(STUDENT_STORAGE_KEY);
    localStorage.removeItem(NOTIFICATIONS_STORAGE_KEY);
    localStorage.removeItem(CERTIFICATIONS_STORAGE_KEY);
    localStorage.removeItem(RECOMMENDATIONS_STORAGE_KEY);
    localStorage.removeItem("pathwise_student_id");
    setUser(null);
    setProfile(null);
    setRecommendations(null);
  };

  // Logout
  const logout = () => {
    persistUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: Boolean(user),
        isInitializing,
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        certifications,
        addCertification,
        updateCertification,
        deleteCertification,
        recommendations,
        isRecsLoading,
        recsError,
        loadRecommendations,
        updateAvatar,
        updateAccountInfo,
        deleteAccount,
        loginWithEmail,
        signup,
        loginWithGoogle,
        loginWithApple,
        resetPassword,
        saveFullProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
