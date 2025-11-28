"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, Phone } from "lucide-react";

export default function HelpSupportPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#F2F7F2] pb-20">

      {/* -------- TOP BAR -------- */}
      <header className="w-full bg-white px-6 py-4 shadow-sm flex justify-between items-center border-b border-[#DDECE2]">
        {/* Logo */}
        <Image
          src="/logo2.png"
          alt="Revive"
          width={130}
          height={50}
          className="cursor-pointer"
          onClick={() => router.push("/")}
        />

        {/* Back to Dashboard Button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 bg-[#1A7548] text-white px-5 py-2 rounded-full shadow hover:bg-[#155E3A] transition font-semibold"
        >
          ← Back to Dashboard
        </button>
      </header>

      {/* -------- HEADING -------- */}
      <h1 className="text-center text-4xl font-extrabold text-[#0A4A31] mt-10">
        Help & Support
      </h1>

      {/* -------- CONTACT CARD -------- */}
      <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-3xl shadow border border-[#DDECE2]">

        <h2 className="text-2xl font-bold text-[#0A4A31] mb-4">Contact Us</h2>

        <p className="text-[#517264] mb-6 leading-relaxed">
          If you have any questions or need assistance, feel free to reach out to us:
        </p>

        {/* Email */}
        <div className="flex items-center gap-4 mb-6">
          <Mail size={26} className="text-[#1A7548]" />
          <div>
            <p className="text-sm text-[#6B7C73]">Email</p>
            <p className="text-[#0A4A31] text-lg font-semibold">
              reviveecotech@gmail.com
            </p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-4">
          <Phone size={26} className="text-[#1A7548]" />
          <div>
            <p className="text-sm text-[#6B7C73]">Phone</p>
            <p className="text-[#0A4A31] text-lg font-semibold">6304218355</p>
          </div>
        </div>
      </div>

      {/* -------- RECTANGULAR COPYRIGHT BOX (Your Required Style) -------- */}
      <div className="max-w-3xl mx-auto mt-16 bg-[#2F5E3A] rounded-3xl shadow-inner w-full">
        <div className="text-center text-white py-6 text-sm tracking-wide">
          © {new Date().getFullYear()} Revive Ecotech Ltd
        </div>
      </div>
    </main>
  );
}
