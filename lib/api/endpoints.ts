/**
 * API Endpoints Registry
 */

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/accounts/login/",
    REGISTER: "/accounts/register/",
    LOGOUT: "/accounts/logout/",
    REFRESH: "/accounts/token/refresh/",
    PROFILE: "/accounts/profile/",
    CHANGE_PASSWORD: "/accounts/password/change/",
    FORGOT_PASSWORD: "/accounts/password/forgot/",
    RESET_PASSWORD: "/accounts/password/reset/",
  },
  USERS: {
    LIST: "/users/",
    DETAIL: (id: string | number) => `/users/${id}/`,
    UPDATE: (id: string | number) => `/users/${id}/`,
  },
  BOOKINGS: {
    LIST: "/bookings/",
    CREATE: "/bookings/",
    DETAIL: (id: string | number) => `/bookings/${id}/`,
    CANCEL: (id: string | number) => `/bookings/${id}/cancel/`,
  },
  WELLNESS: {
    LIST: "/wellness/services/",
    DETAIL: (id: string | number) => `/wellness/services/${id}/`,
  },
  ARRANGEMENTS: {
    LIST: "/arrangements/",
    DETAIL: (id: string | number) => `/arrangements/${id}/`,
  },
  MEMBERSHIPS: {
    LIST: "/memberships/plans/",
    SUBSCRIBE: "/memberships/subscribe/",
  },
  ACTIVITIES: {
    LIST: "/activities/",
    DETAIL: (id: string | number) => `/activities/${id}/`,
  },
  EVENTS: {
    LIST: "/events/",
    DETAIL: (id: string | number) => `/events/${id}/`,
  },
  CONTACT: {
    SUBMIT: "/contact/",
  },
} as const;
