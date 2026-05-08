"use client";

import ActivityCard from "@/components/shared/ActivityCard";
import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import Link from "next/link";
import { useState } from "react";

const activities = [
  {
    name: "Morning Flow Yoga",
    time: "8:00 AM - 9:00 AM",
    capacity: "12 people",
    location: "Movement Studio",
    duration: "60 minutes",
    price: "€40",
    image: "/images/activities/weeklyschedule/img1.png",
  },
  {
    name: "Transformational Breathwork",
    time: "8:00 AM - 9:00 AM",
    capacity: "12 people",
    location: "Movement Studio",
    duration: "60 minutes",
    price: "€40",
    image: "/images/activities/weeklyschedule/img2.png",
  },
  {
    name: "Guided Meditation",
    time: "8:00 AM - 9:00 AM",
    capacity: "12 people",
    location: "Movement Studio",
    duration: "60 minutes",
    price: "€40",
    image: "/images/activities/weeklyschedule/img3.png",
  },
  {
    name: "Restorative Yoga",
    time: "8:00 AM - 9:00 AM",
    capacity: "12 people",
    location: "Movement Studio",
    duration: "60 minutes",
    price: "€40",
    image: "/images/activities/weeklyschedule/img4.png",
  },
  {
    name: "Sound Healing Circle",
    time: "8:00 AM - 9:00 AM",
    capacity: "12 people",
    location: "Movement Studio",
    duration: "60 minutes",
    price: "€40",
    image: "/images/activities/weeklyschedule/img5.png",
  },
  {
    name: "Mindfulness Workshop",
    time: "8:00 AM - 9:00 AM",
    capacity: "12 people",
    location: "Movement Studio",
    duration: "60 minutes",
    price: "€40",
    image: "/images/activities/weeklyschedule/img6.png",
  },
];

export default function ActivitiesBookingPage() {
  const [selectedNames, setSelectedNames] = useState<string[]>([]);

  const toggleSelection = (name: string) => {
    setSelectedNames((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  return (
    <div className="w-full px-6 md:px-12">
      {/* ── Title Section ── */}
      <div className="text-center mb-16 flex flex-col items-center">
        <h1 className="font-displayPlayFair text-5xl text-[#1d1a17] mb-2 uppercase tracking-tight">Activities</h1>
        <DecorativeUnderline />
        <p className="font-cambria text-sm text-[#475569] mt-6 italic">Guided classes that unite body and mind through mindful practice.</p>
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {activities.map((activity) => (
          <ActivityCard
            key={activity.name}
            activity={activity}
            isSelected={selectedNames.includes(activity.name)}
            onClick={() => toggleSelection(activity.name)}
          />
        ))}
      </div>

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
            selectedNames.length > 0 ? "bg-[#D1B191] hover:bg-[#C4A484] shadow-lg transform translate-y-[-2px]" : "bg-[#D1B191] opacity-50 cursor-not-allowed pointer-events-none"
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
