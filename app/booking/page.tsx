"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { formatImageUrl } from "@/lib/api/config";
import { servicesService } from "@/lib/api/services/servicesService";
import { updateStoredBookingData } from "@/lib/bookingStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaSpa } from "react-icons/fa";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  MdOutlineAutoAwesome,
  MdOutlineCardGiftcard,
  MdOutlineEventNote,
  MdOutlineHotTub,
  MdOutlineRestaurantMenu,
  MdOutlineSelfImprovement,
} from "react-icons/md";

interface CategoryCard {
  id: string | number;
  type: string;
  title: string;
  slogan: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  href: string;
}

const getCategoryHref = (type: string): string => {
  const t = (type || "").toLowerCase().trim();
  if (t === "sauna") return "/booking/sauna";
  if (t === "saltroom" || t === "salt_room" || t === "arrangements") return "/booking/arrangements";
  if (t === "activity" || t === "activities") return "/booking/activities";
  if (t === "lunchroom") return "/booking/lunchroom";
  if (t === "event" || t === "events" || t === "eventspace") return "/booking/eventspace";
  if (t === "package" || t === "packages") return "/booking/packages";
  return "/booking";
};

const getCategoryIcon = (type: string): React.ReactNode => {
  const t = (type || "").toLowerCase().trim();
  if (t === "sauna") return <MdOutlineHotTub className="w-5 h-5 sm:w-6 sm:h-6" />;
  if (t === "saltroom" || t === "salt_room" || t === "arrangements") return <MdOutlineAutoAwesome className="w-5 h-5 sm:w-6 sm:h-6" />;
  if (t === "activity" || t === "activities") return <MdOutlineSelfImprovement className="w-5 h-5 sm:w-6 sm:h-6" />;
  if (t === "lunchroom") return <MdOutlineRestaurantMenu className="w-5 h-5 sm:w-6 sm:h-6" />;
  if (t === "event" || t === "events" || t === "eventspace") return <MdOutlineEventNote className="w-5 h-5 sm:w-6 sm:h-6" />;
  if (t === "package" || t === "packages") return <MdOutlineCardGiftcard className="w-5 h-5 sm:w-6 sm:h-6" />;
  return <MdOutlineHotTub className="w-5 h-5 sm:w-6 sm:h-6" />;
};

const defaultFallbacks: Record<string, string> = {
  sauna: "/images/booking/sauna.png",
  saltroom: "/images/booking/arrangement.png",
  activity: "/images/booking/activity.png",
  lunchroom: "/images/booking/lunchroom.png",
  event: "/images/eventspace/hero/eventhero.png",
  package: "/images/arrangements/hero/arrangementshero.png",
};

