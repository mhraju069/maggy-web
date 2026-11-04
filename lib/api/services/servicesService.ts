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
  feature_en?: string;
  feature_nl?: string;
  feature_de?: string;
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
  feature_en?: string;
  feature_nl?: string;
  feature_de?: string;
}

export interface ActivityApiItem {
  id: number;
  title?: string;
  title_en?: string;
  title_nl?: string;
  title_de?: string;
  name?: string;
  name_en?: string;
  name_nl?: string;
  name_de?: string;
  description?: string;
  description_en?: string;
  description_nl?: string;
  description_de?: string;
  image?: string | null;
  images?: string | null;
  price?: string | number;
  features?: (ActivityFeature | string)[];
  category?: string;
  teacher_host?: string;
  teacherHost?: string;
  host?: string;
  start_time?: string;
  startTime?: string;
  open_time?: string;
  end_time?: string;
  endTime?: string;
  close_time?: string;
  date?: string;
  capacity?: number;
  available_slots?: number;
  booked_slots?: number;
  max_participants?: number;
  maxParticipants?: number;
  booked_participants?: number;
  bookedParticipants?: number;
  additional_notes?: string | null;
  additional_notes_en?: string | null;
  additional_notes_nl?: string | null;
  additional_notes_de?: string | null;
  is_available?: boolean;
  is_recurring?: boolean;
  isRecurring?: boolean;
}

export interface SaltroomFeature {
  id: number;
  feature: string;
  feature_en?: string;
  feature_nl?: string;
  feature_de?: string;
  price?: string | number;
}

export interface SaltroomItem {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  images?: string | null;
  price_per_person?: string | number;
  features?: SaltroomFeature[];
}

export interface SubscriptionPlanFeature {
  id: number;
  feature: string;
}

export interface SubscriptionPlanItem {
  id: number;
  features?: SubscriptionPlanFeature[];
  name: string;
  price: string | number;
  plan_type: "weekly" | "unlimited" | string;
  plan_category: "sauna" | "saltroom" | string;
  max_reservations?: number;
  duration_weeks?: number;
}

export interface SessionPassFeature {
  id: number;
  feature: string;
}

export interface SessionPassItem {
  id: number;
  features?: SessionPassFeature[];
  name: string;
  price: string | number;
  entry_limit?: number;
}

export interface UserMembershipPass {
  id?: number;
  pass_id?: string;
  purchase_id?: string;
  name?: string;
  plan_name?: string;
  remaining_sessions: number;
  total_sessions?: number;
  total_remaining_across_all_passes?: number;
  max_active_reservations?: number;
  status?: string;
  payment_status?: string;
  end_date?: string | null;
  is_available_for_date?: boolean;
  unavailable_reason?: string | null;
}

export interface UserMembershipSubscription {
  id?: number;
  subscription_id?: string;
  purchase_id?: string;
  name?: string;
  plan_name?: string;
  type?: "weekly" | "unlimited" | string;
  plan_type?: "weekly" | "unlimited" | string;
  plan_category?: string;
  start_date?: string;
  end_date?: string;
  is_unlimited?: boolean;
  remaining_sessions?: number;
  total_sessions?: number;
  sessions_per_week?: number;
  max_active_reservations?: number;
  active_reservations_count?: number;
  status?: string;
  payment_status?: string;
  is_available_for_date?: boolean;
  is_available_for_today?: boolean;
  is_available_for_week?: boolean;
  week_bookings_count?: number;
  unavailable_reason?: string | null;
}

export interface UserMembershipData {
  is_authenticated?: boolean;
  has_pass?: boolean;
  has_subscription?: boolean;
  has_active_pass?: boolean;
  has_active_subscription?: boolean;
  total_available_sessions?: number;
  weekly_subscription?: UserMembershipSubscription | null;
  unlimited_subscription?: UserMembershipSubscription | null;
  pass?: UserMembershipPass | null;
  session_pass?: UserMembershipPass | null;
  subscription?: UserMembershipSubscription | null;
}

