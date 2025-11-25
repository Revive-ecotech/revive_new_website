// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type Auth,
} from "firebase/auth";

// Check browser
const isBrowser = () => typeof window !== "undefined";

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// --- Initialize Firebase ONLY in browser ---
let app: FirebaseApp | null = null;

if (isBrowser()) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
}

// 🔥 ALWAYS returns a proper Auth object (never null)
export function getAuthClient(): Auth {
  if (!app) {
    throw new Error("Firebase Auth can only be used in the browser.");
  }
  return getAuth(app);
}

// Providers
export const googleProvider = new GoogleAuthProvider();

// Phone Auth helpers
export { RecaptchaVerifier, signInWithPhoneNumber };
