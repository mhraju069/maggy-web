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

interface NotificationBellProps {
  className?: string;
}

export default function NotificationBell({ className = "" }: NotificationBellProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isWsConnected, setIsWsConnected] = useState<boolean>(false);

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
  const fetchNotificationsList = useCallback(async (isReadFilter?: boolean) => {
    try {
      const token = getStoredToken();
      if (!token) return;
      setLoading(true);
      const params = isReadFilter !== undefined ? { is_read: !isReadFilter ? false : undefined } : undefined;
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
  }, []);

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
      fetchNotificationsList(filter === "unread" ? false : undefined);
    }
  }, [isOpen, filter, fetchNotificationsList]);

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
              <h3 className="font-semibold text-[#1d1a17] text-base">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-[#CFB9A3]/20 text-[#8B6E4E] text-xs font-semibold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-[#8B6E4E] hover:text-[#72573a] font-medium flex items-center gap-1 hover:underline cursor-pointer"
              >
                <HiOutlineCheck className="w-3.5 h-3.5" />
                Mark all as read
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
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`py-2.5 px-3 font-medium border-b-2 transition-colors cursor-pointer ${
                filter === "unread"
                  ? "border-[#CFB9A3] text-[#1d1a17] font-semibold"
                  : "border-transparent text-[#64748B] hover:text-[#1d1a17]"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-[#F8F4F0]">
            {loading && notifications.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-[#94A3B8]">
                <div className="w-6 h-6 border-2 border-[#CFB9A3] border-t-transparent rounded-full animate-spin mb-2" />
                <span className="text-xs">Loading notifications...</span>
              </div>
            ) : displayedNotifications.length === 0 ? (
              <div className="py-12 px-4 flex flex-col items-center justify-center text-center text-[#94A3B8]">
                <HiOutlineInbox className="w-10 h-10 mb-2 stroke-1 text-[#CBD5E1]" />
                <p className="text-sm font-medium text-[#64748B]">No notifications found</p>
                <p className="text-xs text-[#94A3B8] mt-1">
                  {filter === "unread" ? "You have read all your notifications." : "You're all caught up!"}
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
                      <p
                        className={`text-sm ${
                          !item.is_read ? "font-semibold text-[#1d1a17]" : "font-medium text-[#475569]"
                        } line-clamp-1`}
                      >
                        {item.title}
                      </p>
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
                        <span>View details</span>
                        <HiOutlineExternalLink className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  {/* Action: Mark single as read */}
                  {!item.is_read && (
                    <button
                      onClick={(e) => handleMarkAsRead(item, e)}
                      title="Mark as read"
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
              {isWsConnected ? "● Real-time updates active" : "○ Real-time connecting..."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
