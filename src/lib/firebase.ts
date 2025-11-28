"use client";

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type Auth,
  type ConfirmationResult,
} from "firebase/auth";

import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  serverTimestamp,
  query,
  where,
  getDocs,
  getDoc,
  Firestore,
} from "firebase/firestore";

// ----------------------------------------------
// Browser Environment Check
// ----------------------------------------------
const isBrowser = () => typeof window !== "undefined";

// ----------------------------------------------
// Firebase Config
// ----------------------------------------------
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// ----------------------------------------------
// Initialize Firebase (SSR Safe)
// ----------------------------------------------
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isBrowser()) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
}

// ----------------------------------------------
// Safe Getters (Prevents SSR Errors in Vercel)
// ----------------------------------------------
export function getAuthClient(): Auth {
  if (!auth) throw new Error("Firebase Auth is not available (SSR).");
  return auth;
}

export function getDB(): Firestore {
  if (!db) throw new Error("Firestore is not available (SSR).");
  return db;
}

// ----------------------------------------------
// Google Auth Provider
// ----------------------------------------------
export const googleProvider = new GoogleAuthProvider();

// ----------------------------------------------
// Phone Auth (Export)
// ----------------------------------------------
export { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult };

// ----------------------------------------------
// Username Generator
// ----------------------------------------------
function generateUsername(): string {
  const length = Math.floor(Math.random() * 7);
  const result = Math.random().toString(36).substring(2, 2 + length);
  return result || Math.random().toString(36).substring(2, 3);
}

// ----------------------------------------------
// SAVE USER PROFILE
// ----------------------------------------------
export async function saveUserProfile(userId: string, data: Record<string, any>) {
  const dbClient = getDB();
  const userRef = doc(dbClient, "users", userId);

  const existing = await getDoc(userRef);

  const finalData: Record<string, any> = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  if (!existing.exists() || !existing.data()?.username) {
    finalData.username = generateUsername();
    finalData.createdAt = serverTimestamp();
  }

  return setDoc(userRef, finalData, { merge: true });
}

// ----------------------------------------------
// GET USER PROFILE
// ----------------------------------------------
export async function getUserProfile(userId: string) {
  const dbClient = getDB();
  const snap = await getDoc(doc(dbClient, "users", userId));
  return snap.exists() ? snap.data() : null;
}

// ----------------------------------------------
// SAVE PICKUP
// ----------------------------------------------
export async function savePickup(data: Record<string, any>) {
  const dbClient = getDB();
  return addDoc(collection(dbClient, "pickups"), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

// ----------------------------------------------
// SAVE PREVIOUS REQUEST
// ----------------------------------------------
export async function savePreviousRequest(userId: string, data: Record<string, any>) {
  const dbClient = getDB();
  return addDoc(collection(dbClient, "previousRequests"), {
    userId,
    ...data,
    createdAt: serverTimestamp(),
  });
}

// ----------------------------------------------
// GET USER PICKUPS
// ----------------------------------------------
export async function getUserPickups(userId: string) {
  const dbClient = getDB();
  const ref = collection(dbClient, "pickups");
  const q = query(ref, where("userId", "==", userId));

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ----------------------------------------------
// GET USER PREVIOUS REQUESTS
// ----------------------------------------------
export async function getUserPrevious(userId: string) {
  const dbClient = getDB();
  const ref = collection(dbClient, "previousRequests");
  const q = query(ref, where("userId", "==", userId));

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ----------------------------------------------
// Export Firebase Instances (Browser Only)
// ----------------------------------------------
export { app, auth, db };
