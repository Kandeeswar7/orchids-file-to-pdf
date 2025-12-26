"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import { signInWithGoogle } from "@/lib/auth/googleSignIn";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  plan: "free" | "premium";
  signInWithGoogle: () => Promise<void | User>;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  plan: "free",
  signInWithGoogle: async () => {},
  signOut: async () => {},
  getToken: async () => null,
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

      if (currentUser && db) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setPlan((userDoc.data()?.plan as "free" | "premium") || "free");
          }
        } catch (error) {
          console.error("Failed to fetch user plan:", error);
        }
      } else {
        setPlan("free");
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
      };
      setUser(mockUser);
      setPlan("free");
      return;
    }

    // Real Login
    await signInWithGoogle();
  };

  const handleSignOut = async () => {
    if (!auth) {
      // Demo Mode Logout
      setUser(null);
      setPlan("free");
      return;
    }
    await firebaseSignOut(auth);
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
        signOut: handleSignOut,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
