"use client";
import Footer from "@/components/shared/Footer";
import PageHero from "@/components/shared/PageHero";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import MembershipCards from "./components/MembershipCards";
import MembershipCTA from "./components/MembershipCTA";
import MoreThanAccess from "./components/MoreThanAccess";

const MembershipsPage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        backgroundImage="/images/memberships/hero/membershipshero.png"
        title={t.membershipsPage.hero.title}
        subtitle={t.membershipsPage.hero.subtitle}
      />
      <MembershipCards />
      <MoreThanAccess />
      <MembershipCTA />
      <Footer />
    </div>
  );
};

export default MembershipsPage;
