"use client";
import CTASection from "@/components/shared/CTASection";
import Footer from "@/components/shared/Footer";
import PageHero from "@/components/shared/PageHero";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import ArrangementsGrid from "./components/ArrangementsGrid";
import CreateYourOwn from "./components/CreateYourOwn";
import FAQSection from "./components/FAQSection";

const ArrangementsPage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        backgroundImage="/images/arrangements/hero/arrangementshero.png"
        title={t.arrangementsPage?.hero?.title || "Curated Experiences"}
        subtitle={
          t.arrangementsPage?.hero?.subtitle ||
          "Thoughtfully designed journeys for deep transformation."
        }
      />

      <section className="py-16 md:py-20 bg-[#FCF2E9]">
        <div className="container mx-auto px-6">
          <div className="max-w-200 mx-auto text-center">
            <p
              className="text-[#475569] text-lg md:text-xl leading-relaxed"
              style={{ fontFamily: "Cambria, Georgia, serif" }}
            >
              {t.arrangementsPage?.intro?.text ||
                "Each arrangement is a carefully curated experience that combines our signature offerings into transformative wellness journeys designed for your unique needs."}
            </p>
          </div>
        </div>
      </section>

      <ArrangementsGrid />
      <CreateYourOwn />
      <FAQSection />

      <CTASection
        title={t.arrangementsPage?.cta?.title || "Begin Your Journey"}
        subtitle={
          t.arrangementsPage?.cta?.subtitle ||
          "Reserve your curated wellness experience today."
        }
        buttonText={t.arrangementsPage?.cta?.button || "Book Arrangement"}
        buttonLink="/contact"
        backgroundColor="#8B7355"
        textColor="#FFFFFF"
      />

      <Footer />
    </div>
  );
};

export default ArrangementsPage;
