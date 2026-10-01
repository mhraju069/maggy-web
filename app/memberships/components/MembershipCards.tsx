"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

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

const sharedSaunaPlans = [
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
  const { t } = useLanguage();
  const s = t?.membershipsPage?.cards;

  const plans = (s?.plans && s.plans.length > 0)
    ? s.plans.map((plan: any, i: number) => ({
        ...plan,
        variant: i === 0 ? "essential" : "infinite",
        perPeriod: s.perMonth || "/ 4 weeks",
      }))
    : sharedSaunaPlans;

  return (
    <section
      id="packages"
      className="min-h-screen flex items-center scroll-mt-20 py-16 lg:py-24 bg-[#FCF2E9]"
    >
      <div className="container mx-auto flex flex-col items-center gap-12 lg:gap-16 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24">
        {/* Cards row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full items-stretch">
          {plans.map((plan) => {
            const isDark = plan.variant === "infinite";
            const isFilled = plan.variant === "ethereal" || isDark;

            return (
              <div
                key={plan.variant}
                className="flex flex-col justify-between items-start w-full min-h-[500px] p-6 sm:p-8 lg:p-10 rounded-2xl"
                style={{
                  background: isDark ? "#081228" : "#FFFFFF",
                  border: isDark
                    ? "1px solid rgba(212,196,176,0.2)"
                    : undefined,
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
                      fontSize: 36,
                      fontWeight: 700,
                      color: isDark ? "#FFFFFF" : "#0F172A",
                      lineHeight: "150%",
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
                            fontSize: 16,
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
                    <p
                      style={{
                        fontFamily: "Cambria, Georgia, serif",
                        fontSize: 14,
                        fontWeight: 400,
                        color: isDark ? "rgba(255,255,255,0.60)" : "#6B5D54",
                        lineHeight: "130%",
                      }}
                    >
                      {s.from}
                    </p>
                    <div className="flex items-baseline" style={{ gap: 6 }}>
                      <span
                        style={{
                          fontFamily:
                            "var(--font-playfair), 'Playfair Display', Georgia, serif",
                          fontSize: 24,
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
                        {plan.perPeriod || s?.perMonth || "/ 4 weeks"}
                      </span>
                    </div>
                  </div>

                  {/* Button */}
                  <button
                    className="w-full flex items-center justify-center"
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
                      {s.applyNow}
                    </span>
                    <ArrowIcon color={isFilled ? "#FFFFFF" : "#5D360F"} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom subtitle */}
        <p
          className="text-center"
          style={{
            fontFamily: "Cambria, Georgia, serif",
            fontSize: 24,
            fontWeight: 400,
            color: "#6B5D54",
            lineHeight: "150%",
            maxWidth: 812,
          }}
        >
          {s.subtitle}
        </p>
      </div>
    </section>
  );
};

export default MembershipCards;
