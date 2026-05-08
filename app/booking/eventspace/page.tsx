"use client";

import ArrangementCard from "@/components/shared/ArrangementCard";
import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import Link from "next/link";
import { useState } from "react";

const eventSpaces = [
  {
    id: 1,
    image: "/images/eventspace/hero/eventhero.png",
    rating: 4.9,
    title: "Multifunctional Space",
    combo: "Weddings + Corporate + Seminars",
    description: "A calm setting for life's meaningful moments. Flexible layout for any occasion.",
    includes: [
      "Flexible seating configurations",
      "Natural lighting & acoustics",
      "Integrated audio-visual setup",
      "Dedicated event support",
    ],
    paymentType: "spot" as const,
    price: "$500",
  },
];

export default function EventSpaceBookingPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <div className="container mx-auto px-6 py-12">
      {/* ── Title Section ── */}
      <div className="text-center mb-16 flex flex-col items-center">
        <h1 className="font-displayPlayFair text-5xl text-[#1d1a17] mb-2 uppercase tracking-tight">Event Space</h1>
        <DecorativeUnderline />
        <p className="font-cambria text-sm text-[#475569] mt-6 italic">A calm setting for life's meaningful moments.</p>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-xl mx-auto">
        {eventSpaces.map((item) => (
          <ArrangementCard
            key={item.id}
            {...item}
            isSelected={selectedId === item.id}
            onClick={() => setSelectedId(item.id)}
          />
        ))}
      </div>

      {/* ── Footer Buttons ── */}
      <div className="max-w-xl mx-auto mt-16 flex justify-between items-center">
        <Link
          href="/booking"
          className="px-8 py-3 rounded-md border border-[#CFB9A3] text-[#1d1a17] font-semibold text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back
        </Link>

        <button
          disabled={!selectedId}
          className={`px-10 py-3 rounded-md text-white font-semibold text-sm flex items-center gap-2 transition-all ${
            selectedId ? "bg-[#CFB9A3] hover:bg-[#BBA791] shadow-md" : "bg-[#CFB9A3] opacity-60 cursor-not-allowed"
          }`}
        >
          Continue
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}
