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

const MembershipCards = () => {
  const { t } = useLanguage();
  const s = t.membershipsPage.cards;

  const variants = ["essential", "ethereal", "infinite"] as const;

  const plans = s.plans.map((plan, i) => ({
    ...plan,
    variant: variants[i],
  }));

  return (
    <section
      className="min-h-screen flex items-center"
      style={{ background: "#FCF2E9", padding: "96px 0" }}
    >
      <div
        className="container mx-auto flex flex-col items-center"
        style={{ gap: 68, padding: "0 128px" }}
      >
        {/* Cards row */}
        <div className="flex w-full" style={{ gap: 32, alignItems: "stretch" }}>
          {plans.map((plan) => {
            const isDark = plan.variant === "infinite";
            const isFilled = plan.variant === "ethereal" || isDark;

            return (
              <div
                key={plan.variant}
                className="flex flex-col"
                style={{
                  flex: "1 0 0",
                  minHeight: 544,
                  padding: "46px 24px",
                  borderRadius: 0,
                  background: isDark ? "#081228" : "#FFFFFF",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
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
                    {plan.features.map((feature, i) => (
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
                        {s.perMonth}
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
