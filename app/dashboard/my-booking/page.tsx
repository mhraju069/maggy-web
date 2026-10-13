"use client";

import Link from "next/link";
import { useState } from "react";
import { BsCheckCircle } from "react-icons/bs";
import { HiOutlineCalendar, HiOutlineClock, HiOutlineUsers } from "react-icons/hi";
import { DashboardBookingItem } from "@/lib/api";
import { useDashboard } from "../DashboardContext";
import Spinner from "@/components/shared/Spinner";
import { cleanServiceName } from "../page";

function formatDisplayDate(dateStr: string) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatDisplayTime(timeStr: string) {
  if (!timeStr) return "";
  try {
    const [h, m] = timeStr.split(":");
    const hours = parseInt(h, 10);
    const period = hours >= 12 ? "PM" : "AM";
    const h12 = hours % 12 || 12;
    return `${h12}:${m || "00"} ${period}`;
  } catch {
    return timeStr;
  }
}

export default function MyBookingPage() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const { dashboardData, loading } = useDashboard();
  const [cancelBooking, setCancelBooking] = useState<DashboardBookingItem | null>(null);

  const upcomingBookings = dashboardData?.my_bookings?.upcoming || [];
  const pastBookings = dashboardData?.my_bookings?.past || [];
  const activeBookings = tab === "upcoming" ? upcomingBookings : pastBookings;

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
          Upcoming ({upcomingBookings.length})
        </button>
        <button
          onClick={() => setTab("past")}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
            tab === "past"
              ? "bg-[#CFB9A3] text-white"
              : "bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8F4F0]"
          }`}
        >
          Past ({pastBookings.length})
        </button>
      </div>

      {loading ? (
        <Spinner message="Loading your reservations..." />
      ) : activeBookings.length > 0 ? (
        activeBookings.map((booking) => (
          <div key={booking.id || booking.booking_id} className="bg-white rounded-xl p-6 mb-4 border border-[#F1EDE8]">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-[#1d1a17] font-displayPlayFair">
                  {cleanServiceName(booking.service_name)}
                </h3>
                <span className="px-2 py-0.5 text-[11px] bg-[#F3EDE6] text-[#8b7355] rounded-full uppercase tracking-wider font-semibold">
                  {booking.service_type}
                </span>
                <BsCheckCircle className="text-green-500 w-4 h-4" />
              </div>
              <span className="text-xs text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full capitalize">
                {booking.status || "Confirmed"}
              </span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-[#64748B]">
                ID: <span className="font-mono font-semibold text-[#1d1a17]">{booking.booking_id}</span>
                {booking.total_price && Number(booking.total_price) > 0 && (
                  <span className="ml-3 font-medium text-[#8B7355]">Total: €{booking.total_price}</span>
                )}
              </p>
              <p className="text-xs text-[#94A3B8] capitalize">
                Payment: <span className="text-[#475569] font-medium">{booking.payment_status?.replace(/_/g, " ")}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#F3EDE6] flex items-center justify-center">
                  <HiOutlineCalendar className="w-4 h-4 text-[#8b7355]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#94A3B8]">Date</p>
                  <p className="text-sm font-semibold text-[#1d1a17]">{formatDisplayDate(booking.date)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#F3EDE6] flex items-center justify-center">
                  <HiOutlineClock className="w-4 h-4 text-[#8b7355]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#94A3B8]">Time</p>
                  <p className="text-sm font-semibold text-[#1d1a17]">{formatDisplayTime(booking.time)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#F3EDE6] flex items-center justify-center">
                  <HiOutlineUsers className="w-4 h-4 text-[#8b7355]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#94A3B8]">Guests</p>
                  <p className="text-sm font-semibold text-[#1d1a17]">
                    {booking.guests} {booking.guests === 1 ? "Guest" : "Guests"}
                  </p>
                </div>
              </div>
            </div>

            {tab === "upcoming" && (
              <div className="mt-4 pt-3 border-t border-[#F1EDE8] flex items-center justify-between">
                <button
                  onClick={() => setCancelBooking(booking)}
                  className="text-sm text-[#8b7355] hover:text-red-500 transition-colors"
                >
                  Cancel reservation &rsaquo;
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="bg-white rounded-xl p-12 text-center border border-[#F1EDE8]">
          <div className="w-14 h-14 rounded-full bg-[#F3EDE6] flex items-center justify-center mx-auto mb-4">
            <HiOutlineCalendar className="w-7 h-7 text-[#8b7355]" />
          </div>
          <h3 className="text-lg font-semibold text-[#1d1a17] mb-1">
            {tab === "upcoming" ? "No upcoming bookings found" : "No past bookings found"}
          </h3>
          <p className="text-sm text-[#64748B] mb-6">
            {tab === "upcoming" ? "You have no upcoming reservations scheduled." : "Your completed bookings will appear here."}
          </p>
          <Link
            href="/services"
            className="inline-block px-6 py-3 bg-[#CFB9A3] hover:bg-[#bfa77f] text-white rounded-full text-sm font-semibold transition-colors"
          >
            + Start New Booking
          </Link>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelBooking && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold text-[#1d1a17] font-displayPlayFair mb-3">
              Cancel Reservation
            </h2>
            <p className="text-[#64748B] text-sm mb-3">
              Are you sure you want to cancel booking <span className="font-semibold text-[#1d1a17]">{cancelBooking.booking_id}</span>?
            </p>
            <p className="text-[#64748B] text-xs mb-8">
              Cancellations made within 24 hours of your visit may be subject to our standard policy.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelBooking(null)}
                className="flex-1 py-3 rounded-xl bg-[#F1F5F9] text-[#1d1a17] font-semibold text-sm hover:bg-[#E2E8F0] transition-colors"
              >
                Keep
              </button>
              <button
                onClick={() => {
                  setCancelBooking(null);
                }}
                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
