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
  log?: string;
  error?: string;
  errors?: Record<string, string[] | string> | string[];
  status?: number | boolean;
  [key: string]: unknown;
}

function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ");
}

export function parseApiErrorMessage(data: unknown): string {
  if (!data) return "An unexpected API error occurred.";

  if (typeof data === "string") return data;

  if (typeof data === "object") {
    const obj = data as Record<string, unknown>;

    // 1. Explicit message keys
    if (typeof obj.message === "string" && obj.message.trim()) return obj.message;
    if (typeof obj.detail === "string" && obj.detail.trim()) return obj.detail;
    if (typeof obj.log === "string" && obj.log.trim()) return obj.log;
    if (typeof obj.error === "string" && obj.error.trim()) return obj.error;

    // 2. Handling obj.errors
    if (obj.errors) {
      if (typeof obj.errors === "string" && obj.errors.trim()) return obj.errors;
      if (Array.isArray(obj.errors) && obj.errors.length > 0) {
        return obj.errors.map((e) => (typeof e === "string" ? e : JSON.stringify(e))).join(" ");
      }
      if (typeof obj.errors === "object") {
        return parseApiErrorMessage(obj.errors);
      }
    }

    // 3. Handling DRF field errors dictionary e.g. {"password": ["Ensure this field has at least 6 characters."]}
    const messages: string[] = [];

    for (const [key, value] of Object.entries(obj)) {
      if (key === "status" || key === "code" || key === "status_code") continue;

      if (typeof value === "string" && value.trim()) {
        const prefix = key !== "non_field_errors" && key !== "detail" ? `${capitalize(key)}: ` : "";
        messages.push(`${prefix}${value}`);
      } else if (Array.isArray(value) && value.length > 0) {
        const fieldMsgs = value.map((item) => (typeof item === "string" ? item : JSON.stringify(item))).join(", ");
        const prefix = key !== "non_field_errors" && key !== "detail" ? `${capitalize(key)}: ` : "";
        messages.push(`${prefix}${fieldMsgs}`);
      } else if (typeof value === "object" && value !== null) {
        messages.push(parseApiErrorMessage(value));
      }
    }

    if (messages.length > 0) {
      return messages.join(" | ");
    }
  }

  return "An unexpected API error occurred.";
}

export class ApiError extends Error {
  status: number;
  data: ApiErrorResponse;

  constructor(status: number, data: ApiErrorResponse) {
    const message = parseApiErrorMessage(data);
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
  status?: boolean;
  log?: string;
  user?: User;
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

export interface FirebaseSocialAuthPayload {
  id_token: string;
  role?: string;
}

export interface SimpleApiResponse {
  status: boolean;
  log: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp_code: string;
  new_password: string;
}

// Domain Model Types (Booking, Services, etc.)
export interface CelebrationDetails {
  is_celebrating?: boolean;
  occasion?: string;
  celebrant_name?: string;
  age?: string | number;
  hobbies_interests?: string;
  other_details?: string;
}

export interface Booking {
  id: string | number;
  service_name?: string;
  booking_date?: string;
  time_slot?: string;
  status?: "pending" | "confirmed" | "cancelled" | "completed";
  guests_count?: number;
  special_requests?: string;
  celebration?: CelebrationDetails;
  created_at?: string;
  user?: User | number | string;
}

export interface CreateBookingPayload {
  service_name: string;
  booking_date: string;
  time_slot: string;
  guests_count?: number;
  special_requests?: string;
  celebration?: CelebrationDetails;
}

export interface ServiceFeature {
  id?: number;
  feature: string;
}

export type ServiceType = "sauna" | "arrangement" | "activity" | "lunchroom" | string;
export type PaymentType = "full" | "partial" | "on_spot" | string;

export interface ServiceItem {
  id: number;
  service_type: ServiceType;
  title: string;
  subtitle?: string;
  description: string;
  image?: string | null;
  price: string | number;
  payment_type?: PaymentType;
  is_active?: boolean;
  features?: ServiceFeature[];
  capacity?: number;
  created_at?: string;
  updated_at?: string;
}
