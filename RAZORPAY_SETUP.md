# Razorpay Payment Integration Setup Guide

This document explains how to configure Razorpay payment integration for Converty.

## Environment Variables

### Frontend (Public - Safe to expose)
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`: Your Razorpay Key ID (starts with `rzp_test_` for test mode or `rzp_live_` for live mode)

### Backend (Private - NEVER expose to frontend)
- `RAZORPAY_KEY_ID`: Your Razorpay Key ID (same as above, but read from server-side)
- `RAZORPAY_KEY_SECRET`: Your Razorpay Key Secret (NEVER commit to git)
- `RAZORPAY_WEBHOOK_SECRET`: Optional, for future webhook signature verification

## Setup Steps

### 1. Get Razorpay Credentials

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to **Settings → API Keys**
3. Generate API keys (Test mode for development, Live mode for production)
4. Copy the **Key ID** and **Key Secret**

### 2. Configure Environment Variables

#### Local Development (.env.local)
```bash
# Frontend
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx

# Backend
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
```

#### Staging/Production
Set these environment variables in your hosting platform:
- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables
- **Other platforms**: Follow their respective documentation

### 3. Test Mode vs Live Mode

- **Test Mode**: Use keys starting with `rzp_test_`
  - Use test card numbers from [Razorpay Test Cards](https://razorpay.com/docs/payments/test-cards/)
  - No real money is charged
  
- **Live Mode**: Use keys starting with `rzp_live_`
  - Real payments will be processed
  - Switch only after thorough testing

### 4. Verify Configuration

1. Start your development server: `npm run dev`
2. Navigate to `/premium` page
3. Click "Upgrade Now"
4. Check the browser console for any errors
5. The payment button should be enabled if configuration is correct

### 5. Health Check

You can verify backend configuration by calling:
```bash
GET /api/payments/create-order
```

This returns:
```json
{
  "configured": true,
  "message": "Razorpay payment system is configured and ready."
}
```

## Security Best Practices

1. ✅ **DO**: Store `RAZORPAY_KEY_SECRET` only in backend environment variables
2. ✅ **DO**: Use `NEXT_PUBLIC_RAZORPAY_KEY_ID` for frontend (it's safe to expose)
3. ❌ **DON'T**: Commit secrets to git
4. ❌ **DON'T**: Expose `RAZORPAY_KEY_SECRET` to frontend
5. ❌ **DON'T**: Hardcode API keys in source code

## Architecture

### Frontend Flow
1. User clicks "Pay with Razorpay"
2. Frontend calls `/api/payments/create-order` to create order
3. Backend creates Razorpay order and returns `orderId` and `keyId`
4. Frontend initializes Razorpay checkout modal with order details
5. User completes payment in Razorpay modal
6. On success, frontend calls `upgradeToPremium()` to update user plan
7. User is redirected to dashboard

### Backend Flow
1. `/api/payments/create-order` validates environment variables
2. Creates Razorpay order via REST API
3. Returns order details (safe to expose)
4. Never exposes `RAZORPAY_KEY_SECRET`

## Troubleshooting

### "Payment system not configured"
- Check that `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set in `.env.local`
- Restart your development server after adding env variables
- Verify the variable name is exactly `NEXT_PUBLIC_RAZORPAY_KEY_ID`

### "Failed to load Razorpay checkout"
- Check internet connection
- Verify Razorpay script URL is accessible
- Check browser console for CORS or network errors

### Backend returns 503 "Payment system not configured"
- Check that `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set
- Verify these are server-side environment variables (not `NEXT_PUBLIC_*`)
- Restart your server after adding env variables

## Future Enhancements

- Webhook integration for payment verification
- Signature verification for secure payment confirmation
- Subscription management (cancel, renew)
- Payment history tracking

## Support

For Razorpay-specific issues, refer to:
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Support](https://razorpay.com/support/)

