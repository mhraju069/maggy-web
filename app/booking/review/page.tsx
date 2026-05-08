"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import Link from "next/link";

export default function ReviewPage() {
  return (
    <div className="w-full px-6 md:px-12">
      {/* ── Title Section ── */}
      <div className="text-center mb-16 flex flex-col items-center">
        <h1 className="font-displayPlayFair text-5xl text-[#1d1a17] mb-2 leading-tight">Review & Confirm</h1>
        <DecorativeUnderline />
        <p className="font-cambria text-sm text-[#475569] mt-6 italic tracking-wide">Your journey awaits</p>
      </div>

      {/* ── Content Card ── */}
      <div className="max-w-4xl mx-auto bg-white rounded-[32px] overflow-hidden shadow-sm border border-[#E8E2DC]">
        <div className="p-10 space-y-12">
          {/* Services Information */}
          <section>
            <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-[0.2em] mb-8" style={{ fontFamily: "Inter, sans-serif" }}>Services Information</h2>

            <div className="space-y-8">
              <div>
                <span className="text-xs text-[#94A3B8] uppercase block mb-1">Experience</span>
                <h3 className="text-3xl font-bold text-[#0F172A] font-displayPlayFair">Shared Sauna</h3>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <span className="text-xs text-[#94A3B8] uppercase block mb-1">Date</span>
                  <p className="text-lg font-medium text-[#0F172A]">Saturday, February 7, 2026</p>
                </div>
                <div>
                  <span className="text-xs text-[#94A3B8] uppercase block mb-1">Time</span>
                  <p className="text-lg font-medium text-[#0F172A]">8:00 AM</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <span className="text-xs text-[#94A3B8] uppercase block mb-1">Duration</span>
                  <p className="text-lg font-medium text-[#0F172A]">120 minutes</p>
                </div>
                <div>
                  <span className="text-xs text-[#94A3B8] uppercase block mb-1">Guests</span>
                  <p className="text-lg font-medium text-[#0F172A]">4 people</p>
                </div>
              </div>

              <div>
                <span className="text-xs text-[#94A3B8] uppercase block mb-1">Investment</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-[#CFB9A3] font-displayPlayFair">$45</span>
                  <span className="text-xs text-[#94A3B8] italic">Payment required online</span>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-[#F1F5F9]" />

          {/* Customer Information */}
          <section>
            <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-[0.2em] mb-8" style={{ fontFamily: "Inter, sans-serif" }}>Customer Information</h2>

            <div className="space-y-8">
              <div>
                <span className="text-xs text-[#94A3B8] uppercase block mb-1">Name</span>
                <p className="text-xl font-bold text-[#0F172A]">MD Moinuddin</p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <span className="text-xs text-[#94A3B8] uppercase block mb-1">Email</span>
                  <p className="text-lg font-medium text-[#0F172A]">mdmoinuddin382571@gmail.com</p>
                </div>
                <div>
                  <span className="text-xs text-[#94A3B8] uppercase block mb-1">Phone</span>
                  <p className="text-lg font-medium text-[#0F172A]">01403172749</p>
                </div>
              </div>
            </div>
          </section>
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
          href="/booking/payment"
          className="px-12 py-4 rounded-xl bg-[#D1B191] hover:bg-[#C4A484] text-white font-bold text-sm flex items-center gap-3 transition-all shadow-lg transform translate-y-[-2px]"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Payment
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </Link>
      </div>
    </div>
  );
}
