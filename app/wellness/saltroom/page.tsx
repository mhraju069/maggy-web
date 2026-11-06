"use client";

import Footer from "@/components/shared/Footer";
import PageHero from "@/components/shared/PageHero";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { servicesService, SaltroomServicesData, SaltRoomSlotItem } from "@/lib/api/services/servicesService";
import { paymentsService, PlansAndPassesResponse } from "@/lib/api/services/paymentsService";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { BiCheckCircle, BiCreditCard, BiInfoCircle, BiTimeFive } from "react-icons/bi";
import { FaCalendarAlt, FaInfinity, FaUsers } from "react-icons/fa";

export default function SaltRoomPage() {
  const { t, language } = useLanguage();

  const [saltServices, setSaltServices] = useState<SaltroomServicesData | null>(null);
  const [plansData, setPlansData] = useState<PlansAndPassesResponse | null>(null);
  const [slotsList, setSlotsList] = useState<SaltRoomSlotItem[]>([]);
  const [slotsOpenTime, setSlotsOpenTime] = useState<string>("06:00 AM");
  const [slotsCloseTime, setSlotsCloseTime] = useState<string>("23:20");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const todayStr = new Date().toISOString().split("T")[0];

    Promise.all([
      servicesService.getSaltRoomServices().catch((err) => {
        console.warn("Error fetching saltroom services:", err);
        return null;
      }),
      servicesService.getServiceSlots("saltroom", todayStr).catch((err) => {
        console.warn("Error fetching saltroom slots:", err);
        return null;
      }),
      paymentsService.getPlansAndPasses().catch((err) => {
        console.warn("Error fetching plans and passes:", err);
        return null;
      }),
    ])
      .then(([saltRes, slotsRes, plansRes]) => {
        if (saltRes) setSaltServices(saltRes);
        if (plansRes) setPlansData(plansRes);

        if (slotsRes) {
          const dataObj: any = slotsRes.data || slotsRes;
          const rawSlots: SaltRoomSlotItem[] =
            dataObj?.slots || dataObj?.saltroom?.slots || dataObj?.available_slots || [];
          if (rawSlots.length > 0) {
            setSlotsList(rawSlots);
            const firstTime = rawSlots[0].start_time || rawSlots[0].time || "06:00";
            const lastTime = rawSlots[rawSlots.length - 1].end_time || rawSlots[rawSlots.length - 1].time || "23:20";
            setSlotsOpenTime(firstTime);
            setSlotsCloseTime(lastTime);
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Primary Salt Room item
  const primarySaltItem = saltServices?.saltroom?.[0];

  const dynamicCapacity = (primarySaltItem as any)?.max_capacity || (primarySaltItem as any)?.capacity || 2;
  const dynamicPrice = primarySaltItem?.price_per_person
    ? parseFloat(String(primarySaltItem.price_per_person)).toFixed(0)
    : "25";

  const formattedOpenTime = useMemo(() => {
    const [hourText, minuteText] = slotsOpenTime.slice(0, 5).split(":");
    const hour = Number(hourText);
    if (!Number.isFinite(hour) || !minuteText) return slotsOpenTime;
    if (language === "en") {
      return `${String(hour % 12 || 12).padStart(2, "0")}:${minuteText} ${hour >= 12 ? "PM" : "AM"}`;
    }
    return `${String(hour).padStart(2, "0")}:${minuteText}`;
  }, [language, slotsOpenTime]);

  // Dynamic Plans from paymentsService or servicesService fallback
  const sessionPass = useMemo(() => {
    return plansData?.session_passes?.[0] || saltServices?.session_pass?.[0] || null;
  }, [plansData, saltServices]);

  const saltWeekly = useMemo(() => {
    const list = plansData?.subscription_plans || saltServices?.subscription_plans || [];
    return list.find((p) => p.plan_type?.toLowerCase() === "weekly") || null;
  }, [plansData, saltServices]);

  const saltUnlimited = useMemo(() => {
    const list = plansData?.subscription_plans || saltServices?.subscription_plans || [];
    return list.find((p) => p.plan_type?.toLowerCase() === "unlimited") || null;
  }, [plansData, saltServices]);

  // Default fallback timetable slots if API returns empty
  const displayTimetableSlots = useMemo(() => {
    if (slotsList.length > 0) {
      return slotsList.map((s, idx) => {
        const start = s.start_time || s.time || "06:00";
        const end = s.end_time || "07:00";
        return {
          timeRange: `${start.slice(0, 5)}–${end.slice(0, 5)}`,
          isFinal: idx === slotsList.length - 1,
        };
      });
    }

    return [
      "06:00–07:00",
      "07:10–08:10",
      "08:20–09:20",
      "09:30–10:30",
      "10:40–11:40",
      "11:50–12:50",
      "13:00–14:00",
      "14:10–15:10",
      "15:20–16:20",
      "16:30–17:30",
      "17:40–18:40",
      "18:50–19:50",
      "20:00–21:00",
      "21:10–22:10",
      "22:20–23:20",
    ].map((slot, idx, arr) => ({
      timeRange: slot,
      isFinal: idx === arr.length - 1,
    }));
  }, [slotsList]);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Page Hero ── */}
      <PageHero
        backgroundImage="/images/wellness/bookings/saltroom-v2.png"
        title={t.saltRoomPage?.hero?.title || "Salt Room & Halotherapy"}
        subtitle={
          t.saltRoomPage?.hero?.subtitle ||
          "Experience pure aerosol halotherapy for respiratory wellness, skin revitalization, and deep relaxation."
        }
      />

      {/* ── Overview Section ── */}
      <section className="py-20 bg-[#FCF2E9]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            {t.saltRoomPage?.sanctuary?.badge && (
              <span className="text-xs font-bold uppercase tracking-widest text-[#8B7355] block mb-2">
                {t.saltRoomPage.sanctuary.badge}
              </span>
            )}

            <h2 className="text-4xl md:text-5xl font-bold font-displayPlayFair text-[#0F172A] mb-6">
              {t.saltRoomPage?.sanctuary?.title || "A breath of fresh air for your body and mind."}
            </h2>
            <p className="text-[#475569] text-lg font-serif leading-relaxed">
              {t.saltRoomPage?.sanctuary?.description ||
                "Experience the power of natural salt therapy. During a session, you inhale fine salt particles, which may help relieve respiratory symptoms. The calming environment also provides a wonderful opportunity to relax and unwind."}
            </p>
            <p className="text-[#475569] text-lg font-serif leading-relaxed mt-4">
              {t.saltRoomPage?.sanctuary?.closing || "Treat yourself to a moment of pure relaxation."}
            </p>
          </div>

          {/* Quick Info Grid (Dynamically Populated from API) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E8E2DC] shadow-xs text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#FCF2E9] text-[#8B7355] flex items-center justify-center mx-auto mb-4">
                <FaUsers size={22} />
              </div>
              <h3 className="font-bold text-[#0F172A] text-lg font-displayPlayFair mb-1">
                {t.saltRoomPage?.sanctuary?.capacityTitle || "Capacity"}
              </h3>
              <p className="text-sm font-semibold text-[#8B7355]">
                {(t.saltRoomPage?.sanctuary?.capacityValue || "Maximum {count} people").replace("{count}", String(dynamicCapacity))}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8E2DC] shadow-xs text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#FCF2E9] text-[#8B7355] flex items-center justify-center mx-auto mb-4">
                <BiTimeFive size={24} />
              </div>
              <h3 className="font-bold text-[#0F172A] text-lg font-displayPlayFair mb-1">
                {t.saltRoomPage?.sanctuary?.durationTitle || "Duration"}
              </h3>
              <p className="text-sm font-semibold text-[#8B7355]">
                {t.saltRoomPage?.sanctuary?.durationValue || "60 minutes"}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8E2DC] shadow-xs text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#FCF2E9] text-[#8B7355] flex items-center justify-center mx-auto mb-4">
                <BiCreditCard size={24} />
              </div>
              <h3 className="font-bold text-[#0F172A] text-lg font-displayPlayFair mb-1">
                {t.saltRoomPage?.sanctuary?.sessionTitle || "Single Session"}
              </h3>
              <p className="text-sm font-semibold text-[#8B7355]">
                {(t.saltRoomPage?.sanctuary?.priceValue || "€{price} per person").replace("{price}", dynamicPrice)}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8E2DC] shadow-xs text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#FCF2E9] text-[#8B7355] flex items-center justify-center mx-auto mb-4">
                <BiInfoCircle size={24} />
              </div>
              <h3 className="font-bold text-[#0F172A] text-lg font-displayPlayFair mb-1">
                {t.saltRoomPage?.sanctuary?.firstStartTitle || "First Start Time"}
              </h3>
              <p className="text-sm font-semibold text-[#8B7355]">
                {(t.saltRoomPage?.sanctuary?.openingHoursValue || "From {time}").replace("{time}", formattedOpenTime)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Calculated Session Schedule Section ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#8B7355] block mb-1">
                {t.saltRoomPage?.timetable?.badge || "Automated Session System"}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-displayPlayFair text-[#0F172A]">
                {t.saltRoomPage?.timetable?.title || "Daily Session Timetable"}
              </h2>
              <p className="text-sm text-[#64748B] mt-1">
                {t.saltRoomPage?.timetable?.subtitle ||
                  "1-hour sessions available daily."}
              </p>
            </div>

            <Link
              href="/booking/arrangements"
              className="px-8 py-4 rounded-xl bg-[#8B7355] hover:bg-[#725e45] text-white font-bold text-sm uppercase tracking-wider transition-all shadow-md flex-shrink-0"
            >
              {t.saltRoomPage?.timetable?.bookButton || "Book Salt Room Session"}
            </Link>
          </div>

          {/* All Slots Rendered from Start to End Time */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {displayTimetableSlots.map((slot, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#FBF6F3] border border-[#E8E2DC] text-center transition-all hover:border-[#8B7355]/40"
              >
                <span className="text-sm font-bold text-[#0F172A] font-displayPlayFair block">
                  {slot.timeRange}
                </span>
                {slot.isFinal && (
                  <span className="text-[10px] text-[#8B7355] font-mono block mt-1">
                    {t.saltRoomPage?.timetable?.finalSession || ""}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Passes & Memberships Section ── */}
      <section className="py-20 bg-[#FCF2E9]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8B7355] block mb-2">
              {t.saltRoomPage?.memberships?.badge || "Flexible Halotherapy Access"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-displayPlayFair text-[#0F172A] mb-3">
              {t.saltRoomPage?.memberships?.title || "Passes & Memberships"}
            </h2>
            <p className="text-[#64748B] text-base">
              {t.saltRoomPage?.memberships?.subtitle ||
                "Choose between flexible multi-session passes or continuous renewal memberships designed for long-term well-being."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 10-Session Pass Card */}
            <div className="bg-white rounded-3xl p-8 border border-[#E8E2DC] shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FCF2E9] text-[#8B7355] flex items-center justify-center mb-6">
                  <FaCalendarAlt size={22} />
                </div>
                <span className="text-xs font-bold text-[#8B7355] uppercase tracking-wider block mb-1">
                  {t.saltRoomPage?.memberships?.passBadge || "Session Pass"}
                </span>
                <h3 className="text-xl md:text-2xl font-bold font-displayPlayFair text-[#0F172A] mb-2">
                  {sessionPass?.name || "10-Session Pass"}
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-[#8B7355] font-displayPlayFair">
                    €{sessionPass?.price ? parseFloat(String(sessionPass.price)).toFixed(0) : "200"}
                  </span>
                  <span className="text-xs text-[#64748B]">
                    / {(sessionPass as any)?.total_sessions || 10} sessions
                  </span>
                </div>

                <ul className="space-y-3 text-xs text-[#475569] border-t border-[#E8E2DC] pt-4">
                  {sessionPass?.features && sessionPass.features.length > 0 ? (
                    sessionPass.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <BiCheckCircle className="text-[#8B7355] text-base flex-shrink-0" />
                        <span>{f.feature.replace(/^[✓✔\s]+/, "")}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      {((t as any)?.commonUI?.saltRoomFeatures?.pass || [
                        "Linked directly to your customer account",
                        "Automatically deducts 1 session when booking",
                        "View remaining session balance anytime in account",
                        "Valid for 1 year after purchase date",
                      ]).map((featText: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <BiCheckCircle className="text-[#8B7355] text-base flex-shrink-0" />
                          <span>{featText}</span>
                        </li>
                      ))}
                    </>
                  )}
                </ul>
              </div>

              <Link
                href="/memberships#packages"
                className="mt-8 w-full py-3.5 rounded-xl bg-[#8B7355] hover:bg-[#725e45] text-white text-center font-bold text-xs uppercase tracking-wider transition-all block shadow-xs"
              >
                {t.saltRoomPage?.memberships?.purchasePass || "Purchase Pass"}
              </Link>
            </div>

            {/* Once-a-Week Membership Card */}
            <div className="bg-white rounded-3xl p-8 border border-[#E8E2DC] shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FCF2E9] text-[#8B7355] flex items-center justify-center mb-6">
                  <FaCalendarAlt size={22} />
                </div>
                <span className="text-xs font-bold text-[#8B7355] uppercase tracking-wider block mb-1">
                  {t.saltRoomPage?.memberships?.weeklyBadge || "Weekly Membership"}
                </span>
                <h3 className="text-xl md:text-2xl font-bold font-displayPlayFair text-[#0F172A] mb-2">
                  {saltWeekly?.name || "Once-a-Week"}
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-[#8B7355] font-displayPlayFair">
                    €{saltWeekly?.price ? parseFloat(String(saltWeekly.price)).toFixed(0) : "70"}
                  </span>
                  <span className="text-xs text-[#64748B]">
                    / {saltWeekly?.duration_weeks || 4} weeks
                  </span>
                </div>

                <ul className="space-y-3 text-xs text-[#475569] border-t border-[#E8E2DC] pt-4">
                  {saltWeekly?.features && saltWeekly.features.length > 0 ? (
                    saltWeekly.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <BiCheckCircle className="text-[#8B7355] text-base flex-shrink-0" />
                        <span>{f.feature.replace(/^[✓✔\s]+/, "")}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      {((t as any)?.commonUI?.saltRoomFeatures?.weekly || [
                        "1 session per week included",
                        "Maximum 4 included sessions per 4-week period",
                        "Automatic member recognition upon sign in",
                        "Online advance session reservation",
                      ]).map((featText: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <BiCheckCircle className="text-[#8B7355] text-base flex-shrink-0" />
                          <span>{featText}</span>
                        </li>
                      ))}
                    </>
                  )}
                </ul>
              </div>

              <Link
                href="/memberships#packages"
                className="mt-8 w-full py-3.5 rounded-xl border border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white text-center font-bold text-xs uppercase tracking-wider transition-all block shadow-xs"
              >
                {t.saltRoomPage?.memberships?.joinWeekly || "Join Once-a-Week"}
              </Link>
            </div>

            {/* Unlimited Membership Card */}
            <div className="bg-[#081228] text-white rounded-3xl p-8 border border-white/20 shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-6">
                  <FaInfinity size={22} />
                </div>
                <span className="text-xs font-bold text-white/70 uppercase tracking-wider block mb-1">
                  {t.saltRoomPage?.memberships?.unlimitedBadge || "Ultimate Membership"}
                </span>
                <h3 className="text-2xl font-bold font-displayPlayFair text-white mb-2">
                  {saltUnlimited?.name || "Unlimited"}
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-white font-displayPlayFair">
                    €{saltUnlimited?.price ? parseFloat(String(saltUnlimited.price)).toFixed(0) : "100"}
                  </span>
                  <span className="text-xs text-white/60">
                    / {saltUnlimited?.duration_weeks || 4} weeks
                  </span>
                </div>

                <ul className="space-y-3 text-xs text-white/80 border-t border-white/15 pt-4">
                  {saltUnlimited?.features && saltUnlimited.features.length > 0 ? (
                    saltUnlimited.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <BiCheckCircle className="text-emerald-400 text-base flex-shrink-0" />
                        <span>{f.feature.replace(/^[✓✔\s]+/, "")}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      {((t as any)?.commonUI?.saltRoomFeatures?.unlimited || [
                        "Unlimited use within available capacity",
                        "Each session reserved in advance",
                        "Maximum {max} future active reservations",
                        "Priority booking access for prime hours",
                      ]).map((featText: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <BiCheckCircle className="text-emerald-400 text-base flex-shrink-0" />
                          <span>{featText.replace("{max}", String(saltUnlimited?.max_reservations || 10))}</span>
                        </li>
                      ))}
                    </>
                  )}
                </ul>
              </div>

              <Link
                href="/memberships#packages"
                className="mt-8 w-full py-3.5 rounded-xl bg-white text-[#081228] hover:bg-opacity-90 text-center font-bold text-xs uppercase tracking-wider transition-all block shadow-md"
              >
                {t.saltRoomPage?.memberships?.joinUnlimited || "Join Unlimited"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Combinable with Wellness Packages ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8B7355] block mb-2">
            {t.saltRoomPage?.integration?.badge || "Wellness Integration"}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-displayPlayFair text-[#0F172A] mb-4">
            {t.saltRoomPage?.integration?.title || "Combinable with Wellness Packages"}
          </h2>
          <p className="text-[#64748B] text-base max-w-2xl mx-auto mb-10">
            {t.saltRoomPage?.integration?.description ||
              "Elevate your wellness experience by combining Salt Room halotherapy with our private sauna sanctuary, farm-to-table lunchroom dining, and restorative packages."}
          </p>

          <Link
            href="/arrangements"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-[#8B7355] hover:bg-[#725e45] text-white font-bold text-sm tracking-wide transition-all shadow-lg"
          >
            {t.saltRoomPage?.integration?.button || "Explore Arrangements & Bundles"}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
