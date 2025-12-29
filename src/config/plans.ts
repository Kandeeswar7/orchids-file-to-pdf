export const PLAN_LIMITS = {
  free: {
    maxDailyConversions: 5,
    maxFileSizeMB: 5,
    canAccessHistory: false,
    speed: 'standard',
    label: 'Free Plan'
  },
  premium: {
    maxDailyConversions: 100,
    maxFileSizeMB: 50,
    canAccessHistory: true,
    speed: 'fast',
    label: 'Premium Plan'
  }
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;
