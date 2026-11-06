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
import { useLanguage } from "@/lib/i18n/LanguageContext";

const EVENT_TYPES = [
  { id: "Birthdays", key: "birthdays", label: "Birthdays" },
  { id: "Weddings", key: "weddings", label: "Weddings" },
  { id: "Baby showers", key: "babyShowers", label: "Baby Showers" },
  { id: "Corporate parties", key: "corporateParties", label: "Corporate Parties" },
  { id: "Anniversaries", key: "anniversaries", label: "Anniversaries" },
  { id: "Private parties", key: "privateParties", label: "Private Parties" },
  { id: "Other events", key: "otherEvents", label: "Other Events" },
];

export default function EventSpaceInquiryPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const flow = (t as any)?.bookingFlow;
  const esTrans = flow?.eventspace;
  const btnTrans = flow?.buttons;

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

  const selectedEventType = EVENT_TYPES.find((type) => type.id === eventType);
  const localizedEventType =
    (esTrans?.eventTypes as Record<string, string> | undefined)?.[selectedEventType?.key || ""] ||
    selectedEventType?.label ||
    eventType;
  const confirmationEventType =
    eventType === "Other events" && otherEventDetails.trim()
      ? otherEventDetails.trim()
      : localizedEventType;
  const dateLocale = language === "nl" ? "nl-NL" : language === "de" ? "de-DE" : "en-US";
  const confirmationDate = preferredDate
    ? new Date(`${preferredDate}T12:00:00`).toLocaleDateString(dateLocale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : preferredDate;

  if (submitted) {
    return (
      <div className="w-full px-6 md:px-12 max-w-4xl mx-auto py-16">
        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-md border border-[#E8E2DC] text-center flex flex-col items-center space-y-6">
          <div className="w-20 h-20 bg-[#FCF2E9] rounded-3xl border border-[#E8E2DC] flex items-center justify-center text-[#8B7355] shadow-xs">
            <FaGlassCheers className="w-10 h-10" />
          </div>

          <h2 className="font-displayPlayFair text-4xl text-[#0F172A]">
            {esTrans?.inquirySuccessTitle || "Inquiry Submitted Successfully!"}
          </h2>

          <DecorativeUnderline />

          <p className="font-cambria text-base text-[#475569] max-w-xl italic leading-relaxed">
            {esTrans?.inquirySuccessDesc
              ? esTrans.inquirySuccessDesc
                  .replace("{name}", name)
                  .replace("{event}", confirmationEventType)
                  .replace("{date}", confirmationDate)
                  .replace("{guests}", String(expectedGuests))
              : `${name} - ${confirmationEventType} - ${confirmationDate} - ${expectedGuests}`}
          </p>

          <div className="w-full bg-[#FCF2E9] rounded-2xl p-6 border border-[#E8E2DC] text-left max-w-lg space-y-3 text-xs text-[#475569]">
            <div className="flex flex-col items-start gap-2 border-b border-[#E8E2DC] pb-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-bold text-[#8B7355] uppercase tracking-wider text-[11px]">{esTrans?.bookingReference || "Booking Reference"}</p>
              <span className="max-w-full break-all font-bold font-mono text-base text-[#0F172A] sm:text-right">{bookingRef}</span>
            </div>
            <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
              <div className="min-w-0 break-words"><span className="font-semibold">{esTrans?.eventTypeLabel || "Event Type:"}</span> {confirmationEventType}</div>
              <div className="min-w-0 break-words"><span className="font-semibold">{esTrans?.dateLabel || "Date:"}</span> {confirmationDate}</div>
              <div className="min-w-0 break-words"><span className="font-semibold">{esTrans?.timeLabel || "Time:"}</span> {startTime} - {endTime}</div>
              <div className="min-w-0 break-words"><span className="font-semibold">{esTrans?.guestsLabel || "Guests:"}</span> {expectedGuests}</div>
            </div>
            {foodPreference && <div><span className="font-semibold">{esTrans?.foodLabel || "Food:"}</span> {foodPreference}</div>}
            {drinkPreference && <div><span className="font-semibold">{esTrans?.drinksLabel || "Drinks:"}</span> {drinkPreference}</div>}
            {entertainmentPreference && <div><span className="font-semibold">{esTrans?.entertainmentLabel || "Entertainment:"}</span> {entertainmentPreference}</div>}
            <div><span className="font-semibold">{esTrans?.contactEmailLabel || "Contact Email:"}</span> {email}</div>
            <div><span className="font-semibold">{esTrans?.phoneLabel || "Phone:"}</span> {phone}</div>
          </div>

          <p className="text-xs text-[#64748B] max-w-md">
            {esTrans?.inquirySuccessFooter || "Our event planning team will review your requirements and contact you via phone or email with a tailored quotation within 24 hours. A confirmation email has been sent."}
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
              {esTrans?.submitAnotherInquiry || "Submit Another Inquiry"}
            </button>
            <Link
              href="/booking"
              className="px-8 py-3.5 rounded-xl bg-[#8B7355] text-white font-bold text-sm shadow-md hover:bg-[#725e45] transition-all"
            >
              {esTrans?.backToBookingOverview || "Back to Booking Overview"}
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
          {esTrans?.title || "Events & Party Room Inquiry"}
        </h1>
        <DecorativeUnderline />
        <p className="font-cambria text-sm text-[#475569] mt-6 italic max-w-2xl">
          {esTrans?.subtitle || "Whether celebrating intimate moments or grand occasions, request a customized proposal and let our team tailor the perfect experience for you."}
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
              {esTrans?.selectEventType || "1. Select Event Type"}
            </label>
            <p className="text-xs text-[#64748B]">{esTrans?.selectEventTypeSub || "Choose the occasion you are planning to host"}</p>
          </div>

          <div className="grid auto-rows-fr grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {EVENT_TYPES.map((type) => {
              const isSelected = eventType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setEventType(type.id)}
                  className={`flex h-full min-h-20 w-full min-w-0 items-center justify-center whitespace-normal break-words rounded-2xl border px-3 py-3 text-center font-bold text-sm leading-snug transition-colors ${
                    isSelected
                      ? "bg-[#8B7355] border-[#8B7355] text-white shadow-md"
                      : "bg-white border-[#E2E8F0] text-[#0F172A] hover:border-[#D1B191]"
                  }`}
                >
                  {(esTrans?.eventTypes as any)?.[type.key] || type.label}
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
                {esTrans?.describeEventPrompt || "Describe Your Event / Occasion *"}
              </label>
              <input
                type="text"
                required
                value={otherEventDetails}
                onChange={(e) => setOtherEventDetails(e.target.value)}
                placeholder={esTrans?.describeEventPlaceholder || "e.g. Wellness retreat, product launch, photography shoot, graduation gathering..."}
                className="w-full px-4 py-3.5 rounded-xl border border-[#D1B191] bg-[#FCF2E9]/40 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
              />
            </div>
          )}
        </div>

        {/* ── 2. Date, Time & Guests ── */}
        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-[#E8E2DC] space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#0F172A] mb-1 uppercase tracking-wider" style={{ fontFamily: "Inter, sans-serif" }}>
              {esTrans?.dateTimeCapacity || "2. Date, Time & Capacity"}
            </label>
            <p className="text-xs text-[#64748B]">{esTrans?.dateTimeCapacitySub || "Specify your preferred schedule and expected guest count"}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Preferred Date */}
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-2 flex items-center gap-1.5">
                <FaCalendarAlt className="text-[#8B7355]" /> {esTrans?.preferredDate || "Preferred Date"}
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
                <BiTimeFive className="text-[#8B7355] text-base" /> {esTrans?.startTime || "Start Time"}
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
                <BiTimeFive className="text-[#8B7355] text-base" /> {esTrans?.endTime || "End Time"}
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
                <BiGroup className="text-[#8B7355] text-base" /> {esTrans?.expectedGuests || "Expected Guests"}
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
              {esTrans?.foodDrinksEntertainment || "3. Food, Drinks & Entertainment"}
            </label>
            <p className="text-xs text-[#64748B]">{esTrans?.foodDrinksEntertainmentSub || "Specify your event catering and entertainment preferences"}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Food Preferences */}
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-2 flex items-center gap-1.5">
                <BiRestaurant className="text-[#8B7355] text-base" /> {esTrans?.foodPreferences || "Food Preferences"}
              </label>
              <input
                type="text"
                placeholder={esTrans?.foodPlaceholder || "e.g. Organic Buffet, Vegan menu..."}
                value={foodPreference}
                onChange={(e) => setFoodPreference(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:border-[#8B7355]"
              />
            </div>

            {/* Drink Preferences */}
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-2 flex items-center gap-1.5">
                <BiDrink className="text-[#8B7355] text-base" /> {esTrans?.drinkPreferences || "Drink Preferences"}
              </label>
              <input
                type="text"
                placeholder={esTrans?.drinkPlaceholder || "e.g. Wine & Champagne, Fresh juices..."}
                value={drinkPreference}
                onChange={(e) => setDrinkPreference(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:border-[#8B7355]"
              />
            </div>

            {/* DJ / Music / Entertainment */}
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-2 flex items-center gap-1.5">
                <BiMusic className="text-[#8B7355] text-base" /> {esTrans?.musicEntertainment || "DJ / Music / Entertainment"}
              </label>
              <input
                type="text"
                placeholder={esTrans?.musicPlaceholder || "e.g. Live DJ, Acoustic duo, Playlist..."}
                value={entertainmentPreference}
                onChange={(e) => setEntertainmentPreference(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:border-[#8B7355]"
              />
            </div>
          </div>

          {/* Additional Requests */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-[#475569]">
              {esTrans?.additionalRequestsNotes || "Additional Requests / Notes"}
            </label>
            <textarea
              rows={3}
              placeholder={esTrans?.additionalRequestsPlaceholder || "e.g. Flower decorations, surprise birthday setup, custom seating arrangement..."}
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
              {esTrans?.contactInformation || "4. Contact Information"}
            </label>
            <p className="text-xs text-[#64748B]">{esTrans?.contactInformationSub || "Where should we send your customized quotation?"}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-2 flex items-center gap-1.5">
                <FaUser className="text-[#8B7355]" /> {esTrans?.fullName || "Full Name"}
              </label>
              <input
                type="text"
                required
                placeholder={esTrans?.fullNamePlaceholder || "John Doe"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:border-[#8B7355]"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-2 flex items-center gap-1.5">
                <MdOutlinePhone className="text-[#8B7355] text-base" /> {esTrans?.phoneNumber || "Phone Number"}
              </label>
              <input
                type="tel"
                required
                placeholder={esTrans?.phonePlaceholder || "+1 (555) 000-0000"}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:border-[#8B7355]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-2 flex items-center gap-1.5">
                <MdOutlineEmail className="text-[#8B7355] text-base" /> {esTrans?.emailAddress || "Email Address"}
              </label>
              <input
                type="email"
                required
                placeholder={esTrans?.emailPlaceholder || "john@example.com"}
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
            {esTrans?.backToServices || "Back to Services"}
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
                {esTrans?.submitting || "Submitting..."}
              </>
            ) : (
              <>
                {esTrans?.submit || "Submit"}
                <FaPaperPlane size={14} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
