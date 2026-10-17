/**
 * User Profile & Management API Service
 */

import ApiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import { PaginatedResponse, User } from "../types";

export interface AdminUserItem {
  id: number;
  uid?: string | null;
  email: string;
  name: string;
  phone?: string | null;
  bio?: string | null;
  image?: string | null;
  role: "admin" | "user" | string;
  language?: string;
  is_active: boolean;
  block: boolean;
  date_joined?: string;
  last_login?: string | null;
  total_bookings?: number;
  total_spent?: string | number;
}

export interface AdminUsersSummary {
  total_users: number;
  active_users: number;
  blocked_users: number;
  admin_users: number;
  regular_users: number;
  joined_this_month?: number;
}

export interface AdminUsersResponse {
  success: boolean;
  summary: AdminUsersSummary;
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  data: AdminUserItem[];
}

export interface AdminUsersQueryParams extends Record<string, string | number | boolean | null | undefined> {
  search?: string;
  role?: string;
  is_active?: boolean | string;
  block?: boolean | string;
  language?: string;
  date?: string;
  start_date?: string;
  date_from?: string;
  end_date?: string;
  date_to?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
  id?: number | string;
}

export interface AdminUserUpdatePayload {
  name?: string;
  phone?: string;
  bio?: string;
  role?: "user" | "admin" | string;
  language?: string;
  is_active?: boolean;
  block?: boolean;
  password?: string;
  image?: File | null;
}

export interface AdminUserUpdateResponse {
  success: boolean;
  message?: string;
  data: AdminUserItem;
}

export interface AdminUserDeleteResponse {
  success: boolean;
  message?: string;
}

export const userService = {
  /**
   * Get list of users (Admin with full filtering, pagination & metrics)
   */
  async getAdminUsers(params?: AdminUsersQueryParams): Promise<AdminUsersResponse> {
    return ApiClient.get<AdminUsersResponse>(ENDPOINTS.USERS.ADMIN.LIST, { params });
  },

  /**
   * Update user details as Admin (PATCH)
   */
  async updateAdminUser(
    id: string | number,
    data: AdminUserUpdatePayload | FormData
  ): Promise<AdminUserUpdateResponse> {
    return ApiClient.patch<AdminUserUpdateResponse>(ENDPOINTS.USERS.ADMIN.UPDATE(id), data);
  },

  /**
   * Delete user as Admin (DELETE)
   */
  async deleteAdminUser(id: string | number): Promise<AdminUserDeleteResponse> {
    return ApiClient.delete<AdminUserDeleteResponse>(ENDPOINTS.USERS.ADMIN.DELETE(id));
  },

  /**
   * Legacy Get list of users
   */
  async getUsers(params?: Record<string, string | number>): Promise<PaginatedResponse<User> | User[]> {
    return ApiClient.get<PaginatedResponse<User> | User[]>(ENDPOINTS.USERS.LIST, { params });
  },

  /**
   * Get single user by ID
   */
  async getUserById(id: string | number): Promise<User> {
    return ApiClient.get<User>(ENDPOINTS.USERS.DETAIL(id));
  },

  /**
   * Update user details
   */
  async updateUser(id: string | number, data: Partial<User>): Promise<User> {
    return ApiClient.patch<User>(ENDPOINTS.USERS.UPDATE(id), data);
  },
};

export default userService;
