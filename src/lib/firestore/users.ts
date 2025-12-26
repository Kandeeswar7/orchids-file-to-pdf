import { adminDb } from "../firebase/admin"; // Admin SDK
import { FieldValue, Timestamp } from "firebase-admin/firestore";

const FREE_DAILY_LIMIT = 3;

interface UserData {
  email?: string;
  plan: "free" | "premium";
  dailyUsage: number;
  lastReset: Timestamp;
  createdAt: Timestamp;
}

/**
 * STRICT Rule:
 * 1. Check if usage needs reset FIRST.
 * 2. Check Plan & Limits.
 * 3. Return decision.
 */
export async function assertUserCanConvert(uid: string, email?: string): Promise<{ allowed: boolean; reason?: string; plan: string }> {
  if (!uid) return { allowed: false, reason: "No UID provided", plan: "guest" };

  const userRef = adminDb.collection("users").doc(uid);
  const docSnap = await userRef.get();
  const now = new Date();

  let data: UserData;

  if (!docSnap.exists) {
    // Create new user record on fly if missing (first login or consistency fix)
    data = {
      email: email || "",
      plan: "free",
      dailyUsage: 0,
      lastReset: Timestamp.fromDate(now),
      createdAt: Timestamp.fromDate(now),
    };
    await userRef.set(data);
  } else {
    data = docSnap.data() as UserData;
  }

  // --- 1. REFINE / RESET LOGIC ---
  const lastResetDate = data.lastReset.toDate();
  const isDifferentDay = lastResetDate.getDate() !== now.getDate() ||
                         lastResetDate.getMonth() !== now.getMonth() ||
                         lastResetDate.getFullYear() !== now.getFullYear();

  if (isDifferentDay) {
    await userRef.update({
      dailyUsage: 0,
      lastReset: Timestamp.fromDate(now),
    });
    // Update local data view
    data.dailyUsage = 0;
  }

  // --- 2. CHECK PLAN & LIMITS ---
  if (data.plan === "premium") {
    return { allowed: true, plan: "premium" };
  }

  if (data.dailyUsage >= FREE_DAILY_LIMIT) {
    return { 
      allowed: false, 
      reason: `Daily limit reached (${FREE_DAILY_LIMIT}). Upgrade to Premium for unlimited access.`,
      plan: "free"
    };
  }

  return { allowed: true, plan: "free" };
}

/**
 * Only call this AFTER a successful conversion.
 */
export async function incrementUsage(uid: string) {
  if (!uid) return;
  const userRef = adminDb.collection("users").doc(uid);
  await userRef.update({
    dailyUsage: FieldValue.increment(1)
  });
}
