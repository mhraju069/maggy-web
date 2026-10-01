"use client";

import Footer from "@/components/shared/Footer";
import PageHero from "@/components/shared/PageHero";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import CreateYourOwn from "./components/CreateYourOwn";

const ArrangementsPage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        backgroundImage="/images/arrangements/hero/arrangementshero.png"
        title={t.arrangementsPage?.hero?.title || "Salt Room"}
        subtitle={
          t.arrangementsPage?.hero?.subtitle ||
          "Experience pure aerosol halotherapy for respiratory wellness, skin revitalization, and deep relaxation."
        }
      />

      {/* Intro Section */}
      {/* <section className="py-16 md:py-20 bg-[#FCF2E9]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p
              className="text-[#475569] text-xl md:text-2xl font-serif leading-relaxed"
            >
              {t.arrangementsPage?.intro?.text}
            </p>
          </div>
        </div>
      </section> */}

      {/* Create Your Own Section */}
      <CreateYourOwn />

      <Footer />
    </div>
  );
};

export default ArrangementsPage;
