"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  userService,
  AdminUserItem,
  AdminUsersSummary,
  AdminUsersQueryParams,
} from "@/lib/api/services/userService";
import { formatImageUrl } from "@/lib/api/config";
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
  HiOutlinePencilAlt,
  HiOutlineShieldCheck,
  HiOutlineBan,
  HiOutlineCheckCircle,
  HiOutlineTrash,
  HiOutlineUserGroup,
} from "react-icons/hi";
import {
  MdAdminPanelSettings,
  MdPerson,
  MdLock,
  MdLockOpen,
  MdLanguage,
  MdBookOnline,
  MdEuro,
} from "react-icons/md";

const ROLE_OPTIONS = [
  { value: "all", label: "All Roles" },
  { value: "user", label: "Regular User" },
  { value: "admin", label: "Admin" },
];

const ACTIVE_STATUS_OPTIONS = [
  { value: "all", label: "All Active Statuses" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const BLOCK_STATUS_OPTIONS = [
  { value: "all", label: "All Block Statuses" },
  { value: "false", label: "Normal (Unblocked)" },
  { value: "true", label: "Suspended / Blocked" },
];

const LANGUAGE_OPTIONS = [
  { value: "all", label: "All Languages" },
  { value: "en", label: "English (EN)" },
  { value: "nl", label: "Dutch (NL)" },
  { value: "de", label: "German (DE)" },
];

const ORDERING_OPTIONS = [
  { value: "-date_joined", label: "Newest Joined First" },
  { value: "date_joined", label: "Oldest Joined First" },
  { value: "name", label: "Name (A-Z)" },
  { value: "-name", label: "Name (Z-A)" },
  { value: "email", label: "Email (A-Z)" },
  { value: "-email", label: "Email (Z-A)" },
];

export default function AdminUsersPage() {
  // Data State
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [summary, setSummary] = useState<AdminUsersSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Pagination State
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedActive, setSelectedActive] = useState("all");
  const [selectedBlock, setSelectedBlock] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");

  // Date Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [exactDate, setExactDate] = useState("");
  const [selectedOrdering, setSelectedOrdering] = useState("-date_joined");

  // View Details Modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUserItem | null>(null);

  // Manage / Update Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserItem | null>(null);
  const [editRole, setEditRole] = useState<"user" | "admin">("user");
  const [editIsActive, setEditIsActive] = useState(true);
  const [editBlock, setEditBlock] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Quick Action Pending Map (e.g., inline toggle block/role)
  const [actionPendingId, setActionPendingId] = useState<number | null>(null);

  // Show Toast Auto Dismiss
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: AdminUsersQueryParams = {
        page: currentPage,
        page_size: pageSize,
        ordering: selectedOrdering,
      };

      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (selectedRole !== "all") params.role = selectedRole;
      if (selectedActive !== "all") params.is_active = selectedActive === "true";
      if (selectedBlock !== "all") params.block = selectedBlock === "true";
      if (selectedLanguage !== "all") params.language = selectedLanguage;

      if (exactDate) {
        params.date = exactDate;
      } else {
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;
      }

      const res = await userService.getAdminUsers(params);

      if (res && res.success) {
        const userList = res.data || [];
        setUsers(userList);
        setSummary(res.summary || null);
        setTotalCount(res.total || userList.length);
        setTotalPages(res.total_pages || Math.max(1, Math.ceil((res.total || userList.length) / pageSize)));
      } else {
        // Fallback if data array is at root or similar
        const fallbackList = (res as any)?.data || (res as any)?.results || [];
        setUsers(fallbackList);
        setTotalCount((res as any)?.total || (res as any)?.count || fallbackList.length);
        setTotalPages((res as any)?.total_pages || 1);
        if ((res as any)?.summary) setSummary((res as any).summary);
      }
    } catch (err: any) {
      console.error("Failed to load users:", err);
      setError(err?.message || "Failed to load users. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    pageSize,
    selectedOrdering,
    debouncedSearch,
    selectedRole,
    selectedActive,
    selectedBlock,
    selectedLanguage,
    exactDate,
    startDate,
    endDate,
  ]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setSelectedRole("all");
    setSelectedActive("all");
    setSelectedBlock("all");
    setSelectedLanguage("all");
    setStartDate("");
    setEndDate("");
    setExactDate("");
    setSelectedOrdering("-date_joined");
    setCurrentPage(1);
  };

  // Open Edit Modal
  const openEditModal = (user: AdminUserItem) => {
    setEditingUser(user);
    setEditRole((user.role === "admin" ? "admin" : "user") as "user" | "admin");
    setEditIsActive(Boolean(user.is_active));
    setEditBlock(Boolean(user.block));
    setEditModalOpen(true);
  };

  // Save Edit Modal
  const handleSaveEdit = async () => {
    if (!editingUser) return;
    setIsUpdating(true);
    try {
      const payload = {
        role: editRole,
        is_active: editIsActive,
        block: editBlock,
      };

      const res = await userService.updateAdminUser(editingUser.id, payload);
      setToastMessage({
        type: "success",
        text: res.message || `User '${editingUser.name || editingUser.email}' updated successfully.`,
      });
      setEditModalOpen(false);

      // Refresh list
      fetchUsers();

      // If detail modal is open for this user, sync it
      if (selectedUser?.id === editingUser.id) {
        setSelectedUser((prev) => (prev ? { ...prev, ...payload } : null));
      }
    } catch (err: any) {
      console.error("Failed to update user:", err);
      setToastMessage({
        type: "error",
        text: err?.message || "Failed to update user status.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Quick Toggle Block / Unblock directly
  const handleQuickToggleBlock = async (user: AdminUserItem) => {
    const nextBlockState = !user.block;
    setActionPendingId(user.id);
    try {
      const res = await userService.updateAdminUser(user.id, { block: nextBlockState });
      setToastMessage({
        type: "success",
        text: res.message || `User '${user.name || user.email}' ${nextBlockState ? "suspended/blocked" : "unblocked"} successfully.`,
      });
      // Optimistic or refresh
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, block: nextBlockState } : u))
      );
      if (summary) {
        setSummary({
          ...summary,
          blocked_users: nextBlockState ? summary.blocked_users + 1 : Math.max(0, summary.blocked_users - 1),
        });
      }
    } catch (err: any) {
      setToastMessage({
        type: "error",
        text: err?.message || "Failed to toggle block status.",
      });
    } finally {
      setActionPendingId(null);
    }
  };

  // Quick Toggle Active / Inactive
  const handleQuickToggleActive = async (user: AdminUserItem) => {
    const nextActiveState = !user.is_active;
    setActionPendingId(user.id);
    try {
      const res = await userService.updateAdminUser(user.id, { is_active: nextActiveState });
      setToastMessage({
        type: "success",
        text: res.message || `User '${user.name || user.email}' set to ${nextActiveState ? "active" : "inactive"}.`,
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, is_active: nextActiveState } : u))
      );
      if (summary) {
        setSummary({
          ...summary,
          active_users: nextActiveState ? summary.active_users + 1 : Math.max(0, summary.active_users - 1),
        });
      }
    } catch (err: any) {
      setToastMessage({
        type: "error",
        text: err?.message || "Failed to change active status.",
      });
    } finally {
      setActionPendingId(null);
    }
  };

  const hasActiveFilters =
    searchQuery ||
    selectedRole !== "all" ||
    selectedActive !== "all" ||
    selectedBlock !== "all" ||
    selectedLanguage !== "all" ||
    startDate ||
    endDate ||
    exactDate ||
    selectedOrdering !== "-date_joined";

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border text-sm font-medium transition-all transform duration-300 animate-slide-up ${
            toastMessage.type === "success"
              ? "bg-[#1E293B] text-white border-emerald-500/30"
              : "bg-red-950 text-red-100 border-red-500/40"
          }`}
        >
          {toastMessage.type === "success" ? (
            <HiOutlineCheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <HiOutlineBan className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-gray-400 hover:text-white"
          >
            <HiOutlineX className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1d1a17] tracking-tight flex items-center gap-2.5">
            <HiOutlineUserGroup className="w-7 h-7 text-[#CFB9A3]" />
            User Management
          </h1>
          <p className="text-sm text-[#8C827A] mt-1">
            View, search, filter registered users, manage access, suspension and account roles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchUsers()}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8E2DC] rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#1d1a17] hover:border-[#CFB9A3] transition-colors shadow-xs disabled:opacity-50"
          >
            <HiOutlineRefresh className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Users */}
        <div className="bg-white p-4 rounded-2xl border border-[#F1EDE8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8C827A]">Total Users</span>
            <div className="w-8 h-8 rounded-lg bg-[#F8F4F0] flex items-center justify-center text-[#1d1a17]">
              <HiOutlineUserGroup className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#1d1a17]">
              {loading && !summary ? "..." : summary?.total_users ?? totalCount}
            </div>
            <p className="text-[11px] text-[#A89F91] mt-0.5">Registered accounts</p>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white p-4 rounded-2xl border border-[#F1EDE8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8C827A]">Active Users</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <HiOutlineCheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-600">
              {loading && !summary ? "..." : summary?.active_users ?? "-"}
            </div>
            <p className="text-[11px] text-[#A89F91] mt-0.5">Can login & book</p>
          </div>
        </div>

        {/* Blocked / Suspended Users */}
        <div className="bg-white p-4 rounded-2xl border border-[#F1EDE8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8C827A]">Suspended</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <HiOutlineBan className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-rose-600">
              {loading && !summary ? "..." : summary?.blocked_users ?? 0}
            </div>
            <p className="text-[11px] text-[#A89F91] mt-0.5">Blocked accounts</p>
          </div>
        </div>

        {/* Admin Staff */}
        <div className="bg-white p-4 rounded-2xl border border-[#F1EDE8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8C827A]">Admins</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <MdAdminPanelSettings className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-purple-700">
              {loading && !summary ? "..." : summary?.admin_users ?? "-"}
            </div>
            <p className="text-[11px] text-[#A89F91] mt-0.5">Privileged staff</p>
          </div>
        </div>

        {/* Regular Members */}
        <div className="bg-white p-4 rounded-2xl border border-[#F1EDE8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8C827A]">Regular</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <MdPerson className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-blue-700">
              {loading && !summary ? "..." : summary?.regular_users ?? "-"}
            </div>
            <p className="text-[11px] text-[#A89F91] mt-0.5">Standard guests</p>
          </div>
        </div>

        {/* Joined This Month */}
        <div className="bg-white p-4 rounded-2xl border border-[#F1EDE8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8C827A]">Joined This Month</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <HiOutlineSparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#1d1a17]">
              {loading && !summary ? "..." : summary?.joined_this_month ?? "-"}
            </div>
            <p className="text-[11px] text-[#A89F91] mt-0.5">New acquisitions</p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-[#F1EDE8] shadow-xs space-y-4">
        {/* Row 1: Search & Quick Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Live Search */}
          <div className="md:col-span-5 relative">
            <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C827A]" />
            <input
              type="text"
              placeholder="Search by name, email, phone or UID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 bg-[#FAF7F4] border border-[#E8E2DC] rounded-xl text-xs sm:text-sm text-[#1d1a17] focus:outline-hidden focus:border-[#CFB9A3] focus:bg-white transition-all placeholder:text-[#A89F91]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C827A] hover:text-[#1d1a17]"
              >
                <HiOutlineX className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Role Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 bg-[#FAF7F4] border border-[#E8E2DC] rounded-xl text-xs sm:text-sm text-[#1d1a17] focus:outline-hidden focus:border-[#CFB9A3] focus:bg-white"
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Block Status Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedBlock}
              onChange={(e) => {
                setSelectedBlock(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 bg-[#FAF7F4] border border-[#E8E2DC] rounded-xl text-xs sm:text-sm text-[#1d1a17] focus:outline-hidden focus:border-[#CFB9A3] focus:bg-white"
            >
              {BLOCK_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Active Status Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedActive}
              onChange={(e) => {
                setSelectedActive(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 bg-[#FAF7F4] border border-[#E8E2DC] rounded-xl text-xs sm:text-sm text-[#1d1a17] focus:outline-hidden focus:border-[#CFB9A3] focus:bg-white"
            >
              {ACTIVE_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Date Filters & Ordering */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center pt-1 border-t border-[#F8F4F0]">
          {/* Language */}
          <div className="md:col-span-2">
            <select
              value={selectedLanguage}
              onChange={(e) => {
                setSelectedLanguage(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 bg-[#FAF7F4] border border-[#E8E2DC] rounded-xl text-xs text-[#1d1a17] focus:outline-hidden focus:border-[#CFB9A3]"
            >
              {LANGUAGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range: From */}
          <div className="md:col-span-3 flex items-center gap-1.5">
            <span className="text-[11px] text-[#8C827A] whitespace-nowrap">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setExactDate("");
                setCurrentPage(1);
              }}
              className="w-full py-1.5 px-2 bg-[#FAF7F4] border border-[#E8E2DC] rounded-xl text-xs text-[#1d1a17] focus:outline-hidden focus:border-[#CFB9A3]"
            />
          </div>

          {/* Date Range: To */}
          <div className="md:col-span-3 flex items-center gap-1.5">
            <span className="text-[11px] text-[#8C827A] whitespace-nowrap">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setExactDate("");
                setCurrentPage(1);
              }}
              className="w-full py-1.5 px-2 bg-[#FAF7F4] border border-[#E8E2DC] rounded-xl text-xs text-[#1d1a17] focus:outline-hidden focus:border-[#CFB9A3]"
            />
          </div>

          {/* Ordering */}
          <div className="md:col-span-3">
            <select
              value={selectedOrdering}
              onChange={(e) => {
                setSelectedOrdering(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 bg-[#FAF7F4] border border-[#E8E2DC] rounded-xl text-xs text-[#1d1a17] focus:outline-hidden focus:border-[#CFB9A3]"
            >
              {ORDERING_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="md:col-span-1 flex justify-end">
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium py-1 px-2.5 rounded-lg hover:bg-rose-50 transition-colors"
                title="Reset all filters"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table / User Cards */}
      <div className="bg-white rounded-2xl border border-[#F1EDE8] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-[#8C827A] gap-3">
            <HiOutlineRefresh className="w-8 h-8 animate-spin text-[#CFB9A3]" />
            <p className="text-sm font-medium">Loading users list...</p>
          </div>
        ) : error ? (
          <div className="py-16 px-4 text-center">
            <div className="inline-flex p-3 rounded-full bg-red-50 text-red-600 mb-3">
              <HiOutlineBan className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-[#1d1a17]">Failed to Load Users</h3>
            <p className="text-xs text-[#8C827A] max-w-md mx-auto mt-1">{error}</p>
            <button
              onClick={() => fetchUsers()}
              className="mt-4 px-4 py-2 bg-[#CFB9A3] text-white text-xs font-semibold rounded-xl hover:bg-[#bfa78f] transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="inline-flex p-3 rounded-full bg-[#FAF7F4] text-[#A89F91] mb-3">
              <HiOutlineUserGroup className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-[#1d1a17]">No Users Found</h3>
            <p className="text-xs text-[#8C827A] max-w-sm mx-auto mt-1">
              No registered user accounts match your search or filter criteria.
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 border border-[#E8E2DC] text-xs font-semibold rounded-xl text-[#1d1a17] hover:bg-[#FAF7F4] transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#F1EDE8] bg-[#FAF7F4]/60 text-[11px] font-semibold text-[#8C827A] uppercase tracking-wider">
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">UID / Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Joined / Activity</th>
                  <th className="py-3.5 px-4">Bookings & Spent</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1EDE8] text-xs text-[#1d1a17]">
                {users.map((user) => {
                  const isBlocked = Boolean(user.block);
                  const isActive = Boolean(user.is_active);
                  const isAdmin = user.role === "admin";
                  const isPending = actionPendingId === user.id;

                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-[#FAF7F4]/70 transition-colors ${
                        isBlocked ? "bg-rose-50/20" : ""
                      }`}
                    >
                      {/* Avatar & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#EFE9E2] border border-[#E8E2DC] overflow-hidden flex items-center justify-center shrink-0">
                            {user.image ? (
                              <img
                                src={formatImageUrl(user.image)}
                                alt={user.name || user.email}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="font-semibold text-xs text-[#8C827A] uppercase">
                                {(user.name || user.email || "U").charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-[#1d1a17] truncate">
                              {user.name || "Unnamed User"}
                            </p>
                            <p className="text-[11px] text-[#8C827A] truncate">
                              {user.phone || "No phone number"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* UID & Email */}
                      <td className="py-3.5 px-4">
                        <div>
                          {user.uid && (
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#EFE9E2] text-[#6B6158] mb-0.5">
                              {user.uid}
                            </span>
                          )}
                          <p className="text-xs text-[#1d1a17] font-medium">{user.email}</p>
                          {user.language && (
                            <span className="text-[10px] text-[#A89F91] uppercase tracking-wider">
                              Lang: {user.language}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800">
                            <MdAdminPanelSettings className="w-3.5 h-3.5" />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#FAF7F4] text-[#64748B] border border-[#E8E2DC]">
                            <MdPerson className="w-3.5 h-3.5" />
                            User
                          </span>
                        )}
                      </td>

                      {/* Status Badges */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          {/* Active / Inactive */}
                          {isActive ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                              Inactive
                            </span>
                          )}

                          {/* Blocked / Normal */}
                          {isBlocked ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-700">
                              <HiOutlineBan className="w-3 h-3" />
                              Suspended
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] text-[#8C827A]">
                              <HiOutlineShieldCheck className="w-3 h-3 text-emerald-600" />
                              Normal
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Joined & Last Login */}
                      <td className="py-3.5 px-4">
                        <div className="text-[11px]">
                          <p className="text-[#1d1a17] font-medium">
                            {user.date_joined ? user.date_joined.split(" ")[0] : "—"}
                          </p>
                          <p className="text-[#8C827A] text-[10px]">
                            Last login: {user.last_login ? user.last_login.split(" ")[0] : "Never"}
                          </p>
                        </div>
                      </td>

                      {/* Bookings & Spent */}
                      <td className="py-3.5 px-4">
                        <div className="text-[11px]">
                          <span className="font-semibold text-[#1d1a17]">
                            {user.total_bookings ?? 0}
                          </span>{" "}
                          <span className="text-[#8C827A]">bookings</span>
                          <p className="font-medium text-emerald-700 text-xs">
                            €{user.total_spent ? Number(user.total_spent).toFixed(2) : "0.00"}
                          </p>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Toggle Block */}
                          <button
                            onClick={() => handleQuickToggleBlock(user)}
                            disabled={isPending}
                            title={isBlocked ? "Unblock User" : "Suspend / Block User"}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isBlocked
                                ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
                                : "hover:bg-[#F8F4F0] text-[#8C827A] hover:text-rose-600"
                            }`}
                          >
                            {isBlocked ? (
                              <MdLock className="w-4 h-4 text-rose-600" />
                            ) : (
                              <MdLockOpen className="w-4 h-4" />
                            )}
                          </button>

                          {/* Edit / Manage Status */}
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-1.5 rounded-lg hover:bg-[#F8F4F0] text-[#8C827A] hover:text-[#1d1a17] transition-colors"
                            title="Manage Role & Suspension"
                          >
                            <HiOutlinePencilAlt className="w-4 h-4" />
                          </button>

                          {/* View Detail */}
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setDetailModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-[#F8F4F0] text-[#8C827A] hover:text-[#1d1a17] transition-colors"
                            title="View Full Profile"
                          >
                            <HiOutlineEye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {!loading && users.length > 0 && (
          <div className="p-4 border-t border-[#F1EDE8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8C827A]">
            <div className="flex items-center gap-2">
              <span>
                Showing page <strong className="text-[#1d1a17]">{currentPage}</strong> of{" "}
                <strong className="text-[#1d1a17]">{totalPages}</strong> ({totalCount} total users)
              </span>
              <span className="text-[#E8E2DC]">|</span>
              <div className="flex items-center gap-1.5">
                <span>Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="py-1 px-2 bg-[#FAF7F4] border border-[#E8E2DC] rounded-lg text-xs text-[#1d1a17] focus:outline-hidden"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="p-1.5 rounded-lg border border-[#E8E2DC] hover:bg-[#FAF7F4] text-[#1d1a17] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <HiOutlineChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5 && currentPage > 3) {
                  pageNum = currentPage - 3 + i;
                  if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                      currentPage === pageNum
                        ? "bg-[#CFB9A3] text-white"
                        : "border border-[#E8E2DC] hover:bg-[#FAF7F4] text-[#1d1a17]"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-1.5 rounded-lg border border-[#E8E2DC] hover:bg-[#FAF7F4] text-[#1d1a17] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <HiOutlineChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── DETAIL MODAL ── */}
      {detailModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#F1EDE8] relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#F1EDE8]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#EFE9E2] border border-[#E8E2DC] overflow-hidden flex items-center justify-center">
                  {selectedUser.image ? (
                    <img
                      src={formatImageUrl(selectedUser.image)}
                      alt={selectedUser.name || selectedUser.email}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-bold text-base text-[#8C827A] uppercase">
                      {(selectedUser.name || selectedUser.email || "U").charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1d1a17]">
                    {selectedUser.name || "User Details"}
                  </h3>
                  <p className="text-xs text-[#8C827A]">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="p-1.5 rounded-lg text-[#8C827A] hover:text-[#1d1a17] hover:bg-[#FAF7F4]"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-4 space-y-4 text-xs">
              {/* UID & Role row */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-[#FAF7F4] rounded-xl border border-[#F1EDE8]">
                <div>
                  <span className="text-[10px] text-[#8C827A] uppercase font-semibold">User ID</span>
                  <p className="font-mono text-sm font-semibold text-[#1d1a17]">
                    {selectedUser.uid || `#${selectedUser.id}`}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-[#8C827A] uppercase font-semibold">Role</span>
                  <p className="text-sm font-semibold text-[#1d1a17] capitalize">
                    {selectedUser.role}
                  </p>
                </div>
              </div>

              {/* Status Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 border border-[#F1EDE8] rounded-xl">
                  <span className="text-[10px] text-[#8C827A] uppercase font-semibold">
                    Account Status
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    {selectedUser.is_active ? (
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-700">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 border border-[#F1EDE8] rounded-xl">
                  <span className="text-[10px] text-[#8C827A] uppercase font-semibold">
                    Suspension
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    {selectedUser.block ? (
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800">
                        Blocked / Suspended
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                        Clean / Unblocked
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2 p-3 border border-[#F1EDE8] rounded-xl">
                <span className="text-[10px] text-[#8C827A] uppercase font-semibold block">
                  Profile Details
                </span>
                <div className="flex items-center gap-2 text-[#1d1a17]">
                  <HiOutlineMail className="w-4 h-4 text-[#8C827A]" />
                  <span>{selectedUser.email}</span>
                </div>
                <div className="flex items-center gap-2 text-[#1d1a17]">
                  <HiOutlinePhone className="w-4 h-4 text-[#8C827A]" />
                  <span>{selectedUser.phone || "No phone added"}</span>
                </div>
                <div className="flex items-center gap-2 text-[#1d1a17]">
                  <MdLanguage className="w-4 h-4 text-[#8C827A]" />
                  <span>Language: {selectedUser.language?.toUpperCase() || "EN"}</span>
                </div>
                {selectedUser.bio && (
                  <div className="mt-2 pt-2 border-t border-[#F1EDE8]">
                    <span className="text-[10px] text-[#8C827A] uppercase font-semibold block">
                      Bio
                    </span>
                    <p className="text-[#64748B] mt-0.5 italic">{selectedUser.bio}</p>
                  </div>
                )}
              </div>

              {/* Activity / Booking Metrics */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-[#FAF7F4] rounded-xl border border-[#F1EDE8]">
                <div>
                  <span className="text-[10px] text-[#8C827A] uppercase font-semibold">
                    Total Bookings
                  </span>
                  <p className="text-base font-bold text-[#1d1a17]">
                    {selectedUser.total_bookings ?? 0}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-[#8C827A] uppercase font-semibold">
                    Total Spent
                  </span>
                  <p className="text-base font-bold text-emerald-700">
                    €{selectedUser.total_spent ? Number(selectedUser.total_spent).toFixed(2) : "0.00"}
                  </p>
                </div>
                <div className="col-span-2 pt-2 border-t border-[#E8E2DC]/70">
                  <p className="text-[11px] text-[#8C827A]">
                    <strong>Joined:</strong> {selectedUser.date_joined || "N/A"}
                  </p>
                  <p className="text-[11px] text-[#8C827A]">
                    <strong>Last Login:</strong> {selectedUser.last_login || "Never"}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-[#F1EDE8]">
              <button
                onClick={() => {
                  setDetailModalOpen(false);
                  openEditModal(selectedUser);
                }}
                className="px-4 py-2 bg-[#CFB9A3] text-white text-xs font-semibold rounded-xl hover:bg-[#bfa78f] transition-colors"
              >
                Manage Permissions & Suspension
              </button>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 bg-[#FAF7F4] border border-[#E8E2DC] text-[#1d1a17] text-xs font-medium rounded-xl hover:bg-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── UPDATE / SUSPENSION MODAL (Strictly administrative: role, active, block) ── */}
      {editModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#F1EDE8] relative">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F1EDE8]">
              <div>
                <h3 className="text-base font-bold text-[#1d1a17]">
                  Manage User Account
                </h3>
                <p className="text-xs text-[#8C827A] mt-0.5">
                  Update role, activation and account suspension for <strong>{editingUser.name || editingUser.email}</strong>.
                </p>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-1.5 rounded-lg text-[#8C827A] hover:text-[#1d1a17] hover:bg-[#FAF7F4]"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields (Strictly role, active status, block status - no password/email fields as requested) */}
            <div className="py-4 space-y-4 text-xs">
              {/* Target User Info Notice */}
              <div className="p-3 bg-[#FAF7F4] rounded-xl border border-[#F1EDE8] flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-[#1d1a17]">{editingUser.name || "User"}</p>
                  <p className="text-xs text-[#8C827A]">{editingUser.email}</p>
                </div>
                {editingUser.uid && (
                  <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-[#E8E2DC] text-[#6B6158]">
                    {editingUser.uid}
                  </span>
                )}
              </div>

              {/* Account Role */}
              <div>
                <label className="block text-xs font-semibold text-[#1d1a17] mb-1.5">
                  Account Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditRole("user")}
                    className={`py-2 px-3 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      editRole === "user"
                        ? "border-[#CFB9A3] bg-[#FAF7F4] text-[#1d1a17] font-semibold"
                        : "border-[#E8E2DC] text-[#8C827A] hover:bg-[#FAF7F4]"
                    }`}
                  >
                    <MdPerson className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs">Regular User</p>
                      <p className="text-[10px] text-[#A89F91]">Standard client</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditRole("admin")}
                    className={`py-2 px-3 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      editRole === "admin"
                        ? "border-purple-500 bg-purple-50 text-purple-900 font-semibold"
                        : "border-[#E8E2DC] text-[#8C827A] hover:bg-[#FAF7F4]"
                    }`}
                  >
                    <MdAdminPanelSettings className="w-4 h-4 text-purple-600" />
                    <div>
                      <p className="text-xs">Administrator</p>
                      <p className="text-[10px] text-purple-500/80">Full admin rights</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Suspension / Block Switch */}
              <div className="p-3 border border-[#F1EDE8] rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-semibold text-xs text-[#1d1a17]">Suspend / Block User</p>
                  <p className="text-[11px] text-[#8C827A]">
                    When blocked, the user is immediately prevented from accessing services.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={editBlock}
                    onChange={(e) => setEditBlock(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                </label>
              </div>

              {/* Active / Inactive Switch */}
              <div className="p-3 border border-[#F1EDE8] rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-semibold text-xs text-[#1d1a17]">Active Account</p>
                  <p className="text-[11px] text-[#8C827A]">
                    Activate or temporarily deactivate this account.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={editIsActive}
                    onChange={(e) => setEditIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#F1EDE8]">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                disabled={isUpdating}
                className="px-4 py-2 bg-[#FAF7F4] border border-[#E8E2DC] text-[#1d1a17] text-xs font-medium rounded-xl hover:bg-white transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={isUpdating}
                className="px-5 py-2 bg-[#CFB9A3] text-white text-xs font-semibold rounded-xl hover:bg-[#bfa78f] transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                {isUpdating && <HiOutlineRefresh className="w-3.5 h-3.5 animate-spin" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
