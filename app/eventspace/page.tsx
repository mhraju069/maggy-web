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
        backgroundImage="/images/eventspace/hero/eventhero.png"
        title={t.eventspacePage?.hero?.title || "Multifunctional Space"}
        subtitle={
          t.eventspacePage?.hero?.subtitle ||
          "A calm setting for life's meaningful moments."
        }
      />

      {/* Intro Section */}
      <section className="py-16 md:py-20 bg-[#FCF2E9]">
        <div className="container mx-auto px-6">
          <div className="max-w-[800px] mx-auto text-center">
            <p
              className="text-[#475569] text-lg md:text-xl leading-relaxed"
              style={{ fontFamily: "Cambria, Georgia, serif" }}
            >
              {t.eventspacePage?.intro?.text ||
                "Our multifunctional space combines flexibility with atmosphere. Whether hosting a seminar, celebrating a wedding, or gathering for a corporate retreat, this space adapts to honor your vision."}
            </p>
          </div>
        </div>
      </section>

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
        title={t.eventspacePage?.cta?.title || "Request Information"}
        subtitle={
          t.eventspacePage?.cta?.subtitle ||
          "Share your vision with us. We'll help create an experience that feels uniquely yours."
        }
        buttonText={t.eventspacePage?.cta?.button || "Get In Touch"}
        buttonLink="/contact"
        backgroundColor="#8B7355"
        textColor="#FFFFFF"
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default EventSpacePage;
