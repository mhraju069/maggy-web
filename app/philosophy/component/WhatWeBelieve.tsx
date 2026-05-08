"use client";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const WhatWeBelieve = () => {
  const { t } = useLanguage();
  const whatWeBelieve = t.philosophyPage.whatWeBelieve;

  return (
    <section className="w-full bg-[#FCF2E9]">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center gap-6 px-6 py-20 text-center lg:gap-[46px] lg:px-[128px] lg:py-[96px]">
        <h2
          style={{
            color: "#0F172A",
            fontFamily:
              "var(--font-playfair), 'Playfair Display', Georgia, serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 700,
            lineHeight: "140%",
          }}
        >
          {whatWeBelieve.title}
        </h2>
        <div className="flex w-full max-w-[970px] flex-col gap-6">
          <p
            style={{
              color: "#6B5D54",
              fontFamily: "Cambria, Georgia, serif",
              fontSize: "clamp(16px, 2vw, 22px)",
              fontWeight: 400,
              lineHeight: "150%",
            }}
          >
            {whatWeBelieve.body1}
          </p>
          <p
            style={{
              color: "#6B5D54",
              fontFamily: "Cambria, Georgia, serif",
              fontSize: "clamp(16px, 2vw, 22px)",
              fontWeight: 400,
              lineHeight: "150%",
            }}
          >
            {whatWeBelieve.body2}
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhatWeBelieve;
