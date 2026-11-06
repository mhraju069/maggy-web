"use client";

import { useState } from "react";
import { BsCheckCircle } from "react-icons/bs";
import { HiOutlineClipboardCopy, HiOutlineKey } from "react-icons/hi";
import { DashboardAccessCodeItem } from "@/lib/api";
import { useDashboard } from "../DashboardContext";
import Spinner from "@/components/shared/Spinner";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { dashboardTranslations } from "@/lib/i18n/dashboardTranslations";
import { formatTime24h } from "@/lib/dateUtils";

function formatDisplayDate(dateStr: string, locale: string = "en-US") {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(locale === "nl" ? "nl-NL" : locale === "de" ? "de-DE" : "en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function AccessCodeCard({ item }: { item: DashboardAccessCodeItem }) {
  const [copied, setCopied] = useState(false);
  const { language } = useLanguage();
  const dt = dashboardTranslations[language]?.accessCodes || dashboardTranslations.en.accessCodes;

  const handleCopy = () => {
    if (item.access_code) {
      navigator.clipboard.writeText(item.access_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const title = item.sauna_type === "private" ? "VIP Sauna" : "Sauna";

  return (
    <div className="bg-white rounded-xl p-6 border border-[#F1EDE8] max-w-2xl mb-6">
      {/* Card header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-[#1d1a17] font-displayPlayFair">
            {title}
          </h3>
          <span className="px-2 py-0.5 text-[11px] bg-[#F3EDE6] text-[#8b7355] rounded-full uppercase tracking-wider font-semibold">
            {item.sauna_type}
          </span>
          <BsCheckCircle className="text-green-500 w-4 h-4" />
        </div>
        <HiOutlineKey className="text-[#8b7355] w-5 h-5" />
      </div>

      <p className="text-sm text-[#64748B] mb-2">
        {formatDisplayDate(item.date, language)} at {formatTime24h(item.time)}
      </p>

      <div className="flex items-center gap-3 mb-4">
        <span className="inline-block text-xs text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full capitalize">
          {item.status || "Confirmed"}
        </span>
        <span className="text-xs text-[#94A3B8]">
          Slot: <span className="text-[#475569] font-medium">{item.time_slot?.replace(/_/g, " ")}</span>
        </span>
      </div>

      {/* Code card */}
      <div className="rounded-xl bg-[#7A6348] p-6 flex items-center justify-between mb-4 shadow-sm">
        <div>
          <p className="text-[11px] text-[#D1BC9D] mb-2 uppercase tracking-widest font-semibold">
            {dt.codeLabel}
          </p>
          <p className="text-3xl font-bold text-white tracking-widest font-mono">
            {item.access_code || item.booking_id}
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm rounded-lg transition-colors cursor-pointer"
        >
          <HiOutlineClipboardCopy className="w-4 h-4" />
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Info note */}
      <div className="bg-[#FDF5F0] rounded-lg px-4 py-3 border border-[#EFE5DC]">
        <p className="text-xs text-[#8b7355]">
          {dt.instruction}
        </p>
      </div>
    </div>
  );
}

export default function AccessCodesPage() {
  const { dashboardData, loading } = useDashboard();
  const { language } = useLanguage();
  const dt = dashboardTranslations[language]?.accessCodes || dashboardTranslations.en.accessCodes;
  const saunaAccessCodes = dashboardData?.access_codes?.all_sauna || [];

  return (
    <div>
      <h1 className="font-displayPlayFair text-3xl font-bold text-[#1d1a17] mb-1">
        {dt.title}
      </h1>
      <p className="text-sm text-[#64748B] mb-6">{dt.subtitle}</p>

      {loading ? (
        <Spinner message="Loading your access codes..." />
      ) : saunaAccessCodes.length > 0 ? (
        saunaAccessCodes.map((item) => (
          <AccessCodeCard key={item.booking_id} item={item} />
        ))
      ) : (
        <div className="bg-white rounded-xl p-12 text-center border border-[#F1EDE8] max-w-2xl">
          <div className="w-14 h-14 rounded-full bg-[#F3EDE6] flex items-center justify-center mx-auto mb-4">
            <HiOutlineKey className="w-7 h-7 text-[#8b7355]" />
          </div>
          <h3 className="text-lg font-semibold text-[#1d1a17] mb-1">{dt.noCodesTitle}</h3>
          <p className="text-sm text-[#64748B]">
            {dt.noCodesDesc}
          </p>
        </div>
      )}
    </div>
  );
}
