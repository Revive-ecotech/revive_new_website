"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  MapPin,
  Calendar,
  Clock,
  Recycle,
  FileText,
  ArrowLeft,
  Trash2,
} from "lucide-react";

import { useAuth } from "@/app/context/AuthContext";
import { getDB } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  DocumentData,
} from "firebase/firestore";

type Unit = "kg" | "piece";

interface FirestoreItem {
  id: string;
  name: string;
  price: number;
  unit: Unit;
}

interface FirestoreCategory {
  id: string;
  name: string;
  items: FirestoreItem[];
}

interface ScrapSelection {
  category: string;
  subItemId: string;
  subItemName: string;
  unit: Unit;
  rate: number;
  quantity: number;
  estimatedAmount: number;
}

interface PickupPayload {
  userId: string;
  addressDetails: { fullAddress: string };
  pickupDate: string;
  time: string;
  description?: string;
  items: ScrapSelection[];
}

const STORAGE_KEY = "pickup-data";

const TIME_SLOTS = [
  { id: "slot1", label: "9 AM – 12 PM", value: "09:00–12:00" },
  { id: "slot2", label: "12 PM – 3 PM", value: "12:00–15:00" },
  { id: "slot3", label: "3 PM – 6 PM", value: "15:00–18:00" },
  { id: "slot4", label: "6 PM – 9 PM", value: "18:00–21:00" },
];

