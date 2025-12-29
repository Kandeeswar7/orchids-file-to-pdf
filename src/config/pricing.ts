/**
 * Premium Plan Pricing Configuration
 * 
 * TEST MODE: Currently set to ₹1 INR for Razorpay test payments.
 * This minimal amount allows validation of the full real payment flow.
 * 
 * To update pricing for production:
 * - Change PREMIUM_AMOUNT_INR to desired amount (e.g., 499 for ₹499)
 * - PREMIUM_AMOUNT_IN_PAISE will automatically update
 * - No other code changes required
 */

// Premium plan price in INR (Indian Rupees)
// TEST MODE: ₹1 INR for testing payment flow
// TODO: Update to production pricing (e.g., 499) before going live
export const PREMIUM_AMOUNT_INR = 1;

// Razorpay requires amount in paise (smallest currency unit)
// 1 INR = 100 paise
export const PREMIUM_AMOUNT_IN_PAISE = PREMIUM_AMOUNT_INR * 100; // 100 paise

// Currency code (must be "INR" for Razorpay)
export const PREMIUM_CURRENCY = "INR" as const;

// Display label for the plan
export const PREMIUM_PLAN_LABEL = "Premium Plan (Test)";

// Helper function to format price for display
export function formatPremiumPrice(): string {
  return `₹${PREMIUM_AMOUNT_INR}`;
}

