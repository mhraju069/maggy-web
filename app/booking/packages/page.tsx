"use client";

import ArrangementCard from "@/components/shared/ArrangementCard";
import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { updateStoredBookingData } from "@/lib/bookingStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PackageItem {
  id: number;
  image: string;
  rating: number;
  title: string;
  combo: string;
  description: string;
  includes: string[];
  paymentType: "full" | "partial" | "spot";
  price: string;
}

const packagesList: PackageItem[] = [
  {
    id: 1,
    image: "/images/arrangements/cardimages/img1.png",
    rating: 4.9,
    title: "Signature Harmony Package",
    combo: "Sauna + Salt Therapy + Lunch",
    description: "Our signature full-day experience combining heat therapy, respiratory halotherapy, and farm-to-table lunch.",
    includes: [
      "2-hour private sauna session",
      "45-minute salt room session",
      "Organic lunch menu in Lunchroom",
      "Complimentary herbal tea & towels",
    ],
    paymentType: "full",
    price: "€185",
  },
  {
    id: 2,
    image: "/images/arrangements/cardimages/img2.png",
    rating: 4.9,
    title: "Revitalizing Detox Package",
    combo: "Yoga + Breathwork + Salt Room",
    description: "Deep Mind-Body reset blending active morning movement with restorative salt air halotherapy.",
    includes: [
      "60-minute Morning Flow Yoga",
      "45-minute Transformational Breathwork",
      "45-minute Salt room recovery",
      "Cold-pressed wellness juice",
    ],
    paymentType: "full",
    price: "€120",
  },
  {
    id: 3,
    image: "/images/arrangements/cardimages/img3.png",
    rating: 4.9,
    title: "VIP Wellness Sanctuary Package",
    combo: "Private Sauna + Salt Cave + Dining + Massages",
    description: "Ultimate luxury wellness experience designed for couples or exclusive small groups.",
    includes: [
      "3-hour private sauna sanctuary",
      "60-minute private salt cave access",
      "2x 60-minute relaxing massages",
      "3-course seasonal lunch menu",
    ],
    paymentType: "full",
    price: "€320",
  },
];

export default function PackagesBookingPage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedPkg = packagesList.find((p) => p.id === selectedId);

  const handleContinue = () => {
    if (!selectedPkg) return;

    updateStoredBookingData({
      serviceName: selectedPkg.title,
      serviceType: "package",
      price: selectedPkg.price,
      guestsCount: 2,
      totalAmount: parseFloat(selectedPkg.price.replace(/[^0-9.]/g, "")) || 185,
    });

    router.push("/booking/choose-time");
  };

  return (
    <div className="w-full px-6 md:px-12 max-w-7xl mx-auto">
      {/* ── Title Section ── */}
      <div className="text-center mb-16 flex flex-col items-center">
        <h1 className="font-displayPlayFair text-5xl text-[#1d1a17] mb-2 uppercase tracking-tight">
          Wellness Packages
        </h1>
        <DecorativeUnderline />
        <p className="font-cambria text-sm text-[#475569] mt-6 italic">
          Thoughtfully curated half-day and full-day wellness journeys combining our finest treatments.
        </p>
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
        {packagesList.map((item) => (
          <ArrangementCard
            key={item.id}
            {...item}
            isSelected={selectedId === item.id}
            onClick={() => setSelectedId(item.id)}
          />
        ))}
      </div>

      {/* ── Footer Navigation ── */}
      <div className="max-w-7xl mx-auto mt-8 flex justify-between items-center bg-[#FBF6F3] p-8 rounded-2xl shadow-sm border border-[#E8E2DC]">
        <Link
          href="/booking"
          className="px-10 py-4 rounded-xl border border-[#CFB9A3] text-[#1d1a17] font-bold text-sm hover:bg-[#CFB9A3] hover:bg-opacity-10 transition-all flex items-center gap-3"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Experiences
        </Link>

        <button
          onClick={handleContinue}
          disabled={!selectedId}
          className={`px-12 py-4 rounded-xl text-white font-bold text-sm flex items-center gap-3 transition-all shadow-lg ${
            selectedId
              ? "bg-[#D1B191] hover:bg-[#C4A484] shadow-lg transform translate-y-[-2px]"
              : "bg-[#D1B191] opacity-50 cursor-not-allowed"
          }`}
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Continue
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}
