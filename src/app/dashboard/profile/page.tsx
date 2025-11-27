"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";
import { saveUserProfile, getUserProfile } from "@/lib/firebase";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load Firestore data
  useEffect(() => {
    if (!user?.uid) return;

    (async () => {
      const profile = await getUserProfile(user.uid);

      setUsername(profile?.username || "");
      setEmail(profile?.email || user.email || "");
      setPhone(profile?.phone || user.phoneNumber || "");
    })();
  }, [user]);

  // Save Profile Data
  const handleSave = async () => {
    if (!user?.uid) return;

    setLoading(true);

    try {
      await saveUserProfile(user.uid, {
        username,
        email,
        phone,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("Failed to update profile.");
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#F2F7F2] flex justify-center p-6 md:p-10">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-[#DDECE2] p-8 md:p-10">

        {/* Dashboard Button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="absolute top-6 right-6 px-5 py-2 bg-[#1A7548] text-white font-semibold 
            rounded-xl shadow-md hover:bg-[#155E3A] transition flex items-center gap-2"
        >
          <Home size={18} /> Dashboard
        </button>

        <h1 className="text-4xl font-extrabold text-[#0A4A31]">Profile</h1>
        <p className="text-[#517264] mb-8">Manage your account details</p>

        {/* FORM */}
        <div className="space-y-6">

          {/* USERNAME */}
          <div>
            <label className="block text-sm font-bold text-[#0A4A31] mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border rounded-xl 
              focus:ring-2 focus:ring-[#1A7548] outline-none"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-bold text-[#0A4A31] mb-1">
              Email
            </label>
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border rounded-xl 
              focus:ring-2 focus:ring-[#1A7548] outline-none"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-sm font-bold text-[#0A4A31] mb-1">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border rounded-xl 
              focus:ring-2 focus:ring-[#1A7548] outline-none"
            />
          </div>

          {/* SAVE BUTTON */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-3 bg-[#1A7548] text-white rounded-xl font-bold
            hover:bg-[#155E3A] transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

          {saved && (
            <p className="text-center text-green-700 font-semibold mt-2">
              ✔ Profile updated successfully!
            </p>
          )}

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-[#1A7548] text-white rounded-xl font-bold
            hover:bg-[#155E3A] transition shadow-md mt-4"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
