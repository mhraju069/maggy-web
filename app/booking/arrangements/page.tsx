"use client";

import ArrangementCard from "@/components/shared/ArrangementCard";
import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { formatImageUrl, parseApiErrorMessage, ServiceItem, servicesService } from "@/lib/api";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type PaymentType = "full" | "partial" | "spot";

interface Arrangement {
  id: number;
  image: string;
  rating: number;
  title: string;
  combo: string;
  description: string;
  includes: string[];
  paymentType: PaymentType;
  price: string;
}

const fallbackArrangements: Arrangement[] = [
  {
    id: 6,
    image: "/images/arrangements/cardimages/img1.png",
    rating: 4.9,
    title: "Wellness Escape",
    combo: "Sauna + Massage + Lunch",
    description: "A complete day of relaxation combining our finest wellness services.",
    includes: ["2-hour private sauna session", "60-minute therapeutic massage", "Seasonal lunch menu", "Herbal tea selection"],
    paymentType: "full",
    price: "$210",
  },
  {
    id: 2,
    image: "/images/arrangements/cardimages/img2.png",
    rating: 4.9,
    title: "Active Retreat",
    combo: "Yoga + Sauna + Dining",
    description: "Balance mind and body with movement, heat, and nourishment.",
    includes: ["Morning yoga session", "Shared sauna access", "Healthy lunch bowl", "Meditation guide"],
    paymentType: "partial",
    price: "$210",
  },
  {
    id: 3,
    image: "/images/arrangements/cardimages/img3.png",
    rating: 4.9,
    title: "Group Experience",
    combo: "Private Sauna + Activities + Catering",
    description: "Perfect for celebrations, team building, or gatherings with loved ones.",
    includes: ["Private sauna (up to 18 persons)", "Guided wellness activity", "Premium catering service", "Dedicated host"],
    paymentType: "spot",
    price: "$210",
  },
];

export default function ArrangementsBookingPage() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await servicesService.getServices("arrangement");
      setServices(data);
    } catch (err: unknown) {
      setError(parseApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const displayList: Arrangement[] =
    services.length > 0
      ? services.map((s) => {
          const descLines = (s.description || "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
          const comboText = s.subtitle || (descLines[0]?.includes("+") ? descLines[0] : "Wellness Package");
          const actualDesc = descLines.length > 1 && descLines[0].includes("+") ? descLines.slice(1).join(" ") : s.description;

          let payType: PaymentType = "full";
          if (s.payment_type === "on_spot") payType = "spot";
          else if (s.payment_type === "partial") payType = "partial";

          const includesList = s.features && s.features.length > 0
            ? s.features.map((f) => f.feature)
            : ["Full access to wellness facilities", "Personalized experience"];

          return {
            id: s.id,
            image: formatImageUrl(s.image, "/images/arrangements/cardimages/img1.png"),
            rating: 4.9,
            title: s.title,
            combo: comboText,
            description: actualDesc,
            includes: includesList,
            paymentType: payType,
            price: `$${parseFloat(String(s.price)) || 0}`,
          };
        })
      : fallbackArrangements;

  return (
    <div className="w-full px-6 md:px-12">
      {/* ── Title Section ── */}
      <div className="text-center mb-16 flex flex-col items-center">
        <h1 className="font-displayPlayFair text-5xl text-[#1d1a17] mb-2 uppercase tracking-tight">Arrangements</h1>
        <DecorativeUnderline />
        <p className="font-cambria text-sm text-[#475569] mt-6 italic">Multi-sensory experiences thoughtfully designed to restore balance and vitality.</p>
      </div>

      {/* ── Loading Alert ── */}
      {loading && (
        <div className="text-center py-12 text-[#8b7355] text-base font-medium">
          Loading arrangement packages...
        </div>
      )}

      {/* ── Error Alert ── */}
      {error && !loading && (
        <div className="max-w-xl mx-auto mb-8 p-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg flex items-center justify-between">
          <span>Failed to connect to API ({error}). Showing available packages.</span>
          <button
            onClick={fetchServices}
            className="px-3 py-1 bg-[#8b7355] text-white text-xs font-bold rounded hover:bg-[#725e45] transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Grid ── */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {displayList.map((item) => (
            <ArrangementCard
              key={item.id}
              {...item}
              isSelected={selectedIds.includes(item.id)}
              onClick={() => toggleSelection(item.id)}
            />
          ))}
        </div>
      )}

      {/* ── Footer Buttons ── */}
      <div className="max-w-7xl mx-auto mt-16 flex justify-between items-center bg-[#FBF6F3] p-8 rounded-2xl shadow-sm border border-[#E8E2DC]">
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
