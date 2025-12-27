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
} from "firebase/auth";
import { auth, db } from "@/lib/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signInWithGoogle } from "@/lib/auth/googleSignIn";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  plan: "free" | "premium";
  signInWithGoogle: () => Promise<void | User>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<User>;
  signInWithEmail: (email: string, pass: string) => Promise<User>;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
  sendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  plan: "free",
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
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<"free" | "premium">("free");

  useEffect(() => {
    // If auth is undefined (mock mode), just stop loading
    if (!auth) {
      console.log("AuthContext: Demo Mode Activated (No Firebase Config)");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      // FIRESTORE DISABLED: To prevent "Missing or insufficient permissions" errors.
      // We are strictly using Auth for identity. Plans are default "free" for now.
      /*
      if (currentUser && db) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setPlan((userDoc.data()?.plan as "free" | "premium") || "free");
          }
        } catch (error) {
          console.error("Failed to fetch user plan:", error);
        }
      } 
      */
      setPlan("free");

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

  const handleSignOut = async () => {
    if (!auth) {
      // Demo Mode Logout
      setUser(null);
      setPlan("free");
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
