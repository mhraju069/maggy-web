"use client";

import { useEffect, useState, useCallback } from "react";
import {
  accessCodesService,
  AdminAccessCodeItem,
  AdminAccessCodesSummary,
  AdminAccessCodesQueryParams,
} from "@/lib/api/services/accessCodesService";
import {
  HiOutlineSearch,
  HiOutlineRefresh,
  HiOutlineEye,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineX,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineSparkles,
  HiOutlineInformationCircle,
  HiOutlineClipboardCopy,
  HiCheck,
} from "react-icons/hi";
import {
  MdVpnKey,
  MdSpa,
  MdCheckCircle,
  MdAccessTime,
} from "react-icons/md";

const SAUNA_TYPE_OPTIONS = [
  { value: "all", label: "All Sauna Types" },
  { value: "private", label: "VIP Sauna" },
  { value: "shared", label: "Sauna" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Booking Statuses" },
  { value: "confirmed", label: "Confirmed" },
  { value: "pending", label: "Pending" },
  { value: "cancelled", label: "Cancelled" },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: "all", label: "All Payment Statuses" },
  { value: "paid", label: "Paid" },
  { value: "paid_with_package", label: "Paid with Package" },
  { value: "pending", label: "Pending" },
];

const ORDERING_OPTIONS = [
  { value: "-booking_date", label: "Upcoming Visit Date (First)" },
  { value: "booking_date", label: "Earliest Visit Date (First)" },
  { value: "-created_at", label: "Newest Created First" },
  { value: "created_at", label: "Oldest Created First" },
  { value: "status", label: "Booking Status" },
];

