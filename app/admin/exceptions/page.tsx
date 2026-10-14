"use client";

import { useState, useEffect, useCallback } from "react";
import {
  adminDatesService,
  BlockDateItem,
  SpecialOpeningDateItem,
  AdminDatesSummary,
  AdminDatesOverviewParams,
} from "@/lib/api/services/adminDatesService";
import {
  MdClose,
  MdDeleteOutline,
  MdBlock,
  MdCalendarToday,
  MdAccessTime,
  MdSearch,
  MdAdd,
  MdRefresh,
  MdEdit,
} from "react-icons/md";
import {
  HiOutlineSparkles,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineX,
  HiOutlineInformationCircle,
  HiOutlineCheckCircle,
} from "react-icons/hi";

export default function ExceptionsPage() {
  // Main Data States
  const [blockedDates, setBlockedDates] = useState<BlockDateItem[]>([]);
  const [specialOpenings, setSpecialOpenings] = useState<SpecialOpeningDateItem[]>([]);
  const [summary, setSummary] = useState<AdminDatesSummary | null>(null);

  // Loading & Alert States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Search & Filter States
  const [blockedSearch, setBlockedSearch] = useState("");
  const [specialSearch, setSpecialSearch] = useState("");
  const [filterUpcoming, setFilterUpcoming] = useState(false);
  const [filterYear, setFilterYear] = useState<string>("all");
  const [filterMonth, setFilterMonth] = useState<string>("all");

  // Modals: Add / Edit Blocked Date
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [editingBlockedId, setEditingBlockedId] = useState<number | null>(null);
  const [bDate, setBDate] = useState("");
  const [bDescription, setBDescription] = useState("");
  const [bSubmitting, setBSubmitting] = useState(false);
  const [bModalError, setBModalError] = useState<string | null>(null);

  // Modals: Add / Edit Special Opening Date
  const [showSpecialModal, setShowSpecialModal] = useState(false);
  const [editingSpecialId, setEditingSpecialId] = useState<number | null>(null);
  const [sDate, setSDate] = useState("");
  const [sOpenTime, setSOpenTime] = useState("10:00");
  const [sCloseTime, setSCloseTime] = useState("18:00");
  const [sDescription, setSDescription] = useState("");
  const [sSubmitting, setSSubmitting] = useState(false);
  const [sModalError, setSModalError] = useState<string | null>(null);

  // Deletion in progress ID
  const [deletingBlockedId, setDeletingBlockedId] = useState<number | null>(null);
  const [deletingSpecialId, setDeletingSpecialId] = useState<number | null>(null);

  // Auto-dismiss alert messages
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  // Load Overview Data from Backend API
  const loadDatesData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: AdminDatesOverviewParams = {};
      if (filterUpcoming) params.upcoming = true;
      if (filterYear !== "all") params.year = parseInt(filterYear);
      if (filterMonth !== "all") params.month = parseInt(filterMonth);

      const res = await adminDatesService.getOverview(params);
      if (res && res.success) {
        setBlockedDates(res.blocked_dates || []);
        setSpecialOpenings(res.special_opening_dates || []);
        if (res.summary) {
          setSummary(res.summary);
        }
      } else {
        setBlockedDates([]);
        setSpecialOpenings([]);
      }
    } catch (err: any) {
      console.error("Failed to load schedule dates:", err);
      setError(err?.message || "Failed to load schedule exceptions from server.");
    } finally {
      setLoading(false);
    }
  }, [filterUpcoming, filterYear, filterMonth]);

  useEffect(() => {
    loadDatesData();
  }, [loadDatesData]);

  // ───────────────────────────────────────────────────────────────────────────
  // Handlers for Blocked Dates
  // ───────────────────────────────────────────────────────────────────────────
  const openAddBlockedModal = () => {
    setEditingBlockedId(null);
    setBDate("");
    setBDescription("");
    setBModalError(null);
    setShowBlockedModal(true);
  };

  const openEditBlockedModal = (item: BlockDateItem) => {
    setEditingBlockedId(item.id);
    setBDate(item.date);
    setBDescription(item.description);
    setBModalError(null);
    setShowBlockedModal(true);
  };

  const handleSaveBlockedDate = async () => {
    if (!bDate || !bDescription.trim()) {
      setBModalError("Please provide both a date and a description/reason.");
      return;
    }

    try {
      setBSubmitting(true);
      setBModalError(null);

      if (editingBlockedId) {
        // Update
        const res = await adminDatesService.updateBlockedDate(editingBlockedId, {
          date: bDate,
          description: bDescription.trim(),
        });
        if (res && res.success) {
          setSuccessMsg(res.message || "Blocked date updated successfully.");
        }
      } else {
        // Create
        const res = await adminDatesService.addBlockedDate({
          date: bDate,
          description: bDescription.trim(),
        });
        if (res && res.success) {
          setSuccessMsg(res.message || "Date blocked successfully.");
        }
      }

      setShowBlockedModal(false);
      await loadDatesData();
    } catch (err: any) {
      setBModalError(err?.message || "Failed to save blocked date. Please try again.");
    } finally {
      setBSubmitting(false);
    }
  };

  const handleDeleteBlockedDate = async (id: number, dateStr: string) => {
    if (!confirm(`Are you sure you want to unblock / remove ${dateStr}?`)) {
      return;
    }

    try {
      setDeletingBlockedId(id);
      const res = await adminDatesService.deleteBlockedDate(id);
      if (res && res.success) {
        setSuccessMsg(res.message || `Blocked date ${dateStr} deleted successfully.`);
      }
      await loadDatesData();
    } catch (err: any) {
      setError(err?.message || `Failed to delete blocked date.`);
    } finally {
      setDeletingBlockedId(null);
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Handlers for Special Opening Dates
  // ───────────────────────────────────────────────────────────────────────────
  const openAddSpecialModal = () => {
    setEditingSpecialId(null);
    setSDate("");
    setSOpenTime("10:00");
    setSCloseTime("18:00");
    setSDescription("");
    setSModalError(null);
    setShowSpecialModal(true);
  };

  const openEditSpecialModal = (item: SpecialOpeningDateItem) => {
    setEditingSpecialId(item.id);
    setSDate(item.date);
    setSOpenTime(item.open_time || "10:00");
    setSCloseTime(item.close_time || "18:00");
    setSDescription(item.description);
    setSModalError(null);
    setShowSpecialModal(true);
  };

  const handleSaveSpecialOpening = async () => {
    if (!sDate || !sOpenTime || !sCloseTime || !sDescription.trim()) {
      setSModalError("Please provide date, opening time, closing time, and occasion description.");
      return;
    }

    if (sOpenTime >= sCloseTime) {
      setSModalError(`Closing time (${sCloseTime}) must be after opening time (${sOpenTime}).`);
      return;
    }

    try {
      setSSubmitting(true);
      setSModalError(null);

      if (editingSpecialId) {
        // Update
        const res = await adminDatesService.updateSpecialOpeningDate(editingSpecialId, {
          date: sDate,
          open_time: sOpenTime,
          close_time: sCloseTime,
          description: sDescription.trim(),
        });
        if (res && res.success) {
          setSuccessMsg(res.message || "Special opening date updated successfully.");
        }
      } else {
        // Create
        const res = await adminDatesService.addSpecialOpeningDate({
          date: sDate,
          open_time: sOpenTime,
          close_time: sCloseTime,
          description: sDescription.trim(),
        });
        if (res && res.success) {
          setSuccessMsg(res.message || "Special opening date created successfully.");
        }
      }

      setShowSpecialModal(false);
      await loadDatesData();
    } catch (err: any) {
      setSModalError(err?.message || "Failed to save special opening date. Please try again.");
    } finally {
      setSSubmitting(false);
    }
  };

  const handleDeleteSpecialOpening = async (id: number, dateStr: string) => {
    if (!confirm(`Are you sure you want to delete special opening hours for ${dateStr}?`)) {
      return;
    }

    try {
      setDeletingSpecialId(id);
      const res = await adminDatesService.deleteSpecialOpeningDate(id);
      if (res && res.success) {
        setSuccessMsg(res.message || `Special opening for ${dateStr} deleted successfully.`);
      }
      await loadDatesData();
    } catch (err: any) {
      setError(err?.message || `Failed to delete special opening date.`);
    } finally {
      setDeletingSpecialId(null);
    }
  };

  // Helper date formatter for calendar chip
  const formatDateBadge = (dateStr: string) => {
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return {
          month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
          day: parts[2],
          year: parts[0],
          weekday: d.toLocaleString("en-US", { weekday: "short" }),
        };
      }
      return { month: "DATE", day: dateStr, year: "", weekday: "" };
    } catch {
      return { month: "DATE", day: dateStr, year: "", weekday: "" };
    }
  };

  // Client-side search filters
  const filteredBlocked = blockedDates.filter((item) => {
    const q = blockedSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      item.description.toLowerCase().includes(q) ||
      item.date.toLowerCase().includes(q)
    );
  });

  const filteredSpecial = specialOpenings.filter((item) => {
    const q = specialSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      item.description.toLowerCase().includes(q) ||
      item.date.toLowerCase().includes(q) ||
      item.open_time.includes(q) ||
      item.close_time.includes(q)
    );
  });

  return (
    <div className="space-y-6 p-2 sm:p-4">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8E2DC]">
        <div>
          <h1 className="font-displayPlayFair text-2xl sm:text-3xl font-bold text-[#1d1a17]">
            Schedule Exceptions
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
            Manage blocked facility closure dates and special extended opening hours.
          </p>
        </div>

        {/* Global Action & Refresh Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            type="button"
            onClick={() => loadDatesData()}
            disabled={loading}
            className="px-3.5 py-2 bg-white hover:bg-[#FAF8F5] text-[#1d1a17] text-xs font-semibold rounded-xl border border-[#E8E2DC] transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Refresh schedule from server"
          >
            <MdRefresh className={`w-4 h-4 ${loading ? "animate-spin text-[#8B7355]" : "text-[#475569]"}`} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={openAddBlockedModal}
            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <MdBlock className="w-4 h-4 text-rose-600" />
            <span>Block Date</span>
          </button>
          <button
            type="button"
            onClick={openAddSpecialModal}
            className="px-3.5 py-2 bg-[#8B7355] hover:bg-[#705b41] text-white text-xs font-semibold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <HiOutlineSparkles className="w-4 h-4 text-[#CFB9A3]" />
            <span>Special Opening</span>
          </button>
        </div>
      </div>

      {/* ── SUMMARY METRIC CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Blocked Dates */}
        <div className="bg-gradient-to-br from-[#1d1a17] to-[#2d2722] text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-1 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#CFB9A3] uppercase tracking-wider">
                Total Blocked Dates
              </span>
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-[#CFB9A3]">
                <MdBlock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl lg:text-3xl font-extrabold tracking-tight pt-1">
              {summary?.total_blocked_dates ?? blockedDates.length}
            </p>
          </div>
          <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/80 relative z-10">
            <span>Facility Closures</span>
            <span className="font-semibold text-rose-300">
              {summary?.upcoming_blocked_dates ?? 0} Upcoming
            </span>
          </div>
        </div>

        {/* Card 2: Upcoming Blocked Dates */}
        <div className="bg-white border border-[#E8E2DC] hover:border-rose-400/40 rounded-2xl p-5 shadow-2xs flex flex-col justify-between transition-all">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                <MdBlock className="w-4 h-4 text-rose-600" />
                Upcoming Closed
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                Active
              </span>
            </div>
            <p className="text-2xl font-bold text-[#1d1a17] pt-1">
              {summary?.upcoming_blocked_dates ?? 0}
            </p>
          </div>
          <div className="pt-2.5 mt-2 border-t border-[#F1EDE8] flex items-center justify-between text-[11px] text-[#64748B]">
            <span>Scheduled Blackouts</span>
            <span className="font-semibold text-rose-700">From Today</span>
          </div>
        </div>

        {/* Card 3: Total Special Openings */}
        <div className="bg-white border border-[#E8E2DC] hover:border-amber-400/40 rounded-2xl p-5 shadow-2xs flex flex-col justify-between transition-all">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <HiOutlineSparkles className="w-4 h-4 text-[#8B7355]" />
                Special Openings
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                Extended
              </span>
            </div>
            <p className="text-2xl font-bold text-[#1d1a17] pt-1">
              {summary?.total_special_opening_dates ?? specialOpenings.length}
            </p>
          </div>
          <div className="pt-2.5 mt-2 border-t border-[#F1EDE8] flex items-center justify-between text-[11px] text-[#64748B]">
            <span>Special Hours</span>
            <span className="font-semibold text-[#8B7355]">
              {summary?.upcoming_special_opening_dates ?? 0} Upcoming
            </span>
          </div>
        </div>

        {/* Card 4: Upcoming Special Openings */}
        <div className="bg-white border border-[#E8E2DC] hover:border-emerald-400/40 rounded-2xl p-5 shadow-2xs flex flex-col justify-between transition-all">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                <HiOutlineClock className="w-4 h-4 text-emerald-600" />
                Upcoming Openings
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                Open Day
              </span>
            </div>
            <p className="text-2xl font-bold text-[#1d1a17] pt-1">
              {summary?.upcoming_special_opening_dates ?? 0}
            </p>
          </div>
          <div className="pt-2.5 mt-2 border-t border-[#F1EDE8] flex items-center justify-between text-[11px] text-[#64748B]">
            <span>Holiday & Special Hours</span>
            <span className="font-semibold text-emerald-700">From Today</span>
          </div>
        </div>
      </div>

      {/* ── FILTER TOOLBAR (Upcoming & Year/Month) ── */}
      <div className="bg-white rounded-2xl border border-[#E8E2DC] p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center flex-wrap gap-2">
          <span className="font-bold text-[#334155]">Filter Overview:</span>
          <button
            type="button"
            onClick={() => setFilterUpcoming(!filterUpcoming)}
            className={`px-3 py-1.5 rounded-xl font-bold border transition-all cursor-pointer ${
              filterUpcoming
                ? "bg-[#8B7355] text-white border-[#8B7355]"
                : "bg-white text-[#475569] border-[#CBD5E1] hover:bg-[#FAF8F5]"
            }`}
          >
            {filterUpcoming ? "✓ Showing Upcoming Only" : "Show Upcoming Only"}
          </button>

          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-2.5 py-1.5 border border-[#CBD5E1] rounded-xl font-medium text-[#1e293b] bg-white cursor-pointer"
          >
            <option value="all">All Years</option>
            <option value="2026">Year 2026</option>
            <option value="2027">Year 2027</option>
          </select>

          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="px-2.5 py-1.5 border border-[#CBD5E1] rounded-xl font-medium text-[#1e293b] bg-white cursor-pointer"
          >
            <option value="all">All Months</option>
            <option value="1">January (1)</option>
            <option value="2">February (2)</option>
            <option value="3">March (3)</option>
            <option value="4">April (4)</option>
            <option value="5">May (5)</option>
            <option value="6">June (6)</option>
            <option value="7">July (7)</option>
            <option value="8">August (8)</option>
            <option value="9">September (9)</option>
            <option value="10">October (10)</option>
            <option value="11">November (11)</option>
            <option value="12">December (12)</option>
          </select>

          {(filterUpcoming || filterYear !== "all" || filterMonth !== "all") && (
            <button
              type="button"
              onClick={() => {
                setFilterUpcoming(false);
                setFilterYear("all");
                setFilterMonth("all");
              }}
              className="px-2 py-1 text-gray-500 hover:text-red-600 cursor-pointer font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="text-[11px] text-[#64748B]">
          Database Synced: <span className="font-bold text-[#1d1a17]">{blockedDates.length} blocked</span> •{" "}
          <span className="font-bold text-[#1d1a17]">{specialOpenings.length} special openings</span>
        </div>
      </div>

      {/* ── NOTIFICATIONS / ALERTS ── */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <HiOutlineCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMsg(null)}
            className="text-emerald-600 hover:text-emerald-900"
          >
            <HiOutlineX className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <HiOutlineInformationCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-600 hover:text-rose-900"
          >
            <HiOutlineX className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── HORIZONTAL SIDE-BY-SIDE SECTIONS (2 COLUMNS) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* ── SECTION 1: BLOCKED DATES (LEFT SIDE) ──                          */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl border border-[#E8E2DC] shadow-xs flex flex-col overflow-hidden">
          {/* Section Header */}
          <div className="p-4 sm:p-5 border-b border-[#F1EDE8] bg-[#FAF8F5]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100/80 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0 shadow-2xs">
                <MdBlock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold font-displayPlayFair text-[#1d1a17]">
                    Blocked Dates
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
                    {filteredBlocked.length} Blocked
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-0.5">
                  Closed dates, holidays, and facility maintenance blackouts.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openAddBlockedModal}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0 shadow-2xs"
            >
              <MdAdd className="w-4 h-4" />
              <span>Add Blocked Date</span>
            </button>
          </div>

          {/* Search Bar for Blocked Dates */}
          <div className="p-3 border-b border-[#F1EDE8] bg-white">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search blocked dates, holidays, or description..."
                value={blockedSearch}
                onChange={(e) => setBlockedSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs text-[#0f172a] font-medium border border-[#CBD5E1] rounded-xl focus:outline-hidden focus:border-rose-400 focus:ring-1 focus:ring-rose-400 bg-white placeholder-[#94A3B8]"
              />
              {blockedSearch && (
                <button
                  type="button"
                  onClick={() => setBlockedSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <HiOutlineX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* List of Blocked Dates */}
          <div className="p-4 space-y-3 divide-y divide-[#F9F6F3] max-h-[640px] overflow-y-auto">
            {loading ? (
              <div className="py-12 text-center space-y-2">
                <div className="w-5 h-5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-[#64748B]">Loading blocked dates...</p>
              </div>
            ) : filteredBlocked.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-lg border border-rose-200">
                  <MdBlock className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold text-[#1d1a17]">No Blocked Dates Found</p>
                <p className="text-xs text-[#64748B] max-w-xs mx-auto">
                  {blockedSearch
                    ? "No blocked dates match your search query."
                    : "No closure dates are currently recorded on the backend."}
                </p>
                <button
                  type="button"
                  onClick={openAddBlockedModal}
                  className="mt-2 text-xs font-semibold text-rose-700 hover:underline cursor-pointer"
                >
                  + Block a new date now
                </button>
              </div>
            ) : (
              filteredBlocked.map((item) => {
                const badge = formatDateBadge(item.date);
                const isDeleting = deletingBlockedId === item.id;
                return (
                  <div
                    key={item.id}
                    className="pt-3 first:pt-0 group hover:bg-[#FAF8F5]/60 p-3 rounded-xl border border-transparent hover:border-[#F1EDE8] transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* Left: Date Badge & Details */}
                      <div className="flex items-start gap-3">
                        {/* Red Calendar Chip */}
                        <div className="w-12 h-14 rounded-xl bg-gradient-to-b from-rose-500 to-rose-600 text-white flex flex-col items-center justify-center shrink-0 shadow-xs border border-rose-700 overflow-hidden">
                          <span className="text-[9px] font-black uppercase tracking-wider bg-rose-800/80 w-full text-center py-0.5">
                            {badge.month}
                          </span>
                          <span className="text-base font-extrabold leading-none pt-1">
                            {badge.day}
                          </span>
                          <span className="text-[8px] font-bold text-rose-100 uppercase">
                            {badge.weekday}
                          </span>
                        </div>

                        {/* Title & Info */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-bold text-[#1d1a17]">
                              {item.description}
                            </h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                              Facility Closed
                            </span>
                          </div>

                          <p className="text-[11px] font-medium text-[#64748B] flex items-center gap-1.5">
                            <HiOutlineCalendar className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span>
                              {item.date} {badge.year ? `(${badge.year})` : ""}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Right: Actions (Edit & Delete) */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => openEditBlockedModal(item)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#8B7355] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                          title="Edit this blocked date"
                        >
                          <MdEdit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => handleDeleteBlockedDate(item.id, item.date)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete / Unblock this date"
                        >
                          <MdDeleteOutline className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* ── SECTION 2: SPECIAL OPENING DATES (RIGHT SIDE) ──                 */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl border border-[#E8E2DC] shadow-xs flex flex-col overflow-hidden">
          {/* Section Header */}
          <div className="p-4 sm:p-5 border-b border-[#F1EDE8] bg-[#FAF8F5]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100/80 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs">
                <HiOutlineSparkles className="w-5 h-5 text-[#8B7355]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold font-displayPlayFair text-[#1d1a17]">
                    Special Opening Dates
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {filteredSpecial.length} Openings
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-0.5">
                  Holiday sessions, custom hours, and extended availability.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openAddSpecialModal}
              className="px-3.5 py-1.5 bg-[#8B7355] hover:bg-[#705b41] text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0 shadow-2xs"
            >
              <MdAdd className="w-4 h-4" />
              <span>Add Special Opening</span>
            </button>
          </div>

          {/* Search Bar for Special Openings */}
          <div className="p-3 border-b border-[#F1EDE8] bg-white">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search occasion description, dates, or hours..."
                value={specialSearch}
                onChange={(e) => setSpecialSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs text-[#0f172a] font-medium border border-[#CBD5E1] rounded-xl focus:outline-hidden focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] bg-white placeholder-[#94A3B8]"
              />
              {specialSearch && (
                <button
                  type="button"
                  onClick={() => setSpecialSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <HiOutlineX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* List of Special Openings */}
          <div className="p-4 space-y-3 divide-y divide-[#F9F6F3] max-h-[640px] overflow-y-auto">
            {loading ? (
              <div className="py-12 text-center space-y-2">
                <div className="w-5 h-5 border-2 border-[#8B7355] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-[#64748B]">Loading special opening dates...</p>
              </div>
            ) : filteredSpecial.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto text-lg border border-amber-200">
                  <HiOutlineSparkles className="w-5 h-5 text-[#8B7355]" />
                </div>
                <p className="text-sm font-bold text-[#1d1a17]">No Special Openings Found</p>
                <p className="text-xs text-[#64748B] max-w-xs mx-auto">
                  {specialSearch
                    ? "No special opening dates match your search query."
                    : "No special opening hours are currently scheduled on the backend."}
                </p>
                <button
                  type="button"
                  onClick={openAddSpecialModal}
                  className="mt-2 text-xs font-semibold text-[#8B7355] hover:underline cursor-pointer"
                >
                  + Set special opening hours now
                </button>
              </div>
            ) : (
              filteredSpecial.map((item) => {
                const badge = formatDateBadge(item.date);
                const isDeleting = deletingSpecialId === item.id;
                return (
                  <div
                    key={item.id}
                    className="pt-3 first:pt-0 group hover:bg-[#FAF8F5]/60 p-3 rounded-xl border border-transparent hover:border-[#F1EDE8] transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* Left: Date Badge & Details */}
                      <div className="flex items-start gap-3">
                        {/* Amber/Gold Calendar Chip */}
                        <div className="w-12 h-14 rounded-xl bg-gradient-to-b from-[#8B7355] to-[#705b41] text-white flex flex-col items-center justify-center shrink-0 shadow-xs border border-[#5d4a34] overflow-hidden">
                          <span className="text-[9px] font-black uppercase tracking-wider bg-[#5d4a34] w-full text-center py-0.5 text-[#EFE7DE]">
                            {badge.month}
                          </span>
                          <span className="text-base font-extrabold leading-none pt-1">
                            {badge.day}
                          </span>
                          <span className="text-[8px] font-bold text-[#CFB9A3] uppercase">
                            {badge.weekday}
                          </span>
                        </div>

                        {/* Title & Info */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-bold text-[#1d1a17]">
                              {item.description}
                            </h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Open: {item.open_time} – {item.close_time}
                            </span>
                          </div>

                          <p className="text-[11px] font-medium text-[#64748B] flex items-center gap-1.5">
                            <HiOutlineClock className="w-3.5 h-3.5 text-[#8B7355] shrink-0" />
                            <span>
                              {item.date} • Special Operating Window ({item.open_time} to {item.close_time})
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Right: Actions (Edit & Delete) */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => openEditSpecialModal(item)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#8B7355] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                          title="Edit this special opening date"
                        >
                          <MdEdit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => handleDeleteSpecialOpening(item.id, item.date)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete this special opening date"
                        >
                          <MdDeleteOutline className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── MODAL 1: ADD / EDIT BLOCKED DATE ──                              */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {showBlockedModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E8E2DC] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#F1EDE8] bg-rose-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-200 text-rose-700 flex items-center justify-center shadow-xs">
                  <MdBlock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold font-displayPlayFair text-[#1d1a17]">
                    {editingBlockedId ? "Edit Blocked Date" : "Add Blocked Date"}
                  </h2>
                  <p className="text-xs text-rose-700 mt-0.5">
                    Close facility bookings for holidays, emergencies, or maintenance.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBlockedModal(false)}
                className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4">
              {bModalError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <HiOutlineInformationCircle className="w-4 h-4 shrink-0" />
                  <span>{bModalError}</span>
                </div>
              )}

              {/* Date */}
              <div>
                <label className="block text-xs font-bold text-[#1d1a17] mb-1">
                  Closure Date (YYYY-MM-DD) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="date"
                  value={bDate}
                  onChange={(e) => setBDate(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-medium text-[#1e293b] border border-[#CBD5E1] rounded-xl focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-white"
                  required
                />
              </div>

              {/* Description / Reason */}
              <div>
                <label className="block text-xs font-bold text-[#1d1a17] mb-1">
                  Reason / Description <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Christmas Day Public Holiday, Annual Deep Cleaning"
                  value={bDescription}
                  onChange={(e) => setBDescription(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs text-[#0f172a] font-medium border border-[#CBD5E1] rounded-xl focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-white"
                  required
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#F1EDE8] bg-[#FAF8F5]/80 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowBlockedModal(false)}
                className="px-4 py-2 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#475569] hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={bSubmitting || !bDate || !bDescription.trim()}
                onClick={handleSaveBlockedDate}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                {bSubmitting && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                <span>{editingBlockedId ? "Update Blocked Date" : "Save Blocked Date"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── MODAL 2: ADD / EDIT SPECIAL OPENING DATE ──                      */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {showSpecialModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E8E2DC] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#F1EDE8] bg-[#FAF8F5]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 text-[#8B7355] flex items-center justify-center shadow-xs">
                  <HiOutlineSparkles className="w-5 h-5 text-[#8B7355]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold font-displayPlayFair text-[#1d1a17]">
                    {editingSpecialId ? "Edit Special Opening Date" : "Add Special Opening Date"}
                  </h2>
                  <p className="text-xs text-[#8B7355] mt-0.5">
                    Schedule extended hours or custom opening times for a specific date.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSpecialModal(false)}
                className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4">
              {sModalError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <HiOutlineInformationCircle className="w-4 h-4 shrink-0" />
                  <span>{sModalError}</span>
                </div>
              )}

              {/* Date */}
              <div>
                <label className="block text-xs font-bold text-[#1d1a17] mb-1">
                  Special Opening Date (YYYY-MM-DD) <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={sDate}
                  onChange={(e) => setSDate(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-medium text-[#1e293b] border border-[#CBD5E1] rounded-xl focus:outline-hidden focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] bg-white"
                  required
                />
              </div>

              {/* Operating Hours Window */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1d1a17] mb-1">
                    Opening Time (HH:MM) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={sOpenTime}
                    onChange={(e) => setSOpenTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-medium text-[#1e293b] border border-[#CBD5E1] rounded-xl focus:outline-hidden focus:border-[#8B7355] bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1d1a17] mb-1">
                    Closing Time (HH:MM) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={sCloseTime}
                    onChange={(e) => setSCloseTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-medium text-[#1e293b] border border-[#CBD5E1] rounded-xl focus:outline-hidden focus:border-[#8B7355] bg-white"
                    required
                  />
                </div>
              </div>

              {/* Description / Occasion Name */}
              <div>
                <label className="block text-xs font-bold text-[#1d1a17] mb-1">
                  Occasion / Event Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. New Year's Eve Early Close, Valentine's Extended Evening"
                  value={sDescription}
                  onChange={(e) => setSDescription(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs text-[#0f172a] font-medium border border-[#CBD5E1] rounded-xl focus:outline-hidden focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] bg-white"
                  required
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#F1EDE8] bg-[#FAF8F5]/80 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSpecialModal(false)}
                className="px-4 py-2 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#475569] hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={sSubmitting || !sDate || !sDescription.trim() || !sOpenTime || !sCloseTime}
                onClick={handleSaveSpecialOpening}
                className="px-5 py-2 rounded-xl bg-[#8B7355] hover:bg-[#705b41] text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                {sSubmitting && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                <span>{editingSpecialId ? "Update Special Opening" : "Save Special Opening"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
