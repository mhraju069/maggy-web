/**
 * Booking Session Storage Utility
 * Retains booking selection, date/time, customer information, and celebration details across booking steps.
 */

export interface CelebrationData {
  isCelebrating: boolean;
  occasion: string;
  celebrantName: string;
  age: string;
  hobbiesInterests: string;
  otherDetails: string;
}

export interface BookingData {
  serviceId?: number;
  serviceName: string;
  serviceType: string;
  price: string;
  date: string;
  timeSlot: string;
  guestsCount: number;
  name: string;
  email: string;
  phone: string;
  requests: string;
  celebration: CelebrationData;
}

const STORAGE_KEY = "maggy_booking_data";

export const initialBookingData: BookingData = {
  serviceName: "Lunchroom Table Reservation",
  serviceType: "lunchroom",
  price: "$0",
  date: "",
  timeSlot: "",
  guestsCount: 2,
  name: "",
  email: "",
  phone: "",
  requests: "",
  celebration: {
    isCelebrating: false,
    occasion: "Birthday",
    celebrantName: "",
    age: "",
    hobbiesInterests: "",
    otherDetails: "",
  },
};

export const getStoredBookingData = (): BookingData => {
  if (typeof window === "undefined") return initialBookingData;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return initialBookingData;
    const parsed = JSON.parse(raw);
    return { ...initialBookingData, ...parsed, celebration: { ...initialBookingData.celebration, ...(parsed.celebration || {}) } };
  } catch {
    return initialBookingData;
  }
};

export const updateStoredBookingData = (partial: Partial<BookingData>): BookingData => {
  if (typeof window === "undefined") return initialBookingData;
  try {
    const current = getStoredBookingData();
    const updated = { ...current, ...partial };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return initialBookingData;
  }
};

export const clearStoredBookingData = (): void => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {}
};
