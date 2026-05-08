"use client";
import { useState } from "react";

const CAPACITY = [
  { name: "Private Sauna", max: 6 },
  { name: "Shared Sauna", max: 7 },
  { name: "Lunchroom", max: 8 },
  { name: "Activity", max: 2 },
  { name: "Arrangement", max: 12 },
];

const CURRENT = [
  { name: "Private Sauna", used: 2, total: 6 },
  { name: "Shared Sauna", used: 3, total: 7 },
  { name: "Lunchroom", used: 2, total: 8 },
  { name: "Activities", used: 2, total: 2 },
  { name: "Arrangements", used: 7, total: 12 },
];

export default function AvailabilityPage() {
  const [caps, setCaps] = useState(CAPACITY);
  const [adding, setAdding] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-displayPlayFair text-2xl font-bold text-[#1d1a17]">Availability &amp; Capacity</h1>
          <p className="text-xs text-gray-400">Manage service capacity limits</p>
        </div>
        <button onClick={() => setAdding(true)} className="px-4 py-2 bg-[#CFB9A3] hover:bg-[#8b7355] text-white text-xs font-semibold rounded-lg transition-colors">
          + Add Services
        </button>
      </div>

      {/* Capacity Limits */}
      <div className="bg-white rounded-xl border border-[#E8E2DC] p-5 mb-4">
        <p className="text-sm font-semibold text-[#1d1a17] mb-1">Service Capacity Limits</p>
        <p className="text-xs text-gray-400 mb-4">Set the maximum number of concurrent bookings allowed for each service at any given time slot.</p>
        {caps.map((c, i) => (
          <div key={c.name} className="flex items-center justify-between py-3 border-b border-[#F5F0EB] last:border-0">
            <div>
              <p className="text-sm font-semibold text-[#1d1a17]">{c.name}</p>
              <p className="text-[10px] text-gray-400">Maximum concurrent bookings per time slot</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setCaps(p => p.map((x, j) => j === i ? { ...x, max: Math.max(1, x.max - 1) } : x))} className="w-7 h-7 rounded-full border border-[#E8E2DC] flex items-center justify-center text-gray-600 hover:bg-gray-50 text-sm">−</button>
              <span className="w-8 text-center text-sm font-bold text-[#1d1a17]">{c.max}</span>
              <button onClick={() => setCaps(p => p.map((x, j) => j === i ? { ...x, max: x.max + 1 } : x))} className="w-7 h-7 rounded-full border border-[#E8E2DC] flex items-center justify-center text-gray-600 hover:bg-gray-50 text-sm">+</button>
            </div>
          </div>
        ))}
        <div className="mt-4 bg-blue-50 rounded-lg px-4 py-2.5 text-xs text-blue-600">
          ✓ Capacity settings are saved automatically and will take effect immediately for new bookings.
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-white rounded-xl border border-[#E8E2DC] p-5">
        <p className="text-sm font-semibold text-[#1d1a17] mb-4">Current Availability Status</p>
        <div className="grid grid-cols-3 gap-4">
          {CURRENT.map((c) => (
            <div key={c.name}>
              <p className="text-sm font-semibold text-[#1d1a17] mb-1">{c.name}</p>
              <p className="text-xs text-gray-400 mb-2">Today&apos;s Usage {c.used}/{c.total}</p>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#CFB9A3] rounded-full" style={{ width: `${(c.used / c.total) * 100}%` }} />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">{c.total - c.used} slot available</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Services Modal */}
      {adding && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl relative">
            <button onClick={() => setAdding(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">✕</button>
            <h2 className="font-displayPlayFair text-xl font-bold mb-1">Add New Services</h2>
            <p className="text-xs text-gray-400 mb-4">Create a new wellness service</p>
            <div className="flex flex-col gap-3 text-xs">
              <div><label className="text-gray-500 mb-1 block">Service Name</label><input placeholder="Service Name" className="w-full border border-[#E8E2DC] rounded-lg p-2 focus:outline-none" /></div>
              <div><label className="text-gray-500 mb-1 block">Category</label><select className="w-full border border-[#E8E2DC] rounded-lg p-2 focus:outline-none"><option>Sauna</option><option>Wellness</option><option>Dining</option></select></div>
              <div className="grid grid-cols-3 gap-2">
                <div><label className="text-gray-500 mb-1 block">Duration (min)</label><input type="number" defaultValue={120} className="w-full border border-[#E8E2DC] rounded-lg p-2 focus:outline-none" /></div>
                <div><label className="text-gray-500 mb-1 block">Price (€)</label><input type="number" defaultValue={120} className="w-full border border-[#E8E2DC] rounded-lg p-2 focus:outline-none" /></div>
                <div><label className="text-gray-500 mb-1 block">Capacity</label><input type="number" defaultValue={12} className="w-full border border-[#E8E2DC] rounded-lg p-2 focus:outline-none" /></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-gray-500 mb-1 block">Payment Status</label><select className="w-full border border-[#E8E2DC] rounded-lg p-2 focus:outline-none"><option>Paid</option><option>Partial payment</option><option>Pay on the spot</option></select></div>
                <div><label className="text-gray-500 mb-1 block">Shared / Private</label><select className="w-full border border-[#E8E2DC] rounded-lg p-2 focus:outline-none"><option>Private</option><option>Shared</option></select></div>
              </div>
              <div><label className="text-gray-500 mb-1 block">Features (one per line)</label><textarea placeholder="Feature 1&#10;Feature 2" rows={3} className="w-full border border-[#E8E2DC] rounded-lg p-2 focus:outline-none resize-none" /></div>
              <div><label className="text-gray-500 mb-1 block">Description</label><textarea placeholder="Describe the service experience..." rows={2} className="w-full border border-[#E8E2DC] rounded-lg p-2 focus:outline-none resize-none" /></div>
              <div className="flex gap-2 mt-1">
                <button onClick={() => setAdding(false)} className="flex-1 py-2 border border-[#E8E2DC] rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
                <button onClick={() => setAdding(false)} className="flex-1 py-2 bg-[#CFB9A3] hover:bg-[#8b7355] text-white rounded-lg transition-colors">+ Create Services</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
