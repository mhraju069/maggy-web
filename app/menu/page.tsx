"use client";

import CTASection from "@/components/shared/CTASection";
import Footer from "@/components/shared/Footer";
import PageHero from "@/components/shared/PageHero";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import BeveragesSection from "../lunchroom/components/BeveragesSection";
import IceCreamSection from "../lunchroom/components/IceCreamSection";
import MenuSection from "../lunchroom/components/MenuSection";

const MenuPage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <PageHero
        backgroundImage="/images/lunchroom/hero/lunchroomhero.png"
        title={t.navbar.menu || "Menu"}
        subtitle={t.lunchroomPage?.hero?.subtitle || "Fresh, wholesome & delicious."}
      />

      {/* Menu Section */}
      <MenuSection />

      {/* Beverages Section */}
      <BeveragesSection />

      {/* Ice Cream Section */}
      <IceCreamSection />

      {/* CTA Section */}
      <CTASection
        title={t.lunchroomPage?.cta?.title || "Visit the Lunchroom"}
        subtitle={
          t.lunchroomPage?.cta?.subtitle ||
          "Drop by during your next visit—no reservation needed."
        }
        buttonText={t.lunchroomPage?.cta?.button || "Get in Touch"}
        buttonLink="/contact"
        backgroundColor="#8B7355"
        textColor="#FFFFFF"
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MenuPage;
