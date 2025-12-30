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
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<"free" | "premium">("free");
  const [dailyUsage, setDailyUsage] = useState(0);

  /*
   * CHECK AND RESET DAILY USAGE (Global / Date-Based)
   * reset happens if the date has changed, clearing ALL browser-local usage.
   * Firestore is NOT reset here (it is informational/historical).
   */
  const checkUsageReset = async () => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const lastResetKey = "converty_last_reset_date";
    const lastResetDate = localStorage.getItem(lastResetKey);

    // If dates differ, it's a new day => Reset Everything
    if (lastResetDate !== today) {
      console.log(
        `[AuthContext] New day detected (${today}). Resetting ALL local usage.`
      );

      // 1. Update Date
      localStorage.setItem(lastResetKey, today);

      // 2. Reset Anonymous Usage
      localStorage.setItem("converty_usage_anonymous", "0");

      // 3. Reset All User Keys (We can't iterate easily, but we can reset the current one if knowing UID,
      //    or ideally we rely on the specific key being 0 if not found, but to be safe and clean,
      //    we might want to iterate. However, lazily resetting the current user key when accessed is also fine,
      //    BUT the requirement implies a "browser-wide reset".
      //    Since we can't efficiently regex-delete keys without iteration, we will rely on
      //    resetting the *keys we access* or just accepting that old keys rot.
      //    Actually, simple solution: We only strictly care about 'anonymous' and 'current'.
      //    But to be perfect: we could clear keys starting with 'converty_usage_'.
      //    Let's stick to safe implementation: Reset anonymous now.
      //    The `fetchUserData` logic handles the "current user" key reset implicitly?
      //    No, we should reset the current user's key if we know it.
      //    To support the "Global Reset" requirement best without knowing UID here:
      //    We will clean keys *when we read them* if strictness is needed,
      //    OR we assume this function is called often enough.
      //    Wait, simpler: We can just clear `converty_usage_anonymous` here.
      //    And `fetchUserData` can handle its specific user key if needed?
      //    Actually, the user said "Reset anonymous + authenticated usage on day change".
      //    So we must at least reset the anonymous one.
      //    For authenticated keys, if we don't clear them, they remain high from yesterday.
      //    SO WE MUST ITERATE to do a true global reset or use a versioned key strategy.
      //    Let's iterate for safety as it's cleaner for "Global Reset".
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("converty_usage_")) {
          localStorage.setItem(key, "0");
        }
      });

      setDailyUsage(0);
      return true; // Reset occurred
    }
    return false; // No reset needed
  };

  const fetchUserData = async (uid: string) => {
    // 1. Run Global Reset Check
    await checkUsageReset();

    if (!db) {
      // Demo/Offline Mode
      // Load usage (Max of anon and user)
      const anonUsage = parseInt(
        localStorage.getItem("converty_usage_anonymous") || "0"
      );
      const userUsage = parseInt(
        localStorage.getItem(`converty_usage_${uid}`) || "0"
      );
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
        // Source of Truth: localStorage enforcement.
        // Rule: effectiveFreeUsage = Math.max(anonymousUsage, authenticatedUsage)

        const anonUsage = parseInt(
          localStorage.getItem("converty_usage_anonymous") || "0"
        );
        const userLocalUsage = parseInt(
          localStorage.getItem(`converty_usage_${uid}`) || "0"
        );
        const firestoreUsage = data.dailyConversionCount || 0;

        // We use Math.max to enforce the "floor" of anonymous usage
        // We also check Firestore to ensure cross-device usage contributes (if we wanted to enforce that),
        // but user instructions say "localStorage is the source of truth for limits".
        // HOWEVER, "authenticatedUsage" usually implies the account's usage.
        // If I use 2 on Device A, and login on Device B, I should technically be 2?
        // The instructions say "Browser-scoped".
        // "Anonymous usage depends on browser".
        // "Authorized usage... depends on account?"
        // User said: "Authenticated usage can never be lower than browser usage".
        // User ALSO said: "localStorage = only enforcement source".
        // So we will prioritize localStorage, but we can respect Firestore if it's higher?
        // User said: "Firestore is informational / historical".
        // So we will STRICTLY use localStorage for enforcement to avoid sync bugs as requested.

        const effectiveUsage = Math.max(anonUsage, userLocalUsage);
        setDailyUsage(effectiveUsage);

        // Optional: If Firestore is wildly different, we might sync, but per instructions, we avoid logic that breaks enforcement.
        // We will stick to the pure local calculation for safety.
      }
    } catch (e) {
      console.error("Error fetching user data:", e);
      setPlan("free");
      // Fallback to local
      const anonUsage = parseInt(
        localStorage.getItem("converty_usage_anonymous") || "0"
      );
      const userUsage = parseInt(
        localStorage.getItem(`converty_usage_${uid}`) || "0"
      );
      setDailyUsage(Math.max(anonUsage, userUsage));
    }
  };

  const loadAnonymousUsage = () => {
    checkUsageReset().then(() => {
      const usage = parseInt(
        localStorage.getItem("converty_usage_anonymous") || "0"
      );
      setDailyUsage(usage);
      setPlan("free");
    });
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
        window.location.href = "/login";
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
      window.location.href = "/login";
    } catch (error) {
      console.error("SignOut Error:", error);
      // Force logout anyway
      window.location.href = "/login";
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
    await checkUsageReset();

    // 1. Always Increment Browser/Anonymous Usage (The Floor)
    let newAnonUsage = 0;
    try {
      const currentAnon = parseInt(
        localStorage.getItem("converty_usage_anonymous") || "0"
      );
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
        const currentUserUsage = parseInt(
          localStorage.getItem(userUsageKey) || "0"
        );
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
      setUser(null);
      window.location.href = "/";
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
