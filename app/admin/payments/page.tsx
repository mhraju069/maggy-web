"use client";

import { useState } from "react";
import {
  MdAccessTime,
  MdCheckCircleOutline,
  MdTrendingUp,
} from "react-icons/md";

/* ── Static data (replace with real API calls) ── */
const TRANSACTIONS = [
  { id: "BK002", date: "Feb 20, 2026", time: "10:00 AM", customer: "Sarah Johnson", email: "sarah@example.com", service: "Lunchroom Reservation", guests: 4, duration: "90 min", status: "Paid",    amount: 89 },
  { id: "BK001", date: "Feb 20, 2026", time: "10:00 AM", customer: "Sarah Johnson", email: "sarah@example.com", service: "Lunchroom Reservation", guests: 4, duration: "90 min", status: "Paid",    amount: 89 },
  { id: "BK003", date: "Feb 19, 2026", time: "02:30 PM", customer: "James Carter",  email: "james@example.com", service: "Private Sauna",          guests: 2, duration: "120 min", status: "Paid",   amount: 75 },
  { id: "BK004", date: "Feb 19, 2026", time: "11:00 AM", customer: "Emily Rose",    email: "emily@example.com", service: "Shared Sauna",            guests: 1, duration: "60 min",  status: "Onsite", amount: 15 },
  { id: "BK005", date: "Feb 18, 2026", time: "04:00 PM", customer: "Lucas Brown",   email: "lucas@example.com", service: "Arrangement",             guests: 3, duration: "180 min", status: "Paid",   amount: 120 },
  { id: "BK006", date: "Feb 18, 2026", time: "09:00 AM", customer: "Nina Patel",    email: "nina@example.com",  service: "Activity",                guests: 5, duration: "60 min",  status: "Pending", amount: 25 },
  { id: "BK007", date: "Feb 17, 2026", time: "01:00 PM", customer: "Tom Eriksson",  email: "tom@example.com",   service: "Private Sauna",           guests: 2, duration: "120 min", status: "Paid",   amount: 75 },
];

const totalPaid     = TRANSACTIONS.filter(t => t.status === "Paid").reduce((s, t) => s + t.amount, 0);
const onsiteCount   = TRANSACTIONS.filter(t => t.status === "Onsite").length;
const avgPerBooking = Math.round(totalPaid / TRANSACTIONS.filter(t => t.status === "Paid").length);

const STATUS_STYLE: Record<string, string> = {
  Paid:    "bg-[#E6F9EF] text-[#008236] border border-[#B3E8CC]",
  Onsite:  "bg-[#FFF5E6] text-[#C47000] border border-[#FFD9A0]",
  Pending: "bg-[#F0F4FF] text-[#3B5BDB] border border-[#BAC8FF]",
};

export default function PaymentsPage() {
  const [selected, setSelected] = useState<string[]>([]);

  const allChecked = TRANSACTIONS.length > 0 && TRANSACTIONS.every(t => selected.includes(t.id));

  const toggle = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const toggleAll = () =>
    setSelected(allChecked ? [] : TRANSACTIONS.map(t => t.id));

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="font-displayPlayFair text-2xl font-bold text-[#1d1a17]">Payments</h1>
        <p className="text-xs text-gray-400 mt-0.5">Financial overview and payment tracking</p>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Total Paid */}
        <div className="bg-[#F0FDF4] border border-[#B9F8CF] rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#D1FAE5] flex items-center justify-center">
              <MdCheckCircleOutline className="w-5 h-5 text-[#008236]" />
            </div>
            <span className="text-sm font-semibold text-[#008236]">Total Paid</span>
          </div>
          <p className="text-3xl font-bold text-[#155DFC]">€{totalPaid}</p>
          <p className="text-xs text-gray-400">{TRANSACTIONS.filter(t => t.status === "Paid").length} transactions</p>
        </div>

        {/* Onsite Payment */}
        <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FEF3C7] flex items-center justify-center">
              <MdAccessTime className="w-5 h-5 text-[#D97706]" />
            </div>
            <span className="text-sm font-semibold text-[#D97706]">Onsite Payment</span>
          </div>
          <p className="text-3xl font-bold text-[#1d1a17]">{onsiteCount}</p>
          <p className="text-xs text-gray-400">Bookings</p>
        </div>

        {/* Average */}
        <div className="bg-[#EFF6FF] border border-[#BEDBFF] rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#DBEAFE] flex items-center justify-center">
              <MdTrendingUp className="w-5 h-5 text-[#155DFC]" />
            </div>
            <span className="text-sm font-semibold text-[#155DFC]">Average</span>
          </div>
          <p className="text-3xl font-bold text-[#155DFC]">€{avgPerBooking}</p>
          <p className="text-xs text-gray-400">Per booking</p>
        </div>
      </div>

      {/* ── Transactions Table ── */}
      <div className="bg-white rounded-2xl border border-[#E8E2DC]">
        {/* Table header */}
        <div className="px-5 py-4 border-b border-[#F1EDE8]">
          <p className="text-sm font-semibold text-[#1d1a17]">Recent Transactions</p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F1EDE8] text-[#94A3B8] text-xs">
                <th className="px-5 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={toggleAll}
                    className="w-3.5 h-3.5 accent-[#CFB9A3]"
                  />
                </th>
                <th className="px-4 py-3 text-left font-semibold">Booking ID</th>
                <th className="px-4 py-3 text-left font-semibold">Date &amp; Time</th>
                <th className="px-4 py-3 text-left font-semibold">Customer</th>
                <th className="px-4 py-3 text-left font-semibold">Service</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {TRANSACTIONS.map((t, i) => (
                <tr
                  key={`${t.id}-${i}`}
                  className={`border-b border-[#F9F6F3] transition-colors hover:bg-[#FAF8F6] ${
                    selected.includes(t.id) ? "bg-[#FAF7F4]" : ""
                  }`}
                >
                  <td className="px-5 py-4">
                    <input
                      type="checkbox"
                      checked={selected.includes(t.id)}
                      onChange={() => toggle(t.id)}
                      className="w-3.5 h-3.5 accent-[#CFB9A3]"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-semibold text-[#1d1a17] text-xs">{t.id}</span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-xs font-medium text-[#1d1a17]">{t.date}</p>
                    <p className="text-[10px] text-gray-400">{t.time}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-xs font-medium text-[#1d1a17]">{t.customer}</p>
                    <p className="text-[10px] text-gray-400">{t.email}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-xs font-medium text-[#1d1a17]">{t.service}</p>
                    <p className="text-[10px] text-gray-400">{t.guests} guests • {t.duration}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-semibold rounded-full ${STATUS_STYLE[t.status]}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-sm font-bold text-[#1d1a17]">€{t.amount}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 flex items-center justify-between border-t border-[#F1EDE8]">
          <p className="text-xs text-gray-400">
            Showing <span className="font-semibold text-[#1d1a17]">{TRANSACTIONS.length}</span> transactions
            {selected.length > 0 && (
              <span className="ml-2 text-[#CFB9A3] font-semibold">· {selected.length} selected</span>
            )}
          </p>
          <div className="flex items-center gap-1">
            {["1", "2", "3"].map((p, i) => (
              <button
                key={p}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                  i === 0
                    ? "bg-[#CFB9A3] text-white"
                    : "text-[#64748B] hover:bg-[#F8F4F0]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
