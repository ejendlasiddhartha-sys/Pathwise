import { createContext, useContext, useEffect, useState } from "react";
import { createStudent } from "../services/api";

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = "pathwise_auth_user";
const PROFILE_STORAGE_KEY = "pathwise_profile_full";
const STUDENT_STORAGE_KEY = "pathwise_student";
const NOTIFICATIONS_STORAGE_KEY = "pathwise_notifications";
const CERTIFICATIONS_STORAGE_KEY = "pathwise_certifications";

const DEFAULT_NOTIFICATIONS = [
  {
    id: "notif_1",
    title: "Welcome to Pathwise!",
    message: "Your personalized career diagnostics and skill gap analysis are now ready to explore.",
    type: "account",
    timestamp: "10 mins ago",
    read: false,
  },
  {
    id: "notif_2",
    title: "Certification Recommendation",
    message: "AWS Certified Cloud Practitioner and Meta Frontend Certifications are trending in your field.",
    type: "certification",
    timestamp: "2 hours ago",
    read: false,
  },
  {
    id: "notif_3",
    title: "Learning Milestone Reminder",
    message: "You have 3 critical skills to bridge to boost your career readiness score beyond 75%.",
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
            username: "rahul_tech",
            firstName: "Rahul",
            middleName: "Kumar",
            lastName: "Sharma",
            dob: "2003-08-15",
            educationType: "Undergraduate",
            educationDetails: {
              schoolGrade: "Class 12",
              intermediateStream: "MPC",
              intermediateOther: "",
              pursuingQualification: "B.Tech Computer Science & Engineering",
            },
            employmentStatus: "Employed",
            employmentDetails: {
              jobRole: "Frontend Engineer",
              jobTitle: "Junior Software Engineer",
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

  // Save full profile setup
  const saveFullProfile = async (profileData) => {
    try {
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

      let careerGoal = "Software & Tech Career";
      if (profileData.employmentStatus === "Employed" && profileData.employmentDetails?.jobRole) {
        careerGoal = profileData.employmentDetails.jobRole;
      } else if (profileData.careerGoal) {
        careerGoal = profileData.careerGoal;
      }

      const email = user?.email || profileData.email || `${profileData.username?.toLowerCase() || "student"}@student.pathwise.edu`;

      const studentObject = {
        name: fullName || profileData.username || "Student",
        email: email,
        education: educationString || "Student",
        career_goal: careerGoal,
      };

      try {
        const res = await createStudent(studentObject);
        studentObject.id = res.id;
      } catch (err) {
        studentObject.id = Date.now();
      }

      localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(studentObject));
      localStorage.setItem("pathwise_student_id", String(studentObject.id));

      if (user) {
        const updatedUser = {
          ...user,
          username: profileData.username || user.username,
          firstName: profileData.firstName || user.firstName,
          lastName: profileData.lastName || user.lastName,
          name: fullName || user.name,
          profileCompleted: true,
        };
        persistUser(updatedUser);
      }

      return { success: true, student: studentObject };
    } catch (error) {
      console.error("Failed to save full profile:", error);
      throw error;
    }
  };

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
    return googleUser;
  };

  // Apple
  const loginWithApple = async () => {
    await new Promise((resolve) => setTimeout(resolve, 650));

    const appleUser = {
      id: "appl_" + Math.random().toString(36).substring(2, 9),
      username: "sarah_miller",
      name: "Sarah Miller",
      firstName: "Sarah",
      lastName: "Miller",
      email: "sarah.miller@privaterelay.appleid.com",
      provider: "apple",
      profileCompleted: true,
    };

    persistUser(appleUser);
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
    setUser(null);
    setProfile(null);
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
