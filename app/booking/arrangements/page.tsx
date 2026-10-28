"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import {
  updateStoredBookingData,
} from "@/lib/bookingStore";
import { servicesService, SaltroomServicesData, ServicePackage } from "@/lib/api/services/servicesService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import {
  BiCheckCircle,
  BiCreditCard,
  BiInfoCircle,
  BiTimeFive,
} from "react-icons/bi";
import { FaBoxes, FaCalendarAlt, FaInfinity, FaSpa, FaUsers } from "react-icons/fa";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type OptionType = "single" | "10_session_pass" | "once_a_week" | "unlimited";

interface SaltOption {
  id: OptionType;
  title: string;
  badge?: string;
  price: string;
  subtitle: string;
  icon: React.ReactNode;
  features: string[];
}

interface PackageComboItem {
  id: number;
  title: string;
  combo: string;
  price: string;
  link: string;
}

export default function SaltRoomBookingPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const flow = (t as any)?.bookingFlow;
  const saltTrans = flow?.saltroom;
  const btnTrans = flow?.buttons;
  const [selectedOption, setSelectedOption] = useState<OptionType>("single");
  const [guestsCount, setGuestsCount] = useState<number>(1);
  const [hasActivePass, setHasActivePass] = useState<boolean>(false);
  const [apiData, setApiData] = useState<SaltroomServicesData | null>(null);
  const [packagesList, setPackagesList] = useState<PackageComboItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      servicesService.getSaltRoomServices().catch((err) => {
        console.error("Error fetching saltroom services:", err);
        return null;
      }),
      servicesService.getPackages().catch((err) => {
        console.error("Error fetching packages:", err);
        return [] as ServicePackage[];
      }),
    ])
      .then(([saltRes, pkgRes]) => {
        if (
          saltRes &&
          (saltRes.saltroom?.length ||
            saltRes.subscription_plans?.length ||
            saltRes.session_pass?.length)
        ) {
          setApiData(saltRes);

          // Auto activate pass/membership deduction if user has active pass or subscription
          if (
            saltRes.user_membership?.has_active_pass ||
            saltRes.user_membership?.has_active_subscription
          ) {
            setHasActivePass(true);
          }
        } else {
          setApiData(null);
        }

        if (pkgRes && Array.isArray(pkgRes) && pkgRes.length > 0) {
          const mappedPackages: PackageComboItem[] = pkgRes.map((p) => {
            let comboText = "";
            if (Array.isArray(p.packages)) {
              comboText = p.packages.join(" + ");
            } else if (typeof p.packages === "string") {
              try {
                const parsed = JSON.parse(p.packages);
                comboText = Array.isArray(parsed) ? parsed.join(" + ") : p.packages;
              } catch {
                comboText = p.packages;
              }
            }
            if (!comboText) {
              comboText = p.description || "Wellness Combination";
            }

            const priceNum =
              typeof p.price === "number" ? p.price : parseFloat(String(p.price || 0)) || 0;

            return {
              id: p.id,
              title: p.title || "Wellness Package",
              combo: comboText,
              price: `€${priceNum.toFixed(0)}`,
              link: "/booking/packages",
            };
          });
          setPackagesList(mappedPackages);
        } else {
          setPackagesList([]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const [date, setDate] = useState<string>("");
  const [slotDateMembership, setSlotDateMembership] = useState<any | null>(null);
  const [loadingDateSlots, setLoadingDateSlots] = useState<boolean>(false);
  const [isDateBlocked, setIsDateBlocked] = useState<boolean>(false);
  const [dateBlockedMessage, setDateBlockedMessage] = useState<string | null>(null);

  // Fetch slot details when date changes to check limits for that date
  const handleDateChange = async (newDate: string) => {
    setDate(newDate);
    setIsDateBlocked(false);
    setDateBlockedMessage(null);

    if (!newDate) {
      setSlotDateMembership(null);
      return;
    }
    setLoadingDateSlots(true);
    try {
      const res = await servicesService.getServiceSlots("saltroom", newDate);

      // Check if date is blocked by admin / system
      if (res?.is_blocked) {
        setIsDateBlocked(true);
        setDateBlockedMessage(res.message || "This date is currently blocked for reservations. Please choose another date.");
      } else {
        setIsDateBlocked(false);
        setDateBlockedMessage(null);
      }

      const memberInfo = (res?.data as any)?.user_membership || (res as any)?.user_membership;
      if (memberInfo) {
        setSlotDateMembership(memberInfo);
      }
    } catch (err) {
      console.error("Error fetching date slots for saltroom:", err);
    } finally {
      setLoadingDateSlots(false);
    }
  };

  const saltroomInfo = apiData?.saltroom?.[0];
  const singlePriceNum = parseFloat(String(saltroomInfo?.price_per_person || 0)) || 0;
  const singlePrice = `€${singlePriceNum.toFixed(0)} / person`;

  // Determine effective user membership: prefer date-specific if fetched, else page-level
  const userMembership = slotDateMembership || apiData?.user_membership;
  const hasUserActivePlan = Boolean(
    userMembership?.has_active_pass || userMembership?.has_active_subscription
  );

  // Parse dynamic capacity from salt room features
  const dynamicMaxCapacity = useMemo(() => {
    if (saltroomInfo?.features && saltroomInfo.features.length > 0) {
      for (const f of saltroomInfo.features) {
        const text = (f as any).feature || (f as any).feature_en || "";
        const match = text.match(/Maximum\s+(\d+)\s+people/i) || text.match(/(\d+)\s+people/i);
        if (match && match[1]) {
          const parsed = parseInt(match[1], 10);
          if (!isNaN(parsed) && parsed > 0) return parsed;
        }
      }
    }
    return 2;
  }, [saltroomInfo]);

  // Parse dynamic duration text from features
  const dynamicDurationText = useMemo(() => {
    if (saltroomInfo?.features && saltroomInfo.features.length > 0) {
      for (const f of saltroomInfo.features) {
        const text = (f as any).feature || (f as any).feature_en || "";
        const match = text.match(/(\d+(?:\.\d+)?)\s*[- ]*(hour|hr|minute|min)/i);
        if (match) {
          const val = match[1];
          const unit = match[2].toLowerCase().startsWith("h") ? "Hour" : "Mins";
          return `${val} ${unit}`;
        }
      }
    }
    return "1 Hour";
  }, [saltroomInfo]);

  const saltPlans = useMemo(() => {
    return (
      apiData?.subscription_plans?.filter(
        (p) => p.plan_category?.toLowerCase() === "saltroom"
      ) || apiData?.subscription_plans || []
    );
  }, [apiData]);

  const weeklyPlan = saltPlans.find((p) => p.plan_type?.toLowerCase() === "weekly");
  const unlimitedPlan = saltPlans.find((p) => p.plan_type?.toLowerCase() === "unlimited");
  const sessionPass = apiData?.session_pass?.[0];

  const saltOptions: SaltOption[] = useMemo(() => {
    const options: SaltOption[] = [];

    if (saltroomInfo) {
      options.push({
        id: "single",
        title: saltroomInfo.title || saltTrans?.title || "Salt Room",
        badge: saltTrans?.standardBooking || "Standard Booking",
        price: singlePrice,
        subtitle: saltroomInfo.subtitle || "Aerosol Halotherapy Session",
        icon: <FaSpa className="w-5 h-5 text-[#8B7355]" />,
        features: saltroomInfo.features?.length
          ? saltroomInfo.features.map((f) => ((f as any).feature || (f as any).feature_en || "").replace(/^[✓✔\s]+/, ""))
          : [],
      });
    }

    if (sessionPass) {
      const passPriceNum = parseFloat(String(sessionPass.price || 0)) || 0;
      const unitLimit = sessionPass.entry_limit || 10;
      const unitPriceCalc = unitLimit > 0 ? (passPriceNum / unitLimit).toFixed(0) : "0";

      options.push({
        id: "10_session_pass",
        title: sessionPass.name || `${unitLimit} Session Pass`,
        badge: saltTrans?.bestValuePass || "Best Value Pass",
        price: `€${passPriceNum.toFixed(0)}`,
        subtitle: `${unitLimit} Sessions (€${unitPriceCalc} per session)`,
        icon: <FaBoxes className="w-5 h-5 text-[#8B7355]" />,
        features: sessionPass.features?.length
          ? sessionPass.features.map((f) => ((f as any).feature || (f as any).feature_en || "").replace(/^[✓✔\s]+/, ""))
          : [],
      });
    }

    if (weeklyPlan) {
      const planPriceNum = parseFloat(String(weeklyPlan.price || 0)) || 0;
      const durationWeeks = weeklyPlan.duration_weeks || 4;
      options.push({
        id: "once_a_week",
        title: weeklyPlan.name || "Once a Week",
        badge: saltTrans?.weeklyRitual || "Weekly Ritual",
        price: `€${planPriceNum.toFixed(0)} / ${durationWeeks} weeks`,
        subtitle: "1 Session Every Week",
        icon: <FaCalendarAlt className="w-5 h-5 text-[#8B7355]" />,
        features: weeklyPlan.features?.length
          ? weeklyPlan.features.map((f) => ((f as any).feature || (f as any).feature_en || "").replace(/^[✓✔\s]+/, ""))
          : [],
      });
    }

    if (unlimitedPlan) {
      const planPriceNum = parseFloat(String(unlimitedPlan.price || 0)) || 0;
      const durationWeeks = unlimitedPlan.duration_weeks || 4;
      options.push({
        id: "unlimited",
        title: unlimitedPlan.name || "Unlimited",
        badge: saltTrans?.ultimateWellness || "Ultimate Wellness",
        price: `€${planPriceNum.toFixed(0)} / ${durationWeeks} weeks`,
        subtitle: "Unlimited Halotherapy Access",
        icon: <FaInfinity className="w-5 h-5 text-[#8B7355]" />,
        features: unlimitedPlan.features?.length
          ? unlimitedPlan.features.map((f) => ((f as any).feature || (f as any).feature_en || "").replace(/^[✓✔\s]+/, ""))
          : [],
      });
    }

    return options;
  }, [saltroomInfo, sessionPass, weeklyPlan, unlimitedPlan, singlePrice, saltTrans]);

  useEffect(() => {
    if (saltOptions.length > 0 && !saltOptions.some((o) => o.id === selectedOption)) {
      setSelectedOption(saltOptions[0].id);
    }
  }, [saltOptions, selectedOption]);

  // Resolve membership objects from both new API (weekly_subscription, unlimited_subscription, pass) and existing API
  const weeklySubObj = userMembership?.weekly_subscription || (
    (userMembership?.subscription?.plan_type?.toLowerCase() === "weekly" ||
     userMembership?.subscription?.type?.toLowerCase() === "weekly" ||
     userMembership?.subscription?.name?.toLowerCase().includes("week"))
      ? userMembership.subscription
      : null
  );

  const unlimitedSubObj = userMembership?.unlimited_subscription || (
    (userMembership?.subscription?.plan_type?.toLowerCase() === "unlimited" ||
     userMembership?.subscription?.type?.toLowerCase() === "unlimited" ||
     userMembership?.subscription?.is_unlimited ||
     userMembership?.subscription?.name?.toLowerCase().includes("unlimited"))
      ? userMembership.subscription
      : null
  );

  const passObj = userMembership?.pass || userMembership?.session_pass;

  // Availability flags and reasons per date
  const isWeeklyAvailable = weeklySubObj ? weeklySubObj.is_available_for_date !== false : true;
  const weeklyUnavailableReason = weeklySubObj?.unavailable_reason || "Weekly session limit already reached for this week.";

  const isUnlimitedAvailable = unlimitedSubObj ? unlimitedSubObj.is_available_for_date !== false : true;
  const unlimitedUnavailableReason = unlimitedSubObj?.unavailable_reason || "Maximum 10 active reservations reached.";

  const isPassAvailable = passObj ? (passObj.is_available_for_date !== false && (passObj.remaining_sessions ?? 0) > 0) : true;
  const passUnavailableReason = passObj?.unavailable_reason || "No remaining sessions or pass expired.";

  // Coverage helpers: Check if current selection is covered by user's active pass or subscription
  const isPassCovered = Boolean(
    (userMembership?.has_pass || userMembership?.has_active_pass || Boolean(passObj)) &&
    (passObj?.remaining_sessions ?? 0) > 0 &&
    isPassAvailable
  );

  const isWeeklySubscriptionCovered = Boolean(
    weeklySubObj &&
    ((weeklySubObj.remaining_sessions ?? 0) > 0 || weeklySubObj.is_unlimited) &&
    isWeeklyAvailable
  );

  const isUnlimitedSubscriptionCovered = Boolean(
    unlimitedSubObj &&
    isUnlimitedAvailable
  );

  // If user has an active weekly or unlimited subscription that is disabled for this date, reset selection to single
  useEffect(() => {
    if (selectedOption === "once_a_week" && weeklySubObj && !isWeeklyAvailable) {
      setSelectedOption("single");
    } else if (selectedOption === "unlimited" && unlimitedSubObj && !isUnlimitedAvailable) {
      setSelectedOption("single");
    } else if (selectedOption === "10_session_pass" && passObj && !isPassAvailable) {
      setSelectedOption("single");
    }
  }, [selectedOption, weeklySubObj, isWeeklyAvailable, unlimitedSubObj, isUnlimitedAvailable, passObj, isPassAvailable]);

  // Checks if the chosen option is free via user's active membership.
  // Note: 'single' (Salt Room Session) is always charged at its standard price per person and is never €0 / deducted from passes.
  const isSelectedOptionCovered = useMemo(() => {
    if (selectedOption === "single") {
      return false;
    }
    if (selectedOption === "10_session_pass") {
      return isPassCovered;
    }
    if (selectedOption === "once_a_week") {
      return isWeeklySubscriptionCovered;
    }
    if (selectedOption === "unlimited") {
      return isUnlimitedSubscriptionCovered;
    }
    return false;
  }, [selectedOption, isPassCovered, isWeeklySubscriptionCovered, isUnlimitedSubscriptionCovered]);

  const calculateDynamicTotal = (): number => {
    // Single session is ALWAYS charged at standard price per person (never €0)
    if (selectedOption === "single") {
      return guestsCount * singlePriceNum;
    }

    // If a plan/pass option is covered by user's active pass/subscription, charge €0
    if (isSelectedOptionCovered) return 0;

    // Otherwise, charge the actual price of that option
    if (selectedOption === "10_session_pass") return parseFloat(String(sessionPass?.price || 0)) || 0;
    if (selectedOption === "once_a_week") return parseFloat(String(weeklyPlan?.price || 0)) || 0;
    if (selectedOption === "unlimited") return parseFloat(String(unlimitedPlan?.price || 0)) || 0;
    return 0;
  };

  const calculatedTotal = calculateDynamicTotal();

  useEffect(() => {
    let name = saltroomInfo?.title || "Salt Room";
    if (selectedOption === "10_session_pass") name = sessionPass?.name || "10 Session pass";
    else if (selectedOption === "once_a_week") name = weeklyPlan?.name || "Once a Week";
    else if (selectedOption === "unlimited") name = unlimitedPlan?.name || "Unlimited";

    const activePass = userMembership?.session_pass;
    const activeSub = userMembership?.subscription;

    let paymentMode: "pass" | "subscription" | "weekly_subscription" | "unlimited_subscription" | "card" = "card";
    let purchaseId: string | undefined = undefined;
    let planId: number | string | undefined = undefined;
    let passId: number | string | undefined = undefined;

    if (selectedOption === "single") {
      paymentMode = "card";
    } else if (selectedOption === "10_session_pass") {
      if (isPassCovered && passObj) {
        paymentMode = "pass";
        purchaseId = passObj.purchase_id || passObj.pass_id;
        passId = passObj.pass_id || passObj.id || passObj.purchase_id;
      } else {
        paymentMode = "card"; // Buying new pass via card payment
        passId = sessionPass?.id;
        planId = sessionPass?.id;
      }
    } else if (selectedOption === "once_a_week") {
      if (isWeeklySubscriptionCovered && weeklySubObj) {
        paymentMode = "weekly_subscription";
        purchaseId = weeklySubObj.purchase_id || weeklySubObj.subscription_id;
      } else {
        paymentMode = "card"; // Buying new weekly subscription via card payment
        planId = weeklyPlan?.id;
      }
    } else if (selectedOption === "unlimited") {
      if (isUnlimitedSubscriptionCovered && unlimitedSubObj) {
        paymentMode = "unlimited_subscription";
        purchaseId = unlimitedSubObj.purchase_id || unlimitedSubObj.subscription_id;
      } else {
        paymentMode = "card"; // Buying new unlimited subscription via card payment
        planId = unlimitedPlan?.id;
      }
    }

    updateStoredBookingData({
      serviceName: name,
      serviceType: "salt_room",
      isSaltRoom: true,
      passType: selectedOption,
      guestsCount,
      date: date || undefined,
      changeoverMinutes: 10,
      durationHours: 1,
      totalAmount: calculatedTotal,
      price: isSelectedOptionCovered ? "€0 (Pass / Membership Deducted)" : `€${calculatedTotal}`,
      hasActiveMembership: isSelectedOptionCovered,
      remainingPassSessions: passObj?.remaining_sessions || userMembership?.session_pass?.remaining_sessions || undefined,
      paymentMode,
      purchaseId,
      planId,
      passId,
      activeMembershipInfo: userMembership,
    });
  }, [selectedOption, guestsCount, date, isSelectedOptionCovered, calculatedTotal, saltroomInfo, sessionPass, weeklyPlan, unlimitedPlan, userMembership, passObj, weeklySubObj, unlimitedSubObj, isPassCovered, isWeeklySubscriptionCovered, isUnlimitedSubscriptionCovered]);

  const handleContinue = () => {
    router.push("/booking/choose-time");
  };

  if (loading) {
    return (
      <div className="w-full px-6 md:px-12 max-w-6xl mx-auto py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#8B7355] border-t-transparent mb-4"></div>
        <p className="text-[#64748B] font-cambria italic">Loading Salt Room Services...</p>
      </div>
    );
  }

  if (!apiData || saltOptions.length === 0) {
    return (
      <div className="w-full px-6 md:px-12 max-w-6xl mx-auto py-16">
        <div className="text-center mb-12 flex flex-col items-center">
          <h1 className="font-displayPlayFair text-5xl text-[#1d1a17] mb-2 uppercase tracking-tight">
            Salt Room
          </h1>
          <DecorativeUnderline />
        </div>
        <div className="bg-white rounded-[32px] p-12 shadow-sm border border-[#E8E2DC] text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-[#FCF2E9] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#8B7355]">
            <FaSpa className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold font-displayPlayFair text-[#0F172A] mb-2">
            No Service Available
          </h3>
          <p className="text-sm text-[#64748B] font-cambria italic">
            Currently there are no salt room services available from the server. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  // Generate guests array based on dynamic max capacity
  const guestsRange = Array.from({ length: dynamicMaxCapacity }, (_, i) => i + 1);

  return (
    <div className="w-full px-6 md:px-12 max-w-6xl mx-auto">
      {/* ── Title Section ── */}
      <div className="text-center mb-10 flex flex-col items-center">
        <h1 className="font-displayPlayFair text-5xl text-[#1d1a17] mb-2 uppercase tracking-tight">
          {saltroomInfo?.title || "Salt Room"}
        </h1>
        <DecorativeUnderline />
        <p className="font-cambria text-sm text-[#475569] mt-6 italic">
          {saltroomInfo?.description ||
            saltroomInfo?.subtitle ||
            ""}
        </p>
      </div>

      {/* ── Authenticated User Active Membership / Pass Banner ── */}
      {userMembership && (userMembership.has_active_subscription || userMembership.has_active_pass) && (
        <div className="mb-8 space-y-3">
          {userMembership.has_active_subscription && userMembership.subscription && (
            <div className="bg-[#F0FDF4] border border-[#86EFAC] p-5 rounded-2xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#15803D] flex-shrink-0">
                  <BiCheckCircle size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#15803D] text-white">
                      Active Subscription
                    </span>
                    <h4 className="font-bold text-[#14532D] text-base font-displayPlayFair">
                      {userMembership.subscription.name}
                    </h4>
                  </div>
                  <p className="text-xs text-[#166534] mt-1">
                    {userMembership.subscription.is_unlimited
                      ? `Unlimited sessions • Valid until ${new Date(userMembership.subscription.end_date).toLocaleDateString()}`
                      : `${userMembership.subscription.remaining_sessions} session(s) left (${userMembership.subscription.sessions_per_week}/week) • Valid until ${new Date(userMembership.subscription.end_date).toLocaleDateString()}`
                    }
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#15803D] bg-white px-3 py-1.5 rounded-lg border border-[#86EFAC]">
                Ref: {userMembership.subscription.purchase_id}
              </span>
            </div>
          )}

          {userMembership.has_active_pass && userMembership.session_pass && (
            <div className="bg-[#FFFBEB] border border-[#FDE68A] p-5 rounded-2xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] flex items-center justify-center text-[#B45309] flex-shrink-0">
                  <FaBoxes size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#B45309] text-white">
                      Session Pass
                    </span>
                    <h4 className="font-bold text-[#78350F] text-base font-displayPlayFair">
                      {userMembership.session_pass.name}
                    </h4>
                  </div>
                  <p className="text-xs text-[#92400E] mt-1">
                    {userMembership.session_pass.remaining_sessions} credits remaining (Total across passes: {userMembership.session_pass.total_remaining_across_all_passes || userMembership.session_pass.remaining_sessions}) • No expiration
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#B45309] bg-white px-3 py-1.5 rounded-lg border border-[#FDE68A]">
                Ref: {userMembership.session_pass.purchase_id}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Key Parameters Banner ── */}
      <div className="mb-10 bg-white rounded-2xl p-6 border border-[#E8E2DC] shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-xl bg-[#FCF2E9] border border-[#E8E2DC]">
          <span className="text-xs text-[#8B7355] font-bold uppercase tracking-wider block mb-1">
            {saltTrans?.maxCapacity || "Max Capacity"}
          </span>
          <div className="flex items-center justify-center gap-1 text-[#0F172A] font-bold text-base font-displayPlayFair">
            <FaUsers className="text-[#8B7355]" />
            <span>
              {dynamicMaxCapacity === 1
                ? (saltTrans?.personPerSession ? saltTrans.personPerSession.replace("{count}", "1") : "1 Person / Session")
                : (saltTrans?.peoplePerSession ? saltTrans.peoplePerSession.replace("{count}", String(dynamicMaxCapacity)) : `${dynamicMaxCapacity} People / Session`)}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#FCF2E9] border border-[#E8E2DC]">
          <span className="text-xs text-[#8B7355] font-bold uppercase tracking-wider block mb-1">
            {saltTrans?.sessionDuration || "Session Duration"}
          </span>
          <div className="flex items-center justify-center gap-1 text-[#0F172A] font-bold text-base font-displayPlayFair">
            <BiTimeFive className="text-[#8B7355] text-lg" />
            <span>{dynamicDurationText}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#FCF2E9] border border-[#E8E2DC]">
          <span className="text-xs text-[#8B7355] font-bold uppercase tracking-wider block mb-1">
            {saltTrans?.singlePrice || "Single Price"}
          </span>
          <div className="flex items-center justify-center gap-1 text-[#0F172A] font-bold text-base font-displayPlayFair">
            <BiCreditCard className="text-[#8B7355] text-lg" />
            <span>€{singlePriceNum.toFixed(0)} / {saltTrans?.perPerson || "Person"}</span>
          </div>
        </div>
      </div>

      {/* ── Main Options Grid ── */}
      <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-[#E8E2DC] space-y-10 mb-10">
        {/* ── 1. Date Selection (Picker) ── */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-bold text-[#0F172A] uppercase tracking-wider" style={{ fontFamily: "Inter, sans-serif" }}>
              {saltTrans?.selectReservationDate || "1. Select Reservation Date"}
            </label>
            <span className="text-xs text-[#8B7355] font-semibold">
              {saltTrans?.operatingHours || "Operating hours: 09:00 – 21:00"}
            </span>
          </div>
          <div className="relative max-w-md">
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => handleDateChange(e.target.value)}
              className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D1B191] text-[#0F172A] bg-white cursor-pointer font-medium ${
                isDateBlocked ? "border-rose-400 bg-rose-50/20" : "border-[#E2E8F0]"
              }`}
            />
            {loadingDateSlots && (
              <span className="absolute right-12 top-4 text-xs text-[#8B7355] italic flex items-center gap-1">
                <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-[#8B7355] border-t-transparent"></span>
                {saltTrans?.checkingLimits || "Checking date limits..."}
              </span>
            )}
          </div>

          {/* Blocked Date Alert */}
          {isDateBlocked && (
            <div className="mt-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-3 max-w-xl">
              <BiInfoCircle size={20} className="flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider">
                  {saltTrans?.dateBlockedTitle || "Date Blocked for Reservations"}
                </h5>
                <p className="text-xs font-medium mt-0.5">
                  {dateBlockedMessage || (saltTrans?.dateBlockedDefault || "This date is currently blocked. No reservations can be made on this date.")}
                </p>
              </div>
            </div>
          )}

          {date && !isDateBlocked && slotDateMembership && (
            <p className="text-xs text-emerald-700 mt-2 font-medium">
              {saltTrans?.verifiedLimits ? saltTrans.verifiedLimits.replace("{date}", new Date(date).toLocaleDateString()) : `✓ Verified limits for ${new Date(date).toLocaleDateString()}: `}
              {slotDateMembership.has_active_pass ? (saltTrans?.passSessionsRemaining ? saltTrans.passSessionsRemaining.replace("{count}", String(slotDateMembership.session_pass?.remaining_sessions ?? 0)) : `${slotDateMembership.session_pass?.remaining_sessions ?? 0} Pass sessions remaining`) : ""}{" "}
              {slotDateMembership.has_active_subscription ? (saltTrans?.subscriptionActive ? saltTrans.subscriptionActive.replace("{name}", slotDateMembership.subscription?.name || "") : `${slotDateMembership.subscription?.name} Subscription active`) : ""}
            </p>
          )}
        </div>

        {/* ── 2. Select Booking Option or Membership ── */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <label className="block text-sm font-bold text-[#0F172A] uppercase tracking-wider" style={{ fontFamily: "Inter, sans-serif" }}>
              {saltTrans?.selectBookingOption || "2. Select Booking Option or Membership"}
            </label>
            {!date && (
              <span className="text-xs text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 font-semibold flex items-center gap-1.5 self-start sm:self-auto">
                <BiInfoCircle size={15} /> {saltTrans?.pleaseSelectDateFirst || "Please select a reservation date above first"}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {saltOptions.map((opt) => {
              const isSelected = selectedOption === opt.id;
              
              // Check if option is disabled due to user membership limits on this date
              let isOptionDisabledForDate = false;
              let unavailableReasonText: string | null = null;

              if (opt.id === "once_a_week" && weeklySubObj && !isWeeklyAvailable) {
                isOptionDisabledForDate = true;
                unavailableReasonText = weeklyUnavailableReason;
              } else if (opt.id === "unlimited" && unlimitedSubObj && !isUnlimitedAvailable) {
                isOptionDisabledForDate = true;
                unavailableReasonText = unlimitedUnavailableReason;
              } else if (opt.id === "10_session_pass" && passObj && !isPassAvailable) {
                isOptionDisabledForDate = true;
                unavailableReasonText = passUnavailableReason;
              }

              // Determine if this specific card is covered by active subscription/pass
              // 'single' (Salt Room Session) is ALWAYS charged at its standard price (€25) and is never €0
              const isCardCovered =
                Boolean(date) &&
                opt.id !== "single" &&
                ((opt.id === "10_session_pass" && isPassCovered) ||
                  (opt.id === "once_a_week" && isWeeklySubscriptionCovered) ||
                  (opt.id === "unlimited" && isUnlimitedSubscriptionCovered));

              // Card is disabled if no date is picked, date is blocked, or membership limit is reached for this date
              const isButtonDisabled = !date || isDateBlocked || isOptionDisabledForDate;

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={isButtonDisabled}
                  onClick={() => !isButtonDisabled && setSelectedOption(opt.id)}
                  className={`p-6 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                    !date
                      ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200"
                      : isDateBlocked
                      ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200"
                      : isOptionDisabledForDate
                      ? "opacity-60 cursor-not-allowed bg-amber-50/40 border-amber-200"
                      : isSelected
                      ? "bg-[#FCF2E9] border-[#8B7355] shadow-md ring-2 ring-[#8B7355]/20"
                      : "bg-white border-[#E2E8F0] hover:border-[#D1B191]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-3 py-1 rounded-full bg-[#8B7355]/10 text-[#8B7355] text-[10px] font-bold uppercase tracking-wider">
                        {opt.badge}
                      </span>
                      <div className="flex items-center gap-2">
                        {isOptionDisabledForDate ? (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-300">
                            {saltTrans?.limitReached || "Limit Reached"}
                          </span>
                        ) : isCardCovered ? (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                            {saltTrans?.activeCovered || "Active (Covered)"}
                          </span>
                        ) : null}
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            isSelected && !isButtonDisabled ? "border-[#8B7355] bg-[#8B7355] text-white" : "border-[#CBD5E1]"
                          }`}
                        >
                          {isSelected && !isButtonDisabled && <BiCheckCircle size={16} />}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 my-2">
                      {opt.icon}
                      <h3 className="text-xl font-bold font-displayPlayFair text-[#0F172A]">
                        {opt.title}
                      </h3>
                    </div>

                    <p className="text-2xl font-bold text-[#8B7355] font-displayPlayFair my-1">
                      {isCardCovered ? (
                        <span>
                          <span className="line-through text-base text-[#94A3B8] mr-2">{opt.price}</span>
                          €0
                        </span>
                      ) : (
                        opt.price
                      )}
                    </p>
                    <p className="text-xs text-[#64748B] mb-2">{opt.subtitle}</p>

                    {/* Membership / Subscription Limit Warning */}
                    {isOptionDisabledForDate && (
                      <div className="my-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium flex items-center gap-1.5">
                        <BiInfoCircle size={16} className="text-amber-700 flex-shrink-0" />
                        <span>{unavailableReasonText}</span>
                      </div>
                    )}

                    <ul className="space-y-2 border-t border-[#E8E2DC]/70 pt-3 text-xs text-[#475569]">
                      {opt.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#8B7355] font-bold">✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 3. Guest Count Selector ── */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-bold text-[#0F172A] uppercase tracking-wider" style={{ fontFamily: "Inter, sans-serif" }}>
              {saltTrans?.numberOfGuests
                ? saltTrans.numberOfGuests.replace("{max}", String(dynamicMaxCapacity))
                : `3. Number of Guests (Maximum ${dynamicMaxCapacity} ${dynamicMaxCapacity === 1 ? "person" : "people"} per session)`}
            </label>
            <span className="text-xs font-semibold text-[#8B7355]">
              {saltTrans?.strictCapacity
                ? saltTrans.strictCapacity.replace("{max}", String(dynamicMaxCapacity))
                : `Strict capacity: Max ${dynamicMaxCapacity} guests`}
            </span>
          </div>

          <div className={`grid grid-cols-${Math.min(guestsRange.length, 4)} gap-4 max-w-md`}>
            {guestsRange.map((num) => (
              <button
                key={num}
                type="button"
                disabled={!date || isDateBlocked}
                onClick={() => (!date || isDateBlocked ? null : setGuestsCount(num))}
                className={`py-4 rounded-xl border font-bold text-center transition-all ${
                  !date || isDateBlocked
                    ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200 text-[#94A3B8]"
                    : guestsCount === num
                    ? "bg-[#8B7355] border-[#8B7355] text-white shadow-md scale-[1.02]"
                    : "bg-white border-[#E2E8F0] text-[#475569] hover:border-[#D1B191]"
                }`}
              >
                <span className="block text-xl font-displayPlayFair">
                  {num === 1
                    ? (saltTrans?.person ? saltTrans.person.replace("{count}", "1") : "1 Person")
                    : (saltTrans?.people ? saltTrans.people.replace("{count}", String(num)) : `${num} People`)}
                </span>
                <span className="text-[11px] opacity-90 font-mono">
                  {selectedOption === "single"
                    ? `€${(num * singlePriceNum).toFixed(0)}`
                    : isSelectedOptionCovered
                    ? (saltTrans?.coveredZero || "Covered (€0)")
                    : (saltTrans?.includedInPlan || "Included in plan")}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Calculated Price Section ── */}
        <div className="p-6 md:p-8 rounded-2xl bg-[#FCF2E9] border border-[#E8E2DC] shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#8B7355] block mb-1">
                {saltTrans?.calculatedPrice || "Calculated Price"}
              </span>
              <h4 className="text-xl font-bold text-[#0F172A] font-displayPlayFair">
                {selectedOption === "single"
                  ? `${saltroomInfo?.title || saltTrans?.title || "Salt Room"} • ${guestsCount === 1 ? (saltTrans?.person ? saltTrans.person.replace("{count}", "1") : "1 Person") : (saltTrans?.people ? saltTrans.people.replace("{count}", String(guestsCount)) : `${guestsCount} People`)}`
                  : saltOptions.find((o) => o.id === selectedOption)?.title || "Selected Plan"}
              </h4>
              <p className="text-xs text-[#64748B] mt-1">
                {isSelectedOptionCovered
                  ? (saltTrans?.coveredActiveNote || "✓ Active subscription / pass detected & valid — €0 due today.")
                  : selectedOption === "single"
                  ? (saltTrans?.standardPriceNote
                      ? saltTrans.standardPriceNote.replace("{price}", singlePriceNum.toFixed(0)).replace("{count}", String(guestsCount))
                      : `€${singlePriceNum.toFixed(0)} × ${guestsCount} guest(s)`)
                  : (saltTrans?.noMembershipNote || "No active membership for this option — standard price applies.")}
              </p>
            </div>

            <div className="text-left md:text-right flex flex-col items-start md:items-end justify-center">
              <span className="text-xs text-[#8B7355] uppercase font-bold tracking-wider mb-0.5">
                {saltTrans?.totalDue || "Total Due"}
              </span>
              <div className="flex items-baseline gap-2">
                {isSelectedOptionCovered && (
                  <span className="text-lg line-through text-[#94A3B8] font-displayPlayFair">
                    €{selectedOption === "single"
                      ? (guestsCount * singlePriceNum).toFixed(0)
                      : selectedOption === "10_session_pass"
                      ? (parseFloat(String(sessionPass?.price || 0)) || 0).toFixed(0)
                      : selectedOption === "once_a_week"
                      ? (parseFloat(String(weeklyPlan?.price || 0)) || 0).toFixed(0)
                      : (parseFloat(String(unlimitedPlan?.price || 0)) || 0).toFixed(0)}
                  </span>
                )}
                <span className="text-4xl font-bold font-displayPlayFair text-[#8B7355]">
                  €{calculatedTotal.toFixed(0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer Navigation Buttons ── */}
      <div className="max-w-6xl mx-auto mb-16 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-[#FBF6F3] p-4 sm:p-8 rounded-2xl shadow-sm border border-[#E8E2DC]">
        <Link
          href="/booking"
          className="w-full sm:w-auto justify-center px-6 sm:px-10 py-3.5 sm:py-4 rounded-xl border border-[#CFB9A3] text-[#1d1a17] font-bold text-sm hover:bg-[#CFB9A3] hover:bg-opacity-10 transition-all flex items-center gap-3"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          {btnTrans?.back || "Back"}
        </Link>

        <button
          type="button"
          disabled={!date || isDateBlocked}
          onClick={handleContinue}
          className={`w-full sm:w-auto justify-center px-6 sm:px-10 py-3.5 sm:py-4 rounded-xl font-bold text-sm flex items-center gap-3 transition-all ${
            !date || isDateBlocked
              ? "bg-[#E2E8F0] text-[#94A3B8] border border-[#CBD5E1] cursor-not-allowed shadow-none opacity-80"
              : "bg-[#8B7355] hover:bg-[#786247] text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
          }`}
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {!date
            ? (saltTrans?.btnSelectDatePrompt || "Please Select a Date to Continue")
            : isDateBlocked
            ? (saltTrans?.btnDateBlocked || "Date Blocked — Select Another Date")
            : isSelectedOptionCovered
            ? (saltTrans?.btnBookFree || "Book with Membership / Pass (Free)")
            : (saltTrans?.btnContinueToTime || "Continue to Choose Time")}
          {date && !isDateBlocked && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
