"use client";
import Footer from "@/components/shared/Footer";
import PageHero from "@/components/shared/PageHero";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import PrivateSessions from "./components/PrivateSessions";
import WeeklySchedule from "./components/WeeklySchedule";
import WhatWeOffer from "./components/WhatWeOffer";

const ActivitiesPage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        backgroundImage="/images/activities/hero/activitieshero.png"
        title={t.activitiesPage.hero.title}
        subtitle={t.activitiesPage.hero.subtitle}
      />

      {/* Intro Section */}
      <section
        className="flex items-center justify-center"
        style={{ background: "#FCF2E9", padding: "96px 128px" }}
      >
        <p
          style={{
            fontFamily: "Cambria, Georgia, serif",
            fontSize: 24,
            lineHeight: 1.6,
            color: "#475569",
            textAlign: "center",
            maxWidth: 860,
          }}
        >
          {t.activitiesPage.intro.text}
        </p>
      </section>

      <WeeklySchedule />

      <WhatWeOffer />

      <PrivateSessions />

      <Footer />
    </div>
  );
};

export default ActivitiesPage;
