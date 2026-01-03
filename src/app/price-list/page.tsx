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
    <main className="min-h-screen bg-gradient-to-b from-[#F2F7F2] to-[#E8F1EA] flex flex-col">
      
      {/* ---------- PAGE CONTENT ---------- */}
      <div className="flex-grow">
        
        {/* HEADER */}
        <header className="w-full py-6 px-10 flex items-center justify-between border-b bg-white shadow-sm">
          <Image
            src="/logo2.png"
            width={150}
            height={60}
            alt="Revive Logo"
            className="cursor-pointer"
            onClick={() => router.push("/dashboard")}
          />
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 bg-[#1A7548] text-white px-6 py-2 rounded-full shadow hover:bg-[#155E3A] transition"
          >
            <ArrowLeft size={18} /> Back
          </button>
        </header>

        {/* TITLE */}
        <section className="text-center mt-14 px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0A4A31]">
            Price List
          </h1>
          <p className="text-[#517264] mt-3 text-lg">
            Check current scrap rates by category
          </p>
        </section>

        {/* LOADING */}
        {loading && (
          <p className="text-center mt-12 text-[#517264]">
            Loading prices...
          </p>
        )}

        {/* PRICE LIST */}
        {!loading && (
          <section className="max-w-3xl mx-auto mt-12 space-y-6 px-6">
            {priceList.map((group, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={group.category}
                  className="bg-white border border-[#DDECE2] rounded-3xl shadow-md overflow-hidden"
                >
                  {/* ACCORDION HEADER */}
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between px-8 py-5 text-lg font-semibold text-[#0A4A31] hover:bg-[#F4FAF6] transition"
                  >
                    {group.category}
                    <ChevronDown
                      size={22}
                      className={`text-[#1A7548] transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* ACCORDION CONTENT */}
                  {isOpen && (
                    <div className="px-8 pb-6">
                      {group.items.length === 0 && (
                        <p className="text-sm text-gray-500 py-3">
                          No items available.
                        </p>
                      )}

                      {group.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center py-3 border-t text-[#0A4A31]"
                        >
                          <span>{item.name}</span>
                          <span className="font-semibold text-[#1A7548]">
                            ₹{item.price}/{item.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}
      </div>

      {/* ---------- FOOTER ---------- */}
      <footer className="w-full flex justify-center py-8 px-4 mt-12">
        <div className="bg-[#2F5E3A] rounded-full px-12 py-4 shadow-lg">
          <p className="text-white text-sm font-medium tracking-wide">
            © {new Date().getFullYear()} Revive Ecotech Ltd
          </p>
        </div>
      </footer>
    </main>
  );
}
