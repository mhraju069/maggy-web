/**
 * Booking & Reservations API Service
 */

import ApiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import { Booking, CreateBookingPayload, PaginatedResponse } from "../types";

export const bookingService = {
  /**
   * Get list of user bookings
   */
  async getBookings(params?: Record<string, string | number>): Promise<PaginatedResponse<Booking> | Booking[]> {
    return ApiClient.get<PaginatedResponse<Booking> | Booking[]>(ENDPOINTS.BOOKINGS.LIST, { params });
  },

  /**
   * Create a new booking
   */
  async createBooking(payload: CreateBookingPayload): Promise<Booking> {
    return ApiClient.post<Booking>(ENDPOINTS.BOOKINGS.CREATE, payload);
  },

  /**
   * Get details of a single booking
   */
  async getBookingDetails(id: string | number): Promise<Booking> {
    return ApiClient.get<Booking>(ENDPOINTS.BOOKINGS.DETAIL(id));
  },

  /**
   * Cancel an existing booking
   */
  async cancelBooking(id: string | number): Promise<Booking> {
    return ApiClient.post<Booking>(ENDPOINTS.BOOKINGS.CANCEL(id));
  },
};

export default bookingService;
