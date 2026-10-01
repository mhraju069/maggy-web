"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { getStoredBookingData } from "@/lib/bookingStore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCakeCandles, FaGift, FaHeart } from "react-icons/fa6";
import { MdOutlineRestaurantMenu } from "react-icons/md";

export default function ReviewPage() {
  const [data, setData] = useState(getStoredBookingData());

  useEffect(() => {
    setData(getStoredBookingData());
  }, []);

  const celebration = data.celebration;
  const isLunchroom = data.serviceType === "lunchroom" || data.serviceName.toLowerCase().includes("lunchroom");

  return (
    <div className="w-full px-6 md:px-12">
      {/* ── Title Section ── */}
      <div className="text-center mb-16 flex flex-col items-center">
        <h1 className="font-displayPlayFair text-5xl text-[#1d1a17] mb-2 leading-tight">Review & Confirm</h1>
        <DecorativeUnderline />
        <p className="font-cambria text-sm text-[#475569] mt-6 italic tracking-wide">Please review your reservation details below.</p>
      </div>

      {/* ── Content Card ── */}
      <div className="max-w-4xl mx-auto bg-white rounded-[32px] overflow-hidden shadow-sm border border-[#E8E2DC]">
        <div className="p-10 space-y-10">
          {/* Services Information */}
          <section>
            <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-[0.2em] mb-8" style={{ fontFamily: "Inter, sans-serif" }}>
              Reservation Summary
            </h2>

            <div className="space-y-6">
              <div>
                <span className="text-xs text-[#94A3B8] uppercase block mb-1">Selected Experience</span>
                <h3 className="text-3xl font-bold text-[#0F172A] font-displayPlayFair flex items-center gap-3">
                  <MdOutlineRestaurantMenu className="text-[#8B7355]" />
                  {data.serviceName || "Lunchroom Table Reservation"}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#F1F5F9]">
                <div>
                  <span className="text-xs text-[#94A3B8] uppercase block mb-1">Date</span>
                  <p className="text-lg font-bold text-[#0F172A]">
                    {data.date ? new Date(data.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }) : "Not selected"}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-[#94A3B8] uppercase block mb-1">Start Time Slot</span>
                  <p className="text-lg font-bold text-[#0F172A]">{data.timeSlot || "Not selected"}</p>
                </div>
                <div>
                  <span className="text-xs text-[#94A3B8] uppercase block mb-1">Number of People</span>
                  <p className="text-lg font-bold text-[#0F172A]">
                    {data.guestsCount} {data.guestsCount === 1 ? "Person" : "People"}
                  </p>
                </div>
              </div>

              {data.durationHours && (
                <div className="pt-3 border-t border-[#F1F5F9] grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-[#94A3B8] uppercase block mb-1">Session Duration</span>
                    <p className="text-base font-bold text-[#0F172A]">
                      {data.durationHours} Hours {data.isSharedSauna ? "Shared Session Access" : "Private Access"}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-[#94A3B8] uppercase block mb-1">
                      {data.isSharedSauna ? "Automatic Changeover Period" : "Automatic Cleaning Buffer"}
                    </span>
                    <p className="text-base font-bold text-[#8B7355]">
                      {data.isSharedSauna ? "+15 Minutes Blocked Between Sessions" : "+30 Minutes Reserved Afterwards"}
                    </p>
                  </div>
                </div>
              )}

              {data.selectedExtras && data.selectedExtras.length > 0 && (
                <div className="pt-3 border-t border-[#F1F5F9]">
                  <span className="text-xs text-[#94A3B8] uppercase block mb-2">Selected Add-on Extras</span>
                  <div className="flex flex-wrap gap-2">
                    {data.selectedExtras.map((ext) => (
                      <span key={ext.id} className="px-3 py-1 bg-[#FCF2E9] border border-[#E8E2DC] rounded-lg text-xs font-bold text-[#8B7355]">
                        {ext.name} (+€{ext.price})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {data.price && data.price !== "$0" && (
                <div className="pt-4 border-t border-[#F1F5F9]">
                  <span className="text-xs text-[#94A3B8] uppercase block mb-1">Total Calculated Investment</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-[#8B7355] font-displayPlayFair">{data.price}</span>
                    <span className="text-xs text-[#94A3B8] italic">All inclusive pricing</span>
                  </div>
                </div>
              )}
            </div>
          </section>

          <hr className="border-[#F1F5F9]" />

          {/* Customer Information */}
          <section>
            <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-[0.2em] mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
              Customer Details
            </h2>

            <div className="space-y-6">
              <div>
                <span className="text-xs text-[#94A3B8] uppercase block mb-1">Name</span>
                <p className="text-xl font-bold text-[#0F172A]">{data.name || "Not provided"}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-xs text-[#94A3B8] uppercase block mb-1">Email</span>
                  <p className="text-base font-medium text-[#0F172A]">{data.email || "Not provided"}</p>
                </div>
                <div>
                  <span className="text-xs text-[#94A3B8] uppercase block mb-1">Phone</span>
                  <p className="text-base font-medium text-[#0F172A]">{data.phone || "Not provided"}</p>
                </div>
              </div>

              {data.requests && (
                <div>
                  <span className="text-xs text-[#94A3B8] uppercase block mb-1">Comments / Special Requests</span>
                  <p className="text-sm font-medium text-[#475569] bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
                    {data.requests}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Celebration Details Section (Lunchroom Only) */}
          {isLunchroom && celebration?.isCelebrating && (
            <>
              <hr className="border-[#F1F5F9]" />
              <section className="bg-gradient-to-r from-[#FCF2E9] to-[#FBF6F3] p-6 md:p-8 rounded-2xl border border-[#E8E2DC]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#8B7355] text-white flex items-center justify-center">
                    <FaCakeCandles size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B7355] block">Special Occasion</span>
                    <h3 className="text-xl font-bold font-displayPlayFair text-[#0F172A]">Celebration Details 🎉</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <span className="text-xs text-[#8B7355] uppercase font-bold block mb-1">What is being celebrated?</span>
                    <p className="font-bold text-[#0F172A]">{celebration.occasion || "Special Celebration"}</p>
                  </div>

                  <div>
                    <span className="text-xs text-[#8B7355] uppercase font-bold block mb-1">Who is it for?</span>
                    <p className="font-bold text-[#0F172A]">{celebration.celebrantName || "Guest of Honor"}</p>
                  </div>

                  {celebration.age && (
                    <div>
                      <span className="text-xs text-[#8B7355] uppercase font-bold block mb-1">Age / Milestone</span>
                      <p className="font-bold text-[#0F172A]">{celebration.age}</p>
                    </div>
                  )}

                  {celebration.hobbiesInterests && (
                    <div>
                      <span className="text-xs text-[#8B7355] uppercase font-bold block mb-1">Hobbies / Personal Interests</span>
                      <p className="font-bold text-[#0F172A]">{celebration.hobbiesInterests}</p>
                    </div>
                  )}
                </div>

                {celebration.otherDetails && (
                  <div className="mt-4 pt-4 border-t border-[#E8E2DC]/80">
                    <span className="text-xs text-[#8B7355] uppercase font-bold block mb-1">Other Celebration Details</span>
                    <p className="text-sm italic text-[#475569]">{celebration.otherDetails}</p>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>

      {/* ── Footer Buttons ── */}
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
          href="/booking/confirmation"
          className="px-12 py-4 rounded-xl bg-[#D1B191] hover:bg-[#C4A484] text-white font-bold text-sm flex items-center gap-3 transition-all shadow-lg transform translate-y-[-2px]"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Confirm Reservation
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </Link>
      </div>
    </div>
  );
}
