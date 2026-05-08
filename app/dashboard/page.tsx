"use client";

import Link from "next/link";
import { BsCheckCircle } from "react-icons/bs";
import { HiOutlineCalendar, HiOutlineClock, HiOutlineUsers } from "react-icons/hi";

const BOOKINGS = [
  {
    id: 1,
    title: "Private Sauna",
    type: "Sauna",
    date: "15 Feb 2026",
    time: "10:00 AM",
    guests: 2,
    status: "Upcoming",
  },
  {
    id: 2,
    title: "Lunchroom Reservation",
    type: "Sauna",
    date: "20 Feb 2026",
    time: "1:00 AM",
    guests: 4,
    status: "Upcoming",
  },
];

function BookingCard({ booking }: { booking: (typeof BOOKINGS)[0] }) {
  return (
    <div className="bg-white rounded-xl p-6 mb-4 border border-[#F1EDE8]">
      <div className="flex items-center justify-between mb-5">
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
        <Link
          href="/dashboard/my-booking"
          className="text-sm text-[#8b7355] hover:text-[#1d1a17] transition-colors"
        >
          View all reservations &rsaquo;
        </Link>
      </div>
    </div>
  );
}

export default function DashboardHome() {
  return (
    <div>
      <h1 className="font-displayPlayFair text-3xl font-bold text-[#1d1a17] mb-1">
        Welcome back.
      </h1>
      <p className="text-sm text-[#64748B] mb-8">
        Your upcoming visits are thoughtfully prepared.
      </p>

      <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest mb-3">
        Next visit
      </p>
      <BookingCard booking={BOOKINGS[0]} />

      <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest mb-3 mt-6">
        Other Upcoming Visits
      </p>
      <BookingCard booking={BOOKINGS[1]} />
    </div>
  );
}