export default function SchedulePickupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const db = getDB();

  // -------- UI States --------
  const [address, setAddress] = useState(""); // Will be auto-filled only
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState<ScrapSelection[]>([]);
  const [categories, setCategories] = useState<FirestoreCategory[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [activeCategory, setActiveCategory] =
    useState<FirestoreCategory | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // -------------------------------------------------------------
  // 🔥 Fetch categories + items from Firestore
  // -------------------------------------------------------------
  useEffect(() => {
    const load = async () => {
      const categoriesRef = collection(db, "price_list");
      const qCat = query(categoriesRef, orderBy("order", "asc"));
      const catSnap = await getDocs(qCat);

      const finalData: FirestoreCategory[] = [];

      for (const cat of catSnap.docs) {
        const catData = cat.data() as DocumentData;

        const itemsRef = collection(db, "price_list", cat.id, "items");
        const qItems = query(itemsRef, orderBy("order", "asc"));
        const itemSnap = await getDocs(qItems);

        const items: FirestoreItem[] = itemSnap.docs.map((d) => {
          const dData = d.data() as DocumentData;
          return {
            id: d.id,
            name: dData.name,
            price: dData.price,
            unit: dData.unit,
          };
        });

        finalData.push({
          id: cat.id,
          name: catData.name,
          items,
        });
      }

      setCategories(finalData);
    };

    load();
  }, [db]);

  // -------------------------------------------------------------
  // Prefill Address when user selects from ManageAddresses
  // -------------------------------------------------------------
  useEffect(() => {
    const selected = searchParams.get("selectedAddress");
    if (selected) {
      setAddress(selected);
    }
  }, [searchParams]);

  // -------------------------------------------------------------
  // REMOVE ITEM
  // -------------------------------------------------------------
  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // -------------------------------------------------------------
  // SUBMIT
  // -------------------------------------------------------------
  const handleSubmit = () => {
    if (!address || !date || !time || items.length === 0) {
      alert("Please select address, date, time and items.");
      return;
    }

    if (!user?.uid) {
      alert("Login required.");
      return;
    }

    const payload: PickupPayload = {
      userId: user.uid,
      addressDetails: { fullAddress: address },
      pickupDate: date,
      time,
      description: notes,
      items,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    router.push("/schedule-pickup/summary");
  };

  // -------------------------------------------------------------
  // MODAL
  // -------------------------------------------------------------
  const openCategoryModal = (cat: FirestoreCategory) => {
    if (!cat.items.length) return;
    setActiveCategory(cat);
    setSelectedItemId(cat.items[0]?.id || null);
    setQuantity(1);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setActiveCategory(null);
    setSelectedItemId(null);
    setQuantity(1);
  };

  const selectedItem =
    activeCategory?.items.find((i) => i.id === selectedItemId) || null;

  const estimatedAmount = selectedItem ? selectedItem.price * quantity : 0;

  return (
    <main className="min-h-screen bg-[#F2F7F2] pb-24">
      {/* HEADER */}
      <header className="w-full py-6 px-10 flex items-center justify-between border-b bg-white shadow-sm sticky top-0 z-30">
        <div className="cursor-pointer relative w-44 h-12">
          <Image
            src="/logo2.png"
            fill
            alt="Revive Logo"
            className="object-contain"
            onClick={() => router.push("/dashboard")}
          />
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 bg-[#1A7548] text-white px-6 py-2 rounded-full shadow hover:bg-[#155E3A]"
        >
          <ArrowLeft size={18} /> Back
        </button>
      </header>

      {/* TITLE */}
      <div className="text-center mt-12">
        <h1 className="text-5xl font-extrabold text-[#0A4A31]">
          Schedule Pickup
        </h1>
        <p className="text-[#517264] text-lg mt-2">
          Book a pickup in just a few taps
        </p>
      </div>

      {/* FORM BOX */}
      <div className="max-w-2xl bg-white rounded-3xl shadow-xl mx-auto mt-12 p-10 border space-y-10">

        {/* ADDRESS */}
        <section>
          <h2 className="flex items-center gap-3 text-2xl font-bold text-[#0A4A31] mb-3">
            <MapPin className="text-[#1A7548]" /> Pickup Address
          </h2>

          {!address && (
            <div className="flex flex-col gap-3">
              <button
                onClick={() =>
                  router.push("/add-address?returnTo=/schedule-pickup")
                }
                className="px-4 py-3 rounded-xl border border-[#1A7548] text-sm font-semibold text-[#1A7548] bg-white hover:bg-[#EAF3ED]"
              >
                + Create New Address
              </button>

              <button
                onClick={() =>
                  router.push("/manage-addresses?mode=pick&returnTo=/schedule-pickup")
                }
                className="px-4 py-3 rounded-xl border text-sm font-semibold bg-gray-100 hover:bg-gray-200"
              >
                Choose From Saved Addresses
              </button>
            </div>
          )}

          {/* SHOW SELECTED ADDRESS */}
          {address && (
            <div className="mt-4 p-4 border rounded-xl bg-[#EAF3ED]">
              <p className="font-semibold text-[#0A4A31]">{address}</p>

              <button
                className="mt-2 text-xs text-red-600 underline"
                onClick={() => setAddress("")}
              >
                Change Address
              </button>
            </div>
          )}
        </section>

        {/* DATE & TIME */}
        <section>
          <h2 className="flex items-center gap-3 text-2xl font-bold text-[#0A4A31] mb-4">
            <Calendar className="text-[#1A7548]" /> Pickup Date & Time
          </h2>

          <div className="space-y-4">
            {/* Date */}
            <div>
              <label className="block text-sm text-[#517264] mb-1">
                Select pickup date
              </label>
              <div className="flex items-center gap-3 bg-gray-50 border rounded-xl px-4 py-3">
                <Calendar size={20} className="text-gray-500" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-transparent w-full outline-none"
                />
              </div>
            </div>

            {/* Time Slots */}
            <div>
              <label className="block text-sm text-[#517264] mb-2">
                Choose a time slot
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => {
                      setSelectedSlotId(slot.id);
                      setTime(slot.value);
                    }}
                    className={`px-4 py-3 rounded-xl border text-sm font-semibold ${
                      selectedSlotId === slot.id
                        ? "bg-[#1A7548] text-white border-[#1A7548]"
                        : "bg-gray-50 text-[#0A4A31] hover:bg-gray-100"
                    }`}
                  >
                    <Clock size={16} className="inline mr-2" />
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SCRAP ITEMS */}
        <section>
          <h2 className="flex items-center gap-3 text-2xl font-bold text-[#0A4A31] mb-4">
            <Recycle size={26} className="text-[#1A7548]" /> Add Scrap Items
          </h2>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => openCategoryModal(cat)}
                className="px-4 py-2 rounded-xl border text-sm font-semibold bg-gray-100 hover:bg-gray-200"
              >
                {cat.name}
              </button>
            ))}
          </div>

          {items.length > 0 && (
            <div className="border rounded-2xl overflow-hidden mt-4">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F5F8F5]">
                  <tr>
                    <th />
                    <th className="py-2 px-4">Category</th>
                    <th className="py-2 px-4">Item</th>
                    <th className="py-2 px-4">Qty</th>
                    <th className="py-2 px-4">Rate</th>
                    <th className="py-2 px-4">Est.</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="py-2 px-4">
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="p-2 rounded-lg hover:bg-[#E8F6EE]"
                        >
                          <Trash2 size={18} className="text-[#1A7548]" />
                        </button>
                      </td>
                      <td className="py-2 px-4">{item.category}</td>
                      <td className="py-2 px-4">{item.subItemName}</td>
                      <td className="py-2 px-4">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="py-2 px-4">₹{item.rate}</td>
                      <td className="py-2 px-4">₹{item.estimatedAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* NOTES */}
        <section>
          <h2 className="flex items-center gap-3 text-2xl font-bold text-[#0A4A31] mb-3">
            <FileText size={26} className="text-[#1A7548]" /> Additional Notes
          </h2>

          <textarea
            placeholder="Landmark or extra instructions (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-gray-50 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#1A7548]"
            rows={4}
          />
        </section>

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          className="w-full bg-[#1A7548] text-white font-bold text-lg py-4 rounded-xl hover:bg-[#155E3A]"
        >
          Submit Pickup
        </button>
      </div>

      {/* MODAL */}
      {showModal && activeCategory && selectedItem && (
        <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50">
          <div className="w-full max-w-md bg-white rounded-t-3xl p-6">
            <h3 className="text-xl font-bold text-[#0A4A31] mb-4">
              Add item for {activeCategory.name}
            </h3>

            <div className="border rounded-xl mb-4 overflow-hidden">
              {activeCategory.items.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedItemId(sub.id)}
                  className={`w-full text-left px-4 py-3 text-sm ${
                    selectedItemId === sub.id
                      ? "bg-[#EAF3ED] font-semibold"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {sub.name} (₹{sub.price}/{sub.unit})
                </button>
              ))}
            </div>

            {/* Qty */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold">Estimated Amount</span>
                <span className="font-semibold">
                  ≈ ₹{estimatedAmount} ({quantity} {selectedItem.unit})
                </span>
              </div>

              <input
                type="range"
                min={1}
                max={selectedItem.unit === "piece" ? 20 : 100}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full"
              />

              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="mt-2 w-24 border rounded-lg px-2 py-1 text-sm bg-gray-50"
              />
            </div>

            {/* Modal actions */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={closeModal}
                className="flex-1 py-3 border rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setItems((prev) => [
                    ...prev,
                    {
                      category: activeCategory.name,
                      subItemId: selectedItem.id,
                      subItemName: selectedItem.name,
                      unit: selectedItem.unit,
                      rate: selectedItem.price,
                      quantity,
                      estimatedAmount,
                    },
                  ]);
                  closeModal();
                }}
                className="flex-1 py-3 bg-[#1A7548] text-white rounded-xl font-bold hover:bg-[#155E3A]"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
