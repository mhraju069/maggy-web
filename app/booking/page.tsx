"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineAutoAwesome, MdOutlineHotTub, MdOutlineRestaurantMenu, MdOutlineSelfImprovement } from "react-icons/md";

const categories = [
  {
    id: "sauna",
    title: "Sauna & Wellness",
    slogan: "Heat. Release. Renew.",
    description: "Experience the transformative power of heat therapy in private or shared sanctuaries.",
    image: "/images/booking/sauna.png",
    icon: <MdOutlineHotTub className="w-6 h-6" />,
    href: "/booking/sauna",
  },
  {
    id: "arrangements",
    title: "Arrangements",
    slogan: "Curated journeys of renewal",
    description: "Multi-sensory experiences thoughtfully designed to restore balance and vitality.",
    image: "/images/booking/arrangement.png",
    icon: <MdOutlineAutoAwesome className="w-6 h-6" />,
    href: "/booking/arrangements",
  },
  {
    id: "activities",
    title: "Activities",
    slogan: "Movement. Breath. Flow.",
    description: "Guided classes that unite body and mind through mindful practice.",
    image: "/images/booking/activity.png",
    icon: <MdOutlineSelfImprovement className="w-6 h-6" />,
    href: "/booking/activities",
  },
  {
    id: "lunchroom",
    title: "Lunchroom",
    slogan: "Nourishment for body and soul",
    description: "Seasonal, organic cuisine crafted to complement your wellness journey.",
    image: "/images/booking/lunchroom.png",
    icon: <MdOutlineRestaurantMenu className="w-6 h-6" />,
    href: "/booking/lunchroom",
  },
];

export default function BookingCategoryPage() {
  return (
    <div className="w-full px-6 md:px-12">
      {/* ── Title Section ── */}
      <div className="text-center mb-16 flex flex-col items-center">
        <h1 className="font-displayPlayFair text-5xl text-[#1d1a17] mb-2">Choose Your Experience</h1>
        <DecorativeUnderline />
        <p className="font-cambria text-sm text-[#475569] mt-6 italic">A carefully curated moment, designed around you.</p>
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {categories.map((cat) => (
          <Link key={cat.id} href={cat.href} className="group cursor-pointer">
            <div className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[#E8E2DC] flex flex-col h-full">
              {/* Image Section */}
              <div className="relative h-80 w-full overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500" />

                {/* Overlay Text */}
                <div className="absolute inset-x-0 bottom-0 p-10 text-white">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center">
                      {cat.icon}
                    </div>
                    <div>
                      <h3 className="font-displayPlayFair text-4xl mb-1 leading-tight">{cat.title}</h3>
                      <p className="text-sm font-medium opacity-90 tracking-wide uppercase">{cat.slogan}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="p-10 flex-grow">
                <p className="font-cambria text-[#475569] text-lg leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Footer Buttons ── */}
      <div className="max-w-6xl mx-auto mt-16 flex justify-between items-center bg-[#FBF6F3] p-8 rounded-2xl shadow-sm border border-[#E8E2DC]">
        <button
          onClick={() => window.history.back()}
          className="px-10 py-4 rounded-xl border border-[#CFB9A3] text-[#1d1a17] font-bold text-sm hover:bg-[#CFB9A3] hover:bg-opacity-10 transition-all flex items-center gap-3"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back
        </button>

        <button
          disabled
          className="px-12 py-4 rounded-xl bg-[#D1B191] opacity-50 text-white font-bold text-sm cursor-not-allowed flex items-center gap-3 transition-all shadow-md"
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
