"use client";

import StripePaymentForm from "@/components/booking/StripePaymentForm";
import CancellationPolicyCard from "@/components/booking/CancellationPolicyCard";
import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { bookingService } from "@/lib/api/services/bookingService";
import { getStoredBookingData, updateStoredBookingData } from "@/lib/bookingStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCakeCandles, FaGift, FaHeart } from "react-icons/fa6";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { paymentTranslations } from "@/lib/i18n/paymentTranslations";

export default function ReviewPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const flow = (t as any)?.bookingFlow;
  const revTrans = flow?.review;
  const btnTrans = flow?.buttons;

  const [data, setData] = useState(getStoredBookingData());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [policyAccepted, setPolicyAccepted] = useState(false);

  useEffect(() => {
    setData(getStoredBookingData());
  }, []);

  const celebration = data.celebration;
  const isLunchroom = data.serviceType === "lunchroom" || data.serviceName.toLowerCase().includes("lunchroom");
  const isActivity = data.serviceType === "activity" || Boolean(data.activityDetails);
  const isPackage = data.serviceType === "package" || data.serviceType === "packages";
  const pkgSelections = data.packageSelections;

  const handleConfirmLunchroom = async () => {
    try {
      if (!policyAccepted) {
        setError("Please read and accept the Cancellation, Rescheduling & Refund Policy to proceed.");
        return;
      }

      setLoading(true);
      setError(null);

      let bookingTime = "12:00:00";
      if (data.timeSlot) {
        const timeMatch = data.timeSlot.match(/(\d{1,2}:\d{2})/);
        if (timeMatch) {
          bookingTime = timeMatch[1].length === 4 ? `0${timeMatch[1]}:00` : `${timeMatch[1]}:00`;
        }
      }

      const payload = {
        booking_date: data.date || new Date().toISOString().split("T")[0],
        booking_time: bookingTime,
        capacity: data.guestsCount || 2,
        name: data.name || "Guest",
        email: data.email || "guest@example.com",
        phone: data.phone || "+31612345678",
        special_request: data.requests || undefined,
        ...(celebration?.isCelebrating
          ? {
              celebration_type: celebration.occasion || undefined,
              celebration_date: data.date || undefined,
              name_of_celebrant: celebration.celebrantName || undefined,
              age_of_celebrant: celebration.age ? parseInt(celebration.age, 10) : undefined,
              hobbies: celebration.hobbiesInterests || undefined,
              celebration_details: celebration.otherDetails || undefined,
            }
          : {}),
      };

      const res = await bookingService.createLunchroomBooking(payload);
      if (res && res.booking_id) {
        updateStoredBookingData({ bookingId: res.booking_id });
        router.push("/booking/confirmation");
      } else {
        setError("Failed to create table reservation. Please check your reservation details.");
      }
    } catch (err: any) {
      console.error("Lunchroom reservation error:", err);
      setError(err?.message || "Failed to confirm table reservation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-6 md:px-12">
      {/* ── Title Section ── */}
      <div className="text-center mb-16 flex flex-col items-center">
        <h1 className="font-displayPlayFair text-3xl sm:text-5xl text-[#1d1a17] mb-2 leading-tight break-words">
          {revTrans?.title || "Review & Confirm"}
        </h1>
        <DecorativeUnderline />
        <p className="font-cambria text-sm text-[#475569] mt-6 italic tracking-wide">
          {revTrans?.subtitle || "Please review your reservation details below."}
        </p>
      </div>

      {/* ── Content Card ── */}
      <div className="max-w-4xl mx-auto bg-white rounded-[32px] overflow-hidden shadow-sm border border-[#E8E2DC]">
        <div className="p-5 sm:p-10 space-y-8 sm:space-y-10">
          {/* Services Information */}
          <section>
            <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-[0.2em] mb-8" style={{ fontFamily: "Inter, sans-serif" }}>
              {revTrans?.summaryTitle || "Reservation Summary"}
            </h2>

            <div className="space-y-6">
              <div>
                <span className="text-xs text-[#94A3B8] uppercase block mb-1">{revTrans?.selectedExperience || "Selected Experience"}</span>
                <h3 className="min-w-0 text-2xl sm:text-3xl font-bold text-[#0F172A] font-displayPlayFair flex items-start gap-2 sm:gap-3 break-words">
                  <MdOutlineRestaurantMenu className="text-[#8B7355] shrink-0 mt-1" />
                  {(data.serviceName?.toLowerCase().includes("lunchroom") ? revTrans?.lunchroomTableReservation : data.serviceName) || revTrans?.lunchroomTableReservation || "Lunchroom Table Reservation"}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#F1F5F9]">
                <div>
                  <span className="text-xs text-[#94A3B8] uppercase block mb-1">{revTrans?.date || "Date"}</span>
                  <p className="text-lg font-bold text-[#0F172A]">
                    {data.date ? new Date(data.date).toLocaleDateString(language === "nl" ? "nl-NL" : language === "de" ? "de-DE" : "en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }) : (revTrans?.notSelected || "Not selected")}
                  </p>
                </div>
                {!isPackage && (
                  <div>
                    <span className="text-xs text-[#94A3B8] uppercase block mb-1">
                      {isActivity ? (revTrans?.sessionTime || "Session Time") : isLunchroom ? (revTrans?.time || "Start Time") : (revTrans?.startTimeSlot || "Start Time Slot")}
                    </span>
                    <p className="text-lg font-bold text-[#0F172A]">
                      {isActivity && data.activityDetails?.startTime
                        ? `${data.activityDetails.startTime} - ${data.activityDetails.endTime}`
                        : data.timeSlot
                        ? data.timeSlot
                        : (revTrans?.notSelected || "Not selected")}
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-xs text-[#94A3B8] uppercase block mb-1">{revTrans?.numberOfPeople || "Number of People"}</span>
                  <p className="text-lg font-bold text-[#0F172A]">
                    {data.guestsCount} {data.guestsCount === 1 ? (revTrans?.person || "Person") : (revTrans?.people || "People")}
                  </p>
                </div>
              </div>

              {/* Package Sub-Services Schedule Breakdown */}
              {isPackage && pkgSelections && (
                <div className="pt-4 border-t border-[#F1F5F9] space-y-3">
                  <span className="text-xs text-[#94A3B8] uppercase block font-bold tracking-wider">
                    {revTrans?.scheduledSubServices || "Scheduled Sub-Services & Times"}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {pkgSelections.saunaSlot && (
                      <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E8E2DC]">
                        <span className="text-[10px] uppercase font-bold text-[#8B7355] block">{revTrans?.saunaSession || "Sauna Session"}</span>
                        <p className="font-bold text-[#0F172A] text-sm mt-0.5">
                          {pkgSelections.saunaSlot.startTime} – {pkgSelections.saunaSlot.endTime}
                        </p>
                        <span className="text-[11px] text-[#64748B] capitalize">
                          {pkgSelections.saunaSlot.type} Sauna
                        </span>
                      </div>
                    )}

                    {pkgSelections.lunchroomTime && (
                      <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E8E2DC]">
                        <span className="text-[10px] uppercase font-bold text-[#8B7355] block">{revTrans?.lunchroomDining || "Lunchroom Dining"}</span>
                        <p className="font-bold text-[#0F172A] text-sm mt-0.5">
                          {pkgSelections.lunchroomTime} Arrival
                        </p>
                        <span className="text-[11px] text-[#64748B]">Flexible Lunchroom Entry</span>
                      </div>
                    )}

                    {pkgSelections.saltRoomSlot && (
                      <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E8E2DC]">
                        <span className="text-[10px] uppercase font-bold text-[#8B7355] block">{revTrans?.saltRoomSession || "Salt Room Session"}</span>
                        <p className="font-bold text-[#0F172A] text-sm mt-0.5">
                          {pkgSelections.saltRoomSlot.startTime} – {pkgSelections.saltRoomSlot.endTime}
                        </p>
                        <span className="text-[11px] text-[#64748B]">Halotherapy Session</span>
                      </div>
                    )}

                    {pkgSelections.activitySession && (
                      <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E8E2DC]">
                        <span className="text-[10px] uppercase font-bold text-[#8B7355] block">{revTrans?.activitySession || "Activity Session"}</span>
                        <p className="font-bold text-[#0F172A] text-sm mt-0.5">
                          {pkgSelections.activitySession.title}
                        </p>
                        <span className="text-[11px] text-[#64748B]">
                          {pkgSelections.activitySession.startTime} – {pkgSelections.activitySession.endTime}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Duration Display */}
              {!isPackage && !isLunchroom && !isActivity && (
                <div className="pt-3 border-t border-[#F1F5F9]">
                  <div>
                    <span className="text-xs text-[#94A3B8] uppercase block mb-1">Session Duration</span>
                    <p className="text-base font-bold text-[#0F172A]">
                      {data.isSaltRoom || data.serviceType === "salt_room" || data.serviceType === "saltroom"
                        ? "1 Hour Aerosol Halotherapy"
                        : `${data.durationHours || 3} Hours ${data.isSharedSauna ? "Shared Session Access" : "Private Access"}`}
                    </p>
                  </div>
                </div>
              )}

              {/* Activity Teacher / Host & Additional Notes (Activity Only) */}
              {isActivity && data.activityDetails && (
                <div className="pt-3 border-t border-[#F1F5F9] space-y-3">
                  {data.activityDetails.teacherHost && (
                    <div>
                      <span className="text-xs text-[#94A3B8] uppercase block mb-1">Teacher / Host</span>
                      <p className="text-base font-bold text-[#0F172A]">{data.activityDetails.teacherHost}</p>
                    </div>
                  )}

                  {data.activityDetails.additionalInfo && (
                    <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#475569]">
                      <span className="font-bold text-[#0F172A] block mb-0.5">Additional Information:</span>
                      {data.activityDetails.additionalInfo}
                    </div>
                  )}
                </div>
              )}

              {/* Sauna Extras (Sauna Only) */}
              {!isLunchroom && !isActivity && data.selectedExtras && data.selectedExtras.length > 0 && (
                <div className="pt-3 border-t border-[#F1F5F9]">
                  <span className="text-xs text-[#94A3B8] uppercase block mb-2">Selected Add-on Extras</span>
                  <div className="flex flex-wrap gap-2">
                    {data.selectedExtras.map((ext) => (
                      <span key={ext.id} className="px-3 py-1 bg-[#FCF2E9] border border-[#E8E2DC] rounded-lg text-xs font-bold text-[#8B7355]">
                        {ext.name} (+€{ext.price})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!isLunchroom && data.price && data.price !== "€0" && data.price !== "$0" && (
                <div className="pt-4 border-t border-[#F1F5F9]">
                  <span className="text-xs text-[#94A3B8] uppercase block mb-1">Total Calculated Investment</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-[#8B7355] font-displayPlayFair">{data.price}</span>
                    <span className="text-xs text-[#94A3B8] italic">All inclusive pricing</span>
                  </div>
                </div>
              )}
            </div>
          </section>

          <hr className="border-[#F1F5F9]" />

          {/* Customer Information */}
          <section>
            <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-[0.2em] mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
              {revTrans?.personalDetails || "Customer Details"}
            </h2>

            <div className="space-y-6">
              <div>
                <span className="text-xs text-[#94A3B8] uppercase block mb-1">{revTrans?.name || "Name"}</span>
                <p className="text-xl font-bold text-[#0F172A]">{data.name || "Not provided"}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-xs text-[#94A3B8] uppercase block mb-1">{revTrans?.email || "Email"}</span>
                  <p className="text-base font-medium text-[#0F172A]">{data.email || "Not provided"}</p>
                </div>
                <div>
                  <span className="text-xs text-[#94A3B8] uppercase block mb-1">{revTrans?.phone || "Phone"}</span>
                  <p className="text-base font-medium text-[#0F172A]">{data.phone || "Not provided"}</p>
                </div>
              </div>

              {data.requests && (
                <div>
                  <span className="text-xs text-[#94A3B8] uppercase block mb-1">{revTrans?.specialRequests || "Comments / Special Requests"}</span>
                  <p className="text-sm font-medium text-[#475569] bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
                    {data.requests}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Celebration Details Section (Lunchroom Only) */}
          {isLunchroom && celebration?.isCelebrating && (
            <>
              <hr className="border-[#F1F5F9]" />
              <section className="bg-gradient-to-r from-[#FCF2E9] to-[#FBF6F3] p-6 md:p-8 rounded-2xl border border-[#E8E2DC]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#8B7355] text-white flex items-center justify-center">
                    <FaCakeCandles size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B7355] block">Special Occasion</span>
                    <h3 className="text-xl font-bold font-displayPlayFair text-[#0F172A]">{revTrans?.celebrationNoted || "Celebration Details 🎉"}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <span className="text-xs text-[#8B7355] uppercase font-bold block mb-1">{flow?.information?.whatIsBeingCelebrated || "What is being celebrated?"}</span>
                    <p className="font-bold text-[#0F172A]">{celebration.occasion || "Special Celebration"}</p>
                  </div>

                  <div>
                    <span className="text-xs text-[#8B7355] uppercase font-bold block mb-1">{flow?.information?.whoIsItFor || "Who is it for?"}</span>
                    <p className="font-bold text-[#0F172A]">{celebration.celebrantName || "Guest of Honor"}</p>
                  </div>

                  {celebration.age && (
                    <div>
                      <span className="text-xs text-[#8B7355] uppercase font-bold block mb-1">{flow?.information?.ageMilestoneNumber || "Age / Milestone"}</span>
                      <p className="font-bold text-[#0F172A]">{celebration.age}</p>
                    </div>
                  )}

                  {celebration.hobbiesInterests && (
                    <div>
                      <span className="text-xs text-[#8B7355] uppercase font-bold block mb-1">{flow?.information?.hobbiesInterests || "Hobbies / Personal Interests"}</span>
                      <p className="font-bold text-[#0F172A]">{celebration.hobbiesInterests}</p>
                    </div>
                  )}
                </div>

                {celebration.otherDetails && (
                  <div className="mt-4 pt-4 border-t border-[#E8E2DC]/80">
                    <span className="text-xs text-[#8B7355] uppercase font-bold block mb-1">{flow?.information?.otherCelebrationDetails || "Other Celebration Details"}</span>
                    <p className="text-sm italic text-[#475569]">{celebration.otherDetails}</p>
                  </div>
                )}
              </section>
            </>
          )}

          {/* ── Payment or Confirmation Action ── */}
          {isLunchroom ? (
            <div className="pt-2 space-y-6">
              <CancellationPolicyCard
                accepted={policyAccepted}
                onAcceptedChange={setPolicyAccepted}
                serviceName="Lunchroom Table Reservation"
              />

              <div className="p-6 rounded-2xl bg-[#FCF2E9] border border-[#E8E2DC] flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-[#0F172A] font-displayPlayFair">Free Table Reservation</h4>
                  <p className="text-xs text-[#64748B] mt-1">No payment or card required. Pay directly at the Lunchroom when dining.</p>
                </div>
                <button
                  type="button"
                  onClick={handleConfirmLunchroom}
                  disabled={loading || !policyAccepted}
                  className={`w-full md:w-auto px-10 py-4 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                    !policyAccepted
                      ? "bg-[#CBD5E1] text-[#64748B] cursor-not-allowed shadow-none"
                      : loading
                      ? "bg-[#8B7355] opacity-75 cursor-wait text-white"
                      : "bg-[#8B7355] hover:bg-[#786247] text-white"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Confirming Reservation...</span>
                    </>
                  ) : (
                    <span>Confirm Table Reservation</span>
                  )}
                </button>
              </div>
              {error && (
                <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
                  {error}
                </div>
              )}
            </div>
          ) : (
            <section>
              <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-[0.2em] mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
                Payment Information
              </h2>
              <StripePaymentForm
                totalAmount={data.totalAmount || data.price || 250}
                serviceName={data.serviceName}
                onSuccess={() => {
                  window.location.href = "/booking/confirmation";
                }}
              />
            </section>
          )}
        </div>
      </div>

      {/* ── Footer Navigation Buttons ── */}
      <div className="max-w-4xl mx-auto mt-12 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-[#FBF6F3] p-4 sm:p-6 rounded-2xl shadow-sm border border-[#E8E2DC]">
        <button
          onClick={() => window.history.back()}
          className="w-full sm:w-auto justify-center px-6 sm:px-8 py-3.5 rounded-xl border border-[#CFB9A3] text-[#1d1a17] font-bold text-sm hover:bg-[#CFB9A3]/10 transition-all flex items-center gap-3 cursor-pointer"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          {btnTrans?.changeDetails || btnTrans?.back || "Back to Details"}
        </button>

        <span className="text-xs text-[#8B7355] font-semibold italic hidden sm:inline">
          Please complete and confirm using the payment form above ↑
        </span>
      </div>
    </div>
  );
}
