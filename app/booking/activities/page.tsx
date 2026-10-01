"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { Activity, getActivities } from "@/lib/activitiesStore";
import { updateStoredBookingData } from "@/lib/bookingStore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BiCalendar, BiUserCheck } from "react-icons/bi";
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

export default function ActivitiesBookingPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Activities");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  useEffect(() => {
    const loaded = getActivities();
    setActivities(loaded);
    if (loaded.length > 0) {
      setSelectedActivity(loaded[0]);
    }
  }, []);

  const filteredActivities =
    selectedCategory === "All Activities"
      ? activities
      : activities.filter((a) => a.category === selectedCategory);

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

      {/* ── Activities Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {filteredActivities.map((act) => {
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

                <div className="space-y-2 border-t border-[#F1F5F9] pt-4 text-xs text-[#475569]">
                  <div className="flex items-center gap-2">
                    <FaChalkboardTeacher className="text-[#8B7355] text-sm flex-shrink-0" />
                    <span>Host: <strong>{act.teacherHost}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <AiOutlineClockCircle className="text-[#8B7355] text-sm flex-shrink-0" />
                    <span>
                      {act.startTime} – {act.endTime} ({act.date})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <LuUsers className="text-[#8B7355] text-sm flex-shrink-0" />
                    <span>Max {act.maxParticipants} Participants</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-[#F1F5F9]">
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
