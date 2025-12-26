"use client";

import { ConversionCard } from "@/components/ConversionCard";
import { motion } from "framer-motion";
import { FileText, Zap, Shield } from "lucide-react";

export default function ConvertPage() {
  return (
    <main className="min-h-screen w-full bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Animated Background Gradients */}
      <motion.div
        className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[140px] pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] pointer-events-none" />

      <div className="z-10 w-full max-w-5xl flex flex-col items-center gap-12 sm:gap-16">
        {/* Hero Section with Motion */}
        <motion.div
          className="text-center space-y-6 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-sm text-gray-300"
          >
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>Offline-First • Lightning Fast</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="gradient-text-brand">File to PDF</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Professional document conversion that works{" "}
            <strong className="text-white font-semibold">
              entirely offline
            </strong>
            . No cloud uploads. No privacy concerns. Complete control.
          </motion.p>

          {/* Feature Pills */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {[
              {
                icon: Shield,
                text: "Private & Secure",
                color: "text-green-400",
              },
              {
                icon: Zap,
                text: "Instant Conversion",
                color: "text-yellow-400",
              },
              {
                icon: FileText,
                text: "Multiple Formats",
                color: "text-blue-400",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.text}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <feature.icon className={`w-4 h-4 ${feature.color}`} />
                <span className="text-sm text-gray-300">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Conversion Card with Entrance Animation */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" }}
        >
          <ConversionCard />
        </motion.div>
      </div>
    </main>
  );
}
