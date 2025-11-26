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
} from "firebase/firestore";

// --------------------------------------------------
// 1️⃣ Browser check to avoid "window is undefined"
// --------------------------------------------------
const isBrowser = () => typeof window !== "undefined";

// --------------------------------------------------
// 2️⃣ Firebase Config
// --------------------------------------------------
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// --------------------------------------------------
// 3️⃣ Init Firebase (Browser Only)
// --------------------------------------------------
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: ReturnType<typeof getFirestore> | null = null;

if (isBrowser()) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
}

// --------------------------------------------------
// 4️⃣ Safe Exported Getters
// --------------------------------------------------
export function getAuthClient(): Auth {
  if (!auth) throw new Error("Firebase Auth is only available in the browser.");
  return auth;
}

export function getDB() {
  if (!db) throw new Error("Firestore is only available in the browser.");
  return db;
}

// --------------------------------------------------
// 5️⃣ Google Provider
// --------------------------------------------------
export const googleProvider = new GoogleAuthProvider();

// --------------------------------------------------
// 6️⃣ Phone Auth Exports
// --------------------------------------------------
export {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
};

// --------------------------------------------------
// 7️⃣ 🔥 FIRESTORE WRITE FUNCTIONS
// --------------------------------------------------

// SAVE PICKUP REQUEST
export async function savePickup(data: any) {
  const dbClient = getDB();
  const ref = collection(dbClient, "pickups");

  return await addDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
  });
}

// SAVE PREVIOUS REQUEST
export async function savePreviousRequest(userId: string, data: any) {
  const dbClient = getDB();
  const ref = collection(dbClient, "previousRequests");

  return await addDoc(ref, {
    userId,
    ...data,
    createdAt: serverTimestamp(),
  });
}

// SAVE USER PROFILE
export async function saveUserProfile(userId: string, data: any) {
  const dbClient = getDB();
  const userRef = doc(dbClient, "users", userId);

  return await setDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// --------------------------------------------------
// 8️⃣ 🔥 FIRESTORE READ FUNCTIONS
// --------------------------------------------------

// GET USER PICKUPS
export async function getUserPickups(userId: string) {
  const dbClient = getDB();
  const ref = collection(dbClient, "pickups");

  const q = query(ref, where("userId", "==", userId));
  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// GET USER PREVIOUS REQUESTS
export async function getUserPrevious(userId: string) {
  const dbClient = getDB();
  const ref = collection(dbClient, "previousRequests");

  const q = query(ref, where("userId", "==", userId));
  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// --------------------------------------------------
// 9️⃣ Export instances (optional)
// --------------------------------------------------
export { auth, db };
