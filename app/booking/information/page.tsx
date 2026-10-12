"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { CelebrationData, getStoredBookingData, updateStoredBookingData } from "@/lib/bookingStore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiTimeFive } from "react-icons/bi";
import { FaWalking } from "react-icons/fa";
import { FaCakeCandles, FaGift, FaHeart } from "react-icons/fa6";

const occasionOptions = [
  "Birthday",
  "Anniversary",
  "Graduation",
  "Promotion / Career Milestone",
  "Baby Shower",
  "Engagement / Romantic Celebration",
  "Retirement",
  "Other Special Event",
];

export default function InformationPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    requests: "",
  });

  const [celebration, setCelebration] = useState<CelebrationData>({
    isCelebrating: false,
    occasion: "Birthday",
    celebrantName: "",
    age: "",
    hobbiesInterests: "",
    otherDetails: "",
  });

  const [storedData, setStoredData] = useState(getStoredBookingData());
  const isLunchroom = storedData.serviceType === "lunchroom" || storedData.serviceName.toLowerCase().includes("lunchroom");
  const isActivity = storedData.serviceType === "activity" || Boolean(storedData.activityDetails);

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("12:00");
  const [guestsCount, setGuestsCount] = useState(1);
  const [dayError, setDayError] = useState<string | null>(null);

  useEffect(() => {
    const data = getStoredBookingData();
    setStoredData(data);
    setDate(data.date || "");
    setTimeSlot(data.timeSlot || "12:00");
    setGuestsCount(data.guestsCount || (data.serviceType === "activity" ? 1 : 2));
    setFormData({
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      requests: data.requests || "",
    });
    if (data.celebration) {
      setCelebration(data.celebration);
    }
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

  const handleTimeChange = (newTime: string) => {
    setTimeSlot(newTime);
    updateStoredBookingData({ timeSlot: newTime });
  };

  const handleGuestsChange = (num: number) => {
    const valid = Math.max(1, num);
    setGuestsCount(valid);

    if (isActivity && storedData.activityDetails?.price) {
      const singlePrice = storedData.activityDetails.price;
      const calculatedTotal = singlePrice * valid;
      updateStoredBookingData({
        guestsCount: valid,
        totalAmount: calculatedTotal,
        price: `€${calculatedTotal}`,
      });
    } else {
      updateStoredBookingData({ guestsCount: valid });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      updateStoredBookingData(updated);
      return updated;
    });
  };

  const handleCelebrationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCelebration((prev) => {
      const updated = { ...prev, [name]: value };
      updateStoredBookingData({ celebration: updated });
      return updated;
    });
  };

  const toggleCelebrating = (isCelebrating: boolean) => {
    setCelebration((prev) => {
      const updated = { ...prev, isCelebrating };
      updateStoredBookingData({ celebration: updated });
      return updated;
    });
  };

  const isFormValid = isLunchroom
    ? Boolean(formData.name && formData.email && formData.phone && date && timeSlot && !dayError)
    : Boolean(formData.name && formData.email && formData.phone);

  return (
    <div className="w-full px-6 md:px-12">
      {/* ── Title Section ── */}
      <div className="text-center mb-16 flex flex-col items-center">
        <h1 className="font-displayPlayFair text-5xl text-[#1d1a17] mb-2 leading-tight">
          Your Information
        </h1>
        <DecorativeUnderline />
        <p className="font-cambria text-sm text-[#475569] mt-6 italic tracking-wide">
          Please provide your contact details & any special requests.
        </p>
      </div>

      {/* ── Content Card ── */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Table Reservation Details Card (Lunchroom Only) */}
        {isLunchroom && (
          <div className="bg-white rounded-[32px] p-10 shadow-sm border border-[#E8E2DC]">
            <h2
              className="text-xs font-bold text-[#64748B] uppercase tracking-[0.2em] mb-6"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Table Reservation Details
            </h2>

            {/* Opening Hours Banner */}
            <div className="mb-6 p-4 rounded-2xl bg-[#FCF2E9]/70 border border-[#E8E2DC]/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-[#8B7355]">
              <div className="flex items-center gap-2">
                <BiTimeFive className="text-lg flex-shrink-0" />
                <span><strong>Lunchroom Opening Hours:</strong> Wednesday through Sunday • 09:00–16:00 [Mon & Tue Closed]</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold bg-white/80 px-3 py-1.5 rounded-xl border border-[#E8E2DC] self-start md:self-auto">
                <FaWalking />
                <span>Walk-ins welcome anytime!</span>
              </div>
            </div>

            {dayError && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
                {dayError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Date */}
              <div>
                <label
                  className="block text-xs font-bold text-[#0F172A] mb-2 uppercase tracking-wider"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Reservation Date *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full p-4 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D1B191] text-[#475569] font-medium"
                />
              </div>

              {/* Preferred Time */}
              <div>
                <label
                  className="block text-xs font-bold text-[#0F172A] mb-2 uppercase tracking-wider"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Preferred Arrival Time *
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="w-full p-4 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D1B191] text-[#475569] font-medium bg-white cursor-pointer"
                >
                  <option value="09:00">09:00 AM</option>
                  <option value="09:30">09:30 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="10:30">10:30 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="11:30">11:30 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="12:30">12:30 PM</option>
                  <option value="13:00">01:00 PM</option>
                  <option value="13:30">01:30 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="14:30">02:30 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="15:30">03:30 PM</option>
                  <option value="16:00">04:00 PM</option>
                </select>
              </div>

              {/* Number of Guests */}
              <div>
                <label
                  className="block text-xs font-bold text-[#0F172A] mb-2 uppercase tracking-wider"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Number of Guests *
                </label>
                <select
                  value={guestsCount}
                  onChange={(e) => handleGuestsChange(parseInt(e.target.value, 10))}
                  className="w-full p-4 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D1B191] text-[#475569] font-medium bg-white cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Guest" : "Guests"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Activity Session Summary & Participants Card (Activity Only) */}
        {isActivity && storedData.activityDetails && (
          <div className="bg-white rounded-[32px] p-10 shadow-sm border border-[#E8E2DC]">
            <h2
              className="text-xs font-bold text-[#64748B] uppercase tracking-[0.2em] mb-6"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Activity Session Details
            </h2>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#FCF2E9] to-[#FBF6F3] border border-[#E8E2DC] mb-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B7355] block mb-1">
                {storedData.activityDetails.category}
              </span>
              <h3 className="text-2xl font-bold font-displayPlayFair text-[#0F172A] mb-2">
                {storedData.activityDetails.name}
              </h3>
              <p className="text-xs text-[#64748B] mb-4 leading-relaxed line-clamp-2">
                {storedData.activityDetails.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#E8E2DC]/80 text-xs text-[#475569]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8B7355] block">Date & Schedule</span>
                  <span className="font-semibold text-[#0F172A]">
                    {storedData.activityDetails.date ? new Date(storedData.activityDetails.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }) : "Upcoming"}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8B7355] block">Time Slot</span>
                  <span className="font-semibold text-[#0F172A]">
                    {storedData.activityDetails.startTime} - {storedData.activityDetails.endTime}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8B7355] block">Host / Guide</span>
                  <span className="font-semibold text-[#0F172A]">
                    {storedData.activityDetails.teacherHost || "Elena Rostova"}
                  </span>
                </div>
              </div>
            </div>

            {/* Participants Selection & Price Calculation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
              <div>
                <label
                  className="block text-xs font-bold text-[#0F172A] mb-2 uppercase tracking-wider"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Number of Participants / Tickets *
                </label>
                {(() => {
                  const maxAllowed = storedData.activityDetails?.availableSlots !== undefined
                    ? storedData.activityDetails.availableSlots
                    : Math.max(0, (storedData.activityDetails?.maxParticipants || 12) - (storedData.activityDetails?.bookedParticipants || 0));

                  if (maxAllowed <= 0) {
                    return (
                      <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
                        This session is currently Sold Out. Please choose another session.
                      </div>
                    );
                  }

                  return (
                    <select
                      value={guestsCount}
                      onChange={(e) => handleGuestsChange(parseInt(e.target.value, 10))}
                      className="w-full p-4 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D1B191] text-[#475569] font-medium bg-white cursor-pointer"
                    >
                      {Array.from({ length: Math.min(10, maxAllowed) }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Person" : "People"} (€{(storedData.activityDetails!.price * num).toFixed(2)})
                        </option>
                      ))}
                    </select>
                  );
                })()}
                <span className="text-[11px] text-[#64748B] mt-1.5 block">
                  €{storedData.activityDetails.price} per person
                </span>
              </div>

              <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-[#E2E8F0] flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#64748B] block mb-1">
                  Total Investment Due
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-displayPlayFair text-[#8B7355]">
                    €{(storedData.activityDetails.price * guestsCount).toFixed(2)}
                  </span>
                  <span className="text-xs text-[#94A3B8]">
                    ({guestsCount} {guestsCount === 1 ? "ticket" : "tickets"})
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Details Card */}
        <div className="bg-white rounded-[32px] p-10 shadow-sm border border-[#E8E2DC]">
          <h2
            className="text-xs font-bold text-[#64748B] uppercase tracking-[0.2em] mb-8"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Contact & Guest Details
          </h2>

          <div className="space-y-6">
            <div>
              <label
                className="block text-sm font-bold text-[#0F172A] mb-2 uppercase tracking-wider"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Sarah Jenkins"
                className="w-full p-4 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D1B191] text-[#475569]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-sm font-bold text-[#0F172A] mb-2 uppercase tracking-wider"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. sarah@example.com"
                  className="w-full p-4 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D1B191] text-[#475569]"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-bold text-[#0F172A] mb-2 uppercase tracking-wider"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full p-4 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D1B191] text-[#475569]"
                />
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-bold text-[#0F172A] mb-2 uppercase tracking-wider"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Comments or Special Requests (Optional)
              </label>
              <textarea
                name="requests"
                value={formData.requests}
                onChange={handleChange}
                rows={3}
                placeholder="Dietary requirements, seating preferences, allergies, or anything else we should know..."
                className="w-full p-4 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D1B191] text-[#475569] resize-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* ── Celebration Details Card (Lunchroom Only) ── */}
        {isLunchroom && (
          <div className="bg-white rounded-[32px] p-10 shadow-sm border border-[#E8E2DC] transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FCF2E9] flex items-center justify-center text-[#8B7355] flex-shrink-0">
                  <FaCakeCandles size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-displayPlayFair text-[#0F172A]">
                    Are you celebrating something?
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Birthdays, anniversaries, or special milestones
                  </p>
                </div>
              </div>

              {/* Yes / No Toggle */}
              <div className="inline-flex p-1 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => toggleCelebrating(true)}
                  className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    celebration.isCelebrating
                      ? "bg-[#8B7355] text-white shadow-sm"
                      : "text-[#64748B] hover:text-[#0F172A]"
                  }`}
                >
                  Yes 🎉
                </button>
                <button
                  type="button"
                  onClick={() => toggleCelebrating(false)}
                  className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    !celebration.isCelebrating
                      ? "bg-[#8B7355] text-white shadow-sm"
                      : "text-[#64748B] hover:text-[#0F172A]"
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Conditional Celebration Form */}
            {celebration.isCelebrating && (
              <div className="mt-8 pt-8 border-t border-[#F1F5F9] space-y-6 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-[#FCF2E9]/70 border border-[#E8E2DC]/80 flex items-center gap-3 text-xs text-[#8B7355] font-medium">
                  <FaGift className="text-base flex-shrink-0" />
                  <span>
                    Tell us a bit about the occasion so we can prepare a warm, personalized table experience for your guest of honor!
                  </span>
                </div>

                {/* What is being celebrated? */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block text-xs font-bold text-[#0F172A] mb-2 uppercase tracking-wider"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      What is being celebrated? *
                    </label>
                    <select
                      name="occasion"
                      value={celebration.occasion}
                      onChange={handleCelebrationChange}
                      className="w-full p-4 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D1B191] text-[#475569] bg-white cursor-pointer"
                    >
                      {occasionOptions.map((occ) => (
                        <option key={occ} value={occ}>
                          {occ}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Who is it for? */}
                  <div>
                    <label
                      className="block text-xs font-bold text-[#0F172A] mb-2 uppercase tracking-wider"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Who is it for? (Name of Celebrant) *
                    </label>
                    <input
                      type="text"
                      name="celebrantName"
                      value={celebration.celebrantName}
                      onChange={handleCelebrationChange}
                      placeholder="e.g. John / Mom / Alex"
                      className="w-full p-4 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D1B191] text-[#475569]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Age */}
                  <div>
                    <label
                      className="block text-xs font-bold text-[#0F172A] mb-2 uppercase tracking-wider"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Age / Milestone Number (Optional)
                    </label>
                    <input
                      type="text"
                      name="age"
                      value={celebration.age}
                      onChange={handleCelebrationChange}
                      placeholder="e.g. 30th Birthday / 25th Anniversary"
                      className="w-full p-4 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D1B191] text-[#475569]"
                    />
                  </div>

                  {/* Hobbies / Interests / Personal details */}
                  <div>
                    <label
                      className="block text-xs font-bold text-[#0F172A] mb-2 uppercase tracking-wider"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Hobbies / Interests or Personal Details
                    </label>
                    <input
                      type="text"
                      name="hobbiesInterests"
                      value={celebration.hobbiesInterests}
                      onChange={handleCelebrationChange}
                      placeholder="e.g. Loves chocolate, jazz music, coffee..."
                      className="w-full p-4 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D1B191] text-[#475569]"
                    />
                  </div>
                </div>

                {/* Any other relevant details */}
                <div>
                  <label
                    className="block text-xs font-bold text-[#0F172A] mb-2 uppercase tracking-wider"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Any Other Relevant Celebration Details
                  </label>
                  <textarea
                    name="otherDetails"
                    value={celebration.otherDetails}
                    onChange={handleCelebrationChange}
                    rows={3}
                    placeholder="e.g. Surprise party setup, special candle on dessert, favorite seating corner..."
                    className="w-full p-4 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D1B191] text-[#475569] resize-none text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Footer Buttons ── */}
      <div className="max-w-4xl mx-auto mt-16 flex justify-between items-center bg-[#FBF6F3] p-8 rounded-2xl shadow-sm border border-[#E8E2DC]">
        <button
          onClick={() => window.history.back()}
          className="px-10 py-4 rounded-xl border border-[#CFB9A3] text-[#1d1a17] font-bold text-sm hover:bg-[#CFB9A3] hover:bg-opacity-10 transition-all flex items-center gap-3"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back
        </button>

        <Link
          href="/booking/review"
          className={`px-12 py-4 rounded-xl font-bold text-sm flex items-center gap-3 transition-all ${
            isFormValid
              ? "bg-[#8B7355] hover:bg-[#786247] text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
              : "bg-[#E2E8F0] text-[#94A3B8] border border-[#CBD5E1] cursor-not-allowed pointer-events-none shadow-none opacity-80"
          }`}
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Continue
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </Link>
      </div>
    </div>
  );
}