export default function AdminAccessCodesPage() {
  // Data State
  const [accessCodes, setAccessCodes] = useState<AdminAccessCodeItem[]>([]);
  const [summary, setSummary] = useState<AdminAccessCodesSummary | null>(null);
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
  const [selectedSaunaType, setSelectedSaunaType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");

  // Date Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [exactDate, setExactDate] = useState("");
  const [selectedOrdering, setSelectedOrdering] = useState("-booking_date");

  // Detail Modal & Copy Feedback
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AdminAccessCodeItem | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Access Codes from API
  const loadAccessCodes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: AdminAccessCodesQueryParams = {
        page: currentPage,
        page_size: pageSize,
        ordering: selectedOrdering,
      };

      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }
      if (selectedSaunaType !== "all") {
        params.sauna_type = selectedSaunaType;
      }
      if (selectedStatus !== "all") {
        params.status = selectedStatus;
      }
      if (selectedPaymentStatus !== "all") {
        params.payment_status = selectedPaymentStatus;
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

      const res = await accessCodesService.getAccessCodes(params);
      if (res && res.success) {
        const list = res.results || res.data || [];
        setAccessCodes(list);
        setTotalCount(res.count ?? list.length);
        setTotalPages(res.total_pages ?? 1);
        if (res.summary) {
          setSummary(res.summary);
        }
      } else {
        setAccessCodes([]);
        setTotalCount(0);
        setTotalPages(1);
      }
    } catch (err: any) {
      console.error("Failed to load access codes:", err);
      setError(err?.message || "Failed to load access codes records.");
      setAccessCodes([]);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    pageSize,
    debouncedSearch,
    selectedSaunaType,
    selectedStatus,
    selectedPaymentStatus,
    startDate,
    endDate,
    exactDate,
    selectedOrdering,
  ]);

  useEffect(() => {
    loadAccessCodes();
  }, [loadAccessCodes]);

  const handleOpenDetail = (item: AdminAccessCodeItem) => {
    setSelectedItem(item);
    setDetailModalOpen(true);
  };

  const handleCopyCode = (code: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
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
    setSelectedSaunaType("all");
    setSelectedStatus("all");
    setSelectedPaymentStatus("all");
    setStartDate("");
    setEndDate("");
    setExactDate("");
    setSelectedOrdering("-booking_date");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedSaunaType !== "all" ||
    selectedStatus !== "all" ||
    selectedPaymentStatus !== "all" ||
    Boolean(startDate) ||
    Boolean(endDate) ||
    Boolean(exactDate) ||
    selectedOrdering !== "-booking_date";

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

  return (
    <div className="space-y-6 p-2 sm:p-4">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8E2DC]">
        <div>
          <h1 className="font-displayPlayFair text-2xl sm:text-3xl font-bold text-[#1d1a17]">
            Access Codes
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
            Real-time access credentials, entry codes, and visitor verification for private & shared saunas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadAccessCodes()}
            disabled={loading}
            className="px-3.5 py-2 bg-white hover:bg-[#FAF8F5] text-[#1d1a17] text-xs font-semibold rounded-xl border border-[#E8E2DC] transition-all shadow-2xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
            title="Refresh access codes records"
          >
            <HiOutlineRefresh className={`w-4 h-4 ${loading ? "animate-spin text-[#8B7355]" : "text-[#475569]"}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* ── SUMMARY METRIC CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Access Codes */}
        <div className="bg-gradient-to-br from-[#1d1a17] to-[#2d2722] text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-1 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#CFB9A3] uppercase tracking-wider">
                Total Access Codes
              </span>
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-[#CFB9A3]">
                <MdVpnKey className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl lg:text-3xl font-extrabold tracking-tight pt-1">
              {summary?.total_codes ?? 0}
            </p>
          </div>
          <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/80 relative z-10">
            <span>All Sauna Bookings</span>
            <span className="font-semibold text-[#CFB9A3]">Verified</span>
          </div>
        </div>

        {/* Card 2: VIP Sauna Codes */}
        <div className="bg-white border border-[#E8E2DC] hover:border-[#8B7355]/40 rounded-2xl p-5 shadow-2xs flex flex-col justify-between transition-all">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#8B7355] uppercase tracking-wider flex items-center gap-1.5">
                <MdSpa className="w-4 h-4 text-[#8B7355]" />
                VIP Sauna
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[#8B7355] border border-[#E8E2DC]">
                Exclusive
              </span>
            </div>
            <p className="text-2xl font-bold text-[#1d1a17] pt-1">
              {summary?.private_sauna_codes ?? 0}
            </p>
          </div>
          <div className="pt-2.5 mt-2 border-t border-[#F1EDE8] flex items-center justify-between text-[11px] text-[#64748B]">
            <span>Private Suite Codes</span>
            <span className="font-semibold text-[#8B7355]">Active</span>
          </div>
        </div>

        {/* Card 3: Sauna Codes */}
        <div className="bg-white border border-[#E8E2DC] hover:border-cyan-400/40 rounded-2xl p-5 shadow-2xs flex flex-col justify-between transition-all">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-cyan-700 uppercase tracking-wider flex items-center gap-1.5">
                <MdSpa className="w-4 h-4 text-cyan-600" />
                Sauna
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-700 border border-cyan-200">
                Community
              </span>
            </div>
            <p className="text-2xl font-bold text-[#1d1a17] pt-1">
              {summary?.shared_sauna_codes ?? 0}
            </p>
          </div>
          <div className="pt-2.5 mt-2 border-t border-[#F1EDE8] flex items-center justify-between text-[11px] text-[#64748B]">
            <span>Public Session Codes</span>
            <span className="font-semibold text-cyan-700">Active</span>
          </div>
        </div>

        {/* Card 4: Confirmed Access Codes */}
        <div className="bg-white border border-[#E8E2DC] hover:border-emerald-400/40 rounded-2xl p-5 shadow-2xs flex flex-col justify-between transition-all">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                <MdCheckCircle className="w-4 h-4 text-emerald-600" />
                Confirmed
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                Ready for Entry
              </span>
            </div>
            <p className="text-2xl font-bold text-[#1d1a17] pt-1">
              {summary?.confirmed_codes ?? 0}
            </p>
          </div>
          <div className="pt-2.5 mt-2 border-t border-[#F1EDE8] flex items-center justify-between text-[11px] text-[#64748B]">
            <span>Confirmed Bookings</span>
            <span className="font-semibold text-emerald-700">Valid Entry</span>
          </div>
        </div>
      </div>

      {/* ── SEARCH & FILTER CONTROLS ── */}
      <div className="bg-white rounded-2xl border border-[#E8E2DC] p-4 shadow-2xs space-y-3">
        {/* Row 1: Universal Search, Sauna Type, Booking Status, Payment Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Universal Search Input */}
          <div className="sm:col-span-2 lg:col-span-5 relative">
            <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search Access Code, Booking ID, Name, Email, or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 text-xs text-[#0f172a] font-medium border border-[#CBD5E1] rounded-xl focus:outline-hidden focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] bg-white placeholder-[#94A3B8]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <HiOutlineX className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sauna Type Filter */}
          <div className="lg:col-span-3">
            <select
              value={selectedSaunaType}
              onChange={(e) => {
                setSelectedSaunaType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 text-xs font-semibold text-[#0f172a] border border-[#CBD5E1] rounded-xl bg-white focus:outline-hidden focus:border-[#8B7355] cursor-pointer"
            >
              {SAUNA_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Booking Status Filter */}
          <div className="lg:col-span-2">
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
        </div>

        {/* Row 2: Date Range, Shortcuts, Sort & Reset */}
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
              title="Visit Date starting from"
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
              title="Visit Date up to"
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

      {/* ── ACCESS CODES LEDGER TABLE ── */}
      <div className="bg-white rounded-2xl border border-[#E8E2DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#FAF7F4] border-b border-[#E8E2DC]">
              <tr>
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#334155] uppercase tracking-wider">
                  Access Code
                </th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#334155] uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#334155] uppercase tracking-wider">
                  Sauna Service
                </th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#334155] uppercase tracking-wider">
                  Visit Schedule
                </th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#334155] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#334155] uppercase tracking-wider text-right">
                  Price
                </th>
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#334155] uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F1EDE8]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="inline-flex items-center gap-3 text-xs font-semibold text-[#8B7355]">
                      <div className="w-5 h-5 border-2 border-[#8B7355] border-t-transparent rounded-full animate-spin" />
                      <span>Loading access code records...</span>
                    </div>
                  </td>
                </tr>
              ) : accessCodes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="max-w-sm mx-auto space-y-2">
                      <div className="w-10 h-10 rounded-full bg-[#FAF8F5] text-[#8B7355] flex items-center justify-center mx-auto text-lg border border-[#E8E2DC]">
                        <MdVpnKey className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-bold text-[#1d1a17]">No Access Codes Found</p>
                      <p className="text-xs text-[#64748B]">
                        {hasActiveFilters
                          ? "No sauna bookings match your search or filter settings. Try resetting filters."
                          : "No sauna access codes have been issued yet."}
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
                accessCodes.map((item) => {
                  const isCopied = copiedCode === item.access_code;
                  return (
                    <tr
                      key={item.id || item.access_code}
                      onClick={() => handleOpenDetail(item)}
                      className="hover:bg-[#FAF8F5]/80 transition-colors group cursor-pointer"
                    >
                      {/* Access Code & Booking ID */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-extrabold text-[#1d1a17] px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E8E2DC] group-hover:border-[#8B7355] transition-colors flex items-center gap-1.5 shadow-2xs">
                            <MdVpnKey className="w-3.5 h-3.5 text-[#8B7355]" />
                            {item.access_code}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleCopyCode(item.access_code, e)}
                            className="p-1 rounded-md text-gray-400 hover:text-[#8B7355] hover:bg-white border border-transparent hover:border-[#E8E2DC] transition-all cursor-pointer"
                            title="Copy access code"
                          >
                            {isCopied ? (
                              <HiCheck className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <HiOutlineClipboardCopy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <p className="text-[10px] text-[#64748B] font-mono mt-1 pl-1">
                          Ref: {item.booking_id}
                        </p>
                      </td>

                      {/* Customer Info */}
                      <td className="px-5 py-3.5">
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-[#0f172a]">{item.client_name || "Guest"}</p>
                          <p className="text-[11px] font-medium text-[#475569]">{item.client_email || "No email"}</p>
                          {item.client_phone && (
                            <p className="text-[10px] text-[#64748B]">{item.client_phone}</p>
                          )}
                        </div>
                      </td>

                      {/* Sauna Service */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-[#FAF8F5] border border-[#E8E2DC] shrink-0">
                            <MdSpa className="w-4 h-4 text-[#8B7355]" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#1d1a17]">{item.service_name}</p>
                            <span className="text-[10px] uppercase font-semibold text-[#8B7355]">
                              {item.guests} {item.guests === 1 ? "Guest" : "Guests"} • {item.time_slot ? item.time_slot.replace("_", " ") : "Session"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Visit Schedule */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-[#1e293b] flex items-center gap-1.5">
                            <HiOutlineCalendar className="w-3.5 h-3.5 text-[#8B7355]" />
                            {item.date || "Date TBA"}
                          </p>
                          <p className="text-[11px] font-medium text-[#475569] flex items-center gap-1.5">
                            <HiOutlineClock className="w-3.5 h-3.5 text-[#94A3B8]" />
                            {item.time || "Slot"}
                          </p>
                        </div>
                      </td>

                      {/* Statuses */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex flex-col gap-1 items-start">
                          {getBookingStatusBadge(item.status)}
                          {getPaymentStatusBadge(item.payment_status)}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-right">
                        <span className="text-sm font-extrabold text-[#0f172a]">
                          €{parseFloat(item.total_price || "0").toFixed(2)}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetail(item);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#8B7355] hover:text-white text-[#8B7355] border border-[#E8E2DC] text-[11px] font-bold transition-all flex items-center gap-1 ml-auto cursor-pointer shadow-2xs"
                        >
                          <HiOutlineEye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION BAR ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-[#E8E2DC] bg-[#FAF8F5]/40 text-xs">
          <div className="text-[#475569] font-medium">
            Showing{" "}
            <span className="font-bold text-[#0f172a]">
              {accessCodes.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </span>{" "}
            to{" "}
            <span className="font-bold text-[#0f172a]">
              {Math.min(currentPage * pageSize, totalCount)}
            </span>{" "}
            of <span className="font-bold text-[#0f172a]">{totalCount}</span> access codes
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
                <option value={100}>100</option>
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
                {currentPage} / {totalPages}
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
      {/* ── ACCESS CODE DETAIL MODAL ──                                      */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {detailModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E8E2DC] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#F1EDE8] bg-[#FAF8F5]/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white border border-[#E8E2DC] flex items-center justify-center shadow-xs text-xl text-[#8B7355]">
                  <MdVpnKey className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold font-displayPlayFair text-[#1d1a17]">
                    Access Code Credentials
                  </h2>
                  <p className="text-xs text-[#475569] font-mono mt-0.5">
                    Code: <span className="font-bold text-[#8B7355]">{selectedItem.access_code}</span>
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

            {/* Modal Content */}
            <div className="flex-grow overflow-y-auto p-6 space-y-5">
              {/* Access Key Big Banner */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[#FAF8F5] to-[#F5EFE9] border border-[#E8E2DC]">
                <div>
                  <span className="text-[11px] font-semibold text-[#64748B] block">Assigned Entry Access Code</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-2xl font-black text-[#1d1a17] tracking-wider">
                      {selectedItem.access_code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(selectedItem.access_code)}
                      className="px-2 py-1 rounded-lg bg-white border border-[#CBD5E1] text-xs font-semibold text-[#8B7355] hover:bg-[#8B7355] hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCode === selectedItem.access_code ? (
                        <>
                          <HiCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <HiOutlineClipboardCopy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <span className="text-[11px] font-semibold text-[#64748B] block">Booking Status</span>
                  {getBookingStatusBadge(selectedItem.status)}
                </div>
              </div>

              {/* Client Information */}
              <div className="space-y-2 p-4 rounded-2xl bg-white border border-[#E8E2DC]">
                <h3 className="text-xs font-bold text-[#8B7355] uppercase tracking-wider flex items-center gap-1.5">
                  <HiOutlineUser className="w-4 h-4" />
                  Client Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">Name</label>
                    <p className="font-bold text-[#0f172a] mt-0.5">{selectedItem.client_name || "Guest"}</p>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">Email</label>
                    <p className="font-medium text-[#0f172a] mt-0.5 truncate">{selectedItem.client_email || "—"}</p>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">Phone</label>
                    <p className="font-medium text-[#0f172a] mt-0.5">{selectedItem.client_phone || "—"}</p>
                  </div>
                </div>
              </div>

              {/* Service & Visit Schedule */}
              <div className="space-y-2 p-4 rounded-2xl bg-white border border-[#E8E2DC]">
                <h3 className="text-xs font-bold text-[#8B7355] uppercase tracking-wider flex items-center gap-1.5">
                  <HiOutlineCalendar className="w-4 h-4" />
                  Sauna & Visit Schedule
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">Service</label>
                    <p className="font-bold text-[#0f172a] mt-0.5">{selectedItem.service_name}</p>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">Sauna Type</label>
                    <p className="font-medium text-[#0f172a] mt-0.5 capitalize">{selectedItem.sauna_type}</p>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">Visit Date</label>
                    <p className="font-bold text-[#0f172a] mt-0.5">{selectedItem.date || "—"}</p>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">Entry Time</label>
                    <p className="font-medium text-[#0f172a] mt-0.5">{selectedItem.time || "—"}</p>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">Duration / Slot</label>
                    <p className="font-medium text-[#0f172a] mt-0.5">
                      {selectedItem.time_slot ? selectedItem.time_slot.replace("_", " ") : "—"}
                    </p>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B]">Guests</label>
                    <p className="font-medium text-[#0f172a] mt-0.5">{selectedItem.guests} Person(s)</p>
                  </div>
                </div>
              </div>

              {/* Features & Payment Details */}
              <div className="space-y-2 p-4 rounded-2xl bg-white border border-[#E8E2DC]">
                <h3 className="text-xs font-bold text-[#8B7355] uppercase tracking-wider flex items-center gap-1.5">
                  <HiOutlineSparkles className="w-4 h-4" />
                  Included Amenities & Payment
                </h3>
                <div className="space-y-2 pt-1 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-[#64748B] block mb-1">
                      Selected Features
                    </label>
                    {selectedItem.selected_features && selectedItem.selected_features.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {selectedItem.selected_features.map((f, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-0.5 rounded-lg bg-[#FAF8F5] text-[#8B7355] border border-[#E8E2DC] text-[11px] font-semibold"
                          >
                            ✓ {f}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[#64748B] text-xs">Standard amenities</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#F1EDE8]">
                    <div>
                      <label className="text-[11px] font-semibold text-[#64748B]">Payment Status</label>
                      <div className="mt-1">{getPaymentStatusBadge(selectedItem.payment_status)}</div>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#64748B]">Total Price</label>
                      <p className="font-extrabold text-[#0f172a] text-base mt-0.5">
                        €{parseFloat(selectedItem.total_price || "0").toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {selectedItem.special_request && (
                    <div className="pt-2 border-t border-[#F1EDE8]">
                      <label className="text-[11px] font-semibold text-[#64748B]">Special Request</label>
                      <p className="text-xs text-[#334155] mt-0.5 bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E8E2DC]">
                        {selectedItem.special_request}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
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
