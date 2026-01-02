"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2, X, Lock, CheckCircle2 } from "lucide-react";
import {
  deleteUser,
  EmailAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteAccountModal({
  isOpen,
  onClose,
}: DeleteAccountModalProps) {
  const { user, deleteProfile } = useAuth();
  const [step, setStep] = useState<"confirm" | "reauth" | "success">("confirm");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset state when opening/closing
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setStep("confirm");
        setPassword("");
        setLoading(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSuccessRedirect = () => {
    setStep("success");
    setTimeout(() => {
        window.location.href = "/";
    }, 2000);
  };

  const handleInitialConfirm = async () => {
    setLoading(true);
    try {
      // Try to delete directly first
      await deleteProfile();
      handleSuccessRedirect();
    } catch (error: any) {
      if (error.code === "auth/requires-recent-login") {
        setStep("reauth");
      } else {
        toast.error(error.message || "Failed to delete account");
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReauthAndDelete = async () => {
    if (!user || !auth) return;
    setLoading(true);

    try {
      // Determine provider
      const isGoogle = user.providerData.some(
        (p) => p.providerId === "google.com"
      );

      if (isGoogle) {
        const provider = new GoogleAuthProvider();
        await reauthenticateWithPopup(user, provider);
      } else {
        // Email/Password
        const credential = EmailAuthProvider.credential(user.email!, password);
        await reauthenticateWithCredential(user, credential);
      }

      // If re-auth successful, retry deletion
      await deleteProfile();
      handleSuccessRedirect();
    } catch (error: any) {
      console.error("Re-auth failed:", error);
      if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password");
      } else if (error.code === "auth/popup-closed-by-user") {
        toast.info("Verification cancelled");
      } else {
        toast.error(error.message || "Verification failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[#0f0f16] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Delete Account
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {step === "confirm" ? (
                <>
                  <div className="space-y-3">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Are you sure you want to permanently delete your account?
                    </p>
                    <ul className="space-y-2 text-sm text-gray-400 bg-red-500/5 p-4 rounded-xl border border-red-500/10">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        All your conversion history will be lost.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        Your premium subscription (if active) will vary based on
                        Stripe.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        This action cannot be undone.
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={onClose}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors font-medium text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleInitialConfirm}
                      disabled={loading}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors font-medium text-sm flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Delete Forever"
                      )}
                    </button>
                  </div>
                </>
              ) : step === "reauth" ? (
                <>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm flex items-start gap-3">
                      <Lock className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold mb-1">
                          Security Verification
                        </p>
                        <p className="opacity-90">
                          For your security, please confirm directly with your
                          provider to complete deletion.
                        </p>
                      </div>
                    </div>

                    {user?.providerData.some(
                      (p) => p.providerId === "google.com"
                    ) ? (
                      <button
                        onClick={handleReauthAndDelete}
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                      >
                        {loading && (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                        Continue with Google
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <label className="text-xs font-medium text-gray-400 uppercase">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-colors"
                          placeholder="Enter your password"
                        />
                        <button
                          onClick={handleReauthAndDelete}
                          disabled={loading || !password}
                          className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Verify & Delete"
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="py-8 text-center space-y-4">
                   <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                   </div>
                   <h3 className="text-xl font-bold text-white">Account Deleted</h3>
                   <p className="text-gray-400">We're sorry to see you go. Redirecting you to the home page...</p>
                </div>
              )}
            </div>
      )   
       </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
