import React, { useState, useEffect } from "react";
// Replaced Next.js imports with standard equivalents for compatibility
import { Mail, LogIn, Home, Lock } from "lucide-react"; 

// --- FIREBASE IMPORTS ---
// Note: In a real Next.js project, you would import these from "@/lib/firebase"

declare const __firebase_config: string;
declare const __initial_auth_token: string;

import { 
  initializeApp,
  getApps,
  getApp,
} from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged, 
  sendPasswordResetEmail,
  type Auth,
} from 'firebase/auth';

let auth: Auth | null = null;

const setupFirebase = () => {
  let firebaseConfig: any = {};
  
  // Load config from global variable
  try {
    firebaseConfig = typeof __firebase_config !== 'undefined' 
      ? JSON.parse(__firebase_config) 
      : {};
  } catch (e) {
    console.error("Error parsing __firebase_config:", e);
    return null;
  }
  
  if (Object.keys(firebaseConfig).length === 0) {
    console.error("Firebase configuration is missing.");
    return null;
  }
  
  // Initialize app
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
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
// Next.js Forgot Password Page Component (Default Export)
// -----------------------------------------------------

export default function App() {
  const [isAuthReady, setIsAuthReady] = useState(false);

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Firebase Initialization and Auth Listener
  useEffect(() => {
    const initializedAuth = setupFirebase();
    
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


  const handleReset = async () => {
    setError("");
    setSuccessMessage("");
    
    if (!isAuthReady) return setError("Authentication not ready. Please wait.");
    
    if (!email) {
      return setError("Enter your email");
    }

    try {
      await sendPasswordResetEmail(auth!, email);
      setSent(true);
      showMessage("Password reset link sent successfully!");
    } catch (err: unknown) { // FIX 5: Preserved the type safety fix
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
      setSent(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f9f4] p-6 flex items-center justify-center font-inter">
      <style>{`
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
      <div className="w-full max-w-lg bg-white rounded-3xl border shadow-2xl p-8 md:p-10">
        
        {/* Header/Navigation - Simulating Link behavior */}
        <div className="flex items-center justify-between mb-8">
          <div className="bg-[#253612] text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 cursor-pointer">
            <Home size={16} /> Home
          </div>
          <div className="bg-[#253612] text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 cursor-pointer">
            <LogIn size={16} /> Log In
          </div>
        </div>

        {/* Logo - Simulating Image with SVG placeholder */}
        <div className="mb-6 w-20 h-20 rounded-full bg-[#253612] flex items-center justify-center">
            <Lock className="text-white" size={32} />
        </div>

        <h1 className="text-3xl font-bold text-[#253612] mb-1">Forgot Password</h1>
        <p className="text-gray-600 mb-6">Enter your email to receive a reset link.</p>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {(sent || successMessage) && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl relative mb-4" role="alert">
            <span className="block sm:inline">{successMessage || "Reset link sent! Check your email."}</span>
          </div>
        )}
        
        {/* Loading/Auth Status */}
        {!isAuthReady && (
            <p className="text-blue-500 mb-4">Initializing authentication...</p>
        )}


        <div className="relative mb-6">
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

        <button
          onClick={handleReset}
          className="w-full bg-[#253612] text-white py-3 rounded-2xl font-semibold hover:bg-[#39501a] transition duration-200 shadow-md disabled:bg-gray-400"
          disabled={!isAuthReady || !email}
        >
          Send Reset Link
        </button>
      </div>
    </div>
  );
}
