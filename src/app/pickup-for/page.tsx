"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Users, User } from "lucide-react";

export default function PickupForPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F2F7F2] to-[#E8F1EA] flex flex-col">
      
      {/* HEADER */}
      <header className="w-full bg-white px-6 py-4 shadow-sm flex justify-between items-center border-b border-[#DDECE2]">
        <Image
          src="/logo2.png"
          alt="Revive"
          width={140}
          height={50}
          className="cursor-pointer"
          onClick={() => router.push("/dashboard")}
        />

        <button
          onClick={() => router.back()}
          className="px-5 py-2 bg-[#1A7548] text-white rounded-full hover:bg-[#155E3A] transition shadow"
        >
          ← Back
        </button>
      </header>

      {/* CONTENT */}
      <section className="flex-grow flex flex-col items-center justify-center px-6">
        
        {/* TITLE */}
        <h1 className="text-4xl md:text-5xl font-bold text-[#0A4A31] mb-3">
          Pickup For?
        </h1>
        <p className="text-[#517264] mb-12 text-lg text-center max-w-md">
          Choose who this pickup is for and continue booking in just a few steps
        </p>

        {/* OPTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          
          {/* PERSONAL */}
          <div
            onClick={() => router.push("/schedule-pickup")}
            className="group cursor-pointer bg-white border border-[#DDECE2] rounded-3xl p-10 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center relative"
          >
            {/* ICON */}
            <div className="w-16 h-16 mx-auto rounded-full bg-[#E6F2EC] flex items-center justify-center group-hover:bg-[#1A7548] transition">
              <User
                size={30}
                className="text-[#1A7548] group-hover:text-white transition"
              />
            </div>

            <h2 className="text-2xl font-semibold text-[#0A4A31] mt-6">
              Personal
            </h2>
            <p className="text-[#517264] mt-3 text-sm leading-relaxed">
              Pickup for your home or individual recyclable waste
            </p>

            {/* HOVER RING */}
            <div className="absolute inset-0 rounded-3xl ring-0 group-hover:ring-2 ring-[#1A7548]/30 transition"></div>
          </div>

          {/* COMMUNITY */}
          <div
            onClick={() => router.push("/schedule-pickup")}
            className="group cursor-pointer bg-white border border-[#DDECE2] rounded-3xl p-10 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center relative"
          >
            {/* ICON */}
            <div className="w-16 h-16 mx-auto rounded-full bg-[#E6F2EC] flex items-center justify-center group-hover:bg-[#1A7548] transition">
              <Users
                size={30}
                className="text-[#1A7548] group-hover:text-white transition"
              />
            </div>

            <h2 className="text-2xl font-semibold text-[#0A4A31] mt-6">
              Community
            </h2>
            <p className="text-[#517264] mt-3 text-sm leading-relaxed">
              Pickup for apartments, societies or community groups
            </p>

            {/* HOVER RING */}
            <div className="absolute inset-0 rounded-3xl ring-0 group-hover:ring-2 ring-[#1A7548]/30 transition"></div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full flex justify-center pb-6 px-4">
        <div className="w-full max-w-6xl bg-[#2F5E3A] rounded-full py-5 shadow-lg flex justify-center">
          <p className="text-white text-sm font-medium tracking-wide">
            © {new Date().getFullYear()} Revive Ecotech Ltd
          </p>
        </div>
      </footer>
    </main>
  );
}
