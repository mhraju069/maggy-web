"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Image from "next/image";

const MoreThanAccess = () => {
  const { t } = useLanguage();
  const m = (t.membershipsPage as any)?.moreThanRelaxation;
  const oldS = (t.membershipsPage as any)?.moreThanAccess;
  const s = {
    kicker: m?.kicker || oldS?.kicker || "Membership",
    title: m?.title || oldS?.title || "More Than Just Relaxation",
    body1: m?.body1 || oldS?.body1 || "",
    body2: m?.body2 || oldS?.body2 || "",
  };

  return (
    <section className="min-h-screen flex items-center bg-white py-16 lg:py-24 px-6 md:px-12 lg:px-16 xl:px-24">
      <div className="container mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
        {/* Image */}
        <div className="relative w-full lg:w-1/2 h-[320px] sm:h-[420px] lg:h-[540px] shrink-0 rounded-[32px] sm:rounded-[42px] overflow-hidden">
          <Image
            src="/images/memberships/morethanless/morethanless.png"
            alt="More Than Access"
            fill
            className="object-cover"
          />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-6 flex-1 min-w-0">
          {/* Kicker */}
          <p
            style={{
              fontFamily: "Cambria, Georgia, serif",
              fontSize: 18,
              fontWeight: 400,
              color: "#CFB9A3",
              lineHeight: "150%",
            }}
          >
            {s.kicker}
          </p>

          {/* Title */}
          <div>
            <h2
              style={{
                fontFamily:
                  "var(--font-playfair), 'Playfair Display', Georgia, serif",
                fontSize: 48,
                fontWeight: 700,
                color: "#0F172A",
                lineHeight: "140%",
                margin: 0,
              }}
            >
              {s.title}
            </h2>
            <DecorativeUnderline />
          </div>

          {/* Body paragraphs */}
          <div className="flex flex-col" style={{ gap: 16 }}>
            <p
              style={{
                fontFamily: "Cambria, Georgia, serif",
                fontSize: 18,
                fontWeight: 400,
                color: "#475569",
                lineHeight: "150%",
                margin: 0,
              }}
            >
              {s.body1}
            </p>
            <p
              style={{
                fontFamily: "Cambria, Georgia, serif",
                fontSize: 18,
                fontWeight: 400,
                color: "#475569",
                lineHeight: "150%",
                margin: 0,
              }}
            >
              {s.body2}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MoreThanAccess;
