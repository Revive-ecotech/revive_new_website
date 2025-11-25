"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

import {
  getAuthClient,
  googleProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "@/lib/firebase";

import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

// Define custom window properties for Firebase
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: any; // Firebase ConfirmationResult type
  }
}

export default function Login() {
  const [mode, setMode] = useState<"email" | "phone">("email");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  // --------------------------
  // Setup Recaptcha
  // --------------------------
  const setupRecaptcha = () => {
    const auth = getAuthClient();

    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
    }
    return window.recaptchaVerifier;
  };

  // --------------------------
  // Send OTP
  // --------------------------
  const sendOtp = async () => {
    setError("");

    if (phone.length !== 10) {
      return setError("Enter a valid 10-digit mobile number");
    }

    try {
      const auth = getAuthClient();
      const verifier = setupRecaptcha();

      const confirmation = await signInWithPhoneNumber(
        auth,
        "+91" + phone,
        verifier
      );

      window.confirmationResult = confirmation;
      setOtpSent(true);
      // NOTE: Using a custom modal/toast is recommended instead of alert() in production.
      alert("OTP Sent Successfully!");
    } catch (err: unknown) {
      // FIX: Replace 'any' with 'unknown' and narrow type
      if (err instanceof Error) setError(err.message);
      else setError("OTP sending failed");
    }
  };

  // --------------------------
  // Verify OTP
  // --------------------------
  const loginWithOtp = async () => {
    try {
      if (!otp) return setError("Enter OTP");
      await window.confirmationResult.confirm(otp);
      // NOTE: Using a custom modal/toast is recommended instead of alert() in production.
      alert("Logged in Successfully!");
    } catch (err: unknown) {
      // FIX: Replace 'any' with 'unknown' and narrow type
      if (err instanceof Error) setError(err.message);
      else setError("Invalid OTP");
    }
  };

  // --------------------------
  // Email login
  // --------------------------
  const loginEmail = async () => {
    try {
      const auth = getAuthClient();
      await signInWithEmailAndPassword(auth, email, password);
      // NOTE: Using a custom modal/toast is recommended instead of alert() in production.
      alert("Login Successful!");
    } catch (err: unknown) {
      // FIX: Replace 'any' with 'unknown' and narrow type
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
    }
  };

  // --------------------------
  // Google login
  // --------------------------
  const googleLogin = async () => {
    try {
      const auth = getAuthClient();
      await signInWithPopup(auth, googleProvider);
      // NOTE: Using a custom modal/toast is recommended instead of alert() in production.
      alert("Logged in with Google!");
    } catch (err: unknown) {
      // FIX: Replace 'any' with 'unknown' and narrow type
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f9f4] p-6 md:p-10 flex items-center justify-center">
      <div id="recaptcha-container"></div>

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-sm p-10 border">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="bg-[#253612] text-white px-6 py-2 rounded-full text-sm">
            ← Home
          </Link>
          <Link href="/signup" className="bg-[#253612] text-white px-6 py-2 rounded-full text-sm">
            Sign Up
          </Link>
        </div>

        <Image src="/logo2.png" width={100} height={100} alt="Revive Logo" className="mb-4" />

        <h1 className="text-3xl font-semibold text-[#253612] mb-1">Welcome Back</h1>
        <p className="text-gray-600 mb-6">Login to your account</p>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {/* Login Mode Switch */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setMode("email")}
            className={`px-4 py-2 rounded-full border text-sm ${
              mode === "email"
                ? "bg-[#253612] text-white"
                : "border-[#253612] text-[#253612]"
            }`}
          >
            Email Login
          </button>

          <button
            onClick={() => setMode("phone")}
            className={`px-4 py-2 rounded-full border text-sm ${
              mode === "phone"
                ? "bg-[#253612] text-white"
                : "border-[#253612] text-[#253612]"
            }`}
          >
            Phone Login
          </button>
        </div>

        {/* Email Login */}
        {mode === "email" && (
          <>
            <div className="mb-5">
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-[#253612]" size={20} />
                <label className="absolute left-12 top-2 text-xs">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full border rounded-xl pl-12 pr-4 pt-6 pb-2"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-[#253612]" size={20} />
                <label className="absolute left-12 top-2 text-xs">Password</label>
                <input
                  type={showPass ? "text" : "password"}
                  className="w-full border rounded-xl pl-12 pr-10 pt-6 pb-2"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-3.5"
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button onClick={loginEmail} className="w-full bg-[#253612] text-white py-3 rounded-2xl">
              Log In
            </button>
          </>
        )}

        {/* Phone Login */}
        {mode === "phone" && (
          <>
            <div className="mb-5">
              <label className="text-xs block mb-1">Mobile Number</label>
              <div className="flex items-center border rounded-xl px-4 py-3">
                <span className="font-medium pr-3">+91</span>
                <input
                  type="text"
                  maxLength={10}
                  className="w-full outline-none"
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                />
              </div>
            </div>

            {!otpSent && (
              <button onClick={sendOtp} className="w-full bg-[#253612] text-white py-3 rounded-2xl mb-6">
                Send OTP
              </button>
            )}

            {otpSent && (
              <>
                <div className="mb-5">
                  <label className="text-xs mb-1">Enter OTP</label>
                  <input
                    maxLength={6}
                    className="w-full border rounded-xl px-4 py-3"
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  />
                </div>

                <button onClick={loginWithOtp} className="w-full bg-[#253612] text-white py-3 rounded-2xl">
                  Verify & Login
                </button>
              </>
            )}
          </>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="h-px w-full bg-gray-300"></div>
          <span className="text-gray-500 text-sm">or</span>
          <div className="h-px w-full bg-gray-300"></div>
        </div>

        {/* Google Login */}
        <button
          onClick={googleLogin}
          className="w-full border py-3 rounded-2xl text-[#253612]"
        >
          Continue with Google
        </button>

        <p className="text-center mt-6 text-sm text-gray-700">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-[#253612] underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
