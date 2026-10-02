"use client";

import Footer from "@/components/shared/Footer";
import PageHero from "@/components/shared/PageHero";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Link from "next/link";
import { BiCheckCircle, BiCreditCard, BiInfoCircle, BiTimeFive } from "react-icons/bi";
import { FaBoxes, FaCalendarAlt, FaInfinity, FaSpa, FaUsers } from "react-icons/fa";
import CreateYourOwn from "./components/CreateYourOwn";

export default function ArrangementsPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      {/* ── Page Hero ── */}
      <PageHero
        backgroundImage="/images/arrangements/hero/arrangementshero.png"
        title={t.arrangementsPage?.hero?.title || "Salt Room & Halotherapy"}
        subtitle={
          t.arrangementsPage?.hero?.subtitle ||
          "Experience pure aerosol halotherapy for respiratory wellness, skin revitalization, and deep relaxation."
        }
      />

      {/* ── Overview Section ── */}
      <section className="py-20 bg-[#FCF2E9]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8B7355] block mb-2">
              Therapeutic Halotherapy Sanctuary
            </span>
            <h2 className="text-4xl md:text-5xl font-bold font-displayPlayFair text-[#0F172A] mb-4">
              Breathe Deeply. Restore Vitality.
            </h2>
            <p className="text-[#475569] text-lg font-serif leading-relaxed">
              Step into our calming salt room micro-climate. Microscopic salt aerosol particles purify your airway, soothe skin conditions, and transport you into profound stillness.
            </p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E8E2DC] shadow-xs text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#FCF2E9] text-[#8B7355] flex items-center justify-center mx-auto mb-4">
                <FaUsers size={22} />
              </div>
              <h3 className="font-bold text-[#0F172A] text-lg font-displayPlayFair mb-1">Capacity</h3>
              <p className="text-sm font-semibold text-[#8B7355]">Max 2 People / Session</p>
              <p className="text-xs text-[#64748B] mt-1">Intimate, tranquil setting</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8E2DC] shadow-xs text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#FCF2E9] text-[#8B7355] flex items-center justify-center mx-auto mb-4">
                <BiTimeFive size={24} />
              </div>
              <h3 className="font-bold text-[#0F172A] text-lg font-displayPlayFair mb-1">Duration</h3>
              <p className="text-sm font-semibold text-[#8B7355]">1 Hour Session</p>
              <p className="text-xs text-[#64748B] mt-1">+10 Mins changeover buffer</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8E2DC] shadow-xs text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#FCF2E9] text-[#8B7355] flex items-center justify-center mx-auto mb-4">
                <BiCreditCard size={24} />
              </div>
              <h3 className="font-bold text-[#0F172A] text-lg font-displayPlayFair mb-1">Single Session</h3>
              <p className="text-sm font-semibold text-[#8B7355]">€25 / Person</p>
              <p className="text-xs text-[#64748B] mt-1">Per hour session</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8E2DC] shadow-xs text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#FCF2E9] text-[#8B7355] flex items-center justify-center mx-auto mb-4">
                <BiInfoCircle size={24} />
              </div>
              <h3 className="font-bold text-[#0F172A] text-lg font-displayPlayFair mb-1">First Start Time</h3>
              <p className="text-sm font-semibold text-[#8B7355]">06:00 AM</p>
              <p className="text-xs text-[#64748B] mt-1">Sessions until 23:20</p>
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
                Automated Session System
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-displayPlayFair text-[#0F172A]">
                Daily Session Timetable
              </h2>
              <p className="text-sm text-[#64748B] mt-1">
                1-hour sessions plus a 10-minute automatic changeover period between bookings.
              </p>
            </div>

            <Link
              href="/booking/arrangements"
              className="px-8 py-4 rounded-xl bg-[#8B7355] hover:bg-[#725e45] text-white font-bold text-sm uppercase tracking-wider transition-all shadow-md flex-shrink-0"
            >
              Book Salt Room Session
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
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
            ].map((slot, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#FBF6F3] border border-[#E8E2DC] text-center"
              >
                <span className="text-sm font-bold text-[#0F172A] font-displayPlayFair block">
                  {slot}
                </span>
                <span className="text-[10px] text-[#8B7355] font-mono block mt-1">
                  {idx === 14 ? "Final Session" : "10m changeover buffer"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Passes & Memberships Section ── */}
      <section className="py-20 bg-[#FBF6F3]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8B7355] block mb-2">
              Passes & Memberships
            </span>
            <h2 className="text-4xl font-bold font-displayPlayFair text-[#0F172A]">
              Choose Your Halotherapy Plan
            </h2>
            <p className="text-sm text-[#64748B] mt-2">
              Flexible session passes and memberships tailored to your wellness cadence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 10-Session Pass Card */}
            <div className="bg-white rounded-3xl p-8 border border-[#E8E2DC] shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FCF2E9] text-[#8B7355] flex items-center justify-center mb-6">
                  <FaBoxes size={22} />
                </div>
                <span className="text-xs font-bold text-[#8B7355] uppercase tracking-wider block mb-1">
                  Session Pass
                </span>
                <h3 className="text-2xl font-bold font-displayPlayFair text-[#0F172A] mb-2">
                  10-Session Pass
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-[#8B7355] font-displayPlayFair">€200</span>
                  <span className="text-xs text-[#64748B]">/ 10 sessions (€20/session)</span>
                </div>

                <ul className="space-y-3 text-xs text-[#475569] border-t border-[#E8E2DC] pt-4">
                  <li className="flex items-start gap-2">
                    <BiCheckCircle className="text-[#8B7355] text-base flex-shrink-0" />
                    <span>Linked directly to your customer account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BiCheckCircle className="text-[#8B7355] text-base flex-shrink-0" />
                    <span>Automatically deducts 1 session when booking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BiCheckCircle className="text-[#8B7355] text-base flex-shrink-0" />
                    <span>View remaining session balance anytime in account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BiCheckCircle className="text-[#8B7355] text-base flex-shrink-0" />
                    <span>Valid for 1 year after purchase date</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/booking/arrangements"
                className="mt-8 w-full py-3.5 rounded-xl bg-[#8B7355] hover:bg-[#725e45] text-white text-center font-bold text-xs uppercase tracking-wider transition-all block"
              >
                Purchase Pass
              </Link>
            </div>

            {/* Once-a-Week Membership Card */}
            <div className="bg-white rounded-3xl p-8 border border-[#E8E2DC] shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FCF2E9] text-[#8B7355] flex items-center justify-center mb-6">
                  <FaCalendarAlt size={22} />
                </div>
                <span className="text-xs font-bold text-[#8B7355] uppercase tracking-wider block mb-1">
                  Weekly Membership
                </span>
                <h3 className="text-2xl font-bold font-displayPlayFair text-[#0F172A] mb-2">
                  Once-a-Week
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-[#8B7355] font-displayPlayFair">€70</span>
                  <span className="text-xs text-[#64748B]">/ 4 weeks</span>
                </div>

                <ul className="space-y-3 text-xs text-[#475569] border-t border-[#E8E2DC] pt-4">
                  <li className="flex items-start gap-2">
                    <BiCheckCircle className="text-[#8B7355] text-base flex-shrink-0" />
                    <span>1 session per week included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BiCheckCircle className="text-[#8B7355] text-base flex-shrink-0" />
                    <span>Maximum 4 included sessions per 4-week period</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BiCheckCircle className="text-[#8B7355] text-base flex-shrink-0" />
                    <span>Automatic member recognition upon sign in</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BiCheckCircle className="text-[#8B7355] text-base flex-shrink-0" />
                    <span>Online advance session reservation</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/booking/arrangements"
                className="mt-8 w-full py-3.5 rounded-xl border border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white text-center font-bold text-xs uppercase tracking-wider transition-all block"
              >
                Join Once-a-Week
              </Link>
            </div>

            {/* Unlimited Membership Card */}
            <div className="bg-[#081228] text-white rounded-3xl p-8 border border-white/20 shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-6">
                  <FaInfinity size={22} />
                </div>
                <span className="text-xs font-bold text-white/70 uppercase tracking-wider block mb-1">
                  Ultimate Membership
                </span>
                <h3 className="text-2xl font-bold font-displayPlayFair text-white mb-2">
                  Unlimited
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-white font-displayPlayFair">€100</span>
                  <span className="text-xs text-white/60">/ 4 weeks</span>
                </div>

                <ul className="space-y-3 text-xs text-white/80 border-t border-white/15 pt-4">
                  <li className="flex items-start gap-2">
                    <BiCheckCircle className="text-emerald-400 text-base flex-shrink-0" />
                    <span>Unlimited use within available capacity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BiCheckCircle className="text-emerald-400 text-base flex-shrink-0" />
                    <span>Each session reserved in advance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BiCheckCircle className="text-emerald-400 text-base flex-shrink-0" />
                    <span>Maximum 10 future active reservations at the same time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BiCheckCircle className="text-emerald-400 text-base flex-shrink-0" />
                    <span>Priority booking access for prime hours</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/booking/arrangements"
                className="mt-8 w-full py-3.5 rounded-xl bg-white text-[#081228] hover:bg-opacity-90 text-center font-bold text-xs uppercase tracking-wider transition-all block"
              >
                Join Unlimited
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Combinable with Wellness Packages ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8B7355] block mb-2">
            Wellness Integration
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-displayPlayFair text-[#0F172A] mb-4">
            Combinable with Wellness Packages
          </h2>
          <p className="text-[#64748B] text-base max-w-2xl mx-auto mb-10">
            Elevate your wellness experience by combining Salt Room halotherapy with our private sauna sanctuary, farm-to-table lunchroom dining, and restorative massages.
          </p>

          <Link
            href="/booking/packages"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-[#8B7355] hover:bg-[#725e45] text-white font-bold text-sm tracking-wide transition-all shadow-lg"
          >
            Explore Combinable Wellness Packages
          </Link>
        </div>
      </section>

      {/* ── Create Your Own Bespoke Section ── */}
      <CreateYourOwn />

      <Footer />
    </div>
  );
}
