"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, Phone, ArrowLeft } from "lucide-react";

export default function HelpSupportPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F2F7F2] to-[#E8F1EA] pb-20 flex flex-col">
      
      {/* -------- TOP BAR -------- */}
      <header className="w-full bg-white px-6 py-4 shadow-sm flex justify-between items-center border-b border-[#DDECE2]">
        
        {/* Logo */}
        <Image
          src="/logo2.png"
          alt="Revive"
          width={130}
          height={50}
          className="cursor-pointer"
          onClick={() => router.push("/dashboard")}
        />

        {/* Back Button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 bg-[#1A7548] text-white px-5 py-2 rounded-full shadow hover:bg-[#155E3A] transition font-semibold"
        >
          <ArrowLeft size={18} /> Back
        </button>
      </header>

      {/* -------- HEADING -------- */}
      <section className="text-center mt-14 px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-[#0A4A31]">
          Help & Support
        </h1>
        <p className="text-[#517264] mt-3 text-lg max-w-xl mx-auto">
          We’re here to help you with any questions or assistance you need
        </p>
      </section>

      {/* -------- CONTACT CARD -------- */}
      <section className="flex justify-center mt-12 px-6">
        <div className="w-full max-w-3xl bg-white p-10 rounded-3xl shadow-md border border-[#DDECE2] relative">

          <h2 className="text-2xl font-semibold text-[#0A4A31] mb-6">
            Contact Us
          </h2>

          <p className="text-[#517264] mb-8 leading-relaxed">
            Reach out to us anytime and our team will be happy to assist you.
          </p>

          {/* Email */}
          <div className="flex items-center gap-5 mb-8 group">
            <div className="w-12 h-12 rounded-full bg-[#E6F2EC] flex items-center justify-center group-hover:bg-[#1A7548] transition">
              <Mail size={22} className="text-[#1A7548] group-hover:text-white transition" />
            </div>
            <div>
              <p className="text-sm text-[#6B7C73]">Email</p>
              <p className="text-[#0A4A31] text-lg font-semibold">
                reviveecotech@gmail.com
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-5 group">
            <div className="w-12 h-12 rounded-full bg-[#E6F2EC] flex items-center justify-center group-hover:bg-[#1A7548] transition">
              <Phone size={22} className="text-[#1A7548] group-hover:text-white transition" />
            </div>
            <div>
              <p className="text-sm text-[#6B7C73]">Phone</p>
              <p className="text-[#0A4A31] text-lg font-semibold">
                6304218355
              </p>
            </div>
          </div>

          {/* Hover Ring */}
          <div className="absolute inset-0 rounded-3xl ring-0 hover:ring-2 ring-[#1A7548]/20 transition"></div>
        </div>
      </section>

      {/* -------- FOOTER -------- */}
      <footer className="w-full flex justify-center mt-auto pt-16 px-4">
        <div className="w-full max-w-6xl bg-[#2F5E3A] rounded-full py-5 shadow-lg flex justify-center">
          <p className="text-white text-sm font-medium tracking-wide">
            © {new Date().getFullYear()} Revive Ecotech Ltd
          </p>
        </div>
      </footer>
    </main>
  );
}
