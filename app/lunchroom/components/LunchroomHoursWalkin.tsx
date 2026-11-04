"use client";

import Link from "next/link";
import React from "react";
import { BiCalendarCheck, BiTimeFive } from "react-icons/bi";
import { FaGlassCheers, FaWalking } from "react-icons/fa";
import { MdCheckCircle, MdInfoOutline } from "react-icons/md";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function LunchroomHoursWalkin() {
  const { t } = useLanguage();
  const h = (t.lunchroomPage as any)?.hoursAndReservations;

  return (
    <section className="py-16 md:py-20 bg-[#FBF6F3] border-y border-[#E8E2DC]">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8B7355] block mb-2 font-mono">
            {h?.kicker || "Welcome to the Lunchroom"}
          </span>
          <h2 className="text-3xl md:text-4xl font-displayPlayFair text-[#1d1a17]">
            {h?.title || "Opening Hours & Table Reservations"}
          </h2>
          <div className="w-16 h-[2px] bg-[#D1B191] mx-auto mt-4" />
        </div>

        {/* 2 Column Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Opening Hours */}
          <div className="bg-white rounded-[28px] p-8 md:p-10 border border-[#E8E2DC] shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 rounded-2xl bg-[#FCF2E9] flex items-center justify-center text-[#8B7355]">
                  <BiTimeFive size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-displayPlayFair text-[#0F172A]">
                    {h?.openingHoursCard?.title || "Opening Hours"}
                  </h3>
                  <p className="text-xs text-[#64748B] tracking-wide">
                    {h?.openingHoursCard?.subtitle || "Fresh meals & drinks served daily"}
                  </p>
                </div>
              </div>

              {/* Schedule List */}
              <div className="space-y-4 my-6 bg-[#FCF2E9]/60 p-6 rounded-2xl border border-[#E8E2DC]/80">
                <div className="flex justify-between items-center pb-3 border-b border-[#E8E2DC]/60">
                  <span className="font-medium text-[#1d1a17]">
                    {h?.openingHoursCard?.wedSun || "Wednesday – Sunday"}
                  </span>
                  <span className="font-bold text-[#8B7355] bg-white px-3 py-1 rounded-full border border-[#D1B191]/40 text-sm shadow-xs">
                    09:00 – 16:00
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#64748B]">
                    {h?.openingHoursCard?.monTue || "Monday & Tuesday"}
                  </span>
                  <span className="text-[#94A3B8] italic font-medium">
                    {h?.openingHoursCard?.closed || "Closed"}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-[#64748B] mt-4">
                <MdInfoOutline className="text-[#8B7355] text-base flex-shrink-0 mt-0.5" />
                <span>
                  {h?.openingHoursCard?.kitchenNotice || "Kitchen closes 30 minutes before closing time."}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Walk-In & Reservation Policy */}
          <div className="bg-white rounded-[28px] p-8 md:p-10 border border-[#E8E2DC] shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#FCF2E9] flex items-center justify-center text-[#8B7355]">
                  <FaWalking size={22} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-displayPlayFair text-[#0F172A]">
                    {h?.walkInsCard?.title || "Walk-Ins & Table Booking"}
                  </h3>
                  <p className="text-xs text-[#64748B] tracking-wide">
                    {h?.walkInsCard?.subtitle || "Spontaneous or reserved, we welcome you"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 my-6">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FCF2E9]/50 border border-[#E8E2DC]/60">
                  <MdCheckCircle className="text-[#8B7355] text-lg flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-[#0F172A]">
                      {h?.walkInsCard?.walkInsTitle || "Walk-Ins Welcome"}
                    </h4>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      {h?.walkInsCard?.walkInsDesc || "No reservation needed! Guests can drop by anytime Wednesday to Sunday from 09:00 to 16:00."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FCF2E9]/50 border border-[#E8E2DC]/60">
                  <BiCalendarCheck className="text-[#8B7355] text-xl flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-[#0F172A]">
                      {h?.walkInsCard?.tableBookingTitle || "Standard Table Reservations"}
                    </h4>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      {h?.walkInsCard?.tableBookingDesc || "Reserve a table online for guaranteed seating and personalized special requests."}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs font-semibold">
                      <a className="text-[#8B7355] underline underline-offset-2" href="tel:+31723030548">
                        {h?.walkInsCard?.tableBookingPhoneLabel || "Call us"}: 072-3030548
                      </a>
                      <a
                        className="text-[#8B7355] underline underline-offset-2"
                        href="https://wa.me/31723030548"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {h?.walkInsCard?.tableBookingWhatsappLabel || "WhatsApp us"}
                      </a>
                    </div>
                    <p className="text-xs text-[#64748B] mt-2">
                      {h?.walkInsCard?.tableBookingWelcome || "We look forward to welcoming you to Heaven on Earth!"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#E8E2DC]">
              <Link
                href="/booking/lunchroom"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#8B7355] hover:bg-[#725e45] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg"
              >
                <BiCalendarCheck size={18} />
                {h?.walkInsCard?.reserveButton || "Reserve a Table Online"}
              </Link>
            </div>
          </div>
        </div>

        {/* Celebration Highlight Banner */}
        <div className="mt-8 bg-gradient-to-r from-[#8B7355] to-[#D1B191] rounded-[24px] p-6 md:p-8 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 text-white shadow-inner">
              <FaGlassCheers size={26} />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-widest font-bold text-amber-100 block mb-1">
                {h?.celebrationBanner?.badge || "Special Occasions & Birthdays"}
              </span>
              <h3 className="text-xl font-bold font-displayPlayFair">
                {h?.celebrationBanner?.title || "Celebrating Something Special?"}
              </h3>
              <p className="text-xs md:text-sm text-amber-50/90 mt-1 max-w-xl">
                {h?.celebrationBanner?.description || "Let us know what you're celebrating (birthday, anniversary, milestone), who it's for, and their hobbies or age. We'll prepare a personalized experience!"}
              </p>
            </div>
          </div>

          <Link
            href="/booking/lunchroom"
            className="flex-shrink-0 bg-white text-[#8B7355] hover:bg-amber-50 font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md"
          >
            {h?.celebrationBanner?.button || "Plan Celebration Table"}
          </Link>
        </div>
      </div>
    </section>
  );
}
