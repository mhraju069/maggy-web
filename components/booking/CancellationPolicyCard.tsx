"use client";

import React, { useState } from "react";
import { BiCheckCircle, BiInfoCircle, BiShieldQuarter, BiX } from "react-icons/bi";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { paymentTranslations } from "@/lib/i18n/paymentTranslations";

interface CancellationPolicyCardProps {
  accepted: boolean;
  onAcceptedChange: (accepted: boolean) => void;
  serviceName?: string;
}

export default function CancellationPolicyCard({
  accepted,
  onAcceptedChange,
  serviceName,
}: CancellationPolicyCardProps) {
  const { language } = useLanguage();
  const pt = paymentTranslations[language] || paymentTranslations.en;
  const cardT = pt.policyCard;
  const modalT = pt.policyModal;

  const [modalOpen, setModalOpen] = useState(false);
  const [tempAccepted, setTempAccepted] = useState(accepted);

  const handleOpenModal = () => {
    setTempAccepted(accepted);
    setModalOpen(true);
  };

  const handleConfirmModal = () => {
    onAcceptedChange(tempAccepted);
    setModalOpen(false);
  };

  return (
    <>
      {/* ── Summary Card on Booking Review ── */}
      <div className="w-full min-w-0 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8B7355]/15 text-[#8B7355] flex items-center justify-center flex-shrink-0 mt-0.5">
              <BiShieldQuarter size={24} />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#0F172A] font-displayPlayFair">
                {cardT.title}
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                {cardT.subtitlePrefix}
                <strong>{cardT.subtitleHighlight}</strong>
                {cardT.subtitleSuffix}
              </p>
            </div>
          </div>

        </div>

        {/* Status indicator bar */}
        <div
          onClick={handleOpenModal}
          className={`w-full min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
            accepted
              ? "bg-[#F0FDF4] border-[#86EFAC] text-[#15803D]"
              : "bg-white border-[#E8E2DC] hover:border-[#8B7355]/60 text-[#64748B]"
          }`}
        >
          <div className="min-w-0 flex items-start gap-2.5">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                accepted
                  ? "bg-[#16A34A] border-[#16A34A] text-white"
                  : "border-[#CBD5E1] bg-white text-transparent"
              }`}
            >
              <BiCheckCircle size={16} />
            </div>
            <span className="min-w-0 flex-1 text-xs font-medium break-words">
              {accepted ? (
                <span className="font-semibold text-[#15803D]">
                  {cardT.acknowledgedText}
                </span>
              ) : (
                <span>
                  {cardT.unacknowledgedPrefix}
                  <strong>{cardT.unacknowledgedAction}</strong>
                  {cardT.unacknowledgedSuffix}
                </span>
              )}
            </span>
          </div>

          <span className="self-start sm:self-auto text-xs font-bold text-[#8B7355] underline shrink-0">
            {accepted ? cardT.changePolicyLink : cardT.openPolicyLink}
          </span>
        </div>
      </div>

      {/* ── Modal Popup ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 text-[#1d1a17] animate-in fade-in duration-200">
          <div className="bg-[#FAF8F5] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E8E2DC] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 md:px-7 border-b border-[#E8E2DC] bg-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#8B7355]/15 text-[#8B7355] flex items-center justify-center flex-shrink-0">
                  <BiShieldQuarter size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-base md:text-lg text-[#0F172A] font-displayPlayFair">
                    {modalT.title}
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    {modalT.subtitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <BiX size={24} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div
              className="p-5 md:p-7 overflow-y-auto space-y-5 text-xs text-[#475569] leading-relaxed"
              style={{ scrollbarWidth: "thin" }}
            >
              {/* Important Notice Card */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FCF2E9] border border-[#E8E2DC] text-[#8B7355]">
                <BiInfoCircle size={20} className="flex-shrink-0 mt-0.5" />
                <div className="text-xs leading-normal">
                  <strong className="font-bold block text-[#0F172A] mb-0.5">
                    {modalT.importantNoticeTitle}
                  </strong>
                  {modalT.importantNoticeBody}
                </div>
              </div>

              {/* Section 1 */}
              <div className="p-4 rounded-xl bg-white border border-[#E8E2DC] space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#0F172A]">
                  {modalT.sec1Title}
                </h4>
                <p className="text-xs text-[#334155]">
                  {modalT.sec1Intro}
                  <strong>{modalT.sec1IntroBold}</strong>
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-1 text-[11px] text-[#64748B]">
                  <li>
                    <strong className="text-[#334155]">{modalT.sec1Point1Title}</strong>{" "}
                    {modalT.sec1Point1Body}
                  </li>
                  <li>
                    <strong className="text-[#334155]">{modalT.sec1Point2Title}</strong>{" "}
                    {modalT.sec1Point2Body}
                  </li>
                  <li>
                    <strong className="text-[#334155]">{modalT.sec1Point3Title}</strong>{" "}
                    {modalT.sec1Point3Body}
                  </li>
                </ul>
              </div>

              {/* Section 2 */}
              <div className="p-4 rounded-xl bg-white border border-[#E8E2DC] space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#0F172A]">
                  {modalT.sec2Title}
                </h4>
                <p className="text-xs text-[#334155]">
                  {modalT.sec2Intro}
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-1 text-[11px] text-[#64748B]">
                  <li>
                    <strong className="text-[#334155]">{modalT.sec2Point1Title}</strong>{" "}
                    {modalT.sec2Point1Body}
                  </li>
                  <li>
                    <strong className="text-[#334155]">{modalT.sec2Point2Title}</strong>{" "}
                    {modalT.sec2Point2Body}
                  </li>
                  <li>
                    <strong className="text-[#334155]">{modalT.sec2Point3Title}</strong>{" "}
                    {modalT.sec2Point3Body}
                  </li>
                </ul>
              </div>

              {/* Section 3 */}
              <div className="p-4 rounded-xl bg-white border border-[#E8E2DC] space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#0F172A]">
                  {modalT.sec3Title}
                </h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {modalT.sec3Body}
                </p>
              </div>

              {/* Section 4 */}
              <div className="p-4 rounded-xl bg-white border border-[#E8E2DC] space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#0F172A]">
                  {modalT.sec4Title}
                </h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {modalT.sec4Body}
                </p>
              </div>
            </div>

            {/* Modal Footer with Checkbox & Action Button */}
            <div className="p-5 md:px-7 border-t border-[#E8E2DC] bg-white space-y-4">
              <label
                htmlFor="modal-agree-cancellation-policy"
                className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2DC] hover:border-[#8B7355]/60 transition-colors cursor-pointer select-none"
              >
                <input
                  id="modal-agree-cancellation-policy"
                  type="checkbox"
                  checked={tempAccepted}
                  onChange={(e) => setTempAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#8B7355] focus:ring-[#8B7355] cursor-pointer"
                />
                <span className="text-xs text-[#0F172A] leading-snug">
                  {modalT.agreeCheckboxLabel1}
                  <strong className="text-[#8B7355]">
                    {modalT.agreeCheckboxBold}
                  </strong>
                  {modalT.agreeCheckboxLabel2}
                </span>
              </label>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#CBD5E1] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] font-bold text-xs transition-colors cursor-pointer"
                >
                  {modalT.cancelBtn}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmModal}
                  disabled={!tempAccepted}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer ${
                    tempAccepted
                      ? "bg-[#8B7355] hover:bg-[#786247] text-white"
                      : "bg-[#CBD5E1] text-[#64748B] cursor-not-allowed shadow-none"
                  }`}
                >
                  {modalT.confirmBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
