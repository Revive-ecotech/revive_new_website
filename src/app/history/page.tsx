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
  // FETCH PICKUPS ONLY FOR LOGGED-IN USER
  // ---------------------------------------------------
  useEffect(() => {
    if (!user?.uid) return;

    const load = async () => {
      setLoading(true);

      const ref = collection(db, "pickups");

      const upcomingQuery = query(
        ref,
        where("userId", "==", user.uid),
        where("status", "in", ["Pending", "Confirmed", "Out-for-Pickup"]),
        orderBy("pickupDate", "desc")
      );

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

      const convert = (
        docs: QueryDocumentSnapshot<DocumentData>[]
      ): HistoryItem[] =>
        docs.map((d) => {
          const data = d.data();
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
    <main className="min-h-screen bg-gradient-to-b from-[#F2F7F2] to-[#E8F1EA] flex flex-col">
      
      {/* ---------- PAGE CONTENT ---------- */}
      <div className="flex-grow">
        
        {/* HEADER */}
        <header className="w-full bg-white py-5 px-8 shadow-sm border-b flex items-center justify-between">
          <div
            className="relative w-40 h-12 cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            <Image
              src="/logo2.png"
              alt="Revive EcoTech"
              fill
              className="object-contain"
            />
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 bg-[#1A7548] px-6 py-2 text-white font-semibold 
            rounded-full shadow hover:bg-[#155E3A] transition"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </header>

        {/* TITLE */}
        <section className="text-center mt-14 px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0A4A31]">
            Pickup History
          </h1>
          <p className="text-[#517264] mt-2 text-lg">
            Track your upcoming and completed pickups
          </p>
        </section>

        {/* TABS */}
        <div className="flex justify-center gap-4 mt-10">
          {(["upcoming", "past"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-8 py-3 rounded-xl text-lg font-semibold transition ${
                tab === key
                  ? "bg-[#1A7548] text-white shadow-lg"
                  : "bg-white text-[#1A7548] border border-[#1A7548] hover:bg-[#EAF3ED]"
              }`}
            >
              {key === "upcoming" ? "Upcoming" : "Past"}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <section className="px-6 mt-10">
          {loading ? (
            <div className="flex flex-col items-center mt-20">
              <div className="w-10 h-10 border-4 border-[#1A7548]/30 border-t-[#1A7548] rounded-full animate-spin mb-4" />
              <p className="text-[#517264] text-lg">
                Fetching your pickup history...
              </p>
            </div>
          ) : activeList.length === 0 ? (
            <div className="flex flex-col items-center mt-14">
              <h2 className="text-3xl font-bold text-[#1A7548]">
                No Records Found
              </h2>
              <p className="text-lg text-[#517264] mt-2 text-center">
                You have no {tab === "upcoming" ? "upcoming pickups" : "past pickups"} yet.
              </p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6 pb-14">
              {activeList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-[#DDECE2] rounded-3xl shadow-md p-6 hover:shadow-xl transition"
                >
                  <div className="flex flex-wrap gap-6 mb-3">
                    <Info icon={<Calendar size={20} />} text={item.pickupDate} />
                    <Info icon={<Clock size={20} />} text={item.time} />
                  </div>

                  <Info
                    icon={<MapPin size={20} />}
                    text={item.addressDetails.fullAddress}
                  />

                  <span className="inline-block mt-4 px-4 py-1 rounded-full text-sm font-semibold bg-[#EAF3ED] text-[#1A7548]">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ---------- FOOTER ---------- */}
      <footer className="w-full flex justify-center py-8 px-4 mt-10">
        <div className="bg-[#2F5E3A] rounded-full px-12 py-4 shadow-lg">
          <p className="text-white text-sm font-medium tracking-wide">
            © {new Date().getFullYear()} Revive Ecotech Ltd
          </p>
        </div>
      </footer>
    </main>
  );
}

/* ---------- SMALL UI HELPER ---------- */
function Info({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 text-[#0A4A31]">
      <span className="text-[#1A7548]">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
