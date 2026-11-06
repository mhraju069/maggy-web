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
import { useLanguage } from "@/lib/i18n/LanguageContext";

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
  const { language, t } = useLanguage();
  const flow = (t as any)?.bookingFlow;
  const btnTrans = flow?.buttons;

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

          // Language-aware title & description
          const localizedTitle =
            language === "nl"
              ? item.title_nl || item.title || item.name
              : language === "de"
              ? item.title_de || item.title || item.name
              : item.title_en || item.title || item.name;

          const localizedDesc =
            language === "nl"
              ? item.description_nl || item.description
              : language === "de"
              ? item.description_de || item.description
              : item.description_en || item.description;

          const localizedNotes =
            language === "nl"
              ? item.additional_notes_nl || item.additional_notes || localizedDesc
              : language === "de"
              ? item.additional_notes_de || item.additional_notes || localizedDesc
              : item.additional_notes_en || item.additional_notes || localizedDesc;

          // Format session times
          const startTime = item.open_time
            ? item.open_time.slice(0, 5)
            : item.start_time
            ? item.start_time.slice(0, 5)
            : item.startTime || "10:00";
          const endTime = item.close_time
            ? item.close_time.slice(0, 5)
            : item.end_time
            ? item.end_time.slice(0, 5)
            : item.endTime || "11:30";

          const maxCapacity = item.capacity ?? item.max_participants ?? item.maxParticipants ?? 12;
          const bookedCount = item.booked_slots ?? item.booked_participants ?? item.bookedParticipants ?? 0;
          const availableCount = item.available_slots !== undefined ? item.available_slots : Math.max(0, maxCapacity - bookedCount);
          const hostName = item.host || item.teacher_host || item.teacherHost || "Elena Rostova";
          const notes = localizedNotes || "Complimentary herbal tea & mat provided.";
          const available = (item.is_available ?? true) && availableCount > 0;

          return {
            id: String(item.id ?? idx),
            name: localizedTitle || "Mindful Session",
            category: item.category || defaultCategory,
            description:
              localizedDesc ||
              "Transformative session designed to center the mind, cultivate stillness, and revitalize the body.",
            image: formatImageUrl(
              item.images || item.image,
              fallbackImages[idx % fallbackImages.length]
            ),
            date: item.date || "2026-10-15",
            startTime,
            endTime,
            price: rawPrice,
            maxParticipants: maxCapacity,
            bookedParticipants: bookedCount,
            availableSlots: availableCount,
            bookedSlots: bookedCount,
            teacherHost: hostName,
            additionalInfo: notes,
            isRecurring: item.is_recurring ?? item.isRecurring ?? true,
            features: item.features?.map((f: any) => {
              if (typeof f === "string") return f;
              if (language === "nl" && f.feature_nl) return f.feature_nl;
              if (language === "de" && f.feature_de) return f.feature_de;
              return f.feature_en || f.feature;
            }) || [],
            isAvailable: available,
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
  }, [language]);

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

    const remaining = selectedActivity.availableSlots !== undefined ? selectedActivity.availableSlots : selectedActivity.maxParticipants - selectedActivity.bookedParticipants;
    if (remaining <= 0 || selectedActivity.isAvailable === false) return;

    updateStoredBookingData({
      serviceName: selectedActivity.name,
      serviceType: "activity",
      price: `€${selectedActivity.price}`,
      date: selectedActivity.date,
      timeSlot: `${selectedActivity.startTime} - ${selectedActivity.endTime}`,
      guestsCount: 1,
      totalAmount: selectedActivity.price,
      selectedExtras: [],
      durationHours: undefined,
      isSharedSauna: false,
      isSaltRoom: false,
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
        availableSlots: selectedActivity.availableSlots,
        bookedSlots: selectedActivity.bookedSlots,
      },
    });

    router.push("/booking/information");
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

      {/* ── Category Filter Tabs (Commented Out) ── */}
      {/*
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
      */}

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
            const remaining = act.availableSlots !== undefined ? act.availableSlots : act.maxParticipants - act.bookedParticipants;
            const isSoldOut = remaining <= 0 || act.isAvailable === false;

            return (
              <div
                key={act.id}
                onClick={() => !isSoldOut && handleSelectActivity(act)}
                className={`bg-white rounded-3xl overflow-hidden shadow-sm border transition-all flex flex-col justify-between ${
                  isSoldOut
                    ? "opacity-75 cursor-not-allowed border-[#E2E8F0]"
                    : "cursor-pointer"
                } ${
                  isSelected && !isSoldOut
                    ? "border-[#8B7355] ring-2 ring-[#8B7355]/30 shadow-lg transform -translate-y-1"
                    : "border-[#E8E2DC] hover:border-[#D1B191]"
                }`}
              >
                {/* Top Image Banner */}
                <div className="relative w-full h-52 bg-[#F5F0EB]">
                  <Image
                    src={act.image}
                    alt={act.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = fallbackImages[idx % fallbackImages.length];
                    }}
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                    {/* <span className="px-3 py-1 bg-white/95 backdrop-blur-md rounded-full text-[11px] font-bold text-[#8B7355] shadow-xs">
                      {act.category}
                    </span> */}
                    {/* <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider ${
                        act.isRecurring ? "bg-[#8B7355]" : "bg-[#B8860B]"
                      }`}
                    >
                      {act.isRecurring ? "Recurring Class" : "One-Time Event"}
                    </span> */}
                  </div>

                  {isSoldOut ? (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                      <span className="px-4 py-1.5 bg-red-600 text-white font-bold text-xs uppercase rounded-full tracking-widest shadow-md">
                        Sold Out
                      </span>
                    </div>
                  ) : (
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg border border-[#E8E2DC] text-[11px] font-bold text-[#0F172A] flex items-center gap-1.5 shadow-xs">
                      <LuUsers className="text-[#8B7355]" size={13} />
                      <span>{remaining <= 5 ? `Only ${remaining} ${remaining === 1 ? "spot" : "spots"} left` : `${remaining} spots remaining`}</span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-displayPlayFair text-xl font-bold text-[#0F172A] mb-2 leading-snug">
                      {act.name}
                    </h3>
                    <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed mb-3">
                      {act.description}
                    </p>

                    {/* Schedule, Host & Capacity Info Badges */}
                    <div className="space-y-2 py-3 border-y border-[#F1F5F9] text-xs text-[#475569]">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 font-medium">
                          <AiOutlineClockCircle className="text-[#8B7355] text-sm flex-shrink-0" />
                          <span>
                            {act.date ? new Date(act.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""} • {act.startTime} - {act.endTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#64748B] bg-[#F8FAFC] px-2.5 py-1 rounded-md border border-[#E2E8F0]">
                          <LuUsers size={12} className="text-[#8B7355]" />
                          <span>Max {act.maxParticipants}</span>
                        </div>
                      </div>

                      {act.teacherHost && (
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#8B7355]">
                          <FaChalkboardTeacher className="flex-shrink-0" />
                          <span>Host: {act.teacherHost}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features / Highlights Section */}
                  <div className="min-h-[44px] flex flex-col justify-center">
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
                    ) : act.additionalInfo ? (
                      <div className="text-[11px] text-[#64748B] italic flex items-center gap-1.5">
                        <FaInfoCircle className="text-[#8B7355] flex-shrink-0" size={11} />
                        <span className="line-clamp-1">{act.additionalInfo}</span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#94A3B8] italic">
                        Standard session access included
                      </span>
                    )}
                  </div>

                  {/* Price & Selection Indicator */}
                  <div className="flex justify-between items-center pt-3 border-t border-[#F1F5F9]">
                    <span className="text-2xl font-bold font-displayPlayFair text-[#8B7355]">
                      €{act.price} <span className="text-xs text-[#64748B] font-normal">{(t as any)?.commonUI?.perPerson || "/ person"}</span>
                    </span>

                    <div
                      className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                        isSelected && !isSoldOut
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
      <div className="max-w-7xl mx-auto mt-8 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-[#FBF6F3] p-4 sm:p-8 rounded-2xl shadow-sm border border-[#E8E2DC]">
        <Link
          href="/booking"
          className="w-full sm:w-auto justify-center px-6 sm:px-10 py-3.5 sm:py-4 rounded-xl border border-[#CFB9A3] text-[#1d1a17] font-bold text-sm hover:bg-[#CFB9A3] hover:bg-opacity-10 transition-all flex items-center gap-3"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          {btnTrans?.back || "Back to Experiences"}
        </Link>

        {selectedActivity && (
          <button
            onClick={handleContinue}
            className="w-full sm:w-auto justify-center px-6 sm:px-12 py-3.5 sm:py-4 rounded-xl bg-[#D1B191] hover:bg-[#C4A484] text-white font-bold text-sm flex items-center gap-3 transition-all shadow-lg transform sm:translate-y-[-2px]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {btnTrans?.continue || "Continue"}
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
