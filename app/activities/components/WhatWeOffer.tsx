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
  const s = t.activitiesPage.whatWeOffer;

  return (
    <section className="min-h-screen flex flex-col justify-center" style={{ background: "#FFFFFF", padding: "96px 128px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          marginBottom: 64,
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: 48,
            fontWeight: 700,
            color: "#0F172A",
            textAlign: "center",
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 40,
          maxWidth: 960,
          margin: "0 auto",
        }}
      >
        {s.offerings.map((item, i) => (
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
