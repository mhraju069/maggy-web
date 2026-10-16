"use client";

import { useState, useEffect, useMemo } from "react";
import { servicesService, ServiceSlotsResponse, SaltRoomSlotItem, SharedSaunaSlot, PrivateSaunaSlot } from "@/lib/api/services/servicesService";
import { parseApiErrorMessage } from "@/lib/api/types";
import {
  FiCalendar,
  FiRefreshCw,
  FiCheckCircle,
  FiClock,
  FiUsers,
  FiAlertCircle,
  FiChevronRight,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { FaSpa, FaHotTub } from "react-icons/fa";
import { GiSaltShaker } from "react-icons/gi";
import { MdOutlineFitnessCenter, MdOutlineRestaurant } from "react-icons/md";

// Service configuration tab definitions
const SERVICES_CONFIG = [
  {
    id: "all",
    label: "All Services",
    icon: FiCalendar,
    description: "Complete overview of all wellness slots and occupancy",
  },
  {
    id: "private_sauna",
    label: "Private Sauna",
    icon: FaSpa,
    description: "Exclusive reservation slots (3-hour & 4-hour blocks with 30m cleaning buffer)",
  },
  {
    id: "shared_sauna",
    label: "Shared Sauna",
    icon: FaHotTub,
    description: "Public / Shared sessions (90-minute blocks with capacity tracking)",
  },
  {
    id: "saltroom",
    label: "Salt Room",
    icon: GiSaltShaker,
    description: "Halotherapy salt room sessions (45-60m sessions with remaining spots)",
  },
  {
    id: "activity",
    label: "Activities",
    icon: MdOutlineFitnessCenter,
    description: "Yoga, sound bath & guided wellness classes",
  },
  {
    id: "lunchroom",
    label: "Lunchroom",
    icon: MdOutlineRestaurant,
    description: "Dining area operating hours and table capacity",
  },
];

export default function AvailabilityPage() {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [activeTab, setActiveTab] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Raw data stores
  const [saunaSlotsRes, setSaunaSlotsRes] = useState<ServiceSlotsResponse | null>(null);
  const [saltRoomSlotsRes, setSaltRoomSlotsRes] = useState<ServiceSlotsResponse | null>(null);
  const [lunchroomSlotsRes, setLunchroomSlotsRes] = useState<ServiceSlotsResponse | null>(null);
  const [activitiesList, setActivitiesList] = useState<any[]>([]);

  // Fetch slot & capacity data across endpoints for the chosen date
  const loadSlotsData = async (dateVal: string, isRefresh = false) => {
    if (!dateVal) return;
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const [saunaRes, saltRes, lunchRes, actList] = await Promise.all([
        servicesService.getServiceSlots("sauna", dateVal).catch((err) => {
          console.warn("Error fetching sauna slots:", err);
          return null;
        }),
        servicesService.getServiceSlots("saltroom", dateVal).catch((err) => {
          console.warn("Error fetching saltroom slots:", err);
          return null;
        }),
        servicesService.getServiceSlots("lunchroom", dateVal).catch((err) => {
          console.warn("Error fetching lunchroom slots:", err);
          return null;
        }),
        servicesService.getActivities().catch((err) => {
          console.warn("Error fetching activities:", err);
          return [];
        }),
      ]);

      setSaunaSlotsRes(saunaRes);
      setSaltRoomSlotsRes(saltRes);
      setLunchroomSlotsRes(lunchRes);
      setActivitiesList(Array.isArray(actList) ? actList : []);
    } catch (err) {
      setError(parseApiErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSlotsData(selectedDate);
  }, [selectedDate]);

  // Quick Date Navigation Helpers
  const handleQuickDate = (offsetDays: number) => {
    const base = new Date(selectedDate || new Date());
    base.setDate(base.getDate() + offsetDays);
    setSelectedDate(base.toISOString().split("T")[0]);
  };

  const handleToday = () => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
  };

  // Format nice header date
  const formattedDateTitle = useMemo(() => {
    if (!selectedDate) return "";
    try {
      const [y, m, d] = selectedDate.split("-").map(Number);
      const dObj = new Date(y, m - 1, d);
      return dObj.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return selectedDate;
    }
  }, [selectedDate]);

  // Derived Private Sauna slots
  const privateSlots = useMemo(() => {
    const pData = saunaSlotsRes?.data?.private_sauna;
    const slots3 = pData?.slots?.["3_hours"] || [];
    const avail3 = pData?.available_slots?.["3_hours"] || [];
    const slots4 = pData?.slots?.["4_hours"] || [];
    const avail4 = pData?.available_slots?.["4_hours"] || [];

    const isSlotOpen = (s: PrivateSaunaSlot, availList: PrivateSaunaSlot[]) => {
      if ((s as any).is_available !== undefined) return Boolean((s as any).is_available);
      if ((s as any).is_booked !== undefined) return !((s as any).is_booked);
      // If available_slots is provided as a separate array, check presence
      if (availList.length > 0) {
        return availList.some((a) => a.start_time === s.start_time && a.end_time === s.end_time);
      }
      return true;
    };

    const list3 = (slots3.length > 0 ? slots3 : avail3).map((s) => ({
      ...s,
      isOpen: isSlotOpen(s, avail3),
    }));

    const list4 = (slots4.length > 0 ? slots4 : avail4).map((s) => ({
      ...s,
      isOpen: isSlotOpen(s, avail4),
    }));

    const all = [...list3, ...list4];
    return {
      threeHours: list3,
      fourHours: list4,
      total: all.length,
      available: all.filter((s) => s.isOpen).length,
      booked: all.filter((s) => !s.isOpen).length,
    };
  }, [saunaSlotsRes]);

  // Derived Shared Sauna slots
  const sharedSlots = useMemo(() => {
    const sData = saunaSlotsRes?.data?.shared_sauna;
    const list: SharedSaunaSlot[] = sData?.slots || [];
    let totalCap = 0;
    let bookedCap = 0;
    let availCap = 0;

    list.forEach((s) => {
      totalCap += s.max_capacity || 6;
      bookedCap += s.booked_capacity || 0;
      availCap += s.remaining_capacity ?? (s.max_capacity - (s.booked_capacity || 0));
    });

    return {
      list,
      totalSlots: list.length,
      availableSlotsCount: list.filter((s) => s.is_available && !s.is_fully_booked).length,
      totalCapacity: totalCap,
      bookedCapacity: bookedCap,
      remainingCapacity: availCap,
    };
  }, [saunaSlotsRes]);

  // Derived Salt Room slots
  const saltRoomSlots = useMemo(() => {
    const dataObj: any = saltRoomSlotsRes?.data || saltRoomSlotsRes;
    const rawList: SaltRoomSlotItem[] =
      dataObj?.slots || dataObj?.saltroom?.slots || dataObj?.available_slots || [];

    let totalCap = 0;
    let bookedCap = 0;
    let availCap = 0;

    rawList.forEach((s) => {
      const maxC = s.max_capacity || 2;
      const rem =
        typeof s.remaining_capacity === "number"
          ? s.remaining_capacity
          : typeof s.available_capacity === "number"
          ? s.available_capacity
          : s.is_booked
          ? 0
          : maxC;
      const bkd = s.booked_capacity ?? Math.max(0, maxC - rem);
      totalCap += maxC;
      bookedCap += bkd;
      availCap += rem;
    });

    return {
      list: rawList,
      totalSlots: rawList.length,
      availableSlotsCount: rawList.filter((s) => s.is_available && !s.is_booked && !s.is_fully_booked).length,
      totalCapacity: totalCap,
      bookedCapacity: bookedCap,
      remainingCapacity: availCap,
    };
  }, [saltRoomSlotsRes]);

  // Derived Activities for the date
  const filteredActivities = useMemo(() => {
    return activitiesList.filter((act) => {
      if (!act.date) return true; // show recurring if no specific date
      return act.date.split("T")[0] === selectedDate;
    });
  }, [activitiesList, selectedDate]);

  // Overall metrics summary
  const summaryMetrics = useMemo(() => {
    const totalAvailSlots =
      privateSlots.available +
      sharedSlots.availableSlotsCount +
      saltRoomSlots.availableSlotsCount +
      filteredActivities.filter((a) => (a.available_slots ?? a.capacity) > 0).length;

    const totalBookedSlots =
      privateSlots.booked +
      (sharedSlots.totalSlots - sharedSlots.availableSlotsCount) +
      (saltRoomSlots.totalSlots - saltRoomSlots.availableSlotsCount) +
      filteredActivities.filter((a) => (a.available_slots ?? a.capacity) === 0).length;

    return {
      totalAvailSlots,
      totalBookedSlots,
      allSlotsCount: totalAvailSlots + totalBookedSlots,
    };
  }, [privateSlots, sharedSlots, saltRoomSlots, filteredActivities]);

  return (
    <div className="space-y-6">
      {/* ── Page Header & Date Filter Bar ── */}
      <div className="bg-white rounded-2xl border border-[#E8E2DC] p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B7355]">
                Real-Time Schedule & Capacity
              </span>
            </div>
            <h1 className="font-displayPlayFair text-2xl md:text-3xl font-bold text-[#1d1a17] mt-0.5">
              Availability &amp; Slots Manager
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Inspect time slots, remaining capacities, and booking status across all wellness services for any selected date.
            </p>
          </div>

          {/* Date Selector & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center bg-[#FDFBF9] border border-[#E8E2DC] rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#CFB9A3]">
              <FiCalendar className="text-[#8B7355] mr-2 flex-shrink-0" size={16} />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs font-semibold text-[#1d1a17] focus:outline-none cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-1 bg-[#F5F0EB]/60 p-1 rounded-xl border border-[#E8E2DC]">
              <button
                type="button"
                onClick={() => handleQuickDate(-1)}
                className="px-2.5 py-1 text-xs font-semibold text-gray-600 hover:text-black hover:bg-white rounded-lg transition-colors"
                title="Previous Day"
              >
                ← Prev
              </button>
              <button
                type="button"
                onClick={handleToday}
                className="px-2.5 py-1 text-xs font-bold text-[#8B7355] bg-white rounded-lg shadow-xs transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => handleQuickDate(1)}
                className="px-2.5 py-1 text-xs font-semibold text-gray-600 hover:text-black hover:bg-white rounded-lg transition-colors"
                title="Next Day"
              >
                Next →
              </button>
            </div>

            <button
              type="button"
              onClick={() => loadSlotsData(selectedDate, true)}
              disabled={loading || refreshing}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#CFB9A3] hover:bg-[#8B7355] text-white text-xs font-semibold rounded-xl transition-all shadow-xs disabled:opacity-50"
            >
              <FiRefreshCw className={refreshing ? "animate-spin" : ""} size={14} />
              <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
            </button>
          </div>
        </div>

        {/* Selected Date Indicator Banner */}
        <div className="mt-4 pt-4 border-t border-[#F5F0EB] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Displaying Slots for:</span>
            <span className="font-bold text-[#8B7355] bg-[#FCF2E9] px-2.5 py-1 rounded-lg border border-[#E8E2DC]">
              📅 {formattedDateTitle}
            </span>
          </div>

          <div className="flex items-center gap-4 text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Available / Open Spots
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Limited / Filling Up
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Fully Booked / Closed
            </span>
          </div>
        </div>
      </div>

      {/* ── Summary KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Private Sauna KPI */}
        <div className="bg-white rounded-2xl p-4 border border-[#E8E2DC] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Private Sauna</span>
            <div className="w-8 h-8 rounded-xl bg-[#FCF2E9] text-[#8B7355] flex items-center justify-center">
              <FaSpa size={15} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-displayPlayFair text-[#1d1a17]">
              {privateSlots.available}
            </span>
            <span className="text-xs text-gray-400">/ {privateSlots.total || 0} slots free</span>
          </div>
          <div className="mt-3 w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#8B7355] h-full rounded-full transition-all"
              style={{
                width: `${privateSlots.total ? (privateSlots.booked / privateSlots.total) * 100 : 0}%`,
              }}
            />
          </div>
          <p className="text-[11px] text-gray-500 mt-2 flex justify-between">
            <span>{privateSlots.booked} reserved</span>
            <span className="text-emerald-700 font-semibold">{privateSlots.available} available</span>
          </p>
        </div>

        {/* Shared Sauna KPI */}
        <div className="bg-white rounded-2xl p-4 border border-[#E8E2DC] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Shared Sauna</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FaHotTub size={15} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-displayPlayFair text-[#1d1a17]">
              {sharedSlots.remainingCapacity}
            </span>
            <span className="text-xs text-gray-400">
              / {sharedSlots.totalCapacity || 0} spots open
            </span>
          </div>
          <div className="mt-3 w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all"
              style={{
                width: `${
                  sharedSlots.totalCapacity
                    ? (sharedSlots.bookedCapacity / sharedSlots.totalCapacity) * 100
                    : 0
                }%`,
              }}
            />
          </div>
          <p className="text-[11px] text-gray-500 mt-2 flex justify-between">
            <span>{sharedSlots.totalSlots} time sessions</span>
            <span className="text-blue-700 font-semibold">{sharedSlots.availableSlotsCount} open sessions</span>
          </p>
        </div>

        {/* Salt Room KPI */}
        <div className="bg-white rounded-2xl p-4 border border-[#E8E2DC] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Salt Room</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <GiSaltShaker size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-displayPlayFair text-[#1d1a17]">
              {saltRoomSlots.remainingCapacity}
            </span>
            <span className="text-xs text-gray-400">
              / {saltRoomSlots.totalCapacity || 0} spots free
            </span>
          </div>
          <div className="mt-3 w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all"
              style={{
                width: `${
                  saltRoomSlots.totalCapacity
                    ? (saltRoomSlots.bookedCapacity / saltRoomSlots.totalCapacity) * 100
                    : 0
                }%`,
              }}
            />
          </div>
          <p className="text-[11px] text-gray-500 mt-2 flex justify-between">
            <span>{saltRoomSlots.totalSlots} session slots</span>
            <span className="text-purple-700 font-semibold">{saltRoomSlots.availableSlotsCount} active</span>
          </p>
        </div>

        {/* Activities KPI */}
        <div className="bg-white rounded-2xl p-4 border border-[#E8E2DC] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Activities</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <MdOutlineFitnessCenter size={17} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-displayPlayFair text-[#1d1a17]">
              {filteredActivities.reduce((acc, a) => acc + (a.available_slots ?? a.capacity ?? 0), 0)}
            </span>
            <span className="text-xs text-gray-400">places open today</span>
          </div>
          <div className="mt-3 w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-600 h-full rounded-full transition-all"
              style={{
                width: `${
                  filteredActivities.length > 0
                    ? 50
                    : 0
                }%`,
              }}
            />
          </div>
          <p className="text-[11px] text-gray-500 mt-2 flex justify-between">
            <span>{filteredActivities.length} scheduled classes</span>
            <span className="text-amber-800 font-semibold">Active</span>
          </p>
        </div>
      </div>

      {/* ── Navigation Service Filter Tabs ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E8E2DC]">
        {SERVICES_CONFIG.map((srv) => {
          const Icon = srv.icon;
          const isActive = activeTab === srv.id;
          return (
            <button
              key={srv.id}
              type="button"
              onClick={() => setActiveTab(srv.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-[#8B7355] text-white shadow-sm ring-2 ring-[#8B7355]/20"
                  : "bg-white text-gray-600 hover:text-gray-900 border border-[#E8E2DC] hover:border-gray-400"
              }`}
            >
              <Icon size={15} />
              <span>{srv.label}</span>
            </button>
          );
        })}
      </div>

      {/* Loading state indicator */}
      {loading && (
        <div className="bg-white rounded-2xl p-12 border border-[#E8E2DC] text-center shadow-xs">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-[#8B7355] border-t-transparent mb-3"></div>
          <p className="text-sm font-semibold text-gray-700">Querying live slots &amp; capacity for {selectedDate}...</p>
          <p className="text-xs text-gray-400 mt-1">Connecting to services slot APIs</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-800 flex items-center gap-3">
          <FiAlertCircle className="text-rose-600 flex-shrink-0" size={18} />
          <div>
            <span className="font-bold">Error loading slot information: </span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* ── Content Sections Based on Active Filter Tab ── */}
      {!loading && (
        <div className="space-y-6">
          {/* SECTION 1: PRIVATE SAUNA */}
          {(activeTab === "all" || activeTab === "private_sauna") && (
            <div className="bg-white rounded-2xl border border-[#E8E2DC] p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F5F0EB] gap-2 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FCF2E9] text-[#8B7355] flex items-center justify-center flex-shrink-0 shadow-xs">
                    <FaSpa size={18} />
                  </div>
                  <div>
                    <h3 className="font-displayPlayFair text-lg font-bold text-[#1d1a17]">
                      Private Sauna Slots
                    </h3>
                    <p className="text-xs text-gray-500">
                      Exclusive group booking blocks (Max 6 guests per group • Includes 30m automatic cleaning buffer)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FCF2E9] text-[#8B7355] border border-[#E8E2DC]">
                    {privateSlots.available} Available / {privateSlots.total} Total
                  </span>
                </div>
              </div>

              {saunaSlotsRes?.is_blocked ? (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold flex items-center gap-2">
                  <FiAlertCircle size={16} />
                  <span>Private sauna is administratively blocked for this date.</span>
                </div>
              ) : privateSlots.total === 0 ? (
                <div className="p-6 bg-[#FAF7F2] rounded-xl text-center text-xs text-gray-500 border border-[#E8E2DC]">
                  No private sauna slots found for {formattedDateTitle}.
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 3 Hours Section */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2 flex items-center gap-1.5">
                      <FiClock size={13} className="text-[#8B7355]" /> 3-Hour Private Sessions
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {privateSlots.threeHours.map((slot, idx) => (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-xl border transition-all ${
                            slot.isOpen
                              ? "bg-white border-[#E8E2DC] hover:border-[#8B7355]"
                              : "bg-gray-50/80 border-gray-200 opacity-60"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-displayPlayFair font-bold text-sm text-[#1d1a17]">
                              {slot.start_time} – {slot.end_time}
                            </span>
                            {slot.isOpen ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                                Open (Capacity 6)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                                Booked
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-500 flex items-center justify-between">
                            <span>Cleaning Buffer:</span>
                            <span className="font-mono font-medium text-gray-700">until {slot.buffer_end_time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4 Hours Section */}
                  {privateSlots.fourHours.length > 0 && (
                    <div className="pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2 flex items-center gap-1.5">
                        <FiClock size={13} className="text-[#8B7355]" /> 4-Hour Extended Sessions
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {privateSlots.fourHours.map((slot, idx) => (
                          <div
                            key={idx}
                            className={`p-3.5 rounded-xl border transition-all ${
                              slot.isOpen
                                ? "bg-white border-[#E8E2DC] hover:border-[#8B7355]"
                                : "bg-gray-50/80 border-gray-200 opacity-60"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-displayPlayFair font-bold text-sm text-[#1d1a17]">
                                {slot.start_time} – {slot.end_time}
                              </span>
                              {slot.isOpen ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                                  Open (Capacity 6)
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                                  Booked
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-gray-500 flex items-center justify-between">
                              <span>Cleaning Buffer:</span>
                              <span className="font-mono font-medium text-gray-700">until {slot.buffer_end_time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* SECTION 2: SHARED SAUNA */}
          {(activeTab === "all" || activeTab === "shared_sauna") && (
            <div className="bg-white rounded-2xl border border-[#E8E2DC] p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F5F0EB] gap-2 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 shadow-xs">
                    <FaHotTub size={18} />
                  </div>
                  <div>
                    <h3 className="font-displayPlayFair text-lg font-bold text-[#1d1a17]">
                      Shared Sauna Slots &amp; Occupancy
                    </h3>
                    <p className="text-xs text-gray-500">
                      90-minute public wellness sessions with individual seat availability (Max {sharedSlots.list[0]?.max_capacity || 7} persons per slot)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                    {sharedSlots.remainingCapacity} Spots Remaining ({sharedSlots.bookedCapacity} Booked)
                  </span>
                </div>
              </div>

              {sharedSlots.list.length === 0 ? (
                <div className="p-6 bg-[#FAF7F2] rounded-xl text-center text-xs text-gray-500 border border-[#E8E2DC]">
                  No shared sauna slots scheduled for {formattedDateTitle}.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {sharedSlots.list.map((slot, idx) => {
                    const maxCap = slot.max_capacity || 7;
                    const remCap = slot.remaining_capacity ?? (maxCap - (slot.booked_capacity || 0));
                    const bookedCap = slot.booked_capacity ?? Math.max(0, maxCap - remCap);
                    const isSoldOut = slot.is_fully_booked || remCap <= 0;
                    const fillPercent = Math.min(100, Math.round((bookedCap / maxCap) * 100));

                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border transition-all ${
                          isSoldOut
                            ? "bg-gray-50/70 border-gray-200 opacity-70"
                            : "bg-white border-[#E8E2DC] hover:border-blue-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-displayPlayFair font-bold text-sm text-[#1d1a17]">
                            {slot.start_time} – {slot.end_time}
                          </span>
                          {isSoldOut ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                              Fully Booked
                            </span>
                          ) : (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                remCap <= 2
                                  ? "bg-amber-50 text-amber-800 border-amber-300"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-300"
                              }`}
                            >
                              {remCap} of {maxCap} spots free
                            </span>
                          )}
                        </div>

                        {/* Progress Bar of Occupancy */}
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden my-2">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isSoldOut ? "bg-rose-500" : remCap <= 2 ? "bg-amber-500" : "bg-blue-600"
                            }`}
                            style={{ width: `${fillPercent}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2">
                          <span>Occupancy: {bookedCap}/{maxCap} guests ({fillPercent}%)</span>
                          {slot.buffer_end_time && (
                            <span className="text-[10px] text-gray-400">Buffer to {slot.buffer_end_time}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SECTION 3: SALT ROOM */}
          {(activeTab === "all" || activeTab === "saltroom") && (
            <div className="bg-white rounded-2xl border border-[#E8E2DC] p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F5F0EB] gap-2 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 shadow-xs">
                    <GiSaltShaker size={18} />
                  </div>
                  <div>
                    <h3 className="font-displayPlayFair text-lg font-bold text-[#1d1a17]">
                      Salt Room (Halotherapy) Slots
                    </h3>
                    <p className="text-xs text-gray-500">
                      Halotherapy sessions with live seat capacity and automatic changeover buffer
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                    {saltRoomSlots.remainingCapacity} Free Spots ({saltRoomSlots.bookedCapacity} Booked)
                  </span>
                </div>
              </div>

              {saltRoomSlotsRes?.is_blocked ? (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold flex items-center gap-2">
                  <FiAlertCircle size={16} />
                  <span>Salt room is blocked for reservations on this date.</span>
                </div>
              ) : saltRoomSlots.list.length === 0 ? (
                <div className="p-6 bg-[#FAF7F2] rounded-xl text-center text-xs text-gray-500 border border-[#E8E2DC]">
                  No salt room sessions scheduled for {formattedDateTitle}.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {saltRoomSlots.list.map((slot, idx) => {
                    const rawStart = (slot.start_time || slot.time || "09:00").slice(0, 5);
                    const rawEnd = (slot.end_time || "").slice(0, 5);
                    const timeLabel = rawEnd ? `${rawStart} – ${rawEnd}` : rawStart;
                    const maxCap = slot.max_capacity || 2;
                    const remCap =
                      typeof slot.remaining_capacity === "number"
                        ? slot.remaining_capacity
                        : typeof slot.available_capacity === "number"
                        ? slot.available_capacity
                        : slot.is_booked
                        ? 0
                        : maxCap;
                    const booked = slot.booked_capacity ?? Math.max(0, maxCap - remCap);
                    const isSoldOut = slot.is_booked || slot.is_fully_booked || remCap <= 0;

                    return (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isSoldOut
                            ? "bg-gray-50/70 border-gray-200 opacity-60"
                            : "bg-white border-[#E8E2DC] hover:border-purple-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-displayPlayFair font-bold text-sm text-[#1d1a17]">
                            {timeLabel}
                          </span>
                          {isSoldOut ? (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-100 text-rose-700">
                              Full
                            </span>
                          ) : (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                                remCap === 1
                                  ? "bg-amber-50 text-amber-800 border-amber-300"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-300"
                              }`}
                            >
                              {remCap}/{maxCap} free
                            </span>
                          )}
                        </div>

                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden my-2">
                          <div
                            className={`h-full rounded-full ${isSoldOut ? "bg-rose-500" : "bg-purple-600"}`}
                            style={{ width: `${(booked / maxCap) * 100}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-gray-500">
                          <span>{slot.duration_minutes || 45} mins</span>
                          <span>Buffer: {slot.buffer_end_time || "+10m"}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SECTION 4: ACTIVITIES */}
          {(activeTab === "all" || activeTab === "activity") && (
            <div className="bg-white rounded-2xl border border-[#E8E2DC] p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F5F0EB] gap-2 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 shadow-xs">
                    <MdOutlineFitnessCenter size={18} />
                  </div>
                  <div>
                    <h3 className="font-displayPlayFair text-lg font-bold text-[#1d1a17]">
                      Wellness Activities &amp; Masterclasses
                    </h3>
                    <p className="text-xs text-gray-500">
                      Yoga, meditation, breathwork &amp; sound bath sessions scheduled on this date
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    {filteredActivities.length} Classes Scheduled
                  </span>
                </div>
              </div>

              {filteredActivities.length === 0 ? (
                <div className="p-6 bg-[#FAF7F2] rounded-xl text-center text-xs text-gray-500 border border-[#E8E2DC]">
                  No activities or classes registered for {formattedDateTitle}.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredActivities.map((act) => {
                    const maxCap = act.capacity ?? act.max_participants ?? 12;
                    const booked = act.booked_slots ?? act.booked_participants ?? 0;
                    const avail = act.available_slots !== undefined ? act.available_slots : Math.max(0, maxCap - booked);
                    const isFull = avail <= 0;
                    const pct = Math.min(100, Math.round((booked / maxCap) * 100));

                    return (
                      <div
                        key={act.id}
                        className="bg-white border border-[#E8E2DC] rounded-xl p-4 hover:border-amber-400 transition-all shadow-xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-bold text-sm text-[#1d1a17] font-displayPlayFair">
                              {act.title || act.name}
                            </h4>
                            {isFull ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 flex-shrink-0">
                                Sold Out
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 flex-shrink-0">
                                {avail} spots left
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1.5">
                            <FiClock size={12} className="text-[#8B7355]" />
                            <span>
                              {act.open_time?.slice(0, 5) || act.startTime || "10:00"} –{" "}
                              {act.close_time?.slice(0, 5) || act.endTime || "11:30"}
                            </span>
                            {act.host && (
                              <span className="text-gray-400">• Host: {act.host}</span>
                            )}
                          </p>

                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden my-2">
                            <div
                              className="h-full bg-amber-600 rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-[#F5F0EB] mt-2">
                          <span>Capacity: {booked}/{maxCap} booked</span>
                          <span className="font-bold text-[#8B7355]">€{act.price || 40}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SECTION 5: LUNCHROOM */}
          {(activeTab === "all" || activeTab === "lunchroom") && (
            <div className="bg-white rounded-2xl border border-[#E8E2DC] p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F5F0EB] gap-2 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 shadow-xs">
                    <MdOutlineRestaurant size={18} />
                  </div>
                  <div>
                    <h3 className="font-displayPlayFair text-lg font-bold text-[#1d1a17]">
                      Lunchroom &amp; Dining Area
                    </h3>
                    <p className="text-xs text-gray-500">
                      Operating hours and seating availability (Wednesdays to Sundays: 09:00 – 16:00)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                      lunchroomSlotsRes?.is_closed
                        ? "bg-amber-50 text-amber-800 border-amber-300"
                        : "bg-emerald-50 text-emerald-800 border-emerald-300"
                    }`}
                  >
                    {lunchroomSlotsRes?.is_closed ? "Closed on this date" : "Open for Dining"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2DC]">
                  <span className="text-[11px] font-semibold text-gray-500 block mb-1 uppercase tracking-wider">
                    Operating Hours
                  </span>
                  <span className="text-base font-bold text-[#1d1a17]">
                    {lunchroomSlotsRes?.open_time || (lunchroomSlotsRes?.data as any)?.open_time || "09:00"} –{" "}
                    {lunchroomSlotsRes?.close_time || (lunchroomSlotsRes?.data as any)?.close_time || "16:00"}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2DC]">
                  <span className="text-[11px] font-semibold text-gray-500 block mb-1 uppercase tracking-wider">
                    Service Status
                  </span>
                  <span className="text-base font-bold text-emerald-700">
                    {lunchroomSlotsRes?.is_closed ? "Closed" : "Available to Guests"}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2DC]">
                  <span className="text-[11px] font-semibold text-gray-500 block mb-1 uppercase tracking-wider">
                    Notice
                  </span>
                  <span className="text-xs text-gray-600">
                    {(lunchroomSlotsRes?.data as any)?.info || "Lunchroom accommodates flexible dining during open hours."}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
