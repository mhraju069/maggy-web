/**
 * Admin Schedule Dates (Blocked Dates & Special Opening Dates) API Service
 */

import ApiClient from "../client";
import { ENDPOINTS } from "../endpoints";

export interface BlockDateItem {
  id: number;
  date: string; // YYYY-MM-DD
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface SpecialOpeningDateItem {
  id: number;
  date: string; // YYYY-MM-DD
  open_time: string; // HH:MM
  close_time: string; // HH:MM
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface AdminDatesSummary {
  total_blocked_dates: number;
  total_special_opening_dates: number;
  upcoming_blocked_dates: number;
  upcoming_special_opening_dates: number;
}

export interface AdminDatesOverviewResponse {
  success: boolean;
  summary: AdminDatesSummary;
  blocked_dates: BlockDateItem[];
  special_opening_dates: SpecialOpeningDateItem[];
}

export interface CreateBlockDatePayload {
  date: string; // YYYY-MM-DD
  description: string;
}

export interface CreateSpecialOpeningDatePayload {
  date: string; // YYYY-MM-DD
  open_time: string; // HH:MM
  close_time: string; // HH:MM
  description: string;
}

export interface AdminDatesOverviewParams extends Record<string, string | number | boolean | null | undefined> {
  year?: number;
  month?: number;
  start_date?: string;
  end_date?: string;
  upcoming?: boolean;
  search?: string;
  q?: string;
}

export interface AdminDateActionResponse<T = BlockDateItem | SpecialOpeningDateItem> {
  success: boolean;
  message: string;
  data?: T;
}

export const adminDatesService = {
  /**
   * 1. Overview API: Fetches both Blocked Dates and Special Opening Dates with summary metrics
   */
  async getOverview(params?: AdminDatesOverviewParams): Promise<AdminDatesOverviewResponse> {
    return ApiClient.get<AdminDatesOverviewResponse>(ENDPOINTS.DATES.ADMIN.OVERVIEW, { params });
  },

  /**
   * 2. Blocked Dates
   */
  async getBlockedDates(params?: {
    date?: string;
    start_date?: string;
    end_date?: string;
    upcoming?: boolean;
    search?: string;
  }): Promise<{ success: boolean; data: BlockDateItem[]; blocked_dates?: BlockDateItem[] }> {
    return ApiClient.get(ENDPOINTS.DATES.ADMIN.BLOCKED.LIST, { params });
  },

  async addBlockedDate(payload: CreateBlockDatePayload): Promise<AdminDateActionResponse<BlockDateItem>> {
    return ApiClient.post<AdminDateActionResponse<BlockDateItem>>(
      ENDPOINTS.DATES.ADMIN.BLOCKED.LIST,
      payload
    );
  },

  async updateBlockedDate(
    id: number,
    payload: Partial<CreateBlockDatePayload>
  ): Promise<AdminDateActionResponse<BlockDateItem>> {
    return ApiClient.patch<AdminDateActionResponse<BlockDateItem>>(
      ENDPOINTS.DATES.ADMIN.BLOCKED.DETAIL(id),
      payload
    );
  },

  async deleteBlockedDate(id: number): Promise<AdminDateActionResponse> {
    return ApiClient.delete<AdminDateActionResponse>(
      ENDPOINTS.DATES.ADMIN.BLOCKED.DETAIL(id)
    );
  },

  /**
   * 3. Special Opening Dates
   */
  async getSpecialOpeningDates(params?: {
    date?: string;
    start_date?: string;
    end_date?: string;
    upcoming?: boolean;
    search?: string;
  }): Promise<{ success: boolean; data: SpecialOpeningDateItem[]; special_opening_dates?: SpecialOpeningDateItem[] }> {
    return ApiClient.get(ENDPOINTS.DATES.ADMIN.SPECIAL_OPENINGS.LIST, { params });
  },

  async addSpecialOpeningDate(
    payload: CreateSpecialOpeningDatePayload
  ): Promise<AdminDateActionResponse<SpecialOpeningDateItem>> {
    return ApiClient.post<AdminDateActionResponse<SpecialOpeningDateItem>>(
      ENDPOINTS.DATES.ADMIN.SPECIAL_OPENINGS.LIST,
      payload
    );
  },

  async updateSpecialOpeningDate(
    id: number,
    payload: Partial<CreateSpecialOpeningDatePayload>
  ): Promise<AdminDateActionResponse<SpecialOpeningDateItem>> {
    return ApiClient.patch<AdminDateActionResponse<SpecialOpeningDateItem>>(
      ENDPOINTS.DATES.ADMIN.SPECIAL_OPENINGS.DETAIL(id),
      payload
    );
  },

  async deleteSpecialOpeningDate(id: number): Promise<AdminDateActionResponse> {
    return ApiClient.delete<AdminDateActionResponse>(
      ENDPOINTS.DATES.ADMIN.SPECIAL_OPENINGS.DETAIL(id)
    );
  },
};

export default adminDatesService;
