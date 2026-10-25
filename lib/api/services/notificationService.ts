import ApiClient from "../client";
import { ENDPOINTS } from "../endpoints";

export interface NotificationItem {
  id: number;
  title: string;
  body: string;
  notification_type?: string;
  audience?: "user" | "admin" | "all" | string;
  link?: string | null;
  data?: Record<string, any>;
  is_read: boolean;
  read_at?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface NotificationListResponse {
  unread_count: number;
  total_count: number;
  notifications: NotificationItem[];
}

export interface UnreadCountResponse {
  unread_count: number;
}

export interface MarkReadResponse {
  message: string;
  unread_count: number;
}

export interface MarkAllReadResponse {
  message: string;
  updated_count: number;
  unread_count: number;
}

export interface NotificationFilterParams {
  is_read?: boolean;
  type?: string;
  scope?: "admin" | "user" | "all";
}

export const notificationService = {
  /**
   * Fetch notification list and history
   */
  getNotifications: async (params?: NotificationFilterParams): Promise<NotificationListResponse> => {
    return ApiClient.get<NotificationListResponse>(ENDPOINTS.NOTIFICATIONS.LIST, {
      params: params as Record<string, any>,
    });
  },

  /**
   * Fetch unread notifications count for badge counter
   */
  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    return ApiClient.get<UnreadCountResponse>(ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
  },

  /**
   * Mark a single notification as read
   */
  markAsRead: async (id: number | string): Promise<MarkReadResponse> => {
    return ApiClient.patch<MarkReadResponse>(ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<MarkAllReadResponse> => {
    return ApiClient.post<MarkAllReadResponse>(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
  },
};
