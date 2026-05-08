"use client";

import { useState } from "react";
import { MdCalendarMonth, MdClose } from "react-icons/md";

const ALL_SERVICES = ["Private Sauna", "Shared Sauna", "Restaurant", "Activities", "Arrangements"];

const INITIAL_EXCEPTIONS = [
  { id: 1, date: "Feb 9, 2026", reason: "Holiday", services: ["Private Sauna"] },
  { id: 2, date: "Feb 9, 2026", reason: "Holiday", services: ["Arrangements", "Activities", "Restaurant", "Shared Sauna"] },
  { id: 3, date: "Feb 9, 2026", reason: "Holiday", services: ["Arrangements", "Activities", "Restaurant", "Shared Sauna"] },
  { id: 4, date: "Feb 9, 2026", reason: "Holiday", services: ["Private Sauna"] },
];

export default function ExceptionsPage() {
  const [exceptions, setExceptions] = useState(INITIAL_EXCEPTIONS);
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const deleteException = (id: number) =>
    setExceptions(prev => prev.filter(e => e.id !== id));

  const toggleService = (s: string) =>
    setSelectedServices(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );

  const handleAdd = () => {
    if (!date || !reason) return;
    setExceptions(prev => [
      ...prev,
      {
        id: Date.now(),
        date,
        reason,
        services: selectedServices.length ? selectedServices : ALL_SERVICES,
      },
    ]);
    setDate("");
    setReason("");
    setSelectedServices([]);
    setShowModal(false);
  };

  const handleCancel = () => {
    setDate("");
    setReason("");
    setSelectedServices([]);
    setShowModal(false);
  };

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-displayPlayFair text-2xl font-bold text-[#1d1a17]">Exceptions</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage closed dates and service exceptions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#CFB9A3] hover:bg-[#8b7355] text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <span className="text-lg leading-none">+</span> Add Exception
        </button>
      </div>

      {/* ── Exception Cards Grid ── */}
      <div className="bg-white border border-[#E8E2DC] rounded-2xl p-6">
        <div className="grid grid-cols-2 gap-4">
          {exceptions.map(ex => (
            <div key={ex.id} className="border border-[#F1EDE8] rounded-xl p-4">
              {/* Top row */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  {/* Warning icon circle */}
                  <div className="w-10 h-10 rounded-full bg-[#FEE2E2] flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="18" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M20.748 16.014L12.748 2.014C12.374 1.348 11.668 0.95 10.9 0.95C10.132 0.95 9.426 1.348 9.052 2.014L1.052 16.014C0.678 16.68 0.678 17.494 1.066 18.16C1.454 18.826 2.16 19.224 2.914 19.224H18.914C19.668 19.224 20.374 18.826 20.762 18.16C21.15 17.494 21.136 16.68 20.748 16.014Z"
                        stroke="#E7000B"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M11 8V12" stroke="#E7000B" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="11" cy="15.5" r="0.75" fill="#E7000B" stroke="#E7000B" strokeWidth="0.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1d1a17]">{ex.date}</p>
                    <p className="text-xs text-gray-400">{ex.reason}</p>
                  </div>
                </div>
                {/* Delete button */}
                <button
                  onClick={() => deleteException(ex.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M7.5 8.25V12.75" stroke="#E7000B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10.5 8.25V12.75" stroke="#E7000B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14.25 4.5V15C14.25 15.3978 14.092 15.7794 13.8107 16.0607C13.5294 16.342 13.1478 16.5 12.75 16.5H5.25C4.85218 16.5 4.47064 16.342 4.18934 16.0607C3.90804 15.7794 3.75 15.3978 3.75 15V4.5" stroke="#E7000B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2.25 4.5H15.75" stroke="#E7000B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 4.5V3C6 2.60218 6.15804 2.22064 6.43934 1.93934C6.72064 1.65804 7.10218 1.5 7.5 1.5H10.5C10.8978 1.5 11.2794 1.65804 11.5607 1.93934C11.842 2.22064 12 2.60218 12 3V4.5" stroke="#E7000B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Affected Services */}
              <p className="text-[10px] font-semibold tracking-widest uppercase text-[#9F0712] mb-2">
                Affected Services
              </p>
              <div className="flex flex-wrap gap-2">
                {ex.services.map(s => (
                  <span
                    key={s}
                    className="px-3 py-1 text-xs font-normal text-[#9F0712] bg-[#FEE2E2] rounded-full font-displayPlayFair"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Add Exception Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl">
            {/* Modal header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-displayPlayFair text-xl font-bold text-[#1d1a17]">Add Exception</h2>
                <p className="text-xs text-[#CFB9A3] mt-0.5">Temporarily adjust availability for special situations</p>
              </div>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors mt-0.5"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>

            {/* Date field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#1d1a17] mb-1.5">Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full border border-[#E8E2DC] rounded-xl px-4 py-2.5 text-sm text-[#1d1a17] focus:outline-none focus:border-[#CFB9A3] bg-white pr-10"
                />
                <MdCalendarMonth className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            {/* Reason field */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-[#1d1a17] mb-1.5">Reason</label>
              <input
                type="text"
                placeholder="e.g., Public Holiday, Maintenance"
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full border border-[#E8E2DC] rounded-xl px-4 py-2.5 text-sm text-[#1d1a17] placeholder:text-gray-400 focus:outline-none focus:border-[#CFB9A3]"
              />
            </div>

            {/* Affected Services */}
            <div className="mb-6">
              <p className="text-sm font-bold text-[#1d1a17] mb-3">
                Affected Services <span className="font-normal text-gray-400">(leave empty for all)</span>
              </p>
              <div className="flex flex-col gap-2">
                {ALL_SERVICES.map(s => (
                  <label
                    key={s}
                    className="flex items-center gap-3 bg-[#F5F0EB] rounded-xl px-4 py-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(s)}
                      onChange={() => toggleService(s)}
                      className="w-4 h-4 accent-[#CFB9A3] rounded"
                    />
                    <span className="text-sm font-medium text-[#1d1a17]">{s}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 py-2.5 border border-[#E8E2DC] rounded-xl text-sm font-semibold text-[#64748B] hover:bg-[#F8F4F0] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 py-2.5 bg-[#CFB9A3] hover:bg-[#8b7355] rounded-xl text-sm font-semibold text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="text-lg leading-none">+</span> Add Exception
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