export default function BookingPage() {
  const { language, t } = useLanguage();
  const flow = (t as any)?.bookingFlow;
  const btnTrans = flow?.buttons;

  const [categories, setCategories] = useState<CategoryCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    servicesService
      .getAllServices()
      .then((apiData) => {
        if (apiData && Array.isArray(apiData) && apiData.length > 0) {
          const mapped: CategoryCard[] = apiData.map((item: any) => {
            const rawType = (item.type || "").toLowerCase().trim();
            const fallbackImg = defaultFallbacks[rawType] || "/images/booking/sauna.png";

            const localizedTitle =
              language === "nl"
                ? item.title_nl || item.title
                : language === "de"
                  ? item.title_de || item.title
                  : item.title_en || item.title;

            const localizedSubtitle =
              language === "nl"
                ? item.subtitle_nl || item.subtitle || item.slogan || ""
                : language === "de"
                  ? item.subtitle_de || item.subtitle || item.slogan || ""
                  : item.subtitle_en || item.subtitle || item.slogan || "";

            const localizedDesc =
              language === "nl"
                ? item.description_nl || item.description || ""
                : language === "de"
                  ? item.description_de || item.description || ""
                  : item.description_en || item.description || "";

            return {
              id: item.id || item.type,
              type: rawType,
              title: localizedTitle || "Service Experience",
              slogan: localizedSubtitle,
              description: localizedDesc,
              image: formatImageUrl(item.image, fallbackImg),
              icon: getCategoryIcon(rawType),
              href: getCategoryHref(rawType),
            };
          });
          setCategories(mapped);
        } else {
          setCategories([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching all services:", err);
        setCategories([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [language]);

  const handleCategoryClick = (cat: CategoryCard, e: React.MouseEvent) => {
    if (cat.type === "lunchroom") {
      e.preventDefault();
      updateStoredBookingData({
        serviceName: "Lunchroom Table Reservation",
        serviceType: "lunchroom",
        price: "€0",
        durationHours: undefined,
        activityDetails: undefined,
        isSharedSauna: false,
        isSaltRoom: false,
        selectedExtras: [],
      });
      window.location.href = "/booking/information";
    }
  };

  return (
    <div className="w-full px-3 sm:px-6 md:px-12">
      {/* ── Title Section ── */}
      <div className="text-center mb-8 sm:mb-16 flex flex-col items-center">
        <h1 className="font-displayPlayFair text-3xl sm:text-4xl md:text-5xl text-[#1d1a17] mb-2 px-2">
          {flow?.stepper?.selectExperience || "Choose Your Experience"}
        </h1>
        <DecorativeUnderline />
        <p className="font-cambria text-sm text-[#475569] mt-4 sm:mt-6 italic px-4">
          {flow?.stepper?.selectExperienceSubtitle || "A carefully curated moment, designed around you."}
        </p>
      </div>

      {/* ── Loading State ── */}
      {loading && (
        <div className="w-full py-16 sm:py-24 text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-[#8B7355] border-t-transparent mb-4"></div>
          <p className="text-[#64748B] font-cambria italic">{flow?.common?.loading || "Loading Services..."}</p>
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && categories.length === 0 && (
        <div className="bg-white rounded-2xl sm:rounded-[32px] p-6 sm:p-12 shadow-sm border border-[#E8E2DC] text-center max-w-2xl mx-auto my-8 sm:my-12">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#FCF2E9] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#8B7355]">
            <FaSpa className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <h3 className="text-xl sm:text-xl md:text-2xl font-bold font-displayPlayFair text-[#0F172A] mb-2">
            No Services Available
          </h3>
          <p className="text-sm text-[#64748B] font-cambria italic">
            Currently there are no services available from the server. Please check back later.
          </p>
        </div>
      )}

      {/* ── Grid ── */}
      {!loading && categories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              onClick={(e) => handleCategoryClick(cat, e)}
              className="group cursor-pointer block"
            >
              <div className="bg-white rounded-2xl sm:rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[#E8E2DC] flex flex-col h-full">
                {/* Image Section */}
                <div className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors duration-500" />

                  {/* Overlay Text */}
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 md:p-10 text-white">
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                      <div className="flex items-center justify-center mt-1 sm:mt-0 shrink-0">
                        {cat.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-displayPlayFair text-2xl sm:text-3xl md:text-4xl mb-1 leading-tight break-words">
                          {cat.title}
                        </h3>
                        {cat.slogan && (
                          <p className="text-xs sm:text-sm font-medium opacity-90 tracking-wide uppercase line-clamp-2">
                            {cat.slogan}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className="p-5 sm:p-8 md:p-10 flex-grow">
                  <p className="font-cambria text-[#475569] text-base sm:text-lg leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ── Footer Buttons ── */}
      <div className="max-w-6xl mx-auto mt-8 sm:mt-16 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-[#FBF6F3] p-4 sm:p-8 rounded-2xl shadow-sm border border-[#E8E2DC]">
        <button
          onClick={() => window.history.back()}
          className="w-full sm:w-auto justify-center px-6 sm:px-10 py-3.5 sm:py-4 rounded-xl border border-[#CFB9A3] text-[#1d1a17] font-bold text-sm hover:bg-[#CFB9A3] hover:bg-opacity-10 transition-all flex items-center gap-3"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          {btnTrans?.back || "Back"}
        </button>

        <button
          disabled
          className="w-full sm:w-auto justify-center px-6 sm:px-12 py-3.5 sm:py-4 rounded-xl bg-[#D1B191] opacity-50 text-white font-bold text-sm cursor-not-allowed flex items-center gap-3 transition-all shadow-md"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {btnTrans?.continue || "Continue"}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}
