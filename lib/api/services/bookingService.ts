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

  async createLunchroomBooking(payload: CreateLunchroomBookingPayload): Promise<CreateLunchroomBookingResponse> {
    return ApiClient.post<CreateLunchroomBookingResponse>(ENDPOINTS.BOOKINGS.LUNCHROOM_CREATE, payload, { skipAuth: true });
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
