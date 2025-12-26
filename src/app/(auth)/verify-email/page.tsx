"use client";

import Link from "next/link";
import { Check } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen bg-[#0b0b12] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[140px]" />
      </div>

      <div className="w-full max-w-md relative z-10 p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl text-center">
        <div className="w-20 h-20 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10" />
        </div>

        <h1 className="text-3xl font-bold mb-3">Email Verified!</h1>
        <p className="text-gray-400 mb-8">
          Your account has been successfully verified. You can now access all
          premium features.
        </p>

        <Link
          href="/convert"
          className="block w-full py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </main>
  );
}
