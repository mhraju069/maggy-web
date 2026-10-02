"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import {
  calculateSaltRoomPrice,
  updateStoredBookingData,
} from "@/lib/bookingStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BiCheckCircle,
  BiCreditCard,
  BiInfoCircle,
  BiTimeFive,
} from "react-icons/bi";
import { FaBoxes, FaCalendarAlt, FaInfinity, FaSpa, FaUsers } from "react-icons/fa";

type OptionType = "single" | "10_session_pass" | "once_a_week" | "unlimited";

interface SaltOption {
  id: OptionType;
  title: string;
  badge?: string;
  price: string;
  subtitle: string;
  icon: React.ReactNode;
  features: string[];
}

const saltOptions: SaltOption[] = [
  {
    id: "single",
    title: "Single Session Reservation",
    badge: "Standard Booking",
    price: "€25 / person",
    subtitle: "1-Hour Aerosol Halotherapy Session",
    icon: <FaSpa className="w-5 h-5 text-[#8B7355]" />,
    features: [
      "1-hour pure aerosol halotherapy session",
      "Maximum 2 people per session",
      "Automatic 10-minute changeover period",
      "Herbal tea & relaxation recliners included",
    ],
  },
  {
    id: "10_session_pass",
    title: "10-Session Pass",
    badge: "Best Value Pass",
    price: "€200",
    subtitle: "10 Sessions (€20 per session)",
    icon: <FaBoxes className="w-5 h-5 text-[#8B7355]" />,
    features: [
      "Linked directly to your customer account",
      "Automatically deducts 1 session when booking",
      "View remaining session balance anytime in account",
      "Valid for 1 full year after purchase date",
    ],
  },
  {
    id: "once_a_week",
    title: "Once-a-Week Membership",
    badge: "Weekly Ritual",
    price: "€70 / 4 weeks",
    subtitle: "1 Session Every Week",
    icon: <FaCalendarAlt className="w-5 h-5 text-[#8B7355]" />,
    features: [
      "1 included session per week",
      "Maximum 4 included sessions per 4-week period",
      "Automatic account membership recognition",
      "Flexible online scheduling in advance",
    ],
  },
  {
    id: "unlimited",
    title: "Unlimited Membership",
    badge: "Ultimate Wellness",
    price: "€100 / 4 weeks",
    subtitle: "Unlimited Halotherapy Access",
    icon: <FaInfinity className="w-5 h-5 text-[#8B7355]" />,
    features: [
      "Unlimited use within available capacity",
      "Each session reserved in advance",
      "Maximum 10 active future reservations at the same time",
      "Priority booking access for prime time slots",
    ],
  },
];

const packagesCombinations = [
  {
    title: "Salt & Sauna Detox Journey",
    combo: "1h Salt Room + 2h Private Sauna",
    price: "€150",
    link: "/booking/packages",
  },
  {
    title: "Signature Harmony Package",
    combo: "Salt Room + Sauna + Organic Lunch",
    price: "€185",
    link: "/booking/packages",
  },
];

