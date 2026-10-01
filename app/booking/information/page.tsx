"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { CelebrationData, getStoredBookingData, updateStoredBookingData } from "@/lib/bookingStore";
import Link from "next/link";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    const data = getStoredBookingData();
    setStoredData(data);
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

  const isFormValid = Boolean(formData.name && formData.email && formData.phone);

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
          className={`px-12 py-4 rounded-xl text-white font-bold text-sm flex items-center gap-3 transition-all shadow-md ${
            isFormValid
              ? "bg-[#D1B191] hover:bg-[#C4A484] shadow-lg transform translate-y-[-2px]"
              : "bg-[#D1B191] opacity-50 cursor-not-allowed pointer-events-none"
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
