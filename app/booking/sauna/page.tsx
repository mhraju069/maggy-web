"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import SaunaCard from "@/components/shared/SaunaCard";
import {
  parseApiErrorMessage,
  PrivateSaunaItem,
  SaunaServicesResponse,
  servicesService,
  SharedSaunaItem,
} from "@/lib/api";
import { BookingExtra, getStoredBookingData, updateStoredBookingData } from "@/lib/bookingStore";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BiCheckCircle, BiInfoCircle, BiTimeFive } from "react-icons/bi";
import { FaBroom, FaHotTub, FaSpa } from "react-icons/fa";

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
  const [selectedSaunaType, setSelectedSaunaType] = useState<"private" | "shared">("private");
  const [durationHours, setDurationHours] = useState<3 | 4>(3);
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [selectedExtras, setSelectedExtras] = useState<BookingExtra[]>([]);

  const [saunaData, setSaunaData] = useState<SaunaServicesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
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
        serviceName: `Private Sauna (${durationHours} Hours)`,
        serviceType: "sauna",
        durationHours,
        guestsCount,
        cleaningTimeMinutes: 30,
        selectedExtras,
        totalAmount: currentTotalPrice,
        price: `€${currentTotalPrice}`,
      });
    } else {
      updateStoredBookingData({
        serviceName: "Shared Sauna Experience",
        serviceType: "sauna",
        isSharedSauna: true,
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

  return (
    <div className="w-full px-6 md:px-12">
      {/* ── Title Section ── */}
      <div className="text-center mb-12 flex flex-col items-center">
        <h1 className="font-displayPlayFair text-5xl text-[#1d1a17] mb-2 uppercase tracking-tight">
          Sauna & Wellness
        </h1>
        <DecorativeUnderline />
        <p className="font-cambria text-sm text-[#475569] mt-6 italic">
          Exclusive private sanctuary or peaceful shared wellness experience.
        </p>
      </div>

      {/* ── Sauna Type Selector ── */}
      <div className="max-w-4xl mx-auto mb-10 flex justify-center">
        <div className="inline-flex p-1.5 bg-white rounded-2xl border border-[#E8E2DC] shadow-xs">
          <button
            type="button"
            onClick={() => setSelectedSaunaType("private")}
            className={`px-8 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              selectedSaunaType === "private"
                ? "bg-[#8B7355] text-white shadow-md"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            <FaSpa size={18} />
            Private Sauna (Exclusive Group)
          </button>
          <button
            type="button"
            onClick={() => setSelectedSaunaType("shared")}
            className={`px-8 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              selectedSaunaType === "shared"
                ? "bg-[#8B7355] text-white shadow-md"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            <FaHotTub size={18} />
            Shared Sauna
          </button>
        </div>
      </div>

      {/* ── Private Sauna Configurator ── */}
      {selectedSaunaType === "private" ? (
        <div className="max-w-4xl mx-auto bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-[#E8E2DC] space-y-10">
          {/* Badge & Banner */}
          <div className="p-6 rounded-2xl bg-[#FCF2E9] border border-[#E8E2DC] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#8B7355] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <FaSpa size={22} />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B7355] block">
                  Exclusive Reservation
                </span>
                <h3 className="text-xl font-bold font-displayPlayFair text-[#0F172A]">
                  Private Sauna Sanctuary
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Booked exclusively by your group (2 to 6 people). Includes private sauna, jacuzzi & lounge.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-[#D1B191]/60 text-xs font-bold text-[#8B7355] flex-shrink-0">
              <FaBroom size={14} />
              <span>+30 Mins Auto Cleaning Buffer</span>
            </div>
          </div>

          {/* Duration Selector */}
          <div>
            <label
              className="block text-sm font-bold text-[#0F172A] mb-4 uppercase tracking-wider"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              1. Select Session Duration
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setDurationHours(3)}
                className={`p-6 rounded-2xl border transition-all text-left flex items-start justify-between ${
                  durationHours === 3
                    ? "bg-[#FCF2E9] border-[#8B7355] shadow-md ring-2 ring-[#8B7355]/20"
                    : "bg-white border-[#E2E8F0] hover:border-[#D1B191]"
                }`}
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#8B7355] block mb-1">
                    Popular Choice
                  </span>
                  <h4 className="text-2xl font-bold font-displayPlayFair text-[#0F172A]">
                    3 Hours Session
                  </h4>
                  <p className="text-xs text-[#64748B] mt-1">
                    Includes 2 people base (€250) • €50/extra person
                  </p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    durationHours === 3 ? "border-[#8B7355] bg-[#8B7355] text-white" : "border-[#CBD5E1]"
                  }`}
                >
                  {durationHours === 3 && <BiCheckCircle size={16} />}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDurationHours(4)}
                className={`p-6 rounded-2xl border transition-all text-left flex items-start justify-between ${
                  durationHours === 4
                    ? "bg-[#FCF2E9] border-[#8B7355] shadow-md ring-2 ring-[#8B7355]/20"
                    : "bg-white border-[#E2E8F0] hover:border-[#D1B191]"
                }`}
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#8B7355] block mb-1">
                    Extended Relaxation
                  </span>
                  <h4 className="text-2xl font-bold font-displayPlayFair text-[#0F172A]">
                    4 Hours Session
                  </h4>
                  <p className="text-xs text-[#64748B] mt-1">
                    Includes 2 people base (€300) • €50/extra person
                  </p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    durationHours === 4 ? "border-[#8B7355] bg-[#8B7355] text-white" : "border-[#CBD5E1]"
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
                className="block text-sm font-bold text-[#0F172A] uppercase tracking-wider"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                2. Number of Guests (2 to 6 People)
              </label>
              <span className="text-xs font-semibold text-[#8B7355]">
                {guestsCount > 2 ? `Base (2 people) + ${guestsCount - 2} Extra Guests` : "Base Group (2 People)"}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {[2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setGuestsCount(num)}
                  className={`py-4 rounded-xl border font-bold text-center transition-all ${
                    guestsCount === num
                      ? "bg-[#8B7355] border-[#8B7355] text-white shadow-md scale-[1.03]"
                      : "bg-white border-[#E2E8F0] text-[#475569] hover:border-[#D1B191]"
                  }`}
                >
                  <span className="block text-lg font-displayPlayFair">{num}</span>
                  <span className="text-[10px] uppercase font-mono tracking-tight opacity-90">
                    {num === 2 ? "Base" : `+€${(num - 2) * 50}`}
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
              3. Enhance Your Experience (Optional Extras)
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
                      className={`p-4 rounded-xl border transition-all text-left flex items-center justify-between ${
                        isSelected
                          ? "bg-[#FCF2E9] border-[#8B7355] shadow-xs"
                          : "bg-white border-[#E2E8F0] hover:border-[#D1B191]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs ${
                            isSelected ? "bg-[#8B7355] border-[#8B7355] text-white" : "border-[#CBD5E1]"
                          }`}
                        >
                          {isSelected && "✓"}
                        </div>
                        <span className="text-xs font-bold text-[#0F172A]">{extra.name}</span>
                      </div>
                      <span className="text-xs font-bold text-[#8B7355]">
                        {extra.price > 0 ? `+€${extra.price}` : "Included"}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-center text-xs font-medium text-[#64748B]">
                No extras found
              </div>
            )}
          </div>

          {/* Price Breakdown & Automatic Total Calculation */}
          <div className="p-6 rounded-2xl bg-[#FBF6F3] border border-[#E8E2DC] space-y-4">
            <div className="flex justify-between items-center text-xs text-[#64748B] pb-3 border-b border-[#E8E2DC]/80">
              <span>
                {durationHours} Hours Session Base (2 Guests)
              </span>
              <span className="font-bold text-[#0F172A]">€{durationHours === 4 ? price4Hrs : price3Hrs}</span>
            </div>

            {guestsCount > 2 && (
              <div className="flex justify-between items-center text-xs text-[#64748B] pb-3 border-b border-[#E8E2DC]/80">
                <span>Additional Guests ({guestsCount - 2} × €{extraPersonFee})</span>
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
                  Total Calculated Price
                </span>
                <span className="text-[11px] text-[#64748B]">Includes all taxes & private access</span>
              </div>
              <div className="text-right">
                <span className="text-4xl font-bold font-displayPlayFair text-[#8B7355]">
                  €{currentTotalPrice}
                </span>
              </div>
            </div>
          </div>

          {/* Cleaning Buffer Notice */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-3 text-xs text-[#64748B]">
            <BiInfoCircle className="text-[#8B7355] text-lg flex-shrink-0" />
            <span>
              <strong>Automatic Cleaning Buffer:</strong> After your {durationHours}-hour booking, 30 minutes is automatically reserved for thorough cleaning and sanitation before the next group.
            </span>
          </div>
        </div>
      ) : (
        /* ── Shared Sauna Configurator ── */
        <div className="max-w-4xl mx-auto bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-[#E8E2DC] space-y-8">
          {/* Header Banner */}
          <div className="p-6 rounded-2xl bg-[#FCF2E9] border border-[#E8E2DC] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#8B7355] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <FaHotTub size={22} />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B7355] block">
                  Shared Session Access
                </span>
                <h3 className="text-xl font-bold font-displayPlayFair text-[#0F172A]">
                  Shared Sauna Experience
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Different customers can book the same 1.5-hour session. Max {sharedMaxPerson} people per session.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-[#D1B191]/60 text-xs font-bold text-[#8B7355] flex-shrink-0">
              <BiTimeFive size={16} />
              <span>1.5 Hours + 15 Mins Changeover Buffer</span>
            </div>
          </div>

          {/* Session Overview Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#FBF6F3] border border-[#E8E2DC] text-center">
              <span className="text-xs text-[#64748B] block mb-1">Session Duration</span>
              <span className="text-lg font-bold text-[#0F172A] font-displayPlayFair">1.5 Hours (90 Mins)</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FBF6F3] border border-[#E8E2DC] text-center">
              <span className="text-xs text-[#64748B] block mb-1">Price Per Person</span>
              <span className="text-lg font-bold text-[#8B7355] font-displayPlayFair">€{sharedPricePerson} / Person</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#FBF6F3] border border-[#E8E2DC] text-center">
              <span className="text-xs text-[#64748B] block mb-1">Changeover Period</span>
              <span className="text-lg font-bold text-[#0F172A] font-displayPlayFair">15 Mins (Blocked)</span>
            </div>
          </div>

          {/* Guest Count Selector */}
          <div>
            <label className="block text-sm font-bold text-[#0F172A] mb-3 uppercase tracking-wider" style={{ fontFamily: "Inter, sans-serif" }}>
              Number of Places / Guests (1 to {sharedMaxPerson})
            </label>
            <div className="grid grid-cols-6 gap-3">
              {sharedGuestOptions.map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setGuestsCount(num)}
                  className={`py-3.5 rounded-xl border font-bold text-center transition-all ${
                    guestsCount === num
                      ? "bg-[#8B7355] border-[#8B7355] text-white shadow-md scale-[1.03]"
                      : "bg-white border-[#E2E8F0] text-[#475569] hover:border-[#D1B191]"
                  }`}
                >
                  <span className="block text-base font-displayPlayFair">{num}</span>
                  <span className="text-[10px] uppercase font-mono">
                    {num === 1 ? "1 Person" : `${num} Places`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Memberships Card Highlight */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#FCF2E9] to-[#FBF6F3] border border-[#E8E2DC] space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8E2DC]/80 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B7355] block mb-1">
                  Active Membership Check
                </span>
                <h4 className="text-lg font-bold text-[#0F172A] font-displayPlayFair">
                  Are you a Shared Sauna Member?
                </h4>
                <p className="text-xs text-[#64748B]">
                  Active members are automatically recognized and exempt from the €{sharedPricePerson} session fee.
                </p>
              </div>

              <Link
                href="/memberships"
                className="px-4 py-2.5 rounded-xl bg-white border border-[#D1B191] text-[#8B7355] hover:bg-[#8B7355] hover:text-white transition-all text-xs font-bold text-center flex-shrink-0"
              >
                View Membership Plans (€60 / €100)
              </Link>
            </div>

            {/* Shared Sauna Membership Plans Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-white border border-[#E8E2DC]">
                <h5 className="font-bold text-[#0F172A] mb-1">Once a Week Membership</h5>
                <p className="text-[#8B7355] font-bold text-sm">€60 / 4 weeks</p>
                <p className="text-[#64748B] mt-1">Entitlement to 1 shared sauna session per week.</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E8E2DC]">
                <h5 className="font-bold text-[#0F172A] mb-1">Unlimited Membership</h5>
                <p className="text-[#8B7355] font-bold text-sm">€100 / 4 weeks</p>
                <p className="text-[#64748B] mt-1">Unlimited sessions (max 10 future active reservations).</p>
              </div>
            </div>
          </div>

          {/* Price Calculation Summary */}
          <div className="p-6 rounded-2xl bg-[#FBF6F3] border border-[#E8E2DC] flex justify-between items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#8B7355] block">
                Total Amount Due
              </span>
              <span className="text-[11px] text-[#64748B]">
                {guestsCount} guest(s) × €{sharedPricePerson} (1.5h session)
              </span>
            </div>
            <div className="text-right">
              <span className="text-4xl font-bold font-displayPlayFair text-[#8B7355]">
                €{currentTotalPrice}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer Buttons ── */}
      <div className="max-w-4xl mx-auto mt-12 flex justify-between items-center bg-[#FBF6F3] p-8 rounded-2xl shadow-sm border border-[#E8E2DC]">
        <Link
          href="/booking"
          className="px-10 py-4 rounded-xl border border-[#CFB9A3] text-[#1d1a17] font-bold text-sm hover:bg-[#CFB9A3] hover:bg-opacity-10 transition-all flex items-center gap-3"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back
        </Link>

        <Link
          href="/booking/choose-time"
          className="px-12 py-4 rounded-xl bg-[#D1B191] hover:bg-[#C4A484] text-white font-bold text-sm flex items-center gap-3 transition-all shadow-lg transform translate-y-[-2px]"
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
