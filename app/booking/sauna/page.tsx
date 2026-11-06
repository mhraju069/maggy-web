"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import SaunaCard from "@/components/shared/SaunaCard";
import {
  parseApiErrorMessage,
  PrivateSaunaItem,
  SaunaServicesResponse,
  servicesService,
  ServiceSlotsResponse,
  SharedSaunaItem,
} from "@/lib/api";
import { BookingExtra, getStoredBookingData, updateStoredBookingData } from "@/lib/bookingStore";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BiCheckCircle, BiInfoCircle, BiTimeFive } from "react-icons/bi";
import { FaBroom, FaCalendarAlt, FaHotTub, FaSpa } from "react-icons/fa";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const defaultExtras: BookingExtra[] = [
  { id: "towels", name: "Premium Towel & Bathrobe Set", price: 15 },
  { id: "refreshments", name: "Organic Food & Refreshment Platter", price: 35 },
  { id: "decorations", name: "Celebration & Romantic Decorations", price: 30 },
  { id: "wellness_pack", name: "Essential Oils & Scrub Package", price: 25 },
];

const parsePrice = (val: string | number | undefined, defaultVal: number): number => {
  if (val === undefined || val === null || val === "") return defaultVal;
  const str = String(val).trim();
  const isNegative = str.startsWith("-");
  const cleanStr = str.replace(/[^0-9.]/g, "");
  if (!cleanStr) return defaultVal;
  const num = parseFloat(cleanStr);
  if (isNaN(num)) return defaultVal;
  if (isNegative && num > 1000) return defaultVal;
  return num;
};

