"use client";

import StripePaymentForm from "@/components/booking/StripePaymentForm";
import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { getStoredBookingData, updateStoredBookingData } from "@/lib/bookingStore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCreditCard, FaLock } from "react-icons/fa";
import { MdOutlinePayments } from "react-icons/md";

export default function PaymentPage() {
  const [method, setMethod] = useState<string>("ideal");
  const [data, setData] = useState(getStoredBookingData());

  useEffect(() => {
    const current = getStoredBookingData();
    setData(current);
    if (current.paymentMethod) setMethod(current.paymentMethod);
  }, []);

  const handleSelectMethod = (m: string) => {
    setMethod(m);
    updateStoredBookingData({ paymentMethod: m });
  };

  return (
    <div className="w-full px-6 md:px-12">
      {/* ── Title Section ── */}
      <div className="text-center mb-16 flex flex-col items-center">
        <h1 className="font-displayPlayFair text-5xl text-[#1d1a17] mb-2 leading-tight">Secure Payment</h1>
        <DecorativeUnderline />
        <p className="font-cambria text-sm text-[#475569] mt-6 italic tracking-wide">Complete your booking with confidence via iDEAL or Credit Card.</p>
      </div>

      {/* ── Content Card ── */}
        {/* Stripe Payment Form Component */}
        <StripePaymentForm
          totalAmount={data.totalAmount || data.price || 250}
          serviceName={data.serviceName}
          onSuccess={() => {
            window.location.replace("/booking/confirmation");
          }}
        />

      {/* ── Footer Navigation Buttons ── */}
      <div className="max-w-4xl mx-auto mt-12 flex justify-between items-center bg-[#FBF6F3] p-6 rounded-2xl shadow-sm border border-[#E8E2DC]">
        <button
          onClick={() => window.history.back()}
          className="px-8 py-3.5 rounded-xl border border-[#CFB9A3] text-[#1d1a17] font-bold text-sm hover:bg-[#CFB9A3]/10 transition-all flex items-center gap-3 cursor-pointer"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Details
        </button>

        <span className="text-xs text-[#8B7355] font-semibold italic hidden sm:inline">
          Authorize and submit payment using the secure form above ↑
        </span>
      </div>
    </div>
  );
}
