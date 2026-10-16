/**
 * Payments, Plans & Passes API Service
 */

import ApiClient from "../client";
import { ENDPOINTS } from "../endpoints";

export interface PlanFeature {
  id?: number;
  feature: string;
  feature_en?: string | null;
  feature_nl?: string | null;
  feature_de?: string | null;
}

export interface SessionPassItem {
  id: number;
  name: string;
  name_en?: string | null;
  name_nl?: string | null;
  name_de?: string | null;
  price: string | number;
  entry_limit: number;
  features: PlanFeature[];
}

export interface SubscriptionPlanItem {
  id: number;
  name: string;
  name_en?: string | null;
  name_nl?: string | null;
  name_de?: string | null;
  price: string | number;
  plan_type: "weekly" | "unlimited" | string;
  plan_category: "saltroom" | "sauna" | string;
  max_reservations?: number;
  duration_weeks?: number;
  features: PlanFeature[];
}

export interface PlansAndPassesResponse {
  session_passes: SessionPassItem[];
  subscription_plans: SubscriptionPlanItem[];
}

export interface PurchasePlanPayload {
  purchase_type: "session_pass" | "subscription";
  pass_id?: number;
  plan_id?: number;
  plan_type?: string;
  plan_category?: string;
  name?: string;
  email?: string;
  phone?: string;
  currency?: string;
}

export interface PurchasePlanResponse {
  success: boolean;
  purchase_id: string;
  purchase_type: "session_pass" | "subscription";
  item_name: string;
  amount: string;
  currency: string;
  start_date?: string | null;
  end_date?: string | null;
  total_sessions?: number;
  remaining_sessions?: number;
  sessions_per_week?: number;
  max_active_reservations?: number;
  client_secret: string;
  payment_intent_id?: string;
  data?: any;
  message?: string;
  error?: string;
}

