// "use client";

// import Link from "next/link";
// import { motion } from "framer-motion";
// import { ArrowRight, Check, Shield, Zap, FileText } from "lucide-react";

// export default function LandingPage() {
//   return (
//     <div className="min-h-screen bg-[#030014] text-white selection:bg-purple-500/30">
//       {/* Navbar Placeholder (Global Layout will handle real one later, but visual for now) */}
//       <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#030014]/80 backdrop-blur-xl">
//         <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
//             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
//               <span className="text-white text-lg">C</span>
//             </div>
//             Converty
//           </div>
//           <div className="flex items-center gap-4">
//             <Link
//               href="/login"
//               className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
//             >
//               Log in
//             </Link>
//             <Link
//               href="/signup"
//               className="text-sm font-medium bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
//             >
//               Sign Up
//             </Link>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
//         {/* Background Glows */}
//         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-screen" />

//         <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//           >
//             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium mb-6">
//               <span className="relative flex h-2 w-2">
//                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
//                 <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
//               </span>
//               v2.0 Now Live
//             </div>

//             <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text text-transparent">
//               Document Conversion <br />
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
//                 Reimagined.
//               </span>
//             </h1>

//             <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
//               Transform Word, Excel, and HTML to PDF instantly.{" "}
//               <br className="hidden md:block" />
//               Secure, offline-first processing with enterprise reliability.
//             </p>

//             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//               <Link
//                 href="/convert"
//                 className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg shadow-purple-900/20 hover:scale-105 transition-transform flex items-center justify-center gap-2"
//               >
//                 Start Converting Free
//                 <ArrowRight className="w-4 h-4" />
//               </Link>
//               {/* <Link
//                 href="/login"
//                 className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 hover:text-white font-medium transition-all flex items-center justify-center gap-2"
//               >
//                 <span className="w-2 h-2 rounded-full bg-green-500" />
//                 Live Demo
//               </Link> */}
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Features Grid */}
//       <section className="py-24 bg-black/20 border-t border-white/5">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {[
//               {
//                 icon: Zap,
//                 title: "Lightning Fast",
//                 desc: "Advanced processing engine converts files in milliseconds, not minutes.",
//               },
//               {
//                 icon: Shield,
//                 title: "Enterprise Secure",
//                 desc: "Your files never leave the secure processing pipeline. Deleted instantly after download.",
//               },
//               {
//                 icon: FileText,
//                 title: "Perfect Fidelity",
//                 desc: "Preserves formatting, fonts, and layouts exactly as they appear in Office.",
//               },
//             ].map((feature, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ delay: i * 0.1 }}
//                 className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
//               >
//                 <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center mb-6 border border-white/5">
//                   <feature.icon className="w-6 h-6 text-purple-400" />
//                 </div>
//                 <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
//                 <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Footer Placeholder */}
//       <footer className="border-t border-white/5 py-12 bg-[#020010]">
//         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
//           <p className="text-gray-500 text-sm">
//             © 2025 Converty Inc. All rights reserved.
//           </p>
//           <div className="flex gap-6">
//             <span className="text-gray-500 hover:text-white cursor-pointer text-sm">
//               Privacy
//             </span>
//             <span className="text-gray-500 hover:text-white cursor-pointer text-sm">
//               Terms
//             </span>
//             <span className="text-gray-500 hover:text-white cursor-pointer text-sm">
//               Contact
//             </span>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }


"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, FileText, CheckCircle2, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30 overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0a0a0a]/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-white text-lg font-bold">C</span>
            </div>
            <span>Converty</span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="hidden md:block text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Dynamic Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            {/* Version Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium mb-8 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              v2.0 Production Ready
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
              Document Conversion <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 animate-gradient-x bg-[length:200%_auto]">
                Without The Friction.
              </span>
            </h1>

            {/* Subheadline - CORRECTED (Removed "offline" claim) */}
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Transform Word, Excel, and HTML to PDF instantly.
              <br className="hidden md:block" />
              Secure, ephemeral cloud processing with professional fidelity.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                href="/convert"
                className="group w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                Start Converting Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/about"
                className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 hover:text-white font-medium transition-all flex items-center justify-center gap-2"
              >
                How it works
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
            </div>

            {/* Trust Badges / Microcopy */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Files deleted after 24h</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-[#0F0F0F]/50 border-t border-white/5 relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Why professionals choose Converty</h2>
            <p className="text-gray-400">Built for accuracy, designed for speed.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                desc: "Our optimized rendering engine converts complex documents in milliseconds, not minutes.",
                color: "text-amber-400",
                bg: "bg-amber-400/10",
                border: "group-hover:border-amber-400/30"
              },
              {
                icon: Shield,
                title: "Secure by Design",
                desc: "Your files are processed in isolated containers and permanently purged automatically after 24 hours.",
                color: "text-emerald-400",
                bg: "bg-emerald-400/10",
                border: "group-hover:border-emerald-400/30"
              },
              {
                icon: FileText,
                title: "Perfect Fidelity",
                desc: "We preserve your exact formatting, fonts, and tables. The PDF looks identical to your source file.",
                color: "text-blue-400",
                bg: "bg-blue-400/10",
                border: "group-hover:border-blue-400/30"
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`group p-8 rounded-3xl border border-white/5 bg-[#0a0a0a] hover:bg-[#111] transition-all duration-300 ${feature.border}`}
              >
                <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 border border-white/5`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
             <span>© {new Date().getFullYear()} Converty Inc.</span>
          </div>
          
          <div className="flex gap-8">
            <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-white transition-colors text-sm">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-gray-500 hover:text-white transition-colors text-sm">
              Contact Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}