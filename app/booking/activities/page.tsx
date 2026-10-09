"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { Activity, getActivities } from "@/lib/activitiesStore";
import { formatImageUrl, parseApiErrorMessage, servicesService } from "@/lib/api";
import { updateStoredBookingData } from "@/lib/bookingStore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FaChalkboardTeacher, FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import { LuUsers } from "react-icons/lu";

const CATEGORIES = [
  "All Activities",
  "Yoga",
  "Breathwork",
  "Workshops",
  "Special classes",
  "One-time activities",
  "Event evenings",
] as const;

const fallbackImages = [
  "/images/booking/activity.png",
  "/images/arrangements/cardimages/img1.png",
  "/images/arrangements/cardimages/img2.png",
  "/images/arrangements/cardimages/img3.png",
];

const parsePrice = (val: string | number | undefined, defaultVal: number): number => {
  if (val === undefined || val === null || val === "") return defaultVal;
  const str = String(val).trim();
  const cleanStr = str.replace(/[^0-9.]/g, "");
  if (!cleanStr) return defaultVal;
  const num = parseFloat(cleanStr);
  if (isNaN(num)) return defaultVal;
  if (num > 10000) return defaultVal;
  return num;
};

export default function ActivitiesBookingPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Activities");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivitiesData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const apiData = await servicesService.getActivities();
      if (apiData && apiData.length > 0) {
        const mapped: Activity[] = apiData.map((item, idx) => {
          const defaultCategory = CATEGORIES[(idx % (CATEGORIES.length - 1)) + 1];
          const rawPrice = parsePrice(item.price, 40);

          return {
            id: String(item.id ?? idx),
            name: item.title || item.name || "Mindful Session",
            category: item.category || defaultCategory,
            description:
              item.description ||
              "Transformative session designed to center the mind, cultivate stillness, and revitalize the body.",
            image: formatImageUrl(
              item.images || item.image,
              fallbackImages[idx % fallbackImages.length]
            ),
            date: item.date || "2026-10-15",
            startTime: item.start_time || item.startTime || "08:00",
            endTime: item.end_time || item.endTime || "09:15",
            price: rawPrice,
            maxParticipants: item.max_participants || item.maxParticipants || 12,
            bookedParticipants: item.booked_participants || item.bookedParticipants || 4,
            teacherHost: item.teacher_host || item.teacherHost || "Elena Rostova",
            additionalInfo: "Complimentary herbal tea & mat provided.",
            isRecurring: item.is_recurring ?? item.isRecurring ?? true,
            features: item.features?.map((f) => f.feature) || [],
          };
        });
        setActivities(mapped);
        setSelectedActivity(mapped[0]);
      } else {
        setActivities([]);
        setSelectedActivity(null);
      }
    } catch (err: unknown) {
      setError(parseApiErrorMessage(err));
      setActivities([]);
      setSelectedActivity(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivitiesData();
  }, [fetchActivitiesData]);

  const filteredActivities =
    selectedCategory === "All Activities"
      ? activities
      : activities.filter((a) => a.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleSelectActivity = (act: Activity) => {
    setSelectedActivity(act);
  };

  const handleContinue = () => {
    if (!selectedActivity) return;

    const remaining = selectedActivity.maxParticipants - selectedActivity.bookedParticipants;
    if (remaining <= 0) return;

    updateStoredBookingData({
      serviceName: selectedActivity.name,
      serviceType: "activity",
      price: `€${selectedActivity.price}`,
      date: selectedActivity.date,
      timeSlot: `${selectedActivity.startTime} - ${selectedActivity.endTime}`,
      guestsCount: 1,
      totalAmount: selectedActivity.price,
      activityDetails: {
        id: selectedActivity.id,
        name: selectedActivity.name,
        category: selectedActivity.category,
        description: selectedActivity.description,
        date: selectedActivity.date,
        startTime: selectedActivity.startTime,
        endTime: selectedActivity.endTime,
        price: selectedActivity.price,
        maxParticipants: selectedActivity.maxParticipants,
        bookedParticipants: selectedActivity.bookedParticipants,
        teacherHost: selectedActivity.teacherHost,
        additionalInfo: selectedActivity.additionalInfo,
        isRecurring: selectedActivity.isRecurring,
      },
    });

    router.push("/booking/choose-time");
  };

  return (
    <div className="w-full px-6 md:px-12 max-w-7xl mx-auto">
      {/* ── Title Section ── */}
      <div className="text-center mb-12 flex flex-col items-center">
        <h1 className="font-displayPlayFair text-5xl text-[#1d1a17] mb-2 uppercase tracking-tight">
          Activities & Events
        </h1>
        <DecorativeUnderline />
        <p className="font-cambria text-sm text-[#475569] mt-6 italic max-w-2xl text-center">
          Experience transformative Yoga, Breathwork, Workshops, Special Classes, and Event Evenings led by expert hosts.
        </p>
      </div>

      {/* ── Category Filter Tabs ── */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              selectedCategory === cat
                ? "bg-[#8B7355] text-white shadow-md scale-[1.02]"
                : "bg-white text-[#475569] border border-[#E8E2DC] hover:border-[#8B7355] hover:text-[#8B7355]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Loading Alert ── */}
      {loading && (
        <div className="text-center py-12 text-[#8b7355] text-base font-medium">
          Loading activities & event sessions...
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && filteredActivities.length === 0 && (
        <div className="max-w-md mx-auto py-16 px-8 bg-white rounded-3xl border border-[#E8E2DC] shadow-xs text-center my-8">
          <div className="w-16 h-16 rounded-2xl bg-[#FCF2E9] text-[#8B7355] flex items-center justify-center mx-auto mb-4 shadow-xs">
            <FaInfoCircle size={28} />
          </div>
          <h3 className="font-displayPlayFair text-2xl font-bold text-[#0F172A] mb-2">
            No Activities Found
          </h3>
          <p className="text-xs text-[#64748B] mb-6 leading-relaxed">
            There are currently no activities available under &quot;{selectedCategory}&quot;. Please explore another category or view all sessions.
          </p>
          <button
            onClick={() => setSelectedCategory("All Activities")}
            className="px-6 py-3 rounded-xl bg-[#8B7355] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#725e45] transition-all shadow-md"
          >
            View All Activities
          </button>
        </div>
      )}

      {/* ── Activities Grid ── */}
      {!loading && filteredActivities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredActivities.map((act, idx) => {
            const isSelected = selectedActivity?.id === act.id;
            const remaining = act.maxParticipants - act.bookedParticipants;
            const isSoldOut = remaining <= 0;

            return (
              <div
                key={act.id}
                onClick={() => handleSelectActivity(act)}
                className={`bg-white rounded-3xl overflow-hidden shadow-sm border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "border-[#8B7355] ring-2 ring-[#8B7355]/30 shadow-lg transform -translate-y-1"
                    : "border-[#E8E2DC] hover:border-[#D1B191]"
                }`}
              >
                {/* Top Image Banner */}
                <div className="relative w-full h-48 bg-[#F5F0EB]">
                  <Image
                    src={act.image}
                    alt={act.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // Fallback image if remote URL fails
                      const target = e.target as HTMLImageElement;
                      target.src = fallbackImages[idx % fallbackImages.length];
                    }}
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-3 py-1 bg-white/95 backdrop-blur-md rounded-full text-[11px] font-bold text-[#8B7355] shadow-xs">
                      {act.category}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider ${
                        act.isRecurring ? "bg-[#8B7355]" : "bg-[#B8860B]"
                      }`}
                    >
                      {act.isRecurring ? "Recurring Class" : "One-Time Event"}
                    </span>
                  </div>

                  {isSoldOut ? (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                      <span className="px-4 py-1.5 bg-red-600 text-white font-bold text-xs uppercase rounded-full tracking-widest shadow-md">
                        Sold Out
                      </span>
                    </div>
                  ) : (
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg border border-[#E8E2DC] text-[11px] font-bold text-[#0F172A]">
                      {remaining} {remaining === 1 ? "place left" : "places remaining"}
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-displayPlayFair text-xl font-bold text-[#0F172A] mb-2 leading-snug">
                      {act.name}
                    </h3>
                    <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                      {act.description}
                    </p>
                  </div>

                  {/* Features / Highlights Section */}
                  <div className="border-t border-[#F1F5F9] pt-4 min-h-[48px] flex items-center">
                    {act.features && act.features.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {act.features.map((feat, fIdx) => (
                          <span
                            key={fIdx}
                            className="px-2.5 py-1 rounded-md bg-[#FCF2E9] text-[#8B7355] text-[11px] font-semibold border border-[#E8E2DC]"
                          >
                            ✓ {feat}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#94A3B8] italic">
                        Standard class access included
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-[#F1F5F9]">
                    <span className="text-2xl font-bold font-displayPlayFair text-[#8B7355]">
                      €{act.price} <span className="text-xs text-[#64748B] font-normal">/ person</span>
                    </span>

                    <div
                      className={`w-7 h-7 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? "bg-[#8B7355] border-[#8B7355] text-white"
                          : "border-[#CBD5E1] text-transparent"
                      }`}
                    >
                      <FaCheckCircle size={16} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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

        {selectedActivity && (
          <button
            onClick={handleContinue}
            className="px-12 py-4 rounded-xl bg-[#D1B191] hover:bg-[#C4A484] text-white font-bold text-sm flex items-center gap-3 transition-all shadow-lg transform translate-y-[-2px]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Continue
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
