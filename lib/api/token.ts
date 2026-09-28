/**
 * Token & Session Cookie Storage Utilities
 */

const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const ROLE_KEY = "role";
const USER_KEY = "user_info";

export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  
  // 1. Try cookie first
  const match = document.cookie.match(new RegExp("(^| )" + TOKEN_KEY + "=([^;]+)"));
  if (match) return match[2];

  // 2. Fallback to localStorage
  return localStorage.getItem(TOKEN_KEY);
};

export const getStoredRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const getStoredRole = (): string | null => {
  if (typeof window === "undefined") return null;
  
  const match = document.cookie.match(new RegExp("(^| )" + ROLE_KEY + "=([^;]+)"));
  if (match) return match[2];

  return localStorage.getItem(ROLE_KEY);
};

export const setAuthToken = (token: string, refreshToken?: string, role?: string): void => {
  if (typeof window === "undefined") return;

  // Set cookies (readable by Next.js middleware)
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=604800; SameSite=Lax`;
  localStorage.setItem(TOKEN_KEY, token);

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  if (role) {
    document.cookie = `${ROLE_KEY}=${role}; path=/; max-age=604800; SameSite=Lax`;
    localStorage.setItem(ROLE_KEY, role);
  }
};

export const clearAuthSession = (): void => {
  if (typeof window === "undefined") return;

  // Delete cookies by setting max-age=0
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${ROLE_KEY}=; path=/; max-age=0; SameSite=Lax`;

  // Clear local storage items
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USER_KEY);
};
