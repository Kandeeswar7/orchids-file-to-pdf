"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, ArrowLeft, Crown } from "lucide-react";

export default function PremiumPage() {
  return (
    <main className="min-h-screen w-full bg-[#0a0a0a] text-white flex flex-col items-center p-4 sm:p-8 relative overflow-hidden">
      {/* Ambient Bg */}
      <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl w-full z-10">
        <Link
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-white mb-12 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-orange-500/20"
          >
            <Crown className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold">Unleash Full Power</h1>
          <p className="text-xl text-gray-400 max-w-xl mx-auto">
            Remove limits, skip queues, and convert at lightning speed.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl p-8 border border-white/10 bg-white/5 backdrop-blur-sm"
          >
            <h3 className="text-xl font-bold text-gray-300">Basic</h3>
            <div className="my-4 text-3xl font-bold">Free</div>
            <p className="text-gray-400 text-sm mb-8">
              Good for quick, occasional tasks.
            </p>

            <ul className="space-y-4 mb-8">
              {[
                "3 conversions per day",
                "Standard priority",
                "Max 10MB file size",
                "Ads supported",
              ].map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 text-sm text-gray-300"
                >
                  <Check className="w-5 h-5 text-gray-500" /> {feature}
                </li>
              ))}
            </ul>

            <Link
              href="/login"
              className="block w-full text-center py-3 rounded-xl bg-white/10 hover:bg-white/20 font-semibold transition-all"
            >
              Get Started
            </Link>
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative rounded-3xl p-8 border border-orange-500/50 bg-gradient-to-b from-orange-500/10 to-transparent backdrop-blur-sm"
          >
            <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-3xl">
              POPULAR
            </div>

            <h3 className="text-xl font-bold text-orange-400">Pro</h3>
            <div className="my-4 text-3xl font-bold flex items-baseline gap-1">
              $9{" "}
              <span className="text-base font-normal text-gray-400">/mo</span>
            </div>
            <p className="text-gray-400 text-sm mb-8">
              For power users and professionals.
            </p>

            <ul className="space-y-4 mb-8">
              {[
                "Unlimited conversions",
                "Instant priority queue",
                "Max 100MB file size",
                "Conversion history",
                "No Ads",
              ].map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 text-sm text-white"
                >
                  <Check className="w-5 h-5 text-orange-400" /> {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => alert("Payment flow placeholder")}
              className="block w-full text-center py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 font-bold text-white shadow-lg shadow-orange-900/40 hover:scale-[1.02] transition-all"
            >
              Upgrade Now
            </button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
