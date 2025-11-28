"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { useAuth } from "@/app/context/AuthContext";
import { getDB } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  DocumentData,
} from "firebase/firestore";

type AddressType = "Home" | "Office" | "Hostel" | "Custom";

interface AddressFormState {
  addressType: AddressType;
  line1: string;
  fullAddress: string;
}

interface FirestoreAddress {
  addressType?: string;
  line1?: string;
  fullAddress?: string;
}

const ADDRESS_TYPES: AddressType[] = ["Home", "Office", "Hostel", "Custom"];

export default function AddAddressPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const db = getDB();

  const [form, setForm] = useState<AddressFormState>({
    addressType: "Home",
    line1: "",
    fullAddress: "",
  });

  const [saving, setSaving] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(true);

  const addressId = searchParams.get("id");
  const returnTo = searchParams.get("returnTo") ?? "/manage-addresses";

  // -------- LOAD EXISTING --------
  useEffect(() => {
    const loadExisting = async () => {
      if (!user?.uid || !addressId) {
        setLoadingExisting(false);
        return;
      }

      const ref = doc(db, "users", user.uid, "addresses", addressId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const raw = snap.data() as DocumentData;
        const data: FirestoreAddress = {
          addressType: raw.addressType,
          line1: raw.line1,
          fullAddress: raw.fullAddress,
        };

        setForm({
          addressType: (data.addressType as AddressType) ?? "Home",
          line1: data.line1 ?? "",
          fullAddress: data.fullAddress ?? "",
        });
      }

      setLoadingExisting(false);
    };

    loadExisting();
  }, [addressId, db, user]);

  // -------- INPUT HANDLERS --------
  const handleChange =
    (field: keyof AddressFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  // -------- SUBMIT --------
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user?.uid) {
      alert("Please login to save addresses.");
      return;
    }
    if (!form.fullAddress.trim()) {
      alert("Please enter the full address.");
      return;
    }

    setSaving(true);

    if (addressId) {
      // UPDATE
      const ref = doc(db, "users", user.uid, "addresses", addressId);
      await setDoc(
        ref,
        {
          addressType: form.addressType,
          line1: form.line1,
          fullAddress: form.fullAddress,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } else {
      // CREATE
      const colRef = collection(db, "users", user.uid, "addresses");
      await addDoc(colRef, {
        addressType: form.addressType,
        line1: form.line1,
        fullAddress: form.fullAddress,
        createdAt: serverTimestamp(),
      });
    }

    setSaving(false);
    router.push(returnTo);
  };

  // ---------- UI ----------
  if (!user) {
    return (
      <main className="min-h-screen bg-[#F2F7F2] flex items-center justify-center">
        <p className="text-[#517264]">Please login to manage addresses.</p>
      </main>
    );
  }

  if (addressId && loadingExisting) {
    return (
      <main className="min-h-screen bg-[#F2F7F2] flex items-center justify-center">
        <p className="text-[#517264]">Loading address...</p>
      </main>
    );
  }

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
          {addressId ? "Edit Address" : "Add New Address"}
        </h1>

        <div className="w-16" />
      </header>

      <div className="max-w-xl mx-auto mt-8 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl p-8 border space-y-6"
        >
          {/* ADDRESS TYPE SELECTOR */}
          <div>
            <h2 className="text-sm font-semibold text-[#517264] mb-2">
              Address Type
            </h2>

            <div className="flex flex-wrap gap-3">
              {ADDRESS_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, addressType: type }))}
                  className={`px-4 py-2 rounded-xl border text-sm font-semibold ${
                    form.addressType === type
                      ? "bg-[#1A7548] text-white border-[#1A7548]"
                      : "bg-gray-50 text-[#0A4A31] hover:bg-gray-100"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* LINE 1 */}
          <div>
            <label className="block text-sm text-[#517264] mb-1">
              Flat / House, Building, Area (optional)
            </label>
            <input
              type="text"
              value={form.line1}
              onChange={handleChange("line1")}
              placeholder="Type here..."
              className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none 
              focus:ring-2 focus:ring-[#1A7548]"
            />
          </div>

          {/* FULL ADDRESS */}
          <div>
            <label className="block text-sm text-[#517264] mb-1">
              Full Address
            </label>
            <textarea
              value={form.fullAddress}
              onChange={handleChange("fullAddress")}
              placeholder="Street, area, city, pincode"
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none 
              focus:ring-2 focus:ring-[#1A7548]"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#1A7548] text-white font-bold text-lg py-3 rounded-xl hover:bg-[#155E3A] disabled:opacity-70"
          >
            {saving ? "Saving..." : addressId ? "Update Address" : "Save Address"}
          </button>
        </form>
      </div>
    </main>
  );
}
