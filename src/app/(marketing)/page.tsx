"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Shield, Zap, FileText } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030014] text-white selection:bg-purple-500/30">
      {/* Navbar Placeholder (Global Layout will handle real one later, but visual for now) */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#030014]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <span className="text-white text-lg">C</span>
            </div>
            Converty
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-screen" />

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              v2.0 Now Live
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text text-transparent">
              Document Conversion <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                Reimagined.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Transform Word, Excel, and HTML to PDF instantly.{" "}
              <br className="hidden md:block" />
              Secure, offline-first processing with enterprise reliability.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg shadow-purple-900/20 hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                Start Converting Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 hover:text-white font-medium transition-all flex items-center justify-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Live Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-black/20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                desc: "Advanced processing engine converts files in milliseconds, not minutes.",
              },
              {
                icon: Shield,
                title: "Enterprise Secure",
                desc: "Your files never leave the secure processing pipeline. Deleted instantly after download.",
              },
              {
                icon: FileText,
                title: "Perfect Fidelity",
                desc: "Preserves formatting, fonts, and layouts exactly as they appear in Office.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center mb-6 border border-white/5">
                  <feature.icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Placeholder */}
      <footer className="border-t border-white/5 py-12 bg-[#020010]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-500 text-sm">
            © 2025 Converty Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-gray-500 hover:text-white cursor-pointer text-sm">
              Privacy
            </span>
            <span className="text-gray-500 hover:text-white cursor-pointer text-sm">
              Terms
            </span>
            <span className="text-gray-500 hover:text-white cursor-pointer text-sm">
              Contact
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
