/**
 * User Dashboard API Service
 * Endpoint: /api/dashboard/user/
 */

import ApiClient from "../client";
import { ENDPOINTS } from "../endpoints";

export interface DashboardVisitDetails {
  sauna_type?: string;
  time_slot?: string;
  selected_features?: string[];
  special_request?: string;
  celebration_type?: string;
  celebration_date?: string;
  name_of_celebrant?: string;
  age_of_celebrant?: number;
  hobbies?: string;
  celebration_details?: string;
  used_pass?: boolean;
  used_subscription?: boolean;
  is_paid?: boolean;
  total_price?: string;
  food_preference?: string;
  drink_preference?: string;
  music_preference?: string;
  notes?: string;
  [key: string]: any;
}

export interface DashboardBookingItem {
  id: number;
  booking_id: string;
  service_type: string;
  service_name: string;
  date: string;
  time: string;
  end_time: string | null;
  guests: number;
  status: string;
  payment_status: string;
  total_price: string;
  access_code: string;
  details: DashboardVisitDetails;
}

export interface DashboardHomeMetrics {
  total_bookings: number;
  upcoming_bookings: number;
  upcoming_booking_dates: string[];
  active_subscriptions: number;
  upcoming_saunas: number;
}

export interface DashboardSubscriptionPassItem {
  purchase_id: string;
  purchase_type: "session_pass" | "subscription" | string;
  name: string;
  category: string;
  amount: string;
  currency: string;
  total_sessions: number;
  remaining_sessions: number;
  sessions_per_week?: number;
  max_active_reservations?: number;
  start_date: string;
  end_date: string | null;
  status: string;
  payment_status: string;
  is_expired: boolean;
  details?: {
    plan_type?: string | null;
    duration_weeks?: number | null;
    [key: string]: any;
  };
}

export interface DashboardAccessCodeItem {
  booking_id: string;
  access_code: string;
  sauna_type: string;
  date: string;
  time: string;
  time_slot: string;
  status: string;
  payment_status: string;
  guests: number;
  details: {
    selected_features?: string[];
    special_request?: string;
    total_price?: string;
    [key: string]: any;
  };
}

export interface DashboardUserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  image: string | null;
  language: string;
  role: string;
  date_joined: string;
}

export interface UserDashboardResponse {
  success: boolean;
  home: {
    metrics?: DashboardHomeMetrics;
    next_visit: DashboardBookingItem | null;
    subscriptions_and_passes?: DashboardSubscriptionPassItem[];
    next_visits?: DashboardBookingItem[];
    other_upcoming_visits: DashboardBookingItem[];
  };
  my_bookings: {
    upcoming: DashboardBookingItem[];
    past: DashboardBookingItem[];
  };
  access_codes: {
    private_sauna: DashboardAccessCodeItem[];
    shared_sauna: DashboardAccessCodeItem[];
    all_sauna: DashboardAccessCodeItem[];
  };
  profile: DashboardUserProfile;
}

export const dashboardService = {
  /**
   * Fetch authenticated user's unified dashboard data
   */
  async getUserDashboard(): Promise<UserDashboardResponse> {
    return ApiClient.get<UserDashboardResponse>(ENDPOINTS.DASHBOARD.USER);
  },
};

export default dashboardService;
