"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import Link from "next/link";
import { FaCheck, FaLock } from "react-icons/fa";

export default function ConfirmationPage() {
  return (
    <div className="w-full px-6 md:px-12">
      {/* ── Icon Header ── */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 bg-[#8B735B] rounded-full flex items-center justify-center shadow-lg mb-6">
          <FaCheck className="text-white text-3xl" />
        </div>
        <h1 className="font-displayPlayFair text-5xl text-[#1d1a17] mb-4">Reservation Confirmed</h1>
        <DecorativeUnderline />
        <p className="font-cambria text-sm text-[#475569] mt-6 italic tracking-wide">Your journey awaits. We look forward to welcoming you.</p>
      </div>

      {/* ── Confirmation Card ── */}
      <div className="max-w-4xl mx-auto bg-white rounded-[32px] overflow-hidden shadow-sm border border-[#E8E2DC]">
        <div className="p-10 space-y-10">
          {/* Top Section with Lock */}
          <div className="flex items-center gap-3 pb-8 border-b border-[#F1F5F9]">
            <div className="w-10 h-10 rounded-full bg-[#F8FAFC] flex items-center justify-center border border-[#E2E8F0]">
              <FaLock className="text-[#94A3B8] text-sm" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider" style={{ fontFamily: "Inter, sans-serif" }}>Encrypted & Secure</h4>
              <p className="text-[10px] text-[#64748B] uppercase tracking-tighter">Your information is protected</p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-6">
            <div>
              <span className="text-[10px] text-[#94A3B8] uppercase tracking-widest block mb-2" style={{ fontFamily: "Inter, sans-serif" }}>Booking Reference</span>
              <h2 className="text-4xl font-bold text-[#0F172A] font-displayPlayFair">BK005</h2>
            </div>

            <div>
              <span className="text-[10px] text-[#94A3B8] uppercase tracking-widest block mb-2" style={{ fontFamily: "Inter, sans-serif" }}>Experience</span>
              <h3 className="text-2xl font-bold text-[#0F172A] font-displayPlayFair">Shared Sauna</h3>
              <p className="text-lg font-medium text-[#475569] mt-1">Saturday, February 7, 2026 at 8:00 AM</p>
            </div>
          </div>

          {/* Access Code Section */}
          <div className="bg-[#8B735B]/90 p-8 rounded-2xl text-white relative overflow-hidden group">
            {/* Subtle glow effect */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 opacity-80">
                <FaLock size={12} />
                <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ fontFamily: "Inter, sans-serif" }}>Access Code</span>
              </div>
              <h4 className="text-4xl font-bold tracking-[0.1em] mb-4" style={{ fontFamily: "Inter, sans-serif" }}>SRN-2681</h4>
              <p className="text-xs opacity-70 leading-relaxed max-w-md">Please save this code. You&apos;ll need it to access the sauna at your booking time.</p>
            </div>
          </div>

          {/* Confirmation Info */}
          <div className="pt-4">
            <span className="text-[10px] text-[#94A3B8] uppercase tracking-widest block mb-2" style={{ fontFamily: "Inter, sans-serif" }}>Confirmation Sent To</span>
            <p className="text-lg font-bold text-[#0F172A]">mdmoinuddin382571@gmail.com</p>
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
          Book Another Experience
        </Link>
      </div>
    </div>
  );
}
