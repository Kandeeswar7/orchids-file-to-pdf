"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Crown, History, Zap, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { PLAN_LIMITS } from "@/config/plans";

export default function DashboardPage() {
  const { user, loading: authLoading, plan, dailyUsage } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Protect Route
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (!authLoading && user) {
      setLoading(false);
    }
  }, [user, authLoading, router]);

  if (authLoading || loading || !user) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Real Data from Context
  const usage = dailyUsage || 0;
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  const limit = limits.maxDailyConversions;

  return (
    <main className="min-h-screen w-full bg-[#0a0a0a] text-white p-4 sm:p-8 pt-20">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <Link
            href="/convert"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Converter
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              Logged in as{" "}
              <span className="text-white font-medium">{user.email}</span>
            </div>
            {plan === "free" ? (
              <Link
                href="/premium"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-sm shadow-lg hover:shadow-orange-500/20 transition-all flex items-center gap-2"
              >
                <Crown className="w-4 h-4" /> Upgrade
              </Link>
            ) : (
              <div className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold border border-purple-500/20 flex items-center gap-1">
                <Crown className="w-3 h-3" /> PRO
              </div>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Plan Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-6 border border-white/10"
          >
            <h3 className="text-lg font-semibold text-gray-300 mb-1">
              Current Plan
            </h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-bold capitalize text-white">
                {plan}
              </span>
              <span className="text-sm text-gray-500">tier</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Daily Usage</span>
                  <span className="text-white font-medium">
                    {Math.min((usage / limit) * 100, 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/5">
                  <div
                    className={`h-full transition-all duration-700 ease-out ${
                      plan === "premium"
                        ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                        : "bg-gradient-to-r from-blue-500 to-cyan-400"
                    }`}
                    style={{
                      width: `${Math.min((usage / limit) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    Used
                  </span>
                  <span className="text-lg font-mono text-white">{usage}</span>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    Remaining
                  </span>
                  <span className="text-lg font-mono text-white">
                    {Math.max(0, limit - usage)}
                  </span>
                </div>
              </div>

              {plan === "free" && (
                <p className="text-xs text-amber-500/80 text-center font-medium">
                  Resets daily. Upgrade for 100/day.
                </p>
              )}
            </div>
          </motion.div>

          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-3xl p-6 border border-white/10 md:col-span-2"
          >
            <h3 className="text-lg font-semibold text-gray-300 mb-6 flex items-center gap-2">
              <History className="w-5 h-5" /> Recent Conversions
            </h3>

            <div className="space-y-3">
              {plan === "premium" ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">
                    Your reliable conversion history is available.
                  </p>
                  <Link
                    href="/history"
                    className="inline-flex items-center gap-2 text-purple-400 hover:text-white transition-colors border border-white/10 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10"
                  >
                    <History className="w-4 h-4" /> View Full History
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm mb-4">
                    History is available on the Premium plan.
                  </p>
                  <Link
                    href="/premium"
                    className="inline-flex items-center gap-2 text-sm text-amber-500 hover:text-amber-400 transition-colors"
                  >
                    <Crown className="w-4 h-4" /> Upgrade to View History
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
