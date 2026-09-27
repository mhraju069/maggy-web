"use client";
import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { IoHeartOutline, IoLeafOutline } from "react-icons/io5";
import { LuUser, LuUsers } from "react-icons/lu";

const icons = [
  <IoHeartOutline key="heart" size={28} color="#8B7355" />,
  <IoLeafOutline key="leaf" size={28} color="#8B7355" />,
  <LuUser key="user" size={28} color="#8B7355" />,
  <LuUsers key="users" size={28} color="#8B7355" />,
];

const WhatWeOffer = () => {
  const { t } = useLanguage();
  const s = (t.activitiesPage as any)?.whatWeOffer || {
    subtitle: "Explore our experiences",
    offerings: [],
  };

  return (
    <section className="min-h-screen flex flex-col justify-center bg-white py-16 lg:py-24 px-6 md:px-12 lg:px-16 xl:px-24">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 mb-12 sm:mb-16">
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] text-center"
          style={{
            fontFamily: "var(--font-playfair)",
            lineHeight: "140%",
            margin: 0,
          }}
        >
          What We Offer
        </h2>
        <div className="flex justify-center">
          <DecorativeUnderline />
        </div>
        <p
          style={{
            fontFamily: "Cambria, Georgia, serif",
            fontSize: 18,
            color: "#6B5D54",
            textAlign: "center",
            marginTop: 8,
          }}
        >
          {s.subtitle}
        </p>
      </div>

      {/* 4-column grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto w-full">
        {s.offerings.map((item: any, i: number) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              textAlign: "center",
            }}
          >
            {/* Icon circle */}
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 999,
                background: "#E8DFD5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {icons[i]}
            </div>

            {/* Title */}
            <h3
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: 20,
                fontWeight: 700,
                color: "#0F172A",
                margin: 0,
              }}
            >
              {item.title}
            </h3>

            {/* Description */}
            <p
              style={{
                fontFamily: "Cambria, Georgia, serif",
                fontSize: 15,
                color: "#6B5D54",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhatWeOffer;
