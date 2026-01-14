"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home, LogOut, Save } from "lucide-react";
import { saveUserProfile, getUserProfile } from "@/lib/firebase";

/* Generate random username */
function generateRandomUsername() {
  const adjectives = ["Green", "Eco", "Recycle", "Fresh", "Clean", "Bright"];
  const nouns = ["Leaf", "Earth", "River", "Forest", "Wave", "Planet"];
  const random = Math.floor(Math.random() * 9000) + 1000;

  return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${
    nouns[Math.floor(Math.random() * nouns.length)]
  }${random}`;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  /* Load profile */
  useEffect(() => {
    if (!user?.uid) return;

    (async () => {
      const profile = await getUserProfile(user.uid);

      if (!profile?.username) {
        const newName = generateRandomUsername();
        setUsername(newName);

        await saveUserProfile(user.uid, {
          username: newName,
          email: user.email || "",
          phone: user.phoneNumber || "",
        });
      } else {
        setUsername(profile.username);
      }

      setEmail(profile?.email || user.email || "");
      setPhone(profile?.phone || user.phoneNumber || "");
    })();
  }, [user]);

  /* Save */
  const handleSave = async () => {
    if (!user?.uid) return;
    setLoading(true);

    try {
      await saveUserProfile(user.uid, { username, email, phone });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#F2F7F2] flex justify-center px-4 py-10">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-xl border border-[#DDECE2] p-8 md:p-10">

        {/* Top actions */}
        <div className="absolute top-6 right-6 flex gap-2">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-3 rounded-xl bg-[#1A7548] text-white hover:bg-[#155E3A] transition shadow cursor-pointer"
            aria-label="Dashboard"
          >
            <Home size={20} />
          </button>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-[#0A4A31]">Your Profile</h1>
          <p className="text-[#517264] mt-1">
            Manage your personal information
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">

          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-[#0A4A31] mb-1">
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-[#1A7548] outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-[#0A4A31] mb-1">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-[#1A7548] outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-[#0A4A31] mb-1">
              Phone Number
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-[#1A7548] outline-none"
            />
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1A7548] text-white font-bold shadow hover:bg-[#155E3A] transition disabled:opacity-60 cursor-pointer"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Save Changes"}
          </button>

          {saved && (
            <p className="text-center text-green-700 font-medium">
              ✔ Profile updated successfully
            </p>
          )}

          {/* Divider */}
          <div className="h-px bg-[#E3EFE9] my-6" />

          {/* Logout */}
          <button
  onClick={handleLogout}
  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl 
             bg-white text-[#1A7548] font-bold border-2 border-[#1A7548]
             hover:bg-[#F2F7F2] hover:text-[#0A4A31]
             transition shadow-sm cursor-pointer"
>
  <LogOut size={18} />
  Logout
</button>

        </div>
      </div>
    </div>
  );
}
