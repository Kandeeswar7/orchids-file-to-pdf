import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only once
import { Auth } from "firebase/auth";
import { Firestore } from "firebase/firestore";
import { FirebaseApp } from "firebase/app";

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

if (!firebaseConfig.apiKey) {
  console.warn("Firebase Config Missing! Check .env.local");
  // Prevent crash by not initializing or using a dummy? 
  // initializeApp throws if apiKey is missing. 
  // We'll export mock objects or nulls? 
  // But typescript expects them to be defined.
  // Best bet: Throw a clear error that the UI can catch?
  // Or just mock them to allow the UI to render the "Login" page (which will fail gracefully).
  
  // NOTE: This will still cause issues when hooks try to use 'auth'.
  // But it prevents the immediate "Application error" white screen.
  class MockAuth {} 
  class MockDb {} 
  
  // Actually, cleanest way is to just throw a descriptive error that we can catch or see in logs.
  // But Next.js client exceptions are ugly.
  // Let's rely on the user fixing the env.
  // However, to fix the "Application error":
  
  // Mock items to allow app to hydrate
  const mockApp: any = { name: "mock" };
  // auth and db remain undefined
  app = mockApp;
  
} else {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
}

// Persistence handled automatically by browser or default setting
export { app, auth, db };
