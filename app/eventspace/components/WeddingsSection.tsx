"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import Image from "next/image";
import { LuFlower2 } from "react-icons/lu";

export default function WeddingsSection() {
  const { t } = useLanguage();

  const items = t.eventspacePage?.weddingsSection?.items || [
    "Elegant, neutral décor",
    "Indoor/outdoor access",
    "Full catering coordination",
    "Wellness packages for guests",
  ];

  return (
    <section className="py-24 bg-[#E8DFD5] min-h-screen flex items-center">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row-reverse items-center justify-center gap-10 max-w-6xl mx-auto">
          {/* Image Section */}
          <div className="w-full lg:w-1/2">
            <div className="relative w-full h-[400px] lg:h-[560px] rounded-[18px] overflow-hidden">
              <Image
                src="/images/eventspace/weddings/weddings.png"
                alt="Weddings & Celebrations"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full lg:w-1/2">
            {/* Badge */}
            <div className="flex justify-start mb-4">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#FCF2E9] rounded-full border border-[#CFB9A3]">
                <LuFlower2 className="w-4 h-4 text-[#8B7355]" />
                <span
                  className="text-[#8B7355] text-sm font-medium"
                  style={{ fontFamily: "Cambria, Georgia, serif" }}
                >
                  {t.eventspacePage?.weddingsSection?.badge || "Celebration"}
                </span>
              </div>
            </div>

            {/* Title */}
            <h2
              style={{ fontFamily: "var(--font-playfair)" }}
              className="text-[clamp(32px,4vw,48px)] font-bold text-[#0F172A] mb-4"
            >
              {t.eventspacePage?.weddingsSection?.title ||
                "Weddings & Celebrations"}
            </h2>

            {/* Description */}
            <p
              className="text-[#6B5D54] text-lg md:text-xl mb-4 leading-relaxed"
              style={{ fontFamily: "Cambria, Georgia, serif" }}
            >
              {t.eventspacePage?.weddingsSection?.description ||
                "Celebrate life's most precious moments in a setting that feels both intimate and expansive. The space offers the perfect blend of elegance and warmth."}
            </p>

            {/* Subtitle */}
            <p
              className="text-[#475569] text-base md:text-lg mb-8 leading-relaxed"
              style={{ fontFamily: "Cambria, Georgia, serif" }}
            >
              {t.eventspacePage?.weddingsSection?.subtitle ||
                "From casual ceremonies to joyful receptions, we create an atmosphere that honors your unique story."}
            </p>

            {/* Items List */}
            <ul className="space-y-3">
              {items.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-[#8B7355] mt-1.5 text-xl">•</span>
                  <span
                    className="text-[#0F172A] text-lg md:text-xl"
                    style={{ fontFamily: "Cambria, Georgia, serif" }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
