"use client";

import React, { useState, useEffect } from "react";
// Replaced Next.js imports with standard equivalents for compatibility
import { Eye, EyeOff, Mail, Lock, LogIn, UserPlus, Home } from "lucide-react";

// --- FIREBASE IMPORTS ---
// Note: In a real Next.js project, you would import these from "@/lib/firebase"

declare const __firebase_config: string;
declare const __initial_auth_token: string;

import { 
  initializeApp,
  getApps,
  getApp,
  FirebaseApp, // Imported FirebaseApp type
} from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged, 
  GoogleAuthProvider,
  RecaptchaVerifier as FRecaptchaVerifier,
  signInWithPhoneNumber as FsignInWithPhoneNumber,
  signInWithEmailAndPassword as FsignInWithEmailAndPassword,
  signInWithPopup as FsignInWithPopup,
  type Auth,
  type ConfirmationResult, // Import ConfirmationResult type
} from 'firebase/auth';

let auth: Auth | null = null;

const googleProvider = new GoogleAuthProvider();
const RecaptchaVerifier = FRecaptchaVerifier;
const signInWithPhoneNumber = FsignInWithPhoneNumber;

// Define a safe, extended interface for window properties needed by Firebase
interface FirebaseWindow extends Window {
    recaptchaVerifier?: FRecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
}

const setupFirebase = () => {
  let firebaseConfig: Record<string, string> = {}; 
  
  // Load config from global variable
  try {
    firebaseConfig = typeof __firebase_config !== 'undefined' 
      ? JSON.parse(__firebase_config) 
      : {};
  } catch (e) {
    console.error("Error parsing __firebase_config:", e);
  }
  
  // === DEBUG FALLBACK: START ===
  // If no config is loaded from the environment, use a mock config to allow initialization.
  // REMOVE THIS BLOCK in a production environment or when deployment variables are working.
  if (Object.keys(firebaseConfig).length === 0) {
      console.warn("Using DEBUG fallback Firebase configuration.");
      firebaseConfig = {
          apiKey: "MOCK-API-KEY",
          authDomain: "mock-domain.firebaseapp.com",
          projectId: "mock-project-id",
          storageBucket: "mock-bucket.appspot.com",
          messagingSenderId: "123456789012",
          appId: "1:123456789012:web:mockid"
      };
  }
  // === DEBUG FALLBACK: END ===
  
  // Re-check: If still missing, return null
  if (Object.keys(firebaseConfig).length === 0) {
    console.error("Firebase configuration is missing after all attempts.");
    return null;
  }
  
  // Initialize app
  const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp(); 
  auth = getAuth(app);
  
  // Authenticate user
  const authenticate = async () => {
    try {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInWithCustomToken(auth!, __initial_auth_token);
      } else {
        await signInAnonymously(auth!);
      }
    } catch (e) {
      console.error("Firebase Auth initialization failed:", e);
    }
  };

  authenticate();
  return auth;
};

// -----------------------------------------------------
// Next.js Login Page Component (Default Export)
// -----------------------------------------------------

