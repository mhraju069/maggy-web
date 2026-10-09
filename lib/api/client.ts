/**
 * Core HTTP Client Wrapper built on Native fetch
 */

import { DEFAULT_HEADERS, DEFAULT_TIMEOUT, buildApiUrl } from "./config";
import { clearAuthSession, getStoredToken } from "./token";
import { ApiError, ApiErrorResponse, HttpMethod, RequestConfig } from "./types";

export class ApiClient {
  private static async request<T>(
    endpoint: string,
    method: HttpMethod,
    data?: unknown,
    config: RequestConfig = {}
  ): Promise<T> {
    const {
      params,
      headers: customHeaders = {},
      token,
      timeout = DEFAULT_TIMEOUT,
      skipAuth = false,
      ...fetchOptions
    } = config;

    const url = buildApiUrl(endpoint, params);

    // Build Headers
    const activeLang =
      typeof window !== "undefined"
        ? localStorage.getItem("haven_language") || "en"
        : "en";

    const headers: Record<string, string> = {
      ...DEFAULT_HEADERS,
      "Accept-Language": activeLang,
      lang: activeLang,
      ...customHeaders,
    };

    // Inject Bearer Token
    if (!skipAuth) {
      const activeToken = token || getStoredToken();
      if (activeToken) {
        headers["Authorization"] = `Bearer ${activeToken}`;
      }
    }

    // Set up AbortController timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Prepare RequestInit
    const options: RequestInit = {
      method,
      headers,
      signal: controller.signal,
      ...fetchOptions,
    };

    if (data !== undefined && data !== null && method !== "GET") {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      clearTimeout(timeoutId);

      // Handle HTTP Error status codes
      if (!response.ok) {
        let errorData: ApiErrorResponse = {};
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText || `HTTP Error ${response.status}` };
        }

        // On 401 Unauthorized, automatically clear invalid token session
        if (response.status === 401 && !skipAuth) {
          clearAuthSession();
        }

        throw new ApiError(response.status, errorData);
      }

      // 204 No Content response
      if (response.status === 204) {
        return {} as T;
      }

      // Parse JSON response
      const json = await response.json();
      return json as T;
    } catch (err: unknown) {
      clearTimeout(timeoutId);

      if (err instanceof ApiError) {
        throw err;
      }

      if (err instanceof Error && err.name === "AbortError") {
        throw new ApiError(408, { message: "Request timed out. Please try again." });
      }

      throw new ApiError(500, {
        message: err instanceof Error ? err.message : "Network error or server unreachable.",
      });
    }
  }

  static get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, "GET", undefined, config);
  }

  static post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, "POST", data, config);
  }

  static put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, "PUT", data, config);
  }

  static patch<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, "PATCH", data, config);
  }

  static delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, "DELETE", undefined, config);
  }
}

export default ApiClient;
