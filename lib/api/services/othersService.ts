/**
 * Contact Info, Policies (Privacy & Terms) and Support Messages API Service
 */

import ApiClient from "../client";
import { ENDPOINTS } from "../endpoints";

export interface ContactInfo {
  id: number;
  email: string;
  phone: string;
  address: string;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateContactInfoPayload {
  email?: string;
  phone?: string;
  address?: string;
}

export interface PrivacyPolicy {
  id: number;
  effective_date: string | null;
  info_we_collect: string | null;
  how_we_use_data: string | null;
  child_safety: string | null;
  user_rights: string | null;
  security: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface TermsAndConditions {
  id: number;
  effective_date: string | null;
  acceptance_of_terms: string | null;
  user_responsibilities: string | null;
  ticket_purchase: string | null;
  refund_policy: string | null;
  limitation_of_liability: string | null;
  changes_to_terms: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SupportMessage {
  id: number;
  sender?: number | null;
  sender_name?: string;
  sender_email?: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSupportMessagePayload {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface SupportMessagesListResponse {
  success: boolean;
  summary?: {
    total_messages: number;
    unread_messages: number;
    read_messages: number;
  };
  count?: number;
  page?: number;
  page_size?: number;
  has_next?: boolean;
  has_previous?: boolean;
  data: SupportMessage[];
}

export const othersService = {
  // ── Contact Info ──
  async getContactInfo(): Promise<{ success: boolean; data: ContactInfo }> {
    return ApiClient.get(ENDPOINTS.OTHERS.CONTACT_INFO, { skipAuth: true });
  },

  async updateContactInfo(payload: UpdateContactInfoPayload): Promise<{ success: boolean; message: string; data: ContactInfo }> {
    return ApiClient.patch(ENDPOINTS.OTHERS.CONTACT_INFO, payload);
  },

  // ── Privacy Policy ──
  async getPrivacyPolicy(): Promise<{ success: boolean; data: PrivacyPolicy }> {
    return ApiClient.get(ENDPOINTS.OTHERS.PRIVACY_POLICY, { skipAuth: true });
  },

  async updatePrivacyPolicy(payload: Partial<PrivacyPolicy>): Promise<{ success: boolean; message: string; data: PrivacyPolicy }> {
    return ApiClient.patch(ENDPOINTS.OTHERS.PRIVACY_POLICY, payload);
  },

  // ── Terms and Conditions ──
  async getTermsAndConditions(): Promise<{ success: boolean; data: TermsAndConditions }> {
    return ApiClient.get(ENDPOINTS.OTHERS.TERMS_AND_CONDITIONS, { skipAuth: true });
  },

  async updateTermsAndConditions(payload: Partial<TermsAndConditions>): Promise<{ success: boolean; message: string; data: TermsAndConditions }> {
    return ApiClient.patch(ENDPOINTS.OTHERS.TERMS_AND_CONDITIONS, payload);
  },

  // ── Support Messages (Public Contact Form & Admin) ──
  async sendSupportMessage(payload: CreateSupportMessagePayload): Promise<{ success: boolean; message: string; data: SupportMessage }> {
    return ApiClient.post(ENDPOINTS.OTHERS.SUPPORT_MESSAGES.LIST, payload, { skipAuth: true });
  },

  async getSupportMessages(params?: {
    search?: string;
    is_read?: boolean;
    page?: number;
    page_size?: number;
  }): Promise<SupportMessagesListResponse> {
    return ApiClient.get(ENDPOINTS.OTHERS.SUPPORT_MESSAGES.LIST, { params });
  },

  async markMessageReadStatus(id: number, is_read: boolean): Promise<{ success: boolean; message: string; data?: SupportMessage }> {
    return ApiClient.patch(ENDPOINTS.OTHERS.SUPPORT_MESSAGES.DETAIL(id), { is_read });
  },

  async deleteSupportMessage(id: number): Promise<{ success: boolean; message: string }> {
    return ApiClient.delete(ENDPOINTS.OTHERS.SUPPORT_MESSAGES.DETAIL(id));
  },
};

export default othersService;
