"use client";

import { useState } from "react";
import { ArrowLeft, ChevronUp, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function PriceListPage() {
  const router = useRouter();

  const priceList = [
    {
      category: "Paper",
      items: [{ name: "Newspaper", rate: "₹14/kg" }],
    },
    {
      category: "Plastic",
      items: [{ name: "Plastic Bottles", rate: "₹10/kg" }],
    },
    {
      category: "Glass",
      items: [{ name: "Bottles", rate: "₹10/kg" }],
    },
    {
      category: "Metals",
      items: [
        { name: "Aluminium", rate: "₹140/kg" },
        { name: "Copper", rate: "₹570/kg" },
        { name: "Iron", rate: "₹20/kg" },
        { name: "Steel", rate: "₹45/kg" },
        { name: "Brass", rate: "₹400/kg" },
      ],
    },
    {
      category: "E-waste",
      items: [
        { name: "Keypad Phone", rate: "₹200/pc" },
        { name: "Smart Phone", rate: "₹400/pc" },
        { name: "Tablet", rate: "₹300/pc" },
        { name: "LCD", rate: "₹200/pc" },
        { name: "Laptop", rate: "₹400/pc" },
      ],
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-[#F2F7F2] pb-10">
      {/* HEADER */}
      <header className="w-full py-6 px-10 flex items-center justify-between border-b bg-white shadow-sm">
        <Image src="/logo2.png" width={150} height={150} alt="Revive Logo" />

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 bg-[#1A7548] text-white px-6 py-2 rounded-full shadow hover:bg-[#155E3A]"
        >
          <ArrowLeft size={18} /> Back to Dashbord
        </button>
      </header>

      {/* TITLE */}
      <h1 className="text-4xl font-extrabold text-[#0A4A31] text-center mt-10">
        Price List
      </h1>

      {/* ACCORDION LIST */}
      <div className="max-w-2xl mx-auto mt-10 space-y-5 px-5">
        {priceList.map((group, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={group.category}
              className="bg-white shadow rounded-2xl border border-[#DDECE2]"
            >
              {/* Category header */}
              <button
                onClick={() =>
                  setOpenIndex(isOpen ? null : index)
                }
                className="w-full flex justify-between items-center px-6 py-4 text-lg font-semibold text-[#0A4A31]"
              >
                {group.category}

                {isOpen ? (
                  <ChevronDown size={24} className="text-green-600" />
                ) : (
                  <ChevronUp size={24} className="text-green-600" />
                )}
              </button>

              {/* Items */}
              {isOpen && (
                <div className="px-6 pb-4">
                  {group.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex justify-between py-2 border-t text-[#0A4A31]"
                    >
                      <span>{item.name}</span>
                      <span className="font-semibold">{item.rate}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
