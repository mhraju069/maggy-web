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

export const bookingService = {
  async getBookings(params?: Record<string, string | number>): Promise<PaginatedResponse<Booking> | Booking[]> {
    return ApiClient.get<PaginatedResponse<Booking> | Booking[]>(ENDPOINTS.BOOKINGS.LIST, { params });
  },

  async createBooking(payload: CreateBookingPayload | Record<string, any>): Promise<Booking> {
    return ApiClient.post<Booking>(ENDPOINTS.BOOKINGS.CREATE, payload);
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
