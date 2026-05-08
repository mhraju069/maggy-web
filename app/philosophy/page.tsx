"use client";
import Footer from "@/components/shared/Footer";
import PageHero from "@/components/shared/PageHero";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import ExperiencePhilosophy from "./component/ExperiencePhilosophy";
import OurApproach from "./component/OurApproach";
import QuoteSection from "./component/QuoteSection";
import SustainabilityCare from "./component/SustainabilityCare";
import WhatWeBelieve from "./component/WhatWeBelieve";

const PhilosophyPage = () => {
  const { t } = useLanguage();

  return (
    <div>
      <PageHero
        backgroundImage="/images/philosophy/philosophyimage1.png"
        title={t.philosophyPage.hero.title}
        subtitle={t.philosophyPage.hero.subtitle}
      />

      <WhatWeBelieve />
      <OurApproach />
      <SustainabilityCare />
      <QuoteSection />
      <ExperiencePhilosophy />
      <Footer />
    </div>
  );
};

export default PhilosophyPage;
