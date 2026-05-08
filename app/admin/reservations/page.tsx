"use client";
import { useState } from "react";

const BOOKINGS = [
  { id: "BK002", customer: "Sarah Johnson", email: "sarah@example.com", phone: "+123456890", service: "Lunchroom Reservation", suite: "suite 131", date: "Feb 20, 2026", time: "1:00 PM", duration: "90 minutes", guests: 4, status: "confirmed", payment: "Paid", amount: "$45" },
  { id: "BK001", customer: "Sarah Johnson", email: "sarah@example.com", phone: "+123456890", service: "Lunchroom Reservation", suite: "suite 131", date: "Feb 20, 2026", time: "1:00 PM", duration: "90 minutes", guests: 4, status: "confirmed", payment: "Paid", amount: "$45" },
  { id: "BK001", customer: "Sarah Johnson", email: "sarah@example.com", phone: "+123456890", service: "Lunchroom Reservation", suite: "suite 131", date: "Feb 20, 2026", time: "1:00 PM", duration: "90 minutes", guests: 4, status: "confirmed", payment: "€30", amount: "€30" },
  { id: "BK001", customer: "Sarah Johnson", email: "sarah@example.com", phone: "+123456890", service: "Lunchroom Reservation", suite: "suite 131", date: "Feb 20, 2026", time: "1:00 PM", duration: "90 minutes", guests: 4, status: "confirmed", payment: "€30", amount: "€30" },
];

