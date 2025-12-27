"use client";

import { useAuth } from "@/context/AuthContext";
import { Loader2, Mail, Check, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function VerifyEmailPage() {
  const { user, sendVerificationEmail } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState("");

  const handleResend = async () => {
    setLoading(true);
    setResendStatus("");
    try {
      await sendVerificationEmail();
      setResendStatus("Email sent!");
    } catch (error: any) {
      // Firebase limits resend frequency, handle safely
      console.warn(error);
      setResendStatus("Please wait before resending.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * CRITICAL FIX:
   * We MUST call user.reload() because Firebase doesn't auto-update
   * emailVerified status in the client SDK until token refresh or reload.
   */
  const handleRefresh = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await user.reload();
      // Force get updated token claim
      await user.getIdToken(true);

      if (user.emailVerified) {
        router.push("/convert");
      } else {
        // Optional: Show toast "Not verified yet"
        alert("Email not verified yet. Please check your inbox.");
      }
    } catch (e) {
      console.error("Verification check failed", e);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-[#0b0b12] text-white flex items-center justify-center">
        <Link href="/login" className="text-purple-400 hover:text-purple-300">
          Return to Login
        </Link>
      </main>
    );
  }

  // Double check state (optimization)
  if (user.emailVerified) {
    router.push("/convert");
    return null;
  }

  return (
    <main className="min-h-screen bg-[#0b0b12] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="w-full max-w-md relative z-10 p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl text-center">
        <div className="w-20 h-20 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-6">
          <Mail className="w-10 h-10" />
        </div>

        <h1 className="text-2xl font-bold mb-3">Verify your email</h1>
        <p className="text-gray-400 mb-6">
          We've sent a verification link to <br />{" "}
          <strong className="text-white">{user.email}</strong>
        </p>

        <div className="space-y-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            I've Verified It
          </button>

          <button
            onClick={handleResend}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-200 hover:bg-purple-600/30 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Resend Email"
            )}
          </button>
        </div>

        {resendStatus && (
          <p className="mt-4 text-sm text-green-400">{resendStatus}</p>
        )}

        <div className="mt-8 pt-6 border-t border-white/10">
          <button
            onClick={() => (window.location.href = "/login")}
            className="text-sm text-gray-500 hover:text-white"
          >
            Sign Out
          </button>
        </div>
      </div>
    </main>
  );
}
