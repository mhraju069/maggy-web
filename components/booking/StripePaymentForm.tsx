"use client";

import React, { useEffect, useState } from "react";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe";
import { bookingService } from "@/lib/api/services/bookingService";
import { getStoredBookingData, updateStoredBookingData } from "@/lib/bookingStore";
import { useRouter } from "next/navigation";
import { BiCheckCircle as BiCheckIcon, BiCreditCard, BiLockAlt, BiShieldQuarter } from "react-icons/bi";
import { MdOutlinePayments } from "react-icons/md";
import CancellationPolicyCard from "./CancellationPolicyCard";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { paymentTranslations } from "@/lib/i18n/paymentTranslations";

interface StripePaymentFormProps {
  totalAmount?: number | string;
  serviceName?: string;
  onSuccess?: () => void;
}

const idealBanks = [
  { id: "ing", name: "ING Bank" },
  { id: "rabobank", name: "Rabobank" },
  { id: "abn_amro", name: "ABN AMRO" },
  { id: "sns_bank", name: "SNS Bank" },
  { id: "asn_bank", name: "ASN Bank" },
  { id: "regiobank", name: "RegioBank" },
  { id: "triodos_bank", name: "Triodos Bank" },
  { id: "bunq", name: "bunq" },
  { id: "revolut", name: "Revolut" },
  { id: "knab", name: "Knab" },
  { id: "n26", name: "N26" },
  { id: "nn", name: "Nationale Nederlanden" },
  { id: "van_lanschot", name: "Van Lanschot" },
  { id: "yoursafe", name: "Yoursafe" },
  { id: "moneyou", name: "Moneyou" },
];

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "14px",
      fontFamily: "Inter, sans-serif",
      color: "#0F172A",
      "::placeholder": {
        color: "#94A3B8",
      },
    },
    invalid: {
      color: "#EF4444",
      iconColor: "#EF4444",
    },
  },
};

