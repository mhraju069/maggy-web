"use client";

import ArrangementCard from "@/components/shared/ArrangementCard";
import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { formatImageUrl } from "@/lib/api/config";
import { bookingService, CreatePackageBookingPayload } from "@/lib/api/services/bookingService";
import { servicesService, ServicePackage } from "@/lib/api/services/servicesService";
import { getStoredBookingData, updateStoredBookingData } from "@/lib/bookingStore";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCheck, FaCopy, FaPaperPlane, FaSlidersH, FaSpa, FaTimes } from "react-icons/fa";
import { BiCalendar, BiCheckCircle, BiGroup, BiInfoCircle, BiTimeFive } from "react-icons/bi";

interface PackageItem {
  id: number;
  image: string;
  rating: number;
  title: string;
  combo: string;
  subServicesList: string[];
  description: string;
  includes: string[];
  paymentType: "full" | "partial" | "spot";
  price: string;
  rawPriceNum: number;
}

export default function PackagesBookingPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const pkgTrans = (t as any)?.bookingFlow?.packages;
  const btnTrans = (t as any)?.bookingFlow?.buttons;
  const cm = pkgTrans?.customModal;
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Customize Package Modal State
  const [showCustomizeModal, setShowCustomizeModal] = useState<boolean>(false);
  const [customForm, setCustomForm] = useState({
    title: "",
    guests: 2,
    date: "",
    duration: "Half Day (4 Hours)",
    treatments: ["VIP Sauna", "Lunchroom", "Yoga Activity"] as string[],
    otherExperienceDetails: "",
    specialRequests: "",
    name: "",
    email: "",
    phone: "",
  });
  const [customSubmitting, setCustomSubmitting] = useState(false);
  const [customSuccess, setCustomSuccess] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);
  const [confirmedData, setConfirmedData] = useState<{
    bookingId: string;
    name: string;
    email: string;
    phone: string;
    date: string;
    guests: number;
    services: string[];
    notes?: string;
  } | null>(null);

  useEffect(() => {
    const stored = getStoredBookingData();
    if (stored) {
      setCustomForm((prev) => ({
        ...prev,
        name: prev.name || stored.name || "",
        email: prev.email || stored.email || "",
        phone: prev.phone || stored.phone || "",
        guests: stored.guestsCount || prev.guests || 2,
        date: prev.date || stored.date || "",
      }));
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    servicesService
      .getPackages(language)
      .then((apiData) => {
        if (apiData && Array.isArray(apiData) && apiData.length > 0) {
          const mapped: PackageItem[] = apiData.map((item: ServicePackage, idx: number) => {
            const priceVal = typeof item.price === "number"
              ? item.price
              : parseFloat(String(item.price || 0)) || 0;

            let subServicesList: string[] = [];
            if (Array.isArray(item.packages)) {
              subServicesList = item.packages;
            } else if (typeof item.packages === "string") {
              try {
                const parsed = JSON.parse(item.packages);
                if (Array.isArray(parsed)) subServicesList = parsed;
                else subServicesList = [item.packages];
              } catch {
                subServicesList = item.packages.split(",").map((s) => s.trim());
              }
            }

            const formattedCombo = subServicesList.length > 0
              ? subServicesList.map((s) => s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())).join(" • ")
              : "Sauna • Salt Room • Wellness";

            return {
              id: item.id,
              image: formatImageUrl(
                item.image,
                `/images/arrangements/cardimages/img${(idx % 3) + 1}.png`
              ),
              rating: 4.9,
              title: item.title || "Wellness Package",
              combo: formattedCombo,
              subServicesList,
              description: item.description || "",
              includes: item.features?.map((f) => f.feature.replace(/^[✓✔\s]+/, "")) || [],
              paymentType: "full" as const,
              price: `€${priceVal.toFixed(0)}`,
              rawPriceNum: priceVal,
            };
          });
          setPackages(mapped);
          if (mapped.length > 0) {
            setSelectedId(mapped[0].id);
          }
        } else {
          setPackages([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching packages:", err);
        setPackages([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const selectedPkg = packages.find((p) => p.id === selectedId);

  const handleContinue = () => {
    if (!selectedPkg) return;

    updateStoredBookingData({
      serviceName: selectedPkg.title,
      serviceType: "package",
      price: selectedPkg.price,
      guestsCount: 2,
      totalAmount: selectedPkg.rawPriceNum,
      isCustomPackage: false,
      packageSelections: {
        includedServices: selectedPkg.subServicesList,
      },
    });

    router.push("/booking/choose-time");
  };

  return (
    <div className="w-full px-6 md:px-12 max-w-7xl mx-auto">
      {/* ── Title Section ── */}
      <div className="text-center mb-16 flex flex-col items-center">
        <h1 className="font-displayPlayFair text-5xl text-[#1d1a17] mb-2 uppercase tracking-tight">
          {pkgTrans?.title || "Arrangementen & Belevenissen"}
        </h1>
        <DecorativeUnderline />
        <p className="font-cambria text-sm text-[#475569] mt-6 italic max-w-2xl">
          {pkgTrans?.subtitle || "Combineer onze diensten en maak er een gezellig dagje uit van bij Heaven on Earth."}
        </p>
      </div>

      {/* ── Loading Spinner ── */}
      {loading && (
        <div className="w-full py-24 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#8B7355] border-t-transparent mb-4"></div>
          <p className="text-[#64748B] font-cambria italic">{pkgTrans?.loading || "Loading Wellness Packages..."}</p>
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && packages.length === 0 && (
        <div className="bg-white rounded-[32px] p-12 shadow-sm border border-[#E8E2DC] text-center max-w-2xl mx-auto my-12">
          <div className="w-16 h-16 bg-[#FCF2E9] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#8B7355]">
            <FaSpa className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold font-displayPlayFair text-[#0F172A] mb-2">
            {pkgTrans?.noPackagesTitle || "No Packages Available"}
          </h3>
          <p className="text-sm text-[#64748B] font-cambria italic">
            {pkgTrans?.noPackagesDesc || "Currently there are no wellness packages available from the server. Please check back later or explore our individual services."}
          </p>
        </div>
      )}

      {/* ── Action Banner: Standard or Custom ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-[#E8E2DC]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#8B7355] block">
            {pkgTrans?.curatedBadge || "Curated Experiences & Bespoke Packages"}
          </span>
          <p className="text-sm text-[#64748B] mt-0.5">
            {pkgTrans?.curatedDesc || "Select a signature package below or create your own custom wellness journey."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCustomizeModal(true)}
          className="px-6 py-3 rounded-xl border border-[#8B7355] bg-[#FCF2E9] text-[#8B7355] hover:bg-[#8B7355] hover:text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center gap-2 cursor-pointer"
        >
          <FaSlidersH size={13} />
          <span>{pkgTrans?.customizePackageBtn || "Customize Package"}</span>
        </button>
      </div>

      {/* ── Packages Grid ── */}
      {!loading && packages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {packages.map((item) => (
            <ArrangementCard
              key={item.id}
              {...item}
              isSelected={selectedId === item.id}
              onClick={() => setSelectedId(item.id)}
            />
          ))}
        </div>
      )}

      {/* ── Footer Navigation ── */}
      <div className="max-w-7xl mx-auto mt-8 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-[#FBF6F3] p-4 sm:p-8 rounded-2xl shadow-sm border border-[#E8E2DC]">
        <Link
          href="/booking"
          className="w-full sm:w-auto justify-center px-6 sm:px-10 py-3.5 sm:py-4 rounded-xl border border-[#CFB9A3] text-[#1d1a17] font-bold text-sm hover:bg-[#CFB9A3] hover:bg-opacity-10 transition-all flex items-center gap-3"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          {pkgTrans?.backToExperiences || "Back to Experiences"}
        </Link>

        <button
          onClick={handleContinue}
          disabled={!selectedId || packages.length === 0}
          className={`w-full sm:w-auto justify-center px-6 sm:px-12 py-3.5 sm:py-4 rounded-xl text-white font-bold text-sm flex items-center gap-3 transition-all shadow-lg ${
            selectedId && packages.length > 0
              ? "bg-[#D1B191] hover:bg-[#C4A484] shadow-lg transform translate-y-[-2px]"
              : "bg-[#D1B191] opacity-50 cursor-not-allowed"
          }`}
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {btnTrans?.continue || "Continue"}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>

      {/* ── 🌟 Customize Package Modal ── */}
      {showCustomizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[32px] border border-[#E8E2DC] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 md:p-10 relative">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                setShowCustomizeModal(false);
                setCustomSuccess(false);
              }}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-all cursor-pointer"
            >
              <FaTimes size={16} />
            </button>

            {customSuccess && confirmedData ? (
              <div className="text-center py-6 space-y-6 animate-fadeIn">
                <div className="w-20 h-20 bg-[#FCF2E9] rounded-3xl flex items-center justify-center mx-auto text-[#8B7355] border border-[#E8E2DC] shadow-sm">
                  <BiCheckCircle size={44} />
                </div>
                
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#8B7355] block mb-1">
                    {cm?.successBadge || "Booking Successful • No Payment Required"}
                  </span>
                  <h3 className="text-3xl font-bold font-displayPlayFair text-[#0F172A]">
                    {cm?.successTitle || "Custom Package Confirmed!"}
                  </h3>
                  <p className="text-xs text-[#64748B] max-w-md mx-auto mt-2 leading-relaxed">
                    {cm?.successDesc || "Your bespoke package reservation has been confirmed and registered in our system. A confirmation email has been dispatched to your address."}
                  </p>
                </div>

                {/* Booking ID Highlight */}
                <div className="bg-[#FBF6F3] border border-[#E8E2DC] rounded-2xl p-5 max-w-md mx-auto flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[10px] uppercase font-bold text-[#8B7355] tracking-wider block">
                      {cm?.bookingRefLabel || "Booking Reference ID"}
                    </span>
                    <span className="text-xl font-bold font-mono text-[#0F172A]">
                      {confirmedData.bookingId}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirmedData.bookingId) {
                        navigator.clipboard.writeText(confirmedData.bookingId);
                        setCopiedRef(true);
                        setTimeout(() => setCopiedRef(false), 2000);
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    {copiedRef ? (
                      <>
                        <FaCheck size={11} className="text-emerald-600" />
                        <span className="text-emerald-700">{cm?.copiedBtn || "Copied"}</span>
                      </>
                    ) : (
                      <>
                        <FaCopy size={11} className="text-[#64748B]" />
                        <span>{cm?.copyBtn || "Copy"}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Booking Summary Box */}
                <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 text-left max-w-md mx-auto space-y-4 shadow-2xs text-xs">
                  <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#F1F5F9]">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#94A3B8] block mb-0.5">{cm?.guestLabel || "Guest"}</span>
                      <p className="font-semibold text-[#0F172A]">{confirmedData.name}</p>
                      <p className="text-[#64748B] text-[11px] truncate">{confirmedData.email}</p>
                      <p className="text-[#64748B] text-[11px]">{confirmedData.phone}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#94A3B8] block mb-0.5">{cm?.sessionDetailsLabel || "Session Details"}</span>
                      <p className="font-semibold text-[#0F172A]">{confirmedData.date}</p>
                      <p className="text-[#64748B]">{confirmedData.guests} {confirmedData.guests === 1 ? "Person" : "Guests"}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                        {cm?.statusPending || "Confirmed (Pending Review)"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#94A3B8] block mb-2">
                      {cm?.includedExperiencesLabel || "Included Experiences"}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {confirmedData.services.map((srv, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-[#FCF2E9] text-[#8B7355] border border-[#E8E2DC] text-[11px] font-medium"
                        >
                          ✓ {srv}
                        </span>
                      ))}
                    </div>
                  </div>

                  {confirmedData.notes && (
                    <div className="pt-2 border-t border-[#F1F5F9]">
                      <span className="text-[10px] uppercase font-bold text-[#94A3B8] block mb-0.5">
                        {cm?.notesAndRequestsLabel || "Notes & Requests"}
                      </span>
                      <p className="text-[#475569] text-[11px] italic bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0]">
                        {confirmedData.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomizeModal(false);
                      setCustomSuccess(false);
                      setConfirmedData(null);
                    }}
                    className="px-6 py-3 rounded-xl border border-[#CBD5E1] text-[#475569] hover:bg-[#F8FAFC] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    {cm?.doneAndCloseBtn || "Done & Close"}
                  </button>

                  <Link
                    href="/booking/confirmation"
                    onClick={() => setShowCustomizeModal(false)}
                    className="px-7 py-3 rounded-xl bg-[#8B7355] text-white hover:bg-[#725e45] font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{cm?.viewReservationBtn || "View Reservation Page"}</span>
                    <BiCheckCircle size={16} />
                  </Link>
                </div>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setCustomError(null);

                  const resolvedServices: string[] = [];
                  for (const t of customForm.treatments) {
                    if (t === "Others") {
                      if (customForm.otherExperienceDetails.trim()) {
                        resolvedServices.push(customForm.otherExperienceDetails.trim());
                      }
                    } else {
                      resolvedServices.push(t);
                    }
                  }

                  if (resolvedServices.length === 0) {
                    setCustomError("Please select at least one experience or service.");
                    return;
                  }

                  if (!customForm.date) {
                    setCustomError("Please select a date for your custom package.");
                    return;
                  }

                  setCustomSubmitting(true);

                  try {
                    const notesParts: string[] = [];
                    if (customForm.specialRequests.trim()) {
                      notesParts.push(customForm.specialRequests.trim());
                    }
                    if (customForm.duration) {
                      notesParts.push(`Duration: ${customForm.duration}`);
                    }
                    if (customForm.title.trim()) {
                      notesParts.push(`Theme: ${customForm.title.trim()}`);
                    }
                    const notesString = notesParts.join(" • ") || undefined;

                    const payload: CreatePackageBookingPayload = {
                      is_custom: true,
                      name: customForm.name.trim(),
                      email: customForm.email.trim(),
                      phone: customForm.phone.trim(),
                      date: customForm.date,
                      guests: Number(customForm.guests) || 1,
                      service_names: resolvedServices,
                      notes: notesString,
                    };

                    const response = await bookingService.createPackageBooking(payload);

                    if (response && (response.success || response.booking_id)) {
                      const bookingId = response.booking_id || (response.data && response.data.booking_id) || "PKG-CONFIRMED";

                      setConfirmedData({
                        bookingId,
                        name: customForm.name.trim(),
                        email: customForm.email.trim(),
                        phone: customForm.phone.trim(),
                        date: customForm.date,
                        guests: Number(customForm.guests) || 1,
                        services: resolvedServices,
                        notes: notesString,
                      });

                      updateStoredBookingData({
                        serviceName: customForm.title.trim() || "Bespoke Custom Wellness Package",
                        serviceType: "package",
                        bookingId: bookingId,
                        isCustomPackage: true,
                        guestsCount: Number(customForm.guests) || 1,
                        date: customForm.date,
                        name: customForm.name.trim(),
                        email: customForm.email.trim(),
                        phone: customForm.phone.trim(),
                        requests: notesString || "",
                      });

                      setCustomSuccess(true);
                    } else {
                      setCustomError(response?.message || "Failed to confirm custom booking. Please try again.");
                    }
                  } catch (err: any) {
                    console.error("Custom package booking error:", err);
                    const errMsg =
                      err?.message ||
                      (err?.data && typeof err.data === "object" ? JSON.stringify(err.data) : null) ||
                      "An unexpected error occurred while booking. Please try again.";
                    setCustomError(errMsg);
                  } finally {
                    setCustomSubmitting(false);
                  }
                }}
                className="space-y-6"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8B7355] mb-1">
                    <FaSlidersH size={12} />
                    <span>{cm?.badge || "Bespoke Wellness Arrangement"}</span>
                  </div>
                  <h3 className="text-2xl font-bold font-displayPlayFair text-[#0F172A]">
                    {cm?.title || "Design Your Custom Package"}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1">
                    {cm?.subtitle || "Combine your ideal treatments, duration, and preferences. Confirmed directly without advance payment."}
                  </p>
                </div>

                {customError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between animate-fadeIn">
                    <span>{customError}</span>
                    <button
                      type="button"
                      onClick={() => setCustomError(null)}
                      className="text-red-500 hover:text-red-800 ml-2 font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Package Concept Title */}
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1 uppercase tracking-wide">
                      {cm?.packageNameLabel || "Package Name or Focus Theme"} <span className="text-[#94A3B8] font-normal lowercase">{cm?.optional || "(optional)"}</span>
                    </label>
                    <input
                      type="text"
                      placeholder={cm?.packagePlaceholder || "e.g. Couples Rejuvenation Day / Ultimate Detox Retreat"}
                      value={customForm.title}
                      onChange={(e) => setCustomForm({ ...customForm, title: e.target.value })}
                      className="w-full p-3.5 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Number of Guests */}
                    <div>
                      <label className="block text-xs font-bold text-[#0F172A] mb-1 uppercase tracking-wide">
                        {cm?.guestsLabel || "Guests *"}
                      </label>
                      <select
                        value={customForm.guests}
                        onChange={(e) => setCustomForm({ ...customForm, guests: parseInt(e.target.value, 10) })}
                        className="w-full p-3.5 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#8B7355] cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? (cm?.person || "Person") : (cm?.people || "People")}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Preferred Date */}
                    <div>
                      <label className="block text-xs font-bold text-[#0F172A] mb-1 uppercase tracking-wide">
                        {cm?.preferredDateLabel || "Preferred Date *"}
                      </label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split("T")[0]}
                        value={customForm.date}
                        onChange={(e) => setCustomForm({ ...customForm, date: e.target.value })}
                        className="w-full p-3 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                      />
                    </div>

                    {/* Desired Duration */}
                    <div>
                      <label className="block text-xs font-bold text-[#0F172A] mb-1 uppercase tracking-wide">
                        {cm?.durationLabel || "Duration *"}
                      </label>
                      <select
                        value={customForm.duration}
                        onChange={(e) => setCustomForm({ ...customForm, duration: e.target.value })}
                        className="w-full p-3.5 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#8B7355] cursor-pointer"
                      >
                        <option value="2.5 Hours">{cm?.durations?.mini || "2.5 Hours (Mini Escape)"}</option>
                        <option value="Half Day (4 Hours)">{cm?.durations?.halfDay || "Half Day (4 Hours)"}</option>
                        <option value="Full Day (6-8 Hours)">{cm?.durations?.fullDay || "Full Day (6-8 Hours)"}</option>
                        <option value="Weekend Experience">{cm?.durations?.weekend || "Weekend Experience"}</option>
                      </select>
                    </div>
                  </div>

                  {/* Experiences Selection */}
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-2 uppercase tracking-wide">
                      {cm?.selectExperiencesLabel || "Select Experiences to Include *"}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {[
                        "VIP Sauna",
                        "Lunchroom",
                        "Yoga Activity",
                        "Sauna",
                        "Salt Room",
                        "Activities",
                        "Others",
                      ].map((exp) => {
                        const isChecked = customForm.treatments.includes(exp);
                        return (
                          <button
                            key={exp}
                            type="button"
                            onClick={() => {
                              const updated = isChecked
                                ? customForm.treatments.filter((t) => t !== exp)
                                : [...customForm.treatments, exp];
                              setCustomForm({ ...customForm, treatments: updated });
                            }}
                            className={`p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                              isChecked
                                ? "bg-[#FCF2E9] border-[#8B7355] text-[#8B7355] font-bold"
                                : "bg-white border-[#E2E8F0] text-[#475569] hover:border-[#D1B191]"
                            }`}
                          >
                            <span>{
                              exp === "VIP Sauna" ? (cm?.experiences?.vipSauna || exp) :
                              exp === "Lunchroom" ? (cm?.experiences?.lunchroom || exp) :
                              exp === "Yoga Activity" ? (cm?.experiences?.yogaActivity || exp) :
                              exp === "Sauna" ? (cm?.experiences?.sauna || exp) :
                              exp === "Salt Room" ? (cm?.experiences?.saltRoom || exp) :
                              exp === "Activities" ? (cm?.experiences?.activities || exp) :
                              exp === "Others" ? (cm?.experiences?.others || exp) : exp
                            }</span>
                            <span className="text-xs">{isChecked ? "✓" : "+"}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Conditional Input for Others */}
                    {customForm.treatments.includes("Others") && (
                      <div className="mt-3 animate-fadeIn">
                        <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wide">
                          {cm?.specifyOthersLabel || "Specify Other Experiences / Services *"}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={cm?.specifyOthersPlaceholder || "e.g. Cold Plunge, Aromatherapy, Sound Bath, Custom Massage..."}
                          value={customForm.otherExperienceDetails}
                          onChange={(e) => setCustomForm({ ...customForm, otherExperienceDetails: e.target.value })}
                          className="w-full p-3 bg-[#FCF2E9]/40 border border-[#D1B191] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Contact Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wide">
                        {cm?.yourNameLabel || "Your Name *"}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={cm?.yourNamePlaceholder || "e.g. John Doe"}
                        value={customForm.name}
                        onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                        className="w-full p-3 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wide">
                        {cm?.emailLabel || "Email Address *"}
                      </label>
                      <input
                        type="email"
                        required
                        placeholder={cm?.emailPlaceholder || "john@example.com"}
                        value={customForm.email}
                        onChange={(e) => setCustomForm({ ...customForm, email: e.target.value })}
                        className="w-full p-3 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wide">
                        {cm?.phoneLabel || "Phone Number *"}
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder={cm?.phonePlaceholder || "+358401234567"}
                        value={customForm.phone}
                        onChange={(e) => setCustomForm({ ...customForm, phone: e.target.value })}
                        className="w-full p-3 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                      />
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wide">
                      {cm?.notesLabel || "Notes & Special Requests"}
                    </label>
                    <textarea
                      rows={2}
                      placeholder={cm?.notesPlaceholder || "e.g. Afternoon session preferred, dietary requests, anniversary surprises..."}
                      value={customForm.specialRequests}
                      onChange={(e) => setCustomForm({ ...customForm, specialRequests: e.target.value })}
                      className="w-full p-3 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#8B7355] resize-none"
                    />
                  </div>
                </div>

                {/* Modal Buttons */}
                <div className="flex justify-end gap-3 pt-3 border-t border-[#F1F5F9]">
                  <button
                    type="button"
                    onClick={() => setShowCustomizeModal(false)}
                    className="px-6 py-3 rounded-xl border border-[#CBD5E1] text-[#64748B] hover:bg-[#F8FAFC] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    {cm?.cancelBtn || "Cancel"}
                  </button>

                  <button
                    type="submit"
                    disabled={customSubmitting}
                    className="px-8 py-3 rounded-xl bg-[#8B7355] text-white hover:bg-[#725e45] font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    {customSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{cm?.confirmingBtn || "Confirming..."}</span>
                      </>
                    ) : (
                      <>
                        <FaPaperPlane size={12} />
                        <span>{cm?.confirmBtn || "Confirm Custom Booking"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
