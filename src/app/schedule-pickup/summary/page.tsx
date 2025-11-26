"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";

type Category = "Paper" | "Plastic" | "Glass" | "Metals" | "E-waste";
type Unit = "kg" | "piece";

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
  addressDetails: {
    fullAddress: string;
    line1?: string;
    addressType?: string;
  };
  pickupDate: string;
  time: string;
  description?: string;
  items: ScrapSelection[];
}

const STORAGE_KEY = "pickup-data";

export default function PickupSummaryPage() {
  const router = useRouter();
  const [data, setData] = useState<PickupPayload | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      router.push("/schedule-pickup");
      return;
    }

    try {
      const parsed = JSON.parse(stored) as PickupPayload;
      if (!parsed.items || parsed.items.length === 0) {
        router.push("/schedule-pickup");
        return;
      }
      setData(parsed);
    } catch {
      router.push("/schedule-pickup");
    }
  }, [router]);

  const grandTotal = useMemo(
    () =>
      data?.items.reduce(
        (sum, item) => sum + (item.estimatedAmount || 0),
        0
      ) ?? 0,
    [data]
  );

  if (!data) return null;

  return (
    <main className="min-h-screen bg-[#F2F7F2] pb-28">
      {/* HEADER */}
      <header className="w-full py-5 px-10 flex items-center justify-between border-b border-[#DDECE2] bg-white shadow-sm">
        <Image src="/logo.png" width={160} height={80} alt="Revive Logo" />

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/")}
            className="hidden md:flex items-center gap-2 text-[#0A4A31] font-semibold hover:underline"
          >
            <Home size={18} /> Home
          </button>

          <button
            onClick={() => router.push("/schedule-pickup?edit=1")}
            className="text-[#0A4A31] font-semibold flex items-center gap-2 hover:underline"
          >
            <ArrowLeft size={18} /> Edit Pickup
          </button>
        </div>
      </header>

      {/* TITLE */}
      <div className="text-center mt-12">
        <h1 className="text-5xl font-extrabold text-[#0A4A31]">
          Summary of Your Pickup
        </h1>
        <p className="text-[#517264] text-lg mt-2">
          Review your recyclables and details before confirming
        </p>
      </div>

      {/* CARD */}
      <div className="max-w-3xl mx-auto bg-white border border-[#DDECE2] rounded-3xl shadow-xl mt-10 p-10 space-y-10">
        {/* ITEMS TABLE */}
        <div>
          <h2 className="text-2xl font-bold text-[#0A4A31] mb-5">
            Selected Items
          </h2>

          <div className="rounded-2xl overflow-hidden border border-[#DDECE2]">
            <table className="w-full text-left text-sm md:text-base">
              <thead className="bg-[#1A7548] text-white">
                <tr>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Qty</th>
                  <th className="py-3 px-4">Rate</th>
                  <th className="py-3 px-4">Est. Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => (
                  <tr key={`${item.subItemId}-${index}`} className="border-t">
                    <td className="py-3 px-4">{item.category}</td>
                    <td className="py-3 px-4">{item.subItemName}</td>
                    <td className="py-3 px-4">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-3 px-4">
                      ₹{item.rate}/{item.unit}
                    </td>
                    <td className="py-3 px-4">₹{item.estimatedAmount}</td>
                  </tr>
                ))}
                <tr className="border-t bg-[#F9FCF9] font-semibold">
                  <td className="py-3 px-4" colSpan={4}>
                    Total Estimated Amount
                  </td>
                  <td className="py-3 px-4">₹{grandTotal.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* DETAILS */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-[#0A4A31] mb-2">
            Pickup Details
          </h2>

          <p className="text-lg">
            <span className="font-bold text-[#0A4A31]">Pickup Address: </span>
            {data.addressDetails.fullAddress}
          </p>

          <p className="text-lg">
            <span className="font-bold text-[#0A4A31]">Pickup Date: </span>
            {data.pickupDate}
          </p>

          <p className="text-lg">
            <span className="font-bold text-[#0A4A31]">Pickup Time: </span>
            {data.time}
          </p>

          {data.description && (
            <p className="text-lg">
              <span className="font-bold text-[#0A4A31]">Notes: </span>
              {data.description}
            </p>
          )}
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex flex-col md:flex-row justify-center gap-6 mt-10 px-4">
        {/* Edit Pickup */}
        <button
          onClick={() => router.push("/schedule-pickup?edit=1")}
          className="px-8 py-4 bg-white border border-[#DDECE2] rounded-xl text-[#0A4A31] font-semibold shadow-md hover:bg-gray-50 flex items-center gap-2 justify-center"
        >
          <ArrowLeft size={18} /> Edit Pickup
        </button>

        {/* Confirm */}
        <button
          onClick={() => router.push("/schedule-pickup/success")}
          className="px-8 py-4 bg-[#1A7548] rounded-xl text-white font-bold shadow-md hover:bg-[#155E3A] flex items-center gap-2 justify-center"
        >
          Confirm Pickup <ArrowRight size={18} />
        </button>
      </div>
    </main>
  );
}