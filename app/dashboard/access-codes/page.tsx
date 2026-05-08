"use client";

import { useState } from "react";
import { BsCheckCircle } from "react-icons/bs";
import { HiOutlineClipboardCopy, HiOutlineKey } from "react-icons/hi";

const ACCESS_BOOKING = {
  title: "Private Sauna",
  type: "Sauna",
  dateFull: "Sunday, 15 February 2026",
  time: "10:00 AM",
  code: "SRN-2468",
  status: "Upcoming",
};

export default function AccessCodesPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ACCESS_BOOKING.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <h1 className="font-displayPlayFair text-3xl font-bold text-[#1d1a17] mb-1">
        Access Codes
      </h1>
      <p className="text-sm text-[#64748B] mb-6">Your sauna access information</p>

      <div className="bg-white rounded-xl p-6 border border-[#F1EDE8] max-w-2xl">
        {/* Card header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-[#1d1a17] font-displayPlayFair">
              {ACCESS_BOOKING.title}
            </h3>
            <span className="px-2 py-0.5 text-[11px] bg-[#F3EDE6] text-[#8b7355] rounded-full">
              {ACCESS_BOOKING.type}
            </span>
            <BsCheckCircle className="text-green-500 w-4 h-4" />
          </div>
          <HiOutlineKey className="text-[#8b7355] w-5 h-5" />
        </div>

        <p className="text-sm text-[#64748B] mb-4">
          {ACCESS_BOOKING.dateFull} at {ACCESS_BOOKING.time}
        </p>

        <span className="inline-block text-xs text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full mb-6">
          {ACCESS_BOOKING.status}
        </span>

        {/* Code card */}
        <div className="rounded-xl bg-[#7A6348] p-6 flex items-center justify-between mb-4">
          <div>
            <p className="text-[11px] text-[#D1BC9D] mb-2 uppercase tracking-widest">
              Your Access Code
            </p>
            <p className="text-3xl font-bold text-white tracking-widest">
              {ACCESS_BOOKING.code}
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm rounded-lg transition-colors"
          >
            <HiOutlineClipboardCopy className="w-4 h-4" />
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Info note */}
        <div className="bg-[#FDF5F0] rounded-lg px-4 py-3">
          <p className="text-xs text-[#8b7355]">
            Your access code becomes active during your reserved time. Please keep it safe and
            present it upon arrival.
          </p>
        </div>
      </div>
    </div>
  );
}
