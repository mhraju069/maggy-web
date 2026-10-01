"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { getStoredBookingData } from "@/lib/bookingStore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCheck, FaLock } from "react-icons/fa";
import { FaCakeCandles } from "react-icons/fa6";

export default function ConfirmationPage() {
  const [data, setData] = useState(getStoredBookingData());
  const [bookingRef] = useState(() => `LUNCH-${Math.floor(1000 + Math.random() * 9000)}`);

  useEffect(() => {
    setData(getStoredBookingData());
  }, []);

  const celebration = data.celebration;

  return (
    <div className="w-full px-6 md:px-12">
      {/* ── Icon Header ── */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 bg-[#8B735B] rounded-full flex items-center justify-center shadow-lg mb-6">
          <FaCheck className="text-white text-3xl" />
        </div>
        <h1 className="font-displayPlayFair text-5xl text-[#1d1a17] mb-4">Reservation Confirmed!</h1>
        <DecorativeUnderline />
        <p className="font-cambria text-sm text-[#475569] mt-6 italic tracking-wide">
          Your table is set. We look forward to welcoming you to the Lunchroom.
        </p>
      </div>

      {/* ── Confirmation Card ── */}
      <div className="max-w-4xl mx-auto bg-white rounded-[32px] overflow-hidden shadow-sm border border-[#E8E2DC]">
        <div className="p-10 space-y-8">
          {/* Top Section */}
          <div className="flex items-center gap-3 pb-6 border-b border-[#F1F5F9]">
            <div className="w-10 h-10 rounded-full bg-[#FCF2E9] flex items-center justify-center border border-[#E8E2DC]">
              <FaLock className="text-[#8B7355] text-sm" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider" style={{ fontFamily: "Inter, sans-serif" }}>
                Confirmed & Secured
              </h4>
              <p className="text-[11px] text-[#64748B]">Your table reservation has been saved in our system.</p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <span className="text-[10px] text-[#94A3B8] uppercase tracking-widest block mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                Booking Reference
              </span>
              <h2 className="text-3xl font-bold text-[#0F172A] font-displayPlayFair">{bookingRef}</h2>
            </div>

            <div>
              <span className="text-[10px] text-[#94A3B8] uppercase tracking-widest block mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                Guest Name
              </span>
              <p className="text-xl font-bold text-[#0F172A]">{data.name || "Valued Guest"}</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#F1F5F9]">
            <div>
              <span className="text-[10px] text-[#94A3B8] uppercase tracking-widest block mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                Experience
              </span>
              <h3 className="text-2xl font-bold text-[#0F172A] font-displayPlayFair">{data.serviceName || "Lunchroom Table Reservation"}</h3>
              <p className="text-base font-medium text-[#475569] mt-1">
                {data.date
                  ? new Date(data.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
                  : "Upcoming Date"}{" "}
                at {data.timeSlot || "09:00 AM"} • {data.guestsCount} {data.guestsCount === 1 ? "Person" : "People"}
              </p>
            </div>
          </div>

          {/* Celebration Card If Active */}
          {celebration?.isCelebrating && (
            <div className="bg-[#FCF2E9] p-6 rounded-2xl border border-[#E8E2DC] flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#8B7355] text-white flex items-center justify-center flex-shrink-0">
                <FaCakeCandles size={20} />
              </div>
              <div>
                <h4 className="font-bold text-[#0F172A] text-sm">Celebration Noted 🎉</h4>
                <p className="text-xs text-[#475569] mt-1">
                  We are excited to celebrate {celebration.occasion} for {celebration.celebrantName || "your special guest"}! Our team will prepare standard celebratory arrangements.
                </p>
              </div>
            </div>
          )}

          {/* Access / Walk-In Note */}
          <div className="bg-[#8B735B]/90 p-8 rounded-2xl text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-xl font-bold font-displayPlayFair mb-2">Opening Hours Reminder</h4>
              <p className="text-xs opacity-90 leading-relaxed max-w-lg">
                Wednesday through Sunday (09:00–16:00). Walk-ins are also welcome anytime! Please present your booking reference upon arrival.
              </p>
            </div>
          </div>

          {/* Confirmation Info */}
          <div className="pt-2">
            <span className="text-[10px] text-[#94A3B8] uppercase tracking-widest block mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
              Confirmation Email Sent To
            </span>
            <p className="text-base font-bold text-[#0F172A]">{data.email || "Your email"}</p>
          </div>
        </div>
      </div>

      {/* ── Footer Button ── */}
      <div className="flex justify-center mt-12 pb-16">
        <Link
          href="/booking"
          className="px-10 py-4 rounded-xl border border-[#CFB9A3] text-[#1d1a17] font-bold text-sm hover:bg-[#CFB9A3] hover:bg-opacity-10 transition-all flex items-center gap-3"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Book Another Experience
        </Link>
      </div>
    </div>
  );
}
