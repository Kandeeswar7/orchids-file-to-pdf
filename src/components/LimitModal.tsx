"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lock, Crown, X, LogIn } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface LimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export function LimitModal({ isOpen, onClose, message }: LimitModalProps) {
  const { user } = useAuth();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            className="relative w-full max-w-md bg-[#0f0f16] border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
          >
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
            <div className="absolute top-[-50%] right-[-20%] w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-2">
                <Lock className="w-8 h-8 text-amber-500" />
              </div>

              <h3 className="text-xl font-bold text-white">Limit Reached</h3>

              <p className="text-gray-400 text-sm leading-relaxed">{message}</p>

              <div className="w-full pt-4">
                {user ? (
                  <Link
                    href="/premium"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-sm shadow-lg shadow-amber-900/20 hover:shadow-amber-900/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    <Crown className="w-4 h-4" /> Upgrade to Premium
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/signup"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg hover:shadow-blue-900/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                      <Crown className="w-4 h-4" /> Sign Up to Upgrade
                    </Link>
                    <Link
                      href="/login"
                      className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-4 h-4" /> Log In
                    </Link>
                  </div>
                )}

                <button
                  onClick={onClose}
                  className="w-full mt-3 py-2 text-sm text-gray-500 hover:text-white transition-colors"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
