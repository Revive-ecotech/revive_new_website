"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, Home, UserPlus } from "lucide-react";
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
  type ConfirmationResult,
} from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"email" | "phone">("email");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const notify = (msg: string, isError = true) => {
    if (isError) setError(msg);
    else setSuccess(msg);

    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 2500);
  };

  useEffect(() => {
    if (!auth) return;

    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.push("/dashboard");
    });

    return () => unsub();
  }, []);

  // ---------------------------
  // EMAIL LOGIN
  // ---------------------------
  const loginEmail = async () => {
    try {
      if (!email || !password)
        return notify("Please enter all fields", true);

      await signInWithEmailAndPassword(auth!, email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Login failed. Try again.";
      notify(msg, true);
    }
  };

  // ---------------------------
  // GOOGLE LOGIN
  // ---------------------------
  const googleLogin = async () => {
    try {
      await signInWithPopup(auth!, googleProvider);
      router.push("/dashboard");
    } catch (err: unknown) {
      notify("Google login failed.", true);
    }
  };

  // ---------------------------
  // PHONE OTP LOGIN
  // ---------------------------
  const sendOtp = async () => {
    if (phone.length !== 10)
      return notify("Enter a valid 10-digit phone number", true);

    try {
      const verifier = new RecaptchaVerifier(auth!, "recaptcha-container", {
        size: "invisible",
      });

      const result = await signInWithPhoneNumber(
        auth!,
        "+91" + phone,
        verifier
      );
      setConfirmationResult(result);
      setOtpSent(true);
      notify("OTP sent!", false);
    } catch (err: unknown) {
      notify("Failed to send OTP", true);
    }
  };

  const verifyOtp = async () => {
    try {
      await confirmationResult?.confirm(otp);
      router.push("/dashboard");
    } catch {
      notify("Invalid OTP", true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F7F2] px-4">
      <div id="recaptcha-container"></div>

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl px-8 py-10 border border-gray-200">

        {/* TOP LEFT LOGO */}
        <img
          src="https://www.revives.in/_next/image?url=%2Flogo2.png&w=256&q=75"
          alt="Revive Logo"
          className="h-14 mb-4 cursor-pointer"
          onClick={() => router.push("/")}
        />

        {/* NAV BUTTONS */}
        <div className="flex justify-between mb-6">
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 flex items-center gap-2 rounded-full border text-[#253612]
                       hover:bg-[#eef3eb] transition"
          >
            <Home size={16} /> Home
          </button>

          <button
            onClick={() => router.push("/signup")}
            className="px-4 py-2 flex items-center gap-2 rounded-full border text-[#253612]
                       hover:bg-[#eef3eb] transition"
          >
            <UserPlus size={16} /> Sign Up
          </button>
        </div>

        <h1 className="text-3xl font-semibold text-[#253612] mb-1">
          Welcome Back
        </h1>

        <p className="text-gray-500 mb-6">
          Log in to your Revive account
        </p>

        {error && (
          <p className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4">
            {error}
          </p>
        )}

        {success && (
          <p className="bg-green-100 text-green-700 px-3 py-2 rounded mb-4">
            {success}
          </p>
        )}

        {/* MODE SWITCH */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setMode("email")}
            className={`px-4 py-2 rounded-full border ${
              mode === "email"
                ? "bg-[#253612] text-white"
                : "bg-white text-[#253612]"
            }`}
          >
            Email Login
          </button>

          <button
            onClick={() => setMode("phone")}
            className={`px-4 py-2 rounded-full border ${
              mode === "phone"
                ? "bg-[#253612] text-white"
                : "bg-white text-[#253612]"
            }`}
          >
            Phone OTP
          </button>
        </div>

        {/* ---------------- EMAIL LOGIN ---------------- */}
        {mode === "email" && (
          <div className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-10 pr-4 py-3 rounded-xl border bg-gray-50 
                           focus:ring-2 focus:ring-[#253612]"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                className="w-full pl-10 pr-12 py-3 rounded-xl border bg-gray-50 
                           focus:ring-2 focus:ring-[#253612]"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-3 text-gray-600"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              onClick={loginEmail}
              className="w-full py-3 rounded-xl bg-[#253612] text-white font-semibold
                         hover:bg-[#1c2a0e] transition"
            >
              Log In
            </button>

            <p
              className="text-sm text-gray-500 underline cursor-pointer"
              onClick={() => router.push("/forgot")}
            >
              Forgot Password?
            </p>
          </div>
        )}

        {/* ---------------- PHONE LOGIN ---------------- */}
        {mode === "phone" && (
          <div className="space-y-5">

            {/* +91 phone field */}
            <div className="flex items-center border border-gray-300 rounded-xl bg-gray-50 overflow-hidden">
              <span className="px-4 py-3 bg-[#F0F4EF] text-[#253612] font-semibold border-r border-gray-300">
                +91
              </span>
              <input
                maxLength={10}
                placeholder="10-digit phone number"
                className="w-full px-4 py-3 bg-gray-50 outline-none"
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
              />
            </div>

            {!otpSent && (
              <button
                onClick={sendOtp}
                className="w-full py-3 rounded-xl bg-[#253612] text-white font-semibold hover:bg-[#1c2a0e]"
              >
                Send OTP
              </button>
            )}

            {otpSent && (
              <>
                <input
                  maxLength={6}
                  placeholder="Enter OTP"
                  className="w-full px-4 py-3 rounded-xl border bg-gray-50 
                             focus:ring-2 focus:ring-[#253612]"
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button
                  onClick={verifyOtp}
                  className="w-full py-3 rounded-xl bg-[#253612] text-white font-semibold
                             hover:bg-[#1c2a0e]"
                >
                  Verify OTP
                </button>
              </>
            )}
          </div>
        )}

        {/* GOOGLE LOGIN */}
        <button
          onClick={googleLogin}
          className="w-full mt-6 border border-gray-300 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.61 30.47 0 24 0 14.63 0 6.51 5.42 2.56 13.32l7.98 6.19C12.53 13.52 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.08 24.55c0-1.6-.15-3.14-.39-4.55H24v9.02h12.68c-.55 2.82-2.25 5.21-4.77 6.85l7.63 5.93C43.86 37.71 46.08 31.64 46.08 24.55z"/>
            <path fill="#FBBC05" d="M10.54 28.51c-.48-1.4-.75-2.9-.75-4.51s.27-3.11.75-4.51l-7.98-6.19C.94 16.74 0 20.25 0 24s.94 7.26 2.56 10.7l7.98-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.79l-7.63-5.93c-2.11 1.42-4.83 2.27-8.27 2.27-6.26 0-11.47-4.03-13.46-9.61l-7.98 6.19C6.51 42.58 14.63 48 24 48z"/>
          </svg>

          <span className="text-[#253612] font-medium">Continue with Google</span>
        </button>

        <p className="text-center mt-6 text-gray-500">
          Don’t have an account?{" "}
          <span
            className="text-[#253612] underline cursor-pointer"
            onClick={() => router.push("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
