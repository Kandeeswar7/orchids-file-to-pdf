"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Check, Shield, Lock, CreditCard, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  isRazorpayConfigured,
  getRazorpayKeyId,
  RAZORPAY_NOT_CONFIGURED_MESSAGE,
} from "@/lib/razorpay-config";
import {
  PREMIUM_AMOUNT_INR,
  PREMIUM_CURRENCY,
  PREMIUM_PLAN_LABEL,
  formatPremiumPrice,
} from "@/config/pricing";

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentPage() {
  const router = useRouter();
  const { user, upgradeToPremium } = useAuth();
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [razorpayError, setRazorpayError] = useState<string | null>(null);
  const isConfigured = isRazorpayConfigured();

  // Load Razorpay script dynamically
  useEffect(() => {
    if (!isConfigured) {
      setRazorpayError(RAZORPAY_NOT_CONFIGURED_MESSAGE);
      return;
    }

    // Check if already loaded
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    // Load Razorpay checkout script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      setRazorpayLoaded(true);
      setRazorpayError(null);
    };
    script.onerror = () => {
      setRazorpayError("Failed to load Razorpay checkout. Please refresh the page.");
      setRazorpayLoaded(false);
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup: remove script if component unmounts
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [isConfigured]);

  const handlePayment = async () => {
    if (!isConfigured || !razorpayLoaded || !window.Razorpay) {
      setRazorpayError(
        "Payment system not available. Please refresh the page or contact support."
      );
      return;
    }

    if (!termsAccepted) {
      alert("Please accept the terms and conditions to proceed.");
      return;
    }

    setLoading(true);
    setRazorpayError(null);

    try {
      // Step 1: Create order on backend
      const orderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: PREMIUM_AMOUNT_INR,
          currency: PREMIUM_CURRENCY,
          receipt: `premium_${user?.uid || "guest"}_${Date.now()}`,
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            "Failed to create payment order. Please try again."
        );
      }

      const orderData = await orderResponse.json();

      // Step 2: Initialize Razorpay checkout
      const razorpayKeyId = orderData.keyId || getRazorpayKeyId();

      const options = {
        key: razorpayKeyId,
        amount: orderData.amount, // Amount in paise (smallest currency unit for INR)
        currency: orderData.currency, // "INR"
        name: "Converty Premium",
        description: PREMIUM_PLAN_LABEL, // "Premium Plan (Test)"
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // Payment successful
          try {
            // Update user plan in Firestore
            await upgradeToPremium();
            // Redirect to dashboard with success
            router.push("/dashboard?upgraded=true");
          } catch (error) {
            console.error("Error upgrading to premium:", error);
            alert(
              "Payment successful but upgrade failed. Please contact support with payment ID: " +
                response.razorpay_payment_id
            );
            setLoading(false);
          }
        },
        prefill: {
          email: user?.email || "",
          name: user?.displayName || "",
        },
        theme: {
          color: "#7c3aed", // Purple theme matching Converty
        },
        modal: {
          ondismiss: function () {
            // User closed the modal
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response);
        setRazorpayError(
          `Payment failed: ${response.error.description || "Please try again."}`
        );
        setLoading(false);
      });

      razorpay.open();
    } catch (error: any) {
      console.error("Payment error:", error);
      setRazorpayError(error.message || "Payment failed. Please try again.");
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
                <p className="text-sm text-gray-400">{PREMIUM_PLAN_LABEL}</p>
              </div>
              <p className="font-bold">{formatPremiumPrice()}</p>
            </div>
            <div className="flex justify-between items-center py-4 text-xl font-bold">
              <p>Total</p>
              <p className="text-purple-400">{formatPremiumPrice()}</p>
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

          {/* Error Message */}
          {razorpayError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{razorpayError}</p>
            </motion.div>
          )}

          {/* Configuration Warning */}
          {!isConfigured && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-400">
                <p className="font-semibold mb-1">Payment System Not Configured</p>
                <p className="text-amber-300/80">
                  Razorpay payment integration is not available. Please contact
                  support or check your configuration.
                </p>
              </div>
            </motion.div>
          )}

          <button
            onClick={handlePayment}
            disabled={
              loading ||
              !termsAccepted ||
              !isConfigured ||
              !razorpayLoaded ||
              !!razorpayError
            }
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Processing...
              </>
            ) : !isConfigured ? (
              "Payment Not Available"
            ) : !razorpayLoaded ? (
              "Loading Payment..."
            ) : (
              "Pay with Razorpay"
            )}
          </button>

          <p className="text-center text-xs text-gray-500 mt-4">
            Secure payment powered by Razorpay. Your payment information is
            encrypted and secure.
          </p>
        </div>
      </div>
    </main>
  );
}
