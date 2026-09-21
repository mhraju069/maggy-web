"use client";

import CTASection from "@/components/shared/CTASection";
import Footer from "@/components/shared/Footer";
import PageHero from "@/components/shared/PageHero";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import HeartOfHeaven from "./component/HeartOfHeaven";
import QuoteSection from "./component/QuoteSection";
import WhatWeBelieve from "./component/WhatWeBelieve";

const PhilosophyPage = () => {
  const { t } = useLanguage();
  const p = t.philosophyPage;

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        backgroundImage="/images/philosophy/philosophyimage1.png"
        title={p.hero.title}
        subtitle={p.hero.subtitle}
      />

      {/* About Us Intro Section */}
      <section className="w-full bg-[#FCF2E9] py-16 lg:py-24">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl lg:text-5xl font-bold font-serif text-[#0F172A] mb-8">
            {p.aboutUs?.title || "About us"}
          </h2>
          <p className="text-lg lg:text-xl font-serif text-[#475569] leading-relaxed">
            {p.aboutUs?.text}
          </p>
        </div>
      </section>

      {/* What We Believe */}
      <WhatWeBelieve />

      {/* Three Values: The Heart of Heaven on Earth */}
      <HeartOfHeaven />

      {/* The Heaven on Earth Experience */}
      <section className="w-full bg-[#FCF2E9] py-16 lg:py-24">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <span className="text-sm font-semibold tracking-widest text-[#8B7355] uppercase mb-2 block">
            {p.experience?.subtitle}
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold font-serif text-[#0F172A] mb-8">
            {p.experience?.title}
          </h2>
          <p className="text-lg lg:text-xl font-serif text-[#475569] leading-relaxed">
            {p.experience?.body}
          </p>
        </div>
      </section>

      {/* Quote Section */}
      <QuoteSection />

      {/* Experience CTA */}
      <CTASection
        title={p.experienceCTA?.title || "Experience Heaven on Earth"}
        subtitle={
          p.experienceCTA?.subtitle ||
          "Discover a place created for good food, meaningful connection, relaxation and unforgettable moments."
        }
        buttonText={p.experienceCTA?.button || "Explore Heaven on Earth"}
        buttonLink="/booking"
        backgroundColor="#8B7355"
        textColor="#FFFFFF"
      />

      <Footer />
    </div>
  );
};

export default PhilosophyPage;