export const paymentsService = {
  /**
   * Fetch all session passes & subscription plans in a single call (public)
   */
  async getPlansAndPasses(): Promise<PlansAndPassesResponse> {
    return ApiClient.get<PlansAndPassesResponse>(ENDPOINTS.PAYMENTS.PLANS_AND_PASSES, {
      skipAuth: true,
    });
  },

  /**
   * Fetch session passes only
   */
  async getSessionPasses(): Promise<SessionPassItem[]> {
    return ApiClient.get<SessionPassItem[]>(ENDPOINTS.PAYMENTS.SESSION_PASSES, {
      skipAuth: true,
    });
  },

  /**
   * Create new Session Pass (Admin)
   */
  async createSessionPass(payload: {
    name: string;
    price: string | number;
    entry_limit: number;
    feature_list?: string[];
  }): Promise<SessionPassItem> {
    return ApiClient.post<SessionPassItem>(ENDPOINTS.PAYMENTS.SESSION_PASSES, payload);
  },

  /**
   * Update Session Pass (Admin)
   */
  async updateSessionPass(
    id: number | string,
    payload: {
      name?: string;
      price?: string | number;
      entry_limit?: number;
      feature_list?: string[];
    }
  ): Promise<SessionPassItem> {
    return ApiClient.patch<SessionPassItem>(ENDPOINTS.PAYMENTS.SESSION_PASS_DETAIL(id), payload);
  },

  /**
   * Delete Session Pass (Admin)
   */
  async deleteSessionPass(id: number | string): Promise<any> {
    return ApiClient.delete(ENDPOINTS.PAYMENTS.SESSION_PASS_DETAIL(id));
  },

  /**
   * Fetch subscription plans only (optional filters)
   */
  async getSubscriptionPlans(params?: {
    plan_type?: string;
    plan_category?: string;
  }): Promise<SubscriptionPlanItem[]> {
    return ApiClient.get<SubscriptionPlanItem[]>(ENDPOINTS.PAYMENTS.SUBSCRIPTION_PLANS, {
      params,
      skipAuth: true,
    });
  },

  /**
   * Create new Subscription Plan (Admin)
   */
  async createSubscriptionPlan(payload: {
    name: string;
    price: string | number;
    plan_type: "weekly" | "unlimited" | string;
    plan_category: "saltroom" | "sauna" | string;
    max_reservations?: number;
    duration_weeks?: number;
    feature_list?: string[];
  }): Promise<SubscriptionPlanItem> {
    return ApiClient.post<SubscriptionPlanItem>(ENDPOINTS.PAYMENTS.SUBSCRIPTION_PLANS, payload);
  },

  /**
   * Update Subscription Plan (Admin)
   */
  async updateSubscriptionPlan(
    id: number | string,
    payload: {
      name?: string;
      price?: string | number;
      plan_type?: string;
      plan_category?: string;
      max_reservations?: number;
      duration_weeks?: number;
      feature_list?: string[];
    }
  ): Promise<SubscriptionPlanItem> {
    return ApiClient.patch<SubscriptionPlanItem>(ENDPOINTS.PAYMENTS.SUBSCRIPTION_PLAN_DETAIL(id), payload);
  },

  /**
   * Delete Subscription Plan (Admin)
   */
  async deleteSubscriptionPlan(id: number | string): Promise<any> {
    return ApiClient.delete(ENDPOINTS.PAYMENTS.SUBSCRIPTION_PLAN_DETAIL(id));
  },

  /**
   * Purchase a pass or subscription plan & receive Stripe client_secret (Auth required)
   */
  async purchase(payload: PurchasePlanPayload): Promise<PurchasePlanResponse> {
    return ApiClient.post<PurchasePlanResponse>(ENDPOINTS.PAYMENTS.PURCHASE, payload);
  },

  /**
   * Confirm payment on backend immediately after Stripe confirmCardPayment succeeds
   */
  async confirmPayment(payload: {
    payment_intent_id: string;
    purchase_id: string;
  }): Promise<{ success: boolean; message?: string; data?: any }> {
    return ApiClient.post(ENDPOINTS.PAYMENTS.CONFIRM_PAYMENT, payload);
  },

  /**
   * Admin Payments: Overview, Monthly Breakdown, and Searchable Booking Payments List
   */
  async getAdminPayments(params?: AdminPaymentsQueryParams): Promise<AdminPaymentsResponse> {
    return ApiClient.get<AdminPaymentsResponse>(ENDPOINTS.PAYMENTS.ADMIN.LIST, { params });
  },
};

export interface ServicePaymentBreakdownItem {
  service_type: string;
  service_name: string;
  revenue: string;
  transactions_count: number;
}

export interface MonthlyPaymentsSummary {
  month_name: string;
  year: number;
  month: number;
  total_revenue: string;
  total_transactions: number;
  currency: string;
  services: ServicePaymentBreakdownItem[];
}

export interface AdminPaymentItem {
  id: number;
  booking_id: string;
  service_type: string;
  service_name: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  user_id?: number | null;
  amount: string;
  currency: string;
  payment_status: "paid" | "paid_with_package" | "pending" | string;
  booking_status: string;
  date: string;
  time: string;
  guests: number;
  transaction_id?: string | null;
  payment_date?: string | null;
  created_at?: string | null;
  details?: Record<string, any>;
}

export interface AdminPaymentsResponse {
  success: boolean;
  monthly_summary: MonthlyPaymentsSummary;
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
  next_page: number | null;
  previous_page: number | null;
  results: AdminPaymentItem[];
  data?: AdminPaymentItem[];
}

export interface AdminPaymentsQueryParams extends Record<string, string | number | boolean | null | undefined> {
  month?: number;
  year?: number;
  search?: string;
  q?: string;
  service_type?: string;
  payment_status?: string;
  booking_status?: string;
  date?: string;
  start_date?: string;
  date_from?: string;
  end_date?: string;
  date_to?: string;
  booking_id?: string;
  client_name?: string;
  email?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
  limit?: number;
}

export default paymentsService;
