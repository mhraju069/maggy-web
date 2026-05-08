"use client";
import CTASection from "@/components/shared/CTASection";
import Footer from "@/components/shared/Footer";
import PageHero from "@/components/shared/PageHero";
import WhatsIncluded from "@/components/shared/WhatsIncluded";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { FaFireFlameCurved } from "react-icons/fa6";
import { FiThermometer } from "react-icons/fi";
import { GiTowel } from "react-icons/gi";
import { MdSpa } from "react-icons/md";
import { PiDropSimple } from "react-icons/pi";
import { WiStars } from "react-icons/wi";
import SaunaOfferings from "./components/SaunaOfferings";

const WellnessPage = () => {
  const { t } = useLanguage();

  const wellnessFeatures = [
    {
      icon: (
        <FiThermometer className="w-6 h-6 text-[#8B7355]" strokeWidth={1.5} />
      ),
      text:
        t.wellnessPage?.whatsIncluded?.features?.[0] ||
        "Temperature-controlled environments",
    },
    {
      icon: <GiTowel className="w-6 h-6 text-[#8B7355]" strokeWidth={1} />,
      text:
        t.wellnessPage?.whatsIncluded?.features?.[1] ||
        "Luxurious robes & towels",
    },
    {
      icon: <FaFireFlameCurved className="w-6 h-6 text-[#8B7355]" />,
      text:
        t.wellnessPage?.whatsIncluded?.features?.[2] ||
        "Traditional heat therapy rituals",
    },
    {
      icon: <PiDropSimple className="w-6 h-6 text-[#8B7355]" />,
      text:
        t.wellnessPage?.whatsIncluded?.features?.[3] ||
        "Premium aromatherapy essences",
    },
    {
      icon: <MdSpa className="w-6 h-6 text-[#8B7355]" />,
      text:
        t.wellnessPage?.whatsIncluded?.features?.[4] ||
        "Private or shared experiences",
    },
    {
      icon: <WiStars className="w-7 h-7 text-[#8B7355]" />,
      text:
        t.wellnessPage?.whatsIncluded?.features?.[5] ||
        "Flexible session durations",
    },
  ];

  return (
    <div>
      <PageHero
        backgroundImage="/images/wellness/hero/wellnesshero.png"
        title={t.wellnessPage.hero.title}
        subtitle={t.wellnessPage.hero.subtitle}
      />

      {/* Intro Section */}
      <section className="w-full bg-[#FCF2E9] py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-[800px] mx-auto text-center">
            <p
              style={{
                fontSize: "clamp(18px, 2.5vw, 24px)",
                fontFamily: "Cambria, Georgia, serif",
                fontWeight: 400,
                lineHeight: "150%",
                color: "#475569",
              }}
            >
              {t.wellnessPage.intro.text}
            </p>
          </div>
        </div>
      </section>

      {/* Sauna Offerings Section */}
      <SaunaOfferings />

      {/* What's Included Section */}
      <WhatsIncluded
        title={t.wellnessPage?.whatsIncluded?.title || "What's Included"}
        subtitle={
          t.wellnessPage?.whatsIncluded?.subtitle ||
          "Here are some features included"
        }
        features={wellnessFeatures}
        backgroundColor="#FCF2E9"
      />

      {/* CTA Section */}
      <CTASection
        title={t.wellnessPage?.cta?.title || "Experience Our Philosophy"}
        subtitle={
          t.wellnessPage?.cta?.subtitle ||
          "Book your sauna experience and begin your wellness journey today."
        }
        buttonText={t.wellnessPage?.cta?.button || "Book Sauna"}
        buttonLink="/booking"
        backgroundColor="#8B7355"
      />

      <Footer />
    </div>
  );
};

export default WellnessPage;
