"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { servicesService, ServiceSlotsResponse } from "@/lib/api";
import { getStoredBookingData, updateStoredBookingData } from "@/lib/bookingStore";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { BiCheckCircle, BiInfoCircle, BiTimeFive } from "react-icons/bi";
import { FaSpa, FaWalking } from "react-icons/fa";
import { useLanguage } from "@/lib/i18n/LanguageContext";

function generateTimeSlotsBetween(openTime?: string, closeTime?: string, intervalMinutes: number = 60): string[] {
  if (!openTime || !closeTime) return [];
  const [startH, startM] = openTime.split(":").map(Number);
  const [endH, endM] = closeTime.split(":").map(Number);
  if (isNaN(startH) || isNaN(endH)) return [];

  const startMinutes = startH * 60 + (startM || 0);
  const endMinutes = endH * 60 + (endM || 0);
  if (startMinutes >= endMinutes) return [];

  const slots: string[] = [];
  for (let m = startMinutes; m <= endMinutes; m += intervalMinutes) {
    const hh = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    slots.push(`${hh}:${mm}`);
  }
  return slots;
}

export default function ChooseTimePage() {
  const { t } = useLanguage();
  const flow = (t as any)?.bookingFlow;
  const ctTrans = flow?.chooseTime;
  const btnTrans = flow?.buttons;

  const [storedData, setStoredData] = useState(getStoredBookingData());
  const serviceTypeLower = (storedData.serviceType || "").toLowerCase().trim();
  const serviceNameLower = (storedData.serviceName || "").toLowerCase().trim();

  const isPackage = serviceTypeLower === "package" || serviceTypeLower === "packages";
  const isLunchroom = !isPackage && (serviceTypeLower === "lunchroom" || serviceNameLower.includes("lunchroom"));
  const isSaltRoom = !isPackage && !isLunchroom && serviceTypeLower !== "sauna" && (serviceTypeLower === "salt_room" || serviceTypeLower === "saltroom" || storedData.isSaltRoom || serviceNameLower.includes("salt"));
  const isSharedSauna = !isPackage && !isLunchroom && !isSaltRoom && (storedData.isSharedSauna || (serviceTypeLower === "sauna" && (serviceNameLower.includes("shared") || (!serviceNameLower.includes("private") && storedData.isSharedSauna))));
  const isPrivateSauna = !isPackage && !isLunchroom && !isSaltRoom && !isSharedSauna;

  const [saunaPrices, setSaunaPrices] = useState<{
    price3Hrs: number;
    price4Hrs: number;
    extraPersonFee: number;
    sharedPricePerson: number;
  }>({
    price3Hrs: 250,
    price4Hrs: 300,
    extraPersonFee: 50,
    sharedPricePerson: 35,
  });

  useEffect(() => {
    if (isPrivateSauna || isSharedSauna) {
      servicesService
        .getSaunaServices()
        .then((res: any) => {
          const rawData = res?.data || res;
          const privateItem = rawData?.private_sauna?.[0] || (Array.isArray(rawData) ? rawData[0] : undefined);
          const sharedItem = rawData?.shared_sauna?.[0];

          const p3 = privateItem?.base_price_3hrs ? parseFloat(String(privateItem.base_price_3hrs)) : 250;
          const p4 = privateItem?.base_price_4hrs ? parseFloat(String(privateItem.base_price_4hrs)) : 300;
          const extraP = privateItem?.extra_person_price ? parseFloat(String(privateItem.extra_person_price)) : 50;
          const sharedP = sharedItem?.price_per_person ? parseFloat(String(sharedItem.price_per_person)) : 35;

          setSaunaPrices({
            price3Hrs: isNaN(p3) ? 250 : p3,
            price4Hrs: isNaN(p4) ? 300 : p4,
            extraPersonFee: isNaN(extraP) ? 50 : extraP,
            sharedPricePerson: isNaN(sharedP) ? 35 : sharedP,
          });
        })
        .catch((err) => console.error("Error fetching sauna prices in choose-time:", err));
    }
  }, [isPrivateSauna, isSharedSauna]);

  const [date, setDate] = useState(storedData.date || "");
  const [selectedTime, setSelectedTime] = useState<string | null>(storedData.timeSlot || null);
  const [guests, setGuests] = useState(String(storedData.guestsCount || (isPrivateSauna ? 2 : 1)));
  const [dayError, setDayError] = useState<string | null>(null);

  const [apiSlots, setApiSlots] = useState<ServiceSlotsResponse | null>(null);
  const [packageSlots, setPackageSlots] = useState<any | null>(null);
  const [loadingApiSlots, setLoadingApiSlots] = useState<boolean>(false);

  // Package sub-service inclusion breakdown
  const includedServices: string[] = storedData.packageSelections?.includedServices || [];
  const normalizedServices = includedServices.map((s) => s.toLowerCase().replace(/[\s_-]+/g, ""));

  const hasPrivateSauna = normalizedServices.some((s) => s.includes("privatesauna") || s === "vipsauna");
  const hasSharedSauna = normalizedServices.some((s) => s.includes("sharedsauna") || s === "normalsauna");
  const hasGenericSauna = normalizedServices.includes("sauna");
  const packageIncludesSauna = isPackage && (hasPrivateSauna || hasSharedSauna || hasGenericSauna);
  const packageIncludesLunchroom = isPackage && normalizedServices.some((s) => s.includes("lunchroom") || s === "lunch");
  const packageIncludesActivity = isPackage && normalizedServices.some((s) => s.includes("activity") || s.includes("activities"));
  const packageIncludesSaltRoom = isPackage && normalizedServices.some((s) => s.includes("saltroom") || s === "salt");

  // Package Sub-service choices state
  const [pkgSaunaSlot, setPkgSaunaSlot] = useState<string | null>(
    storedData.packageSelections?.saunaSlot
      ? `${storedData.packageSelections.saunaSlot.startTime} - ${storedData.packageSelections.saunaSlot.endTime}`
      : null
  );
  const [pkgSaunaType, setPkgSaunaType] = useState<"private" | "shared">(
    hasSharedSauna && !hasPrivateSauna
      ? "shared"
      : (storedData.packageSelections?.saunaSlot?.type || "private")
  );
  const [pkgLunchTime, setPkgLunchTime] = useState<string>(storedData.packageSelections?.lunchroomTime || "12:30");
  const [pkgSelectedActivityId, setPkgSelectedActivityId] = useState<number | null>(storedData.packageSelections?.activitySession?.id || null);
  const [pkgSaltRoomSlot, setPkgSaltRoomSlot] = useState<string | null>(
    storedData.packageSelections?.saltRoomSlot
      ? `${storedData.packageSelections.saltRoomSlot.startTime} - ${storedData.packageSelections.saltRoomSlot.endTime}`
      : null
  );
  const [saltRoomSlotsList, setSaltRoomSlotsList] = useState<any[]>([]);
  const [loadingSaltSlots, setLoadingSaltSlots] = useState<boolean>(false);

  useEffect(() => {
    if (isPackage) {
      if (hasSharedSauna && !hasPrivateSauna) {
        setPkgSaunaType("shared");
      } else if (hasPrivateSauna && !hasSharedSauna) {
        setPkgSaunaType("private");
      }
    }
  }, [isPackage, hasSharedSauna, hasPrivateSauna]);

  const [slotMembership, setSlotMembership] = useState<any | null>(null);
  const [saltRoomSlotData, setSaltRoomSlotData] = useState<{
    openTime?: string;
    closeTime?: string;
    pricePerPerson?: number;
    info?: string;
    isAvailable?: boolean;
  }>({});

  const fetchingRef = useRef<boolean>(false);
  const lastFetchedKeyRef = useRef<string>("");

  const fetchSlots = useCallback(async (dateVal: string, typeVal: string) => {
    if (!dateVal) {
      setApiSlots(null);
      setPackageSlots(null);
      setSaltRoomSlotsList([]);
      return;
    }

    const stored = getStoredBookingData();
    const packageId = stored.packageSelections?.packageId;
    const currentKey = `${typeVal}_${dateVal}_${packageId || ""}`;
    if (fetchingRef.current && lastFetchedKeyRef.current === currentKey) {
      return;
    }
    fetchingRef.current = true;
    lastFetchedKeyRef.current = currentKey;
    setApiSlots(null);
    setPackageSlots(null);
    setSaltRoomSlotsList([]);
    setLoadingApiSlots(true);

    try {
      const isPkg = (typeVal || "").toLowerCase().includes("package");
      if (isPkg) {
        const currentStored = getStoredBookingData();
        const selectedPackageId = currentStored.packageSelections?.packageId;
        const pkgRes: Awaited<ReturnType<typeof servicesService.getPackageSlots>> = selectedPackageId
          ? await servicesService.getPackageSlots(dateVal, selectedPackageId).catch((err) => {
              console.error("Error fetching package slots:", err);
              return {
                success: false,
                is_blocked: false,
          is_closed: false,
                date: dateVal,
                service_type: "package",
                open_time: "",
                close_time: "",
                data: {},
                message: err?.message || "Could not load slots for this package.",
              };
            })
          : {
              success: false,
              is_blocked: false,
            is_closed: false,
              date: dateVal,
              service_type: "package",
                open_time: "",
                close_time: "",
              data: {},
              message: "Package details are missing. Please go back and select the package again.",
            };

        if (pkgRes) {
          setPackageSlots(pkgRes);
          if (pkgRes.is_closed) {
            setDayError(pkgRes.message || "Package reservations are closed on this date.");
          } else {
            setDayError(null);
          }
        }

        const slots = Array.isArray(pkgRes?.data?.saltroom?.slots) ? pkgRes.data.saltroom.slots : [];
        setSaltRoomSlotsList(slots);
      } else {
        const isSalt = typeVal === "salt_room" || typeVal === "saltroom";
        const queryType = isSalt ? "saltroom" : (typeVal || "sauna");
        const res = await servicesService.getServiceSlots(queryType, dateVal);
        setApiSlots(res);

        if (res?.is_closed || (res?.data as any)?.is_closed) {
          setDayError((res?.data as any)?.info || res?.message || "This service is closed on this date.");
        } else {
          setDayError(null);
        }

        // Check if saltroom slots response returned user_membership or saltroom slot info
        const memberInfo = (res?.data as any)?.user_membership || (res as any)?.user_membership;
        if (memberInfo) {
          setSlotMembership(memberInfo);
        }

        const rawData: any = res?.data || res;
        const sInfo = rawData?.saltroom || rawData;
        if (sInfo && (sInfo.open_time || sInfo.price_per_person || sInfo.info !== undefined)) {
          setSaltRoomSlotData({
            openTime: sInfo.open_time,
            closeTime: sInfo.close_time,
            pricePerPerson: sInfo.price_per_person ? parseFloat(String(sInfo.price_per_person)) : undefined,
            info: sInfo.info,
            isAvailable: sInfo.is_available,
          });
        }
      }
    } catch (err) {
      console.error("Error fetching slots in choose-time:", err);
      setApiSlots(null);
      setPackageSlots(null);
    } finally {
      setLoadingApiSlots(false);
      fetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    const data = getStoredBookingData();
    setStoredData(data);
    if (data.date) {
      setDate(data.date);
      fetchSlots(data.date, data.serviceType || "sauna");
    }
    if (data.timeSlot) setSelectedTime(data.timeSlot);
    if (data.guestsCount) {
      setGuests(String(data.guestsCount));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const refreshSlots = () => {
      const latest = getStoredBookingData();
      setStoredData(latest);
      if (latest.date) {
        setDate(latest.date);
        fetchSlots(latest.date, latest.serviceType || "sauna");
      }
    };
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) refreshSlots();
    };
    const handlePopState = () => refreshSlots();

    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [fetchSlots]);

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    setSelectedTime(null);
    setPkgSaunaSlot(null);
    setPkgSaltRoomSlot(null);
    setPkgSelectedActivityId(null);
    setDayError(null);

    updateStoredBookingData({ date: newDate, timeSlot: "" });
    if (newDate) {
      lastFetchedKeyRef.current = "";
      fetchSlots(newDate, storedData.serviceType || "sauna");
    }
  };

  const sharedSlotsList = apiSlots?.data?.shared_sauna?.slots || [];
  const selectedSlotObj = isSharedSauna && selectedTime
    ? sharedSlotsList.find((s) => `${s.start_time} - ${s.end_time}` === selectedTime)
    : null;

  const handleTimeSelect = (timeStr: string) => {
    setSelectedTime(timeStr);

    if (isSharedSauna && sharedSlotsList.length > 0) {
      const clickedSlot = sharedSlotsList.find((s) => `${s.start_time} - ${s.end_time}` === timeStr);
      if (clickedSlot) {
        const currentG = parseInt(guests, 10) || 1;
        if (currentG > clickedSlot.remaining_capacity) {
          const adjustedG = Math.max(1, clickedSlot.remaining_capacity);
          setGuests(String(adjustedG));
          const newTotal = parseFloat((adjustedG * saunaPrices.sharedPricePerson).toFixed(2));
          updateStoredBookingData({
            timeSlot: timeStr,
            guestsCount: adjustedG,
            totalAmount: newTotal,
            price: `€${newTotal}`,
          });
          return;
        }
      }
    }

    if (isSaltRoom && slotMembership) {
      const activePass = slotMembership.session_pass || slotMembership.pass;
      const activeSub = slotMembership.subscription;
      const weeklySub = slotMembership.weekly_subscription || (
        (activeSub?.plan_type?.toLowerCase() === "weekly" ||
         activeSub?.type?.toLowerCase() === "weekly" ||
         activeSub?.name?.toLowerCase().includes("week"))
          ? activeSub
          : null
      );
      const unlimitedSub = slotMembership.unlimited_subscription || (
        (activeSub?.plan_type?.toLowerCase() === "unlimited" ||
         activeSub?.type?.toLowerCase() === "unlimited" ||
         activeSub?.is_unlimited ||
         activeSub?.name?.toLowerCase().includes("unlimited"))
          ? activeSub
          : null
      );
      const passType = storedData.passType || "single";

      // If user explicitly chose 'single' session in arrangements, NEVER force pass/subscription mode
      if (passType === "single") {
        updateStoredBookingData({
          timeSlot: timeStr,
          paymentMode: "card",
          purchaseId: undefined,
          activeMembershipInfo: slotMembership,
        });
        return;
      }

      let paymentMode: "pass" | "subscription" | "weekly_subscription" | "unlimited_subscription" | "card" | string = storedData.paymentMode || "card";
      let purchaseId = storedData.purchaseId;
      let passId = storedData.passId;

      if (passType === "10_session_pass" && (slotMembership.has_active_pass || slotMembership.has_pass) && activePass) {
        paymentMode = "pass";
        purchaseId = activePass.purchase_id || activePass.pass_id;
        passId = activePass.pass_id || activePass.id || activePass.purchase_id;
      } else if (passType === "once_a_week" && weeklySub && weeklySub.is_available_for_date !== false) {
        paymentMode = "weekly_subscription";
        purchaseId = weeklySub.purchase_id || weeklySub.subscription_id;
      } else if (passType === "unlimited" && unlimitedSub && unlimitedSub.is_available_for_date !== false) {
        paymentMode = "unlimited_subscription";
        purchaseId = unlimitedSub.purchase_id || unlimitedSub.subscription_id;
      }

      updateStoredBookingData({
        timeSlot: timeStr,
        paymentMode,
        purchaseId,
        passId,
        activeMembershipInfo: slotMembership,
      });
      return;
    }

    updateStoredBookingData({ timeSlot: timeStr });
  };

  const handleGuestsChange = (g: string) => {
    const gCount = parseInt(g, 10) || (isPrivateSauna ? 2 : 1);
    setGuests(g);

    if (isPackage) {
      updateStoredBookingData({
        guestsCount: gCount,
      });
      return;
    }

    const passType = storedData.passType || "single";
    // If the user selected 'single' (Standard €25/person reservation), they are paying via card, NOT covered by membership
    const effectivePass = passType !== "single" && (storedData.hasActiveMembership || slotMembership?.has_active_pass || slotMembership?.has_active_subscription);
    const saltPrice = saltRoomSlotData.pricePerPerson || 25;

    let newTotal = storedData.totalAmount || 0;
    if (isPrivateSauna) {
      const duration = storedData.durationHours || 3;
      const base = duration === 4 ? saunaPrices.price4Hrs : saunaPrices.price3Hrs;
      const extrasTotal = (storedData.selectedExtras || []).reduce((sum, ext) => sum + (ext.price || 0), 0);
      const extraGuests = Math.max(0, gCount - 2);
      newTotal = base + extraGuests * saunaPrices.extraPersonFee + extrasTotal;
    } else if (isSharedSauna) {
      newTotal = parseFloat((gCount * saunaPrices.sharedPricePerson).toFixed(2));
    } else if (isSaltRoom) {
      newTotal = effectivePass ? 0 : gCount * saltPrice;
    }

    updateStoredBookingData({
      guestsCount: gCount,
      totalAmount: newTotal,
      price: effectivePass && isSaltRoom ? "€0 (Pass / Membership Deducted)" : `€${newTotal}`,
      hasActiveMembership: Boolean(effectivePass),
    });
  };

  const calculateOptionPrice = (n: number): string => {
    const passType = storedData.passType || "single";
    const effectivePass = passType !== "single" && (storedData.hasActiveMembership || slotMembership?.has_active_pass || slotMembership?.has_active_subscription);
    const saltPrice = saltRoomSlotData.pricePerPerson || 25;

    if (isPrivateSauna) {
      const duration = storedData.durationHours || 3;
      const base = duration === 4 ? saunaPrices.price4Hrs : saunaPrices.price3Hrs;
      const extrasTotal = (storedData.selectedExtras || []).reduce((sum, ext) => sum + (ext.price || 0), 0);
      const extraGuests = Math.max(0, n - 2);
      const total = base + extraGuests * saunaPrices.extraPersonFee + extrasTotal;
      return `€${total.toFixed(2)}`;
    } else if (isSharedSauna) {
      const total = n * saunaPrices.sharedPricePerson;
      return `€${total.toFixed(2)}`;
    } else if (isSaltRoom) {
      if (effectivePass) return "€0 (Covered by Membership)";
      const total = n * saltPrice;
      return `€${total.toFixed(2)}`;
    }
    return `€${(n * 35).toFixed(2)}`;
  };

  const maxSelectableGuests = isPrivateSauna
    ? 6
    : isSaltRoom
    ? 2
    : selectedSlotObj
    ? Math.min(6, Math.max(1, selectedSlotObj.remaining_capacity))
    : 6;

  const minSelectableGuests = isPrivateSauna ? 2 : 1;

  const guestOptions = isPrivateSauna
    ? [2, 3, 4, 5, 6]
    : Array.from(
        { length: Math.max(1, maxSelectableGuests - minSelectableGuests + 1) },
        (_, i) => minSelectableGuests + i
      );

  const packageActivitiesList: any[] = Array.isArray(packageSlots?.data?.activities)
    ? packageSlots.data.activities
    : (packageSlots?.data?.activities as any)?.activities || [];
  const isPackageActivitiesClosed = Boolean((packageSlots?.data?.activities as any)?.is_closed);
  const packageSaunaData = packageSlots?.data?.sauna || (
    packageSlots?.data?.private_sauna || packageSlots?.data?.shared_sauna
      ? {
          private_sauna: packageSlots.data.private_sauna,
          shared_sauna: packageSlots.data.shared_sauna,
          is_closed:
            (!hasPrivateSauna || Boolean(packageSlots.data.private_sauna?.is_closed)) &&
            (!hasSharedSauna || Boolean(packageSlots.data.shared_sauna?.is_closed)),
        }
      : undefined
  );

  const isPackageFormValid = isPackage
    ? Boolean(
        date &&
        packageSlots?.success &&
        Object.keys(packageSlots.data || {}).length > 0 &&
        (!packageSlots.is_blocked && !packageSlots.is_closed) &&
        (!packageIncludesSauna || !packageSaunaData || packageSaunaData.is_closed || pkgSaunaSlot) &&
        (!packageIncludesSaltRoom || saltRoomSlotsList.length === 0 || packageSlots?.data?.saltroom?.is_closed || pkgSaltRoomSlot) &&
        (!packageIncludesActivity || packageActivitiesList.length === 0 || isPackageActivitiesClosed || pkgSelectedActivityId)
      )
    : false;

  const isSingleServiceClosed = Boolean(apiSlots?.is_closed || (apiSlots?.data as any)?.is_closed || (apiSlots?.data as any)?.is_available === false);
  const isFormValid = isPackage
    ? isPackageFormValid
    : Boolean(date && selectedTime && !isSingleServiceClosed && !apiSlots?.is_blocked);

  const savePackageSelections = (
    updatedSaunaSlot?: string | null,
    updatedSaunaType?: "private" | "shared",
    updatedLunchTime?: string,
    updatedActivityId?: number | null,
    updatedSaltRoomSlot?: string | null
  ) => {
    const sSlot = updatedSaunaSlot !== undefined ? updatedSaunaSlot : pkgSaunaSlot;
    const sType = updatedSaunaType !== undefined ? updatedSaunaType : pkgSaunaType;
    const lTime = updatedLunchTime !== undefined ? updatedLunchTime : pkgLunchTime;
    const actId = updatedActivityId !== undefined ? updatedActivityId : pkgSelectedActivityId;
    const srSlot = updatedSaltRoomSlot !== undefined ? updatedSaltRoomSlot : pkgSaltRoomSlot;

    let saunaSlotData: any = undefined;
    if (sSlot) {
      const parts = sSlot.split(" - ");
      saunaSlotData = {
        type: sType,
        startTime: parts[0] || "",
        endTime: parts[1] || "",
      };
    }

    let saltRoomSlotData: any = undefined;
    if (srSlot) {
      const parts = srSlot.split(" - ");
      saltRoomSlotData = {
        startTime: parts[0] || "",
        endTime: parts[1] || "",
      };
    }

    let activitySessionData: any = undefined;
    if (actId && packageActivitiesList.length > 0) {
      const foundAct = packageActivitiesList.find((a: any) => a.id === actId);
      if (foundAct) {
        activitySessionData = {
          id: foundAct.id,
          title: foundAct.title,
          startTime: foundAct.open_time,
          endTime: foundAct.close_time,
          host: foundAct.host,
        };
      }
    }

    updateStoredBookingData({
      timeSlot: sSlot || srSlot || lTime || "Package Scheduled",
      packageSelections: {
        ...storedData.packageSelections,
        saunaSlot: saunaSlotData,
        saltRoomSlot: saltRoomSlotData,
        lunchroomTime: lTime,
        activitySession: activitySessionData,
      },
    });
  };

  // Dynamic Sequential Step Numbering
  let stepIndex = 0;
  const saunaStepNumber = packageIncludesSauna && packageSaunaData ? ++stepIndex : 0;
  const lunchStepNumber = packageIncludesLunchroom ? ++stepIndex : 0;
  const saltRoomStepNumber = packageIncludesSaltRoom ? ++stepIndex : 0;
  const activityStepNumber = packageIncludesActivity ? ++stepIndex : 0;

  return (
    <div className="w-full px-6 md:px-12">
      {/* ── Title Section ── */}
      <div className="text-center mb-12 flex flex-col items-center">
        <h1 className="font-displayPlayFair text-5xl text-[#1d1a17] mb-2 leading-tight">
          {ctTrans?.title || "Choose Your Time"}
        </h1>
        <DecorativeUnderline />
        <p className="font-cambria text-sm text-[#475569] mt-6 italic tracking-wide">
          {ctTrans?.subtitle || `Select a date and customize sub-service times for ${storedData.serviceName || "your package reservation"}.`}
        </p>
      </div>

      {/* ── Package Header Banner ── */}
      {isPackage && (
        <div className="max-w-4xl mx-auto mb-8 bg-gradient-to-r from-[#FCF2E9] to-[#F7EBE1] rounded-2xl p-6 border border-[#E8E2DC] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#8B7355] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
              <FaSpa size={22} />
            </div>
            <div>
              <h4 className="font-bold text-[#0F172A] text-base font-displayPlayFair">
                {storedData.serviceName}
              </h4>
              <p className="text-xs text-[#8B7355] font-medium mt-0.5">
                {ctTrans?.packageNotice || "Multi-service slot selection • Please choose times for included package components below"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl border border-[#E8E2DC] text-xs font-bold text-[#8B7355]">
            <span>{ctTrans?.packagePrice ? ctTrans.packagePrice.replace("{price}", storedData.price || `€${storedData.totalAmount}`) : `Package Price: ${storedData.price || `€${storedData.totalAmount}`}`}</span>
          </div>
        </div>
      )}

      {/* ── Lunchroom Banner ── */}
      {!isPackage && isLunchroom && (
        <div className="max-w-4xl mx-auto mb-8 bg-white rounded-2xl p-6 border border-[#E8E2DC] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isSingleServiceClosed ? "bg-rose-100 text-rose-700" : "bg-[#FCF2E9] text-[#8B7355]"
            }`}>
              <BiTimeFive size={20} />
            </div>
            <div>
              <h4 className="font-bold text-[#0F172A] text-sm">{ctTrans?.lunchroomHours || "Lunchroom Opening Hours"}</h4>
              <p className={`text-xs font-medium ${isSingleServiceClosed ? "text-rose-600 font-bold" : "text-[#8B7355]"}`}>
                {isSingleServiceClosed
                  ? (ctTrans?.closedOnDay || "Closed on this selected day")
                  : apiSlots?.open_time && apiSlots?.close_time
                  ? (ctTrans?.hoursForDate ? ctTrans.hoursForDate.replace("{open}", apiSlots.open_time).replace("{close}", apiSlots.close_time) : `Hours for selected date: ${apiSlots.open_time} – ${apiSlots.close_time}`)
                  : (ctTrans?.flexibleDining || "Flexible dining during opening hours")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#FCF2E9]/70 px-4 py-2 rounded-xl text-xs text-[#475569]">
            <FaWalking className="text-[#8B7355]" />
            <span>{ctTrans?.walkinsWelcome || "Walk-ins welcome anytime during opening hours!"}</span>
          </div>
        </div>
      )}

      {/* ── Salt Room Banner ── */}
      {!isPackage && isSaltRoom && (
        <div className="max-w-4xl mx-auto mb-8 bg-white rounded-2xl p-6 border border-[#E8E2DC] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FCF2E9] flex items-center justify-center text-[#8B7355] flex-shrink-0">
              <FaSpa size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-[#0F172A] text-sm">
                  {storedData.serviceName || "Salt Room"} (1 Hour • €{saltRoomSlotData.pricePerPerson || 25} / Person)
                </h4>
                {storedData.passType !== "single" && (storedData.hasActiveMembership || slotMembership?.has_active_pass || slotMembership?.has_active_subscription) && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Included in Membership
                  </span>
                )}
              </div>
              <p className="text-xs text-[#8B7355] font-medium mt-1">
                {saltRoomSlotData.info ||
                  `Maximum 2 people per session (${saltRoomSlotData.openTime || "06:00"}–${saltRoomSlotData.closeTime || "23:20"}).`}
              </p>
              {slotMembership?.session_pass && (
                <p className="text-[11px] text-amber-700 font-semibold mt-0.5">
                  ✓ {slotMembership.session_pass.remaining_sessions} Pass credits remaining on your account
                </p>
              )}
              {slotMembership?.subscription?.is_available_for_date === false && (
                <p className="text-[11px] text-rose-700 font-semibold mt-0.5 flex items-center gap-1">
                  <BiInfoCircle size={14} className="flex-shrink-0" />
                  <span>Subscription: {slotMembership.subscription.unavailable_reason || "Weekly limit reached for this period."}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className="px-3 py-1 bg-[#8B7355] text-white text-xs font-bold rounded-lg shadow-xs">
              Max 2 People / Session
            </span>
            <span className="text-[11px] text-[#64748B] font-semibold">
              Hours: {saltRoomSlotData.openTime || "09:00"} – {saltRoomSlotData.closeTime || "21:00"}
            </span>
          </div>
        </div>
      )}

      {/* ── VIP Sauna Banner ── */}
      {!isPackage && isPrivateSauna && (
        <div className="max-w-4xl mx-auto mb-8 bg-white rounded-2xl p-6 border border-[#E8E2DC] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FCF2E9] flex items-center justify-center text-[#8B7355] flex-shrink-0">
              <BiTimeFive size={20} />
            </div>
            <div>
              <h4 className="font-bold text-[#0F172A] text-sm">
                VIP Sauna ({storedData.durationHours || 3} Hours Session)
              </h4>
              <p className="text-xs text-[#8B7355] font-medium">
                Exclusive wellness sanctuary reserved for your group.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Content Card ── */}
      <div className="max-w-4xl mx-auto bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-[#E8E2DC]">
        <div className="space-y-10">
          {/* Date Picker */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-bold text-[#0F172A] uppercase tracking-wider" style={{ fontFamily: "Inter, sans-serif" }}>
                {ctTrans?.dateLabel || "Date"}
              </label>
              {isSaltRoom ? (
                <span className="text-xs text-[#8B7355] font-semibold bg-[#FCF2E9] px-2.5 py-1 rounded-md border border-[#E8E2DC]">
                  {ctTrans?.dateLocked || "🔒 Date locked from previous step"}
                </span>
              ) : isLunchroom ? (
                <span className="text-xs text-[#8B7355] font-semibold">{ctTrans?.lunchroomAvailableDays || "Available: Wed – Sun"}</span>
              ) : null}
            </div>
            <div className="relative">
              <input
                type="date"
                value={date}
                disabled={isSaltRoom}
                onChange={(e) => !isSaltRoom && handleDateChange(e.target.value)}
                className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D1B191] text-[#475569] ${
                  isSaltRoom
                    ? "bg-[#F8FAFC] border-[#E2E8F0] opacity-80 cursor-not-allowed font-medium text-[#1E293B]"
                    : dayError
                    ? "border-red-400 bg-red-50/30 cursor-pointer"
                    : "border-[#E2E8F0] cursor-pointer"
                }`}
              />
            </div>
            {dayError && (
              <p className="mt-2 text-xs font-semibold text-red-600 flex items-center gap-1">
                <BiInfoCircle /> {dayError}
              </p>
            )}
          </div>

          {/* Time Picker / Multi-Service Package Slots Picker */}
          {isPackage ? (
            <div className="space-y-8 pt-2 border-t border-[#E8E2DC]">
              {loadingApiSlots && (
                <div className="p-8 text-center text-xs text-[#64748B] italic">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-[#8B7355] border-t-transparent mr-2 align-middle"></div>
                  Loading package sub-services and slots for {date}...
                </div>
              )}

              {!loadingApiSlots && packageSlots?.is_blocked && (
                <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold flex items-center gap-3">
                  <BiInfoCircle size={22} className="flex-shrink-0" />
                  <div>
                    <h5 className="font-bold">Date Blocked</h5>
                    <p className="text-xs font-normal mt-0.5">{packageSlots.message || "This date is currently blocked for package reservations."}</p>
                  </div>
                </div>
              )}

              {!loadingApiSlots && !packageSlots?.is_blocked && packageSlots?.is_closed && (
                <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-semibold flex items-start gap-3">
                  <BiInfoCircle size={22} className="text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-base text-amber-950">Package Closed on this Date</h5>
                    <p className="text-xs text-amber-800 mt-1">{packageSlots.message || "Packages are closed on this date. Please pick another date."}</p>
                  </div>
                </div>
              )}

              {!loadingApiSlots && packageSlots && !packageSlots.is_blocked && Object.keys(packageSlots.data || {}).length === 0 && (
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-3">
                  <BiInfoCircle size={20} className="text-amber-700 flex-shrink-0 mt-0.5" />
                  <p>{packageSlots.message || "No booking services are available for this package."}</p>
                </div>
              )}

              {!loadingApiSlots && !packageSlots?.is_blocked && !packageSlots?.is_closed && date && (
                <>
                  {/* 1. Sauna Sub-Service Slots (If included in package) */}
                  {packageIncludesSauna && packageSaunaData && (
                    <div className="bg-[#FAF7F2] rounded-2xl p-6 border border-[#E8E2DC]">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-8 h-8 rounded-lg ${packageSaunaData.is_closed ? "bg-gray-400" : "bg-[#8B7355]"} text-white flex items-center justify-center font-bold text-sm`}>
                            {saunaStepNumber}
                          </span>
                          <h4 className="font-bold text-[#0F172A] text-base font-displayPlayFair">
                            {pkgSaunaType === "shared" ? (ctTrans?.sharedSaunaTimeSlot || "Sauna Session Time Slot") : (ctTrans?.saunaTimeSlot || "VIP Sauna Session Time Slot")}
                          </h4>
                        </div>
                        {!packageSaunaData.is_closed &&
                          packageSaunaData.private_sauna &&
                          packageSaunaData.shared_sauna &&
                          ((hasPrivateSauna && hasSharedSauna) || hasGenericSauna) && (
                            <div className="flex bg-white rounded-lg p-1 border border-[#E8E2DC] text-xs font-semibold">
                              <button
                                type="button"
                                onClick={() => {
                                  setPkgSaunaType("private");
                                  setPkgSaunaSlot(null);
                                  savePackageSelections(null, "private");
                                }}
                                className={`px-3 py-1 rounded-md transition-all ${
                                  pkgSaunaType === "private" ? "bg-[#8B7355] text-white shadow-xs" : "text-[#64748B]"
                                }`}
                              >
                                {ctTrans?.privateSaunaBtn || "VIP Sauna"}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setPkgSaunaType("shared");
                                  setPkgSaunaSlot(null);
                                  savePackageSelections(null, "shared");
                                }}
                                className={`px-3 py-1 rounded-md transition-all ${
                                  pkgSaunaType === "shared" ? "bg-[#8B7355] text-white shadow-xs" : "text-[#64748B]"
                                }`}
                              >
                                {ctTrans?.sharedSaunaBtn || "Sauna"}
                              </button>
                            </div>
                          )}
                      </div>

                      {/* VIP Sauna Slots */}
                      {pkgSaunaType === "private" && packageSaunaData.private_sauna?.slots && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                          {(() => {
                            const p3Slots = packageSaunaData.private_sauna?.slots?.["3_hours"] || [];
                            const p4Slots = packageSaunaData.private_sauna?.slots?.["4_hours"] || [];
                            const allSlots = [...p3Slots, ...p4Slots];

                            if (allSlots.length === 0) {
                              return (
                                <p className="col-span-full text-xs text-amber-800 bg-amber-50 p-3 rounded-xl">
                                  {ctTrans?.noPrivateSlotsDate || "No private sauna slots available for this date."}
                                </p>
                              );
                            }

                            return allSlots.map((slot: any, idx: number) => {
                              const label = `${slot.start_time} - ${slot.end_time}`;
                              const isSel = pkgSaunaSlot === label;
                              const sessionHours = slot.time_slot === "4_hours" ? "4" : "3";
                              const durationTag = ctTrans?.privateSessionTag ? ctTrans.privateSessionTag.replace("{hours}", sessionHours) : `${sessionHours}-hour private session`;
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    setPkgSaunaSlot(label);
                                    savePackageSelections(label);
                                  }}
                                  className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                                    isSel
                                      ? "bg-[#FCF2E9] border-[#8B7355] shadow-sm ring-2 ring-[#8B7355]/20"
                                      : "bg-white border-[#E2E8F0] hover:border-[#D1B191]"
                                  }`}
                                >
                                  <div>
                                    <span className="text-sm font-bold text-[#0F172A] block">{label}</span>
                                    <span className="text-[10px] text-[#64748B]">
                                      {durationTag}
                                    </span>
                                  </div>
                                  {isSel && <BiCheckCircle className="text-[#8B7355]" size={20} />}
                                </button>
                              );
                            });
                          })()}
                        </div>
                      )}

                      {/* Sauna Slots */}
                      {pkgSaunaType === "shared" && packageSaunaData.shared_sauna?.slots && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                          {packageSaunaData.shared_sauna.slots.map((slot: any, idx: number) => {
                            const label = `${slot.start_time} - ${slot.end_time}`;
                            const isSel = pkgSaunaSlot === label;
                            const isSoldOut = slot.is_fully_booked || !slot.is_available || slot.remaining_capacity === 0;

                            return (
                              <button
                                key={idx}
                                type="button"
                                disabled={isSoldOut}
                                onClick={() => {
                                  setPkgSaunaSlot(label);
                                  savePackageSelections(label);
                                }}
                                className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                                  isSel
                                    ? "bg-[#FCF2E9] border-[#8B7355] shadow-sm ring-2 ring-[#8B7355]/20"
                                    : isSoldOut
                                    ? "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                                    : "bg-white border-[#E2E8F0] hover:border-[#D1B191]"
                                }`}
                              >
                                <div>
                                  <span className="text-sm font-bold text-[#0F172A] block">{label}</span>
                                  <span className="text-[10px] text-[#64748B]">{ctTrans?.sharedSessionTag || "Shared sauna • 90 mins"}</span>
                                </div>
                                <div>
                                  {isSoldOut ? (
                                    <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded-full">{ctTrans?.soldOut || "Sold Out"}</span>
                                  ) : (
                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] font-bold rounded-full">
                                      {ctTrans?.placesRemaining ? ctTrans.placesRemaining.replace("{count}", String(slot.remaining_capacity)) : `${slot.remaining_capacity} left`}
                                    </span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. Lunchroom Timing (If included) */}
                  {packageIncludesLunchroom && (
                    <div className="bg-[#FAF7F2] rounded-2xl p-6 border border-[#E8E2DC]">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`w-8 h-8 rounded-lg ${packageSlots?.data?.lunchroom?.is_closed ? "bg-gray-400" : "bg-[#8B7355]"} text-white flex items-center justify-center font-bold text-sm`}>
                          {lunchStepNumber}
                        </span>
                        <h4 className="font-bold text-[#0F172A] text-base font-displayPlayFair">
                          {ctTrans?.lunchroomPreferredArrival || "Lunchroom Preferred Dining Arrival"}
                        </h4>
                      </div>
                      {packageSlots?.data?.lunchroom?.is_closed ? (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-semibold flex items-center gap-2">
                          <BiInfoCircle size={18} className="text-amber-700 flex-shrink-0" />
                          <span>{ctTrans?.lunchroomClosedNotice || "Lunchroom is closed on this day. You can continue with your other package options or pick another date."}</span>
                        </div>
                      ) : (
                        <>
                          <p className="text-xs text-[#64748B] mb-4">
                            {packageSlots?.data?.lunchroom?.info || (ctTrans?.flexibleDining || "Lunchroom accommodates flexible dining during opening hours.")}
                            {packageSlots?.data?.lunchroom?.open_time && packageSlots?.data?.lunchroom?.close_time
                              ? ` (${ctTrans?.hoursForDate ? ctTrans.hoursForDate.replace("{open}", packageSlots.data.lunchroom.open_time).replace("{close}", packageSlots.data.lunchroom.close_time) : `Hours: ${packageSlots.data.lunchroom.open_time} – ${packageSlots.data.lunchroom.close_time}`})`
                              : " (Operating hours unavailable)"}
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-3">
                            {generateTimeSlotsBetween(
                              packageSlots?.data?.lunchroom?.open_time,
                              packageSlots?.data?.lunchroom?.close_time,
                              60
                            ).map((timeStr) => {
                              const isSel = pkgLunchTime === timeStr;
                              return (
                                <button
                                  key={timeStr}
                                  type="button"
                                  onClick={() => {
                                    setPkgLunchTime(timeStr);
                                    savePackageSelections(undefined, undefined, timeStr);
                                  }}
                                  className={`py-3 px-4 rounded-xl border font-bold text-sm transition-all ${
                                    isSel
                                      ? "bg-[#8B7355] text-white border-[#8B7355] shadow-xs"
                                      : "bg-white border-[#E2E8F0] text-[#475569] hover:border-[#D1B191]"
                                  }`}
                                >
                                  {timeStr}
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* 3. Salt Room Timing (If included in package) */}
                  {packageIncludesSaltRoom && (
                    <div className="bg-[#FAF7F2] rounded-2xl p-6 border border-[#E8E2DC]">
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`w-8 h-8 rounded-lg ${packageSlots?.data?.saltroom?.is_closed ? "bg-gray-400" : "bg-[#8B7355]"} text-white flex items-center justify-center font-bold text-sm`}>
                          {saltRoomStepNumber}
                        </span>
                        <h4 className="font-bold text-[#0F172A] text-base font-displayPlayFair">
                          {ctTrans?.saltRoomTimeSlot || "Salt Room Session Time Slot"}
                        </h4>
                      </div>

                      {packageSlots?.data?.saltroom?.is_closed ? (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-semibold flex items-center gap-2">
                          <BiInfoCircle size={18} className="text-amber-700 flex-shrink-0" />
                          <span>{ctTrans?.saltRoomClosedNotice || "Salt Room is closed on this date. You can choose another date or proceed with your remaining package options."}</span>
                        </div>
                      ) : loadingSaltSlots ? (
                        <div className="py-6 flex justify-center items-center gap-2 text-xs text-[#8B7355]">
                          <span className="animate-spin rounded-full h-4 w-4 border-2 border-[#8B7355] border-t-transparent" />
                          {ctTrans?.checkingLiveSlots ? ctTrans.checkingLiveSlots.replace("{date}", date) : `Loading salt room slots for ${date}...`}
                        </div>
                      ) : saltRoomSlotsList.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                          {saltRoomSlotsList.map((slot: any, idx: number) => {
                            const rawStart = (slot.start_time || slot.time || "").slice(0, 5);
                            const rawEnd = (slot.end_time || "").slice(0, 5);
                            const label = rawEnd ? `${rawStart} - ${rawEnd}` : rawStart;
                            const isSel = pkgSaltRoomSlot === label;
                            const remainingCap = typeof slot.remaining_capacity === "number"
                              ? slot.remaining_capacity
                              : typeof slot.available_capacity === "number"
                              ? slot.available_capacity
                              : 2;
                            const isSoldOut = slot.is_fully_booked || !slot.is_available || slot.is_booked || remainingCap <= 0;
                            const sessionMinutes = slot.duration_minutes || 45;
                            const durationTag = ctTrans?.minuteSessionTag ? ctTrans.minuteSessionTag.replace("{mins}", String(sessionMinutes)) : `${sessionMinutes}-minute salt room session`;

                            return (
                              <button
                                key={idx}
                                type="button"
                                disabled={isSoldOut}
                                onClick={() => {
                                  setPkgSaltRoomSlot(label);
                                  savePackageSelections(undefined, undefined, undefined, undefined, label);
                                }}
                                className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                                  isSel
                                    ? "bg-[#FCF2E9] border-[#8B7355] shadow-sm ring-2 ring-[#8B7355]/20"
                                    : isSoldOut
                                    ? "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                                    : "bg-white border-[#E2E8F0] hover:border-[#D1B191]"
                                }`}
                              >
                                <div>
                                  <span className="text-sm font-bold text-[#0F172A] block">{label}</span>
                                  <span className="text-[10px] text-[#64748B]">
                                    {durationTag}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {isSoldOut ? (
                                    <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded-full">
                                      {ctTrans?.soldOut || "Sold Out"}
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] font-bold rounded-full">
                                      {ctTrans?.placesRemaining ? ctTrans.placesRemaining.replace("{count}", String(remainingCap)) : `${remainingCap} left`}
                                    </span>
                                  )}
                                  {isSel && <BiCheckCircle className="text-[#8B7355]" size={20} />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                          <BiInfoCircle className="text-amber-700 flex-shrink-0 mt-0.5" size={18} />
                          <div>
                            <span className="font-bold block text-sm text-amber-950 mb-0.5">{ctTrans?.noSaltRoomSlotsFound || "No Salt Room Session Found"}</span>
                            <span>{ctTrans?.noSaltRoomSlotsDate ? ctTrans.noSaltRoomSlotsDate.replace("{date}", date) : `No scheduled salt room sessions are available on ${date}. Please pick another date or proceed with your remaining package options.`}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 4. Activities on this date (If included in package) */}
                  {packageIncludesActivity && (
                    <div className="bg-[#FAF7F2] rounded-2xl p-6 border border-[#E8E2DC]">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`w-8 h-8 rounded-lg ${isPackageActivitiesClosed ? "bg-gray-400" : "bg-[#8B7355]"} text-white flex items-center justify-center font-bold text-sm`}>
                          {activityStepNumber}
                        </span>
                        <h4 className="font-bold text-[#0F172A] text-base font-displayPlayFair">
                          {ctTrans?.activitySessionOnDate ? ctTrans.activitySessionOnDate.replace("{date}", date) : `Activity Session on ${date}`}
                        </h4>
                      </div>
                      {isPackageActivitiesClosed ? (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-semibold flex items-center gap-2">
                          <BiInfoCircle size={18} className="text-amber-700 flex-shrink-0" />
                          <span>{ctTrans?.serviceClosedOnDate || "Activities are closed on this date."}</span>
                        </div>
                      ) : packageActivitiesList.length > 0 ? (
                        <div className="space-y-3">
                          {packageActivitiesList.map((act: any) => {
                            const isSel = pkgSelectedActivityId === act.id;
                            const isSoldOut = act.available_slots === 0;
                            return (
                              <button
                                key={act.id}
                                type="button"
                                disabled={isSoldOut}
                                onClick={() => {
                                  setPkgSelectedActivityId(act.id);
                                  savePackageSelections(undefined, undefined, undefined, act.id);
                                }}
                                className={`w-full p-4 rounded-xl border text-left transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                                  isSel
                                    ? "bg-[#FCF2E9] border-[#8B7355] shadow-sm ring-2 ring-[#8B7355]/20"
                                    : isSoldOut
                                    ? "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                                    : "bg-white border-[#E2E8F0] hover:border-[#D1B191]"
                                }`}
                              >
                                <div>
                                  <h5 className="font-bold text-[#0F172A] text-base">{act.title}</h5>
                                  <p className="text-xs text-[#64748B] mt-1">
                                    {ctTrans?.activityTimeAndHost
                                      ? ctTrans.activityTimeAndHost.replace("{open}", act.open_time).replace("{close}", act.close_time).replace("{host}", act.host || "Wellness Guide")
                                      : `Time: ${act.open_time} – ${act.close_time} • Host: ${act.host || "Wellness Guide"}`}
                                  </p>
                                </div>
                                <div className="flex items-center gap-3">
                                  {isSoldOut ? (
                                    <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full">
                                      {ctTrans?.soldOut || "Sold Out"}
                                    </span>
                                  ) : (
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-bold rounded-full">
                                      {ctTrans?.placesRemaining ? ctTrans.placesRemaining.replace("{count}", String(act.available_slots)) : `${act.available_slots} spots left`}
                                    </span>
                                  )}
                                  {isSel && <BiCheckCircle className="text-[#8B7355]" size={22} />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                          <BiInfoCircle className="text-amber-700 flex-shrink-0 mt-0.5" size={18} />
                          <div>
                            <span className="font-bold block text-sm text-amber-950 mb-0.5">{ctTrans?.noActivitySessionFound || "No Activity Session Found"}</span>
                            <span>{ctTrans?.noActivitySessionDate ? ctTrans.noActivitySessionDate.replace("{date}", date) : `No scheduled activity sessions are available on ${date}. Please pick another date or proceed with your remaining package options.`}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-bold text-[#0F172A] uppercase tracking-wider" style={{ fontFamily: "Inter, sans-serif" }}>
                  {isSaltRoom
                    ? "Select Salt Room Session (1 Hour Session)"
                    : isSharedSauna
                    ? "Select Shared Session Slot (1.5 Hours)"
                    : "Time Slot"}
                </label>
                {isLunchroom && (
                  <span className="text-xs text-[#64748B]">
                    {isSingleServiceClosed
                      ? "Closed on this date"
                      : apiSlots?.open_time && apiSlots?.close_time
                      ? `Operating hours: ${apiSlots.open_time} – ${apiSlots.close_time}`
                      : "Operating hours unavailable"}
                  </span>
                )}
              </div>

              {loadingApiSlots && (
                <div className="p-8 text-center text-xs text-[#64748B] italic">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-[#8B7355] border-t-transparent mr-2 align-middle"></div>
                  Checking live available slots for {date}...
                </div>
              )}

              {!loadingApiSlots && apiSlots?.is_blocked && (
                <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold flex items-center gap-3">
                  <BiInfoCircle size={22} className="flex-shrink-0" />
                  <div>
                    <h5 className="font-bold">Date Blocked</h5>
                    <p className="text-xs font-normal mt-0.5">{apiSlots.message || "No slots available. This date is blocked by administration."}</p>
                  </div>
                </div>
              )}

              {!loadingApiSlots && !apiSlots?.is_blocked && isSingleServiceClosed && (
                <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-semibold flex items-start gap-3">
                  <BiInfoCircle size={22} className="text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-base text-amber-950">Service Closed on this Date</h5>
                    <p className="text-xs text-amber-800 mt-1">
                      {(apiSlots?.data as any)?.info || apiSlots?.message || `${storedData.serviceName || "This service"} is closed on ${date}. Please select another date.`}
                    </p>
                  </div>
                </div>
              )}

              {!loadingApiSlots && !apiSlots?.is_blocked && !isSingleServiceClosed && isSaltRoom ? (
                /* Salt Room Calculated Slots from API (with fallback) */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(() => {
                    const rawData: any = apiSlots?.data || apiSlots;
                    const liveSlots: any[] = rawData?.slots || rawData?.saltroom?.slots || [];
                    const currentGuestsCount = parseInt(guests, 10) || 1;

                    if (liveSlots && liveSlots.length > 0) {
                      return liveSlots.map((sess: any, idx: number) => {
                        const slotKey = `${sess.start_time}–${sess.end_time}`;
                        const isSelected = selectedTime === slotKey || selectedTime === sess.start_time;
                        const remaining = sess.remaining_capacity ?? (sess.max_capacity - sess.booked_capacity);
                        const isFullyBooked = sess.is_fully_booked || remaining <= 0;
                        const notEnoughSeats = !isFullyBooked && remaining < currentGuestsCount;
                        const isSoldOut = isFullyBooked || notEnoughSeats;

                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={isSoldOut}
                            onClick={() => handleTimeSelect(slotKey)}
                            className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                              isSelected
                                ? "bg-[#FCF2E9] border-[#8B7355] shadow-md ring-2 ring-[#8B7355]/20"
                                : isSoldOut
                                ? "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                                : "bg-white border-[#E2E8F0] hover:border-[#D1B191]"
                            }`}
                          >
                            <div className="flex items-center justify-between w-full mb-1">
                              <span className="text-base font-bold font-displayPlayFair text-[#0F172A]">
                                {sess.start_time} – {sess.end_time}
                              </span>
                              {isFullyBooked ? (
                                <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[9px] font-bold rounded-full">
                                  Full (0/{sess.max_capacity || 2})
                                </span>
                              ) : notEnoughSeats ? (
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-bold rounded-full border border-amber-300">
                                  Only {remaining} left
                                </span>
                              ) : (
                                <span
                                  className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${
                                    remaining === 1
                                      ? "bg-amber-100 text-amber-800 border-amber-300"
                                      : "bg-emerald-50 text-emerald-700 border-emerald-300"
                                  }`}
                                >
                                  {remaining} {remaining === 1 ? "spot left" : "spots left"}
                                </span>
                              )}
                            </div>

                            <span className="text-[10px] text-[#64748B] block">
                              {sess.duration_minutes || 60}m session
                            </span>
                          </button>
                        );
                      });
                    }

                    return (
                      <p className="col-span-full p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-semibold">
                        {ctTrans?.noSaltRoomSlotsDate?.replace("{date}", date) || `No Salt Room sessions are available on ${date}.`}
                      </p>
                    );
                  })()}
                </div>
              ) : !loadingApiSlots && !apiSlots?.is_blocked && isSharedSauna ? (
                /* Sauna Live API Slots or Fallback */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(() => {
                    const slotsList = apiSlots?.data?.shared_sauna?.slots;
                    if (slotsList && slotsList.length > 0) {
                      return slotsList.map((slot, i) => {
                        const label = `${slot.start_time} - ${slot.end_time}`;
                        const isSelected = selectedTime === label;
                        const isFullyBooked = slot.is_fully_booked || slot.remaining_capacity === 0;
                        const currentGuestsCount = parseInt(guests, 10) || 1;
                        const isNotEnoughCapacity = !isFullyBooked && slot.remaining_capacity < currentGuestsCount;
                        const isSoldOut = isFullyBooked || isNotEnoughCapacity;

                        return (
                          <button
                            key={i}
                            type="button"
                            disabled={isSoldOut}
                            onClick={() => handleTimeSelect(label)}
                            className={`min-w-0 p-4 rounded-xl border text-left transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                              isSelected
                                ? "bg-[#FCF2E9] border-[#8B7355] shadow-md ring-2 ring-[#8B7355]/20"
                                : isSoldOut
                                ? "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                                : "bg-white border-[#E2E8F0] hover:border-[#D1B191]"
                            }`}
                          >
                            <div className="min-w-0">
                              <span className="text-base font-bold font-displayPlayFair text-[#0F172A] block">
                                {label}
                              </span>
                              <span className="text-[11px] text-[#64748B]">
                                90m session
                              </span>
                            </div>

                            <div className="w-full sm:w-auto text-left sm:text-right flex flex-col items-start sm:items-end gap-1">
                              {isFullyBooked ? (
                                <span className="max-w-full px-2.5 py-1 bg-rose-100 text-rose-700 text-[10px] font-bold rounded-full whitespace-normal">
                                  Fully Booked
                                </span>
                              ) : isNotEnoughCapacity ? (
                                <span className="max-w-full px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full border border-amber-300 whitespace-normal">
                                  Only {slot.remaining_capacity} {slot.remaining_capacity === 1 ? "place" : "places"} left
                                </span>
                              ) : (
                                <span className={`max-w-full px-2.5 py-1 text-[10px] font-bold rounded-full border whitespace-normal ${
                                  slot.remaining_capacity <= 2 ? "bg-amber-100 text-amber-800 border-amber-300" : "bg-emerald-50 text-emerald-700 border-emerald-300"
                                }`}>
                                  {slot.remaining_capacity} {slot.remaining_capacity === 1 ? "place" : "places"} remaining
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      });
                    }

                    return (
                      <p className="col-span-full p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-semibold">
                        No Sauna sessions are available on this date.
                      </p>
                    );
                  })()}
                </div>
              ) : !loadingApiSlots && !apiSlots?.is_blocked && isPrivateSauna && date ? (
                /* VIP Sauna Live API Slots */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(() => {
                    const durationKey = storedData.durationHours === 4 ? "4_hours" : "3_hours";
                    const pSlots = apiSlots?.data?.private_sauna?.slots?.[durationKey] || apiSlots?.data?.private_sauna?.available_slots?.[durationKey] || [];
                    if (pSlots.length === 0) {
                      return (
                        <div className="col-span-full p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-semibold">
                          No {storedData.durationHours || 3}-hour private sauna slots available on this date.
                        </div>
                      );
                    }
                    return pSlots.map((slot, i) => {
                      const label = `${slot.start_time} - ${slot.end_time}`;
                      const isSelected = selectedTime === label;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleTimeSelect(label)}
                          className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                            isSelected
                              ? "bg-[#FCF2E9] border-[#8B7355] shadow-md ring-2 ring-[#8B7355]/20"
                              : "bg-white border-[#E2E8F0] hover:border-[#D1B191]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-base font-bold font-displayPlayFair text-[#0F172A]">
                              {label}
                            </span>
                            {isSelected && <BiCheckCircle className="text-[#8B7355]" size={18} />}
                          </div>
                        </button>
                      );
                    });
                  })()}
                </div>
              ) : !loadingApiSlots && !apiSlots?.is_blocked && isLunchroom ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(() => {
                    const lunchroomSlots = generateTimeSlotsBetween(
                      apiSlots?.open_time || (apiSlots?.data as any)?.open_time,
                      apiSlots?.close_time || (apiSlots?.data as any)?.close_time,
                      60
                    );
                    if (lunchroomSlots.length === 0) {
                      return <p className="col-span-full text-xs text-amber-800">No Lunchroom arrival times are available for this date.</p>;
                    }
                    return lunchroomSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => handleTimeSelect(time)}
                        className={`py-4 rounded-xl border transition-all font-medium text-sm ${
                          selectedTime === time
                            ? "bg-[#D1B191] border-[#D1B191] text-white shadow-md shadow-[#D1B191]/20 font-bold scale-[1.02]"
                            : "bg-white border-[#E2E8F0] text-[#475569] hover:border-[#D1B191]"
                        }`}
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {time}
                      </button>
                    ));
                  })()}
                </div>
              ) : null}
            </div>
          )}

          {/* Guests Picker */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-bold text-[#0F172A] uppercase tracking-wider" style={{ fontFamily: "Inter, sans-serif" }}>
                {ctTrans?.numberOfPeoplePlaces || "Number of People / Places"} {isSaltRoom && "(Max 2)"}
              </label>
              {isSaltRoom && (
                <span className="text-xs font-semibold text-[#8B7355]">{ctTrans?.saltRoomLimitTag || "Salt Room limit: Max 2 guests"}</span>
              )}
            </div>

            <select
              value={guests}
              onChange={(e) => handleGuestsChange(e.target.value)}
              className="w-full p-4 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D1B191] text-[#475569] bg-white cursor-pointer"
              style={{
                appearance: "none",
                backgroundImage:
                  "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 1rem center",
                backgroundSize: "1.2em",
              }}
            >
              {guestOptions.map((n) => {
                const label = n === 1
                  ? (ctTrans?.personPlaceOption ? ctTrans.personPlaceOption.replace("{count}", "1") : "1 Person / Place")
                  : (ctTrans?.peoplePlacesOption ? ctTrans.peoplePlacesOption.replace("{count}", String(n)) : `${n} People / Places`);
                return (
                  <option key={n} value={n}>
                    {label} {!isPackage && `(${calculateOptionPrice(n)})`}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {/* ── Footer Navigation Buttons ── */}
      <div className="max-w-4xl mx-auto mt-16 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-[#FBF6F3] p-4 sm:p-8 rounded-2xl shadow-sm border border-[#E8E2DC]">
        <button
          onClick={() => window.history.back()}
          className="w-full sm:w-auto justify-center px-6 sm:px-10 py-3.5 sm:py-4 rounded-xl border border-[#CFB9A3] text-[#1d1a17] font-bold text-sm hover:bg-[#CFB9A3] hover:bg-opacity-10 transition-all flex items-center gap-3"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          {btnTrans?.back || "Back"}
        </button>

        <Link
          href="/booking/information"
          className={`w-full sm:w-auto justify-center px-6 sm:px-12 py-3.5 sm:py-4 rounded-xl font-bold text-sm flex items-center gap-3 transition-all ${
            isFormValid
              ? "bg-[#8B7355] hover:bg-[#786247] text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
              : "bg-[#E2E8F0] text-[#94A3B8] border border-[#CBD5E1] cursor-not-allowed pointer-events-none shadow-none opacity-80"
          }`}
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {btnTrans?.continue || "Continue"}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </Link>
      </div>
    </div>
  );
}
