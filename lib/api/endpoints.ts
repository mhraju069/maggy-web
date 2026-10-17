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
    PROFILE: "/auth/user/",
    USER: "/auth/user/",
    CHANGE_PASSWORD: "/auth/password/change/",
    FORGOT_PASSWORD: "/auth/password/forgot/",
    RESET_PASSWORD: "/auth/password/reset/",
  },
  USERS: {
    LIST: "/users/",
    DETAIL: (id: string | number) => `/users/${id}/`,
    UPDATE: (id: string | number) => `/users/${id}/`,
    ADMIN: {
      LIST: "/dashboard/admin/users/",
      DETAIL: (id: string | number) => `/dashboard/admin/users/${id}/`,
      UPDATE: (id: string | number) => `/dashboard/admin/users/${id}/`,
      DELETE: (id: string | number) => `/dashboard/admin/users/${id}/`,
    },
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
    SAUNA_CREATE: "/bookings/sauna/",
    SAUNA_CONFIRM: "/bookings/sauna/confirm/",
    LUNCHROOM_CREATE: "/bookings/lunchroom/",
    ACTIVITIES_CREATE: "/bookings/activities/",
    SALTROOM_CREATE: "/bookings/saltroom/",
    EVENTS_CREATE: "/bookings/events/",
    PACKAGES_CREATE: "/bookings/packages/",
    ADMIN: {
      LIST: "/dashboard/admin/bookings/",
      DETAIL: (id: string | number) => `/dashboard/admin/bookings/${id}/`,
      UPDATE: (id: string | number) => `/dashboard/admin/bookings/${id}/`,
    },
  },
  PAYMENTS: {
    CREATE_INTENT: "/payments/create-intent/",
    PLANS_AND_PASSES: "/payments/plans-and-passes/",
    SESSION_PASSES: "/payments/session-passes/",
    SESSION_PASS_DETAIL: (id: string | number) => `/payments/session-passes/${id}/`,
    SUBSCRIPTION_PLANS: "/payments/subscription-plans/",
    SUBSCRIPTION_PLAN_DETAIL: (id: string | number) => `/payments/subscription-plans/${id}/`,
    PURCHASE: "/payments/purchase/",
    CONFIRM: "/payments/confirm/",
    CONFIRM_PAYMENT: "/payments/confirm-payment/",
    ADMIN: {
      LIST: "/dashboard/admin/payments/",
    },
  },
  SERVICES: {
    ALL: "/services/",
    DETAILS: (serviceType: string) => `/services/details/${serviceType}/`,
    SAUNA: "/services/details/sauna/",
    ACTIVITIES: "/services/details/activity/",
    SALT_ROOM: "/services/details/saltroom/",
    PACKAGES: "/services/details/package/",
    LUNCHROOM: "/services/details/lunchroom/",
    EXTRAS: "/services/extras/",
    EVENTS_INQUIRY: "/services/events/inquiry/",
    MEMBERSHIPS: "/services/memberships/",
    SCHEDULES: "/services/schedules/",
    GET_SLOT: "/services/get_slot/",
    SLOTS: (serviceType?: string) => serviceType ? `/services/slots/${serviceType}/` : "/services/slots/",
    ADMIN: {
      MANAGE: "/dashboard/admin/services/manage/",
      SETTINGS: "/dashboard/admin/services/settings/",
      FEATURES: "/dashboard/admin/services/features/",
      DETAIL: (serviceType: string) => `/dashboard/admin/services/${serviceType}/`,
    },
  },
  CONTACT: {
    SUBMIT: "/contact/",
  },
  ACCESS_CODES: {
    ADMIN: {
      LIST: "/dashboard/admin/access-codes/",
      DETAIL: (code: string | number) => `/dashboard/admin/access-codes/${code}/`,
    },
  },
  DATES: {
    ADMIN: {
      OVERVIEW: "/dashboard/admin/dates/",
      BLOCKED: {
        LIST: "/dashboard/admin/dates/blocked/",
        DETAIL: (id: string | number) => `/dashboard/admin/dates/blocked/${id}/`,
      },
      SPECIAL_OPENINGS: {
        LIST: "/dashboard/admin/dates/special-openings/",
        DETAIL: (id: string | number) => `/dashboard/admin/dates/special-openings/${id}/`,
      },
    },
  },
  DASHBOARD: {
    USER: "/dashboard/user/",
  },
  OTHERS: {
    CONTACT_INFO: "/others/contact-info/",
    PRIVACY_POLICY: "/others/privacy-policy/",
    TERMS_AND_CONDITIONS: "/others/terms-and-conditions/",
    SUPPORT_MESSAGES: {
      LIST: "/others/support-messages/",
      DETAIL: (id: string | number) => `/others/support-messages/${id}/`,
    },
  },
} as const;
