"use client";

import { useEffect, useState, useTransition, useCallback } from "react";
import {
  bookingService,
  AdminBookingItem,
  AdminBookingsQueryParams,
} from "@/lib/api/services/bookingService";
import {
  HiOutlineSearch,
  HiOutlineRefresh,
  HiOutlineEye,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineCurrencyEuro,
  HiOutlineX,
  HiOutlineCheck,
  HiOutlineSparkles,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineChevronDown,
  HiOutlinePencil,
  HiOutlineInformationCircle,
  HiOutlinePlus,
} from "react-icons/hi";
import {
  MdSpa,
  MdRestaurant,
  MdFitnessCenter,
  MdCardMembership,
  MdCelebration,
} from "react-icons/md";
import { FaWater } from "react-icons/fa";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { adminTranslations } from "@/lib/i18n/dashboardTranslations";

const SERVICE_TYPE_OPTIONS = [
  { value: "all", label: "All Services" },
  { value: "sauna", label: "Sauna (All)" },
  { value: "private_sauna", label: "VIP Sauna" },
  { value: "shared_sauna", label: "Sauna" },
  { value: "lunchroom", label: "Lunchroom" },
  { value: "activity", label: "Activity" },
  { value: "saltroom", label: "Salt Room" },
  { value: "package", label: "Package Experience" },
  { value: "event", label: "Special Event" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "confirmed", label: "Confirmed" },
  { value: "pending", label: "Pending" },
  { value: "cancelled", label: "Cancelled" },
];

const PAYMENT_OPTIONS = [
  { value: "all", label: "All Payment Statuses" },
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "paid_with_package", label: "Paid with Package" },
];

const ORDERING_OPTIONS = [
  { value: "-created_at", label: "Newest Bookings First" },
  { value: "created_at", label: "Oldest Bookings First" },
  { value: "date", label: "Visit Date (Earliest First)" },
  { value: "-date", label: "Visit Date (Latest First)" },
  { value: "-total_price", label: "Price (High to Low)" },
  { value: "total_price", label: "Price (Low to High)" },
];

