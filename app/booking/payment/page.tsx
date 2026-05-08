"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import Link from "next/link";
import { useState } from "react";
import { FaCreditCard, FaLock } from "react-icons/fa";
import { MdOutlinePayments } from "react-icons/md";

export default function PaymentPage() {
  const [method, setMethod] = useState<string>("card");

  return (
    <div className="w-full px-6 md:px-12">
      {/* ── Title Section ── */}
      <div className="text-center mb-16 flex flex-col items-center">
        <h1 className="font-displayPlayFair text-5xl text-[#1d1a17] mb-2 leading-tight">Secure Payment</h1>
        <DecorativeUnderline />
        <p className="font-cambria text-sm text-[#475569] mt-6 italic tracking-wide">Complete your booking with confidence.</p>
      </div>

      {/* ── Content Card ── */}
      <div className="max-w-4xl mx-auto bg-white rounded-[32px] p-10 shadow-sm border border-[#E8E2DC]">
        {/* Security Info */}
        <div className="flex items-center gap-4 mb-10 p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-[#E2E8F0]">
            <FaLock className="text-[#94A3B8]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#0F172A]">Encrypted & Secure</h4>
            <p className="text-xs text-[#64748B]">Your information is protected</p>
          </div>
        </div>

        {/* Experience Summary */}
        <div className="mb-10">
          <span className="text-xs text-[#94A3B8] uppercase block mb-1">Experience</span>
          <h3 className="text-2xl font-bold text-[#0F172A] font-displayPlayFair mb-6">Shared Sauna</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-[#CFB9A3] font-displayPlayFair">$45</span>
            <span className="text-xs text-[#94A3B8] italic">Payment required online</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4">
          <button
            onClick={() => setMethod("card")}
            className={`w-full flex items-center justify-between p-6 rounded-2xl border transition-all ${
              method === "card"
                ? "bg-[#FCF2E9] border-[#D1B191] shadow-sm"
                : "bg-white border-[#E2E8F0] hover:border-[#D1B191]"
            }`}
          >
            <div className="flex items-center gap-4">
              <FaCreditCard className={method === "card" ? "text-[#D1B191]" : "text-[#94A3B8]"} size={20} />
              <span className="font-bold text-[#0F172A]">Credit / Debit Card</span>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === "card" ? "border-[#D1B191]" : "border-[#E2E8F0]"}`}>
              {method === "card" && <div className="w-2.5 h-2.5 rounded-full bg-[#D1B191]" />}
            </div>
          </button>

          <button
            onClick={() => setMethod("ideal")}
            className={`w-full flex items-center justify-between p-6 rounded-2xl border transition-all ${
              method === "ideal"
                ? "bg-[#FCF2E9] border-[#D1B191] shadow-sm"
                : "bg-white border-[#E2E8F0] hover:border-[#D1B191]"
            }`}
          >
            <div className="flex items-center gap-4">
              <MdOutlinePayments className={method === "ideal" ? "text-[#D1B191]" : "text-[#94A3B8]"} size={20} />
              <span className="font-bold text-[#0F172A]">iDEAL</span>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === "ideal" ? "border-[#D1B191]" : "border-[#E2E8F0]"}`}>
              {method === "ideal" && <div className="w-2.5 h-2.5 rounded-full bg-[#D1B191]" />}
            </div>
          </button>
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
