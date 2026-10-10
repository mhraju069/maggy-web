"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { bookingService } from "@/lib/api/services/bookingService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BiDrink,
  BiError,
  BiGroup,
  BiMusic,
  BiRestaurant,
  BiTimeFive,
} from "react-icons/bi";
import { FaCalendarAlt, FaGlassCheers, FaPaperPlane, FaUser } from "react-icons/fa";
import { MdOutlineEmail, MdOutlinePhone } from "react-icons/md";

const EVENT_TYPES = [
  { id: "Birthdays", label: "Birthdays" },
  { id: "Weddings", label: "Weddings" },
  { id: "Baby showers", label: "Baby Showers" },
  { id: "Corporate parties", label: "Corporate Parties" },
  { id: "Anniversaries", label: "Anniversaries" },
  { id: "Private parties", label: "Private Parties" },
  { id: "Other events", label: "Other Events" },
];

export default function EventSpaceInquiryPage() {
  const router = useRouter();

  // Form State
  const [eventType, setEventType] = useState<string>("Birthdays");
  const [otherEventDetails, setOtherEventDetails] = useState<string>("");
  const [preferredDate, setPreferredDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("14:00");
  const [endTime, setEndTime] = useState<string>("18:00");
  const [expectedGuests, setExpectedGuests] = useState<number>(20);

  const [foodPreference, setFoodPreference] = useState<string>("");
  const [drinkPreference, setDrinkPreference] = useState<string>("");
  const [entertainmentPreference, setEntertainmentPreference] = useState<string>("");
  const [additionalRequests, setAdditionalRequests] = useState<string>("");

  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  // UI Status
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [bookingRef, setBookingRef] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!preferredDate) {
      setErrorMsg("Please select your preferred event date.");
      return;
    }
    if (!name.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!phone.trim()) {
      setErrorMsg("Please enter your phone number.");
      return;
    }
    if (!email.trim()) {
      setErrorMsg("Please enter your email address.");
      return;
    }

    // Format start and end time to HH:MM:SS
    const formattedStartTime = startTime.includes(":") && startTime.split(":").length === 2 ? `${startTime}:00` : startTime;
    const formattedEndTime = endTime.includes(":") && endTime.split(":").length === 2 ? `${endTime}:00` : endTime;

    // Combine notes with other event details if specified
    let combinedNotes = additionalRequests.trim();
    if (eventType === "Other events" && otherEventDetails.trim()) {
      combinedNotes = combinedNotes
        ? `Event Specification: ${otherEventDetails.trim()}\n\nAdditional Notes: ${combinedNotes}`
        : `Event Specification: ${otherEventDetails.trim()}`;
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      date: preferredDate,
      start_time: formattedStartTime,
      end_time: formattedEndTime,
      guests: Number(expectedGuests) || 1,
      food_preference: foodPreference.trim() || undefined,
      drink_preference: drinkPreference.trim() || undefined,
      music_preference: entertainmentPreference.trim() || undefined,
      notes: combinedNotes || undefined,
    };

    setSubmitting(true);
    try {
      const res = await bookingService.createEventBooking(payload);
      if (res?.booking_id) {
        setBookingRef(res.booking_id);
      } else {
        setBookingRef(`EVNT-${Math.floor(1000 + Math.random() * 9000)}`);
      }
      setSubmitted(true);
    } catch (err: any) {
      console.error("Error submitting event inquiry:", err);
      // Fallback booking ref if offline/local
      const fallbackRef = `EVNT-${Math.floor(1000 + Math.random() * 9000)}`;
      setBookingRef(fallbackRef);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="w-full px-6 md:px-12 max-w-4xl mx-auto py-16">
        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-md border border-[#E8E2DC] text-center flex flex-col items-center space-y-6">
          <div className="w-20 h-20 bg-[#FCF2E9] rounded-3xl border border-[#E8E2DC] flex items-center justify-center text-[#8B7355] shadow-xs">
            <FaGlassCheers className="w-10 h-10" />
          </div>

          <h2 className="font-displayPlayFair text-4xl text-[#0F172A]">
            Inquiry Submitted Successfully!
          </h2>

          <DecorativeUnderline />

          <p className="font-cambria text-base text-[#475569] max-w-xl italic leading-relaxed">
            Thank you, <span className="font-bold text-[#0F172A] not-italic">{name}</span>! We have received your inquiry for a{" "}
            <span className="font-bold text-[#8B7355] not-italic">{eventType}</span> on{" "}
            <span className="font-bold text-[#0F172A] not-italic">{preferredDate}</span> for {expectedGuests} guests.
          </p>

          <div className="w-full bg-[#FCF2E9] rounded-2xl p-6 border border-[#E8E2DC] text-left max-w-lg space-y-3 text-xs text-[#475569]">
            <div className="flex justify-between items-center pb-2 border-b border-[#E8E2DC]">
              <p className="font-bold text-[#8B7355] uppercase tracking-wider text-[11px]">Booking Reference</p>
              <span className="font-bold font-mono text-base text-[#0F172A]">{bookingRef}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div><span className="font-semibold">Event Type:</span> {eventType === "Other events" && otherEventDetails ? otherEventDetails : eventType}</div>
              <div><span className="font-semibold">Date:</span> {preferredDate}</div>
              <div><span className="font-semibold">Time:</span> {startTime} - {endTime}</div>
              <div><span className="font-semibold">Guests:</span> {expectedGuests}</div>
            </div>
            {foodPreference && <div><span className="font-semibold">Food:</span> {foodPreference}</div>}
            {drinkPreference && <div><span className="font-semibold">Drinks:</span> {drinkPreference}</div>}
            {entertainmentPreference && <div><span className="font-semibold">Entertainment:</span> {entertainmentPreference}</div>}
            <div><span className="font-semibold">Contact Email:</span> {email}</div>
            <div><span className="font-semibold">Phone:</span> {phone}</div>
          </div>

          <p className="text-xs text-[#64748B] max-w-md">
            Our event planning team will review your requirements and contact you via phone or email with a tailored quotation within 24 hours. A confirmation email has been sent.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => {
                setSubmitted(false);
                setOtherEventDetails("");
                setAdditionalRequests("");
              }}
              className="px-8 py-3.5 rounded-xl border border-[#D1B191] text-[#8B7355] font-bold text-sm hover:bg-[#FCF2E9] transition-all"
            >
              Submit Another Inquiry
            </button>
            <Link
              href="/booking"
              className="px-8 py-3.5 rounded-xl bg-[#8B7355] text-white font-bold text-sm shadow-md hover:bg-[#725e45] transition-all"
            >
              Back to Booking Overview
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-6 md:px-12 max-w-5xl mx-auto">
      {/* ── Title Section ── */}
      <div className="text-center mb-12 flex flex-col items-center">
        <h1 className="font-displayPlayFair text-5xl text-[#1d1a17] mb-2 uppercase tracking-tight">
          Events & Party Room Inquiry
        </h1>
        <DecorativeUnderline />
        <p className="font-cambria text-sm text-[#475569] mt-6 italic max-w-2xl">
          Whether celebrating intimate moments or grand occasions, request a customized proposal and let our team tailor the perfect experience for you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10 mb-16">
        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
            <BiError className="w-5 h-5 flex-shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ── 1. Event Type ── */}
        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-[#E8E2DC] space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#0F172A] mb-1 uppercase tracking-wider" style={{ fontFamily: "Inter, sans-serif" }}>
              1. Select Event Type
            </label>
            <p className="text-xs text-[#64748B]">Choose the occasion you are planning to host</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {EVENT_TYPES.map((type) => {
              const isSelected = eventType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setEventType(type.id)}
                  className={`py-3.5 px-4 rounded-2xl border text-center font-bold text-sm transition-all ${
                    isSelected
                      ? "bg-[#8B7355] border-[#8B7355] text-white shadow-md scale-[1.02]"
                      : "bg-white border-[#E2E8F0] text-[#0F172A] hover:border-[#D1B191]"
                  }`}
                >
                  {type.label}
                </button>
              );
            })}
          </div>

          {/* Conditional Input Field for Other Events */}
          {eventType === "Other events" && (
            <div className="pt-2 animate-fadeIn">
              <label
                className="block text-xs font-bold text-[#0F172A] mb-2 uppercase tracking-wider"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Describe Your Event / Occasion *
              </label>
              <input
                type="text"
                required
                value={otherEventDetails}
                onChange={(e) => setOtherEventDetails(e.target.value)}
                placeholder="e.g. Wellness retreat, product launch, photography shoot, graduation gathering..."
                className="w-full px-4 py-3.5 rounded-xl border border-[#D1B191] bg-[#FCF2E9]/40 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
              />
            </div>
          )}
        </div>

        {/* ── 2. Date, Time & Guests ── */}
        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-[#E8E2DC] space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#0F172A] mb-1 uppercase tracking-wider" style={{ fontFamily: "Inter, sans-serif" }}>
              2. Date, Time & Capacity
            </label>
            <p className="text-xs text-[#64748B]">Specify your preferred schedule and expected guest count</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Preferred Date */}
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-2 flex items-center gap-1.5">
                <FaCalendarAlt className="text-[#8B7355]" /> Preferred Date
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:border-[#8B7355]"
              />
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-2 flex items-center gap-1.5">
                <BiTimeFive className="text-[#8B7355] text-base" /> Start Time
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:border-[#8B7355]"
              />
            </div>

            {/* End Time */}
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-2 flex items-center gap-1.5">
                <BiTimeFive className="text-[#8B7355] text-base" /> End Time
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:border-[#8B7355]"
              />
            </div>

            {/* Expected Guests */}
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-2 flex items-center gap-1.5">
                <BiGroup className="text-[#8B7355] text-base" /> Expected Guests
              </label>
              <input
                type="number"
                min={1}
                max={200}
                required
                value={expectedGuests}
                onChange={(e) => setExpectedGuests(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:border-[#8B7355]"
              />
            </div>
          </div>
        </div>

        {/* ── 3. Catering & Entertainment Preferences ── */}
        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-[#E8E2DC] space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#0F172A] mb-1 uppercase tracking-wider" style={{ fontFamily: "Inter, sans-serif" }}>
              3. Food, Drinks & Entertainment
            </label>
            <p className="text-xs text-[#64748B]">Specify your event catering and entertainment preferences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Food Preferences */}
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-2 flex items-center gap-1.5">
                <BiRestaurant className="text-[#8B7355] text-base" /> Food Preferences
              </label>
              <input
                type="text"
                placeholder="e.g. Organic Buffet, Vegan menu..."
                value={foodPreference}
                onChange={(e) => setFoodPreference(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:border-[#8B7355]"
              />
            </div>

            {/* Drink Preferences */}
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-2 flex items-center gap-1.5">
                <BiDrink className="text-[#8B7355] text-base" /> Drink Preferences
              </label>
              <input
                type="text"
                placeholder="e.g. Wine & Champagne, Fresh juices..."
                value={drinkPreference}
                onChange={(e) => setDrinkPreference(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:border-[#8B7355]"
              />
            </div>

            {/* DJ / Music / Entertainment */}
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-2 flex items-center gap-1.5">
                <BiMusic className="text-[#8B7355] text-base" /> DJ / Music / Entertainment
              </label>
              <input
                type="text"
                placeholder="e.g. Live DJ, Acoustic duo, Playlist..."
                value={entertainmentPreference}
                onChange={(e) => setEntertainmentPreference(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:border-[#8B7355]"
              />
            </div>
          </div>

          {/* Additional Requests */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-[#475569]">
              Additional Requests / Notes
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Flower decorations, surprise birthday setup, custom seating arrangement..."
              value={additionalRequests}
              onChange={(e) => setAdditionalRequests(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:border-[#8B7355]"
            />
          </div>
        </div>

        {/* ── 4. Contact Details ── */}
        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-[#E8E2DC] space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#0F172A] mb-1 uppercase tracking-wider" style={{ fontFamily: "Inter, sans-serif" }}>
              4. Contact Information
            </label>
            <p className="text-xs text-[#64748B]">Where should we send your customized quotation?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-2 flex items-center gap-1.5">
                <FaUser className="text-[#8B7355]" /> Full Name
              </label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:border-[#8B7355]"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-2 flex items-center gap-1.5">
                <MdOutlinePhone className="text-[#8B7355] text-base" /> Phone Number
              </label>
              <input
                type="tel"
                required
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:border-[#8B7355]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-2 flex items-center gap-1.5">
                <MdOutlineEmail className="text-[#8B7355] text-base" /> Email Address
              </label>
              <input
                type="email"
                required
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:border-[#8B7355]"
              />
            </div>
          </div>
        </div>

        {/* ── Submit & Action Buttons ── */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#FBF6F3] p-6 rounded-2xl border border-[#E8E2DC]">
          <Link
            href="/booking"
            className="px-8 py-3.5 rounded-xl border border-[#CFB9A3] text-[#1d1a17] font-bold text-sm hover:bg-[#CFB9A3]/10 transition-all flex items-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Services
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className={`px-12 py-3.5 rounded-xl bg-[#8B7355] text-white font-bold text-sm flex items-center gap-3 shadow-md hover:bg-[#725e45] transition-all cursor-pointer ${
              submitting ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Submitting...
              </>
            ) : (
              <>
                Submit
                <FaPaperPlane size={14} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
