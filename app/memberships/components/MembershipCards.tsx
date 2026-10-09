"use client";

import { servicesService, SaltroomServicesData } from "@/lib/api/services/servicesService";
import Link from "next/link";
import { useEffect, useState } from "react";

const CheckIcon = ({ white }: { white?: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0, marginTop: 3 }}
  >
    <path
      d="M2.5 8L6.5 12L13.5 4"
      stroke={white ? "#FFFFFF" : "#6B5D54"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowIcon = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12H19M13 6L19 12L13 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const defaultSaltRoomPlans = [
  {
    variant: "essential",
    name: "10-Session Pass",
    price: "€200",
    perPeriod: "/ 10 sessions",
    features: [
      "10-session salt pass (€20 per session)",
      "Linked directly to customer account",
      "Auto deducts 1 session upon reservation",
      "View remaining sessions in account",
      "Valid for 1 full year after purchase",
    ],
  },
  {
    variant: "weekly",
    name: "Once a Week",
    price: "€70",
    perPeriod: "/ 4 weeks",
    features: [
      "1 Salt Room session per week included",
      "Maximum 4 included sessions per 4-week period",
      "Capacity max 2 people per session",
      "Automatic member recognition",
      "Online advance session booking",
    ],
  },
  {
    variant: "infinite",
    name: "Unlimited",
    price: "€100",
    perPeriod: "/ 4 weeks",
    features: [
      "Unlimited use within available capacity",
      "1-hour Salt Room halotherapy access",
      "Max 10 future active reservations at once",
      "Automatic member recognition",
      "Priority booking access",
    ],
  },
];

const defaultSharedSaunaPlans = [
  {
    variant: "essential",
    name: "Once a Week",
    price: "€60",
    perPeriod: "/ 4 weeks",
    features: [
      "Entitlement to 1 session per week",
      "1.5-hour Shared Sauna access",
      "Automatic member recognition",
      "Exempt from €19.95 session fee",
      "Advance online session booking",
    ],
  },
  {
    variant: "infinite",
    name: "Unlimited",
    price: "€100",
    perPeriod: "/ 4 weeks",
    features: [
      "Unlimited use within available capacity",
      "1.5-hour Shared Sauna access",
      "Up to 10 active future reservations",
      "Automatic member recognition",
      "Exempt from €19.95 session fee",
      "Priority session access",
    ],
  },
];

const MembershipCards = () => {
  const [category, setCategory] = useState<"salt" | "sauna">("salt");
  const [apiData, setApiData] = useState<SaltroomServicesData | null>(null);

  useEffect(() => {
    servicesService.getSaltRoomServices().then((res) => {
      if (res && (res.saltroom || res.subscription_plans || res.session_pass)) {
        setApiData(res);
      }
    });
  }, []);

  const sessionPass = apiData?.session_pass?.[0];
  const saltPlans = apiData?.subscription_plans?.filter(
    (p) => p.plan_category?.toLowerCase() === "saltroom"
  ) || [];

  const saltWeekly = saltPlans.find((p) => p.plan_type?.toLowerCase() === "weekly");
  const saltUnlimited = saltPlans.find((p) => p.plan_type?.toLowerCase() === "unlimited");

  const dynamicSaltPlans = [];
  if (sessionPass) {
    dynamicSaltPlans.push({
      variant: "essential",
      name: sessionPass.name || "10-Session Pass",
      price: sessionPass.price ? `€${parseFloat(String(sessionPass.price)).toFixed(0)}` : "€0",
      perPeriod: `/ ${sessionPass.entry_limit || 10} sessions`,
      features: sessionPass.features?.length
        ? sessionPass.features.map((f) => f.feature.replace(/^[✓✔\s]+/, ""))
        : [],
    });
  }
  if (saltWeekly) {
    dynamicSaltPlans.push({
      variant: "weekly",
      name: saltWeekly.name || "Once a Week",
      price: saltWeekly.price ? `€${parseFloat(String(saltWeekly.price)).toFixed(0)}` : "€0",
      perPeriod: "/ 4 weeks",
      features: saltWeekly.features?.length
        ? saltWeekly.features.map((f) => f.feature.replace(/^[✓✔\s]+/, ""))
        : [],
    });
  }
  if (saltUnlimited) {
    dynamicSaltPlans.push({
      variant: "infinite",
      name: saltUnlimited.name || "Unlimited",
      price: saltUnlimited.price ? `€${parseFloat(String(saltUnlimited.price)).toFixed(0)}` : "€0",
      perPeriod: "/ 4 weeks",
      features: saltUnlimited.features?.length
        ? saltUnlimited.features.map((f) => f.feature.replace(/^[✓✔\s]+/, ""))
        : [],
    });
  }

  const saunaPlans = apiData?.subscription_plans?.filter(
    (p) => p.plan_category?.toLowerCase() === "sauna"
  ) || [];

  const saunaWeekly = saunaPlans.find((p) => p.plan_type?.toLowerCase() === "weekly");
  const saunaUnlimited = saunaPlans.find((p) => p.plan_type?.toLowerCase() === "unlimited");

  const dynamicSaunaPlans = [];
  if (saunaWeekly) {
    dynamicSaunaPlans.push({
      variant: "essential",
      name: saunaWeekly.name || "Once a Week",
      price: saunaWeekly.price ? `€${parseFloat(String(saunaWeekly.price)).toFixed(0)}` : "€0",
      perPeriod: "/ 4 weeks",
      features: saunaWeekly.features?.length
        ? saunaWeekly.features.map((f) => f.feature.replace(/^[✓✔\s]+/, ""))
        : [],
    });
  }
  if (saunaUnlimited) {
    dynamicSaunaPlans.push({
      variant: "infinite",
      name: saunaUnlimited.name || "Unlimited",
      price: saunaUnlimited.price ? `€${parseFloat(String(saunaUnlimited.price)).toFixed(0)}` : "€0",
      perPeriod: "/ 4 weeks",
      features: saunaUnlimited.features?.length
        ? saunaUnlimited.features.map((f) => f.feature.replace(/^[✓✔\s]+/, ""))
        : [],
    });
  }

  const plans = category === "salt" ? dynamicSaltPlans : dynamicSaunaPlans;

  return (
    <section
      id="packages"
      className="min-h-screen flex items-center scroll-mt-20 py-16 lg:py-24 bg-[#FCF2E9]"
    >
      <div className="container mx-auto flex flex-col items-center gap-12 lg:gap-16 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24">
        {/* Toggle Switch */}
        <div className="inline-flex p-1.5 bg-white rounded-2xl border border-[#E8E2DC] shadow-xs">
          <button
            type="button"
            onClick={() => setCategory("salt")}
            className={`px-8 py-3.5 rounded-xl font-bold text-sm transition-all ${
              category === "salt"
                ? "bg-[#8B7355] text-white shadow-md"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            Salt Room Passes & Memberships
          </button>
          <button
            type="button"
            onClick={() => setCategory("sauna")}
            className={`px-8 py-3.5 rounded-xl font-bold text-sm transition-all ${
              category === "sauna"
                ? "bg-[#8B7355] text-white shadow-md"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            Sauna Memberships
          </button>
        </div>

        {/* Cards row */}
        {plans.length === 0 ? (
          <div className="w-full text-center py-16 px-6 bg-white rounded-3xl border border-[#E8E2DC] shadow-xs max-w-lg">
            <p className="text-xl font-bold font-displayPlayFair text-[#0F172A] mb-2">No Service Available</p>
            <p className="text-sm text-[#64748B] font-cambria italic">
              Currently there are no membership plans available for this category.
            </p>
          </div>
        ) : (
          <div className={`grid grid-cols-1 ${plans.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2 max-w-4xl"} gap-6 lg:gap-8 w-full items-stretch`}>
          {plans.map((plan) => {
            const isDark = plan.variant === "infinite";
            const isFilled = plan.variant === "weekly" || isDark;

            return (
              <div
                key={plan.name}
                className="flex flex-col justify-between items-start w-full min-h-[500px] p-6 sm:p-8 lg:p-10 rounded-2xl"
                style={{
                  background: isDark ? "#081228" : "#FFFFFF",
                  border: isDark
                    ? "1px solid rgba(212,196,176,0.2)"
                    : "1px solid #E8E2DC",
                }}
              >
                {/* Top: title + features */}
                <div
                  className="flex flex-col"
                  style={{ gap: 24, width: "100%", flex: 1 }}
                >
                  {/* Title */}
                  <h3
                    style={{
                      fontFamily:
                        "var(--font-playfair), 'Playfair Display', Georgia, serif",
                      fontSize: 32,
                      fontWeight: 700,
                      color: isDark ? "#FFFFFF" : "#0F172A",
                      lineHeight: "130%",
                    }}
                  >
                    {plan.name}
                  </h3>

                  {/* Features */}
                  <ul
                    className="flex flex-col"
                    style={{
                      gap: 12,
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    {plan.features.map((feature: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-start"
                        style={{ gap: 10 }}
                      >
                        <CheckIcon white={isDark} />
                        <span
                          style={{
                            fontFamily: "Cambria, Georgia, serif",
                            fontSize: 15,
                            fontWeight: 400,
                            color: isDark
                              ? "rgba(255,255,255,0.80)"
                              : "#6B5D54",
                            lineHeight: "150%",
                          }}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom: price + button */}
                <div
                  className="flex flex-col w-full"
                  style={{ gap: 24, marginTop: 32 }}
                >
                  {/* Price */}
                  <div>
                    <div className="flex items-baseline" style={{ gap: 6 }}>
                      <span
                        style={{
                          fontFamily:
                            "var(--font-playfair), 'Playfair Display', Georgia, serif",
                          fontSize: 28,
                          fontWeight: 700,
                          color: isDark ? "#FFFFFF" : "#0F172A",
                          lineHeight: "150%",
                        }}
                      >
                        {plan.price}
                      </span>
                      <span
                        style={{
                          fontFamily: "Cambria, Georgia, serif",
                          fontSize: 14,
                          fontWeight: 400,
                          color: isDark ? "rgba(255,255,255,0.60)" : "#6B5D54",
                          lineHeight: "130%",
                        }}
                      >
                        {plan.perPeriod}
                      </span>
                    </div>
                  </div>

                  {/* Button */}
                  <Link
                    href={category === "salt" ? "/booking/arrangements" : "/booking/sauna"}
                    className="w-full flex items-center justify-center transition-all"
                    style={{
                      padding: "16px 32px",
                      borderRadius: 12,
                      gap: 8,
                      background: isFilled
                        ? isDark
                          ? "rgba(255,255,255,0.10)"
                          : "#5D360F"
                        : "transparent",
                      border: isFilled
                        ? isDark
                          ? "1px solid rgba(255,255,255,0.30)"
                          : "none"
                        : "1px solid #5D360F",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Cambria, Georgia, serif",
                        fontSize: 16,
                        fontWeight: 700,
                        color: isFilled ? "#FFFFFF" : "#5D360F",
                        lineHeight: "150%",
                      }}
                    >
                      Apply Now
                    </span>
                    <ArrowIcon color={isFilled ? "#FFFFFF" : "#5D360F"} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* Bottom subtitle */}
        <p
          className="text-center"
          style={{
            fontFamily: "Cambria, Georgia, serif",
            fontSize: 20,
            fontWeight: 400,
            color: "#6B5D54",
            lineHeight: "150%",
            maxWidth: 812,
          }}
        >
          All passes and memberships are automatically linked to your customer account and allow effortless advance online session booking.
        </p>
      </div>
    </section>
  );
};

export default MembershipCards;
