"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

const WhatWeBelieve = () => {
  const { t } = useLanguage();
  const whatWeBelieve = t.philosophyPage.whatWeBelieve;

  return (
    <section className="w-full bg-white py-16 lg:py-24">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <h2 className="text-3xl lg:text-5xl font-bold font-serif text-[#0F172A] mb-8">
          {whatWeBelieve.title}
        </h2>
        <p className="text-lg lg:text-xl font-serif text-[#475569] leading-relaxed">
          {whatWeBelieve.body}
        </p>
      </div>
    </section>
  );
};

export default WhatWeBelieve;
