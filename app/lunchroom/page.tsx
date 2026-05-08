"use client";
import CTASection from "@/components/shared/CTASection";
import Footer from "@/components/shared/Footer";
import PageHero from "@/components/shared/PageHero";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { BiCoffeeTogo } from "react-icons/bi";
import { GiTomato } from "react-icons/gi";
import { IoNutritionOutline, IoRestaurantOutline } from "react-icons/io5";
import { LuCakeSlice } from "react-icons/lu";
import { PiArmchair } from "react-icons/pi";
import BeveragesSection from "./components/BeveragesSection";
import IceCreamSection from "./components/IceCreamSection";
import MenuSection from "./components/MenuSection";
import MoreToDiscover from "./components/MoreToDiscover";

const LunchroomPage = () => {
  const { t } = useLanguage();

  const lunchroomFeatures = [
    {
      icon: <GiTomato className="w-7 h-7 text-[#8B7355]" strokeWidth={1} />,
      text:
        t.lunchroomPage?.whatsIncluded?.features?.[0] ||
        "Seasonal, locally-sourced ingredients",
    },
    {
      icon: (
        <IoRestaurantOutline
          className="w-6 h-6 text-[#8B7355]"
          strokeWidth={1.5}
        />
      ),
      text:
        t.lunchroomPage?.whatsIncluded?.features?.[1] ||
        "Freshly prepared daily specials",
    },
    {
      icon: (
        <IoNutritionOutline
          className="w-6 h-6 text-[#8B7355]"
          strokeWidth={1.5}
        />
      ),
      text:
        t.lunchroomPage?.whatsIncluded?.features?.[2] ||
        "Healthy & indulgent options",
    },
    {
      icon: (
        <BiCoffeeTogo className="w-6 h-6 text-[#8B7355]" strokeWidth={0.5} />
      ),
      text:
        t.lunchroomPage?.whatsIncluded?.features?.[3] ||
        "Artisanal coffee & fresh juices",
    },
    {
      icon: (
        <LuCakeSlice className="w-6 h-6 text-[#8B7355]" strokeWidth={1.5} />
      ),
      text:
        t.lunchroomPage?.whatsIncluded?.features?.[4] ||
        "Homemade sweets & pastries",
    },
    {
      icon: <PiArmchair className="w-7 h-7 text-[#8B7355]" strokeWidth={1} />,
      text:
        t.lunchroomPage?.whatsIncluded?.features?.[5] ||
        "Cozy, Instagram-worthy interior",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <PageHero
        backgroundImage="/images/lunchroom/hero/lunchroomhero.png"
        title={t.lunchroomPage?.hero?.title || "Lunchroom"}
        subtitle={
          t.lunchroomPage?.hero?.subtitle || "Relax, nourish, recharge."
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
              {t.lunchroomPage?.intro?.text ||
                "Our lunchroom is more than a place to eat—it's a bright, welcoming space where good food meets good energy. Enjoy fresh, wholesome meals, sweet treats, and Instagram-worthy moments."}
            </p>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <MenuSection />

      {/* Beverages Section */}
      <BeveragesSection />

      {/* Ice Cream Section */}
      <IceCreamSection />

      {/* More to Discover Section */}
      <MoreToDiscover />

      {/* What We Offer Section */}
      {/* <WhatsIncluded
        title={t.lunchroomPage?.whatsIncluded?.title || "What We Offer"}
        subtitle={
          t.lunchroomPage?.whatsIncluded?.subtitle ||
          "Fresh ingredients, thoughtful recipes, and a warm atmosphere"
        }
        features={lunchroomFeatures}
        backgroundColor="#FFFFFF"
      /> */}

      {/* CTA Section */}
      <CTASection
        title={t.lunchroomPage?.cta?.title || "Visit the Lunchroom"}
        subtitle={
          t.lunchroomPage?.cta?.subtitle ||
          "Drop by during your next visit\u2014no reservation needed."
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

export default LunchroomPage;
