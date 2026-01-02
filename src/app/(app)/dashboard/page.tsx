"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Crown,
  History,
  Zap,
  Loader2,
  FileText,
  Shield,
  UploadCloud,
  CheckCircle2,
  ArrowUpRight,
  Download,
  Clock,
  Lock
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PLAN_LIMITS } from "@/config/plans";

export default function DashboardPage() {
  const { user, loading: authLoading, plan, dailyUsage } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // --- DEMO DATA: Showing latest conversions to all users ---
  const history = [
    { id: 1, name: "contract_final.docx", date: "Just now", size: "2.4 MB", status: "Ready" },
    { id: 2, name: "invoice_2025.pdf", date: "2 hours ago", size: "1.1 MB", status: "Ready" },
    { id: 3, name: "q4_financials.xlsx", date: "5 hours ago", size: "850 KB", status: "Ready" },
    { id: 4, name: "project_proposal.pptx", date: "Yesterday", size: "4.8 MB", status: "Expired" },
  ];

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

  // Read-only helpers
  const maxFileSize = plan === "premium" ? "50MB" : "5MB";
  const concurrency = plan === "premium" ? "5 Files" : "1 File";

  return (
    <main className="min-h-screen w-full bg-[#0a0a0a] text-white p-4 sm:p-8 pt-20">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
            <p className="text-gray-400 text-sm">
              Manage your conversions and account settings.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/convert"
              className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Converter
            </Link>
            <div className="h-6 w-px bg-white/10 mx-2 hidden md:block" />
            <div className="text-sm text-gray-400 hidden md:block">
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
                <Crown className="w-3 h-3" /> PRO ACCOUNT
              </div>
            )}
          </div>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. Plan & Usage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-6 border border-white/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-300">Daily Usage</h3>
                  <p className="text-xs text-gray-500">Resets at 00:00 UTC</p>
                </div>
                <div className={`p-2 rounded-lg ${plan === 'premium' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  <Zap className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Conversions</span>
                  <span className="text-white font-mono">
                    {usage} <span className="text-gray-600">/</span> {limit}
                  </span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ease-out ${
                      plan === "premium"
                        ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                        : "bg-gradient-to-r from-blue-500 to-cyan-400"
                    }`}
                    style={{ width: `${Math.min((usage / limit) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 capitalize">{plan} Plan</span>
                {plan === 'free' && (
                  <Link href="/premium" className="text-amber-500 hover:text-amber-400 text-xs font-semibold">
                    Increase Limit &rarr;
                  </Link>
                )}
              </div>
            </div>
          </motion.div>

          {/* 2. Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass rounded-3xl p-6 border border-white/10 flex flex-col"
          >
            <h3 className="text-lg font-semibold text-gray-300 mb-6">Quick Actions</h3>
            <div className="space-y-3 flex-1">
              <Link 
                href="/convert"
                className="flex items-center justify-between w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-200">New Conversion</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
              </Link>

              <Link 
                href={plan === 'premium' ? "/history" : "/premium"}
                className="flex items-center justify-between w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                    <History className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-200">View History</span>
                </div>
                {plan === 'free' && <Crown className="w-3 h-3 text-amber-500" />}
              </Link>
            </div>
          </motion.div>

          {/* 3. Plan Specs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-3xl p-6 border border-white/10"
          >
             <h3 className="text-lg font-semibold text-gray-300 mb-6">Plan Specs</h3>
             <ul className="space-y-4">
                <li className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <UploadCloud className="w-4 h-4" /> Max File Size
                  </span>
                  <span className="font-mono text-gray-300">{maxFileSize}</span>
                </li>
                <li className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Zap className="w-4 h-4" /> Concurrency
                  </span>
                  <span className="font-mono text-gray-300">{concurrency}</span>
                </li>
                <li className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Privacy
                  </span>
                  <span className="font-mono text-green-400/80 text-xs bg-green-900/20 px-2 py-1 rounded">
                    Auto-Delete
                  </span>
                </li>
             </ul>
          </motion.div>

          {/* 4. Recent Activity (UPDATED: Shows Teaser for Free Users) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass rounded-3xl p-6 border border-white/10 md:col-span-2 min-h-[250px] relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h3 className="text-lg font-semibold text-gray-300 flex items-center gap-2">
                <History className="w-5 h-5" /> Recent Activity
              </h3>
              {plan === "premium" ? (
                <Link href="/history" className="text-xs text-purple-400 hover:text-purple-300">
                  View All
                </Link>
              ) : (
                <span className="text-xs text-amber-500 font-medium flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Premium Feature
                </span>
              )}
            </div>

            <div className="h-full relative z-10">
                {history.length > 0 ? (
                  <div className="space-y-2">
                    {history.map((item) => (
                      <div 
                        key={item.id} 
                        className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                            plan === 'premium' 
                            ? 'bg-white/5 border-white/5 hover:bg-white/10' 
                            : 'bg-white/[0.02] border-white/5 opacity-75'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${plan === 'premium' ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-500/10 text-gray-500'}`}>
                              <FileText className="w-4 h-4" />
                          </div>
                          <div>
                              <p className="text-sm font-medium text-white">{item.name}</p>
                              <p className="text-xs text-gray-500">{item.size} • {item.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                              item.status === 'Ready' 
                              ? 'bg-green-500/10 text-green-400' 
                              : 'bg-gray-500/10 text-gray-500'
                          }`}>
                              {item.status}
                          </span>
                          
                          {/* Logic: If Premium + Ready -> Download. If Free -> Lock Icon */}
                          {item.status === 'Ready' && (
                              <>
                                {plan === "premium" ? (
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                                        <Download className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <Link href="/premium" className="p-2 hover:bg-white/10 rounded-lg text-amber-500 transition-colors" title="Upgrade to download">
                                        <Lock className="w-4 h-4" />
                                    </Link>
                                )}
                              </>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {/* Free Plan Bottom Fade/Call to Action */}
                    {plan === 'free' && (
                        <div className="mt-4 p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Crown className="w-4 h-4 text-amber-500" />
                                <span className="text-xs text-amber-200">Upgrade to download past files</span>
                            </div>
                            <Link href="/premium" className="text-xs font-bold text-amber-500 hover:text-amber-400">
                                Upgrade Now
                            </Link>
                        </div>
                    )}
                  </div>
                ) : (
                  /* Empty State (Only if 0 items) */
                  <div className="flex flex-col items-center justify-center h-48 text-center border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.02]">
                    <div className="p-3 bg-white/5 rounded-full mb-3">
                      <FileText className="w-6 h-6 text-gray-500" />
                    </div>
                    <p className="text-gray-400 font-medium">No recent conversions found</p>
                    <p className="text-gray-600 text-sm mt-1">Files converted today will appear here.</p>
                  </div>
                )}
            </div>
          </motion.div>

          {/* 5. Pro Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-3xl p-6 border border-white/10"
          >
            <h3 className="text-lg font-semibold text-gray-300 mb-4">Pro Tips</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="mt-1">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">Optimize Images</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Compress large images before converting to PDF for faster processing.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-1">
                  <Clock className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">24h Retention</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Files are auto-deleted after 24 hours. Download them promptly.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </main>
  );
}