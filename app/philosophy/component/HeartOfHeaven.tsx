"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LuHeart, LuSparkles, LuUsers } from "react-icons/lu";

const HeartOfHeaven = () => {
  const { t } = useLanguage();
  const heart = t.philosophyPage.heart;

  const icons = [
    <LuHeart key="slow" className="w-8 h-8 text-[#8B7355]" />,
    <LuUsers key="together" className="w-8 h-8 text-[#8B7355]" />,
    <LuSparkles key="celebrate" className="w-8 h-8 text-[#8B7355]" />,
  ];

  return (
    <section className="w-full bg-[#F5F1ED] py-20 lg:py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-14 flex flex-col items-center gap-3 text-center">
          <div className="flex flex-col items-center gap-2 w-full">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold font-serif text-[#0F172A] break-words max-w-full">
              {heart?.title}
            </h2>
            <DecorativeUnderline />
          </div>
          <p className="text-lg font-serif text-[#475569]">
            {heart?.subtitle}
          </p>
        </div>

        {/* Three columns */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:gap-12 max-w-6xl mx-auto">
          {heart?.items?.map((item: any, idx: number) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-6 text-center bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#E8DFD5]">
                {icons[idx % icons.length]}
              </div>
              <h3 className="text-2xl font-bold font-serif text-[#0F172A]">
                {item.title}
              </h3>
              <p className="text-base font-serif text-[#475569] leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeartOfHeaven;
