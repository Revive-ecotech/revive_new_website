"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function PickupSuccessPage() {
  const router = useRouter();

  // Clear form data after success
  useEffect(() => {
    localStorage.removeItem("pickup-data");
  }, []);

  return (
    <main className="min-h-screen bg-[#F2F7F2] pb-20">

      {/* HEADER */}
      <header className="w-full py-5 px-10 flex items-center justify-between border-b border-[#DDECE2] bg-white shadow-sm">
        <Image src="/logo.png" width={160} height={80} alt="Revive Logo" />

        <button
          onClick={() => router.push("/dashboard")}
          className="text-[#0A4A31] font-semibold hover:underline"
        >
          Dashboard
        </button>
      </header>

      {/* SUCCESS CARD */}
      <section className="max-w-2xl mx-auto mt-16 bg-white p-12 rounded-3xl shadow-xl border border-[#DDECE2] text-center">

        {/* ICON */}
        <div className="flex justify-center mb-6">
          <CheckCircle2 size={70} className="text-[#1A7548]" />
        </div>

        <h1 className="text-5xl font-extrabold text-[#0A4A31]">
          Pickup Scheduled!
        </h1>

        <p className="text-[#517264] text-lg mt-4 leading-relaxed">
          Your request has been successfully submitted.  
          You&apos;ll receive a confirmation email shortly with the pickup details.
        </p>

        {/* MESSAGE CARD */}
        <div className="mt-10 bg-[#EAF3ED] p-6 rounded-2xl border border-[#DDECE2]">
          <p className="text-[#0A4A31] font-semibold text-lg">
            Thank you for choosing Revive to recycle responsibly!
          </p>
        </div>

        {/* SINGLE ACTION BUTTON (NO VIEW REQUESTS BUTTON) */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-8 py-4 bg-[#1A7548] text-white text-lg font-bold rounded-xl shadow-md 
                       hover:bg-[#155E3A] transition flex items-center justify-center gap-2"
          >
            Go to Dashboard <ArrowRight size={18} />
          </button>
        </div>
      </section>

    </main>
  );
}
