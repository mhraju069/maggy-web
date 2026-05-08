"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import Image from "next/image";
import Link from "next/link";
import { IoRestaurantOutline } from "react-icons/io5";

export default function MenuSection() {
  const { t } = useLanguage();

  const menuItems = t.lunchroomPage?.menuSection?.menuItems || [
    {
      title: "Fresh Salads",
      description: "Seasonal greens, grains, and wholesome toppings",
    },
    {
      title: "Artisan Sandwiches",
      description: "Made with locally-sourced bread and ingredients",
    },
    {
      title: "Warm Bowls",
      description: "Nourishing soups and grain bowls",
    },
    {
      title: "Sweet Treats",
      description: "Homemade pastries and desserts",
    },
  ];

  return (
    <section className="py-24 bg-[#E8DFD5] min-h-screen flex items-center">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 max-w-6xl mx-auto">
          {/* Image Section */}
          <div className="w-full lg:w-1/2">
            <div className="relative w-full h-[400px] lg:h-[560px] rounded-[18px] overflow-hidden">
              <Image
                src="/images/lunchroom/menu/lunchroommenu.png"
                alt="Fresh Salad Bowl"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full lg:w-1/2">
            {/* Menu Badge */}
            <div className="flex justify-start mb-4">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#FCF2E9] rounded-full border border-[#CFB9A3]">
                <IoRestaurantOutline className="w-4 h-4 text-[#8B7355]" />
                <span
                  className="text-[#8B7355] text-sm font-medium"
                  style={{ fontFamily: "Cambria, Georgia, serif" }}
                >
                  {t.lunchroomPage?.menuSection?.badge || "Menu"}
                </span>
              </div>
            </div>

            {/* Title */}
            <h2
              style={{ fontFamily: "var(--font-playfair)" }}
              className="text-[clamp(32px,4vw,48px)] font-bold text-[#0F172A] mb-4"
            >
              {t.lunchroomPage?.menuSection?.title || "Fresh & Wholesome"}
            </h2>

            {/* Description */}
            <p
              className="text-[#6B5D54] text-lg md:text-xl mb-8 leading-relaxed"
              style={{ fontFamily: "Cambria, Georgia, serif" }}
            >
              {t.lunchroomPage?.menuSection?.description ||
                "Every dish is prepared with care, using seasonal ingredients and recipes that nourish both body and spirit."}
            </p>

            {/* Menu Items */}
            <div className="space-y-6">
              {menuItems.map((item, index) => (
                <div key={index}>
                  <h3
                    className="text-[#0F172A] text-xl md:text-2xl font-medium mb-1"
                    style={{ fontFamily: "Cambria, Georgia, serif" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-[#475569] text-base md:text-lg"
                    style={{ fontFamily: "Cambria, Georgia, serif" }}
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Request Menu Link */}
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 mt-8 text-[#8B7355] hover:text-[#6B5D54] transition-colors"
              style={{ fontFamily: "Cambria, Georgia, serif" }}
            >
              <span className="text-lg">
                {t.lunchroomPage?.menuSection?.requestMenu ||
                  "Request full menu"}
              </span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12H19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 5L19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
