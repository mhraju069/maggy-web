"use client";

import ArrangementCard from "@/components/shared/ArrangementCard";
import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import Footer from "@/components/shared/Footer";
import PageHero from "@/components/shared/PageHero";
import { formatImageUrl } from "@/lib/api/config";
import { servicesService, ServicePackage } from "@/lib/api/services/servicesService";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiCoffee, BiHeart, BiTimeFive } from "react-icons/bi";
import { HiSparkles } from "react-icons/hi2";
import { FaCalendarAlt, FaGift, FaGlassCheers, FaHotTub, FaSpa, FaUsers } from "react-icons/fa";
import CreateYourOwn from "./components/CreateYourOwn";

interface PackageDisplayItem {
  id: number;
  image: string;
  rating: number;
  title: string;
  combo: string;
  subServicesList: string[];
  description: string;
  includes: string[];
  paymentType: "full" | "partial" | "spot";
  price: string;
  rawPriceNum: number;
}

export default function ArrangementsPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [packages, setPackages] = useState<PackageDisplayItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Default curated arrangements / bundle deals (fallback when backend returns empty)
  const defaultArrangements: PackageDisplayItem[] = [
    {
      id: 1,
      title: "Sauna & Lunchroom Experience",
      combo: "Private Sauna (3 Hours) • 2-Course Culinary Lunch",
      description:
        "Combine absolute relaxation in our luxury private sauna sanctuary with a fresh, organic 2-course lunch in our serene lunchroom.",
      image: "/images/arrangements/cardimages/img1.png",
      rating: 4.9,
      includes: [
        "3 hours exclusive Private Sauna access (jacuzzi, steam room & cold plunge)",
        "2-course seasonal lunch per person in De Lunchroom",
        "Complimentary bathrobes, towels & organic herbal teas",
        "10% combined bundle savings",
      ],
      paymentType: "full",
      price: "€165",
      rawPriceNum: 165,
      subServicesList: ["sauna", "lunchroom"],
    },
    {
      id: 2,
      title: "Wellness & High Tea Ritual",
      combo: "Salt Room Halotherapy • High Tea in Restaurant • Relaxation",
      description:
        "Breathe deeply in our aerosol Salt Room micro-climate followed by an indulgent luxury high tea with sweet and savory artisanal bites.",
      image: "/images/arrangements/cardimages/img2.png",
      rating: 5.0,
      includes: [
        "1-hour therapeutic Salt Room session",
        "Artisanal luxury High Tea with sweet & savory delights",
        "Selection of premium loose-leaf organic teas",
        "Reserved scenic lounge table",
      ],
      paymentType: "full",
      price: "€85",
      rawPriceNum: 85,
      subServicesList: ["saltroom", "lunchroom"],
    },
    {
      id: 3,
      title: "The Ultimate Renewal Day",
      combo: "Private Sauna • Salt Room • Lunchroom Dining • Wellness Refresh",
      description:
        "Our most comprehensive full-day package. Transition seamlessly between deep heat therapy, restorative halotherapy, and mindful dining.",
      image: "/images/arrangements/cardimages/img3.png",
      rating: 4.95,
      includes: [
        "3 hours Private Sauna with private jacuzzi and relaxation terrace",
        "1 hour Salt Room aerosol halotherapy",
        "Full organic lunchroom dining credit (€30 per person)",
        "Luxury wellness gift bag to take home",
      ],
      paymentType: "full",
      price: "€240",
      rawPriceNum: 240,
      subServicesList: ["sauna", "saltroom", "lunchroom"],
    },
    {
      id: 4,
      title: "Workshop & Spa Retreat",
      combo: "Event Space Workshop • Mindful Yoga / Breathwork • Sauna Access",
      description:
        "Perfect for private groups, team offsites, or intimate celebrations. Blend an inspiring session with rejuvenating wellness recovery.",
      image: "/images/eventspace/hero/eventhero.png",
      rating: 4.9,
      includes: [
        "2 hours private use of our Event Space / Atelier",
        "Guided breathwork or gentle movement session",
        "Shared Sauna & relaxation recovery pass",
        "Fresh smoothie and healthy snack bar included",
      ],
      paymentType: "partial",
      price: "€95",
      rawPriceNum: 95,
      subServicesList: ["eventspace", "activity", "sauna"],
    },
  ];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    servicesService
      .getPackages()
      .then((apiData) => {
        if (!isMounted) return;

        if (apiData && Array.isArray(apiData) && apiData.length > 0) {
          const mapped: PackageDisplayItem[] = apiData.map(
            (item: ServicePackage, idx: number) => {
              const priceVal =
                typeof item.price === "number"
                  ? item.price
                  : parseFloat(String(item.price || 0)) || 0;

              let subServicesList: string[] = [];
              if (Array.isArray(item.packages)) {
                subServicesList = item.packages;
              } else if (typeof item.packages === "string") {
                try {
                  const parsed = JSON.parse(item.packages);
                  if (Array.isArray(parsed)) subServicesList = parsed;
                  else subServicesList = [item.packages];
                } catch {
                  subServicesList = item.packages.split(",").map((s) => s.trim());
                }
              }

              const formattedCombo =
                subServicesList.length > 0
                  ? subServicesList
                      .map((s) =>
                        s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
                      )
                      .join(" • ")
                  : "Curated Bundle Deal";

              return {
                id: item.id,
                image: formatImageUrl(
                  item.image,
                  `/images/arrangements/cardimages/img${(idx % 3) + 1}.png`
                ),
                rating: 4.9,
                title: item.title || "Wellness Arrangement",
                combo: formattedCombo,
                subServicesList,
                description: item.description || "",
                includes:
                  item.features?.map((f) =>
                    f.feature.replace(/^[✓✔\s]+/, "")
                  ) || [],
                paymentType: "full" as const,
                price: `€${priceVal.toFixed(0)}`,
                rawPriceNum: priceVal,
              };
            }
          );
          setPackages(mapped);
        } else {
          setPackages(defaultArrangements);
        }
      })
      .catch((err) => {
        console.warn("Using fallback arrangements data:", err);
        if (isMounted) setPackages(defaultArrangements);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Page Hero ── */}
      <PageHero
        backgroundImage="/images/arrangements/hero/arrangementshero.png"
        title={t.arrangementsPage?.hero?.title || "Arrangementen & Packages"}
        subtitle={
          t.arrangementsPage?.hero?.subtitle ||
          "Combine our sauna, salt room, mindful lunchroom, and events into complete bundled wellness experiences."
        }
      />

      {/* ── Philosophy & Why Book Arrangements ── */}
      <section className="py-16 md:py-20 bg-[#FCF2E9]">
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8B7355] block mb-2">
            {t.arrangementsPage?.philosophy?.badge || "Curated Bundles & Combined Experiences"}
          </span>
          <h2
            className="text-3xl md:text-5xl font-bold text-[#0F172A] mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {t.arrangementsPage?.philosophy?.title || "Multiple Services, Seamlessly Combined"}
          </h2>
          <div className="flex justify-center mb-6">
            <DecorativeUnderline />
          </div>
          <p className="text-[#475569] text-base md:text-lg max-w-3xl mx-auto font-serif leading-relaxed">
            {t.arrangementsPage?.philosophy?.description ||
              "Instead of booking single isolated visits, our Arrangements bring together the best of Heaven on Earth. Enjoy a private sauna session followed by a leisurely culinary lunch, or a therapeutic salt room reset paired with an afternoon high tea — with exclusive bundle pricing and zero hassle."}
          </p>

          {/* Quick Perks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 text-left">
            <div className="bg-white p-6 rounded-2xl border border-[#E8E2DC] shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FCF2E9] text-[#8B7355] flex items-center justify-center shrink-0">
                <HiSparkles size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[#0F172A] font-serif text-lg mb-1">
                  {t.arrangementsPage?.philosophy?.perks?.savings?.title || "Exclusive Bundle Savings"}
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {t.arrangementsPage?.philosophy?.perks?.savings?.description ||
                    "Enjoy combined package rates and special culinary discounts when pairing multiple services."}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8E2DC] shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FCF2E9] text-[#8B7355] flex items-center justify-center shrink-0">
                <BiTimeFive size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[#0F172A] font-serif text-lg mb-1">
                  {t.arrangementsPage?.philosophy?.perks?.timing?.title || "Coordinated Timing"}
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {t.arrangementsPage?.philosophy?.perks?.timing?.description ||
                    "We schedule your sessions smoothly back-to-back so you never feel rushed between experiences."}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8E2DC] shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FCF2E9] text-[#8B7355] flex items-center justify-center shrink-0">
                <FaGift size={22} />
              </div>
              <div>
                <h3 className="font-bold text-[#0F172A] font-serif text-lg mb-1">
                  {t.arrangementsPage?.philosophy?.perks?.inclusive?.title || "All-Inclusive Comfort"}
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {t.arrangementsPage?.philosophy?.perks?.inclusive?.description ||
                    "Linens, bathrobes, organic teas, and dedicated guest hosting are thoughtfully included."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Arrangements Grid Section ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-14">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#8B7355] block mb-1">
                {t.arrangementsPage?.featured?.badge || "Explore Packages"}
              </span>
              <h2
                className="text-3xl md:text-4xl font-bold text-[#0F172A]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {t.arrangementsPage?.featured?.title || "Featured Arrangements"}
              </h2>
              <p className="text-sm text-[#64748B] mt-1">
                {t.arrangementsPage?.featured?.subtitle ||
                  "Select a package below to book online, or design a custom arrangement with our team."}
              </p>
            </div>

            <Link
              href="/booking/packages"
              className="px-8 py-4 rounded-xl bg-[#8B7355] hover:bg-[#725e45] text-white font-bold text-sm uppercase tracking-wider transition-all shadow-md shrink-0"
            >
              {t.arrangementsPage?.featured?.bookButton || "Book an Arrangement"}
            </Link>
          </div>

          {loading ? (
            <div className="py-16 text-center text-[#8B7355] font-serif">
              {t.arrangementsPage?.featured?.loading || "Loading available packages..."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <div key={pkg.id} className="flex flex-col">
                  <ArrangementCard
                    id={pkg.id}
                    image={pkg.image}
                    rating={pkg.rating}
                    title={pkg.title}
                    combo={pkg.combo}
                    description={pkg.description}
                    includes={pkg.includes}
                    paymentType={pkg.paymentType}
                    price={pkg.price}
                    onClick={() => router.push(`/booking/packages`)}
                  />
                  <div className="mt-3">
                    <Link
                      href="/booking/packages"
                      className="w-full py-3 rounded-xl bg-[#8B7355] hover:bg-[#725e45] text-white text-center font-bold text-xs uppercase tracking-wider transition-all block shadow-xs"
                    >
                      {t.arrangementsPage?.featured?.reserveButton || "Reserve This Bundle"} &rsaquo;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Occasions Section (Birthdays, Babyshowers, Celebrations) ── */}
      <section className="py-20 bg-[#FBF6F3] border-t border-[#E8E2DC]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8B7355] block mb-2">
              {t.arrangementsPage?.occasions?.badge || "Celebrate in Style"}
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-3"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {t.arrangementsPage?.occasions?.title || "Special Occasions & Group Celebrations"}
            </h2>
            <p className="text-[#64748B] text-base font-serif">
              {t.arrangementsPage?.occasions?.subtitle ||
                "Whether you are marking a birthday milestone, hosting a sweet baby shower, or gathering friends for a memorable celebration, we create an unforgettable custom package."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E8E2DC] shadow-xs text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#FCF2E9] text-[#8B7355] flex items-center justify-center mx-auto mb-4">
                <FaGlassCheers size={22} />
              </div>
              <h3 className="font-bold text-[#0F172A] text-lg font-serif mb-2">
                {t.arrangementsPage?.occasions?.birthdays?.title || "Birthdays & Milestones"}
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                {t.arrangementsPage?.occasions?.birthdays?.description ||
                  "Celebrate with friends in private wellness, sparkling wine, and tailored delicacies."}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8E2DC] shadow-xs text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#FCF2E9] text-[#8B7355] flex items-center justify-center mx-auto mb-4">
                <BiHeart size={24} />
              </div>
              <h3 className="font-bold text-[#0F172A] text-lg font-serif mb-2">
                {t.arrangementsPage?.occasions?.babyshowers?.title || "Babyshowers & Reveals"}
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                {t.arrangementsPage?.occasions?.babyshowers?.description ||
                  "An intimate, heartwarming setting for mom-to-be with artisanal high tea and gentle treats."}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8E2DC] shadow-xs text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#FCF2E9] text-[#8B7355] flex items-center justify-center mx-auto mb-4">
                <FaUsers size={22} />
              </div>
              <h3 className="font-bold text-[#0F172A] text-lg font-serif mb-2">
                {t.arrangementsPage?.occasions?.bachelorettes?.title || "Bachelorette Parties"}
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                {t.arrangementsPage?.occasions?.bachelorettes?.description ||
                  "Relaxing wellness sanctuary, laughter, refreshing drinks, and memorable photo moments."}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8E2DC] shadow-xs text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#FCF2E9] text-[#8B7355] flex items-center justify-center mx-auto mb-4">
                <FaCalendarAlt size={22} />
              </div>
              <h3 className="font-bold text-[#0F172A] text-lg font-serif mb-2">
                {t.arrangementsPage?.occasions?.corporate?.title || "Corporate & Team Days"}
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                {t.arrangementsPage?.occasions?.corporate?.description ||
                  "Team connection with inspiring meeting spaces, workshop activities, and revitalizing sauna."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Create Your Own Bespoke Section ── */}
      <CreateYourOwn />

      <Footer />
    </div>
  );
}