export default function App() {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [mode, setMode] = useState<"email" | "phone">("email");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // Define w locally here, but access it only in client-side functions
  // Initialize to null to avoid SSR crash
  let w: FirebaseWindow | null = null; 

  // Firebase Initialization and Auth Listener
  useEffect(() => {
    // This code runs only on the client
    const initializedAuth = setupFirebase();
    
    // Assign window reference here, only on client mount
    if (typeof window !== 'undefined') {
        w = window as unknown as FirebaseWindow;
    }


    if (!initializedAuth) {
        setError("Could not initialize Firebase. Configuration missing.");
        return;
    }
    
    auth = initializedAuth;

    const unsubscribe = onAuthStateChanged(auth, () => {
        setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const showMessage = (message: string, isError = false) => {
    if (isError) {
        setError(message);
        setSuccessMessage("");
    } else {
        setSuccessMessage(message);
        setError("");
    }
    setTimeout(() => {
      setSuccessMessage("");
      setError("");
    }, 5000); 
  };
  
  // Helper to ensure window reference is available before use
  const getWindowReference = (): FirebaseWindow => {
      // We check w for null only if we are sure we are on the client side.
      // Since this is only called from click handlers after useEffect runs, w should be set.
      if (w === null) { 
          throw new Error("Client environment (window) not initialized.");
      }
      return w;
  }

  // --------------------------
  // Setup Recaptcha
  // --------------------------
  const setupRecaptcha = () => {
    if (!auth) throw new Error("Authentication service not initialized.");
    
    const wRef = getWindowReference(); // Get safe window reference

    if (!wRef.recaptchaVerifier) {
      wRef.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
    }
    return wRef.recaptchaVerifier;
  };

  // --------------------------
  // Send OTP (FIX 1: catch block updated)
  // --------------------------
  const sendOtp = async () => {
    setError("");
    setSuccessMessage("");

    if (!isAuthReady) return setError("Authentication not ready. Please wait.");
    if (phone.length !== 10) {
      return setError("Enter a valid 10-digit mobile number");
    }

    try {
      const wRef = getWindowReference(); // Get safe window reference
      const verifier = setupRecaptcha();

      const confirmation = await signInWithPhoneNumber(
        auth!,
        "+91" + phone,
        verifier
      );

      // Store the ConfirmationResult object using the typed 'w' object
      wRef.confirmationResult = confirmation; 
      setOtpSent(true);
      showMessage("OTP Sent Successfully!");
    } catch (err: unknown) { 
      if (err instanceof Error) setError(err.message);
      else setError("OTP sending failed");
    }
  };

  // --------------------------
  // Verify OTP (FIX 2: catch block updated)
  // --------------------------
  const loginWithOtp = async () => {
    setError("");
    setSuccessMessage("");
    if (!isAuthReady) return setError("Authentication not ready. Please wait.");
    
    const wRef = getWindowReference(); // Get safe window reference
    const confirmationResult = wRef.confirmationResult; 

    try {
      if (!otp) return setError("Enter OTP");
      if (!confirmationResult) return setError("OTP verification process not started. Send OTP first.");

      await confirmationResult.confirm(otp);
      showMessage("Logged in Successfully!");
    } catch (err: unknown) { 
      if (err instanceof Error) setError(err.message);
      else setError("Invalid OTP");
    }
  };

  // --------------------------
  // Email login (FIX 3: catch block updated)
  // --------------------------
  const loginEmail = async () => {
    setError("");
    setSuccessMessage("");
    if (!isAuthReady) return setError("Authentication not ready. Please wait.");
    
    try {
      if (!email || !password) return setError("Please enter both email and password.");
      await FsignInWithEmailAndPassword(auth!, email, password);
      showMessage("Login Successful!");
    } catch (err: unknown) { 
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
    }
  };

  // --------------------------
  // Google login (FIX 4: catch block updated)
  // --------------------------
  const googleLogin = async () => {
    setError("");
    setSuccessMessage("");
    if (!isAuthReady) return setError("Authentication not ready. Please wait.");
    
    try {
      await FsignInWithPopup(auth!, googleProvider);
      showMessage("Logged in with Google!");
    } catch (err: unknown) { 
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f9f4] p-6 md:p-10 flex items-center justify-center font-inter">
      
      {/* Recaptcha container is invisible, but required for Phone Auth */}
      <div id="recaptcha-container"></div>
      
      <style>{`
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100">
        
        {/* Header/Navigation - Simulating Next.js Link behavior */}
        <div className="flex items-center justify-between mb-8">
          <div className="bg-[#253612] text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 cursor-pointer">
            <Home size={16} /> Home
          </div>
          <div className="bg-[#253612] text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 cursor-pointer">
            <UserPlus size={16} /> Sign Up
          </div>
        </div>

        {/* Logo - Simulating Next.js Image with SVG placeholder */}
        <div className="mb-6 w-20 h-20 rounded-full bg-[#253612] flex items-center justify-center">
            <LogIn className="text-white" size={32} />
        </div>

        <h1 className="text-3xl font-bold text-[#253612] mb-1">Welcome Back</h1>
        <p className="text-gray-600 mb-6">Login to your account</p>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl relative mb-4" role="alert">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        {/* Loading/Auth Status */}
        {!isAuthReady && (
            <p className="text-blue-500 mb-4">Initializing authentication...</p>
        )}

        {/* Login Mode Switch */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => {setMode("email"); setError(""); setSuccessMessage("");}}
            className={`px-4 py-2 rounded-full transition duration-150 text-sm font-medium ${
              mode === "email"
                ? "bg-[#253612] text-white shadow-lg"
                : "border border-[#253612] text-[#253612] hover:bg-[#253612]/10"
            }`}
            disabled={!isAuthReady}
          >
            Email/Pass Login
          </button>

          <button
            onClick={() => {setMode("phone"); setError(""); setSuccessMessage("");}}
            className={`px-4 py-2 rounded-full transition duration-150 text-sm font-medium ${
              mode === "phone"
                ? "bg-[#253612] text-white shadow-lg"
                : "border border-[#253612] text-[#253612] hover:bg-[#253612]/10"
            }`}
            disabled={!isAuthReady}
          >
            Phone/OTP Login
          </button>
        </div>

        {/* Email Login Form */}
        {mode === "email" && (
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-5 text-[#253612]" size={20} />
              <label className="absolute left-12 top-2 text-xs text-gray-500">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-xl pl-12 pr-4 pt-7 pb-3 focus:ring-2 focus:ring-[#253612]/50 focus:border-transparent transition"
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isAuthReady}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-5 text-[#253612]" size={20} />
              <label className="absolute left-12 top-2 text-xs text-gray-500">Password</label>
              <input
                type={showPass ? "text" : "password"}
                className="w-full border border-gray-300 rounded-xl pl-12 pr-12 pt-7 pb-3 focus:ring-2 focus:ring-[#253612]/50 focus:border-transparent transition"
                onChange={(e) => setPassword(e.target.value)}
                disabled={!isAuthReady}
              />

              <button
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-5 text-gray-500 hover:text-[#253612] transition"
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            <button 
              onClick={loginEmail} 
              className="w-full bg-[#253612] text-white py-3 rounded-2xl font-semibold hover:bg-[#39501a] transition duration-200 shadow-md disabled:bg-gray-400"
              disabled={!isAuthReady || !email || !password}
            >
              Log In
            </button>
            <div className="text-center text-sm">
                <span className="text-gray-500 hover:text-[#253612] cursor-pointer underline">Forgot Password?</span>
            </div>
          </div>
        )}

        {/* Phone Login Form */}
        {mode === "phone" && (
          <div className="space-y-4">
            <div className="mb-5">
              <label className="text-xs block mb-1 text-gray-500">Mobile Number (India: +91)</label>
              <div className="flex items-center border border-gray-300 rounded-xl px-4 focus-within:ring-2 focus-within:ring-[#253612]/50 focus-within:border-transparent transition">
                <span className="font-medium pr-3 text-gray-700">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  className="w-full outline-none py-3"
                  placeholder="e.g. 9876543210"
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  disabled={!isAuthReady || otpSent}
                />
              </div>
            </div>

            {!otpSent && (
              <button 
                onClick={sendOtp} 
                className="w-full bg-[#253612] text-white py-3 rounded-2xl font-semibold hover:bg-[#39501a] transition duration-200 shadow-md disabled:bg-gray-400"
                disabled={!isAuthReady || phone.length !== 10}
              >
                Send OTP
              </button>
            )}

            {otpSent && (
              <>
                <div className="mb-5">
                  <label className="text-xs block mb-1 text-gray-500">Enter OTP (6 digits)</label>
                  <input
                    type="text"
                    maxLength={6}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#253612]/50 focus:border-transparent transition"
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    disabled={!isAuthReady}
                  />
                </div>

                <button 
                  onClick={loginWithOtp} 
                  className="w-full bg-[#253612] text-white py-3 rounded-2xl font-semibold hover:bg-[#39501a] transition duration-200 shadow-md disabled:bg-gray-400"
                  disabled={!isAuthReady || otp.length !== 6}
                >
                  Verify & Login
                </button>
              </>
            )}
            
            {otpSent && (
                <div className="text-center">
                    <button 
                        onClick={() => {setOtpSent(false); setOtp(""); setError(""); setSuccessMessage("");}}
                        className="text-sm text-gray-500 hover:text-[#253612] underline"
                    >
                        Change Number or Resend
                    </button>
                </div>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 my-8">
          <div className="h-px w-full bg-gray-300"></div>
          <span className="text-gray-500 text-sm">or</span>
          <div className="h-px w-full bg-gray-300"></div>
        </div>

        {/* Google Login */}
        <button
          onClick={googleLogin}
          className="w-full border border-gray-300 py-3 rounded-2xl text-[#253612] font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition duration-200 shadow-sm disabled:bg-gray-200"
          disabled={!isAuthReady}
        >
            {/* Google Icon SVG */}
            <svg viewBox="0 0 48 48" className="h-5 w-5">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,19.034-8.084,19.034-20c0-1.341-0.138-2.651-0.385-3.905l-5.657,5.657V20.083z"/>
                <path fill="#FF3D00" d="M6.306,14.691l6.096,4.672C14.195,12.723,19.313,9,24,9c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.665,8.307,6.306,14.691z"/>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.914-1.841,13.201-4.966l-6.096-4.672C28.468,36.516,26.216,37,24,37c-5.202,0-9.626-3.377-11.249-8.153l-6.096,4.672C9.665,39.693,16.318,44,24,44z"/>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.219-4.138,5.656l-5.657,5.657C34.046,37.947,38.28,34,40.176,29.932C43.333,26.985,44,22.75,44,20.083z"/>
            </svg>
          Continue with Google
        </button>

        <p className="text-center mt-6 text-sm text-gray-700">
          Don’t have an account?{" "}
          <span className="text-[#253612] underline font-medium cursor-pointer">
            Create one
          </span>
        </p>
      </div>
    </div>
  );
}