export interface SaltroomServicesData {
  saltroom?: SaltroomItem[];
  subscription_plans?: SubscriptionPlanItem[];
  session_pass?: SessionPassItem[];
  user_membership?: UserMembershipData;
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

export interface PackageFeature {
  id: number;
  feature: string;
}

export interface ServicePackage {
  id: number;
  title: string;
  packages?: string[] | string;
  description: string;
  price: string | number;
  image?: string | null;
  features?: PackageFeature[];
  is_custom_inquiry?: boolean;
  is_active?: boolean;
}

export interface PrivateSaunaSlot {
  start_time: string;
  end_time: string;
  buffer_end_time: string;
  time_slot: "3_hours" | "4_hours" | string;
}

export interface SharedSaunaSlot {
  start_time: string;
  end_time: string;
  buffer_end_time?: string;
  duration: string;
  max_capacity: number;
  booked_capacity: number;
  remaining_capacity: number;
  is_available: boolean;
  is_fully_booked: boolean;
}

export interface LunchroomSlotData {
  is_available: boolean;
  is_closed?: boolean;
  open_time: string;
  close_time: string;
  existing_bookings_count?: number;
  info?: string;
}

export interface ActivitySlotData {
  id: number;
  title: string;
  open_time: string;
  close_time: string;
  capacity: number;
  booked_slots: number;
  available_slots: number;
  host: string;
  is_available: boolean;
}

export interface PackagePrivateSaunaSlotsData {
  open_time?: string;
  close_time?: string;
  is_closed?: boolean;
  slots?: {
    "3_hours"?: PrivateSaunaSlot[];
    "4_hours"?: PrivateSaunaSlot[];
  };
}

export interface PackageSharedSaunaSlotsData {
  open_time?: string;
  close_time?: string;
  is_closed?: boolean;
  max_capacity_per_slot?: number;
  slots?: SharedSaunaSlot[];
}

export interface PackageSaunaSlotsData {
  is_available?: boolean;
  is_closed?: boolean;
  open_time?: string;
  close_time?: string;
  private_sauna?: PackagePrivateSaunaSlotsData;
  shared_sauna?: PackageSharedSaunaSlotsData;
}

export interface PackageSlotsResponseData {
  sauna?: PackageSaunaSlotsData;
  private_sauna?: PackagePrivateSaunaSlotsData;
  shared_sauna?: PackageSharedSaunaSlotsData;
  lunchroom?: LunchroomSlotData;
  activities?: {
    is_available?: boolean;
    is_closed?: boolean;
    open_time?: string;
    close_time?: string;
    activities?: ActivitySlotData[];
  } | ActivitySlotData[];
  saltroom?: {
    is_available?: boolean;
    is_closed?: boolean;
    open_time?: string;
    close_time?: string;
    duration_minutes?: number;
    buffer_minutes?: number;
    max_capacity?: number;
    price_per_person?: string;
    slots?: any[];
    available_slots?: any[];
    user_membership?: any;
  };
}

export interface PackageSlotsResponse {
  success: boolean;
  is_blocked: boolean;
  is_closed?: boolean;
  date: string;
  service_type: string;
  open_time: string;
  close_time: string;
  data?: PackageSlotsResponseData;
  message?: string;
}

export interface SaltRoomSlotItem {
  time?: string;
  start_time: string;
  end_time?: string;
  buffer_end_time?: string;
  duration_minutes?: number;
  buffer_minutes?: number;
  max_capacity?: number;
  booked_capacity?: number;
  remaining_capacity?: number;
  available_capacity?: number;
  is_available?: boolean;
  is_booked?: boolean;
  is_fully_booked?: boolean;
}

export interface SaltRoomSlotData {
  is_available?: boolean;
  open_time?: string;
  close_time?: string;
  duration_minutes?: number;
  buffer_minutes?: number;
  max_capacity?: number;
  price_per_person?: string | number;
  total_slots_count?: number;
  available_slots_count?: number;
  slots?: SaltRoomSlotItem[];
  available_slots?: SaltRoomSlotItem[];
  info?: string;
  user_membership?: UserMembershipData;
}

export interface ServiceSlotsData {
  private_sauna?: {
    slots?: {
      "3_hours"?: PrivateSaunaSlot[];
      "4_hours"?: PrivateSaunaSlot[];
    };
    available_slots?: {
      "3_hours"?: PrivateSaunaSlot[];
      "4_hours"?: PrivateSaunaSlot[];
    };
  };
  shared_sauna?: {
    max_capacity_per_slot?: number;
    slots?: SharedSaunaSlot[];
    booked_slots?: any[];
  };
  saltroom?: SaltRoomSlotData;
  duration_minutes?: number;
  buffer_minutes?: number;
  max_capacity?: number;
  total_slots_count?: number;
  available_slots_count?: number;
  slots?: SaltRoomSlotItem[];
  available_slots?: SaltRoomSlotItem[];
  is_available?: boolean;
  is_closed?: boolean;
  open_time?: string;
  close_time?: string;
  price_per_person?: string | number;
  info?: string;
  user_membership?: UserMembershipData;
}

export interface ServiceSlotsResponse {
  success: boolean;
  service_type?: string;
  is_blocked?: boolean;
  is_closed?: boolean;
  date?: string;
  open_time?: string;
  close_time?: string;
  data?: ServiceSlotsData;
  message?: string;
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

