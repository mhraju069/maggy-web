"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { formatImageUrl } from "@/lib/api/config";
import { servicesService, ActivityApiItem } from "@/lib/api/services/servicesService";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FaChalkboardTeacher, FaInfoCircle } from "react-icons/fa";
import { LuUsers } from "react-icons/lu";

const fallbackImages = [
  "/images/activities/weeklyschedule/img1.png",
  "/images/activities/weeklyschedule/img2.png",
  "/images/activities/weeklyschedule/img3.png",
  "/images/activities/weeklyschedule/img4.png",
  "/images/activities/weeklyschedule/img5.png",
  "/images/activities/weeklyschedule/img6.png",
];

export default function ActivitiesOfferings() {
  const { language, t } = useLanguage();
  const actTrans = (t as any)?.activitiesPage;
  const flowTrans = (t as any)?.bookingFlow;

  const [activities, setActivities] = useState<ActivityApiItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    servicesService
      .getActivities()
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data)) {
          setActivities(data);
        } else {
          setActivities([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching activities for activities page:", err);
        if (isMounted) setActivities([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const title = actTrans?.section?.title || "Activities & Workshops";
  const subtitle =
    actTrans?.section?.subtitle ||
    "Discover our inspiring sessions, mindful workshops, and unique community gatherings designed for deep connection and vitality.";

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-14 flex flex-col items-center text-center">
          <h2
            style={{ fontFamily: "var(--font-playfair)" }}
            className="text-[clamp(32px,4vw,48px)] font-bold text-[#0F172A] mb-2"
          >
            {title}
          </h2>
          <DecorativeUnderline />
          <p className="text-[#475569] text-lg md:text-xl max-w-[700px] mt-6 font-serif">
            {subtitle}
          </p>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="w-full py-16 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#8B7355] border-t-transparent mb-3" />
            <p className="text-[#64748B] font-serif italic text-sm">
              {flowTrans?.common?.loading || "Loading activities..."}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && activities.length === 0 && (
          <div className="bg-[#FCF2E9] rounded-2xl p-10 text-center max-w-xl mx-auto border border-[#E8E2DC]">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-[#8B7355] shadow-xs">
              <FaInfoCircle size={24} />
            </div>
            <h3 className="text-xl font-bold font-serif text-[#0F172A] mb-2">
              {actTrans?.emptyState?.title || "No Activities Available"}
            </h3>
            <p className="text-sm font-serif text-[#475569] leading-relaxed">
              {actTrans?.emptyState?.description ||
                "There are currently no scheduled activities or workshops. Please check back soon or explore our other wellness offerings."}
            </p>
          </div>
        )}

        {/* Activities Grid */}
        {!loading && activities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {activities.map((item, idx) => {
              // Localized strings
              const itemTitle =
                language === "nl"
                  ? item.title_nl || item.title || item.name
                  : language === "de"
                  ? item.title_de || item.title || item.name
                  : item.title_en || item.title || item.name;

              const itemDesc =
                language === "nl"
                  ? item.description_nl || item.description
                  : language === "de"
                  ? item.description_de || item.description
                  : item.description_en || item.description;

              const startTime = item.open_time
                ? item.open_time.slice(0, 5)
                : item.start_time
                ? item.start_time.slice(0, 5)
                : item.startTime || "";
              const endTime = item.close_time
                ? item.close_time.slice(0, 5)
                : item.end_time
                ? item.end_time.slice(0, 5)
                : item.endTime || "";

              const maxCap = item.capacity ?? item.max_participants ?? item.maxParticipants;
              const bookedCount = item.booked_slots ?? item.booked_participants ?? item.bookedParticipants ?? 0;
              const remaining =
                item.available_slots !== undefined
                  ? item.available_slots
                  : maxCap !== undefined
                  ? Math.max(0, maxCap - bookedCount)
                  : undefined;

              const isSoldOut = (item.is_available === false) || (remaining !== undefined && remaining <= 0);
              const hostName = item.host || item.teacher_host || item.teacherHost;
              const imageSrc = formatImageUrl(
                item.images || item.image,
                fallbackImages[idx % fallbackImages.length]
              );

              return (
                <div
                  key={item.id || idx}
                  className="flex flex-col bg-[#FCF2E9] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
                >
                  {/* Image banner */}
                  <div className="relative h-64 w-full overflow-hidden bg-[#F5F0EB]">
                    <Image
                      src={imageSrc}
                      alt={itemTitle || "Activity"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {isSoldOut && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                        <span className="px-4 py-1.5 bg-red-600 text-white font-bold text-xs uppercase rounded-full tracking-widest shadow-md">
                          {actTrans?.soldOut || "Sold Out"}
                        </span>
                      </div>
                    )}
                    {!isSoldOut && remaining !== undefined && (
                      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg border border-[#E8E2DC] text-[11px] font-bold text-[#0F172A] flex items-center gap-1.5 shadow-xs">
                        <LuUsers className="text-[#8B7355]" size={13} />
                        <span>
                          {remaining <= 5
                            ? (remaining === 1
                                ? (actTrans?.spotsLeft ? actTrans.spotsLeft.replace("{count}", String(remaining)) : "Only 1 spot left")
                                : (actTrans?.spotsLeftPlural ? actTrans.spotsLeftPlural.replace("{count}", String(remaining)) : `Only ${remaining} spots left`))
                            : (actTrans?.spotsRemaining ? actTrans.spotsRemaining.replace("{count}", String(remaining)) : `${remaining} spots remaining`)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="text-2xl font-bold font-serif text-[#0F172A] mb-3 leading-snug">
                        {itemTitle}
                      </h3>
                      {itemDesc && (
                        <p className="text-sm font-serif text-[#475569] leading-relaxed line-clamp-3 mb-4">
                          {itemDesc}
                        </p>
                      )}

                      {/* Schedule info badge */}
                      {(item.date || startTime) && (
                        <div className="space-y-1.5 pt-3 pb-2 border-t border-[#E8E2DC]/80 text-xs text-[#475569]">
                          <div className="flex items-center gap-2">
                            <AiOutlineClockCircle className="text-[#8B7355] text-sm flex-shrink-0" />
                            <span>
                              {item.date ? new Date(item.date).toLocaleDateString(language === "nl" ? "nl-NL" : language === "de" ? "de-DE" : "en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
                              {startTime && ` • ${startTime}${endTime ? ` - ${endTime}` : ""}`}
                            </span>
                          </div>
                          {hostName && (
                            <div className="flex items-center gap-2 text-[#8B7355] font-semibold">
                              <FaChalkboardTeacher className="flex-shrink-0" />
                              <span>{actTrans?.host || "Host"}: {hostName}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Price and Booking Link */}
                    <div className="mt-6 pt-4 border-t border-[#E8E2DC]/80 flex items-center justify-between">
                      {item.price ? (
                        <div>
                          <span className="text-xl font-bold font-serif text-[#8B7355]">
                            €{item.price}
                          </span>
                          <span className="text-xs text-[#64748B] block font-sans">
                            / {flowTrans?.common?.perPerson || "person"}
                          </span>
                        </div>
                      ) : (
                        <div />
                      )}

                      <Link
                        href="/booking/activities"
                        className="inline-flex items-center justify-center px-5 py-2.5 bg-[#8B7355] text-white font-serif font-bold text-sm rounded-lg hover:bg-[#725e44] transition-colors shadow-xs"
                      >
                        {actTrans?.reserveButton || t.wellnessPage?.cta?.button || "Reserve"}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
