"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { getStoredBookingData, BookingData } from "@/lib/bookingStore";
import { bookingService } from "@/lib/api/services/bookingService";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCheck, FaLock } from "react-icons/fa";
import { FaCakeCandles } from "react-icons/fa6";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ConfirmationPage() {
  const { t } = useLanguage();
  const flow = (t as any)?.bookingFlow;
  const confTrans = flow?.confirmation;
  const revTrans = flow?.review;
  const btnTrans = flow?.buttons;
  const [data, setData] = useState<BookingData | null>(null);
  const [bookingRef, setBookingRef] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadConfirmationData = async () => {
      try {
        const stored = getStoredBookingData();
        
        // If there's an actual booking id from API, try fetching latest booking detail (skip for saltroom SR- references as backend does not have detail endpoint for it)
        if (stored.bookingId && stored.bookingId !== "") {
          setBookingRef(stored.bookingId);
          if (!stored.bookingId.startsWith("SR-")) {
            try {
              const apiBooking: any = await bookingService.getBookingDetails(stored.bookingId);
              if (apiBooking && (apiBooking.booking_id || apiBooking.service_name || apiBooking.id)) {
                setData({
                  ...stored,
                  bookingId: apiBooking.booking_id || stored.bookingId,
                  serviceName: apiBooking.service_name || apiBooking.service?.name || stored.serviceName,
                  serviceType: apiBooking.service_type || stored.serviceType,
                  name: apiBooking.name || apiBooking.guest_name || stored.name,
                  email: apiBooking.email || apiBooking.guest_email || stored.email,
                  date: apiBooking.date || apiBooking.booking_date || stored.date,
                  guestsCount: apiBooking.capacity || apiBooking.guests || stored.guestsCount,
                  timeSlot: apiBooking.time || apiBooking.start_time || apiBooking.booking_time || stored.timeSlot,
                });
                setLoading(false);
                return;
              }
            } catch {
              // If details API not accessible or 404, use stored booking data
            }
          }
        }

        // Use stored booking data from session
        if (stored) {
          setData(stored);
          const ref = stored.bookingId || `${stored.isSharedSauna ? "SS" : stored.isSaltRoom || stored.serviceType === "salt_room" || stored.serviceType === "saltroom" ? "SR" : "BK"}-${Math.floor(1000 + Math.random() * 9000)}`;
          setBookingRef(ref);
        }
      } finally {
        // Small delay to ensure smooth transition from payment redirect
        setTimeout(() => {
          setLoading(false);
        }, 300);
      }
    };

    loadConfirmationData();
  }, []);

  if (loading || !data) {
    return (
      <div className="w-full min-h-[500px] flex flex-col items-center justify-center px-6 py-24">
        <div className="w-16 h-16 rounded-full border-4 border-[#8B7355] border-t-transparent animate-spin mb-6" />
        <h3 className="text-xl font-bold font-displayPlayFair text-[#0F172A] mb-2">
          Retrieving Your Booking Confirmation...
        </h3>
        <p className="text-xs text-[#64748B] italic">
          Please wait while we secure your reservation details.
        </p>
      </div>
    );
  }

  const celebration = data.celebration;
  const isLunchroom = data.serviceType === "lunchroom" || (data.serviceName && data.serviceName.toLowerCase().includes("lunchroom"));
  const isSaltRoom = data.isSaltRoom || data.serviceType === "salt_room" || data.serviceType === "saltroom" || (data.serviceName && data.serviceName.toLowerCase().includes("salt"));

  return (
    <div className="w-full px-6 md:px-12">
      {/* ── Icon Header ── */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 bg-[#8B735B] rounded-full flex items-center justify-center shadow-lg mb-6">
          <FaCheck className="text-white text-3xl" />
        </div>
        <h1 className="font-displayPlayFair text-5xl text-[#1d1a17] mb-4">
          {confTrans?.title || "Reservation Confirmed!"}
        </h1>
        <DecorativeUnderline />
        <p className="font-cambria text-sm text-[#475569] mt-6 italic tracking-wide">
          {isLunchroom
            ? (confTrans?.subtitleLunchroom || "Your table is set. We look forward to welcoming you to the Lunchroom.")
            : (confTrans?.subtitleGeneral || "Your reservation is confirmed. We look forward to welcoming you for pure relaxation.")}
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
                {confTrans?.confirmedAndSecured || "Confirmed & Secured"}
              </h4>
              <p className="text-[11px] text-[#64748B]">{confTrans?.savedInSystem || "Your reservation has been saved in our system."}</p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <span className="text-[10px] text-[#94A3B8] uppercase tracking-widest block mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                {confTrans?.bookingReference || "Booking Reference"}
              </span>
              <h2 className="text-3xl font-bold text-[#0F172A] font-displayPlayFair">{bookingRef}</h2>
            </div>

            <div>
              <span className="text-[10px] text-[#94A3B8] uppercase tracking-widest block mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                {confTrans?.guestName || "Guest Name"}
              </span>
              <p className="text-xl font-bold text-[#0F172A]">{data.name || "Valued Guest"}</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#F1F5F9]">
            <div>
              <span className="text-[10px] text-[#94A3B8] uppercase tracking-widest block mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                {confTrans?.experience || "Experience"}
              </span>
              <h3 className="text-2xl font-bold text-[#0F172A] font-displayPlayFair">{data.serviceName || "Wellness Experience"}</h3>
              <p className="text-base font-medium text-[#475569] mt-1">
                {data.date
                  ? new Date(data.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
                  : "Upcoming Date"}{" "}
                • {data.guestsCount} {data.guestsCount === 1 ? (revTrans?.numberOfPeople ? "1" : "Person") : "People"}
              </p>
            </div>

            {/* Package Sub-Services Schedule Breakdown */}
            {(data.serviceType === "package" || data.serviceType === "packages") && data.packageSelections && (
              <div className="pt-2 space-y-2">
                <span className="text-[10px] text-[#94A3B8] uppercase tracking-widest block font-bold" style={{ fontFamily: "Inter, sans-serif" }}>
                  {confTrans?.scheduledTimes || "Scheduled Package Component Times"}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {data.packageSelections.saunaSlot && (
                    <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2DC]">
                      <span className="text-[10px] uppercase font-bold text-[#8B7355] block">Sauna Session</span>
                      <p className="font-bold text-[#0F172A] text-xs mt-0.5">
                        {data.packageSelections.saunaSlot.startTime} – {data.packageSelections.saunaSlot.endTime}
                      </p>
                    </div>
                  )}

                  {data.packageSelections.lunchroomTime && (
                    <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2DC]">
                      <span className="text-[10px] uppercase font-bold text-[#8B7355] block">Lunchroom Dining</span>
                      <p className="font-bold text-[#0F172A] text-xs mt-0.5">
                        {data.packageSelections.lunchroomTime} Arrival
                      </p>
                    </div>
                  )}

                  {data.packageSelections.saltRoomSlot && (
                    <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2DC]">
                      <span className="text-[10px] uppercase font-bold text-[#8B7355] block">Salt Room Session</span>
                      <p className="font-bold text-[#0F172A] text-xs mt-0.5">
                        {data.packageSelections.saltRoomSlot.startTime} – {data.packageSelections.saltRoomSlot.endTime}
                      </p>
                    </div>
                  )}

                  {data.packageSelections.activitySession && (
                    <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2DC]">
                      <span className="text-[10px] uppercase font-bold text-[#8B7355] block">Activity Session</span>
                      <p className="font-bold text-[#0F172A] text-xs mt-0.5">
                        {data.packageSelections.activitySession.title} ({data.packageSelections.activitySession.startTime} – {data.packageSelections.activitySession.endTime})
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Celebration Card If Active (Lunchroom Only) */}
          {isLunchroom && celebration?.isCelebrating && (
            <div className="bg-[#FCF2E9] p-6 rounded-2xl border border-[#E8E2DC] flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#8B7355] text-white flex items-center justify-center flex-shrink-0">
                <FaCakeCandles size={20} />
              </div>
              <div>
                <h4 className="font-bold text-[#0F172A] text-sm">{confTrans?.celebrationNoted || "Celebration Noted 🎉"}</h4>
                <p className="text-xs text-[#475569] mt-1">
                  We are excited to celebrate {celebration.occasion} for {celebration.celebrantName || "your special guest"}! Our team will prepare standard celebratory arrangements.
                </p>
              </div>
            </div>
          )}

          {/* Access / Opening Hours Note */}
          <div className="bg-[#8B735B]/90 p-8 rounded-2xl text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-xl font-bold font-displayPlayFair mb-2">
                {isSaltRoom
                  ? (confTrans?.saltRoomReminderTitle || "Salt Room Session Reminder")
                  : isLunchroom
                  ? (confTrans?.lunchroomReminderTitle || "Lunchroom Opening Hours Reminder")
                  : (confTrans?.wellnessReminderTitle || "Wellness Experience Reminder")}
              </h4>
              <p className="text-xs opacity-90 leading-relaxed max-w-lg">
                {isSaltRoom
                  ? (confTrans?.saltRoomReminderText || "Please arrive 10 minutes prior to your halotherapy session. Comfortable clothing is recommended. Please present your booking reference upon arrival.")
                  : isLunchroom
                  ? (confTrans?.lunchroomReminderText || "Wednesday through Sunday (09:00–16:00). Walk-ins are also welcome anytime! Please present your booking reference upon arrival.")
                  : (confTrans?.wellnessReminderText || "Please arrive 15 minutes before your scheduled session. Towels, private facilities, and organic refreshments will be prepared for your visit.")}
              </p>
            </div>
          </div>

          {/* Confirmation Info */}
          <div className="pt-2">
            <span className="text-[10px] text-[#94A3B8] uppercase tracking-widest block mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
              {confTrans?.emailConfirmationNotice || "Confirmation Email Sent To"}
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
          {confTrans?.bookAnotherExperience || "Book Another Experience"}
        </Link>
      </div>
    </div>
  );
}
