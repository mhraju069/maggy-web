"use client";

import { useState } from "react";
import { BsCheckCircle } from "react-icons/bs";
import { HiOutlineCalendar, HiOutlineClock, HiOutlineUsers } from "react-icons/hi";

const INITIAL_BOOKINGS = [
  {
    id: 1,
    title: "Private Sauna",
    type: "Sauna",
    description: "private sauna",
    date: "15 Feb 2026",
    time: "10:00 AM",
    guests: 2,
    payment: "Pay on location",
    status: "Upcoming",
  },
  {
    id: 2,
    title: "Lunchroom Reservation",
    type: "Sauna",
    description: "Restaurant",
    date: "20 Feb 2026",
    time: "1:00 AM",
    guests: 4,
    payment: "Pay on location",
    status: "Upcoming",
  },
];

export default function MyBookingPage() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [cancelId, setCancelId] = useState<number | null>(null);

  const confirmCancel = () => {
    if (cancelId !== null) {
      setBookings((b) => b.filter((x) => x.id !== cancelId));
      setCancelId(null);
    }
  };

  return (
    <div>
      <h1 className="font-displayPlayFair text-3xl font-bold text-[#1d1a17] mb-1">
        My Reservations
      </h1>
      <p className="text-sm text-[#64748B] mb-6">
        View and manage your wellness experiences
      </p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("upcoming")}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
            tab === "upcoming"
              ? "bg-[#CFB9A3] text-white"
              : "bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8F4F0]"
          }`}
        >
          Upcoming ({bookings.length})
        </button>
        <button
          onClick={() => setTab("past")}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
            tab === "past"
              ? "bg-[#CFB9A3] text-white"
              : "bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8F4F0]"
          }`}
        >
          Past (0)
        </button>
      </div>

      {tab === "upcoming" ? (
        bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl p-6 mb-4 border border-[#F1EDE8]">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-[#1d1a17] font-displayPlayFair">
                    {booking.title}
                  </h3>
                  <span className="px-2 py-0.5 text-[11px] bg-[#F3EDE6] text-[#8b7355] rounded-full">
                    {booking.type}
                  </span>
                  <BsCheckCircle className="text-green-500 w-4 h-4" />
                </div>
                <span className="text-xs text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full">
                  {booking.status}
                </span>
              </div>

              <p className="text-sm text-[#64748B] mb-1">{booking.description}</p>
              <p className="text-xs text-[#94A3B8] text-right mb-4">{booking.payment}</p>

              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#F3EDE6] flex items-center justify-center">
                    <HiOutlineCalendar className="w-4 h-4 text-[#8b7355]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#94A3B8]">Date</p>
                    <p className="text-sm font-semibold text-[#1d1a17]">{booking.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#F3EDE6] flex items-center justify-center">
                    <HiOutlineClock className="w-4 h-4 text-[#8b7355]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#94A3B8]">Time</p>
                    <p className="text-sm font-semibold text-[#1d1a17]">{booking.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#F3EDE6] flex items-center justify-center">
                    <HiOutlineUsers className="w-4 h-4 text-[#8b7355]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#94A3B8]">Guests</p>
                    <p className="text-sm font-semibold text-[#1d1a17]">{booking.guests}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F1EDE8]">
                <button
                  onClick={() => setCancelId(booking.id)}
                  className="text-sm text-[#8b7355] hover:text-red-500 transition-colors"
                >
                  Cancel reservation &rsaquo;
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl p-12 text-center border border-[#F1EDE8]">
            <div className="w-14 h-14 rounded-full bg-[#F3EDE6] flex items-center justify-center mx-auto mb-4">
              <HiOutlineCalendar className="w-7 h-7 text-[#8b7355]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1d1a17] mb-1">No upcoming bookings</h3>
            <p className="text-sm text-[#64748B]">You have no upcoming reservations.</p>
          </div>
        )
      ) : (
        <div className="bg-white rounded-xl p-12 text-center border border-[#F1EDE8]">
          <div className="w-14 h-14 rounded-full bg-[#F3EDE6] flex items-center justify-center mx-auto mb-4">
            <HiOutlineCalendar className="w-7 h-7 text-[#8b7355]" />
          </div>
          <h3 className="text-lg font-semibold text-[#1d1a17] mb-1">No past bookings</h3>
          <p className="text-sm text-[#64748B] mb-6">Your completed bookings will appear here</p>
          <button className="flex items-center gap-2 mx-auto px-6 py-3 bg-[#CFB9A3] hover:bg-[#bfa77f] text-white rounded-full text-sm font-semibold transition-colors">
            + Start New Booking
          </button>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelId !== null && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold text-[#1d1a17] font-displayPlayFair mb-3">
              Cancel Reservation
            </h2>
            <p className="text-[#64748B] text-sm mb-3">
              Are you sure you want to cancel this reservation?
            </p>
            <p className="text-[#64748B] text-sm mb-8">
              Cancellations made within 24 hours of your visit may be subject to a cancellation fee.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelId(null)}
                className="flex-1 py-3 rounded-xl bg-[#F1F5F9] text-[#1d1a17] font-semibold text-sm hover:bg-[#E2E8F0] transition-colors"
              >
                Keep
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
