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

  const fetchUserData = async (uid: string) => {
    if (!db) return;
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
        setPlan((data.plan as "free" | "premium") || "free");

        // Handle Daily Reset
        let currentUsage = data.dailyConversionCount || 0;
        if (data.lastResetAt) {
          const lastReset = data.lastResetAt.toDate();
          const now = new Date();
          const diffHours =
            (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60);

          if (diffHours >= 24) {
            await updateDoc(userRef, {
              dailyConversionCount: 0,
              lastResetAt: serverTimestamp(),
            });
            currentUsage = 0;
          }
        }
        setDailyUsage(currentUsage);
      }
    } catch (e) {
      console.error("Error fetching user data:", e);
      // Fallback to safe defaults
      setPlan("free");
      setDailyUsage(0);
    }
  };

  useEffect(() => {
    // If auth is undefined (mock mode), just stop loading
    if (!auth) {
      console.log("AuthContext: Demo Mode Activated (No Firebase Config)");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserData(currentUser.uid);
      } else {
        setPlan("free");
        setDailyUsage(0);
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
    await signInWithGoogle();
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
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        plan: "premium",
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
    if (!db || !user) return;

    // 1. Increment Daily Count
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        dailyConversionCount: increment(1),
      });
      setDailyUsage((prev) => prev + 1);
    } catch (e) {
      console.warn(
        "[AuthContext] Failed to increment usage (non-critical):",
        e
      );
    }

    // 2. If Premium, add to history
    try {
      if (plan === "premium") {
        await addDoc(collection(db, "conversions"), {
          uid: user.uid,
          ...jobData,
          createdAt: serverTimestamp(),
          expiresAt: Timestamp.fromMillis(Date.now() + 24 * 60 * 60 * 1000), // 24h
          downloadUrl: `/api/convert/download/${jobData.jobId}`, // Assuming this works for now
        });
      }
    } catch (e) {
      console.warn("[AuthContext] Failed to record history (non-critical):", e);
    }
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
