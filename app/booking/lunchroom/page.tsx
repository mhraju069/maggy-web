"use client";

import ArrangementCard from "@/components/shared/ArrangementCard";
import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import Link from "next/link";
import { useState } from "react";

const lunchroomPackages = [
  {
    id: 1,
    image: "/images/lunchroom/hero/lunchroomhero.png",
    rating: 4.8,
    title: "Lunchroom Experience",
    combo: "Organic + Seasonal + Fresh",
    description: "Relax and nourish yourself with our carefully crafted menu. No reservation usually needed, but you can book a guaranteed spot.",
    includes: [
      "Access to seasonal menu",
      "Reserved seating for 120 mins",
      "Organic tea or coffee",
      "Instagram-worthy atmosphere",
    ],
    paymentType: "spot" as const,
    price: "$35",
  },
];

export default function LunchroomBookingPage() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full px-6 md:px-12">
      {/* ── Title Section ── */}
      <div className="text-center mb-16 flex flex-col items-center">
        <h1 className="font-displayPlayFair text-5xl text-[#1d1a17] mb-2 uppercase tracking-tight">Lunchroom</h1>
        <DecorativeUnderline />
        <p className="font-cambria text-sm text-[#475569] mt-6 italic">Nourishment for body and soul.</p>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-xl mx-auto">
        {lunchroomPackages.map((item) => (
          <ArrangementCard
            key={item.id}
            {...item}
            isSelected={selectedIds.includes(item.id)}
            onClick={() => toggleSelection(item.id)}
          />
        ))}
      </div>

      {/* ── Footer Buttons ── */}
      <div className="max-w-xl mx-auto mt-16 flex justify-between items-center bg-[#FBF6F3] p-8 rounded-2xl shadow-sm border border-[#E8E2DC]">
        <Link
          href="/booking"
          className="px-10 py-4 rounded-xl border border-[#CFB9A3] text-[#1d1a17] font-bold text-sm hover:bg-[#CFB9A3] hover:bg-opacity-10 transition-all flex items-center gap-3"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back
        </Link>

        <Link
          href="/booking/choose-time"
          className={`px-12 py-4 rounded-xl text-white font-bold text-sm flex items-center gap-3 transition-all shadow-md ${
            selectedIds.length > 0 ? "bg-[#D1B191] hover:bg-[#C4A484] shadow-lg transform translate-y-[-2px]" : "bg-[#D1B191] opacity-50 cursor-not-allowed pointer-events-none"
          }`}
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Continue
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </Link>
      </div>
    </div>
  );
}
