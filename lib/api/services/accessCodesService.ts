/**
 * Admin Access Codes API Service
 */

import ApiClient from "../client";
import { ENDPOINTS } from "../endpoints";

export interface AdminAccessCodeItem {
  id: number;
  booking_id: string;
  access_code: string;
  sauna_type: "private" | "shared" | string;
  service_name: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  user_id?: number | null;
  date: string;
  time: string;
  time_slot: string;
  guests: number;
  status: "pending" | "confirmed" | "cancelled" | string;
  payment_status: "paid" | "paid_with_package" | "pending" | string;
  total_price: string;
  special_request?: string;
  selected_features: string[];
  created_at?: string | null;
  details?: {
    sauna_type?: string;
    time_slot?: string;
    capacity?: number;
    selected_features?: string[];
    special_request?: string;
    total_price?: string;
  };
}

export interface AdminAccessCodesSummary {
  total_codes: number;
  private_sauna_codes: number;
  shared_sauna_codes: number;
  confirmed_codes: number;
}

export interface AdminAccessCodesResponse {
  success: boolean;
  summary: AdminAccessCodesSummary;
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
  next_page: number | null;
  previous_page: number | null;
  results: AdminAccessCodeItem[];
  data?: AdminAccessCodeItem[];
}

export interface AdminAccessCodeDetailResponse {
  success: boolean;
  data: AdminAccessCodeItem;
  message?: string;
}

export interface AdminAccessCodesQueryParams extends Record<string, string | number | boolean | null | undefined> {
  search?: string;
  q?: string;
  sauna_type?: string;
  type?: string;
  date?: string;
  start_date?: string;
  date_from?: string;
  end_date?: string;
  date_to?: string;
  status?: string;
  payment_status?: string;
  access_code?: string;
  booking_id?: string;
  client_name?: string;
  name?: string;
  email?: string;
  ordering?: string;
  sort_by?: string;
  page?: number;
  page_size?: number;
  limit?: number;
}

export const accessCodesService = {
  /**
   * Fetch all sauna access codes with search, filters, and pagination
   */
  async getAccessCodes(params?: AdminAccessCodesQueryParams): Promise<AdminAccessCodesResponse> {
    return ApiClient.get<AdminAccessCodesResponse>(ENDPOINTS.ACCESS_CODES.ADMIN.LIST, { params });
  },

  /**
   * Fetch a single access code detail by access code or booking ID
   */
  async getAccessCodeDetail(code: string | number): Promise<AdminAccessCodeDetailResponse> {
    return ApiClient.get<AdminAccessCodeDetailResponse>(ENDPOINTS.ACCESS_CODES.ADMIN.DETAIL(code));
  },
};

export default accessCodesService;
