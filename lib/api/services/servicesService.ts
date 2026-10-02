/**
 * Services API Service
 * Interacts with Django Services endpoints
 */

import ApiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import { ServiceItem } from "../types";

export interface SaunaFeature {
  id: number;
  feature: string;
  price?: string | number;
}

export interface PrivateSaunaItem {
  id: number;
  features?: SaunaFeature[];
  base_price_3hrs?: string | number;
  base_price_4hrs?: string | number;
  max_person?: number;
  extra_person_price?: string | number;
  is_available?: boolean;
}

export interface SharedSaunaItem {
  id: number;
  features?: SaunaFeature[];
  price_per_person?: string | number;
  is_available?: boolean;
  max_person?: number;
}

export interface SaunaServicesResponse {
  private_sauna?: PrivateSaunaItem[];
  shared_sauna?: SharedSaunaItem[];
}

export interface ActivityFeature {
  id?: number;
  feature: string;
}

export interface ActivityApiItem {
  id: number;
  title?: string;
  name?: string;
  description?: string;
  image?: string | null;
  images?: string | null;
  price?: string | number;
  features?: ActivityFeature[];
  category?: string;
  teacher_host?: string;
  teacherHost?: string;
  start_time?: string;
  startTime?: string;
  end_time?: string;
  endTime?: string;
  date?: string;
  max_participants?: number;
  maxParticipants?: number;
  booked_participants?: number;
  bookedParticipants?: number;
  is_recurring?: boolean;
  isRecurring?: boolean;
}

export interface SaltRoomInfo {
  pricing: {
    single_session_price: number | string;
    max_capacity: number;
    session_duration_minutes: number;
    buffer_minutes: number;
    pass_10_price: number | string;
    pass_10_sessions: number;
    pass_10_validity_days: number;
    membership_once_a_week_price: number | string;
    membership_unlimited_price: number | string;
  };
  time_slots: string[];
}

export interface AddOnExtra {
  id: number;
  name: string;
  description?: string;
  price: string | number;
  is_available: boolean;
}

export interface EventInquiryPayload {
  event_type: string;
  preferred_date: string;
  start_time: string;
  end_time: string;
  expected_guests: number;
  food_preferences?: string;
  drink_preferences?: string;
  entertainment_preferences?: string;
  additional_requests?: string;
  name: string;
  phone: string;
  email: string;
}

export interface ServicePackage {
  id: number;
  title: string;
  description: string;
  price: string | number;
  is_custom_inquiry: boolean;
  image?: string | null;
  is_active: boolean;
}

export interface MembershipPlan {
  id: number;
  name: string;
  plan_code: string;
  price: string | number;
  billing_period_days: number;
  sessions_per_period?: number | null;
  max_active_future_bookings: number;
}

export const servicesService = {
  async getServices(serviceType?: string): Promise<ServiceItem[]> {
    const endpoint = serviceType === "sauna" 
      ? ENDPOINTS.SERVICES.SAUNA 
      : serviceType === "activity" 
      ? ENDPOINTS.SERVICES.ACTIVITIES 
      : ENDPOINTS.SERVICES.ALL;

    const response = await ApiClient.get<ServiceItem[] | { results: ServiceItem[] }>(
      endpoint,
      {
        skipAuth: true,
        params: serviceType ? { service_type: serviceType } : undefined,
      }
    );

    const items = Array.isArray(response)
      ? response
      : response?.results || [];

    if (serviceType && endpoint === ENDPOINTS.SERVICES.ALL) {
      return items.filter(
        (item) => item.service_type?.toLowerCase() === serviceType.toLowerCase()
      );
    }

    return items;
  },

  async getAllServices(): Promise<any> {
    return ApiClient.get(ENDPOINTS.SERVICES.ALL, { skipAuth: true });
  },

  async getSaunaServices(): Promise<SaunaServicesResponse> {
    const res = await ApiClient.get<any>(ENDPOINTS.SERVICES.SAUNA, { skipAuth: true });
    if (res?.data?.private_sauna || res?.data?.shared_sauna) {
      return res.data;
    }
    if (res?.private_sauna || res?.shared_sauna) {
      return res;
    }
    if (Array.isArray(res)) {
      return { private_sauna: res };
    }
    return res || {};
  },

  async getActivities(): Promise<ActivityApiItem[]> {
    const res = await ApiClient.get<any>(ENDPOINTS.SERVICES.ACTIVITIES, { skipAuth: true });
    if (res?.data && Array.isArray(res.data)) return res.data;
    if (res?.results && Array.isArray(res.results)) return res.results;
    if (Array.isArray(res)) return res;
    return [];
  },

  async getSaltRoomInfo(): Promise<{ success: boolean; data: SaltRoomInfo }> {
    return ApiClient.get<{ success: boolean; data: SaltRoomInfo }>(ENDPOINTS.SERVICES.SALT_ROOM, { skipAuth: true });
  },

  async getAddOnExtras(): Promise<{ success: boolean; data: AddOnExtra[] }> {
    return ApiClient.get<{ success: boolean; data: AddOnExtra[] }>(ENDPOINTS.SERVICES.EXTRAS, { skipAuth: true });
  },

  async submitEventInquiry(payload: EventInquiryPayload): Promise<any> {
    return ApiClient.post(ENDPOINTS.SERVICES.EVENTS_INQUIRY, payload, { skipAuth: true });
  },

  async getPackages(): Promise<{ success: boolean; data: ServicePackage[] }> {
    return ApiClient.get<{ success: boolean; data: ServicePackage[] }>(ENDPOINTS.SERVICES.PACKAGES, { skipAuth: true });
  },

  async getMembershipPlans(): Promise<{ success: boolean; data: MembershipPlan[] }> {
    return ApiClient.get<{ success: boolean; data: MembershipPlan[] }>(ENDPOINTS.SERVICES.MEMBERSHIPS, { skipAuth: true });
  },

  async getSchedules(): Promise<any> {
    return ApiClient.get(ENDPOINTS.SERVICES.SCHEDULES, { skipAuth: true });
  },

  async getServiceDetails(id: string | number): Promise<ServiceItem> {
    return ApiClient.get<ServiceItem>(`/services/${id}/`, { skipAuth: true });
  },
};

export default servicesService;
