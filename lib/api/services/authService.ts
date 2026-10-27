/**
 * Authentication API Service
 */

import ApiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import { clearAuthSession, setAuthToken } from "../token";
import {
  AuthResponse,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginCredentials,
  RegisterCredentials,
  RegisterResponse,
  ResetPasswordPayload,
  TokenPair,
  User,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from "../types";

export const authService = {
  /**
   * Log in user with username/email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await ApiClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, credentials, {
      skipAuth: true,
    });

    const token = response.access || response.token || response.tokens?.access;
    const refresh = response.refresh || response.tokens?.refresh;
    const role = response.user?.role || "user";

    if (response.status !== false && token) {
      setAuthToken(token, refresh, role);
      if (typeof window !== "undefined" && response.user) {
        localStorage.setItem("user_info", JSON.stringify(response.user));
        const userLang = (response.user.language || "").toLowerCase();
        if (userLang && ["en", "nl", "de"].includes(userLang)) {
          localStorage.setItem("haven_language", userLang);
          window.dispatchEvent(new Event("languageChange"));
        }
      }
    }

    return response;
  },

  /**
   * Register a new account
   * Endpoint: http://localhost/api/auth/register/
   */
  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    return ApiClient.post<RegisterResponse>(ENDPOINTS.AUTH.REGISTER, credentials, {
      skipAuth: true,
    });
  },

  /**
   * Verify OTP code for email activation
   * Endpoint: http://localhost/api/auth/verify-otp/
   */
  async verifyOtp(payload: VerifyOtpPayload): Promise<VerifyOtpResponse> {
    const response = await ApiClient.post<VerifyOtpResponse>(ENDPOINTS.AUTH.VERIFY_OTP, payload, {
      skipAuth: true,
    });

    if (response.access) {
      const role = response.user?.role || "user";
      setAuthToken(response.access, response.refresh, role);
    }

    return response;
  },

  /**
   * Log out user session
   */
  async logout(): Promise<{ message?: string }> {
    try {
      const response = await ApiClient.post<{ message?: string }>(ENDPOINTS.AUTH.LOGOUT);
      return response;
    } finally {
      clearAuthSession();
    }
  },

  /**
   * Get current authenticated user profile
   */
  async getProfile(): Promise<User> {
    return ApiClient.get<User>(ENDPOINTS.AUTH.PROFILE);
  },

  /**
   * Update current authenticated user profile (supports JSON or FormData for image)
   * Endpoint: /api/auth/user/ (PATCH)
   */
  async updateProfile(data: (Partial<User> & Record<string, any>) | FormData): Promise<User> {
    return ApiClient.patch<User>(ENDPOINTS.AUTH.USER, data);
  },

  /**
   * Refresh JWT Token
   */
  async refreshToken(refreshToken: string): Promise<TokenPair> {
    return ApiClient.post<TokenPair>(
      ENDPOINTS.AUTH.REFRESH,
      { refresh: refreshToken },
      { skipAuth: true }
    );
  },

  /**
   * Change user password
   */
  async changePassword(payload: ChangePasswordPayload): Promise<{ message: string }> {
    return ApiClient.post<{ message: string }>(ENDPOINTS.AUTH.CHANGE_PASSWORD, payload);
  },

  /**
   * Log in user with Firebase ID Token (Google, Apple, Phone, etc.)
   */
  async firebaseLogin(idToken: string, role: string = "user"): Promise<AuthResponse> {
    const response = await ApiClient.post<AuthResponse>(
      ENDPOINTS.AUTH.FIREBASE_LOGIN,
      { id_token: idToken, role },
      { skipAuth: true }
    );

    const token = response.access || response.token || response.tokens?.access;
    const refresh = response.refresh || response.tokens?.refresh;
    const userRole = response.user?.role || "user";

    if (response.status !== false && token) {
      setAuthToken(token, refresh, userRole);
      if (typeof window !== "undefined" && response.user) {
        localStorage.setItem("user_info", JSON.stringify(response.user));
        const userLang = (response.user.language || "").toLowerCase();
        if (userLang && ["en", "nl", "de"].includes(userLang)) {
          localStorage.setItem("haven_language", userLang);
          window.dispatchEvent(new Event("languageChange"));
        }
      }
    }

    return response;
  },

  /**
   * Request password reset OTP
   */
  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ status: boolean; log: string }> {
    return ApiClient.post<{ status: boolean; log: string }>(
      ENDPOINTS.AUTH.FORGOT_PASSWORD,
      payload,
      { skipAuth: true }
    );
  },

  /**
   * Reset password with OTP and new password
   */
  async resetPassword(payload: ResetPasswordPayload): Promise<{ status: boolean; log: string }> {
    return ApiClient.post<{ status: boolean; log: string }>(
      ENDPOINTS.AUTH.RESET_PASSWORD,
      payload,
      { skipAuth: true }
    );
  },
};

export default authService;
