"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { List, Home } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { savePickup } from "@/lib/firebase";

// Strong typed structure for summary data
interface PickupData {
  address: string;
  date: string;
  time: string;
  notes?: string;
  items: string[];
}

export default function SummaryPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Safe profile photo
  const profilePhoto =
    user?.photoURL && user.photoURL.trim() !== ""
      ? user.photoURL
      : "/default-avatar.png";

  const [pickupData, setPickupData] = useState<PickupData | null>(null);
  const [saving, setSaving] = useState(false);

  // Load data safely from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("pickup-data");
      if (stored) setPickupData(JSON.parse(stored));
    } catch (err) {
      console.error("Failed to load summary:", err);
      setPickupData(null);
    }
  }, []);

  // 🔥 SAVE TO FIREBASE
  const handleSaveToFirebase = async () => {
    if (!pickupData || !user) return alert("Missing pickup or user data.");

    setSaving(true);

    try {
      await savePickup({
        userId: user.uid,
        address: pickupData.address,
        date: pickupData.date,
        time: pickupData.time,
        items: pickupData.items,
        notes: pickupData.notes || "",
      });

      alert("Pickup request saved successfully!");

      // Optional: clear local storage
      localStorage.removeItem("pickup-data");

      router.push("/dashboard");
    } catch (err) {
      console.error("Error saving pickup:", err);
      alert("Failed to save the pickup.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F2F7F2] p-10 md:p-14">

      {/* Profile Button */}
      <div className="flex justify-end mb-8">
        <Image
          src={profilePhoto}
          alt="Profile"
          width={48}
          height={48}
          onClick={() => router.push("/dashboard/profile")}
          className="cursor-pointer rounded-xl border-2 border-[#1A7548]
                     shadow-md hover:scale-105 transition"
        />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-extrabold text-[#0A4A31] flex items-center gap-3">
          <List className="text-[#1A7548]" size={40} />
          Summary
        </h1>

        <button
          onClick={() => router.push("/dashboard")}
          className="px-5 py-2 bg-[#1A7548] text-white rounded-xl font-semibold
                     flex items-center gap-2 hover:bg-[#155E3A] transition shadow-md"
        >
          <Home size={18} /> Dashboard
        </button>
      </div>

      <p className="text-[#517264] mt-2">
        Review your selected materials
      </p>

      {/* Summary Card */}
      <div className="mt-10 bg-white rounded-3xl shadow-xl p-8 border border-[#DDECE2]">

        {!pickupData ? (
          <p className="text-gray-500">No summary available.</p>
        ) : (
          <>
            <div className="space-y-6 text-[#0A4A31]">

              <p><strong>📍 Address:</strong> {pickupData.address}</p>
              <p><strong>📅 Date:</strong> {pickupData.date}</p>
              <p><strong>⏰ Time:</strong> {pickupData.time}</p>
              <p><strong>♻ Items:</strong> {pickupData.items.join(", ")}</p>

              <p>
                <strong>📝 Notes:</strong>{" "}
                {pickupData.notes && pickupData.notes.trim() !== ""
                  ? pickupData.notes
                  : "No notes added"}
              </p>
            </div>

            {/* 🔥 SAVE BUTTON */}
            <button
              onClick={handleSaveToFirebase}
              disabled={saving}
              className={`w-full mt-8 py-3 rounded-xl font-bold text-white 
              ${saving ? "bg-gray-400" : "bg-[#1A7548] hover:bg-[#155E3A]"}
              transition shadow-lg`}
            >
              {saving ? "Saving..." : "Confirm & Save Pickup"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
