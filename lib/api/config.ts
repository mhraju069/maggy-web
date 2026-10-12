/**
 * Global API Configuration Settings
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost/api";

export const DEFAULT_TIMEOUT = Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000;

export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "ngrok-skip-browser-warning": "true",
  "bypass-tunnel-reminder": "true",
};

/**
 * Builds a clean full API URL from an endpoint string.
 */
export const buildApiUrl = (endpoint: string, params?: Record<string, string | number | boolean | undefined | null>): string => {
  const cleanBase = API_BASE_URL.replace(/\/+$/, "");
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const fullUrl = `${cleanBase}${cleanEndpoint}`;

  if (!params) return fullUrl;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${fullUrl}?${queryString}` : fullUrl;
};

/**
 * Formats image URLs returned from backend API or relative paths.
 */
export const formatImageUrl = (
  imageSrc: string | null | undefined,
  fallback: string = "/images/logo.png"
): string => {
  if (!imageSrc) return fallback;

  if (imageSrc.startsWith("http://") || imageSrc.startsWith("https://")) {
    return imageSrc;
  }

  if (imageSrc.startsWith("/media/") || imageSrc.startsWith("media/")) {
    const cleanPath = imageSrc.startsWith("/") ? imageSrc : `/${imageSrc}`;
    const baseHost = API_BASE_URL.replace(/\/api\/?$/, "");
    return `${baseHost}${cleanPath}`;
  }

  if (imageSrc.startsWith("/")) {
    return imageSrc;
  }

  return fallback;
};
