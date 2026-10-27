"use client";
import CTASection from "@/components/shared/CTASection";
import Footer from "@/components/shared/Footer";
import PageHero from "@/components/shared/PageHero";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import CorporateSection from "./components/CorporateSection";
import SeminarsSection from "./components/SeminarsSection";
import SpaceSuitable from "./components/SpaceSuitable";
import WeddingsSection from "./components/WeddingsSection";

const EventSpacePage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <PageHero
        backgroundImage="/images/eventspace/hero/EventsHero.jpeg"
        title={t.eventspacePage?.hero?.title || "Multifunctional Space"}
        subtitle={
          t.eventspacePage?.hero?.subtitle ||
          "A calm setting for life's meaningful moments."
        }
      />

      {/* Seminars & Workshops */}
      <SeminarsSection />

      {/* Weddings & Celebrations */}
      <WeddingsSection />

      {/* Corporate & Private Events */}
      <CorporateSection />

      {/* What Makes This Space Suitable */}
      <SpaceSuitable />

      {/* CTA Section */}
      <CTASection
        title={t.eventspacePage?.cta?.title || "Celebrate Your Moment at De 7de Hemel"}
        subtitle={
          t.eventspacePage?.cta?.subtitle ||
          "From weddings and birthdays to corporate parties or special gatherings. Together, we create a setting that perfectly matches your moment."
        }
        buttonText={t.eventspacePage?.cta?.button || "Book Event Space"}
        buttonLink="/booking/eventspace"
        backgroundColor="#8B7355"
        textColor="#FFFFFF"
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default EventSpacePage;