  async getAllServices(serviceType?: string): Promise<any[]> {
    try {
      const params = serviceType ? { type: serviceType } : undefined;
      let res: any;
      try {
        res = await ApiClient.get<any>("/dashboard/admin/services/manage/", { params, skipAuth: true });
      } catch {
        try {
          res = await ApiClient.get<any>("/dashboard/admin/services/", { params, skipAuth: true });
        } catch {
          res = await ApiClient.get<any>(ENDPOINTS.SERVICES.ALL, { params, skipAuth: true });
        }
      }

      if (res?.data && Array.isArray(res.data)) return res.data;
      if (Array.isArray(res)) return res;
      if (res?.results && Array.isArray(res.results)) return res.results;
      return [];
    } catch (err) {
      console.error("Error fetching all services:", err);
      return [];
    }
  },

  async getSaunaServices(): Promise<SaunaServicesResponse> {
    try {
      let res: any;
      try {
        res = await ApiClient.get<any>(ENDPOINTS.SERVICES.DETAILS("sauna"), { skipAuth: true });
      } catch {
        res = await ApiClient.get<any>("/services/sauna/", { skipAuth: true });
      }
      if (res?.data?.private_sauna || res?.data?.shared_sauna) {
        return res.data;
      }
      if (res?.private_sauna || res?.shared_sauna) {
        return res;
      }
      if (Array.isArray(res)) {
        return { private_sauna: res };
      }
      return res?.data || res || {};
    } catch (err) {
      console.error("Error fetching sauna services:", err);
      return {};
    }
  },

  async getActivities(): Promise<ActivityApiItem[]> {
    try {
      let res: any;
      try {
        res = await ApiClient.get<any>(ENDPOINTS.SERVICES.DETAILS("activity"), { skipAuth: true });
      } catch {
        res = await ApiClient.get<any>("/services/activities/", { skipAuth: true });
      }
      if (res?.data && Array.isArray(res.data)) return res.data;
      if (res?.results && Array.isArray(res.results)) return res.results;
      if (Array.isArray(res)) return res;
      return [];
    } catch (err) {
      console.error("Error fetching activities:", err);
      return [];
    }
  },

