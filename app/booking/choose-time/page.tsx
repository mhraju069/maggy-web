"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { getStoredBookingData, updateStoredBookingData } from "@/lib/bookingStore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiInfoCircle, BiTimeFive } from "react-icons/bi";
import { FaWalking } from "react-icons/fa";

const defaultTimeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
];

export default function ChooseTimePage() {
  const [storedData, setStoredData] = useState(getStoredBookingData());
  const isLunchroom = storedData.serviceType === "lunchroom" || storedData.serviceName.toLowerCase().includes("lunchroom");

  const [date, setDate] = useState(storedData.date || "");
  const [selectedTime, setSelectedTime] = useState<string | null>(storedData.timeSlot || null);
  const [guests, setGuests] = useState(String(storedData.guestsCount || 2));
  const [dayError, setDayError] = useState<string | null>(null);

  useEffect(() => {
    const data = getStoredBookingData();
    setStoredData(data);
    if (data.date) setDate(data.date);
    if (data.timeSlot) setSelectedTime(data.timeSlot);
    if (data.guestsCount) setGuests(String(data.guestsCount));
  }, []);

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    if (isLunchroom && newDate) {
      const selected = new Date(newDate);
      const dayOfWeek = selected.getUTCDay(); // 0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri, 6: Sat
      if (dayOfWeek === 1 || dayOfWeek === 2) {
        setDayError("The Lunchroom is closed on Mondays & Tuesdays. Please pick Wednesday through Sunday (09:00–16:00).");
      } else {
        setDayError(null);
      }
    } else {
      setDayError(null);
    }

    updateStoredBookingData({ date: newDate });
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    updateStoredBookingData({ timeSlot: time });
  };

  const handleGuestsChange = (g: string) => {
    setGuests(g);
    updateStoredBookingData({ guestsCount: parseInt(g, 10) || 1 });
  };

  const isFormValid = date && selectedTime && (!isLunchroom || !dayError);

  return (
    <div className="w-full px-6 md:px-12">
      {/* ── Title Section ── */}
      <div className="text-center mb-12 flex flex-col items-center">
        <h1 className="font-displayPlayFair text-5xl text-[#1d1a17] mb-2 leading-tight">Choose Your Time</h1>
        <DecorativeUnderline />
        <p className="font-cambria text-sm text-[#475569] mt-6 italic tracking-wide">
          Select a date, time slot, and party size for {storedData.serviceName || "your reservation"}.
        </p>
      </div>

      {/* ── Lunchroom Hours & Walk-In Banner ── */}
      {isLunchroom && (
        <div className="max-w-4xl mx-auto mb-8 bg-white rounded-2xl p-6 border border-[#E8E2DC] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FCF2E9] flex items-center justify-center text-[#8B7355] flex-shrink-0">
              <BiTimeFive size={20} />
            </div>
            <div>
              <h4 className="font-bold text-[#0F172A] text-sm">Lunchroom Opening Hours</h4>
              <p className="text-xs text-[#8B7355] font-medium">Wednesday through Sunday • 09:00–16:00 (Mon & Tue Closed)</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#FCF2E9]/70 px-4 py-2 rounded-xl text-xs text-[#475569]">
            <FaWalking className="text-[#8B7355]" />
            <span>Walk-ins welcome anytime during opening hours!</span>
          </div>
        </div>
      )}

      {/* ── Private Sauna Cleaning Time Banner ── */}
      {storedData.serviceType === "sauna" && (
        <div className="max-w-4xl mx-auto mb-8 bg-white rounded-2xl p-6 border border-[#E8E2DC] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FCF2E9] flex items-center justify-center text-[#8B7355] flex-shrink-0">
              <BiTimeFive size={20} />
            </div>
            <div>
              <h4 className="font-bold text-[#0F172A] text-sm">
                Private Sauna ({storedData.durationHours || 3} Hours Session)
              </h4>
              <p className="text-xs text-[#8B7355] font-medium">
                Automatic 30-minute cleaning buffer reserved after your time slot.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#FCF2E9]/70 px-4 py-2 rounded-xl text-xs font-semibold text-[#8B7355]">
            <span>Total Blocked Period: {(storedData.durationHours || 3)}h 30m</span>
          </div>
        </div>
      )}

      {/* ── Content Card ── */}
      <div className="max-w-4xl mx-auto bg-white rounded-[32px] p-10 shadow-sm border border-[#E8E2DC]">
        <div className="space-y-10">
          {/* Date Picker */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-bold text-[#0F172A] uppercase tracking-wider" style={{ fontFamily: "Inter, sans-serif" }}>
                Date
              </label>
              {isLunchroom && (
                <span className="text-xs text-[#8B7355] font-semibold">Available: Wed – Sun</span>
              )}
            </div>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
                className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D1B191] text-[#475569] cursor-pointer ${
                  dayError ? "border-red-400 bg-red-50/30" : "border-[#E2E8F0]"
                }`}
              />
            </div>
            {dayError && (
              <p className="mt-2 text-xs font-semibold text-red-600 flex items-center gap-1">
                <BiInfoCircle /> {dayError}
              </p>
            )}
          </div>

          {/* Time Picker */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-bold text-[#0F172A] uppercase tracking-wider" style={{ fontFamily: "Inter, sans-serif" }}>
                Time Slot
              </label>
              {isLunchroom && (
                <span className="text-xs text-[#64748B]">Operating hours: 09:00 – 16:00</span>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {defaultTimeSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleTimeSelect(time)}
                  className={`py-4 rounded-xl border transition-all font-medium text-sm ${
                    selectedTime === time
                      ? "bg-[#D1B191] border-[#D1B191] text-white shadow-md shadow-[#D1B191]/20 font-bold scale-[1.02]"
                      : "bg-white border-[#E2E8F0] text-[#475569] hover:border-[#D1B191]"
                  }`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Guests Picker */}
          <div>
            <label className="block text-sm font-bold text-[#0F172A] mb-4 uppercase tracking-wider" style={{ fontFamily: "Inter, sans-serif" }}>
              Number of People / Guests
            </label>
            <select
              value={guests}
              onChange={(e) => handleGuestsChange(e.target.value)}
              className="w-full p-4 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D1B191] text-[#475569] bg-white cursor-pointer"
              style={{
                appearance: "none",
                backgroundImage:
                  "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 1rem center",
                backgroundSize: "1.2em",
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "Person" : "People"}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Footer Buttons ── */}
      <div className="max-w-4xl mx-auto mt-16 flex justify-between items-center bg-[#FBF6F3] p-8 rounded-2xl shadow-sm border border-[#E8E2DC]">
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

        <Link
          href="/booking/information"
          className={`px-12 py-4 rounded-xl text-white font-bold text-sm flex items-center gap-3 transition-all shadow-md ${
            isFormValid
              ? "bg-[#D1B191] hover:bg-[#C4A484] shadow-lg transform translate-y-[-2px]"
              : "bg-[#D1B191] opacity-50 cursor-not-allowed pointer-events-none"
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
