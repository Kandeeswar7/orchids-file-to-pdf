// "use client";

// import { motion } from "framer-motion";
// import {
//   Check,
//   Star,
//   Zap,
//   Shield,
//   History,
//   AlertCircle,
//   Loader2,
//   ArrowLeft,
// } from "lucide-react";
// import Link from "next/link";
// import { useAuth } from "@/context/AuthContext";
// import { PLAN_LIMITS } from "@/config/plans";
// import { isRazorpayConfigured } from "@/lib/razorpay-config";
// import { formatPremiumPrice } from "@/config/pricing";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// const features = [
//   {
//     icon: Zap,
//     title: "10x Faster Processing",
//     desc: "Skip the queue with priority conversion processing.",
//   },
//   {
//     icon: Shield,
//     title: "50MB File Size",
//     desc: "Convert massive documents without hitting limits.",
//   },
//   {
//     icon: History,
//     title: "24h History Access",
//     desc: "Re-download your converted files for up to 24 hours.",
//   },
//   {
//     icon: Star,
//     title: "Daily Limit: 100",
//     desc: "Perfect for power users and enterprise workflows.",
//   },
// ];

// export default function PremiumPage() {
//   const { user, plan, loading: authLoading } = useAuth();
//   const router = useRouter();
//   const isPremium = plan === "premium";
//   const isRazorpayReady = isRazorpayConfigured();
//   const [loading, setLoading] = useState(true);

//   // Protect Route
//   useEffect(() => {
//     if (!authLoading) {
//       setLoading(false);
//     }
//   }, [authLoading]);

//   if (authLoading || loading) {
//     return (
//       <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
//         <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
//       </div>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-[#0a0a0a] text-white pt-20 pb-12 px-4 sm:px-6 relative overflow-hidden">
//       {/* Background Ambience */}
//       <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />
//       <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

//       <div className="max-w-5xl mx-auto relative z-10">
//         <motion.div
//           className="text-center mb-16 space-y-4"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//         >
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-amber-500/20 text-amber-500 text-sm font-medium mb-4">
//             <CrownIcon className="w-4 h-4" />
//             <span>Go Pro Today</span>
//           </div>
//           <div className="flex justify-center mb-4">
//             <Link
//               href="/dashboard"
//               className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-sm hover:underline"
//             >
//               <ArrowLeft className="w-3 h-3 mr-1" /> Back to Dashboard
//             </Link>
//           </div>
//           <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
//             Convert Without <span className="gradient-text-brand">Limits</span>
//           </h1>
//           <p className="text-xl text-gray-400 max-w-2xl mx-auto">
//             Unlock professional-grade features for just a small one-time fee.
//             Perfect for businesses and power users.
//           </p>
//         </motion.div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
//           {/* Feature Grid */}
//           <motion.div
//             className="grid grid-cols-1 sm:grid-cols-2 gap-4"
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.2 }}
//           >
//             {features.map((f, i) => (
//               <div
//                 key={i}
//                 className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
//               >
//                 <f.icon className="w-8 h-8 text-purple-400 mb-4" />
//                 <h3 className="font-semibold text-white mb-2">{f.title}</h3>
//                 <p className="text-sm text-gray-400">{f.desc}</p>
//               </div>
//             ))}
//           </motion.div>

//           {/* Pricing Card */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.3 }}
//             className="relative"
//           >
//             <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-30" />
//             <div className="relative bg-[#12121a] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
//               {/* Shine effect */}
//               <div className="absolute top-0 right-0 p-4">
//                 <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full">
//                   BEST VALUE
//                 </div>
//               </div>

//               <h2 className="text-2xl font-bold text-white mb-2">
//                 Converty Premium
//               </h2>
//               <div className="flex items-baseline gap-1 mb-6">
//                 <span className="text-5xl font-bold text-white">
//                   {formatPremiumPrice()}
//                 </span>
//                 <span className="text-gray-400">/month</span>
//               </div>

