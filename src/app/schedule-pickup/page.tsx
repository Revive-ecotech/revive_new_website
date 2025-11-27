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

// ---------- Types ----------
type Category = "Paper" | "Plastic" | "Glass" | "Metals" | "E-waste";
type Unit = "kg" | "piece";

interface SubItemConfig {
  id: string;
  name: string;
  rate: number;
  unit: Unit;
}

interface ScrapSelection {
  category: Category;
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

// ---------- Scrap Config ----------
const SCRAP_CONFIG: Record<Category, SubItemConfig[]> = {
  Paper: [
    { id: "news", name: "Newspaper", rate: 14, unit: "kg" },
    { id: "books", name: "Books / Magazines", rate: 16, unit: "kg" },
    { id: "cardboard", name: "Cardboard / Gatta", rate: 10, unit: "kg" },
    { id: "a4", name: "A4 Sheets", rate: 12, unit: "kg" },
  ],
  Plastic: [
    { id: "bottles", name: "Bottles", rate: 10, unit: "kg" },
    { id: "tupper", name: "Tupperware", rate: 12, unit: "kg" },
  ],
  Glass: [{ id: "bottles", name: "Bottles", rate: 10, unit: "kg" }],
  Metals: [
    { id: "aluminium", name: "Aluminium", rate: 140, unit: "kg" },
    { id: "copper", name: "Copper", rate: 570, unit: "kg" },
    { id: "iron", name: "Iron", rate: 20, unit: "kg" },
    { id: "steel", name: "Steel", rate: 45, unit: "kg" },
    { id: "brass", name: "Brass", rate: 400, unit: "kg" },
  ],
  "E-waste": [
    { id: "keypad", name: "Keypad Phone", rate: 200, unit: "piece" },
    { id: "smartphone", name: "Smart Phone", rate: 400, unit: "piece" },
    { id: "tablet", name: "Tablet", rate: 300, unit: "piece" },
    { id: "lcd", name: "LCD", rate: 200, unit: "piece" },
    { id: "laptop", name: "Laptop", rate: 400, unit: "piece" },
  ],
};

const CATEGORIES: Category[] = ["Paper", "Plastic", "Glass", "Metals", "E-waste"];
const STORAGE_KEY = "pickup-data";

export default function SchedulePickupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState<ScrapSelection[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [selectedSubItemId, setSelectedSubItemId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  // ---------- Prefill ----------
  useEffect(() => {
    const shouldPrefill = searchParams.get("edit") === "1";
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as PickupPayload;

      if (shouldPrefill) {
        setAddress(parsed.addressDetails.fullAddress);
        setDate(parsed.pickupDate);
        setTime(parsed.time);
        setNotes(parsed.description ?? "");
        setItems(parsed.items ?? []);
      }
    } catch {}
  }, []);

  // ---------- Remove Item ----------
  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------- Submit ----------
  const handleSubmit = () => {
    if (!address || !date || !time || items.length === 0) {
      alert("Fill all details.");
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

  // ---------- Modal Logic ----------
  const openCategoryModal = (category: Category) => {
    setActiveCategory(category);
    const first = SCRAP_CONFIG[category][0];
    setSelectedSubItemId(first?.id ?? null);
    setQuantity(1);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setActiveCategory(null);
    setSelectedSubItemId(null);
    setQuantity(1);
  };

  const currentSubItems = activeCategory ? SCRAP_CONFIG[activeCategory] : [];
  const selectedSubItem = currentSubItems.find((s) => s.id === selectedSubItemId);
  const estimatedAmount = selectedSubItem ? selectedSubItem.rate * quantity : 0;

  return (
    <main className="min-h-screen bg-[#F2F7F2] pb-24">
      {/* HEADER */}
      <header className="w-full py-6 px-10 flex items-center justify-between border-b bg-white shadow-sm sticky top-0 z-30">
        <div
          className="cursor-pointer relative w-44 h-12"
          onClick={() => router.push("/dashboard")}
        >
          <Image src="/logo2.png" fill alt="Revive Logo" className="object-contain" />
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 bg-[#1A7548] text-white px-6 py-2 rounded-full shadow hover:bg-[#155E3A]"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
      </header>

      {/* TITLE */}
      <div className="text-center mt-12">
        <h1 className="text-5xl font-extrabold text-[#0A4A31]">Schedule Pickup</h1>
        <p className="text-[#517264] text-lg mt-2">Fill the details to book pickup</p>
      </div>

      {/* MAIN FORM */}
      <div className="max-w-2xl bg-white rounded-3xl shadow-xl mx-auto mt-12 p-10 border space-y-10">

        {/* ADDRESS */}
        <section>
          <h2 className="flex items-center gap-3 text-2xl font-bold text-[#0A4A31] mb-4">
            <MapPin size={26} className="text-[#1A7548]" />
            Pickup Location
          </h2>

          <input
            type="text"
            placeholder="Enter complete pickup address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-5 py-4 bg-gray-50 border rounded-xl outline-none 
            focus:ring-2 focus:ring-[#1A7548]"
          />
        </section>

        {/* DATE & TIME */}
        <section>
          <h2 className="flex items-center gap-3 text-2xl font-bold text-[#0A4A31] mb-4">
            <Calendar size={26} className="text-[#1A7548]" />
            Pickup Date & Time
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="flex items-center gap-3 bg-gray-50 border rounded-xl px-4 py-3">
              <Calendar size={20} className="text-gray-500" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent w-full outline-none"
              />
            </div>

            <div className="flex items-center gap-3 bg-gray-50 border rounded-xl px-4 py-3">
              <Clock size={20} className="text-gray-500" />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-transparent w-full outline-none"
              />
            </div>

          </div>
        </section>

        {/* SCRAP ITEMS */}
        <section>
          <h2 className="flex items-center gap-3 text-2xl font-bold text-[#0A4A31] mb-4">
            <Recycle size={26} className="text-[#1A7548]" /> Add Scrap Items
          </h2>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => openCategoryModal(cat)}
                className="px-4 py-2 rounded-xl border text-sm font-semibold bg-gray-100 hover:bg-gray-200"
              >
                {cat}
              </button>
            ))}
          </div>

          {items.length > 0 && (
            <div className="border rounded-2xl overflow-hidden mt-4">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F5F8F5]">
                  <tr>
                    <th className="py-2 px-4 w-12"></th>
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

                      {/* Green Trash Button */}
                      <td className="py-2 px-4">
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="p-2 rounded-lg hover:bg-[#E8F6EE] transition"
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
            placeholder="Optional message..."
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
      {showModal && activeCategory && selectedSubItem && (
        <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50">
          <div className="w-full max-w-md bg-white rounded-t-3xl p-6">
            <h3 className="text-xl font-bold text-[#0A4A31] mb-4">
              Add item for {activeCategory}
            </h3>

            {/* Subitems */}
            <div className="border rounded-xl mb-4 overflow-hidden">
              {currentSubItems.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubItemId(sub.id)}
                  className={`w-full text-left px-4 py-3 text-sm ${
                    selectedSubItemId === sub.id
                      ? "bg-[#EAF3ED] font-semibold"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {sub.name} (₹{sub.rate}/{sub.unit})
                </button>
              ))}
            </div>

            {/* Quantity Selector */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold">Estimated Amount</span>
                <span className="font-semibold">
                  {quantity} {selectedSubItem.unit} → ₹{estimatedAmount}
                </span>
              </div>

              <input
                type="range"
                min={1}
                max={selectedSubItem.unit === "piece" ? 20 : 100}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full"
              />

              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="mt-2 w-24 border rounded-lg px-2 py-1 text-sm"
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
                      category: activeCategory,
                      subItemId: selectedSubItem.id,
                      subItemName: selectedSubItem.name,
                      unit: selectedSubItem.unit,
                      rate: selectedSubItem.rate,
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
