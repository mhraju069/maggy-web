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
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { dashboardTranslations } from "@/lib/i18n/dashboardTranslations";
import { formatTime24h } from "@/lib/dateUtils";

function formatDisplayDate(dateStr: string, locale: string = "en-US") {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(locale === "nl" ? "nl-NL" : locale === "de" ? "de-DE" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatStatus(status?: string, dt?: any): string {
  if (!status) return dt?.confirmed || "Confirmed";
  const s = status.toLowerCase().replace(/_/g, " ").trim();
  if (s.includes("confirmed")) return dt?.confirmed || "Confirmed";
  if (s.includes("completed")) return dt?.completed || "Completed";
  if (s.includes("cancelled")) return dt?.cancelled || "Cancelled";
  if (s.includes("pending")) return dt?.pending || "Pending";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatPaymentStatus(paymentStatus: string | undefined, dt: { paid: string; unpaid: string }): string {
  if (!paymentStatus) return "";
  const normalized = paymentStatus.toLowerCase().replace(/_/g, " ").trim();
  if (normalized === "paid") return dt.paid;
  if (normalized === "unpaid" || normalized === "not paid") return dt.unpaid;
  return paymentStatus.replace(/_/g, " ").trim();
}

export default function MyBookingPage() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const { dashboardData, loading, refreshDashboard } = useDashboard();
  const { language } = useLanguage();
  const dt = dashboardTranslations[language]?.myBookings || dashboardTranslations.en.myBookings;

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
    setCancelBooking(null);
    setCancelReason("");
    setCancelError(null);
    setCancelSuccess(null);
  };

  const handleConfirmCancel = async () => {
    if (!cancelBooking) return;
    setCancelling(true);
    setCancelError(null);

    const bId = cancelBooking.id || cancelBooking.booking_id;
    try {
      const res = await bookingService.cancelBooking(bId, { reason: cancelReason.trim() });
      setCancelSuccess(res);
      await refreshDashboard();
    } catch (err: any) {
      if (err instanceof ApiError) {
        setCancelError(err.message || dt.cancelFailed);
      } else {
        setCancelError(err?.message || dt.cancelUnexpected);
      }
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-displayPlayFair text-2xl sm:text-3xl font-bold text-[#1d1a17] mb-1">
          {dt.title}
        </h1>
        <p className="text-sm text-[#64748B]">
          {dt.subtitle}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab("upcoming")}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
            tab === "upcoming"
              ? "bg-[#CFB9A3] text-white shadow-xs"
              : "bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8F4F0]"
          }`}
        >
          {dt.upcomingTab} ({upcomingBookings.length})
        </button>
        <button
          onClick={() => setTab("past")}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
            tab === "past"
              ? "bg-[#CFB9A3] text-white shadow-xs"
              : "bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8F4F0]"
          }`}
        >
          {dt.pastTab} ({pastBookings.length})
        </button>
      </div>

      {loading ? (
        <Spinner message="Loading your reservations..." />
      ) : activeBookings.length > 0 ? (
        activeBookings.map((booking) => {
          const isCancelled = booking.status?.toLowerCase().includes("cancelled");
          return (
            <div
              key={booking.id || booking.booking_id}
              className="bg-white rounded-2xl p-4 sm:p-6 border border-[#F1EDE8] shadow-xs"
            >
              {/* Header row: title, type and status badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <h3 className="text-base sm:text-lg font-bold text-[#1d1a17] font-displayPlayFair">
                    {cleanServiceName(booking.service_name)}
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] sm:text-[11px] bg-[#F3EDE6] text-[#8b7355] rounded-full uppercase tracking-wider font-semibold">
                    {booking.service_type}
                  </span>
                </div>

                <div className="self-start sm:self-auto">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
                      isCancelled
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {!isCancelled && <BsCheckCircle className="text-emerald-600 w-3.5 h-3.5 shrink-0" />}
                    <span>{formatStatus(booking.status, dt)}</span>
                  </span>
                </div>
              </div>

              {/* Sub-header: Booking ID & Payment Status */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-[#F1EDE8] text-xs">
                <p className="text-[#64748B]">
                  {dt.bookingId}: <span className="font-mono font-semibold text-[#1d1a17]">{booking.booking_id}</span>
                  {booking.total_price && Number(booking.total_price) > 0 && (
                    <span className="ml-3 font-medium text-[#8B7355]">
                      {dt.totalPaid}: €{booking.total_price}
                    </span>
                  )}
                </p>
                {booking.payment_status && (
                  <p className="text-[#94A3B8]">
                    Payment:{" "}
                    <span className="text-[#475569] font-medium capitalize">
                      {formatPaymentStatus(booking.payment_status, dt)}
                    </span>
                  </p>
                )}
              </div>

              {/* Details grid: Date, Time, Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FCF2E9] flex items-center justify-center text-[#8b7355] shrink-0">
                    <HiOutlineCalendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">{dt.dateLabel}</p>
                    <p className="text-sm font-semibold text-[#1d1a17]">
                      {formatDisplayDate(booking.date, language)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FCF2E9] flex items-center justify-center text-[#8b7355] shrink-0">
                    <HiOutlineClock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">{dt.timeLabel}</p>
                    <p className="text-sm font-semibold text-[#1d1a17]">
                      {formatTime24h(booking.time)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FCF2E9] flex items-center justify-center text-[#8b7355] shrink-0">
                    <HiOutlineUsers className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">{dt.guestsCount}</p>
                    <p className="text-sm font-semibold text-[#1d1a17]">
                      {booking.guests} {booking.guests === 1 ? dashboardTranslations[language].home.guest : dashboardTranslations[language].home.guests}
                    </p>
                  </div>
                </div>
              </div>

              {tab === "upcoming" && !isCancelled && (
                <div className="mt-4 pt-3 border-t border-[#F1EDE8] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleOpenCancelModal(booking)}
                    className="text-xs font-semibold text-[#8b7355] hover:text-red-600 transition-colors cursor-pointer"
                  >
                    {dt.cancelReservation} &rsaquo;
                  </button>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="bg-white rounded-2xl p-10 text-center border border-[#F1EDE8] shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-[#FCF2E9] flex items-center justify-center mx-auto mb-4 text-[#8b7355]">
            <HiOutlineCalendar className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold font-displayPlayFair text-[#1d1a17] mb-1">
            {tab === "upcoming" ? dt.noUpcomingTitle : dt.noPastTitle}
          </h3>
          <p className="text-sm text-[#64748B] mb-6 max-w-md mx-auto">
            {tab === "upcoming" ? dt.noUpcomingDesc : dt.noPastDesc}
          </p>
          <Link
            href="/services"
            className="inline-block px-6 py-2.5 bg-[#8B7355] hover:bg-[#786247] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            {dt.bookNow}
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
                {cancelSuccess ? dt.reservationCancelled : dt.cancelReservation}
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
                    <span>{dt.cancelledSuccessfully}</span>
                  </div>
                  <p>{cancelSuccess.message}</p>
                  {cancelSuccess.credit_restored && (
                    <div className="pt-2 border-t border-emerald-200/60 font-medium">
                      ✓ {dt.creditRefunded}
                      {cancelSuccess.remaining_sessions !== undefined && (
                        <span className="block mt-0.5">
                          {dt.remainingCredits} <strong>{cancelSuccess.remaining_sessions}</strong>
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
                  {dt.done}
                </button>
              </div>
            ) : (
              /* Confirmation & Form State */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2DC] space-y-1 text-xs">
                  <p className="text-[#64748B]">
                    {dt.bookingReference}{" "}
                    <span className="font-mono font-bold text-[#1d1a17]">
                      {cancelBooking.booking_id}
                    </span>
                  </p>
                  <p className="text-[#64748B]">
                    {dt.experience}{" "}
                    <span className="font-semibold text-[#1d1a17]">
                      {cleanServiceName(cancelBooking.service_name)}
                    </span>
                  </p>
                  <p className="text-[#64748B]">
                    {dt.scheduled}{" "}
                    <span className="font-semibold text-[#1d1a17]">
                      {formatDisplayDate(cancelBooking.date, language)} {dt.at} {formatTime24h(cancelBooking.time)}
                    </span>
                  </p>
                </div>

                {/* Policy Notice Box */}
                <div className="p-3.5 rounded-xl bg-[#FCF2E9] border border-[#E8E2DC] text-[11px] text-[#8B7355] leading-relaxed">
                  {dt.cancellationNotice}
                </div>

                {/* Reason Input */}
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">
                    {dt.cancellationReason} <span className="text-gray-400 font-normal lowercase">{dt.optional}</span>
                  </label>
                  <textarea
                    rows={2}
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder={dt.cancellationPlaceholder}
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
                    {dt.keepReservation}
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
                        <span>{dt.cancelling}</span>
                      </>
                    ) : (
                      <span>{dt.confirmCancellation}</span>
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