export default function SaunaBookingPage() {
  const { t } = useLanguage();
  const flow = (t as any)?.bookingFlow;
  const sTrans = flow?.sauna;
  const btnTrans = flow?.buttons;

  const [selectedSaunaType, setSelectedSaunaType] = useState<"private" | "shared">("private");
  const [durationHours, setDurationHours] = useState<3 | 4>(3);
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [selectedExtras, setSelectedExtras] = useState<BookingExtra[]>([]);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [slotsData, setSlotsData] = useState<ServiceSlotsResponse | null>(null);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

  const [saunaData, setSaunaData] = useState<SaunaServicesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = getStoredBookingData();
    if (stored.date) setSelectedDate(stored.date);
    if (stored.timeSlot) setSelectedTimeSlot(stored.timeSlot);
  }, []);

  const fetchSlotsForDate = useCallback(async (dateVal: string) => {
    if (!dateVal) {
      setSlotsData(null);
      return;
    }
    setLoadingSlots(true);
    setSlotsData(null);
    try {
      const res = await servicesService.getServiceSlots("sauna", dateVal);
      setSlotsData(res);
    } catch (err) {
      console.error("Error fetching slots:", err);
      setSlotsData(null);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchSlotsForDate(selectedDate);
    }
  }, [selectedDate, fetchSlotsForDate]);

  const handleDateChange = (dateVal: string) => {
    setSelectedDate(dateVal);
    setSelectedTimeSlot("");
    updateStoredBookingData({ date: dateVal, timeSlot: "" });
  };

  const handleTimeSlotSelect = (slotStr: string) => {
    setSelectedTimeSlot(slotStr);
    updateStoredBookingData({ timeSlot: slotStr });
  };

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSaunaData(null);
    try {
      const data = await servicesService.getSaunaServices();
      setSaunaData(data);
    } catch (err: unknown) {
      setError(parseApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    const refreshFromBookingState = () => {
      const stored = getStoredBookingData();
      if (stored.date) {
        setSelectedDate(stored.date);
        fetchSlotsForDate(stored.date);
      }
      fetchServices();
    };
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) refreshFromBookingState();
    };
    const handlePopState = () => refreshFromBookingState();

    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [fetchServices, fetchSlotsForDate]);

  // Dynamic pricing calculated from API
  const rawData = (saunaData as any)?.data || saunaData;
  const privateItem: PrivateSaunaItem | undefined =
    rawData?.private_sauna?.[0] || (Array.isArray(rawData) ? rawData[0] : undefined);
  const sharedItem: SharedSaunaItem | undefined = rawData?.shared_sauna?.[0];

  const price3Hrs = parsePrice(privateItem?.base_price_3hrs, 250);
  const price4Hrs = parsePrice(privateItem?.base_price_4hrs, 300);
  const extraPersonFee = parsePrice(privateItem?.extra_person_price, 50);
  const sharedPricePerson = parsePrice(sharedItem?.price_per_person, 35);

  const privateBasePrice = durationHours === 4 ? price4Hrs : price3Hrs;
  const extraGuestsCount = Math.max(0, guestsCount - 2);

  const rawFeatures: any[] =
    privateItem?.features ||
    (privateItem as any)?.service_features ||
    (privateItem as any)?.addons ||
    (rawData as any)?.features ||
    [];

  const apiFeatures: BookingExtra[] = rawFeatures.map((f: any, idx: number) => ({
    id: String(f.id ?? idx),
    name: f.feature || f.name || f.title || f.description || `Feature ${idx + 1}`,
    price: parsePrice(f.price, 0),
  }));

  const sharedMaxPerson =
    sharedItem?.max_person && sharedItem.max_person > 0 && sharedItem.max_person <= 50
      ? sharedItem.max_person
      : 6;
  const sharedGuestOptions = Array.from({ length: Math.min(sharedMaxPerson, 10) }, (_, i) => i + 1);

  const currentTotalPrice =
    selectedSaunaType === "private"
      ? privateBasePrice + extraGuestsCount * extraPersonFee + selectedExtras.reduce((s, e) => s + e.price, 0)
      : parseFloat((guestsCount * sharedPricePerson).toFixed(2));

  // Sync state to bookingStore
  useEffect(() => {
    if (selectedSaunaType === "private") {
      updateStoredBookingData({
        serviceName: `VIP Sauna (${durationHours} Hours)`,
        serviceType: "sauna",
        isSharedSauna: false,
        isSaltRoom: false,
        durationHours,
        guestsCount,
        cleaningTimeMinutes: 30,
        selectedExtras,
        totalAmount: currentTotalPrice,
        price: `€${currentTotalPrice}`,
      });
    } else {
      updateStoredBookingData({
        serviceName: "Sauna Experience",
        serviceType: "sauna",
        isSharedSauna: true,
        isSaltRoom: false,
        durationHours: 1.5,
        guestsCount,
        price: `€${currentTotalPrice}`,
        totalAmount: currentTotalPrice,
        selectedExtras: [],
      });
    }
  }, [selectedSaunaType, durationHours, guestsCount, selectedExtras, currentTotalPrice]);

  const toggleExtra = (extra: BookingExtra) => {
    setSelectedExtras((prev) => {
      const exists = prev.some((e) => e.id === extra.id);
      if (exists) {
        return prev.filter((e) => e.id !== extra.id);
      }
      return [...prev, extra];
    });
  };

  if (loading) {
    return (
      <div className="w-full px-6 md:px-12 max-w-4xl mx-auto py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#8B7355] border-t-transparent mb-4"></div>
        <p className="text-[#64748B] font-cambria italic">{flow?.common?.loading || "Loading Sauna Services..."}</p>
      </div>
    );
  }

  if (!privateItem && !sharedItem) {
    return (
      <div className="w-full px-6 md:px-12 max-w-4xl mx-auto py-16">
        <div className="text-center mb-12 flex flex-col items-center">
          <h1 className="font-displayPlayFair text-5xl text-[#1d1a17] mb-2 uppercase tracking-tight">
            {sTrans?.title || "Sauna & Wellness"}
          </h1>
          <DecorativeUnderline />
        </div>
        <div className="bg-white rounded-[32px] p-12 shadow-sm border border-[#E8E2DC] text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-[#FCF2E9] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#8B7355]">
            <FaSpa className="w-8 h-8" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold font-displayPlayFair text-[#0F172A] mb-2">
            {flow?.emptyState?.title || "No Service Available"}
          </h3>
          <p className="text-sm text-[#64748B] font-cambria italic">
            {sTrans?.noServiceAvailable || "Currently there are no sauna services available from the server. Please check back later."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-6 md:px-12">
      {/* ── Title Section ── */}
      <div className="text-center mb-12 flex flex-col items-center">
        <h1 className="font-displayPlayFair text-5xl text-[#1d1a17] mb-2 uppercase tracking-tight">
          {sTrans?.title || "Sauna & Wellness"}
        </h1>
        <DecorativeUnderline />
        <p className="font-cambria text-sm text-[#475569] mt-6 italic">
          {sTrans?.subtitle || "Exclusive private sanctuary or peaceful shared wellness experience."}
        </p>
      </div>

      {/* ── Sauna Type Selector ── */}
      <div className="max-w-4xl mx-auto mb-10 flex justify-center">
        <div className="grid w-full max-w-xl grid-cols-2 p-1.5 bg-white rounded-2xl border border-[#E8E2DC] shadow-xs sm:inline-flex sm:w-auto sm:max-w-none">
          <button
            type="button"
            onClick={() => setSelectedSaunaType("private")}
            className={`min-w-0 justify-center px-2 py-3 sm:px-8 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm leading-tight text-center transition-all flex items-center gap-2 ${selectedSaunaType === "private"
              ? "bg-[#8B7355] text-white shadow-md"
              : "text-[#64748B] hover:text-[#0F172A]"
              }`}
          >
            <FaSpa size={18} className="shrink-0" />
            {sTrans?.privateTab || "VIP Sauna (Exclusive Group)"}
          </button>
          <button
            type="button"
            onClick={() => setSelectedSaunaType("shared")}
            className={`min-w-0 justify-center px-2 py-3 sm:px-8 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm leading-tight text-center transition-all flex items-center gap-2 ${selectedSaunaType === "shared"
              ? "bg-[#8B7355] text-white shadow-md"
              : "text-[#64748B] hover:text-[#0F172A]"
              }`}
          >
            <FaHotTub size={18} className="shrink-0" />
            {sTrans?.sharedTab || "Sauna"}
          </button>
        </div>
      </div>

      {/* ── VIP Sauna Configurator ── */}
      {selectedSaunaType === "private" ? (
        <div className="max-w-4xl mx-auto rounded-2xl sm:rounded-[32px] space-y-8 sm:space-y-10">
          {/* Badge & Banner */}
          <div className="p-6 rounded-2xl bg-[#FCF2E9] border border-[#E8E2DC] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B7355] block">
                  {sTrans?.exclusiveReservation || "Exclusive Reservation"}
                </span>
                <h3 className="text-xl font-bold font-displayPlayFair text-[#0F172A]">
                  {sTrans?.privateBannerTitle || "VIP Sauna"}
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {sTrans?.privateBannerDesc || "Booked exclusively by your group (2 to 6 people). Includes private sauna, jacuzzi & lounge."}
                </p>
              </div>
            </div>
          </div>

          {/* Duration Selector */}
          <div>
            <label
              className="block text-sm font-bold text-[#0F172A] mb-4 uppercase tracking-wider"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {sTrans?.selectDuration || "1. Select Session Duration"}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setDurationHours(3)}
                className={`p-6 rounded-2xl border transition-all text-left flex items-start justify-between ${durationHours === 3
                  ? "bg-[#FCF2E9] border-[#8B7355] shadow-md ring-2 ring-[#8B7355]/20"
                  : "bg-white border-[#E2E8F0] hover:border-[#D1B191]"
                  }`}
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#8B7355] block mb-1">
                    {sTrans?.popularChoice || "Popular Choice"}
                  </span>
                  <h4 className="text-xl md:text-2xl font-bold font-displayPlayFair text-[#0F172A]">
                    {sTrans?.threeHours || "3 Hours Session"}
                  </h4>
                  <p className="text-xs text-[#64748B] mt-1">
                    {sTrans?.threeHoursBaseDesc
                      ? sTrans.threeHoursBaseDesc.replace("{price}", String(price3Hrs)).replace("{extra}", String(extraPersonFee))
                      : `Includes 2 people base (€${price3Hrs}) • €${extraPersonFee}/extra person`}
                  </p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${durationHours === 3 ? "border-[#8B7355] bg-[#8B7355] text-white" : "border-[#CBD5E1]"
                    }`}
                >
                  {durationHours === 3 && <BiCheckCircle size={16} />}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDurationHours(4)}
                className={`p-6 rounded-2xl border transition-all text-left flex items-start justify-between ${durationHours === 4
                  ? "bg-[#FCF2E9] border-[#8B7355] shadow-md ring-2 ring-[#8B7355]/20"
                  : "bg-white border-[#E2E8F0] hover:border-[#D1B191]"
                  }`}
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#8B7355] block mb-1">
                    {sTrans?.extendedRelaxation || "Extended Relaxation"}
                  </span>
                  <h4 className="text-xl md:text-2xl font-bold font-displayPlayFair text-[#0F172A]">
                    {sTrans?.fourHours || "4 Hours Session"}
                  </h4>
                  <p className="text-xs text-[#64748B] mt-1">
                    {sTrans?.fourHoursBaseDesc
                      ? sTrans.fourHoursBaseDesc.replace("{price}", String(price4Hrs)).replace("{extra}", String(extraPersonFee))
                      : `Includes 2 people base (€${price4Hrs}) • €${extraPersonFee}/extra person`}
                  </p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${durationHours === 4 ? "border-[#8B7355] bg-[#8B7355] text-white" : "border-[#CBD5E1]"
                    }`}
                >
                  {durationHours === 4 && <BiCheckCircle size={16} />}
                </div>
              </button>
            </div>
          </div>

          {/* Number of People (Capacity 2 to 6) */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label
                className="block text-xl  font-bold text-[#0F172A] uppercase tracking-wider"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {sTrans?.selectGuests || "2. Number of Guests (2 to 6 People)"}
              </label>
              <span className="text-xs font-semibold text-[#8B7355]">
                {guestsCount > 2
                  ? sTrans?.baseWithExtraGuests
                    ? sTrans.baseWithExtraGuests.replace("{count}", String(guestsCount - 2))
                    : `Base (2 people) + ${guestsCount - 2} Extra Guests`
                  : sTrans?.baseGroupTwoPeople || "Base Group (2 People)"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {[2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setGuestsCount(num)}
                  className={`py-4 rounded-xl border font-bold text-center transition-all ${guestsCount === num
                    ? "bg-[#8B7355] border-[#8B7355] text-white shadow-md scale-[1.03]"
                    : "bg-white border-[#E2E8F0] text-[#475569] hover:border-[#D1B191]"
                    }`}
                >
                  <span className="block text-lg font-displayPlayFair">{num}</span>
                  <span className="text-[10px] uppercase font-mono tracking-tight opacity-90">
                    {num === 2 ? (sTrans?.baseBadge || "Base") : `+€${(num - 2) * 50}`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Extras */}
          <div>
            <label
              className="block text-sm font-bold text-[#0F172A] mb-4 uppercase tracking-wider"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {sTrans?.enhanceExperience || "3. Enhance Your Experience (Optional Extras)"}
            </label>
            {apiFeatures.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {apiFeatures.map((extra) => {
                  const isSelected = selectedExtras.some((e) => e.id === extra.id);
                  return (
                    <button
                      key={extra.id}
                      type="button"
                      onClick={() => toggleExtra(extra)}
                      className={`p-4 rounded-xl border transition-all text-left flex items-center justify-between ${isSelected
                        ? "bg-[#FCF2E9] border-[#8B7355] shadow-xs"
                        : "bg-white border-[#E2E8F0] hover:border-[#D1B191]"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs ${isSelected ? "bg-[#8B7355] border-[#8B7355] text-white" : "border-[#CBD5E1]"
                            }`}
                        >
                          {isSelected && "✓"}
                        </div>
                        <span className="text-xs font-bold text-[#0F172A]">{extra.name}</span>
                      </div>
                      <span className="text-xs font-bold text-[#8B7355]">
                        {extra.price > 0 ? `+€${extra.price}` : (sTrans?.extraIncluded || "Included")}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-center text-xs font-medium text-[#64748B]">
                {sTrans?.noExtrasFound || "No extras found"}
              </div>
            )}
          </div>

          {/* Price Breakdown & Automatic Total Calculation */}
          <div className="p-6 rounded-2xl bg-[#FBF6F3] border border-[#E8E2DC] space-y-4">
            <div className="flex justify-between items-center text-xs text-[#64748B] pb-3 border-b border-[#E8E2DC]/80">
              <span>
                {sTrans?.sessionBaseGuests
                  ? sTrans.sessionBaseGuests.replace("{hours}", String(durationHours))
                  : `${durationHours} Hours Session Base (2 Guests)`}
              </span>
              <span className="font-bold text-[#0F172A]">€{durationHours === 4 ? price4Hrs : price3Hrs}</span>
            </div>

            {guestsCount > 2 && (
              <div className="flex justify-between items-center text-xs text-[#64748B] pb-3 border-b border-[#E8E2DC]/80">
                <span>
                  {sTrans?.additionalGuests
                    ? sTrans.additionalGuests.replace("{count}", String(guestsCount - 2)).replace("{price}", String(extraPersonFee))
                    : `Additional Guests (${guestsCount - 2} × €${extraPersonFee})`}
                </span>
                <span className="font-bold text-[#0F172A]">+€{(guestsCount - 2) * extraPersonFee}</span>
              </div>
            )}

            {selectedExtras.map((ext) => (
              <div key={ext.id} className="flex justify-between items-center text-xs text-[#64748B] pb-2">
                <span>Extra: {ext.name}</span>
                <span className="font-bold text-[#0F172A]">+€{ext.price}</span>
              </div>
            ))}

            <div className="flex justify-between items-center pt-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#8B7355] block">
                  {sTrans?.totalCalculatedPrice || "Total Calculated Price"}
                </span>
                <span className="text-[11px] text-[#64748B]">
                  {sTrans?.includesAllTaxes || "Includes all taxes & private access"}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xl sm:text-4xl font-bold font-displayPlayFair text-[#8B7355]">
                  €{currentTotalPrice}
                </span>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* ── Sauna Configurator ── */
        <div className="max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-[32px] p-4 sm:p-8 md:p-10 shadow-sm border border-[#E8E2DC] space-y-8">
          {/* Header Banner */}
          <div className="p-6 rounded-2xl bg-[#FCF2E9] border border-[#E8E2DC] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3 flex-col md:flex-row sm:gap-4">
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B7355] block">
                  {sTrans?.sharedSessionAccess || "Shared Session Access"}
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-displayPlayFair text-[#0F172A] break-words">
                  {sTrans?.sharedBannerTitle || "Sauna Experience"}
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5 break-words">
                  {sTrans?.sharedDesc
                    ? sTrans.sharedDesc.replace("{max}", String(sharedMaxPerson))
                    : `Different customers can book the same 1.5-hour session. Max ${sharedMaxPerson} people per session.`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white px-3 sm:px-4 py-2 rounded-xl border border-[#D1B191]/60 text-xs font-bold text-[#8B7355] flex-shrink-0 self-start sm:self-auto whitespace-nowrap">
              <BiTimeFive size={16} />
              <span>{sTrans?.onePointFiveHours || "1.5 Hours"}</span>
            </div>
          </div>

          {/* Session Overview Badges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#FBF6F3] border border-[#E8E2DC] text-center">
              <span className="text-xs text-[#64748B] block mb-1">
                {sTrans?.sessionDuration || "Session Duration"}
              </span>
              <span className="text-lg font-bold text-[#0F172A] font-displayPlayFair">
                {sTrans?.onePointFiveHoursLong || "1.5 Hours (90 Mins)"}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FBF6F3] border border-[#E8E2DC] text-center">
              <span className="text-xs text-[#64748B] block mb-1">
                {sTrans?.pricePerPerson || "Price Per Person"}
              </span>
              <span className="text-lg font-bold text-[#8B7355] font-displayPlayFair">
                €{sharedPricePerson} / {sTrans?.perPerson || "Person"}
              </span>
            </div>
          </div>

          {/* Guest Count Selector */}
          <div>
            <label className="block text-sm font-bold text-[#0F172A] mb-3 uppercase tracking-wider" style={{ fontFamily: "Inter, sans-serif" }}>
              {sTrans?.selectPlaces
                ? sTrans.selectPlaces.replace("{max}", String(sharedMaxPerson))
                : `Number of Places / Guests (1 to ${sharedMaxPerson})`}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
              {sharedGuestOptions.map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setGuestsCount(num)}
                  className={`py-3.5 rounded-xl border font-bold text-center transition-all ${guestsCount === num
                    ? "bg-[#8B7355] border-[#8B7355] text-white shadow-md scale-[1.03]"
                    : "bg-white border-[#E2E8F0] text-[#475569] hover:border-[#D1B191]"
                    }`}
                >
                  <span className="block text-base font-displayPlayFair">{num}</span>
                  <span className="text-[10px] uppercase font-mono">
                    {num === 1
                      ? (sTrans?.onePerson || "1 Person")
                      : (sTrans?.placesCount ? sTrans.placesCount.replace("{count}", String(num)) : `${num} Places`)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Calculation Summary */}
          <div className="p-4 sm:p-6 rounded-2xl bg-[#FBF6F3] border border-[#E8E2DC] flex sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="min-w-0">
              <span className="text-xs font-bold uppercase tracking-widest text-[#8B7355] block">
                {sTrans?.totalAmountDue || "Total Amount Due"}
              </span>
              <span className="text-[11px] text-[#64748B] break-words">
                {sTrans?.guestsCalcNote
                  ? sTrans.guestsCalcNote.replace("{count}", String(guestsCount)).replace("{price}", String(sharedPricePerson))
                  : `${guestsCount} guest(s) × €${sharedPricePerson} (1.5h session)`}
              </span>
            </div>
            <div className="text-left sm:text-right self-end sm:self-auto">
              <span className="text-xl sm:text-4xl font-bold font-displayPlayFair text-[#8B7355]">
                €{currentTotalPrice}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer Buttons ── */}
      <div className="max-w-4xl mx-auto mt-12 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-[#FBF6F3] p-4 sm:p-8 rounded-2xl shadow-sm border border-[#E8E2DC]">
        <Link
          href="/booking"
          className="w-full sm:w-auto justify-center px-6 sm:px-10 py-3.5 sm:py-4 rounded-xl border border-[#CFB9A3] text-[#1d1a17] font-bold text-sm hover:bg-[#CFB9A3] hover:bg-opacity-10 transition-all flex items-center gap-3"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          {btnTrans?.back || "Back"}
        </Link>

        <Link
          href="/booking/choose-time"
          className="w-full sm:w-auto justify-center px-6 sm:px-12 py-3.5 sm:py-4 rounded-xl bg-[#D1B191] hover:bg-[#C4A484] text-white font-bold text-sm flex items-center gap-3 transition-all shadow-lg transform sm:translate-y-[-2px]"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {btnTrans?.continue || "Continue"}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </Link>
      </div>
    </div>
  );
}
