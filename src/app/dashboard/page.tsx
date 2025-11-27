"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect } from "react";

import { LogOut, Home, Package, List, Clock, User } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const profilePhoto =
    user?.photoURL && user.photoURL.trim() !== ""
      ? user.photoURL
      : "/default-avatar.png";

  return (
    <div className="min-h-screen flex flex-col bg-[#F2F7F2]">
      <div className="flex flex-1">

        {/* ------------------ SIDEBAR ------------------ */}
        <aside className="hidden md:flex w-72 bg-white border-r border-[#DDECE2] shadow-xl p-6 flex-col fixed h-screen">

          {/* Logo */}
          <div
            className="flex justify-center mb-10 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Image
              src="/logo2.png"
              alt="Revive EcoTech"
              width={150}
              height={150}
              priority
              className="object-contain drop-shadow-md"
            />
          </div>

          {/* Menu */}
          <nav className="flex flex-col gap-3 text-[#0A4A31] font-semibold">

            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#E3F3E8] transition"
            >
              <Home size={20} /> Dashboard
            </button>

            <button
              onClick={() => router.push("/schedule-pickup")}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#E3F3E8] transition"
            >
              <Package size={20} /> Schedule Pickup
            </button>

            <button
              onClick={() => router.push("/summary")}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#E3F3E8] transition"
            >
              <List size={20} /> Summary
            </button>

            <button
              onClick={() => router.push("/previous-requests")}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#E3F3E8] transition"
            >
              <Clock size={20} /> Previous Requests
            </button>

            <button
              onClick={() => router.push("/pickup-history")}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#E3F3E8] transition"
            >
              <Clock size={20} /> Pickup History
            </button>

            <button
              onClick={() => router.push("/dashboard/profile")}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#E3F3E8] transition"
            >
              <User size={20} /> Profile
            </button>
          </nav>

          {/* Logout */}
          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-6 py-3
              bg-[#155E3A] text-white rounded-xl hover:bg-[#0A4A31] transition shadow-lg font-semibold"
            >
              <LogOut size={18} /> Log Out
            </button>
          </div>
        </aside>

        {/* ------------------ MOBILE NAVBAR ------------------ */}
        <div className="md:hidden w-full bg-white p-4 shadow flex justify-between items-center fixed top-0 left-0 z-50">
          <Image
            src="/logo2.png"
            alt="Revive EcoTech"
            width={100}
            height={40}
            className="object-contain"
          />

          <Image
            src={profilePhoto}
            alt="Profile"
            width={40}
            height={40}
            onClick={() => router.push("/dashboard/profile")}
            className="cursor-pointer rounded-xl border border-[#1A7548]"
          />
        </div>

        {/* ------------------ MAIN CONTENT ------------------ */}
        <main className="flex-1 md:ml-72 p-6 md:p-12 mt-20 md:mt-0">

          {/* Top Right (Desktop Only) */}
          <div className="hidden md:flex justify-end items-center gap-4 mb-8">

            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-[#1A7548] text-white rounded-xl font-semibold 
              flex items-center gap-2 hover:bg-[#155E3A] transition shadow-md"
            >
              <Home size={18} /> Home
            </button>

            <Image
              src={profilePhoto}
              alt="Profile"
              width={48}
              height={48}
              onClick={() => router.push("/dashboard/profile")}
              className="cursor-pointer rounded-xl border-2 border-[#1A7548] shadow-md 
              hover:scale-105 transition"
            />
          </div>

          <h1 className="text-4xl font-extrabold text-[#0A4A31] mb-1">
            Dashboard
          </h1>

          <p className="text-[#517264] mb-10">
            Welcome,{" "}
            <span className="font-semibold text-[#0A4A31]">
              {user?.displayName || user?.email || user?.phoneNumber}
            </span>
          </p>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Schedule Pickup */}
            <div
              onClick={() => router.push("/schedule-pickup")}
              className="cursor-pointer bg-[#1A7548] p-8 rounded-3xl shadow-lg hover:shadow-2xl 
              hover:-translate-y-1 transition text-white"
            >
              <Package size={32} />
              <h2 className="text-2xl font-bold mt-4">Schedule Pickup</h2>
              <p className="text-white/80 mt-2">Book a pickup for recyclables.</p>
            </div>

            {/* Summary */}
            <div
              onClick={() => router.push("/summary")}
              className="cursor-pointer bg-white border border-[#DDECE2] p-8 rounded-3xl shadow-lg 
              hover:shadow-2xl hover:-translate-y-1 transition"
            >
              <List size={32} className="text-[#1A7548]" />
              <h2 className="text-2xl font-bold text-[#0A4A31] mt-4">View Summary</h2>
              <p className="text-[#517264] mt-2">Review selected materials.</p>
            </div>

            {/* Previous Requests */}
            <div
              onClick={() => router.push("/previous-requests")}
              className="cursor-pointer bg-white border border-[#DDECE2] p-8 rounded-3xl shadow-lg 
              hover:shadow-2xl hover:-translate-y-1 transition"
            >
              <Clock size={32} className="text-[#1A7548]" />
              <h2 className="text-2xl font-bold text-[#0A4A31] mt-4">Previous Requests</h2>
              <p className="text-[#517264] mt-2">Check your past bookings.</p>
            </div>

            {/* Pickup History */}
            <div
              onClick={() => router.push("/pickup-history")}
              className="cursor-pointer bg-white border border-[#DDECE2] p-8 rounded-3xl shadow-lg 
              hover:shadow-2xl hover:-translate-y-1 transition"
            >
              <Clock size={32} className="text-[#1A7548]" />
              <h2 className="text-2xl font-bold text-[#0A4A31] mt-4">Pickup History</h2>
              <p className="text-[#517264] mt-2">Completed pickups timeline.</p>
            </div>

          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#2F5E3A] text-white py-6 w-full rounded-t-3xl mt-10 shadow-inner">
        <div className="text-center text-sm opacity-90">
          © {new Date().getFullYear()} Revive Ecotech Ltd
        </div>
      </footer>
    </div>
  );
}
