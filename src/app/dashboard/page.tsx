"use client";

import Image from "next/image";
import Link from "next/link"; // ✅ REQUIRED
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";


import { Power, Package, Clock, Tags, HelpCircle } from "lucide-react";
import { getUserProfile } from "@/lib/firebase";

interface UserProfile {
  username: string;
  email?: string;
  phone?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!user?.uid) return;

    (async () => {
      const profile = await getUserProfile(user.uid);
      if (profile) {
        setUserProfile({
          username: profile.username || "User",
          email: profile.email || "",
          phone: profile.phone || "",
        });
      }
    })();
  }, [user]);

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const profilePhoto = "/default-green-profile.png";

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F2F7F2] to-[#E8F1EA] flex flex-col">
      
      {/* ---------- PAGE CONTENT ---------- */}
      <div className="flex-grow">
        
        {/* TOP NAV BAR */}
        <header className="w-full bg-white px-6 py-4 shadow-sm flex justify-between items-center border-b border-[#DDECE2] ">
          <Image
            src="/logo2.png"
            alt="Revive"
            width={140}
            height={50}
            className="cursor-pointer"
            onClick={() => router.push("/")}
          />

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/help-support")}
              className="p-2 bg-[#1A7548] hover:bg-[#155E3A] transition rounded-full shadow cursor-pointer"
              title="Help & Support"
            >
              <HelpCircle size={22} className="text-white" />
            </button>

            <button
              onClick={handleLogout}
              className="p-2 bg-[#1A7548] hover:bg-[#155E3A] transition rounded-full shadow cursor-pointer"
              title="Logout"
            >
              <Power size={22} className="text-white" />
            </button>

            <Image
              src={profilePhoto}
              alt="Profile"
              width={45}
              height={45}
              className="rounded-full cursor-pointer hover:scale-105 transition shadow"
              onClick={() => router.push("/dashboard/profile")}
            />
          </div>
        </header>

        {/* PAGE TITLE */}
        <div className="px-6 mt-12">
          <h1 className="text-4xl font-bold text-[#0A4A31]">
            Dashboard
          </h1>
          <p className="text-[#517264] mt-2 text-lg">
            Welcome,&nbsp;
            <span className="font-semibold text-[#0A4A31]">
              {userProfile?.username || "User"}
            </span>
          </p>
        </div>

        {/* ACTION CARDS */}
        <section className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-6">
          
          {/* SCHEDULE PICKUP */}
          <div
            onClick={() => router.push("/pickup-for")}
            className="group cursor-pointer bg-[#1A7548] text-white p-8 rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative"
          >
            <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center">
              <Package size={28} />
            </div>

            <h2 className="text-2xl font-semibold mt-6">
              Schedule Pickup
            </h2>
            <p className="text-white/80 text-sm mt-2">
              Book a pickup for recyclables.
            </p>

            <div className="absolute inset-0 rounded-3xl ring-0 group-hover:ring-2 ring-white/30 transition"></div>
          </div>

          {/* PRICE LIST */}
          <div
            onClick={() => router.push("/price-list")}
            className="group cursor-pointer bg-white border border-[#DDECE2] p-8 rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative"
          >
            <div className="w-14 h-14 rounded-full bg-[#E6F2EC] flex items-center justify-center group-hover:bg-[#1A7548] transition">
              <Tags size={26} className="text-[#1A7548] group-hover:text-white transition" />
            </div>

            <h2 className="text-2xl font-semibold text-[#0A4A31] mt-6">
              Price List
            </h2>
            <p className="text-[#517264] text-sm mt-2">
              Check current scrap rates.
            </p>

            <div className="absolute inset-0 rounded-3xl ring-0 group-hover:ring-2 ring-[#1A7548]/30 transition"></div>
          </div>

          {/* HISTORY */}
          <div
            onClick={() => router.push("/history")}
            className="group cursor-pointer bg-white border border-[#DDECE2] p-8 rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative"
          >
            <div className="w-14 h-14 rounded-full bg-[#E6F2EC] flex items-center justify-center group-hover:bg-[#1A7548] transition">
              <Clock size={26} className="text-[#1A7548] group-hover:text-white transition" />
            </div>

            <h2 className="text-2xl font-semibold text-[#0A4A31] mt-6">
              History
            </h2>
            <p className="text-[#517264] text-sm mt-2">
              Your completed & upcoming pickups.
            </p>

            <div className="absolute inset-0 rounded-3xl ring-0 group-hover:ring-2 ring-[#1A7548]/30 transition"></div>
          </div>

          {/* HELP & SUPPORT */}
          <div
            onClick={() => router.push("/help-support")}
            className="group cursor-pointer bg-white border border-[#DDECE2] p-8 rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative"
          >
            <div className="w-14 h-14 rounded-full bg-[#E6F2EC] flex items-center justify-center group-hover:bg-[#1A7548] transition">
              <HelpCircle size={26} className="text-[#1A7548] group-hover:text-white transition" />
            </div>

            <h2 className="text-2xl font-semibold text-[#0A4A31] mt-6">
              Help & Support
            </h2>
            <p className="text-[#517264] text-sm mt-2">
              Get help.
            </p>

            <div className="absolute inset-0 rounded-3xl ring-0 group-hover:ring-2 ring-[#1A7548]/30 transition"></div>
          </div>
        </section>
      </div>
{/* SOFT SPACING / FADE */}
<div className="h-24 bg-gradient-to-b from-transparent to-[#E8F1EA]" />

{/* ---------- FOOTER ---------- */}
<footer className="w-full px-4 sm:px-6 pb-8">
  <div className="max-w-7xl mx-auto">
    <div className="bg-[#2F5E3A] rounded-3xl px-6 py-6 shadow-lg">

      {/* TOP ROW */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">

        {/* LEFT: LOGO */}
        <div className="flex items-center gap-3">
          <Image
            src="/logo2.png"
            alt="Revive"
            width={110}
            height={40}
            className="object-contain"
          />
        </div>

        {/* RIGHT: LINKS */}
        <div className="flex gap-6 text-sm text-white">
          <Link
            href="/terms"
            className="hover:underline underline-offset-4 transition cursor-pointer"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="hover:underline underline-offset-4 transition cursor-pointer"
          >
            Privacy
          </Link>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="h-px bg-white/20 my-4" />

      {/* BOTTOM */}
      <div className="flex justify-center text-xs text-white/70">
        <p>© {new Date().getFullYear()} Revive Ecotech Ltd</p>
      </div>

    </div>
  </div>
</footer>

    </main>
  );
}
