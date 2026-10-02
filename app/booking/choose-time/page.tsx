"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { getStoredBookingData, updateStoredBookingData } from "@/lib/bookingStore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiInfoCircle, BiTimeFive } from "react-icons/bi";
import { FaSpa, FaWalking } from "react-icons/fa";

const defaultTimeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
];

export interface SessionSlotInfo {
  slot: string;
  startTime: string;
  endTime: string;
  duration: string;
  changeover: string;
  totalCapacity: number;
  bookedPlaces: number;
}

const sharedSaunaSessions: SessionSlotInfo[] = [
  { slot: "06:00–07:30", startTime: "06:00 AM", endTime: "07:30 AM", duration: "1.5 Hours", changeover: "07:30–07:45", totalCapacity: 6, bookedPlaces: 1 },
  { slot: "07:45–09:15", startTime: "07:45 AM", endTime: "09:15 AM", duration: "1.5 Hours", changeover: "09:15–09:30", totalCapacity: 6, bookedPlaces: 3 },
  { slot: "09:30–11:00", startTime: "09:30 AM", endTime: "11:00 AM", duration: "1.5 Hours", changeover: "11:00–11:15", totalCapacity: 6, bookedPlaces: 4 },
  { slot: "11:15–12:45", startTime: "11:15 AM", endTime: "12:45 PM", duration: "1.5 Hours", changeover: "12:45–13:00", totalCapacity: 6, bookedPlaces: 6 },
  { slot: "13:00–14:30", startTime: "01:00 PM", endTime: "02:30 PM", duration: "1.5 Hours", changeover: "14:30–14:45", totalCapacity: 6, bookedPlaces: 2 },
  { slot: "14:45–16:15", startTime: "02:45 PM", endTime: "04:15 PM", duration: "1.5 Hours", changeover: "16:15–16:30", totalCapacity: 6, bookedPlaces: 0 },
  { slot: "16:30–18:00", startTime: "04:30 PM", endTime: "06:00 PM", duration: "1.5 Hours", changeover: "18:00–18:15", totalCapacity: 6, bookedPlaces: 5 },
  { slot: "18:15–19:45", startTime: "06:15 PM", endTime: "07:45 PM", duration: "1.5 Hours", changeover: "19:45–20:00", totalCapacity: 6, bookedPlaces: 2 },
  { slot: "20:00–21:30", startTime: "08:00 PM", endTime: "09:30 PM", duration: "1.5 Hours", changeover: "21:30–21:45", totalCapacity: 6, bookedPlaces: 1 },
  { slot: "21:45–23:15", startTime: "09:45 PM", endTime: "11:15 PM", duration: "1.5 Hours", changeover: "23:15–23:30", totalCapacity: 6, bookedPlaces: 0 },
];

export const saltRoomSessions: SessionSlotInfo[] = [
  { slot: "06:00–07:00", startTime: "06:00", endTime: "07:00", duration: "1 Hour", changeover: "07:00–07:10", totalCapacity: 2, bookedPlaces: 0 },
  { slot: "07:10–08:10", startTime: "07:10", endTime: "08:10", duration: "1 Hour", changeover: "08:10–08:20", totalCapacity: 2, bookedPlaces: 1 },
  { slot: "08:20–09:20", startTime: "08:20", endTime: "09:20", duration: "1 Hour", changeover: "09:20–09:30", totalCapacity: 2, bookedPlaces: 0 },
  { slot: "09:30–10:30", startTime: "09:30", endTime: "10:30", duration: "1 Hour", changeover: "10:30–10:40", totalCapacity: 2, bookedPlaces: 0 },
  { slot: "10:40–11:40", startTime: "10:40", endTime: "11:40", duration: "1 Hour", changeover: "11:40–11:50", totalCapacity: 2, bookedPlaces: 2 }, // Sold out
  { slot: "11:50–12:50", startTime: "11:50", endTime: "12:50", duration: "1 Hour", changeover: "12:50–13:00", totalCapacity: 2, bookedPlaces: 0 },
  { slot: "13:00–14:00", startTime: "13:00", endTime: "14:00", duration: "1 Hour", changeover: "14:00–14:10", totalCapacity: 2, bookedPlaces: 1 },
  { slot: "14:10–15:10", startTime: "14:10", endTime: "15:10", duration: "1 Hour", changeover: "15:10–15:20", totalCapacity: 2, bookedPlaces: 0 },
  { slot: "15:20–16:20", startTime: "15:20", endTime: "16:20", duration: "1 Hour", changeover: "16:20–16:30", totalCapacity: 2, bookedPlaces: 0 },
  { slot: "16:30–17:30", startTime: "16:30", endTime: "17:30", duration: "1 Hour", changeover: "17:30–17:40", totalCapacity: 2, bookedPlaces: 0 },
  { slot: "17:40–18:40", startTime: "17:40", endTime: "18:40", duration: "1 Hour", changeover: "18:40–18:50", totalCapacity: 2, bookedPlaces: 1 },
  { slot: "18:50–19:50", startTime: "18:50", endTime: "19:50", duration: "1 Hour", changeover: "19:50–20:00", totalCapacity: 2, bookedPlaces: 0 },
  { slot: "20:00–21:00", startTime: "20:00", endTime: "21:00", duration: "1 Hour", changeover: "21:00–21:10", totalCapacity: 2, bookedPlaces: 0 },
  { slot: "21:10–22:10", startTime: "21:10", endTime: "22:10", duration: "1 Hour", changeover: "22:10–22:20", totalCapacity: 2, bookedPlaces: 0 },
  { slot: "22:20–23:20", startTime: "22:20", endTime: "23:20", duration: "1 Hour", changeover: "Final Session", totalCapacity: 2, bookedPlaces: 0 },
];

