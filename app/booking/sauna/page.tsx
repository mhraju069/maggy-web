"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import SaunaCard from "@/components/shared/SaunaCard";
import Link from "next/link";
import { useState } from "react";

const saunaData = [
  {
    id: 1,
    title: "Private Sauna",
    description: "Your own exclusive sanctuary for ultimate privacy and relaxation.",
    image: "/images/wellness/bookings/private-sauna.png",
    rating: 4.9,
    capacity: "Up to 6 persons",
    duration: "2-hour sessions",
    paymentType: "Prepayment required",
    price: 210,
  },
  {
    id: 2,
    title: "Shared Sauna",
    description: "Join our wellness experience in a peaceful, shared space.",
    image: "/images/wellness/bookings/shared-sauna.png",
    rating: 4.9,
    capacity: "Limited capacity",
    duration: "Flexible sessions",
    paymentType: "Pay upon arrival",
    price: 140,
  },
];

export default function SaunaBookingPage() {
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
        <h1 className="font-displayPlayFair text-5xl text-[#1d1a17] mb-2 uppercase tracking-tight">Sauna & Wellness</h1>
        <DecorativeUnderline />
        <p className="font-cambria text-sm text-[#475569] mt-6 italic">Pure restoration in every breath.</p>
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {saunaData.map((sauna) => (
          <SaunaCard
            key={sauna.id}
            {...sauna}
            isSelected={selectedIds.includes(sauna.id)}
            onClick={() => toggleSelection(sauna.id)}
          />
        ))}
      </div>

      {/* ── Footer Buttons ── */}
      <div className="max-w-6xl mx-auto mt-16 flex justify-between items-center bg-[#FBF6F3] p-8 rounded-2xl shadow-sm border border-[#E8E2DC]">
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
