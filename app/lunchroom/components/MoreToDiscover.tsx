"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import Image from "next/image";
import { LuCamera, LuShoppingBag } from "react-icons/lu";

export default function MoreToDiscover() {
  const { t } = useLanguage();

  const cards = [
    {
      icon: (
        <LuShoppingBag className="w-7 h-7 text-[#8B7355]" strokeWidth={1.5} />
      ),
      title:
        t.lunchroomPage?.moreToDiscover?.cards?.[0]?.title || "Souvenir Shop",
      description:
        t.lunchroomPage?.moreToDiscover?.cards?.[0]?.description ||
        "A curated selection of wellness products, local crafts, and small keepsakes to take a piece of your experience home.",
    },
    {
      icon: <LuCamera className="w-7 h-7 text-[#8B7355]" strokeWidth={1.5} />,
      title:
        t.lunchroomPage?.moreToDiscover?.cards?.[1]?.title || "Photo Booth",
      description:
        t.lunchroomPage?.moreToDiscover?.cards?.[1]?.description ||
        "Capture your visit with our stylish photo booth. Perfect for Instagram moments and memories with friends.",
    },
  ];

  return (
    <section className="py-24 bg-[#F5F1ED]">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            style={{ fontFamily: "var(--font-playfair)" }}
            className="text-[clamp(36px,4vw,48px)] font-bold text-[#0F172A] mb-4"
          >
            {t.lunchroomPage?.moreToDiscover?.title || "More to Discover"}
          </h2>
          <p
            className="text-[#6B5D54] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "Cambria, Georgia, serif" }}
          >
            {t.lunchroomPage?.moreToDiscover?.subtitle ||
              "The lunchroom offers a few extra touches to make your visit memorable."}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-[18px] border border-[#E2E8F0] shadow-md p-10 flex flex-col items-center text-center"
            >
              <div className="w-[72px] h-[72px] rounded-full bg-[#E8DFD5] flex items-center justify-center mb-6">
                {card.icon}
              </div>
              <h3
                style={{ fontFamily: "var(--font-playfair)" }}
                className="text-[#0F172A] text-2xl md:text-3xl font-bold mb-3"
              >
                {card.title}
              </h3>
              <p
                className="text-[#475569] text-base md:text-lg leading-relaxed"
                style={{ fontFamily: "Cambria, Georgia, serif" }}
              >
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* A Space for Connection */}
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text */}
          <div className="w-full lg:w-1/2">
            <h2
              style={{ fontFamily: "var(--font-playfair)" }}
              className="text-[clamp(32px,4vw,48px)] font-bold text-[#0F172A] mb-6"
            >
              {t.lunchroomPage?.moreToDiscover?.connectionTitle ||
                "A Space for Connection"}
            </h2>
            <p
              className="text-[#6B5D54] text-lg md:text-xl leading-relaxed mb-4"
              style={{ fontFamily: "Cambria, Georgia, serif" }}
            >
              {t.lunchroomPage?.moreToDiscover?.connectionBody1 ||
                "Whether you're catching up with friends, enjoying a quiet moment alone, or refueling after a sauna session, the lunchroom welcomes you."}
            </p>
            <p
              className="text-[#6B5D54] text-lg md:text-xl leading-relaxed"
              style={{ fontFamily: "Cambria, Georgia, serif" }}
            >
              {t.lunchroomPage?.moreToDiscover?.connectionBody2 ||
                "Bright, warm, and filled with good vibes."}
            </p>
          </div>

          {/* Image */}
          <div className="w-full lg:w-1/2">
            <div className="relative w-full h-[350px] lg:h-[450px] rounded-[18px] overflow-hidden">
              <Image
                src="/images/lunchroom/hero/lunchroomhero.png"
                alt="A Space for Connection"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
