"use client";

import React, { useState, useEffect } from "react";
// Replaced Next.js imports with standard equivalents for compatibility
import { Eye, EyeOff, Mail, Lock, LogIn, UserPlus, Home } from "lucide-react"; 

// --- FIREBASE IMPORTS ---

declare const __firebase_config: string;
declare const __initial_auth_token: string;

import { 
  initializeApp,
  getApps,
  getApp,
  FirebaseApp,
} from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged, 
  GoogleAuthProvider,
  RecaptchaVerifier as FRecaptchaVerifier,
  signInWithPhoneNumber as FsignInWithPhoneNumber,
  createUserWithEmailAndPassword as FcreateUserWithEmailAndPassword,
  signInWithPopup as FsignInWithPopup,
  type Auth,
  type ConfirmationResult,
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
  
  // Attempt to load config from environment variable
  try {
    firebaseConfig = typeof __firebase_config !== 'undefined' 
      ? JSON.parse(__firebase_config) 
      : {};
  } catch (e) {
    console.error("Error parsing __firebase_config:", e);
  }
  
  // === CONFIGURATION FALLBACK: START (Using provided valid keys) ===
  if (Object.keys(firebaseConfig).length === 0) {
      console.warn("Using hardcoded Firebase configuration.");
      firebaseConfig = {
          // *** UPDATED with your valid API Key ***
          apiKey: "AIzaSyC0_RQcE9maGWo-T7B_99Cd9eRk0lW9d5k", 
          authDomain: "reviveecotech-dfbed.firebaseapp.com",
          projectId: "reviveecotech-dfbed",
          storageBucket: "reviveecotech-dfbed.firebasestorage.app",
          messagingSenderId: "967064516173",
          appId: "1:967064516173:web:b0f172c527d31d537b0e04"
      };
  }
  // === CONFIGURATION FALLBACK: END ===
  
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
// Next.js Signup Page Component (Default Export)
// -----------------------------------------------------

