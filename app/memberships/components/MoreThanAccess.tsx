"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Image from "next/image";

const MoreThanAccess = () => {
  const { t } = useLanguage();
  const s = t.membershipsPage.moreThanAccess;

  return (
    <section
      style={{ background: "#FFFFFF", padding: "96px 128px" }}
      className="min-h-screen flex items-center"
    >
      <div
        className="container mx-auto flex items-center"
        style={{ gap: 46, padding: 0 }}
      >
        {/* Image */}
        <div
          style={{
            flex: "0 0 auto",
            position: "relative",
            width: 799,
            height: 640,
          }}
        >
          <Image
            src="/images/memberships/morethanless/morethanless.png"
            alt="More Than Access"
            fill
            style={{
              objectFit: "cover",
              borderRadius: "42.667px",
            }}
          />
        </div>

        {/* Text */}
        <div
          className="flex flex-col"
          style={{ flex: 1, gap: 24, minWidth: 0 }}
        >
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
