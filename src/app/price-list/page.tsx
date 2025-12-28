"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  collection,
  getDocs,
  query,
  orderBy,
  DocumentData,
} from "firebase/firestore";

import { getDB } from "@/lib/firebase";

// --------------------------------
// TYPES
// --------------------------------
interface PriceItem {
  id: string;
  name: string;
  price: number;
  unit: string;
}

interface CategoryData {
  category: string;
  items: PriceItem[];
}

export default function PriceListPage() {
  const router = useRouter();
  const db = getDB();

  const [priceList, setPriceList] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // --------------------------------
  // FETCH PRICE LIST FROM FIREBASE
  // --------------------------------
  const fetchPriceList = async () => {
    try {
      const categoriesRef = collection(db, "price_list");
      const q = query(categoriesRef, orderBy("order", "asc"));
      const categorySnapshot = await getDocs(q);

      const finalData: CategoryData[] = [];

      for (const cat of categorySnapshot.docs) {
        const catData = cat.data() as DocumentData;

        const itemsRef = collection(db, "price_list", cat.id, "items");
        const itemsSnap = await getDocs(itemsRef);

        const items: PriceItem[] = itemsSnap.docs.map((d) => {
          const data = d.data() as DocumentData;
          return {
            id: d.id,
            name: data.name ?? "Unnamed",
            price: data.price ?? 0,
            unit: data.unit ?? "unit",
          };
        });

        finalData.push({
          category: catData.name ?? "Unnamed Category",
          items,
        });
      }

      setPriceList(finalData);
      setLoading(false);
    } catch (err) {
      console.error("Error loading price list:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceList();
  }, []);

  return (
    <main className="min-h-screen bg-[#F2F7F2] flex flex-col">
      
      {/* ---------- PAGE CONTENT ---------- */}
      <div className="flex-grow">
        
        {/* HEADER */}
        <header className="w-full py-6 px-10 flex items-center justify-between border-b bg-white shadow-sm">
          <Image src="/logo2.png" width={150} height={60} alt="Revive Logo" />
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 bg-[#1A7548] text-white px-6 py-2 rounded-full shadow hover:bg-[#155E3A] transition"
          >
            <ArrowLeft size={18} /> Back
          </button>
        </header>

        <h1 className="text-4xl font-extrabold text-[#0A4A31] text-center mt-10">
          Price List
        </h1>

        {loading && (
          <p className="text-center mt-10 text-[#517264]">
            Loading prices...
          </p>
        )}

        {!loading && (
          <div className="max-w-2xl mx-auto mt-10 space-y-5 px-5">
            {priceList.map((group, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={group.category}
                  className="bg-white border border-[#DDECE2] rounded-2xl shadow-sm"
                >
                  {/* ACCORDION HEADER */}
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between px-6 py-4 text-lg font-semibold text-[#0A4A31]"
                  >
                    {group.category}
                    <ChevronDown
                      size={22}
                      className={`text-[#1A7548] transition-transform duration-300 ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  {/* ACCORDION CONTENT */}
                  {isOpen && (
                    <div className="px-6 pb-4">
                      {group.items.length === 0 && (
                        <p className="text-sm text-gray-500 py-3">
                          No items available.
                        </p>
                      )}

                      {group.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between py-2 border-t text-[#0A4A31]"
                        >
                          <span>{item.name}</span>
                          <span className="font-semibold">
                            ₹{item.price}/{item.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ---------- FOOTER (FIXED) ---------- */}
      <footer className="w-full flex justify-center py-6">
        <div className="bg-[#386641] rounded-full px-10 py-3 shadow-md">
          <p className="text-white text-sm font-medium tracking-wide">
            © {new Date().getFullYear()} Revive Ecotech Ltd
          </p>
        </div>
      </footer>
    </main>
  );
}
