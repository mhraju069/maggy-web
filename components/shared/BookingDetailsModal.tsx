"use client";

import React, { useEffect, useState } from "react";
import {
  HiOutlineX,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineUsers,
  HiOutlineSparkles,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineCurrencyEuro,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import { bookingService } from "@/lib/api/services/bookingService";

export interface BookingModalData {
  booking_id?: string;
  id?: string | number;
  service_name?: string;
  service_type?: string;
  date?: string;
  time?: string;
  guests?: number;
  capacity?: number;
  status?: string;
  payment_status?: string;
  total_price?: string | number;
  name?: string;
  email?: string;
  phone?: string;
  special_request?: string;
  celebration_type?: string;
  celebration_date?: string;
  name_of_celebrant?: string;
  age_of_celebrant?: number;
  hobbies?: string;
  celebration_details?: string;
  [key: string]: any;
}

interface BookingDetailsModalProps {
  bookingId: string | number | null;
  initialData?: BookingModalData | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatTime(timeStr?: string) {
  if (!timeStr) return "N/A";
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

export default function BookingDetailsModal({
  bookingId,
  initialData,
  isOpen,
  onClose,
}: BookingDetailsModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [details, setDetails] = useState<BookingModalData | null>(initialData || null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setDetails(null);
      setError(null);
      return;
    }

    if (initialData && Object.keys(initialData).length > 2) {
      setDetails(initialData);
    }

    if (bookingId) {
      setLoading(true);
      setError(null);

      // Attempt to load full details from API
      const fetchDetails = async () => {
        try {
          // Check if admin or user
          let res: any = null;
          try {
            res = await bookingService.getBookingDetails(bookingId);
          } catch (e: any) {
            // If regular booking detail 404/error, try admin booking detail
            try {
              const adminRes = await bookingService.getAdminBookingDetail(bookingId);
              if (adminRes?.data) {
                res = adminRes.data;
              }
            } catch {
              throw e;
            }
          }

          if (res) {
            setDetails((prev) => ({
              ...prev,
              ...res,
              booking_id: res.booking_id || bookingId,
              service_name: res.service_name || res.service?.name || res.service_type || prev?.service_name,
              service_type: res.service_type || prev?.service_type,
              date: res.date || res.booking_date || prev?.date,
              time: res.time || res.booking_time || res.start_time || prev?.time,
              guests: res.guests || res.capacity || prev?.guests || prev?.capacity,
              status: res.status || prev?.status,
              payment_status: res.payment_status || prev?.payment_status,
              total_price: res.total_price || res.price || prev?.total_price,
              name: res.client_name || res.name || res.guest_name || prev?.name,
              email: res.client_email || res.email || res.guest_email || prev?.email,
              phone: res.client_phone || res.phone || res.guest_phone || prev?.phone,
              access_code: res.access_code || prev?.access_code,
              special_request: res.special_request || res.details?.special_request || res.details?.notes || prev?.special_request,
              details: res.details || prev?.details,
            }));
          }
        } catch (err: any) {
          console.warn("Could not load full booking details from API, using available data:", err);
          if (!initialData) {
            setError("Could not retrieve detailed booking information from server.");
          }
        } finally {
          setLoading(false);
        }
      };

      fetchDetails();
    }
  }, [isOpen, bookingId, initialData]);

  if (!isOpen) return null;

  const currentData = details || initialData;
  const bookingRef = currentData?.booking_id || bookingId || "N/A";
  const serviceName = currentData?.service_name || currentData?.service_type || "Wellness Experience";
  const status = currentData?.status || "Confirmed";
  const paymentStatus = currentData?.payment_status || "Paid";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-cambria animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#E8E2DC] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F1EDE8] bg-[#FAF7F4]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#CFB9A3] flex items-center justify-center text-white">
              <HiOutlineSparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1d1a17] font-displayPlayFair leading-tight">
                Reservation Details
              </h3>
              <p className="text-xs text-[#8B6E4E] font-mono mt-0.5">
                Ref: #{bookingRef}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#94A3B8] hover:text-[#1d1a17] hover:bg-[#E8E2DC]/50 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {loading && !currentData ? (
            <div className="py-12 flex flex-col items-center justify-center text-[#94A3B8]">
              <div className="w-8 h-8 border-3 border-[#CFB9A3] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm">Loading reservation details...</p>
            </div>
          ) : (
            <>
              {/* Service & Status Banner */}
              <div className="bg-[#FAF7F4] rounded-2xl p-4 border border-[#E8E2DC] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold tracking-wider text-[#8B6E4E] uppercase">
                    Service
                  </span>
                  <h4 className="text-base font-bold text-[#1d1a17] capitalize">
                    {serviceName}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 capitalize border border-emerald-200">
                    <HiOutlineCheckCircle className="w-3.5 h-3.5" />
                    {status}
                  </span>
                </div>
              </div>

              {/* Core Booking Metrics Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#FDFBF7] p-3 rounded-xl border border-[#F1EDE8] text-center">
                  <HiOutlineCalendar className="w-4 h-4 mx-auto text-[#8B6E4E] mb-1" />
                  <p className="text-[10px] text-[#94A3B8] uppercase">Date</p>
                  <p className="text-xs font-semibold text-[#1d1a17] mt-0.5">
                    {formatDate(currentData?.date)}
                  </p>
                </div>

                <div className="bg-[#FDFBF7] p-3 rounded-xl border border-[#F1EDE8] text-center">
                  <HiOutlineClock className="w-4 h-4 mx-auto text-[#8B6E4E] mb-1" />
                  <p className="text-[10px] text-[#94A3B8] uppercase">Time</p>
                  <p className="text-xs font-semibold text-[#1d1a17] mt-0.5">
                    {formatTime(currentData?.time)}
                  </p>
                </div>

                <div className="bg-[#FDFBF7] p-3 rounded-xl border border-[#F1EDE8] text-center">
                  <HiOutlineUsers className="w-4 h-4 mx-auto text-[#8B6E4E] mb-1" />
                  <p className="text-[10px] text-[#94A3B8] uppercase">Capacity</p>
                  <p className="text-xs font-semibold text-[#1d1a17] mt-0.5">
                    {currentData?.guests || currentData?.capacity || 1}{" "}
                    {(currentData?.guests || currentData?.capacity) === 1 ? "Person" : "Persons"}
                  </p>
                </div>
              </div>

              {/* Guest Information */}
              {(currentData?.name || currentData?.email || currentData?.phone) && (
                <div className="border-t border-[#F1EDE8] pt-4">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-3">
                    Guest Information
                  </h5>
                  <div className="space-y-2 text-xs">
                    {currentData.name && (
                      <div className="flex items-center gap-2 text-[#475569]">
                        <HiOutlineUser className="w-4 h-4 text-[#8B6E4E] flex-shrink-0" />
                        <span className="font-medium text-[#1d1a17]">{currentData.name}</span>
                      </div>
                    )}
                    {currentData.email && (
                      <div className="flex items-center gap-2 text-[#475569]">
                        <HiOutlineMail className="w-4 h-4 text-[#8B6E4E] flex-shrink-0" />
                        <span>{currentData.email}</span>
                      </div>
                    )}
                    {currentData.phone && (
                      <div className="flex items-center gap-2 text-[#475569]">
                        <HiOutlinePhone className="w-4 h-4 text-[#8B6E4E] flex-shrink-0" />
                        <span>{currentData.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Access Code (if present) */}
              {currentData?.access_code && (
                <div className="bg-[#FAF7F4] p-3 rounded-xl border border-[#E8E2DC] flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#64748B]">Access Code:</span>
                  <span className="font-mono font-bold text-[#8B6E4E] tracking-widest text-sm bg-white px-3 py-1 rounded-lg border border-[#E8E2DC]">
                    {currentData.access_code}
                  </span>
                </div>
              )}

              {/* Payment Details */}
              <div className="border-t border-[#F1EDE8] pt-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-3">
                  Payment Details
                </h5>
                <div className="flex items-center justify-between bg-[#FDFBF7] p-3 rounded-xl border border-[#F1EDE8] text-xs">
                  <div className="flex items-center gap-2">
                    <HiOutlineCurrencyEuro className="w-4 h-4 text-[#8B6E4E]" />
                    <span className="text-[#64748B]">Status:</span>
                    <span className="font-semibold text-[#1d1a17] capitalize">
                      {paymentStatus.replace(/_/g, " ")}
                    </span>
                  </div>
                  {currentData?.total_price && Number(currentData.total_price) > 0 && (
                    <span className="font-bold text-[#8B6E4E] text-sm">
                      €{Number(currentData.total_price).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Special Request or Celebration Details if lunchroom */}
              {(currentData?.special_request || currentData?.celebration_type || currentData?.name_of_celebrant) && (
                <div className="border-t border-[#F1EDE8] pt-4">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2">
                    Additional Notes
                  </h5>
                  {currentData.celebration_type && (
                    <p className="text-xs text-[#64748B] mb-1">
                      <span className="font-semibold text-[#1d1a17]">Celebration:</span>{" "}
                      {currentData.celebration_type}
                      {currentData.name_of_celebrant ? ` for ${currentData.name_of_celebrant}` : ""}
                    </p>
                  )}
                  {currentData.special_request && (
                    <p className="text-xs text-[#64748B] italic bg-[#FAF7F4] p-3 rounded-xl border border-[#F1EDE8]">
                      &quot;{currentData.special_request}&quot;
                    </p>
                  )}
                </div>
              )}

              {error && (
                <p className="text-xs text-amber-600 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  {error}
                </p>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#F1EDE8] bg-[#FAF7F4] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#CFB9A3] hover:bg-[#bfa77f] text-white text-xs font-semibold rounded-full transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
