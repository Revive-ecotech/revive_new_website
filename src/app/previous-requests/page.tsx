"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Clock, Home } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

// Strong typing for each request entry
interface PreviousEntry {
  address: string;
  date: string;
  time: string;
  items: string[];
}

export default function PreviousRequestsPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Avatar fallback
  const profilePhoto =
    user?.photoURL && user.photoURL.trim() !== ""
      ? user.photoURL
      : "/default-avatar.png";

  const [previous, setPrevious] = useState<PreviousEntry[]>([]);

  // Load previous requests safely (client only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("previous-requests");
      if (stored) {
        setPrevious(JSON.parse(stored));
      }
    } catch {
      setPrevious([]);
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#F2F7F2] p-10 md:p-14">

      {/* ---------------- Top Right Profile Button ---------------- */}
      <div className="flex justify-end mb-8">
        <Image
          src={profilePhoto}
          width={48}
          height={48}
          alt="Profile"
          onClick={() => router.push("/dashboard/profile")}
          className="cursor-pointer rounded-xl border-2 border-[#1A7548] 
                     shadow-md hover:scale-105 transition"
        />
      </div>

      {/* ---------------- Header + Dashboard Button ---------------- */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-extrabold text-[#0A4A31] flex items-center gap-3">
          <Clock className="text-[#1A7548]" size={36} />
          Previous Requests
        </h1>

        <button
          onClick={() => router.push("/dashboard")}
          className="px-5 py-2 bg-[#1A7548] text-white rounded-xl font-semibold 
                     flex items-center gap-2 hover:bg-[#155E3A] transition shadow-md"
        >
          <Home size={18} /> Dashboard
        </button>
      </div>

      <p className="text-[#517264] mt-2">Check your past bookings</p>

      {/* ---------------- Request List Container ---------------- */}
      <div className="mt-10 bg-white rounded-3xl shadow-xl p-8 border border-[#DDECE2]">

        {previous.length === 0 ? (
          <p className="text-gray-500">No previous requests found.</p>
        ) : (
          <div className="space-y-6">
            {previous.map((req, index) => (
              <div
                key={index}
                className="p-5 border rounded-xl bg-[#F9FCF9] shadow-sm"
              >
                <p>
                  <strong>📍 Address:</strong> {req.address}
                </p>
                <p>
                  <strong>📅 Date:</strong> {req.date}
                </p>
                <p>
                  <strong>⏰ Time:</strong> {req.time}
                </p>
                <p>
                  <strong>♻ Items:</strong> {req.items.join(", ")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
