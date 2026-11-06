"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  HiOutlineBell,
  HiOutlineCheck,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineExternalLink,
  HiOutlineInbox,
} from "react-icons/hi";
import { getStoredToken } from "@/lib/api/token";
import { buildWebSocketUrl } from "@/lib/api/config";
import {
  notificationService,
  NotificationItem,
} from "@/lib/api/services/notificationService";
import BookingDetailsModal, { BookingModalData } from "./BookingDetailsModal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface NotificationBellProps {
  className?: string;
  scope?: "admin" | "user" | "all";
}

export default function NotificationBell({ className = "", scope }: NotificationBellProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const notifTrans = (t as any)?.commonUI?.notifications || {};
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [scopeFilter, setScopeFilter] = useState<"all" | "admin" | "user">(scope || "all");
  const [isWsConnected, setIsWsConnected] = useState<boolean>(false);

  // Booking detail modal state
  const [selectedBookingId, setSelectedBookingId] = useState<string | number | null>(null);
  const [modalBookingData, setModalBookingData] = useState<BookingModalData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch initial unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const token = getStoredToken();
      if (!token) return;
      const res = await notificationService.getUnreadCount();
      if (typeof res?.unread_count === "number") {
        setUnreadCount(res.unread_count);
      }
    } catch (err) {
      console.warn("Failed to fetch unread count:", err);
    }
  }, []);

  // Fetch notifications list
  const fetchNotificationsList = useCallback(async (isReadFilter?: boolean, activeScope?: "admin" | "user" | "all") => {
    try {
      const token = getStoredToken();
      if (!token) return;
      setLoading(true);
      const params: any = {};
      if (isReadFilter !== undefined) {
        params.is_read = !isReadFilter ? false : undefined;
      }
      const targetScope = activeScope || scope;
      if (targetScope && targetScope !== "all") {
        params.scope = targetScope;
      }
      const res = await notificationService.getNotifications(params);
      if (res?.notifications) {
        setNotifications(res.notifications);
      }
      if (typeof res?.unread_count === "number") {
        setUnreadCount(res.unread_count);
      }
    } catch (err) {
      console.warn("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [scope]);

  // WebSocket Connection Handler
  useEffect(() => {
    let isMounted = true;

    const connectWebSocket = () => {
      const token = getStoredToken();
      if (!token) return;

      try {
        const wsUrl = buildWebSocketUrl("/ws/notifications/", token);
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          if (!isMounted) return;
          setIsWsConnected(true);
        };

        ws.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.data);
            
            // Connection established event
            if (data.type === "connection_established") {
              // Successfully connected to backend notifications
            }

            // Real-time notification event
            if (data.type === "notification" && data.data) {
              const newNotification = data.data.notification as NotificationItem;
              if (newNotification) {
                setNotifications((prev) => [newNotification, ...prev]);
              }
              if (typeof data.data.unread_count === "number") {
                setUnreadCount(data.data.unread_count);
              } else {
                setUnreadCount((prev) => prev + 1);
              }
            }
          } catch (e) {
            console.error("Error parsing notification ws message:", e);
          }
        };

        ws.onclose = () => {
          if (!isMounted) return;
          setIsWsConnected(false);
          // Try reconnecting after 5 seconds if token exists
          if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = setTimeout(() => {
            if (isMounted) connectWebSocket();
          }, 5000);
        };

        ws.onerror = (err) => {
          console.warn("Notification WebSocket warning:", err);
          ws.close();
        };
      } catch (err) {
        console.warn("WebSocket initialization error:", err);
      }
    };

    fetchUnreadCount();
    connectWebSocket();

    return () => {
      isMounted = false;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [fetchUnreadCount]);

  // Load notifications when dropdown opens or filter changes
  useEffect(() => {
    if (isOpen) {
      fetchNotificationsList(filter === "unread" ? false : undefined, scopeFilter);
    }
  }, [isOpen, filter, scopeFilter, fetchNotificationsList]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mark a single notification as read
  const handleMarkAsRead = async (notification: NotificationItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (notification.is_read) return;

    try {
      const res = await notificationService.markAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
      );
      if (typeof res.unread_count === "number") {
        setUnreadCount(res.unread_count);
      } else {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.warn("Failed to mark as read:", err);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      const res = await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      if (typeof res.unread_count === "number") {
        setUnreadCount(res.unread_count);
      } else {
        setUnreadCount(0);
      }
    } catch (err) {
      console.warn("Failed to mark all as read:", err);
    }
  };

  // Handle click on a notification item
  const handleNotificationClick = async (notification: NotificationItem) => {
    if (!notification.is_read) {
      await handleMarkAsRead(notification);
    }
    setIsOpen(false);

    // Extract booking ID from data or link (supports both /bookings/ID and /admin/bookings/ID)
    let bookingIdFromData =
      notification.data?.booking_id ||
      notification.data?.id ||
      null;

    if (!bookingIdFromData && notification.link) {
      const match = notification.link.match(/(?:\/admin)?\/bookings\/([A-Za-z0-9_-]+)/);
      if (match && match[1]) {
        bookingIdFromData = match[1];
      }
    }

    // If it's a booking notification or has a booking reference, open modal directly
    if (bookingIdFromData || notification.notification_type === "booking" || notification.notification_type === "reminder") {
      setSelectedBookingId(bookingIdFromData || notification.id);
      setModalBookingData({
        booking_id: bookingIdFromData || "",
        title: notification.title,
        body: notification.body,
        service_name: notification.data?.type || notification.data?.service_name || notification.title,
        service_type: notification.data?.type || notification.notification_type,
        date: notification.data?.date,
        time: notification.data?.time,
        ...(notification.data || {}),
      });
      setIsModalOpen(true);
      return;
    }

    if (notification.link) {
      router.push(notification.link);
    }
  };

  // Format relative time helper
  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  };

  const displayedNotifications =
    filter === "unread" ? notifications.filter((n) => !n.is_read) : notifications;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 rounded-xl text-[#64748B] hover:text-[#1d1a17] hover:bg-[#F8F4F0] transition-colors focus:outline-none cursor-pointer"
        aria-label="Notifications"
        title={isWsConnected ? "Notifications (Live Connected)" : "Notifications"}
      >
        <HiOutlineBell className="w-5 h-5 sm:w-6 sm:h-6" />

        {/* Unread badge count */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}

        {/* Small live connection indicator dot */}
        {isWsConnected && (
          <span
            className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-500 border border-white"
            title="Real-time connected"
          />
        )}
      </button>

      {/* Notification Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[340px] sm:w-[400px] max-w-[90vw] bg-white rounded-2xl shadow-xl border border-[#F1EDE8] z-50 overflow-hidden flex flex-col font-cambria animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 border-b border-[#F1EDE8] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[#1d1a17] text-base">{notifTrans.title || "Notifications"}</h3>
              {unreadCount > 0 && (
                <span className="bg-[#CFB9A3]/20 text-[#8B6E4E] text-xs font-semibold px-2 py-0.5 rounded-full">
                  {(notifTrans.newCount || "{count} new").replace("{count}", String(unreadCount))}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-[#8B6E4E] hover:text-[#72573a] font-medium flex items-center gap-1 hover:underline cursor-pointer"
              >
                <HiOutlineCheck className="w-3.5 h-3.5" />
                {notifTrans.markAllAsRead || "Mark all as read"}
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-[#F1EDE8] px-4 bg-[#FAF7F4] text-xs">
            <button
              onClick={() => setFilter("all")}
              className={`py-2.5 px-3 font-medium border-b-2 transition-colors cursor-pointer ${
                filter === "all"
                  ? "border-[#CFB9A3] text-[#1d1a17] font-semibold"
                  : "border-transparent text-[#64748B] hover:text-[#1d1a17]"
              }`}
            >
              {notifTrans.all || "All"} ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`py-2.5 px-3 font-medium border-b-2 transition-colors cursor-pointer ${
                filter === "unread"
                  ? "border-[#CFB9A3] text-[#1d1a17] font-semibold"
                  : "border-transparent text-[#64748B] hover:text-[#1d1a17]"
              }`}
            >
              {notifTrans.unread || "Unread"} ({unreadCount})
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-[#F8F4F0]">
            {loading && notifications.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-[#94A3B8]">
                <div className="w-6 h-6 border-2 border-[#CFB9A3] border-t-transparent rounded-full animate-spin mb-2" />
                <span className="text-xs">{notifTrans.loading || "Loading notifications..."}</span>
              </div>
            ) : displayedNotifications.length === 0 ? (
              <div className="py-12 px-4 flex flex-col items-center justify-center text-center text-[#94A3B8]">
                <HiOutlineInbox className="w-10 h-10 mb-2 stroke-1 text-[#CBD5E1]" />
                <p className="text-sm font-medium text-[#64748B]">{notifTrans.emptyTitle || "No notifications found"}</p>
                <p className="text-xs text-[#94A3B8] mt-1">
                  {filter === "unread" ? (notifTrans.allReadMsg || "You have read all your notifications.") : (notifTrans.allCaughtUp || "You're all caught up!")}
                </p>
              </div>
            ) : (
              displayedNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-4 flex items-start gap-3 transition-colors cursor-pointer hover:bg-[#F8F4F0] ${
                    !item.is_read ? "bg-[#FAF7F4]" : "bg-white"
                  }`}
                >
                  {/* Indicator Dot / Status Icon */}
                  <div className="mt-1 flex-shrink-0">
                    {!item.is_read ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#CFB9A3] block ring-4 ring-[#CFB9A3]/20" />
                    ) : (
                      <HiOutlineCheckCircle className="w-4 h-4 text-[#CBD5E1]" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                        <p
                          className={`text-sm ${
                            !item.is_read ? "font-semibold text-[#1d1a17]" : "font-medium text-[#475569]"
                          } line-clamp-1`}
                        >
                          {item.title}
                        </p>
                        {item.audience === "admin" && (
                          <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-md">
                            Admin
                          </span>
                        )}
                        {item.notification_type === "reminder" && (
                          <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded-md">
                            Reminder
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#94A3B8] flex-shrink-0 flex items-center gap-1">
                        <HiOutlineClock className="w-3 h-3" />
                        {formatTime(item.created_at)}
                      </span>
                    </div>

                    <p className="text-xs text-[#64748B] mt-1 line-clamp-2 leading-relaxed">
                      {item.body}
                    </p>

                    {item.link && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] text-[#8B6E4E] font-medium">
                        <span>{notifTrans.viewDetails || "View details"}</span>
                        <HiOutlineExternalLink className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  {/* Action: Mark single as read */}
                  {!item.is_read && (
                    <button
                      onClick={(e) => handleMarkAsRead(item, e)}
                      title={notifTrans.markAllAsRead || "Mark as read"}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#E8E2DC] rounded text-[#64748B] hover:text-[#1d1a17] transition-all cursor-pointer"
                    >
                      <HiOutlineCheck className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 border-t border-[#F1EDE8] bg-[#FAF7F4] text-center">
            <span className="text-[11px] text-[#94A3B8]">
              {isWsConnected ? (notifTrans.realtimeActive || "● Real-time updates active") : (notifTrans.realtimeConnecting || "○ Real-time connecting...")}
            </span>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      <BookingDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBookingId(null);
          setModalBookingData(null);
        }}
        bookingId={selectedBookingId}
        initialData={modalBookingData}
      />
    </div>
  );
}
