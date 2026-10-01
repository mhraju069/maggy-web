/**
 * Booking Session Storage Utility
 * Retains booking selection, date/time, customer information, celebration details, and sauna options across booking steps.
 */

export interface CelebrationData {
  isCelebrating: boolean;
  occasion: string;
  celebrantName: string;
  age: string;
  hobbiesInterests: string;
  otherDetails: string;
}

export interface BookingExtra {
  id: string;
  name: string;
  price: number;
}

export interface BookingData {
  serviceId?: number;
  serviceName: string;
  serviceType: string;
  price: string;
  date: string;
  timeSlot: string;
  guestsCount: number;
  durationHours?: number; // 3 or 4 hours for Private Sauna
  cleaningTimeMinutes?: number; // Default 30 mins
  selectedExtras?: BookingExtra[];
  totalAmount?: number;
  paymentMethod?: string;
  name: string;
  email: string;
  phone: string;
  requests: string;
  celebration: CelebrationData;
}

const STORAGE_KEY = "maggy_booking_data";

export const initialBookingData: BookingData = {
  serviceName: "Private Sauna",
  serviceType: "sauna",
  price: "€250",
  date: "",
  timeSlot: "",
  guestsCount: 2,
  durationHours: 3,
  cleaningTimeMinutes: 30,
  selectedExtras: [],
  totalAmount: 250,
  paymentMethod: "ideal",
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

export const calculatePrivateSaunaPrice = (durationHours: number, guestsCount: number, extras: BookingExtra[] = []): number => {
  const validGuests = Math.min(Math.max(guestsCount, 2), 6);
  const basePrice = durationHours === 4 ? 300 : 250;
  const extraGuestPrice = (validGuests - 2) * 50;
  const extrasTotal = extras.reduce((sum, item) => sum + (item.price || 0), 0);
  return basePrice + extraGuestPrice + extrasTotal;
};

export const getStoredBookingData = (): BookingData => {
  if (typeof window === "undefined") return initialBookingData;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return initialBookingData;
    const parsed = JSON.parse(raw);
    return {
      ...initialBookingData,
      ...parsed,
      celebration: { ...initialBookingData.celebration, ...(parsed.celebration || {}) },
      selectedExtras: parsed.selectedExtras || [],
    };
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
