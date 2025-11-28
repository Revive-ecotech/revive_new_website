"use client";

import Image from "next/image";
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

  // Load user profile from Firestore
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

  // Default fixed profile icon
  const profilePhoto = "/default-green-profile.png";

  return (
    <main className="min-h-screen bg-[#F2F7F2] pb-20">

      {/* ---------- TOP NAV BAR ---------- */}
      <header className="w-full bg-white px-6 py-4 shadow-sm flex justify-between items-center border-b border-[#DDECE2]">
        <Image
          src="/logo2.png"
          alt="Revive"
          width={140}
          height={50}
          className="cursor-pointer"
          onClick={() => router.push("/")}
        />

        <div className="flex items-center gap-4">
          {/* Help & Support */}
          <button
            onClick={() => router.push("/help-support")}
            className="p-2 bg-[#1A7548] hover:bg-[#155E3A] transition rounded-full shadow"
            title="Help & Support"
          >
            <HelpCircle size={22} className="text-white" />
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 bg-[#1A7548] hover:bg-[#155E3A] transition rounded-full shadow"
            title="Logout"
          >
            <Power size={22} className="text-white" />
          </button>

          {/* Circular Profile Icon */}
          <Image
            src={profilePhoto}
            alt="Profile"
            width={45}
            height={45}
            className="rounded-full cursor-pointer hover:scale-105 transition"
            onClick={() => router.push("/dashboard/profile")}
          />
        </div>
      </header>

      {/* ---------- PAGE TITLE ---------- */}
      <div className="px-6 mt-10">
        <h1 className="text-4xl font-extrabold text-[#0A4A31]">Dashboard</h1>

        <p className="text-[#517264] mt-2">
          Welcome,&nbsp;
          <span className="font-semibold text-[#0A4A31]">
            {userProfile?.username || "User"}
          </span>
        </p>
      </div>

      {/* ---------- ACTION CARDS ---------- */}
      <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 px-6">

        {/* Schedule Pickup */}
        <div
          className="cursor-pointer bg-[#1A7548] text-white p-8 rounded-3xl shadow-lg hover:-translate-y-1 hover:shadow-2xl transition"
          onClick={() => router.push("/schedule-pickup")}
        >
          <Package size={40} />
          <h2 className="text-3xl font-bold mt-4">Schedule Pickup</h2>
          <p className="text-white/80 mt-2">Book a pickup for recyclables.</p>
        </div>

        {/* Price List */}
        <div
          className="cursor-pointer bg-white border border-[#DDECE2] p-8 rounded-3xl shadow-lg hover:-translate-y-1 hover:shadow-2xl transition"
          onClick={() => router.push("/price-list")}
        >
          <Tags size={40} className="text-[#1A7548]" />
          <h2 className="text-3xl font-bold text-[#0A4A31] mt-4">Price List</h2>
          <p className="text-[#517264] mt-2">Check current scrap rates.</p>
        </div>

        {/* History */}
        <div
          className="cursor-pointer bg-white border border-[#DDECE2] p-8 rounded-3xl shadow-lg hover:-translate-y-1 hover:shadow-2xl transition"
          onClick={() => router.push("/history")}
        >
          <Clock size={40} className="text-[#1A7548]" />
          <h2 className="text-3xl font-bold text-[#0A4A31] mt-4">History</h2>
          <p className="text-[#517264] mt-2">Your completed & upcoming pickups.</p>
        </div>

        {/* Help & Support */}
        <div
          className="cursor-pointer bg-white border border-[#DDECE2] p-8 rounded-3xl shadow-lg hover:-translate-y-1 hover:shadow-2xl transition"
          onClick={() => router.push("/help-support")}
        >
          <HelpCircle size={40} className="text-[#1A7548]" />
          <h2 className="text-3xl font-bold text-[#0A4A31] mt-4">Help & Support</h2>
          <p className="text-[#517264] mt-2">Get help.</p>
        </div>
      </section>

      {/* ---------- COPYRIGHT BOX ---------- */}
      <footer className="flex flex-col font-sans px-4 sm:px-8 xl:px-10 mx-auto mt-16 mb-8 w-full">
        <div className="flex flex-col bg-[#386641] rounded-2xl md:rounded-[4rem] pt-8 pb-10 md:pt-12 md:pb-14 px-4 sm:px-8 lg:px-16 shadow-inner">
          <p className="text-center text-white text-sm tracking-wide">
            © {new Date().getFullYear()} Revive Ecotech Ltd
          </p>
        </div>
      </footer>

    </main>
  );
}