export default function AdminBookingsPage() {
  const { language } = useLanguage();
  const at = adminTranslations[language]?.reservations || adminTranslations.en.reservations;
  // Data State
  const [bookings, setBookings] = useState<AdminBookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedService, setSelectedService] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedOrdering, setSelectedOrdering] = useState("-created_at");

  // Detail Modal State
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<AdminBookingItem | null>(null);
  const [editingStatus, setEditingStatus] = useState<string>("confirmed");
  const [editingPaymentStatus, setEditingPaymentStatus] = useState<string>("paid");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [modalSuccessMsg, setModalSuccessMsg] = useState<string | null>(null);
  const [modalErrorMsg, setModalErrorMsg] = useState<string | null>(null);

  // Global Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Bookings from API
  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: AdminBookingsQueryParams = {
        page: currentPage,
        page_size: pageSize,
        ordering: selectedOrdering,
      };

      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }
      if (selectedService !== "all") {
        params.service_type = selectedService;
      }
      if (selectedStatus !== "all") {
        params.status = selectedStatus;
      }
      if (selectedPayment !== "all") {
        params.payment_status = selectedPayment;
      }
      if (selectedDate) {
        params.date = selectedDate;
      }

      const res = await bookingService.getAdminBookings(params);
      if (res && res.success) {
        const list = res.results || res.data || [];
        setBookings(list);
        setTotalCount(res.count ?? list.length);
        setTotalPages(res.total_pages ?? 1);
      } else {
        setBookings([]);
        setTotalCount(0);
        setTotalPages(1);
      }
    } catch (err: any) {
      console.error("Failed to load admin bookings:", err);
      setError(err?.message || "Failed to load bookings from server.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    pageSize,
    debouncedSearch,
    selectedService,
    selectedStatus,
    selectedPayment,
    selectedDate,
    selectedOrdering,
  ]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  // Open Detail Modal
  const handleOpenDetail = (booking: AdminBookingItem) => {
    setSelectedBooking(booking);
    setEditingStatus(booking.status || "confirmed");
    setEditingPaymentStatus(booking.payment_status || "paid");
    setModalSuccessMsg(null);
    setModalErrorMsg(null);
    setDetailModalOpen(true);
  };

  // Update Booking Status / Payment
  const handleSaveStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    setIsUpdatingStatus(true);
    setModalSuccessMsg(null);
    setModalErrorMsg(null);

    try {
      const res = await bookingService.updateAdminBookingStatus(selectedBooking.booking_id, {
        status: editingStatus,
        payment_status: editingPaymentStatus,
      });

      if (res && res.success) {
        const updated = res.data || {
          ...selectedBooking,
          status: editingStatus,
          payment_status: editingPaymentStatus,
        };
        setSelectedBooking(updated);

        // Update in table list
        setBookings((prev) =>
          prev.map((b) => (b.booking_id === updated.booking_id ? { ...b, ...updated } : b))
        );

        setModalSuccessMsg(`Booking ${updated.booking_id} updated successfully!`);
        showToast(`Booking ${updated.booking_id} updated!`);
        setTimeout(() => setModalSuccessMsg(null), 3000);
      }
    } catch (err: any) {
      console.error("Status update error:", err);
      setModalErrorMsg(err?.message || "Failed to update booking status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setSelectedService("all");
    setSelectedStatus("all");
    setSelectedPayment("all");
    setSelectedDate("");
    setSelectedOrdering("-created_at");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedService !== "all" ||
    selectedStatus !== "all" ||
    selectedPayment !== "all" ||
    Boolean(selectedDate) ||
    selectedOrdering !== "-created_at";

  // Service Type Icon Helper
  const getServiceIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "sauna":
        return <MdSpa className="w-4 h-4 text-[#8B7355]" />;
      case "lunchroom":
        return <MdRestaurant className="w-4 h-4 text-amber-600" />;
      case "activity":
        return <MdFitnessCenter className="w-4 h-4 text-emerald-600" />;
      case "saltroom":
        return <FaWater className="w-3.5 h-3.5 text-cyan-600" />;
      case "package":
        return <MdCardMembership className="w-4 h-4 text-purple-600" />;
      case "event":
        return <MdCelebration className="w-4 h-4 text-rose-600" />;
      default:
        return <HiOutlineSparkles className="w-4 h-4 text-[#8B7355]" />;
    }
  };

  // Status Badge Styling Helper
  const getStatusBadge = (status: string) => {
    const s = (status || "pending").toLowerCase();
    if (s === "confirmed") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Confirmed
        </span>
      );
    }
    if (s === "cancelled") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Cancelled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Pending
      </span>
    );
  };

  // Payment Badge Styling Helper
  const getPaymentBadge = (payment: string) => {
    const p = (payment || "pending").toLowerCase();
    if (p === "paid") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
          Paid
        </span>
      );
    }
    if (p === "paid_with_package") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
          Package Pass
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
        Pending
      </span>
    );
  };

  return (
    <div className="space-y-6 p-2 sm:p-4">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8E2DC]">
        <div>
          <h1 className="font-displayPlayFair text-2xl sm:text-3xl font-bold text-[#1d1a17]">
            {at.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
            {at.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadBookings()}
            disabled={loading}
            className="px-3.5 py-2 bg-white hover:bg-[#FAF8F5] text-[#1d1a17] text-xs font-semibold rounded-xl border border-[#E8E2DC] transition-all shadow-2xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
            title="Refresh bookings"
          >
            <HiOutlineRefresh className={`w-4 h-4 ${loading ? "animate-spin text-[#8B7355]" : "text-[#475569]"}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* ── SEARCH & FILTER CONTROLS ── */}
      <div className="bg-white rounded-2xl border border-[#E8E2DC] p-4 shadow-2xs space-y-3">
        {/* Row 1: Search Bar + Service Filter */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Universal Search Input */}
          <div className="md:col-span-6 relative">
            <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input
              type="text"
              placeholder={at.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 text-xs text-[#0f172a] font-medium border border-[#CBD5E1] rounded-xl focus:outline-hidden focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] bg-white placeholder-[#94A3B8]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <HiOutlineX className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Service Type Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedService}
              onChange={(e) => {
                setSelectedService(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 text-xs font-semibold text-[#0f172a] border border-[#CBD5E1] rounded-xl bg-white focus:outline-hidden focus:border-[#8B7355] cursor-pointer"
            >
              {SERVICE_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 text-xs font-semibold text-[#0f172a] border border-[#CBD5E1] rounded-xl bg-white focus:outline-hidden focus:border-[#8B7355] cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Payment, Date, Ordering & Reset */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 pt-2 border-t border-[#F1EDE8]">
          {/* Payment Status Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedPayment}
              onChange={(e) => {
                setSelectedPayment(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs font-medium text-[#1e293b] border border-[#CBD5E1] rounded-xl bg-white focus:outline-hidden focus:border-[#8B7355] cursor-pointer"
            >
              {PAYMENT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker Filter */}
          <div className="md:col-span-3 relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs font-medium text-[#1e293b] border border-[#CBD5E1] rounded-xl bg-white focus:outline-hidden focus:border-[#8B7355] cursor-pointer"
              title="Filter by specific visit date"
            />
          </div>

          {/* Ordering / Sort */}
          <div className="md:col-span-4">
            <select
              value={selectedOrdering}
              onChange={(e) => {
                setSelectedOrdering(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs font-medium text-[#1e293b] border border-[#CBD5E1] rounded-xl bg-white focus:outline-hidden focus:border-[#8B7355] cursor-pointer"
            >
              {ORDERING_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Sort: {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters Button */}
          <div className="md:col-span-2 flex items-center justify-end">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="w-full py-2 px-3 text-xs font-bold text-[#8B7355] hover:text-[#705b41] hover:bg-[#FAF8F5] rounded-xl border border-[#E8E2DC] transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <HiOutlineX className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── ERROR ALERT ── */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <HiOutlineInformationCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── BOOKINGS TABLE (NO SELECTION CHECKBOXES) ── */}
      <div className="bg-white rounded-2xl border border-[#E8E2DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            {/* High-contrast table headers */}
            <thead className="bg-[#FAF7F4] border-b border-[#E8E2DC]">
              <tr>
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#334155] uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#334155] uppercase tracking-wider">
                  Client Details
                </th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#334155] uppercase tracking-wider">
                  Service
                </th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#334155] uppercase tracking-wider">
                  Visit Date & Time
                </th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-[#334155] uppercase tracking-wider text-center">
                  Guests
                </th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#334155] uppercase tracking-wider">
                  Total (€)
                </th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#334155] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#334155] uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#334155] uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F1EDE8]">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center">
                    <div className="inline-flex items-center gap-3 text-xs font-semibold text-[#8B7355]">
                      <div className="w-5 h-5 border-2 border-[#8B7355] border-t-transparent rounded-full animate-spin" />
                      <span>Loading bookings...</span>
                    </div>
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center">
                    <div className="max-w-sm mx-auto space-y-2">
                      <div className="w-10 h-10 rounded-full bg-[#FAF8F5] text-[#8B7355] flex items-center justify-center mx-auto text-lg border border-[#E8E2DC]">
                        📅
                      </div>
                      <p className="text-sm font-bold text-[#1d1a17]">No Bookings Found</p>
                      <p className="text-xs text-[#64748B]">
                        {hasActiveFilters
                          ? "No bookings match the selected search or filter criteria. Try resetting filters."
                          : "There are currently no reservations recorded in the system."}
                      </p>
                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="mt-2 text-xs font-semibold text-[#8B7355] hover:underline cursor-pointer"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr
                    key={b.booking_id || b.id}
                    className="hover:bg-[#FAF8F5]/80 transition-colors group cursor-pointer"
                    onClick={() => handleOpenDetail(b)}
                  >
                    {/* Booking ID */}
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-[#1d1a17] whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E8E2DC] group-hover:border-[#8B7355] transition-colors">
                        {b.booking_id}
                      </span>
                    </td>

                    {/* Client Details */}
                    <td className="px-5 py-3.5">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-[#0f172a] flex items-center gap-1.5">
                          {b.client_name || "Guest User"}
                        </p>
                        <p className="text-[11px] font-medium text-[#475569]">{b.client_email || "No email"}</p>
                        {b.client_phone && (
                          <p className="text-[10px] text-[#64748B]">{b.client_phone}</p>
                        )}
                      </div>
                    </td>

                    {/* Service Type & Name */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-[#FAF8F5] border border-[#E8E2DC] shrink-0">
                          {getServiceIcon(b.service_type)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#1d1a17]">{b.service_name || "Service"}</p>
                          <span className="text-[10px] uppercase font-semibold text-[#8B7355]">
                            {b.service_type}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Visit Date & Time */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-[#1e293b] flex items-center gap-1.5">
                          <HiOutlineCalendar className="w-3.5 h-3.5 text-[#8B7355]" />
                          {b.date || "Date TBA"}
                        </p>
                        <p className="text-[11px] font-medium text-[#475569] flex items-center gap-1.5">
                          <HiOutlineClock className="w-3.5 h-3.5 text-[#94A3B8]" />
                          {b.time ? (b.end_time ? `${b.time} - ${b.end_time}` : b.time) : "Flexible Slot"}
                        </p>
                      </div>
                    </td>

                    {/* Guests */}
                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-[#FAF8F5] text-xs font-bold text-[#334155] border border-[#E2E8F0]">
                        {b.guests || 1}
                      </span>
                    </td>

                    {/* Total Price */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="text-xs font-extrabold text-[#0f172a]">
                        €{parseFloat(b.total_price || "0").toFixed(2)}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-5 py-3.5 whitespace-nowrap">{getStatusBadge(b.status)}</td>

                    {/* Payment Badge */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {getPaymentBadge(b.payment_status)}
                    </td>

                    {/* Action buttons */}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(b);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#8B7355] hover:text-white text-[#8B7355] border border-[#E8E2DC] text-[11px] font-bold transition-all flex items-center gap-1 ml-auto cursor-pointer shadow-2xs"
                        title="View Full Booking Details"
                      >
                        <HiOutlineEye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION CONTROLS ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-[#E8E2DC] bg-[#FAF8F5]/40 text-xs">
          {/* Summary */}
          <div className="text-[#475569] font-medium">
            Showing <span className="font-bold text-[#0f172a]">{bookings.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to{" "}
            <span className="font-bold text-[#0f172a]">{Math.min(currentPage * pageSize, totalCount)}</span> of{" "}
            <span className="font-bold text-[#0f172a]">{totalCount}</span> bookings
          </div>

          {/* Page size & Navigation */}
          <div className="flex items-center gap-3">
            {/* Page Size Selector */}
            <div className="flex items-center gap-1.5 text-[#475569]">
              <span className="text-[11px] font-medium">Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 text-xs font-semibold text-[#0f172a] border border-[#CBD5E1] rounded-lg bg-white cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Page navigation buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage <= 1 || loading}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-[#CBD5E1] bg-white text-[#334155] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Previous page"
              >
                <HiOutlineChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-2.5 py-1 text-xs font-bold text-[#0f172a] bg-white border border-[#CBD5E1] rounded-lg">
                {currentPage} / {totalPages || 1}
              </span>

              <button
                type="button"
                disabled={currentPage >= totalPages || loading}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-[#CBD5E1] bg-white text-[#334155] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Next page"
              >
                <HiOutlineChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── SPACIOUS & HIGH-CONTRAST BOOKING DETAIL MODAL ──                 */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {detailModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#E8E2DC] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#F1EDE8] bg-[#FAF8F5]/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white border border-[#E8E2DC] flex items-center justify-center shadow-xs text-xl">
                  {getServiceIcon(selectedBooking.service_type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold font-displayPlayFair text-[#1d1a17]">
                      {selectedBooking.service_name || "Booking Details"}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-md bg-[#1d1a17] text-white font-mono text-xs font-bold">
                      {selectedBooking.booking_id}
                    </span>
                  </div>
                  <p className="text-xs text-[#475569] font-medium mt-0.5">
                    Service Type: <span className="font-semibold text-[#8B7355] uppercase">{selectedBooking.service_type}</span>
                    {selectedBooking.created_at && (
                      <span className="ml-2 text-[#64748B]">
                        • Booked on: {new Date(selectedBooking.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDetailModalOpen(false)}
                  className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <HiOutlineX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Error or Success Banners */}
            {modalSuccessMsg && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 flex items-center gap-2">
                <HiOutlineCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{modalSuccessMsg}</span>
              </div>
            )}
            {modalErrorMsg && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200 flex items-center gap-2">
                <HiOutlineInformationCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{modalErrorMsg}</span>
              </div>
            )}

            {/* Modal Body / Scrollable Content */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {/* Top Quick Status Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#FAF8F5] border border-[#F1EDE8]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#475569]">Booking Status:</span>
                  {getStatusBadge(selectedBooking.status)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#475569]">Payment:</span>
                  {getPaymentBadge(selectedBooking.payment_status)}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0f172a]">
                  <span className="text-[#475569] font-medium">Total:</span>
                  <span className="text-base text-[#8B7355]">€{parseFloat(selectedBooking.total_price || "0").toFixed(2)}</span>
                </div>
              </div>

              {/* SECTION 1: Client Information */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#8B7355] uppercase tracking-wider flex items-center gap-1.5">
                  <HiOutlineUser className="w-4 h-4" />
                  Client Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white border border-[#E8E2DC]">
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">Full Name</label>
                    <p className="text-sm font-bold text-[#0f172a] mt-0.5">
                      {selectedBooking.client_name || "Guest Customer"}
                    </p>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">Email Address</label>
                    <p className="text-sm font-semibold text-[#0f172a] mt-0.5">
                      {selectedBooking.client_email ? (
                        <a
                          href={`mailto:${selectedBooking.client_email}`}
                          className="text-[#8B7355] hover:underline flex items-center gap-1"
                        >
                          <HiOutlineMail className="w-3.5 h-3.5" />
                          {selectedBooking.client_email}
                        </a>
                      ) : (
                        "—"
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">Phone Number</label>
                    <p className="text-sm font-semibold text-[#0f172a] mt-0.5">
                      {selectedBooking.client_phone ? (
                        <a
                          href={`tel:${selectedBooking.client_phone}`}
                          className="text-[#8B7355] hover:underline flex items-center gap-1"
                        >
                          <HiOutlinePhone className="w-3.5 h-3.5" />
                          {selectedBooking.client_phone}
                        </a>
                      ) : (
                        "—"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Reservation Schedule & Guests */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#8B7355] uppercase tracking-wider flex items-center gap-1.5">
                  <HiOutlineCalendar className="w-4 h-4" />
                  Reservation Schedule & Capacity
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white border border-[#E8E2DC]">
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">Visit Date</label>
                    <p className="text-sm font-bold text-[#0f172a] mt-0.5">
                      {selectedBooking.date || "Not set"}
                    </p>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">Start Time</label>
                    <p className="text-sm font-bold text-[#0f172a] mt-0.5">
                      {selectedBooking.time || "Flexible"}
                    </p>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">End Time</label>
                    <p className="text-sm font-bold text-[#0f172a] mt-0.5">
                      {selectedBooking.end_time || "—"}
                    </p>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">Guests Count</label>
                    <p className="text-sm font-bold text-[#0f172a] mt-0.5">
                      {selectedBooking.guests || 1} People
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Service-Specific Breakdown */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#8B7355] uppercase tracking-wider flex items-center gap-1.5">
                  <HiOutlineSparkles className="w-4 h-4" />
                  Service Specific Information
                </h3>
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2DC] space-y-4">
                  {/* SAUNA DETAILS */}
                  {selectedBooking.service_type === "sauna" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-[#64748B]">Sauna Category</label>
                          <p className="text-xs font-bold text-[#0f172a] capitalize">
                            {selectedBooking.details?.sauna_type || "Private"} Sauna
                          </p>
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-[#64748B]">Duration / Time Slot</label>
                          <p className="text-xs font-bold text-[#0f172a]">
                            {selectedBooking.details?.time_slot?.replace("_", " ") || "Standard"}
                          </p>
                        </div>
                      </div>

                      {/* Selected Features */}
                      <div>
                        <label className="text-[11px] font-semibold text-[#64748B] block mb-1.5">
                          Selected Inclusions & Add-ons:
                        </label>
                        {Array.isArray(selectedBooking.details?.selected_features) &&
                        selectedBooking.details?.selected_features.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {selectedBooking.details.selected_features.map((feat: any, idx: number) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 rounded-lg bg-white border border-[#E8E2DC] text-xs font-semibold text-[#1d1a17]"
                              >
                                {typeof feat === "object" ? feat.feature || feat.feature_en || JSON.stringify(feat) : feat}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-[#64748B] italic">No extra add-on features selected.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* LUNCHROOM DETAILS */}
                  {selectedBooking.service_type === "lunchroom" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-[#64748B]">Celebration Type</label>
                          <p className="text-xs font-bold text-[#0f172a]">
                            {selectedBooking.details?.celebration_type || "Standard Table"}
                          </p>
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-[#64748B]">Celebrant Name</label>
                          <p className="text-xs font-bold text-[#0f172a]">
                            {selectedBooking.details?.name_of_celebrant || "—"}
                          </p>
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-[#64748B]">Celebrant Age</label>
                          <p className="text-xs font-bold text-[#0f172a]">
                            {selectedBooking.details?.age_of_celebrant ? `${selectedBooking.details.age_of_celebrant} years` : "—"}
                          </p>
                        </div>
                      </div>

                      {selectedBooking.details?.hobbies && (
                        <div>
                          <label className="text-[11px] font-semibold text-[#64748B]">Hobbies & Interests</label>
                          <p className="text-xs text-[#0f172a] bg-white p-2.5 rounded-xl border border-[#E8E2DC]">
                            {selectedBooking.details.hobbies}
                          </p>
                        </div>
                      )}

                      {selectedBooking.details?.celebration_details && (
                        <div>
                          <label className="text-[11px] font-semibold text-[#64748B]">Celebration Details / Decor Notes</label>
                          <p className="text-xs text-[#0f172a] bg-white p-2.5 rounded-xl border border-[#E8E2DC]">
                            {selectedBooking.details.celebration_details}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ACTIVITY DETAILS */}
                  {selectedBooking.service_type === "activity" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-[#64748B]">Activity Title</label>
                          <p className="text-xs font-bold text-[#0f172a]">
                            {selectedBooking.details?.activity_title || selectedBooking.service_name}
                          </p>
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-[#64748B]">Activity ID</label>
                          <p className="text-xs font-mono font-bold text-[#0f172a]">
                            #{selectedBooking.details?.activity_id || "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SALT ROOM DETAILS */}
                  {selectedBooking.service_type === "saltroom" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-[#64748B]">Pass Used</label>
                          <p className="text-xs font-bold text-[#0f172a]">
                            {selectedBooking.details?.used_pass ? "Yes (Pass Redeemed)" : "No"}
                          </p>
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-[#64748B]">Subscription Used</label>
                          <p className="text-xs font-bold text-[#0f172a]">
                            {selectedBooking.details?.used_subscription ? "Yes (Active Plan)" : "No"}
                          </p>
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-[#64748B]">Payment Recorded</label>
                          <p className="text-xs font-bold text-[#0f172a]">
                            {selectedBooking.details?.is_paid ? "Verified Paid" : "Unpaid / Pending"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PACKAGE DETAILS */}
                  {selectedBooking.service_type === "package" && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-[#0f172a]">
                          {selectedBooking.details?.is_custom ? "Custom Package Experience" : "Standard Curated Package"}
                        </span>
                      </div>

                      {/* Booked Sub-service IDs */}
                      {Array.isArray(selectedBooking.details?.booked_services_ids) &&
                        selectedBooking.details?.booked_services_ids.length > 0 && (
                          <div>
                            <label className="text-[11px] font-semibold text-[#64748B] block mb-1.5">
                              Associated Service Bookings:
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {selectedBooking.details.booked_services_ids.map((sub: any, i: number) => {
                                const [svc, code] = typeof sub === "object" ? Object.entries(sub)[0] || [] : ["Sub", sub];
                                return (
                                  <div
                                    key={i}
                                    className="px-3 py-1.5 rounded-xl bg-white border border-[#E8E2DC] shadow-2xs flex items-center gap-2"
                                  >
                                    <span className="text-[10px] font-bold uppercase text-[#8B7355]">{svc}:</span>
                                    <span className="text-xs font-mono font-bold text-[#1d1a17]">{String(code)}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                    </div>
                  )}

                  {/* EVENT DETAILS */}
                  {selectedBooking.service_type === "event" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-[#64748B]">Food Preference</label>
                        <p className="text-xs font-bold text-[#0f172a]">
                          {selectedBooking.details?.food_preference || "Standard"}
                        </p>
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-[#64748B]">Drink Preference</label>
                        <p className="text-xs font-bold text-[#0f172a]">
                          {selectedBooking.details?.drink_preference || "Standard"}
                        </p>
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-[#64748B]">Music Preference</label>
                        <p className="text-xs font-bold text-[#0f172a]">
                          {selectedBooking.details?.music_preference || "Relaxing / Ambient"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Special Requests or Notes */}
                  {(selectedBooking.special_request || selectedBooking.details?.notes) && (
                    <div className="pt-2 border-t border-[#E8E2DC]">
                      <label className="text-[11px] font-semibold text-[#64748B] block mb-1">
                        Client Special Requests & Notes:
                      </label>
                      <p className="text-xs text-[#0f172a] bg-white p-3 rounded-xl border border-[#E8E2DC] whitespace-pre-wrap">
                        {selectedBooking.special_request || selectedBooking.details?.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 4: Update Booking Status Form */}
              <form onSubmit={handleSaveStatusUpdate} className="space-y-4 pt-4 border-t border-[#F1EDE8]">
                <h3 className="text-xs font-bold text-[#8B7355] uppercase tracking-wider flex items-center gap-1.5">
                  <HiOutlinePencil className="w-4 h-4" />
                  Update Status & Payment Status
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2DC]">
                  {/* Status Selection */}
                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                      Reservation Status
                    </label>
                    <select
                      value={editingStatus}
                      onChange={(e) => setEditingStatus(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold text-[#0f172a] border border-[#CBD5E1] rounded-xl bg-white focus:outline-hidden focus:border-[#8B7355] cursor-pointer"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Payment Status Selection */}
                  <div>
                    <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                      Payment Status
                    </label>
                    <select
                      value={editingPaymentStatus}
                      onChange={(e) => setEditingPaymentStatus(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold text-[#0f172a] border border-[#CBD5E1] rounded-xl bg-white focus:outline-hidden focus:border-[#8B7355] cursor-pointer"
                    >
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="paid_with_package">Paid with Package</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setDetailModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingStatus}
                    className="px-6 py-2.5 rounded-xl bg-[#8B7355] hover:bg-[#705b41] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isUpdatingStatus ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <span>Save Status Update</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Floating Success Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1d1a17] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white/10 animate-in slide-in-from-bottom-3 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <HiOutlineCheck className="w-4 h-4" />
          </div>
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
