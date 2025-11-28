"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useAuth } from "@/app/context/AuthContext";
import { getDB } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
  Timestamp,
} from "firebase/firestore";

// ---------- Types ----------
interface HistoryItem {
  id: string;
  pickupDate: string;
  time: string;
  status: string;
  addressDetails: { fullAddress: string };
}

export default function HistoryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const db = getDB();

  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [loading, setLoading] = useState(true);

  const [upcoming, setUpcoming] = useState<HistoryItem[]>([]);
  const [past, setPast] = useState<HistoryItem[]>([]);

  // ---------------------------------------------------
  // 🔥 FETCH PICKUPS ONLY FOR LOGGED-IN USER
  // ---------------------------------------------------
  useEffect(() => {
    if (!user?.uid) return;

    const load = async () => {
      setLoading(true);

      const ref = collection(db, "pickups");

      // Upcoming
      const upcomingQuery = query(
        ref,
        where("userId", "==", user.uid),
        where("status", "in", ["Pending", "Confirmed", "Out-for-Pickup"]),
        orderBy("pickupDate", "desc")
      );

      // Past
      const pastQuery = query(
        ref,
        where("userId", "==", user.uid),
        where("status", "in", ["Completed", "Cancelled"]),
        orderBy("pickupDate", "desc")
      );

      const [upSnap, pastSnap] = await Promise.all([
        getDocs(upcomingQuery),
        getDocs(pastQuery),
      ]);

      // -------- CONVERSION (FULLY TYPED, NO ANY) --------
      const convert = (
        docs: QueryDocumentSnapshot<DocumentData>[]
      ): HistoryItem[] =>
        docs.map((d) => {
          const data = d.data();

          // Convert Firestore Timestamp safely
          let dateStr = "";
          const ts = data.pickupDate as Timestamp | undefined;

          if (ts instanceof Timestamp) {
            dateStr = ts.toDate().toLocaleDateString("en-GB");
          }

          return {
            id: d.id,
            pickupDate: dateStr,
            time: (data.time as string) || "",
            status: (data.status as string) || "",
            addressDetails: {
              fullAddress:
                (data.addressDetails?.fullAddress as string) || "",
            },
          };
        });

      setUpcoming(convert(upSnap.docs));
      setPast(convert(pastSnap.docs));

      setLoading(false);
    };

    load();
  }, [user, db]);

  const activeList = tab === "upcoming" ? upcoming : past;

  return (
    <main className="min-h-screen bg-[#F2F7F2] pb-20">
      {/* -------- HEADER -------- */}
      <div className="w-full bg-white py-4 px-6 shadow-sm border-b border-[#1A7548] flex items-center justify-between">
        <div
          className="relative w-40 h-12 cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          <Image src="/logo2.png" alt="Revive EcoTech" fill className="object-contain" />
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 bg-[#1A7548] px-5 py-2 text-white font-semibold 
          rounded-full shadow hover:bg-[#155E3A] transition"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>
      </div>

      {/* -------- TITLE -------- */}
      <h1 className="text-4xl font-extrabold text-center text-[#0A4A31] mt-10">
        Pickup History
      </h1>

      {/* -------- TABS -------- */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => setTab("upcoming")}
          className={`px-6 py-2 rounded-xl text-lg font-semibold transition ${
            tab === "upcoming"
              ? "bg-[#1A7548] text-white shadow-md"
              : "bg-white text-[#1A7548] border border-[#1A7548]"
          }`}
        >
          Upcoming
        </button>

        <button
          onClick={() => setTab("past")}
          className={`px-6 py-2 rounded-xl text-lg font-semibold transition ${
            tab === "past"
              ? "bg-[#1A7548] text-white shadow-md"
              : "bg-white text-[#1A7548] border border-[#1A7548]"
          }`}
        >
          Past
        </button>
      </div>

      {/* -------- CONTENT -------- */}
      <div className="px-6 mt-8">
        {loading ? (
          <div className="flex flex-col items-center mt-16">
            <div className="w-10 h-10 border-4 border-[#1A7548]/30 border-t-[#1A7548] rounded-full animate-spin mb-4" />
            <p className="text-[#517264] text-lg">Fetching your pickup history...</p>
          </div>
        ) : activeList.length === 0 ? (
          <div className="flex flex-col items-center mt-10">
            <h2 className="text-3xl font-bold text-[#1A7548] mt-4 text-center">
              Oops!
            </h2>
            <p className="text-xl text-[#517264] text-center mt-1">
              No {tab === "upcoming" ? "upcoming pickups" : "past pickups"} found.
            </p>
          </div>
        ) : (
          <div className="space-y-6 pb-10">
            {activeList.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#DDECE2] rounded-2xl shadow px-6 py-5"
              >
                <div className="flex items-center gap-3 text-[#1A7548] mb-2">
                  <Calendar size={20} />
                  <span className="font-bold">{item.pickupDate}</span>
                </div>

                <div className="flex items-center gap-3 text-[#1A7548] mb-2">
                  <Clock size={20} />
                  <span>{item.time}</span>
                </div>

                <div className="flex items-center gap-3 text-[#0A4A31] mb-2">
                  <MapPin size={20} />
                  <span>{item.addressDetails.fullAddress}</span>
                </div>

                <p className="mt-2 text-sm font-semibold text-[#1A7548]">
                  Status: {item.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