//               <ul className="space-y-4 mb-8">
//                 {[
//                   `Up to ${PLAN_LIMITS.premium.maxDailyConversions} files per day`,
//                   `${PLAN_LIMITS.premium.maxFileSizeMB}MB Max file size`,
//                   "Priority Processing Speed",
//                   "24-Hour File History",
//                   "No Ads or Watermarks",
//                   "Priority Support",
//                 ].map((item, i) => (
//                   <li
//                     key={i}
//                     className="flex items-center gap-3 text-sm text-gray-300"
//                   >
//                     <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center flex-shrink-0">
//                       <Check className="w-3 h-3" />
//                     </div>
//                     {item}
//                   </li>
//                 ))}
//               </ul>

//               {isPremium ? (
//                 <button
//                   disabled
//                   className="w-full py-4 rounded-xl bg-gray-700 text-gray-300 font-bold cursor-not-allowed"
//                 >
//                   Current Plan
//                 </button>
//               ) : (
//                 <>
//                   {!isRazorpayReady && (
//                     <motion.div
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2"
//                     >
//                       <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
//                       <p className="text-xs text-amber-400">
//                         Payment system is currently unavailable. Please check
//                         back later.
//                       </p>
//                     </motion.div>
//                   )}
//                   <Link href="/payment">
//                     <button
//                       disabled={!isRazorpayReady}
//                       className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
//                     >
//                       {isRazorpayReady ? "Upgrade Now" : "Payment Unavailable"}
//                     </button>
//                   </Link>
//                 </>
//               )}

//               <p className="text-xs text-center text-gray-500 mt-4">
//                 Secure payment powered by Razorpay. Cancel anytime.
//               </p>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </main>
//   );
// }

// function CrownIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 9.87a.5.5 0 0 0 .466.305h5.728a.5.5 0 0 1 .456.745l-4.225 6.088a.5.5 0 0 0 .093.68l4.47 2.21a.5.5 0 0 1-.225 1.056H1.848a.5.5 0 0 1-.225-1.056l4.47-2.21a.5.5 0 0 0 .093-.68l-4.225-6.088a.5.5 0 0 1 .456-.745h5.728a.5.5 0 0 0 .466-.305z" />
//     </svg>
//   );
// }




"use client";

import { motion } from "framer-motion";
import {
  Check,
  Star,
  Zap,
  Shield,
  History,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { PLAN_LIMITS } from "@/config/plans";
import { isRazorpayConfigured } from "@/lib/razorpay-config";
import { formatPremiumPrice } from "@/config/pricing";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const features = [
  {
    icon: Zap,
    title: "10x Faster Processing",
    desc: "Skip the queue with priority conversion processing.",
  },
  {
    icon: Shield,
    title: "50MB File Size",
    desc: "Convert massive documents without hitting limits.",
  },
  {
    icon: History,
    title: "24h History Access",
    desc: "Re-download your converted files for up to 24 hours.",
  },
  {
    icon: Star,
    title: "Daily Limit: 100",
    desc: "Perfect for power users and enterprise workflows.",
  },
];

export default function PremiumPage() {
  const { user, plan, loading: authLoading } = useAuth();
  const router = useRouter();
  const isPremium = plan === "premium";
  const isRazorpayReady = isRazorpayConfigured();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) setLoading(false);
  }, [authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-20 pb-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* HEADER */}
        <motion.div
          className="text-center mb-10 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-amber-500/20 text-amber-500 text-sm font-medium">
            <CrownIcon className="w-4 h-4" />
            Go Pro Today
          </div>

          <div className="flex justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-gray-400 hover:text-white transition text-sm hover:underline"
            >
              <ArrowLeft className="w-3 h-3 mr-1" /> Back to Dashboard
            </Link>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Convert Without <span className="gradient-text-brand">Limits</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Unlock professional-grade features designed for speed, scale, and
            reliability.
          </p>
        </motion.div>

        {/* CURRENT PLAN STATUS */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-12"
        >
          <div
            className={`rounded-2xl border px-6 py-4 text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              isPremium
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-white/5 border-white/10 text-gray-300"
            }`}
          >
            <div>
              <p className="font-semibold">
                Current Plan:{" "}
                <span className="text-white">
                  {isPremium ? "Premium" : "Free"}
                </span>
              </p>
              {!isPremium && (
                <p className="text-xs text-gray-400 mt-1">
                  {PLAN_LIMITS.free.maxDailyConversions} conversions/day ·{" "}
                  {PLAN_LIMITS.free.maxFileSizeMB}MB max · Single file only
                </p>
              )}
            </div>

            {isPremium && (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                <Check className="w-3 h-3" />
                Active
              </span>
            )}
          </div>
        </motion.div> */}

          {/* CURRENT PLAN – ENHANCED UI */}
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  className="mb-14"
>
  <div
    className={`relative overflow-hidden rounded-3xl border p-6 sm:p-7 ${
      isPremium
        ? "bg-gradient-to-br from-green-500/15 via-emerald-500/10 to-transparent border-green-500/25"
        : "bg-gradient-to-br from-white/8 via-white/4 to-transparent border-white/10"
    }`}
  >
    {/* Ambient Glow */}
    <div
      className={`absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl pointer-events-none ${
        isPremium ? "bg-green-500/20" : "bg-purple-500/15"
      }`}
    />

    <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
      {/* LEFT */}
      <div>
        <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-1">
          Your Current Plan
        </p>

        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-bold text-white">
            {isPremium ? "Premium Plan" : "Free Plan"}
          </h3>

          {isPremium && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">
              <Check className="w-3 h-3" />
              Active
            </span>
          )}
        </div>

        {!isPremium && (
          <p className="text-sm text-gray-400 mt-2 max-w-md">
            {PLAN_LIMITS.free.maxDailyConversions} conversions/day ·{" "}
            {PLAN_LIMITS.free.maxFileSizeMB}MB max file size · Single file only
          </p>
        )}

        {isPremium && (
          <p className="text-sm text-gray-400 mt-2">
            Enjoy higher limits, faster processing, and history access.
          </p>
        )}
      </div>

      {/* RIGHT */}
      <div className="text-right">
        {!isPremium ? (
          <>
            <p className="text-xs text-gray-400">Upgrade to unlock</p>
            <p className="text-sm font-medium text-white">
              Multi-file · Larger uploads · History
            </p>
          </>
        ) : (
          <>
            <p className="text-xs text-gray-400">Status</p>
            <p className="text-sm font-medium text-white">
              All premium features enabled
            </p>
          </>
        )}
      </div>
    </div>
  </div>
