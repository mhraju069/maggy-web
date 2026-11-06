"use client";

import { updateStoredBookingData } from "@/lib/bookingStore";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LunchroomBookingPage() {
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    updateStoredBookingData({
      serviceName: "Lunchroom Table Reservation",
      serviceType: "lunchroom",
      price: "€0",
      durationHours: undefined,
      activityDetails: undefined,
      isSharedSauna: false,
      isSaltRoom: false,
      selectedExtras: [],
    });
    router.replace("/booking/information");
  }, [router]);

  return (
    <div className="w-full py-24 text-center text-[#8B7355] font-medium text-sm flex items-center justify-center gap-2">
      <div className="w-5 h-5 border-2 border-[#8B7355] border-t-transparent rounded-full animate-spin"></div>
      <span>{(t as any)?.bookingFlow?.common?.redirectingToLunchroom || "Redirecting to Lunchroom reservation details..."}</span>
    </div>
  );
}
