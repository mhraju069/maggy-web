"use client";

import React, { useState } from "react";
import { BiCheckCircle, BiInfoCircle, BiShieldQuarter, BiX } from "react-icons/bi";

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
      <div className="rounded-2xl border border-[#E8E2DC] bg-[#FAF7F2] p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8B7355]/15 text-[#8B7355] flex items-center justify-center flex-shrink-0 mt-0.5">
              <BiShieldQuarter size={24} />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#0F172A] font-displayPlayFair">
                Cancellation, Rescheduling & Refund Policy
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Cancellations or changes are permitted up to <strong>24 hours</strong> before your scheduled time.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenModal}
            className="px-4 py-2.5 rounded-xl border border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white font-bold text-xs transition-all shadow-2xs whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            {accepted ? "Review Policy" : "Read Policy"}
          </button>
        </div>

        {/* Status indicator bar */}
        <div
          onClick={handleOpenModal}
          className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
            accepted
              ? "bg-[#F0FDF4] border-[#86EFAC] text-[#15803D]"
              : "bg-white border-[#E8E2DC] hover:border-[#8B7355]/60 text-[#64748B]"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                accepted
                  ? "bg-[#16A34A] border-[#16A34A] text-white"
                  : "border-[#CBD5E1] bg-white text-transparent"
              }`}
            >
              <BiCheckCircle size={16} />
            </div>
            <span className="text-xs font-medium">
              {accepted ? (
                <span className="font-semibold text-[#15803D]">
                  Policy acknowledged & accepted (24h requirement agreed)
                </span>
              ) : (
                <span>
                  Please click to <strong>read and accept</strong> the cancellation & refund policy
                </span>
              )}
            </span>
          </div>

          <span className="text-xs font-bold text-[#8B7355] underline">
            {accepted ? "Change" : "Open Policy"}
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
                    Cancellation, Rescheduling & Refund Policy
                  </h3>
                  <p className="text-[11px] text-[#64748B]">
                    Please read through our terms carefully before accepting.
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
                    Important Notice:
                  </strong>
                  Please cancel or reschedule at least <strong>24 hours</strong> before your scheduled session to avoid losing your booked session or credit. Late cancellations and missed appointments will result in the booked session or credit being considered used, including for members and session-pass holders.
                </div>
              </div>

              {/* Section 1 */}
              <div className="p-4 rounded-xl bg-white border border-[#E8E2DC] space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#0F172A]">
                  1. Cancellation and Rescheduling Policy
                </h4>
                <p className="text-xs text-[#334155]">
                  Customers may cancel or reschedule a wellness reservation up to{" "}
                  <strong>24 hours before the scheduled start time</strong>.
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-1 text-[11px] text-[#64748B]">
                  <li>
                    <strong className="text-[#334155]">More than 24 hours before the session:</strong> Customers may cancel or reschedule their reservation in accordance with the applicable refund, credit, and booking policies.
                  </li>
                  <li>
                    <strong className="text-[#334155]">Within 24 hours of the session:</strong> Cancellations and rescheduling are no longer permitted free of charge. The applicable late cancellation policy will apply.
                  </li>
                  <li>
                    <strong className="text-[#334155]">At or after the scheduled start time:</strong> Cancellations or changes are not permitted under the standard cancellation policy.
                  </li>
                </ul>
              </div>

              {/* Section 2 */}
              <div className="p-4 rounded-xl bg-white border border-[#E8E2DC] space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#0F172A]">
                  2. Policy for Members and Session-Pass Holders
                </h4>
                <p className="text-xs text-[#334155]">
                  The same 24-hour cancellation and rescheduling policy applies to all members and session-pass holders.
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-1 text-[11px] text-[#64748B]">
                  <li>
                    <strong className="text-[#334155]">Timely cancellation (more than 24 hours in advance):</strong> The session or credit used for the booking will be returned to the customer's account and made available for future bookings, subject to the applicable membership or session-pass terms.
                  </li>
                  <li>
                    <strong className="text-[#334155]">Late cancellation (within 24 hours):</strong> The booked session or credit will be considered used and will not be restored.
                  </li>
                  <li>
                    <strong className="text-[#334155]">No-show:</strong> If a customer fails to attend the booked session without cancelling in accordance with the policy, the session or credit will be considered used and will not be restored.
                  </li>
                </ul>
              </div>

              {/* Section 3 */}
              <div className="p-4 rounded-xl bg-white border border-[#E8E2DC] space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#0F172A]">
                  3. Refunds and Credits
                </h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Refunds, credits, and the restoration of sessions are subject to the applicable payment, membership, and session-pass terms. A timely cancellation does not automatically guarantee a monetary refund. Eligible refunds or credits will be processed according to the rules applicable to the original booking and payment method.
                </p>
              </div>

              {/* Section 4 */}
              <div className="p-4 rounded-xl bg-white border border-[#E8E2DC] space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#0F172A]">
                  4. Booking Confirmation and Customer Acknowledgment
                </h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  The cancellation and rescheduling policy will be clearly displayed during the booking process and included in the booking confirmation. By completing a reservation, customers acknowledge that they have read and accepted the applicable cancellation, rescheduling, refund, and credit rules.
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
                  I have read, understood, and accept the{" "}
                  <strong className="text-[#8B7355]">
                    Cancellation, Rescheduling & Refund Policy
                  </strong>
                  , including the 24-hour notice requirement.
                </span>
              </label>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#CBD5E1] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
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
                  Confirm & Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
