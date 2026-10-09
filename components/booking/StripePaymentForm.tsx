"use client";

import { getStripe } from "@/lib/stripe";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { BiCheckCircle as BiCheckIcon, BiCreditCard, BiLockAlt, BiShieldQuarter } from "react-icons/bi";
import { FaCreditCard, FaLock } from "react-icons/fa";
import { MdOutlinePayments } from "react-icons/md";

interface StripePaymentFormProps {
  totalAmount?: number | string;
  serviceName?: string;
  onSuccess?: () => void;
}

const idealBanks = [
  { id: "ing", name: "ING Bank" },
  { id: "rabobank", name: "Rabobank" },
  { id: "abn_amro", name: "ABN AMRO" },
  { id: "sns", name: "SNS Bank" },
  { id: "asn", name: "ASN Bank" },
  { id: "regiobank", name: "RegioBank" },
  { id: "triodos", name: "Triodos Bank" },
  { id: "bunq", name: "bunq" },
  { id: "revolut", name: "Revolut" },
];

export default function StripePaymentForm({
  totalAmount = 250,
  serviceName = "Sauna Experience",
  onSuccess,
}: StripePaymentFormProps) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"card" | "ideal">("card");
  const [selectedBank, setSelectedBank] = useState<string>("ing");

  // Card Form State
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [zip, setZip] = useState("");

  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const formattedAmount =
    typeof totalAmount === "number"
      ? `€${totalAmount.toFixed(2)}`
      : String(totalAmount).startsWith("€") || String(totalAmount).startsWith("$")
      ? totalAmount
      : `€${totalAmount}`;

  // Format Card Number input with spaces
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(formatted);
  };

  // Format Expiry MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      setExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setExpiry(raw);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (paymentMethod === "card") {
      if (!cardName.trim()) {
        setErrorMsg("Please enter the name on your card.");
        return;
      }
      if (cardNumber.replace(/\s/g, "").length < 15) {
        setErrorMsg("Please enter a valid card number.");
        return;
      }
      if (expiry.length < 5) {
        setErrorMsg("Please enter a valid expiry date (MM/YY).");
        return;
      }
      if (cvc.length < 3) {
        setErrorMsg("Please enter a valid 3 or 4-digit CVC code.");
        return;
      }
    }

    setProcessing(true);

    try {
      // Initialize Stripe instance
      const stripe = await getStripe();
      
      // Simulate Stripe payment processing latency cleanly
      await new Promise((resolve) => setTimeout(resolve, 1500));

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
    <div className="bg-white rounded-[28px] p-8 md:p-10 border border-[#E8E2DC] shadow-sm space-y-8">
      {/* Header Banner & Security */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#E8E2DC]/80">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FCF2E9] border border-[#E8E2DC] flex items-center justify-center text-[#8B7355]">
            <FaLock size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B7355] block">
              Stripe Payment Gateway
            </span>
            <h3 className="text-xl font-bold font-displayPlayFair text-[#0F172A]">
              Secure Payment Checkout
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#F8FAFC] px-4 py-2 rounded-xl border border-[#E2E8F0] text-xs font-semibold text-[#64748B]">
          <BiShieldQuarter className="text-[#8B7355]" size={18} />
          <span>256-Bit SSL Encrypted</span>
        </div>
      </div>

      {/* Payment Method Selector Tabs */}
      <div>
        <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">
          Select Payment Method
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setPaymentMethod("card")}
            className={`p-5 rounded-2xl border transition-all text-left flex items-center justify-between ${
              paymentMethod === "card"
                ? "bg-[#FCF2E9] border-[#8B7355] shadow-sm ring-2 ring-[#8B7355]/20"
                : "bg-white border-[#E2E8F0] hover:border-[#D1B191]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  paymentMethod === "card" ? "bg-[#8B7355] text-white" : "bg-[#F1F5F9] text-[#64748B]"
                }`}
              >
                <FaCreditCard size={18} />
              </div>
              <div>
                <span className="font-bold text-sm text-[#0F172A] block">Credit / Debit Card</span>
                <span className="text-[11px] text-[#64748B]">Visa, Mastercard, Amex</span>
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
            className={`p-5 rounded-2xl border transition-all text-left flex items-center justify-between ${
              paymentMethod === "ideal"
                ? "bg-[#FCF2E9] border-[#8B7355] shadow-sm ring-2 ring-[#8B7355]/20"
                : "bg-white border-[#E2E8F0] hover:border-[#D1B191]"
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
                <span className="font-bold text-sm text-[#0F172A] block">iDEAL Online Banking</span>
                <span className="text-[11px] text-[#64748B]">Dutch Banks (ING, Rabo, ABN)</span>
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

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {paymentMethod === "card" ? (
          <div className="space-y-4 p-6 rounded-2xl bg-[#FBF6F3] border border-[#E8E2DC]">
            {/* Cardholder Name */}
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">
                Name on Card
              </label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full p-3.5 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
              />
            </div>

            {/* Card Number */}
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5 uppercase tracking-wide">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="4111 1111 1111 1111"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                  className="w-full p-3.5 pl-11 bg-white border border-[#E2E8F0] rounded-xl text-sm font-mono text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                />
                <BiCreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={20} />
              </div>
            </div>

            {/* Expiry, CVC & Zip */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wide">
                  Expires (MM/YY)
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={handleExpiryChange}
                  maxLength={5}
                  className="w-full p-3.5 bg-white border border-[#E2E8F0] rounded-xl text-sm font-mono text-center text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wide">
                  CVC / CVV
                </label>
                <input
                  type="password"
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  maxLength={4}
                  className="w-full p-3.5 bg-white border border-[#E2E8F0] rounded-xl text-sm font-mono text-center text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#0F172A] mb-1 uppercase tracking-wide">
                  Zip / Postal Code
                </label>
                <input
                  type="text"
                  placeholder="1011 AB"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="w-full p-3.5 bg-white border border-[#E2E8F0] rounded-xl text-sm text-center text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                />
              </div>
            </div>
          </div>
        ) : (
          /* iDEAL Bank Selector */
          <div className="p-6 rounded-2xl bg-[#FBF6F3] border border-[#E8E2DC] space-y-4">
            <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wide">
              Select your Dutch Bank
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
              You will be redirected securely to your bank app to authorize the iDEAL transaction.
            </p>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
            {errorMsg}
          </div>
        )}

        {/* Amount & Pay Button */}
        <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-[#64748B] uppercase font-bold block">Total Amount Due</span>
            <span className="text-3xl font-bold font-displayPlayFair text-[#8B7355]">
              {formattedAmount}
            </span>
          </div>

          <button
            type="submit"
            disabled={processing}
            className={`w-full md:w-auto px-10 py-4 rounded-xl bg-[#8B7355] hover:bg-[#786247] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
              processing ? "opacity-75 cursor-wait" : ""
            }`}
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <BiLockAlt size={18} />
                <span>Confirm & Pay {formattedAmount}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
