"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check, ArrowRight, Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { signInWithGoogle, signUpWithEmail } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push("/convert");
    } catch (e: any) {
      // Typed as any to handle unknow error types safely
      console.error("Signup error", e);
      alert(e.message || "Signup failed");
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.name || !formData.email)) {
      alert("Please fill in all fields");
      return;
    }
    if (step === 2 && !formData.password) {
      alert("Please enter a password");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep((s) => s + 1);
    }, 400);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      await signUpWithEmail(formData.email, formData.password, formData.name);
      // Successful signup automatically logs in - redirect to verification
      router.push("/verify-email");
    } catch (error: any) {
      console.error("Registration failed", error);
      alert(error.message || "Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0b12] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Steps Indicator */}
        <div className="flex justify-between mb-8 px-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border transition-all duration-500 ${
                  step >= i
                    ? "bg-purple-600 border-purple-600 text-white"
                    : "border-white/20 text-gray-500"
                }`}
              >
                {step > i ? <Check className="w-4 h-4" /> : i}
              </div>
              <span className="text-[10px] uppercase tracking-wider text-gray-500">
                {i === 1 ? "Account" : i === 2 ? "Security" : "Verify"}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden relative">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Create Account</h2>
            <p className="text-gray-400 text-sm">
              Join thousands converting files daily
            </p>
          </div>

          <button
            onClick={handleGoogleSignup}
            className="w-full py-4 rounded-xl bg-white text-black font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Sign up with Google</span>
              </>
            )}
          </button>

          <div className="mt-8 text-center bg-white/5 rounded-lg p-3 border border-white/5">
            <p className="text-xs text-gray-400">
              Email registration will be available soon.
            </p>
          </div>
        </div>

        <p className="text-center mt-8 text-xs text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-400 hover:text-purple-300">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
