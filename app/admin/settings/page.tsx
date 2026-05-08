"use client";

import { useState } from "react";
import { MdCheckCircleOutline, MdOutlineAccessTime, MdUnfoldMore } from "react-icons/md";

export default function SettingsPage() {
  // Business Information
  const [businessName, setBusinessName] = useState("heaven");
  const [businessEmail, setBusinessEmail] = useState("hello@heaven.com");
  const [businessPhone, setBusinessPhone] = useState("+31 6 1234 5678");
  const [businessAddress, setBusinessAddress] = useState("Amsterdam, Netherlands");

  // Operating Hours
  const [openingTime, setOpeningTime] = useState("08:00 AM");
  const [closingTime, setClosingTime] = useState("10:00 PM");

  // Booking Settings
  const [slotDuration, setSlotDuration] = useState("08:00 AM");
  const [advanceBooking, setAdvanceBooking] = useState(30);
  const [cancellationNotice, setCancellationNotice] = useState(24);

  return (
    <div className="max-w-5xl">
      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="font-displayPlayFair text-2xl font-bold text-[#1d1a17]">Settings</h1>
        <p className="text-xs text-gray-400 mt-0.5 font-cambria">Configure application settings</p>
      </div>

      <div className="space-y-5">
        {/* ── Business Information ── */}
        <div className="bg-white border border-[#E8E2DC] rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-[#1d1a17] font-cambria mb-4">Business Information</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#475569] font-cambria">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full border border-[#E8E2DC] rounded-xl px-4 py-2.5 text-sm text-[#1d1a17] focus:outline-none focus:border-[#CFB9A3] transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#475569] font-cambria">Business Email</label>
              <input
                type="email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                className="w-full border border-[#E8E2DC] rounded-xl px-4 py-2.5 text-sm text-[#1d1a17] focus:outline-none focus:border-[#CFB9A3] transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#475569] font-cambria">Business Phone</label>
              <input
                type="text"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                className="w-full border border-[#E8E2DC] rounded-xl px-4 py-2.5 text-sm text-[#1d1a17] focus:outline-none focus:border-[#CFB9A3] transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#475569] font-cambria">Address</label>
              <input
                type="text"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                className="w-full border border-[#E8E2DC] rounded-xl px-4 py-2.5 text-sm text-[#1d1a17] focus:outline-none focus:border-[#CFB9A3] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* ── Operating Hours ── */}
        <div className="bg-white border border-[#E8E2DC] rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-[#1d1a17] font-cambria mb-4">Operating Hours</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#475569] font-cambria">Opening Time</label>
              <div className="relative group">
                <input
                  type="text"
                  value={openingTime}
                  onChange={(e) => setOpeningTime(e.target.value)}
                  className="w-full border border-[#E8E2DC] rounded-xl px-4 py-2.5 text-sm text-[#1d1a17] focus:outline-none focus:border-[#CFB9A3] transition-colors"
                />
                <MdOutlineAccessTime className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none group-focus-within:text-[#CFB9A3] transition-colors" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#475569] font-cambria">Closing Time</label>
              <div className="relative group">
                <input
                  type="text"
                  value={closingTime}
                  onChange={(e) => setClosingTime(e.target.value)}
                  className="w-full border border-[#E8E2DC] rounded-xl px-4 py-2.5 text-sm text-[#1d1a17] focus:outline-none focus:border-[#CFB9A3] transition-colors"
                />
                <MdOutlineAccessTime className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none group-focus-within:text-[#CFB9A3] transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Booking Settings ── */}
        <div className="bg-white border border-[#E8E2DC] rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-[#1d1a17] font-cambria mb-4">Booking Settings</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#475569] font-cambria">Time Slot Duration (minutes)</label>
              <div className="relative group">
                <input
                  type="text"
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(e.target.value)}
                  className="w-full border border-[#E8E2DC] rounded-xl px-4 py-2.5 text-sm text-[#1d1a17] focus:outline-none focus:border-[#CFB9A3] transition-colors"
                />
                <MdUnfoldMore className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none group-focus-within:text-[#CFB9A3] transition-colors" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#475569] font-cambria">Advance Booking (days)</label>
              <div className="relative group">
                <input
                  type="number"
                  value={advanceBooking}
                  onChange={(e) => setAdvanceBooking(parseInt(e.target.value))}
                  className="w-full border border-[#E8E2DC] rounded-xl px-4 py-2.5 text-sm text-[#1d1a17] focus:outline-none focus:border-[#CFB9A3] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <MdUnfoldMore className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none group-focus-within:text-[#CFB9A3] transition-colors" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#475569] font-cambria">Cancellation Notice (hours)</label>
              <div className="relative group">
                <input
                  type="number"
                  value={cancellationNotice}
                  onChange={(e) => setCancellationNotice(parseInt(e.target.value))}
                  className="w-full border border-[#E8E2DC] rounded-xl px-4 py-2.5 text-sm text-[#1d1a17] focus:outline-none focus:border-[#CFB9A3] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <MdUnfoldMore className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none group-focus-within:text-[#CFB9A3] transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Auto-save Notice ── */}
        <div className="bg-[#E6F9EF] border border-[#B3E8CC] rounded-2xl px-5 py-3.5 flex items-center gap-3">
          <MdCheckCircleOutline className="text-[#008236] w-5 h-5" />
          <p className="text-sm font-semibold text-[#008236] font-cambria">
            All settings are saved automatically to local storage.
          </p>
        </div>
      </div>
    </div>
  );
}
