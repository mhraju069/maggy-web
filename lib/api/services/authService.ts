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
   * Update current authenticated user profile
   */
  async updateProfile(data: Partial<User> & Record<string, any>): Promise<User> {
    return ApiClient.patch<User>(ENDPOINTS.AUTH.PROFILE, data);
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
   * Request password reset link
   */
  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
    return ApiClient.post<{ message: string }>(ENDPOINTS.AUTH.FORGOT_PASSWORD, payload, {
      skipAuth: true,
    });
  },

  /**
   * Reset password with reset token
   */
  async resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
    return ApiClient.post<{ message: string }>(ENDPOINTS.AUTH.RESET_PASSWORD, payload, {
      skipAuth: true,
    });
  },
};

export default authService;
