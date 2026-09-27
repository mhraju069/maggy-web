"use client";
import Footer from "@/components/shared/Footer";
import PageHero from "@/components/shared/PageHero";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import GetInTouchSection from "./components/GetInTouchSection";

const ContactPage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        backgroundImage="/images/contact/hero/contacthero.png"
        title={t.contactPage?.hero?.title || "Contact Us"}
        subtitle={
          t.contactPage?.hero?.subtitle ||
          "We’re happy to answer your questions and help you explore the possibilities."
        }
      />
      <GetInTouchSection />
      <Footer />
    </div>
  );
};

export default ContactPage;

