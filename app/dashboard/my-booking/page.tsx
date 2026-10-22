"use client";

import Link from "next/link";
import { useState } from "react";
import { BsCheckCircle } from "react-icons/bs";
import { HiOutlineCalendar, HiOutlineClock, HiOutlineUsers } from "react-icons/hi";
import { DashboardBookingItem } from "@/lib/api";
import { bookingService, CancelBookingResponse } from "@/lib/api/services/bookingService";
import { ApiError } from "@/lib/api/types";
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
  const { dashboardData, loading, refreshDashboard } = useDashboard();
  const [cancelBooking, setCancelBooking] = useState<DashboardBookingItem | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState<CancelBookingResponse | null>(null);

  const upcomingBookings = dashboardData?.my_bookings?.upcoming || [];
  const pastBookings = dashboardData?.my_bookings?.past || [];
  const activeBookings = tab === "upcoming" ? upcomingBookings : pastBookings;

  const handleOpenCancelModal = (booking: DashboardBookingItem) => {
    setCancelBooking(booking);
    setCancelReason("");
    setCancelError(null);
    setCancelSuccess(null);
  };

  const handleCloseCancelModal = () => {
    if (cancelling) return;
    setCancelBooking(null);
    setCancelReason("");
    setCancelError(null);
    setCancelSuccess(null);
  };

  const handleConfirmCancel = async () => {
    if (!cancelBooking) return;
    setCancelling(true);
    setCancelError(null);
    setCancelSuccess(null);

    try {
      const bookingIdentifier = cancelBooking.booking_id || cancelBooking.id;
      const res = await bookingService.cancelBooking(bookingIdentifier, {
        booking_id: cancelBooking.booking_id,
        reason: cancelReason.trim() || undefined,
      });

      if (res && res.success !== false) {
        setCancelSuccess(res);
        // Refresh dashboard in background to update upcoming / past bookings list
        await refreshDashboard();
      } else {
        setCancelError(res?.message || "Cancellation could not be completed.");
      }
    } catch (err: any) {
      if (err instanceof ApiError) {
        const errorData = err.data || {};
        const msg = (errorData.message as string) || (errorData.detail as string) || err.message;
        setCancelError(msg || "Failed to cancel booking. Please try again.");
      } else {
        setCancelError(err?.message || "An unexpected error occurred while cancelling your reservation.");
      }
    } finally {
      setCancelling(false);
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

            {tab === "upcoming" && booking.status?.toLowerCase() !== "cancelled" && (
              <div className="mt-4 pt-3 border-t border-[#F1EDE8] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleOpenCancelModal(booking)}
                  className="text-sm font-semibold text-[#8b7355] hover:text-red-600 transition-colors cursor-pointer"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full mx-auto shadow-2xl border border-[#E8E2DC]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-[#1d1a17] font-displayPlayFair">
                {cancelSuccess ? "Reservation Cancelled" : "Cancel Reservation"}
              </h2>
              <button
                type="button"
                onClick={handleCloseCancelModal}
                disabled={cancelling}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Success State */}
            {cancelSuccess ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs leading-relaxed space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                    <BsCheckCircle className="text-emerald-600 w-4 h-4" />
                    <span>Cancelled Successfully</span>
                  </div>
                  <p>{cancelSuccess.message}</p>
                  {cancelSuccess.credit_restored && (
                    <div className="pt-2 border-t border-emerald-200/60 font-medium">
                      ✓ 1 session credit has been refunded to your account.
                      {cancelSuccess.remaining_sessions !== undefined && (
                        <span className="block mt-0.5">
                          Remaining credits: <strong>{cancelSuccess.remaining_sessions}</strong>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleCloseCancelModal}
                  className="w-full py-3.5 rounded-xl bg-[#8B7355] hover:bg-[#786247] text-white font-bold text-sm transition-all shadow-md cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              /* Confirmation & Form State */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2DC] space-y-1 text-xs">
                  <p className="text-[#64748B]">
                    Booking Reference:{" "}
                    <span className="font-mono font-bold text-[#1d1a17]">
                      {cancelBooking.booking_id}
                    </span>
                  </p>
                  <p className="text-[#64748B]">
                    Experience:{" "}
                    <span className="font-semibold text-[#1d1a17]">
                      {cleanServiceName(cancelBooking.service_name)}
                    </span>
                  </p>
                  <p className="text-[#64748B]">
                    Scheduled:{" "}
                    <span className="font-semibold text-[#1d1a17]">
                      {formatDisplayDate(cancelBooking.date)} at {formatDisplayTime(cancelBooking.time)}
                    </span>
                  </p>
                </div>

                {/* Policy Notice Box */}
                <div className="p-3.5 rounded-xl bg-[#FCF2E9] border border-[#E8E2DC] text-[11px] text-[#8B7355] leading-relaxed">
                  <strong>Notice:</strong> Cancellations must be made at least <strong>24 hours</strong> prior to start time to receive a session refund/credit. Cancellations within 24 hours cannot be restored.
                </div>

                {/* Reason Input */}
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">
                    Reason for Cancellation <span className="text-gray-400 font-normal lowercase">(optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="e.g. Schedule conflict, feeling unwell..."
                    disabled={cancelling}
                    className="w-full p-3 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#8B7355] resize-none"
                  />
                </div>

                {/* Error Banner */}
                {cancelError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold leading-normal">
                    {cancelError}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseCancelModal}
                    disabled={cancelling}
                    className="flex-1 py-3 rounded-xl bg-[#F1F5F9] text-[#1d1a17] font-bold text-xs hover:bg-[#E2E8F0] transition-colors cursor-pointer"
                  >
                    Keep Reservation
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmCancel}
                    disabled={cancelling}
                    className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                      cancelling
                        ? "bg-red-400 text-white cursor-wait"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                  >
                    {cancelling ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Cancelling...</span>
                      </>
                    ) : (
                      <span>Confirm Cancellation</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
