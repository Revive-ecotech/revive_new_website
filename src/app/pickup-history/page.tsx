"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Clock, Home } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";

// Type-safe entry
interface HistoryItem {
  date: string;
  address: string;
  items: string[];
}

export default function PickupHistoryPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Avatar fallback logic
  const profilePhoto =
    user?.photoURL && user.photoURL.trim() !== ""
      ? user.photoURL
      : "/default-avatar.png";

  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load from localStorage on client only
  useEffect(() => {
    try {
      const stored = localStorage.getItem("pickup-history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      setHistory([]);
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#F2F7F2] p-10 md:p-14">

      {/* Top Right Profile Image */}
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

      {/* Page Title + Dashboard Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-extrabold text-[#0A4A31] flex items-center gap-3">
          <Clock className="text-[#1A7548]" size={36} />
          Pickup History
        </h1>

        <button
          onClick={() => router.push("/dashboard")}
          className="px-5 py-2 bg-[#1A7548] text-white rounded-xl font-semibold 
                     flex items-center gap-2 hover:bg-[#155E3A] transition shadow-md"
        >
          <Home size={18} /> Dashboard
        </button>
      </div>

      <p className="text-[#517264] mt-2">Completed pickups timeline</p>

      {/* History Card */}
      <div className="mt-10 bg-white rounded-3xl shadow-xl p-8 border border-[#DDECE2]">
        {history.length === 0 ? (
          <p className="text-gray-500">No completed pickups yet.</p>
        ) : (
          <div className="space-y-6">
            {history.map((entry, index) => (
              <div
                key={index}
                className="p-5 border rounded-xl bg-[#F9FCF9] shadow-sm"
              >
                <p>
                  <strong>✔ Completed:</strong> {entry.date}
                </p>
                <p>
                  <strong>📍 Location:</strong> {entry.address}
                </p>
                <p>
                  <strong>♻ Items:</strong> {entry.items.join(", ")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </main>
  );
}
