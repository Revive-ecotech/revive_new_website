"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

import {
  auth,
  googleProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from "@/lib/firebase";

import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";

// Added global declaration here to ensure it's available. 
interface Window {
  recaptchaVerifier: RecaptchaVerifier;
  confirmationResult: ConfirmationResult; 
}


export default function Signup() {
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

  // ==============================
  // SETUP INVISIBLE RECAPTCHA
  // ==============================
  const setupRecaptcha = () => {
    // FIX: Must check if 'auth' is not null before using it in RecaptchaVerifier
    if (!auth) {
      console.error("Firebase Auth instance is null. Cannot setup Recaptcha.");
      return null;
    }

    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth, // Auth is guaranteed non-null here
        "recaptcha-container",
        { size: "invisible" }
      );
    }
    return window.recaptchaVerifier;
  };

  // ==============================
  // SEND OTP
  // ==============================
  const sendOtp = async () => {
    setError("");

    if (phone.length !== 10) {
      return setError("Enter a valid 10-digit mobile number");
    }

    try {
      if (!auth) return setError("Authentication service not ready."); // Safety check
      
      const fullPhone = "+91" + phone;
      const verifier = setupRecaptcha();

      if (!verifier) return; // Stop if recaptcha failed to set up

      const confirmation = await signInWithPhoneNumber(
        auth,
        fullPhone,
        verifier
      );

      (window as Window).confirmationResult = confirmation;
      setOtpSent(true);

      alert("OTP sent successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("OTP sending failed");
    }
  };

  // ==============================
  // VERIFY OTP → CREATE ACCOUNT
  // ==============================
  const verifyOtpSignup = async () => {
    try {
      if (!otp) return setError("Enter OTP");

      await (window as Window).confirmationResult.confirm(otp);
      alert("Account created successfully!");
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

    if (!email || !password || !confirm) {
      return setError("Please fill all fields");
    }
    if (password !== confirm) {
      return setError("Passwords do not match");
    }
    if (!auth) return setError("Authentication service not ready."); // Safety check

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
    }
  };

  // ==============================
  // GOOGLE SIGNUP
  // ==============================
  const googleSignup = async () => {
    if (!auth) return setError("Authentication service not ready."); // Safety check
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Signed up with Google!");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f9f4] p-6 md:p-10 flex items-center justify-center">

      {/* Required for OTP */}
      <div id="recaptcha-container"></div>

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-sm p-10 border border-[#e4e4e4]">

        {/* TOP BUTTONS */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="bg-[#253612] text-white px-6 py-2 rounded-full text-sm"
          >
            ← Home
          </Link>

          <Link
            href="/login"
            className="bg-[#253612] text-white px-6 py-2 rounded-full text-sm"
          >
            Log In
          </Link>
        </div>

        {/* LOGO */}
        <Image
          src="/logo2.png"
          width={100}
          height={100}
          alt="Revive Logo"
          className="mb-4"
        />

        <h1 className="text-3xl font-semibold text-[#253612] mb-1">
          Create Account
        </h1>
        <p className="text-gray-600 mb-6">Become a part of better future</p>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {/* SWITCH MODE */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setMode("email")}
            className={`px-4 py-2 rounded-full border text-sm ${
              mode === "email"
                ? "bg-[#253612] text-white"
                : "border-[#253612] text-[#253612]"
            }`}
          >
            Email
          </button>

          <button
            onClick={() => setMode("phone")}
            className={`px-4 py-2 rounded-full border text-sm ${
              mode === "phone"
                ? "bg-[#253612] text-white"
                : "border-[#253612] text-[#253612]"
            }`}
          >
            Phone
          </button>
        </div>

        {/* ========================== EMAIL SIGNUP ========================== */}
        {mode === "email" && (
          <>
            {/* EMAIL */}
            <div className="mb-5">
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-[#253612]" size={20} />

                <label className="absolute left-12 top-2 text-xs text-[#253612]">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full border border-[#dcdcdc] rounded-xl pl-12 pr-4 pt-6 pb-2 text-[#1a1a1a]"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="mb-5">
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-[#253612]" size={20} />

                <label className="absolute left-12 top-2 text-xs text-[#253612]">
                  Password
                </label>

                <input
                  type={showPass ? "text" : "password"}
                  placeholder="********"
                  className="w-full border border-[#dcdcdc] rounded-xl pl-12 pr-12 pt-6 pb-2 text-[#1a1a1a]"
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

            {/* CONFIRM PASSWORD */}
            <div className="mb-8">
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-[#253612]" size={20} />

                <label className="absolute left-12 top-2 text-xs text-[#253612]">
                  Confirm Password
                </label>

                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="********"
                  className="w-full border border-[#dcdcdc] rounded-xl pl-12 pr-12 pt-6 pb-2 text-[#1a1a1a]"
                  onChange={(e) => setConfirm(e.target.value)}
                />

                <button
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-3.5"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* SIGNUP BUTTON */}
            <button
              onClick={onEmailSignup}
              className="w-full bg-[#253612] text-white py-3 rounded-2xl text-sm"
            >
              Create Account
            </button>
          </>
        )}

        {/* ========================== PHONE SIGNUP ========================== */}
        {mode === "phone" && (
          <>
            {/* PHONE FIELD */}
            <div className="mb-5">
              <label className="text-xs text-[#253612] block mb-1">
                Mobile Number
              </label>

              <div className="flex items-center border border-[#dcdcdc] rounded-xl px-4 py-3">
                <span className="text-[#253612] font-medium pr-3">+91</span>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="10-digit number"
                  className="w-full outline-none text-[#1a1a1a]"
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, ""))
                  }
                />
              </div>
            </div>

            {/* SEND OTP */}
            {!otpSent && (
              <button
                onClick={sendOtp}
                className="w-full bg-[#253612] text-white py-3 rounded-2xl text-sm mb-6"
              >
                Send OTP
              </button>
            )}

            {/* OTP FIELD */}
            {otpSent && (
              <>
                <div className="mb-6">
                  <label className="text-xs text-[#253612] block mb-1">
                    Enter OTP
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter OTP"
                    className="w-full border border-[#dcdcdc] rounded-xl px-4 py-3 text-[#1a1a1a]"
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, ""))
                    }
                  />
                </div>

                {/* VERIFY OTP */}
                <button
                  onClick={verifyOtpSignup}
                  className="w-full bg-[#253612] text-white py-3 rounded-2xl text-sm"
                >
                  Verify & Create Account
                </button>
              </>
            )}
          </>
        )}

        {/* OR SEPARATOR */}
        <div className="flex items-center gap-3 my-6">
          <div className="h-px w-full bg-gray-300"></div>
          <span className="text-gray-500 text-sm">or</span>
          <div className="h-px w-full bg-gray-300"></div>
        </div>

        {/* GOOGLE SIGNUP */}
        <button
          onClick={googleSignup}
          className="w-full border border-[#dcdcdc] py-3 rounded-2xl text-sm text-[#253612]"
        >
          Continue with Google
        </button>

        {/* SWITCH */}
        <p className="text-center mt-6 text-sm text-gray-700">
          Prefer email?{" "}
          <button
            onClick={() => setMode("email")}
            className="text-[#253612] font-medium underline"
          >
            Use Email Instead
          </button>
        </p>
      </div>
    </div>
  );
}
