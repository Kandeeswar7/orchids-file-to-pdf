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
  if (typeof window !== "undefined") {
    console.error(
      "Firebase keys are missing in .env.local. Authentication will not work."
    );
  }
}

// Always try to initialize if we can, or let it fail gracefully
if (getApps().length === 0) {
  // We only initialize if we have at least an API key, otherwise it throws immediately
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
  }
} else {
  app = getApps()[0];
}

if (app) {
  auth = getAuth(app);
  db = getFirestore(app);
}

// Persistence handled automatically by browser or default setting
export { app, auth, db };
