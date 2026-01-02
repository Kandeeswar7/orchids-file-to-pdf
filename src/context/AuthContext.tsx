"use client";

import { createContext, useContext, useEffect, useState } from "react";

import {
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  deleteUser,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase/client";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  increment,
  addDoc,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { signInWithGoogle } from "@/lib/auth/googleSignIn";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  plan: "free" | "premium";
  dailyUsage: number;
  signInWithGoogle: () => Promise<void | User>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<User>;
  signInWithEmail: (email: string, pass: string) => Promise<User>;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
  sendVerificationEmail: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  upgradeToPremium: () => Promise<void>;
  recordConversion: (jobData: {
    jobId: string;
    fileName: string;
    fileType: string;
    fileSize: number;
  }) => Promise<void>;
  deleteProfile: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  checkUsageReset: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  plan: "free",
  dailyUsage: 0,
  signInWithGoogle: async () => {},
  signUpWithEmail: async () => {
    throw new Error("Not implemented");
  },
  signInWithEmail: async () => {
    throw new Error("Not implemented");
  },
  signOut: async () => {},
  getToken: async () => null,
  sendVerificationEmail: async () => {},
  refreshUserData: async () => {},
  upgradeToPremium: async () => {},
  recordConversion: async () => {},
  deleteProfile: async () => {},
  resetPassword: async () => {},
  checkUsageReset: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<"free" | "premium">("free");
  const [dailyUsage, setDailyUsage] = useState(0);

  // Helper for safe usage reading
  const getSafeUsage = (key: string): number => {
    const raw = localStorage.getItem(key);
    if (!raw) return 0;
    const val = parseInt(raw, 10);
    return isNaN(val) ? 0 : val;
  };

  /*
   * CHECK AND RESET DAILY USAGE (Global / Date-Based)
   * reset happens if the date has changed, clearing ALL browser-local usage.
   * Firestore is NOT reset here (it is informational/historical).
   */
  const checkUsageReset = () => {
    if (typeof window === "undefined") return; // SSR check

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const lastResetKey = "converty_last_reset_date";
    const lastResetDate = localStorage.getItem(lastResetKey);
    const anonKey = "converty_usage_anonymous";
    const userKey = user ? `converty_usage_${user.uid}` : "";

    // If dates differ -> NEW DAY RESET
    if (lastResetDate !== today) {
      console.log(
        `[AuthContext] New day detected (${today}). Resetting ALL local usage.`
      );

      localStorage.setItem(lastResetKey, today);
      localStorage.setItem(anonKey, "0");

      // Reset all usage keys for safety
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("converty_usage_")) {
          localStorage.setItem(key, "0");
        }
      });

      setDailyUsage(0);
      return;
    }

    // Ensure keys exist even if no reset needed (Fixes Bug 1: Init)
    if (localStorage.getItem(anonKey) === null) {
      localStorage.setItem(anonKey, "0");
    }
    if (userKey && localStorage.getItem(userKey) === null) {
      localStorage.setItem(userKey, "0");
    }
  };

  const fetchUserData = async (uid: string) => {
    // 1. Run Global Reset Check
    checkUsageReset();

    if (!db) {
      // Demo/Offline Mode
      // Load usage (Max of anon and user)
      const anonUsage = getSafeUsage("converty_usage_anonymous");
      const userUsage = getSafeUsage(`converty_usage_${uid}`);
      setDailyUsage(Math.max(anonUsage, userUsage));
      setPlan("free");
      return;
    }

    try {
      const userRef = doc(db, "users", uid);
      let userDoc = await getDoc(userRef);

      // Create doc if missing
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          uid,
          email: auth?.currentUser?.email || "",
          plan: "free",
          dailyConversionCount: 0,
          lastResetAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        });
        userDoc = await getDoc(userRef);
      }

      const data = userDoc.data();
      if (data) {
        let currentPlan = (data.plan as "free" | "premium") || "free";

        // CHECK PREMIUM EXPIRY
        if (currentPlan === "premium" && data.premiumExpiresAt) {
          const expiresAt = new Date(data.premiumExpiresAt).getTime();
          if (Date.now() > expiresAt) {
            console.log("[AuthContext] Premium expired. Downgrading to Free.");
            currentPlan = "free";
            updateDoc(userRef, { plan: "free" }).catch((e) =>
              console.warn("Failed to sync downgrade to Firestore", e)
            );
          }
        }

        setPlan(currentPlan);

        // 2. Effective Usage Calculation
        const anonUsage = getSafeUsage("converty_usage_anonymous");
        const userLocalUsage = getSafeUsage(`converty_usage_${uid}`);

        const effectiveUsage = Math.max(anonUsage, userLocalUsage);
        setDailyUsage(effectiveUsage);
      }
    } catch (e) {
      console.error("Error fetching user data:", e);
      setPlan("free");
      const anonUsage = getSafeUsage("converty_usage_anonymous");
      const userUsage = getSafeUsage(`converty_usage_${uid}`);
      setDailyUsage(Math.max(anonUsage, userUsage));
    }
  };

  const loadAnonymousUsage = () => {
    checkUsageReset();
    const usage = getSafeUsage("converty_usage_anonymous");
    setDailyUsage(usage);
    setPlan("free");
  };

  useEffect(() => {
    // If auth is undefined (mock mode), just stop loading
    if (!auth) {
      console.log("AuthContext: Demo Mode Activated (No Firebase Config)");
      setLoading(false);
      loadAnonymousUsage(); // Fallback to anonymous
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserData(currentUser.uid);
      } else {
        // User logged out or anonymous
        loadAnonymousUsage();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignInWithGoogle = async () => {
    if (!auth) {
      // Demo Mode Login
      console.log("AuthContext: Simulating Google Login");
      const mockUser: any = {
        uid: "demo-user-123",
        email: "demo@converty.io",
        displayName: "Demo User",
        photoURL: null,
        getIdToken: async () => "mock-token",
        emailVerified: true, // Google users are verified
      };
      setUser(mockUser);
      setPlan("free");
      return;
    }

    // Real Login
    const user = await signInWithGoogle();

    // Fix missing displayName for Google Users (Frontend-Only)
    if (user && !user.displayName && user.email) {
      const safeName = user.email.split("@")[0];
      await updateProfile(user, { displayName: safeName });
      await user.reload(); // Ensure changes persist
      setUser({ ...user }); // Update local state immediately
    }
  };

  const handleSignUpWithEmail = async (
    email: string,
    pass: string,
    name: string
  ) => {
    if (!auth) throw new Error("Auth not initialized (Check env vars)");

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      pass
    );
    await updateProfile(userCredential.user, { displayName: name });

    // SEND VERIFICATION EMAIL IMMEDIATELY
    try {
      await sendEmailVerification(userCredential.user);
    } catch (e) {
      console.error("Failed to send verification email during signup:", e);
    }

    // Create user doc
    // FIRESTORE DISABLED: To prevent permission errors.
    /*
    if (db) {
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        displayName: name,
        plan: "free",
        createdAt: new Date().toISOString(),
      });
    }
    */

    return userCredential.user;
  };

  const handleSignInWithEmail = async (email: string, pass: string) => {
    if (!auth) throw new Error("Auth not initialized");
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    return userCredential.user;
  };

  /*
   * MULTI-TAB LOGOUT SYNC
   * Listen for logout events from other tabs to ensure immediate consistency.
   */
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "converty-logout-event") {
        // Force state clear and redirect
        setUser(null);
        setPlan("free");
        setDailyUsage(0);
        setDailyUsage(0);
        window.location.href = "/";
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleSignOut = async () => {
    // 1. Notify other tabs
    localStorage.setItem("converty-logout-event", Date.now().toString());

    if (!auth) {
      // Demo Mode Logout
      setUser(null);
      setPlan("free");
      setDailyUsage(0);
      window.location.href = "/"; // Force redirect
      return;
    }
    try {
      await firebaseSignOut(auth);
      // Hard redirect to clear any in-memory state
      window.location.href = "/";
    } catch (error) {
      console.error("SignOut Error:", error);
      // Force logout anyway
      window.location.href = "/";
    }
  };

  const handleSendVerificationEmail = async () => {
    if (!auth || !auth.currentUser)
      throw new Error("No user logged in to send verification email to.");
    await sendEmailVerification(auth.currentUser);
  };

  const getToken = async () => {
    if (!user) return null;
    return await user.getIdToken();
  };

  const upgradeToPremium = async () => {
    if (!user || !db) return;
    try {
      const now = new Date();
      const expiresAt = new Date(now);
      expiresAt.setMonth(expiresAt.getMonth() + 1); // Exact +1 Month Calendar

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        plan: "premium",
        premiumActivatedAt: now.toISOString(),
        premiumExpiresAt: expiresAt.toISOString(),
      });
      setPlan("premium");

      // FIX BUG 2: Reset Usage on Upgrade
      console.log("[AuthContext] Upgrade successful. Resetting limits.");
      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem("converty_last_reset_date", today);

      // Explicitly zero-out usage keys
      localStorage.setItem("converty_usage_anonymous", "0");
      if (user.uid) {
        localStorage.setItem(`converty_usage_${user.uid}`, "0");
      }
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("converty_usage_")) {
          localStorage.setItem(key, "0");
        }
      });

      setDailyUsage(0); // Update state instantly
    } catch (e) {
      console.error("Upgrade failed:", e);
      throw e;
    }
  };

  const recordConversion = async (jobData: {
    jobId: string;
    fileName: string;
    fileType: string;
    fileSize: number;
  }) => {
    // 0. CHECK FOR DAY ROLLOVER BEFORE INCREMENTING
    checkUsageReset();

    // 1. Always Increment Browser/Anonymous Usage (The Floor)
    let newAnonUsage = 0;
    try {
      const currentAnon = getSafeUsage("converty_usage_anonymous");
      newAnonUsage = currentAnon + 1;
      localStorage.setItem("converty_usage_anonymous", newAnonUsage.toString());
    } catch (e) {
      console.error("LS Error", e);
    }

    let newEffectiveUsage = newAnonUsage;

    // 2. If Authenticated, Increment User Usage
    if (user) {
      const userUsageKey = `converty_usage_${user.uid}`;
      let newUserUsage = 0;
      try {
        const currentUserUsage = getSafeUsage(userUsageKey);
        newUserUsage = currentUserUsage + 1;
        localStorage.setItem(userUsageKey, newUserUsage.toString());
      } catch (e) {
        console.error("LS Error", e);
      }

      // Effective usage is max of both
      newEffectiveUsage = Math.max(newAnonUsage, newUserUsage);

      // 3. Persist to Firestore (Informational / Backup)
      if (db) {
        try {
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, {
            dailyConversionCount: increment(1),
          });
        } catch (e) {
          console.warn(
            "[AuthContext] Firestore update failed (non-critical):",
            e
          );
        }
      }
    }

    // 4. Update State
    setDailyUsage(newEffectiveUsage);
  };

  const deleteProfile = async () => {
    if (!user || !auth) return;
    try {
      // 1. Delete Firestore Data
      if (db) {
        await deleteDoc(doc(db, "users", user.uid));
        // Optional: Delete conversions ? For now keep them for metrics or delete them too.
      }

      // 2. Delete Auth User
      await deleteUser(user);

      // We do NOT redirect here anymore. The caller (DeleteAccountModal) will handle the Success UI and then redirect.
      // Context state update will happen automatically via onAuthStateChanged, but we can optimise:
      setUser(null);
    } catch (error) {
      console.error("Delete profile failed:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    if (!auth) return;
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        plan,
        signInWithGoogle: handleSignInWithGoogle,
        signUpWithEmail: handleSignUpWithEmail,
        signInWithEmail: handleSignInWithEmail,
        signOut: handleSignOut,
        getToken,
        sendVerificationEmail: handleSendVerificationEmail,
        dailyUsage,
        refreshUserData: async () => {
          if (user) await fetchUserData(user.uid);
        },
        upgradeToPremium,
        checkUsageReset,
        recordConversion,
        deleteProfile,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
