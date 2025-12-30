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
            <span>Secure • Fast • Privacy-Focused</span>
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
            Professional document conversion built for{" "}
            <strong className="text-white font-semibold">
              speed, security, and reliability
            </strong>
            . Convert Word, Excel, HTML, and URLs with confidence.
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

// "use client";

// import { ConversionCard } from "@/components/ConversionCard";
// import { motion } from "framer-motion";
// import { FileText, Zap, Shield, Sparkles } from "lucide-react";
// import { AuthGuard } from "@/components/AuthGuard";

// export default function ConvertPage() {
//   return (
//     <AuthGuard>
//       <main className="min-h-screen w-full bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden selection:bg-purple-500/30">

//         {/* Animated Background Gradients */}
//         <motion.div
//           className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none"
//           animate={{
//             scale: [1, 1.2, 1],
//             opacity: [0.3, 0.5, 0.3],
//           }}
//           transition={{
//             duration: 8,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//         />
//         <motion.div
//           className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"
//           animate={{
//             scale: [1.2, 1, 1.2],
//             opacity: [0.3, 0.5, 0.3],
//           }}
//           transition={{
//             duration: 8,
//             repeat: Infinity,
//             ease: "easeInOut",
//             delay: 1,
//           }}
//         />

//         {/* Subtle Grid Pattern */}
//         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)] pointer-events-none" />

//         <div className="z-10 w-full max-w-5xl flex flex-col items-center gap-12 sm:gap-16 pt-12 sm:pt-0">

//           {/* Hero Section with Motion */}
//           <motion.div
//             className="text-center space-y-8 max-w-3xl"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, ease: "easeOut" }}
//           >
//             {/* Badge */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: 0.2, duration: 0.5 }}
//               className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm text-gray-300 shadow-lg shadow-purple-500/5"
//             >
//               <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400/20" />
//               <span className="font-medium tracking-wide text-xs uppercase">Production Ready Engine</span>
//             </motion.div>

//             {/* Main Heading */}
//             <div className="space-y-4">
//               <motion.h1
//                 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3, duration: 0.6 }}
//               >
//                 Convert <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 animate-gradient-x bg-[length:200%_auto]">File to PDF</span>
//               </motion.h1>

//               {/* Subheading */}
//               <motion.p
//                 className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4, duration: 0.6 }}
//               >
//                 Professional document conversion built for{" "}
//                 <strong className="text-gray-200 font-medium">
//                   speed, security, and precision
//                 </strong>.
//               </motion.p>
//             </div>

//             {/* Feature Pills */}
//             <motion.div
//               className="flex flex-wrap items-center justify-center gap-3 pt-2"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5, duration: 0.6 }}
//             >
//               {[
//                 { icon: Shield, text: "Encrypted Transfer", color: "text-emerald-400" },
//                 { icon: Zap, text: "Instant Processing", color: "text-amber-400" },
//                 { icon: FileText, text: "Smart Layouts", color: "text-blue-400" },
//               ].map((feature, index) => (
//                 <motion.div
//                   key={feature.text}
//                   className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                 >
//                   <feature.icon className={`w-4 h-4 ${feature.color}`} />
//                   <span className="text-sm text-gray-300 font-medium">{feature.text}</span>
//                 </motion.div>
//               ))}
//             </motion.div>
//           </motion.div>

//           {/* Conversion Card Container */}
//           <motion.div
//             className="w-full relative"
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" }}
//           >
//             {/* Glow effect behind the card */}
//             <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl blur-2xl transform translate-y-4" />

//             <div className="relative">
//               <ConversionCard />
//             </div>

//             <p className="text-center text-xs text-gray-600 mt-6">
//               Supported formats: .docx, .xlsx, .html, .txt • Max file size: 50MB
//             </p>
//           </motion.div>
//         </div>
//       </main>
//     </AuthGuard>
//   );
// }
