"use client";

import Link from "next/link";
import { BsCheckCircle } from "react-icons/bs";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineUsers,
  HiOutlineSparkles,
  HiOutlineCreditCard,
  HiOutlineArrowRight,
  HiOutlineKey,
  HiOutlineCheckBadge,
} from "react-icons/hi2";
import { RiCalendarCheckLine, RiHistoryLine } from "react-icons/ri";
import { DashboardBookingItem } from "@/lib/api";
import { useDashboard } from "./DashboardContext";
import Spinner from "@/components/shared/Spinner";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { dashboardTranslations } from "@/lib/i18n/dashboardTranslations";
import { formatTime24h } from "@/lib/dateUtils";
import { cleanServiceName } from "@/lib/utils";


function formatDisplayDate(dateStr: string, locale: string = "en-US") {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(locale === "nl" ? "nl-NL" : locale === "de" ? "de-DE" : "en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

//export function cleanServiceName(name?: string): string {
  //if (!name) return "Wellness Experience";
 //let cleaned = name.replace(/\b([A-Za-z]+)\s+\1\b/gi, "$1");
  //cleaned = cleaned.replace(/sauna\s+sauna/gi, "Sauna");
  //return cleaned.trim() || "Wellness Experience";
//}

function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  accent = "brand",
}: {
  title: string;
  value: string | number;
  subtext?: string;
  icon: any;
  accent?: "brand" | "emerald" | "amber" | "slate";
}) {
  const accentStyles = {
    brand: "bg-[#FCF2E9] text-[#8B7355] border-[#E8E2DC]",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    slate: "bg-slate-50 text-slate-700 border-slate-100",
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#F1EDE8] shadow-xs flex items-start justify-between relative overflow-hidden transition-all hover:shadow-md">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1">
          {title}
        </p>
        <p className="text-3xl font-bold font-displayPlayFair text-[#1d1a17] leading-tight">
          {value}
        </p>
        {subtext && (
          <p className="text-xs text-[#64748B] mt-2 font-medium flex items-center gap-1">
            {subtext}
          </p>
        )}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border flex-shrink-0 ${accentStyles[accent]}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}

function NextVisitHighlight({ booking }: { booking: DashboardBookingItem }) {
  const { language } = useLanguage();
  const dt = dashboardTranslations[language]?.home || dashboardTranslations.en.home;

  return (
    <div className="bg-gradient-to-br from-[#FAF5F0] via-white to-[#F8EFE6] rounded-3xl p-8 border border-[#E8E2DC] shadow-sm relative overflow-hidden mb-8">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#EBDBC9]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative">
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1 text-xs bg-[#8B7355] text-white rounded-full font-bold uppercase tracking-wider shadow-xs">
            {dt.nextUp}
          </span>
          <span className="px-3 py-1 text-xs bg-white text-[#8B7355] border border-[#E8E2DC] rounded-full font-semibold uppercase tracking-wider">
            {booking.service_type}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <BsCheckCircle className="w-3.5 h-3.5" />
            {dt.confirmed}
          </span>
          {booking.access_code && (
            <Link
              href="/dashboard/access-codes"
              className="text-xs font-mono font-bold bg-[#1d1a17] text-white px-3 py-1 rounded-full flex items-center gap-1 hover:bg-[#8B7355] transition-colors"
            >
              <HiOutlineKey className="w-3.5 h-3.5" />
              {dt.code}: {booking.access_code}
            </Link>
          )}
        </div>
      </div>

      <div className="relative mb-6">
        <h2 className="text-2xl md:text-3xl font-bold font-displayPlayFair text-[#1d1a17] mb-2">
          {cleanServiceName(booking.service_name)}
        </h2>
        <p className="text-xs text-[#64748B]">
          {dt.bookingReference} <span className="font-mono font-semibold text-[#1d1a17]">{booking.booking_id}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#E8E2DC]/80 relative">
        <div className="flex items-center gap-3 bg-white/80 p-4 rounded-xl border border-[#F1EDE8]">
          <div className="w-10 h-10 rounded-xl bg-[#FCF2E9] flex items-center justify-center text-[#8B7355] flex-shrink-0">
            <HiOutlineCalendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">{dt.date}</p>
            <p className="text-sm font-bold text-[#1d1a17]">{formatDisplayDate(booking.date, language)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/80 p-4 rounded-xl border border-[#F1EDE8]">
          <div className="w-10 h-10 rounded-xl bg-[#FCF2E9] flex items-center justify-center text-[#8B7355] flex-shrink-0">
            <HiOutlineClock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">{dt.arrivalTime}</p>
            <p className="text-sm font-bold text-[#1d1a17]">{formatTime24h(booking.time)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/80 p-4 rounded-xl border border-[#F1EDE8]">
          <div className="w-10 h-10 rounded-xl bg-[#FCF2E9] flex items-center justify-center text-[#8B7355] flex-shrink-0">
            <HiOutlineUsers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">{dt.guests}</p>
            <p className="text-sm font-bold text-[#1d1a17]">
              {booking.guests} {booking.guests === 1 ? dt.guest : dt.guests}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubscriptionsSection() {
  const { subscriptions } = useDashboard();
  const { language } = useLanguage();
  const dt = dashboardTranslations[language]?.home || dashboardTranslations.en.home;

  return (
    <div className="bg-white rounded-3xl p-8 border border-[#F1EDE8] shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold font-displayPlayFair text-[#1d1a17]">
            {dt.wellnessSubscriptions}
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            {dt.summarySubtitle}
          </p>
        </div>

        <Link
          href="/memberships"
          className="px-5 py-2.5 rounded-xl bg-[#8B7355] hover:bg-[#786247] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <HiOutlineSparkles className="w-4 h-4" />
          {dt.browseNewSubscriptions}
        </Link>
      </div>

      {subscriptions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subscriptions.map((sub) => {
            const isActive = sub.status === "active";
            return (
              <div
                key={sub.id}
                className="p-6 rounded-2xl border border-[#F1EDE8] bg-[#FAF8F5]/50 flex flex-col justify-between hover:border-[#D1B191] transition-all hover:shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-[#8B7355] tracking-widest">
                      {sub.billing_period || dt.membership}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-displayPlayFair text-[#1d1a17] mb-1">
                    {sub.plan_name}
                  </h3>

                  {sub.sessions_remaining !== undefined && sub.sessions_remaining !== null && (
                    <div className="my-3 p-3 bg-white rounded-xl border border-[#E8E2DC] flex items-center justify-between">
                      <span className="text-xs text-[#64748B] font-medium">{dt.sessionBalance}</span>
                      <span className="text-sm font-bold font-displayPlayFair text-[#8B7355]">
                        {sub.sessions_remaining} {sub.total_sessions ? `/ ${sub.total_sessions}` : ""} {dt.remaining}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-2 border-t border-[#F1EDE8] flex items-center justify-between text-xs text-[#94A3B8]">
                  <span>{dt.price} €{sub.price}</span>
                  {sub.expires_at && (
                    <span>{dt.validUntil} {formatDisplayDate(sub.expires_at, language)}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-[#FCF2E9]/40 border border-dashed border-[#E8E2DC] text-center">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto mb-3 shadow-xs text-[#8B7355]">
            <HiOutlineCheckBadge className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold font-displayPlayFair text-[#1d1a17] mb-1">
            {dt.noActiveSubscriptionTitle}
          </h3>
          <p className="text-xs text-[#64748B] max-w-md mx-auto mb-4">
            {dt.noActiveSubscriptionDesc}
          </p>
          <Link
            href="/memberships"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#8B7355] hover:bg-[#786247] text-white text-xs font-bold transition-all shadow-xs"
          >
            {dt.explorePlans}
          </Link>
        </div>
      )}
    </div>
  );
}

function UpcomingVisitsList({ visits }: { visits: DashboardBookingItem[] }) {
  const { language } = useLanguage();
  const dt = dashboardTranslations[language]?.home || dashboardTranslations.en.home;

  if (visits.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-8 border border-[#F1EDE8] shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold font-displayPlayFair text-[#1d1a17]">
            {dt.scheduledReservations}
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            {dt.scheduledSubtitle}
          </p>
        </div>
        <Link
          href="/dashboard/my-booking"
          className="text-xs font-bold text-[#8B7355] hover:text-[#1d1a17] transition-colors"
        >
          {dt.viewAll}
        </Link>
      </div>

      <div className="space-y-4">
        {visits.map((booking) => (
          <div
            key={booking.id || booking.booking_id}
            className="p-5 rounded-2xl border border-[#F1EDE8] hover:border-[#E8E2DC] bg-[#FAF8F5]/40 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#F1EDE8] flex flex-col items-center justify-center text-[#8B7355] flex-shrink-0 shadow-xs">
                <span className="text-[10px] uppercase font-bold leading-tight">
                  {new Date(booking.date).toLocaleDateString(language === "nl" ? "nl-NL" : language === "de" ? "de-DE" : "en-US", { month: "short" })}
                </span>
                <span className="text-base font-bold font-displayPlayFair leading-tight text-[#1d1a17]">
                  {new Date(booking.date).getDate()}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-base text-[#1d1a17] font-displayPlayFair">
                    {cleanServiceName(booking.service_name)}
                  </h4>
                  <span className="px-2 py-0.5 text-[9px] bg-white border border-[#E8E2DC] text-[#8B7355] font-semibold uppercase rounded-full">
                    {booking.service_type}
                  </span>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {dt.arrivalTime} {formatTime24h(booking.time)} • {booking.guests} {booking.guests === 1 ? dt.guest : dt.guests}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center">
              <span className="text-xs font-mono font-semibold px-3 py-1 bg-white border border-[#E8E2DC] rounded-xl text-[#475569]">
                {booking.booking_id}
              </span>
              <Link
                href="/dashboard/my-booking"
                className="p-2 rounded-xl text-[#8B7355] hover:bg-white hover:shadow-xs transition-all"
                title={dt.viewBooking}
              >
                <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardHome() {
  const { dashboardData, subscriptions, loading } = useDashboard();
  const { language } = useLanguage();
  const dt = dashboardTranslations[language]?.home || dashboardTranslations.en.home;

  const metrics = dashboardData?.home?.metrics;

  const totalBookingsCount = metrics?.total_bookings !== undefined
    ? metrics.total_bookings
    : (dashboardData?.my_bookings?.upcoming?.length || 0) + (dashboardData?.my_bookings?.past?.length || 0);

  const upcomingVisitsCount = metrics?.upcoming_bookings !== undefined
    ? metrics.upcoming_bookings
    : (dashboardData?.my_bookings?.upcoming?.length || 0);

  const activeSubscriptionsCount = metrics?.active_subscriptions !== undefined
    ? metrics.active_subscriptions
    : subscriptions.length;

  const upcomingSaunasCount = metrics?.upcoming_saunas !== undefined
    ? metrics.upcoming_saunas
    : (dashboardData?.access_codes?.all_sauna?.length || 0);

  const nextVisit = dashboardData?.home?.next_visit;
  const otherVisits = dashboardData?.home?.next_visits && dashboardData.home.next_visits.length > 0
    ? dashboardData.home.next_visits
    : (dashboardData?.home?.other_upcoming_visits || []);

  const nextBookingDateText = metrics?.upcoming_booking_dates && metrics.upcoming_booking_dates.length > 0
    ? dt.nextOn.replace("{date}", formatDisplayDate(metrics.upcoming_booking_dates[0], language))
    : nextVisit
    ? dt.nextOn.replace("{date}", formatDisplayDate(nextVisit.date, language))
    : dt.noVisitsScheduled;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* ── Welcome Banner ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="font-displayPlayFair text-3xl md:text-4xl font-bold text-[#1d1a17] mb-1.5">
            {dashboardData?.profile?.name 
              ? dt.welcomeBackUser.replace("{name}", dashboardData.profile.name)
              : dt.welcomeBack}
          </h1>
          <p className="text-sm text-[#64748B]">
            {dt.summarySubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link
            href="/services"
            className="px-5 py-2.5 rounded-xl bg-[#8B7355] hover:bg-[#786247] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
          >
            {dt.bookNewExperience}
          </Link>
          <Link
            href="/memberships"
            className="px-5 py-2.5 rounded-xl bg-white border border-[#CFB9A3] hover:bg-[#FCF2E9] text-[#1d1a17] text-xs font-bold transition-all shadow-xs flex items-center gap-2"
          >
            {dt.membershipsAndPasses}
          </Link>
        </div>
      </div>

      {loading ? (
        <Spinner message="Loading your wellness dashboard..." />
      ) : (
        <>
          {/* ── Analytics Stats Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title={dt.totalBookings}
              value={totalBookingsCount}
              subtext="Lifetime reservations"
              icon={RiHistoryLine}
              accent="brand"
            />
            <StatCard
              title={dt.upcomingVisits}
              value={upcomingVisitsCount}
              subtext={nextBookingDateText}
              icon={RiCalendarCheckLine}
              accent="emerald"
            />
            <StatCard
              title={dt.activeSubscriptions}
              value={activeSubscriptionsCount}
              subtext={dt.membershipsAndPasses}
              icon={HiOutlineCreditCard}
              accent="amber"
            />
            <StatCard
              title={dt.saunaSessions}
              value={upcomingSaunasCount}
              subtext="Ready for entry"
              icon={HiOutlineKey}
              accent="slate"
            />
          </div>

          {/* ── Next Visit Hero Highlight ── */}
          {nextVisit ? (
            <NextVisitHighlight booking={nextVisit} />
          ) : (
            <div className="bg-white rounded-3xl p-10 border border-[#F1EDE8] text-center shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-[#FCF2E9] text-[#8B7355] flex items-center justify-center mx-auto mb-4">
                <HiOutlineCalendar className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold font-displayPlayFair text-[#1d1a17] mb-2">
                {dt.noVisitsScheduled}
              </h2>
              <p className="text-sm text-[#64748B] max-w-md mx-auto mb-6">
                Treat yourself to private sauna tranquility, rejuvenating salt therapy, or culinary moments in our lunchroom.
              </p>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8B7355] hover:bg-[#786247] text-white text-xs font-bold transition-all shadow-xs"
              >
                {dt.explorePlans}
              </Link>
            </div>
          )}

          {/* ── Subscriptions & Passes Section ── */}
          <SubscriptionsSection />

          {/* ── Scheduled Reservations List ── */}
          <UpcomingVisitsList visits={otherVisits} />
        </>
      )}
    </div>
  );
}
