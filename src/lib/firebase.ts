// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type Auth,
} from "firebase/auth";

// --- Only run Firebase in the browser ---
const isBrowser = () => typeof window !== "undefined";

// --- Firebase Config ---
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// --- Initialize Firebase (Safe for SSR) ---
const app = isBrowser()
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

// --- AUTH (Always defined in browser, never null) ---
export const auth: Auth | null = isBrowser() ? getAuth(app!) : null;

// --- Providers ---
export const googleProvider = isBrowser()
  ? new GoogleAuthProvider()
  : null;

// --- Phone Auth Utils ---
export { RecaptchaVerifier, signInWithPhoneNumber };
