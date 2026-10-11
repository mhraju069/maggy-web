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
};
