"use client";

import { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown, MdSearch } from "react-icons/md";

const ACCESS_CODES = [
  { code: "XYZ-1234", bookingId: "BK002", customer: "Sarah Johnson", email: "sarah@example.com", service: "Lunchroom Reservation", guests: 4, duration: "90 min", validDate: "Feb 20, 2026", validTime: "10:00 AM", status: "Active" },
  { code: "ABC-5678", bookingId: "BK001", customer: "Sarah Johnson", email: "sarah@example.com", service: "Lunchroom Reservation", guests: 4, duration: "90 min", validDate: "Feb 20, 2026", validTime: "10:00 AM", status: "Active" },
  { code: "LMN-9101", bookingId: "BK001", customer: "Sarah Johnson", email: "sarah@example.com", service: "Lunchroom Reservation", guests: 4, duration: "90 min", validDate: "Feb 20, 2026", validTime: "10:00 AM", status: "Active" },
  { code: "PQR-1121", bookingId: "BK001", customer: "Sarah Johnson", email: "sarah@example.com", service: "Lunchroom Reservation", guests: 4, duration: "90 min", validDate: "Feb 20, 2026", validTime: "10:00 AM", status: "Active" },
];

const SERVICES = ["All Services", "Lunchroom Reservation", "Private Sauna", "Shared Sauna", "Activity", "Arrangement"];

export default function AccessCodesPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [service, setService] = useState("All Services");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const allChecked = ACCESS_CODES.length > 0 && ACCESS_CODES.every(a => selected.includes(a.code));

  const toggle = (code: string) =>
    setSelected(prev => prev.includes(code) ? prev.filter(x => x !== code) : [...prev, code]);

  const toggleAll = () =>
    setSelected(allChecked ? [] : ACCESS_CODES.map(a => a.code));

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-5">
        <h1 className="font-displayPlayFair text-2xl font-bold text-[#1d1a17]">Access Codes</h1>
        <p className="text-xs text-gray-400 mt-0.5">Your private access, prepared for your moment of rest</p>
      </div>

      {/* ── Search + Filter bar ── */}
      {/* Outer white card with padding */}
      <div className="bg-white border border-[#E8E2DC] rounded-2xl p-3 mb-4">
        <div className="flex items-center gap-3">

          {/* Search input — has its own border */}
          <div className="flex-1 flex items-center gap-2 border border-[#E8E2DC] rounded-xl px-4 py-2.5">
            <MdSearch className="text-gray-400 w-4 h-4 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search ..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 text-sm text-[#1d1a17] placeholder:text-gray-400 bg-transparent focus:outline-none"
            />
          </div>

          {/* All Services dropdown — has its own border */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(o => !o)}
              className="flex items-center justify-between gap-2 border border-[#E8E2DC] rounded-xl px-4 py-2.5 text-sm text-[#1d1a17] focus:outline-none cursor-pointer select-none whitespace-nowrap w-[190px]"
            >
              {service}
              <MdKeyboardArrowDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-150 ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-[calc(100%+4px)] bg-white border border-[#E8E2DC] rounded-xl shadow-lg z-50 w-full py-1 overflow-hidden">
                {SERVICES.map(s => (
                  <button
                    key={s}
                    onClick={() => { setService(s); setDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      service === s
                        ? "bg-[#F8F4F0] text-[#8b7355] font-semibold"
                        : "text-[#1d1a17] hover:bg-[#FAF8F6]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-[#E8E2DC]">
        {/* Section title */}
        <div className="px-5 py-4">
          <p className="text-base font-bold text-[#1d1a17] font-cambria">Active Access Codes</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-b border-[#F1EDE8] text-[#1d1a17] text-xs">
                <th className="px-5 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={toggleAll}
                    className="w-3.5 h-3.5 accent-[#CFB9A3]"
                  />
                </th>
                <th className="px-4 py-3 text-left font-bold">Access Code</th>
                <th className="px-4 py-3 text-left font-bold">Booking ID</th>
                <th className="px-4 py-3 text-left font-bold">Customer</th>
                <th className="px-4 py-3 text-left font-bold">Service</th>
                <th className="px-4 py-3 text-left font-bold">Valid Until</th>
                <th className="px-4 py-3 text-left font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {ACCESS_CODES.map((a, i) => (
                <tr
                  key={`${a.code}-${i}`}
                  className={`border-b border-[#F9F6F3] transition-colors hover:bg-[#FAF8F6] ${
                    selected.includes(a.code) ? "bg-[#FAF7F4]" : ""
                  }`}
                >
                  <td className="px-5 py-4">
                    <input
                      type="checkbox"
                      checked={selected.includes(a.code)}
                      onChange={() => toggle(a.code)}
                      className="w-3.5 h-3.5 accent-[#CFB9A3]"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-normal text-[#1d1a17]">{a.code}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-normal text-[#1d1a17]">{a.bookingId}</span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-normal text-[#1d1a17]">{a.customer}</p>
                    <p className="text-[11px] text-[#475569]">{a.email}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-normal text-[#1d1a17]">{a.service}</p>
                    <p className="text-[11px] text-[#475569]">{a.guests} guests • {a.duration}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-normal text-[#1d1a17]">{a.validDate}</p>
                    <p className="text-[11px] text-[#475569]">{a.validTime}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#E6F9EF] text-[#008236] border border-[#B3E8CC]">
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
