"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Check, Shield, Lock, CreditCard, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PaymentPage() {
  const router = useRouter();
  const { user, upgradeToPremium } = useAuth();
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      // Mock Razorpay Modal Opening
      // In real app, we'd call window.Razorpay(options)
      await upgradeToPremium();
      // Redirect to dashboard/convert with success param
      router.push("/dashboard?upgraded=true");
    } catch (e) {
      alert("Payment failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-20 pb-12 px-4 flex items-center justify-center">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between items-center py-4 border-b border-white/5">
              <div>
                <p className="font-semibold">Converty Premium</p>
                <p className="text-sm text-gray-400">Monthly Subscription</p>
              </div>
              <p className="font-bold">$9.99</p>
            </div>
            <div className="flex justify-between items-center py-4 text-xl font-bold">
              <p>Total</p>
              <p className="text-purple-400">$9.99</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-400 bg-green-500/10 p-4 rounded-xl border border-green-500/20">
            <Shield className="w-5 h-5 text-green-500" />
            <p>SSL Secure Payment. 30-Day Money Back Guarantee.</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6">Payment Details</h2>

          <div className="bg-[#12121a] p-4 rounded-xl border border-white/5 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#0c244b] p-2 rounded">
                {/* Simulating Razorpay Logo */}
                <span className="font-bold text-blue-400">Razorpay</span>
              </div>
              <span className="text-sm font-medium text-gray-300">
                Secure Checkout
              </span>
            </div>
            <Check className="w-5 h-5 text-green-500" />
          </div>

          <div className="mb-6 space-y-3">
            <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
              <div
                className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-all ${
                  termsAccepted
                    ? "bg-purple-600 border-purple-600"
                    : "border-gray-500 group-hover:border-purple-400"
                }`}
              >
                {termsAccepted && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <span className="text-sm text-gray-400 select-none">
                I agree to the{" "}
                <Link
                  href="/terms"
                  target="_blank"
                  className="text-purple-400 underline hover:text-purple-300"
                >
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  target="_blank"
                  className="text-purple-400 underline hover:text-purple-300"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading || !termsAccepted}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Processing...
              </>
            ) : (
              "Pay with Razorpay"
            )}
          </button>

          <p className="text-center text-xs text-gray-500 mt-4">
            (This is a secure mock payment for demo purposes)
          </p>
        </div>
      </div>
    </main>
  );
}
