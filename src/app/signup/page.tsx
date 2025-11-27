"use client";

import { useState } from "react";
import { Mail, Lock, Home, LogIn, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  auth,
  googleProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "@/lib/firebase";

import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  type ConfirmationResult,
} from "firebase/auth";

export default function SignupPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"email" | "phone">("email");

  // Email signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Phone signup
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  // Alerts
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

  // ------------------------------
  // EMAIL SIGNUP
  // ------------------------------
  const signupEmail = async () => {
    if (!email || !password || !confirm)
      return notify("Please fill all fields.", true);

    if (password !== confirm)
      return notify("Passwords do not match.", true);

    try {
      await createUserWithEmailAndPassword(auth!, email, password);
      notify("Account created successfully!", false);
      setTimeout(() => router.push("/dashboard"), 800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Signup failed.";
      notify(msg, true);
    }
  };

  // ------------------------------
  // GOOGLE SIGNUP
  // ------------------------------
  const googleSignup = async () => {
    try {
      await signInWithPopup(auth!, googleProvider);
      router.push("/dashboard");
    } catch {
      notify("Google signup failed.", true);
    }
  };

  // ------------------------------
  // PHONE OTP SIGNUP
  // ------------------------------
  const setupRecaptcha = () =>
    new RecaptchaVerifier(auth!, "recaptcha-container", {
      size: "invisible",
    });

  const sendOtp = async () => {
    if (phone.length !== 10)
      return notify("Enter a valid 10-digit phone number.", true);

    try {
      const verifier = setupRecaptcha();
      const result = await signInWithPhoneNumber(auth!, "+91" + phone, verifier);
      setConfirmationResult(result);
      setOtpSent(true);
      notify("OTP sent successfully!", false);
    } catch {
      notify("OTP sending failed.", true);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return notify("Enter OTP.", true);

    try {
      await confirmationResult?.confirm(otp);
      notify("Account created!", false);
      setTimeout(() => router.push("/dashboard"), 700);
    } catch {
      notify("Invalid OTP.", true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F7F2] px-4">
      <div id="recaptcha-container"></div>

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
        
        {/* LOGO */}
        <img
          src="/logo2.png"
          alt="Revive Logo"
          className="h-14 mb-4 cursor-pointer object-contain"
          onClick={() => router.push("/")}
        />

        {/* ------------ NAV BUTTONS ------------- */}
        <div className="flex justify-between mb-6">
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 flex items-center gap-2 rounded-full border 
            text-[#253612] hover:bg-[#eef3eb] transition"
          >
            <Home size={16} /> Home
          </button>

          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 flex items-center gap-2 rounded-full border 
            text-[#253612] hover:bg-[#eef3eb] transition"
          >
            <LogIn size={16} /> Log In
          </button>
        </div>

        {/* ------------ TITLE ------------- */}
        <h1 className="text-3xl font-semibold text-[#253612] mb-1">
          Create Account
        </h1>
        <p className="text-gray-500 mb-6">
          Become a part of a better future
        </p>

        {/* Alerts */}
        {error && <p className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4">{error}</p>}
        {success && <p className="bg-green-100 text-green-700 px-3 py-2 rounded mb-4">{success}</p>}

        {/* Mode switch */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setMode("email")}
            className={`px-4 py-2 rounded-full border ${
              mode === "email"
                ? "bg-[#253612] text-white"
                : "bg-white text-[#253612]"
            }`}
          >
            Email
          </button>

          <button
            onClick={() => setMode("phone")}
            className={`px-4 py-2 rounded-full border ${
              mode === "phone"
                ? "bg-[#253612] text-white"
                : "bg-white text-[#253612]"
            }`}
          >
            Phone
          </button>
        </div>

        {/* ---------------- EMAIL SIGNUP --------------- */}
        {mode === "email" && (
          <div className="space-y-5">

            {/* Email */}
            <div className="revive-input-group">
              <Mail />
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="revive-input-group relative">
              <Lock />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="revive-input-group relative">
              <Lock />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                onChange={(e) => setConfirm(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Create Account */}
            <button
              onClick={signupEmail}
              className="w-full py-3 rounded-xl bg-[#253612] text-white font-semibold hover:bg-[#1c2a0e] transition"
            >
              Create Account
            </button>
          </div>
        )}

        {/* ---------------- PHONE SIGNUP --------------- */}
        {mode === "phone" && (
          <div className="space-y-5">
            {/* Phone Number */}
            <label className="text-xs text-gray-500 mb-1 block">
              Mobile Number (India)
            </label>

            <div className="flex items-center border rounded-xl bg-gray-50 overflow-hidden">
              <span className="px-4 py-3 bg-[#F0F4EF] text-[#253612] font-semibold border-r">
                +91
              </span>

              <input
                maxLength={10}
                placeholder="10-digit phone number"
                className="w-full px-4 py-3 bg-gray-50 outline-none"
                onChange={(e) =>
                  setPhone(e.target.value.replace(/[^0-9]/g, ""))
                }
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
                  className="w-full py-3 rounded-xl bg-[#253612] text-white 
                  font-semibold hover:bg-[#1c2a0e]"
                >
                  Verify & Create Account
                </button>
              </>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 my-8">
          <div className="h-px w-full bg-gray-300"></div>
          <span className="text-gray-500">or</span>
          <div className="h-px w-full bg-gray-300"></div>
        </div>

        {/* Google Button */}
        <button
          onClick={googleSignup}
          className="w-full mt-4 border border-gray-300 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.61 30.47 0 24 0 14.63 0 6.51 5.42 2.56 13.32l7.98 6.19C12.53 13.52 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.08 24.55c0-1.6-.15-3.14-.39-4.55H24v9.02h12.68c-.55 2.82-2.25 5.21-4.77 6.85l7.63 5.93C43.86 37.71 46.08 31.64 46.08 24.55z" />
            <path fill="#FBBC05" d="M10.54 28.51c-.48-1.4-.75-2.9-.75-4.51s.27-3.11.75-4.51l-7.98-6.19C.94 16.74 0 20.25 0 24s.94 7.26 2.56 10.7l7.98-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.79l-7.63-5.93c-2.11 1.42-4.83 2.27-8.27 2.27-6.26 0-11.47-4.03-13.46-9.61l-7.98 6.19C6.51 42.58 14.63 48 24 48z" />
          </svg>

          <span className="text-[#253612] font-medium">
            Continue with Google
          </span>
        </button>

        <p className="text-center mt-6 text-gray-500">
          Already have an account?{" "}
          <span
            className="text-[#253612] underline cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
}
