"use client";
import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Image from "next/image";

const SustainabilityCare = () => {
  const { t } = useLanguage();
  const sustainability = t.philosophyPage.sustainability;

  return (
    <section className="w-full min-h-screen flex items-center bg-[#F5F1ED]">
      <div className="container mx-auto px-6 py-20 lg:py-24">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-16">
          {/* Left: Text */}
          <div className="flex w-full flex-col gap-6 text-center lg:max-w-[487px] lg:text-left">
            <div className="flex flex-col gap-3">
              <p
                style={{
                  color: "#475569",
                  fontFamily: "Cambria, Georgia, serif",
                  fontSize: "clamp(14px, 1.5vw, 18px)",
                  fontWeight: 400,
                  lineHeight: "150%",
                }}
              >
                {sustainability.kicker}
              </p>
              <div className="flex flex-col items-center gap-2 lg:items-start">
                <h2
                  style={{
                    color: "#0F172A",
                    fontFamily:
                      "var(--font-playfair), 'Playfair Display', Georgia, serif",
                    fontSize: "clamp(32px, 4vw, 48px)",
                    fontWeight: 700,
                    lineHeight: "140%",
                  }}
                >
                  {sustainability.title}
                </h2>
                <DecorativeUnderline />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <p
                style={{
                  color: "#475569",
                  fontFamily: "Cambria, Georgia, serif",
                  fontSize: "clamp(16px, 1.5vw, 18px)",
                  fontWeight: 400,
                  lineHeight: "150%",
                }}
              >
                {sustainability.body1}
              </p>
              <p
                style={{
                  color: "#475569",
                  fontFamily: "Cambria, Georgia, serif",
                  fontSize: "clamp(16px, 1.5vw, 18px)",
                  fontWeight: 400,
                  lineHeight: "150%",
                }}
              >
                {sustainability.body2}
              </p>
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative h-[400px] w-full lg:h-[612px] lg:w-[745px] lg:flex-shrink-0">
            <Image
              src="/images/philosophy/sustain.png"
              alt={sustainability.title}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SustainabilityCare;
