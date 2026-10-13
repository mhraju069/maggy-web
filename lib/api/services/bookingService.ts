/**
 * Booking & Reservations API Service
 */

import ApiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import { Booking, CreateBookingPayload, PaginatedResponse } from "../types";

export interface GetSlotsParams extends Record<string, string | number | boolean | null | undefined> {
  date: string;
  service: string;
}

export interface AvailableSlotsParams extends Record<string, string | number | boolean | null | undefined> {
  date: string;
  service_type: string;
}

export interface CreateSaunaBookingPayload {
  sauna_type: "private" | "shared" | string;
  booking_date: string;
  booking_time: string;
  time_slot: "90_mins" | "3_hours" | "4_hours" | string;
  capacity: number;
  name: string;
  email: string;
  phone: string;
  special_request?: string | null;
  selected_features?: (number | string)[];
  total_price: number | string;
}

export interface CreateSaunaBookingResponse {
  success: boolean;
  booking_id: string;
  client_secret: string;
  payment_intent_id?: string;
  amount?: string;
  currency?: string;
  data?: any;
  message?: string;
}

export interface CreateLunchroomBookingPayload {
  booking_date: string;
  booking_time: string;
  capacity: number;
  name: string;
  email: string;
  phone: string;
  special_request?: string | null;
  celebration_type?: string;
  celebration_date?: string;
  name_of_celebrant?: string;
  age_of_celebrant?: number;
  hobbies?: string;
  celebration_details?: string;
}

export interface CreateLunchroomBookingResponse {
  success: boolean;
  booking_id: string;
  status?: string;
  data?: any;
  message?: string;
  client_secret?: string;
  payment_intent_id?: string;
  amount?: string;
  currency?: string;
}

export interface CreateActivityBookingPayload {
  activity: number | string;
  capacity: number;
  name: string;
  email: string;
  phone: string;
  special_request?: string | null;
  total_price?: number | string;
}

export interface CreateActivityBookingResponse {
  success: boolean;
  booking_id: string;
  client_secret: string;
  payment_intent_id?: string;
  amount?: string;
  currency?: string;
  data?: any;
  message?: string;
}

export interface EventBookingPayload {
  name: string;
  email: string;
  phone: string;
  date: string;
  start_time: string;
  end_time: string;
  guests: number;
  food_preference?: string;
  drink_preference?: string;
  music_preference?: string;
  notes?: string;
}

export interface EventBookingResponse {
  success: boolean;
  booking_id: string;
  data?: any;
  message?: string;
}

export interface PackageBookedServiceItem {
  [serviceKey: string]: string;
}

export interface CreatePackageBookingPayload {
  name: string;
  email: string;
  phone: string;
  date: string;
  guests: number;
  total_price?: string | number;
  is_custom: boolean;
  notes?: string | null;
  booked_services_ids?: PackageBookedServiceItem[];
  service_names?: string[];
  sauna_booking?: {
    sauna_type: string;
    booking_time: string;
    time_slot?: string;
    capacity?: number;
  };
  saltroom_booking?: {
    start_time: string;
    end_time?: string;
    capacity?: number;
    time?: string;
  };
  lunchroom_booking?: {
    booking_time: string;
    capacity?: number;
    [key: string]: any;
  };
  activity_booking?: {
    activity: number;
    capacity?: number;
  };
  [key: string]: any;
}

export interface CreatePackageBookingResponse {
  success: boolean;
  booking_id: string;
  is_custom: boolean;
  status?: string;
  client_secret?: string;
  payment_intent_id?: string;
  amount?: string;
  currency?: string;
  service_names?: string[];
  data?: any;
  message?: string;
}

export interface CreateSaltRoomBookingPayload {
  name: string;
  email: string;
  phone?: string;
  date: string;
  start_time: string;
  end_time?: string;
  capacity?: number;
  payment_mode?: "card" | "pass" | "subscription" | "weekly_subscription" | "unlimited_subscription" | string;
  purchase_id?: string;
  plan_id?: number | string;
  pass_id?: number | string;
  special_request?: string | null;
}

