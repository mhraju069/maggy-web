"use client";

import CTASection from "@/components/shared/CTASection";
import Footer from "@/components/shared/Footer";
import PageHero from "@/components/shared/PageHero";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import ActivitiesOfferings from "./components/ActivitiesOfferings";
import PrivateSessions from "./components/PrivateSessions";

const ActivitiesPage = () => {
  const { t } = useLanguage();
  const act = t.activitiesPage;

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        backgroundImage="/images/activities/hero/activitieshero.png"
        title={act?.hero?.title || "Activities"}
        subtitle={act?.hero?.subtitle || "Join our monthly or weekly activities"}
      />

      {/* Activities Offerings Section (API dynamic) */}
      <ActivitiesOfferings />

      {/* Become a Partner Section */}
      <PrivateSessions />

      {/* Contact Us CTA Section */}
      {/*<CTASection
        title={act?.contactCTA?.title || "Contact Us"}
        subtitle={
          act?.contactCTA?.description ||
          "We’re happy to answer your questions and help you explore the possibilities."
        }
        buttonText={t.navbar?.contact || "Contact Us"}
        buttonLink="/contact"
        backgroundColor="#8B7355"
        textColor="#FFFFFF"
      />*/}

      <Footer />
    </div>
  );
};

export default ActivitiesPage;
