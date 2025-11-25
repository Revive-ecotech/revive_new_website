"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

import { auth, googleProvider, RecaptchaVerifier, signInWithPhoneNumber } from "@/lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export default function Login() {
  const [mode, setMode] = useState<"email" | "phone">("email");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  // ------------------------------------------
  // SETUP INVISIBLE RECAPTCHA (NO UI)
  // ------------------------------------------
   const setupRecaptcha = () => {
    if (!auth) {
      setError("Authentication service is not available");
      return null;
    }
  
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,  // Make sure auth is not null
        "recaptcha-container",
        { size: "invisible" }
      );
    }
    return window.recaptchaVerifier;
  };
  // ------------------------------------------
  // SEND OTP
  // ------------------------------------------
  const sendOtp = async () => {
    setError("");

    if (phone.length !== 10) {
      return setError("Enter a valid 10-digit mobile number");
    }

    try {
      const verifier = setupRecaptcha();
      const fullPhone = "+91" + phone;

      const confirmation = await signInWithPhoneNumber(auth, fullPhone, verifier);
      window.confirmationResult = confirmation;

      setOtpSent(true);
      alert("OTP Sent Successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("OTP sending failed");
    }
  };

  // ------------------------------------------
  // VERIFY OTP → LOGIN
  // ------------------------------------------
  const loginWithOtp = async () => {
    try {
      if (!otp) return setError("Enter OTP");

      const result = await window.confirmationResult!.confirm(otp);
      alert("Logged in Successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Invalid OTP");
    }
  };

  // ------------------------------------------
  // EMAIL LOGIN
  // ------------------------------------------
  const loginEmail = async () => {
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login Successful!");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
    }
  };

  // ------------------------------------------
  // GOOGLE LOGIN
  // ------------------------------------------
  const googleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Logged in with Google!");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f9f4] p-6 md:p-10 flex items-center justify-center">

      {/* REQUIRED FOR OTP */}
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
            href="/signup"
            className="bg-[#253612] text-white px-6 py-2 rounded-full text-sm"
          >
            Sign Up
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

        <h1 className="text-3xl font-semibold text-[#253612] mb-1">Welcome Back</h1>
        <p className="text-gray-600 mb-6">Login to your account</p>

        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}

        {/* SWITCH LOGIN TYPE */}
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

        {/* ===================== EMAIL LOGIN ===================== */}
        {mode === "email" && (
          <>
            {/* EMAIL INPUT */}
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
            <div className="mb-6">
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-[#253612]" size={20} />

                <label className="absolute left-12 top-2 text-xs text-[#253612]">
                  Password
                </label>

                <input
                  type={showPass ? "text" : "password"}
                  placeholder="********"
                  className="w-full border border-[#dcdcdc] rounded-xl pl-12 pr-10 pt-6 pb-2 text-[#1a1a1a]"
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

            {/* LOGIN EMAIL BUTTON */}
            <button
              onClick={loginEmail}
              className="w-full bg-[#253612] text-white py-3 rounded-2xl text-sm"
            >
              Log In
            </button>
          </>
        )}

        {/* ===================== PHONE LOGIN ===================== */}
        {mode === "phone" && (
          <>
            {/* PHONE NUMBER */}
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
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
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

            {/* OTP INPUT */}
            {otpSent && (
              <>
                <div className="mb-5">
                  <label className="text-xs text-[#253612] block mb-1">
                    Enter OTP
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter OTP"
                    className="w-full border border-[#dcdcdc] rounded-xl px-4 py-3 text-[#1a1a1a]"
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  />
                </div>

                <button
                  onClick={loginWithOtp}
                  className="w-full bg-[#253612] text-white py-3 rounded-2xl text-sm"
                >
                  Verify & Login
                </button>
              </>
            )}
          </>
        )}

        {/* ===================== OR ===================== */}
        <div className="flex items-center gap-3 my-6">
          <div className="h-px w-full bg-gray-300"></div>
          <span className="text-gray-500 text-sm">or</span>
          <div className="h-px w-full bg-gray-300"></div>
        </div>

        {/* GOOGLE LOGIN */}
        <button
          onClick={googleLogin}
          className="w-full border border-[#dcdcdc] py-3 rounded-2xl text-sm text-[#253612]"
        >
          Continue with Google
        </button>

        {/* SIGNUP LINK */}
        <p className="text-center mt-6 text-sm text-gray-700">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-[#253612] font-medium underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
