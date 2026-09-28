/**
 * User Profile & Management API Service
 */

import ApiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import { PaginatedResponse, User } from "../types";

export const userService = {
  /**
   * Get list of users (Admin)
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
