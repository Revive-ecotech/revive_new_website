// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type Auth
} from "firebase/auth";

// ---- Prevent Firebase from running on server ----
export const isBrowser = () => typeof window !== "undefined";

// ---- Firebase Config (client ONLY) ----
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

// ---- Initialize ONLY in browser ----
if (isBrowser()) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
}

export { auth, googleProvider, RecaptchaVerifier, signInWithPhoneNumber };
