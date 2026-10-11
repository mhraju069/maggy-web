"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { servicesService, ServiceSlotsResponse } from "@/lib/api";
import { getStoredBookingData, updateStoredBookingData } from "@/lib/bookingStore";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BiCheckCircle, BiInfoCircle, BiTimeFive } from "react-icons/bi";
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
  const serviceTypeLower = (storedData.serviceType || "").toLowerCase().trim();
  const serviceNameLower = (storedData.serviceName || "").toLowerCase().trim();

  const isPackage = serviceTypeLower === "package" || serviceTypeLower === "packages";
  const isLunchroom = !isPackage && (serviceTypeLower === "lunchroom" || serviceNameLower.includes("lunchroom"));
  const isSaltRoom = !isPackage && !isLunchroom && serviceTypeLower !== "sauna" && (serviceTypeLower === "salt_room" || serviceTypeLower === "saltroom" || storedData.isSaltRoom || serviceNameLower.includes("salt"));
  const isSharedSauna = !isPackage && !isLunchroom && !isSaltRoom && (storedData.isSharedSauna || (serviceTypeLower === "sauna" && (serviceNameLower.includes("shared") || (!serviceNameLower.includes("private") && storedData.isSharedSauna))));
  const isPrivateSauna = !isPackage && !isLunchroom && !isSaltRoom && !isSharedSauna;

  const [saunaPrices, setSaunaPrices] = useState<{
    price3Hrs: number;
    price4Hrs: number;
    extraPersonFee: number;
    sharedPricePerson: number;
  }>({
    price3Hrs: 250,
    price4Hrs: 300,
    extraPersonFee: 50,
    sharedPricePerson: 35,
  });

  useEffect(() => {
    if (isPrivateSauna || isSharedSauna) {
      servicesService
        .getSaunaServices()
        .then((res: any) => {
          const rawData = res?.data || res;
          const privateItem = rawData?.private_sauna?.[0] || (Array.isArray(rawData) ? rawData[0] : undefined);
          const sharedItem = rawData?.shared_sauna?.[0];

          const p3 = privateItem?.base_price_3hrs ? parseFloat(String(privateItem.base_price_3hrs)) : 250;
          const p4 = privateItem?.base_price_4hrs ? parseFloat(String(privateItem.base_price_4hrs)) : 300;
          const extraP = privateItem?.extra_person_price ? parseFloat(String(privateItem.extra_person_price)) : 50;
          const sharedP = sharedItem?.price_per_person ? parseFloat(String(sharedItem.price_per_person)) : 35;

          setSaunaPrices({
            price3Hrs: isNaN(p3) ? 250 : p3,
            price4Hrs: isNaN(p4) ? 300 : p4,
            extraPersonFee: isNaN(extraP) ? 50 : extraP,
            sharedPricePerson: isNaN(sharedP) ? 35 : sharedP,
          });
        })
        .catch((err) => console.error("Error fetching sauna prices in choose-time:", err));
    }
  }, [isPrivateSauna, isSharedSauna]);

  const [date, setDate] = useState(storedData.date || "");
  const [selectedTime, setSelectedTime] = useState<string | null>(storedData.timeSlot || null);
  const [guests, setGuests] = useState(String(storedData.guestsCount || (isPrivateSauna ? 2 : 1)));
  const [dayError, setDayError] = useState<string | null>(null);

  const [apiSlots, setApiSlots] = useState<ServiceSlotsResponse | null>(null);
  const [packageSlots, setPackageSlots] = useState<any | null>(null);
  const [loadingApiSlots, setLoadingApiSlots] = useState<boolean>(false);

  // Package Sub-service choices state
  const [pkgSaunaSlot, setPkgSaunaSlot] = useState<string | null>(storedData.packageSelections?.saunaSlot ? `${storedData.packageSelections.saunaSlot.startTime} - ${storedData.packageSelections.saunaSlot.endTime}` : null);
  const [pkgSaunaType, setPkgSaunaType] = useState<"private" | "shared">(storedData.packageSelections?.saunaSlot?.type || "private");
  const [pkgLunchTime, setPkgLunchTime] = useState<string>(storedData.packageSelections?.lunchroomTime || "12:30");
  const [pkgSelectedActivityId, setPkgSelectedActivityId] = useState<number | null>(storedData.packageSelections?.activitySession?.id || null);

  const fetchSlots = useCallback(async (dateVal: string, typeVal: string) => {
    if (!dateVal) {
      setApiSlots(null);
      setPackageSlots(null);
      return;
    }
    setLoadingApiSlots(true);
    try {
      if (typeVal === "package" || isPackage) {
        const res = await servicesService.getPackageSlots(dateVal);
        setPackageSlots(res);
      } else {
        const res = await servicesService.getServiceSlots(typeVal || "sauna", dateVal);
        setApiSlots(res);
      }
    } catch (err) {
      console.error("Error fetching slots in choose-time:", err);
      setApiSlots(null);
      setPackageSlots(null);
    } finally {
      setLoadingApiSlots(false);
    }
  }, [isPackage]);

  useEffect(() => {
    const data = getStoredBookingData();
    setStoredData(data);
    if (data.date) {
      setDate(data.date);
      fetchSlots(data.date, data.serviceType || "sauna");
    }
    if (data.timeSlot) setSelectedTime(data.timeSlot);
    if (data.guestsCount) {
      setGuests(String(data.guestsCount));
    } else if (isPrivateSauna) {
      setGuests("2");
    }
  }, [fetchSlots, isPrivateSauna]);

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    setSelectedTime(null);
    setPkgSaunaSlot(null);
    setPkgSelectedActivityId(null);

    const isLunchroomOrPackageLunch = isLunchroom || (isPackage && storedData.packageSelections?.includedServices?.includes("lunchroom"));

    if (isLunchroomOrPackageLunch && newDate) {
      const selected = new Date(newDate);
      const dayOfWeek = selected.getUTCDay();
      if (dayOfWeek === 1 || dayOfWeek === 2) {
        setDayError("The Lunchroom is closed on Mondays & Tuesdays. Please pick a date between Wednesday and Sunday.");
      } else {
        setDayError(null);
      }
    } else {
      setDayError(null);
    }

    updateStoredBookingData({ date: newDate, timeSlot: "" });
    if (newDate) {
      fetchSlots(newDate, storedData.serviceType || "sauna");
    }
  };

  const sharedSlotsList = apiSlots?.data?.shared_sauna?.slots || [];
  const selectedSlotObj = isSharedSauna && selectedTime
    ? sharedSlotsList.find((s) => `${s.start_time} - ${s.end_time}` === selectedTime)
    : null;

  const handleTimeSelect = (timeStr: string) => {
    setSelectedTime(timeStr);

    if (isSharedSauna && sharedSlotsList.length > 0) {
      const clickedSlot = sharedSlotsList.find((s) => `${s.start_time} - ${s.end_time}` === timeStr);
      if (clickedSlot) {
        const currentG = parseInt(guests, 10) || 1;
        if (currentG > clickedSlot.remaining_capacity) {
          const adjustedG = Math.max(1, clickedSlot.remaining_capacity);
          setGuests(String(adjustedG));
          const newTotal = parseFloat((adjustedG * saunaPrices.sharedPricePerson).toFixed(2));
          updateStoredBookingData({
            timeSlot: timeStr,
            guestsCount: adjustedG,
            totalAmount: newTotal,
            price: `€${newTotal}`,
          });
          return;
        }
      }
    }

    updateStoredBookingData({ timeSlot: timeStr });
  };

  const handleGuestsChange = (g: string) => {
    const gCount = parseInt(g, 10) || (isPrivateSauna ? 2 : 1);
    setGuests(g);

    if (isPackage) {
      updateStoredBookingData({
        guestsCount: gCount,
      });
      return;
    }

    let newTotal = storedData.totalAmount || 0;
    if (isPrivateSauna) {
      const duration = storedData.durationHours || 3;
      const base = duration === 4 ? saunaPrices.price4Hrs : saunaPrices.price3Hrs;
      const extrasTotal = (storedData.selectedExtras || []).reduce((sum, ext) => sum + (ext.price || 0), 0);
      const extraGuests = Math.max(0, gCount - 2);
      newTotal = base + extraGuests * saunaPrices.extraPersonFee + extrasTotal;
    } else if (isSharedSauna) {
      newTotal = parseFloat((gCount * saunaPrices.sharedPricePerson).toFixed(2));
    } else if (isSaltRoom) {
      newTotal = gCount * 25;
    }

    updateStoredBookingData({
      guestsCount: gCount,
      totalAmount: newTotal,
      price: `€${newTotal}`,
    });
  };

  const calculateOptionPrice = (n: number): string => {
    if (isPrivateSauna) {
      const duration = storedData.durationHours || 3;
      const base = duration === 4 ? saunaPrices.price4Hrs : saunaPrices.price3Hrs;
      const extrasTotal = (storedData.selectedExtras || []).reduce((sum, ext) => sum + (ext.price || 0), 0);
      const extraGuests = Math.max(0, n - 2);
      const total = base + extraGuests * saunaPrices.extraPersonFee + extrasTotal;
      return `€${total.toFixed(2)}`;
    } else if (isSharedSauna) {
      const total = n * saunaPrices.sharedPricePerson;
      return `€${total.toFixed(2)}`;
    } else if (isSaltRoom) {
      const total = n * 25;
      return `€${total.toFixed(2)}`;
    }
    return `€${(n * 35).toFixed(2)}`;
  };

  const maxSelectableGuests = isPrivateSauna
    ? 6
    : isSaltRoom
    ? 2
    : selectedSlotObj
    ? Math.min(6, Math.max(1, selectedSlotObj.remaining_capacity))
    : 6;

  const minSelectableGuests = isPrivateSauna ? 2 : 1;

  const guestOptions = isPrivateSauna
    ? [2, 3, 4, 5, 6]
    : Array.from(
        { length: Math.max(1, maxSelectableGuests - minSelectableGuests + 1) },
        (_, i) => minSelectableGuests + i
      );

  const isPackageFormValid = isPackage
    ? Boolean(date && (!packageSlots || !packageSlots.is_blocked) && (
        !packageSlots?.data?.sauna || pkgSaunaSlot
      ) && (
        !packageSlots?.data?.activities || packageSlots.data.activities.length === 0 || pkgSelectedActivityId
      ))
    : false;

  const isFormValid = isPackage
    ? isPackageFormValid
    : date && selectedTime && (!isLunchroom || !dayError);

  const savePackageSelections = (
    updatedSaunaSlot?: string | null,
    updatedSaunaType?: "private" | "shared",
    updatedLunchTime?: string,
    updatedActivityId?: number | null
  ) => {
    const sSlot = updatedSaunaSlot !== undefined ? updatedSaunaSlot : pkgSaunaSlot;
    const sType = updatedSaunaType !== undefined ? updatedSaunaType : pkgSaunaType;
    const lTime = updatedLunchTime !== undefined ? updatedLunchTime : pkgLunchTime;
    const actId = updatedActivityId !== undefined ? updatedActivityId : pkgSelectedActivityId;

    let saunaSlotData: any = undefined;
    if (sSlot) {
      const parts = sSlot.split(" - ");
      saunaSlotData = {
        type: sType,
        startTime: parts[0] || "",
        endTime: parts[1] || "",
      };
    }

    let activitySessionData: any = undefined;
    if (actId && packageSlots?.data?.activities) {
      const foundAct = packageSlots.data.activities.find((a: any) => a.id === actId);
      if (foundAct) {
        activitySessionData = {
          id: foundAct.id,
          title: foundAct.title,
          startTime: foundAct.open_time,
          endTime: foundAct.close_time,
          host: foundAct.host,
        };
      }
    }

    updateStoredBookingData({
      timeSlot: sSlot || lTime || "Package Scheduled",
      packageSelections: {
        ...storedData.packageSelections,
        saunaSlot: saunaSlotData,
        lunchroomTime: lTime,
        activitySession: activitySessionData,
      },
    });
  };

  return (
    <div className="w-full px-6 md:px-12">
      {/* ── Title Section ── */}
      <div className="text-center mb-12 flex flex-col items-center">
        <h1 className="font-displayPlayFair text-5xl text-[#1d1a17] mb-2 leading-tight">Choose Your Time</h1>
        <DecorativeUnderline />
        <p className="font-cambria text-sm text-[#475569] mt-6 italic tracking-wide">
          Select a date and customize sub-service times for {storedData.serviceName || "your package reservation"}.
        </p>
      </div>

      {/* ── Package Header Banner ── */}
      {isPackage && (
        <div className="max-w-4xl mx-auto mb-8 bg-gradient-to-r from-[#FCF2E9] to-[#F7EBE1] rounded-2xl p-6 border border-[#E8E2DC] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#8B7355] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
              <FaSpa size={22} />
            </div>
            <div>
              <h4 className="font-bold text-[#0F172A] text-base font-displayPlayFair">
                {storedData.serviceName}
              </h4>
              <p className="text-xs text-[#8B7355] font-medium mt-0.5">
                Multi-service slot selection • Please choose times for included package components below
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl border border-[#E8E2DC] text-xs font-bold text-[#8B7355]">
            <span>Package Price: {storedData.price || `€${storedData.totalAmount}`}</span>
          </div>
        </div>
      )}

      {/* ── Lunchroom Banner ── */}
      {!isPackage && isLunchroom && (
        <div className="max-w-4xl mx-auto mb-8 bg-white rounded-2xl p-6 border border-[#E8E2DC] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FCF2E9] flex items-center justify-center text-[#8B7355] flex-shrink-0">
              <BiTimeFive size={20} />
            </div>
            <div>
              <h4 className="font-bold text-[#0F172A] text-sm">Lunchroom Opening Hours</h4>
              <p className="text-xs text-[#8B7355] font-medium">
                Wednesday through Sunday • 09:00–16:00 (Mon & Tue Closed)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#FCF2E9]/70 px-4 py-2 rounded-xl text-xs text-[#475569]">
            <FaWalking className="text-[#8B7355]" />
            <span>Walk-ins welcome anytime during opening hours!</span>
          </div>
        </div>
      )}

      {/* ── Salt Room Banner ── */}
      {!isPackage && isSaltRoom && (
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
      {!isPackage && isPrivateSauna && (
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

          {/* Time Picker / Multi-Service Package Slots Picker */}
          {isPackage ? (
            <div className="space-y-8 pt-2 border-t border-[#E8E2DC]">
              {loadingApiSlots && (
                <div className="p-8 text-center text-xs text-[#64748B] italic">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-[#8B7355] border-t-transparent mr-2 align-middle"></div>
                  Loading package sub-services and slots for {date}...
                </div>
              )}

              {!loadingApiSlots && packageSlots?.is_blocked && (
                <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold flex items-center gap-3">
                  <BiInfoCircle size={22} className="flex-shrink-0" />
                  <div>
                    <h5 className="font-bold">Date Blocked</h5>
                    <p className="text-xs font-normal mt-0.5">{packageSlots.message || "This date is currently blocked for package reservations."}</p>
                  </div>
                </div>
              )}

              {!loadingApiSlots && !packageSlots?.is_blocked && date && (
                <>
                  {/* 1. Sauna Sub-Service Slots (If included in package API or selected) */}
                  {packageSlots?.data?.sauna && (
                    <div className="bg-[#FAF7F2] rounded-2xl p-6 border border-[#E8E2DC]">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-[#8B7355] text-white flex items-center justify-center font-bold text-sm">1</span>
                          <h4 className="font-bold text-[#0F172A] text-base font-displayPlayFair">
                            Sauna Session Time Slot
                          </h4>
                        </div>
                        {packageSlots.data.sauna.private_sauna && packageSlots.data.sauna.shared_sauna && (
                          <div className="flex bg-white rounded-lg p-1 border border-[#E8E2DC] text-xs font-semibold">
                            <button
                              type="button"
                              onClick={() => {
                                setPkgSaunaType("private");
                                setPkgSaunaSlot(null);
                                savePackageSelections(null, "private");
                              }}
                              className={`px-3 py-1 rounded-md transition-all ${
                                pkgSaunaType === "private" ? "bg-[#8B7355] text-white shadow-xs" : "text-[#64748B]"
                              }`}
                            >
                              Private Sauna
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setPkgSaunaType("shared");
                                setPkgSaunaSlot(null);
                                savePackageSelections(null, "shared");
                              }}
                              className={`px-3 py-1 rounded-md transition-all ${
                                pkgSaunaType === "shared" ? "bg-[#8B7355] text-white shadow-xs" : "text-[#64748B]"
                              }`}
                            >
                              Shared Sauna
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Private Sauna Slots */}
                      {pkgSaunaType === "private" && packageSlots.data.sauna.private_sauna?.slots && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                          {(() => {
                            const p3Slots = packageSlots.data.sauna.private_sauna.slots["3_hours"] || [];
                            const p4Slots = packageSlots.data.sauna.private_sauna.slots["4_hours"] || [];
                            const allSlots = [...p3Slots, ...p4Slots];

                            if (allSlots.length === 0) {
                              return (
                                <p className="col-span-full text-xs text-amber-800 bg-amber-50 p-3 rounded-xl">
                                  No private sauna slots available for this date.
                                </p>
                              );
                            }

                            return allSlots.map((slot: any, idx: number) => {
                              const label = `${slot.start_time} - ${slot.end_time}`;
                              const isSel = pkgSaunaSlot === label;
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    setPkgSaunaSlot(label);
                                    savePackageSelections(label);
                                  }}
                                  className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                                    isSel
                                      ? "bg-[#FCF2E9] border-[#8B7355] shadow-sm ring-2 ring-[#8B7355]/20"
                                      : "bg-white border-[#E2E8F0] hover:border-[#D1B191]"
                                  }`}
                                >
                                  <div>
                                    <span className="text-sm font-bold text-[#0F172A] block">{label}</span>
                                    <span className="text-[10px] text-[#64748B]">
                                      {slot.time_slot === "4_hours" ? "4-hour" : "3-hour"} private session • Buffer until {slot.buffer_end_time}
                                    </span>
                                  </div>
                                  {isSel && <BiCheckCircle className="text-[#8B7355]" size={20} />}
                                </button>
                              );
                            });
                          })()}
                        </div>
                      )}

                      {/* Shared Sauna Slots */}
                      {pkgSaunaType === "shared" && packageSlots.data.sauna.shared_sauna?.slots && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                          {packageSlots.data.sauna.shared_sauna.slots.map((slot: any, idx: number) => {
                            const label = `${slot.start_time} - ${slot.end_time}`;
                            const isSel = pkgSaunaSlot === label;
                            const isSoldOut = slot.is_fully_booked || !slot.is_available || slot.remaining_capacity === 0;

                            return (
                              <button
                                key={idx}
                                type="button"
                                disabled={isSoldOut}
                                onClick={() => {
                                  setPkgSaunaSlot(label);
                                  savePackageSelections(label);
                                }}
                                className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                                  isSel
                                    ? "bg-[#FCF2E9] border-[#8B7355] shadow-sm ring-2 ring-[#8B7355]/20"
                                    : isSoldOut
                                    ? "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                                    : "bg-white border-[#E2E8F0] hover:border-[#D1B191]"
                                }`}
                              >
                                <div>
                                  <span className="text-sm font-bold text-[#0F172A] block">{label}</span>
                                  <span className="text-[10px] text-[#64748B]">Shared sauna • 90 mins</span>
                                </div>
                                <div>
                                  {isSoldOut ? (
                                    <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded-full">Sold Out</span>
                                  ) : (
                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] font-bold rounded-full">
                                      {slot.remaining_capacity} left
                                    </span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. Lunchroom Timing (If included) */}
                  {packageSlots?.data?.lunchroom?.is_available && (
                    <div className="bg-[#FAF7F2] rounded-2xl p-6 border border-[#E8E2DC]">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-8 h-8 rounded-lg bg-[#8B7355] text-white flex items-center justify-center font-bold text-sm">2</span>
                        <h4 className="font-bold text-[#0F172A] text-base font-displayPlayFair">
                          Lunchroom Preferred Dining Arrival
                        </h4>
                      </div>
                      <p className="text-xs text-[#64748B] mb-4">
                        {packageSlots.data.lunchroom.info || "Lunchroom accommodates flexible dining during opening hours."} (Hours: 09:00 – 16:00)
                      </p>
                      {dayError ? (
                        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
                          <BiInfoCircle size={18} className="flex-shrink-0" />
                          <span>{dayError}</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-3">
                          {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"].map((timeStr) => {
                            const isSel = pkgLunchTime === timeStr;
                            return (
                              <button
                                key={timeStr}
                                type="button"
                                onClick={() => {
                                  setPkgLunchTime(timeStr);
                                  savePackageSelections(undefined, undefined, timeStr);
                                }}
                                className={`py-3 px-4 rounded-xl border font-bold text-sm transition-all ${
                                  isSel
                                    ? "bg-[#8B7355] text-white border-[#8B7355] shadow-xs"
                                    : "bg-white border-[#E2E8F0] text-[#475569] hover:border-[#D1B191]"
                                }`}
                              >
                                {timeStr}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 3. Activities on this date (If included in package) */}
                  {storedData.packageSelections?.includedServices?.includes("activity") && (
                    <div className="bg-[#FAF7F2] rounded-2xl p-6 border border-[#E8E2DC]">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-8 h-8 rounded-lg bg-[#8B7355] text-white flex items-center justify-center font-bold text-sm">3</span>
                        <h4 className="font-bold text-[#0F172A] text-base font-displayPlayFair">
                          Activity Session on {date}
                        </h4>
                      </div>
                      {packageSlots?.data?.activities && packageSlots.data.activities.length > 0 ? (
                        <div className="space-y-3">
                          {packageSlots.data.activities.map((act: any) => {
                            const isSel = pkgSelectedActivityId === act.id;
                            const isSoldOut = act.available_slots === 0;
                            return (
                              <button
                                key={act.id}
                                type="button"
                                disabled={isSoldOut}
                                onClick={() => {
                                  setPkgSelectedActivityId(act.id);
                                  savePackageSelections(undefined, undefined, undefined, act.id);
                                }}
                                className={`w-full p-4 rounded-xl border text-left transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                                  isSel
                                    ? "bg-[#FCF2E9] border-[#8B7355] shadow-sm ring-2 ring-[#8B7355]/20"
                                    : isSoldOut
                                    ? "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                                    : "bg-white border-[#E2E8F0] hover:border-[#D1B191]"
                                }`}
                              >
                                <div>
                                  <h5 className="font-bold text-[#0F172A] text-base">{act.title}</h5>
                                  <p className="text-xs text-[#64748B] mt-1">
                                    Time: {act.open_time} – {act.close_time} • Host: {act.host || "Wellness Guide"}
                                  </p>
                                </div>
                                <div className="flex items-center gap-3">
                                  {isSoldOut ? (
                                    <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full">
                                      Sold Out
                                    </span>
                                  ) : (
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-bold rounded-full">
                                      {act.available_slots} spots left
                                    </span>
                                  )}
                                  {isSel && <BiCheckCircle className="text-[#8B7355]" size={22} />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                          <BiInfoCircle className="text-amber-700 flex-shrink-0 mt-0.5" size={18} />
                          <div>
                            <span className="font-bold block text-sm text-amber-950 mb-0.5">No Activity Session Found</span>
                            <span>No scheduled activity sessions are available on {date}. Please pick another date or proceed with your remaining package options.</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
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

              {loadingApiSlots && (
                <div className="p-8 text-center text-xs text-[#64748B] italic">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-[#8B7355] border-t-transparent mr-2 align-middle"></div>
                  Checking live available slots for {date}...
                </div>
              )}

              {!loadingApiSlots && apiSlots?.is_blocked && (
                <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold flex items-center gap-3">
                  <BiInfoCircle size={22} className="flex-shrink-0" />
                  <div>
                    <h5 className="font-bold">Date Blocked</h5>
                    <p className="text-xs font-normal mt-0.5">{apiSlots.message || "No slots available. This date is blocked by administration."}</p>
                  </div>
                </div>
              )}

              {!loadingApiSlots && !apiSlots?.is_blocked && isSaltRoom ? (
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
              ) : !loadingApiSlots && !apiSlots?.is_blocked && isSharedSauna ? (
                /* Shared Sauna Live API Slots or Fallback */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(() => {
                    const slotsList = apiSlots?.data?.shared_sauna?.slots;
                    if (slotsList && slotsList.length > 0) {
                      return slotsList.map((slot, i) => {
                        const label = `${slot.start_time} - ${slot.end_time}`;
                        const isSelected = selectedTime === label;
                        const isFullyBooked = slot.is_fully_booked || slot.remaining_capacity === 0;
                        const currentGuestsCount = parseInt(guests, 10) || 1;
                        const isNotEnoughCapacity = !isFullyBooked && slot.remaining_capacity < currentGuestsCount;
                        const isSoldOut = isFullyBooked || isNotEnoughCapacity;

                        return (
                          <button
                            key={i}
                            type="button"
                            disabled={isSoldOut}
                            onClick={() => handleTimeSelect(label)}
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
                                {label}
                              </span>
                              <span className="text-[11px] text-[#64748B]">
                                90m session • Changeover buffer ({slot.buffer_end_time})
                              </span>
                            </div>

                            <div className="text-right flex flex-col items-end">
                              {isFullyBooked ? (
                                <span className="px-2.5 py-1 bg-rose-100 text-rose-700 text-[10px] font-bold rounded-full">
                                  Fully Booked
                                </span>
                              ) : isNotEnoughCapacity ? (
                                <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full border border-amber-300">
                                  Only {slot.remaining_capacity} {slot.remaining_capacity === 1 ? "place" : "places"} left
                                </span>
                              ) : (
                                <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                                  slot.remaining_capacity <= 2 ? "bg-amber-100 text-amber-800 border-amber-300" : "bg-emerald-50 text-emerald-700 border-emerald-300"
                                }`}>
                                  {slot.remaining_capacity} {slot.remaining_capacity === 1 ? "place" : "places"} remaining
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      });
                    }

                    return sharedSaunaSessions.map((sess) => {
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
                    });
                  })()}
                </div>
              ) : !loadingApiSlots && !apiSlots?.is_blocked && isPrivateSauna && (apiSlots?.data?.private_sauna?.slots || apiSlots?.data?.private_sauna?.available_slots) ? (
                /* Private Sauna Live API Slots */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(() => {
                    const durationKey = storedData.durationHours === 4 ? "4_hours" : "3_hours";
                    const pSlots = apiSlots.data?.private_sauna?.slots?.[durationKey] || apiSlots.data?.private_sauna?.available_slots?.[durationKey] || [];
                    if (pSlots.length === 0) {
                      return (
                        <div className="col-span-full p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-semibold">
                          No {storedData.durationHours || 3}-hour private sauna slots available on this date.
                        </div>
                      );
                    }
                    return pSlots.map((slot, i) => {
                      const label = `${slot.start_time} - ${slot.end_time}`;
                      const isSelected = selectedTime === label;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleTimeSelect(label)}
                          className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                            isSelected
                              ? "bg-[#FCF2E9] border-[#8B7355] shadow-md ring-2 ring-[#8B7355]/20"
                              : "bg-white border-[#E2E8F0] hover:border-[#D1B191]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-base font-bold font-displayPlayFair text-[#0F172A]">
                              {label}
                            </span>
                            {isSelected && <BiCheckCircle className="text-[#8B7355]" size={18} />}
                          </div>
                          <span className="text-[10px] text-[#64748B] mt-1">
                            Buffer until {slot.buffer_end_time}
                          </span>
                        </button>
                      );
                    });
                  })()}
                </div>
              ) : !loadingApiSlots && !apiSlots?.is_blocked ? (
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
              ) : null}
            </div>
          )}

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
                  {n} {n === 1 ? "Person / Place" : "People / Places"} {!isPackage && `(${calculateOptionPrice(n)})`}
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
