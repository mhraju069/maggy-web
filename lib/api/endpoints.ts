/**
 * API Endpoints Registry
 */

export const ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register/",
    LOGIN: "/auth/login/",
    LOGOUT: "/auth/logout/",
    VERIFY_OTP: "/auth/verify-otp/",
    REFRESH: "/auth/token/refresh/",
    PROFILE: "/auth/profile/",
    CHANGE_PASSWORD: "/auth/password/change/",
    FORGOT_PASSWORD: "/auth/password/forgot/",
    RESET_PASSWORD: "/auth/password/reset/",
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
    SLOTS: "/bookings/slots/",
    AVAILABLE_SLOTS: "/bookings/available-slots/",
    USER_MEMBERSHIPS: "/bookings/memberships/",
    USER_SESSION_PASSES: "/bookings/session-passes/",
  },
  SERVICES: {
    ALL: "/services/",
    SAUNA: "/services/sauna/",
    ACTIVITIES: "/services/activities/",
    SALT_ROOM: "/services/salt-room/",
    EXTRAS: "/services/extras/",
    EVENTS_INQUIRY: "/services/events/inquiry/",
    PACKAGES: "/services/packages/",
    MEMBERSHIPS: "/services/memberships/",
    SCHEDULES: "/services/schedules/",
  },
  CONTACT: {
    SUBMIT: "/contact/",
  },
} as const;
