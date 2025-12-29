import { NextRequest, NextResponse } from 'next/server';

/**
 * Razorpay Payment Order Creation API
 * 
 * This endpoint creates a Razorpay order for premium subscription.
 * 
 * Environment Variables Required:
 * - RAZORPAY_KEY_ID: Razorpay API Key ID (from dashboard)
 * - RAZORPAY_KEY_SECRET: Razorpay API Key Secret (NEVER expose to frontend)
 * - RAZORPAY_WEBHOOK_SECRET: Optional, for future webhook verification
 * 
 * This endpoint is isolated from conversion logic and does not interact
 * with BullMQ, Redis, or worker code.
 */

// Validate environment variables at module load
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET; // Optional

function validateRazorpayConfig() {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return {
      isValid: false,
      error: 'Payment system not configured. Missing Razorpay credentials.',
    };
  }
  return { isValid: true };
}

export async function POST(req: NextRequest) {
  try {
    // Validate configuration
    const configCheck = validateRazorpayConfig();
    if (!configCheck.isValid) {
      return NextResponse.json(
        { error: configCheck.error },
        { status: 503 }
      );
    }

    // Parse request body
    const body = await req.json();
    // Default to INR (Indian Rupees) - Razorpay primary currency
    const { amount, currency = 'INR' } = body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount. Amount must be greater than 0.' },
        { status: 400 }
      );
    }

    // Create Razorpay order using REST API (no SDK dependency for now)
    // Amount should be in smallest currency unit:
    // - For INR: paise (1 INR = 100 paise)
    // - For USD: cents (1 USD = 100 cents)
    // - For other currencies: check Razorpay documentation
    const amountInSmallestUnit = Math.round(amount * 100);

    const orderData = {
      amount: amountInSmallestUnit,
      currency: currency.toUpperCase(),
      receipt: 'converty_00123', // temporary fixed receipt for testing (15 chars, well under 40 char limit)
      notes: {
        source: 'converty_premium',
        timestamp: new Date().toISOString(),
      },
    };

    // Call Razorpay Orders API
    const authString = Buffer.from(
      `${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`
    ).toString('base64');

    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!razorpayResponse.ok) {
      const errorData = await razorpayResponse.json().catch(() => ({}));
      console.error('[Razorpay] Order creation failed:', errorData);
      return NextResponse.json(
        {
          error:
            errorData.error?.description ||
            'Failed to create payment order. Please try again.',
        },
        { status: razorpayResponse.status }
      );
    }

    const order = await razorpayResponse.json();

    // Return order details (safe to expose to frontend)
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID, // Frontend needs this to initialize Razorpay
      status: 'created',
    });
  } catch (error: any) {
    console.error('[Payments] Error creating order:', error);
    return NextResponse.json(
      {
        error:
          error.message || 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}

// Health check endpoint to verify configuration
export async function GET() {
  const configCheck = validateRazorpayConfig();
  return NextResponse.json({
    configured: configCheck.isValid,
    message: configCheck.isValid
      ? 'Razorpay payment system is configured and ready.'
      : configCheck.error,
  });
}

