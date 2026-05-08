"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { BiCoffeeTogo } from "react-icons/bi";
import { LuCalendarCheck } from "react-icons/lu";
import { TbSparkles } from "react-icons/tb";

export default function SpaceSuitable() {
  const { t } = useLanguage();

  const features = [
    {
      icon: <TbSparkles className="w-7 h-7 text-[#8B7355]" strokeWidth={1.5} />,
      title:
        t.eventspacePage?.spaceSuitable?.features?.[0]?.title ||
        "Flexible Layout",
      description:
        t.eventspacePage?.spaceSuitable?.features?.[0]?.description ||
        "Adaptable configurations to suit any event type, from intimate gatherings to large celebrations.",
    },
    {
      icon: <BiCoffeeTogo className="w-7 h-7 text-[#8B7355]" />,
      title:
        t.eventspacePage?.spaceSuitable?.features?.[1]?.title ||
        "Calm Surroundings",
      description:
        t.eventspacePage?.spaceSuitable?.features?.[1]?.description ||
        "Natural materials, thoughtful acoustics, and our signature wellness atmosphere.",
    },
    {
      icon: (
        <LuCalendarCheck className="w-7 h-7 text-[#8B7355]" strokeWidth={1.5} />
      ),
      title:
        t.eventspacePage?.spaceSuitable?.features?.[2]?.title ||
        "Wellness Connection",
      description:
        t.eventspacePage?.spaceSuitable?.features?.[2]?.description ||
        "Integrate sauna sessions, yoga, or spa services to create a truly holistic event.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white min-h-screen flex items-center">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            style={{ fontFamily: "var(--font-playfair)" }}
            className="text-[clamp(32px,4vw,48px)] font-bold text-[#0F172A] mb-2"
          >
            {t.eventspacePage?.spaceSuitable?.title ||
              "What Makes This Space Suitable"}
          </h2>
          <div className="flex justify-center">
            <DecorativeUnderline />
          </div>
          <p
            className="text-[#6B5D54] text-lg mt-4"
            style={{ fontFamily: "Cambria, Georgia, serif" }}
          >
            {t.eventspacePage?.spaceSuitable?.subtitle ||
              "Four simple steps to your moment of tranquility"}
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#E8DFD5] flex items-center justify-center mb-5">
                {feature.icon}
              </div>
              <h3
                style={{ fontFamily: "var(--font-playfair)" }}
                className="text-[#0F172A] text-xl font-bold mb-3"
              >
                {feature.title}
              </h3>
              <p
                className="text-[#6B5D54] text-base leading-relaxed"
                style={{ fontFamily: "Cambria, Georgia, serif" }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