export default function SaltRoomBookingPage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<OptionType>("single");
  const [guestsCount, setGuestsCount] = useState<number>(1);
  const [hasActivePass, setHasActivePass] = useState<boolean>(false);

  useEffect(() => {
    const total = calculateSaltRoomPrice(guestsCount, selectedOption, hasActivePass);
    let name = "Salt Room Session";
    if (selectedOption === "10_session_pass") name = "Salt Room (10-Session Pass)";
    else if (selectedOption === "once_a_week") name = "Salt Room (Once-a-Week Membership)";
    else if (selectedOption === "unlimited") name = "Salt Room (Unlimited Membership)";

    updateStoredBookingData({
      serviceName: name,
      serviceType: "salt_room",
      isSaltRoom: true,
      passType: selectedOption,
      guestsCount,
      changeoverMinutes: 10,
      durationHours: 1,
      totalAmount: total,
      price: hasActivePass ? "€0 (Pass / Membership Deducted)" : `€${total}`,
    });
  }, [selectedOption, guestsCount, hasActivePass]);

  const handleContinue = () => {
    router.push("/booking/choose-time");
  };

  const calculatedTotal = calculateSaltRoomPrice(guestsCount, selectedOption, hasActivePass);

  return (
    <div className="w-full px-6 md:px-12 max-w-6xl mx-auto">
      {/* ── Title Section ── */}
      <div className="text-center mb-12 flex flex-col items-center">
        <h1 className="font-displayPlayFair text-5xl text-[#1d1a17] mb-2 uppercase tracking-tight">
          Salt Room Halotherapy
        </h1>
        <DecorativeUnderline />
        <p className="font-cambria text-sm text-[#475569] mt-6 italic">
          Therapeutic micro-climate salt room sessions designed to purify respiratory health, cleanse skin, and restore vitality.
        </p>
      </div>

      {/* ── Key Parameters Banner ── */}
      <div className="mb-10 bg-white rounded-2xl p-6 border border-[#E8E2DC] shadow-xs grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
        <div className="p-4 rounded-xl bg-[#FCF2E9] border border-[#E8E2DC]">
          <span className="text-xs text-[#8B7355] font-bold uppercase tracking-wider block mb-1">
            Max Capacity
          </span>
          <div className="flex items-center justify-center gap-1 text-[#0F172A] font-bold text-base font-displayPlayFair">
            <FaUsers className="text-[#8B7355]" />
            <span>2 People / Session</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#FCF2E9] border border-[#E8E2DC]">
          <span className="text-xs text-[#8B7355] font-bold uppercase tracking-wider block mb-1">
            Session Duration
          </span>
          <div className="flex items-center justify-center gap-1 text-[#0F172A] font-bold text-base font-displayPlayFair">
            <BiTimeFive className="text-[#8B7355] text-lg" />
            <span>1 Hour</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#FCF2E9] border border-[#E8E2DC]">
          <span className="text-xs text-[#8B7355] font-bold uppercase tracking-wider block mb-1">
            Single Price
          </span>
          <div className="flex items-center justify-center gap-1 text-[#0F172A] font-bold text-base font-displayPlayFair">
            <BiCreditCard className="text-[#8B7355] text-lg" />
            <span>€25 / Person</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#FCF2E9] border border-[#E8E2DC]">
          <span className="text-xs text-[#8B7355] font-bold uppercase tracking-wider block mb-1">
            Changeover Buffer
          </span>
          <div className="flex items-center justify-center gap-1 text-[#0F172A] font-bold text-base font-displayPlayFair">
            <BiInfoCircle className="text-[#8B7355] text-lg" />
            <span>10 Mins (Auto-Calculated)</span>
          </div>
        </div>
      </div>

      {/* ── Main Options Grid ── */}
      <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-[#E8E2DC] space-y-10 mb-10">
        <div>
          <label className="block text-sm font-bold text-[#0F172A] mb-4 uppercase tracking-wider" style={{ fontFamily: "Inter, sans-serif" }}>
            1. Select Booking Option or Membership
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {saltOptions.map((opt) => {
              const isSelected = selectedOption === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedOption(opt.id)}
                  className={`p-6 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                    isSelected
                      ? "bg-[#FCF2E9] border-[#8B7355] shadow-md ring-2 ring-[#8B7355]/20"
                      : "bg-white border-[#E2E8F0] hover:border-[#D1B191]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-3 py-1 rounded-full bg-[#8B7355]/10 text-[#8B7355] text-[10px] font-bold uppercase tracking-wider">
                        {opt.badge}
                      </span>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? "border-[#8B7355] bg-[#8B7355] text-white" : "border-[#CBD5E1]"
                        }`}
                      >
                        {isSelected && <BiCheckCircle size={16} />}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 my-2">
                      {opt.icon}
                      <h3 className="text-xl font-bold font-displayPlayFair text-[#0F172A]">
                        {opt.title}
                      </h3>
                    </div>

                    <p className="text-2xl font-bold text-[#8B7355] font-displayPlayFair my-1">
                      {opt.price}
                    </p>
                    <p className="text-xs text-[#64748B] mb-4">{opt.subtitle}</p>

                    <ul className="space-y-2 border-t border-[#E8E2DC]/70 pt-3 text-xs text-[#475569]">
                      {opt.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#8B7355] font-bold">✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Guest Count Selector (Max 2 people) ── */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-bold text-[#0F172A] uppercase tracking-wider" style={{ fontFamily: "Inter, sans-serif" }}>
              2. Number of Guests (Maximum 2 people per session)
            </label>
            <span className="text-xs font-semibold text-[#8B7355]">
              Strict capacity: Max 2 guests
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md">
            {[1, 2].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setGuestsCount(num)}
                className={`py-4 rounded-xl border font-bold text-center transition-all ${
                  guestsCount === num
                    ? "bg-[#8B7355] border-[#8B7355] text-white shadow-md scale-[1.02]"
                    : "bg-white border-[#E2E8F0] text-[#475569] hover:border-[#D1B191]"
                }`}
              >
                <span className="block text-xl font-displayPlayFair">{num} {num === 1 ? "Person" : "People"}</span>
                <span className="text-[11px] opacity-90 font-mono">
                  {selectedOption === "single" ? `€${num * 25}` : "Included in plan"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Account Pass & Membership Deduction Toggle ── */}
        <div className="p-6 rounded-2xl bg-[#FBF6F3] border border-[#E8E2DC] space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B7355] block mb-1">
                Account Pass / Membership Recognition
              </span>
              <h4 className="text-lg font-bold text-[#0F172A] font-displayPlayFair">
                Do you already have a 10-Session Pass or Membership?
              </h4>
              <p className="text-xs text-[#64748B] mt-0.5">
                If checked, 1 session will be automatically deducted from your customer account balance.
              </p>
            </div>

            <label className="inline-flex items-center gap-3 cursor-pointer bg-white px-4 py-3 rounded-xl border border-[#D1B191] shadow-xs flex-shrink-0">
              <input
                type="checkbox"
                checked={hasActivePass}
                onChange={(e) => setHasActivePass(e.target.checked)}
                className="w-5 h-5 accent-[#8B7355] cursor-pointer"
              />
              <span className="text-xs font-bold text-[#0F172A]">Use Account Pass / Membership</span>
            </label>
          </div>

          {/* Dynamic Price Summary */}
          <div className="pt-4 border-t border-[#E8E2DC] flex justify-between items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#8B7355] block">
                Total Amount Due Now
              </span>
              <span className="text-xs text-[#64748B]">
                {hasActivePass
                  ? "1 session will be deducted from your account balance."
                  : `${guestsCount} guest(s) • ${selectedOption.replace("_", " ")}`}
              </span>
            </div>

            <div className="text-right">
              <span className="text-4xl font-bold font-displayPlayFair text-[#8B7355]">
                €{calculatedTotal}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Combinable with Wellness Packages Section ── */}
      <div className="mb-12 bg-gradient-to-r from-[#FCF2E9] to-[#FBF6F3] rounded-3xl p-8 border border-[#E8E2DC]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8B7355] block mb-1">
              Curated Wellness Combinations
            </span>
            <h3 className="text-2xl font-bold font-displayPlayFair text-[#0F172A]">
              Combine Salt Room with Wellness Packages
            </h3>
            <p className="text-sm text-[#475569] mt-1 max-w-xl">
              Enhance your visit by combining halotherapy with private sauna sanctuaries, organic culinary dining, or relaxing massages.
            </p>
          </div>

          <Link
            href="/booking/packages"
            className="px-6 py-3.5 rounded-xl bg-[#8B7355] hover:bg-[#725e45] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex-shrink-0"
          >
            Explore Wellness Packages
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {packagesCombinations.map((pkg, i) => (
            <Link
              key={i}
              href={pkg.link}
              className="p-5 bg-white rounded-2xl border border-[#E8E2DC] hover:border-[#8B7355] transition-all flex items-center justify-between group"
            >
              <div>
                <h4 className="font-bold text-[#0F172A] text-sm group-hover:text-[#8B7355] transition-colors">
                  {pkg.title}
                </h4>
                <p className="text-xs text-[#64748B] mt-0.5">{pkg.combo}</p>
              </div>
              <span className="text-base font-bold font-displayPlayFair text-[#8B7355]">
                {pkg.price} &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Footer Navigation Buttons ── */}
      <div className="max-w-6xl mx-auto mb-16 flex justify-between items-center bg-[#FBF6F3] p-8 rounded-2xl shadow-sm border border-[#E8E2DC]">
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

        <button
          type="button"
          onClick={handleContinue}
          className="px-12 py-4 rounded-xl bg-[#D1B191] hover:bg-[#C4A484] text-white font-bold text-sm flex items-center gap-3 transition-all shadow-lg transform translate-y-[-2px]"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Continue to Choose Time
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}