export default function ReservationsPage() {
  const [detail, setDetail] = useState<(typeof BOOKINGS)[0] | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-displayPlayFair text-2xl font-bold text-[#1d1a17]">Reservations</h1>
          <p className="text-xs text-gray-400">Manage all bookings</p>
        </div>
        <button onClick={() => setCreating(true)} className="px-4 py-2 bg-[#CFB9A3] hover:bg-[#8b7355] text-white text-xs font-semibold rounded-lg transition-colors">
          + Add Booking
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <input placeholder="Search booking..." className="flex-1 px-3 py-2 text-xs border border-[#E8E2DC] rounded-lg focus:outline-none focus:border-[#CFB9A3] bg-white" />
        <select className="px-3 py-2 text-xs border border-[#E8E2DC] rounded-lg bg-white focus:outline-none">
          <option>All Services</option><option>Private Sauna</option><option>Lunchroom</option>
        </select>
        <select className="px-3 py-2 text-xs border border-[#E8E2DC] rounded-lg bg-white focus:outline-none">
          <option>All Dates</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E8E2DC] overflow-hidden">
        <table className="w-full text-xs">
          <thead className="border-b border-[#E8E2DC] bg-[#FAF7F4]">
            <tr>{["", "ID", "Customer", "Service", "Date & Time", "Status", "Payment", "Actions"].map(h => (
              <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {BOOKINGS.map((b, i) => (
              <tr key={i} className="border-b border-[#F5F0EB] hover:bg-[#FAF7F4] transition-colors">
                <td className="px-4 py-3"><input type="checkbox" className="rounded" /></td>
                <td className="px-4 py-3 font-semibold text-[#1d1a17]">{b.id}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-[#1d1a17]">{b.customer}</p>
                  <p className="text-gray-400">{b.email}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-[#1d1a17]">{b.service}</p>
                  <p className="text-gray-400">{b.suite}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-[#1d1a17]">{b.date}</p>
                  <p className="text-gray-400">{b.time}</p>
                </td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full font-semibold">{b.status}</span></td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-semibold">{b.payment}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setDetail(b)} className="text-[#8b7355] hover:text-[#1d1a17]">👁</button>
                    <button className="text-gray-400 hover:text-red-500">🚫</button>
                    <button className="text-gray-400 hover:text-red-500">🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Booking Detail Modal */}
      {detail && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-2xl relative">
            <button onClick={() => setDetail(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">✕</button>
            <h2 className="font-displayPlayFair text-xl font-bold text-[#1d1a17] mb-1">Booking Details</h2>
            <p className="text-xs text-gray-400 mb-4">Everything prepared for your upcoming visit</p>
            <div className="flex justify-between mb-3"><span className="text-xs text-gray-400">Booking ID</span><span className="text-xs font-bold">{detail.id}</span></div>
            <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-[10px] font-semibold mb-4 inline-block">{detail.status}</span>
            <p className="text-[10px] font-semibold text-gray-400 uppercase mb-2">Service Details</p>
            <div className="grid grid-cols-2 gap-1 mb-3 text-xs">
              <div><p className="text-gray-400">Service</p><p className="font-semibold">{detail.service}</p></div>
              <div><p className="text-gray-400">Duration</p><p className="font-semibold">{detail.duration}</p></div>
              <div><p className="text-gray-400">Date</p><p className="font-semibold">{detail.date}</p></div>
              <div><p className="text-gray-400">Time</p><p className="font-semibold">{detail.time}</p></div>
              <div><p className="text-gray-400">Guests</p><p className="font-semibold">{detail.guests} people</p></div>
            </div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase mb-2">Customer Information</p>
            <div className="text-xs mb-3">
              <p className="font-semibold">{detail.customer}</p>
              <p className="text-gray-400">{detail.email}</p>
              <p className="text-gray-400">{detail.phone}</p>
            </div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase mb-2">Payment Information</p>
            <div className="text-xs mb-4">
              <p className="font-semibold">{detail.amount}</p>
              <p className="text-gray-400">Payment Status: {detail.payment}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDetail(null)} className="flex-1 py-2 text-xs border border-[#E8E2DC] rounded-lg text-gray-600 hover:bg-gray-50">Cancel booking</button>
              <button onClick={() => setDetail(null)} className="flex-1 py-2 text-xs bg-[#CFB9A3] hover:bg-[#8b7355] text-white rounded-lg transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Booking Modal */}
      {creating && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setCreating(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">✕</button>
            <h2 className="font-displayPlayFair text-xl font-bold mb-1">Create Offline booking</h2>
            <p className="text-xs text-gray-400 mb-4">Add booking made via phone or in-person</p>
            <div className="flex flex-col gap-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-gray-500 mb-1 block">Service Type</label><select className="w-full border border-[#E8E2DC] rounded-lg p-2 focus:outline-none"><option>Private Sauna</option><option>Shared Sauna</option><option>Lunchroom</option><option>Activity</option><option>Arrangement</option></select></div>
                <div><label className="text-gray-500 mb-1 block">Number of Guests</label><input type="number" defaultValue={1} className="w-full border border-[#E8E2DC] rounded-lg p-2 focus:outline-none" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-gray-500 mb-1 block">Date</label><input type="date" className="w-full border border-[#E8E2DC] rounded-lg p-2 focus:outline-none" /></div>
                <div><label className="text-gray-500 mb-1 block">Time</label><select className="w-full border border-[#E8E2DC] rounded-lg p-2 focus:outline-none"><option>Select Time</option></select></div>
              </div>
              <div><label className="text-gray-500 mb-1 block">Duration (minutes)</label><input type="number" defaultValue={120} className="w-full border border-[#E8E2DC] rounded-lg p-2 focus:outline-none" /></div>
              <p className="font-semibold text-[#1d1a17]">Customer Information</p>
              <div><label className="text-gray-500 mb-1 block">Full Name</label><input placeholder="Customer Name" className="w-full border border-[#E8E2DC] rounded-lg p-2 focus:outline-none" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-gray-500 mb-1 block">Email</label><input placeholder="customer@email.com" className="w-full border border-[#E8E2DC] rounded-lg p-2 focus:outline-none" /></div>
                <div><label className="text-gray-500 mb-1 block">Phone Number</label><input placeholder="+31 6 1234 5678" className="w-full border border-[#E8E2DC] rounded-lg p-2 focus:outline-none" /></div>
              </div>
              <p className="font-semibold text-[#1d1a17]">Payment Information</p>
              <div><label className="text-gray-500 mb-1 block">Full Name</label><input placeholder="Customer Name" className="w-full border border-[#E8E2DC] rounded-lg p-2 focus:outline-none" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-gray-500 mb-1 block">Payment Status</label><select className="w-full border border-[#E8E2DC] rounded-lg p-2 focus:outline-none"><option>Paid</option><option>Pending</option><option>Pay on site</option></select></div>
                <div><label className="text-gray-500 mb-1 block">Amount (€)</label><input type="number" defaultValue={120} className="w-full border border-[#E8E2DC] rounded-lg p-2 focus:outline-none" /></div>
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => setCreating(false)} className="flex-1 py-2 border border-[#E8E2DC] rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
                <button onClick={() => setCreating(false)} className="flex-1 py-2 bg-[#CFB9A3] hover:bg-[#8b7355] text-white rounded-lg transition-colors">+ Create Booking</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