export default function App() {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [mode, setMode] = useState<"email" | "phone">("email");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  let w: FirebaseWindow | null = null; 

  // Firebase Initialization and Auth Listener
  useEffect(() => {
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

  // Utility function to display messages
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
      if (w === null) { 
          throw new Error("Client environment (window) not initialized.");
      }
      return w;
  }


  // ==============================
  // SETUP INVISIBLE RECAPTCHA
  // ==============================
  const setupRecaptcha = () => {
    if (!auth) throw new Error("Authentication service not initialized.");
    
    const wRef = getWindowReference();

    if (!wRef.recaptchaVerifier) {
      wRef.recaptchaVerifier = new RecaptchaVerifier(
        auth, 
        "recaptcha-container",
        { size: "invisible" }
      );
    }
    return wRef.recaptchaVerifier;
  };

  // ==============================
  // SEND OTP
  // ==============================
  const sendOtp = async () => {
    setError("");
    setSuccessMessage("");

    if (!isAuthReady) return setError("Authentication not ready. Please wait.");
    if (phone.length !== 10) {
      return setError("Enter a valid 10-digit mobile number");
    }

    try {
      if (!auth) return setError("Authentication service not ready.");
      const wRef = getWindowReference();
      
      const fullPhone = "+91" + phone;
      const verifier = setupRecaptcha();

      if (!verifier) return; // Stop if recaptcha failed to set up

      const confirmation = await signInWithPhoneNumber(
        auth,
        fullPhone,
        verifier
      );

      wRef.confirmationResult = confirmation;
      setOtpSent(true);

      showMessage("OTP sent successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("OTP sending failed");
    }
  };

  // ==============================
  // VERIFY OTP -> CREATE ACCOUNT
  // ==============================
  const verifyOtpSignup = async () => {
    setError("");
    setSuccessMessage("");
    if (!isAuthReady) return setError("Authentication not ready. Please wait.");
    
    const wRef = getWindowReference();

    try {
      if (!otp) return setError("Enter OTP");
      if (!wRef.confirmationResult) return setError("OTP verification process not started. Send OTP first.");

      await wRef.confirmationResult.confirm(otp);
      showMessage("Account created successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Invalid OTP");
    }
  };

  // ==============================
  // EMAIL SIGNUP
  // ==============================
  const onEmailSignup = async () => {
    setError("");
    setSuccessMessage("");
    if (!isAuthReady) return setError("Authentication not ready. Please wait.");


    if (!email || !password || !confirm) {
      return setError("Please fill all fields");
    }
    if (password !== confirm) {
      return setError("Passwords do not match");
    }
    if (!auth) return setError("Authentication service not ready."); // Safety check

    try {
      await FcreateUserWithEmailAndPassword(auth, email, password);
      showMessage("Account created successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
    }
  };

  // ==============================
  // GOOGLE SIGNUP
  // ==============================
  const googleSignup = async () => {
    setError("");
    setSuccessMessage("");
    if (!isAuthReady) return setError("Authentication not ready. Please wait.");
    
    if (!auth) return setError("Authentication service not ready."); // Safety check
    try {
      await FsignInWithPopup(auth, googleProvider);
      showMessage("Signed up with Google!");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f9f4] p-6 md:p-10 flex items-center justify-center font-inter">
      
      {/* Required for OTP */}
      <div id="recaptcha-container"></div>
      
      <style>{`
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-[#e4e4e4]">

        {/* TOP BUTTONS (Simulated Links) */}
        <div className="flex items-center justify-between mb-8">
          <div className="bg-[#253612] text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 cursor-pointer">
            <Home size={16} /> Home
          </div>

          <div className="bg-[#253612] text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 cursor-pointer">
            <LogIn size={16} /> Log In
          </div>
        </div>

        {/* LOGO (Updated to use external URL and link to Home) */}
        <div 
          className="mb-6 cursor-pointer inline-block"
          // Simulates linking to the home page (/)
          onClick={() => console.log("Navigating to / (Home)")} 
          aria-label="Go to Home"
        >
          <img
            src="https://www.revives.in/_next/image?url=%2Flogo2.png&w=256&q=75"
            width={100}
            height={100}
            alt="Revive Logo"
            className="rounded-xl shadow-md"
          />
        </div>

        <h1 className="text-3xl font-bold text-[#253612] mb-1">
          Create Account
        </h1>
        <p className="text-gray-600 mb-6">Become a part of a better future</p>

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

        {/* SWITCH MODE */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => {setMode("email"); setError(""); setSuccessMessage("");}}
            className={`px-4 py-2 rounded-full border text-sm transition duration-150 font-medium ${
              mode === "email"
                ? "bg-[#253612] text-white shadow-lg"
                : "border-[#253612] text-[#253612] hover:bg-[#253612]/10"
            }`}
            disabled={!isAuthReady}
          >
            Email
          </button>

          <button
            onClick={() => {setMode("phone"); setError(""); setSuccessMessage("");}}
            className={`px-4 py-2 rounded-full border text-sm transition duration-150 font-medium ${
              mode === "phone"
                ? "bg-[#253612] text-white shadow-lg"
                : "border-[#253612] text-[#253612] hover:bg-[#253612]/10"
            }`}
            disabled={!isAuthReady}
          >
            Phone
          </button>
        </div>

        {/* ========================== EMAIL SIGNUP ========================== */}
        {mode === "email" && (
          <>
            {/* EMAIL */}
            <div className="mb-4">
              <div className="relative">
                <Mail className="absolute left-4 top-5 text-[#253612]" size={20} />

                <label className="absolute left-12 top-2 text-xs text-gray-500">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 rounded-xl pl-12 pr-4 pt-7 pb-3 focus:ring-2 focus:ring-[#253612]/50 focus:border-transparent transition"
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isAuthReady}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="mb-4">
              <div className="relative">
                <Lock className="absolute left-4 top-5 text-[#253612]" size={20} />

                <label className="absolute left-12 top-2 text-xs text-gray-500">
                  Password
                </label>

                <input
                  type={showPass ? "text" : "password"}
                  placeholder="********"
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
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="mb-6">
              <div className="relative">
                <Lock className="absolute left-4 top-5 text-[#253612]" size={20} />

                <label className="absolute left-12 top-2 text-xs text-gray-500">
                  Confirm Password
                </label>

                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="********"
                  className="w-full border border-gray-300 rounded-xl pl-12 pr-12 pt-7 pb-3 focus:ring-2 focus:ring-[#253612]/50 focus:border-transparent transition"
                  onChange={(e) => setConfirm(e.target.value)}
                  disabled={!isAuthReady}
                />

                <button
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-5 text-gray-500 hover:text-[#253612] transition"
                  aria-label={showConfirm ? "Hide confirmation password" : "Show confirmation password"}
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* SIGNUP BUTTON */}
            <button
              onClick={onEmailSignup}
              className="w-full bg-[#253612] text-white py-3 rounded-2xl font-semibold hover:bg-[#39501a] transition duration-200 shadow-md disabled:bg-gray-400"
              disabled={!isAuthReady || !email || !password || !confirm || password !== confirm}
            >
              Create Account
            </button>
          </>
        )}

        {/* ========================== PHONE SIGNUP ========================== */}
        {mode === "phone" && (
          <>
            {/* PHONE FIELD */}
            <div className="mb-4">
              <label className="text-xs text-gray-500 block mb-1">
                Mobile Number (India: +91)
              </label>

              <div className="flex items-center border border-gray-300 rounded-xl px-4 focus-within:ring-2 focus-within:ring-[#253612]/50 focus-within:border-transparent transition">
                <span className="text-gray-700 font-medium pr-3">+91</span>

                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="10-digit number"
                  className="w-full outline-none py-3"
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, ""))
                  }
                  disabled={!isAuthReady || otpSent}
                />
              </div>
            </div>

            {/* SEND OTP */}
            {!otpSent && (
              <button
                onClick={sendOtp}
                className="w-full bg-[#253612] text-white py-3 rounded-2xl font-semibold hover:bg-[#39501a] transition duration-200 shadow-md disabled:bg-gray-400 mb-6"
                disabled={!isAuthReady || phone.length !== 10}
              >
                Send OTP
              </button>
            )}

            {/* OTP FIELD */}
            {otpSent && (
              <>
                <div className="mb-6">
                  <label className="text-xs text-gray-500 block mb-1">
                    Enter OTP (6 digits)
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter OTP"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#253612]/50 focus:border-transparent transition"
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, ""))
                    }
                    disabled={!isAuthReady}
                  />
                </div>

                {/* VERIFY OTP */}
                <button
                  onClick={verifyOtpSignup}
                  className="w-full bg-[#253612] text-white py-3 rounded-2xl font-semibold hover:bg-[#39501a] transition duration-200 shadow-md disabled:bg-gray-400"
                  disabled={!isAuthReady || otp.length !== 6}
                >
                  Verify & Create Account
                </button>
                
                <div className="text-center mt-3">
                    <button 
                        onClick={() => {setOtpSent(false); setOtp(""); setError(""); setSuccessMessage("");}}
                        className="text-sm text-gray-500 hover:text-[#253612] underline"
                    >
                        Change Number or Resend
                    </button>
                </div>
              </>
            )}
          </>
        )}

        {/* OR SEPARATOR */}
        <div className="flex items-center gap-3 my-8">
          <div className="h-px w-full bg-gray-300"></div>
          <span className="text-gray-500 text-sm">or</span>
          <div className="h-px w-full bg-gray-300"></div>
        </div>

        {/* GOOGLE SIGNUP */}
        <button
          onClick={googleSignup}
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

        {/* SWITCH */}
        <p className="text-center mt-6 text-sm text-gray-700">
          Already have an account?{" "}
          <div
            onClick={() => console.log("Navigating to /login")} // Simulate navigation
            className="text-[#253612] font-medium underline inline cursor-pointer"
          >
            Log In
          </div>
        </p>
      </div>
    </div>
  );
}
