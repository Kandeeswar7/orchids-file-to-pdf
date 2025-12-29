/**
 * Razorpay Configuration Utilities
 * 
 * Frontend-only utilities for Razorpay integration.
 * Only reads NEXT_PUBLIC_* environment variables.
 */

export const RAZORPAY_CONFIG = {
  keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  isConfigured: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
} as const;

/**
 * Validates if Razorpay is configured on the frontend
 */
export function isRazorpayConfigured(): boolean {
  return RAZORPAY_CONFIG.isConfigured;
}

/**
 * Gets the Razorpay Key ID (safe to expose to frontend)
 */
export function getRazorpayKeyId(): string {
  return RAZORPAY_CONFIG.keyId;
}

/**
 * Error message for missing Razorpay configuration
 */
export const RAZORPAY_NOT_CONFIGURED_MESSAGE =
  'Payment system not configured. Please contact support.';

