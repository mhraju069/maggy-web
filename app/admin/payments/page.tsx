"use client";

import { useEffect, useState, useCallback } from "react";
import {
  paymentsService,
  AdminPaymentItem,
  MonthlyPaymentsSummary,
  AdminPaymentsQueryParams,
} from "@/lib/api/services/paymentsService";
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
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineCreditCard,
  HiOutlineSparkles,
  HiOutlineInformationCircle,
} from "react-icons/hi";
import {
  MdSpa,
  MdFitnessCenter,
  MdCardMembership,
  MdTrendingUp,
} from "react-icons/md";
import { FaWater } from "react-icons/fa";

const SERVICE_OPTIONS = [
  { value: "all", label: "All Paid Services" },
  { value: "sauna", label: "Sauna (All)" },
  { value: "private_sauna", label: "VIP Sauna" },
  { value: "shared_sauna", label: "Sauna" },
  { value: "saltroom", label: "Salt Room" },
  { value: "activity", label: "Activity" },
  { value: "package", label: "Package Experience" },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: "all", label: "All Payment Statuses" },
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "paid_with_package", label: "Paid with Package" },
];

const BOOKING_STATUS_OPTIONS = [
  { value: "all", label: "All Booking Statuses" },
  { value: "confirmed", label: "Confirmed" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const ORDERING_OPTIONS = [
  { value: "-created_at", label: "Newest Payments First" },
  { value: "created_at", label: "Oldest Payments First" },
  { value: "-amount", label: "Highest Amount (€) First" },
  { value: "amount", label: "Lowest Amount (€) First" },
  { value: "-date", label: "Visit Date (Latest First)" },
  { value: "date", label: "Visit Date (Earliest First)" },
];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function AdminPaymentsPage() {
  const now = new Date();
  const currentMonthNum = now.getMonth() + 1;
  const currentYearNum = now.getFullYear();

  // Data State
  const [payments, setPayments] = useState<AdminPaymentItem[]>([]);
  const [monthlySummary, setMonthlySummary] = useState<MonthlyPaymentsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Month & Year Filter States (controls summary metrics & payments)
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonthNum);
  const [selectedYear, setSelectedYear] = useState<number>(currentYearNum);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedService, setSelectedService] = useState("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");
  const [selectedBookingStatus, setSelectedBookingStatus] = useState("all");

  // Date Filters: Range (start_date, end_date) and Exact Date (date)
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [exactDate, setExactDate] = useState("");
  const [selectedOrdering, setSelectedOrdering] = useState("-created_at");

  // Detail Modal State
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<AdminPaymentItem | null>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Payments from API
  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: AdminPaymentsQueryParams = {
        month: selectedMonth,
        year: selectedYear,
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
      if (selectedPaymentStatus !== "all") {
        params.payment_status = selectedPaymentStatus;
      }
      if (selectedBookingStatus !== "all") {
        params.booking_status = selectedBookingStatus;
      }
      if (startDate) {
        params.start_date = startDate;
      }
      if (endDate) {
        params.end_date = endDate;
      }
      if (exactDate) {
        params.date = exactDate;
      }

      const res = await paymentsService.getAdminPayments(params);
      if (res && res.success) {
        const list = res.results || res.data || [];
        setPayments(list);
        setTotalCount(res.count ?? list.length);
        setTotalPages(res.total_pages ?? 1);
        if (res.monthly_summary) {
          setMonthlySummary(res.monthly_summary);
        }
      } else {
        setPayments([]);
        setTotalCount(0);
        setTotalPages(1);
      }
    } catch (err: any) {
      console.error("Failed to load admin payments:", err);
      setError(err?.message || "Failed to load payment records.");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    pageSize,
    selectedMonth,
    selectedYear,
    debouncedSearch,
    selectedService,
    selectedPaymentStatus,
    selectedBookingStatus,
    startDate,
    endDate,
    exactDate,
    selectedOrdering,
  ]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const handleOpenDetail = (payment: AdminPaymentItem) => {
    setSelectedPayment(payment);
    setDetailModalOpen(true);
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
    setCurrentPage(1);
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
    setCurrentPage(1);
  };

  const handleCurrentMonth = () => {
    setSelectedMonth(currentMonthNum);
    setSelectedYear(currentYearNum);
    setCurrentPage(1);
  };

  const handleSetToday = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    setStartDate(todayStr);
    setEndDate(todayStr);
    setExactDate(todayStr);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setSelectedService("all");
    setSelectedPaymentStatus("all");
    setSelectedBookingStatus("all");
    setStartDate("");
    setEndDate("");
    setExactDate("");
    setSelectedOrdering("-created_at");
    setSelectedMonth(currentMonthNum);
    setSelectedYear(currentYearNum);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedService !== "all" ||
    selectedPaymentStatus !== "all" ||
    selectedBookingStatus !== "all" ||
    Boolean(startDate) ||
    Boolean(endDate) ||
    Boolean(exactDate) ||
    selectedOrdering !== "-created_at" ||
    selectedMonth !== currentMonthNum ||
    selectedYear !== currentYearNum;

  // Service Breakdown Helpers from monthly_summary
  const saunaBreakdown = monthlySummary?.services?.find((s) => s.service_type === "sauna") || {
    revenue: "0.00",
    transactions_count: 0,
  };
  const privSaunaBreakdown = monthlySummary?.services?.find((s) => s.service_type === "private_sauna");
  const sharedSaunaBreakdown = monthlySummary?.services?.find((s) => s.service_type === "shared_sauna");

  const saltroomBreakdown = monthlySummary?.services?.find((s) => s.service_type === "saltroom") || {
    revenue: "0.00",
    transactions_count: 0,
  };
  const activityBreakdown = monthlySummary?.services?.find((s) => s.service_type === "activity") || {
    revenue: "0.00",
    transactions_count: 0,
  };
  const packageBreakdown = monthlySummary?.services?.find((s) => s.service_type === "package") || {
    revenue: "0.00",
    transactions_count: 0,
  };

  // Helper for Payment Status Badge
  const getPaymentStatusBadge = (status: string) => {
    const s = (status || "pending").toLowerCase();
    if (s === "paid") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Paid
        </span>
      );
    }
    if (s === "paid_with_package") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          Package Pass
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

  // Helper for Booking Status Badge
  const getBookingStatusBadge = (status: string) => {
    const s = (status || "pending").toLowerCase();
    if (s === "confirmed") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Confirmed
        </span>
      );
    }
    if (s === "completed") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Completed
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

  // Helper for Service Icon
  const getServiceIcon = (type: string) => {
    const t = (type || "").toLowerCase();
    if (t.includes("sauna")) return <MdSpa className="w-4 h-4 text-[#8B7355]" />;
    if (t.includes("salt")) return <FaWater className="w-3.5 h-3.5 text-cyan-600" />;
    if (t.includes("act")) return <MdFitnessCenter className="w-4 h-4 text-emerald-600" />;
    if (t.includes("pkg") || t.includes("package")) return <MdCardMembership className="w-4 h-4 text-purple-600" />;
    return <HiOutlineSparkles className="w-4 h-4 text-[#8B7355]" />;
  };

  return (
    <div className="space-y-6 p-2 sm:p-4">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8E2DC]">
        <div>
          <h1 className="font-displayPlayFair text-2xl sm:text-3xl font-bold text-[#1d1a17]">
            Payments & Revenue
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
            Monthly financial performance, service breakdown, and transaction ledger.
          </p>
        </div>
        <div className="flex items-center flex-wrap gap-2">
          {/* Month & Year Navigation for Summary */}
          <div className="flex items-center bg-white rounded-xl border border-[#E8E2DC] shadow-2xs p-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={loading}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-[#FAF8F5] transition-colors cursor-pointer disabled:opacity-40"
              title="Previous month"
            >
              <HiOutlineChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-2.5 py-0.5 text-xs font-bold text-[#1d1a17] min-w-[125px] text-center select-none">
              {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
            </div>
            <button
              type="button"
              onClick={handleNextMonth}
              disabled={loading}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-[#FAF8F5] transition-colors cursor-pointer disabled:opacity-40"
              title="Next month"
            >
              <HiOutlineChevronRight className="w-4 h-4" />
            </button>
          </div>

          {(selectedMonth !== currentMonthNum || selectedYear !== currentYearNum) && (
            <button
              type="button"
              onClick={handleCurrentMonth}
              className="px-2.5 py-2 bg-amber-50 text-amber-800 text-[11px] font-bold rounded-xl border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
            >
              Current Month
            </button>
          )}

          <button
            onClick={() => loadPayments()}
            disabled={loading}
            className="px-3.5 py-2 bg-white hover:bg-[#FAF8F5] text-[#1d1a17] text-xs font-semibold rounded-xl border border-[#E8E2DC] transition-all shadow-2xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
            title="Refresh payment records"
          >
            <HiOutlineRefresh className={`w-4 h-4 ${loading ? "animate-spin text-[#8B7355]" : "text-[#475569]"}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* ── MONTHLY REVENUE & SERVICE BREAKDOWN CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Revenue This Month */}
        <div className="bg-gradient-to-br from-[#1d1a17] to-[#2d2722] text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-1 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#CFB9A3] uppercase tracking-wider">
                Total Revenue
              </span>
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-[#CFB9A3]">
                <MdTrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl lg:text-3xl font-extrabold tracking-tight pt-1">
              €{parseFloat(monthlySummary?.total_revenue || "0").toFixed(2)}
            </p>
          </div>
          <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/80 relative z-10">
            <span>{monthlySummary?.month_name || `${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`}</span>
            <span className="font-semibold text-[#CFB9A3]">
              {monthlySummary?.total_transactions || 0} Paid
            </span>
          </div>
        </div>

        {/* Card 2: Sauna Revenue (Private & Shared) */}
        <div className="bg-white border border-[#E8E2DC] hover:border-[#8B7355]/40 rounded-2xl p-5 shadow-2xs flex flex-col justify-between transition-all">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#8B7355] uppercase tracking-wider flex items-center gap-1.5">
                <MdSpa className="w-4 h-4 text-[#8B7355]" />
                Sauna
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[#8B7355] border border-[#E8E2DC]">
                {saunaBreakdown.transactions_count} Bookings
              </span>
            </div>
            <p className="text-2xl font-bold text-[#1d1a17] pt-1">
              €{parseFloat(saunaBreakdown.revenue || "0").toFixed(2)}
            </p>
          </div>
          <div className="pt-2.5 mt-2 border-t border-[#F1EDE8] flex items-center justify-between text-[11px] text-[#64748B]">
            <span>Private: €{parseFloat(privSaunaBreakdown?.revenue || "0").toFixed(0)}</span>
            <span>Shared: €{parseFloat(sharedSaunaBreakdown?.revenue || "0").toFixed(0)}</span>
          </div>
        </div>

        {/* Card 3: Salt Room Revenue */}
        <div className="bg-white border border-[#E8E2DC] hover:border-cyan-400/40 rounded-2xl p-5 shadow-2xs flex flex-col justify-between transition-all">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-cyan-700 uppercase tracking-wider flex items-center gap-1.5">
                <FaWater className="w-3.5 h-3.5 text-cyan-600" />
                Salt Room
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-700 border border-cyan-200">
                {saltroomBreakdown.transactions_count} Bookings
              </span>
            </div>
            <p className="text-2xl font-bold text-[#1d1a17] pt-1">
              €{parseFloat(saltroomBreakdown.revenue || "0").toFixed(2)}
            </p>
          </div>
          <div className="pt-2.5 mt-2 border-t border-[#F1EDE8] flex items-center justify-between text-[11px] text-[#64748B]">
            <span>Halotherapy Sessions</span>
            <span className="font-semibold text-cyan-700">{monthlySummary?.month_name || "Month"}</span>
          </div>
        </div>

        {/* Card 4: Activity Revenue */}
        <div className="bg-white border border-[#E8E2DC] hover:border-emerald-400/40 rounded-2xl p-5 shadow-2xs flex flex-col justify-between transition-all">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                <MdFitnessCenter className="w-4 h-4 text-emerald-600" />
                Activity
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                {activityBreakdown.transactions_count} Bookings
              </span>
            </div>
            <p className="text-2xl font-bold text-[#1d1a17] pt-1">
              €{parseFloat(activityBreakdown.revenue || "0").toFixed(2)}
            </p>
          </div>
          <div className="pt-2.5 mt-2 border-t border-[#F1EDE8] flex items-center justify-between text-[11px] text-[#64748B]">
            <span>Workshops & Classes</span>
            <span className="font-semibold text-emerald-700">{monthlySummary?.month_name || "Month"}</span>
          </div>
        </div>

        {/* Card 5: Package Revenue */}
        <div className="bg-white border border-[#E8E2DC] hover:border-purple-400/40 rounded-2xl p-5 shadow-2xs flex flex-col justify-between transition-all">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                <MdCardMembership className="w-4 h-4 text-purple-600" />
                Package
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                {packageBreakdown.transactions_count} Bookings
              </span>
            </div>
            <p className="text-2xl font-bold text-[#1d1a17] pt-1">
              €{parseFloat(packageBreakdown.revenue || "0").toFixed(2)}
            </p>
          </div>
          <div className="pt-2.5 mt-2 border-t border-[#F1EDE8] flex items-center justify-between text-[11px] text-[#64748B]">
            <span>Arrangements & Passes</span>
            <span className="font-semibold text-purple-700">{monthlySummary?.month_name || "Month"}</span>
          </div>
        </div>
      </div>

      {/* ── SEARCH & FILTER CONTROLS ── */}
      <div className="bg-white rounded-2xl border border-[#E8E2DC] p-4 shadow-2xs space-y-3">
        {/* Row 1: Universal Search, Service, Payment Status, Booking Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Universal Search Input */}
          <div className="sm:col-span-2 lg:col-span-5 relative">
            <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search Booking ID, Client Name, Email, or Phone..."
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

          {/* Service Filter */}
          <div className="lg:col-span-3">
            <select
              value={selectedService}
              onChange={(e) => {
                setSelectedService(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 text-xs font-semibold text-[#0f172a] border border-[#CBD5E1] rounded-xl bg-white focus:outline-hidden focus:border-[#8B7355] cursor-pointer"
            >
              {SERVICE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Status Filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedPaymentStatus}
              onChange={(e) => {
                setSelectedPaymentStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 text-xs font-semibold text-[#0f172a] border border-[#CBD5E1] rounded-xl bg-white focus:outline-hidden focus:border-[#8B7355] cursor-pointer"
            >
              {PAYMENT_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Booking Status Filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedBookingStatus}
              onChange={(e) => {
                setSelectedBookingStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 text-xs font-semibold text-[#0f172a] border border-[#CBD5E1] rounded-xl bg-white focus:outline-hidden focus:border-[#8B7355] cursor-pointer"
            >
              {BOOKING_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Date Range (start_date, end_date), Sort & Reset */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 pt-2 border-t border-[#F1EDE8] items-center">
          {/* Start Date */}
          <div className="lg:col-span-3 flex items-center gap-2">
            <label className="text-[11px] font-bold text-[#64748B] shrink-0">From:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setExactDate("");
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs font-medium text-[#1e293b] border border-[#CBD5E1] rounded-xl bg-white focus:outline-hidden focus:border-[#8B7355] cursor-pointer"
              title="Start Date (Visit or payment date)"
            />
          </div>

          {/* End Date */}
          <div className="lg:col-span-3 flex items-center gap-2">
            <label className="text-[11px] font-bold text-[#64748B] shrink-0">To:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setExactDate("");
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs font-medium text-[#1e293b] border border-[#CBD5E1] rounded-xl bg-white focus:outline-hidden focus:border-[#8B7355] cursor-pointer"
              title="End Date (Visit or payment date)"
            />
          </div>

          {/* Date Shortcuts: Today & Clear */}
          <div className="lg:col-span-2 flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleSetToday}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                startDate === new Date().toISOString().split("T")[0] &&
                endDate === new Date().toISOString().split("T")[0]
                  ? "bg-[#8B7355] text-white border-[#8B7355]"
                  : "bg-white hover:bg-[#FAF8F5] text-[#334155] border-[#CBD5E1]"
              }`}
            >
              Today
            </button>
            {(startDate || endDate || exactDate) && (
              <button
                type="button"
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  setExactDate("");
                  setCurrentPage(1);
                }}
                className="px-2 py-2 text-[11px] font-semibold text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                title="Clear date filter"
              >
                Clear
              </button>
            )}
          </div>

          {/* Ordering Dropdown */}
          <div className="lg:col-span-3">
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

          {/* Reset Filters */}
          <div className="lg:col-span-1 flex items-center justify-end">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="w-full py-2 px-2 text-xs font-bold text-[#8B7355] hover:text-[#705b41] hover:bg-[#FAF8F5] rounded-xl border border-[#E8E2DC] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                title="Reset all filters to default"
              >
                <HiOutlineX className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── ERROR ALERT ── */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <HiOutlineInformationCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── TRANSACTIONS LEDGER TABLE (NO CHECKBOXES) ── */}
      <div className="bg-white rounded-2xl border border-[#E8E2DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
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
                  Date & Time
                </th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#334155] uppercase tracking-wider">
                  Transaction Ref
                </th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#334155] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#334155] uppercase tracking-wider text-right">
                  Amount (€)
                </th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#334155] uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F1EDE8]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="inline-flex items-center gap-3 text-xs font-semibold text-[#8B7355]">
                      <div className="w-5 h-5 border-2 border-[#8B7355] border-t-transparent rounded-full animate-spin" />
                      <span>Loading payment records...</span>
                    </div>
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="max-w-sm mx-auto space-y-2">
                      <div className="w-10 h-10 rounded-full bg-[#FAF8F5] text-[#8B7355] flex items-center justify-center mx-auto text-lg border border-[#E8E2DC]">
                        💳
                      </div>
                      <p className="text-sm font-bold text-[#1d1a17]">No Payment Records Found</p>
                      <p className="text-xs text-[#64748B]">
                        {hasActiveFilters
                          ? "No transactions match your search or filter settings. Try resetting filters."
                          : "No payments recorded yet for paid services."}
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
                payments.map((p) => (
                  <tr
                    key={p.id || p.booking_id}
                    onClick={() => handleOpenDetail(p)}
                    className="hover:bg-[#FAF8F5]/80 transition-colors group cursor-pointer"
                  >
                    {/* Booking ID */}
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-[#1d1a17] whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E8E2DC] group-hover:border-[#8B7355] transition-colors">
                        {p.booking_id}
                      </span>
                    </td>

                    {/* Client Details */}
                    <td className="px-5 py-3.5">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-[#0f172a]">{p.client_name || "Guest"}</p>
                        <p className="text-[11px] font-medium text-[#475569]">{p.client_email || "No email"}</p>
                      </div>
                    </td>

                    {/* Service */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-[#FAF8F5] border border-[#E8E2DC] shrink-0">
                          {getServiceIcon(p.service_type)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#1d1a17]">{p.service_name}</p>
                          <span className="text-[10px] uppercase font-semibold text-[#8B7355]">
                            {p.service_type}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-[#1e293b] flex items-center gap-1.5">
                          <HiOutlineCalendar className="w-3.5 h-3.5 text-[#8B7355]" />
                          {p.date || "Date TBA"}
                        </p>
                        <p className="text-[11px] font-medium text-[#475569] flex items-center gap-1.5">
                          <HiOutlineClock className="w-3.5 h-3.5 text-[#94A3B8]" />
                          {p.time || "Slot"}
                        </p>
                      </div>
                    </td>

                    {/* Transaction Reference */}
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono text-[11px] text-[#475569]">
                      {p.transaction_id ? (
                        <span className="px-2 py-0.5 rounded bg-gray-50 border border-gray-200">
                          {p.transaction_id.slice(0, 16)}...
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    {/* Status (Payment & Booking) */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex flex-col gap-1 items-start">
                        {getPaymentStatusBadge(p.payment_status)}
                        {getBookingStatusBadge(p.booking_status)}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-3.5 whitespace-nowrap text-right">
                      <span className="text-sm font-extrabold text-[#0f172a]">
                        €{parseFloat(p.amount || "0").toFixed(2)}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(p);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#8B7355] hover:text-white text-[#8B7355] border border-[#E8E2DC] text-[11px] font-bold transition-all flex items-center gap-1 ml-auto cursor-pointer shadow-2xs"
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

        {/* ── PAGINATION BAR ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-[#E8E2DC] bg-[#FAF8F5]/40 text-xs">
          <div className="text-[#475569] font-medium">
            Showing <span className="font-bold text-[#0f172a]">{payments.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to{" "}
            <span className="font-bold text-[#0f172a]">{Math.min(currentPage * pageSize, totalCount)}</span> of{" "}
            <span className="font-bold text-[#0f172a]">{totalCount}</span> transactions
          </div>

          <div className="flex items-center gap-3">
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
      {/* ── PAYMENT DETAIL MODAL ──                                          */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {detailModalOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E8E2DC] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#F1EDE8] bg-[#FAF8F5]/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white border border-[#E8E2DC] flex items-center justify-center shadow-xs text-xl">
                  {getServiceIcon(selectedPayment.service_type)}
                </div>
                <div>
                  <h2 className="text-lg font-bold font-displayPlayFair text-[#1d1a17]">
                    Transaction Details
                  </h2>
                  <p className="text-xs text-[#475569] font-mono mt-0.5">
                    Booking ID: <span className="font-bold text-[#8B7355]">{selectedPayment.booking_id}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto p-6 space-y-5">
              {/* Amount & Status Banner */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF8F5] border border-[#F1EDE8]">
                <div>
                  <span className="text-[11px] font-semibold text-[#64748B]">Total Paid Amount</span>
                  <p className="text-2xl font-extrabold text-[#1d1a17]">
                    €{parseFloat(selectedPayment.amount || "0").toFixed(2)}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <span className="text-[11px] font-semibold text-[#64748B] block">Payment Status</span>
                  {getPaymentStatusBadge(selectedPayment.payment_status)}
                </div>
              </div>

              {/* Transaction IDs */}
              <div className="space-y-2 p-4 rounded-2xl bg-white border border-[#E8E2DC]">
                <h3 className="text-xs font-bold text-[#8B7355] uppercase tracking-wider flex items-center gap-1.5">
                  <HiOutlineCreditCard className="w-4 h-4" />
                  Transaction Identifiers
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">Stripe Payment Ref</label>
                    <p className="font-mono text-[#0f172a] font-medium mt-0.5 break-all">
                      {selectedPayment.transaction_id || "Direct Booking / Onsite"}
                    </p>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">Currency</label>
                    <p className="font-bold text-[#0f172a] mt-0.5">
                      {selectedPayment.currency || "EUR"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Client Info */}
              <div className="space-y-2 p-4 rounded-2xl bg-white border border-[#E8E2DC]">
                <h3 className="text-xs font-bold text-[#8B7355] uppercase tracking-wider flex items-center gap-1.5">
                  <HiOutlineUser className="w-4 h-4" />
                  Client Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">Name</label>
                    <p className="font-bold text-[#0f172a] mt-0.5">{selectedPayment.client_name || "Guest"}</p>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">Email</label>
                    <p className="font-medium text-[#0f172a] mt-0.5 truncate">{selectedPayment.client_email || "—"}</p>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">Phone</label>
                    <p className="font-medium text-[#0f172a] mt-0.5">{selectedPayment.client_phone || "—"}</p>
                  </div>
                </div>
              </div>

              {/* Service & Booking Details */}
              <div className="space-y-2 p-4 rounded-2xl bg-white border border-[#E8E2DC]">
                <h3 className="text-xs font-bold text-[#8B7355] uppercase tracking-wider flex items-center gap-1.5">
                  <HiOutlineCalendar className="w-4 h-4" />
                  Booking & Schedule
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">Service</label>
                    <p className="font-bold text-[#0f172a] mt-0.5">{selectedPayment.service_name}</p>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">Visit Date</label>
                    <p className="font-medium text-[#0f172a] mt-0.5">{selectedPayment.date || "—"}</p>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">Time Slot</label>
                    <p className="font-medium text-[#0f172a] mt-0.5">{selectedPayment.time || "Flexible"}</p>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">Guests</label>
                    <p className="font-medium text-[#0f172a] mt-0.5">{selectedPayment.guests || 1} Person(s)</p>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">Booking Status</label>
                    <p className="font-bold text-[#0f172a] mt-0.5 capitalize">{selectedPayment.booking_status}</p>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">Created At</label>
                    <p className="font-medium text-[#0f172a] mt-0.5">
                      {selectedPayment.created_at ? new Date(selectedPayment.created_at).toLocaleDateString() : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#F1EDE8] bg-[#FAF8F5]/80 flex justify-end">
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#8B7355] hover:bg-[#705b41] text-white text-xs font-bold transition-all cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
