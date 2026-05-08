"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import Image from "next/image";
import { LuCakeSlice } from "react-icons/lu";

export default function IceCreamSection() {
  const { t } = useLanguage();

  const iceCreamItems = t.lunchroomPage?.iceCreamSection?.menuItems || [
    "Seasonal flavors",
    "Vegan options available",
    "Made fresh daily",
  ];

  return (
    <section className="py-24 bg-[#FCF2E9] min-h-screen flex items-center">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 max-w-6xl mx-auto">
          {/* Image Section */}
          <div className="w-full lg:w-1/2">
            <div className="relative w-full h-[400px] lg:h-[560px] rounded-[18px] overflow-hidden">
              <Image
                src="/images/lunchroom/icecream/icecream.png"
                alt="Artisan Ice Cream"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full lg:w-1/2">
            {/* Sweet Badge */}
            <div className="flex justify-start mb-4">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#FCF2E9] rounded-full border border-[#CFB9A3]">
                <LuCakeSlice className="w-4 h-4 text-[#8B7355]" />
                <span
                  className="text-[#8B7355] text-sm font-medium"
                  style={{ fontFamily: "Cambria, Georgia, serif" }}
                >
                  {t.lunchroomPage?.iceCreamSection?.badge || "Sweet"}
                </span>
              </div>
            </div>

            {/* Title */}
            <h2
              style={{ fontFamily: "var(--font-playfair)" }}
              className="text-[clamp(32px,4vw,48px)] font-bold text-[#0F172A] mb-4"
            >
              {t.lunchroomPage?.iceCreamSection?.title || "Artisan Ice Cream"}
            </h2>

            {/* Description */}
            <p
              className="text-[#6B5D54] text-lg md:text-xl mb-4 leading-relaxed"
              style={{ fontFamily: "Cambria, Georgia, serif" }}
            >
              {t.lunchroomPage?.iceCreamSection?.description ||
                "Handcrafted ice cream in rotating seasonal flavors. Made with natural ingredients, no artificial colors or preservatives."}
            </p>

            {/* Subtitle */}
            <p
              className="text-[#475569] text-base md:text-lg mb-8 leading-relaxed"
              style={{ fontFamily: "Cambria, Georgia, serif" }}
            >
              {t.lunchroomPage?.iceCreamSection?.subtitle ||
                "Treat yourself to a moment of pure joy."}
            </p>

            {/* Ice Cream Items List */}
            <ul className="space-y-3">
              {iceCreamItems.map((item, index) => (
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