function InnerPaymentForm({
  totalAmount = 250,
  serviceName = "Sauna Experience",
  onSuccess,
}: StripePaymentFormProps) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const { language } = useLanguage();
  const pt = paymentTranslations[language] || paymentTranslations.en;

  const [paymentMethod, setPaymentMethod] = useState<"card" | "ideal">("card");
  const [selectedBank, setSelectedBank] = useState<string>("ing");

  const [cardName, setCardName] = useState("");
  const [zip, setZip] = useState("");

  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [policyAccepted, setPolicyAccepted] = useState(false);

  const formattedAmount =
    typeof totalAmount === "number"
      ? `€${totalAmount.toFixed(2)}`
      : String(totalAmount).startsWith("€") || String(totalAmount).startsWith("$")
      ? totalAmount
      : `€${totalAmount}`;

  useEffect(() => {
    const data = getStoredBookingData();
    if (data.name && !cardName) {
      setCardName(data.name);
    }
  }, []);

  const numericAmountVal =
    typeof totalAmount === "number"
      ? totalAmount
      : parseFloat(String(totalAmount).replace(/[^0-9.]/g, "")) || 0;
  const isZeroPayment = numericAmountVal <= 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!policyAccepted) {
      setErrorMsg("Please read and accept the Cancellation, Rescheduling & Refund Policy to proceed.");
      return;
    }

    if (!isZeroPayment) {
      if (!cardName.trim()) {
        setErrorMsg("Please enter your name.");
        return;
      }
      if (!stripe || !elements) {
        setErrorMsg("Stripe payment gateway is still loading. Please wait a moment.");
        return;
      }
    }

    setProcessing(true);

    try {
      const bookingData = getStoredBookingData();

      // Format booking_time to HH:MM:SS
      let bookingTime = "10:00:00";
      if (bookingData.timeSlot) {
        const timeMatch = bookingData.timeSlot.match(/(\d{1,2}:\d{2})/);
        if (timeMatch) {
          bookingTime = timeMatch[1].length === 4 ? `0${timeMatch[1]}:00` : `${timeMatch[1]}:00`;
        }
      }

      // Determine time_slot enum
      let timeSlotEnum: "90_mins" | "3_hours" | "4_hours" = "3_hours";
      if (bookingData.isSharedSauna) {
        timeSlotEnum = "90_mins";
      } else if (bookingData.durationHours === 4) {
        timeSlotEnum = "4_hours";
      }

      // Parse numerical price
      let numericPrice = 150;
      if (typeof bookingData.totalAmount === "number" && bookingData.totalAmount > 0) {
        numericPrice = bookingData.totalAmount;
      } else if (bookingData.price) {
        const parsed = parseFloat(String(bookingData.price).replace(/[^0-9.]/g, ""));
        if (!isNaN(parsed) && parsed > 0) numericPrice = parsed;
      }

      const isLunchroom = bookingData.serviceType === "lunchroom" || bookingData.serviceName?.toLowerCase().includes("lunchroom");
      const isActivity = bookingData.serviceType === "activity" || Boolean(bookingData.activityDetails);
      const isPackage = bookingData.serviceType === "package" || bookingData.serviceType === "packages";

      const currentPaymentMode = bookingData.paymentMode || (
        bookingData.passType === "unlimited" && bookingData.hasActiveMembership ? "unlimited_subscription" :
        bookingData.passType === "once_a_week" && bookingData.hasActiveMembership ? "weekly_subscription" :
        bookingData.passType === "10_session_pass" && bookingData.hasActiveMembership ? "pass" : "card"
      );

      // Call Backend API to create booking and get Stripe client_secret
      let clientSecret: string | undefined;
      try {
        if (isPackage) {
          const pkgSelections = bookingData.packageSelections;
          const celebration = bookingData.celebration;

          let sauna_booking: any = undefined;
          if (pkgSelections?.saunaSlot) {
            sauna_booking = {
              sauna_type: pkgSelections.saunaSlot.type || "private",
              booking_time: pkgSelections.saunaSlot.startTime ? `${pkgSelections.saunaSlot.startTime}:00` : "14:00:00",
              time_slot: timeSlotEnum,
              capacity: bookingData.guestsCount || 2,
            };
          }

          let lunchroom_booking: any = undefined;
          if (pkgSelections?.lunchroomTime) {
            lunchroom_booking = {
              booking_time: `${pkgSelections.lunchroomTime}:00`,
              capacity: bookingData.guestsCount || 2,
              ...(celebration?.isCelebrating
                ? {
                    celebration_type: celebration.occasion || undefined,
                    name_of_celebrant: celebration.celebrantName || undefined,
                    age_of_celebrant: celebration.age ? parseInt(celebration.age, 10) : undefined,
                    hobbies: celebration.hobbiesInterests || undefined,
                    celebration_details: celebration.otherDetails || undefined,
                  }
                : {}),
            };
          }

          let activity_booking: any = undefined;
          if (pkgSelections?.activitySession) {
            activity_booking = {
              activity: pkgSelections.activitySession.id || 1,
              capacity: bookingData.guestsCount || 2,
            };
          }

          let saltroom_booking: any = undefined;
          if (pkgSelections?.saltRoomSlot) {
            const rawStart = pkgSelections.saltRoomSlot.startTime || "10:00";
            const formattedStart = rawStart.length === 5 ? `${rawStart}:00` : rawStart;
            const rawEnd = pkgSelections.saltRoomSlot.endTime;
            const formattedEnd = rawEnd ? (rawEnd.length === 5 ? `${rawEnd}:00` : rawEnd) : undefined;
            saltroom_booking = {
              start_time: formattedStart,
              ...(formattedEnd ? { end_time: formattedEnd } : {}),
            };
          }

          const pkgPayload: any = {
            name: cardName.trim() || bookingData.name || "Guest",
            email: bookingData.email || "guest@example.com",
            phone: bookingData.phone || "+31612345678",
            date: bookingData.date || new Date().toISOString().split("T")[0],
            guests: bookingData.guestsCount || 2,
            total_price: numericPrice.toFixed(2),
            is_custom: false,
            notes: bookingData.requests || undefined,
            ...(sauna_booking ? { sauna_booking } : {}),
            ...(lunchroom_booking ? { lunchroom_booking } : {}),
            ...(activity_booking ? { activity_booking } : {}),
            ...(saltroom_booking ? { saltroom_booking } : {}),
          };

          const res = await bookingService.createPackageBooking(pkgPayload);
          if (res && res.booking_id) {
            updateStoredBookingData({ bookingId: res.booking_id });
          }
          if (res && res.client_secret) {
            clientSecret = res.client_secret;
          }
        } else if (isActivity) {
          const actId = bookingData.activityDetails?.id || 1;
          const parsedActId = typeof actId === "string" && !isNaN(Number(actId)) ? parseInt(actId, 10) : actId;

          const actPayload = {
            activity: parsedActId,
            capacity: bookingData.guestsCount || 1,
            name: cardName.trim() || bookingData.name || "Guest",
            email: bookingData.email || "guest@example.com",
            phone: bookingData.phone || "+31612345678",
            special_request: bookingData.requests || undefined,
            total_price: numericPrice.toFixed(2),
          };

          const res = await bookingService.createActivityBooking(actPayload);
          if (res && res.booking_id) {
            updateStoredBookingData({ bookingId: res.booking_id });
          }
          if (res && res.client_secret) {
            clientSecret = res.client_secret;
          }
        } else if (isLunchroom) {
          const celebration = bookingData.celebration;
          const lunchPayload = {
            booking_date: bookingData.date || new Date().toISOString().split("T")[0],
            booking_time: bookingTime,
            capacity: bookingData.guestsCount || 2,
            name: cardName.trim() || bookingData.name || "Guest",
            email: bookingData.email || "guest@example.com",
            phone: bookingData.phone || "+31612345678",
            total_price: numericPrice.toFixed(2),
            special_request: bookingData.requests || undefined,
            ...(celebration?.isCelebrating
              ? {
                  celebration_type: celebration.occasion || undefined,
                  celebration_date: bookingData.date || undefined,
                  name_of_celebrant: celebration.celebrantName || undefined,
                  age_of_celebrant: celebration.age ? parseInt(celebration.age, 10) : undefined,
                  hobbies: celebration.hobbiesInterests || undefined,
                  celebration_details: celebration.otherDetails || undefined,
                }
              : {}),
          };

          const res = await bookingService.createLunchroomBooking(lunchPayload);
          if (res && res.booking_id) {
            updateStoredBookingData({ bookingId: res.booking_id });
          }
          if (res && res.client_secret) {
            clientSecret = res.client_secret;
          }
        } else if (bookingData.isSaltRoom || bookingData.serviceType === "salt_room" || bookingData.serviceType === "saltroom" || bookingData.serviceName?.toLowerCase().includes("salt")) {
          let saltStartTime = "06:00";

          if (bookingData.timeSlot) {
            const rangeMatch = bookingData.timeSlot.match(/(\d{1,2}:\d{2})\s*[-–—]\s*(\d{1,2}:\d{2})/);
            if (rangeMatch) {
              saltStartTime = rangeMatch[1];
            } else {
              const singleMatch = bookingData.timeSlot.match(/(\d{1,2}:\d{2})/);
              if (singleMatch) saltStartTime = singleMatch[1];
            }
          }

          const isPurchaseFlow = !bookingData.hasActiveMembership && (bookingData.passType === "once_a_week" || bookingData.passType === "unlimited" || bookingData.passType === "10_session_pass");
          const purchasePlanId = isPurchaseFlow ? (bookingData.planId || bookingData.passId) : undefined;

          // Format salt start_time to HH:MM:SS
          const formattedStartTime = saltStartTime.length === 5 ? `${saltStartTime}:00` : saltStartTime;
          const formattedCapacity = Math.min(Math.max(Number(bookingData.guestsCount) || 1, 1), 2);
          const passIdentifier = bookingData.passId || bookingData.purchaseId;

          // If user picked iDEAL on the payment page, override payment_mode
          const saltPaymentMode = paymentMethod === "ideal" ? "ideal" : (currentPaymentMode || "card");

          const saltPayload: any = {
            name: cardName.trim() || bookingData.name || "Guest",
            email: bookingData.email || "guest@example.com",
            ...(bookingData.phone ? { phone: bookingData.phone } : {}),
            date: bookingData.date || new Date().toISOString().split("T")[0],
            start_time: formattedStartTime,
            capacity: formattedCapacity,
            payment_mode: saltPaymentMode,
            ...(bookingData.requests ? { special_request: bookingData.requests } : {}),
            ...(passIdentifier ? { purchase_id: passIdentifier } : {}),
          };

          const res = await bookingService.createSaltRoomBooking(saltPayload);
          if (res && res.booking_id) {
            updateStoredBookingData({
              bookingId: res.booking_id,
              ...(res.purchase_id ? { purchaseId: res.purchase_id } : {}),
            });
          }
          if (res && res.client_secret) {
            clientSecret = res.client_secret;
          }
        } else {
          const payload = {
            sauna_type: bookingData.isSharedSauna ? "shared" : "private",
            booking_date: bookingData.date || new Date().toISOString().split("T")[0],
            booking_time: bookingTime,
            time_slot: timeSlotEnum,
            capacity: bookingData.guestsCount || 2,
            name: cardName.trim() || bookingData.name || "Guest",
            email: bookingData.email || "guest@example.com",
            phone: bookingData.phone || "+31612345678",
            special_request: bookingData.requests || null,
            selected_features: bookingData.selectedExtras?.map((e: any) => e.id) || [],
            total_price: numericPrice,
          };

          const res = await bookingService.createSaunaBooking(payload);
          if (res && res.booking_id) {
            updateStoredBookingData({ bookingId: res.booking_id });
          }
          if (res && res.client_secret) {
            clientSecret = res.client_secret;
          }
        }

        if (!clientSecret && currentPaymentMode === "card") {
          throw new Error("Unable to initialize payment session with server. Please try again.");
        }
      } catch (apiErr: any) {
        console.error("Booking API error:", apiErr);
        throw new Error(apiErr?.message || "Failed to create booking on server. Please check your reservation details and try again.");
      }

      // Confirm with Stripe Elements
      if (stripe && clientSecret && clientSecret.startsWith("pi_") && !clientSecret.includes("sample")) {
        if (paymentMethod === "ideal") {
          // ── iDEAL: redirect-based flow ──
          const returnUrl =
            typeof window !== "undefined"
              ? `${window.location.origin}/booking/confirmation`
              : "/booking/confirmation";

          console.log("[iDEAL] Step 1: Creating payment method for bank:", selectedBank);
          const pmResult = await stripe.createPaymentMethod({
            type: "ideal",
            ideal: {
              bank: selectedBank,
            },
            billing_details: {
              name: cardName.trim() || bookingData.name || "Guest",
              email: bookingData.email || "guest@example.com",
            },
          });

          if (pmResult.error) {
            console.error("[iDEAL] Failed to create payment method:", pmResult.error);
            throw new Error(pmResult.error.message || "Failed to initialize iDEAL bank payment.");
          }

          console.log("[iDEAL] Step 2: Confirming payment with PM ID:", pmResult.paymentMethod.id);
          const confirmRes = await stripe.confirmPayment({
            clientSecret,
            confirmParams: {
              payment_method: pmResult.paymentMethod.id,
              return_url: returnUrl,
            },
          });

          if (confirmRes.error) {
            console.error("[iDEAL] confirmPayment error:", confirmRes.error);
            throw new Error(confirmRes.error.message || "iDEAL payment confirmation failed.");
          }

          // Stripe automatically performs the redirect to the bank test authorization page.
          return;
        } else {
          // ── Card: standard Elements flow ──
          const cardNumberElement = elements?.getElement(CardNumberElement);
          if (!cardNumberElement) {
            throw new Error("Payment card form is not initialized. Please refresh the page.");
          }

          const confirmRes = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: cardNumberElement,
              billing_details: {
                name: cardName.trim() || bookingData.name || "Guest",
                email: bookingData.email || "guest@example.com",
                phone: bookingData.phone || "+31612345678",
                ...(zip.trim() ? { address: { postal_code: zip.trim() } } : {}),
              },
            },
          });

          if (confirmRes.error) {
            throw new Error(confirmRes.error.message || "Card confirmation failed. Please check your card.");
          } else if (confirmRes.paymentIntent && confirmRes.paymentIntent.status === "succeeded") {
            // Confirm payment with backend database
            const stored = getStoredBookingData();
            const latestBookingId = stored.bookingId || "";
            const latestPurchaseId = stored.purchaseId || undefined;
            try {
              await bookingService.confirmPayment({
                payment_intent_id: confirmRes.paymentIntent.id,
                ...(latestBookingId ? { booking_id: latestBookingId } : {}),
                ...(latestPurchaseId ? { purchase_id: latestPurchaseId } : {}),
              });
            } catch (backendConfirmErr) {
              console.warn("Backend payment confirm notice:", backendConfirmErr);
            }
          }
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      setProcessing(false);
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/booking/confirmation");
      }
    } catch (err: any) {
      setProcessing(false);
      setErrorMsg(err?.message || "Payment processing failed. Please check your card details and try again.");
    }
  };

  return (
    <div className="min-w-0 bg-white rounded-2xl sm:rounded-[28px] space-y-6 sm:space-y-8">
      {/* Header Banner & Security */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#E8E2DC]/80">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FCF2E9] border border-[#E8E2DC] flex items-center justify-center text-[#8B7355]">
            <BiLockAlt size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B7355] block">
              {pt.secureCheckout.badge}
            </span>
            <h3 className="text-xl font-bold font-displayPlayFair text-[#0F172A]">
              {pt.secureCheckout.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#F8FAFC] px-4 py-2 rounded-xl border border-[#E2E8F0] text-xs font-semibold text-[#64748B]">
          <BiShieldQuarter className="text-[#8B7355]" size={18} />
          <span>{pt.secureCheckout.pciBadge}</span>
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
        {isZeroPayment ? (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#FCF2E9] to-[#FBF6F3] border border-[#E8E2DC] space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                ✓
              </div>
              <div>
                <h4 className="font-bold text-[#0F172A] text-base font-displayPlayFair">
                  {pt.passIncluded.title}
                </h4>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {pt.passIncluded.desc}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Payment Method Selector Tabs */}
            <div>
              <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">
                {pt.methodSelector.label}
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    paymentMethod === "card"
                      ? "border-[#8B7355] bg-[#FCF2E9]/40 shadow-sm"
                      : "border-[#E8E2DC] bg-white hover:border-[#8B7355]/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        paymentMethod === "card" ? "bg-[#8B7355] text-white" : "bg-[#F1F5F9] text-[#64748B]"
                      }`}
                    >
                      <BiCreditCard size={22} />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-[#0F172A] block">{pt.methodSelector.cardTitle}</span>
                      <span className="text-[11px] text-[#64748B]">{pt.methodSelector.cardDesc}</span>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "card" ? "border-[#8B7355] bg-[#8B7355] text-white" : "border-[#CBD5E1]"
                    }`}
                  >
                    {paymentMethod === "card" && <BiCheckIcon size={14} />}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("ideal")}
                  className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    paymentMethod === "ideal"
                      ? "border-[#8B7355] bg-[#FCF2E9]/40 shadow-sm"
                      : "border-[#E8E2DC] bg-white hover:border-[#8B7355]/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        paymentMethod === "ideal" ? "bg-[#8B7355] text-white" : "bg-[#F1F5F9] text-[#64748B]"
                      }`}
                    >
                      <MdOutlinePayments size={22} />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-[#0F172A] block">{pt.methodSelector.idealTitle}</span>
                      <span className="text-[11px] text-[#64748B]">{pt.methodSelector.idealDesc}</span>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "ideal" ? "border-[#8B7355] bg-[#8B7355] text-white" : "border-[#CBD5E1]"
                    }`}
                  >
                    {paymentMethod === "ideal" && <BiCheckIcon size={14} />}
                  </div>
                </button>
              </div>
            </div>

            {paymentMethod === "card" ? (
              <div className="space-y-4 p-4 sm:p-6 rounded-2xl bg-[#FBF6F3] border border-[#E8E2DC]">
                {/* Cardholder Name */}
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">
                    {pt.cardFields.nameOnCard}
                  </label>
                  <input
                    type="text"
                    placeholder={pt.cardFields.namePlaceholder}
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full p-3.5 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                  />
                </div>

                {/* Stripe Elements: {pt.cardFields.cardNumber} */}
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">
                    Card Number
                  </label>
                  <div className="p-3.5 bg-white border border-[#E2E8F0] rounded-xl focus-within:ring-2 focus-within:ring-[#8B7355]">
                    <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
                  </div>
                </div>

                {/* Stripe Elements: Expiry, CVC & Zip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wide">
                      {pt.cardFields.expires}
                    </label>
                    <div className="p-3.5 bg-white border border-[#E2E8F0] rounded-xl focus-within:ring-2 focus-within:ring-[#8B7355]">
                      <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wide">
                      {pt.cardFields.cvc}
                    </label>
                    <div className="p-3.5 bg-white border border-[#E2E8F0] rounded-xl focus-within:ring-2 focus-within:ring-[#8B7355]">
                      <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wide">
                      {pt.cardFields.zip}
                    </label>
                    <input
                      type="text"
                      placeholder={pt.cardFields.zipPlaceholder}
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full p-3.5 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* iDEAL — Bank Selector */
              <div className="p-4 sm:p-6 rounded-2xl bg-[#FBF6F3] border border-[#E8E2DC] space-y-4">
                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wide">
                  {pt.idealFields.selectBank}
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full p-4 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] font-medium focus:outline-none focus:ring-2 focus:ring-[#8B7355] cursor-pointer"
                >
                  {idealBanks.map((bank) => (
                    <option key={bank.id} value={bank.id}>
                      {bank.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-[#64748B] italic">
                  {pt.idealFields.redirectNotice}
                </p>
              </div>
            )}
          </>
        )}

        {/* Cancellation, Rescheduling & Refund Policy */}
        <CancellationPolicyCard
          accepted={policyAccepted}
          onAcceptedChange={setPolicyAccepted}
          serviceName={serviceName}
        />

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
            {errorMsg}
          </div>
        )}

        {/* Amount & Pay Button */}
        <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-[#64748B] uppercase font-bold block">
              {isZeroPayment ? pt.totalDueToday : pt.totalAmountDue}
            </span>
            <span className="text-3xl font-bold font-displayPlayFair text-[#8B7355]">
              {isZeroPayment ? "€0.00" : formattedAmount}
            </span>
          </div>

          <button
            type="submit"
            disabled={processing || !policyAccepted}
            className={`w-full md:w-auto px-10 py-4 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
              !policyAccepted
                ? "bg-[#CBD5E1] text-[#64748B] cursor-not-allowed shadow-none"
                : processing
                ? "bg-[#8B7355] opacity-75 cursor-wait text-white"
                : "bg-[#8B7355] hover:bg-[#786247] text-white"
            }`}
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                <span>{pt.buttons.confirmingBooking}</span>
              </>
            ) : isZeroPayment ? (
              <>
                <BiCheckIcon size={20} />
                <span>{pt.buttons.confirmBookingCredit}</span>
              </>
            ) : (
              <>
                <BiLockAlt size={18} />
                <span>{pt.buttons.confirmAndPay.replace("{amount}", formattedAmount)}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function StripePaymentForm(props: StripePaymentFormProps) {
  const stripePromise = getStripe();

  return (
    <Elements stripe={stripePromise}>
      <InnerPaymentForm {...props} />
    </Elements>
  );
}
