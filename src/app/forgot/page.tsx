// src/app/forgot/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async () => {
    if (!email) {
      setError("Enter your email");
      return;
    }
    if (!auth) { // Add this check
      setError("Authentication service is not available");
      return;
    }
    try {
      setError("");
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
    }
  };


  return (
    <div className="min-h-screen bg-[#f5f9f4] p-6 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-3xl border shadow-sm p-10">
        {/* Top Buttons */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="bg-[#253612] text-white px-6 py-2 rounded-full text-sm hover:bg-[#3b5520]"
          >
            ← Home
          </Link>
          <Link
            href="/login"
            className="bg-[#253612] text-white px-6 py-2 rounded-full text-sm hover:bg-[#3b5520]"
          >
            Log In
          </Link>
        </div>

        <Image
          src="/logo2.png"
          width={100}
          height={100}
          alt="Revive Logo"
          className="mb-4"
        />

        <h1 className="text-3xl font-semibold text-[#253612] mb-1">
          Forgot Password
        </h1>
        <p className="text-gray-600 mb-6">
          Enter your email to receive a password reset link.
        </p>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {sent && (
          <p className="text-green-700 text-sm mb-4">
            Reset link sent! Check your email.
          </p>
        )}

        <div className="relative mb-6">
          <Mail className="absolute left-4 top-3.5 text-[#253612]" size={20} />
          <label className="absolute left-12 top-2 text-xs text-[#253612]">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full border rounded-xl pl-12 pr-4 pt-6 pb-2 text-[#253612]"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          onClick={handleReset}
          className="w-full bg-[#253612] text-white py-3 rounded-2xl text-sm"
        >
          Send Reset Link
        </button>
      </div>
    </div>
  );
}
