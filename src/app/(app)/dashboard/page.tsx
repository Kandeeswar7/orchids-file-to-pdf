"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase/client";
const safeDb = db as any;
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Crown,
  History,
  FileText,
  Zap,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Protect Route
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Fetch User Data
  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      if (!safeDb || Object.keys(safeDb).length === 0) {
        // Demo/Mock Data
        setLoading(false);
        return;
      }
      try {
        const userDoc = await getDoc(doc(safeDb, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (e) {
        console.error("Error fetching user data", e);
      } finally {
        setLoading(false);
      }
    }
    if (user && !authLoading) {
      fetchData();
    }
  }, [user, authLoading]);

  if (authLoading || loading || !user) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const plan = userData?.plan || "free";
  const usage = userData?.dailyUsage || 0;
  const limit = 3; // Hardcoded for now, ideally from config/consts

  return (
    <main className="min-h-screen w-full bg-[#0a0a0a] text-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Home
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              Logged in as{" "}
              <span className="text-white font-medium">{user.email}</span>
            </div>
            {plan === "free" && (
              <Link
                href="/premium"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-sm shadow-lg hover:shadow-orange-500/20 transition-all flex items-center gap-2"
              >
                <Crown className="w-4 h-4" /> Upgrade
              </Link>
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
            {plan === "free" ? (
              <div className="space-y-3">
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-blue-500 transition-all duration-500 w-[${Math.min(
                      (usage / limit) * 100,
                      100
                    )}%]`}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 flex justify-between">
                  <span>Daily Usage</span>
                  <span>
                    {usage} / {limit}
                  </span>
                </p>
              </div>
            ) : (
              <div className="text-green-400 text-sm font-medium flex items-center gap-2">
                <Zap className="w-4 h-4" /> Unlimited Access
              </div>
            )}
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
              <p className="text-center text-gray-500 text-sm py-8">
                No conversion history found.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
