"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Home, Building2, School, MapPin, Plus, ArrowLeft } from "lucide-react";

import { useAuth } from "@/app/context/AuthContext";
import { getDB } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  DocumentData,
} from "firebase/firestore";

// -------- Types --------
interface Address {
  id: string;
  addressType: string;
  line1: string;
  fullAddress: string;
}

export default function ManageAddressesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const db = getDB();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  // detect if user is selecting an address
  const mode = searchParams.get("mode") ?? "manage";
  const returnTo = searchParams.get("returnTo") ?? "/dashboard";

  // ---------------- LOAD ADDRESSES ----------------
  useEffect(() => {
    if (!user?.uid) return;

    const ref = collection(db, "users", user.uid, "addresses");
    const qRef = query(ref, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(
      qRef,
      (snap) => {
        const rows: Address[] = snap.docs.map((d) => {
          const raw = d.data() as DocumentData;

          return {
            id: d.id,
            addressType: (raw.addressType as string) ?? "Address",
            line1: (raw.line1 as string) ?? "",
            fullAddress: (raw.fullAddress as string) ?? "",
          };
        });

        setAddresses(rows);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsub();
  }, [db, user]);

  // ---------------- DELETE ADDRESS ----------------
  const handleDelete = async (id: string) => {
    if (!user?.uid) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );
    if (!confirmed) return;

    await deleteDoc(doc(db, "users", user.uid, "addresses", id));
  };

  // ---------------- SELECT ADDRESS IN PICK MODE ----------------
  const handleSelectAddress = (addr: Address) => {
    if (mode === "pick") {
      router.push(
        `${returnTo}?selectedAddress=${encodeURIComponent(
          addr.fullAddress
        )}`
      );
    }
  };

  // ---------------- ICON SELECTOR ----------------
  const iconForType = (type: string) => {
    switch (type) {
      case "Home":
        return <Home className="text-[#1A7548]" size={24} />;
      case "Office":
        return <Building2 className="text-[#1A7548]" size={24} />;
      case "Hostel":
        return <School className="text-[#1A7548]" size={24} />;
      default:
        return <MapPin className="text-[#1A7548]" size={24} />;
    }
  };

  return (
    <main className="min-h-screen bg-[#F2F7F2] pb-10">
      {/* HEADER */}
      <header className="w-full py-6 px-6 flex items-center justify-between border-b bg-white shadow-sm">
        <button
          onClick={() => router.push(returnTo)}
          className="flex items-center gap-2 text-[#1A7548] font-semibold"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1 className="text-xl font-bold text-[#0A4A31]">
          {mode === "pick" ? "Select Address" : "Manage Addresses"}
        </h1>

        <button
          onClick={() =>
            router.push(`/add-address?returnTo=${encodeURIComponent(returnTo)}`)
          }
          className="flex items-center gap-2 bg-[#1A7548] text-white px-4 py-2 rounded-full text-sm"
        >
          <Plus size={16} /> Add New
        </button>
      </header>

      <div className="max-w-2xl mx-auto mt-6 px-4">
        {loading && <p className="text-center text-[#517264]">Loading...</p>}

        {!loading && addresses.length === 0 && (
          <div className="text-center text-[#6B7C73] mt-10">
            <MapPin size={40} className="mx-auto mb-3 text-gray-400" />
            <p>No saved addresses found.</p>
          </div>
        )}

        {!loading && addresses.length > 0 && (
          <div className="space-y-4 mt-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                onClick={() => handleSelectAddress(addr)}
                className={`bg-white rounded-2xl shadow-sm border flex p-4 gap-3 items-start 
                  ${mode === "pick" ? "cursor-pointer hover:bg-[#F3F9F6]" : ""}`}
              >
                <div className="mt-1">{iconForType(addr.addressType)}</div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="font-semibold text-[#0A4A31]">
                        {addr.addressType}
                      </h2>

                      {addr.line1 && (
                        <p className="text-sm text-[#0A4A31]">{addr.line1}</p>
                      )}

                      <p className="text-sm text-[#6B7C73]">
                        {addr.fullAddress}
                      </p>
                    </div>

                    {/* EDIT + DELETE ALWAYS VISIBLE */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/add-address?id=${addr.id}&returnTo=${encodeURIComponent(
                              returnTo
                            )}`
                          );
                        }}
                        className="text-xs px-3 py-1 border rounded-full hover:bg-gray-50"
                      >
                        Edit
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(addr.id);
                        }}
                        className="text-xs px-3 py-1 border border-red-200 text-red-600 rounded-full hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
