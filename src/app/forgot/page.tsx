"use client";

import { useState } from "react";
import { Mail, LogIn, Home } from "lucide-react";
import { useRouter } from "next/navigation";

import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Helper message handler
  const notify = (msg: string, isError = true) => {
    if (isError) setError(msg);
    else setSuccess(msg);

    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 2500);
  };

  const handleReset = async () => {
    setError("");
    setSuccess("");

    if (!email.trim()) return notify("Please enter your email.", true);

    try {
      await sendPasswordResetEmail(auth!, email);
      notify("Password reset link sent to your email!", false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error sending reset link.";
      notify(msg, true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F7F2] flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white shadow-xl border rounded-3xl p-8">

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
            onClick={() => router.push("/login")}
            className="px-4 py-2 flex items-center gap-2 rounded-full border text-[#253612]
                       hover:bg-[#eef3eb] transition"
          >
            <LogIn size={16} /> Log In
          </button>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-semibold text-[#253612] mb-1">
          Forgot Password
        </h1>
        <p className="text-gray-500 mb-6">
          Enter your email to receive a reset link.
        </p>

        {/* Alerts */}
        {error && (
          <p className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4">{error}</p>
        )}
        {success && (
          <p className="bg-green-100 text-green-700 px-3 py-2 rounded mb-4">{success}</p>
        )}

        {/* EMAIL FIELD */}
        <div className="relative mb-6">
          <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full pl-10 pr-4 py-3 rounded-xl border bg-gray-50 
                       focus:ring-2 focus:ring-[#253612]"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* RESET BUTTON */}
        <button
          onClick={handleReset}
          className="w-full py-3 rounded-xl bg-[#253612] text-white font-semibold
                     hover:bg-[#1c2a0e] transition"
        >
          Send Reset Link
        </button>
      </div>
    </div>
  );
}
