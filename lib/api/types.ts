/**
 * Core API Types and Interfaces
 */

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestConfig extends Omit<RequestInit, "body" | "method"> {
  params?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
  token?: string;
  timeout?: number;
  skipAuth?: boolean;
}

export interface ApiResponse<T = unknown> {
  success?: boolean;
  message?: string;
  data: T;
  status: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiErrorResponse {
  message?: string;
  detail?: string;
  errors?: Record<string, string[] | string>;
  status?: number;
  [key: string]: unknown;
}

export class ApiError extends Error {
  status: number;
  data: ApiErrorResponse;

  constructor(status: number, data: ApiErrorResponse) {
    const message =
      data.message || data.detail || (typeof data.errors === "string" ? data.errors : "An unexpected API error occurred.");
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// User & Auth Types
export interface User {
  id: number | string;
  email: string;
  uid?: string | null;
  name?: string;
  username?: string;
  bio?: string | null;
  image?: string | null;
  phone?: string | null;
  language?: string;
  role?: "user" | "admin" | string;
  created_at?: string;
  updated_at?: string;
}

export interface TokenPair {
  access: string;
  refresh?: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
  access?: string;
  refresh?: string;
  tokens?: TokenPair;
  message?: string;
}

export interface LoginCredentials {
  email?: string;
  username?: string;
  password?: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  status: boolean;
  log: string;
  user: User;
}

export interface VerifyOtpPayload {
  email: string;
  otp_code: string;
}

export interface VerifyOtpResponse {
  user?: User;
  refresh?: string;
  access?: string;
  status?: boolean;
  log?: string;
}

export interface ChangePasswordPayload {
  old_password?: string;
  new_password?: string;
  confirm_password?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token?: string;
  uid?: string;
  new_password?: string;
  confirm_password?: string;
}

// Domain Model Types (Booking, Services, etc.)
export interface Booking {
  id: string | number;
  service_name?: string;
  booking_date?: string;
  time_slot?: string;
  status?: "pending" | "confirmed" | "cancelled" | "completed";
  guests_count?: number;
  special_requests?: string;
  created_at?: string;
  user?: User | number | string;
}

export interface CreateBookingPayload {
  service_name: string;
  booking_date: string;
  time_slot: string;
  guests_count?: number;
  special_requests?: string;
}
