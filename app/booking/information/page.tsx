"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { CelebrationData, getStoredBookingData, updateStoredBookingData } from "@/lib/bookingStore";
import { servicesService } from "@/lib/api";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BiTimeFive } from "react-icons/bi";
import { FaWalking } from "react-icons/fa";
import { FaCakeCandles, FaGift, FaHeart } from "react-icons/fa6";
import { useLanguage } from "@/lib/i18n/LanguageContext";

function generateTimeSlots(openTime?: string, closeTime?: string, intervalMinutes = 60): string[] {
  if (!openTime || !closeTime) return ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
  const [startH, startM] = openTime.split(":").map(Number);
  const [endH, endM] = closeTime.split(":").map(Number);
  if (isNaN(startH) || isNaN(endH)) return ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
  const startMinutes = startH * 60 + (startM || 0);
  const endMinutes = endH * 60 + (endM || 0);
  const slots: string[] = [];
  for (let m = startMinutes; m <= endMinutes; m += intervalMinutes) {
    const hh = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    slots.push(`${hh}:${mm}`);
  }
  return slots.length > 0 ? slots : ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
}

function formatTime12h(time24: string): string {
  const [hStr, mStr] = time24.split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr || "0", 10);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}

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
  const { t } = useLanguage();
  const flow = (t as any)?.bookingFlow;
  const infoTrans = flow?.information;
  const btnTrans = flow?.buttons;

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
  const isPackage = storedData.serviceType === "package";
  const hasPackageLunchroom = isPackage && (
    storedData.packageSelections?.includedServices?.some((s) =>
      s.toLowerCase().includes("lunchroom")
    ) ?? true // if includedServices not set, assume lunchroom included in package
  );

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("12:00");
  const [guestsCount, setGuestsCount] = useState(1);
  const [dayError, setDayError] = useState<string | null>(null);

  // Lunchroom dynamic slot state (shared for both standalone & package lunchroom)
  const [lunchroomOpenTime, setLunchroomOpenTime] = useState<string | undefined>(undefined);
  const [lunchroomCloseTime, setLunchroomCloseTime] = useState<string | undefined>(undefined);
  const [lunchroomIsClosed, setLunchroomIsClosed] = useState<boolean>(false);
  const [lunchroomIsBlocked, setLunchroomIsBlocked] = useState<boolean>(false);
  const [lunchroomBlockMessage, setLunchroomBlockMessage] = useState<string>("");
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Package lunchroom arrival time (stored in packageSelections.lunchroomTime)
  const [pkgLunchroomTime, setPkgLunchroomTime] = useState<string>("");

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
    // Fetch lunchroom slots on mount if date already selected
    const isLunch = data.serviceType === "lunchroom" || data.serviceName?.toLowerCase().includes("lunchroom");
    const isPkg = data.serviceType === "package";
    if ((isLunch || isPkg) && data.date) {
      fetchLunchroomSlots(data.date);
    }
    // Restore package lunchroom time
    if (isPkg && data.packageSelections?.lunchroomTime) {
      setPkgLunchroomTime(data.packageSelections.lunchroomTime);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLunchroomSlots = useCallback(async (selectedDate: string) => {
    if (!selectedDate) return;
    setLoadingSlots(true);
    setDayError(null);
    setLunchroomIsBlocked(false);
    setLunchroomBlockMessage("");
    try {
      const res = await servicesService.getServiceSlots("lunchroom", selectedDate);
      const isBlocked = Boolean(res?.is_blocked || (res?.data as any)?.is_blocked);
      const isClosed = Boolean(res?.is_closed || (res?.data as any)?.is_closed);
      const openT = res?.open_time || (res?.data as any)?.open_time;
      const closeT = res?.close_time || (res?.data as any)?.close_time;

      setLunchroomIsBlocked(isBlocked);
      setLunchroomIsClosed(isClosed);
      setLunchroomOpenTime(openT);
      setLunchroomCloseTime(closeT);

      if (isBlocked) {
        const blockMsg = res?.message || (res?.data as any)?.message || "No slots available. This date is blocked.";
        setLunchroomBlockMessage(blockMsg);
        setDayError(blockMsg);
        setTimeSlot("");
        setPkgLunchroomTime("");
        updateStoredBookingData({ timeSlot: "" });
      } else if (isClosed) {
        const info = (res?.data as any)?.info || res?.message || "Lunchroom is closed on this day.";
        setDayError(info);
        setTimeSlot("");
        setPkgLunchroomTime("");
        updateStoredBookingData({ timeSlot: "" });
      } else {
        setDayError(null);
        // Default to open_time if current slot is outside range
        if (openT) {
          setTimeSlot((prev) => {
            const slots = generateTimeSlots(openT, closeT);
            if (!slots.includes(prev)) {
              updateStoredBookingData({ timeSlot: slots[0] });
              return slots[0];
            }
            return prev;
          });
        }
      }
    } catch {
      setDayError(null);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    updateStoredBookingData({ date: newDate });
    if ((isLunchroom || isPackage) && newDate) {
      fetchLunchroomSlots(newDate);
    }
  };

  const handlePkgLunchroomTimeChange = (newTime: string) => {
    setPkgLunchroomTime(newTime);
    const current = getStoredBookingData();
    updateStoredBookingData({
      packageSelections: {
        ...current.packageSelections,
        lunchroomTime: newTime,
      },
    });
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
    ? Boolean(formData.name && formData.email && formData.phone && date && timeSlot && !lunchroomIsClosed && !lunchroomIsBlocked && !loadingSlots)
    : isPackage && hasPackageLunchroom
    ? Boolean(formData.name && formData.email && formData.phone && pkgLunchroomTime && !lunchroomIsClosed && !lunchroomIsBlocked && !loadingSlots)
    : Boolean(formData.name && formData.email && formData.phone);

  return (
    <div className="w-full px-6 md:px-12">
      {/* ── Title Section ── */}
      <div className="text-center mb-16 flex flex-col items-center">
        <h1 className="font-displayPlayFair text-5xl text-[#1d1a17] mb-2 leading-tight">
          {infoTrans?.title || "Your Information"}
        </h1>
        <DecorativeUnderline />
        <p className="font-cambria text-sm text-[#475569] mt-6 italic tracking-wide">
          {infoTrans?.subtitle || "Please provide your contact details & any special requests."}
        </p>
      </div>

      {/* ── Content Card ── */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Table Reservation Details Card (Lunchroom Only) */}
        {/* Standalone Lunchroom Table Reservation Details Card */}
        {isLunchroom && (
          <div className="bg-white rounded-[32px] p-10 shadow-sm border border-[#E8E2DC]">
            <h2
              className="text-xs font-bold text-[#64748B] uppercase tracking-[0.2em] mb-6"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {infoTrans?.tableReservationDetails || "Table Reservation Details"}
            </h2>

            {/* Opening Hours Banner */}
            <div className={`mb-6 p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${
              lunchroomIsBlocked || lunchroomIsClosed
                ? "bg-red-50 border-red-200 text-red-900"
                : "bg-[#FCF2E9]/70 border-[#E8E2DC]/80 text-[#8B7355]"
            }`}>
              <div className="flex items-center gap-2">
                <BiTimeFive className={`text-lg flex-shrink-0 ${lunchroomIsBlocked || lunchroomIsClosed ? "text-red-700" : ""}`} />
                {loadingSlots ? (
                  <span className="italic text-[#94A3B8]">Checking hours for selected date...</span>
                ) : lunchroomIsBlocked ? (
                  <span><strong>Lunchroom:</strong> {lunchroomBlockMessage || "This date is blocked. No slots available."}</span>
                ) : lunchroomIsClosed ? (
                  <span><strong>Lunchroom:</strong> Closed on this date — please select another date</span>
                ) : lunchroomOpenTime && lunchroomCloseTime ? (
                  <span>
                    <strong>Lunchroom Opening Hours:</strong> {lunchroomOpenTime} – {lunchroomCloseTime}
                  </span>
                ) : (
                  <span><strong>Lunchroom Opening Hours:</strong> Select a date to see hours</span>
                )}
              </div>
              {!lunchroomIsClosed && !lunchroomIsBlocked && (
                <div className="flex items-center gap-1.5 font-semibold bg-white/80 px-3 py-1.5 rounded-xl border border-[#E8E2DC] self-start md:self-auto">
                  <FaWalking />
                  <span>{infoTrans?.lunchroomWalkinsWelcome || "Walk-ins welcome anytime!"}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Date */}
              <div>
                <label
                  className="block text-xs font-bold text-[#0F172A] mb-2 uppercase tracking-wider"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {infoTrans?.reservationDateRequired || "Reservation Date *"}
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
                  {infoTrans?.preferredArrivalTimeRequired || "Preferred Arrival Time *"}
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  disabled={lunchroomIsClosed || lunchroomIsBlocked || loadingSlots}
                  className="w-full p-4 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D1B191] text-[#475569] font-medium bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {lunchroomIsBlocked ? (
                    <option value="" disabled>Date Blocked - No Slots</option>
                  ) : (
                    generateTimeSlots(lunchroomOpenTime, lunchroomCloseTime, 60).map((t) => (
                      <option key={t} value={t}>{formatTime12h(t)}</option>
                    ))
                  )}
                </select>
              </div>

              {/* Number of Guests */}
              <div>
                <label
                  className="block text-xs font-bold text-[#0F172A] mb-2 uppercase tracking-wider"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {infoTrans?.numberOfGuestsRequired || "Number of Guests *"}
                </label>
                <select
                  value={guestsCount}
                  onChange={(e) => handleGuestsChange(parseInt(e.target.value, 10))}
                  className="w-full p-4 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D1B191] text-[#475569] font-medium bg-white cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map((num) => (
                    <option key={num} value={num}>
                      {num === 1
                        ? (infoTrans?.guestOptionSingle || "1 Guest")
                        : (infoTrans?.guestOptionPlural ? infoTrans.guestOptionPlural.replace("{count}", String(num)) : `${num} Guests`)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Package Lunchroom Arrival Time Card */}
        {isPackage && hasPackageLunchroom && (
          <div className="bg-white rounded-[32px] p-10 shadow-sm border border-[#E8E2DC]">
            <h2
              className="text-xs font-bold text-[#64748B] uppercase tracking-[0.2em] mb-6"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {infoTrans?.packageLunchroomTitle || "Lunchroom — Preferred Arrival Time"}
            </h2>

            {/* Opening Hours Banner */}
            <div className={`mb-6 p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${
              lunchroomIsBlocked || lunchroomIsClosed
                ? "bg-red-50 border-red-200 text-red-900"
                : "bg-[#FCF2E9]/70 border-[#E8E2DC]/80 text-[#8B7355]"
            }`}>
              <div className="flex items-center gap-2">
                <BiTimeFive className={`text-lg flex-shrink-0 ${lunchroomIsBlocked || lunchroomIsClosed ? "text-red-700" : ""}`} />
                {loadingSlots ? (
                  <span className="italic text-[#94A3B8]">Checking lunchroom hours for your booking date...</span>
                ) : lunchroomIsBlocked ? (
                  <span><strong>Lunchroom:</strong> {lunchroomBlockMessage || "This date is blocked. No slots available."}</span>
                ) : lunchroomIsClosed ? (
                  <span><strong>Lunchroom:</strong> Closed on your selected date — please change the booking date</span>
                ) : lunchroomOpenTime && lunchroomCloseTime ? (
                  <span>
                    <strong>Lunchroom Opening Hours:</strong> {lunchroomOpenTime} – {lunchroomCloseTime}
                  </span>
                ) : (
                  <span><strong>Lunchroom Opening Hours:</strong> Based on your package date</span>
                )}
              </div>
              {!lunchroomIsClosed && !lunchroomIsBlocked && (
                <div className="flex items-center gap-1.5 font-semibold bg-white/80 px-3 py-1.5 rounded-xl border border-[#E8E2DC] self-start md:self-auto">
                  <FaWalking />
                  <span>{infoTrans?.lunchroomWalkinsWelcome || "Walk-ins welcome anytime!"}</span>
                </div>
              )}
            </div>

            <div className="max-w-xs">
              <label
                className="block text-xs font-bold text-[#0F172A] mb-2 uppercase tracking-wider"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {infoTrans?.preferredLunchroomArrival || "Preferred Lunchroom Arrival *"}
              </label>
              <select
                value={pkgLunchroomTime}
                onChange={(e) => handlePkgLunchroomTimeChange(e.target.value)}
                disabled={lunchroomIsClosed || lunchroomIsBlocked || loadingSlots}
                className="w-full p-4 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D1B191] text-[#475569] font-medium bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="" disabled>{infoTrans?.selectArrivalTimePrompt || "Select arrival time..."}</option>
                {!lunchroomIsBlocked && generateTimeSlots(lunchroomOpenTime, lunchroomCloseTime, 60).map((t) => (
                  <option key={t} value={t}>{formatTime12h(t)}</option>
                ))}
              </select>
              <p className="text-[11px] text-[#64748B] mt-2">
                {infoTrans?.packageLunchroomDesc || "Your lunchroom visit is included in your package — just pick your preferred arrival window."}
              </p>
            </div>
          </div>
        )}

        {isActivity && storedData.activityDetails && (
          <div className="bg-white rounded-[32px] p-10 shadow-sm border border-[#E8E2DC]">
            <h2
              className="text-xs font-bold text-[#64748B] uppercase tracking-[0.2em] mb-6"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {infoTrans?.activitySessionDetails || "Activity Session Details"}
            </h2>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#FCF2E9] to-[#FBF6F3] border border-[#E8E2DC] mb-6">
              {/* <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B7355] block mb-1">
                {storedData.activityDetails.category}
              </span> */}
              <h3 className="text-2xl font-bold font-displayPlayFair text-[#0F172A] mb-2">
                {storedData.activityDetails.name}
              </h3>
              <p className="text-xs text-[#64748B] mb-4 leading-relaxed whitespace-pre-line">
                {storedData.activityDetails.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#E8E2DC]/80 text-xs text-[#475569]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8B7355] block">
                    {infoTrans?.dateAndSchedule || "Date & Schedule"}
                  </span>
                  <span className="font-semibold text-[#0F172A]">
                    {storedData.activityDetails.date ? new Date(storedData.activityDetails.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }) : "Upcoming"}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8B7355] block">
                    {infoTrans?.timeSlot || "Time Slot"}
                  </span>
                  <span className="font-semibold text-[#0F172A]">
                    {storedData.activityDetails.startTime} - {storedData.activityDetails.endTime}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8B7355] block">
                    {infoTrans?.hostGuide || "Host / Guide"}
                  </span>
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
                  {infoTrans?.numberParticipantsTickets || "Number of Participants / Tickets *"}
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
                          {num === 1
                            ? (infoTrans?.guestOptionSingle || "1 Person")
                            : (infoTrans?.guestOptionPlural ? infoTrans.guestOptionPlural.replace("{count}", String(num)) : `${num} People`)} (€{(storedData.activityDetails!.price * num).toFixed(2)})
                        </option>
                      ))}
                    </select>
                  );
                })()}
                <span className="text-[11px] text-[#64748B] mt-1.5 block">
                  {infoTrans?.perPersonTag ? infoTrans.perPersonTag.replace("{price}", String(storedData.activityDetails.price)) : `€${storedData.activityDetails.price} per person`}
                </span>
              </div>

              <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-[#E2E8F0] flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#64748B] block mb-1">
                  {infoTrans?.totalInvestmentDue || "Total Investment Due"}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-displayPlayFair text-[#8B7355]">
                    €{(storedData.activityDetails.price * guestsCount).toFixed(2)}
                  </span>
                  <span className="text-xs text-[#94A3B8]">
                    {infoTrans?.ticketsCount
                      ? infoTrans.ticketsCount.replace("{count}", String(guestsCount)).replace("{label}", guestsCount === 1 ? (infoTrans?.ticketSingle || "ticket") : (infoTrans?.ticketPlural || "tickets"))
                      : `(${guestsCount} ${guestsCount === 1 ? "ticket" : "tickets"})`}
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
            {infoTrans?.contactGuestDetails || "Contact & Guest Details"}
          </h2>

          <div className="space-y-6">
            <div>
              <label
                className="block text-sm font-bold text-[#0F172A] mb-2 uppercase tracking-wider"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {infoTrans?.fullNameRequired || "Full Name *"}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={infoTrans?.fullNamePlaceholder || "e.g. Sarah Jenkins"}
                className="w-full p-4 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D1B191] text-[#475569]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-sm font-bold text-[#0F172A] mb-2 uppercase tracking-wider"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {infoTrans?.emailAddressRequired || "Email Address *"}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={infoTrans?.emailPlaceholder || "e.g. sarah@example.com"}
                  className="w-full p-4 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D1B191] text-[#475569]"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-bold text-[#0F172A] mb-2 uppercase tracking-wider"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {infoTrans?.phoneNumberRequired || "Phone Number *"}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={infoTrans?.phonePlaceholder || "+1 (555) 000-0000"}
                  className="w-full p-4 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D1B191] text-[#475569]"
                />
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-bold text-[#0F172A] mb-2 uppercase tracking-wider"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {infoTrans?.commentsSpecialRequests || "Comments or Special Requests (Optional)"}
              </label>
              <textarea
                name="requests"
                value={formData.requests}
                onChange={handleChange}
                rows={3}
                placeholder={infoTrans?.commentsPlaceholder || "Dietary requirements, seating preferences, allergies, or anything else we should know..."}
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
                    {infoTrans?.celebrationTitle || "Are you celebrating something?"}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    {infoTrans?.celebrationSubtitle || "Birthdays, anniversaries, or special milestones"}
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
                  {infoTrans?.yesCelebrationBtn || "Yes 🎉"}
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
                  {infoTrans?.noCelebrationBtn || "No"}
                </button>
              </div>
            </div>

            {/* Conditional Celebration Form */}
            {celebration.isCelebrating && (
              <div className="mt-8 pt-8 border-t border-[#F1F5F9] space-y-6 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-[#FCF2E9]/70 border border-[#E8E2DC]/80 flex items-center gap-3 text-xs text-[#8B7355] font-medium">
                  <FaGift className="text-base flex-shrink-0" />
                  <span>
                    {infoTrans?.celebrationBannerText || "Tell us a bit about the occasion so we can prepare a warm, personalized table experience for your guest of honor!"}
                  </span>
                </div>

                {/* What is being celebrated? */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block text-xs font-bold text-[#0F172A] mb-2 uppercase tracking-wider"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {infoTrans?.whatIsBeingCelebrated || "What is being celebrated? *"}
                    </label>
                    <select
                      name="occasion"
                      value={celebration.occasion}
                      onChange={handleCelebrationChange}
                      className="w-full p-4 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D1B191] text-[#475569] bg-white cursor-pointer"
                    >
                      {occasionOptions.map((occ) => {
                        const occKey = occ.toLowerCase().includes("birth")
                          ? "birthday"
                          : occ.toLowerCase().includes("anniv")
                          ? "anniversary"
                          : occ.toLowerCase().includes("grad")
                          ? "graduation"
                          : occ.toLowerCase().includes("promo")
                          ? "promotion"
                          : occ.toLowerCase().includes("baby")
                          ? "babyShower"
                          : occ.toLowerCase().includes("engage")
                          ? "engagement"
                          : occ.toLowerCase().includes("retire")
                          ? "retirement"
                          : "other";
                        const localizedOcc = infoTrans?.occasions?.[occKey] || occ;
                        return (
                          <option key={occ} value={occ}>
                            {localizedOcc}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Who is it for? */}
                  <div>
                    <label
                      className="block text-xs font-bold text-[#0F172A] mb-2 uppercase tracking-wider"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {infoTrans?.whoIsItFor || "Who is it for? (Name of Celebrant) *"}
                    </label>
                    <input
                      type="text"
                      name="celebrantName"
                      value={celebration.celebrantName}
                      onChange={handleCelebrationChange}
                      placeholder={infoTrans?.whoIsItForPlaceholder || "e.g. John / Mom / Alex"}
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
                      {infoTrans?.ageMilestoneNumber || "Age / Milestone Number (Optional)"}
                    </label>
                    <input
                      type="text"
                      name="age"
                      value={celebration.age}
                      onChange={handleCelebrationChange}
                      placeholder={infoTrans?.ageMilestonePlaceholder || "e.g. 30th Birthday / 25th Anniversary"}
                      className="w-full p-4 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D1B191] text-[#475569]"
                    />
                  </div>

                  {/* Hobbies / Interests / Personal details */}
                  <div>
                    <label
                      className="block text-xs font-bold text-[#0F172A] mb-2 uppercase tracking-wider"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {infoTrans?.hobbiesInterests || "Hobbies / Interests or Personal Details"}
                    </label>
                    <input
                      type="text"
                      name="hobbiesInterests"
                      value={celebration.hobbiesInterests}
                      onChange={handleCelebrationChange}
                      placeholder={infoTrans?.hobbiesPlaceholder || "e.g. Loves chocolate, jazz music, coffee..."}
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
                    {infoTrans?.otherCelebrationDetails || "Any Other Relevant Celebration Details"}
                  </label>
                  <textarea
                    name="otherDetails"
                    value={celebration.otherDetails}
                    onChange={handleCelebrationChange}
                    rows={3}
                    placeholder={infoTrans?.otherCelebrationPlaceholder || "e.g. Surprise party setup, special candle on dessert, favorite seating corner..."}
                    className="w-full p-4 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D1B191] text-[#475569] resize-none text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Footer Buttons ── */}
      <div className="max-w-4xl mx-auto mt-16 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-[#FBF6F3] p-4 sm:p-8 rounded-2xl shadow-sm border border-[#E8E2DC]">
        <button
          onClick={() => window.history.back()}
          className="w-full sm:w-auto justify-center px-6 sm:px-10 py-3.5 sm:py-4 rounded-xl border border-[#CFB9A3] text-[#1d1a17] font-bold text-sm hover:bg-[#CFB9A3] hover:bg-opacity-10 transition-all flex items-center gap-3"
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
          {btnTrans?.back || "Back"}
        </button>

        <Link
          href="/booking/review"
          className={`w-full sm:w-auto justify-center px-6 sm:px-12 py-3.5 sm:py-4 rounded-xl font-bold text-sm flex items-center gap-3 transition-all ${
            isFormValid
              ? "bg-[#8B7355] hover:bg-[#786247] text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
              : "bg-[#E2E8F0] text-[#94A3B8] border border-[#CBD5E1] cursor-not-allowed pointer-events-none shadow-none opacity-80"
          }`}
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {btnTrans?.continue || "Continue"}
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