export default function ChooseTimePage() {
  const [storedData, setStoredData] = useState(getStoredBookingData());
  const isLunchroom = storedData.serviceType === "lunchroom" || storedData.serviceName.toLowerCase().includes("lunchroom");
  const isSharedSauna = storedData.isSharedSauna || (storedData.serviceType === "sauna" && storedData.serviceName.toLowerCase().includes("shared"));
  const isSaltRoom = storedData.isSaltRoom || storedData.serviceType === "salt_room" || storedData.serviceName.toLowerCase().includes("salt");
  const isPrivateSauna = !isLunchroom && !isSharedSauna && !isSaltRoom && (storedData.serviceType === "sauna" || storedData.serviceName.toLowerCase().includes("private"));

  const [date, setDate] = useState(storedData.date || "");
  const [selectedTime, setSelectedTime] = useState<string | null>(storedData.timeSlot || null);
  const [guests, setGuests] = useState(String(storedData.guestsCount || 1));
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
      const dayOfWeek = selected.getUTCDay();
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

  const maxGuestsLimit = isSaltRoom ? 2 : 6;
  const guestOptions = Array.from({ length: maxGuestsLimit }, (_, i) => i + 1);

  return (
    <div className="w-full px-6 md:px-12">
      {/* ── Title Section ── */}
      <div className="text-center mb-12 flex flex-col items-center">
        <h1 className="font-displayPlayFair text-5xl text-[#1d1a17] mb-2 leading-tight">Choose Your Time</h1>
        <DecorativeUnderline />
        <p className="font-cambria text-sm text-[#475569] mt-6 italic tracking-wide">
          Select a date, session time slot, and party size for {storedData.serviceName || "your reservation"}.
        </p>
      </div>

      {/* ── Lunchroom Banner ── */}
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

      {/* ── Salt Room Banner ── */}
      {isSaltRoom && (
        <div className="max-w-4xl mx-auto mb-8 bg-white rounded-2xl p-6 border border-[#E8E2DC] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FCF2E9] flex items-center justify-center text-[#8B7355] flex-shrink-0">
              <FaSpa size={18} />
            </div>
            <div>
              <h4 className="font-bold text-[#0F172A] text-sm">
                Salt Room Session (1 Hour • €25 / Person)
              </h4>
              <p className="text-xs text-[#8B7355] font-medium">
                Maximum 2 people per session. Automatic 10-minute changeover buffer calculated between sessions (First start: 06:00, Last session: 22:20–23:20).
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="px-3 py-1 bg-[#8B7355] text-white text-xs font-bold rounded-lg shadow-xs">
              Max 2 People / Session
            </span>
            <span className="text-[11px] text-[#64748B] font-semibold">10-Min Auto Changeover</span>
          </div>
        </div>
      )}

      {/* ── Private Sauna Banner ── */}
      {isPrivateSauna && (
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
      <div className="max-w-4xl mx-auto bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-[#E8E2DC]">
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
                {isSaltRoom
                  ? "Select Salt Room Session (1 Hour Session + 10m Changeover)"
                  : isSharedSauna
                  ? "Select Shared Session Slot (1.5 Hours + 15m Changeover)"
                  : "Time Slot"}
              </label>
              {isLunchroom && (
                <span className="text-xs text-[#64748B]">Operating hours: 09:00 – 16:00</span>
              )}
            </div>

            {isSaltRoom ? (
              /* Salt Room 15 Specific Calculated Start Times with Changeovers */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {saltRoomSessions.map((sess) => {
                  const remaining = Math.max(0, sess.totalCapacity - sess.bookedPlaces);
                  const isSoldOut = remaining === 0;
                  const isSelected = selectedTime === sess.slot;

                  return (
                    <button
                      key={sess.slot}
                      type="button"
                      disabled={isSoldOut}
                      onClick={() => handleTimeSelect(sess.slot)}
                      className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? "bg-[#FCF2E9] border-[#8B7355] shadow-md ring-2 ring-[#8B7355]/20"
                          : isSoldOut
                          ? "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                          : "bg-white border-[#E2E8F0] hover:border-[#D1B191]"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-base font-bold font-displayPlayFair text-[#0F172A]">
                          {sess.slot}
                        </span>
                        {isSoldOut ? (
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[9px] font-bold rounded-full">
                            Full (0/2)
                          </span>
                        ) : (
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${
                            remaining === 1 ? "bg-amber-100 text-amber-800 border-amber-300" : "bg-emerald-50 text-emerald-700 border-emerald-300"
                          }`}>
                            {remaining} {remaining === 1 ? "spot left" : "spots left"}
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] text-[#64748B] block">
                        1h session • Changeover ({sess.changeover})
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : isSharedSauna ? (
              /* Shared Sauna 10 Time Slots */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sharedSaunaSessions.map((sess) => {
                  const remaining = Math.max(0, sess.totalCapacity - sess.bookedPlaces);
                  const isSoldOut = remaining === 0;
                  const isSelected = selectedTime === sess.slot;

                  return (
                    <button
                      key={sess.slot}
                      type="button"
                      disabled={isSoldOut}
                      onClick={() => handleTimeSelect(sess.slot)}
                      className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-[#FCF2E9] border-[#8B7355] shadow-md ring-2 ring-[#8B7355]/20"
                          : isSoldOut
                          ? "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                          : "bg-white border-[#E2E8F0] hover:border-[#D1B191]"
                      }`}
                    >
                      <div>
                        <span className="text-base font-bold font-displayPlayFair text-[#0F172A] block">
                          {sess.slot}
                        </span>
                        <span className="text-[11px] text-[#64748B]">
                          1.5h session • 15m changeover buffer ({sess.changeover})
                        </span>
                      </div>

                      <div className="text-right flex flex-col items-end">
                        {isSoldOut ? (
                          <span className="px-2.5 py-1 bg-rose-100 text-rose-700 text-[10px] font-bold rounded-full">
                            Fully Booked (0/6)
                          </span>
                        ) : (
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                            remaining <= 2 ? "bg-amber-100 text-amber-800 border-amber-300" : "bg-emerald-50 text-emerald-700 border-emerald-300"
                          }`}>
                            {remaining} {remaining === 1 ? "place" : "places"} remaining
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Standard Time Slots Grid */
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
            )}
          </div>

          {/* Guests Picker */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-bold text-[#0F172A] uppercase tracking-wider" style={{ fontFamily: "Inter, sans-serif" }}>
                Number of People / Places {isSaltRoom && "(Max 2 People)"}
              </label>
              {isSaltRoom && (
                <span className="text-xs font-semibold text-[#8B7355]">Salt Room limit: Max 2 guests</span>
              )}
            </div>

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
              {guestOptions.map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "Person / Place" : "People / Places"} (
                  {isSaltRoom
                    ? `€${n * 25}`
                    : `€${(n * (isSharedSauna ? 19.95 : 35)).toFixed(2)}`}
                  )
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Footer Navigation Buttons ── */}
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
