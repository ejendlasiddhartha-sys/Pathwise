import { createContext, useContext, useEffect, useState } from "react";
import { createStudent } from "../services/api";

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = "pathwise_auth_user";
const PROFILE_STORAGE_KEY = "pathwise_profile_full";
const STUDENT_STORAGE_KEY = "pathwise_student";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [profile, setProfile] = useState(() => {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
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

      // Synthesize name & career goal for API contract compatibility
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

      const email = user?.email || profileData.email || `${profileData.username.toLowerCase()}@student.pathwise.edu`;

      const studentObject = {
        name: fullName || profileData.username,
        email: email,
        education: educationString || "Student",
        career_goal: careerGoal,
      };

      // Try syncing with backend API if running
      try {
        const res = await createStudent(studentObject);
        studentObject.id = res.id;
      } catch (err) {
        // Backend offline or duplicate - fallback to client ID
        studentObject.id = Date.now();
      }

      localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(studentObject));
      localStorage.setItem("pathwise_student_id", String(studentObject.id));

      // Also update auth user display name
      if (user) {
        const updatedUser = {
          ...user,
          username: profileData.username || user.username,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
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

  // Login with Email & Password
  const loginWithEmail = async (email, password, remember = true) => {
    // Simulated authentication with realistic delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Basic credentials validation
    if (!email || !password) {
      throw new Error("Please enter both email and password.");
    }

    const defaultUsername = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
    const authenticatedUser = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      email: email.trim().toLowerCase(),
      username: defaultUsername || "student",
      name: defaultUsername.charAt(0).toUpperCase() + defaultUsername.slice(1),
      provider: "email",
      profileCompleted: Boolean(profile?.username),
      loginAt: new Date().toISOString(),
    };

    persistUser(authenticatedUser);
    return authenticatedUser;
  };

  // Sign up with new credentials
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

  // Continue with Google Account
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
      profileCompleted: false,
    };

    persistUser(googleUser);
    return googleUser;
  };

  // Continue with Apple Account
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
      profileCompleted: false,
    };

    persistUser(appleUser);
    return appleUser;
  };

  // Forgot / Reset Password
  const resetPassword = async (email, newPassword) => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    if (!email || !newPassword) {
      throw new Error("Please provide email and new password.");
    }
    return { success: true, message: "Password updated successfully. You can now sign in." };
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