</motion.div>
 


        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* FEATURE GRID */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {features.map((f, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                <f.icon className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400">{f.desc}</p>
              </div>
            ))}
          </motion.div>

          {/* PRICING CARD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-30" />

            <div className="relative bg-[#12121a] border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="absolute top-0 right-0 p-4">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                  BEST VALUE
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-2">Converty Premium</h2>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-bold">
                  {formatPremiumPrice()}
                </span>
                <span className="text-gray-400">/month</span>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  `Up to ${PLAN_LIMITS.premium.maxDailyConversions} files per day`,
                  `${PLAN_LIMITS.premium.maxFileSizeMB}MB max file size`,
                  "Priority Processing",
                  "24-Hour History",
                  "No Ads or Watermarks",
                  "Priority Support",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              {isPremium ? (
                <button
                  disabled
                  className="w-full py-4 rounded-xl bg-gray-700 text-gray-300 font-bold cursor-not-allowed"
                >
                  Current Plan
                </button>
              ) : (
                <>
                  {!isRazorpayReady && (
                    <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5" />
                      <p className="text-xs text-amber-400">
                        Payment system is currently unavailable.
                      </p>
                    </div>
                  )}

                  <Link href="/payment">
                    <button
                      disabled={!isRazorpayReady}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-lg hover:scale-[1.02] transition disabled:opacity-50"
                    >
                      Upgrade Now
                    </button>
                  </Link>
                </>
              )}

              <p className="text-xs text-center text-gray-500 mt-4">
                Secure payment powered by Razorpay.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

function CrownIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 9.87a.5.5 0 0 0 .466.305h5.728a.5.5 0 0 1 .456.745l-4.225 6.088a.5.5 0 0 0 .093.68l4.47 2.21a.5.5 0 0 1-.225 1.056H1.848a.5.5 0 0 1-.225-1.056l4.47-2.21a.5.5 0 0 0 .093-.68l-4.225-6.088a.5.5 0 0 1 .456-.745h5.728a.5.5 0 0 0 .466-.305z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
