"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, UserPlus, Home } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  auth,
  googleProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "@/lib/firebase";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  type Auth,
  type ConfirmationResult,
} from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();

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

  let confirmationResultGlobal: ConfirmationResult | null = null;

  // Firebase init listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth!, () => {
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const showMessage = (msg: string, isError = false) => {
    if (isError) setError(msg);
    else setSuccessMessage(msg);

    setTimeout(() => {
      setError("");
      setSuccessMessage("");
    }, 3000);
  };

  // SETUP INVISIBLE RECAPTCHA
  const setupRecaptcha = () => {
    new RecaptchaVerifier(auth!, "recaptcha-container", {
      size: "invisible",
    });
  };

  // SEND OTP
  const sendOtp = async () => {
    if (phone.length !== 10) return showMessage("Enter a valid phone number", true);

    setupRecaptcha();

    try {
      const result = await signInWithPhoneNumber(auth!, "+91" + phone, window.recaptchaVerifier);
      confirmationResultGlobal = result;
      setOtpSent(true);
      showMessage("OTP Sent!");
    } catch (err: any) {
      showMessage(err.message, true);
    }
  };

  // VERIFY OTP
  const loginWithOtp = async () => {
    try {
      await confirmationResultGlobal!.confirm(otp);
      router.push("/dashboard");
    } catch (err: any) {
      showMessage("Invalid OTP", true);
    }
  };

  // EMAIL LOGIN
  const loginEmail = async () => {
    try {
      await signInWithEmailAndPassword(auth!, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      showMessage(err.message, true);
    }
  };

  // GOOGLE LOGIN
  const googleLogin = async () => {
    try {
      await signInWithPopup(auth!, googleProvider);
      router.push("/dashboard");
    } catch (err: any) {
      showMessage(err.message, true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div id="recaptcha-container"></div>

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8">
        {/* NAV */}
        <div className="flex justify-between mb-6">
          <button onClick={() => router.push("/")} className="btn-nav">
            <Home size={16} /> Home
          </button>
          <button onClick={() => router.push("/signup")} className="btn-nav">
            <UserPlus size={16} /> Sign Up
          </button>
        </div>

        <h1 className="text-3xl font-bold text-[#253612] mb-2">Welcome Back</h1>
        <p className="text-gray-600 mb-4">Login to your account</p>

        {error && <p className="text-red-600 bg-red-100 px-3 py-2 rounded">{error}</p>}
        {successMessage && <p className="text-green-600 bg-green-100 px-3 py-2 rounded">{successMessage}</p>}

        {/* MODE SWITCH */}
        <div className="flex gap-3 my-5">
          <button onClick={() => setMode("email")} className={`btn-switch ${mode==="email"?"active":""}`}>Email Login</button>
          <button onClick={() => setMode("phone")} className={`btn-switch ${mode==="phone"?"active":""}`}>Phone OTP</button>
        </div>

        {/* EMAIL LOGIN */}
        {mode === "email" && (
          <div className="space-y-4">
            <input className="input" type="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
            <div className="relative">
              <input className="input" type={showPass?"text":"password"} placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />
              <button onClick={()=>setShowPass(!showPass)} className="absolute right-4 top-3">{showPass? <EyeOff/> : <Eye/>}</button>
            </div>

            <button className="btn-main" onClick={loginEmail}>Log In</button>
            <p className="text-sm text-gray-500 cursor-pointer underline" onClick={()=>router.push("/forgot")}>Forgot Password?</p>
          </div>
        )}

        {/* PHONE LOGIN */}
        {mode === "phone" && (
          <div className="space-y-4">
            <input className="input" maxLength={10} placeholder="10-digit phone" onChange={(e)=>setPhone(e.target.value.replace(/\D/g,""))} />
            
            {!otpSent && <button className="btn-main" onClick={sendOtp}>Send OTP</button>}

            {otpSent && (
              <>
                <input className="input" maxLength={6} placeholder="Enter OTP" onChange={(e)=>setOtp(e.target.value)} />
                <button className="btn-main" onClick={loginWithOtp}>Verify OTP</button>
              </>
            )}
          </div>
        )}

        {/* GOOGLE */}
        <button onClick={googleLogin} className="btn-google">Continue with Google</button>

        <p className="text-center mt-4">
          Don’t have an account? <span onClick={()=>router.push("/signup")} className="text-[#253612] underline cursor-pointer">Sign Up</span>
        </p>
      </div>
    </div>
  );
}