  async getSaltRoomServices(): Promise<SaltroomServicesData> {
    try {
      let res: any;
      try {
        res = await ApiClient.get<any>(ENDPOINTS.SERVICES.DETAILS("saltroom"));
      } catch {
        try {
          res = await ApiClient.get<any>("/services/saltroom/");
        } catch {
          res = await ApiClient.get<any>("/services/salt-room/");
        }
      }
      if (res?.data?.saltroom || res?.data?.subscription_plans || res?.data?.session_pass || res?.data?.user_membership) {
        return res.data;
      }
      if (res?.saltroom || res?.subscription_plans || res?.session_pass || res?.user_membership) {
        return res;
      }
      return res?.data || {};
    } catch (err) {
      console.error("Error fetching saltroom services:", err);
      return {};
    }
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

  async getPackages(lang?: string): Promise<ServicePackage[]> {
    try {
      let res: any;
      try {
        res = await ApiClient.get<any>(ENDPOINTS.SERVICES.DETAILS("package"), { params: lang ? { lang } : undefined, skipAuth: true });
      } catch {
        res = await ApiClient.get<any>("/services/details/packages/", { params: lang ? { lang } : undefined, skipAuth: true });
      }
      if (res?.data && Array.isArray(res.data)) return res.data;
      if (Array.isArray(res)) return res;
      return [];
    } catch (err) {
      console.error("Error fetching packages:", err);
      return [];
    }
  },

  async getMembershipPlans(): Promise<{ success: boolean; data: MembershipPlan[] }> {
    return ApiClient.get<{ success: boolean; data: MembershipPlan[] }>(ENDPOINTS.SERVICES.MEMBERSHIPS, { skipAuth: true });
  },

  async getSchedules(): Promise<any> {
    return ApiClient.get(ENDPOINTS.SERVICES.SCHEDULES, { skipAuth: true });
  },

  async getServiceDetails(serviceType: string): Promise<any> {
    return ApiClient.get<any>(ENDPOINTS.SERVICES.DETAILS(serviceType), { skipAuth: true });
  },

  async getServiceSlots(serviceType: string = "sauna", date: string): Promise<ServiceSlotsResponse> {
    const cleanType = (serviceType || "sauna").toLowerCase() === "salt_room" ? "saltroom" : (serviceType || "sauna").toLowerCase();
    
    // 1. Try GET /services/get_slot/?type=...&date=... endpoint first
    try {
      const getSlotRes = await ApiClient.get<any>(ENDPOINTS.SERVICES.GET_SLOT, {
        params: { type: cleanType, date },
      });
      if (getSlotRes) {
        // If the response is already formatted as ServiceSlotsResponse (e.g. has data.private_sauna or data.shared_sauna or data.slots or data.saltroom)
        if (getSlotRes.data) {
          return {
            success: getSlotRes.success ?? true,
            is_blocked: getSlotRes.is_blocked || false,
            is_closed: getSlotRes.is_closed || false,
            date: getSlotRes.date || date,
            service_type: getSlotRes.service_type || cleanType,
            open_time: getSlotRes.open_time,
            close_time: getSlotRes.close_time,
            data: getSlotRes.data,
            message: getSlotRes.message,
          };
        }

        const rawService = getSlotRes.service || {};
        const rawSlots = Array.isArray(getSlotRes.slots) ? getSlotRes.slots : [];
        const normalizedSlots: SaltRoomSlotItem[] = rawSlots.map((s: any) => {
          const timeStr = s.time ? s.time.slice(0, 5) : (s.start_time || "09:00");
          const durationMins = rawService.duration || 45;
          const [h, m] = timeStr.split(":").map(Number);
          const totalEndMin = (h * 60 + m) + durationMins;
          const endH = Math.floor(totalEndMin / 60) % 24;
          const endM = totalEndMin % 60;
          const endTimeStr = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;

          const availCap = typeof s.available_capacity === "number" ? s.available_capacity : (s.remaining_capacity ?? (rawService.max_capacity || 6));
          const isBooked = Boolean(s.is_booked) || availCap <= 0;

          return {
            time: s.time || timeStr,
            start_time: s.start_time || timeStr,
            end_time: s.end_time || endTimeStr,
            duration_minutes: durationMins,
            max_capacity: rawService.max_capacity || 6,
            remaining_capacity: availCap,
            available_capacity: availCap,
            booked_capacity: (rawService.max_capacity || 6) - availCap,
            is_available: !isBooked,
            is_booked: isBooked,
            is_fully_booked: isBooked,
          };
        });

        return {
          success: true,
          is_blocked: getSlotRes.is_blocked || false,
          is_closed: getSlotRes.is_closed || false,
          date: getSlotRes.date || date,
          service_type: cleanType,
          open_time: rawSlots[0]?.time?.slice(0, 5) || "09:00",
          close_time: rawSlots[rawSlots.length - 1]?.time?.slice(0, 5) || "21:00",
          data: {
            price_per_person: rawService.price || "45.00",
            max_capacity: rawService.max_capacity || 6,
            duration_minutes: rawService.duration || 45,
            slots: normalizedSlots,
            available_slots: normalizedSlots.filter((s) => !s.is_booked),
            user_membership: getSlotRes.user_membership,
          },
        };
      }
    } catch (getSlotErr) {
      // Fallback to /services/slots/
    }

    // 2. Query param style /services/slots/?type=saltroom&date=...
    try {
      const res = await ApiClient.get<ServiceSlotsResponse>("/services/slots/", {
        params: { type: cleanType, date },
      });
      if (res && (res.success !== undefined || res.is_blocked !== undefined || res.is_closed !== undefined || res.data)) return res;
    } catch {
      // Fallback to path style /services/slots/:type/?date=...
    }

    return ApiClient.get<ServiceSlotsResponse>(ENDPOINTS.SERVICES.SLOTS(cleanType), {
      params: { date },
    });
  },

  async getPackageSlots(date: string, packageId: number, subType?: string): Promise<PackageSlotsResponse> {
    const params: Record<string, string> = { type: "package", date };
    params.package_id = String(packageId);
    if (subType) params.sub_type = subType;
    return ApiClient.get<PackageSlotsResponse>("/services/slots/", {
      skipAuth: true,
      params,
    });
  },

  async createService(
    data: FormData | Record<string, any>
  ): Promise<any> {
    try {
      return await ApiClient.post("/dashboard/admin/services/manage/", data);
    } catch {
      try {
        return await ApiClient.post("/dashboard/admin/services/", data);
      } catch {
        return ApiClient.post("/services/", data);
      }
    }
  },

  async updateService(
    idOrType: number | string,
    data: FormData | Record<string, any>
  ): Promise<any> {
    const isId = typeof idOrType === "number" || /^\d+$/.test(String(idOrType));
    const endpoint = isId
      ? `/dashboard/admin/services/manage/${idOrType}/`
      : `/dashboard/admin/services/manage/?type=${encodeURIComponent(String(idOrType))}`;

    try {
      return await ApiClient.patch(endpoint, data);
    } catch {
      try {
        return await ApiClient.patch(`/dashboard/admin/services/${idOrType}/`, data);
      } catch {
        return ApiClient.patch(`/services/${idOrType}/`, data);
      }
    }
  },

  async deleteService(
    idOrType: number | string
  ): Promise<any> {
    const isId = typeof idOrType === "number" || /^\d+$/.test(String(idOrType));
    const endpoint = isId
      ? `/dashboard/admin/services/manage/${idOrType}/`
      : `/dashboard/admin/services/manage/?type=${encodeURIComponent(String(idOrType))}`;

    try {
      return await ApiClient.delete(endpoint);
    } catch {
      try {
        return await ApiClient.delete(`/dashboard/admin/services/${idOrType}/`);
      } catch {
        return ApiClient.delete(`/services/${idOrType}/`);
      }
    }
  },

  async getAdminServiceDetail(serviceTypeOrId: string | number): Promise<any> {
    const isId = typeof serviceTypeOrId === "number" || /^\d+$/.test(String(serviceTypeOrId));
    const pathSegment = String(serviceTypeOrId).trim().toLowerCase();

    // 1. Try standard dashboard path
    try {
      const res = await ApiClient.get<any>(`/dashboard/admin/services/${pathSegment}/`, {
        params: isId ? { id: serviceTypeOrId } : { type: pathSegment },
      });
      if (res && res.success) return res;
    } catch {
      // Fallback
    }

    // 2. Try plural dashboards path
    try {
      const res = await ApiClient.get<any>(`/dashboards/admin/services/${pathSegment}/`, {
        params: isId ? { id: serviceTypeOrId } : { type: pathSegment },
      });
      if (res && res.success) return res;
    } catch {
      // Fallback
    }

    // 3. Try details query parameter
    try {
      const res = await ApiClient.get<any>(`/dashboard/admin/services/details/`, {
        params: isId ? { id: serviceTypeOrId } : { type: pathSegment },
      });
      if (res && res.success) return res;
    } catch {
      // Final fallback
    }

    return ApiClient.get(`/dashboard/admin/services/${pathSegment}/`);
  },

  async updateAdminService(
    serviceTypeOrId: string | number,
    data: FormData | Record<string, any>
  ): Promise<any> {
    const pathSegment = String(serviceTypeOrId).trim().toLowerCase();
    try {
      return await ApiClient.patch(`/dashboard/admin/services/${pathSegment}/`, data);
    } catch {
      return ApiClient.patch(`/dashboards/admin/services/${pathSegment}/`, data);
    }
  },

  async updatePrivateSauna(data: Record<string, any>): Promise<any> {
    const payload = {
      section: "service_settings",
      sub_type: "private",
      ...data,
    };
    try {
      return await ApiClient.patch(`/dashboard/admin/services/private-sauna/`, payload);
    } catch {
      return ApiClient.patch(`/dashboard/admin/services/sauna/`, payload);
    }
  },

  async updateSharedSauna(data: Record<string, any>): Promise<any> {
    const payload = {
      section: "service_settings",
      sub_type: "shared",
      ...data,
    };
    try {
      return await ApiClient.patch(`/dashboard/admin/services/shared-sauna/`, payload);
    } catch {
      return ApiClient.patch(`/dashboard/admin/services/sauna/`, payload);
    }
  },

  // ══════════════════════════════════════════════════════════════════════
  // 1. OPENING HOURS / SERVICE SETTINGS CRUD
  // ══════════════════════════════════════════════════════════════════════
  async getOperatingHours(params?: {
    service_id?: number | string;
    service_type?: string;
    id?: number | string;
  }): Promise<any> {
    return ApiClient.get("/dashboard/admin/services/settings/", { params });
  },

  async createOperatingHours(data: {
    service_type?: string;
    service_id?: number | string;
    week_days: string[];
    open_time: string;
    close_time: string;
    is_closed?: boolean;
  }): Promise<any> {
    return ApiClient.post("/dashboard/admin/services/settings/", data);
  },

  async updateOperatingHours(
    settingId: number | string,
    data: Partial<{
      week_days: string[];
      open_time: string;
      close_time: string;
      is_closed: boolean;
    }>
  ): Promise<any> {
    return ApiClient.patch(`/dashboard/admin/services/settings/${settingId}/`, data);
  },

  async deleteOperatingHours(settingId: number | string): Promise<any> {
    return ApiClient.delete(`/dashboard/admin/services/settings/${settingId}/`);
  },

  // ══════════════════════════════════════════════════════════════════════
  // 2. SERVICE FEATURES MANAGEMENT CRUD
  // ══════════════════════════════════════════════════════════════════════
  async getFeatures(params?: {
    service_type?: string;
    sub_type?: string;
    feature_id?: number | string;
  }): Promise<any> {
    return ApiClient.get("/dashboard/admin/services/features/", { params });
  },

  async createFeature(data: {
    service_type: string;
    sub_type?: string;
    feature: string;
    feature_en?: string;
    feature_nl?: string;
    feature_de?: string;
    price?: number | string;
  }): Promise<any> {
    return ApiClient.post("/dashboard/admin/services/features/", data);
  },

  async updateFeature(
    featureId: number | string,
    data: Partial<{
      feature: string;
      feature_en: string;
      feature_nl: string;
      feature_de: string;
      price: number | string;
    }>
  ): Promise<any> {
    return ApiClient.patch(`/dashboard/admin/services/features/${featureId}/`, data);
  },

  async deleteFeature(
    featureId: number | string,
    serviceType?: string,
    subType?: string
  ): Promise<any> {
    try {
      return await ApiClient.delete(`/dashboard/admin/services/features/${featureId}/`);
    } catch (err) {
      if (serviceType) {
        return ApiClient.patch(`/dashboard/admin/services/${serviceType}/`, {
          action: "delete_feature",
          feature_id: featureId,
          ...(subType ? { sub_type: subType } : {}),
        });
      }
      throw err;
    }
  },
};

export default servicesService;
