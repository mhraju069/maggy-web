"use client";
import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LuHeart, LuLeaf, LuUsers } from "react-icons/lu";

const OurApproach = () => {
  const { t } = useLanguage();
  const approach = t.philosophyPage.approach;

  return (
    <section className="w-full min-h-screen bg-white py-20 lg:py-24 flex items-center">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-14 flex flex-col items-center gap-3 text-center">
          <div className="flex flex-col items-center gap-2">
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
              {approach.title}
            </h2>
            <DecorativeUnderline />
          </div>
          <p
            style={{
              color: "#475569",
              fontFamily: "Cambria, Georgia, serif",
              fontSize: "clamp(16px, 1.5vw, 18px)",
              fontWeight: 400,
              lineHeight: "150%",
            }}
          >
            {approach.subtitle}
          </p>
        </div>

        {/* Three columns */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:gap-10">
          {/* Intentional Care */}
          <div className="flex flex-col items-center gap-6 text-center">
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#E8DFD5",
              }}
            >
              <LuHeart
                style={{ width: "30px", height: "30px", color: "#8B7355" }}
              />
            </div>
            <h3
              style={{
                color: "#0F172A",
                fontFamily:
                  "var(--font-playfair), 'Playfair Display', Georgia, serif",
                fontSize: "clamp(20px, 2vw, 24px)",
                fontWeight: 700,
                lineHeight: "150%",
              }}
            >
              {approach.items[0].title}
            </h3>
            <p
              style={{
                color: "#475569",
                fontFamily: "Cambria, Georgia, serif",
                fontSize: "clamp(14px, 1.5vw, 16px)",
                fontWeight: 400,
                lineHeight: "150%",
              }}
            >
              {approach.items[0].body}
            </p>
          </div>

          {/* Natural Harmony */}
          <div className="flex flex-col items-center gap-6 text-center">
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#E8DFD5",
              }}
            >
              <LuLeaf
                style={{ width: "30px", height: "30px", color: "#8B7355" }}
              />
            </div>
            <h3
              style={{
                color: "#0F172A",
                fontFamily:
                  "var(--font-playfair), 'Playfair Display', Georgia, serif",
                fontSize: "clamp(20px, 2vw, 24px)",
                fontWeight: 700,
                lineHeight: "150%",
              }}
            >
              {approach.items[1].title}
            </h3>
            <p
              style={{
                color: "#475569",
                fontFamily: "Cambria, Georgia, serif",
                fontSize: "clamp(14px, 1.5vw, 16px)",
                fontWeight: 400,
                lineHeight: "150%",
              }}
            >
              {approach.items[1].body}
            </p>
          </div>

          {/* Community Connection */}
          <div className="flex flex-col items-center gap-6 text-center">
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#E8DFD5",
              }}
            >
              <LuUsers
                style={{ width: "30px", height: "30px", color: "#8B7355" }}
              />
            </div>
            <h3
              style={{
                color: "#0F172A",
                fontFamily:
                  "var(--font-playfair), 'Playfair Display', Georgia, serif",
                fontSize: "clamp(20px, 2vw, 24px)",
                fontWeight: 700,
                lineHeight: "150%",
              }}
            >
              {approach.items[2].title}
            </h3>
            <p
              style={{
                color: "#475569",
                fontFamily: "Cambria, Georgia, serif",
                fontSize: "clamp(14px, 1.5vw, 16px)",
                fontWeight: 400,
                lineHeight: "150%",
              }}
            >
              {approach.items[2].body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurApproach;
