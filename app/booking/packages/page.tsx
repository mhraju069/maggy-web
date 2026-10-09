"use client";

import ArrangementCard from "@/components/shared/ArrangementCard";
import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { formatImageUrl } from "@/lib/api/config";
import { servicesService, ServicePackage } from "@/lib/api/services/servicesService";
import { updateStoredBookingData } from "@/lib/bookingStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSpa } from "react-icons/fa";

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
  rawPriceNum: number;
}

export default function PackagesBookingPage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    servicesService
      .getPackages()
      .then((apiData) => {
        if (apiData && Array.isArray(apiData) && apiData.length > 0) {
          const mapped: PackageItem[] = apiData.map((item: ServicePackage, idx: number) => {
            const priceVal = typeof item.price === "number"
              ? item.price
              : parseFloat(String(item.price || 0)) || 0;

            return {
              id: item.id,
              image: formatImageUrl(
                item.image,
                `/images/arrangements/cardimages/img${(idx % 3) + 1}.png`
              ),
              rating: 4.9,
              title: item.title || "Wellness Package",
              combo: item.packages || "Sauna + Salt + Wellness",
              description: item.description || "",
              includes: item.features?.map((f) => f.feature.replace(/^[✓✔\s]+/, "")) || [],
              paymentType: "full" as const,
              price: `€${priceVal.toFixed(0)}`,
              rawPriceNum: priceVal,
            };
          });
          setPackages(mapped);
          if (mapped.length > 0) {
            setSelectedId(mapped[0].id);
          }
        } else {
          setPackages([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching packages:", err);
        setPackages([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const selectedPkg = packages.find((p) => p.id === selectedId);

  const handleContinue = () => {
    if (!selectedPkg) return;

    updateStoredBookingData({
      serviceName: selectedPkg.title,
      serviceType: "package",
      price: selectedPkg.price,
      guestsCount: 2,
      totalAmount: selectedPkg.rawPriceNum,
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

      {/* ── Loading Spinner ── */}
      {loading && (
        <div className="w-full py-24 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#8B7355] border-t-transparent mb-4"></div>
          <p className="text-[#64748B] font-cambria italic">Loading Wellness Packages...</p>
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && packages.length === 0 && (
        <div className="bg-white rounded-[32px] p-12 shadow-sm border border-[#E8E2DC] text-center max-w-2xl mx-auto my-12">
          <div className="w-16 h-16 bg-[#FCF2E9] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#8B7355]">
            <FaSpa className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold font-displayPlayFair text-[#0F172A] mb-2">
            No Packages Available
          </h3>
          <p className="text-sm text-[#64748B] font-cambria italic">
            Currently there are no wellness packages available from the server. Please check back later or explore our individual services.
          </p>
        </div>
      )}

      {/* ── Packages Grid ── */}
      {!loading && packages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {packages.map((item) => (
            <ArrangementCard
              key={item.id}
              {...item}
              isSelected={selectedId === item.id}
              onClick={() => setSelectedId(item.id)}
            />
          ))}
        </div>
      )}

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
          disabled={!selectedId || packages.length === 0}
          className={`px-12 py-4 rounded-xl text-white font-bold text-sm flex items-center gap-3 transition-all shadow-lg ${
            selectedId && packages.length > 0
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