export interface CreateSaltRoomBookingResponse {
  success: boolean;
  booking_id: string;
  purchase_id?: string;
  payment_mode?: string;
  item_name?: string;
  status?: string;
  payment_status?: string;
  is_paid?: boolean;
  remaining_sessions?: number;
  is_unlimited?: boolean;
  client_secret?: string;
  payment_intent_id?: string;
  amount?: number | string;
  currency?: string;
  data?: any;
  message?: string;
}

export const bookingService = {
  async getBookings(params?: Record<string, string | number>): Promise<PaginatedResponse<Booking> | Booking[]> {
    return ApiClient.get<PaginatedResponse<Booking> | Booking[]>(ENDPOINTS.BOOKINGS.LIST, { params });
  },

  async createBooking(payload: CreateBookingPayload | Record<string, any>): Promise<Booking> {
    return ApiClient.post<Booking>(ENDPOINTS.BOOKINGS.CREATE, payload);
  },

  async createSaunaBooking(payload: CreateSaunaBookingPayload): Promise<CreateSaunaBookingResponse> {
    return ApiClient.post<CreateSaunaBookingResponse>(ENDPOINTS.BOOKINGS.SAUNA_CREATE, payload, { skipAuth: true });
  },

  async createSaltRoomBooking(payload: CreateSaltRoomBookingPayload): Promise<CreateSaltRoomBookingResponse> {
    const isGuestCard = payload.payment_mode === "card" || !payload.payment_mode;
    return ApiClient.post<CreateSaltRoomBookingResponse>(
      ENDPOINTS.BOOKINGS.SALTROOM_CREATE,
      payload,
      { skipAuth: isGuestCard }
    );
  },

  async confirmPayment(payload: { payment_intent_id?: string; booking_id?: string; purchase_id?: string }): Promise<any> {
    return ApiClient.post(ENDPOINTS.PAYMENTS.CONFIRM_PAYMENT, payload, { skipAuth: true });
  },

  async createLunchroomBooking(payload: CreateLunchroomBookingPayload): Promise<CreateLunchroomBookingResponse> {
    return ApiClient.post<CreateLunchroomBookingResponse>(ENDPOINTS.BOOKINGS.LUNCHROOM_CREATE, payload, { skipAuth: true });
  },

  async createActivityBooking(payload: CreateActivityBookingPayload): Promise<CreateActivityBookingResponse> {
    return ApiClient.post<CreateActivityBookingResponse>(ENDPOINTS.BOOKINGS.ACTIVITIES_CREATE, payload, { skipAuth: true });
  },

  async createEventBooking(payload: EventBookingPayload): Promise<EventBookingResponse> {
    return ApiClient.post<EventBookingResponse>(ENDPOINTS.BOOKINGS.EVENTS_CREATE, payload, { skipAuth: true });
  },

  async createPackageBooking(payload: CreatePackageBookingPayload): Promise<CreatePackageBookingResponse> {
    return ApiClient.post<CreatePackageBookingResponse>(ENDPOINTS.BOOKINGS.PACKAGES_CREATE, payload, { skipAuth: true });
  },

  async createPaymentIntent(bookingId: string, currency: string = "eur"): Promise<{ success: boolean; client_secret: string; booking_id: string }> {
    return ApiClient.post(ENDPOINTS.PAYMENTS.CREATE_INTENT, { booking_id: bookingId, currency }, { skipAuth: true });
  },

  async getBookingDetails(id: string | number): Promise<Booking> {
    return ApiClient.get<Booking>(ENDPOINTS.BOOKINGS.DETAIL(id));
  },

  async cancelBooking(id: string | number): Promise<Booking> {
    return ApiClient.post<Booking>(ENDPOINTS.BOOKINGS.CANCEL(id));
  },

  async getTimeSlots(params: GetSlotsParams): Promise<any> {
    return ApiClient.get(ENDPOINTS.BOOKINGS.SLOTS, { params });
  },

  async getAvailableSlots(params: AvailableSlotsParams): Promise<any> {
    return ApiClient.get(ENDPOINTS.BOOKINGS.AVAILABLE_SLOTS, { params, skipAuth: true });
  },

  async getUserMemberships(): Promise<any> {
    return ApiClient.get(ENDPOINTS.BOOKINGS.USER_MEMBERSHIPS);
  },

  async getUserSessionPasses(): Promise<any> {
    return ApiClient.get(ENDPOINTS.BOOKINGS.USER_SESSION_PASSES);
  },
};

export default bookingService;
